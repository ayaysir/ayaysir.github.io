---
title: "Swift(스위프트): 로컬 알림(Local Notification)을 스케줄에 맞춰 반복 발신하기 (및 한계점)"
date: 2022-11-21
categories: 
  - "DevLog"
  - "Swift"
---

##### **원문**

- [How is it possible to create highly customised repeated local notification in iOS using UNCalendarNotificationTrigger + UNUserNotificationCenter?](https://stackoverflow.com/questions/70301857/how-is-it-possible-to-create-highly-customised-repeated-local-notification-in-io)

### **질문**

**`UNCalendarNotificationTrigger` + `UNUserNotificationCenter`를 사용하여 iOS에서 고도로 사용자 정의된 반복 로컬 알림을 생성하는 것이 어떻게 가능합니까?**

현재 저는 `UNCalendarNotificationTrigger` 및 `UNUserNotificationCenter`를 사용하여 미리 알림 앱에 대해 고도로 사용자 정의된 반복 로컬 알림을 생성하고 있습니다.

(`DateComponents`를 사용하여) 아주 기본적인 반복 규칙으로 로컬 알림을 만들 수 있습니다.

 

#### **연간 반복 (Repeat yearly)**

```
var dateComponents = DateComponents()
dateComponents.calendar = Calendar.current

//
// 매년 10월 5일 오전 3시에 반복
//
dateComponents.month = 10
dateComponents.day = 5

dateComponents.hour = 3
dateComponents.minute = 0

let trigger = UNCalendarNotificationTrigger(
    dateMatching: dateComponents,
    repeats: true
)

```

 

#### **매월 반복 (Repeat monthly)**

```
var dateComponents = DateComponents()
dateComponents.calendar = Calendar.current

//
// 매월 5일 오전 3시 반복
//
dateComponents.day = 5

dateComponents.hour = 3
dateComponents.minute = 0

let trigger = UNCalendarNotificationTrigger(
    dateMatching: dateComponents,
    repeats: true
)
```

 

#### **매주 반복 (Repeat weekly)**

```
var dateComponents = DateComponents()
dateComponents.calendar = Calendar.current

//
// 매주 월요일 오전 3시 반복
//
dateComponents.weekday = 2

dateComponents.hour = 3
dateComponents.minute = 0

let trigger = UNCalendarNotificationTrigger(
    dateMatching: dateComponents,
    repeats: true
)
```

 

#### **매일 반복 (Repeat daily)**

```
var dateComponents = DateComponents()
dateComponents.calendar = Calendar.current

//
// 매일 반복, 오전 3시
//
dateComponents.hour = 3
dateComponents.minute = 0

let trigger = UNCalendarNotificationTrigger(
    dateMatching: dateComponents,
    repeats: true
)
```

 

#### **한계점**

하지만, 이것보다 더 복잡한 규칙으로 반복 알림을 만들고 싶다면 어떻게 해야 할까요?

- 2일마다 반복
- 2025년 12월 25일까지 매일 반복
- 매주 월요일, 화요일, 금요일 반복
- 2025년 12월 25일까지 2주마다 월요일, 화요일, 금요일 반복

 

##### **Google Keep의 알림 기능**

처음에는 불가능하다고 생각했습니다. 그러나 Google Keep과 같은 잘 알려진 일부 앱의 경우 이러한 기능을 사용자에게 제공할 수 있습니다.

알림을 테스트한 결과 Google Keep이 원격 푸시 알림(Push Notification)이 아닌 로컬 알림(Local Notification)을 사용하고 있음을 확인하였습니다. 비행기 모드에서도 여전히 알림을 받을 수 있기 때문입니다.

![](./assets/img/wp-content/uploads/2022/11/2ZaOQ.jpeg)

 

_**iOS에서 고도로 사용자 정의된 반복 로컬 알림을 생성하는 방법을 아는 사람이 있나요?**_

- 반복 내부(`N` 일마다 반복)
- 반복 알림 종료 날짜(`X` 일까지 매일 반복)
- 어느 요일에 반복 (`매주` `월요일`, `화요일`, `금요일에` 반복)
- 위의 모든 조합

 

##### **사이드 노트**

Android에서는 이러한 기능을 구현할 수 있습니다. 그 이유는 Android의 `AlarmManager`를 사용하면 개발자가 미리 알림의 날짜 + 시간이 맞을 때 맞춤형 앱 코드를 실행할 수 있기 때문입니다. 이를 통해 다음 전략을 구현할 수 있습니다.

1. 반복되지 않는 다음 알람을 특정 날짜 + 시간으로 대기(queue)시킵니다.
2. 알람이 발생하면 복합 반복 규칙을 기반으로 가장 가까운 날짜 + 시간을 계산합니다. 새로 계산된 날짜 + 시간으로 1단계를 반복합니다.

 

##### **이것이 Google Keep에서 어떻게 구현되는지에 대한 나의 추측**

1. 사용자가 Google Keep 앱을 실행할 때마다 앱은 모든 메모에 대해 가장 가까운 알림 활성화 시간을 계산합니다.
2. 그런 다음 앱은 모든 알림 활성화 시간을 정렬하고 가장 최근 64개의 알림 활성화 시간을 선택합니다.
3. 전체 알림 대기열(notification queue)을 취소(=삭제)한 다음 가장 최근 64개의 미리 알림 활성화 시간을 반복되지 않는 알림으로 다시 알림 대기열에 추가합니다.

물론 이것은 64개의 모든 알림이 실행을 마치기 전에 사용자가 적어도 앱을 다시 시작한다는 가정에 기반합니다.

 

##### **iOS에서 로컬 알림을 생성하는 기본 코드 스니펫**

참고용으로 다음은 iOS에서 로컬 알림을 생성하는 데 사용하는 기본 코드 스니펫입니다.

- [Swift(스위프트): Local Notification (로컬 푸시 메시지, 오프라인 푸시 메시지)](http://yoonbumtae.com/?p=4642)

```
import UIKit

struct LocalDate {
    let year: Int
    let month: Int
    let day: Int
}

struct LocalTime {
    let hour: Int
    let minute: Int
}

extension Date {
    var localDate: LocalDate {
        let current = Calendar.current
        let components = current.dateComponents([.year, .month, .day], from: self)
        let year = components.year!
        let month = components.month!
        let day = components.day!
        return LocalDate(year: year, month: month, day: day)
    }
    
    var localTime: LocalTime {
        let current = Calendar.current
        let components = current.dateComponents([.hour, .minute], from: self)
        let hour = components.hour!
        let minute = components.minute!
        return LocalTime(hour: hour, minute: minute)
    }
    
    func adding(_ component: Calendar.Component, _ value: Int) -> Date {
        return Calendar.current.date(byAdding: component, value: value, to: self)!
    }
}

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func clicked(_ sender: Any) {
        let center = UNUserNotificationCenter.current()

        let options: UNAuthorizationOptions = [.badge, .sound, .alert]

        center.requestAuthorization(options: options) { (flag, error) in
            if flag == true {
                
                // Registering user notification
                DispatchQueue.main.async {
                    UIApplication.shared.registerForRemoteNotifications()
                    
                    self.performNotificationSetup(uuidString: "1")
                }
            } else {
                DispatchQueue.main.async {
                    let alert = UIAlertController(title: "Alert", message: "(Provide reason why we need Notifications permission)", preferredStyle: UIAlertController.Style.alert)

                    let settingsAction = UIAlertAction(title: "Settings", style: .default) { (_) -> Void in

                        guard let settingsUrl = URL(string: UIApplication.openSettingsURLString) else {
                            return
                        }

                        if UIApplication.shared.canOpenURL(settingsUrl) {
                            UIApplication.shared.open(settingsUrl, completionHandler: { (success) in
                                print("Settings opened: \(success)") // Prints true
                            })
                        }
                    }
                    alert.addAction(settingsAction)
                    let cancelAction = UIAlertAction(title: "Cancel", style: .default, handler: nil)
                    alert.addAction(cancelAction)
                    
                    self.present(alert, animated: true, completion: nil)
                }
            }

        }
        
    }
    
    private func performNotificationSetup(uuidString: String) {

        // Compute local date and local time for the next minute.
        let date = Date()
        let nextMinuteDate = date.adding(.minute, 1)
        let nextMinuteLocalDate = nextMinuteDate.localDate
        let nextMinuteLocalTime = nextMinuteDate.localTime
        
        //
        // STEP 1 : Create the Notification's Content
        //
        let content = UNMutableNotificationContent()
        content.title = "\(uuidString) My App"
        content.body = "Body \(nextMinuteDate.localTime)"
        
        print("\(content.title)")
        print("\(content.body)")
        
        //
        // STEP 2 : Specify the Conditions for Delivery
        //
        var dateComponents = DateComponents()
        dateComponents.calendar = Calendar.current

        dateComponents.year = nextMinuteLocalDate.year
        dateComponents.month = nextMinuteLocalDate.month
        dateComponents.day = nextMinuteLocalDate.day

        dateComponents.hour = nextMinuteLocalTime.hour
        dateComponents.minute = nextMinuteLocalTime.minute
        
        let trigger = UNCalendarNotificationTrigger(
                 dateMatching: dateComponents,
                 repeats: false
        )
        
        //
        // STEP 3 : Create and Register a Notification Request
        //
        // Create the request
        let request = UNNotificationRequest(identifier: uuidString,
                    content: content, trigger: trigger)

        // Schedule the request with the system.
        let notificationCenter = UNUserNotificationCenter.current()
        notificationCenter.add(request) { (error) in
           if error != nil {
               // Handle any errors.
               print("error \(error)")
           }
        }
        
        print("ok")
    }
}
```

 

### **답변(?)**

> **참고**
> 
> 원문에 해당 질문에 대한 답변이 없으며 인터넷을 검색해봐도 위와 같은 케이스에 대한 답변은 찾지 못했습니다. 대신 해당 질문글의 코멘트를 첨부합니다.  만약 질문에 대한 답을 찾았다면 포스트를 업데이트하도록 하겠습니다.

- **_G\*\*_**
    - 이 알림 중 일부에 `UNTimeIntervalNotificationTrigger`를 사용해 보셨습니까? 예를 들어, 이틀마다 날짜 작업만큼 정확하지는 않지만 충분할 것입니다. (참고: `UNTimeIntervalNotificationTrigger`는 특정 시간 이후 한 번만 반복하거나 일정 시간동안 반복하여 발신하는 것만 가능합니다. [애플 개발자 문서](https://developer.apple.com/documentation/usernotifications/untimeintervalnotificationtrigger))
- **_질문 작성자_**
    - 그러나 `UNTimeIntervalNotificationTrigger`가 전체 문제를 어떻게 해결할 수 있는지 감이 오지 않습니다.
- **_P\*\*_**
    - 결론부터 말하면 "아니오"입니다. 일련의 개별 알림을 예약하고 앱이 열릴 때마다 더 많은 알림을 확인하고 예약해야 합니다. 즉, 사용자가 앱을 주기적으로 열지 않으면 알림이 중지됩니다. Scheduling API에 더 많은 기능이 추가될 수 있다는 데 동의하므로 Apple에 개선 요청을 자유롭게 제출해보세요.
- **_질문 작성자_**
    - 표면적으로는 그러한 기능을 구현하는 것이 불가능해 보입니다. 그러나 Google Keep은 어떻게든 이를 달성하고 있습니다. 구현 방법에 대한 좋은 가정이 있을까요? 내 생각에 사용자가 앱을 열 때마다 Google Keep은 모든 메모(개별 레코드)에 대해 가장 가까운 알림 활성화 시간을 계산합니다. 그런 다음 가장 가까운 64개의 알림 시간을 선택하고 반복하지 않도록(=> 한 번만 알림을 발신하도록) 예약합니다. 물론 이것은 64개의 알림이 모두 발생하기 전에 사용자가 앱을 다시 열 것이라는 가정 하입니다.
