---
title: "SwiftUI: WKWebView의 UIRepresentableView에서 웹 페이지의 Alert, Confirm, Prompt 표시"
date: 2025-01-25
categories: 
  - "DevLog"
  - "SwiftUI"
---

**관련 글**

- [SwiftUI: 웹 뷰(WKWebView) 추가하기 및 자바스크립트 실행 (Representable 사용)](/posts/swiftui-웹-뷰wkwebview-추가하기-및-자바스크립트-실행-representable-사용/)

## 소개

<!-- <iframe width="345" height="480" src="https://giphy.com/embed/Uc5BigRYGmdIat1wbR" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![Alert Examples](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVyajkwanRrZDVyNG84aWxyejVvYjhtbGd5aW0wa3NvNWxibW8xeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Uc5BigRYGmdIat1wbR/giphy.gif)

UIDelegate에서 구현해야되는 자바스크립트 경고창 (Alert, Confirm, Prompt) 표시는 어떻게 해야 할까요?

## 방법

### 1. _**Coordinator**_ 클래스를 만들고 `WKUIDelegate`를 준수(conform)
 - 부모 뷰 (`WebViewRP`)를 참조하는 변수를 정의하고 이 변수를 통해 코디네이터와 통신

### 2. 코디네이터 클래스 안에 자바스크립트 경고창 표시와 관련된 함수를 오버라이딩 및 정의

### 3. 제목 메시지 및 Alert 표시 여부는 `@State`, `@Binding` 변수들을 통해 전달
 - 참고: `@State` 및 `@Binding` 변수들은 `ObservableObject` 뷰모델의 `@Published` 로 대체할 수 있습니다.

### 4. Alert의 확인버튼, Confirm의 예/아니오 버튼, Prompt의 텍스트 필드 및 전송/취소 버튼이 클릭되었을 때 해야 할 작업등은 `(파라미터) -> Void` 형태의 클로저 함수로 전달
 - 참고: `ObservableObject` 뷰모델을 사용하는 경우 뷰모델에 해당 클로저 함수를 저장하도록 지정할 수 있습니다.

`ObservableObject`를 사용하여 분리한 코드는 [여기](https://github.com/ayaysir/Swift-Playgrounds/tree/main/Projects/study-UIRepresentable%20RND/study-UIRepresentable%20RND/%EB%B0%A9%EB%B2%951_ObservableObject%EB%A1%9C%EB%A7%8C%20%ED%86%B5%EC%8B%A0)에서 볼 수 있습니다.

 

## 코드 (@State, @Binding 사용)

<!-- https://gist.github.com/ayaysir/99b48bf69a42de3e4ae79d44e229a7f1 -->
{% gist "99b48bf69a42de3e4ae79d44e229a7f1" %}

## 설명
 

### CompletionHandler를 사용하는 메서드에서 completionHandler의 역할

웹 페이지의 자바스크립트 실행 부분에서 경고창이 뜨면 다음 명령을 기다리게 됩니다. iOS 앱에서 Handler 함수가 실행되면 다음에 해야 할 자바스크립트 작업을 이어서 실행합니다.

이 핸들러 함수를 컨텐트 뷰에 전달하고 SwiftUI의 경고창에서 버튼을 눌렀을 때 전달받은 핸들러를 실행하면 웹페이지의 자바스크립트가 다음 작업을 실행하게 되는 것입니다.

 

### async/await 메서드에서 self.parent.alertHandler = {...} 부분의 동작 원리

#### **핵심 개념**

**alertHandler**는 `@Binding`으로 전달된 클로저입니다. Swift의 클로저는 코드 블록을 캡처하고, 나중에 실행될 수 있는 “일급 객체”입니다. 이 클로저를 `continuation.resume()`로 연결하여, JavaScript `alert()`가 비동기적으로 처리될 수 있도록 합니다.

 

#### **동작 원리**

1. **alertHandler 초기 설정**
    - `parent.alertHandler`는 UIViewRepresentable의 SwiftUI View와 연결된 상태 변수입니다.
    - 초기값은 비어 있지만, `webView(_:runJavaScriptAlertPanelWithMessage:initiatedByFrame:)` 호출 시 새로운 클로저를 할당합니다.
2. **withCheckedContinuation 사용**
    - Swift Concurrency에서 `withCheckedContinuation`은 콜백 기반 코드를 `async/await`로 변환하는 데 사용됩니다.
    - JavaScript `alert()` 이벤트는 비동기로 처리되므로, Continuation을 사용해 비동기 흐름을 제어합니다.
3. **클로저 저장**
    
    - JavaScript `alert()` 호출 시 `self.parent.alertHandler`에 다음 동작을 정의한 클로저를 할당합니다:
    
    ```js
    self.parent.alertHandler = {
      continuation.resume()
    }
    ```
    
    - 이 클로저는 SwiftUI의 Alert의 “OK” 버튼과 연결되어, 버튼이 눌릴 때 실행됩니다.
4. **Alert 표시**
    - `showAlert`를 `true`로 설정하면 SwiftUI에서 Alert이 표시됩니다.
    - Alert의 “OK” 버튼을 누르면 `alertHandler()`가 실행되고, Continuation이 재개됩니다.
5. **Continuation 재개**
    - `continuation.resume()`가 호출되면, `await`가 완료되고 `webView(_:runJavaScriptAlertPanelWithMessage:)`의 호출이 끝납니다.
    - 이로써 비동기 흐름이 정상적으로 처리됩니다.
