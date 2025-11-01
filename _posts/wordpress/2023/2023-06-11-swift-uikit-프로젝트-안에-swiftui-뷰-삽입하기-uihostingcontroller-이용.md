---
title: "Swift: UIKit 프로젝트 안에 SwiftUI 뷰 삽입하기 (UIHostingController 이용)"
date: 2023-06-11
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

- [SwiftUI: Representable을 이용해서 UIViewController 띄우기](http://yoonbumtae.com/?p=5349)
- [SwiftUI: 하드웨어 키보드 입력 받기 (Representable 사용)](http://yoonbumtae.com/?p=5430)
- [SwiftUI: 웹 뷰(WKWebView) 추가하기 및 자바스크립트 실행 (Representable 사용)](http://yoonbumtae.com/?p=5436)

 

이전에 `SwiftUI` 프로젝트 안에 `UIKit` 기반으로 만들어진 뷰 컨트롤러나 뷰를 집어넣는 방법에 대해 여러 차례 포스팅한적이 있었는데, 그 반대의 경우도 가능합니다.

UIKit 프로젝트에서 `SwiftUI로 만든 View`를 삽입하는 방법과 더불어 UIKit 뷰 컨트롤러와 SwiftUI 뷰 간의 데이터의 교환 방법(상태 변경 방법)에 대해 알아보겠습니다.

 

#### **SwiftUI의 View를 UIKit 프로젝트 내에 추가**

##### **1) SwiftUI로 View 작성**

```
import SwiftUI

struct CustomMusicSliderView: View {
    @StateObject var viewModel: CustomMusicSliderViewModel
    
    var body: some View {
        // ... 생략 ... //
    }
}

struct CustomMusicSliderView_Previews: PreviewProvider {
    static var previews: some View {
        CustomMusicSliderView()
    }
}
```

저는 아래 스크린샷과 같은 음악 플레이어를 구현하기 위해 [Custom-Slider-Control](https://github.com/pratikg29/Custom-Slider-Control)이라는 SwiftUI로 작성된 예제 코드를 인터넷에서 퍼온 뒤 이를 바탕으로 `CustomMusicSliderView`의 코드를 작성했습니다. 본문 내용은 분량상 생략하며 자세한 구현 방법은 위의 링크를 참고해주세요.

\[caption id="attachment\_5707" align="alignnone" width="390"\] ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-11-오후-10.26.07-복사본.jpg) 빨간색 박스 부분이 SwiftUI로 만들어진 `View`입니다.\[/caption\]

 

##### **2) 스토리보드에 View 부분 추가**

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-11-오후-10.28.58-복사본.jpg)

`SwiftUI View`를 삽입할 공간을 마련하기 위해 `스토리보드`에서 적절한 위치에 `UIKit View`를 삽입합니다.

 

##### **3) @IBOutlet으로 View을 뷰 컨트롤러 코드와 연결**

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-11-오후-10.31.35-복사본.jpg)

`viewCustomSlider`는 `UIHostingController`로부터 만들어진 `View(for UIKit)`를 `Subview`로 포함할 일종의 부모 뷰입니다.

**\[심화\]** 프로그래밍 방식으로 뷰를 추가하거나 루트 뷰에 직접 추가할 경우 2, 3단계를 생략해도 됩니다.

 

##### **4) UIHostingController 추가**

```
override func viewDidLoad() {
    super.viewDidLoad()

    // UIHostingController
    let sliderVC = UIHostingController(rootView: CustomMusicSliderView())
    
}
```

- `UIHostingController`는 메인 `Content`를 SwiftUI로 가지는 컨트롤러를 뜻합니다.
- `rootView`에 앞서 만든 `CustomMusicSliderView()`를 지정합니다.

 

##### **5) UIKit용 View 추출 및 화면에 추가**

`viewDidLoad` 에 추가합니다.

```
let embedSliderView = sliderVC.view!
embedSliderView.translatesAutoresizingMaskIntoConstraints = false

self.addChild(sliderVC)
viewCustomSlider.addSubview(embedSliderView)

viewCustomSlider.backgroundColor = .clear
```

- `1` - 호스팅 컨트롤러에서 `View`를 추출하고, 이름을 `embedSliderView(UIView)`라고 짓습니다.
- `2`
    
    > _**참고)** auto layout을 사용하여 View의 크기와 위치를 동적으로 계산하려면, 이 프로퍼티(translatesAutoresizingMaskIntoConstraints)를 false로 설정한 다음, View에 모호(ambiguous)하지 않고 충돌하지 않는(nonconflicting) constraint집합을 제공해야 합니다. ([출처](https://zeddios.tistory.com/474))_
    
- `4` - 호스팅 컨트롤러를 현재 뷰 컨트롤러의 자식으로 추가합니다.
    - This relationship is necessary when embedding the child view controller’s view into the current view controller’s content.
- `5` - `viewCustomSlider`의 하위 뷰(`subview`)로 호스팅 컨트롤러로부터 추출한 뷰인 `embedSliderView`를 추가합니다.
- `7` - 프로그래밍 방식으로 `viewCustomSlider`의 배경색을 투명(`.clear`)으로 설정합니다.

 

##### **6) 제약 수동 설정 및 호스팅 컨트롤러를 didMove 하기**

```
NSLayoutConstraint.activate([
      embedSliderView.topAnchor.constraint(equalTo: viewCustomSlider.topAnchor),
      embedSliderView.bottomAnchor.constraint(equalTo: viewCustomSlider.bottomAnchor),
      embedSliderView.leadingAnchor.constraint(equalTo: viewCustomSlider.leadingAnchor),
      embedSliderView.trailingAnchor.constraint(equalTo: viewCustomSlider.trailingAnchor),
  ])

sliderVC.didMove(toParent: self)
```

- `embedSliderView`의 가장자리를 전부 `viewSlider`의 anchor에 맞춥니다(equalt to).
- **sliderVC.didMove(toParent: self)**
    - 이부분은 공식 문서에서도 설명이 안나와서([진짜 안알려줌](https://developer.apple.com/documentation/swiftui/uihostingcontroller/didmove\(toparent:\))) 무슨 의미인지 모르겠으나 일단 필요하므로 작성합니다.

 

이렇게 하면 SwiftUI로 만들어진 뮤직 슬라이더 뷰가 UIKit 안에 들어간 것을 확인할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-11-오후-11.03.46-복사본.jpg)

 

#### **UIKit 프로젝트 내에 추가된 SwiftUI View의 상태(state) 조작**

음악 플레이어의 슬라이더이므로 음악이 재생될 때 현재 진행된 시간의 위치가 아래 움짤처럼 반영이 되어야 할 것입니다.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWMxZThmNmI0ZWY1MTdmZDNhZTA0M2VhNWMwNTJlOThmZGRhYjViNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/iXvdZRR9Eul4bCanE8/giphy.gif)

음악 파일을 재생하는 부분과 해당 정보들은 모두 UIKit에서 관리되고 있다고 한다면, 어떻게 해야 SwiftUI 뷰에게 정보를 전달하고 상태를 업데이트할 수 있을까요?

방법 중 하나는 `ObservableObject`를 구현 클래스를 만들어서 전달하는 것입니다.

 

##### **1) ObservableObject 클래스 작성**

CustomMusicSliderView의 뷰 모델이 될 `CustomMusicSliderViewModel` 클래스를 생성합니다. 이 클래스는 `ObservableObject`를 준수(conform)해야 합니다.

```
class CustomMusicSliderViewModel: ObservableObject {
    typealias DragHandler = ((Double) -> Void)
    
    @Published var value: Double = 20.0
    @Published var inRange: ClosedRange<Double> = 0.0 ... 60.0
    @Published var dragHandler: DragHandler? = { _ in }
    
    init(dragHandler: DragHandler? = nil) {
        self.dragHandler = dragHandler
    }
}
```

- 뷰 모델을 통해 `@Published` 변수의 값이 변경될 때마다 해당 변수를 참고하는 SwiftUI View의 값이 변경됩니다.
    - **참고)** [SwiftUI: ObservableObject 프로토콜과 @Published, @ObsevedObejct, @StateObject 프로퍼티 래퍼](http://yoonbumtae.com/?p=4668)
- 핵심은 **@Published 변수를 통해 뷰 컨트롤러에서 상태를 변경할 수 있다**는 것입니다.
    - 이것만 알면 이후의 지엽적인 내용은 무시해도 됩니다.
- 각 `@Published` 변수의 역할은 분량상 간략하게만 언급하면
    - `value`: 현재 위치
    - `inRange`: 시작 위치와 끝 위치, 시작을 0으로 기준으로 하면 끝 위치는 음악의 전체 길이
    - `dragHandler`: 슬라이드를 드래그 한 뒤에 해야 할 작업에 대한 클로저, Double 값은 슬라이더가 이동된 후의 위치

 

##### **2) SwiftUI View가 해당 뷰 모델을 참고하도록 변경**

```
struct CustomMusicSliderView: View {
    @StateObject var viewModel: CustomMusicSliderViewModel
    
    var body: some View {
        ZStack {
            VStack {
                MusicProgressSlider(value: $viewModel.value, inRange: viewModel.inRange, activeFillColor: .white, fillColor: .white.opacity(0.5), emptyColor: .white.opacity(0.3), height: 32) { isDragStarted, value in
                    if !isDragStarted {
                        viewModel.dragHandler?(value)
                    }
                }
                .frame(height: 40)
            }
        }
    }
}
```

- 하이라이트된 7번 9번 라인을 참고하여 슬라이더의 모습이 `@StateObject`인 `viewModel`에 의해 상태가 변경될 수 있도록 변경합니다.

 

##### **3) UIKit 뷰 컨트롤러에 CustomMusicSliderViewModel 추가**

먼저 뷰 컨트롤러의 멤버 변수로 `viewModel`을 추가합니다.

```
class ViewController: UIViewController {
    /// UIHosting 조정용
    var viewModel: CustomMusicSliderViewModel!
    
}

```

 

다음, `viewDidLoad`에서 초기화합니다.

```
override func viewDidLoad() {
    super.viewDidLoad()
       
    viewModel = CustomMusicSliderViewModel { [unowned self] value in
        if let player = musicManager.player {
        player.currentTime = value
        musicManager.updateCommandCenterInfoCurrentTime()
    }
    
    // ... //
}
```

- `4` - `CustomMusicSliderViewModel(dragHandler: {...})`가 트레일링 클로저로 축약된 형태입니다.
- `dragHandler`의 내용은 슬라이드가 이동한 위치로 플레이어의 현재 타임을 변경하라는 의미로, 자세한 내용은 분량상 생략합니다.

 

##### **4) UIHostingController 재설정**

2번에서 `@StateObejct`인 `viewModel`이 추가되었으므로 `UIHostingController`를초기화할 때의 `rootView`에도 반영해야 합니다.

```
// UIHostingController
let sliderVC = UIHostingController(rootView: CustomMusicSliderView(viewModel: self.viewModel))
```

 

##### **5) viewModel을 통한 데이터 전달 및 상태 변경**

뷰 컨트롤러의 `viewDidLoad`에 다음 타이머를 추가합니다.

```
Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [unowned self] timer in
    if let player = musicManager.player {
        viewModel.inRange = 0 ... player.duration
        viewModel.value = player.currentTime
    }
}
```

- 0.5초 반복 타이머를 통해 플레이어의 현재 위치와 총 재생 시간을 실시간으로 업데이트합니다.
- `viewModel.inRange`와 같이 `@Published` 변수를 변경하면 자동으로 SwiftUI 뷰가 업데이트됩니다.

 

아래 움짤을 다시 보면, 0.5초마다 재생 시간 레이블 및 슬라이더의 위치가 변경되고 있음을 알 수 있습니다.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWMxZThmNmI0ZWY1MTdmZDNhZTA0M2VhNWMwNTJlOThmZGRhYjViNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/iXvdZRR9Eul4bCanE8/giphy.gif)

 

##### **출처**

- [In SwiftUI, how to use UIHostingController inside an UIView or as an UIView?](https://stackoverflow.com/questions/56819063/in-swiftui-how-to-use-uihostingcontroller-inside-an-uiview-or-as-an-uiview)
