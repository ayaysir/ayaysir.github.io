---
title: "Swift(스위프트): 원격 푸시 알림(Push Notification)에서 파이어베이스 메시징(Firebase Messaging)으로 실제 앱에 메시지 보내기 (스토리보드)"
date: 2022-09-09
categories: 
  - "DevLog"
  - "Swift UIKit"
---

<!-- \[rcblock id="4769"\] -->

- 출처: [\[Swift\] SwiftUI Push Notifications(FCM) APN(APNS) 푸쉬알림 예제](https://pgnt.tistory.com/m/117)


## **이전 글**
 
**이 글의 내용을 진행하려면 이전에 작성한 푸시 알림 관련 글을 먼저 읽어야 합니다.**

- [Swift(스위프트): 원격 푸시 알림(Push Notification) 기초 및 푸시 알림의 모의 테스트 방법 上편 (스토리보드)](/posts/swift-push-notification)
- [Swift(스위프트): 원격 푸시 알림(Push Notification) 기초 및 푸시 알림의 모의 테스트 방법 下편 (스토리보드)](/posts/swift%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EC%9B%90%EA%B2%A9-%ED%91%B8%EC%8B%9C-%EC%95%8C%EB%A6%BCpush-notification-%EA%B8%B0%EC%B4%88-%EB%B0%8F-%ED%91%B8%EC%8B%9C-%EC%95%8C%EB%A6%BC%EC%9D%98/)

 

## **Firebase Messaging 서비스로 실제 푸시 알림(Push Notification) 보내기**

푸시 알림(Push Notification)의 진행 과정은 다음과 같습니다.

1. 앱을 구성하고 APN 서비스에 등록합니다.
2. APN 서비스를 통해 서버에서 특정 장치로 푸시 알림을 보냅니다. Xcode로 시뮬레이션할 것입니다. 서버를 Firebase Messaging 서비스를 이용해 테스트하고 실제로 보냅니다.
3. 앱에서 콜백을 사용하여 푸시 알림을 수신하고 처리합니다.

 

이 중에서 2번의 서버를 실제로 만들고 서비스하려면 상당히 전문적인 지식이 필요합니다. 그래서 보통 직접 만들기보다 웹 서비스에서 제공하는 메시징 배포 서버를 사용하며 여기서도 구글의 [Firebase Messaging](https://firebase.google.com/docs/cloud-messaging) 이라는 서비스를 이용해서 푸시 알림을 보내도록 하겠습니다.

<br>

## **방법**

### **1: Firebase Console에서 프로젝트 생성 후 앱 추가**

Firebase에서 프로젝트를 생성합니다. 프로젝트 생성 과정 중 `GoogleService-Info.plist`를 iOS앱 프로젝트 내에 추가하라고 하는데 파일을 드래그해 추가해줍니다. 그 후 Firebase 프로젝트 내에 iOS 앱을 추가합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.11.51.jpg)

 

### **2: 프로젝트 설정 > 클라우드 메시징 탭에 APN 인증 키 추가**

다음 프로젝트 `설정`(위 스크린샷의 톱니바퀴 모양 버튼)에 들어간 뒤 개발자 센터에서 발급받은 iOS 푸시 알림의 키의 `.p8` 파일을 업로드하고 ID 정보를 입력합니다.  ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.14.58.jpg)

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.11.11.jpg)

 
#### **참고: Key ID 발급 및 Team ID 확인**

