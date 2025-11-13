---
title: "SwiftUI: Long Press 처리 (일반적인 경우와 지속적으로 눌렀을때의 경우)"
date: 2023-05-11
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

SwiftUI에서 일반 탭 외에 길게 눌렀을때의 동작을 어떻게 처리하는지 알아보겠습닌다. 먼저 **Long Press**라는 동작에 대한 이해가 선행되어야 합니다.

- Long Press는 누르는 동안 동작이 지속되지 않습니다. `minimum duration`(최소 지속 시간)동안 press가 되었다면 계속 누르고 있다 하더라도 minimum duration 후에 최후의 동작 (onEnded)을 1회 실행하고 끝이 납니다.
- 지금은 사용하지 않는 아이폰의 3D 포스 터치와 행동 양식이 같습니다. 누르는 강도를 시간(duration)으로 치환한 것 뿐입니다.

아래 그림을 보면 일반적인 minimum duration이 1초로 설정된 Long Press의 동작이 어떤 것인지 알 수 있습니다. 일반적인 Long Press는 아무리 길게 눌러도 1초가 지나면 동작이 끝납니다. 아래 Continous Press Button은 특수한 처리를 한 경우로 구현 방법은 후술합니다.

<!-- http://www.giphy.com/gifs/6xTD4wTGxqpY3N3rC6 -->
![](https://)

 

#### **Long Press** 

`some Gesture` 타입의 `longPress` 계산된 변수를 SwiftUI View 구조체 내에 추가합니다.

```
@GestureState private var isDetectingLongPress = false

var longPress: some Gesture {
    LongPressGesture(minimumDuration: 1)
        .updating($isDetectingLongPress) { value, gestureState, _ in
            gestureState = value
        }.onEnded { value in
            print("LongPress OnEnded")
        }
}
```

- **@GestureState**
    - 제스처 전용 State입니다. 나중에 `if`문 등에서 사용할 수 있습니다.
- `updating`에 누르고 있을 때의 동작을 추가합니다.
    - `updating`은 `minimumDuration`동안 지속됩니다.
- `onEnded`에 동작을 완료했을 때, 즉 누른 채로 `minimumDuration`이 되었을 때 마무리해야 할 동작을 설정합니다.

 

위의 `longPress`는 제스처와 관련된 다양한 곳에서 사용할 수 있습니다.

```
VStack {
    Image(systemName: isDetectingLongPress ? "globe" : "pause.fill")
    Button {} label: {
        Text("Long Press Button")
    }.simultaneousGesture(longPress)
}
```

아래 그림에서 `Long Press Button`이 해당 예입니다.

<!-- http://www.giphy.com/gifs/6xTD4wTGxqpY3N3rC6 -->
![](https://)

 

#### **특수한 경우: Continuous Press**

위의 예는 아무리 버튼을 길게 눌러도 minimum duration이 지나면 동작이 완료됩니다. 이것 대신 만약 버튼을 누르고 있을 때 updating이 지속되고 버튼을 떼야만 onEnded가 실행되는 것으로 하고 싶다면 어떻게 해야할까요?

sequenced gesture 기능을 이용해 Long Press 전에 Drag Gesture를 추가하면 이 문제를 해결할 수 있습니다.

```
@GestureState private var isDetectingContinuousPress = false

var continuousPress: some Gesture {
    LongPressGesture(minimumDuration: 0.1)
        .sequenced(before: DragGesture(minimumDistance: 0, coordinateSpace: .local))
        .updating($isDetectingContinuousPress) { value, gestureState, _ in
            switch value {
            case .second(true, nil):
                gestureState = true
                print("updating: Second")
            default:
                break
            }
        }.onEnded { value in
            switch value {
            case .second(_, _):
                print("onended: Second")
            default:
                break
            }
        }
}
```

- **sequenced before**
    - `DragGesture`를 첫 번째(first) 제스처로 삽입합니다.
- **DragGesture**
    - `minimumDistance`를 `0`으로 설정하면 길게 탭한 것도 드래그로 취급됩니다.
- **updating에서 case .second(First.Value, Second.value?)**
    - 첫 번째 제스처가 실행되었다면(`true`) 두 번째 제스처(롱프레스)에서 실행할 작업을
    - `case` 내부에 지정합니다.
- **onEnded에서 case .second(First.Value, Second.value?)**
    - 프레스를 종료했을 때 해야 할 작업을 지정합니다.

 

위의 `continuousPress` 제스처 또한 다양한 곳에서 사용할 수 있습니다.

```
VStack {
    Image(systemName: isDetectingContinuousPress ? "globe" : "pause.fill")
    Button {} label: {
        Text("Continuous Press Button")
    }.simultaneousGesture(continuousPress)
}
```

아래 그림에서 `Continuous Press Button`이 해당 예입니다.

<!-- http://www.giphy.com/gifs/6xTD4wTGxqpY3N3rC6 -->
![](https://)

 

##### **전체 코드**

https://gist.github.com/ayaysir/05e509370e3ffb91706f83391930489e

 

##### **출처**

- [How do I make a SwiftUI gesture that keeps running code while the view is pressed](https://stackoverflow.com/a/61524230/21519873)
