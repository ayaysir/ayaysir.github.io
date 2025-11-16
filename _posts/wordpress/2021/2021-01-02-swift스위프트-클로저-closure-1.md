---
title: "Swift(스위프트): 클로저 (Closure) - 정의 및 문법"
date: 2021-01-02
categories: 
  - "DevLog"
  - "Swift"
---

### **클로저 (Closures)**

클로저(closure)는 코드에서 전달 및 사용할 수 있는 독립된 기능 블록(blocks of functionality) 입니다. 다른 프로그램의 람다(lambda)와 유사합니다.

클로저는 정의된 컨텍스트에서 모든 상수 및 변수에 대한 참고를 캡처(capture; 포획)하고 저장할 수 있습니다. 이를 상수 및 변수에 대한 에워싸기(closing over)라고 합니다.

함수(`function`)은 특별한 형태의 클로저라고 볼 수 있습니다.

클로저는 다음 세 가지 중 하나의 형태를 가집니다.

- 전역 함수(global function)는 이름이 있고 값을 캡처하지 않는 클로저입니다.
- 중첩 함수(nested function)는 이름이 있고 둘러싸는 함수에서 값을 캡처 할 수 있는 클로저입니다.
- 클로저 표현식(closure expression)은 주변 컨텍스트에서 값을 캡처 할 수 있는 경량 구문(lightweight syntax)으로 작성된 이름이 없는 클로저입니다.

 

### **클로저 표현식 (Closure Expressions)**

클로저 표현식이란 간단하고 집약된 구문으로 인라인 클로저를 작성하는 방식입니다.

여기서는 배열의 `sorted(by:)` 메소드를 이용한 예제를 보여드리도록 하겠습니다. `by:` 에는 동일한 자료형을 가진 두 인수의 클로저를 파라미터로 받습니다. 이 클로저에서 첫 번째 값이 두 번째 값의 앞에 나와야 하는 경우 `true`를 반환해야 하고, 반대의 경우 `false`를 반환해야 합니다. 만약 숫자의 배열이 있고 이것을 오름차순 정렬을 하고 싶다면 `a < b` 인 경우는 `a`가 `b` 앞에 위치해야 하는 경우이므로 `true`를 반환해야 합니다.

다음 배열을 예제로 사용합니다.

```
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
```

이것을 내림차순(backwards)로 정렬하려면 먼저 `by:`에 집어넣을`(String, String) ->` `Bool` 타입의 클로저를 작성해야 하고, `names.sorted(by:)`에 해당 클로저를 삽입합니다. 기본 함수를 이용한 형태는 다음과 같습니다.

 

```swift
func backward(_ s1: String, _ s2: String) -> Bool {
    return s1 > s2
}
var reversedNames = names.sorted(by: backward)
// reversedNames 의 결과는 ["Ewa", "Daniella", "Chris", "Barry", "Alex"] 입니다.

```

`String` 문자열의 경우 '보다 큼'의 의미는 '나중에 나타나는 알파벳'을 의미합니다. 즉, `"A"`와 `"B"`를 비교했을 때 `"B"`가 나중에 위치한 알파벳이므로 `"A" < "B"` 입니다. 여기서 `"Ewa"`(`s1`)와 `"Daniella"`(`s2`)를 비교할 때 내림차순 정렬이므로 `"Ewa"`가 `"Daniella"`의 앞에 위치해야 합니다. 그러므로 `s1 > s2`일 때 `true`를 반환하고, 이 작업이 계속되면 내림차순 정렬이 되는 것입니다.

위 코드는 단일 표현식 함수 (`a > b`)를 작성하는 보다 긴 방식입니다. 클로저 표현식을 사용해 간략화하는 방법을 알아보겠습니다.

 

#### **기본 형태**

 ![](/assets/img/wp-content/uploads/2021/01/screenshot-2021-01-02-pm-4.12.00.png)

아래 예제 `backward(_:_:)`는 위 의 함수 의 클로저 표현식 버전을 보여줍니다 .

