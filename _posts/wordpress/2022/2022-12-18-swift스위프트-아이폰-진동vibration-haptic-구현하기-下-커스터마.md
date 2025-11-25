---
title: "Swift(스위프트): 아이폰 진동(Vibration, Haptic) 구현하기 下 (커스터마이징)"
date: 2022-12-18
categories: 
  - "DevLog"
  - "Swift"
---

**이전 글**

- [Swift(스위프트): 아이폰 진동(Vibration, Haptic) 구현하기 上 (기초)](/posts/swift스위프트-아이폰-진동vibration-haptic-구현하기-上-기초/)

 

## **Core Haptics를 사용하여 사용자 지정 진동을 재생하는 방법**

_**Core Haptics**_는 아이폰의 Taptic Engine(탭틱 엔진)에서 발생하는 진동, 더 자세히 말하면 정밀한 타이밍과 동작(behaviors)에 의해 동작하는 다양한 진동과 음향 효과를 정의할 수 있게 해줍니다. 이러한 진동들은 말로 설명하기보다는 직접 느껴보는 것이 좋지만, 애플이 사용하는 단어들은

- **강도(intensity)** - 진동의 상대적 강도
- **선명도(sharpness, 날렵함)** - 진동이 무딘(dull)지, 정밀(precise)한지 여부

와 같은 것들입니다.

 

## **사전 준비**

### **단계 1: import CoreHaptics 및 CustomHaptics 클래스 생성**

`CoreHaptics`를 `import`하고 `CustomHaptics` 클래스를 생성합니다.

```swift
import CoreHaptics

class CustomHaptics { 

}
```

 

### **단계 2: CHHapticEngine 타입의 멤버 변수 추가**

클래스의 멤버 변수로 `CHHapticEngine` 타입의 인스턴스를 저장하는 `engine` 변수를 추가합니다.

```swift
var engine: CHHapticEngine?
```

 

### **단계 3: 기기의 햅틱 지원 여부 확인**

해당 엔진의 인스턴스를 생성하기 전에 다음과 같은 코드를 사용하여 현재 장치에서 햅틱이 지원되는지 확인해야 합니다.

```swift
guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else { return }
```

 

### **단계 4: 생성자(constructor) 추가**

생성자 부분을 작성합니다.

```swift
init?() {
    guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
        return nil
    }
    
    do {
        engine = try CHHapticEngine()
        try engine?.start()
        
        handleEngineStop()
        prepareResetEngine()
    } catch {
        print("There was an error creating the engine: \(error.localizedDescription)")
        return nil
    }
}
```

- **init?()**
    - 생성자 키워드에 물음표(`?`)를 붙이면 `nil`의 가능성이 있는 `CustomHaptics?` 인스턴스가 생성됩니다.
    - 햅틱을 지원하지 않는 기기에서도 문제가 발생하지 않도록 모든 메서드를 `nil`로부터 안전한 방식으로 실행할 수 있습니다(optional chaining).
- **engine = try CHHapticEngine()** **try engine?.start()**
    - 햅틱 엔진을 할당하고 실행합니다.
- **handleEngineStop()** **prepareResetEngine()**
    - 엔진이 멈추거나(stop) 리셋할 필요가 있는 경우를 대비해 콜백 부분을 작성합니다.
- **return nil**
    - 햅틱을 지원하지 않거나 에러가 발생한 경우 `nil`을 리턴시킵니다.

 

### **단계 5: 추가 콜백 작성**

엔진이 멈추거나(stop) 리셋할 필요가 있는 경우를 대비해 콜백 부분을 작성합니다.

```swift
private func handleEngineStop() {
    // The engine stopped; print out why
    engine?.stoppedHandler = { reason in
        print("The engine stopped: \(reason)")
    }
}

private func prepareResetEngine() {
    // If something goes wrong, attempt to restart the engine immediately
    engine?.resetHandler = { [weak self] in
        print("The engine reset")

        do {
            try self?.engine?.start()
        } catch {
            print("Failed to restart the engine: \(error)")
        }
    }
}
```

 

## **햅틱의 intensity, sharpness 조절하기**

햅틱은 _**intensity(강도)**_와 _**sharpness(선명도)**_로 신호를 조절할 수 있습니다. `0.0`부터 `1.0`까지 조절할 수 있으며 기본값은 `1.0`입니다.

- 강도는 말 그대로 햅틱의 세기로 `0.0`으로 하면 햅틱을 느낄 수 없습니다.
- 선명도는 햅틱의 날카로움 정도를 의미하고 `1.0`으로 갈수록 햅틱이 날렵해지며, `0.0`인 경우 상당히 기묘한 느낌의 뭉툭한 햅틱을 발생시킵니다.

 

