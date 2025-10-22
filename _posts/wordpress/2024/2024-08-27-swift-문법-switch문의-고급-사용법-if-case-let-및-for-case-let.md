---
title: "Swift 문법: switch문의 고급 사용법 / if case let 및 for case let"
date: 2024-08-27
categories: 
  - "DevLog"
  - "Swift"
---

- [Swift 기초 (2): if 문, for ~ in 문, while 문, switch 문](http://yoonbumtae.com/?p=2109)

### **1\. Switch 문을 사용한 튜플 매칭 이해하기**

Swift의 `switch` 문은 특정 값에 대해 다양한 경우를 다룰 수 있도록 해줍니다. 특히 튜플을 사용할 때 매우 유용합니다. 이번 섹션에서는 `switch` 문이 튜플을 어떻게 처리하는지 살펴보겠습니다.

```
func getPoint(somePoint: (Int, Int)) {
    switch somePoint {
    case (0, 0):
        print("\(somePoint) is at the origin")
    case (_, 0):
        print("\(somePoint) is on the x-axis")
    case (0, _):
        print("\(somePoint) is on the y-axis")
    case (-2...2, -2...2):
        print("\(somePoint) is inside the box")
    default:
        print("\(somePoint) is outside of the box")
    }
}

getPoint(somePoint: (0, 0))    // (0, 0) is at the origin
getPoint(somePoint: (3, 0))    // (3, 0) is on the x-axis
getPoint(somePoint: (0, 124))  // (0, 124) is on the y-axis
getPoint(somePoint: (1, 3))    // (1, 3) is outside of the box
getPoint(somePoint: (1, 2))    // (1, 2) is inside the box
```

##### **설명:**

- `getPoint(somePoint:)` 함수는 `(Int, Int)` 형태의 튜플을 매개변수로 받아, 그 튜플이 어디에 위치하는지 출력합니다.
- `(0, 0)`은 원점(origin)이며, 이 경우 "is at the origin"이 출력됩니다.
- `(_, 0)`은 y 값이 0일 때의 모든 x 값을 포함합니다. 따라서 x축 위에 있는 점임을 알 수 있습니다.
- `(0, _)`은 x 값이 0일 때의 모든 y 값을 포함하므로 y축 위에 있는 점입니다.
- `(-2...2, -2...2)`는 x와 y 값이 각각 -2와 2 사이에 있는 점을 나타냅니다. 이 경우, 점은 "박스" 내부에 있다고 간주합니다.
-  이 외의 모든 점은 "박스" 외부에 있는 점으로 처리됩니다.

 

 

### **2\. 값 바인딩과 Switch 문**

다음 섹션에서는 `switch` 문에서 값 바인딩을 사용하여 각 케이스에서 변수를 사용해 값을 출력하는 방법을 살펴보겠습니다.

```
func getPoint2(somePoint:(Int,Int)) {
    switch somePoint {
    case (0, 0):
        print("\(somePoint) is at the origin")
    case (let x, 0):
        print("on the x-axis with an x value of \(x)")
    case (0, let y):
        print("on the y-axis with an y value of \(y)")
    case (-2...2, -2...2):
        print("\(somePoint) is inside the box")
    default:
        print("\(somePoint) is outside of the box")
    }
}

getPoint2(somePoint: (0, 0))    // (0, 0) is at the origin
getPoint2(somePoint: (3, 0))    // on the x-axis with an x value of 3
getPoint2(somePoint: (0, 124))  // on the y-axis with a y value of 124
getPoint2(somePoint: (1, 3))    // (1, 3) is outside of the box
getPoint2(somePoint: (1, 2))    // (1, 2) is inside the box
```

##### **설명:**

- `let x` 또는 `let y`를 사용해 `somePoint`의 값을 변수로 바인딩할 수 있습니다.
- `(let x, 0)`에서는 y 값이 0일 때 x 값을 바인딩하고, 이를 출력합니다.
- `(0, let y)`에서는 x 값이 0일 때 y 값을 바인딩하여 출력합니다.

 

 

### **3\. Where 절을 사용한 추가 조건 적용**

이번 섹션에서는 `where` 절을 사용해 `switch` 문 내에서 추가적인 조건을 적용하는 방법을 알아보겠습니다.

```
func wherePoint(point:(Int,Int)) {
    switch point {
    case let (x, y) where x == y:
        print("(\(x), \(y)) is on the line x == y")
    case let (x, y) where x == -y:
        print("(\(x), \(y)) is on the line x == -y")
    case let (x, y):
        print("(\(x), \(y)) is just some arbitrary point")
    }
}

wherePoint(point: (3, 3))    // (3, 3) is on the line x == y
wherePoint(point: (3, -3))   // (3, -3) is on the line x == -y
wherePoint(point: (3, 2))    // (3, 2) is just some arbitrary point
```

##### **설명:**

- `where` 절을 사용하면 특정 조건을 충족하는 경우에만 해당 `case`가 실행되도록 할 수 있습니다.
- `(x == y)`인 경우, 점이 `x == y` 선 위에 있다는 메시지를 출력합니다.
- `(x == -y)`인 경우, 점이 `x == -y` 선 위에 있다는 메시지를 출력합니다.
-  그 외의 경우, 임의의 점이라는 메시지를 출력합니다.

 

 

### **4\. Switch 문에서의 열거형(Enumeration) 처리**

이번 섹션에서는 `switch` 문을 사용하여 열거형을 처리하는 방법을 알아보겠습니다. Swift의 열거형은 정해진 몇 가지 값 중 하나를 가질 수 있는 타입을 정의할 때 유용합니다.

##### **사전 코드:**

```
enum JustError: Error {
    case fatalError
}

func justError(_ throwError: Bool) throws {
    if throwError {
        throw JustError.fatalError
    } else {
        return
    }
}

func justErrorWithValue(_ throwError: Bool) throws -> String {
    if throwError {
        throw JustError.fatalError
    } else {
        return "1234567"
    }
}

let result = Result {
    try justError(false) // .success()
}

let result2 = Result {
    try justErrorWithValue(false) // .success("1234567")
}

```

 

##### **본 코드:**

```
switch result2 {
case .success(let data):
    print("success", data) // "success 1234567\n"
case .failure(let error):
    print("failed", error)
}

switch result2 {
  case let .success(data):
    print("success", data) // "success 1234567\n"
  case let .failure(error):
    print("failed", error)
}
```

##### **설명:**

- 열거형 `result2`의 값이 `success`인 경우, `data`를 출력합니다.
- `failure`인 경우, `error`를 출력합니다.
- 두 번째 `switch` 문에서는 `case let` 문법을 사용해 `data`와 `error`를 바인딩했습니다. 두 방법 모두 같은 결과를 가져옵니다.

 

 

### **5\. `if case` 문을 활용한 값 매칭**

마지막으로, `if case` 문을 사용하여 특정 케이스에 대해 조건을 확인하는 방법을 알아보겠습니다.

```
if case let .success(data) = result {
    print("success", data)
}

if case .success(let data) = result {
    print("success", data)
}
```

##### **설명:**

- `if case` 문을 사용하면 `switch` 문을 사용하지 않고도 특정 케이스와 매칭할 수 있습니다.
- 예를 들어, `result`가 `success`일 때만 `data`를 출력할 수 있습니다.

 

```
let scoresIncludeNil = [1, 13, 6, 5, nil, 30, 4, nil]
for case let score? in scoresIncludeNil where score >= 5 {
    print("5점 초과 스코어", score)
}

/* 결과:
5점 초과 스코어 13
5점 초과 스코어 6
5점 초과 스코어 5
5점 초과 스코어 30
*/
```

- `for case let` 문을 사용하여, `scoresIncludeNil` 배열에서 nil 이 아닌 값 중 5 이상의 점수만 선택할 수 있습니다.

 

* * *

### **참고) if case let, for case let**

 

### **1\. `if case let`의 이해**

`if case let`은 `if`문에서 특정 패턴이 일치하는 경우에만 조건을 만족하도록 합니다. 이 조건이 만족되면, 해당 값을 변수에 바인딩해서 사용할 수 있습니다.

```
enum Result {
    case success(Int)
    case failure(String)
}

let result = Result.success(200)

if case let .success(value) = result {
    print("Success with value \(value)")
}

```

##### **설명:**

- `Result`라는 열거형(enum)이 있고, 두 가지 상태(`success`, `failure`)를 가질 수 있습니다.
- `result`라는 변수는 `Result.success(200)`로 초기화되어 있습니다.
- `if case let .success(value) = result`는 `result`가 `success`인 경우에만 실행됩니다. 또한 `value`에 `200`이 바인딩됩니다.
- 그 결과, "Success with value 200"이 출력됩니다.

 

### **2\. `for case let`의 이해**

`for case let`은 배열이나 컬렉션에서 특정 패턴과 일치하는 항목들만을 선택해 처리할 때 사용됩니다.

```
let items: [Result] = [.success(100), .failure("Error"), .success(250), .failure("Failed")]

for case let .success(value) in items {
    print("Found success with value \(value)")
}

```

##### **설명:**

- `items`라는 배열이 있고, `Result.success`와 `Result.failure`가 섞여 있습니다.
- `for case let .success(value) in items`는 `items` 배열을 순회하면서 `success`에 해당하는 항목만 선택하고, 그 값을 `value`에 바인딩합니다.
- 결과적으로, 배열에서 성공 케이스(`.success`)를 찾을 때마다 "Found success with value \\(value)"라는 메시지가 출력됩니다.

 

### **3\. 차이점 요약**

- `if case let`은 단일 값을 조건문에서 확인할 때 사용합니다. 조건이 맞으면 해당 값을 사용할 수 있게 해줍니다.
- `for case let`은 컬렉션을 순회하면서 특정 패턴과 일치하는 항목들만 선택해서 처리합니다.

 

### **4\. 추가 예시: `if case let`**

```
let optionalNumber: Int? = 42

if case let number? = optionalNumber {
    print("The number is \(number)") // 42
}

```

 

### **5\. 추가 예시: `for case let`**

```
let mixedValues: [Int?] = [nil, 42, nil, 7, nil, 100]

for case let number? in mixedValues {
    print("Found a number: \(number)") // 42, 7, 100
}

```

 

\[rcblock id="6686"\]
