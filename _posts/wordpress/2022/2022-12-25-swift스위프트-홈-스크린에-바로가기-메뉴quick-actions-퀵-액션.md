---
title: "Swift(스위프트): 홈 스크린에 바로가기 메뉴(Quick Actions, 퀵 액션) 만들기"
date: 2022-12-25
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

아래와 같이 홈 스크린에서 앱 아이콘을 길게 누르거나 혹은 포스 터치(세게 누름; 일부 모델만 지원)를 한 경우 메뉴가 뜨는데 이걸 **퀵 액션(Quick Action)**이라고 합니다.

퀵 액션에는 두 가지 종류가 있습니다.

1. **Static** - 앱의 상황과 관계 없이 동일한 역할을 수행하며, 앱을 설치하자마자 바로 이용할 수 있는 메뉴입니다.
    - 예) 검색 기능, 새로운 메모 추가 기능 등
2. **Dynamic** - 앱의 상황에 따라 이름과 역할이 바뀔 수 있는 메뉴이며, 최소한 앱이 실행된 이후에 이용할 수 있는 메뉴입니다.
    - 예) 최근 파일 열기, 최근 검색 결과로 이동

 

아래는 모 음악 앱의 퀵 액션 메뉴인데 첫 번째 `[검색하기]`는 어느 상황에서도 검색 메뉴로 이동하므로 Static 퀵 액션이며, 그 아래 3개 메뉴는 최근 감상한 음악에 따라 키워드에 따라 이름과 이동 페이지가 달라지므로 Dynamic 퀵 액션입니다.

![퀵 액션 (홈 스크린 바로가기 메뉴)](/assets/img/wp-content/uploads/2022/12/IMG_9678.jpg)  
*퀵 액션 (홈 스크린 바로가기 메뉴)*

![최근 감상 이력이 있는 [Johan de Meij: ...] 메뉴를 클릭한 경우 해당 앨범의 페이지로 이동 (Dynamic Quick Action)](/assets/img/wp-content/uploads/2022/12/IMG_9679.jpg)  
*최근 감상 이력이 있는 [Johan de Meij: ...] 메뉴를 클릭한 경우 해당 앨범의 페이지로 이동 (Dynamic Quick Action)*

퀵 액션은 Static과 Dynamic을 합쳐 **최대 4개까지 추가**할 수 있습니다.

 

## **구현**

새로운 iOS App 프로젝트를 생성합니다. 이 포스트는 스토리보드(Interface Builder)를 기준으로 설명합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.16.22.jpg)

 

### **Static 퀵 액션**

Static 퀵 액션은 앱을 설치하자마자 바로 이용할 수 있고, `info.plist` 파일에 메뉴 정보를 추가하는 방식입니다.

`info.plist` 파일을 열고 아래와 같이 트리를 구성합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.22.37.jpg)

- **UIApplicationShortcutItemType (필수) - Icon Type** 
    - 퀵 액션을 식별하는 고유한 문자열입니다.
    - 예) `com.mediumproject.helloWorld.`
- **UIApplicationShortcutItemTitle (필수) - Title**
    - 사용자에게 표시되는 퀵 액션의 제목입니다.
- **UIApplicationShortcutItemSubtitle (선택 사항) - Subtitle**
    - 빠른 작업의 부제입니다. 제목 밑에 표시됩니다.
- **UIApplicationShortcutItemIconType (선택 사항) - Icon Type**
    - 여기에서 [Apple에서 만든 미리 정의된 아이콘](https://developer.apple.com/documentation/uikit/uiapplicationshortcuticon/icontype)을 설정할 수 있습니다.
    - 이름은 `UIApplicationShortcutIconType+이름`입니다. 예를 들면 `search` 아이콘을 사용하고자 한다면 `UIApplicationShortcutIconTypeSearch` 라고 적으면 됩니다.
- **UIApplicationShortcutItemIconFile (선택 사항) - Icon File**
    - 사용자 지정 아이콘을 설정하는 데 사용합니다.
    - 파일은 `Assets` 폴더에 추가된 이름으로 지정합니다.
    - Icon Type과 Icon File 둘 중 하나만 사용할 수 있습니다.
- **UIApplicationShortcutItemUserInfo (선택 사항) - User Info Dictionary**
    - 사용자 지정 데이터를 저장할 사전(`dictionary`)입니다.

 

> **참고 - 소스 코드로 추가하기**
> 
> 위와 같은 트리를 구성하려면 시간이 걸리므로 아래 XML 코드를 복사 붙여넣기 해서 추가할 수도 있습니다.
> 
>  
> 
> **1) info.plist 파일을 마우스 오른쪽 클릭한 후 Open As > Source Code를 선택해 소스 편집기로 엽니다.**
> 
>  ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.20.36.jpg)
> 
> **2) 아래 XML 코드를 `<dict>` 아래에 복붙합니다.**
> 
>  ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.21.34.jpg)
> 
> ```xml
> <key>UIApplicationShortcutItems</key>
> <array>
>   <dict>
>     <key>UIApplicationShortcutItemIconFile</key>
>     <string>Custom-Punched</string>
>     <key>UIApplicationShortcutItemSubtitle</key>
>     <string>아티스트 - 노래 제목</string>
>     <key>UIApplicationShortcutItemTitle</key>
>     <string>Favorites</string>
>     <key>UIApplicationShortcutItemType</key>
>     <string>com.mycompany.myapp.openfavorites</string>
>     <key>UIApplicationShortcutItemUserInfo</key>
>     <dict>
>       <key>key1</key>
>       <string>value1</string>
>     </dict>
>   </dict>
>   <dict>
>     <key>UIApplicationShortcutItemIconType</key>
>     <string>UIApplicationShortcutIconTypeCompose</string>
>     <key>UIApplicationShortcutItemTitle</key>
>     <string>New Message</string>
>     <key>UIApplicationShortcutItemType</key>
>     <string>com.mycompany.myapp.newmessage</string>
>     <key>UIApplicationShortcutItemUserInfo</key>
>     <dict>
>       <key>key2</key>
>       <string>value2</string>
>     </dict>
>   </dict>
> </array>
> ```
> 
> 아래와 같이 구성되었는지 확인합니다.
> 
>  ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.22.12.jpg)
> 
> **3) Property List로 다시 열어 Home Screen Shorcut Items가 추가되었는지 확인합니다.**
> 
>  ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.22.19.jpg)
> 
>  ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-25-pm-2.34.32.jpg)

 

