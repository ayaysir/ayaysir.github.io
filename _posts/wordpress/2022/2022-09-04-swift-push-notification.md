---
title: "Swift(스위프트): 원격 푸시 알림(Push Notification) 기초 및 푸시 알림의 모의 테스트 방법 上편 (스토리보드)"
date: 2022-09-04
categories: 
  - "DevLog"
  - "Swift UIKit"
---

<!-- \[rcblock id="4769"\] -->


**출처**

- [push-notifications-tutorial-getting-started](https://www.raywenderlich.com/11395893-push-notifications-tutorial-getting-started)

 

## **개요**

Push notification(푸시 노티피케이션) 흔히 푸시 알림, 푸시 메시지로 일컫는 기기 메시지의 형태인데 네트워크를 통해 정보를 전송받으면 그 정보를 바탕으로 앱에서 메시지를 그대로 표시하거나 또는 가공하여 표시합니다.

 ![](/assets/img/wp-content/uploads/2022/09/IMG_9A986B8A82D7-1-copy.jpg)

위 스크린샷은 로컬 노티피케이션의 예제로 제목과, 내용이 첨부되어 있습니다.

이하 편의상 Push Notification을 _푸시 알림_이라고 부르겠습니다.

 

## **푸시 알림 튜토리얼**

iOS 개발자는 사람들이 멋진 앱을 지속적으로 사용하는 것을 좋아합니다. 그러나 사용자는 때때로 앱을 닫고 다른 활동을 하고 있습니다. 다행히도 푸시 알림을 통해 개발자는 사용자가 앱을 적극적으로 사용하지 않을 때도 사용자에게 다가가 작은 작업을 수행할 수 있습니다! 이 자습서에서는 다음 방법을 배웁니다.

- 푸시 알림을 수신하도록 앱을 구성합니다.
- 사용자에게 표시하거나 다른 작업을 수행합니다.

참고: 이 자습서에서는 iOS용 푸시 알림을 사용하는 방법에 대한 기본 사항을 다룹니다. 자체 앱에서 푸시 알림을 사용하는 데 필요한 자세한 내용과 자세한 내용은 iOS 전문가 Scott Grosch의 튜토리얼이 작성한 푸시 알림 책([raywenderlinch 링크](https://www.raywenderlich.com/11395893-push-notifications-tutorial-getting-started#toc-anchor-013:~:text=see%20our%20book-,Push%20Notifications%20by%20Tutorials,-by%20iOS%20expert))을 참조하세요. 리치 미디어 알림, 알림 작업, 그룹화된 알림 등을 다룹니다.

 

## **시작하기**

푸시 알림이란 앱이 실행되고 있지 않거나 전화기가 잠자기 상태인 경우에도 Apple 푸시 알림 서비스(APN; Apple Push Notification Service)를 통해 앱으로 전송되는 메시지입니다. 푸시 알림을 어떻게 사용할 수 있을까요?

- 경고라고 하는 짧은 문자 메시지를 표시하여 앱의 새로운 사항에 주의를 집중시킵니다.
- 알림 소리를 재생합니다.
- 앱 아이콘에 배지 번호를 설정하여 사용자에게 새 항목이 있음을 알립니다.
- 사용자가 앱을 열지 않고도 수행할 수 있는 작업을 제공합니다.
- 미디어 첨부 파일을 표시합니다.
- 앱이 백그라운드에서 작업을 수행할 수 있도록 사용자가 모르게 조용히 메시지를 보냅니다.
- 알림을 스레드로 그룹화합니다.
- 전달된 알림을 편집하거나 제거합니다.
- 알림을 표시하기 전에 코드를 실행하여 알림을 변경할 수 있습니다..
- 알림에 대한 맞춤형 대화형 UI를 표시합니다.
- 기타 등등

 

이 자습서에서는 앱에서 푸시 알림 생성을 시작하는 데 도움이 되는 이러한 여러 용도를 다룹니다. 이 튜토리얼을 진행하려면 다음이 필요합니다.

- Xcode 11.4 이상. 이전 버전의 Xcode는 시뮬레이터를 사용한 푸시 알림을 지원하지 않습니다.
- 푸시 알림 권한으로 앱을 컴파일할 수 있는 **Apple 개발자 프로그램 멤버십**.
- AppDelegate, SceneDelegate 기반의 스토리보드 iOS Single App 프로젝트

 

> 참고: 튜토리얼 下편에서 실제 기기로 보내기에서 실제 기기로 푸시 알림을 보내는 방법을 배우게 됩니다.

 

푸시 알림을 보내고 받으려면 다음 세 가지 주요 작업을 수행해야 합니다.

1. 앱을 구성하고 APN 서비스에 등록합니다.
2. APN 서비스를 통해 서버에서 특정 장치로 푸시 알림을 보냅니다. Xcode로 시뮬레이션할 것입니다.
3. 앱에서 콜백을 사용하여 푸시 알림을 수신하고 처리합니다.

 

푸시 알림을 보내는 것은 앱의 서버 구성 요소의 책임입니다. 많은 앱이 서드파티 서비스를 사용하여 푸시 알림을 보냅니다. 다른 사람들은 사용자 정의 솔루션이나 인기 있는 라이브러리(예: [Houston](https://github.com/nomad/houston))를 사용합니다. 이 튜토리얼에서는 푸시 메시지 보내기에 대해서만 다룰 것이므로 이에 대한 자세한 내용은 "다음은 뭘 해야 합니까?" 섹션을 참조하세요.

 

UIKit 스토리보드 기반의 iOS SingleApp 프로젝트를 생성합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-10.58.50.jpg) 
 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-10.59.20.jpg)

 

 

## **푸시 알림 보내기 및 받기**

### **앱 구성**

푸시 알림은 보안이 매우 중요합니다. 다른 사람이 앱을 통해 사용자에게 푸시 알림을 보내는 것을 원하지 않습니다. 푸시 알림을 안전하게 수신하도록 앱을 구성하려면 여러 작업을 수행해야 합니다.

 

### **푸시 알림 서비스 활성화**

Xcode의 프로젝트 탐색기의 프로젝트 설정의 `General` 탭에서 번들 식별자를 고유값으로 변경하여 Apple의 푸시 알림 서버가 푸시를 이 앱으로 보낼 수 있도록 합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.00.34.jpg)

 

다음으로 개발자 계정에서 앱 ID를 생성하고 푸시 알림 자격을 활성화해야 합니다. Xcode에는 이를 수행하는 간단한 방법이 있습니다. 위의 창에서 `Signing & Capabilities` 탭을 클릭한 다음 `+` 버튼을 클릭합니다. 검색창에 "push"를 입력하고 `Push Notifications`를 선택합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.03.39.jpg)

 

푸시 알림 자격을 추가한 후 프로젝트 창은 다음과 같아야 합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.04.48.jpg)

 

