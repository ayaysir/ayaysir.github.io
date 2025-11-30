---
published: false
title: "Swift: 둘러보기(상수, 배열, 사전, if, while, switch, 함수, 객체)"
date: 2019-01-10
categories: 
  - "none"
tags: 
  - "swift"
---

**상수**: 상수는 변수와 다르게 한 번 만들고 나면 변경하는 것이 불가능합니다.

```swift
import Foundation 
 
let apples = 3
let oranges = 5
let appleSummary = "I have \(apples) apples."
let fruitSummary = "I have \(apples + oranges) pieces of fruit."
print(appleSummary)
print(fruitSummary)
 
/*실습 \() 를 이용해 문자열 안에 실수형 계산을 포함하도록 해보고, 
 인사말 안에 누군가의 이름을 넣어보자.
*/
 
let real1 = 3.5
let real2 = 1.0
let realText = "실수: \(real1 + real2)입니다."
print(realText)
 
let name = "Kim"
let greeting = "My name is \(name)."
print(greeting)

```

```
I have 3 apples.
I have 8 pieces of fruit.
실수: 4.5입니다.
My name is Kim.
```

* * *

**배열** **및** **Dictionary**: Dictionary는 자바스크립트의 객체, 자바의 맵과 비슷한 개념입니다.

```swift
import Foundation 
 
var shoppingList = ["catfish", "water", "tulips", "blue paint"]
shoppingList[1] = "bottle of water"
print(shoppingList)
// ["catfish", "bottle of water", "tulips", "blue paint"]
 
// Dictionary
var occupations = [
    "Malcolm" : "Captain",
    "Kaylee" : "Mechanic",  // 마지막 ,는 안넣어도 된다.
]
 
occupations["Jayne"] = "Public Relations"
print(occupations)
// ["Jayne": "Public Relations", "Kaylee": "Mechanic", "Malcolm": "Captain"]
 
// 빈 배열이나 딕셔너리 만들기: Initializer
var emptyArray = [String]()
var emptyDictionary = Dictionary<String, Float>()
print(emptyArray)   // []
print(emptyDictionary)  // [:]
 
// 변수에 새로운 값을 할당하거나 함수에 argument로 전달할 때
// 타입정보를 추론할 수 없다면 빈 배열은 [], 빈 딕셔너리는 [:]로 표기
shoppingList = []
print(shoppingList) // []
 
occupations = [:]
print(occupations)  // [:]
```

* * *