이러한 수치 조절은 `CHHapticEventParameter(...)`로 할 수 있습니다.

```swift
let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: intensityValue)
let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: sharpnessValue)
```

 

> **참고)**
> 
> 아래 메서드를 통해 다양한 수치의 햅틱을 체험해볼 수 있습니다. UI 부분에 대한 설명은 분량상 생략합니다.
> 
> ```swift
> func generateHaptic(intensity intensityValue: Float, sharpness sharpnessValue: Float) {
>     guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
>         return
>     }
>     
>     let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: intensityValue)
>     let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: sharpnessValue)
>     
>     let events = [
>         CHHapticEvent(eventType: .hapticTransient, parameters: [intensity, sharpness], relativeTime: 0),
>     ]
>     
>     startEvents(events)
> }
> ```
> 
>  
> 
> 뷰 컨트롤러에 `CustomHaptics` 멤버 변수를 `viewDidLoad(_:)`에서 초기화하고 IBAction 이벤트로 아래 부분을 추가합니다.
> 
> ```
> @IBAction func btnActGenerateCustomHaptic(_ sender: UIButton) {
>     customHaptics?.generateHaptic(intensity: slideIntensity.value, sharpness: slideSharpness.value)
> }
> ```
> 
>  ![](/assets/img/wp-content/uploads/2022/12/IMG_6AB6B4BF90EB-1.jpeg)

 

## **햅틱 이벤트 생성**

햅틱의 종류는 크게 `hapticTransient`, `hapticContinuous`로 나눌 수 있습니다.

- **hapticTransient:** 짧은(transient) 햅틱이 발생합니다. 지속시간 개념이 없습니다.
- **hapticContinuous:** 지속되는(continuous) 햅틱이 발생합니다. 지속시간 개념이 있어서 길이를 조절할 수 있습니다.

햅틱 이벤트는 `CHHapticEvent`를 이용해 발생시킵니다.

 

### **.hapticTransient**

```swift
CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 0)

// 파라미터 지정
CHHapticEvent(eventType: .hapticTransient, parameters: [
    intensity,
    sharpness,
], relativeTime: 0.5)
```

- **eventType**
    - 이벤트 타입을 지정합니다.
- **parameters**
    - 파라미터를 `[CHHapticEventParameter]` 타입으로 지정합니다.
    - 지정하지 않으면, 즉 빈 배열이라면 intensity `1.0`, sharpness `1.0`의 햅틱을 발생시킵니다.
- **relativeTime**
    - 시작 시간을 초(second) 단위로 지정합니다.

 

### **.hapticContinuous**

```swift
CHHapticEvent(eventType: .hapticContinuous, parameters: [], relativeTime: 0.6, duration: 0.5)
```

- **duration:** 지속 시간을 초 단위로 지정합니다.

 

## **햅틱 이벤트 발생**

이러한 `[CHHapticEvent]` 배열을 이용하여 복수의 이벤트를 발생시킬 수 있습니다. 클래스 안에 다음의 메서드를 추가합니다.

```swift
private func startEvents(_ events: [CHHapticEvent]) {
    do {
        let pattern = try CHHapticPattern(events: events, parameters: [])
        let player = try engine?.makePlayer(with: pattern)
        try player?.start(atTime: 0)
    } catch {
        print("Failed to play pattern: \(error.localizedDescription).")
    }
}
```

- **events**
    - 이벤트 배열 `[CHHapticEvent]` 입니다.
- **pattern**
    - 이벤트들을 이용해 패턴(`CHHapticPattern`)을 만듭니다.
- **player**
    - 패턴을 이용해 플레이어를 만듭니다.
- **try player?,start(atTime: 0)**
    - `0초` 위치부터 이벤트들의 플레이를 시작합니다.

 

## **햅틱 이벤트 예제**

아래 함수들을 클래스 내부에 추가하면 나중에 편리하게 사용할 수 있습니다.

 

### **예제 1**

강하고 날카롭게 시작하여 3초에 걸쳐 약하고 둔하게 사라지는 일련의 진동(Haptic)이 생성됩니다.

```swift
/// 강하고 날카롭게 시작하여 3초에 걸쳐 약하고 둔하게 사라지는 일련의 진동(Haptic)이 생성됩니다.
func haptic1() {
    guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
        return
    }
    
    var events = [CHHapticEvent]()
    
    for i in stride(from: 0, to: 1, by: 0.1) {
        let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: Float(1 - i))
        let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: Float(1 - i))
        let event = CHHapticEvent(eventType: .hapticTransient, parameters: [
            intensity,
            sharpness,
        ], relativeTime: i * 3)
        events.append(event)
    }
    
    startEvents(events)
}
```

 

