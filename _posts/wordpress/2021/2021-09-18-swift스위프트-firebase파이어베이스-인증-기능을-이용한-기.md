---
title: "Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 기초 로그인 로그아웃 구현 (스토리보드)"
date: 2021-09-18
categories: 
  - "DevLog"
  - "Swift UIKit"
  - "Firebase"
---

[Firebase](https://firebase.google.com/?hl=ko)(파이어베이스)를 이용한 iOS 로그인 구현 방법입니다.

이 예제에서는 이메일을 아이디로 사용합니다. 먼저 Firebase 웹 콘솔에서 인증 메뉴를 활성화한 다음, Xcode에서 로그인 관련 내용을 구현합니다.

 

## **파이어베이스 프로젝트에서 Authentification 생성**

1\. 파이어베이스 콘솔에서 프로젝트를 생성한 후, `빌드` > `Authentification` 메뉴를 클릭합니다.

2\. `시작하기` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-5.52.09.jpg)

 

3\. 그러면 아래와 같이 `로그인 제공업체`라는 페이지가 뜨게 되는데 여기서 `이메일/비밀번호` 옆의 연필 모양의 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-5.52.31.jpg)

만약 메뉴가 뜨지 않는다면 `Sign-in method` 탭을 클릭하면 됩니다.

 

4\. `사용 설정` 스위치를 활성화시키고, `저장` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-5.52.45.jpg)

 

5\. 회원이 로그인을 하려면 먼저 회원 가입 과정이 필요하지만, 편의상 콘솔에서 사용자를 생성 후 로그인/로그아웃이 먼저 구현되도록 하겠습니다.

`Users` 탭에서 `사용자 추가` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-8.22.17.jpg)

 

6\. 임의의 이메일 주소, 비밀번호를 입력한 후 `사용자 추가` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-8.18.43.jpg)

사용자가 추가되었습니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-8.17.58.jpg)

 

## **프로젝트에 Firebase CocoaPods 설치**

Firebase는 `CocoaPods`라는 디펜던시 관리자를 이용해 프로젝트 내에 설치해야 합니다.

 

1\. CocoaPods가 설치되지 않았다면 터미널 실행 후 아래 커맨드를 이용해 설치합니다.

```
$ sudo gem install cocoapods
```

 

2\. 터미널을 실행한 뒤, Xcode 프로젝트의 루트 폴더로 이동한 다음, CocoaPods 초기화를 진행합니다.

```
$ pod init
```

 

3\. 초기화가 완료되면, 프로젝트 루트 폴더에 `Podfile`이라는 파일이 생성됩니다. 텍스트 편집기로 해당 파일을 연 뒤, 아래 하이라이트 부분을 추가합니다.

```ruby
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'ExampleProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for ExampleProject
  # add the Firebase pod for Google Analytics
  pod 'Firebase/Analytics'
  # or pod ‘Firebase/AnalyticsWithoutAdIdSupport’
  # for Analytics without IDFA collection capability

  # add pods for any other desired Firebase products
  # https://firebase.google.com/docs/ios/setup#available-pods

  # Add the pods for any other Firebase products you want to use in your app
  # For example, to use Firebase Authentication and Cloud Firestore
  pod 'Firebase/Auth'
  pod 'Firebase/Firestore'
  pod 'Firebase/Database'

  target 'ExampleProjectTests' do
    inherit! :search_paths
    # Pods for testing
  end

  target 'ExampleProjectUITests' do
    # Pods for testing
  end

end
```

 

4\. 터미널로 돌아간 뒤, 프로젝트 루트 위치에서 아래 명령을 실행합니다.

```bash
$ pod install
```

 

5\. 설치가 완료되면 프로젝트 루트 폴더에 `[프로젝트명].xcworkspace` 라는 파일이 생성됩니다. 이후 프로젝트의 모든 작업은 워크스페이스를 통해 진행해야 합니다.

 

6\. 프로젝트의 `AppDelegate.swift` 파일에서 아래 하이라이트 부분을 추가합니다.

```swift
import UIKit
import Firebase

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        FirebaseApp.configure()
        return true
    }
```

 

## **로그인/로그아웃 구현 (Swift, UIKit Storyboard)**

1\. 스토리보드에서 이메일과 패스워드 입력을 받는 간단한 로그인 폼을 구현합니다.

아래 뷰 컨트롤러에서 회색 배경의 두 하위 `UIView`가 있습니다. 로그인이 되지 않은 상태라면 위의 로그인 폼(`viewSignInForm`)만 보여주고, 로그인이 되었다면 아래 사용자 정보 뷰(`viewUserInfo`)만 보여줍니다.

오브젝트 배치 및 `@IBOutlet`, `@IBAction` 연결에 대한 내용은 너무 길어 생략합니다.

- [iOS 프로그래밍: 스토리보드에서 요소를 추가한 뒤 아웃렛 변수와 액션 함수로 연결하기](/posts/ios-프로그래밍-스토리보드에서-요소를-추가한-뒤-아웃/)

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-18-pm-8.16.06.jpg)

 

2\. 뷰 컨트롤러에 `Firebase`를 `import` 합니다.

```swift
import Firebase
```

 

3\. 이메일과 비밀번호를 입력 후 로그인 버튼을 누르면 로그인 작업을 실행하는 코드를 작성합니다.

```swift
@IBAction  func btnActSubmit(_ sender: UIButton) {
    guard let userEmail = txtUserEmail.text else { return }
    guard let userPassword = txtUserPassword.text else  { return }
    
    Auth.auth().signIn(withEmail: userEmail, password: userPassword) { [weak self] authResult, error in
        guard self != nil else { return }
        
        if authResult != nil {
            print("로그인 되었습니다")
        } else {
            print("로그인되지 않았습니다.", error?.localizedDescription ?? "")
        }
    }
}
```

