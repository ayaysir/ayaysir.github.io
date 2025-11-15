---
title: "Swift + FirebaseUI: (1) FirebaseUI를 이용해 이메일 로그인 화면 구현"
date: 2022-10-17
categories: 
  - "DevLog"
  - "Swift UIKit"
  - "Firebase"
---

##### **참고**

- [Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 기초 로그인 로그아웃 구현 (스토리보드)](http://yoonbumtae.com/?p=4090)

 

먼저 참고글에서 **파이어베이스 프로젝트에서 Authentification 생성** 섹션을 읽고 이메일 인증을 인증 메뉴에 추가하는 프로젝트 설정을 해주세요.

 

### **FirebaseUI (1) - 이메일 로그인 화면 구현**

[**_FirebaseUI_**](https://github.com/firebase/FirebaseUI-iOS/ "https://github.com/firebase/FirebaseUI-iOS/")는 파이어베이스(Firebase)에서 자주 사용하는 작업들, 예를 들면 인증(로그인)이나 데이터베이스, 파일 저장 기능 등을 보일러플레이트 코드를 작성하지 않고도 편리하게(?) 사용할 수 있도록 해주는 라이브러리입니다.

**_CocoaPods_** 디펜던시에 다음을 추가합니다. 파이어베이스가 이미 설치되어 있다면 FirebaseUI만 설치하고(하이라이트 부분), 파이어베이스가 없다면 파이어베이스도 같이 설치합니다. (하이라이트 외 부분)

```
# Add the Firebase pod for Google Analytics
pod 'FirebaseAnalytics'

# For Analytics without IDFA collection capability, use this pod instead
# pod ‘Firebase/AnalyticsWithoutAdIdSupport’

# Add the pods for any other Firebase products you want to use in your app
# For example, to use Firebase Authentication and Cloud Firestore
pod 'FirebaseAuth'
pod 'FirebaseFirestore'

pod 'FirebaseUI'
```

- [Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법](http://yoonbumtae.com/?p=4457)

 

#### **구현 방법**

뷰 컨트롤러에 다음 코드를 추가합니다. 새로운 뷰 컨트롤러를 띄우는 부분이 있으므로 `viewDidAppear`에서 작성합니다.

```swift
import UIKit
import FirebaseEmailAuthUI
```

```
override func viewDidAppear(_ animated: Bool) {
    
    guard Auth.auth().currentUser == nil else {
        return
    }
    
    let authUI = FUIAuth.defaultAuthUI()
    // authUI?.delegate = self
    
    
    let providers = [FUIEmailAuth()]
    authUI?.providers = providers
    
    // ⚠️: 이용약관과 개인정보보정책은 반드시 쌍으로 추가해야 함
    // 이용약관
    let kFirebaseTermsOfService = URL(string: "https://firebase.google.com/terms/")!
    authUI?.tosurl = kFirebaseTermsOfService
    
    // 개인정보 보호정책
    let kFirebasePrivacyPolicy = URL(string: "https://policies.google.com/privacy")!
    authUI?.privacyPolicyURL = kFirebasePrivacyPolicy
    
    let authViewController = authUI?.authViewController() // 기본 제공 뷰 컨트롤러
    
    self.present(authViewController!, animated: true)
}
```

- `3 라인` `guard`문 - 현재 `currentUser`가 `nil`이면 로그인이 되지 않았다는 뜻이므로 계속 진행하고, 아니라면 이미 로그인이 된 상태이므로 리턴합니다.
- `authUI` - 로그인 관련 UI를 다루는 부분으로, 기본 `AuthUI`를 추가합니다.
- `Delegate` - 로그인 화면 관련해서 다양한 작업을 할 수 있는 대리자(delegate)를 설정하는 부분입니다. 지금은 필요하지 않으므로 코멘트 처리합니다.
- `providers` - `[FUIAuthProvider]` 타입의 배열이며 여기에 구글, 애플, 페이스북 등 다양한 인증 제공자(Provider) 객체를 추가할 수 있습니다. 이번 예제는 이메일 로그인만 사용하므로 `FUIEmailAuth()` 하나만 추가합니다
- 이용약관 & 개인정보 보호정책 URL
    - 이 부분에 관련 URL을 추가합니다. 회원가입 화면 등에서 해당 사이트로 연결할 수 있는 링크 텍스트가 제공됩니다.
    - 둘은 반드시 쌍으로 추가되어야 합니다. 하나만 추가하려고 하면 에러가 발생합니다.
- `authViewController` - AuthUI에서 기본으로 제공하는 뷰 컨트롤러입니다.
- `self.present(...)` - `authViewController`를 화면에 띄웁니다.

 

빌드 및 실행합니다. 이것만으로도 바로 이메일 인증을 진행할 수 있습니다.

\[gallery size="full" ids="4960,4959,4958"\]

 

\[gallery size="full" ids="4962,4961"\]

 

이렇게 하면 실제 로그인이 됩니다. 그리고 비밀번호가 틀렸거나 이메일 형식이 맞지 않는 경우 등 유효성 검사도 저절로 체크하도록 이미 기능이 구현되어 있습니다.

 ![](/assets/img/wp-content/uploads/2022/10/Simulator-Screen-Shot-iPhone-11-2022-10-18-at-03.03.57-copy.jpg)  ![](/assets/img/wp-content/uploads/2022/10/Simulator-Screen-Shot-iPhone-11-2022-10-18-at-03.04.12-copy.jpg)

하지만 시각적으로 로그인이 되었다는 것을 확인할 방법이 없습니다.

 

#### **추가 구현 1: 로그인 여부 표시 및 현재 유저의 이메일 표시**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-오전-3.07.28.jpg)

 

`viewWillAppear`에 로그인 여부를 감지하는 리스너를 추가합니다.

```
override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    
    handle = Auth.auth().addStateDidChangeListener { auth, user in
        if let user = user, let email = user.email {
            self.lblUserStatus.text = "Logined: \(email)"
            self.btnLogInOut.setTitle("Log Out", for: .normal)
        } else {
            self.lblUserStatus.text = "Not Logined:"
            self.btnLogInOut.setTitle("Log In", for: .normal)
        }
    }
}
```

- 로그인이 되어있다면(혹은 로그인했다면) 현재 유저의 이메일을 표시합니다.
- 로그인되지 않았다면(혹은 로그아웃 했다면) 로그아웃되었다는 메시지를 표시합니다.

 

로그인/아웃 버튼에 대한 `@IBAction`을 추가합니다.

```
@IBAction func btnActLogInout(_ sender: UIButton) {
    if Auth.auth().currentUser == nil {
        viewDidAppear(true)
        return
    }
    
    do {
        try Auth.auth().signOut()
    } catch {
        print(error.localizedDescription)
    }
}
```

- `if`문 - 로그인이 되지 않았을 때 로그인 창을 띄우고 리턴합니다.
- `docatch`문 - 로그인이 되어있는 경우 로그아웃을 실행합니다.

 

\[gallery size="full" columns="2" ids="4966,4967"\]

`Log In` 버튼을 클릭하면 로그인 창이 뜨며, `Log Out` 버튼을 누른 경우 로그아웃됩니다.

 

#### **추가 구현 2: 로그인 창의 맨 첫 화면 커스터마이징하기**

로그인 화면 첫 화면을 보면 하면이 너무 휑하다는 것을 알 수 있습니다.

\[caption id="attachment\_4960" align="alignnone" width="305"\] ![](/assets/img/wp-content/uploads/2022/10/Simulator-Screen-Shot-iPhone-11-2022-10-18-at-02.53.26.png) 첫 화면\[/caption\]

나중에 구글이나 애플 인증 버튼이 추가되면 약간 나아지지만, 아무 사진도 설명도 없는 화면은 혼란을 야기할 수 있습니다. 이 화면을 커스터마이징 해보겠습니다.

먼저 `FUIAuthPickerViewController`를 상속받는 뷰 컨트롤러를 생성합니다.

```swift
import UIKit
import FirebaseAuthUI

class LoginCustomViewController: FUIAuthPickerViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let width = UIScreen.main.bounds.size.width
        let height = UIScreen.main.bounds.size.height
        
        let imageView = UIImageView(image: UIImage(named: "StringQuartet"))
        view.addSubview(imageView)
        
        let label = UILabel(frame: CGRect(x: 10, y: 0, width: width - 20, height: 200))
        label.text = "이메일, 구글, 애플 로그인 중 하나를 선택해서 로그인하세요."
        label.textColor = .white
        label.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        label.numberOfLines = 0
        view.addSubview(label)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: animated)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
    }
}
```

- `viewDidLoad`에 사진 및 텍스트를 수동으로 추가합니다.

 

다음 기존 뷰 컨트롤러의 `authViewController` 관련 부분을 다음과 같이 변경합니다.

```
// 삭제
// let authViewController = authUI?.authViewController() // 기본 제공 뷰 컨트롤러
// self.present(authViewController!, animated: true)

let customLoginVC = LoginCustomViewController(authUI: authUI!)
let naviVC = UINavigationController(rootViewController: customLoginVC)
naviVC.presentationController?.delegate = self

self.present(naviVC, animated: true)
```

- `naviVC` - `LoginCustomViewController`를 rootVC로 하는 새로운 내비게이션 컨트롤러입니다.
    - `naviVC.presentationController?.delegate` - 프레젠테이션 컨트롤러(스택 형식으로 뜨는 컨트롤러)에 대한 대리자를 설정합니다.

 

아래 `UIAdaptivePresentationControllerDelegate`를 준수하는 `extension`을 추가합니다.

```
extension ViewController: UIAdaptivePresentationControllerDelegate {
    
    func presentationControllerShouldDismiss(_ presentationController: UIPresentationController) -> Bool {
        false
    }
}
```

- 이 화면은 로그인이 성공하기 전까지는 절대 닫히지 않습니다.

 

빌드 및 실행해서 새로운 커스터마이징 화면이 나타나는지 확인합니다.

<!-- http://www.giphy.com/gifs/1JxlyaoJ9bDHA0w9cj -->
![](https://)
