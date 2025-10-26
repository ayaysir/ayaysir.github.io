---
title: "Swift: iOS에서 Custom URL Scheme 등록해서 url로 앱 열기"
author: ayaysir
date: 2025-10-25 13:11:00 +0900
categories: 
  - "DevLog"
  - "Swift"
tags: [Swift]
---

iOS에서 Custom URL Scheme를 등록하는 방법입니다.

---

## 1. 메인 앱에 URL Scheme 등록

먼저 ImageTranslator 앱의 Info.plist에 다음을 추가하세요.

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>imagetranslator</string> <!-- 원하는 이름 -->
    </array>
  </dict>
</array>
```

이것을 Property List 뷰로 보면 다음과 같습니다.

![Propety List View](/assets/img/DevLog/swift-propertylist-1.jpg)

→ 이렇게 하면 `imagetranslator://` 로 시작하는 URL을 iOS가 내 앱으로 연결해줍니다.

### 참고: Info.plist 파일이 없을 때
- [Xcode에서 Info.plist 파일이 없을 때](/posts/xcode-where-is-infoplist)


## 2. 메인 앱에서 URL 감지

UIKit의 `SceneDelegate` 또는 `@main`의 SwiftUI App 구조에서 이 URL을 감지해야 합니다.

SceneDelegate 방식 (UIKit 기반)

```swift
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
  guard let url = URLContexts.first?.url else { return }
  if url.absoluteString.hasPrefix("imagetranslator://open-from-extension") {
    // ✅ 해야 할 작업 작성
  }
}
```

SwiftUI App 방식

```swift
@main
struct ImageTranslatorApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
        .onOpenURL { url in
          if url.absoluteString.hasPrefix("imagetranslator://open-from-extension") {
            // ✅ 해야 할 작업 작성
          }
        }
    }
  }
}
```

## 3. URL 로 앱 열기
- 사파리 등 웹 브라우저에서 주소창에 `imagetranslator://open-from-extension`를 입력하면 앱이 열리는지 확인합니다.