애플 개발자 센터의 [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)에 로그인 한 뒤 해당 앱의 Identifier 페이지에 들어가면 이를 확인할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.06.05.jpg)

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.08.16.jpg)

 

이것이 지금 구성해야 하는 전부입니다. 앱 구현을 위한 준비를 마쳤습니다.

 

### **사용자 알림 권한 요청**

푸시 알림을 등록하려면 두 단계를 거쳐야 합니다. 먼저 알림을 표시하려면 사용자의 권한을 받아야 합니다. 권한을 획득하였다면 원격 푸시 알림을 수신하도록 기기를 등록할 수 있습니다. 이후 시스템은 이 장치에 대한 "주소"로 생각할 수 있는 장치 토큰(Device Token)을 제공합니다.

앱 실행 직후 푸시 알림을 등록합니다. 먼저 사용자 권한을 요청하는 코드를 작성하세요.

`AppDelegate.swift`를 열고 파일 상단에 다음을 추가합니다.

```swift
import UserNotifications
```

 

그런 다음 `AppDelegate` 끝에 다음 메서드를 추가합니다.

```swift
func registerForPushNotifications() {
    // 1 - UNUserNotificationCenter는 푸시 알림을 포함하여 앱의 모든 알림 관련 활동을 처리합니다.
    UNUserNotificationCenter.current()
    // 2 -알림을 표시하기 위한 승인을 요청합니다. 전달된 옵션은 앱에서 사용하려는 알림 유형을 나타냅니다. 여기에서 알림(alert), 소리(sound) 및 배지(badge)를 요청합니다.
        .requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            // 3 - 완료 핸들러는 인증이 성공했는지 여부를 나타내는 Bool을 수신합니다. 인증 결과를 표시합니다.
            print("Permission granted: \(granted)")
        }
}
```

