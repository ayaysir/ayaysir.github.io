---
title: "Swift(스위프트): 원격 푸시 알림(Push Notification) 기초 및 푸시 알림의 모의 테스트 방법 下편 (스토리보드)"
date: 2022-09-05
categories: 
  - "DevLog"
  - "Swift UIKit"
---

\[rcblock id="4769"\]

 

**출처**

- [push-notifications-tutorial-getting-started](https://www.raywenderlich.com/11395893-push-notifications-tutorial-getting-started)

 

##### [(上편 바로가기)](http://yoonbumtae.com/?p=4692)

 

### **실행 가능한 알림(Actionable Notifications) 작업**

실행 가능한 알림(Actionable Notifications)을 사용하면 알림 자체에 사용자 정의 버튼을 추가할 수 있습니다. 이메일 알림이나 트윗에서 그 자리에서 "답장" 또는 "즐겨찾기"를 하는 것을 본 적이 있을 것입니다.

 ![](/assets/img/wp-content/uploads/2022/09/IMG_34874A837FD8-1.jpg)

 

카테고리를 사용하여 알림을 등록할 때 앱에서 실행 가능한 알림을 정의할 수 있습니다. 알림의 카테고리에는 몇 가지 미리 설정된 사용자 지정 작업이 있을 수 있습니다.

등록되면 서버에서 푸시 알림의 카테고리를 설정할 수 있습니다. 해당 작업을 수신하면 사용자가 사용할 수 있습니다.

이 앱의 경우 `[보기]`라는 사용자 지정 작업으로 뉴스 카테고리를 정의합니다. 이 작업을 통해 사용자는 원하는 경우 앱에서 뉴스 기사를 볼 수 있습니다.

`[보기]` 및 `[보관]`이라는 메뉴를 만들어서 `[보기]` 버튼을 클릭하면 첨부된 링크로 연결하여 웹 페이지를 보여주는 기능을 구현할 것입니다.

 

먼저 프로젝트에 아래 `enum`을 추가합니다.

```
enum Identifiers {
    static let viewAction = "VIEW_IDENTIFIER"
    static let archiveAction = "ARCHIVE_IDENTIFER"
    static let newsCategory = "NEWS_CATEGORY"
}
```

 

`registerForPushNotifications()`에서 `guard` 문 바로 아래와 `getNotificationSettings()`의 위 사이에 다음을 삽입합니다.

```
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
```

이를 단계별로 살펴보면 다음과 같습니다.

1. `[보기]` 버튼 및 `[보관]` 버튼을 사용하여 트리거될 때 앱을 포어그라운드(foreground)에서 여는 새 알림 작업을 만듭니다. 작업에는 iOS가 동일한 알림에서 다른 작업을 구별하는 데 사용하는 고유한 식별자(identifier)가 있습니다.
2. 해당 작업들을 포함할 뉴스 카테고리를 정의합니다. 여기에는 푸시 알림이 이 카테고리에 속하도록 지정하기 위해 페이로드에 포함해야 하는 고유 식별자도 있습니다.
3. setNotificationCategories를 호출하여 실행 가능한 새 알림을 등록합니다.

 

앱을 빌드 및 실행하여 새 알림 설정을 등록합니다.

앱을 백그라운드로 만든 다음 `xcrun simctl` 유틸리티를 통해 다음 페이로드를 보냅니다.

```
{
  "aps": {
    "alert" : {
         "title" : "Breaking News! Wake Up!!",
         "body" : "The content of the alert message."
      },
    "sound": "default",
    "category": "NEWS_CATEGORY"
  },
  "link_url": "https://www.lipsum.com/"
}
```

알림이 표시되면 알림을 아래로 당기거나 또는 길게 눌러서 Actionable Notifications를 표시합니다.

 ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-12.23.30.jpg)

버튼을 탭하면 앱이 시작되지만 아직 아무 작업도 수행되지 않습니다. 뉴스 항목을 표시하도록 하려면 대리자(delegate)에서 더 많은 이벤트 처리를 핸들링해야 합니다.

 

#### **알림 작업 처리**

알림 작업이 트리거될 때마다 `UNUserNotificationCenter`는 `delegate`에게 알려야 합니다.

 

먼저, `NotificationCenter`를 사용할 것이므로 `Notification.Name`의 `extension`에 새로운 이름을 추가합니다.

```
extension Notification.Name {
    static let refreshTextView = Notification.Name("RefreshTextView")
    static let viewSafari = Notification.Name("ViewSafari")
}
```

 

`AppDelegate.swift`로 돌아가서 `UNUserNotificationCenterDelegate extension` 안의 `...didReceive...` 함수에 다음과 같이 추가하세요.

```
func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    // Case 2: 앱이 백그라운드(background) 모드이거나 완전히 닫혔을 때(killed or terminated) 되었을 때
    let content = response.notification.request.content
    
    receivePushNotiNews(title: "[Case 2] " + content.title, body: content.body, linkURL: content.userInfo["link_url"] as! String)
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
```

