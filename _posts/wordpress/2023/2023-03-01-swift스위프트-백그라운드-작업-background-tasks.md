---
title: "Swift(스위프트): 백그라운드 작업 (Background Tasks)"
date: 2023-03-01
categories: 
  - "DevLog"
  - "Swift"
---

#### **소개**

BackgroundTasks는 앱이 백그라운드에서 작업을 할 수 있게 하는 프레임워크입니다. (iOS 13부터 이용 가능)

스토리보드 기준으로 설명합니다.

 

#### **분류**

작업의 복잡도, 에너지 양(배터리 소모정도)에 따라 두 가지로 분류합니다.

1. **App Refresh Task** 상대적으로 가벼운 작업(단순 API 호출 또는 저장 등)에 사용합니다. 실행 빈도가 높고, 사용자가 기기를 사용하는 중에도 작업이 실행됩니다.
2. **Processing Task** 상대적으로 무거운 작업(DB 등)에 사용합니다. 옵션으로 배터리 충전이 요구되는지, 네트워크 연결이 요구되는지를 지정할 수 있습니다. 보통 충전중이고 기기가 idle인 상태에서 작업이 실행됩니다.

 

#### **구현 방법**

##### **1: 백그라운드 작업에 대한 권한 추가**

프로젝트 설정 메뉴에서 `Signing and Capabilities` 탭 > `+ Capability` 로 `Background Mode`를 추가한 뒤

- **Background fetch**
- **Background Processing**

를 체크합니다.

 ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-02-25-오전-1.59.24.jpg)

 ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-02-25-오전-1.56.53.jpg)

 

##### **2: Info.plist에 식별자(identifier) 추가**

`Info.plist` 파일을 연 뒤, `BGTaskSchedulerPermittedIdentifiers`(Permitted background task scheduler Identifiers) 키를 추가합니다. 그 배열(`Array`) 하위 요소로 `String` 타입의 백그라운드 식별자를 추가합니다.

형식은 일반적으로 기존 앱 번들 식별자(App Bundle Identifier) + 백그라운드 요소 이름으로 지정합니다. 아래 스크린샷은 App Refresh Task(`refresh_badge`)와 Processing Task(`refresh_process`) 두 개를 추가했습니다.

- **예)** _com.example.ExampleApp.refresh\_badge(process)_

 ![](/assets/img/wp-content/uploads/2023/03/mosaic-스크린샷-2023-02-25-오전-1.58.03.jpg)

 

##### **3: AppDelegate의 ...didFinishLaunchingWithOptions... 안에 작업(task) 등록**

`BGTaskScheduler.shared.register(...)`를 이용해 백그라운드 작업들을 등록합니다.

```
import UIKit
import BackgroundTasks

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // 1. App Refresh Task
        BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.bgsmm.LanguageWeb.refresh_badge", using: nil) { task in
            self.handleAppRefresh(task: task as! BGAppRefreshTask)
        }
        
        // 2. Processing Task
        BGTaskScheduler.shared.register(forTaskWithIdentifier: "com.bgsmm.LanguageWeb.refresh_process", using: nil) { task in
            self.handleProcessingTask(task: task as! BGProcessingTask) // 타입 캐스팅 유의 (BG'Processing'Task)
        }
        
        // BackgroundTask: https://lemon-dev.tistory.com/entry/iOS-BackgroundTask-Framework-간단-정리 [lemon_dev:티스토리]
        return true
    }
    
    // ... //

}
```

- **forTaskWithIdentifier**
    - `Info.plist` 파일에서 입력했던 작업 식별자를 입력합니다. 여러 식별자가 있는 경우 각각에 대해 따로 `register` 합니다.
- `handleAppRefresh`, `handleProcessingTask`
    - 각 작업당 해야 할 일을 지정한 메서드로, 밑에서 구현합니다.

 

* * *

