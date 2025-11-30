---
title: "SwiftUI: 웹 뷰(WKWebView) 추가하기 및 자바스크립트 실행 (Representable 사용)"
date: 2023-04-07
categories: 
  - "DevLog"
  - "SwiftUI"
---

<!-- \[rcblock id="5440"\] -->

## **소개**

SwiftUI 내부에 웹 뷰(`WKWebView`)를 추가하는 방법입니다. 원래 웹 페이지를 표시하는 `WKWebView`는 `UIKit`과 호환되는 요소인데, 찾아본 결과 SwiftUI에는 웹을 표시할 수 있는 뷰가 없는 것처럼 보여서 역시 Representable을 이용해서 간접적으로 추가하는 방법을 설명하겠습니다.

두 가지 방법을 알아보겠습니다.

1. 단순히 SwiftUI에 웹 뷰를 추가하는 방법입니다.
2. 위 예제의 웹 뷰에서 `evaluateJavaScript(_:)`를 원하는 시점에 실행할 수 있도록 합니다.
 

## **방법 1: 웹 뷰를 추가하는 방법**


### **1) UIViewRepresentable을 준수(conform)하고 웹 뷰를 감싸는 WebView를 추가합니다.**

```swift
struct WebView: UIViewRepresentable {
    typealias UIViewType = WKWebView
    
    var url: URL?
    
    func makeUIView(context: Context) -> UIViewType {
        let preferences = WKPreferences()
        preferences.javaScriptCanOpenWindowsAutomatically = false  // JavaScript가 사용자 상호 작용없이 창을 열 수 있는지 여부
        
        let configuration = WKWebViewConfiguration()
        configuration.preferences = preferences
        
        let webView = WKWebView(frame: CGRect.zero, configuration: configuration)
        webView.allowsBackForwardNavigationGestures = true    // 가로로 스와이프 동작이 페이지 탐색을 앞뒤로 트리거하는지 여부
        webView.scrollView.isScrollEnabled = true    // 웹보기와 관련된 스크롤보기에서 스크롤 가능 여부
        
        if let url = url {
            webView.load(URLRequest(url: url))    // 지정된 URL 요청 개체에서 참조하는 웹 콘텐츠를 로드하고 탐색
        }
        
        return webView
    }
    
    func updateUIView(_ uiView: UIViewType, context: Context) {
        // ... 잠시 후 작성 ... //
    }

}
```

- `UIViewRepresentable`에 관한 자세한 내용은 [SwiftUI: Representable을 이용해서 UIViewController 띄우기](/posts/swiftui-representable을-이용해서-uiviewcontroller-띄우기/)를 참고해주세요. (뷰 컨트롤러에 관한 글이지만 뷰(`UIView`)도 내용이 거의 같습니다.)
- `makeUIView` 함수에서 `WKWebView` 인스턴스를 리턴합니다. 필요한 경우 함수 내부에서 각종 설정 등을 미리 지정합니다.
- **var url**
    - 파라미터로 `URL`을 받습니다.

 

### **2) SwiftUI의 뷰(ContentView 등) 내부에 위의 Representable을 추가합니다.**

```swift
var body: some View {
    // ... //
    WebView(url: URL(string: "https://www.website.con"))
    // ... //
}
```

`url` 파라미터에 `URL`을 입력해서 유효한 주소인 경우 웹 페이지가 표시됩니다. 아래 스크린샷은 SwiftUI의 뷰 내부에 `WebView`를 삽입한 예제입니다.

 ![](/assets/img/wp-content/uploads/2023/04/Simulator-Screenshot-iPhone-14-2023-04-07-at-14.45.33-copy-2.jpg)

 

## **웹 뷰에서 evaluateJavaScript(\_:)를 원하는 시점에 실행**

SwiftUI 환경에서 `ContentView` 내부에 버튼이 있는데 이 버튼을 누르면 웹 페이지에서 특정 자바스크립트 코드를 실행하고 싶다면 어떻게 할까요?

일반 UIKit이었다면 단순히 버튼 이벤트 내부에 `webView.evaluateJavasScript("스크립트")`를 넣었으면 되었지만 SwiftUI 환경에서는 굉장히 복잡합니다.

 

### **1) WebViewData 클래스를 추가**

```swift
import Combine
// ... //

class WebViewData: ObservableObject {
    var functionCaller = PassthroughSubject<String, Never>()
    var shouldUpdateView = true
}
```

- **functionCaller**
    - `PassthroughSubject<Output, Failure>` 타입입니다.
    - `String` 값을 내보냅니다.
- **shouldUpdateView**
    - `updateUIView`를 실행해야 하는지 여부에 대한 `Bool` 값입니다.
    - `true`로 지정합니다.
