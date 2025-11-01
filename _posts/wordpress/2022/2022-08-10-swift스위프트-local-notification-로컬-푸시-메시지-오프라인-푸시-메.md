---
title: "Swift(스위프트): Local Notification (로컬 푸시 메시지, 오프라인 푸시 메시지)"
date: 2022-08-10
categories: 
  - "DevLog"
  - "Swift"
---

\[rcblock id="4769"\]

 

### **Swift: Local Notification (로컬 푸시 메시지, 오프라인 푸시 메시지)**

Local notification(로컬 노티피케이션) 흔히 푸시 알람, 푸시 메시지로 일컫는 기기 메시지의 형태인데 외부 네트워크를 거치는 형태가 아닌 기기 내부에서 발신하는 오프라인 푸시 알람입니다.

\[caption id="attachment\_3905" align="alignnone" width="331"\] ![](/assets/img/wp-content/uploads/2021/08/IMG_3480-e1629469919284.jpg) Local Notification\[/caption\]

위 스크린샷은 로컬 노티피케이션의 예제로 제목과, 메시지 및 사진 섬네일이 첨부되어 있습니다.

이하 편의상 Local Notification을 _푸시 메시지_라고 부르겠습니다.

#### **기본**

1. 앱에서 알림 권한 허용을 요청합니다.
2. `UNMutableNotificationContent` 인스턴스에 푸시 메시지의 제목, 내용, 필요한 경우 사진 및 커스텀 소리 등을 추가합니다.
3. 푸시 메시지를 일정 시간 후 작동시키도록 트리거링하거나 스케줄을 예약하는 트리거를 작성하고, 컨텐츠, 트리거를 바탕으로 푸시 메시지를 등록합니다.
4. 푸시 메시지를 터치(클릭)했을 경우 실행할 작업을 작성합니다.
5. 등록된 푸시 메시지를 취소(삭제)합니다.

 

#### **1: 앱 알림 권한 허용 요청**

`ViewDidLoad(_:)`에 아래 코드를 추가합니다.

```
import UIKit
let userNotiCenter = UNUserNotificationCenter.current()
let notiAuthOptions = UNAuthorizationOptions(arrayLiteral: [.alert, .badge, .sound])
userNotiCenter.requestAuthorization(options: notiAuthOptions) { (success, error) in
    if let error = error {
        print(#function, error)
    }
}
```

`arrayLiteral:`에 들어갈 수 있는 카테고리는 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2022/08/스크린샷-2022-08-10-오후-10.11.59.jpg)

