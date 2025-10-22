---
title: "SwiftUI: iOS 프로젝트의 Stepper가 My Mac(Designed for iPhone)에서 실행할 때 크래시 발생하는 문제 해결 과정"
date: 2024-11-30
categories: 
  - "DevLog"
  - "SwiftUI"
---

> 이 포스트는 ChatGPT가 작성하였습니다.

### **소개**

최근, iOS 앱을 macOS에서 실행할 때 `Stepper` UI 요소가 충돌하는 문제를 겪었습니다. 이 문제는 주로 Apple Silicon Mac에서 발생하며, 특히 iOS 앱을 “Mac (Designed for iPhone)” 타겟으로 실행할 때 발생합니다. Stepper는 iOS에서 잘 작동하지만, macOS에서는 크래시가 발생하는 현상이 있었습니다. 이 문제는 SwiftUI의 호환성 문제로 보였고, 이를 해결하기 위한 과정을 공유하려고 합니다.

\[caption id="attachment\_6898" align="alignnone" width="351"\]![](./assets/img/wp-content/uploads/2024/11/스크린샷-2024-11-30-오후-3.38.31.jpeg) iOS에서 Stepper\[/caption\]

 

#### **문제의 원인**

문제의 핵심은 Stepper UI 컴포넌트가 macOS에서 실행될 때 발생하는 충돌입니다. 해당 오류는 `Thread 1: EXC_BAD_ACCESS` 오류로, 앱이 메모리에 접근하려고 할 때 잘못된 주소를 참조하면서 발생합니다. 이는 특히 **iOS App On Mac** 환경에서 발생할 수 있습니다.

 

#### **해결 방법**

##### **1\. @ViewBuilder와 AnyView 활용**

Stepper는 기본적으로 iOS에서 잘 작동하지만, macOS 환경에서 충돌을 피하려면, 직접 구현한 커스텀 Stepper를 사용하는 것이 좋습니다. 이를 위해 `@ViewBuilder`와 `AnyView`를 활용하여 뷰를 조건에 맞게 처리했습니다. 아래는 ForMacStepper라는 커스텀 Stepper 구현을 사용한 방법입니다.

 

##### **2\. ForMacStepper 커스텀 뷰 구현**

ForMacStepper는 value, range, step을 받아 이를 기반으로 값을 증감시키는 커스텀 Stepper입니다. `label`을 클로저로 받아 해당 UI를 동적으로 정의할 수 있도록 했습니다. 이 때, `@ViewBuilder`로 받은 뷰를 AnyView로 감싸서 반환하여 타입 문제를 해결했습니다.

```
struct ForMacStepper: View {
  @Binding var value: Int
  let range: ClosedRange<Int>
  let step: Int
  let label: () -> AnyView
  
  var body: some View {
    HStack {
      // 라벨 부분
      label()
      Button("-") {
        if value > range.lowerBound {
          value -= step
        }
      }
      .buttonStyle(.bordered)
      Button("+") {
        if value < range.upperBound {
          value += step
        }
      }
      .buttonStyle(.bordered)
    }
  }
}

extension ForMacStepper {
  init(value: Binding<Int>, range: ClosedRange<Int>, step: Int, @ViewBuilder label: @escaping () -> some View) {
    self._value = value
    self.range = range
    self.step = step
    self.label = {
      AnyView(label()) // 클로저로 받은 뷰를 AnyView로 감싸서 반환
    }
  }
}
```

 

##### **3\. ProcessInfo.processInfo.isiOSAppOnMac 사용**

macOS 환경에서만 ForMacStepper를 사용하도록 조건을 추가했습니다. **ProcessInfo.processInfo.isiOSAppOnMac**을 활용하여, 앱이 macOS에서 실행될 때는 ForMacStepper를, 그렇지 않으면 기본 Stepper를 사용하도록 했습니다.

```
private var stepperLabel: some View {
  HStack {
    Text("문제풀이 타이머")
    Spacer()
    Text(cfgTimerSeconds == 0 ? "제한없음" : "\(cfgTimerSeconds)초")
      .foregroundColor(.gray)
  }
}

Section {
  if ProcessInfo.processInfo.isiOSAppOnMac {
    ForMacStepper(value: $cfgTimerSeconds, range: 0...60, step: 5) {
      stepperLabel
    }
  } else {
    Stepper(value: $cfgTimerSeconds, in: 0...60, step: 5) {
      stepperLabel
    }
  }
} header: {
  Text("타이머")
}
```

이제 위의 코드를 통해, Stepper가 macOS에서 충돌하는 문제를 해결할 수 있습니다. ForMacStepper는 iOS 앱이 Mac에서 실행될 때 발생하는 충돌을 방지하고, iOS와 macOS에서 모두 정상적으로 동작할 수 있도록 했습니다. 결과적으로, Stepper가 iOS 및 macOS 모두에서 안정적으로 작동하는 앱을 만들 수 있게 되었습니다.

\[caption id="attachment\_6899" align="alignnone" width="275"\]![](./assets/img/wp-content/uploads/2024/11/스크린샷-2024-11-30-오후-3.41.17-복사본.jpg) macOS에서 커스텀 타이머\[/caption\]

 

#### **결론**

iOS 앱을 macOS에서 실행할 때 발생하는 `Stepper` UI 충돌 문제는 `AnyView`와 `@ViewBuilder`를 활용한 커스텀 컴포넌트로 해결할 수 있었습니다. 이 과정에서 **ProcessInfo.processInfo.isiOSAppOnMac**을 활용하여 iOS와 macOS에서 각각 적절한 뷰를 사용하도록 조건을 추가하는 방법을 통해 문제를 해결할 수 있었습니다. 이와 같은 방법을 사용하면 Stepper와 같은 일반적인 UI 컴포넌트도 iOS와 macOS에서 모두 잘 작동하게 할 수 있습니다.

 

##### **참고**

- [SwiftUI Stepper Crashes (EXC\_BAD\_ACCESS) on My Mac (Designed for iPhone) but works fine on iOS device/simulator?](https://forums.developer.apple.com/forums/thread/730554) 

 

\[rcblock id="6686"\]
