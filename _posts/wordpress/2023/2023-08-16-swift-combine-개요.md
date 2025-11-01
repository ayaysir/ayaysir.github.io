---
title: "Swift: Combine 개요"
date: 2023-08-16
categories: 
  - "DevLog"
  - "Swift"
---

### **개요**

Combine 프레임워크는 시간 경과에 따라 값을 처리하기 위한 선언적(declarative)인 명령을 제공하는 Swift의 API입니다. 이러한 값은 다양한 종류의 비동기 이벤트(asynchronous event)를 나타낼 수 있습니다.

 

#### **Publisher와 Subscriber**

- **Publisher**(공표자, 게시자): 시간이 지남에 따라 일련의 값을 전달할 수 있는 타입이라는 것을 선언하는 프로토콜
    - **operator**: 상류에서 흐르는 퍼블리셔(upstream publisher)로부터 받은 값으로 특정 작업을을 하거나 re-publish 할 수 있도록 함
- **Subscriber**(동의자, 구독자): 퍼블리셔의 체인의 끝에서 요소를 받았을 때 작업을 수행할 수 있도록 함
    - 퍼블리셔는 서브스크라이버가 요청했을 때에만 값들을 방출(emit) -> 이벤트 흐름 속도 제어

 

#### **Publisher의 결합(combine) 기능**

- 여러 퍼블리셔들이 출력하는 결과들을 결합하여 앱과 상호작용할 수 있음

 

#### **Combine 채택의 의의**

- 중첩 클로저(nested closure), 콜백을 제거
- 이벤트 처리 코드의 중앙화
- 코드를 읽기 쉽고 유지보수가 간편

 

#### **Combine으로 이벤트 수신 및 처리**

비동기 소스에서 이벤트를 커스터마이즈 및 수신합니다.

- 대리자, 완료 핸들러 콜백 대신 이벤트 소스에 대한 단일 체인을 생성

 

##### **예제 1: 텍스트 필드가 있으며 그것을 변경하면 테이블 뷰 또는 컬렉션 뷰의 내용이 실시간으로 변경되어야 하는 앱**

Xcode에서 `File -> New... -> Playgorund... -> MacOS -> Single App`으로 플레이그라운드를 생성한 뒤,

메인 뷰(`MyView`)에 텍스트 필드(`NSTextField`)를 추가합니다.

 ![](/assets/img/wp-content/uploads/2023/08/스크린샷-2023-08-16-오후-9.41.09-복사본.jpg)

```
//: A Cocoa based Playground to present user interface

import AppKit
import PlaygroundSupport

class MyViewModel {
    var filterString: String = ""
}

let nibFile = NSNib.Name("MyView")
var topLevelObjects: NSArray?

Bundle.main.loadNibNamed(nibFile, owner:nil, topLevelObjects: &topLevelObjects)
let views = (topLevelObjects as! Array<Any>).filter { $0 is NSView }
let rootView = views[0] as! NSView
let filterField = rootView.subviews[1] as? NSTextField

// Present the view in Playground
PlaygroundPage.current.liveView = rootView
var viewModel = MyViewModel()

// 1. Sink
let pubAndSub = NotificationCenter.default
    // 퍼블리셔 생성
    .publisher(for: NSControl.textDidChangeNotification, object: filterField)
    // 텍스트값 추출
    .map({ ($0.object as! NSTextField).stringValue })
    // receiveValue: executes when it receives an element from the publisher.
    .sink(receiveCompletion: { print($0) },
          receiveValue: { print($0) })

// 2. Assign
let pubAndSubAssign = NotificationCenter.default
    .publisher(for: NSControl.textDidChangeNotification, object: filterField)
    .map({ ($0.object as! NSTextField).stringValue })
    // 숫자, 알파벳만 필터링
    .filter( { $0.unicodeScalars.allSatisfy({CharacterSet.alphanumerics.contains($0)}) } )
    .map({ "Assgined: " + $0 })
    // Debounce
    .debounce(for: .milliseconds(500), scheduler: RunLoop.main)
    // Specifies the scheduler on which to receive elements from the publisher.
    .receive(on: RunLoop.main)
    // Assigns each element from a publisher to a property on an object.
    .assign(to: \MyViewModel.filterString, on: viewModel)

let assignReceive = NotificationCenter.default
    .publisher(for: NSControl.textDidChangeNotification, object: filterField)
    .sink(receiveValue: { _ in print(viewModel.filterString) })

// // Cancel Publishing when Desired
// sub?.cancel()

```

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2RrNnQyN3c3MW8xZ2F4MDlscTZsMXBoaWlvZnZhZnJhZzFvejUzYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TqZVc1PEf4888y0eMR/giphy.gif)

 

\[rcblock id="5348"\]
