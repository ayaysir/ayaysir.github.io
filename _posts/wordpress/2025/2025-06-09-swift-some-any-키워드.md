---
title: "Swift: some, any 키워드"
date: 2025-06-09
categories: 
  - "DevLog"
  - "Swift"
---

## **Swift의 some과 any 키워드**

안녕하세요! 오늘은 Swift의 `some`과 `any` 키워드에 대해 실무에서 겪을 수 있는 상황들을 포함해 자세히 알아보겠습니다. 이 두 키워드는 프로토콜을 다룰 때 매우 중요한 역할을 하며, 각각 다른 상황에서 사용됩니다.

 

### **키워드 도입 역사**

먼저 각 키워드가 언제 도입되었는지 살펴보겠습니다:

- **`some` 키워드**: Swift 5.1에서 도입
- **`any` 키워드**: Swift 5.6에서 도입

 

### **기본 예제 코드**

먼저 예제 코드를 통해 상황을 설정해보겠습니다:

```swift
protocol 운영체제 {
    var 버전: String { get set }
}

struct MacOS: 운영체제 {
    var 버전: String = "macOS Sequoia"
}

struct Windows: 운영체제 {
    var 버전: String = "Windows 11"
}
```

 

### **some 키워드: "특정하지만 감춰진 타입"**

`some` 키워드는 불투명한(opaque) 매개변수와 반환 타입을 정의할 수 있게 해줍니다. 이는 **Opaque Types(불투명 타입)**을 나타냅니다.

 

#### **some의 특징**

1. **단일 구체적 타입**: 함수가 어떤 프로토콜을 준수하는 항상 같은 구체적(추상적이지 않은) 타입을 반환해야 합니다
2. **타입 은닉**: 호출자는 구체적인 타입을 알 수 없고, 프로토콜 인터페이스만 사용할 수 있습니다
3. **컴파일 타임 최적화**: 컴파일러가 실제 타입을 알고 있어 최적화가 가능합니다

 

#### **올바른 some 사용 예제**

```swift
func Apple의_OS추천(게이머인가: Bool) -> some 운영체제 {
    if 게이머인가 {
        return MacOS(버전: "게임잘되는버전") // 항상 MacOS 타입 반환
    } else {
        return MacOS(버전: "아무거나")
    }
}

let 추천OS = Apple의_OS추천(게이머인가: true)
print(추천OS.버전) // "게임잘되는버전"
```

```swift
func Microsoft의_OS추천(게이머인가: Bool) -> some 운영체제 {
  if 게이머인가 {
    return Windows(버전: "98, 2000, Xp")
  } else {
    return Windows(버전: "11")
  }
}
```

- 애플의 직원은 무조건 `MacOS`을 추천할 것이고, 마이크로소프트 직원은 무조건 `WindowsOS`를 추천할 것입니다.
- 둘 다 운영체제라는 타입을 준수(conform)한다는 공통점이 있으며, 그것을 준수하는 타입 중 구체적인 타입 하나를 반환하는 것이 `some`의 사용법입니다.

 

#### **잘못된 some 사용 예제**

```swift
// ❌ 컴파일 에러 발생!
func 컴퓨터가게_직원의_OS추천(게이머인가: Bool) -> some 운영체제 {
    if 게이머인가 {
        return Windows() // ❌ Windows 타입
    } else {
        return MacOS()   // ❌ MacOS 타입 - 서로 다른 타입 반환
    }
}
// 에러: Function declares an opaque return type, but the return statements 
// in its body do not have matching underlying types
```

- return 타입은 `Windows` 또는 `MacOS` 둘 중 하나로 강제되어야 합니다.
- 컴퓨터가게 직원은 상황에 따라 다른 OS를 추천하려고 했지만, some 키워드에서는 허용되지 않습니다.
- 컴퓨터가게 직원처럼 분기를 통해 운영체제 타입을 준수하는 서로 다른 구체적 타입을 복수로 반환하려고 시도한다면 에러가 발생하게 됩니다.

 