>  
> 
> [Apple Developer Member Center](https://developer.apple.com/account)로 이동하여 로그인합니다.
> 
> **Certificates, Identifiers & Profiles**을 선택한 다음 왼쪽 창에서`Key`를 찾습니다. 키 제목의 오른쪽에는`+`버튼을 클릭합니다.
> 
>  ![](/assets/img/wp-content/uploads/2022/09/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2022-09-06-%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB-1.07.05.jpg)
> 
> 적절한 키 이름을 지정합니다. Key Service에서`Apple Push Notifications service(APNs)`을 선택합니다.
> 
>  ![](/assets/img/wp-content/uploads/2022/09/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2022-09-06-%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB-1.07.28.jpg)
> 
>  
> 
> `Continue`를 클릭하고 다음 화면에서`Register`를 클릭하여 새 키를 만듭니다.
> 
>  ![](/assets/img/wp-content/uploads/2022/09/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2022-09-06-%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB-1.07.47.jpg)
> 
> `Download`를 클릭합니다. 다운로드한 파일의 이름은`AuthKey_4SVKWF966R.p8`의 형태와 같습니다. 이 파일을 보관하세요. 알림을 보내려면 이 파일이 필요합니다. 파일 이름의`4SVKWF966R`부분은 Key ID입니다. 이것도 필요합니다.
> 
>  ![](/assets/img/wp-content/uploads/2022/09/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2022-09-06-%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB-1.07.58.jpg)
> 
> 회원 센터의[Membership 페이지](https://developer.apple.com/account/#!/membership)로 이동합니다. Team ID를 메모합니다.
> 
>  
> 
>  ![](/assets/img/wp-content/uploads/2022/09/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2022-09-06-%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB-1.17.38.jpg)

 

업로드 및 정보 입력을 마치면 아래와 같이 인증 키 목록이 추가됩니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.15.35.jpg)

 

### **3: 앱 내에 Firebase 관련 부분 추가**

앱 프로젝트에 _**CocoaPods**_ 또는 **_Swift Package Manager(SPM)_**를 이용해 `FirebaseCore`와 `FirebaseMessaging` 디펜던시를 추가합니다. 제 컴퓨터에서는 SPM이 불안정해서 CocoaPods로 설치하였습니다.

- [Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법](/posts/xcode-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-%EC%BD%94%EC%BD%94%EC%95%84%ED%8C%9Fcocoapods-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EB%94%94%ED%8E%9C%EB%8D%98%EC%8B%9C-%EC%B6%94%EA%B0%80-%EB%B0%A9/)

```ruby
pod 'FirebaseCore'
pod 'FirebaseMessaging'
```

 

워크스페이스 파일로 프로젝트를 다시 연 후 `AppDelegate.swift` 파일에 아래 `import`들을 추가합니다.

```swift
import FirebaseCore
import FirebaseMessaging
```

 

다음 `AppDelegate.swift` 내에 아래 하이라이트 부분들을 추가하거나 변경, 제거합니다. 분량상 자세한 설명은 생략하며 이 코드에 대한 자세한 내용 및 나머지 앱 구현 관련 내용은 아래 목록의 글을 참조하세요.

- [Swift(스위프트): 원격 푸시 알림(Push Notification) 기초 및 푸시 알림의 모의 테스트 방법 上편 (스토리보드)](http://yoonbumtae.com/?p=4692)
- [Swift(스위프트): 원격 푸시 알림(Push Notification) 기초 및 푸시 알림의 모의 테스트 방법 下편 (스토리보드)](http://yoonbumtae.com/?p=4719)

 

```swift
//
//  AppDelegate.swift
//

import UIKit
import UserNotifications
import FirebaseCore
import FirebaseMessaging

enum Identifiers {
    static let viewAction = "VIEW_IDENTIFIER"
    static let archiveAction = "ARCHIVE_IDENTIFER"
    static let newsCategory = "NEWS_CATEGORY"
}

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        // FirebaseMessaging: Firebase Core 설정 및 Messaging 딜리게이트 추가
        FirebaseApp.configure()
        Messaging.messaging().delegate = self // MessagingDelegate
        
        UNUserNotificationCenter.current().delegate = self
        registerForPushNotifications()
        return true
    }
    
    // MARK: UISceneSession Lifecycle
    
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
    
    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }
    
    // MARK: - PushNoti
    
    func registerForPushNotifications() {
        // 1 - UNUserNotificationCenter는 푸시 알림을 포함하여 앱의 모든 알림 관련 활동을 처리합니다.
        UNUserNotificationCenter.current()
        // 2 -알림을 표시하기 위한 승인을 요청합니다. 전달된 옵션은 앱에서 사용하려는 알림 유형을 나타냅니다. 여기에서 알림(alert), 소리(sound) 및 배지(badge)를 요청합니다.
            .requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
                // 3 - 완료 핸들러는 인증이 성공했는지 여부를 나타내는 Bool을 수신합니다. 인증 결과를 표시합니다.
                print("Permission granted: \(granted)")
                // 추가
                guard granted else { return }
                
                // 1
                let viewAction = UNNotificationAction(
                    identifier: Identifiers.viewAction,
                    title: "보기",
                    options: [.foreground])
                
                let archiveAction = UNNotificationAction(
                    identifier: Identifiers.viewAction,
                    title: "보관",
                    options: [.foreground])
                
                // 2
                let newsCategory = UNNotificationCategory(
                    identifier: Identifiers.newsCategory,
                    actions: [viewAction, archiveAction],
                    intentIdentifiers: [],
                    options: [])
                
                // 3
                UNUserNotificationCenter.current().setNotificationCategories([newsCategory])
                
                self.getNotificationSettings()
            }
    }
    
    func getNotificationSettings() {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            print("Notification settings: \(settings)")
            guard settings.authorizationStatus == .authorized else { return }
            DispatchQueue.main.async {
                UIApplication.shared.registerForRemoteNotifications()
            }
            
        }
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        // 제거 또는 코멘트 처리
        // let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
        // let token = tokenParts.joined()
        // print("Device Token: \(token)")
        
        // FirebaseMessaging - 토큰
        Messaging.messaging().apnsToken = deviceToken
    }
    
    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register: \(error)")
    }
    
    func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        // Silent Push Notification
        guard let aps = userInfo["aps"] as? [AnyHashable: Any] else {
            return
        }
    
        if aps["content-available"] as? Int == 1 {
            // 2
            receivePushNotiNews(title: "silent push (Real Device)", body: "...(\(userInfo["work"] as? String ?? ""))...", linkURL: "https://www.silent.com")
            NotificationCenter.default.post(name: .refreshTextView, object: nil)
            
            // 3
            completionHandler(.newData)
        }
        
        completionHandler(.noData)
    }
}

extension AppDelegate: MessagingDelegate {
    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        print("FirebaseMessaging")
        let deviceToken:[String: String] = ["token": fcmToken ?? ""]
        print("Device token:", deviceToken) // 이 토큰은 FCM에서 알림을 테스트하는 데 사용할 수 있습니다.
    }
}

extension AppDelegate: UNUserNotificationCenterDelegate {
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        guard let aps = notification.request.content.userInfo["aps"] as? [AnyHashable: Any] else {
            return
        }
        
        if aps["content-available"] as? Int == 1 {
            receivePushNotiNews(title: "silent push", body: "...", linkURL: "https://www.silent.com")
        } else if aps["content-available"] as? Int == 0 {
            print("ca 0")
        }
        
        // Case 1: 앱이 열린 상태일 때
        let content = notification.request.content
        let linkUrl = content.userInfo["link_url"] as? String ?? "https://google.com"
        receivePushNotiNews(title: "[Case 1] " + content.title, body: content.body, linkURL: linkUrl)
        NotificationCenter.default.post(name: .refreshTextView, object: nil)
        
        // 앱이 열린 상태에서도 푸시 알림을 표시하고 싶으면 아래 코멘트 해제
        // completionHandler([.banner, .badge, .sound])
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
        // Case 2: 앱이 백그라운드(background) 모드이거나 완전히 닫혔을 때(killed or terminated) 되었을 때
        
        let content = response.notification.request.content
        let linkUrl = content.userInfo["link_url"] as? String ?? "https://google.com"
        receivePushNotiNews(title: "[Case 2] " + content.title, body: content.body, linkURL: linkUrl)
        NotificationCenter.default.post(name: .refreshTextView, object: nil)
        
        switch response.actionIdentifier {
        case Identifiers.viewAction:
            if let urlStr = content.userInfo["link_url"] as? String, let url = URL(string: urlStr) {
                NotificationCenter.default.post(name: .viewSafari, object: url)
            }
        case Identifiers.archiveAction:
            // 생략
            break
        default:
            break
        }
        
        completionHandler()
    }
}

func receivePushNotiNews(title: String, body: String, linkURL: String) {
    let newsText = "\(title) : \(body) (\(linkURL)) : \(Date())"
    var newsList = UserDefaults.standard.array(forKey: "NewsList") ?? [String]()
    newsList.append(newsText)
    UserDefaults.standard.set(newsList, forKey: "NewsList")
}

```

- **22-24**
    - Firebase를 프로젝트 내에 추가하고, `AppDelegate` 인스턴스와 `Messaging`을 딜리게이트 연결합니다.
- **99-100**
    - 디바이스 토큰(`deviceToken`)을 Firebase Messaging에게 알려줍니다.
- **126-132**
    - `MessagingDelegate`를 추가한 `extension`을 만든 뒤, 토큰을 발급받은 뒤 할 작업인 `messaging(...didReceiveRegistrationToken...)`을 구현합니다.
    - Firebase Messaging에서 사용할 디바이스 토큰을 콘솔에 출력합니다.
- **148-149, 160-161**
    - 이전의 예제가 `userInfo`중 하나로 URL 텍스트를 입력받도록 되어있는데 `userInfo`가 없는 상황을 가정해서 `nil` 에러를 방지하도록 기본 url을 추가합니다.

 

앱을 **실제 기기**로 빌드 및 실행합니다. 콘솔에 아래와 같은 메시지가 나온다면 `info.plist` 파일에 `FirebaseAppDelegateProxyEnabled` 키를 추가한 뒤 `Boolean`타입의 값 `0`  (또는 `String` 타입의 `NO`)으로 설정합니다.

> _\[_FirebaseMessaging\]\[I-FCM001000\] FIRMessaging Remote Notifications proxy enabled, will swizzle remote notification receiver handlers. If you'd prefer to manually integrate Firebase Messaging, add "FirebaseAppDelegateProxyEnabled" to your Info.plist, and set it to NO. Follow the instructions at: [https://firebase.google.com/docs/cloud-messaging/ios/client#method\_swizzling\_in\_firebase\_messaging](https://firebase.google.com/docs/cloud-messaging/ios/client#method_swizzling_in_firebase_messaging)

 

콘솔에 아래와 같은 메시지를 확인하였다면 성공입니다. 디바이스 토큰을 복사합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.23.51.jpg)

 

### **4: 파이어베이스 Messaging 콘솔에서 사전 테스트**

이제 [Firebase 콘솔 페이지](https://console.firebase.google.com/)로 이동하여 `제품 카테고리 > 빌드 > Cloud Messaging`을 선택합니다. `Send your first message` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.24.41.jpg)  ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.25.09.jpg)

 

아래와 같은 화면이 나타납니다. 실제 메시지를 보내기 전에 미리 테스트를 진행할 수 있습니다. 기본 내용을 입력 후 `[테스트 메시지 전송]`을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.27.04.jpg)

 

위에서 복사했던 디바이스 토큰 값을 붙어넣기 한 뒤 추가합니다. 그리고 `[테스트]` 버튼을 클릭하면 테스트 메시지가 디바이스 토큰을 통해 내 기기로 전송됩니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.27.10.jpg)

 

메시지가 전송된 것을 확인할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/09/IMG_9191.jpg)

 ![](/assets/img/wp-content/uploads/2022/09/IMG_9192.jpg)

 

