---
title: "Swift(스위프트): 배열의 reduce"
date: 2022-04-25
categories: 
  - "DevLog"
  - "Swift"
---

## **Swift: 배열의 reduce**

스위프트(Swift)에서 배열(Array)의 `reduce` 기능은 배열을 순회하면서 누산기(`accumulator`)에 값을 계속 쌓아놓고 최종적으로 누산기의 값을 반환하는 reducer의 기능을 수행하는 고차 함수입니다. reducer의 사전적 의미와 매칭이 잘 안되는데 어떤 물질에서 원액(누산기의 값)만 추출한다는 의미로 생각하면 될 것 같습니다.

누산기의 값은 줄어들지 않으며 리턴식은 누산기에 합산됩니다. 그리고 마지막까지 순회한 후 최종적으로 누산기의 값만을 반환한다는 특성을 지니고 있습니다.

 

## **형태**

Swift의 reduce는 두 가지 형태가 있습니다.

### **제 1형태**

```swift
func reduce<Result>(_ initialResult: Result, _ nextPartialResult: (Result, Element) throws -> Result) rethrows -> Result
```

- `initialResult` 초기 누적 값으로 사용할 값입니다. `initialResult`는 클로저가 처음 실행될 때 `nextPartialResult`에 전달됩니다.
- `nextPartialResult` 누적 값과 시퀀스의 요소(`element`)를 새로운 누적 값으로 결합하는 클로저입니다. 다음 번 `nextPartialResult` 종료 시 사용되거나 호출자에게 반환됩니다. `nextPartialResult` 클로저의 다음 호출(call)에 사용되거나 호출자(call)에게 반환됩니다. (요약하면 결합 작업을 수행하는 클로저입니다,)

 

### **제 2형태**

```swift
func reduce<Result>(into initialResult: Result, _ updateAccumulatingResult: (inout Result, Element) throws -> ()) rethrows -> Result
```

- `initialResult` 초기 누적 값으로 사용할 값입니다.
- `updateAccumulatingResult` 시퀀스의 요소로 누적 값을 업데이트하는 클로저입니다.

 

두 방식의 큰 차이점이라면 첫 번째 방식은 `nextPartialResult` 클로저 함수에서 `Result`를 변경할 수 없습니다. (`let` 변수) 그리고 클로저 함수는 리턴값을 반환해야 하며, 그 리턴값이 새로운 누적 결과(accumulated result)로 진행됩니다. 두 번쨰 방식은 initialResult가 변경 가능하며(`inout`) `updateAccumulatingResult` 클로저 함수에서 따로 리턴값을 요구하지 않습니다.

예제 코드를 보면 차이점을 바로 알 수 있습니다.

## **예제**

아래 예제들은 자바스크립트의 배열 reduce 에서도 동일한 예제로 다루고 있으니 자바스크립트에 관심있으면 읽어보는 것을 추천드립니다.

- [자바스크립트: 배열 Array.reduce](/posts/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%B0%B0%EC%97%B4-array-reduce/)

 

### **예제 1) 배열의 숫자 더하기**

```swift
let arr = [0, 1, 4, 6, 8, 10]
let sum = arr.reduce(0) { partialResult, currentValue in
    return partialResult + currentValue
}

// 합계(sum): 29
```

```swift
let sum2 = arr.reduce(into: 0) { partialResult, currentValue in
    partialResult += currentValue
}

// 합계(sum2): 29
```

 

### **예제 2) 배열 내 객체의 숫자 더하기**

```swift
let xyArr = [
    ["x": 1, "y": 0],
    ["x": 2, "y": 5],
    ["x": 3, "y": 11],
]
```

```swift
// x 값만 더하기 (1형태)
let xSum = xyArr.reduce(0) { partialResult, currentValue in
    return partialResult +  currentValue["x"]!
} 
// 결과: 6

// x 값만 더하기 (2형태)
let xSum2 = xyArr.reduce(into: 0) { partialResult, currentValue in
    partialResult +=  currentValue["x"]!
}
// 결과: 6
```

- `xyArr`에서 `x`의 값만 더하는 방법입니다.

 

```swift
// x, y 각각 더하고 딕셔너리로 결과 반환 (1형태)
let xySum = xyArr.reduce(["x": 0, "y": 0]) { partialResult, currentValue in
    // partialResult["x"]! += 1
    // Left side of mutating operator isn't mutable: 'partialResult' is a 'let' constant
    
    var partialResultCopy = partialResult
    partialResultCopy["x"]! += currentValue["x"]!
    partialResultCopy["y"]! += currentValue["y"]!
    return partialResultCopy
}
// 결과: ["x": 6, "y": 16]

// x, y 각각 더하고 딕셔너리로 결과 반환 (2형태)
let xySum2 = xyArr.reduce(into: ["x": 0, "y": 0]) { partialResult, currentValue in
    partialResult["x"]! += currentValue["x"]!
    partialResult["y"]! += currentValue["y"]!
}
// 결과: ["x": 6, "y": 16]
```

- `xyArr`에서 `x`의 값과 `y`의 값을 각각 더한 뒤, 새로운 딕셔너리를 만들어 각 값에 대한 합을 저장하는 예제입니다.
- 앞서 언급했듯이 1형태에서는 `initialResult(["x": 0, "y": 0])`이 변형 불가능한(immutable) `let` 변수입니다. 따라서 최초에 딕셔너리를 만들더라도 직접 값을 변형할 수 없고 새로운 객체를 복사한 다음 그 복사한 객체를 리턴값으로 할당하는 식으로 번거로운 작업을 진행해야 합니다.
- 반면 2형태는 `initialResult`를 직접 변형할 수 있으므로 코드가 훨씬 간결해집니다. 이를 통해 딕셔너리 타입 등 내부 원소 자체가 변형될 필요가 있는 경우에는 2형태가 적합하다는 것을 알 수 있습니다.
- 이 글에서는 1형태, 2형태 모두 작성하였지만 결과값이 배열 또는 딕셔너리 타입인 경우 2형태를 사용하는 것을 추천합니다.

 

