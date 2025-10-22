---
title: "Swift 기초 (7): 에러 처리 (Error Handling)"
date: 2020-01-20
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

\[rcblock id="3441"\]

#### **에러 처리**

자바의 예외 처리처럼 스위프트도 프로그램 내에서 발생한 에러들을 처리하는 기능이 있습니다. 여러 키워드들이 사용되는데, `Error`, `throws`, `throw`, `do ~ catch`, `try` 등이 사용됩니다.

 

프린터 출력 프로그램을 작성한다고 가정합니다. 먼저 프린트 출력 시 발생할 수 있는 에러의 경우를 `Enum` 형태로 나열해 보겠습니다. 이 때 `Error`라는 키워드를 추가해 정의합니다.

```swift
// 발생할 수 있는 에러에 대해 나열: Error
enum PrinterError: Error {
    case outOfPaper
    case noToner
    case onFire
}
```

 

다음으로 프린트 과정을 진행하는 함수를 작성하도록 하겠습니다. 이 때, `throws` 키워드를 함수 선언시 추가하여 이 함수는 에러를 던질 수 있다는 것을 컴파일러에게 알려주고, 실제 에러가 발생했을 시엔 `throw` 키워드를 추가해 에러를 던지도록 합니다.

```swift
// throws: 메소드, 함수 등이 에러를 던질 수 있다는 것을 선언
// throw: 해당 에러를 던짐
func send(job: Int, toPrinter printerName: String) throws -> String {
    if printerName == "토너없음" {
        throw PrinterError.noToner
    }
    return "문서 전송 완료"
}
```

 

다음 위의 함수를 사용해 실제 인쇄 작업을 진행해보도록 하겠습니다. 이 때 위 함수는 에러를 던질 수 있으므로 `do ~ catch` 키워드를 사용해 에러처리를 합니다. 그리고 여기서 자바와 다른 점으로 실제 `send()` 함수를 실행할 때 앞에 `try` 키워드를 붙여 에러에 대해 미리 대비를 합니다.

```swift
do {

    let printerResp2 = try send(job: 2, toPrinter: "마젠타러버")
    print(printerResp2)
    
    let printerResp1 = try send(job: 1, toPrinter: "토너없음")
    print(printerResp1)
    
} catch {
    print(error) // error: 에러 객체 (예약된 키워드)
}
```

> 문서 전송 완료 noToner

 

위에 있는 `printerResp2` 는 무사히 실행되었지만, 그 아래는 에러가 발생해서 `catch` 절로 넘어가게 되었습니다. 이 때 `catch`절의 `error`는 에러 객체로 예약된 키워드입니다.

 

아래 코드는 여러 단계로 `catch` 절이 있는 경우입니다. 일단 어느 블록에서 캐치가 되고 나면 그 아래에 있는 캐치절은 무시됩니다.

```swift
do {
    let err1 = Int.random(in:1...3) <= 2 ? PrinterError.outOfPaper : PrinterError.onFire
    throw err1
   
} catch PrinterError.onFire {
    print("I'll just put this over here, with the rest of the fire.")
} catch let printerError as PrinterError {
    print("Printer error: \(printerError).")
} catch {
    print(error)
}
```

> I'll just put this over here, with the rest of the fire.

 

##### **옵셔널로 에러 처리하기**

`try?` 키워드를 사용하면 성공한 경우 옵셔널 값으로 성공 결과를 내보내고, 실패했다면 `nil`을 내보냅니다. 코드 분량이 훨씬 줄어드는 효과가 있습니다.

```swift
let printerSuccess = try? send(job: 1884, toPrinter: "마젠타러버")
let printerFailure = try? send(job: 1885, toPrinter: "토너없음")

print(printerSuccess ?? "nil", printerFailure ?? "nil")
```

> 문서 전송 완료 nil

 

아래는 옵셔널로 에러 처리하기의 예제입니다. 참고로 `defer` 는 해당 스코프의 모든 코드가 실행된 후 마지막으로 실행되는 부분을 지정할 때 사용합니다.

```swift
var fridgeIsOpen = false
let fridgeContent = ["milk", "eggs", "leftovers", "rottenApple"]

func fridgeContains(_ food: String) throws -> Bool {
    fridgeIsOpen = true
    
    defer {
        print("---여기는 DEFER---")
        fridgeIsOpen = false
    }
    
    if food == "rottenApple" {
        print("---여기는 IF---")
        throw PrinterError.onFire
    }
    
    let result = fridgeContent.contains(food)
    return result
}

let openFridge = try? fridgeContains("rottenApple")

print(openFridge ?? "nil")
print(fridgeIsOpen)
```

> \---여기는 IF--- ---여기는 DEFER--- nil false

 

\[rcblock id="3441"\]
