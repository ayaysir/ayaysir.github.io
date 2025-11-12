---
title: "Swift: [ChatGPT가 말하는] 로컬 알림(로컬 노티피케이션) 기능의 한계점과 극복 방안"
date: 2024-09-29
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

ChatGPT에게 아래 글을 읽고 구체적인 이유와 해결 방안을 제시해보라고 요구했습니다.

- [Swift(스위프트): 로컬 알림(Local Notification)을 스케줄에 맞춰 반복 발신하기 (및 한계점)](http://yoonbumtae.com/?p=5064)

일반론적인 이야기를 풀어 말한것에 불과하지만, 일단 틀린 답변은 아니므로 ChatGPT가 제시한 해결 방안을 올려봅니다.

 

### **해결 방안 (ChatGPT의 답변)**

\[caption id="attachment\_6856" align="alignnone" width="570"\] ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-29-pm-3.05.20-copy.jpg) 복잡한 알람 스케줄의 예시\[/caption\]

 

Google Keep에서 구현된 것처럼 iOS에서 복잡한 스케줄링을 로컬 노티피케이션으로 구현하려면, 단순한 반복 알림 기능을 넘어서는 로직이 필요합니다. 특히 `2일마다`, `특정 요일마다`, `특정 종료일을 고려`한 `반복 알림`은 기본적인 `UNCalendarNotificationTrigger`나 `UNTimeIntervalNotificationTrigger`로는 해결하기 어려운 문제입니다. 해결 방안을 알아보기에 앞서 한계점에 대해 알아야 할 필요가 있습니다.

 

#### **기본 메서드로 해결하기 어려운 이유**

`UNCalendarNotificationTrigger`와 `UNTimeIntervalNotificationTrigger`가 복잡한 스케줄링 요구를 해결하기 어려운 이유는 두 메서드의 동작 원리와 제한 사항 때문입니다. 이를 이해하기 위해 각 메서드의 동작 방식을 살펴보겠습니다.

##### **1\. UNCalendarNotificationTrigger**

**UNCalendarNotificationTrigger**는 사용자가 제공한 특정 날짜와 시간에 알림을 예약하는 데 사용됩니다. 해당 메서드는 날짜와 시간을 기반으로 하는 트리거를 설정할 수 있지만, 한 번에 여러 트리거를 예약하거나 복잡한 조건에 따른 스케줄링은 지원하지 않습니다.

**동작 원리:**

- 특정 날짜/시간을 나타내는 `DateComponents`를 사용하여 알림 트리거를 설정합니다.
- 트리거는 `repeats` 파라미터를 통해 반복 설정이 가능하지만, 반복은 일 단위, 주 단위, 월 단위 등 매우 제한적인 패턴만 허용합니다.
- 예를 들어, 매일 같은 시간에 반복하거나 매주 월요일 같은 시간에 반복하는 것 정도만 가능합니다.
- 예외적인 날짜(예: 특정 요일을 건너뛰거나, 2주마다 특정 요일에 반복)를 다루기 어렵습니다.

**제한 사항:**

- **특정 요일을 지정한 반복 지원 불가:** **UNCalendarNotificationTrigger**는 매주 같은 요일에 반복하는 알림은 설정할 수 있지만, 예를 들어 2주마다 특정 요일에 반복하는 알림은 설정할 수 없습니다.
- **복잡한 반복 간격 설정 불가:** 알림을 2일마다, 또는 2주마다 반복하는 복잡한 반복 규칙은 지원하지 않습니다. repeats 플래그가 매일, 매주 등의 간단한 반복만 가능하게 하기 때문입니다.
- **종료 날짜 지정 불가:** **UNCalendarNotificationTrigger**는 알림이 언제까지 반복될지 종료 날짜를 지정할 수 없습니다. 종료 날짜가 필요할 경우, 수동으로 해당 종료일에 알림을 제거하거나 새 알림을 등록해야 합니다.

 

**예시 코드:**

```
var dateComponents = DateComponents()
dateComponents.hour = 8
dateComponents.minute = 0

// 매일 오전 8시에 반복 알림
let trigger = UNCalendarNotificationTrigger(dateMatching: dateComponents, repeats: true)
```

 

##### **2\. UNTimeIntervalNotificationTrigger**

