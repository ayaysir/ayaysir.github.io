---
title: "Swift(스위프트): 제네릭(Generics) - 제네릭 타입, 제네릭 함수, 연관 타입(Associated Type), where 조건절"
date: 2022-05-27
categories: 
  - "DevLog"
  - "Swift"
---

**출처**

- [Generics - The Swift Programming Language](https://docs.swift.org/swift-book/LanguageGuide/Generics.html) 

 

## **제네릭 (Generics)**

- 데이터 형식에 의존하지 않고, 하나의 값이 여러 다른 데이터 타입들을 가질 수 있는 기술에 중점을 두어 재사용성을 높일 수 있는 프로그래밍 방식입니다.
- 예를 들어, Swift의 `Array`와 `Dictionary` 유형은 모두 제네릭 컬렉션입니다.

 

## **제네릭이 해결하는 문제**

`swap`(교환) 함수를 구현하고자 합니다. swap은 단순히 두 변수의 값을 바꾸는 것 뿐으로 거의 대부분의 타입에서 사용 가능한 기능입니다. 예를 들어 `Int`, `String`, `Double` 및 기타 등등이 전부 swap 가능한 타입들입니다. 일단 `Int` 타입에 대한 `swap(_:_:)` 함수를 일반적인 방식으로 구현하면 다음과 같습니다.

```swift
func swapTwoInts(_ a: inout Int, _ b: inout Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}

var someInt = 3
var anotherInt = 107
swapTwoInts(&someInt, &anotherInt)
print("someInt:", someInt, "anotherInt:", anotherInt)

// 결과: someInt: 107 anotherInt: 3
```

`Int`를 구현했으니 다음은 `String`, `Double`에 대한 `swap` 함수도 구현해 보겠습니다.

```swift
func swapTwoStrings(_ a: inout String, _ b: inout String) {
    let temporaryA = a
    a = b
    b = temporaryA
}

func swapTwoDoubles(_ a: inout Double, _ b: inout Double) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

지금은 타입이 3개이지만, 만약 다른 타입들에 대해서도 swap을 하고 싶다면 이와 같은 방식으로 함수들을 타입 개수만큼 무한히 작성해야 합니다.

그리고 함수의 내용을 보면 다른 것은 타입뿐이고, 교환 로직은 전부 동일하다는 것을 알 수 있습니다. 심지어 코드도 똑같습니다.

이런 문제를 해결하기 위해 등장한 것이 제네릭입니다.

> **참고: `inout`**
> 
> 변경 가능한 파라미터를 전달하고 파라미터를 변경할 수 있는 방법이 있습니다. inout 키워드를 사용하면 전달한 파라미터를 변경할 수 있고 그 변경 내용이 원본 값에도 영향을 미칩니다. var 변수에서만 사용 가능합니다.

 

## **제네릭 함수**

위의 `swap` 함수들에서 다른 것은 파라미터 타입뿐이고, 안의 로직은 동일합니다. 제네릭 함수는 함수에 가상의 타입을 부여한 뒤, 이것을 파라미터로 받고 처리합니다.

```swift
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

- `func swapToValues<T>` - `T`라는 가상의 타입을 새로 선언합니다. 이러한 가상의 타입을 **_placeholder type_**이라고 합니다.
    - 함수 이름 뒤에 꺾쇠`<>`를 붙인 뒤 안에 타입 이름을 입력하면 제네릭 타입이 됩니다.
    - `T`는 가변 타입으로, 파라미터에 주어지는 대로 해당 타입으로 변화하게 됩니다. 예를 들어 `String`타입을 파라미터로 제공하면 `T`는 `String`이 되고, `Double`이 주어지면 `T`는 `Double`이 됩니다.
    - 제네릭 타입의 이름은 전통적으로 `T`, `U`, `V`,... 등으로 사용합니다.
    - 물론 타입의 이름은 의미를 가진 이름도 가능하며 별 의미 없는 아무 이름도 가능합니다. `Amutype`, `Asdf`, `Qwerty` 같은 이런 이상한 이름들도 가능합니다.
    - 심지어 `Int`, `Object`, `Double` 등 기존에 존재하는 타입을 사용해도 됩니다. 제네릭 타입으로 이런 이름을 사용하면 실제 `Int`가 아니라 placeholder 타입으로서의 `Int`가 됩니다.
- `(_ a: inout T, _ b: inout T)`
    - 앞서 선언한 가변 타입(placeholder type)을 파라미터 타입으로 사용하였습니다.
    - `a`는 가변 타입 `T`, `b`도 가변 타입 `T`를 요구합니다.
    - 이제 이 파라미터에는 `a`, `b` 가 같은 타입인 한 아무 타입이나 입력할 수 있습니다. 단 둘이 다른 타입은 안됩니다. (둘 다 `T`타입이므로 같은 타입을 입력해야 함)
- 이 예제에서는 제네릭 타입이 `T` 하나이지만, 여러 타입을 지정하는 것도 가능합니다. 예)  `<T, U, V>`