### **5: 파이어베이스 콘솔에서 실제 메시지 전송**

동일한 페이지에서 실제 메시지를 전송할 수 있습니다. 먼저 시간대를 설정합니다. 3번 메뉴의 `예약`을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.45.51.jpg)

최초 설정은 '지금'이라고 표시되어 있어도 서버의 시간대가 다르기 때문에(미국 LA 기준) 메시지가 제 시간에 전송되지 않는 경우가 있습니다. 시간대를 반드시 대한민국 시간대로 변경 후 설정합니다.

 

다음 5번 메뉴의 `추가 옵션(선택사항)` 메뉴에서 `맞춤 데이터`를 설정합니다. 이 부분은 위 `AppDelegate.swift` 코드의 `link_url`과 같이 `userInfo`에 저장되는 부분입니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.46.17.jpg)

 

모든 설정을 마친 후 `[검토]` 버튼을 클릭하면 아래와 같은 창이 뜹니다. `[게시]` 버튼을 클릭하면 메시지가 전송됩니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-09-pm-10.46.26.jpg)

 

오후 10:50분에 보내도록 설정했는데 실제로 10:50분에 메시지가 도착했습니다. URL도 맞춤 설정에서 입력한 URL로 도착한 것을 확인할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/09/IMG_9193.jpg)  ![](/assets/img/wp-content/uploads/2022/09/IMG_9194.jpg)

 


 

<!-- \[rcblock id="4560"\] -->