**UNTimeIntervalNotificationTrigger**는 알림을 일정 시간 간격 후에 트리거할 때 사용됩니다. 이는 시간 경과에 따른 트리거로, 예를 들어 10초 뒤에 알림을 발송하거나, 일정 시간 간격으로 알림을 반복하는 등의 동작을 수행할 수 있습니다.

**동작 원리:**

- 알림을 특정 시간 후에 트리거하도록 설정할 수 있습니다. 예를 들어, 60초 뒤에 알림이 발송되도록 설정하거나, 매 10분마다 알림을 반복할 수 있습니다.
- **repeats** 플래그가 `true`일 경우, 주어진 시간 간격에 맞춰 계속해서 알림이 발송됩니다.

**제한 사항:**

- **정확한 날짜 및 시간 지정 불가:** 이 메서드는 특정 날짜/시간을 기반으로 한 알림을 설정할 수 없습니다. 예를 들어, “매주 월요일 오전 9시에 알림” 같은 트리거는 설정할 수 없습니다. 시간 간격만을 설정할 수 있으므로, 특정 시간대에 알림을 보내야 할 경우 복잡한 조작이 필요합니다.
- **긴 주기 설정에 부적합:** 이 메서드는 최대 60초 이상의 간격을 지원하지만, 매우 긴 주기(예: 2주, 1달)와 같은 복잡한 반복을 설정하기에는 적합하지 않습니다.
- **복잡한 반복 규칙 미지원:** 예를 들어, 2일마다 반복하거나 특정 요일에만 반복하는 등의 복잡한 반복 규칙을 지원하지 않습니다.

**예시 코드:**

```
// 60초 뒤에 알림 발송
let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60, repeats: false)
```

 

##### **왜 복잡한 스케줄링을 지원하지 못하는가?**

- **기본적인 반복 패턴 제한:** 두 트리거 모두 매우 제한적인 반복 패턴만 지원합니다.
    - **UNCalendarNotificationTrigger**는 특정 날짜 및 시간, 요일에 대한 반복을 설정할 수 있지만, 더 복잡한 규칙(예: 2일마다, 특정 종료일에 따른 반복 종료)은 지원하지 않습니다.
    - 반면, **UNTimeIntervalNotificationTrigger**는 시간 간격만을 설정할 수 있으며, 특정 요일이나 날짜에 알림을 보내는 기능은 없습니다.
- **종료 날짜 설정 불가:** 두 트리거 모두 반복 알림에 대해 종료 날짜를 설정할 수 없기 때문에, 일정 기간 동안만 알림을 반복해야 하는 경우 별도로 관리해야 합니다.
- **64개 알림 제한:** iOS는 로컬 노티피케이션을 최대 64개까지 한 번에 예약할 수 있습니다. 이는 복잡한 스케줄링을 한 번에 미리 예약하는 데에도 제한이 생기며, 미리 여러 알림을 예약하는 방식이 적합하지 않습니다.

 

#### **해결방안: 동적 스케줄링 및 백그라운드 태스크**

다음은 복잡한 로컬 노티피케이션 스케줄링을 구현하기 위한 전략입니다.

##### **1\. 개별 알림의 동적 스케줄링**

iOS의 로컬 노티피케이션에서 특정 요일, 종료 날짜 등을 고려한 알림을 구현하려면, 알림을 한 번에 모두 등록하는 대신 동적으로 스케줄링하는 방식을 사용해야 합니다. 즉, Google Keep의 방식처럼 앱이 실행될 때마다 가까운 알림 시간을 계산하여 등록하는 방법입니다.

**주요 전략:**

1. **알림 등록 시점 계산**
    - 앱을 실행하거나 백그라운드 작업을 수행할 때마다 사용자 설정에 맞는 복잡한 스케줄(예: 2일마다, 특정 요일마다, 특정 종료일 등)을 기반으로 다음 알림 시간을 계산합니다.
2. **알림 최대 64개 등록:**
    -  iOS에서 등록할 수 있는 로컬 알림의 최대 수가 64개이므로, 가장 가까운 64개의 알림만 등록하고 이후 일정은 앱이 다시 활성화될 때 추가로 등록합니다.
3. **알림 계산 로직 구현:**
    - 예를 들어, Calendar API를 사용하여 사용자가 원하는 특정 요일 또는 간격으로 반복되는 알림 시간을 계산하고, 다음 알림을 등록합니다.

 