`requestAuthorization(options:completionHandler:)`에 전달하는 `options`에는 `UNAuthorizationOptions`의 모든 조합이 포함될 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/08/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2022-08-10-%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE-10.11.59.jpg)

<!-- \[the\_ad id="3513"\] -->

 

`application(_:didFinishLaunchingWithOptions:)` 내의 끝 `return`문 바로 직전에 다음을 추가합니다.

```swift
registerForPushNotifications()
```

 

여기에서 `registerForPushNotifications()`를 호출하면 앱이 시작될 때마다 푸시 알림 등록을 시도합니다.

빌드 및 실행합니다. 앱이 실행되면 알림을 보낼 수 있는 권한을 요청하는 메시지가 표시되어야 합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.19.36.jpg)

 

`Allow`를 탭하면 이제 앱에서 알림을 표시할 수 있습니다. 그러나 사용자가 권한을 거부하면 어떻게 될까요? `AppDelegate` 내부에 다음 메서드를 추가합니다.

```swift
func getNotificationSettings() {
    UNUserNotificationCenter.current().getNotificationSettings { settings in
        print("Notification settings: \(settings)")
    }
}
```

이 메서드는 사용자가 부여한 설정을 반환합니다. 지금은 `print` 문만 있지만 이 작업에 대해 더 많은 작업을 수행하기 위해 다시 여기로 돌아올 것입니다.

 

`registerForPushNotifications()`에서 `requestAuthorization(options:completionHandler:)`에 아래 하이라이트 부분을 추가합니다.

```swift
func registerForPushNotifications() {
    // 1 - UNUserNotificationCenter는 푸시 알림을 포함하여 앱의 모든 알림 관련 활동을 처리합니다.
    UNUserNotificationCenter.current()
    // 2 -알림을 표시하기 위한 승인을 요청합니다. 전달된 옵션은 앱에서 사용하려는 알림 유형을 나타냅니다. 여기에서 알림(alert), 소리(sound) 및 배지(badge)를 요청합니다.
        .requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            // 3 - 완료 핸들러는 인증이 성공했는지 여부를 나타내는 Bool을 수신합니다. 인증 결과를 표시합니다.
            print("Permission granted: \(granted)")
            // 추가
            guard granted else { return }
            self.getNotificationSettings()
        }
}
```

완료 핸들러(completion handler)에서 `getNotificationSettings()`에 대한 호출을 추가했습니다. 이는 사용자가 언제든지 설정 앱으로 이동하여 알림 권한을 변경할 수 있기 때문에 중요합니다. `guard` 문은 권한이 부여되지 않은 경우 이 호출을 피합니다.

 

### **APN 서비스에 등록**

이제 권한이 있으므로 원격 푸시 알림을 등록합니다. `getNotificationSettings()`에서 클로저 내부의 `print`문 아래에 다음을 추가합니다.

```swift
guard settings.authorizationStatus == .authorized else { return }
DispatchQueue.main.async {
    UIApplication.shared.registerForRemoteNotifications()
}
```

여기에서 `authorizationStatus`가 `.authorized`인지 확인합니다. 사용자가 알림 권한을 부여했다면 `UIApplication.shared.registerForRemoteNotifications()`를 호출하여 Apple 푸시 알림 서비스에 등록을 시작합니다. 메인 스레드에서 이것을 호출해야 합니다. 그렇지 않으면 런타임 경고가 발생합니다.

 

`AppDelegate` 끝에 다음을 추가합니다.

```swift
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    let tokenParts = deviceToken.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("Device Token: \(token)")
}
```

이 메서드는 `registerForRemoteNotifications()`가 성공할 때마다 iOS에서 호출됩니다. 코드가 난해해 보일 수 있지만 단순히 수신된 `deviceToken`을 String으로 변환합니다. APN 서비스에서 제공하며 특정 기기에서 이 앱을 고유하게 식별합니다.

푸시 알림을 보낼 때 서버는 이 토큰을 "주소"로 사용하여 올바른 목적지 기기에 전달합니다. 이제 앱에서 이 토큰을 서버로 보내 저장하고 나중에 알림을 보내는 데 사용할 수 있습니다.

 

