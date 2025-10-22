---
title: "Swift(스위프트): 타이머(Timer) 만들기"
date: 2021-01-09
categories: 
  - "DevLog"
  - "Swift"
---

타이머는 반복 작업 생성부터 지연 작업 예약까지 Swift에서 매우 편리하게 이용할 수 있습니다. 이 튜토리얼은 Swift에서 타이머를 만드는 방법을 설명합니다.

`Timer` 클래스를 설명하기 이전에, `NSTimer`라고 알려진 클래스를 사용하여 타이머를 추가하는 방법에 대해 설명합니다. 반복 및 비반복 타이머, RunLoop 사용, 타이머 추적, 에너지 및 전력 영향을 줄이는 방법에 대해 알아 봅니다.

> Run Loop는 작업을 스케줄링하거나, 전달되는 이벤트를 조정하기 위해 사용되는 이벤트 처리 루프를 말합니다. [링크](https://minosaekki.tistory.com/54)

 

#### **Swift로 반복 타이머를 만드는 방법**

Swift에서 반복 타이머를 만드는 것은 놀랍도록 간단합니다. _(??)_ 방법은 다음과 같습니다.

```
let timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(fire), userInfo: nil, repeats: true)

@objc func fire() 
{
    print("FIRE!!!")
}
```

- 타이머는 `Timer.scheduledTimer(...)` 클래스 메서드를 사용하여 생성됩니다 . 반환 값은 상수 `timer`에 할당됩니다. 이 상수는 이제 타이머에 대한 참조를 포함하며 나중에 편리하게 사용할 수 있습니다.
- `scheduledTimer()`의 매개변수는 1초의 타이머 간격으로 _target-action_이라는 메커니즘을 사용합니다. `userInfo`는 `nil`로 설정하고 매개변수 `repeats`는 `true`로 설정합니다.
- 또한 `fire()` 함수를 생성했습니다. 이것은 타이머가 실행될 때, 즉 대략 1초마다 호출되는 함수입니다. `target`에 `self`를 설정하고 `selector`에 `#selector(fire)`를 설정함으로써 타이머가 실행될 때마다 `self` 내의 `fire()` 함수가 호출되어야 한다는 것을 지정할 수 있습니다.

 

위의 코드는 뷰 컨트롤러 클래스와 같은 클래스 컨텍스트에서 실행되어야합니다. 이 `fire()` 함수는 클래스의 일부이며 `self`는 현재 클래스 인스턴스를 참조합니다.

 

> `@objc` 속성은 Objective-C에서 `fire()` 함수를 사용할 수 있도록합니다. `Timer` 클래스는 Objective-C 런타임의 일부이므로 `@objc` 속성이 필요합니다.

 

 

클로저를 사용하여 타이머를 만들 수도 있습니다.

```
let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true, block: { timer in
    print("FIRE!!!")
})
```

위의 코드에서 마지막 매개 변수 `block`은 클로저를 가집니다. 클로저에는 하나의 매개변수 `timer`가 있습니다.

 

_target-action_이 있는 타이머와 `self` 키워드는 클래스 또는 구조체를 생성하지 않는 한 Xcode playground에서 작동하지 않습니다. 다음은 Xcode playground에서 타이머를 만드는 데 사용할 수 있는 코드입니다.

```
import PlaygroundSupport
import UIKit

PlaygroundPage.current.needsIndefiniteExecution = true

let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true, block: { timer in
    print("FIRE!!!")
    PlaygroundPage.current.finishExecution()
})

```

위의 코드에서는 `needsIndefiniteExecution`을 `true`로 설정하여 플레이 그라운드가 완료될 때 플레이 그라운드 실행이 자동으로 중지되지 않도록 합니다. 타이머는 이런 식으로 실행할 수 있으며, 그 시점에서 `finishExecution()`을 호출하여 플레이 그라운드를 중지합니다.

 

트레일링 클로저(trailing closure) 구문 덕분에 클로저 기반 타이머를 더욱 간결하게 만들 수 있습니다.

```
let timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { timer in
    print("FIRE!!!")
}
```

마지막 인수 레이블이 어떻게 생략되는지 보이십니까? 매개 변수의 마지막이 클로저이기 때문입니다. 코드를 더 간결하게 만듭니다. 깔끔하네요!

 

#### **타이머 및 비반복 타이머 관리**

이전 예제에서는 5개의 매개변수를 사용하여 타이머를 생성했습니다.

- `timeInterval`: 타이머 실행 간격(초), `Double` 타입입니다.
- `target`: 함수 `selector`가 호출되어야 하는 클래스 인스턴스, 보통은 `self` 입니다.
- `selector`: 타이머가 실행될 때 호출 할 함수, `#selector(...)` 의 형태로 사용합니다.
- `userInfo`: `selector` 에게 제공되는 데이터가 있는 `dictionary`, 없으면 `nil`
- `repeats`: 타이머의 반복 여부. `Bool` 타입입니다.

 

반복되지 않는 타이머를 만드는 것은 `repeats` 매개 변수를 `false`로 설정하면 됩니다. 타이머는 한 번만 실행되고 즉시 무효화됩니다.

 

그렇다면 반복 타이머를 어떻게 중지하나요? 방법은 다음과 같습니다.

```
timer.invalidate()
```

 

예를 들어 타이머를 사용하는 클래스의 저장된 속성(stored property)을 통해 `timer` 변수를 어딘가에서 추적할 수 있습니다. 이 속성을 사용하여 타이머를 관리 할 수 있습니다.

`userInfo`를 사용하여 타이머에 추가 정보를 첨부할 수도 있습니다. 이 값은 `timer` 매개변수를 통해 실행되는 함수로 전송됩니다. 예를 들면 다음과 같습니다.

```
let timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(fire(timer:)), userInfo: ["score": 10], repeats: true)

@objc func fire(timer: Timer) 
{
    if  let userInfo = timer.userInfo as? [String: Int],
        let score = userInfo["score"] {

        print("You scored \(score) points!")
    }
}
```

위의 코드에서 타이머에 사전(dictionary) `["score": 10]`을 추가했습니다. 실행되면 이 사전은 `timer.userInfo`로 `fire(timer:)` 함수에 전달됩니다. `fire(timer:)` 함수 내에서 `userInfo` 속성이 예상한 타입인지 확인하고 해당하는 값을 얻습니다.

다음으로 타이머 사용에 대한 실제 예를 살펴 보겠습니다.

 

#### **카운트다운 타이머 만들기**

게임을 만들고 있다고 상상해보세요. 사용자는 60초 동안 퍼즐을 풀고 점수를 얻습니다. 카운트다운 타이머가 만료되면 남은 시간(초)을 추적합니다.

먼저, 게임 클래스의 맨 위에 두 개의 속성을 만듭니다.

```
var timer:Timer?
var timeLeft = 60
```

타이머는 즉시 시작되지 않습니다. 시작될 때까지 `timer` 속성은 `nil` 입니다. 어느 시점에서 게임이 시작될 때 타이머도 시작합니다.

```
timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(onTimerFires), userInfo: nil, repeats: true)
```

타이머는 `onTimerFires()` 함수를 매 초마다 무기한으로 호출합니다. 해당 함수는 다음과 같습니다.

```
@objc func onTimerFires()
{
    timeLeft -= 1
    timeLabel.text = "\(timeLeft) seconds left"

    if timeLeft <= 0 {
        timer?.invalidate()
        timer = nil
    }
}
```

타이머가 실행될 때마다 `timeLeft`에서 1을 빼고 "남은 시간"의 레이블을 업데이트합니다. 타이머가 0에 도달하면 `timer`가 무효화되고 `nil`로 설정됩니다.

이렇게하면 60에서 0까지 카운트 다운하는 카운트다운 타이머가 생성됩니다. 그리고 나중에 당연히 카운트다운을 재설정하고 다시 시작할 수 있습니다.

 

#### **타이머, Run Loop 및 허용 범위(Tolerance)**

타이머는 run loop(실행 루프)와 함께 작동합니다. run loop는 스레드와 동시성(concurrency)의 토대입니다.

관람차와 같은 run loop를 상상하는 것이 가장 쉽습니다. 사람들은 승용차에 타고 바퀴로 움직일 수 있습니다. 비슷한 방법으로 run loop에서 작업을 예약 할 수 있습니다. run loop는 "순환(looping)"을 유지하고 작업을 실행합니다. 실행할 작업이 없으면 run loop가 대기하거나 종료됩니다.

run loop와 타이머가 함께 작동하는 방식은 run loop가 타이머가 실행(fire)되어야하는지 확인하는 것입니다. 타이머의 실행은 이미 다른 작업을 실행중인 run loop와 일치할 수 있기 때문에 타이머는 실시간 메커니즘이 아닙니다. 관람차 대기소에 아직 도착한 관람차가 없을 때 관람차에 들어가고 싶은 것과 비교할 수 있습니다. 그 결과 타이머가 예정된 시간보다 늦게 실행될 수 있습니다.

이것이 반드시 나쁜 것은 아닙니다. 에너지 및 전력 제약이있는 모바일 장치에서 코드를 실행하고 있음을 잊지 마세요! 기기는 전원을 절약하기 위해 run loop를 보다 효율적으로 예약할 수 있습니다.

또한 `tolerance` (허용 오차) 라는 타이머 속성을 사용하여 시스템의 전원 절약을 도움받을 수 있습니다. 이렇게 하면 스케줄링 시스템에 다음과 같이 통보할 수 있습니다. _"이것이 매초마다 실행되기를 원하지만 0.2초가 늦어도 상관은 없습니다."_  물론 이것은 앱에 따라 다릅니다. Apple은 반복 타이머에 대해 최소 10%의 간격 시간으로 `tolerance`를 설정할 것을 권장합니다.

```
let timer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(fire), userInfo: nil, repeats: true)
timer.tolerance = 0.2
```

 

`tolerance` 속성은 `timeInterval` 속성과 동일한 단위를 사용하므로 위 코드는 200밀리초의 허용 오차를 사용합니다.

허용 오차로 인해 타이머가 _일찍_ 실행되지는 않습니다. 그리고 허용 오차로 인해 타이머가 "드리프트(drift)" 되지 않습니다. 즉, 타이머의 한 부분이 늦게 실행되더라도 다음 타이머의 예정된 시간에 영향을 주지 않습니다.

`Timer.scheduledTimer(...)` 클래스 메서드를 사용하는 경우 타이머는 기본 모드의 현재 run loop에서 자동으로 예약됩니다. 이것은 일반적으로 메인 스레드(main thread)의 run loop입니다. 따라서 앱 사용자가 UI와 상호 작용하는 경우와 같이 기본 스레드의 실행 루프가 사용 중일 때 타이머가 실행되지 않을 수 있습니다.

직접 `RunLoop`에서 타이머를 수동으로 예약하여 이 문제를 해결할 수 있습니다. 방법은 다음과 같습니다.

```
let timer = Timer(timeInterval: 1.0, target: self, selector: #selector(fire), userInfo: nil, repeats: true)

RunLoop.current.add(timer, forMode: .commonModes)
```

첫 번째 코드 줄은 `Timer(...)` 이니셜라이저를 사용하여 `Timer` 인스턴스를 만듭니다. 코드의 두 번째 줄은 `.commonModes` 입력 모드(input mode)를 사용하여 현재 run loop에 타이머를 추가합니다. 요컨대, 이는 run loop에 모든 "공통(common)" 입력 모드에 대해 타이머를 확인해야 함을 알려주므로 UI와 상호작용하는 동안 타이머가 효과적으로 실행될 수 있습니다.

그건 그렇고, 좌절감의 일반적인 원인은 `Timer.scheduledTimer(...)`를 사용하여 타이머를 만들려고 할 때 실수로 `Timer(...)` 이니셜라이저를 사용하는 것입니다. `Timer(...)`를 사용하면 `RunLoop`에 추가 할 때까지 타이머가 실행되지 않습니다! 타이머를 올바르게 예약했다고 확신할 것이기 때문에 골치가 아플 것입니다.

 

#### **지연된 코드 실행**

실제 iOS 개발의 일반적인 시나리오는 약간의 지연으로 일부 코드를 실행하는 것입니다. `Timer`를 사용하지 않고 _Grand Central Dispatch_를 사용하는 것이 가장 쉽습니다.

다음 코드는 300밀리초 지연으로 메인 스레드에서 작업을 실행합니다.

```
DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(300)) {  
    print("BOOYAH!")
}
```

타이머를 사용하는 것보다 더 간결합니다. 한 번만 실행하기 때문에 타이머를 계속 추적할 필요가 없습니다.

 

출처: [Working with Timers in Swift](https://learnappmaking.com/timer-swift-how-to/)
