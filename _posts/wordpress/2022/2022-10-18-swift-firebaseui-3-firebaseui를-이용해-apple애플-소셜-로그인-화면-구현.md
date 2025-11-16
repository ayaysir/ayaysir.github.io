---
title: "Swift + FirebaseUI: (3) FirebaseUI를 이용해 Apple(애플) 소셜 로그인 화면 구현"
date: 2022-10-18
categories: 
  - "DevLog"
  - "Swift"
---

이 글의 작업을 진행하려면 아래 포스트의 작업을 먼저 진행해야 합니다.

- [Swift + FirebaseUI: (1) FirebaseUI를 이용해 이메일 로그인 화면 구현](http://yoonbumtae.com/?p=4957)

 

### **FirebaseUI (2) – Apple(애플) 소셜 로그인 화면 구현**

2020년 4월 이후로 소셜 로그인을 지원하는 앱은 무조건 애플 로그인 (Sign in with Apple)을 추가해야 한다고 합니다. 저는 애플 소셜 로그인을 사용한 앱을 제출해본 경험은 아직 없지만 제가 사용하는 소셜 로그인을 지원하는 대부분의 앱이 애플 로그인 버튼이 있는 것으로 봐선 반드시 추가해야 할 사항으로 보입니다.

 ![](/assets/img/wp-content/uploads/2022/10/apple-login-policy.jpg)

 

애플 로그인의 실제 구현 및 테스트를 하려면 다음과 같은 조건이 필요합니다.

- 애플 개발자 프로그램에 가입되어있어야 합니다.
- 실제 기기에서 빌드 및 실행해야 합니다. (시뮬레이터에서는 오류 발생)

 

#### **1) 인증 제공업체 목록에 애플(Apple) 추가**

[Firebase 콘솔](https://console.firebase.google.com/)에 접속해서 좌측의 `빌드 > Authentication > Sigin-in Method` 페이지로 들어갑니다. `[새 제공업체 추가]` 버튼을 눌러서 _**Apple**_을 추가합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-2.12.41.jpg)

 

다음 단게에서 `서비스 ID`는 아무 값을 입력하고 `[저장]` 버튼을 누릅니다. Apple이 제공 업체 목록에 추가됩니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-2.13.56.jpg)

 

#### **2) 애플 개발자 센터에서 이메일 추가 설정**

애플 개발자 사이트의 [Certificates, Identifiers & Profiles(인증서, 식별자, 프로필)](https://developer.apple.com/account/resources)에 접속합니다 왼쪽 메뉴에서 `Services` 버튼을 클릭한 뒤 _**Sign in with Apple for Email Communication**_ 섹션에 있는 `Configure` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-2.05.28.jpg)

 

`Email Sources +` 버튼을 클릭 후 나오는 창에서 Email Address 란에 다음과 같은 이메일 주소를 입력합니다.

- `noreply@YOUR_FIREBASE_PROJECT_ID.firebaseapp.com`
    - `YOUR_FIREBASE_PROJECT_ID`는 프로젝트의 ID를 입력합니다. (참고 란 참조)

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-2.26.52.jpg)

> **참고: 프로젝트 ID 확인**
> 
> `프로젝트 설정` (좌측 상단의 톱니바퀴 버튼 클릭) > `일반` 탭에서 확인
> 
>  ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-2.27.48.jpg)

 

#### **3) Xcode 프로젝트 Signing & Capabilities에 Sign in with Apple 추가**

프로젝트 설정을 클릭하고 `Signing & Capabilities` 탭에 있는 `+` 버튼을 클릭한 뒤 Sign in with Apple를 추가합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-2.14.48.jpg)

 

#### **4) 코드 작성**

```
import FirebaseOAuthUI

// 뷰 컨트롤러 클래스 내에 추가 //

guard let authUI = FUIAuth.defaultAuthUI() else {
    return
}
authUI.delegate = self

let providers: [FUIAuthProvider] = [
    FUIEmailAuth(),
    FUIGoogleAuth(authUI: authUI),
    FUIOAuth.appleAuthProvider(withAuthUI: authUI),
]
authUI.providers = providers
```

- `providers` 배열에 `FUIOAuth.appleAuthProvider(withAuthUI: authUI)`를 추가하면 끝입니다.

 

