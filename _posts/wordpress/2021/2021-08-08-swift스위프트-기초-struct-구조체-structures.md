---
title: "Swift(스위프트) 기초: struct (구조체; structures)"
date: 2021-08-08
categories: 
  - "DevLog"
  - "Swift"
---

## 소개

기본적으로 클래스와 유사하게 객체를 만들어 캡슐화하는 기능을 가지고 있습니다. 문법 및 사용법도 매우 유사합니다.

- [Swift 기초 (4): 클래스, 옵셔널과 nil](/posts/swift-기초-4-클래스-옵셔널과-nil/)

```swift
struct Person {
    var name: String
    var job: String
    var age: Int

let person1 = Person(name: "aa", job: "neet", age: 12)
print(person1)
```

## 클래스와 구조체의 주요 공통점

주요 공통점은 다음과 같습니다.

- 값을 저장하기 위한 프로퍼티 정의할 수 있습니다.
- 메소드를 정의하고 사용할 수 있습니다.
- `subscript` 문법을 사용할 수 있습니다.
- 초기 상태 지정을 위한 이니셜라이저 정의 및 사용이 가능합니다.
- `extension` 키워드를 사용할 수 있어 확장성이 용이합니다.
- `protocol`을 이용한 표준 기능 정의가 가능합니다.

## 클래스와 구조체의 주요 차이점

클래스와 대비되는 구조체의 주요 차이점은 다음과 같습니다.

- 이니셜라이징(생성 초기화)을 하지 않아도 자동으로 모든 변수에 대한 이니셜라이징이 됩니다.
   - 위의 코드에서 구조체는 `init` 부분을 작성하지 않아도 아래에서 모든 변수를 이니셜라이징 할 수 있습니다. 클래스는 생성자를 지정하지 않으면 불가능합니다.
- 클래스의 인스턴스는 참조에 의한 호출(call-by-reference)이며, 구조체의 인스턴스는 값에 의한 호출(call-by-value) 입니다.
    - 구조체는 항상 값을 복사하기 때문에 멀티스레드 환경에 보다 적합하며 충돌을 일으킬 가능성이 적습니다..
- 구조체는 프로토콜(`protocol`)의 구현을 제외한 어떠한 클래스나 구조체로부터 상속을 하거나 받는 행위를 할 수 없습니다.
    - 따라서 클래스에 사용되는 타입간의 객체지향 기법 (타입캐스팅, 다형성 등)은 사용이 불가능합니다.
- 구조체는 `stack` 영역에 매모리를 할당하며(더 빠름), 클래스는 `heap` 영역에 메모리를 할당합니다.
- 구조체는 `Codable`(JSON 등 변환에 사용)을 사용할 수 있으나 클래스는 불가능합니다. 한편 클래스는 시리얼화(`NSData` serialize)이 가능하나 구조체는 불가능합니다.
    - 인터넷을 통한 자료교환을 하는 경우엔 구조체가 더 적합합니다.

### 구조체에 새로운 변수 할당 예제

구조체는 새로운 변수에 할당할 때 구조체 자체를 복사하여 값(value)으로 할당합니다. 아래 예제를 보면 person1이 person2로 할당된 순간 두 변수는 모두 다른 인스턴스로 존재합니다.

```swift
var person2 = person1
person2.name = "bb"
person1.name // aa
person2.name // bb

```

### 클래스에 새로운 변수 할당 예제 

반면 클래스는 주소를 할당하기 때문에 두 변수가 같은 인스턴스를 참조하게 됩니다.

```swift
class Computer {
    var cpu: String
    
    init(cpu: String) {
        self.cpu = cpu
    }
}

let computer1 = Computer(cpu: "Intel")
let computer2 = computer1
computer1.cpu = "AMD"
computer1.cpu // AMD
computer2.cpu // AMD
```

### 구조체의 구현과 상속

구조체는 프로토콜(`protocol`)만 구현할 수 있고, 다른 클래스나 구조체로부터 상속을 하거나 받는 행위를 일절 할 수 없습니다.

```swift
struct Student: Person {
    // 불가능
}
// error: Inheritance from non-protocol type 'Person'
```

```swift
protocol Mouse {
    func leftClick() -> Any
    func rightClick() -> Any
}

// 프로토콜은 가능
struct Daiso5000Mouse: Mouse {
    func leftClick() -> Any {
        return "left"
    }
    
    func rightClick() -> Any {
        return "right"
    }
}

let mouse1 = Daiso5000Mouse()
mouse1.leftClick() // left
```

## 무엇을 사용해야 하는가?

애플 공식문서에서는, 가능한 경우 구조체를 최우선으로 사용하도록 권고하고, 다음 사례의 경우에는 클래스를 사용하는 것이 낫다고 하고 있습니다. ([문서](https://developer.apple.com/documentation/swift/choosing_between_structures_and_classes))

- Objective-C와의 상호호환성(interoperability)이 필요한 경우
- 데이터 모델링에서 데이터의 ID(identity)를 제어할 필요가 있는 경우
