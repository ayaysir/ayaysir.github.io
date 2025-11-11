---
published: false
title: "SwiftUI: 스크롤 뷰(Scroll View)를 밑에서 위로 스크롤하는 방법"
date: 2024-08-08
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

iOS의 기본 앱인 사진 앱은 사진 목록의 스크롤 뷰가 밑에서 위로 진행됩니다.

<iframe width="262" height="480" src="https://giphy.com/embed/UnmmDE6LwENNDGMhpR" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

SwiftUI에서 스크롤 뷰를 밑에서 위로 스크롤하는 것은 여러 가지 방법으로 구현할 수 있습니다. 이 글에서는 iOS 14부터 사용할 수 있는 방법과 iOS 17 이상에서만 사용할 수 있는 방법을 소개합니다.

 

#### **전체 코드 개요**

이 코드에서는 `TabView`를 사용하여 iOS 버전에 따라 다른 스크롤 뷰를 제공합니다. iOS 14부터 iOS 16까지는 `ScrollFromBottomToTop_iOS14_View`를 사용하고, iOS 17 이상에서는 `ScrollFromBottomToTop_iOS17_View`를 사용합니다.

 

#### **iOS 17 이상: `defaultScrollAnchor` 활용**

iOS 17에서는 새로운 `defaultScrollAnchor` modifier를 사용하여 간단하게 스크롤 뷰의 기본 위치를 설정할 수 있습니다. 이 방법은 훨씬 간단하고 직관적입니다.

https://gist.github.com/ayaysir/598e91d40fef24156a2a65e7350e0968

##### **코드 설명**

- `defaultScrollAnchor`: 이 modifier는 스크롤 뷰가 처음 로드될 때 어떤 위치에서 스크롤을 시작할지를 지정합니다. `.bottom`을 설정함으로써 뷰가 처음에 화면의 아래쪽에 고정된 상태에서 시작되며, 위로 스크롤이 가능합니다.
- 참고: [LazyVStack](https://developer.apple.com/documentation/swiftui/lazyvstack)

<iframe width="392" height="480" src="https://giphy.com/embed/qUuOdkBXj2rNB5hXKi" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

#### **iOS 14 이상 호환: 역순 리스트와 회전**

iOS 14부터 iOS 16까지는 스크롤 뷰를 밑에서 위로 스크롤하는 것이 기본적으로 지원되지 않습니다. 이를 구현하기 위해 리스트의 순서를 뒤집고, 스크롤 뷰 자체와 리스트의 각 요소를 180도로 회전시킵니다.

https://gist.github.com/ayaysir/24984c1897b66e7b2ee1610aae15ab1c

##### **코드 설명**

- **리스트 역순 처리**: `Array(1...100).reversed()`로 리스트를 역순으로 만듭니다. 이 리스트는 실제로 밑에서부터 위로 올라가면서 그려집니다.
- **요소 회전**: 각 요소(`ForEach` 내부에서 `rotationEffect(.degrees(180))`를 사용해 180도로 회전)와 스크롤 뷰 자체(`ScrollView`에서 `rotationEffect(.degrees(180))` 적용)를 모두 회전시킵니다. 이 방식으로 리스트를 역순으로 처리하면서도 화면에는 정상적으로 보이게 됩니다.

<iframe width="392" height="480" src="https://giphy.com/embed/nwIZuVqQhf4IkM9o7b" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

스크롤바가 오른쪽에 위치하도록 변경

위의 코드는 스크롤바 (Scroll Indicator)도 같이 회전하므로 왼쪽에 위치하게 됩니다. 스크롤바를 오른쪽으로 변경하려면 다음과 같이 rotation3DEffect를 사용합니다.

https://gist.github.com/ayaysir/1dd7f9192c265e5ec63b1d1c50f87544

 

 ![](/assets/img/wp-content/uploads/2024/08/스크린샷-2024-08-11-오후-4.57.40.jpg)

 

#### **결론**

이 포스트에서는 SwiftUI에서 스크롤 뷰를 밑에서 위로 스크롤하는 두 가지 방법을 살펴보았습니다. iOS 14부터 iOS 16까지는 리스트를 역순으로 처리하고 뷰를 회전시키는 방법을 사용해야 하며, iOS 17 이상에서는 간단히 `defaultScrollAnchor` modifier를 사용하면 됩니다. 이 두 가지 방법을 적절히 사용하여 사용자 경험을 향상시킬 수 있습니다.

<!--[rcblock id="6686"]-->