- **\[심화\] PassthroughSubject**
    - Downstream 구독자(subscribers)들에게 값을 전파하는 subject(send 메서드를 호출해서 stream에 값을 주입하기 위해 사용하는 Publisher)입니다.
    - `CurrentValueSubject`와 달리 value값 접근 불가, 최신값을 저장하지 않는다는 차이점이 있습니다.
    - 기존의 명령형(imperative) 코드를 `Combine` 모델로 적용할 때 편리한 방법을 제공하는 Subject Class입니다.
    - 구독자가 없거나 demand 값이 0인 경우 값을 버립니다.
    - 자세한 내용: [https://0urtrees.tistory.com/324](https://0urtrees.tistory.com/324)

 

### **2) WebView 내에 WebViewData에 대한 상태 변수 추가**

```swift
struct WebView: UIViewRepresentable {
    // ... //
    @StateObject var data: WebViewData
    // ... //
}
```

 

### **3) WebView 내에 코디네이터를 추가**

```swift
import Combine
// ... //

func makeCoordinator() -> Coordinator {
    return Coordinator(self)
}

class Coordinator: NSObject, WKNavigationDelegate {
    /// WebView Representable
    var parentWebView: WebView
    var webView: WKWebView? = nil
    
    private var cancellable: AnyCancellable?
    
    init(_ parentWebView: WebView) {
        self.parentWebView = parentWebView
        super.init()
    }
    
    func tieFunctionCaller(data: WebViewData) {
        print("Passthrough:", #function)
        cancellable = data.functionCaller.sink(receiveValue: { js in
            self.webView?.evaluateJavaScript(js)
        })
    }
}
```

- 코디네이터에 관한 자세한 내용은 [SwiftUI: Representable을 이용해서 UIViewController 띄우기](/posts/swiftui-representable을-이용해서-uiviewcontroller-띄우기/)를 참고해주세요.
- **parentWebView**
    - Representable View의 인스턴스를 담습니다.
- **webView**
    - Representable View의 `makeUIView(...)`를 통해 생성된 `WKWebView` 인스턴스를 담습니다.
    - 잠시 후 자세히 설명합니다.
- **init(\_ parentWebView: WebView)**
    - 파라미터로 `WebView`를 지정합니다.
    - 이것을 `makeCoordinator()`에서 리턴시킵니다.
- **tieFunctionCaller(...)**
    - `WebViewData`의 `functionCalller`를 소환하는 역할을 합니다.
    - `functionCalller`는 `PassthroughSubject`이므로 `sink`를 호출할 수 있습니다.
    - 어느 특정 조건이 되면(예: 버튼을 누른 경우) `String` 값이 배출됩니다.
    - `sink`를 통해 배출된 js값(`String` 타입)을 `webView?.evaluateJavaScript(js)`로 실행합니다.

 

### **4) WebView 내에 updateUIView를 작성합니다.**

```swift
func updateUIView(_ uiView: UIViewType, context: Context) {
    guard data.shouldUpdateView else {
        data.shouldUpdateView = false
        return
    }
    
    context.coordinator.tieFunctionCaller(data: data)
    context.coordinator.webView = uiView
}
```

- `updateUIView`는 웹뷰가 실행된 시점에 바로 실행되며, `makeUIView` 다음에 실행됩니다.
- `uiView`는 현재 실행되고 있는 `WebView`(=> `UIViewType`)입니다.
- `context`는 `UIViewRepresentable`(=>`WebView` 또는 `UIViewType`)에 대한 컨텍스트 변수입니다.
- **context.coordinator**
    - 현재 컨텍스트에 있는 코디네이터입니다.
    - `teiFunctionCaller` 함수를 실행합니다.
    - 코디네이터의 `webView`를 `uiView`와 연결합니다.

 

### **5) SwiftUI의 뷰(ContentView 등) 내부에 WebViewData를 추가합니다.**

```swift
struct ContentView: View {
    // ... //
    @StateObject var webViewData = WebViewData()
    // ... //
}
```

 

### **6) SwiftUI의 뷰(ContentView 등) 내부에 WebView를 추가합니다.**

```swift
var body: some View {
        WebView(url: URL(string: "https://example.con"), data: webViewData)
}
```

앞 섹션과의 차이점은 `WebView`의 파라미터로 `data`가 추가된 점입니다. 여기서 `webViewData` 상태 변수를 추가합니다.

 

### **7) 버튼을 누르면 특정 자바스크립트가 실행되도록 하기**

`webViewData`를 이용합니다.

```swift
Button {
    webViewData.functionCaller.send(
        """
        document.querySelector("button[id^='playbut']").click()
        """
    )
} label: {
    Image(systemName: "play.fill")
}
```

`evaluateJavaScript`가 실행되기 까지의 과정을 간략하게 설명하면 다음과 같습니다.

1. **updateUIView(\_:context:)** <- `tieFunctionCaller` 실행, `webView`: `WKWebView` 등록
2. **커스텀 JS 데이터 전달** `@StateObject webViewData.functionCaller.send("CUSTOM_JS")`
3. **tieFunctionCaller(data:)에서 data.functionCalller.sink...** <- `webView?.evaluateJS` 실행

 

<!-- http://www.giphy.com/gifs/uiSo2m6jk28v4uUf0H -->
![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXFldjN6bjJnNnZ4c2RteTBxNGk0cnUxbmN6MDdpcHpxN2gzMDVlOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/uiSo2m6jk28v4uUf0H/giphy.gif)

 

## **전체 코드**

<!-- https://gist.github.com/ayaysir/925f2497e33efe252836300c575b334a -->
{% gist "925f2497e33efe252836300c575b334a" %}