---
title: "Xcode: UIView 결과물 미리보기 (빌드 및 @IBDesignable을 사용하지 않고 SwiftUI의 프리뷰 기능을 이용)"
date: 2021-09-07
categories: 
  - "DevLog"
  - "Swift"
---

일반적인 스토리보드(Storyboard) 하의 개발환경에서 UI 작업에 대한 결과물을 보려면 매번 빌드하는 과정을 거쳐야 하는 불편함이 있었습니다. 보완책으로 스토리보드에서 미리보기가 가능한 `@IBDesignable`이라는 어노테이션이 있지만 아래와 같이 없는것만 못한 쓰레기 기능입니다.

\[caption id="attachment\_4046" align="alignnone" width="409"\]![](./assets/img/wp-content/uploads/2021/09/스크린샷-2021-09-07-오후-9.12.15.jpg) 오류가 잦아 사용이 불가능한 `@IBDesignable`\[/caption\]

 

이번 예제는 실시간 프리뷰 기능이 도입된 `SwiftUI`를 간접적으로 이용하여 @IBDesignable 대신에 사용할 수 있는 미리보기입니다. 이 글에서는 `UIView에` 대한 미리보기를 만들겠습니다.

![](./assets/img/wp-content/uploads/2021/09/스크린샷-2021-09-07-오후-9.40.39.jpg)

 

##### **1, 아래 코드를 프로젝트에 추가합니다.**

```
import UIKit

#if canImport(SwiftUI) && DEBUG
import SwiftUI

@available(iOS 13.0, *)
struct UIViewPreview<View: UIView>: UIViewRepresentable {
    let view: View

    init(_ builder: @escaping () -> View) {
        view = builder()
    }

    // MARK: - UIViewRepresentable
    func makeUIView(context: Context) -> UIView {
        return view
    }

    func updateUIView(_ view: UIView, context: Context) {
        view.setContentHuggingPriority(.defaultHigh, for: .horizontal)
        view.setContentHuggingPriority(.defaultHigh, for: .vertical)
    }
}

@available(iOS 13.0, *)
struct UIViewControllerPreview<ViewController: UIViewController>: UIViewControllerRepresentable {
    let viewController: ViewController

    init(_ builder: @escaping () -> ViewController) {
        viewController = builder()
    }

    // MARK: - UIViewControllerRepresentable
    func makeUIViewController(context: Context) -> ViewController {
        viewController
    }

    func updateUIViewController(_ uiViewController: ViewController, context: UIViewControllerRepresentableContext<UIViewControllerPreview<ViewController>>) {
        return
    }
}
#endif
```

 

##### **2\. 커스텀 `UIView` 클래스를 작성합니다. 간단한 선과 원을 그리는 그리는 예제입니다.**

```
import UIKit

struct Constant {
    var marginX: CGFloat = 10
    var marginY: CGFloat = 10
}

class ExampleView: UIView {
    
    let cnst = Constant()
    
    override func draw(_ rect: CGRect) {
        let context = UIGraphicsGetCurrentContext()!
        
        let width = bounds.width
        
        UIColor.green.set()
        context.move(to: CGPoint(x: cnst.marginX, y: cnst.marginY))
        context.addLine(to: CGPoint(x: width - cnst.marginX, y: cnst.marginY))
        context.strokePath()
        
        let path = UIBezierPath(ovalIn: CGRect(x: 100, y: 100, width: 100, height: 100))
        path.stroke()
        
    }
}
```

 

##### **3\. ExampleView 클래스 바로 밑에 아래 코드를 추가합니다.**

```
#if canImport(SwiftUI) && DEBUG
import SwiftUI

@available(iOS 13.0, *)
struct ExampleView_Preview: PreviewProvider {
    static var previews: some View {
        UIViewPreview {
            let view = ExampleView()
            return view
        }.previewLayout(.sizeThatFits)
        .padding(10)
    }
}
#endif

```

- `ExampleView_Preview` - 클래스 이름을 정의합니다. 구분하기 쉽게 원본 클래스 이름 뒤에 Preview 접미사를 붙입니다.
- `UIViewPreview` - (1)번에서 추가한 범용 클래스입니다.

 

##### **4\. `Editor` 메뉴 > `Canvas`를 체크합니다.**

![](./assets/img/wp-content/uploads/2021/09/스크린샷-2021-09-07-오후-9.20.46.jpg)

 

##### **5\. `Canvas`가 실행되면 코드 창 오른쪽에 프리뷰 창이 나타나는데 만약 업데이트가 paused된 상태라면 `resume`을 클릭합니다.**

![](./assets/img/wp-content/uploads/2021/09/스크린샷-2021-09-07-오후-9.21.40.jpg)

 

##### **6\. 일반적인 환경에서 버전 오류가 발생하지 않지만 만약 실행이 되지 않는다면 프로젝트 세팅 창의 애플리케이션 `TARGETS`에서 `Deployment Info`의 버전을 iOS 13 이상으로 설정합니다.**

![](./assets/img/wp-content/uploads/2021/09/스크린샷-2021-09-07-오후-9.11.04.jpg)

 

 

 

<iframe width="480" height="408" src="https://giphy.com/embed/0q9PhiCuBN0osci7Y5" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

 

##### **참고: `UIViewController` 미리보기**

`예제ViewController`(임의로 만든 뷰 컨트롤러) 밑에 아래 코드를 추가합니다.

```
#if canImport(SwiftUI) && DEBUG
import SwiftUI

let deviceNames: [String] = [
    "iPhone SE",
    "iPad 11 Pro Max",
    "iPad Pro (11-inch)"
]

@available(iOS 13.0, *)
struct 예제ViewController_Preview: PreviewProvider {
  static var previews: some View {
    ForEach(deviceNames, id: \.self) { deviceName in
      UIViewControllerPreview {
        UIStoryboard(name: "Main", bundle: nil)
            .instantiateInitialViewController { coder in
            예제ViewController(coder: coder)
        }!
      }.previewDevice(PreviewDevice(rawValue: deviceName))
        .previewDisplayName(deviceName)
    }
  }
}
#endif
```

 

- [출처](https://nshipster.com/swiftui-previews/)
- [원본 gist](https://gist.github.com/mattt/ff6b58af8576c798485b449269d43607)
