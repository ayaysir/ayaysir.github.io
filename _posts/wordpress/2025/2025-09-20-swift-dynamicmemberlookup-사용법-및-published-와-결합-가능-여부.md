---
title: "Swift: @dynamicMemberLookup 사용법 및 @Published 와 결합 가능 여부"
date: 2025-09-20
categories: 
  - "DevLog"
  - "Swift"
---

### **개요 — `@dynamicMemberLookup`이란**

`@dynamicMemberLookup`은 \*\*컴파일러에게 “점(`.`) 접근을 보낼 때 `subscript(dynamicMember:)`로 재해석해라”\*\*고 지시하는 어노테이션입니다. 즉 `obj.foo`를 호출하면 컴파일러는 `obj[dynamicMember: "foo"]` 형태의 서브스크립트 호출로 바꿔줍니다. 주로 내부에 `[String: Any]` 같은 딕셔너리를 두고 JSON/동적 프로퍼티처럼 보이게 할 때 유용합니다.

 

#### **간단한 동작 원리**

- 선언: `@dynamicMemberLookup`을 타입 앞에 붙입니다.
- 필수: `subscript(dynamicMember:)` 구현(여러 오버로드 허용).
- 장점: 문법이 깔끔하고 JS 스타일 접근 가능.
- 단점: 컴파일타임 타입 안정성·자동완성 손실(또는 약화).

 

### **`@dynamicMemberLookup` 기본 예제**

아래는 가장 단순한 형태입니다.

```swift
@dynamicMemberLookup
struct DynamicDict {
  private var storage: [String: Any] = [:]

  subscript(dynamicMember member: String) -> Any? {
    get { storage[member] }
    set { storage[member] = newValue }
  }
}

var d = DynamicDict()
// title이라는 변수가 없음에도 점(.)을 찍어 있던 변수인 것처럼 작성할 수 있음
d.title = "Hello"            // storage["title"] = "Hello"
print(d.title as? String)    // "Hello"
```

 

타입 안전성을 조금 더 주고 싶으면 제네릭(generic) 서브스크립트를 씁니다:

```swift
@dynamicMemberLookup
struct DynamicTyped {
  private var storage: [String: Any] = [:]

  subscript<T>(dynamicMember member: String) -> T? {
    get { storage[member] as? T }
    set { storage[member] = newValue }
  }
}

var dt = DynamicTyped()
dt.count = 10                // T 는 Int로 추론됨
let c: Int? = dt.count
```

 

### **`@Published`와 결합(가능/불가능 & 구현 방식)**

직접적으로 `@Published`를 **동적 멤버에 붙일 수는 없습니다**. 이유는 `@Published`는 **_정적 저장 프로퍼티_**에 적용되는 property wrapper이기 때문입니다. 즉 컴파일 시점에 해당 프로퍼티가 존재해야 합니다.

하지만 다음과 같은 패턴으로 **유사한 동작(변경 알림)을 구현**할 수 있습니다.

 

#### **방법 A — 내부에 `@Published var storage: [String: Any]` 두기 (권장)**

- `storage`를 `@Published`로 두고, dynamic subscript는 `storage`를 읽고 씁니다.
- `storage`가 바뀌면 Combine이 발행하므로 `ObservableObject` 구독자(SwiftUI 등)는 갱신됩니다.

예:

```swift
@dynamicMemberLookup
final class DynamicObservable: ObservableObject {
  @Published private var storage: [String: Any] = [:]

  subscript<T>(dynamicMember member: String) -> T? {
    get { storage[member] as? T }
    set {
      storage[member] = newValue
      // 일반적으로 @Published가 storage 변경을 발행하므로 추가 호출 불필요.
      // 필요시 objectWillChange.send()를 직접 호출할 수도 있음.
    }
  }

  // 특정 키의 Combine 퍼블리셔가 필요하면 노출
  func publisher<T>(for key: String) -> AnyPublisher<T?, Never> {
    $storage
      .map { $0[key] as? T }
      .eraseToAnyPublisher()
  }
}
```

사용예:

```swift
let dyn = DynamicObservable()
dyn.title = "Hi"                    // storage["title"] = "Hi"
let title: String? = dyn.title
// SwiftUI View는 dyn의 objectWillChange를 구독하므로 바뀌면 뷰 갱신됨
```

> 주의: `storage`에 대한 “부분 수정”(예: `storage["a"] = x`)도 `@Published`에서 발행되는 게 일반적으로 작동하지만, 안전하게 만들고 싶으면 `objectWillChange.send()`를 직접 호출해 명시적으로 알릴 수 있습니다.

 

#### **방법 B — `objectWillChange.send()`를 수동으로 호출**

`@Published` 대신 `ObservableObject`의 `objectWillChange`를 직접 제어할 수도 있습니다. (더 유연하지만 수동 호출 책임이 증가)