[애플 UnauthorizationOptions 문서](https://developer.apple.com/documentation/usernotifications/unauthorizationoptions)

앱의 사용자가 앱 알림 권한을 허용해야 아래 나오는 모든 푸시 메시지들이 정상 동작합니다. 권한을 허용하지 않는다면 해당 사용자는 푸시 메시지를 받지 않습니다.

 

#### **2: UNMutableNotificationContent 생성**

##### **제목과 내용 (title & body)**

 ![](/assets/img/wp-content/uploads/2021/08/IMG_3480-e1629469919284.jpg)

- `title` - 제목으로 예제에서 굵은 글씨의 "창문 앞의 디퓨저" 입니다.
- `body` - 내용으로 예제에서 제목 밑에 있는 설명문입니다.

 

```
let notiContent = UNMutableNotificationContent()

notiContent.title = "창문 앞의 디퓨저"
notiContent.body = "창문 앞의 디퓨저 스틱을 교체해야 합니다."
```

 

##### **User Info 추가**

푸시 메시지에 담고 싶은 정보가 있다면 `[``AnyHashable : Any``]` 타입의 배열을 만들고 그 안에 키-값 형태로 정보를 입력합니다. 보통 키는 `String`을 사용합니다.

해당 `userInfo`는 나중에 푸시 메시지를 터치(클릭)했을 때 꺼내서 사용할 수 있습니다.

```
notiContent.userInfo = ["category": "diffuser", "count": 15]
```

 

##### **사진 또는 비디오 섬네일**

```
do {
    // 1. 프로젝트에 Tulips.jpg 추가
    // 2. imageUrl 생성 후 첨부
    let imageUrl = Bundle.main.url(forResource: "Tulips", withExtension: "jpg")
    let attach = try UNNotificationAttachment(identifier: "", url: imageUrl!, options: nil)
    notiContent.attachments.append(attach)
} catch {
    print(error)
}
```

`jpg`, `png`, `mp4` 등 사진이나 비디오 파일의 `URL`을 입력하면 메시지에 표시됩니다. 해당 파일은 기기 디스크에 저장되어 있어야 합니다.

비디오 파일은 섬네일이 임의로 표시되며 움직이지 않습니다.

 ![](/assets/img/wp-content/uploads/2022/08/스크린샷-2022-08-10-오후-10.35.16.jpg)

##### **재생 소리 설정**

아무것도 지정하지 않으면 메시지가 표시되면서 기본 사운드가 재생됩니다.

이 소리를 개발자가 임의로 지정할 수 있습니다.

```
notiContent.sound = UNNotificationSound(named: UNNotificationSoundName(rawValue: "sample.mp3"))
```

프로젝트에 `sample.mp3`을 추가하고, 위의 `rawValue`에 파일 이름을 지정하면 됩니다.

 

##### **배지(badge) 등록하기**

```
let newNumber = UserDefaults.standard.integer(forKey: "AppBadgeNumber") + 1
UserDefaults.standard.set(newNumber, forKey: "AppBadgeNumber")
notiContent.badge = (newNumber) as NSNumber
```

`0` 이하의 숫자를 등록하면 배지가 표시되지 않으며, `1` 이상의 값을 등록할 경우 아래와 같이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/08/Simulator-Screen-Shot-iPhone-11-2022-08-10-at-23.47.11.jpg)

참고로 앱 아무곳에서 배지 숫자를 설정하는 방법은 다음과 같습니다. (`0` 이하는 배지 표시 안함, `1` 이상은 배지 표시함)

```
UIApplication.shared.applicationIconBadgeNumber = 0
```

 

#### **3: 메시지 트리거링 및 요청**

##### **등록 후 기준으로 트리거링 및 요청**

등록 후 일정 시간이 지나면 푸시 메시지가 표시되게 하는 방법입니다. 아래 코드는 앱 실행 후 3초 후 푸시 메시지를 발생시킵니다.

```
// 알림이 trigger되는 시간 설정 (초단위) - 반드시 0보다 큰 값이어야 함
// repeats가 true인 경우 해당 시간마다 메시지가 반복 표시됨 - timeInterval은 최소 60 이상이어야 함
let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 3, repeats: false)

let request = UNNotificationRequest(
    identifier: identifier,
    content: notiContent,
    trigger: trigger
)

userNotiCenter.add(request) { (error) in
    if let error = error {
        print(#function, error as Any)
    }
}

```

- `trigger` - 일정 시간 후 푸시 메시지가 발생하도록 하는 트리거를 작성합니다.
    - `timeInteval` - 초(second) 단위 시간을 입력합니다. 최소 `0`보다 커야 합니다.
        - 또한 `repeats` 옵션이 `true`일 경우에는 `60` 이상이어야 합니다.
    - `repeats` - 이 옵션이 `true`인 경우 일정 시간마다 메시지가 반복하여 나타납니다. (`60`초 이상 필수) `false`인 경우 한번만 나타납니다.
        - 예를 들어 30분마다 메시지를 반복 표시하고자 할 경우 `(timeInterval: 60 * 30, repeats: true)` 로 작성하면 됩니다.
-  `request` - `notiContent`와 `trigger`를 사용하여 푸시 메시지를 표시하도록 요청합니다.
    - `identifier` - 고유 식별자(ID)입니다.
    - `content` - 앞에서 만든 notiContent를 지정합니다.
    - `trigger` - 앞에서 생성한 trigger를 지정합니다.

 

##### **특정 시간 스케줄을 기준으로 트리거링**

예를 들어 푸시 메시지를 등록할 때 _XX년 XX월 XX일_에 알람을 울리게 하고 싶은 경우 아래와 같은 방법을 사용합니다.

다음 알람 등록 trigger를 작성합니다.