### **예제 3) 2차원 배열 펼치기 (1차원으로 평탄화)**

```swift
let twoDimArray: [[Any]] = [[0, 4], ["x", "y"], ["zz"]]

// 1형태
twoDimArray.reduce([]) { partialResult, currentValue in
    return partialResult + currentValue
}
// 결과: [0, 4, "x", "y", "zz"]

// 2형태
twoDimArray.reduce(into: []) { partialResult, currentValue in
    partialResult.append(currentValue)
}
// 결과
[[0, 4], ["x", "y"], ["zz"]]
```

- 1형태 코드에서 Swift에서 배열끼리 합칠 때 `+` 연산자를 사용할 수 있습니다.

 

### **예제 4) 중복 원소 몇 개인지 세기**

```swift
let names = ["Alice", "Bob", "Tiff", "Bruce", "Alice", "Alice", "Tiff"]

// 1형태
names.reduce([String: Int]()) { partialResult, currentValue in
    var partialResult = partialResult
    partialResult[currentValue, default: 0] += 1
    return partialResult
}

// 2형태
names.reduce(into: [String: Int]()) { partialResult, currentValue in
    partialResult[currentValue, default: 0] += 1
}

// 결과: ["Bob": 1, "Bruce": 1, "Tiff": 2, "Alice": 3]
```

- 결과값이 딕셔너리 타입이므로 2형태로 사용하는 것이 훨씬 간편합니다.
- `[String:Int]()` 와 같이 사용하면 해당 타입의 빈 딕셔너리 객체를 생성할 수 있습니다.
- `partialResult[currentValue, default: 0]` 이 부분에서 `default`는 해당 키가 존재하지 않는 경우 `nil`을 반환하는 대신 `default`값을 가지는 원소를 즉석에서 생성합니다. 이렇게 하면 새로운 키를 가지는 원소에 `+=` 연산자를 사용할 수 있습니다.

 

### **예제 5) Person을 나이(age)별로 분류**

```swift
struct Person {
    let name: String
    let age: Int
}

let people = [
    Person(name: "Alice", age: 21),
    Person(name: "Max", age: 20),
    Person(name: "Jane", age: 20),
]
```

```swift
// 1형태
people.reduce( [Int: [Person]]() ) { partialResult, currentPerson in
    var partialResult = partialResult
    partialResult[currentPerson.age, default: []].append(currentPerson)
    return partialResult
}

// 2형태
people.reduce(into: [Int: [Person]]() ) { partialResult, currentPerson in
    partialResult[currentPerson.age, default: []].append(currentPerson)
}

```

![](/assets/img/wp-content/uploads/2022/04/screenshot-2022-04-25-pm-9.20.15.png) 
*`[Int: [Person]]` 타입의 결과*

 

### **예제 6) 객체에서 배열을 뽑아 연결하기**

```swift
struct Reader {
    let name: String
    let books: [String]
    let age: Int
}

let readers = [
    Reader(name: "Anna", books: ["Bible", "Harry Potter"], age: 21),
    Reader(name: "Bob", books: ["War and Peace", "Romeo and Juliet"], age: 21),
    Reader(name: "Anna", books: ["The Lord of the Rings", "The Shining"], age: 21),
]
```

```swift
// 1형태
readers.reduce([]) { partialResult, currentReader in
    return partialResult + currentReader.books
}

// 2형태
readers.reduce(into: []) { partialResult, currentReader in
    partialResult += currentReader.books
}

```

\[caption id="attachment\_4393" align="alignnone" width="217"\] ![](/assets/img/wp-content/uploads/2022/04/screenshot-2022-04-25-pm-9.30.33.png) \[String\] 타입의 결과\[/caption\] 

 

### **예제 7) 배열의 중복값 제거**

```swift
let numArr = [1, 2, 1, 6, 2, 2, 3, 5, 4, 5, 3, 4, 4, 7, 4, 4]

// 1형태
numArr.sorted().reduce([Int]()) { partialResult, currentValue in
    
    var partialResult = partialResult
    
    // partialResult 배열의 길이가 0이거나, partialResult 배열의 마지막 원소가 현재 원소랑 같지 않다면
    if(partialResult.count == 0 || partialResult[partialResult.count - 1] != currentValue) {
        partialResult.append(currentValue)
    }
    
    return partialResult
}

// 2형태
numArr.sorted().reduce(into: [Int]()) { partialResult, currentValue in
    
    // partialResult 배열의 길이가 0이거나, partialResult 배열의 마지막 원소가 현재 원소랑 같지 않다면
    if(partialResult.count == 0 || partialResult[partialResult.count - 1] != currentValue) {
        partialResult.append(currentValue)
    }
}

// 결과: [1, 2, 3, 4, 5, 6, 7]
```

- 인접한 원소 간 비교 작업을 통해 중복값을 제거하므로 작업 수행 전 배열을 정렬해야 정상 동작합니다.
- 참고) `Set`을 이용한 중복제거 - `Set(numArr).sorted()`

 
<span style="font-size: 2px;">
스위프트 Swift 리듀스 reduce 리듀서 reducer array 배열 맵 map 사전 딕셔너리 dict dictionary reduce int string accumulator</span>