바로 밑에 다음 코드를 추가합니다.

```swift
func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register: \(error)")
}
```

이 메서드는 `registerForRemoteNotifications()`가 실패하면 `iOS`에서 호출됩니다. 지금은 error를 표시하고 있습니다.

 

빌드 및 실행합니다. 시뮬레이터에 있으므로 등록 실패 오류가 표시됩니다. 지금은 무시해도 됩니다. 나중에 실제 기기에서 실행할 때 아래 스크린샷과 같이 콘솔 출력에서 토큰을 받아야 합니다.

 ![](/assets/img/wp-content/uploads/2022/09/Device-Token.png)

 

### **시뮬레이터에 푸시 알림 보내기**

텍스트 편집기를 사용하여 Xcode의 `simctl` 유틸리티에 전달할 `first.apn`이라는 파일을 만듭니다. (터미널로 접근할 수 있으면 위치 상관 없음) 다음 JSON 텍스트를 붙여넣고 파일을 저장합니다.

```json
{
  "aps": {
    "alert" : {
         "title" : "Breaking News!",
         "body" : "The content of the alert message."
      },
    "sound": "default"
  },
  "link_url": "https://www.lipsum.com/"
}
```

이 JSON의 구조는 다음 섹션에서 설명합니다.

시뮬레이터에서 앱을 다시 빌드하고 실행한 다음 앱을 백그라운드로 실행하거나 기기를 잠급니다. 앱은 포어그라운드(foreground)에 있는 동안 아직 푸시 알림을 처리할 수 없습니다.

`simctl`을 사용하려면 앱을 실행하는 시뮬레이터의 장치 식별자(`Identifier`)를 알아야 합니다. 식별자를 얻으려면 Xcode에서 Windows ▸ Device and Simulators를 선택한 다음 상단의 Simulator 탭을 선택하고 왼쪽 목록에서 사용 중인 시뮬레이터를 선택합니다. 마우스를 사용하여 식별자를 복사합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.44.34.jpg)

 

터미널 앱을 열고 `first.apn`을 저장한 디렉토리로 위치 변경합니다.

다음 `booted`(시뮬레이터에서 기기가 하나만 실행되고 있는 경우에 사용) 또는 Xcode의 장치 식별자를 사용하여 다음 명령을 입력합니다.

`xcrun simctl push [device_identifier] [bundle_identifier] first.apn`

`device_identifier`를 Xcode에서 복사한 기기 식별자로 바꾸고 `bundle_identifier`를 앱의 번들 식별자로 바꾸세요. 프로젝트를 처음 설정할 때 사용한 식별자입니다. 다음은 예입니다.

 ![](/assets/img/wp-content/uploads/2022/09/Sending-push-with-xcrun-simctl-650x411-1.png)

명령을 실행하면 시뮬레이터에 푸시 알림이 표시됩니다. 푸시 알림을 탭하면 앱이 열립니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-03-pm-11.53.11.jpg)

 

### **기본 푸시 알림 분석**

```json
{
  "aps": {
    "alert" : {
         "title" : "Breaking News!",
         "body" : "The content of the alert message."
      },
    "sound": "default"
  },
  "link_url": "https://www.lipsum.com/"
}
```

페이로드는 하나 이상의 항목을 포함하는 JSON 사전(`dictionary`)입니다. 이 예에서 `aps`는 `alert`, `sound` 및 `link_url` 필드를 포함합니다. 장치가 이 푸시 알림을 수신하면 `"Breaking News!"`라는 텍스트와 함께 경고 보기가 표시됩니다. 표준 음향 효과를 재생합니다.

`link_url`은 실제로 사용자 정의 필드입니다. 이와 같이 페이로드에 사용자 정의 필드를 추가할 수 있으며 애플리케이션에 전달됩니다. 아직 앱 내에서 처리하지 않기 때문에 이 키/값 쌍은 현재 아무 작업도 수행하지 않습니다.