<br>

```swift
var someString = "Javelin"
var anotherString = "Stinger"
swapTwoValues(&someString, &anotherString)
print(someString, ":", anotherString)
// 결과: Stinger : Javelin

var someDouble = 1338.4434
var anotherDouble = 4.7237
swapTwoValues(&someDouble, &anotherDouble)
print(someDouble, ":", anotherDouble)
// 결과: 4.7237 : 1338.4434

```

- 같은 `swapTwoValues` 함수이지만 `String`, `Double` 모두 사용 가능합니다.
- 첫 파라미터 `a`에 `String` 타입의 값을 받으면, `a`의 가변 타입인 `T`는 자동으로 `String`으로 추론되게 됩니다.
- `b`의 타입도 `T`이므로. 앞서 `T`에서 `String`으로 추론된 `a`와 동일한 타입이어야 합니다.
- 함수 내부는 동일한 타입의 두 변수를 스왑하는 내용이므로 `a`, `b`가 동일한 타입이기 때문에(`T ➝ String`) 함수는 정상적으로 실행되게 됩니다.
- 마찬가지로 동일한 원리로 `Double` 타입의 값도 정상 스왑 가능하게 됩니다.

 

## **제네릭 타입**

- 제네릭 함수와 마찬가지로, `class`, `struct`, `enum` 및 모든 타입 등에서도 사용자 정의의 제네릭 타입을 정의하는 것이 가능합니다.
- 앞서 언급한 `Array`, `Dictionary` 등이 대표적인 제네릭 타입입니다.

제네릭 타입 관련 내용은 사용자 정의의 스택(Stack)을 구현하면서 관련 내용이 진행됩니다.

 ![](/assets/img/wp-content/uploads/2022/05/stackPushPop_2x.png)

1. 현재 스택에는 세 개의 값이 있습니다.
2. 네 번째 값은 스택의 맨 위에 푸시(push)됩니다.
3. 스택은 이제 가장 최근 값이 맨 위에 위치한 4개의 값을 보유합니다.
4. 스택의 맨 위 항목이 팝(pop)됩니다.
5. 값을 팝한 후 스택은 다시 세 개의 값을 보유합니다.

> 참고: 스택의 개념은 `UINavigationController`클래스에서 탐색 계층 구조의 뷰 컨트롤러를 모델링하는 데 사용됩니다.

 

제네릭이 아닌 일반적인 `Int` 타입의 스택은 다음과 같습니다.

```swift
struct IntStack {
    var items: [Int] = []
    mutating func push(_ item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
}
```

- `items` - 숫자가 저장될 배열입니다.
- `push` - 새로운 아이템을 스택 최상단에 삽입합니다.
- `pop` - 최상단에 있는 아이템을 배열에서 제거하고 해당 값을 반환합니다.
- `mutating func` - `struct` 내부의 변수를 변경하려면 `mutating` 키워드가 붙어야 합니다.

 