> **🚧 이 글은 작성중입니다.**
> 
> ![](http://yoonbumtae.com/2001/internet/con14.gif)
> 
> 빠른 시일 내에 포스트 작성을 완료하겠습니다.

 

##### **4: handleAppRefresh, handlerProcessingTask 함수 구현**

```
func handleAppRefresh(task: BGAppRefreshTask) {
    // 다음 동작 수행, 반복시 필요
    scheduleAppRefresh()
    
    task.expirationHandler = {
        task.setTaskCompleted(success: false)
    }
    
    // 가벼운 백그라운드 작업 작성
    
    task.setTaskCompleted(success: false)
}
```

```
func handleProcessingTask(task: BGProcessingTask) {
    task.expirationHandler = {
        task.setTaskCompleted(success: false)
    }
    
    // 무거운 백그라운드 작업 작성
    task.setTaskCompleted(success: true)
}
```

- `task.setTaskCompleted(success: true/false)`로 작업 성공 여부를 알려줘야 합니다.

 

##### **5: 스케줄러 함수 scheduleAppRefresh, scheduleProcessingTaskIfNeeded  작성**

`AppDelegate` 클래스 내부에 작성합니다.

```
func scheduleAppRefresh() {
    let request = BGAppRefreshTaskRequest(identifier: "com.example.ExampleApp.refresh_badge")
    
    do {
        try BGTaskScheduler.shared.submit(request)
        // Set a breakpoint in the code that executes after a successful call to submit(_:).
    } catch {
        print("\(Date()): Could not schedule app refresh: \(error)")
    }
}
```

```
func scheduleProcessingTaskIfNeeded() {
    let request = BGProcessingTaskRequest(identifier: "com.example.ExampleApp.refresh_process")
    request.requiresExternalPower = false
    request.requiresNetworkConnectivity = false
    
    do {
        try BGTaskScheduler.shared.submit(request)
        // Set a breakpoint in the code that executes after a successful call to submit(_:).
    } catch {
        print("\(Date()): Could not schedule processing task: \(error)")
    }
}
```

- try 밑의 주석이 써져 있는 라인에서 breakpoint를 걸어 강제로 백그라운드 작업을 트리거할 수 있습니다. (후술)

 

##### **6: SceneDelegate 클래스의 sceneDidEnterBackground(...) 메서드 내에 스케줄러 호출 부분 작성**

```
func sceneDidEnterBackground(_ scene: UIScene) {
    // Called as the scene transitions from the foreground to the background.
    // Use this method to save data, release shared resources, and store enough scene-specific state information
    // to restore the scene back to its current state.
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    appDelegate.scheduleAppRefresh()
    appDelegate.scheduleProcessingTaskIfNeeded()
}
```

- `sceneDidEnterBackground`은 앱이 백그라운드 모드가 될 때마다 호출되는 메서드이며, 여기에 백그라운드 작업 스케줄러를 불러옵니다.

 

#### **강제로 백그라운드 작업 트리거**

1. `scheduleAppRefresh`, `scheduleProcessingTaskIfNeeded` 함수에서
    - `submit(_:)`에 대한 성공적인 호출 후 실행되는 코드(`try BGTaskScheduler.shared.submit(request)`)에 중단점(breakpoint)을 설정합니다.
2. 실제 기기에서 앱을 실행하고, 중단점에 걸릴 때까지 앱을 실행합니다. (=> 백그라운드 모드로 들어감)
3. 디버거에서 아래 명령을 실행하여 `TASK_IDENTIFIER`를 원하는 작업의 식별자(예: `com.example.ExampleApp.refresh_...`)로 바꿉니다.
    
    ```
    e -l objc -- (void)[[BGTaskScheduler sharedScheduler] _simulateLaunchForTaskWithIdentifier:@"TASK_IDENTIFIER"]
    ```
    
     ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-02-23-오후-11.43.01.jpg)
4. 홈 화면에서 앱 아이콘을 실행해 다시 실행합니다. 시스템은 해당 작업에 대한 실행 핸들러를 호출합니다.

 

아래 스크린샷은 백그라운드 작업이 실행할 때마다 텍스트 파일에 로그를 기록하도록 한 경우에서 해당 로그의 기록입니다. (App Background는 앱 리프레시 작업, Processing Task는 프로세싱 작업)

 ![](/assets/img/wp-content/uploads/2023/03/IMG_9D2611C16F79-1-중간.jpeg)

 

##### **출처**

- [\[iOS\] BackgroundTasks Framework 간단 정리](https://lemon-dev.tistory.com/entry/iOS-BackgroundTask-Framework-%EA%B0%84%EB%8B%A8-%EC%A0%95%EB%A6%AC)
- [Starting and Terminating Tasks During Development](https://developer.apple.com/documentation/backgroundtasks/starting_and_terminating_tasks_during_development)
