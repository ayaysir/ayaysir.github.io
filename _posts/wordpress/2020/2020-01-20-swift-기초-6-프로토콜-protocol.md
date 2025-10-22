---
title: "Swift 기초 (6): 프로토콜 (Protocol)"
date: 2020-01-20
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

\[rcblock id="3441"\]

#### **프로토콜**

프로토콜은 메소드, 속성 그리고 다른 특정 작업 또는 기능의 부분에 맞는 요구 사항의 청사진을 정의합니다. 자바의 `Interface`와 유사한 개념이며, 클래스, 열거형(`Enumeration`), 구조체(`Structure`) 모두에 프로토콜을 사용할 수 있습니다.

 

다음은 프로토콜의 기본 형태입니다.

```swift
protocol ExampleProtocol {
    var simpleDescription: String { get }
    var author: String { get set }
    
    mutating func adjust()
}
```

`simpleDescription`, `author`는 프로퍼티입니다. `get`은 읽기 전용 프로퍼티인 경우, `get set`은 읽기, 쓰기 모두 가능한 프로퍼티를 설정할 때 사용합니다. 이 속성은 다형성을 통해 객체 인스턴스를 생성했을 경우에만 적용됩니다. ([관련 문서 영문](https://stackoverflow.com/questions/54144063/swift-protocols-difference-between-get-and-get-set-with-concrete-exampl))

`mutating` 키워드의 함수는 프로토콜에서는 껍데기만 정의하고, 이 프로토콜을 구현하는 클래스 등에서 나머지 내용을 작성합니다.

 

이 프로토콜을 바탕으로 클래스를 구현하면 아래와 같습니다.

```swift
class SimpleClass: ExampleProtocol {
    var simpleDescription: String = "A very simple class."
    var author: String = "Kaneko"
    var anotherProperty: Int = 1192
    
    // adjust 함수의 구현, 별도의 키워드 필요없음
    func adjust(){
        simpleDescription += " Now 100% adjusted."
    }
}
```

```swift
var sc: ExampleProtocol = SimpleClass() // 다형성(Polymorphism)
sc.adjust()
print(sc.simpleDescription, sc.author)

// sc.simpleDescription = "탈취가능?"  // Cannot assign to property: 'simpleDescription' is a get-only property
sc.author = "박둘리"
print(sc.author)
```

> A very simple class. Now 100% adjusted. Kaneko 박둘리

 

아래는 구조체로 구현한 모습입니다. 구조체는 아직 다루지 않았지만, 데이터 여러개를 용도에 맞게 묶어 표현할 때 알맞은 자료형이라고 합니다.

```swift
struct SimpleStructure: ExampleProtocol {
    var simpleDescription: String = "A simple structure"
    var author: String = "Kaneko"
    mutating func adjust() {
        simpleDescription += " (adjusted)"
    }
}
```

```swift
var ss: ExampleProtocol = SimpleStructure()
ss.adjust()
print(ss.simpleDescription)
```

> A simple structure (adjusted)

 

익스텐션(`Extension`)에도 프로토콜을 사용할 수 있습니다. 익스텐션은 `Int`, `Double` 등 기존의 자료형에 붙어 추가적 기능을 제공하는 것입니다. 현재 아무것도 없는 상태에서 아래 코드를 실행하려 하면 당연히 에러가 날 것입니다.

```swift
print(7.simpleDescription) 
// 에러: 'Int' has no member 'simpleDescription'
```

`7`은 `Int`형의 값이며, 여기에 `simpleDescription`이라는 기능이 없으므로 에러가 납니다. 하지만 여기에 `extension`을 추가하면 기능을 가질 수 있습니다.

```swift
extension Int: ExampleProtocol {
    var simpleDescription: String {
        return "숫자는 \(self)입니다."
    }
    var author: String{
        get{
            return "숫자맨"
        }
        set{
            
        }
    }
    mutating func adjust() {
        self *= 10
    }
}
```

```swift
print(7.simpleDescription)
var num = 7
num.adjust()
print(num)
```

> 숫자는 7입니다. 70

 

**퀴즈.** `extension`을 사용해 `Double` 타입에서 절대값을 구하는 `absoluteValue`를 추가하시오.

```swift
protocol NumberProtocol {
    var absoluteValue: Double { get }
}

extension Double: NumberProtocol{
    var absoluteValue: Double{
        self < 0 ? self * (-1) : self
    }
}
```

```swift
print((-13.56).absoluteValue)
print((-225.111).absoluteValue)
```

> 13.56 225.111

 

\[rcblock id="3441"\]
