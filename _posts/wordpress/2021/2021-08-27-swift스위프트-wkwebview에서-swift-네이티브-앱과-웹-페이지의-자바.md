---
title: "Swift(스위프트): WKWebView에서 Swift 네이티브 앱과 웹 페이지의 자바스크립트간 통신 (스토리보드) + console.log 표시"
date: 2021-08-27
categories: 
  - "DevLog"
  - "Swift UIKit"
---

이전 글에서 이어집니다.

- [Swift(스위프트): 오프라인 웹 페이지 표시하기 (스토리보드)](/posts/swift스위프트-오프라인-웹-페이지-표시하기-스토리보/)
- [Swift(스위프트): 오프라인 웹 페이지에서 자바스크립트 실행 및 alert, confirm, prompt 띄우기 (스토리보드)](/posts/swift스위프트-오프라인-웹-페이지에서-자바스크립트/)

 

## **자바스크립트에서 네이티브 앱(Swift)로 데이터 보내기**

웹 페이지의 자바스크립트 부분에 다음을 추가합니다.

```js
const is_iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true
function sendToNativeApp(event) {
  if(is_iOS) {
      // receiveFromJS - 네이티브 앱에서 사용할 함수 이름
      webkit.messageHandlers.receiveFromJS.postMessage("자바스크립트로부터")
  }
}
```

- `is_iOS` -해당 스크립트를 실행하는 기기가 iOS 계열 기기인지 확인합니다. 동일한 웹 페이지에서 안드로이드와의 통신이 필요할 수도 있기 때문에 구분하여 작성합니다.
- `webkit.messageHandlers.[Swift에서 사용할 이름].postMessage(데이터)`
    - 위의 `[Swift에서 사용할 이름]` 부분에 Swift에서 데이터를 받을 때 사용할 구분자를 작성합니다.
    - `webkit.messageHandlers.receiveFromJS` 의 경우 `receiveFromJS` 입니다.
- 데이터 부분에는 네이티브 앱에서 받을 데이터를 지정합니다. 자료형은 상관없습니다. 입력값이 없더라도 `boolean` 값을 보내야 오류를 피할 수 있습니다.

 

Swift 네이티브 앱의 뷰 컨트롤러의 클래스 선언부분 또는 `extension` 선언 부분에 `WKScriptMessageHandler` 프로토콜을 추가합니다.

```swift
extension ViewController: WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler {
    
    // ... //

}
```

이 프로토콜은 다음 protocol stub을 요구합니다. IDE의 지시에 따라 추가해줍니다.

```swift
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    
    // ... //

}
```

 

Swift 네이티브 앱의 뷰 컨트롤러에 다음을 추가합니다. (하이라이트 부분)

```swift
func loadHelpPage() {
    if #available(iOS 14.0, *) {
        webView.configuration.defaultWebpagePreferences.allowsContentJavaScript = true
    } else {
        // Fallback on earlier versions
        webView.configuration.preferences.javaScriptEnabled = true
    }
    
    // 자바스크립트 -> 네이티브 앱 연결
    // 브리지 등록
    webView.configuration.userContentController.add(self, name: "receiveFromJS")
    
    // 웹 파일 로딩
    webView.uiDelegate = self
    webView.navigationDelegate = self
    
    let pageName = "index"
    guard let url = Bundle.main.url(forResource: pageName, withExtension: "html", subdirectory: "webpage") else {
        return
    }
    webView.loadFileURL(url, allowingReadAccessTo: url)

}
```

- `loadHelpPage()` 함수는 `viewDidLoad`에서 실행합니다.
- `"receiveFromJS"`는 앞의 자바스크립트에서 지정했던 이름으로, 이것을 등록한 뒤 `userContentController`에서 해당 이름을 `if`문이나 `switch` 문으로 찾아 해당 부분에 실행할 작업을 작성합니다.

 

