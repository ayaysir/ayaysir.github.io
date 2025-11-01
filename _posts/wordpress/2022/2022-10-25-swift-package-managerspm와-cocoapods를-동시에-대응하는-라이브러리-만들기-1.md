---
title: "Swift Package Manager(SPM)와 CocoaPods를 동시에 대응하는 라이브러리 만들기 (1)"
date: 2022-10-25
categories: 
  - "DevLog"
  - "Swift"
---

### **Swift Package Manager와 CocoaPods를 동시에 대응하는 라이브러리 만들기 (1)**

##### **전체 코드**

- [https://github.com/ayaysir/BGSMM\_DevKit](https://github.com/ayaysir/BGSMM_DevKit)

 

#### **과정**

1. Xcode에서 Swift Package Manager에 대응하는 Package를 만들고 코드를 구현합니다.
2. 별도의 폴더에서 CocoaPods 프로젝트를 생성한 뒤 필요한 파일만 복사해 Swift Package Manager 폴더로 복사합니다.
3. GitHub 레퍼지토리에 푸시한 뒤 버전 태그를 생성하고 태그로부터 릴리즈를 생성합니다.
4. CocoaPods에 대응하기 위한 추가 작업을 실행합니다.

 

자신이 직접 Swift 라이브러리를 만들어서 사용하고 배포하는 방법에 대해 알아보겠습니다.

SPM, CocoaPods 양 디펜던시 관리 시스템 간 통합 배포가 가능합니다. 단, Swift Package Manager(이하 SPM)과 CocoaPods가 요구하는 파일 구조, 스펙 등이 다르므로 이 점을 유의하고 통합 과정을 진행해야 합니다.

 

#### **상세**

##### **Step 1: Xcode에서 Swift Package Manager에 대응하는 Package를 만들고 코드를 구현합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-12.33.25.jpg)

'패키지를 생성하면 기본 파일 구조는 아래와 같습니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-26-오전-2.05.37.jpg)

 

`Package.swift`는 SPM의 핵심 파일로 여기서 각종 옵션을 지정합니다.

```
// swift-tools-version: 5.6
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "BGSMM_DevKit",
    platforms: [
        .iOS(.v11)
    ],
    products: [
        // Products define the executables and libraries a package produces, and make them visible to other packages.
        .library(
            name: "BGSMM_DevKit",
            targets: ["BGSMM_DevKit"]),
    ],
    dependencies: [
        // Dependencies declare other packages that this package depends on.
        // .package(url: /* package url */, from: "1.0.0"),
    ],
    targets: [
        // Targets are the basic building blocks of a package. A target can define a module or a test suite.
        // Targets can depend on other targets in this package, and on products in packages this package depends on.
        .target(
            name: "BGSMM_DevKit",
            dependencies: [],
            resources: [.process("Resources")]
        ),
        
        // 테스트를 사용하지 않는다면 .testTarget은 삭제
        // .testTarget(
        //     name: "BGSMM_DevKitTests",
        //     dependencies: ["BGSMM_DevKit"]),
    ],
    swiftLanguageVersions: [
        .v5
    ]
)

```

- 테스트를 진행하지 않는다면 `.testTarget` 부분은 삭제처리합니다.
- Swift의 특정 버전 이상을 사용할 것을 요구하려면 `swiftLanguageVersions` 부분을 추가합니다.

 

`Sources` 폴더에는 실제 코드를 입력하는 곳이며 프로젝트 설정 시 입력했던 이름과 동일한 `BGSMM_DevKit.swift` 파일이 기본으로 제공됩니다.

```
#if os(iOS)

public struct BGSMM_DevKit {
    public private(set) var text = "Hello, World!"

    public init() {
    }
}

#endif
```

이 폴더 안에 Swift 파일 등을 추가하여 라이브러리 개발을 진행합니다. 또는 나중에 CocoaPods 프로젝트와 통합한 후 개발을 시작할 수도 있습니다. 여기서는 통합 후 개발을 시작하는 것으로 하겠습니다.

 

##### **Step 2: 별도의 폴더에서 CocoaPods 프로젝트를 생성한 뒤 필요한 파일만 복사해 Swift Package Manager 폴더로 복사합니다.**

이 부분을 진행하기 위해선 CocoaPods에 대한 사전 지식이 필요합니다.

- [Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법](http://yoonbumtae.com/?p=4457)

 

아무 폴더에 들어간 뒤 다음 명령어를 입력합니다.

- `pod lib create ProjectName`
    - `ProjectName`에는 SPM에서 설정했던 이름과 동일한 이름을 입력합니다.

몇가지 사항을 물어보는데 아래와 같이 답한 후 프로젝트를 생성합니다.

```
What platform do you want to use?? [ iOS / macOS ]
 > iOS
What language do you want to use?? [ Swift / ObjC ]
 > Swift
Would you like to include a demo application with your library? [ Yes / No ]
 > Yes
Which testing frameworks will you use? [ Quick / None ]
 > None
Would you like to do view based testing? [ Yes / No ]
 > No
```

 

입력하면 아래와 같은 폴더가 생성됩니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-1.25.31.jpg)

여기에서 하이라이트 된 파일 3개와 README.md 파일을 선택해 복사한 뒤 SPM 프로젝트가 있는 폴더로 붙여넣기합니다.

- .`podspec` - CocoaPods 디펜던시에 대한 핵심 사항을 설정하는 파일입니다. SPM의 `Package.swift`와 역할이 같습니다.
- `Example` - 라이브러리에 대한 예제 앱을 제공합니다. 이 폴더가 있어야 통합 후 새로운 환경에서 작업할 수 있습니다.
- `LICENSE` - 라이센스 파일
- `README.md` - 리드미 파일입니다. 미리 작성되어 있는 기본 템플릿이 우수하므로 필요한 경우 대신 사용합니다.

복붙이 완료되었다면 코코아팟 디렉토리는 삭제해도 됩니다.

 

`.podspec` 파일을 열고 소스 디렉토리 경로를 SPM의 `Source` 디렉토리로 수정합니다. (아래 코드에서 하이라이트 부분)

```
#
# Be sure to run `pod lib lint BGSMM_DevKit.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'BGSMM_DevKit'
  s.version          = '1.0.2'
  s.summary          = 'BGSMM_DevKit is a collection of various utilities that I will use when developing.'

  # Set swift version
  s.swift_version    = '5.0'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
BGSMM_DevKit is a collection of various utilities that I will use when developing.
Include SimpleAlert, StringManipulator, and etc..
                       DESC

  # s.homepage         = 'https://github.com/40187546/BGSMM_DevKit'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  # s.source           = { :git => 'https://github.com/40187546/BGSMM_DevKit.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.homepage         = 'https://github.com/ayaysir/BGSMM_DevKit'
  s.source           = { :git => 'https://github.com/ayaysir/BGSMM_DevKit.git', :tag => s.version.to_s }	
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { '40187546' => 'yoonbumtae@gmail.com' }
  
  # Localization
  s.resource_bundles = {
    'BGSMM_DevKit' => ['Sources/BGSMM_DevKit/Resources/*.lproj']
  }

  s.ios.deployment_target = '10.0'

  # 여기 변경 (소스 위치)
  s.source_files = 'Sources/BGSMM_DevKit/**/*'
  
  # s.resource_bundles = {
  #   'BGSMM_DevKit' => ['BGSMM_DevKit/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
end

```

 

터미널에서 Example 폴더로 이동한 후 Podfile의 내용을 참고하여 pod install을 실행합니다.

```
use_frameworks!

platform :ios, '10.0'

target 'BGSMM_DevKit_Example' do
  pod 'BGSMM_DevKit', :path => '../'
end

```

- `pod install`

 

완료 후 `.xcworkspace` 파일을 열면 아래와 같은 작업 환경이 나타납니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-26-오전-2.29.01.jpg)

위 구조에서 `Development Pods` 그룹에 SPM에서 사용하는 `Sources`폴더 내 파일들이 나타나며, 앞으로 라이브러리를 개발할 때 이 파일들을 클릭 후 열어서 코드를 작성하면 됩니다.

저는 `AlertController`를 간편하게 띄울 수 있는 `SimpleAlert`이라는 구조체 및 현재 앱에서 열려있는 뷰 컨트롤러 중 가장 위에 있는 것을 찾는 `extension` 추가했습니다. 분량상 코드에 대한 설명은 생략합니다.

```
#if os(iOS)

import UIKit

public struct AlertActionText {
    
    public init(CAUTION: String = "ALERT_CAUTION", OK: String = "ALERT_OK", NO: String = "ALERT_NO", YES: String = "ALERT_YES", CANCEL: String = "ALERT_CANCEL") {
        self.CAUTION = CAUTION
        self.OK = OK
        self.NO = NO
        self.YES = YES
        self.CANCEL = CANCEL
    }
    
    public var CAUTION = "ALERT_CAUTION"
    public var OK = "ALERT_OK"
    public var NO = "ALERT_NO"
    public var YES = "ALERT_YES"
    public var CANCEL = "ALERT_CANCEL"
}

public struct SimpleAlert {
    
    // MARK: - static
    
    public typealias Handler = ((UIAlertAction) -> Void)
    
    public static var actionText = AlertActionText()
    public static var targetVC: UIViewController? = nil
    
    public static func present(message: String? = nil,
                               title: String? = nil,
                               handler: Handler? = nil) {
        
        guard let targetVC = targetVC ?? UIApplication.shared.topMostViewController() else {
            fatalError("The Target View Controller could not be specified.")
        }
        
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let alertAction = UIAlertAction(title: actionText.OK, style: .default, handler: handler)
        alertController.addAction(alertAction)

        targetVC.present(alertController, animated: true, completion: nil)
        
    }
    
    public static func presentCaution(message: String, handler: Handler? = nil) {
        present(message: message, title: actionText.CAUTION, handler: handler)
    }
    
    // Type 2: Yes And No
    public static func yesAndNo(message: String? = nil,
                        title: String? = nil,
                        btnYesStyle: UIAlertAction.Style = .default,
                        yesHandler: Handler? = nil) {
        
        guard let targetVC = targetVC ?? UIApplication.shared.topMostViewController() else {
            fatalError("The Target View Controller could not be specified.")
        }
        
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let alertActionNo = UIAlertAction(title: actionText.NO, style: .cancel, handler: nil)
        let alertActionYes = UIAlertAction(title: actionText.YES, style: btnYesStyle, handler: yesHandler)
        alertController.addAction(alertActionNo)
        alertController.addAction(alertActionYes)
        targetVC.present(alertController, animated: true, completion: nil)
    }
    
    // Type 3: ActionSheet
    public static func actionSheets(_ controller: UIViewController,
                            actionTitles: [String],
                            actionStyles: [UIAlertAction.Style]? = nil,
                            title: String,
                            message: String = "",
                            sourceView: UIView?,
                            sourceRect: CGRect?,
                            actionCompletion: @escaping (_ actionIndex: Int) -> ()) {
        
        let alertController = UIAlertController(title: title, message: "", preferredStyle: .actionSheet)
        alertController.modalPresentationStyle = .popover
        
        for (index, actionTitle) in actionTitles.enumerated() {
            let action = UIAlertAction(title: actionTitle, style: actionStyles?[index] ?? .default, handler: { action in
                actionCompletion(index)
            })
            alertController.addAction(action)
        }
        
        alertController.addAction(UIAlertAction(title: actionText.CANCEL, style: .cancel, handler: nil))
        if let presenter = alertController.popoverPresentationController {
            presenter.sourceView = sourceView ?? controller.view.window
            presenter.sourceRect = sourceRect ?? CGRect(x: 0, y: 0, width: 0, height: 0)
        }
        controller.present(alertController, animated: true, completion: nil)
    }
}

#endif

```

```
#if os(iOS)
import UIKit

// https://stackoverflow.com/a/64301729
extension UIViewController {
    public func topMostViewController() -> UIViewController {
        if self.presentedViewController == nil {
            return self
        }
        if let navigation = self.presentedViewController as? UINavigationController {
            return navigation.visibleViewController!.topMostViewController()
        }
        if let tab = self.presentedViewController as? UITabBarController {
            if let selectedTab = tab.selectedViewController {
                return selectedTab.topMostViewController()
            }
            return tab.topMostViewController()
        }
        return self.presentedViewController!.topMostViewController()
    }
}

extension UIApplication {
    public func topMostViewController() -> UIViewController? {
        return UIWindow.key!.rootViewController?.topMostViewController()
    }
}

extension UIWindow {
    public static var key: UIWindow? {
        if #available(iOS 13, *) {
            return UIApplication.shared.windows.first { $0.isKeyWindow }
        } else {
            return UIApplication.shared.keyWindow
        }
    }
}