#### **배열에서 some 타입 사용**

```swift
func makeMultiBootingComputer(oss: [some 운영체제]) {
  print(oss)
}
```

```swift
makeMultiBootingComputer(oss: [MacOS(버전: "1"), MacOS(버전: "2")]) // OK
// makeMultiBootingComputer(oss: [MacOS(버전: "1"), MacOS(버전: "2"), Windows(버전: "3")]) // Cannot convert value of type 'Windows' to expected element type 'MacOS'
```

배열 내 원소들의 타입은 모두 동일한 구체적 타입이어야 합니다. 프로토콜을 따르지만 하나라도 다른 구체적 타입의 원소가 있다면 에러가 발생합니다.

 

### **any 키워드: "어떤 타입이든 가능"**

`any` 키워드는 프로토콜을 따르는 existential(박스 타입)을 사용한다는 것을 컴파일러에게 알려주는 역할을 합니다.

 

#### **any의 특징**

1. **타입 유연성**: 런타임에 다양한 구체적 타입을 담을 수 있습니다
2. **런타임 오버헤드**: any를 사용하면 타입 이레이저(type erasure)가 내부적으로 도입됩니다
3. **동적 타입**: 실행 중에 실제 타입이 결정됩니다

 

#### **any 사용 예제**

```swift
func 운영체제_버전출력(_ os: any 운영체제) {
    print("Version: (os.버전)")
}

// 다양한 타입을 모두 받을 수 있습니다
운영체제_버전출력(MacOS())     // MacOS 전달
운영체제_버전출력(Windows())   // Windows 전달

// 배열에서도 사용 가능
let 운영체제들: [any 운영체제] = [MacOS(), Windows(), MacOS(버전: "Monterey")]
```

함수의 반환 타입을 `any OOO` 로 지정할수도 있습니다.

```swift
func 아무OS반환() -> any 운영체제 {
  let os: [any 운영체제] = [
    MacOS(버전: "1"),
    MacOS(버전: "2"),
    Windows(버전: "2000")
  ]
  return os.randomElement()!
}
아무OS반환() // 예) MacOS 버전 2 또는 Windows 버전 2000이 나올 수도 있음.
```

 

### **실제 사용에서 마주치는 의문점**

#### **"any 없이도 컴파일이 되던데요?"**

Swift 6.0에서 실제로 테스트해보면 다음 코드가 정상적으로 컴파일됩니다:

```swift
// Swift 6.0에서 정상 컴파일됨 ✅
func 운영체제_버전출력(_ os: 운영체제) { // any 운영체제를 사용하지 않아도 정상 컴파일됨
    print("Version: (os.버전)")
}
```

이는 Swift의 실제 구현이 이론적인 정책과 다소 차이가 있기 때문입니다. 당초 6 버전에서 existential any ([SE-0335](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0335-existential-any.md)) 가 강제될 예정이었으나, 여러 실무적 이유로 인해 선택사항으로 변경되었습니다.

