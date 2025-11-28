---
title: "Swift 기초 (5): Enum (열거형; Enumeration)"
date: 2020-01-20
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

<!-- \[rcblock id="3441"\] -->

## **Enum (열거형; Enumeration)**

**`Enum`** 은 고유 타입으로 상수를 이용할 수 있게 하는 특수한 기능입니다. 아래는 `Enum`의 선언입니다.

```swift
enum Rank: Int {
    case ace = 1
    case two, three, four, five, six, seven, eight, nine, ten
    case jack, queen, king
    
    func simpleDescription() -> String {
        switch self {
        case .ace: return "에이스"
        case .jack: return "잭"
        case .queen: return "퀸"
        case .king: return "킹"
        default: return String(self.rawValue)
        }
    }
}
```

2~4라인의 `case`는 해당 `Enum` 타입이 가질 수 있는 경우를 나열한 것입니다. `case`를 하나씩 수직으로 나열할 수도 있고, 콤마로 구분할 수도 있습니다. `func simpleDescription()` 는 함수를 선언하는 것인데, 여기서 `self`는 `Rank.ace` 등으로 사용할 때 `.ace` 부분이 `self` 입니다. 해당 부분은 아래 코드에 자세하게 나와 있습니다.

`self.rawValue`는 예약된 이름의 변수로 위에서 `Enum`의 자료형을 `Int`로 지정했으므로 `Enum`의 `case`이 선언된 순서를 반환합니다. `ace`의 `rawValue`는 맨 처음애 선언되었으므로 `1`이며, `eight`의 `rawValue`는 8번째로 선언되었으므로 `8`입니다. 참고로 자료형을 지정하지 않은 경우 `rawValue`는 존재하지 않습니다.

 

```swift
let ace = Rank.ace // Enum의 사용법
let aceRawValue = ace.rawValue
print(ace, ace.simpleDescription(), aceRawValue)
print(Rank.eight.rawValue)
```

> ace 에이스 1 8

 

### 퀴즈 1. 

두 개의 `Rank` 값의 원본값을 비교하는 함수를 만들어보시오.

```swift
func compareOfTwoRanks(_ num1: Rank, _ num2: Rank){
    if(num1.rawValue == num2.rawValue){
        print("두 수는 같습니다.")
    } else if (num1.rawValue > num2.rawValue){
        print("\(num1.simpleDescription())이(가) 더 큽니다")
    } else {
        print("\(num2.simpleDescription())이(가) 더 큽니다")
    }
}

compareOfTwoRanks(Rank.four, Rank.ace)
compareOfTwoRanks(Rank.jack, Rank.queen)
compareOfTwoRanks(Rank.king, Rank.seven)
```

> 4이(가) 더 큽니다 퀸이(가) 더 큽니다 킹이(가) 더 큽니다

 

반대로 `rawValue`를 통해 `Enum`의 값에 접근하는 방법은 다음과 같습니다.

```swift
Rank(rawValue: 1)
```

> Optional(\_\_lldb\_expr\_136.Rank.ace)

 

참고로 위의 방법을 통해 얻어낸 값은 옵셔널 값입니다. 옵셔널 값을 다루려면 언래핑(unwrapping)을 해야합니다. 아래는 언래핑 과정입니다.

```swift
if let ace = Rank(rawValue:1) {
    let aceSimpleDesc = eight.simpleDescription()
    print(eightSimpleDesc)
}
```

> 에이스

 

느낌표(`!`)를 사용하면 보다 간편한 언래핑 식을 작성할 수 있습니다.

```swift
let jack: Rank! = Rank(rawValue:11)
print(jack.simpleDescription())
```

> 잭

 

## **Enum의 예제**

### **Enum 예제 1: Suit**

```swift
enum Suit {
    case spades, hearts, diamonds, clubs
    
    func simpleDescription() -> String {
        switch self {
        case .spades: return "♠"
        case .hearts: return "♥"
        case .diamonds: return "♦"
        case .clubs: return "♣"
        }
    }
    
    func color() -> String {
        switch self {
        case .spades, .clubs: return "black"
        case .hearts, .diamonds: return "red"
        }
    }
}
```

```swift
let hearts = Suit.hearts
let heartsDesc = hearts.simpleDescription()
let heartsColor = hearts.color()
print(heartsDesc, heartsColor)
```

> ♥ red

 

### **Enum 예제 2: ServerResponse**

```swift
enum ServerResponse {
    case result(String, String)
    case failure(String)
}
```

```swift
let success = ServerResponse.result("6:00 am", "8:00 pm")
let failure = ServerResponse.failure("Out of cheese.")

var pseudoServerResponse = Int.random(in:0...1) == 1 ? success : failure

switch pseudoServerResponse {
case let .result(sunrise, sunset):
     print("Sunrise is at \(sunrise) and sunset is at \(sunset).")
case let .failure(message):
    print("Failure...  \(message)")
}
```

> Sunrise is at 6:00 am and sunset is at 8:00 pm. Failure... Out of cheese.

 

<!-- \[rcblock id="3441"\] -->
