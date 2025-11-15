---
title: "Swift iOS 앱 프로젝트: 버튼을 누르면 iOS에 내장된 사전(dictionary) 열기"
date: 2024-12-16
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

iOS에서 UIKit을 사용하여 내장된 사전을 여는 방법은 `UIReferenceLibraryViewController`를 활용하는 것입니다. 이 클래스는 지정된 단어에 대한 사전 정의를 표시하는 뷰 컨트롤러를 제공합니다.

## **UIKit에서 구현방법**

아래는 특정 단어에 대해 iOS 내장 사전을 여는 예제입니다.

### **코드**

```swift
import UIKit

func openDictionary(for word: String, from viewController: UIViewController) {
  if UIReferenceLibraryViewController.dictionaryHasDefinition(forTerm: word) {
    let dictionaryVC = UIReferenceLibraryViewController(term: word)
    viewController.present(dictionaryVC, animated: true, completion: nil)
  } else {
    print("No definition available for the word: \(word)")
  }
}
```

#### **사용 예시**  
버튼 눌렀을때 액션 함수 등에서 사용합니다.

```swift
openDictionary(for: "language", from: self)
```
![](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzA4cGlidmJ3MjdqYW13MHlyZGE5c3NsbDViMTY0amtiMjBhNTFjMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bQq9Sf4QwjhD8mz66F/giphy.gif)
 
<!-- 
<iframe width="222" height="480" src="https://giphy.com/embed/bQq9Sf4QwjhD8mz66F" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->

 

### **설명**

1. **UIReferenceLibraryViewController**
    - `term` 매개변수를 사용하여 단어를 초기화합니다.
    - 사전 정의를 포함한 시스템 제공 뷰 컨트롤러를 제공합니다.
2. **dictionaryHasDefinition(forTerm:)**
    - 해당 단어에 대해 사전 정의가 있는지 확인합니다.
    - 정의가 없는 경우 사용자에게 적절한 메시지를 표시하거나 다른 처리를 할 수 있습니다.
3. **present(\_:animated:completion:)**
    - 사전 뷰 컨트롤러를 현재 화면에 표시합니다.

 

### **주의 사항**

- SwiftUI 프리뷰 및 시뮬레이터에선 사전 기능이 동작하지 않을 수 있습니다.
- iOS 내장 사전은 사용자가 설정에서 활성화한 언어에 따라 작동합니다. 예를 들어, 한국어 사전이 비활성화된 경우 한국어 단어의 정의가 제공되지 않을 수 있습니다.
- 정의가 없는 경우 추가적인 안내나 처리 로직을 구현하는 것이 좋습니다.

 

## **SwiftUI에서 구현방법**

SwiftUI에서 iOS 내장 사전을 여는 방법은 UIKit의 `UIReferenceLibraryViewController`를 SwiftUI 뷰에 통합하여 사용하면 됩니다. 이를 위해 `UIViewControllerRepresentable`을 활용합니다.

### **코드**

```swift
import SwiftUI

struct DictionaryRPView: UIViewControllerRepresentable {
  let term: String
  
  func makeUIViewController(context: Context) -> UIReferenceLibraryViewController {
    return UIReferenceLibraryViewController(term: term)
  }
  
  func updateUIViewController(_ uiViewController: UIReferenceLibraryViewController, context: Context) {
    // 업데이트 로직 없음
  }
}

struct DictionaryView: View {
  @State private var isShowingDictionary = false
  @State private var word = "language"
  
  var body: some View {
    VStack(spacing: 20) {
      Text("Tap the button to open the dictionary.")
        .padding()
      
      Button("Open Dictionary for \(word)") {
        if UIReferenceLibraryViewController.dictionaryHasDefinition(forTerm: word) {
          isShowingDictionary = true
        } else {
          print("No definition available for the word: \(word)")
        }
      }
      .padding()
    }
    .sheet(isPresented: $isShowingDictionary) {
      DictionaryRPView(term: word)
    }
  }
}

#Preview {
  DictionaryView()
}

```

 ![](/assets/img/wp-content/uploads/2024/12/IMG_4686.jpg)

 ![](/assets/img/wp-content/uploads/2024/12/IMG_4687.jpg)

### **설명**

1. **UIViewControllerRepresentable**
    - UIKit의 `UIReferenceLibraryViewController`를 SwiftUI에서 사용할 수 있도록 래핑합니다.
2. **UIReferenceLibraryViewController**
    - 단어에 대한 정의를 표시하는 UIKit의 기본 컨트롤러입니다.
    - `term`으로 전달된 단어의 정의를 표시합니다.
3. **dictionaryHasDefinition(forTerm:)**
    - 단어의 정의가 사전에 존재하는지 확인합니다.
    - 정의가 없으면 sheet를 띄우지 않고 적절히 처리할 수 있습니다.
4. **sheet**
    - SwiftUI에서 모달 형식으로 사전 뷰를 표시합니다.

 

<!--[rcblock id="6686"]-->