#endif

```

 

##### **Step 3: GitHub 레퍼지토리에 푸시한 뒤 버전 태그를 생성하고 태그로부터 릴리즈를 생성합니다.**

개발을 완료하였다면 새로운 원격 레퍼지토리를 만들고 SPM 프로젝트를 깃허브로 푸시합니다. 이 때 Xcode에 내장된 Git 도구를 사용하지 않고 터미널로 명령어를 입력하거나 별도의 GUI 툴을 사용합니다.

원격 레퍼지토리에 접속한 뒤 태그 및 릴리즈를 생성합니다. 아래 빨간색 박스 부분을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-1.54.35.jpg)

`[Create a new release]` 초록색 버튼을 누릅니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-1.55.05.jpg)

왼쪽 상단에 태그 추가 버튼이 있는데 눌러서 추가합니다. 스크린샷에는 잘못 찍혔는데 버전 앞에 v를 입력하지 않고 `1.0.0` **숫자만 입력**합니다. (v가 추가되면 CocoaPods로 배포할 수 없음)

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-1.56.16.jpg)

그리고 제목과 내용 및 나머지 부분도 입력하여 릴리즈로 추가합니다.

 

새로운 태그 및 릴리즈가 추가되면 아래 화면과 같이 목록에 나옵니다. 태그 버전은 CocoaPods에서 사용하므로 메모해둡니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-26-오전-2.40.30.png)

CocoaPods를 사용하지 않고 SPM 단계에서 코드도 작성하고 테스트하였다면 여기서 바로 배포해서 사용할 수 있습니다. CocoaPods에서도 사용 가능하게 하려면 추가 단계가 필요합니다.

 

##### **Step 4: CocoaPods에 대응하기 위한 추가 작업을 실행합니다.**

다음 CocoaPods에 이메일을 인증하고 사용자 등록을 할 차례입니다. 터미널에 아래 명령어를 입력합니다.

- `pod trunk register 'YourEmailAddress' 'YourName'`
    - `YourEmailAddress` - 이메일 주소
    - `YourName` - 사용자 이름

 

얼마 후 이메일이 도착하는데 링크를 클릭해 이메일을 인증합니다.

 ![](/assets/img/wp-content/uploads/2022/10/-2022-10-25-오전-2.03.39-e1666721817945.jpg)

 

링크를 클릭하면 웹 브라우저에 아래와 같은 화면이 나옵니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.04.32.jpg)

 

다음 프로젝트의 유효성, 무결성 등을 검사하는 작업을 진행합니다. 이 작업에서 거부된다면 해당 내용을 보완하고 다시 검사합니다.

- `pod lib lint`

 

검사에 실패하면 아래와 같이 빨간 박스로 해당 원인을 알려줍니다.

1. `summary` 부분이 무의미하다. (기본 상태에서 변경하지 않았음)
2. Swift 버전이 불명확하다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.06.13.jpg)

`.podspec` 파일을 열어 해당 부분을 수정합니다.

- `s.summary`
    - `summary` 부분을 변경합니다. 참고로 summary 밑에 `s.description`이라는 부분도 있는데 이 부분의 문자 길이는 무조건 summary보다 길어야 하므로 같이 변경해줍니다.
- `s.swift_version`
    - SPM에서 5.0 이상만 사용하도록 설정했으므로 여기도 5.0으로 지정합니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.09.16.jpg)

문제점을 보완하고 재검사를 받아 성공하면 아래와 같이 초록색 문자로 **passed validation**.이라고 뜹니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.11.01.jpg)  ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.12.16.jpg)

 

`.podspec` 파일을 열어 버전을 GitHub에 등록된 태그 버전과 맞춥니다. GitHub의 최신 릴리즈의 버전 `1.0.1`이라면 아래 `s,version` 도 `s.version = '1.0.1'`로 변경합니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.09.16.jpg)

 

이제 CocoaPods 서버로 라이브러리를 업로드합니다. 터미널에 아래 명령어를 입력합니다.

- `pod trunk push`

 

업로드에 성공하면 맨 아래와 같이 이모티콘과 함께 _**Congrats**_ 라는 메시지가 뜹니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.42.48.jpg)

 

#### **라이브러리가 동작하는지 테스트**

##### **Swift Package Manager**

다른 프로젝트를 열고 `Add Packages...`에서 깃허브 주소를 입력하여 등록합니다.

 ![](/assets/img/wp-content/uploads/2022/08/스크린샷-2022-08-29-오전-2.14.31.jpg)

라이브러리에 대한 README 가 뜨는 것을 볼 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.33.14.jpg)

```
import BGSMM_DevKit

// ... //

SimpleAlert.present(message: "..........", title: "Test From SPM")
```

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.36.17.jpg)

 

##### **CocoaPods**

`Podfile`에 디펜던시를 추가합니다. 참고로 CocoaPods 서버에 등록되기 까지 시간이 걸릴 수 있으므로 설치가 되지 않는다면 기다렸다 다시 설치하거나, `pod repo update`를 터미널에 입력하여 레퍼지토리 목록을 업데이트합니다.

```
target 'PodTest' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for PodTest
  pod 'BGSMM_DevKit'
end

```

 

설치가 진행되면 아래와 같이 초록색으로 글자가 나타납니다.

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.55.23.jpg)

```
SimpleAlert.present(message: ",,,,,", title: "Test from CocoaPods")
```

 ![](/assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-25-오전-2.56.51.jpg)

 

##### **전체 코드**

- [https://github.com/ayaysir/BGSMM\_DevKit](https://github.com/ayaysir/BGSMM_DevKit)
