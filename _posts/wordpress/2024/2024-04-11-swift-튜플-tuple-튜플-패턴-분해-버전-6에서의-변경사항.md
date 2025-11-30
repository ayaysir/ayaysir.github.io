---
title: "Swift: 튜플 (Tuple), 튜플 패턴 분해, 버전 6에서의 변경사항"
date: 2024-04-11
categories: 
  - "DevLog"
  - "Swift"
---



튜플(Tuple)은 데이터의 집합으로 Swift에 존재하는 두 가지 복합 타입 (compound type) 중 하나입니다.

> 복합 타입에는 함수 타입(Function type)과 튜플 타입(Tuple type)의 두 가지가 있습니다.
> 
> 출처: [Swift 공식 문서 Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/types/)

 

## **특징**

튜플의 특징은 다음과 같습니다.

### **여러 값을 동시에 표현 및 저장할 수 있다. (데이터의 집합)**

예를 들어 `x`, `y` 좌표를 나타내는 타입을 만들고 싶다고 합니다. `Coordinate`라는 이름의 `struct`를 만들 수도 있지만(이에 대한 내용은 생략합니다), 그보다 더 간단하게 튜플을 사용해서 `x`, `y` 좌표를 나타낼 수 있습니다.

아래는 좌표 x, y를 튜플 타입인 `(x: Int, y: Int)`로 나타낸 예제입니다.

```swift
var coordinate = (x: 10, y: 12)   // coordinate는  (\x: Int, y: Int) 타입의 변수입니다.
coordinate = (x: 4, y: 42)        // OK: 이름이 매치됩니다.
coordinate = (9, 99)              // OK: 이름을 적지 않으면 자동으로 유추(inferred)됩니다.
coordinate = (left: 5, right: 5)  // 오류: 이름이 매치되지 않습니다.

coordinate = (x: 100, y: 200)
coordinate.x // 100
coordinate.y // 200

var anotherCoordinate = (300, 400)
anotherCoordinate.0 // 300
anotherCoordinate.1 // 400

var circle = (radius: 10, coord: (x: 30, y: 50))
var.radius // 10
var.coord = (x: 30, y: 50)
var.coord.x // 30
```

 

위 코드를 통해 튜플의 속성을 알아보면

- 튜플에는 요소의 특성을 나타내는 이름이 붙을 수 있습니다.
    - 고유의 이름을 통해 `x`, `y`의 값을 별도로 관리할 수 있습니다. 마치 구조체, 클래스 등에서 사용하던 것처럼 이름을 붙여 사용하면 됩니다..
    - 이름을 붙여도 나중에 사용할 때 자동 유추(inferred)되어 생략할 수 있습니다. 이 점이 다른 타입 (구조체, 클래스, 함수 등)과 구분되는 특징입니다.
    - 단, 이름이 있는 튜플은 이름을 붙여 사용할거라면 반드시 정확하게 일치하는 이름을 사용해야 합니다.
- 처음부터 이름이 없는 튜플을 만드는 것도 가능합니다.
    - `var coordinate = (10, 12)`로 만들어 사용할 수도 있습니다.
    - 이 때의 타입은 `(Int, Int)` 이 됩니다.
    - 이름이 없는 튜플에서 요소를 사용하는 방법은 숫자 `0, 1, 2 ...` 등을 붙입니다.
- 튜플에는 Swift에서 사용할 수 있는 거의 대부분의 타입을 추가할 수 있습니다.
- 또한 튜플 안에 튜플을 겹중으로 삽입할 수 있습니다.

 

## **장단점**

구조체를 만드는 것보다 튜플을 통해 만들었을 때의 장단점에 대해 알아보겠습니다.

예를 들어 `동물`이라는 구조체를 만든다고 하면

```swift
struct 동물 {
  var 이름: String
  var 종: String
  var 무게: Int
}

var 니네집강아지 = 동물(이름: "뽀삐", 종: "요크셔테리어", 무게: 30)
print("니네집강아지 이름은 \(니네집강아지.이름)이며, 종은 \(니네집강아지.종) 입니다. 무게는 \(니네집강아지.무게)kg에요.")
```

 

이것을 튜플을 통해 다음과 같이 간편하게 구현할 수 있습니다.

