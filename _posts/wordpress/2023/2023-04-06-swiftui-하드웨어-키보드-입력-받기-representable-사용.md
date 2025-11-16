---
title: "SwiftUI: 하드웨어 키보드 입력 받기 (Representable 사용)"
date: 2023-04-06
categories: 
  - "DevLog"
  - "SwiftUI"
---

<!-- \[rcblock id="5440"\] -->

### **소개**

SwiftUI 앱에서 하드웨어 키보드의 입력을 받는 방법입니다.

여기서 하드웨어 키보드란 iOS/iPadOS 환경에서는 USB 키보드, 블루투스 키보드, 액세서리 키보드 등을 뜻하며, Mac Catalyst/M시리즈 CPU 등 맥 환경에서 실행되는 경우에는 노트북의 키보드, 유선 키보드, 블루투스 키보드 등을 뜻합니다. 하드웨어 키보드의 입력에 대한 처리란 이런 키보드에서 키를 눌렀을 때 해야할 작업을 뜻합니다.

SwiftUI에서는 직접적으로 기능을 제공하지 않는 것처럼 보이기 때문에 `UIViewController`의 키보드 처리 과정을 호스팅해서 사용하는 `UIViewControllerRepresentable`을 사용하도록 하겠습니다.

 

#### **방법**

##### **1) 기본 ContentView 작성**

먼저 기본 `ContentView` 레이아웃을 생성합니다.

```swift
import SwiftUI

struct ContentView: View {
    @State var pressedKeyStr = ""
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Button {
                buttonAction()
            } label: {
                Text("Press ZXCVASDF")
            }
            Text(pressedKeyStr)
                .font(.largeTitle)
            // ... 이곳에 키보드 입력 관련 내용이 들어갑니다 ... //
        }
        .padding()
    }
    
    func buttonAction(_ text: String = "From SwiftUI Button") {
        pressedKeyStr = text
    }
}
```

 ![](/assets/img/wp-content/uploads/2023/04/screenshot-2023-04-07-am-12.06.47.png)

키보드를 누르면 위의 `From SwiftUI Button` 대신 입력된 키보드의 문자가 출력될 것입니다.

 

##### **2) 키보드 이벤트에 대한 대리자(delegate) 생성**

```
protocol KeyEventVCDelegate: AnyObject {
    func didKeyPressBegan(key: UIKey)
}
```

`UIViewControllerRepresentable`과 더불어 위의 대리자의 `didKeyPressBegan` 함수+ `Coordinator`를 통해 SwiftUI 상에서 키보드 입력에 대한 처리가 가능하게 됩니다.

- 이 예제에서는 키보드를 누르기 시작했을 때(Presses Began)에 대한 이벤트만 필요하므로 함수를 하나만 작성했지만, 키보드를 뗐을 때(Presses Ended)에 대한 이벤트도 필요하다면 해당 함수를 추가적으로 작성하면 됩니다.

 

##### **3) 키보드 이벤트를 처리하는 뷰 컨트롤러(UIViewController) 작성**

```
class KeyEventViewController: UIViewController {
    weak var delegate: KeyEventVCDelegate?
    
    override func pressesBegan(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
        for press in presses {
            guard let key = press.key else {
                continue
            }
            delegate?.didKeyPressBegan(key: key)
        }
    }
    
    override func pressesEnded(_ presses: Set<UIPress>, with event: UIPressesEvent?) {
        // for press in presses {
        //     guard let key = press.key else {
        //         continue
        //     }
        //     print(key)
        // }
    }
}
```

- `UIViewController`에는 `pressesBegan`, `pressesEnded`라는 메서드가 있습니다.
    - `pressesBegan`은 키보드를 누르기 시작했을 때의 이벤트를 처리합니다.
    - `pressesEnded`는 키보드를 뗐을 때의 이벤트를 처리합니다.
- `pressesBegan`이 되었을 때 대리자의 `didKeyPressBegan(key:)`를 실행합니다.
    - 대리자 함수는 `Coordinator`에서 실행되도록 할 것입니다.

 

##### **4) KeyEventViewController에 대한 래핑 구조체(struct) 작성**

`UIViewControllerRepresentable`을 준수(conform)하는 함수를 작성합니다.