> 언어 운영 그룹(Language Steering Group)은 이전에 승인되었던 예정된 기능 중 하나인 **ExistentialAny**를 Swift 6에서 기본적으로 활성화하지 않기로 결정했습니다.
> 
> **[SE-0335](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0335-existential-any.md): Existential any 도입** 제안은 any 키워드를 도입하여 존재적 타입(existential types)을 명시적으로 표현할 수 있도록 했습니다.
> 
> 이 제안서에서는 또한, 앞으로는 “맨 프로토콜 이름(bare protocol names)“을 타입으로 사용하는 것이 허용되지 않으며, 반드시 상황에 맞게 any 또는 some 키워드를 사용해야 한다고 명시되어 있습니다.
> 
> 그러나 언어에서 existential any를 일관되게 사용하는 것으로의 마이그레이션에 대한 우려와, 이러한 마이그레이션의 최종 결과에 영향을 줄 수 있는 추가적인 언어 개선이 있을 것으로 예상됨에 따라,
> 
> **언어 운영 그룹은 SE-0335의 소스 코드 비호환적인 변경 사항을 향후 언어 개정으로 연기하기로 결정했습니다.**
> 
> [출처](https://forums.swift.org/t/progress-toward-the-swift-6-language-mode/68315)

 

#### **권장사항**

하지만 여전히 명시적으로 `any`를 사용하는 것이 권장됩니다:

```swift
// 권장: 의도가 명확함
func 운영체제_버전출력(_ os: any 운영체제) {
    print("Version: (os.버전)")
}
```

#### **some vs any 비교**

| 특징 | some | any |
| --- | --- | --- |
| **타입 정체성** | 고정된 단일 타입 | 다양한 타입 가능 |
| **성능** | 빠름 (컴파일 타임 최적화) | 상대적으로 느림 (런타임 오버헤드) |
| **유연성** | 낮음 | 높음 |
| **사용 시점** | 반환 타입에 주로 사용 | 매개변수, 저장 프로퍼티에 주로 사용 |

 

### **실제 사용 가이드라인**

#### **some을 사용해야 할 때**

- API의 구현 세부사항을 숨기고 싶을 때
- 성능이 중요한 상황에서
- SwiftUI의 `View` 반환 타입처럼 복잡한 제네릭 타입을 단순화하고 싶을 때
    - View 프로토콜을 준수하는 뷰라면 뭐든지 가능하지만, 리턴 타입은 구체적 타입 하나로 특정해야 함.

```swift
// SwiftUI에서 흔히 보는 패턴
func makeView() -> some View {
    VStack {
        Text("Hello")
        Button("Tap me") { }
    }
}
```

 

#### **any를 사용해야 할 때**

- 런타임에 다양한 타입을 다뤄야 할 때
- 컬렉션에 서로 다른 구체적 타입을 저장해야 할 때
- 함수 매개변수에서 여러 타입을 받아야 할 때

```swift
// 다양한 타입을 저장하는 배열
let 혼합배열: [any 운영체제] = [
    MacOS(버전: "Ventura"),
    Windows(버전: "Windows 10"),
    MacOS(버전: "Big Sur")
]
```

 

### **성능 고려사항**

정적 타입을 사용하는 것(some 키워드 사용 시에도 해당)이 가능할 때마다 선호되는 방식입니다. `any`를 사용할 때는 타입 이레이저로 인한 런타임 오버헤드가 있다는 점을 고려해야 합니다.

 

### **마무리**

Swift의 `some`과 `any` 키워드는 각각 다른 목적을 가지고 있습니다. `some`은 타입 안정성과 성능을 중시하며, `any`는 유연성을 제공합니다.

실제 개발 환경에서는 컴파일러가 허용하는 것과 권장사항이 다를 수 있지만, 코드의 의도를 명확히 하고 팀 내 일관성을 유지하기 위해 명시적인 키워드 사용을 권장합니다.

상황에 맞게 적절한 키워드를 선택하여 사용하시면 더욱 안전하고 효율적인 Swift 코드를 작성할 수 있습니다. 여러분의 Swift 개발에 도움이 되길 바랍니다!

 

### **참고 자료**

- [Swift Senpai - Understanding the "some" and "any" keywords](https://swiftsenpai.com/swift/understanding-some-and-any/)
- [Donny Wals - What's the difference between any and some in Swift?](https://www.donnywals.com/whats-the-difference-between-any-and-some-in-swift-5-7/)
- [Swift by Sundell - Using generic protocols with some and any](https://www.swiftbysundell.com/articles/referencing-generic-protocols-with-some-and-any-keywords/)
- [Antoine van der Lee - Some keyword in Swift: Opaque types explained](https://www.avanderlee.com/swift/some-opaque-types/)

 

<!--[rcblock id="6686"]-->