페이로드에 대한 자세한 내용은 [Apple’s documentation](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification#2943359)(영문) 을 참조하세요.

`aps` 사전에 추가할 수 있는 8개의 내장 키가 있습니다(자세한 내용은  [Apple’s documentation](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification#2943359) 참조).

- `alert`: 이전 예에서와 사전 또는 문자일 수 있습니다. 사전으로서 텍스트를 현지화하거나 알림의 내용을 추가/변경할 수 있습니다.
- `badge`: 앱 아이콘 모서리에 표시되는 숫자입니다. 이 값을 0으로 설정하여 배지를 제거할 수 있습니다.
- `sound`: 앱에 있는 사용자 지정 알림 소리 파일의 이름입니다. 30초 미만이어야 합니다.
- `thread-id`: 이 키를 사용하여 알림을 그룹화합니다.
- `category`: 알림에 대한 사용자 지정 작업을 표시하는 데 사용되는 알림의 범주를 정의합니다. 이에 대해서는 곧 살펴보게 될 것입니다.
- `content-available`: 이 키를 1로 설정하면 푸시 알림이 무음이 됩니다(Silent Push Notifications). 下편의 조용한 푸시 알림 섹션에서 이에 대해 배우게 됩니다.
- `mutable-content`: 이 키를 1로 설정하면 앱이 알림을 표시하기 전에 수정할 수 있습니다.
- `target-content-id`: 이것은 앞으로 가져온 window의 식별자입니다.

 

페이로드가 `4096바이트`를 초과하지 않는 한 사용자 지정 데이터를 원하는 만큼 추가할 수 있습니다.

 

## **푸시 알림 처리**

이 섹션에서는 앱이 알림을 수신하고 사용자가 알림을 탭할 때 작업을 수행하는 방법을 배웁니다.

 

<!-- \[the\_ad id="3020"\] -->

 

### **푸시 알림을 받으면 어떻게 되는지 이해하기**

앱이 푸시 알림을 수신하면 iOS는 `UIApplicationDelegate`에서 상황에 맞는 메서드를 호출합니다.

알림을 받았을 때 앱의 상태에 따라 알림을 다르게 처리해야 합니다.

1. 앱이 실행되고 있지 않으며, 사용자가 푸시 알림을 눌러 앱을 실행하는 경우 (`Case 1`)
2. 앱이 포어그라운드(foreground) 또는 백그라운드(background)에서 실행 중인 경우 (`Case 2`)

 

먼저 전역함수 `receivePushNotiNews`를 프로젝트에 추가합니다. 이 함수는 받은 알림을 `UserDefaults`에 저장하는 역할을 합니다.

```swift
func receivePushNotiNews(title: String, body: String, linkURL: String) {
    let newsText = "\(title) : \(body) (\(linkURL)) : \(Date())"
    var newsList = UserDefaults.standard.array(forKey: "NewsList") ?? [String]()
    newsList.append(newsText)
    UserDefaults.standard.set(newsList, forKey: "NewsList")
}

```

 

**다음** **`func application(...didFinishLaunchingWithOptions...)`** **함수 안에 아래 코드를 추가합니다.**

```
UNUserNotificationCenter.current().delegate = self
```

 

`NotificationCenter`를 사용할 것이므로 아래 `extension`도 프로젝트에 추가합니다.

```swift
import Foundation

extension Notification.Name {
    static let refreshTextView = Notification.Name("RefreshTextView")
}

```

 

`UITextView`를 `ViewController.swift`와 `@IBOutlet` 연결하고

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-04-pm-8.48.37.jpg)

 

`viewDidLoad`에 아래 코드를 추가합니다.

```swift
refreshTextView()
NotificationCenter.default.addObserver(self, selector: #selector(didRecieveNotification(_:)), name: .refreshTextView, object: nil)
```

- `NotificationCenter.default.addObserver`
    - `.refreshTextView`라는 이름의 옵저버가 보낸 `post`를 수신하는 옵저버를 추가하는 부분입니다.
    - 해당 수신이 들어올 때마다 셀렉터 함수 `didRecieveNotification(_:)`이 실행됩니다.

 

`refreshView()`의 코드를 클래스 내부에 추가합니다.

```swift
func refreshTextView() {
    let newsList = UserDefaults.standard.array(forKey: "NewsList") as? [String] ?? [String]()
    txvLogs.text = newsList.reversed().joined(separator: "\n\n")
}
```

 

`didRecieveNotification` 함수를 추가합니다. 셀렉터 함수이므로 `@objc`를 붙여줍니다.

```swift
@objc func didRecieveNotification(_ notification: Notification) {
    refreshTextView()
}
```

 

#### **Case 1: 앱이 열린 상태일 때**

```swift
extension AppDelegate: UNUserNotificationCenterDelegate {
    
    func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        // Case 1: 앱이 열린 상태일 때
        let content = notification.request.content
        receivePushNotiNews(title: "[Case 1] " + content.title, body: content.body, linkURL: content.userInfo["link_url"] as! String)
        NotificationCenter.default.post(name: .refreshTextView, object: nil)
        
        // 앱이 열린 상태에서도 푸시 알림을 표시하고 싶으면 아래 코멘트 해제
        // completionHandler([.banner, .badge, .sound])
    }
    
    // ... //
}
```

- `content`
    - `notification.request.content`는 푸시 알림의 `title`, `body`, `userInfo`등의 기본 정보가 들어가 있습니다.
- `receivePushNotiNews` 함수로 해당 내용을 UserDefaults 저장소에 등록합니다.
- `NotificationCenter`의 `post` 기능을 이용해 추가되었다면 텍스트 뷰를 새로고침합니다.

<!-- http://www.giphy.com/gifs/WMgkmCgH9rpt3SuUAq -->
![](https://)

 

 

#### **Case 2: 앱이 백그라운드(background) 모드이거나 완전히 닫혔을 때(killed or terminated) 되었을 때**

바로 위의 `extension` 안에 다음 함수를 추가합니다.

```swift
func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    // Case 2: 앱이 백그라운드(background) 모드이거나 완전히 닫혔을 때(killed or terminated) 되었을 때
    let content = response.notification.request.content
    receivePushNotiNews(title: "[Case 2] " + content.title, body: content.body, linkURL: content.userInfo["link_url"] as! String)
    NotificationCenter.default.post(name: .refreshTextView, object: nil)
    
    completionHandler()
}
```

작동 원리는 Case 1과 같습니다.

<!-- http://www.giphy.com/gifs/JdcJf23PuganowYdRY -->
![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHdpdHB1aHNwNjc2OTBxZzJxeHh6cHZiMTQ0bWJ0Zjhlb25ibHRxMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JdcJf23PuganowYdRY/giphy.gif)

![앱이 완전히 종료된 상태를 만드려면 위의 그림처럼 앱을 종료합니다.](/assets/img/wp-content/uploads/2022/09/Simulator-Screen-Shot-iPhone-11-2022-09-04-at-20.46.10-copy.jpg)  
*앱이 완전히 종료된 상태를 만드려면 위의 그림처럼 앱을 종료합니다.*

![앱이 완전히 종료된 상태에서 푸시 알림을 클릭하면](/assets/img/wp-content/uploads/2022/09/Simulator-Screen-Shot-iPhone-11-2022-09-04-at-20.41.38-copy.jpg)  
*앱이 완전히 종료된 상태에서 푸시 알림을 클릭하면*

![앱이 열리면서 목록이 갱신됩니다.](/assets/img/wp-content/uploads/2022/09/Simulator-Screen-Shot-iPhone-11-2022-09-04-at-22.51.20-copy.jpg)  
*앱이 열리면서 목록이 갱신됩니다.*
 

> 참고: 푸시 알림의 도착은 보장되지 않습니다. 이 앱에서는 전체 뉴스 목록을 갖는 것이 그다지 중요하지 않기 때문에 그 점에서는 괜찮습니다. 하지만 일반적으로 푸시 알림을 콘텐츠를 전달하는 유일한 방법으로 사용해서는 안 됩니다. 대신 푸시 알림은 사용 가능한 새 콘텐츠가 있음을 알리고 앱이 소스(예: REST API)에서 콘텐츠를 다운로드할 수 있도록 해야 합니다.

 

## 다음 글

 [**(下편에서 계속됩니다.)**](/posts/swift%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EC%9B%90%EA%B2%A9-%ED%91%B8%EC%8B%9C-%EC%95%8C%EB%A6%BCpush-notification-%EA%B8%B0%EC%B4%88-%EB%B0%8F-%ED%91%B8%EC%8B%9C-%EC%95%8C%EB%A6%BC%EC%9D%98/)

 

<!-- \[rcblock id="4560"\] -->

