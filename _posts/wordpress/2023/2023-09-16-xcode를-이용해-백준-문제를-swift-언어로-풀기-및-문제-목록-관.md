---
title: "Xcode를 이용해 백준 문제를 Swift 언어로 풀기 및 문제 목록 관리 + 값 입력 받는 방법"
date: 2023-09-16
categories: 
  - "DevLog"
  - "Swift"
  - "코딩테스트"
---

### **소개**

[https://www.acmicpc.net](https://www.acmicpc.net) (백준 온라인 평가)에 나와있는 코딩테스트 문제에서 인풋은 어떻게 처리하며, 또 문제 관리를 Xcode로 하는 방법에 대해 설명합니다.

 

#### **문제 관리 프로젝트 추가**

##### **1) Command Line Tool 프로젝트 생성**

Xcode 상단에서 `File > New > Project...` (단축키 `command + shift + N`)을 누른 뒤 아래 스크린샷과 같이 `macOS > Command Line Tool` 프로젝트를 생성합니다.

 ![](/assets/img/wp-content/uploads/2023/09/스크린샷-2023-09-16-오후-10.56.18-복사본.jpg)

`Command Line Tool` 프로젝트를 이용하는 이유는 인풋값을 받는 `ReadLine()` 함수를 이 프로젝트에서 사용할 수 있기 때문입니다.

 

##### **2) 퀴즈 폴더 생성**

프로젝트를 생성하면 `main.swift`가 기본으로 제공됩니다. 한 문제만 풀 것이라면 여기서 작성해도 되지만 여러 문제를 풀고 관리하려면 아래와 같이 `Question` 폴더를 생성합니다.

 ![](/assets/img/wp-content/uploads/2023/09/스크린샷-2023-09-16-오후-10.59.49-복사본.jpg)

지금은 두 문제만 풀었으므로 Question 폴더 내에 파일이 2개이지만, 앞으로 여러 문제들을 파일 형태로 계속 추가할 수 있습니다.

 

##### **3) 문제풀이 컨테이너 함수 생성**

예를 들어 [백준 2798번](https://www.acmicpc.net/problem/2798) 문제가 있다면 해야할 작업은 다음과 같습니다.

1. `Question` 폴더 내에 `2798.swift` 파일 생성
2. 인풋(입력값)을 받은 뒤
3. 문제 풀이
4. 결과값을 `print(...)`로 출력

먼저 `Question` 폴더 내에 `2798.swift` 파일을 생성합니다. 파일을 열고 풀이 코드를 다음과 같이 함수 형태 `func Q_2798() {...}` 로 래핑합니다. 래핑의 목적은 나중에 Dictionary 형태로 문제 함수를 저장해서 불러오기 쉽게 하기 위함입니다.

```
import Foundation

func Q_2798() {
    var result = 0
    print(result)
}
```

 

##### **4) 입력값 처리**

입력값 형태에 따라 아래 목록 중에 하나를 선택해서 입력값을 처리합니다. 입력값은 `ReadLine`이라는 함수로 처리합니다. (자바의 `Scanner`와 같은 역할)

적당한 곳에 메모해서 복붙해서 필요할 때마다 사용합니다. 저는 프로젝트 내의 `README.md` 파일에 저장해 놓았습니다.

**`ReadLine`으로 Input 입력받기**

```
* 정수 한 개 입력
let input = Int(readLine()!)!

* 정수 여러 개 입력 (스페이스 구분자)
let input: [Int] = readLine()!.split(separator: " ").map { Int(String($0))! }

* 문자열 한 개 입력
let inputs = readLine()!

* 문자열 여러 개 입력 (스페이스 구분자)
let inputs = readLine()!.split(separator: " ")
또는
let inputs = readLine()!.split { $0 == " " }

* 값을 여러 개 받음 (구분자 없음, 예: 123456, "ABCDEF")
** 숫자인 경우
let inputs = Array(readLine()!).map { Int(String($0))! }
** 스트링인 경우
let inputs = Array(readLine()!).map { String($0)! }
```

 

##### **5) 문제 풀기 및 출력**

**중요:** 출력은 `print(...)`를 이용합니다.

```
import Foundation

func Q_2798() {
    let NM: [Int] = readLine()!.split(separator: " ").map { Int(String($0))! }
    let N = NM[0]
    let M = NM[1]

    let cards: [Int] = readLine()!.split(separator: " ").map { Int(String($0))! }
    
    var result = 0
    for i in 0..<N {
        for j in (i + 1)..<N {
            for k in (j + 1)..<N {
                let sum = cards[i] + cards[j] + cards[k]
                if sum <= M {
                    result = max(result, sum)
                }
            }
        }
    }
    
    print(result)
}

```

 

##### **6) 문제 실행 및 목록 관리**

기본 제공되는 `main.swift` 파일을 열어 아래와 같이 작성합니다.

```
import Foundation

let questionDict: [Int: (() -> Void)] = [
    2798: Q_2798,
    18108: Q_18018,
]

func question(_ number: Int) {
    print("======== Question \(number) ========")
    questionDict[number]!()
}

let targetQuestion =
18108

question(targetQuestion)

```

- `questionDict` - 문제 함수를 사전 형태로 저장하고 불러옵니다.
- `question(_:)` - 파라미터에 문제 번호를 입력하면 사전으로부터 문제함수를 불러와 실행합니다.
- `targetQuestion` - 다음 줄에 문제 번호를 적으면 해당 문제가 실행됩니다.
- `question(targetQuestion)` - 해당 문제 함수를 실행하는 부분입니다.

문제 파일을 추가할 때마다 `questionDict`에 해당 함수를 추가하면 됩니다. 함수 이름을 숫자로만 해서 바로 실행하면 좋겠지만 함수 명명 규칙에서 이름의 첫자는 문자 또는 언더스코어(\_)로만 시작할 수 있습니다.

추가 작업이 끝나고, 해당 번호의 문제를 실행하고 싶다면 `targetQuestion` 밑줄에 숫자만 바꾸면 됩니다.

 

`command + R`을 눌러 프로그램을 실행한 뒤 입력값을 붙여넣기 하고 결과가 출력되는것을 확인합니다.

 ![](/assets/img/wp-content/uploads/2023/09/스크린샷-2023-09-16-오후-11.14.58-복사본.jpg)

 

#### **백준 사이트에 제출할 때**

`func Q_2798() {...}`으로 감싼 부분은 제외하고, `import Foundation`과 같은 프레임워크를 불러오는 부분은 필요한 경우 추가합니다.

 ![](/assets/img/wp-content/uploads/2023/09/스크린샷-2023-09-16-오후-11.19.16-복사본.jpg)