```swift
var 니네집강아지 = (이름: "뽀삐", 종: "요크셔테리어", 무게: 30)
// 또는
var 니네집강아지 = ("뽀삐", "요크셔테리어", 30)

print("니네집강아지 이름은 \(니네집강아지.이름)이며, 종은 \(니네집강아지.종) 입니다. 무게는 \(니네집강아지.무게)kg에요.")
// 또는
print("니네집강아지 이름은 \(니네집강아지.0)이며, 종은 \(니네집강아지.1) 입니다. 무게는 \(니네집강아지.2)kg에요.")
```

- **장점**
    - 보다 간단한 문법과 과정을 통해 자료들을 관리할 수 있습니다.
    - 사용 시 이름 유추 기능을 통해 요소의 고유 이름들을 생략하여 사용할 수 있어 간편합니다.
- **단점**
    - 타입의 일관성이 저해되며 체계적인 관리가 어렵습니다.
        - 이 점은 `typealias`로 어느 정도 해결할 수 있습니다.
    - 다른 섹션에서 자세히 설명하겠지만, 튜플은 구조체, 클래스 등과 달리 어떠한 프로토콜도 준수(`conform`)할 수 없습니다.
        - 따라서 어떤 프로토콜에 대한 준수가 요구되는 사용처에서 튜플을 사용할 수 없습니다. (이 부분은 Swift 6에서 새로운 기능이 예정되어 있습니다.)

 

## **튜플 패턴을 이용한 분해**

튜플 패턴을 이용한 분해(destruction) 이란 튜플을 개별 변수로 분리할 수 있는 기능입니다.

위의 예제에서 `니네집강아지` 라는 튜플 안의 값을 묶어서 사용하기 보다 개별 변수로 분리해서 사용하고 싶다고 할 때

```swift
let name = 니네집강아지.이름
let species = 니네집강아지.종
let weight = 니네집강아지.무게
```

이렇게 할 수도 있지만, 이것을 튜플 패턴을 이용하면 라인 수를 줄이면서도 더 간편하게 개별 변수로 나눌 수 있습니다.

```swift
let (name, species, weight) = 니네집강아지
// 이 코드는 바로 위의 예제와 동일하게 작동합니다.

print(name) // 뽀삐
print(weight * 2) // 60

```

변수 `니네집강아지`는 `(이름: "뽀삐", 종: "요크셔테리어", 무게: 30)` 의 데이터를 가지고 있는데, 이것을 이름을 생략하고 변수 선언 부분에서 괄호로 묶으면 `("뽀삐", "요크셔테리어", 30)` 이 괄호 안에 선언된 순서대로 `(name, species, weight)` 자동으로 배정 되는것입니다.

앞의 예제 `circle`처럼 튜플 안에 튜플이 있는 타입도 다음과 같이 분해할 수 있습니다.

```swift
var circle = (radius: 10, coord: (x: 30, y: 50))
let (radius, (x, y)) = circle

print(x) // 30
print(y) // 50
```

 

튜플 패턴을 응용하면 일반적인 변수 선언도 간편하게 할 수 있습니다. 예를 들어, 자료를 인터넷에서 가져오는데 타입이 협의가 안되어 `[Int]` 배열 형태로 `[x, y, width, height]` 이렇게 들어온 상황입니다.

이것을 튜플 패턴을 사용하면 여러 라인의 코드를 한 줄로 줄일 수 있습니다.

```swift
let array = [3, 6, 200, 100]
let x = array[0]
let y = array[1]
let width = array[2]
let height = array[3]

// 대신에 튜플 패턴을 사용
let (x, y, width, height) = (array[0], array[1], array[2], array[3])
```

- 튜플을 즉석에서 만든 다음, 바로 튜플 패턴을 통해 개별 변수로 배정합니다.

 

## **\[심화\] 배열의 withUnsafeBytes 기능을 이용하여 배열을 튜플로 변환**

```swift
var polePairs: [(l: Int, r: Int)] = []
polePairs.append([50, 60].withUnsafeBytes { $0.bindMemory(to: (l: Int, r: Int).self)[0] })
polePairs.first! // (l: 50, r: 60)
```

 

## **기타: 프로토콜 준수 문제**

이렇게 다양한 기능이 있음에도 불구하고 실제로 튜플은 거의 사용되지 않고 있습니다. 다양한 이유가 있지만 튜플의 치명적인 단점 중 하나는 튜플은 다른 프로토콜을 준수(conform) 할 수 있는 기능이 없다는 점입니다.