**for ~ in, while, if ~ else, nil**: 조건문에 괄호를 붙이지 않습니다, **옵셔널 변수(Optional variables)**: 기본값은 `nil` 입니다. `nil`은 옵셔널 값에서 `null`과 비슷한 개념인데 일반(non-optional) 변수에서는 `nil`을 사용할 수 없습니다. ([http://monibu1548.github.io/2018/05/12/swift-optional/](http://monibu1548.github.io/2018/05/12/swift-optional/) 참고)

```swift
import Foundation 
 
let individualScores = [75, 43, 103, 87, 12]
var teamScore = 0
for score in individualScores {
    if score > 50 {
        teamScore += 3
    } else {
        teamScore -= 1
    }
 
}
print (teamScore)   // 7
 
// 값의 타입 뒤에 물음표를 쓰면 옵션 값이라는 것을 나타낸다.
var optionalString: String? = "Hello"
print(optionalString == nil)    // false
 
var optionalName: String? = "John Appleseed"
var greeting = "Hello!"
if let name = optionalName {    // optionalName에 값이 있다면 name 상수에 집어넣어라
    greeting = "Hello, \(name)"
}
print (greeting)    // Hello, John Appleseed
 
/*
    실습 optionalName의 값을 nil로 바꿔보자. 
    어떤 greeting의 값을 받을 수 있는가?
    optionalName에 할당된 값이 nil일 때 다른 값을 greeting에 할당하도록 else 절을 추가해보자. 
*/
 
greeting = "Hell"
optionalName = nil
 
if let name = optionalName {   
    greeting = "Hello, \(name)"
}
print (greeting)    // Hell
 
if let name = optionalName {  
    greeting = "Hello, \(name)"
} else {
    greeting = "Hello, Anonymous"
}
print (greeting)    // Hello, Anonymous
```

```swift
let interestingNumbers = [
  "Prime": [2, 3, 5, 7, 11, 13],
  "Fibonacci": [1, 1, 2, 3, 5, 8],
  "Square": [1, 4, 9, 16, 25],  
]
 
var largest = 0
// kind: Prime, Fibonacci, Square
// numbers: 딕셔너리의 값에 들어있는 배열
for (kind, numbers) in interestingNumbers {
  for number in numbers {
    if number > largest {
        largest = number
    }
  }
}
print(largest)  // 25
 
/*
   실습 어떤 숫자가 가장 큰 수로 저장되는지 확인하기 위해 다른 변수를 추가하고, 
   가장 큰 수로 저장된 숫자가 무엇인지 확인해보라. 

   interestingNumbers에 "Custom": [99, 199]를 추가하면 199가 출력됨
*/

```

```swift
var n = 2
while n < 100 {
    n = n * 2
}
print(n)    // 128
 
var m = 2
repeat {    // do ~ while
    m *= 2
} while m < 100
print(m)    // 128
 
var total = 0
for i in 0..<4 { // 0부터 3까지
    total += i;
}
print(total)    // 6 (=1+2+3)
```

* * *

**switch**: `break`에 해당하는 기능이 기본 적용되어 있어 `break` 를 명시하지 않아도 됩니다.

```swift
let vegetable = "red pepper"
var vegetableComment = ""
switch vegetable {
case "celery":
     vegetableComment = "Add some raisins and make ants on a log."
case "cucumber", "watercress":
    vegetableComment = "That would make a good tea sandwich."
case let x where x.hasSuffix("pepper"):   // vegetable을 상수 x로 옮기는데 조건은 문장의 끝이 pepper인가?
    vegetableComment = "Is it a spicy \(x)?"
default:
    vegetableComment = "Everything tastes good in soup."
}
print(vegetableComment)   // Is it a spicy red pepper?
 
/*
    실습 switch문에서 default 부분을 제거해 보자. 어떤 에러가 발생하는가?
    error: switch must be exhaustive
    note: do you want to add a default clause?
*/

```

* * *

**함수(function)**

```swift
func greet(name: String, day: String) -> String {
        return "Hello \(name), today is \(day)."
}
print( greet(name:"Bob", day:"Tuesday") )
// Hello Bob, today is Tuesday.
 
/*
 실습 매개변수 day를 제거하고 
 인사말에 '오늘의 특별한 점심'을 포함하도록 매개변수를 추가해보자.
*/
 
func greet(_ person: String, special lunch: String) -> String {
    return "Hello \(person), today is \(lunch)."
}
 
// _를 붙이면 변수 이름을 적을 필요가 없고, 
// 다른 이름을 붙이면 별칭으로 사용할 수 있다.
 
print( greet("Bob", special:"Mac and Cheese") )
// Hello Bob, today is Mac and Cheese.
 
// 튜플
func getGasPrices() -> (Double, Double, Double) {
    return (3.59, 3.69, 3.79)
}
print( getGasPrices() ) // (3.59, 3.69, 3.79)
 
// 함수의 중첩 사용
func returnFifteen() -> Int {
    var y = 10
    func add() {
        y += 5
    }
    add()
    return y
}
print( returnFifteen() )    // 15
 
// 일급 함수: 어떤 함수가 다른 함수를 반환 값 형태로 반환할 수 있다.
func makeIncrementer() -> ((Int) -> Int) {
    func addOne(number: Int) -> Int {
        return 1 + number
    }
    return addOne
}
var increment = makeIncrementer()
print ( increment(7) )  // 8
 
// 함수는 다른 함수를 인자로 받을 수 있다.
func hasAnyMatches(list: [Int], condition: (Int) -> Bool) -> Bool {
    for item in list {
        if condition(item) {
            return true
        }
    }
    return false
}
func lessThanTen(number: Int) -> Bool {
    return number < 10
}
var numbers = [20, 19, 7, 12]
print( hasAnyMatches(list: numbers, condition: lessThanTen) )   // true
 
// 클로저
// in: 인자(argument)와 반환값 타입(return type)을 분리해 사용
print(
 
    numbers.map({ (number: Int) -> Int in
        let result = 3 * number
        return result
    })
 
)   // [60, 57, 21, 36]
 
/*
 실습 모든 홀수값에 대해 0을 반환하도록 클로저를 수정해보자.
*/
 
var numbers2 = [19, 18, 37, 26]
print(  
 
    numbers2.map({ (number: Int) -> Int in
        var result = number
        if number % 2 != 0 {
            result = 0
        }     
        return result
    })
 
)   
// [0, 18, 0, 26]
 
var numbers3 = [9, 38, 17, 11]
let mappedNumbers = numbers3.map( { number in 3 * number } )
print (mappedNumbers)   // [27, 114, 51, 33]
 
let sortedNumbers = numbers3.sorted{ $0 > $1 }
print(sortedNumbers)    // [38, 17, 11, 9]
```

 

* * *

**객체, 클래스**

```swift
import Foundation 
 
  // ======== 클래스 ======== 
 
  class Shape {
    var numberOfSides = 0
    func simpleDescription() -> String {
      return "A shape with \(numberOfSides) sides."
    }
  }
 
  var shape = Shape()
  shape.numberOfSides = 7
  var shapeDescription = shape.simpleDescription()
  print(shapeDescription)   // A shape with 7 sides.
 
  // ======== 초기화자(Initializer): Constructor와 비슷 ======== 
 
  class NamedShape {
    var numberOfSides: Int = 0
    var name: String
    init(name: String) {
        self.name = name
    }
    func simpleDescription() -> String {
        return "A shape with \(numberOfSides) sides."
    }
  }
 
  // 
 
  var namedShape = Shape()
  namedShape.numberOfSides = 11
  shapeDescription = namedShape.simpleDescription()
  print(shapeDescription)
  
  // ======== 상속: 오버라이드 시 override 키워드 반드시 필요 ======== 
 
  class Square: NamedShape {
      var sideLength: Double
 
      init(sideLength: Double, name: String) {
          self.sideLength = sideLength
          super.init(name: name)
          numberOfSides = 4
      }
 
      func area() -> Double {
          return sideLength * sideLength
      }
 
      override func simpleDescription() -> String {
            return "A square with sides of length \(sideLength)."
      }
   }
 
   let test = Square(sideLength: 5, name: "my test square")
   print(test.area())   // 25
   print(test.simpleDescription())  // A square with sides of length 5.0.
 
   /*
     실험 NamedShape클래스의 또 다른 하위 클래스인 Circle을 만들어보자. 
     이 클래스는 이니셜 라이저를 통해 radius와 name을 인자로 받는다. 
     Circle 클래스 안에 area, describe 함수를 구현해보자
    */
 
      class Circle: NamedShape {
      var radius: Double    // 반지름
 
      init(radius: Double, name: String) {
          self.radius = radius
          super.init(name: name)
      }
 
      func area() -> Double {
          return 3.14 * radius * radius
      }
 
      override func simpleDescription() -> String {
            return "A circle with area \(area())."
      }
   }
 
   let test2 = Circle(radius: 5, name: "my test circle")
   print(test2.simpleDescription()) 
 
   // ======== getter/setter ======== 
   class EquilateralTriangle: NamedShape {  // 정삼각형
    var sideLength: Double = 0.0
 
    init(sideLength: Double, name: String) {
        self.sideLength = sideLength
        super.init(name: name)
        numberOfSides = 3
    }
 
    var perimeter: Double { // 둘레
      get {
          return 3.0 * sideLength
      }
      set {
          sideLength = newValue / 3.0   // newValue: setter에서 사용
      }
    }
 
    override func simpleDescription() -> String {
        return "An equilateral triagle with sides of length \(sideLength)."
    }
  }
   var triangle = EquilateralTriangle(sideLength: 3.1, name: "a triangle")
   print(triangle.perimeter)    // 9.3 (= 3.1 * 3)
   triangle.perimeter = 9.9
   print(triangle.sideLength)   // 3.3000000000000003
 
   // ======== willSet, didSet ======== 
   // willSet: A = B, B가 A와 항상 동일하다(??)
   class TriangleAndSquare {
    var triangle: EquilateralTriangle {
        willSet {
            square.sideLength = newValue.sideLength
        }
    }
    var square: Square {
        willSet {
            triangle.sideLength = newValue.sideLength
        }
    }
    init(size: Double, name: String) {
        square = Square(sideLength: size, name: name)
        triangle = EquilateralTriangle(sideLength: size, name: name)
    }
  }
  var triangleAndSquare = TriangleAndSquare(size: 10, name: "another test shape")
  print(triangleAndSquare.square.sideLength)    // 10.0
  print(triangleAndSquare.triangle.sideLength)  // 10.0
  // TriangleAndSquare의 생성자에서 size를 10으로 설정하면 
  // square, triangle의 sideLength는 똑같이 10으로 설정된다.
  // 그것을 willSet이 보장한다(??)
  triangleAndSquare.square = Square(sideLength: 50, name: "larger square")
  print(triangleAndSquare.triangle.sideLength)  // 50.0
 
  class Counter {
    var count: Int = 0
    // numberOfTimes: 외부에서 사용할 별명, times: 함수 내부에서 사용
    func incrementBy(_ amount: Int, numberOfTimes times: Int) {
        count += amount * times
    }
 
    func outCount() -> Int {
        return count
    }
  }
  var counter = Counter()
  counter.incrementBy(2, numberOfTimes: 7)
  print(counter.outCount()) // 14
 
  // ========  클래스에서 ?, nil 사용 ======== 
 
  let optionalSquare: Square? = Square(sideLength: 2.5, name: "optional square")
  let sideLength = optionalSquare?.sideLength
  print(sideLength) // Optional(2.5)
 
 //   let optionalSquare2: Square = nil
 //   let sideLength2 = optionalSquare2.sideLength
 //   print(sideLength2) // 컴파일 에러
  
   let optionalSquare3: Square? = nil
   let sideLength3 = optionalSquare3?.sideLength
   print(sideLength3) // nil
```