시뮬레이터에서는 오류가 발생하므로 **실제 기기에서 빌드 및 실행**합니다. 애플 아이디로 로그인하기 위해선 다음 조건이 충족되어야 합니다.

> 1\. 2단계 인증(2FA)이 사용 설정된 Apple ID가 있어야 합니다. 2. Apple 기기에서 iCloud에 로그인되어 있어야 합니다.

 

앱을 실행하면 Sign in with Apple 버튼이 추가된 것을 볼 수 있습니다.

\[caption id="attachment\_5004" align="alignnone" width="408"\] ![](/assets/img/wp-content/uploads/2022/10/IMG_A1F1CBDAD507-1.jpg) Sign in with Apple 버튼 추가됨\[/caption\]

 

애플 아이디로 로그인은 이메일 공개(나의 이메일 공유하기) 또는 나의 이메일 가리기 두 가지 방식으로 선택할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-3.02.49.jpg)

 

##### **나의 이메일 가리기**

먼저 이메일 가리기로 가입한 경우 임의로 생성된 문자열의 이름을 가진`***@privaterelay...com` 형식의 애플 이메일로 가입이 됩니다. 파이어베이스 콘솔의 인증된 사용자 목록에도 해당 애플 이메일이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/10/IMG_17DBE821DFCC-1.jpg)

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-3.03.53.jpg)

 

##### **나의 이메일 공유하기**

탈퇴 후 이메일을 공개하여 다시 가입한 경우 내가 공개한 이메일로 표시가 되며 파이어베이스 콘솔에서도 해당 이메일이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/10/IMG_9398.jpg)

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-19-am-3.21.39.jpg)

 

#### **전체 코드**

(이메일 로그인 및 구글, 애플 소셜 로그인을 추가한 FirebaseUI 뷰 컨트롤러

```swift
import UIKit
import FirebaseEmailAuthUI
import FirebaseGoogleAuthUI
import FirebaseOAuthUI

class ViewController: UIViewController {
    
    @IBOutlet weak var btnLogInOut: UIButton!
    @IBOutlet weak var lblUserStatus: UILabel!
    
    // Instance Variables
    var handle: AuthStateDidChangeListenerHandle!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
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
    
    override func viewDidAppear(_ animated: Bool) {
        
        guard Auth.auth().currentUser == nil else {
            return
        }
        
        guard let authUI = FUIAuth.defaultAuthUI() else {
            return
        }
        authUI.delegate = self
        
        let providers: [FUIAuthProvider] = [
            FUIEmailAuth(),
            FUIGoogleAuth(authUI: authUI),
            FUIOAuth.appleAuthProvider(withAuthUI: authUI),
        ]
        authUI.providers = providers
        
        // ⚠️: 이용약관과 개인정보보정책은 반드시 쌍으로 추가해야 함
        // 이용약관
        let kFirebaseTermsOfService = URL(string: "https://firebase.google.com/terms/")!
        authUI.tosurl = kFirebaseTermsOfService
        
        // 개인정보 보호정책
        let kFirebasePrivacyPolicy = URL(string: "https://policies.google.com/privacy")!
        authUI.privacyPolicyURL = kFirebasePrivacyPolicy
        
        // let authViewController = authUI?.authViewController() // 기본 제공 뷰 컨트롤러
        // self.present(authViewController!, animated: true)
        
        let customLoginVC = LoginCustomViewController(authUI: authUI)
        let naviVC = UINavigationController(rootViewController: customLoginVC)
        naviVC.presentationController?.delegate = self
        // naviVC.isNavigationBarHidden = true
        
        self.present(naviVC, animated: true)
    }

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
}

extension ViewController: FUIAuthDelegate {
    func authUI(_ authUI: FUIAuth, didSignInWith authDataResult: AuthDataResult?, error: Error?) {
        if let error = error {
            print(error)
            return
        }
        
        guard let authDataResult = authDataResult else {
            return
        }

        print(authDataResult.credential?.provider)
    }
}

extension ViewController: UIAdaptivePresentationControllerDelegate {
    
    func presentationControllerShouldDismiss(_ presentationController: UIPresentationController) -> Bool {
        false
    }
}
```
