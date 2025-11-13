---
title: "Swift 기초 (3): 함수 (function)"
date: 2020-01-18
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

\[rcblock id="3441"\]

* * *

#### **함수 (func)**

Swift의 함수는 자바스크립트의 함수와 개념적으로 매우 비슷합니다. 키워드로 `func`를 시용합니다.

```
func 함수이름(파라미터1: 자료형, 파라미터2: 자료형...) -> 리턴시자료형 {....return xxx....}
```

 

아래 예제는 함수의 기초 사용 형태입니다.

```
func greet(name: String, day: String) -> String {
    return "안녕하세요. \(name)씨, 오늘은 \(day)요일입니다."
}

print (greet(name: "박똑딱", day: "화"))
```

> 안녕하세요. 박똑딱씨, 오늘은 화요일입니다.

 

리턴이 필요 없는 경우 아래와 같이 사용합니다.

```
func greetNoReturn(name: String, day: String) {
    print("안녕하세요. \(name)씨, 오늘은 \(day)요일입니다.")
}
greetNoReturn(name: "노리턴", day: "일")
```

> 안녕하세요. 노리턴씨, 오늘은 일요일입니다.

 

**퀴즈1.** 인사말에 '오늘의 특별한 점심'을 포함하도록 매개변수를 추가하고 `String` 타입으로 인사말을 리턴하는 함수를 만드시오.

```
func greet2(menu: String) -> String {
    return "안녕하세요. 오늘의 특별한 점심은 \(menu)입니다."
}
greet2(menu: "치킨")
```

 

특이하게도 생성된 함수를 사용하려면 위의 `greet2(menu: "치킨")` 처럼 파라미터에 일일히 변수 이름 `menu`을 붙여야 되며, 붙이지 않으면 컴파일 에러가 납니다. 가져다 쓰는 측에서도 파라미터의 역할을 명확하게 알려주기 위함이라지만 약간의 불편을 유발합니다. 이러한 불편함은 `_` 이나 별칭을 지정함으로써 어느 정도 해결할 수 있습니다.

매개변수 이름 앞에 `_` 를 붙이고 **한 칸 띄우면** 나중에 사용할 때 변수 이름을 따로 붙이지 않아도 됩니다.

```
func greet(_ name: String, _ day: String) -> String {
    return "안녕하세요. \(name)씨, 오늘은 \(day)요일입니다."
}

print (greet("이뚝떡", "수"))
```

> 안녕하세요. 이뚝떡씨, 오늘은 수요일입니다.

 

\_ 대신 `다른 이름`을 입력하면 **별칭**이 되며, 함수를 가져다 사용할 시 별칭을 입력하여 사용할 수 있습니다.

```
func greet(이름 name: String, 요일 day: String) -> String {
    return "안녕하세요. \(name)씨, 오늘은 \(day)요일입니다."
}

print (greet(이름: "박똑띡", 요일: "목"))
```

> 안녕하세요. 박똑띡씨, 오늘은 목요일입니다.

 

위 두 경우 모두 함수를 구현할 때 사용하는 파라미터 이름과 구현된 함수를 가져다 사용할 때 사용하는 변수의 이름 차이에 주의하기 바랍니다

 

##### **튜플**

스위프트는 여러 개의 변수를 배열처럼 리턴할 수 있습니다. 하지만 배열과는 다르게 말 그대로 여러 개를 한 번에 리턴하므로 리턴된 변수도 여러개입니다. 이것을 튜플이라 합니다.

```
func getGasPrices(_ basePrice: Double) -> (Double, Double, Double){
    return (basePrice * 3.59, basePrice * 3.69, basePrice * 3.79)
}
print( getGasPrices(1021.1) )
```

> (3665.749, 3767.859, 3869.969)

 

##### **함수의 중첩 사용**

함수 안에 또 다른 함수를 지정하고 사용할 수 있습니다.

```
func calc(_ num1 : Int, _ num2 : Int, operand: String) -> Int {
    var result = 0
    
    func add() {
        result = num1 + num2
    }
    func doNothing() {
        
    }
    
    switch operand{
    case "+":
        add()
    default:
        doNothing()
    }
    
    return result
}
calc(10, 5, operand: "+") // 15
```

 

##### **일급 함수**

함수는 다른 함수를 리턴할 수 있고, 다른 함수의 리턴값을 파라미터 인자로 받을 수도 있습니다. 이것은 자바에는 없는 개념이며, 자바스크립트에서는 유명하면서 굉장히 광범위하게 쓰이고 있는 개념입니다.

아래는 어느 함수가 자신 안에 있는 다른 중첩 함수를 리턴합니다. 이것에 대해 함수를 실행 후 그 리턴값을 특정 변수에 옮겨담으면, 그 변수가 안에 있는 중첩 함수를 대신하게 되는 형태입니다.

```
func makeIncrementer() -> ((Int) -> Int) {
    func addOne(number: Int) -> Int {
        return number + 1
    }
    return addOne
}

var increment = makeIncrementer() // addOne을 리턴시키고 increment에 적재
print( increment(15) )   // 16
```

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-18-pm-11.17.22.png)

 