앱을 빌드 및 실행합니다. 홈 스크린으로 이동 후 Static 퀵 액션이 추가되었는지 확인합니다.

<!-- http://www.giphy.com/gifs/Z5j8P0zLZbqa97Su5n -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnAwZ2ZtOXJreXR6M3FzZXE2cjlkNHMzOTI5cnI4NzRnaXp1NXFlayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Z5j8P0zLZbqa97Su5n/giphy.gif)

 

### **Dynamic 퀵 액션**

Dynamic 퀵 액션은 앱 내부에서 코드로 작성하여 추가할 수 있는 퀵 액션입니다. 예를 들면 검색 결과, 조회 결과가 갱신되었거나 하는 등의 상황에서 메뉴가 갱신되도록 해야 합니다. Swift 코드로 작성합니다.

아래 예제는 `UIStepper`의 값이 바뀌면, 그 값의 배수를 메뉴 제목에 표시하고 계산 과정을 메뉴 부제에 표시하도록 갱신하는 예제입니다.

<!-- http://www.giphy.com/gifs/4YHpN4pPN7iR07RGts -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczMweXg3MTBycWV1MXVnMzZwMmdpOHlqZjkzMXIxNW0xcXlmdW4xNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4YHpN4pPN7iR07RGts/giphy.gif)

 

뷰 컨트롤러에 다음 코드를 추가합니다.

```swift
@IBOutlet weak var lblCount: UILabel!

func setDynamicQuickActions(_ value: Int) {
    let items: [UIApplicationShortcutItem] = (2...5).map { multiple in
        let result = value * multiple
        // userInfo의 값(value)는 NSSecureCoding을 준수해야 함
        let userInfo = [
            "value": NSString(string: "\(value)"),
            "multiple": NSString(string: "\(multiple)"),
            "result": NSString(string: "\(result)"),
            "message": "from dynamic quick action" as NSString
        ]
        
        return UIApplicationShortcutItem(
            type: "com.mycompany.myapp.dynamic",
            localizedTitle: "\(result)",
            localizedSubtitle: "\(value) * \(multiple) = \(result)",
            icon: UIApplicationShortcutIcon(templateImageName: "Custom-Punched"),
            userInfo: userInfo
        )
    }
    
    // 기존 static quick action은 지워지지 않음
    UIApplication.shared.shortcutItems = items
}

@IBAction func stepperActionChangeCount(_ sender: UIStepper) {
    let value = Int(sender.value)
    lblCount.text = "\(value)"
    
    setDynamicQuickActions(value)
}
```

