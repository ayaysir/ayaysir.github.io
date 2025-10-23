---
title: "Swift UIKit: 최상위 Top View Controller (현재 화면의 VC) 찾기 / 예제: SwiftUI에서 빠른 Alert 띄우기"
date: 2025-02-20
categories: 
  - "DevLog"
  - "Swift UIKit"
---

## **1\. UIApplication의 KeyWindow 대체**

```swift
import UIKit

extension UIApplication {
  var keyWindow: UIWindow? {
    connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap { $0.windows }
      .first { $0.isKeyWindow }
  }
}
```

_'keyWindow' was deprecated in iOS 13.0: Should not be used for applications that support multiple scenes as it returns a key window across all connected scenes_ 에러를 방지하기 위함입니다.

 
## **2\. 뷰 컨트롤러에서 최상위 뷰 컨트롤러를 반환하는 함수 작성**

```swift
import UIKit

extension UIViewController {
  /// 현재 표시된 최상위 뷰 컨트롤러 반환
  func getTopMostViewController() -> UIViewController {
    if let presentedViewController = self.presentedViewController {
      return presentedViewController.getTopMostViewController()
    } else if let navigationController = self as? UINavigationController {
      return navigationController.visibleViewController?.getTopMostViewController() ?? navigationController
    } else if let tabBarController = self as? UITabBarController {
      return tabBarController.selectedViewController?.getTopMostViewController() ?? tabBarController
    } else {
      return self
    }
  }
}
```

 

## **3\. 뷰 컨트롤러 오브젝트에서 다음과 같이 .getTopMostViewController() 사용**

```swift
if let topViewController = UIApplication.shared.keyWindow?.rootViewController?.getTopMostViewController() {
    // ...
}
```

현재 키 윈도우에 있는 `rootViewController`의 최상위 뷰 컨트롤러를 반환합니다. 

또는 아래와 같이 `UIViewController`에서 바로 `getTopMostViewController()`를 불러올 수 있도록 합니다.

```swift
extension UIViewController {
  static func getTopMostViewController() -> UIViewController {
    UIApplication.shared.keyWindow?.rootViewController?.getTopMostViewController()
  }
}
```

```swift
if let topViewController = UIViewController.getTopMostViewController() {
    // ...
}
```

## **예제: SwiftUI에서 빠른 Alert 띄우기**

```swift
import UIKit

struct QuickAlert {
  static func show(
    _ title: String,
    message: String? = nil,
    preferredStyle: UIAlertController.Style = .alert,
    completionHandler: ((UIAlertAction) -> Void)? = nil
  ) {
    let alert = UIAlertController(
      title: title,
      message: message,
      preferredStyle: .alert
    )
    let alertAction = UIAlertAction(
      title: "확인",
      style: .default,
      handler: completionHandler
    )
    alert.addAction(alertAction)
    
    DispatchQueue.main.async {
      if let topViewController = UIApplication.shared.keyWindow?.rootViewController?.getTopMostViewController() {
        topViewController.present(alert, animated: true, completion: nil)
      }
    }
  }
}

```

최상위 뷰 컨트롤러를 찾아서 UIKit의 `UIAlert`을 띄웁니다.

 

UIKit에서도 사용할 수 있고, 아래 코드처럼 SwiftUI에서도 원하는 곳에서 바로 사용할 수 있습니다.

```swift
.onChange(of: isReminderOn) { newValue in
  QuickAlert.show(
  "no_alert_permission_title",
    message: "no_alert_permission_detail"
  ) { _ in
    // 컴플리션 핸들러 작업
  }
}
```
