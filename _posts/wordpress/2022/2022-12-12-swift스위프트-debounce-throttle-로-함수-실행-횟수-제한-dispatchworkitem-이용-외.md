---
title: "Swift(스위프트): Debounce, Throttle 로 함수 실행 횟수 제한 (DispatchWorkItem 이용, 외부 라이브러리 없이)"
date: 2022-12-12
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

먼저 Debounce, Throttle 이란 어떤 기능인지에 대해 알아보겠습니다.

- [자바스크립트 lodash: debounce와 throttle을 이용하여 함수의 실행 횟수 제한](http://yoonbumtae.com/?p=2102)

> debounce, throttle은 생소한 기능인데요 간단히 요약하면 이벤트의 반복 실행시 콜백 함수의 불필요한 실행을 줄이는 역할을 합니다. 이로 인해 클라이언트가 혜택을 볼 수도 있거나 혹은 서버 측에 불필요한 리퀘스트를 줄일 수도 있습니다.
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

 

`DispatchWorkItem` 이라는 것을 이용해 Swift에서 외부 라이브러리 없이 이러한 기능을 적용하는 방법에 대해 알아보겠습니다.

 

#### **DispatchWorkItem**

`DispatchWorkItem`이란 `DispatchQueue` 등 비동기 작업을 할 때 사용하는 클로저 함수를 클래스 형태로 한 번 더 캡슐화 한 것을 말합니다. 메인 스레드에서 비동기 작업을 실행할 때 자주 사용하는 아래와 같은 예제 코드를 보면 트레일링 클로저를 사용하여 비동기 작업을 실행하는 것을 알 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-12-pm-11.43.59.jpg)

여기서 트레일링 클로저 부분을 `DispatchWorkItem`이라는 클래스로 한번 더 감싸면 동일한 작업을 할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-12-pm-11.47.33.jpg)

위의 두 코드는 사실상 동일하다고 볼 수 있습니다.

 

##### **cancel()**

`DispatchWorkItem`의 형태의 인스턴스는 여러 작업을 할 수 있는데, 그 중 `cancel()`이라는 작업이 있습니다.

> 이 함수는 작업의 실행 여부에 따라 동작이 조금 달라집니다.
> 
> **작업 실행 전**: 즉 작업이 아직 큐에 있는 상황입니다. 이때 `cancel()` 을 호출하면 작업이 제거됩니다.
> 
> **작업 실행 중**: 실행 중인 작업에 `cancel()`을 호출하는 경우, 작업이 멈추지는 않고 `DispatchWorkItem` 의 속성인 `inCancelled` 가 `true` 로 설정됩니다
> 
> [\[iOS\] 차근차근 시작하는 GCD — 9](https://sujinnaljin.medium.com/ios-%EC%B0%A8%EA%B7%BC%EC%B0%A8%EA%B7%BC-%EC%8B%9C%EC%9E%91%ED%95%98%EB%8A%94-gcd-9-d652d4688bdd)

 

예제 코드를 보겠습니다.

```
// 1 - 비동기 방식으로 실행
DispatchQueue.global(qos: .userInteractive).async(execute: workItem)

// 2, 3 - 동기 방식으로 실행
workItem.perform()
workItem.perform()
// 여기까지 3번 실행됨

// 취소
workItem.cancel()

// 4
workItem.perform()

// 5
DispatchQueue.global(qos: .background).async(execute: workItem)
```

- `.perform()`은 워크 아이템을 동기 방식으로 실행하고자 할 때 사용합니다.

`workItem`을 5회 실행하고자 의도했지만 `cancel()`로 인해 실제로 실행된 횟수는 3회만 이루어집니다. `cancel()` 부분을 지우면 5회 전부 실행됩니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-12-pm-11.53.11.jpg)

Debounce와 Throttle은 `DispatchWorkItem`의 `cancel()` 작업을 이용해 구현합니다.

 

#### **구현**

##### **Abstract Class 만들기**

```swift
class DelayWork {
    
    typealias Handler = ((Date) -> Void)
    
    var workItem: DispatchWorkItem?
    let delay: Int!
    let handler: Handler?
    
    init(milliseconds delay: Int, handler: Handler?) {
        self.delay = delay
        self.handler = handler
    }
    
    func run() {}
}
```

- **handler**
    - Debounce 또는 Throttle을 시키고자 하는 클로저 함수입니다.
- **delay**: 시간 간격입니다.
    - Debounce의 경우 마지막으로 실행되고 나서 `delay` 밀리초 후에 작업이 실행됩니다.
    - Throttle의 경우 몇 번을 반복해서 실행시키라도 실제 작업은 `delay` 초 간격으로 작업이 반복 실행됩니다.