- `userEmail`, `userPassword` - 텍스트 필드에서 이메일 주소, 비밀번호를 가져옵니다.
- `Auth.auth().signIn` - 이메일과 비밀번호를 받은 뒤, 트레일링 클로저에서 로그인 완료 시 실행할 내용을 작성합니다.
- `authResult`, `error` - 로그인이 정상적으로 진행되었다면 `authResult`가 `nil`이 아니며, 로그인이 실패한 경우 `authResult`가 `nil`이 됩니다. 로그인이 되지 않은 이유를 `error?.localizedDescription`를 통해 알 수 있습니다.

 

앱을 빌드-실행한 뒤 위에서 생성했던 유저 정보를 이용해 로그인을 진행합니다. 로그인 성공 또는 실패시 해당 메시지가 표시됩니다.

 

4\. `viewWillAppear(_:)`에 인증 상태 리스너 작성

인증 상태 리스너는 로그인/로그아웃이 되었을 때 즉시 반응해서 클로저의 내용을 실행합니다.

먼저 하위 뷰 2개를 모두 `isHidden` 처리하여 숨깁니다.

```swift
viewSignUpForm.isHidden = true
viewUserInfo.isHidden = true
```

 

뷰 컨트롤러의 멤버 변수 `handle`을 생성합니다.

```swift
var handle: AuthStateDidChangeListenerHandle!
```

 

다음 `viewWillAppear(_:)` 에 인증 상태 리스너를 작성합니다.

```swift
override func viewWillAppear(_ animated: Bool) {
    handle = Auth.auth().addStateDidChangeListener { auth, user in
        if let user = user {
            self.viewUserInfo.isHidden = false
            self.viewSignUpForm.isHidden = true
            self.lblUserEmail.text = user.email
        } else {
            self.viewUserInfo.isHidden = true
            self.viewSignUpForm.isHidden = false
            self.lblUserEmail.text = ""
        }
    }
}
```

- `user`가 `nil`이 아니면 로그인이 된 상태이고, `nil`이라면 로그인이 되지 않은 상태입니다.
- 로그인이 된 경우 이메일을 가져와 레이블에 기록하고, 로그인창은 숨기고, 사용자 정보 창은 보여줍니다.
- 로그인이 되지 않은 경우 이메일 레이블을 초기화하고, 로그인창을 표시하고, 사용자 정보 창은 숨깁니다.

 

<iframe width="466" height="480" src="https://giphy.com/embed/gAZqdshp1Ngm8uWFte" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

뷰가 사라질 때에는 인증 상태 리스너를 해지해야 합니다. `viewWillDisappear(_:)` 을 아래와 같이 작성합니다.

```swift
override func viewWillDisappear(_ animated: Bool) {
    Auth.auth().removeStateDidChangeListener(handle!)
}
```

 

 

5\. 로그아웃 버튼에 로그아웃 이벤트를 작성합니다.

```swift
@IBAction func btnActSignOut(_ sender: UIButton) {
    do {
        try Auth.auth().signOut()
    } catch {
        print(error.localizedDescription)
    }
}
```

로그아웃이 완료되면 위의 인증 상태 리스너에 의해 사용자 정보 창이 가려지고 로그인 폼이 다시 나타나게 됩니다.

<!-- <iframe width="466" height="480" src="https://giphy.com/embed/h18T9GiACvF6glf3z3" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmk4aHB6ZnJpanBjM3FhYjcxbTF6NHVnMTBwejhsZG41ZzA3NW1kaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h18T9GiACvF6glf3z3/giphy.gif)

참고로 한 번 로그인이 되면 앱을 삭제하기 전까지는 계속 로그인 상태가 유지됩니다.

 

## **전체 코드**

```swift
import UIKit
import Firebase

class ViewController: UIViewController {
    
    @IBOutlet weak var txtUserEmail: UITextField!
    @IBOutlet weak var txtUserPassword: UITextField!
    
    @IBOutlet weak var lblUserEmail: UILabel!
    
    @IBOutlet weak var viewSignUpForm: UIView!
    @IBOutlet weak var viewUserInfo: UIView!
    
    var handle: AuthStateDidChangeListenerHandle!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        viewSignUpForm.isHidden = true
        viewUserInfo.isHidden = true
    }
    
    override func viewWillAppear(_ animated: Bool) {
        handle = Auth.auth().addStateDidChangeListener { auth, user in
            if let user = user {
                self.viewUserInfo.isHidden = false
                self.viewSignUpForm.isHidden = true
                self.lblUserEmail.text = user.email
            } else {
                self.viewUserInfo.isHidden = true
                self.viewSignUpForm.isHidden = false
                self.lblUserEmail.text = ""
            }
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        Auth.auth().removeStateDidChangeListener(handle!)
    }
    
    @IBAction func btnActSubmit(_ sender: UIButton) {
        guard let userEmail = txtUserEmail.text else { return }
        guard let userPassword = txtUserPassword.text else  { return }
        
        Auth.auth().signIn(withEmail: userEmail, password: userPassword) { [weak self] authResult, error in
            guard self != nil else { return }
            
            if authResult != nil {
                print("로그인 되었습니다")
            } else {
                print("로그인되지 않았습니다.", error?.localizedDescription ?? "")
            }
        }
    }
    
    @IBAction func btnActSignOut(_ sender: UIButton) {
        do {
            try Auth.auth().signOut()
        } catch {
            print(error.localizedDescription)
        }
    }
    
}
```