> **참고: `mutating`**
> 
> `mutating` 키워드는 구조체(`struct`)에 포함된 상태를 변경하는 경우에만 필요합니다. Swift 구조체는 변경할 수 없는 객체이기 때문에 변경 함수를 호출하면 실제로 새로운 구조체가 제자리에 반환됩니다(함수에 `inout` 매개변수를 전달하는 것과 유사). ([출처](https://stackoverflow.com/questions/51128666/what-does-the-swift-mutating-keyword-mean))

 

```
var intStack = IntStack(items: [3, 6, 2, 7])
intStack.push(199848)
intStack.items // [3, 6, 2, 7, 199848]
intStack.pop()
intStack.pop()
intStack.items // [3, 6, 2]
```

`Int`값들 한정이라면 문제될 것이 없지만, 스택이 할 수 있는 내용은 `Int`에 한정되지 않고 다른 타입들에도 똑같이 적용할 수 있습니다. 타입 딱 하나만 제외하면 내부 로직을 변경할 필요도 없습니다. 제네릭이 없다면 앞서 `swap`과 마찬가지로 해당 타입에 대해 전부 대응하기 위해 복붙을 하면서 코드를 작성할 수 밖에 없습니다.

 

<!-- \[the\_ad id="3020"\] -->

 

제네릭을 적용해 위의 `Stack`을 재작성하면 다음과 같습니다.

```swift
struct Stack<Element> {
    var items: [Element] = []
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
}
```

- 마찬가지로 `struct` 뒤에 꺾쇠`<>` 안에 가상의 타입(placeholder type)을 정의합니다.
- `Element`라는 가상의 타입을 정의하였습니다.
- `Element` 타입은 `items` 배열, `push`, `pop` 에서 모두 사용됩니다.
    - 이를 통해 이들 배열과 메서드에서 다루는 타입은 모두 동일한 타입이어야 한다는 점을 알 수 있습니다.

 

```swift
var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")
stackOfStrings.push("cuatro")
// the stack now contains 4 strings

stackOfStrings.items
// ["uno", "dos", "tres", "cuatro"]

let fromTheTop = stackOfStrings.pop()
// 팝(popped)된 fromTheTop 의 값은 "cuatro", 이후 스택은 3개의 값을 담고 있음

stackOfStrings.items
// ["uno", "dos", "tres"]
```

 

![최초 스택에 push하는 과정](/assets/img/wp-content/uploads/2022/05/stackPushedFourStrings_2x.png)  
*최초 스택에 push하는 과정*

 

![스택 최상단의 값 "cuatro"를 pop 하는 과정](/assets/img/wp-content/uploads/2022/05/stackPoppedOneString_2x.png)  
*스택 최상단의 값 "cuatro"를 pop 하는 과정*

 

## **제네릭 타입의 확장**

앞의 `Stack` 예제에서 `struct` 부분에 제네릭이 선언되었다면, 확장(`extension`)에서는 따로 제네릭을 추가하지 않아도(`extension`에서는 제네릭 추가도 불가능합니다.) 제네릭 사용이 가능합니다.

```swift
extension Stack {
    // pop 하지 않고 최상위 요소를 반환
    var topItem: Element? {
        return items.isEmpty ? nil : items[items.count - 1]
    }
}

stackOfStrings.topItem // "tres"
```

 

## **타입 제약 조건(Type Constaints)**

- 앞의 예의 제네릭 타입들은 모든 타입을 사용하는 것이 가능했지만, 경우에 따라 일부 타입으로 제한해야 하는 경우도 있습니다. 이러한 경우를 타입 제약 조건이라고 합니다.
- 타입의 제약 조건은 해당 타입이 특정 클래스를 상속하거나, 또는 프로토콜을 준수하는 것으로 실현할 수 있습니다.
- 예를 들어 `Dictionary` 타입의 키(key)로 사용할 수 있는 타입은 `Hashable` 프로토콜을 준수해야 합니다. 이 프로토콜을 준수하지 않는 타입은 제네릭 타입 환경 하에서도 키로 사용할 수 없습니다.

 

## **타입 제약 조건의 문법**

```swift
func someFunction<T: SomeClass, U: SomeProtocol>(someT: T, someU: U) {
    // function body goes here
}
```

- 제네릭 타입 옆에 `:`를 붙이고 상속해야할 클래스나 준수해야 할 프로토콜을 지정합니다.
- `T: SomeClass` - `T`는 `SomeClass` 를 상속하는 타입만이 파라미터 값으로 가능합니다.
- `someU: U` - `U`는 `SomeProtocol`을 준수하는 타입만이 파라미터 값으로 가능합니다.

 

## **타입 제약 조건의 실제 적용 예**

아래 함수는 배열에 어떠한 값이 있다면 몇 번째 인덱스에 있는지를 반환하는 제네릭과 무관한 함수입니다.

```swift
func findIndex(ofString valueToFind: String, in array: [String]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}

let strings = ["cat", "dog", "llama", "parakeet", "terrapin"]
if let foundIndex = findIndex(ofString: "llama", in: strings) {
    print("llama의 인덱스는 \(foundIndex)번째입니다.")
}
// 결과: llama의 인덱스는 2번째입니다.
```

어떠한 값의 인덱스를 찾는 기능의 함수는 `String`이 아니더라도 다양한 타입에 적용 가능합니다. 따라서 이 함수를 제네릭 함수로 재작성하고자 합니다.

그래서 아래와 같이 제네릭 함수를 작성하였는데, 컴파일 오류가 발생합니다.

```swift
func findIndex<T>(of valueToFind: T, in array:[T]) -> Int? {
    for (index, value) in array.enumerated() {
        // 컴파일 오류: Binary operator '==' cannot be applied to two 'T' operands
        if value == valueToFind {
            return index
        }
    }
    return nil
}
```

사실 `==` 연산자는 모든 타입에서 이용 가능하지 않습니다. 원시적인 타입의 값들을 제외한 대부분의 타입의 경우 그 복잡성으로 인해 Swift의 컴파일러에서 해당 타입의 인스턴스가 같은지 여부를 알 수 없습니다. 이 문제를 해결하기 위해 Swift에서는 `Equatable`이라는 프로토콜을 제공합니다. 이 프로토콜은 `==` 연산자와 `!=` 연산자가 성립하려면 어떤 조건이어야 하는지를 개발자가 구현할 것을 요구하고 있으며, 따라서 이 프로토콜을 준수하는 타입이라면 해당 타입은 동등 비교가 가능한 타입이라는 것을 의미하는 것입니다.

위 `findIndex`함수의 로직에 따르면 `vlaue == valueToFind` 가 필요하므로 이 두 변수의 타입이 `Equatable` 프로토콜을 준수하도록 제약 조건을 지정한다면 컴파일러 오류는 발생하지 않습니다.

```swift
func findIndex<T: Equatable>(of valueToFind: T, in array:[T]) -> Int? { ... }
```

제약 조건을 지정하므로서 컴파일 오류도 방지하고 함수 사용자에게 어떠한 프로토콜을 준수하는 타입이 필요한지 알려주는 기능도 있어 매우 편리하다고 할 수 있습니다.

```swift
let doubleIndex = findIndex(of: 9.3, in: [3.14159, 0.1, 0.25])
// 9.3은 in 배열에 없으므로 doubleIndex는 nil이 반환됩니다.

let stringIndex = findIndex(of: "Andrea", in: ["Mike", "Malcolm", "Andrea"])
// Andrea는 in 배열 2번 인덱스에 있으므로 stringIndex 2가 반환됩니다.
```

 

## **연관 타입 (Associated Type)**

연관 타입은 프로토콜에서 사용하는 것으로, 프로토콜의 변수 및 메서드 등이 특정 타입에 국한되지 않고 다양한 타입에서 사용될 것이라고 예상될 때 타입을 연관 타입으로 지정하면 해당 프로토콜을 준수하는 클래스나 구조체 등에서 구체적 타입을 자유롭게 지정할 수 있습니다.

```swift
protocol Container {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

- 키워드로 `associatedtype`을 사용합니다. `Item`이라는 연관 타입을 지정하였으며 `Item`은 앞으로 구현될 하위 클래스나 구조체에서 구체적 타입을 자유롭게 지정할 수 있습니다.
- 이 프로토콜은 아래 3가지 사항을 요구하고 있습니다.
    - `Item` 타입의 값을 추가할 수 있는 `append(_:)` 메서드
    - 컨테이너 내부 요소 개수를 반환하는 읽기 전용의 `count`
    - 해당 인덱스의 아이템을 반환하는 `subscript`

 

제네릭 아닌 struct인 `IntStack`을 `Container`를 준수하도록 구현합니다.

```swift
struct IntStack: Container {
    // original IntStack implementation
    var items: [Int] = []
    mutating func push(_ item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }

    // Container protocol을 준수하여 구현
    // typealias Item = Int
    mutating func append(_ item: Int) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Int {
        return items[i]
    }
}
```

- `typealias Item = Int`
    - `Container`의 연관 타입인 `Item`의 구체적인 타입을 명시적으로 지정합니다.
    - 하지만 이 구문이 없어도 위의 코드는 정상 작동하는데, 조건이 만족한다면 (위의 경우 `Item`자리가 모두 `Int`)컴파일러가 해당 타입을 자동으로 추론하기 때문입니다.
    - 위의 `IntStack` 대신 `StringStack` 구조체를 만들고, `Item` 자리에 `Int` 대신 `String`을 넣어도 정상 동작합니다. (단, `items` 배열, `push(_:)`, `pop()` 등이 Int 대신 String을 다루도록 해야 합니다.)
- `mutating func append(_ item: Int) { ... }` `subscript(i: Int) -> Int { ... }`
    - 연관 타입 덕분에 `Item`의 자리에 `Int`를 사용할 수 있게 되었습니다.

 

제네릭 타입에 연관 타입을 사용한 프로토콜을 구현하는 것도 가능합니다. 즉, 연관 타입 자리를 대체할 수 있는 타입에는 제네릭 타입의 placeholder도 포함됩니다.

```swift
struct Stack<Element>: Container {
    // original Stack<Element> implementation
    var items: [Element] = []
    mutating func push(_ item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }

    // conformance to the Container protocol
    mutating func append(_ item: Element) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Element {
        return items[i]
    }
}
```

연관 타입 `Item`이 제네릭 타입의 placeholder인 `Element`로 대체되었습니다.

 

## **기존 타입을 확장하여 연관 타입 지정**

사실 위의 `Container` 프로토콜은 `Array`에서 제공하는 기능을 포함하고 있습니다. 실제로 `append`, `count`, `subscript`등의 기능은 `Array`에 구현되어 있고 대부분 자주 사용하는 기능입니다. 따라서 `Array`의 `extension`에 `Container` 프르토콜을 준수하도록 추가할 수 있습니다. 다음과 같이 빈 확장을 추가합니다.

```swift
extension Array: Container {}
```

`Array`의 기존 `append(_:)` 메서드와 아래 첨자는 위의 일반 `Stack` 유형과 마찬가지로 Swift가 Item에 사용할 적절한 타입을 유추할 수 있도록 합니다. 이 확장을 정의한 후에는 모든 `Array`를 `Container`로 사용할 수 있습니다.

 

## **연관 타입에 제약 조건 추가**

```swift
protocol Container {
    associatedtype Item: Equatable
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }
}
```

- `associatedtype`인 `Item`이 `Equatable` 프로토콜을 준수하도록 제약 조건을 추가할 수 있습니다.
- 참고로 `Array`의 해당 기능들은 타입의 `Equatable`이 필수가 아니므로 위의 `extension`은 에러가 발생하게 됩니다.
    - 이에 대한 해결책은 밑의 **"_제네릭 where 절이 있는 extension_"** 단락에서 확인할 수 있습니다.

 

<!-- \[the\_ad id="3513"\] -->

## **연관 타입의 제약 조건에 프로토콜 사용**

아래 `SuffixableContaner` 프로토콜은 `Container`의 기능에 컨테이너 끝에서 주어진 수의 요소를 반환하여 `Suffix` 유형의 인스턴스에 저장하는 `suffix(_:)` 메서드를 추가한 프로토콜입니다.

```swift
protocol SuffixableContainer: Container {
    associatedtype Suffix: SuffixableContainer where Suffix.Item == Item
    func suffix(_ size: Int) -> Suffix
}
```

- `SuffixableContainer`는 `Container` 프로토콜을 준수합니다.
- 연관 타입 `Suffix`
    - `Suffix`는 `SuffixableContainer`를 준수합니다.
    - `SuffixableContainer` `Suffix` 타입의 `Item`은 컨테이너의 연관 타입인 `Item`과 동일한 타입이어야 합니다.
        - 이러한 조건은 `where`절로 지정합니다.

`where Suffix.Item == Item`의 의미는 밑에서 다시 언급하도록 하겠습니다.

 

앞서 정의한 `Stack` 타입을 `SuffixContainer`를 준수하여 확장합니다.

```swift
protocol Container {
    associatedtype Item
    // ... //
}

struct Stack<Element>: Container {
    // original Stack<Element> implementation
    // ... //
    
    // conformance to the Container protocol
    // ... //
}

protocol SuffixableContainer: Container {
    associatedtype Suffix: SuffixableContainer where Suffix.Item == Item
    func suffix(_ size: Int) -> Suffix
}

extension Stack: SuffixableContainer {
    func suffix(_ size: Int) -> Stack {
        var result = Stack()
        for index in (count-size)..<count {
            result.append(self[index])
        }
        return result
    }
    // SuffixableContainer의 연관 타입 Suffix는 Stack으로 추론됨.
}

var stackOfInts = Stack<Int>()
stackOfInts.append(10)
stackOfInts.append(20)
stackOfInts.append(30)
let suffix = stackOfInts.suffix(2)
// suffix contains 20 and 30
```

- `func suffix(_ size: Int) -> Stack`
    - `Suffix` 연관 타입이 `Stack`으로 대체되었습니다.
    - `Stack`은 `extension`에서 `SuffixableContainer`를 준수하도록 선언되었고, `Stack`의 `Item`은 `Suffix`의 `Item`과 동일하므로 `where`절과 일치합니다.
    - 사실 위의 코드는 `SuffixableContainer`의 `where Suffix.Item == Item` 가 없더라도 컴파일에 문제가 없습니다. `Stack`이 제네릭 타입이기 때문에 메서드 구현 과정에서 타입 충돌의 여지가 없기 때문입니다.

 

### **where Suffix.Item == Item의 의미**

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-27-am-9.20.03.jpg)

`where Suffix.Item == Item`의 의미는 다음과 같습니다. `SuffixableContainer`를 구현하는 `DoubleStack`이라는 구조체를 만들었습니다. `Container`에 정의되어 있는 `append(_:)` 메서드와 `subscript`에 모두 `Double` 타입을 지정하였습니다. 앞서 언급한 컴파일러의 추론 기능으로 인해 `DoubleStack`의 연관 타입 `Item`은 `Double`로 추론이 된 상태입니다.

이 상태에서 `SuffixableContainer`에 정의되어 있는 `suffix(_:)`를 구현하고자 합니다. 이 메서드의 반환 타입은  `SuffixableContainer`에 따르면 `Suffix`라는 연관 타입입니다. 단, 조건이 있는데 `Suffix`의 `Item`은 `SuffixableContainer`(=>`Container`를 준수), 즉 자신(`Self`)의 `Item`과 동일한 타입이어야 한다는 것입니다.

그런데 위 `Suffix` 자리에 들어간 타입은 `Stack<Float>`입니다.  `Stack<Float>`는 꺾쇠 안의 타입이 연관 타입으로 추론되어 `Item` 타입이 `Float`로 추론된 상태입니다. 이렇게 되면 `Self.Item`은 `Double`인데, `Self.Suffix.Item`은 `Float`가 되어 `where`절의 조건과 맞지 않습니다. 따라서 컴파일러 오류가 발생하게 됩니다.

 

## **제네릭에서의 where**

- 제네릭에서 `where`절을 사용하면 연관 타입이 특정 프로토콜을 준수해야 하거나 특정 형식 파라미터와 연결된 형식이 같아야 한다고 요구사항을 지정할 수 있습니다.
- 제네릭 `where`절은 `where`키워드로 시작하고 그 뒤에 연관 타입에 대한 제약 조건 또는 어떠한 타입과 연관 타입 간의 동등 관계가 옵니다.

 

아래 예제는 두 개의 `Container` 인스턴스가 같은 순서로 같은 항목을 포함하는지 확인하는 `allItemsMatch`라는 일반 함수를 정의합니다. 이 함수는 모든 항목이 일치하면 `Bool` 값 `true`를 반환하고 일치하지 않으면 `false` 값을 반환합니다.

검사할 두 개의 컨테이너는 동일한 유형의 컨테이너일 필요는 없지만 동일한 타입의 항목을 보유해야 합니다. 이 요구 사항은 형식 제약 조건과 일반 `where` 절의 조합을 통해 표현됩니다.

```swift
func allItemsMatch<C1: Container, C2: Container>
    (_ someContainer: C1, _ anotherContainer: C2) -> Bool
    where C1.Item == C2.Item, C1.Item: Equatable {

        // 두 컨테이너에 동일한 개수의 항목이 포함되어 있는지 확인합니다.
        if someContainer.count != anotherContainer.count {
            return false
        }

        // 항목의 각 쌍을 확인하여 동일한지 확인합니다.
        for i in 0..<someContainer.count {
            if someContainer[i] != anotherContainer[i] {
                return false
            }
        }

        // 모든 항목이 일치하므로 true를 반환합니다.
        return true
}
```

- `C1` - `Container` 프로토콜을 준수해야 합니다.
- `C2` - `Contianer` 프로토콜을 준수해야 합니다.
- `C1.Item == C2.Item` - `C1`의 연관 타입 `Item`과 `C2`의 연관 타입 `Item`은 동일해야 합니다.
- `C1.Item: Equatable` - `C1`은 `Equatable` 프로토콜을 준수해야 합니다. `C2`를 언급하지 않은 것은 두 타입은 동일해야 한다는 조건이 선행되었으므로 `C1`이 `Equatable`이라면 `C2`도 마찬가지이기 때문에 중복 언급할 필요가 없기 때문입니다.

 

함수의 사용 예는 다음과 같습니다.

```swift
extension Array: Container {}

// Stack
var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")

// 배열(Array)
var arrayOfStrings = ["uno", "dos", "tres"]

if allItemsMatch(stackOfStrings, arrayOfStrings) {
    print("All items match.")
} else {
    print("Not all items match.")
}
// 결과: "All items match."
```

`Stack`과 `Array`는 다른 타입이지만 둘 다 `Container` 프로토콜을 준수하며 둘 다 동일한 타입 `String`의 값을 포함합니다. 따라서 이 두 `Container`를 파라미터로 사용하여 `allItemsMatch(_:_:)` 함수를 호출할 수 있습니다.

 

## **제네릭 where 절이 있는 extension**

`extension`에 `where` 절을 사용할 수 있습니다. 아래는 스택의 최상위 항목과 주어진 아이템이 일치하는지 검사하는 함수 `isTop(_:)`가 포함된 `extension`입니다.

```swift
struct Stack<Element>: Container { ... }

extension Stack where Element: Equatable {
    func isTop(_ item: Element) -> Bool {
        guard let topItem = items.last else {
            return false
        }
        return topItem == item
    }
}

```

- 일반적인 `where` 절 없이 이 작업을 수행하려고 하면 문제가 발생합니다.
- `isTop(_:)`의 구현은 `==` 연산자를 사용하지만 `Stack`의 `Element`는 `Equatable`를 준수하지 않았으므로 컴파일 에러가 발생합니다.
- `where` 절을 사용하면 스택의 항목이 Equatable을 준수할 때에만 `extension`이 `isTop(_:)` 메서드를 추가하도록 `extension`에 새 요구 사항을 추가할 수 있습니다.

동작 예는 다음과 같습니다.

```
if stackOfStrings.isTop("tres") {
    print("Top element is tres.")
} else {
    print("Top element is something else.")
}
// 결과: "Top element is tres."
```

 

만약 `Equatable`이 아닌 값을 조회하려고 하면 컴파일 에러가 발생합니다.

```swift
struct NotEquatable { }
var notEquatableStack = Stack<NotEquatable>()
let notEquatableValue = NotEquatable()
notEquatableStack.push(notEquatableValue)
notEquatableStack.isTop(notEquatableValue)
// Error: Referencing instance method 'isTop' on 'Stack' requires that 'NotEquatable' conform to 'Equatable'
```

 

프로토콜의 `extension`에도 제네릭 `where` 절을 사용할 수 있습니다. 아래 예제는 이전 예제의 `Container` 프로토콜을 확장하여 컨테이너의 첫째 값이 주어진 아이템과 일치하는지 여부를 검사하는 `startsWith(_:)` 메서드를 추가합니다.

```swift
extension Container where Item: Equatable {
    func startsWith(_ item: Item) -> Bool {
        return count >= 1 && self[0] == item
    }
}
```

역시 `==` 가 필요하기 때문에 `Equatable` 타입이 요구되므로 `where`절로 해당 조건을 추가합니다.

동작 예는 다음과 같습니다.

```
if [9, 9, 9].startsWith(42) {
    print("Starts with 42.")
} else {
    print("Starts with something else.")
}
// 결과: "Starts with something else."
```

 

위의 예제들은 `where` 절에서 `Item`이 특정 프로토콜을 준수하는지 여부를 물어봤지만, `where`절은 이뿐만 아니라 특정 타입과 일치하는지 여부도 지정할 수 있습니다.

아래 코드는 컨테이너의 아이템 타입이 `Double`인 경우 평균을 구하는 `average()` 메서드가 포함된 `extension`입니다.

```swift
extension Container where Item == Double {
    func average() -> Double {
        var sum = 0.0
        for index in 0..<count {
            sum += self[index]
        }
        return sum / Double(count)
    }
}

print([1260.0, 1200.0, 98.6, 37.0].average())
// 결과: "648.9"
```

<!-- \[the\_ad id="1801"\] -->

 

## **컨텍스트(상황, 문맥)적 where 절**

앞서 살펴본 `avarage()` 메서드는 `Item`이 `Double`이어야 함을 요구했습니다. 또 하나의 메서드를 추가하고자 하는데, 이번에는 특정 컨테이너의 마지막 아이템이 주어진 아이템과 일치하는지를 검사하는 `endsWith(_:)` 메서드를 추가하고 싶습니다. `extenson`을 사용한 `where`절을 사용하면 다음과 같습니다.

```swift
extension Container where Item == Int {
    func average() -> Double {
        var sum = 0.0
        for index in 0..<count {
            sum += Double(self[index])
        }
        return sum / Double(count)
    }
}

// 새로 추가
extension Container where Item: Equatable {
    func endsWith(_ item: Item) -> Bool {
        return count >= 1 && self[count-1] == item
    }
}

```

`endsWith(_:)`는 `Item: Equatable`을 요구하므로 `average`의 `where`절과는 일치하지 않습니다. 따라서 `extension`이 두 개가 되었는데 매번 `extension`을 추가하는 것은 별로 효율적이지 않을 것 같습니다.

컨텍스트적 `where` 절은 아래와 같이 메서드에 `where`절을 붙이는 방식입니다.

```swift
extension Container {
    // 평균 구하기
    func average() -> Double where Item == Int {
        var sum = 0.0
        for index in 0..<count {
            sum += Double(self[index])
        }
        return sum / Double(count)
    }
    
    // 끝 요소 확인
    func endsWith(_ item: Item) -> Bool where Item: Equatable {
        return count >= 1 && self[count-1] == item
    }
}

let numbersInt = [1260, 1200, 98, 37]
print(numbers.average())
// 결과: "648.75"
print(numbers.endsWith(37))
// 결과: "true"
```

이렇게 하면 함수 호출 단위로 타입 추론을 하기 때문에 확장에 `where`절을 지정할 필요가 없습니다. 이제 번거롭게 `extension`을 매번 추가하지 않아도 됩니다..

 

## **연관 타입과 where 절**

`SuffixableContainer` 코드에서 언급했듯이, 연관 타입에도 `where`절을 사용할 수 있습니다.

아래 코드는 `Iterator`라는 연관 타입을 추가하는데, `IteratorProtocol`을 준수하고 `Iterator`의 `Element`는 `Container`의 `Item`과 동일해야 한다는 조건을 지정하고 있습니다.

```swift
protocol Container2 {
    associatedtype Item
    mutating func append(_ item: Item)
    var count: Int { get }
    subscript(i: Int) -> Item { get }

    associatedtype Iterator: IteratorProtocol where Iterator.Element == Item
    func makeIterator() -> Iterator
}
```

 

다른 프로토콜에서 상속하는 프로토콜의 경우 프로토콜 선언에 `where` 절을 포함하여 상속된 관련 유형에 제약 조건을 추가합니다. 예를 들어 다음 코드는 `Item`(Container의 연관 타입)이 `Comparable`을 준수하도록 요구하는 `ComparableContainer` 프로토콜을 선언합니다.

```swift
protocol ComparableContainer: Container where Item: Comparable { }
```

 

## **Subscript에 제네릭 타입 사용**

```swift
extension Container {
    subscript<Indices: Sequence>(indices: Indices) -> [Item]
        where Indices.Iterator.Element == Int {
            var result: [Item] = []
            for index in indices {
                result.append(self[index])
            }
            return result
    }
}
```

- `subscript`는 배열, 사전에서 사용하는 `array[0]`과 같이 `[]` 괄호 안에 값을 넣어 사용하는 형태의 문법을 말합니다. 이를 통해 `class`, `struct`, `enum` 등의 요소에 쉽게 접근할 수 있는 문법을 제공합니다.
- `subscript`는 제네릭일 수 있으며 제네릭 `where` 절을 포함할 수 있습니다.
- 이 `extension`은 인덱스 시퀀스를 취하고 주어진 각 인덱스에 항목을 포함하는 배열을 반환하는 `subscript`를 추가합니다. 이 제네릭 `subscript`는 다음과 같이 제한됩니다.
    - `placeholder` 타입인 `Indices`는 `Sequence` 프로토콜을 준수해야 합니다.
    - `subscript`는 해당 `Indices` 유형의 인스턴스인 단일 매개변수 `indices`를 사용합니다.
    - `where` 절에서는 시퀀스의 반복자가 `Int` 유형의 요소를 순회해야 합니다. 이렇게 하면 시퀀스의 인덱스가 컨테이너에 사용되는 인덱스와 동일한 유형이 됩니다.