```
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

클로저 본문의 시작은 `in` 키워드로 시작합니다. 이 키워드는 클로저의 파라미터와 리턴 타입의 정의가 완료되었으며 클로저 본문이 시작됨을 의미합니다.

 

#### **컨텍스트에서 타입 추론 (Inferring Type From Context)**

클로저가 메서드에서 인수(argument)로 전달되기 때문에 Swift는 파라미터와 리턴값의 타입을 추론할 수 있습니다. 여기서 `sorted(by:)` 메소드는 스트링 배열에서 호출되기 때문에, 인수는 반드시 `(String, String) -> Bool` 이어야 합니다. 모든 타입이 유추 가능하므로 타입을 전부 생략하여 작성할 수 있습니다.

```
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } )
```

함수나 메서드에 클로저를 인라인 클로저 표현식으로 전달할 때 항상 파라미터 타입과 리턴 타입을 유추 할 수 있습니다. 결과적으로 클로저가 함수 또는 메서드 인수로 사용될 때 완전한 형태(타입이 명시된 형태)로 인라인 클로저를 작성할 필요가 없습니다.

그럼에도 불구하고 원하는 경우 유형을 명시적으로 만들 수 있으며 코드를 읽는 사람이 모호함을 피할 수 있게 하려면 타입을 명시하는 것도 좋습니다.

 

#### **단일 표현식 클로저에서 암시적 리턴 (Implicit Returns from Single-Expression Closures)**

단일 표현식으로 리턴값을 특정할 수 있다면 `return` 키워드를 생략할 수 있습니다.

```
reversedNames = names.sorted(by: { s1, s2 in s1 > s2 } )
```

여기서 `sorted(by:)` 메서드 인수의 함수 타입은 `Bool`값이 클로저에 의해 반환되어야 함이 자명합니다. 클로저의 본문에는 `Bool`값 을 반환하는 단일 표현식(`s1 > s2`)이 포함되어 있기 때문에 모호성이 없으므로 `return` 키워드를 생략 할 수 있습니다.

 

#### **약칭 인수 이름 (Shorthand Argument Names)**

Swift는 자동으로 인라인 클로저에 약칭 인수 이름을 제공하며, 이는 인수의 순서에 따라 `$0`, `$1`, `$2`등의 이름으로 클로저의 인수 값을 참조하는 데 사용할 수 있습니다.

클로저 표현식에서 약칭 인수 이름을 사용하는 경우, 인수 목록을 생략할 수 있으며 약칭 인수 이름이 타입을 추론하게 됩니다. `in` 키워드 또한 생략 가능하며, 따라서 클로저 바디 부분은 오로지 클로저 표현식만으로 구성됩니다.

```
reversedNames = names.sorted(by: { $0 > $1 } )
```

`$0`, `$1`은 클로저의 첫번째, 두번째 `String` 인수를 나타냅니다.

 

#### **연산자 메소드 (Operator Methods)**

제일 간단하게 하는 방법은 클로저 자리에 '보다 큼'의 연산자(>)를 집어넣는 것입니다. `String` 타입은 `>` 연산자를 두 스트링을 비교한 뒤, `Bool` 값을 리턴하도록 정의하고 있습니다. 이것은 위의 식들과 동일한 결과를 가집니다. 따라서 `>` 연산자를 사용하는 것만으로 Swift는 사용자의 의도를 알아챕니다.

```
reversedNames = names.sorted(by: >)
```

 

### **트레일링 클로저 (Trailing Closures; 후행 클로저)**

만약 함수의 마지막 인수가 클로저 표현식을 넘기는 경우라면, _트레일링 클로저_를 사용하는 것이 보다 유용할 수 있습니다. 트레일링 클로저는 함수 호출 괄호`()` 뒤에 중괄호 `{...}`를 사용하여 클로저를 작성하며, 인수 레이블(argument label)도 작성할 필요가 없습니다. 경우에 따라 함수는 여러 개의 트레일링 클로저를 가질 수도 있습니다.

```swift
func someFunctionThatTakesAClosure(closure: () -> Void) {
    // 함수 본문은 여기에 작성
}