### **예제 2 - SOS 신호**

구조 요청의 모스 부호인 [SOS](https://ko.wikipedia.org/wiki/SOS) `(...---...)` 신호를 햅틱으로 나타낼 수 있습니다.

```swift
/// 일시적인 이벤트(짧은 탭)와 지속적인 이벤트(일정 기간에 걸친 긴 윙윙거림)를 혼합하여 Taptic 엔진에서
/// SOS(...---...)에 대한 모스 부호를 진동시킵니다.
func hapticSOS() {
    guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
        return
    }

    let short1 = CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 0)
    let short2 = CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 0.2)
    let short3 = CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 0.4)
    let long1 = CHHapticEvent(eventType: .hapticContinuous, parameters: [], relativeTime: 0.6, duration: 0.5)
    let long2 = CHHapticEvent(eventType: .hapticContinuous, parameters: [], relativeTime: 1.2, duration: 0.5)
    let long3 = CHHapticEvent(eventType: .hapticContinuous, parameters: [], relativeTime: 1.8, duration: 0.5)
    let short4 = CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 2.4)
    let short5 = CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 2.6)
    let short6 = CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: 2.8)

    startEvents([short1, short2, short3, long1, long2, long3, short4, short5, short6])
}
```

 

### **예제 3 - 베토벤 5번 교향곡의 시작 부분**

짧은 햅틱과 지속 햅틱을 조합하여 음악 리듬을 재현할 수 있습니다. 유명한 베토벤 5번 교향곡의 시작 부분입니다.

```swift
/// 베토벤 5번 교향곡의 시작부분 리듬을 진동시킵니다.
func hapticBeethoven5() {
    guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
        return
    }
    
    let startIntensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.3)
    let startSharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.3)
    
    let beat = 0.156
    let breath = 0.01
    let secondPassage = (beat * 4) + breath + (beat * 4 * 2.3) + (beat * 5.1)
    
    let events = [
        CHHapticEvent(eventType: .hapticTransient, parameters: [startIntensity, startSharpness], relativeTime: 0),
        CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: beat),
        CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: beat * 2),
        CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: beat * 3),
        
        CHHapticEvent(eventType: .hapticContinuous, parameters: [], relativeTime: beat * 4 + breath, duration: beat * 4 * 2.3),
        
        CHHapticEvent(eventType: .hapticTransient, parameters: [startIntensity, startSharpness], relativeTime: secondPassage),
        CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: secondPassage + beat),
        CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: secondPassage + beat * 2),
        CHHapticEvent(eventType: .hapticTransient, parameters: [], relativeTime: secondPassage + beat * 3),
        
        CHHapticEvent(eventType: .hapticContinuous, parameters: [], relativeTime: secondPassage + beat * 4 + breath, duration: beat * 4 * 2.3),
    ]
    
    startEvents(events)
}
```

 

## **뷰 컨트롤러 이벤트와 연동**

### **단계 1: 뷰 컨트롤러에 멤버 변수 추가**

뷰 컨트롤러의 멤버 변수로 위에서 만든 `CustomHaptics`를 추가합니다.

```swift
private var customHaptics: CustomHaptics?
```

 

### **단계 2: 이벤트에서 메서드 실행**

버튼 이벤트에 아래와 같이 예제 햅틱 메서드를 지정합니다.

```swift
@IBAction  func btnActCustomHaptics1(_ sender: UIButton) {
    customHaptics?.haptic1()
}

@IBAction func btnActHapticSOS(_ sender: UIButton) {
    customHaptics?.hapticSOS()
}

@IBAction func btnActHapticBeethoven5(_ sender: UIButton) {
    customHaptics?.hapticBeethoven5()
}
```

- **customHaptics?. \*\*\***
    - 옵셔널 체이닝(optional chaning)을 이용한 것으로, `customHaptics`가 `nil`이 아니라면 이후 부분을 실행하고, `nil`이라면 라인의 이후 부분은 무시하고 실행하지 않습니다.
    - 햅틱을 지원하지 않는 기기에서도 `nil` 관련 에러를 발생시키지 않는 안전한 방법입니다.

 

테스트하려면 **실제 햅틱이 지원되는 아이폰에서 빌드 및 실행**합니다. 아래 스크린샷은 이전 글의 예제와 결합하여 만든 앱 화면입니다. 버튼을 누르면 각종 진동이 울립니다.

 ![](/assets/img/wp-content/uploads/2022/12/IMG_78AE96F87B22-1.jpeg)

 

### **출처**

- [How to play custom vibrations using Core Haptics](https://www.hackingwithswift.com/example-code/core-haptics/how-to-play-custom-vibrations-using-core-haptics)