`func userContentController(...)` 부분에 구분자를 찾고 실행해야 할 작업을 기재합니다.

```swift
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    
    switch message.name {
    case "receiveFromJS":
        let alert = UIAlertController(title: "자바스크립트로부터 받은 메시지", message: message.body as? String, preferredStyle: .alert)
        let alertAction = UIAlertAction(title: "확인", style: .default, handler: nil)
        alert.addAction(alertAction)
        
        DispatchQueue.main.async {
            self.present(alert, animated: true, completion: nil)
        }
    case "logHandler":
        print("console log:", message.body)
    default:
        print("default")
        break
    }
}
```

- 구분자는 `message.name`에 저장되어 있습니다. 이 구분자는 여러개일 수 있으므로 `switch`문으로 구분자마다 분기를 만들어줍니다.
- 네이티브 앱에서 실행할 내용을 작성합니다. 여기서는 메시지를 받아 경고 창을 띄우게 했습니다.
- `message.body as? String` - 자바스크립트에서 `postMessage(데이터)`를 실행했을 때 데이터는 `message.body`에 담기게 됩니다. 이 데이터는 타입이 Any 이므로 해당하는 자료에 맞게 타입캐스팅을 해야합니다.

 

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-28-am-1.24.36.jpg)

자바스크립트에서 `sendToNativeApp` 함수를 실행하면 네이티브 앱에서 경고창이 뜨게 됩니다.

 

## **네이티브 앱(Swift)에서 자바스크립트로 데이터 보내기**

예를 들어 네이티브 앱에서 아래 자바스크립트 함수를 실행하고 싶다고 한다면

```js
function start(msg) {
    document.getElementById("title").textContent = msg
}
```

 

다음과 같은 코드를 네이티브 앱에 작성하면 됩니다.

```swift
// 자바스크립트의 특정 함수 실행하기
let msg = "Swift에서 JS로 값을 넘겼습니다."
let injectionSource = "start('\(msg)')"
let injectionScript = WKUserScript(source: injectionSource, injectionTime: .atDocumentEnd, forMainFrameOnly: false)
webView.configuration.userContentController.addUserScript(injectionScript)
```

- `injectionSource` - 여기에 자바스크립트 코드를 `String` 형태로 입력합니다.
- `injectionScript` - 이 코드를 `WKUserScript` 타입의 인스턴스에 담아야 합니다. `source`는 코드, `injectionTime`은 실행 지점이 어디인지 결정하는 부분으로, 문서의 시작, 끝부분을 지정할 수 있는데 일반적으로 문서의 끝 부분(`.atDocumentEnd`)에서 실행합니다.
- `webView.configuration.userContentController.addUserScript(injectionScript)`
    - 앞의 injectionScript를 userContentController에 추가합니다.

 

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-28-am-1.30.32.jpg)

실행되면 웹 페이지의 제목이 위와 같이 바뀝니다.

 

## **추가: console.log 표시하기**

위에 나온 두 방법들을 응용해서 웹 페이지 내부 자바스크립트의 `console.log`를 Xcode의 터미널에서 표시할 수 있습니다. ([stackoverflow](https://stackoverflow.com/questions/37159648/how-to-read-console-logs-of-wkwebview-programmatically))

- 뷰컨트롤러에 `WKScriptMessageHandler` 프로토콜 추가

```swift
// inject JS to capture console.log output and send to iOS
let source = """
    function captureLog(msg) { window.webkit.messageHandlers.logHandler.postMessage(msg); }
    window.console.log = captureLog;
"""
let script = WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: false)
webView.configuration.userContentController.addUserScript(script)

// register the bridge script that listens for the output
webView.configuration.userContentController.add(self, name: "logHandler")
```

```swift
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    
    switch message.name {
    // ... //

    case "logHandler":
        print("console log:", message.body)

    // ... //
    }
}
```

```js
// 자바스크립트
console.log("success")
```

 

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-28-am-1.32.19.jpg)
