---
title: "Swift 기초 (2): if 문, for ~ in 문, while 문, switch 문"
date: 2020-01-16
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

\[rcblock id="3441"\]

* * *

#### **if 문 (if...else, if...else i...else)**

`if`문은 조건에 따라 해야 될 작업을 분기할 때 사용합니다. 참고로 조건문에 괄호를 붙이지 않습니다.

```
var myScore = 56

if myScore >= 50 {
    print("\(myScore)점: 합격")
} else {
    print("\(myScore)점: 불합격")
}
```

 

복수의 조건에 따라 분기하고자 할 때는 `else if` 문을 추가합니다.

```
if myScore >= 80 {
    print("\(myScore)점: 우수합격")
} else if myScore >= 50 {
    print("\(myScore)점: 합격")
} else {
    print("\(myScore)점: 불합격")
}
```

 

#### **for ~ in 문**

`for`문은 반복되는 작업을 수행할 때 사용합니다. 앞서 언급한 배열, 사전과 궁합이 잘 맞습니다. 참고로 조건문에 괄호를 붙이지 않습니다.

`for [for문_내부에서_사용할_변수이름] in [범위] { ..... }`

 

95, 65, 70, 54, 77의 원소가 들어 있는 ‘`성적`‘ 이라는 이름의 상수 배열을 생성하고, 원소들의 총합을 `for...in` 문을 이용해 계산하는 방법은 다음과 같습니다.

```
let 성적 = [95, 65, 70, 54, 77]
var sumOf성적 = 0
for score in 성적 {
    sumOf성적 += score
}
```

 

`for...in` 문의 범위에는 사전이나 배열이 들어갈 수도 있지만, 일반 숫자가 들어갈 수도 있습니다. 1에서 12까지 총 12번을 반복하고 싶다면 범위에 `1...12`를 입력합니다. (또는 `1..<13`)

```
var sum = 0

for i in 1...100 {
    sum += i
}

print(sum) // 5050
```

 

**퀴즈 1**. if문을 이용해 위 '성적' 배열의 각 점수의 합불 여부를 표시하시오. 단, 70점 이상이어야 합격 처리한다.

```
for score in 성적 {
    if score >= 70 {
        print("\(score)점: 합격")
    } else {
        print("\(score)점: 불합격")
    }
}
```

> 95점: 합격 65점: 불합격 70점: 합격 54점: 불합격 77점: 합격

 

#### **while 문 (while, repeat...while)**

`while`문은 일반적으로 `for`문의 하위 호환격인 문법으로 알려져 있으나, `while`문에서만 독자적으로 처리할 수 있는 케이스도 있으므로 알아두는 것이 좋습니다. `repeat...while`문은 다른 프로그래밍 언어의 `do...while`문에 해당하는 구문입니다.

```
===== while 문 =====

var n = 2
while n < 100 {
    n = n * 2
}
print(n)    // 128

===== repeat...while 문 =====

var m = 2
repeat {  
    m *= 2
} while m < 100
print(m)    // 128
 

```

 

#### **switch 문**

`break`에 해당하는 기능이 기본 내장되어 있기 때문에 별도 명시할 필요가 없으며, `default` 문이 반드시 들어가야 합니다.

```
let vegetable = "red pepper"
var vegetableComment = ""

switch vegetable {
    case "celery":
         vegetableComment = "Add some raisins and make ants on a log."
    case "cucumber", "watercress":
        vegetableComment = "That would make a good tea sandwich."
    case let x where x.hasSuffix("pepper"):   // vegetable을 상수 x로 옮기고, 조건은 문장의 끝이 pepper인가?
        vegetableComment = "Is it a spicy \(x)?"
    default:
        vegetableComment = "Everything tastes good in soup."
}
print(vegetableComment)
```

> Is it a spicy red pepper?

 

\[rcblock id="3441"\]