```
// 오늘 날짜와 대상 날짜의 차이를 계산한 후, dayToSeond(20)등의 형태로 입력
let targetDate = Date(timeIntervalSince1970: 1661869178) // 2022-08-30
var alarmDateComponents = Calendar.current.dateComponents([.second, .month, .day, .hour, .minute, .year], from: targetDate)
alarmDateComponents.hour = 15
alarmDateComponents.minute = 30
alarmDateComponents.second = 0

print("NSNoti reserved date: ", alarmDateComponents as Any)

// 트리거 생성
let trigger = UNCalendarNotificationTrigger(dateMatching: alarmDateComponents, repeats: false)
```

- `targetDate`
    - 푸시 메시지가 나타날 날짜를 설정합니다.
    - [epochconverter.com](https://www.epochconverter.com) 사이트에서 타임스탬프를 가져옵니다.
- `alarmDateComponent`
    - `targetDate`를 `DateComponent` 형태로 변환합니다.
    - 필요한 경우 시, 분, 초를 변경합니다.
- `UNCalendarNotificationTrigger(dateMatching: alarmDateComponents, repeats: false)`
    - 해당 날짜에 푸시 메시지가 나타나도록 하는 트리거입니다.
    - 참고: [특정 기간마다 푸시 메시지가 나타나도록 반복하기 (stackoverflow)](https://stackoverflow.com/questions/70301857/how-is-it-possible-to-create-highly-customised-repeated-local-notification-in-io) 

 

이후 과정은 등록 후 기준으로 트리거링 문단에 나온 코드와 같습니다.

 

#### **4: 푸시 메시지를 터치(클릭)했을 경우 실행할 작업을 작성**

`AppDelegate.swift` 파일에 아래 `extension`을 추가합니다.

```
extension AppDelegate: UNUserNotificationCenterDelegate {
    
    // 앱이 열린 도중에 메시지 받았을 때
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        
        // Here we actually handle the notification
        print("willPresent - identifier: \(notification.request.identifier)")
        print("willPresent - UserInfo: \(notification.request.content.userInfo)")
        
        // 이 부분은 앱이 열려있는 상태에서도 Local Notification이 오도록 함
        // 제거할 경우 앱이 열려있는 상태에서는 Local Notification이 나타나지 않음 (나머자 부분은 실행됨)
        completionHandler([.banner, .badge, .sound])
    }

    // 메시지를 클릭(터치)했을 때
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {

        let identifier = response.notification.request.identifier
        let userInfo = response.notification.request.content.userInfo
        print("didReceive - identifier: \(identifier)")
        print("didReceive - UserInfo: \(userInfo)")
        
        completionHandler()
    }
}
```

- `...willPresent notification...`
    - 앱이 실행중일 때 메시지를 받는 경우 실행되는 부분입니다.
    - `completionHandler`를 추가하면 앱이 실행중인 경우에도 푸시 메시지가 표시됩니다.
- `...didReceive response...`
    - 푸시 메시지를 클릭했을 때 실행할 작업을 지정합니다.
    - 앱의 실행 여부는 관계가 없습니다.
    - 앱이 실행중이 아닌 경우, 앱이 오픈되면서 `...didReceive...` 함수가 실행됩니다.

 

 ![](/assets/img/wp-content/uploads/2022/08/스크린샷-2022-08-11-오전-12.08.06.jpg)

위 코드가 동작하지 않을 경우

- `AppDelegate.swift` 파일 상단에 `import UserNotifications` 추가
- `func application(...didFinishLaunchingWithOptions...)` 안에 에 다음 부분 추가

```
UNUserNotificationCenter.current().delegate = self
```

 

 

#### **5: 등록된 Local Notification 삭제(스케줄 취소)**

##### **모든 푸시 메시지 일괄 삭제 및 스케줄 취소**

```
UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
```

 

##### **특정 identifier를 가진 푸시 메시지 삭제 및 스케줄 취소**

```
let userNotiCenter = UNUserNotificationCenter.current()
userNotiCenter.removePendingNotificationRequests(withIdentifiers: [id1, id2, id3])

```

- `withIdentifiers`
    - `[String]` 배열 형태로, 취소할 푸시 메시지의 `identifier`들을 입력합니다.