```swift
@dynamicMemberLookup
final class DynamicManualObservable: ObservableObject {
  private var storage: [String: Any] = [:]

  subscript(dynamicMember member: String) -> Any? {
    get { storage[member] }
    set {
      objectWillChange.send()
      storage[member] = newValue
    }
  }
}
```

 

### **WKWebView 속성(예: canGoBack 등)을 한꺼번에 다루려는 경우 권장 패턴**

`@dynamicMemberLookup`만으로 KVO/Subscribers를 자동 생성해주는 건 불가능합니다. 왜냐하면 `publisher(for:)`는 **각 KeyPath마다** 퍼블리셔를 만들어 주기 때문입니다. 하지만 반복 코드를 줄이는 구조는 만들 수 있습니다:

- `bind(_:to:)` 헬퍼로 `KeyPath` → `storage[name]` 매핑을 한 번에 등록
- 내부는 `webView.publisher(for: keyPath).sink { storage[name] = $0 }`

 

#### **예시(컨덕터에 적용):**

```swift
@dynamicMemberLookup
final class WKWebViewConductor: ObservableObject {
  @Published var webView: WKWebView
  @Published private var storage: [String: Any] = [:]
  private var cancellables = Set<AnyCancellable>() // Combine 퍼블리셔 구독(subscription)을 보관하는 저장소

  init(webView: WKWebView = WKWebView()) {
    self.webView = webView

    // 반복을 줄이는 bind 헬퍼 사용
    bind(.canGoBack, to: "canGoBack")
    bind(.canGoForward, to: "canGoForward")
    bind(.estimatedProgress, to: "estimatedProgress")
  }

  private func bind<T>(_ keyPath: KeyPath<WKWebView, T>, to name: String) {
    webView.publisher(for: keyPath)
      .receive(on: DispatchQueue.main)
      .sink { [weak self] value in
        self?.storage[name] = value
      }
      .store(in: &cancellables)
  }

  subscript<T>(dynamicMember member: String) -> T? {
    storage[member] as? T
  }

  func publisher<T>(for member: String) -> AnyPublisher<T?, Never> {
    $storage
      .map { $0[member] as? T }
      .eraseToAnyPublisher()
  }
}
```

 

##### **이 패턴의 장점**

- `conductor.canGoBack` 형태로 접근 가능(옵셔널 반환).
- `publisher(for:)`로 각 키에 대한 Combine 스트림도 얻어 쓸 수 있음.
- 바인딩 등록은 `bind` 호출만으로 줄일 수 있음.

 

##### **단점 / 유의사항**

- 타입 안전성은 약해짐(`Any` 캐스팅 필요).
- 자동완성 및 문서화 이점이 줄어듦(동적 키는 컴파일타임 검사가 안 됨).
- **여전히** 어떤 속성을 구독할지는 코드에서 명시해야 함(완전 자동화 불가).
- KVO 대상의 타입별로 `bind` 호출은 필요(서로 다른 타입을 하나의 컬렉션으로 일괄 처리하려면 제너릭/추상화 조금 더 필요).

 

### **결론**

- `@dynamicMemberLookup`은 **동적 접근 문법**을 제공하지만, `@Published`를 동적 멤버에 직접 붙일 수는 없습니다.
- 실무에서는 `@Published private var storage: [String: Any]` + `subscript(dynamicMember:)` 패턴이 가장 현실적이고 실용적입니다.
- WKWebView 같은 경우 **구독할 속성 목록(예: canGoBack, estimatedProgress 등)을 한 곳에 나열하고** `bind` 헬퍼로 등록하면 반복을 많이 줄일 수 있습니다.
- 하지만 타입 안전성과 코드 가독성을 중시한다면, 핵심 프로퍼티만 명시적 `@Published var canGoBack: Bool = false` 처럼 선언하는 쪽이 유지보수에 유리합니다.

 

##### **참고: 핵심 프로퍼티만 명시적으로 선언하는 방법**

```swift
// Combine으로 Publish 되는 변수들
@Published var estimatedProgress: Double = 0.0 
@Published var canGoBack = false
@Published var canGoForward = false

// ... //

private func bind<T>(_ keyPath: KeyPath<WKWebView, T>,
                     to publishedKeyPath: ReferenceWritableKeyPath<WKWebViewReprConductor, T>) {
  webView.publisher(for: keyPath)
    .receive(on: DispatchQueue.main)
    .assign(to: publishedKeyPath, on: self)
    .store(in: &cancellables)
}

init(webView: WKWebView = WKWebView()) {
  self.webView = webView
  bind(\.canGoBack, to: \.canGoBack)
  bind(\.canGoForward, to: \.canGoForward)
  bind(\.estimatedProgress, to: \.estimatedProgress)
}
```

<!--[rcblock id="6686"]-->
