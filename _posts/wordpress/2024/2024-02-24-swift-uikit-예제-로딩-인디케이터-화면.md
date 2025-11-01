---
title: "Swift UIKit 예제: 로딩 인디케이터 화면"
date: 2024-02-24
categories: 
  - "DevLog"
  - "Swift UIKit"
---

### **소개**

`UIKit`에서 특정 로딩 상황이 발생할 때 로딩 인디케이터를 띄우는 예제입니다. 외부 라이브러리를 사용하지 않고 기본 제공 요소로 만들었습니다.

https://giphy.com/gifs/hH9JzdEtDTTOWxSTCf

https://giphy.com/gifs/kvqcJeJoeClyln5Oe8

 

#### **코드**

```
import UIKit

struct LoadingIndicatorUtil {
    static let `default` = LoadingIndicatorUtil()
    private init() {}
    
    private let TAG = 95834114
    
    enum Style {
        case clear, blur
    }
    
    /// 로딩 인디케이터 창을 띄웁니다.
    func show(_ viewController: UIViewController, style: Style = .clear, text: String = "") {
        let container: UIView = UIView()
        container.frame = CGRect(x: 0, y: 0, width: 80, height: 80) // Set X and Y whatever you want
        container.backgroundColor = .clear
        container.tag = TAG
        
        if text.isNotEmpty {
            let label = UILabel(frame: .init(x: 0, y: 0, width: 200, height: 30))
            label.numberOfLines = 0
            label.text = text
            label.sizeToFit()
            label.center = viewController.view.center
            label.frame.origin.y += 50
            container.addSubview(label)
            label.textColor = style == .blur ? .white : nil
        }

        let activityView = UIActivityIndicatorView(style: .large)
        activityView.center = viewController.view.center
        container.addSubview(activityView)
        
        switch style {
        case .clear:
            break
        case .blur:
            activityView.color = .white
            
            let blurEffect = UIBlurEffect(style: .dark)
            let blurEffectView = UIVisualEffectView(effect: blurEffect)
            blurEffectView.frame = viewController.view.bounds
            blurEffectView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            blurEffectView.tag = TAG
            viewController.view.addSubview(blurEffectView)
        }
        
        viewController.view.addSubview(container)
        activityView.startAnimating()
    }
    
    /// 현재 떠있는 로딩 인디케이터 창을 제거합니다.
    func hide(_ viewController: UIViewController) {
        viewController.view.subviews.forEach {
            if $0.tag == TAG {
                $0.removeFromSuperview()
            }
        }
    }
}
```

 

#### **사용 방법**

- 위의 코드를 프로젝트에 추가합니다,
- 로딩이 시작되는 곳에 `show(...)`를 추가합니다.  ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-24-오후-2.41.57-복사본.jpg)
    - **style**
        - `clear`, `blur` 둘 중에서 선택할 수 있습니다.
    - **text**
        - 지정하지 않으면 로딩 인디케이터 그래픽만 표시되며, 텍스트를 추가하면 안내 메시지가 같이 표시됩니다.
- 로딩이 종료되면 `hide(...)`를 사용해 인디케이터 화면을 제거합니다.  ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-24-오후-2.42.23-복사본.jpg)