// 트레일링 클로저를 사용하지 않은 경우의 함수 호출:

someFunctionThatTakesAClosure(closure: {
    // 클로저 본문은 여기에 작성
})

// 트레일링 클로저를 사용한 경우의 함수 호출:

someFunctionThatTakesAClosure() {
    // 트레일링 클로저 본문은 여기에 작성
}
```

 

위의 `reversedNames` 예제의 함수 호출을 트레일링 클로저를 이용해 작성하면 다음과 같습니다.

```
reversedNames = names.sorted() { $0 > $1 }
```

 

만약 클로저 표현식이 함수나 메소드의 한 개의 유일한 인수로 제공된다면, () 괄호조차 작성하지 않을 수 있습니다.

```
reversedNames = names.sorted { $0 > $1 }
```

 

트레일링 클로저는 클로저가 너무 길어서 한 줄에 인라인으로 쓸 수 없을 때 가장 유용합니다.

다음 `map(_:)`은 트레일링 클로저와 함께 메서드를 사용하여 `Int`값 배열을 `String`값 배열로 변환하는 방법입니다. `[16, 58, 510]` 배열은 새 배열 `["OneSix", "FiveEight", "FiveOneZero"]` 을 만드는 데 사용됩니다. `numbers` 배열을 사용하여 클로저 표현식을 배열의 `map(_:)` 메서드에 트레일링 클로저로 전달하여 `String`값 배열을 만들 수 있습니다.

```
let digitNames = [
    0: "Zero", 1: "One", 2: "Two",   3: "Three", 4: "Four",
    5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine"
]
let numbers = [16, 58, 510]

```

```
let strings = numbers.map { (number) -> String in
    var number = number
    var output = ""
    repeat {
        output = digitNames[number % 10]! + output
        number /= 10
    } while number > 0
    return output
}
// strings 변수는 [String] 타입의 배열로 추론됨
// 배열의 값은 ["OneSix", "FiveEight", "FiveOneZero"]
```

이 `map(_:)` 메서드는 배열의 각 항목에 대해 한 번씩 클로저 표현식을 호출합니다. 매핑 할 배열의 `number` 값에서 유형을 유추할 수 있으므로 클로저의 입력 매개 변수 유형을 지정할 필요가 없습니다.

이 예제에서 변수(`var`) `number`는 클로저의 파라미터 값 `number`로 초기화되어 클로저 본문 내에서 값을 수정할 수 있습니다. (함수 및 클로저에 대한 매개 변수는 항상 상수입니다.) 클로저 표현식은 매핑 된 출력 배열에 리턴되는 타입을 나타내기 위해 리턴 타입으로 `String`을 지정합니다.

 

함수에 여러 클로저를 사용하는 경우. 첫 번째 트레일링 클로저의 인수 이름을 생략하고, 나머지 트레일링 클로저에는 레이블을 지정합니다. 예를 들어, 아래 함수는 사진 갤러리에 대한 그림을 로딩합니다.

```swift
func loadPicture(from server: Server, completion: (Picture) -> Void, onFailure: () -> Void) {
    if let picture = download("photo.jpg", from: server) {
        completion(picture)
    } else {
        onFailure()
    }
}
```

이 함수는 `completion:`, `onFailure:` 두 개의 클로저를 요구합니다. 이 함수를 호출하는 방법은 다음과 같습니다.

```
loadPicture(from: someServer) { picture in
    someView.currentPicture = picture
} onFailure: {
    print("Couldn't download the next picture.")
}
```

이러한 방식으로 함수를 작성하면 두 상황을 모두 처리하는 하나의 클로저를 사용하는 대신에 다운로드 성공 후 사용자 인터페이스를 업데이트하는 코드와 네트워크 오류를 처리하는 코드를 명확하게 분리할 수 ​​있습니다.

 

출처: [Swift 5.3 공식문서 Clousures](https://docs.swift.org/swift-book/LanguageGuide/Closures.html)
