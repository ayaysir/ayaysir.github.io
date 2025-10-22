---
title: "Swift 기초 (8): 제네릭 타입 (Generic Type)"
date: 2020-01-20
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

\[rcblock id="3441"\]

#### **제네릭 타입 (Generic Type)**

제네릭 타입이란 "_타입을 파라미터화해서 컴파일시 구체적인 타입이 결정되도록 하는 것_"이란 뜻으로 Swift에서도 제네릭 타입을 지원합니다. 주로 배열 같은 콜렉션 타입에서 사용됩니다.

```swift
// EEItem: 임의로 설정한 이름으로 어떠한 타입도 받을 수 있음
func makeArray<EEItem>(repeating item: EEItem, numberOfTimes: Int) -> [EEItem] {
    var result = [EEItem]() // 배열의 초기화
    for _ in 0 ..< numberOfTimes {
        result.append(item)
    }
    return result
}
```

이 코드의 함수 이름 옆에 있는 이 제네릭 타입의 선언입니다. 이 부분을 지우면 이후 코드는 전부 동작하지 않습니다. 타입의 이름은 임의로 설정한 이름으로 이 부분에는 어떠한 타입이라도 들어갈 수 있습니다.

 

```swift
let res1 = makeArray(repeating: "knock", numberOfTimes: 5)
print(res1)
```

> \["knock", "knock", "knock", "knock", "knock"\]

EEItem 부분에 스트링 변수가 들어갔는데 잘 동작합니다.

 

아래 예제는 스위프트에 기본적으로 내장되어 있는 [Optional Enum](https://stackoverflow.com/questions/38204311/what-does-the-some-keyword-in-the-xcode-console-mean) 을 흉내낸 것입니다.

```swift
enum EEOptionalValue<WrappedXR> {
    case none
    case some(WrappedXR) // some 변수의 파라미터 WrappedXR 제네릭 타입 자료형
}
```

`<WrappedXR>` 부분은 이 Enum에 제네릭 타입을 사용하겠다고 선언하는 것이고, `some(WrappedXR)`은 이 케이스에서 파라미터를 가지는데, 그것의 자료형이 `WrappedXR`이라는 이름의 제네릭 타입(위에서 선언한 그것과 동일)이라는 뜻입니다.

 

```swift
//var possibleInteger = .none // 불가능
//var possibleInteger: EEOptionalValue = .none // 불가능

var possibleInteger: EEOptionalValue<Int> = .none
print(possibleInteger)

possibleInteger = .some(200)
print(possibleInteger)

var possibleString: EEOptionalValue<String> = .none
print(possibleString)   // none

possibleString = .some("Strings")
print(possibleString)   // some("Strings")
```

> none some(200) none some("Strings")

 

변수를 생성할 때 자료형을 `EEOptionalValue<Int>` 같이 제네릭 타입도 같이 명시를 해줘야 정상적으로 진행이 됩니다. 또한 정수형이나 스트링 등 어떠한 타입이라도 대입해 사용할 수 있는 것을 볼 수 있습니다.

 

##### **제네릭 타입의 Where 절**

프로토콜 구현의 위한 타입을 요구하거나 똑같은 타입을 요구하는 경우, 혹은 특정 상위 클래스를 요구하는 경우 등 제네릭 타입에서 사용할 타입을 한정시키고 싶을 때 `Where` 절을 사용합니다.

아래 예제는 두 배열 간 공통 원소가 있는지 찾는 예제입니다. T, U 두 제네릭 타입이 있는데 T, U는 `Sequence` 타입이라고 한정하고 있습니다. `Sequence`는 요소에 순차적으로 반복 액세스 할 수 있는 유형입니다.

`where` 절은 `T`의 요소가 `Equatable`(값이 다른 어느 값과 같은 지 여부를 검사할 수 있는 타입)이며, `T.Element` 와 `U.Element` 가 같은 타입이라는 조건을 걸고 있습니다. 이 `where` 절이 없다면 `lhsItem == rhsItem` 부분에서 에러가 발생하는데, 조건을 정해주지 않으면 `T`의 원소와 `U`의 원소가 같은 지 여부에 대해 전혀 알 수가 없기 때문에 컴파일 할 수 없는 것입니다.

`T: Sequence` 조건은 `where`절에 위치하더라도 상관없습니다.

```swift
func anyCommonElements<T: Sequence, U: Sequence> (_ lhs: T, _ rhs: U) -> Bool
    where T.Element: Equatable, T.Element == U.Element {
        for lhsItem in lhs {
            for rhsItem in rhs {
                if lhsItem == rhsItem {
                    return true
                }
            }
        }
        return false
}

print (anyCommonElements([1, 2, 3], [3]))   // true
print (anyCommonElements([1, 2, 3], [4]))  // false
```

 

**퀴즈.** `anyCommonElements (_ : _ :)` 함수를 수정하여 두 시퀀스의 공통 요소의 배열을 리턴하는 함수를 작성하시오.

```swift
func anyCommonElements<T: Sequence, U: Sequence> (_ lhs: T, _ rhs: U) -> [T.Element]
    where T.Element: Equatable, T.Element == U.Element {

        var tempArr: [T.Element] = [T.Element]()
        
        for lhsItem in lhs {
            for rhsItem in rhs {
                if lhsItem == rhsItem {
                    tempArr.append(lhsItem)
                }
            }
        }
        return tempArr
}

print (anyCommonElements([1, 2, 3], [3])) 
print (anyCommonElements([1, 2, 3], [4]))
print (anyCommonElements([1, 2, 3], [1, 3]))
```

> \[3\] \[\] \[1, 3\]

 

\[rcblock id="3441"\]