퀴즈 1. 연산자(`operand`)를 지정하면 매개 변수로 숫자 2개를 받으며 해당 사칙연산을 시행하는 함수를 리턴하는 `calc2` 함수를 작성하시오.

```
func calc2(operand: String) -> ((Int, Int) -> Int) {
    func add(_ num1: Int, _ num2: Int) -> Int {
        return num1 + num2
    }
    func subst(_ num1: Int, _ num2: Int) -> Int {
        return num1 - num2
    }
    func prod(_ num1: Int, _ num2: Int) -> Int {
        return num1 * num2
    }
    func divi(_ num1: Int, _ num2: Int) -> Int {
        return num1 / num2
    }
    
    switch operand{
        case "-":
        return subst
        case "*":
        return prod
        case "/":
        return divi
    default:
        return add
    }
}
(calc2(operand: "*"))(3, 6) // 18
(calc2(operand: "-"))(3, 6) // -3
(calc2(operand: "+"))(3, 6) // 9
(calc2(operand: "/"))(6, 3) // 2
```

 

아래는 특정 함수에서 다른 함수를 인자로 받아 사용하는 경우입니다.

```
func hasAnyMatches(list: [Int], condition: (Int) -> Bool) -> Bool {
    for item in list{
        if condition(item){
            return true
        }
    }
    return false
}

func lessThanTen(number: Int) -> Bool {
    return number < 10 // number가 10보다 작으면 true 반환
}
func lessThanFive(number: Int) -> Bool {
    return number < 5
}

var numbers = [20, 19, 7, 12, 25]
hasAnyMatches(list: numbers, condition: lessThanTen) // true
hasAnyMatches(list: numbers, condition: lessThanFive) // false
```

 

##### **클로저 표현식 (Closure expressions)**

함수의 중첩, 일급함수 등은 함수의 '**클로저(Closure)**'라는 개념과 밀접한 관련이 있습니다. 클로저 표현식은 이러한 클로저를 간편하게 표기할 수 있도록 합니다.

```
{ ( parameters ) -> return type in 
  statements
}
```

`in` 키워드는 필수로 들어가야 합니다.

아래 예제는 배열을 순환하는 `map` 기능을 이용하는데 원소가 홀수이면 0으로 치환하도록 하고 있습니다. `map` 기능은 함수를 파라미터로 받는데 여기서 함수를 클로저 표현식을 이용해 작성하고 있습니다.

```
var numbers2 = [19, 18, 37, 26]
var result2 = numbers2.map({ (number: Int) -> Int in
    var result = number
    if number % 2 != 0 {
        result = 0
    }
    return result
    
})
print(result2)
```

> \[0, 18, 0, 26\]

 

**퀴즈 1.** 위의 코드를 참조해 짝수일 경우 0을 반환하도록 수정하되, 클로저 표현식을 사용하지 말고 일반 함수를 사용해서 작성하시오.

```
func iter3(number: Int) -> Int {
    var result = number
    if number % 2 == 0 {
        result = 0
    }
    return result
}

var result3 = numbers2.map(iter3)
print(result3)
```

\[19, 0, 37, 0\]

 

**퀴즈 2.** 아래 사전 변수를 이용해 해당 학생이 95점 이상인 경우 '우수합격', 70점 이상인 경우 '합격' 이외의 경우는 불합격 처리하도록 하고 결과를 배열로 출력하시오. 단, 클로저 표현식을 사용하라.

```
var students = ["제임스": 67, "테일러": 56, "제이콥": 100, "빌리": 14, "대니얼": 70]
```

```
var result4 = students.map({ (name: String, score: Int) -> String in
    if score >= 95 {
        return "\(name): 우수합격"
    } else if score >= 70 {
        return "\(name): 합격"
    } else {
        return "\(name): 불합격"
    }
})
print(result4)
```

\["빌리: 불합격", "대니얼: 합격", "제이콥: 우수합격", "제임스: 불합격", "테일러: 불합격"\]

 

아래는 더욱 간단한 클로저 표현식 예제입니다.

먼저, 클로저 함수 안에 있는 코드가 유일한 단일 표현식이면서 특정 값을 반환한다고 기대할 수 있으면 `return` 키워드를 **생략**할 수 있습니다.

```
let mappedNumbers = numbers2.map({number in 3 * number})
print(mappedNumbers)
```

> \[57, 54, 111, 78\]

 

다음으로 스위프트에서 기본 제공하는 단축 인자를 사용하는 것입니다. 단축 인자의 이름은 `$0`, `$1`, `$2`...로 제공되며 이 인자를 사용 할 경우 `()` 괄호도 생략할 수 있어 결과적으로 `{}` 괄호만 사용하면 됩니다.

```
let sortedNumbers = numbers2.sorted{ $0 > $1 } // 내림차순 정렬
print(sortedNumbers)

// 위와 같은 동작을 하나 보다 복잡한 클로저 식으로 작성
let sortedNumbersComplex = numbers2.sorted(by: { (num1: Int, num2: Int) in
    return num1 > num2
})
```

> \[37, 26, 19, 18\]

 

\[rcblock id="3441"\]