##### **2\. 백그라운드 작업 및 앱 실행 시 알림 갱신**

Google Keep에서 앱이 실행될 때마다 알림을 계산하고 등록하듯이, iOS에서도 백그라운드 작업(예: BackgroundTask)이나 앱이 다시 포그라운드로 돌아왔을 때 알림을 갱신하는 방식으로 구현할 수 있습니다.

**동작 방식:**

- **앱 실행 시:** 사용자가 앱을 열 때, 현재 등록된 알림 중 오래된 알림은 제거하고, 새로 계산한 알림 시간을 기반으로 알림을 추가합니다.
- **백그라운드에서:** **[BackgroundTask](https://developer.apple.com/documentation/backgroundtasks)**를 이용하여 주기적으로 알림을 계산하고 등록할 수 있습니다.

 

##### **3\. 복잡한 스케줄 관리**

**UNCalendarNotificationTrigger**는 복잡한 스케줄(예: 2일마다, 특정 요일마다)을 기본적으로 지원하지 않기 때문에, 커스텀 로직을 사용하여 각 알림을 직접 관리해야 합니다. 이를 구현하기 위해 다음과 같은 방식이 가능합니다.

**예시 코드:**

```
func scheduleComplexNotification(for date: Date, repeatingDays: [Int], endDate: Date?) {
    let center = UNUserNotificationCenter.current()
    
    // 현재 날짜부터 반복 종료일까지 반복 알림 등록
    var nextTriggerDate = date
    let calendar = Calendar.current
    
    while let endDate, nextTriggerDate <= endDate {
        // 반복되는 요일에만 알림 등록
        let weekday = calendar.component(.weekday, from: nextTriggerDate)
        if repeatingDays.contains(weekday) {
            let content = UNMutableNotificationContent()
            content.title = "복잡한 스케줄 알림"
            content.body = "특정 요일에 반복되는 알림입니다."
            content.sound = .default

            let trigger = UNCalendarNotificationTrigger(dateMatching: calendar.dateComponents([.year, .month, .day, .hour, .minute], from: nextTriggerDate), repeats: false)
            let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
            
            center.add(request) { error in
                if let error {
                    print("알림 등록 실패: \(error)")
                }
            }
        }
        
        // 다음 반복 날짜 계산 (예: 2일마다)
        nextTriggerDate = calendar.date(byAdding: .day, value: 2, to: nextTriggerDate)!
    }
}
```

**설명:**

- `repeatingDays`는 반복할 요일(월요일, 화요일 등)을 의미하며, `[2, 3, 6]`과 같이 배열로 관리됩니다.
- `endDate`가 존재하는 경우 해당 날짜까지 반복 알림을 등록합니다.
- 반복 규칙에 맞는 다음 알림 시간을 계산한 후, 해당 날짜에 알림을 등록합니다.

 

##### **4\. 사용자 커스텀 스케줄 관리**

복잡한 규칙을 지원하는 로직을 작성하려면 사용자 설정에 따라 다양한 패턴을 관리해야 합니다:

- **N일마다 반복:** Calendar를 사용하여 원하는 간격으로 알림을 계산.
- **특정 요일 반복:** 주어진 요일을 기준으로 스케줄을 계산하고 등록.
- **종료 날짜 설정:** endDate를 기준으로 더 이상 알림이 등록되지 않도록 관리.

 

##### **5\. 다양한 트리거 조합**

- **UNCalendarNotificationTrigger**와 **UNTimeIntervalNotificationTrigger**를 혼합하여 다양한 스케줄 패턴을 구현.
- 필요 시 트리거가 발생한 후 추가적으로 새로운 알림을 동적으로 등록하여, 마치 복잡한 반복 패턴을 지원하는 것처럼 작동하도록 함.

 

##### **결론**

iOS의 기본 로컬 노티피케이션 시스템으로는 복잡한 반복 패턴을 바로 지원하지 않지만, Google Keep과 같은 방식으로 동적 알림 스케줄링을 통해 이를 구현할 수 있습니다. `UNUserNotificationCenter`의 64개 제한을 고려하여 가장 가까운 알림만 등록하고, 이후 앱이 다시 활성화되거나 백그라운드 작업이 실행될 때 새 알림을 계산하는 방식으로 처리할 수 있습니다.

 

<!--[rcblock id="6686"]-->