- `switch response.actionIdentifier`
    - `actionIdentifier`를 확인합니다. `viewAction` 작업이고 링크가 유효한 `URL`이면 `.viewSafari` 노티피케이션을 `post` 합니다.
    - 노티피케이션 post 시 오브젝트(`object`)로 `url`을 포함시켜 보냅니다.

 

뷰 컨트롤러의 `viewDidLoad` 안에 새로운 노티피케이션 옵저버를 추가합니다.

```
NotificationCenter.default.addObserver(self, selector: #selector(openSafari(_:)), name: .viewSafari, object: nil)
```

 

뷰 컨트롤러에 `import SafariServices`를 추가합니다.

 

뷰 컨트롤러 안에 셀렉터 함수 `openSafari`를 추가합니다.

```
@objc func openSafari(_ notification: Notification) {
    guard let url = notification.object as? URL else {
        return
    }
    let safari = SFSafariViewController(url: url)
    self.present(safari, animated: true)
}
```

- 오브젝트(`object`)에 담긴 `url`을 꺼내 `SFSafariViewController`를 통해 접속합니다.

 

빌드 및 실행 후, 보낼 소식과 첨부 `url`을 갱신한 새로운 페이로드를 전송합니다.

```
{
  "aps": {
    "alert" : {
         "title" : "긴급 속보!!",
         "body" : "The content of the alert message."
      },
    "sound": "default",
    "category": "NEWS_CATEGORY"
  },
  "link_url": "https://www.apple.com/kr"
}
```

\[caption id="attachment\_4722" align="alignnone" width="386"\] ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-12.52.43.jpg) `[보기]` 버튼을 클릭하면\[/caption\]

\[caption id="attachment\_4723" align="alignnone" width="419"\] ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-12.53.29.jpg) 페이로드에 첨부한 `URL`로 접속됨 (`SFSafariViewController` 사용)\[/caption\]

 

### **실제 기기로 보내기**

실제 기기에 푸시 알림을 보내거나 조용한 푸시(silent push)를 시도하려면 몇 가지 추가 설정이 필요합니다. [PushNotifications](https://github.com/onmyway133/PushNotifications/releases) 유틸리티를 다운로드합니다. 이 유틸리티 앱을 사용하여 실제 장치에 알림을 보냅니다. 설치하려면 [설치 방법의 지침](https://github.com/onmyway133/PushNotifications#how-to-install)을 따릅니다. 이 유틸리티는 [추가 설정을 요구할 수 있으므로(Catalina 이상)](https://github.com/onmyway133/PushNotifications#opening-app-on-macos-catalina-1015)이므로 앱을 열 때 특히 주의하세요.

[Apple Developer Member Center](https://developer.apple.com/account)로 이동하여 로그인합니다.

푸시 알림을 보내려면 인증 키가 필요합니다. **Certificates, Identifiers & Profiles**을 선택한 다음 왼쪽 창에서 `Key`를 찾습니다. 키 제목의 오른쪽에는 `+` 버튼이 있습니다. 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-1.07.05.jpg)

적절한 키 이름을 지정합니다. Key Service에서 `Apple Push Notifications service(APNs)`을 선택합니다.

 ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-1.07.28.jpg)

 

`Continue`를 클릭하고 다음 화면에서 `Register`를 클릭하여 새 키를 만듭니다.

 ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-1.07.47.jpg)

`Download`를 클릭합니다. 다운로드한 파일의 이름은 `AuthKey_4SVKWF966R.p8`의 형태와 같습니다. 이 파일을 보관하세요. 알림을 보내려면 이 파일이 필요합니다. 파일 이름의 `4SVKWF966R` 부분은 Key ID입니다. 이것도 필요합니다.

 ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-1.07.58.jpg)