예를 들어 지도 등에서 두 지점 간 최소 거리를 찾아야 할 때 사용하는 [Dijkstra Algorithm](https://ko.wikipedia.org/wiki/%EB%8D%B0%EC%9D%B4%ED%81%AC%EC%8A%A4%ED%8A%B8%EB%9D%BC_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)은 우선순위 큐라는 자료구조가 필요로 합니다. 그런데 Swift에서 우선순위 큐는 기본적으로 제공되지 않습니다.

- [Swift: 우선 순위 큐 Priority Queue (설명 + 구현)](/posts/swift-우선-순위-큐-priority-queue-설명-구현/)

따라서 누군가가 우선순위 큐 구조체 `PriorityQueue<T: Comparable>`를 아래와 같이 만들었고 그것을 사용하고 싶다고 가정합니다.

```swift
struct PriorityQueue<T: Comparable> { ... }

// 최소 거리를 찾기 위한 기본 정보
var priorityQueue = PriorityQueue<(weight: Int, value: Int)>
// 는 사용이 불가능: 해당 튜플이 Comparable을 준수하게 할 수 있는 방법이 없기 때문에

// 어쩔 수 없이 Comparable을 준수한 구조체 Node를 만들어서 사용
struct Node: Comparable {
  static func < (lhs: Node, rhs: Node) -> Bool {
     lhs.weight < rhs.weight
  }
        
  var value: Int
  var weight: Int
}
    

```

- `PriorityQueue`는 두 값을 비교해서 더 작은(혹은 더 큰) 값에 더 우선순위가 올라가도록 자료를 재정렬하는 기능이 있습니다.
- 따라서 우선순위큐에서 사용할 제너릭 타입은 `Comparable`이 필수적으로 준수되어야 합니다.
- 하지만 튜플은 `Comparable`이 적용되지도 않고, 적용되도록 할 수 있는 기능도 없기 때문에 `<T: Comparable>` 이 아니며 될 수도 없습니다.
- 결국 새로운 구조체를 만들어서 사용해야 하기 때문에 튜플의 이점이 사라지게 됩니다.

 

이러한 사례로 많은 구조체, 클래스, 함수 등에서 요구하는 프로토콜 준수사항인 `Equatable`, `Hashable`, `Comparable` 등이 있지만 튜플은 이 중 단 하나도 지원하지 않습니다. 이러한 점 때문에 튜플은 거의 사용되지 않고 있던 것입니다.

<!-- 하지만 곧 출시될 Swift 6에서 (작성 시점 현재 Xcode에서 사용되는 버전은 Swift 5.9 입니다.) `Equatable`, `Hashable`, `Comparable` 을 지원한다는 소문이 있습니다.

> **Swift 6.0에서 튜플은 Equatable, Comparable 및 Hashable을 준수합니다.**
> 
> 튜플에는 프로토콜을 준수하는 기능이 부족했기 때문에 많은 개발자는 프로토콜을 준수할 수 있는 구조체를 선호하여 튜플 사용을 중단했습니다. 이제 튜플의 요소가 해당 프로토콜을 준수하는 경우 튜플은 `Equatable`, `Comparable` 및 `Hashable`을 준수합니다.
> 
> 출처: [Swift 6 New Features](https://blog.swiftify.com/whats-new-in-swift-6-e875ca675a28)

```
// Equatable
(1, 2, 3) == (1, 2, 3) // true
// Labels are not taken into account to check for equality.
(x: 0, y: 0) == (0, 0) // true

// Comparable
let origin = (x: 0, y: 0)
let randomPoint = (x: Int.random(in: 1 ... 10), y: Int.random(in: 1 ... 10))
(x: 0, y: 0) < (1, 0) // true
// Labels are not taken into account for comparision.
(x: 0, y: 0) < (1, 0) // true

// Hashable
let points = [(x: 0, y: 0), (x: 1, y: 2), (x: 0, y: 0)]
let uniquePoints = Set(points)
print (uniquePoints) // [(x: 0, y: 0), (x: 1, y: 2)]
// Labels are not taken into account to check for hash value.
(x: 0, y: 0).hashValue == (0, 0).hashValue // true
```

구체적인 스펙이나 정확한 내용은 아직 출시 전이므로 알 수 없지만, Swift 6이 활성화되는 시기에는 치명적인 단점이 극복되어 튜플의 사용처가 늘지 않을까 싶습니다. -->
