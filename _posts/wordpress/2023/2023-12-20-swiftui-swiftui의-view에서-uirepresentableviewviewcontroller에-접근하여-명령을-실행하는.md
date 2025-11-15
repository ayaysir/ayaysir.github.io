---
title: "SwiftUI: SwiftUI의 View에서 UIRepresentableView(ViewController)에 접근하여 명령을 실행하는 방법"
date: 2023-12-20
categories: 
  - "DevLog"
  - "SwiftUI"
---

\[rcblock id="5440"\]

### **개요: SwiftUI와 UIKit을 연결하고 컨트롤하기**

이미 이 주제와 관련하여 포스트를 작성한 적이 있습니다.

- [SwiftUI: 웹 뷰(WKWebView) 추가하기 및 자바스크립트 실행 (Representable 사용)](http://yoonbumtae.com/?p=5436)

그런데 위의 방법은 `Combine`의 `PassthroughSubject`를 이용하기 때문에 너무 비직관적이고 이해하기 어려워서 뷰모델만 사용한 그나마 약간 간략화된 방법을 소개하려고 합니다. (이 방법도 딱히 쉬운건 아닙니다.)

 

#### **배경**

SwiftUI에서 WebKitView를 이용해 웹 페이지를 띄우는 앱을 만드려고 합니다. 추가하고 싶은 기능은 다음과 같습니다.

- 구글로 이동
- 네이버로 이동
- 사용자가 임의로 만든 자바스크립트 주입 및 실행 (evaulateJS 이용)

 

그래서 아래와 같이 아주 간단한 웹 뷰를 감싼 `UIRepresentableView`를 만들었습니다.

```swift
import SwiftUI
import WebKit

struct WebViewRepresentable: UIViewRepresentable {
    typealias UIViewType = WKWebView
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        let request = URLRequest(url: .init(string: "https://google.com")!)
        webView.load(request)
        
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
```

 

그리고 이것을 앱의 메인 부분에 추가했습니다.

```swift
import SwiftUI

struct WebContentView: View {
    var body: some View {
        VStack {
            HStack {
                Button("구글") {
                    // ??
                }
                .buttonStyle(.borderedProminent)
                Button("네이버") {
                    // ??
                }
                .buttonStyle(.borderedProminent)
                Button("스크립트(evaulateJS) 실행") {
                    // ??
                }
                .buttonStyle(.borderedProminent)
                .tint(.pink)
            }
            
            WebViewRepresentable()
        }
    }
}
```

문제는 여기서 `WebViewRepresentable()`를 제어할 수 있는 방법이 없습니다.

앞서 언급한 세 가지 기능을 UIKit에서는 매우 쉽게 추가할 수 있으며, 다음과 같습니다.

- 구글로 이동, 네이버로 이동
    - `webView.load(request)`
- 사용자가 임의로 만든 자바스크립트 주입 및 실행 (evaulateJS 이용)
    - `webView.evaluateJavaScript(스크립트)`

하지만 SwiftUI에서는 `webView` 객체에 접근할 수 없으므로 이 방법을 사용할 수가 없습니다. `WebViewRepresentable()`을 변수에 추가해봤자 일반적인 SwiftUI의 View로 인식합니다.

이를 해결할 다양한 방법이 있는데 _**뷰모델**_ 형태, `ObservableObject`를 통하여 UIKit의 뷰(또는 뷰컨트롤러)에 접근한 뒤 명령을 실행할 수 있습니다. 이 포스트에선 뷰모델을 사용한 방법에 대해 알아보겠습니다.

 

#### **방법**

1. 실행할 명령들을 정의한 `Provider` 프로토콜을 작성합니다.
2. 위의 `Provider`를 가지고 있는 `Controller` 프로토콜을 작성합니다.
3. `ObservableObject`와 `Controller`를 내려받은 뷰모델 클래스를 생성합니다.
    - 뷰모델 안에는 `provider`와 실행할 명령 메서드들을 추가합니다.
4. `WKWebView`를 상속받은 새 UIKit의 뷰 클래스를 생성합니다.
    1. 위 새로운 뷰 클래스에 `Provider`의 명령을 추가하고,
    2. 생성자와 멤버 변수로 `any Controller` 타입을 추가하고,
    3. 새로운 뷰 클래스의 `self`를 `Controller` 안의 `provider`와 연결합니다.
5. SwiftUI의 뷰에서 뷰모델 클래스를 초기화(initializaiton)하고, 해당 뷰모델 변수를 통해 원하는 작업을 실행합니다.

 ![](/assets/img/wp-content/uploads/2023/12/screenshot-2024-01-23-pm-8.29.30-copy.jpg)

 

##### **Step 1: 실행할 명령들을 정의한 Provider 프로토콜을 작성합니다.**

```
protocol WebViewProvider {
    func move(urlString: String)
    func evaluateJS(_ script: String)
}
```

 

##### **Step 2: 위의 Provider를 가지고 있는 Controller 프로토콜을 작성합니다.**

```
protocol WebViewConnector {
    var provider: (any WebViewProvider)? { get set }
}
```

- `Controller`라는 용어가 혼동의 여지가 있어서 앞으로 이것들은 `Connector`라고 칭하도록 하겠습니다.

 

##### **Step 3: ObservableObject와 Controller를 내려받은 뷰모델 클래스를 생성합니다.**

```
final class WebViewNexus: ObservableObject, WebViewConnector {
    @Published var provider: (WebViewProvider)?
    
    func move(urlString: String) {
        provider?.move(urlString: urlString)
    }
    
    func evaluateJS(_ script: String) {
        provider?.evaluateJS(script)
    }
}
```

- 뷰모델의 역할과 구분을 짓기 위해 앞으로 `Nexus`(결합, 연결, 집합체)라는 용어를 사용하도록 하겠습니다.

 

##### **Step 4: WKWebView를 상속받은 새 UIKit의 뷰 클래스를 생성합니다.**

```
class CustomWKWebView: WKWebView, WebViewProvider {
    var connector: any WebViewConnector
    
    init(connector: any WebViewConnector) {
        self.connector = connector
        super.init(frame: .zero, configuration: .init())
        
        // 필수: Critical connection between SwiftUI and UIKit
        DispatchQueue.main.async{
            self.connector.provider = self
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // WebViewProvider에서 요구하는 메서드

    func move(urlString: String) {
        let request = URLRequest(url: .init(string: urlString)!)
        self.load(request)
    }
    
    func evaluateJS(_ script: String) {
        self.evaluateJavaScript(script)
    }
}
```

 

##### **Step 4-2: 기존에 있던 WebViewRepresentable 뷰를 새로운 커스텀 타입에 맞춰 변경시킵니다.**

```
struct WebViewRepresentable: UIViewRepresentable {
    typealias UIViewType = CustomWKWebView
    
    var connector: any WebViewConnector
    
    init(connector: any WebViewConnector) {
        self.connector = connector
    }
    
    func makeUIView(context: Context) -> CustomWKWebView {
        // let webView를 멤버변수로 선언하면 메모리 위치 오류가 나므로 이 안에 선언
        let webView: CustomWKWebView = .init(connector: connector)
        webView.move(urlString: "https://naver.com")

        return webView
    }
    
    func updateUIView(_ uiView: CustomWKWebView, context: Context) {
        // webView를 코디네이터로 넘기기 위해
        context.coordinator.webView = uiView
        context.coordinator.webView?.navigationDelegate = context.coordinator
    }
    
    func makeCoordinator() -> Coordinator {
        .init(parent: self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var webView: CustomWKWebView? = nil
        
        init(parent: WebViewRepresentable) {
            super.init()
        }
        
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print(#function)
        }
        
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print(#function, error)
        }
    }
}
```

- 현재 예제에서는 `Coordinator`가 필요하지 않지만 추후 확장성을 고려하여 미리 추가해뒀습니다.

 

##### **Step 5: SwiftUI의 뷰에서 뷰모델 클래스를 초기화(initializaiton)하고, 해당 뷰모델 변수를 통해 원하는 작업을 실행합니다.**

```swift
import SwiftUI

struct WebContentView: View {
    @StateObject var nexus = WebViewNexus()
    
    var body: some View {
        VStack {
            HStack {
                Button("구글") {
                    // 이제 여기에 nexus(뷰모델)를 사용하면 됩니다.
                    nexus.move(urlString: "https://google.com")
                }
                .buttonStyle(.borderedProminent)
                Button("네이버") {
                    // 이제 여기에 nexus(뷰모델)를 사용하면 됩니다.
                    nexus.move(urlString: "https://naver.com")
                }
                .buttonStyle(.borderedProminent)
                Button("스크립트(evaulateJS) 실행") {
                    // 이제 여기에 nexus(뷰모델)를 사용하면 됩니다.
                    nexus.evaluateJS(
                    """
                    document.body.innerHTML = "<b>메롱  🤪</b>"
                    """
                    )
                }
                .buttonStyle(.borderedProminent)
                .tint(.pink)
            }
            
            WebViewRepresentable(connector: nexus)
        }
    }
}

#Preview {
    WebContentView()
}

```

<!-- https://giphy.com/gifs/2xc0CYz4TsyZCyPQEm -->
![](https://)

 

<!-- \[rcblock id="5348"\] -->
