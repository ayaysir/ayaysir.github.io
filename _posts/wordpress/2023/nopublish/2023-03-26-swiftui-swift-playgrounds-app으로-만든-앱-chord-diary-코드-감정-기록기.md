---
published: false
title: "SwiftUI (Swift Playgrounds App)으로 만든 앱: Chord Diary (코드 감정 기록기)"
date: 2023-03-26
categories: 
  - "DevLog"
  - "포트폴리오"
---

#### **개요**

음악 코드(화음)으로 현재의 감정을 기록해 보세요. 글을 등록하면 코드 음을 재생할 수 있고 해당 코드에 대한 정보도 볼 수 있습니다. ([scales-chords.com](https://www.scales-chords.com/) 사이트 이용)

 

#### **목적**

- SwiftUI의 기초 학습 및 상태 관리 학습 목적으로 만들었습니다.

 

#### **사용 기술**

- SwiftUI
    - 부분적으로 UIKit 도입 (Representable 사용)
- Swift Playgrounds App

 

#### **특징**

- `UserDefaults`를 통해 데이터를 저장 및 관리합니다.
- 기초 _**CRUD**_(Create, Retrieve/Read, Update, Delete)가 구현되어 있습니다.
- `UIKit`의 `WKWebView`와 연결되어 있어 특정 정보(코드명)을 입력하면 해당 정보와 관련된 웹 페이지를 보여줍니다.

 

#### **한계**

- 별도의 문서나 강의를 참고한 것이 아니라 구글링만으로 각종 코드를 조합해 만들었습니다.
    - SwfitUI에 대한 이해도가 낮은 상태에서 제작했기 때문에 퀄리티가 낮은 코드가 일부 존재합니다.
    - 공인된 문서를 참조해 다시 학습할 계획입니다.
- 부분적으로 뷰 모델(View Model)이 도입되긴 하였지만 널리 인정된 정형화된 상태관리 패턴을 사용하였다고 보기는 어렵습니다.

 

#### **저장소**

- [https://github.com/ayaysir/Story-One.swiftpm](https://github.com/ayaysir/Story-One.swiftpm)

 

#### **프로젝트 구조**

 ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-27-am-1.34.16-copy.jpg)

- **주요 코드**는 `Chord_Todo` 폴더 내에 있습니다.
    - `MainView`: 각종 뷰가 조합된 메인 화면
    - `HeaderView`: 헤더 부분
    - `ListView`: 글 목록을 보여주는 부분
    - `BodyView`: 글 제목을 클릭하면 해당 정보를 보여주는 화면
    - `WriteView`: 글 등록/업데이트 폼 화면
- **`WebView`**: `UIViewRepresentable`로 `UIKit`의 웹뷰(`WKWebView`)를 래핑해 보여주는 뷰 및 코디네이터(`Coordinator`)

> _**참고)** SwiftUI에는 자체 웹 뷰가 없어서 위와 같이 `UIViewRepresentable`를 사용해 간접적으로 추가해야 합니다._
> 
> _(저는 이러한 충격적인 사실을 접하고 SwiftUI는 10년이 지나도 UIKit을 대체할 수 없다고 확신하게 되었습니다.)_

 

#### **스크린샷**

CRUD의 모든 과정은 `UserDefaults`를 사용해 관리되며 실제로 동작합니다..

 

##### **Create**

\[gallery link="none" size="full" ids="5400,5401,5402"\]

 

##### **Read**

 ![](/assets/img/wp-content/uploads/2023/03/Simulator-Screen-Shot-iPhone-14-2023-03-27-at-02.08.38-copy.jpg)

{% youtube "https://www.youtube.com/watch?v=mutCONP3c0Q" %}

- 제목, 코드, 코멘트가 표시됩니다.
- 플레이 버튼을 누르면 `코드`에 해당하는 음을 재생할 수 있고, 해당 코드와 관련된 인터넷 페이지를 보여줍니다.
    - 웹뷰와 연결하여 표시

 

#### **Update**

\[gallery size="full" link="none" ids="5406,5405,5404"\]

- 재목이 `Reflux`인 글의 내용을 업데이트
    - 코드를 `Em`에서 `Em6`으로 변경
    - 코멘트를 `Aaaa...` 에서 `Bbbb...`로 변경
- 업데이트는 메인 화면 뿐만 아니라 `BodyView` 내에서도 가능

 

#### **Delete**

\[gallery columns="2" link="none" size="full" ids="5407,5408"\]

- 삭제(Delete)는 메인 화면 뿐만 아니라 `BodyView` 내에서도 가능