```swift
struct KeyboardView: UIViewControllerRepresentable {
    typealias UIViewControllerType = KeyEventViewController
    typealias KeyboardHandler = (String) -> ()
    
    let viewController = KeyEventViewController()
    var keyboardHandler: KeyboardHandler
    
    func makeUIViewController(context: Context) -> KeyEventViewController {
        return viewController
    }
    
    func updateUIViewController(_ uiViewController: KeyEventViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        // ... 후술 ... //
    }
    
    class Coordinator: KeyEventVCDelegate {
        // ... 후술 ... //
    }
}
```

- `Representable`에 대한 자세한 내용은 [SwiftUI: Representable을 이용해서 UIViewController 띄우기](http://yoonbumtae.com/?p=5349) 포스트를 참고해주세요.
- `Coordinator`가 필요하기 때문에 `makeCoordinator()`와 이너 클래스 `Coordinator`를 추가합니다.

 

##### **5) 코디네이터 작성**

```swift
func makeCoordinator() -> Coordinator {
    Coordinator(viewController, keyboardHandler: keyboardHandler)
}

class Coordinator: KeyEventVCDelegate {
    var keyboardHandler: KeyboardHandler
    
    init(_ viewController: KeyEventViewController, keyboardHandler: @escaping KeyboardHandler) {
        self.keyboardHandler = keyboardHandler
        viewController.delegate = self // ViewController의 delegate를 KeyEventVCDelegate를 conform하는 Coordinator와 연결 
    }
    
    // Delegate - 사용자 정의 KeyEventVCDelegate
    func didKeyPressBegan(key: UIKey) {
        keyboardHandler(key.characters)
    }
}
```

앞에서 언급했던 대리자 함수 `didKeyPressBegan(key:)`를 실행하려면 코디네이터(Coordinator)가 필요합니다.

- `Coordinator`에 대한 자세한 내용은 [SwiftUI: Representable을 이용해서 UIViewController 띄우기](http://yoonbumtae.com/?p=5349) 포스트를 참고해주세요.
- **keyboardHandler**
    - 키보드를 입력했을 때 처리해야 할 작업을 외부에서 지정할 수 있도록 `(String) -> ()` 타입의 클로저(콜백)를 값으로 받는 변수입니다.
- **viewController.delegate = self**
    - 뷰 컨트롤러(=>`KeyEventViewController`)의 `delegate`로 `Coordinator`를 지정합니다.
    - `Coordinator`는 `KeyEventVCDelegate`를 준수(conform)하기 때문에 이러한 지정이 가능합니다.
    - `KeyEventViewController`에서 키보드 입력을 받으면 `pressesBegan(...)`함수가 실행되고, 여기에서 `delegate?.didKeyPressBegan(key:)`가 실행됩니다.
    - 여기서 대리자가 코디네이터로 지정되어 있기 때문에 코디네이터 인스턴스 내에서 구현된 `didKeyPressBegan(key:)`가 실행되는 것입니다.
- **func didKeyPressBegan ...**
    - `keyboardHandler` 클로저 함수가 실행되도록 구현합니다.

 

##### **6) ContentView에 키보드 입력 부분 추가**

```swift
struct ContentView: View {
    @State var pressedKeyStr = ""
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Button {
                buttonAction()
            } label: {
                Text("Press ZXCVASDF")
            }
            Text(pressedKeyStr)
                .font(.largeTitle)

            KeyboardView(keyboardHandler: { keyStr in
                let charSet = CharacterSet(charactersIn: "zxcvasdfZXCVASDF")
                if keyStr.rangeOfCharacter(from: charSet) != nil {
                    buttonAction(keyStr)
                }
            })
            .frame(width: 0, height: 0)
        }
        .padding()
    }
    
    func buttonAction(_ text: String = "From SwiftUI Button") {
        pressedKeyStr = text
    }
}
```

- 래핑 구조체인 `KeyboardView`를 추가합니다.
- `z, x, c, v, a, s, d, f` 중 하나의 키가 눌리면 `buttonAction(_:)`을 실행해 `pressedKeyStr`가 해당 키값으로 바뀌게 합니다.
- **frame(width: 0, height: 0)**
    - `UIViewController`의 기본 크기만큼 뷰를 차지하기 때문에 프레임의 크기를 `0`으로 만들어 다른 뷰들에게 방해되지 않도록 합니다.
- **buttonAction**
    - 버튼 또는 키보드를 눌렀을 때 해야 할 작업을 지정합니다.
    - 여기서는 `@State var pressedKeyStr`의 값을 변경하도록 했습니다.

 

<!-- http://www.giphy.com/gifs/lOwSPlC2J9Yz5oewYl -->
![](https://)