- **UIApplicationShortcutItem(...)**
    - 퀵 액션 메뉴를 생성합니다.
    - `type` - 고유 식별자 (`UIApplicationShortcutItemType`) 입니다.
    - `localizedTitle` - 제목(현지화) 입니다. 현지화 방법은 [info.plist 파일 현지화](https://stackoverflow.com/questions/32773149/how-do-you-localize-static-uiapplicationshortcutitems)로 가능합니다.
    - `localizedSubtitle` - 부제(현지화) 입니다.
    - `icon` - 아이콘 파일로 추가합니다. `UIApplicationShortcutIcon` 타입이 필요하며 `systemImageName`(시스템 이미지 아이콘) 또는 `tempateImageName`(Assets폴더의 이미지 이름)으로 생성할 수 있습니다.
    - `userInfo` - 사용자 지정 정보입니다.
        - **주의점** - 해당 사전의 값(value)은 `NSSecureCoding`을 준수하는 타입만 입력 가능합니다.
        - 위의  `let userInfo`를 보면 값이 전부 `NSString` 타입으로 되어 있는데 `NSString`은 `NSSecureCoding`을 준수하기 때문입니다.
        - `NSSecureCoding`이 필수인 이유를 애플은 다음과 같이 설명하고 있습니다.
            
            > _이 속성의 사전에 있는 키와 값은 `NSSecureCoding` 프로토콜을 준수해야 하며 속성 목록 인코딩이 가능해야 합니다(property-list-encodable). 그렇지 않은 경우 시스템은 퀵 액션을 초기화할 때 런타임 예외를 발생시킵니다._
            
- **UIApplication.shared.shortcutItems = items**
    - `[UIApplicationShortcutItem]` 배열을 추가하여 앱에 Dynamic 퀵 액션을 추가합니다.
    - 기존에 Static 퀵 액션은 바뀌지 않으며 그 밑에 새로 추가됩니다.
    - 퀵 액션은 총합 4개까지 추가 가능하므로 그 범위를 넘어서는 UIApplicationShortcutItem은 무시됩니다.

 

### **퀵 액션을 클릭하면 특정 작업이 실행되게 하기**

위의 퀵 액션을 클릭하면 앱이 열리긴 하지만 아무런 추가 작업이 실행되지 않습니다. 특정 작업을 하려면 _**SceneDelegate.swift**_에서 지정해야 합니다.

_**SceneDelegate.swift**_ 파일을 열고 `SceneDelegate` 클래스의 하단에 `windowScene(...perfomActionFor...)`를 추가합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.36.00.jpg)

 

`windowScene(...perfomActionFor...)` 부분을 아래와 같이 작성합니다.

```swift
func windowScene(_ windowScene: UIWindowScene, performActionFor shortcutItem: UIApplicationShortcutItem, completionHandler: @escaping (Bool) -> Void) {
    if let userInfo = shortcutItem.userInfo {
        print(userInfo)
    }
    
    // 경고창
    let alert = UIAlertController(title: "Quick Actions Tutorial", message: "Quick Action Identifier: \(shortcutItem.type)", preferredStyle: .alert)
    let action = UIAlertAction(title: "OK", style: .default, handler: nil)
    alert.addAction(action)
    
    DispatchQueue.main.async {
        self.window?.rootViewController?.present(alert, animated: true)
    }
    
    // Shortcut Item Type(고유 이름)마다 해야할 작업 작성
    switch shortcutItem.type {
    case "com.mycompany.myapp.openfavorites":
        break
    case "com.mycompany.myapp.newmessage":
        break
    case "com.mycompany.myapp.dynamic":
        if let userInfo = shortcutItem.userInfo {
            let result = Int(userInfo["result"] as! String)!
            let message = userInfo["message"] as! String
            print(result, message)
        }
    default:
        break
    }
}
```

- **shorcutItem.type**
    - 고유 식별자를 `String` 타입으로 반환합니다.
- **shortcutItem.userInfo**
    - `userInfo`가 있다면 `[String: NSSecureCoding]?` 타입으로 반환합니다.
- **DispatchQueue.main.async {...}**
    - 루트 뷰 컨트롤러(`rootViewController`)를 찾아 경고창을 표시합니다.
    - UI 관련 부분은 무조건 main 스레드에서 실행되어야 하기 때문에 다른 스레드에서 실행되는것을 방지하기 위해 main 스레드에서 실행되도록 지정합니다.
- **switch shortcutItem.type {...}**
    - 고유 식별자로 작업을 분리할 필요가 있는 경우 `switch` 문으로 분기 실행합니다.
- **case "com.mycompany.myapp.dynamic":**
    - `userInfo`로부터 `result`, `message` 키의 값을 각각 `Int`, `String`으로 변환해 표시합니다.

 

`[New Message]` 퀵 액션을 클릭해서 열면 다음과 같이 경고창이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-24-pm-10.40.18.jpg)

 

또한 임의로 만든 Dynamic 퀵 액션을 클릭해서 열면 콘솔에 다음과 같이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-25-pm-3.02.03.jpg)

 

`self.window?.rootViewController?` 외에 다른 방식으로 뷰 컨트롤러를 참고할 수 있습니다 아래 참고 링크 중 [Add Home Screen Quick actions in Swift and iOS 13(영문)](https://blog.devgenius.io/add-home-screen-quick-actions-in-swift-and-ios-13-71615f805eff)에서

- `UIStoryboard`를 이용하여 스토리보드에서 ID를 이용해 뷰 컨트롤러를 가져오고 표시하는 방법
- 프로그래밍 방식으로 작성된 뷰 컨트롤러 인스턴스를 생성하고 표시하는 방법

을 찾을 수 있습니다.

 

### **참고**

- [Add Home Screen Quick Actions in Swift and iOS 13](https://blog.devgenius.io/add-home-screen-quick-actions-in-swift-and-ios-13-71615f805eff)
- [애플 공식 문서 - UIApplicationShortcutItems](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html#//apple_ref/doc/uid/TP40009252-SW36)
