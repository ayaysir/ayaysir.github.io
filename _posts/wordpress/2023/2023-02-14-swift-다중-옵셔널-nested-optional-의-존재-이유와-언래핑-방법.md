---
title: "Swift: 다중 옵셔널 (Nested optional; ??)의 존재 이유와 언래핑 방법"
date: 2023-02-14
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

Swift에는 다음과 같은 특이한 형태의 자료형이 있습니다.

```
var nestedOptionalString: String?? = "이중 옵셔널은 왜 있음?"
print(nestedOptionalString)
```

 ![](/assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-14-오후-4.02.06.png)

처음에는 Xcode 오류인가 싶었는데, 이러한 자료형은 실제로 사용되는 자료형이었고 무려 iOS 공식 프레임워크(`UIKit`, `MapKit`) 등에서 여러 차례 등장합니다. 검색 시 `swift double optional` 등으로 관련 내용을 찾아볼 수 있으며 공식 명칭은 _Nested Optional_입니다.

[애플 개발자 공식 문서](https://developer.apple.com/swift/blog/?id=12)와 언래핑 방법에 대한 [stackoverflow 글](https://stackoverflow.com/questions/33049246/how-to-unwrap-double-optionals)을 통해 그 이유를 알아보겠습니다.

 

#### **다중 옵셔널 (중첩된 옵셔널; Nested Optionals)**

`Dictionary`에 대한 확장을 만들고 아래 `valuesForKey(...)` 함수를 추가합니다.

```
extension Dictionary {
  func valuesForKeys(_ keys: [Key]) -> [Value?] {
    return keys.map { self[$0] }
  }
}
```

이 함수는 `keys`에 키(타입앨리어스 `Key`)를 배열로 입력하면 해당하는 키에 대응되는 값(타입앨리어스 `Value`)을 배열로 반환합니다.

아래는 사용 예시입니다.

```
let dict = [
    "A": "Amir",
    "B": "Bertha",
    "C": "Ching",
]

```

```
print(
    dict.valuesForKeys(["A", "C"]),
    // [Optional("Amir"), Optional("Ching")]
    
    dict.valuesForKeys(["B", "D"]),
    // [Optional("Bertha"), nil]
    
    dict.valuesForKeys([])
    // []
)
```

 

이제 각 결과의 `last` 요소를 요청하면 어떻게 될까요?

```
print(
    dict.valuesForKeys(["A", "C"]).last,
    // Optional(Optional("Ching"))

    dict.valuesForKeys(["B", "D"]).last,
    // Optional(nil)

    dict.valuesForKeys([]).last
    // nil
)
```

이상합니다. 첫 번째 경우에는 2단계 레벨의 `Optional`이 있습니다. 두 번째 경우에는 일반적인 1단계의 `optional(nil)`입니다.

`last`가 어떻게 선언되었는지 정의를 보면 다음과 같습니다.

```
var last: T? { get }
```

이는 `last` 속성의 유형이 배열 요소 타입의 옵셔널 버전(`T?`)임을 나타냅니다. 이 경우는 원소의 타입이 옵셔널(`String?`)입니다. 따라서 `valuesForKey(...)`의 결과에 대한 `last`는 이중으로 중첩된 옵셔널 타입(Doubly-nested optional type)인 `String??`이 됨을 알 수 있습니다.

 

**\[심화\]** 그렇다면 `Optional(nil)`은 무엇을 의미할까요?

Objective-C에서 우리는 자리 표시자(placeholder)로 `NSNull`을 사용할 예정임을 상기하세요. 이 세 가지 호출의 Objective-C 버전은 다음과 같습니다.

```
[dict valuesForKeys:@[@"A", @"C"] notFoundMarker:[NSNull null]].lastObject
// @"Ching"

[dict valuesForKeys:@[@"B", @"D"] notFoundMarker:[NSNull null]].lastObject
// NSNull

[dict valuesForKeys:@[] notFoundMarker:[NSNull null]].lastObject
// nil
```

Swift와 Objective-C의 경우 모두 반환 값의 `nil`은 "_배열이 비어 있으므로 마지막 요소가 없음_"을 의미합니다. `Optional(nil)`(또는 Objective-C의 `NSNull`)의 반환 값은 "_이 배열의 마지막 요소가 존재하지만 그 마지막 요소는 부재(absence)를 나타냅니다._"를 의미합니다. Objective-C는 이를 수행하기 위해  placeholder object(`NSNull`)에 의존해야 하지만 Swift는 타입 시스템(type system)에서 이를 나타낼 수 있습니다.

 

#### **다중 옵셔널에 대한 언래핑(unwrapping) 방법**

```
let a: String?? = "hello"
```

위와 같은 `String??` 타입의 변수 a를 언래핑(unwrapping)하는 방법입니다.

 

##### **1\. 옵셔널 바인딩을 두 번 하기**

```
if let temp = a, let value = temp {
    print(value) // "hello"
}
```

 

##### **2\. 강제로 언래핑을 두 번 하기 (비추천)**

옵셔널 변수에 느낌표(`!`)를  붙이면 강제 언래핑이 되는데, 이것을 두 번 붙이는 방법입니다. 강제 언래핑은 변수의 값이 `nil`인 경우 컴파일 에러가 발생하므로 결과가 반드시 `nil`이 아니라고 확신할 수 있을 때에만 사용해야 됩니다.

```
print(value!!)  // don't do this - you're just asking for a crash
```

 

##### **3\. 패턴 매칭(pattern matching)을 시용하는 방법**

```
if case let value?? = a {
    print(value) // "hello"
}
```

- **\[참고\]** [Swift If Case Let](https://useyourloaf.com/blog/swift-if-case-let/)

 

위의 코드는 다음과 동일합니다.

```
if case .some(.some(let value)) = a {
    print(value) // "hello"
}
```

 

##### **4\. nil 부수기 연산자(nil coalescing operator)를 두 번 사용**

`??`은 _nil coalescing operator_라고 하는데 어떠한 옵셔널 변수가 `nil`이 아니라면 해당 변수를 옵셔널을 제거시키고, `nil`이라면 해당 연산자 뒤에 있는 기본값을 사용합니다.

이것을 두 번 사용합니다.

```
print((a ?? "") ?? "")  // "hello"
```

> 여기에 제시된 다른 방법과 달리 이 방법은 항상 값을 생성합니다. 빈 문자열(`""`)은 옵션 중 하나가 `nil`인 경우 사용됩니다.

 

##### **5\. nil 부수기 연산자를 옵셔널 바인딩에 사용**

```
if let value = a ?? nil {
    print(value)  // "hello"
}
```

> **작동 원리**
> 
> 이중으로 포장된 옵셔널을 사용하면 변수가 보유하는 값은 3가지 중 하나가 될 수 있습니다 1. `Optional(Optional("some string"))` 2. 내부 옵셔널이 `nil`이면 `Optional(nil)` 3. 외부 옵셔널이 `nil`이면 `nil`. 따라서 `?? nil`은 외부 옵셔널을 언래핑합니다.
> 
> 1\. 외부 옵셔널이 `nil`이면 `??`를 통해 기본값 `nil`로 대체됩니다. 2. `a`가 `Optional(nil)`이라면 옵셔널 바인딩을 통해 옵셔널이 풀리면서 앞부분이 `nil`이 되고, 이에 따라 `nil`이 coalescing 되면서 뒷부분의 nil로 대체됩니다. 결국 nil 이 됩니다. 3. 내부에 `String`이 있다면 앞의 옵셔널 바인딩에 의해 이중 옵셔널 상태에서 한 번 coalescing 때문에 앞부분은 1단계 옵셔널인 `Optional("some string")`를 반환합니다. 여전히 옵셔널로 래핑되어 있기 떄문에 원래는 옵셔널 바인딩이 동작하지 않아야 하지만 뒤에 `?? nil`이 있으므로 다시 한 번 coalescing되므로 옵셔널이 완전히 없어지고 스트링 값만 남게 됩니다.

 

##### **6\. flatMap을 사용하기**

```
if let value = a.flatMap({ $0 }) {
    print(value)  // "hello\n"
}
```

- \[참고\] [\[Swift\] 고차함수(2) - map, flatMap, compactMap](https://jinshine.github.io/2018/12/14/Swift/22.%EA%B3%A0%EC%B0%A8%ED%95%A8%EC%88%98\(2\)%20-%20map,%20flatMap,%20compactMap/)

 

##### **7\. 조건부 캐스팅**

조건부 캐스팅(conditional cast)을 사용하여 다중 옵셔널 값을 특정 타입으로 캐스팅을 합니다. 놀랍게도 이것은 모든 단계의 중첩 옵션을 제거합니다.

```
let a: String?? = "hello"
let b: String??????? = "bye"

if let value = a as? String {
    print(value)  // "hello"
}

print(b as Any)  
// "Optional(Optional(Optional(Optional(Optional(Optional(Optional("bye")))))))"

if let value = b as? String {
    print(value)  // "bye"
}
```

 

##### **출처**

- [Optionals Case Study: valuesForKeys](https://developer.apple.com/swift/blog/?id=12)
- [How to unwrap double optionals?](https://stackoverflow.com/questions/33049246/how-to-unwrap-double-optionals)
