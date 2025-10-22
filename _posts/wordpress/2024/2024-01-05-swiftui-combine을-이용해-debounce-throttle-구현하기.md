---
title: "SwiftUI: Combine을 이용해 Debounce, Throttle 구현하기"
date: 2024-01-05
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

Debounce, Throttle 기능이 필요할 때 `Combine`을 이용해서 구현할 수 있습니다.

- [Swift(스위프트): Debounce, Throttle 로 함수 실행 횟수 제한 (DispatchWorkItem 이용, 외부 라이브러리 없이)](http://yoonbumtae.com/?p=5121)

> debounce, throttle를 간단히 요약하면 이벤트의 반복 실행시 콜백 함수의 불필요한 실행을 줄이는 역할을 합니다. 이로 인해 클라이언트가 혜택을 볼 수도 있거나 혹은 서버 측에 불필요한 리퀘스트를 줄일 수도 있습니다.
> 
>  
> 
> `Debounce`: 동일 이벤트가 반복적으로 시행되는 경우 마지막 이벤트가 실행되고 나서 일정 시간(밀리세컨드)동안 해당 이벤트가 다시 실행되지 않으면 해당 이벤트의 콜백 함수를 실행합니다.
> 
> [![Debounce GIF - Find & Share on GIPHY](https://media.giphy.com/media/jtuiikPQqz40umE8Yh/giphy.gif)](https://gph.is/g/4g1NLj5)
> 
> ![](https://media.giphy.com/media/mDBN0Oc9Eh2jdK3HoH/giphy.gif)
> 
>  
> 
> `Throttle`: 동일 이벤트가 반복적으로 시행되는 경우 이벤트의 실제 반복 주기와 상관없이 임의로 설정한 일정 시간 간격(밀리세컨드)으로 콜백 함수의 실행을 보장합니다.
> 
> [![Lodash GIF - Find & Share on GIPHY](https://media.giphy.com/media/ejxrdvUSKJNtJmXl2G/giphy.gif)](https://gph.is/g/Zn6vO9P)

 

#### **장점**

- Swift에 기본 내장되어 있기 때문에 외부 라이브러리를 사용하거나 별도로 구현할 필요가 없습니다.
- Combine을 사용하지 않는 프로젝트에서도 문제 없이 바로 사용할 수 있습니다.

 

#### **버튼에 Debounce 구현하는 방법**

```
import SwiftUI
import Combine

struct ButtonDebounce: View {
    @State private var statusText = "대기"
    @State private var buttonTouchCount = 0
    @State private var buttonProcessCount = 0
    
    // PassthroughSubject 퍼블리셔 추가
    private let buttonPublisher = PassthroughSubject<Void, Never>()
    
    var body: some View {
        // 퍼블리셔에 1초간 Debounce, 메인 스레드에서
        let buttonDebounce = buttonPublisher
            .debounce(for: .seconds(1), scheduler: RunLoop.main)
        
        VStack {
            Text("\(statusText) | \(buttonTouchCount)")
            Button("Debounce") {
                buttonPublisher.send() // 보내면 onReceive에서 수신
                buttonTouchCount += 1
            }
        }
        .onReceive(buttonDebounce) { _ in
            buttonProcessCount += 1
            statusText = "버튼 작업 실행 [\(buttonProcessCount)]"
        }
    }
}

```

- `debounce(... for:)` - Debounce가 실행될 범위(interval)을 정합니다.
    - 사용할 수 있는 시간 종류는 다음과 같습니다. ![](./assets/img/wp-content/uploads/2024/01/스크린샷-2024-01-05-오후-10.20.02-복사본.jpg)
- `debounce(... scheduler:)` - 어느 스레드에서 실행할 지 정합니다. UI와 관련되었으므로 `RunLoop.main`을 사용합니다.

 

http://www.giphy.com/gifs/7MB78LrKpHGnJAkdIC

 

 

#### **버튼에 Throttle 구현하는 방법**

```
import SwiftUI
import Combine

struct ButtonThrottle: View {
    @State private var statusText = "대기"
    @State private var buttonTouchCount = 0
    @State private var buttonProcessCount = 0
    
    // PassthroughSubject 퍼블리셔 추가
    private let buttonPublisher = PassthroughSubject<Void, Never>()
    
    var body: some View {
        // 퍼블리셔에 1초 Throttle, 메인 스레드에서
        let buttonThrottle = buttonPublisher
            .throttle(for: .seconds(1), scheduler: RunLoop.main, latest: true)
        
        VStack {
            Text("\(statusText) | \(buttonTouchCount)")
            Button("Throttle") {
                buttonPublisher.send() // 보내면 onReceive에서 수신
                buttonTouchCount += 1
            }
        }
        .onReceive(buttonThrottle) { _ in
            buttonProcessCount += 1
            statusText = "버튼 작업 실행 [\(buttonProcessCount)]"
        }
    }
}
```

- `throttle(... latest:)` - 실행할 때 1초의 Throttle의 범위(interval)에서 처음에 받은 값을 배출할지, 가장 나중에 받은 값을 배출할지에 대한 여부를 묻는 파라미터입니다.
    - 이 예제는 `Void`를 배출하기 때문에 어느 옵션을 사용해도 상관은 없지만 보통 `true`를 사용합니다.

http://www.giphy.com/gifs/8H5pc5LiQaq0EtpeC8

 

#### **참고**

SwiftUI에서 값이 변경되는 컴포넌트 대다수가 이런 다중 실행 방지 기능을 기본 내장하고 있습니다. 예를 들어 `Slider`에서는 `onEditingChanged` 핸들러를 통해 슬라이드가 움직일때 값을 계속 반영하는것 외에 값이 실질적으로 변화했을 때에만 실행할 작업을 지정할 수 있습니다.

사용하고자 하는 컴포넌트의 옵션의 동작 방식을 살펴보고 위의 Debounce, Throttle 사용 여부를 결정하는 것이 좋습니다.

```
VStack {
    Text("Slider Value[EditingChanged: \(sliderChangedCount)]: \(sliderValue)")
    Slider(value: $sliderValue,
           in: 1...100,
           onEditingChanged: { _ in
        sliderChangedCount += 1
    })
}
```

http://www.giphy.com/gifs/NKqUVz2JyUoZ7WN0IJ