- **run()**
    - Debounce 또는 Throttle을 적용하여 함수를 실행하는 명령입니다.
    - 두 부분이 다르게 구현되기 때문에 빈 괄호로 남겨두었습니다.

`Debounce`와 `Throttle`은 `run()` 함수를 빼면 똑같기 때문에 추상 클래스 비슷한 것을 만들어 상속시키겠습니다.

 

##### **Debounce 구현**

```swift
class Debounce: DelayWork {
    
    override func run() {
        self.workItem?.cancel()
        
        let workItem = DispatchWorkItem { [weak self] in
            self?.handler?(Date())
        }
        self.workItem = workItem
        
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(delay), execute: workItem)
    }
}
```

- **self.workItem?.cancel()**
    - `Debounce`는 일단 `workItem`이 있다면 무조건 취소부터 시킵니다.
    - 코드 하단을 보면 `asyncAfter`를 통해 `deadline`이 지나면 (`delay` 밀리초 후에) 작업을 실행하라고 했는데 데드라인이 지나기 이전에 `debounce` 명령이 실행이 되면 안되기 때문에 바로 취소하는 것입니다.
- **let workItem**
    - 단순히 `handler`를 실행시키는 워크 아이템입니다.
- **self.workItem = workItem**
    - cancel된 `self.workItem`은 다시 사용할 수 없으므로 재할당합니다.
- **DispatchQueue...asyncAfter...**
    - 데드라인이 지나면 `workItem`의 작업을 실행하라는 명령입니다.
    - 즉, `handler`를 실행하라는 명령과 동일한 의미입니다.

 

##### **Throttle 구현**

```swift
class Throttle: DelayWork {
    
    override func run() {
        if self.workItem == nil {
            handler?(Date())
            
            let workItem = DispatchWorkItem { [weak self] in
                self?.workItem?.cancel()
                self?.workItem = nil
            }
            self.workItem = workItem
            
            DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(delay), execute: workItem)
        }
    }
}
```

- **let workItem**
    - 멤버 변수의 `self.workItem`을 취소시키고 `nil`로 만듭니다.
- **DispatchQueue...asyncAfter...**
    - 데드라인이 지나면 `workItem`의 작업을 실행하라는 명령입니다.
    - 다시 말하면 데드라인이 지나면 `self.workItem`을 취소시키고 `nil`로 만들라는 의미입니다.
- **self.workItem == nil인 경우에만 실행**
    - 위에서 `DispatchQueue...asyncAfter...` 부분이 실행된 경우에만 `if`문이 `true`가 됩니다.
    - `self.workItem`이 `nil`이 아닌 경우는 데드라인이 지날 때까지 `workItem`을 실행하도록 대기하고 있는 경우이므로 `if`문이 실행되지 않습니디.
- **handler?(Date())**
    - `if`문이 실행된 경우, `handler`를 바로 실행시킵니다.
- **self.workItem = workItem**
    - `cancel`된 `self.workItem`은 다시 사용할 수 없으므로 재할당합니다.

 

#### **예제: 뷰 컨트롤러에 적용**

버튼을 빠르게 반복 클릭하면 Debounce 및 Throttle 이 적용되는 예제입니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-13-am-12.15.55.jpg)

```swift
import UIKit

class DelayWorkViewController: UIViewController {
    
    @IBOutlet weak var txvDebounce: UITextView!
    @IBOutlet weak var txvThrottle: UITextView!
    
    private var debounce: Debounce!
    private var throttle: Throttle!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        txvDebounce.text = ""
        txvThrottle.text = ""
        
        debounce = Debounce(milliseconds: 1000) { [unowned self] date in
            txvDebounce.text += "DEBOUNCE: \(date)\n"
        }
        
        throttle = Throttle(milliseconds: 2000) { [unowned self] date in
            txvThrottle.text += "THROTTLE: \(date)\n"
        }
    }
    
    @IBAction func btnActClick(_ sender: UIButton) {
        debounce.run()
        throttle.run()
    }
}

```

 

<!-- http://www.giphy.com/gifs/cLAlZNfkGHoWX39hRP -->
![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbG9pZXVwMGRwc2x0Zml0bHZ5cGZxMjFpMTN4ZTRlM3VxYWlxaG51OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cLAlZNfkGHoWX39hRP/giphy.gif)

#### **전체 코드**

https://gist.github.com/ayaysir/5075ee06cce25df9a14fb17360ebd0cb

 

##### **참고**

- [\[Swift\]RxSwift 없이 debounce, throttle 구현해보기](https://velog.io/@okstring/SwiftRxSwift-%EC%97%86%EC%9D%B4-debounce-throttle-%EA%B5%AC%ED%98%84%ED%95%B4%EB%B3%B4%EA%B8%B0)