필요한 마지막 조각은 Team ID입니다. 회원 센터의 [Membership 페이지](https://developer.apple.com/account/#!/membership)로 이동합니다. Team ID를 메모합니다.

 

 ![](/assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-06-오전-1.17.38.jpg)

 

이제 첫 번째 푸시 알림을 보낼 준비가 되었습니다. 한 가지만 더 있으면 됩니다.

실제 기기에서 앱을 실행하고 디버거 콘솔에서 장치 토큰을 복사하여 메모합니다.

 ![](/assets/img/wp-content/uploads/2022/09/Device-Token.png)

 

PushNotifications 유틸리티를 시작하고 다음 단계를 완료합니다.

 ![](/assets/img/wp-content/uploads/2022/09/scr-2022-09-06-오전-1.21.58.jpg)

1. `Authentication`에서 `Token`을 선택합니다.
2. `Select P8` 버튼을 클릭하고 이전 섹션의 `.p8` 파일을 선택합니다.
3. 해당 필드에 **Key ID**와 **Team ID**를 입력합니다.
4. 본문 아래에 앱의 **번들 ID**와 **기기 토큰**을 입력합니다. 요청 본문을 다음과 같이 변경합니다.

```
{
  "aps": {
    "alert" : {
         "title" : "긴급 속보!! (실제 기기)",
         "body" : "The content of the alert message."
      },
    "sound": "default",
    "category": "NEWS_CATEGORY"
  },
  "link_url": "https://www.apple.com/kr"
}
```

`PushNotifications`에서 `Send` 버튼을 클릭합니다.

아래 스크린샷과 같은 푸시 알림을 받아야 합니다.

 ![](/assets/img/wp-content/uploads/2022/09/IMG_9135.jpg)

 

#### **일반적인 문제 해결**

다음은 발생할 수 있는 몇 가지 문제입니다.

- 알림이 전부 도착하지 않는 문제: 많은 푸시 알림을 동시에 보내지만 몇 개만 수신하더라도 두려워하지 마세요. 그것은 설계에 의한 것입니다. APN은 각 장치에 대한 QoS(서비스 품질) 대기열을 유지 관리합니다. 이 큐의 크기는 1이므로 여러 알림을 보내면 마지막 알림이 무시됩니다.
- 푸시 알림 서비스 연결 문제: APN에서 사용하는 포트를 차단하는 방화벽이 있을 수 있습니다. 이러한 포트의 차단을 해제했는지 확인하세요.

 

### **조용한 푸시 알림 (Silent Push Notifications) 사용**

자동 푸시 알림은 백그라운드에서 일부 작업을 수행하기 위해 앱을 자동으로 깨울 수 있습니다.

적절한 서버 구성 요소를 사용하면 매우 효율적일 수 있습니다. 앱에서 지속적으로 데이터를 폴링(polling)할 필요가 없습니다. 새 데이터를 사용할 수 있을 때마다 자동 푸시 알림을 보낼 수 있습니다.

시작하려면 프로젝트 설정의 `TARGETS` 메뉴로 이동합니다. 이제 `Signing & Capabilities` 탭을 클릭하고 `Background Modes capability`를 추가합니다. 그런 다음 `Remote notifications` 옵션을 체크합니다.

 ![](/assets/img/wp-content/uploads/2022/09/Background-modes-remote-notifications-1.png)

참고로 시뮬레이터 + simctl은 조용한 푸시 보내기 기능에 버그가 있기 때문에 실제 기기 기준으로만 설명하겠습니다.

- [testing-silent-push-notifications-in-xcode11-4-beta](https://stackoverflow.com/questions/60192628/testing-silent-push-notifications-in-xcode11-4-beta)

 

`AppDelegate.swift`로 돌아가서 클래스 안에 아래 함수를 추가하세요.

```
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
```

코드 살펴보기:

1. `content-available`이 `1`로 설정되어 있는지 확인합니다. 그렇다면 이것은 조용한 푸시 알림임을 나타냅니다.
2. 조용한 푸시를 수신했다는 내용의 메시지를 저장소에 추가합니다.
3. 새로 고침이 완료되면 완료 핸들러를 호출하여 앱이 새 데이터를 로드했는지 여부를 시스템에 알립니다.

 

완료 핸들러를 호출시 파라미터에 정확한 결과를 입력해야 합니다. 시스템은 앱이 백그라운드에서 사용하는 배터리 소모와 시간을 측정하고 필요한 경우 앱을 제한할 수 있습니다.

빌드 및 실행하고 PushNotifications 유틸리티를 통해 다음 페이로드를 푸시합니다.

```
{
  "aps": {
    "content-available": 1
  },
  "work": "refresh news list"
}
```

포어그라운드/백그라운드/종료 상태 각각에서 테스트 해봅니다. 알림 메시지가 표시되지 않으면서 각종 작업을 수행하고 있습니다.

 ![](/assets/img/wp-content/uploads/2022/09/IMG_8D368DFDB571-1.jpg)

 

### **다음 뭘 해야 합니까?**

축하합니다! 이 튜토리얼을 완료하고 간단한 푸시 알림 앱을 만들었습니다.

사용자 지정 UI 구축 및 중요한 알림 보내기와 같이 푸시 알림으로 할 수 있는 모든 작업에 대해 더 자세히 알고 싶으십니까? [튜토리얼에 의한 푸시 알림 책 (영문, 유료)](https://store.raywenderlich.com/products/push-notifications-by-tutorials)은 푸시 알림의 고급 기능을 알려줍니다.

또 다른 리소스는 [iOS용 푸시 알림 자습서: 풍부한 푸시 알림 자습서 (영문)](https://www.raywenderlich.com/8277640-push-notifications-tutorial-for-ios-rich-push-notifications)입니다.

푸시 알림은 최신 앱의 중요한 부분이지만 알림을 과도하게 사용하면 사용자가 앱에 대한 권한을 거부하는 것이 매우 일반적입니다. 그러나 신중한 설계를 한다면 푸시 알림은 사용자가 계속해서 앱을 다시 찾게 만들 수 있습니다.

 

\[rcblock id="4560"\]
