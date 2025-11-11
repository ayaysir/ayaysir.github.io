---
title: "Swift: Action Extension에서 extensionContext가 iOS 18에서 작동하지 않는 문제"
author: ayaysir
date: 2025-10-24 23:11:00 +0900
categories: 
  - "DevLog"
  - "Swift"
tags: [SwiftUI]
---

iOS 18부터 **Action Extension에서 메인 앱을 여는(openURL) 기능이 동작하지 않는 문제** (iOS 17 이하에서는 정상 동작했음) 에 대한 해결방법 요약입니다.

**원문 링크**
- [Stack Overflow](https://stackoverflow.com/questions/79077018/unable-to-open-main-app-from-action-extension-in-ios-18-previously-working-met)

## 문제 개요

* 개발자가 만든 앱(`Voicepaper`)의 **Action Extension**에서 `extensionContext`를 사용해 메인 앱을 여는 코드가
  iOS 17까지는 잘 작동했으나, **iOS 18에서는 더 이상 동작하지 않음.**

* 기존 코드 예시:

```swift
func openVoicepaperApp(path: String = "") {
    if let url = URL(string: "voicepaper2://" + path) {
        extensionContext?.open(url, completionHandler: nil)
    }
}
```


* iOS 18에서는 **두 방식 모두 실패**
  → 메인 앱으로 전환되지 않음, 복원 프로세스 시작 불가.



## 원인

* **iOS 18에서 Extension 내부의 URL Scheme 호출 관련 API가 변경 및 제한됨**
* `extensionContext?.open()` 과 `perform(#selector(openURL:))` 방식이
  더 이상 허용되지 않거나, 호출이 무시됨.


## 해결책 
### ① (iOS 18 대응 확인됨)

아래 코드를 사용하면 iOS 18에서도 메인 앱 실행 가능:

```swift
/// Redirect To App
func redirectToApp() {
    let urlString = "Your URL"
    guard let redirectionURL = URL(string: urlString) else {
        return
    }
    print("Redirecting to URL: \(urlString)")
    openURL(redirectionURL)
}

/// Open URL Code
@objc @discardableResult func openURL(_ url: URL) -> Bool {
    var responder: UIResponder? = self
    while responder != nil {
        if let application = responder as? UIApplication {
            if #available(iOS 18.0, *) {
                application.open(url, options: [:], completionHandler: nil) // 👈
                return true
            } else {
                return application.perform(#selector(openURL(_:)), with: url) != nil
            }
        }
        responder = responder?.next
    }
    return false
}
```

#### 핵심 포인트:

* `UIApplication` 인스턴스를 **responder chain을 통해 직접 탐색**
* iOS 18에서는 `application.open()` 을 명시적으로 호출해야 함
  (기존 `extensionContext?.open()`은 무시됨)
* 이 방식으로 iOS 18에서도 정상 동작 확인됨.



### ② (iOS 17~18 모두 호환)

```swift
func openMainApp(_ hostValue: String) {
    guard let url = URL(string: "yourapp://\(hostValue)") else { return }
    openURL(url)
}

@discardableResult
@objc func openURL(_ url: URL) -> Bool {
    var responder: UIResponder? = self
    while responder != nil {
        if let application = responder as? UIApplication {
            application.open(url, options: [:]) { success in
                if success {
                    print("App opened successfully")
                } else {
                    print("Failed to open app")
                }
            }
            return true
        }
        responder = responder?.next
    }
    return false
}
```

이 코드 역시 `UIApplication`을 responder chain으로 찾아서 직접 `open(_:options:)`을 호출하기 때문에 iOS 18에서도 안정적으로 작동.


## 요약 정리

| 항목                               | iOS 17 이전 | iOS 18 이후        |
| -------------------------------- | --------- | ---------------- |
| `extensionContext?.open()`       | 정상 작동   | 무시됨            |
| `perform(#selector(openURL:))`   | 작동      | 더 이상 권장되지 않음  |
| `UIApplication.open(url:)` 직접 호출 |         | (권장 방식)        |
| Extension → App 전환 가능 여부         | 가능        | 여전히 가능 (새 코드 필요) |

