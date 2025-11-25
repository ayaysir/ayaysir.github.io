---
title: "Swift + FirebaseUI: (2) FirebaseUI를 이용해 Google(구글) 소셜 로그인 화면 구현"
date: 2022-10-18
categories: 
  - "DevLog"
  - "Swift"
---

이 글의 작업을 진행하려면 아래 포스트의 작업을 먼저 진행해야 합니다.

- [Swift + FirebaseUI: (1) FirebaseUI를 이용해 이메일 로그인 화면 구현](/posts/swift-firebaseui-1-firebaseui를-이용해-이메일-로그인-화면-구현/)

 

## **FirebaseUI (2) – Google(구글) 소셜 로그인 화면 구현**

### **1) 인증 제공업체 목록에 구글 추가**

[Firebase 콘솔](https://console.firebase.google.com/)에 접속해서 좌측의 `빌드 > Authentication > Sigin-in Method` 페이지로 들어갑니다. `[새 제공업체 추가]` 버튼을 눌러서 _**Google**_을 추가합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-pm-11.19.56.jpg)

추가 정보를 입력하는 창이 나오는데, 기본값은 이미 입력되어 있으므로 그대로 진행하면 구글이 제공 업체 목록에 추가됩니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-pm-11.39.47.jpg)

 

### **2) URL Type 추가**

_**GoogleService-Info.plist**_ 파일에서 `REVERSED_CLIENT_ID` 값을 복사합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-pm-11.24.22.jpg)

 

프로젝트 설정에서 `Info` 탭으로 들어가면 맨 아래 `URL Types` 란이 있습니다. `+` 버튼을 눌러 새로운 URL Type을 추가하고 `URL Schemes` 란에 `REVERSED_CLIENT_ID` 값을 붙여넣기합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-pm-11.25.20.jpg)

### **3) 코드 작성**

_**AppDelegate.swift**_ 파일의 `AppDelegate` 클래스 안에 아래 함수를 추가합니다.

```swift
import FirebaseAuthUI

// ... //

func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    let sourceApplication = options[UIApplication.OpenURLOptionsKey.sourceApplication] as! String?
    
    if FUIAuth.defaultAuthUI()?.handleOpen(url, sourceApplication: sourceApplication) ?? false {
        return true
    }
    
    // other URL handling goes here.
    return false
}
```

 

뷰 컨트롤러에서 `providers` 배열에 구글 `FUIGoogleAuth(authUI: authUI)` 을 추가합니다.

```swift
guard let authUI = FUIAuth.defaultAuthUI() else {
    return
}
authUI.delegate = self

let providers: [FUIAuthProvider] = [
    FUIEmailAuth(),
    FUIGoogleAuth(authUI: authUI),
]
authUI.providers = providers
```

 

![Sign In with Google 버튼 추가됨](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-pm-11.47.27.jpg)  
*Sign In with Google 버튼 추가됨*

 

![구글 계정 선택](/assets/img/wp-content/uploads/2022/10/mosaic-screenshot-2022-10-18-pm-11.47.44.jpg)  
*구글 계정 선택*

 

![해당 구글 계정으로 로그인됨](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-18-pm-11.47.53.jpg)  
*해당 구글 계정으로 로그인됨*

 

### **실험: 이미 이메일 계정이 있는 상태에서 구글로 로그인하면 어떻게 되는가? 혹은 그 반대 케이스의 경우?**

1. 이미 이메일 계정으로 가입한 경우 동일한 이메일의 구글 계정으로 로그인하면 기존 이메일 계정은 구글 계정으로 대체됩니다.
2. 구글 계정으로 가입한 상태에서 이메일 계정으로 로그인을 시도하는 경우 구글로 로그인하라는 메시지가 표시됩니다. 1번 케이스와 같이 기존 이메일 계정이 구글 계정으로 대체된 경우에도 동일합니다.

 

![1. 이메일 계정으로 구글 지메일을 사용해 가입](/assets/img/wp-content/uploads/2022/10/mosaiced-screenshot-2022-10-18-pm-11.53.38.jpg)  
*1. 이메일 계정으로 구글 지메일을 사용해 가입*

 

![2. 가입한 후 계정 상태, 제공업체는 이메일](/assets/img/wp-content/uploads/2022/10/mosaiced-screenshot-2022-10-18-pm-11.55.30.jpg)  
*2. 가입한 후 계정 상태, 제공업체는 이메일*

 

![3.동일한 구글 아이디의 계정으로 로그인하면 제공 업체가 구글로 바뀌며, UID는 그대로](/assets/img/wp-content/uploads/2022/10/mosaiced-screenshot-2022-10-18-pm-11.56.05.jpg)  
*3.동일한 구글 아이디의 계정으로 로그인하면 제공 업체가 구글로 바뀌며, UID는 그대로*

 

![4. 제공업체가 구글인 상태에서 이메일 계정 로그인을 시도하면 구글로 로그인하라는 경고창이 뜸](/assets/img/wp-content/uploads/2022/10/mosaiced-screenshot-2022-10-18-pm-11.56.24.jpg)  
*4. 제공업체가 구글인 상태에서 이메일 계정 로그인을 시도하면 구글로 로그인하라는 경고창이 뜸*
