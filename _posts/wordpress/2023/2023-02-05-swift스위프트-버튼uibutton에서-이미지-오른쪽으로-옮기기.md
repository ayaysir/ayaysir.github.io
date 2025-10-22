---
title: "Swift(스위프트): 버튼(UIButton)에서 이미지 오른쪽으로 옮기기 / 이미지와 레이블 간 간격 띄우기 (스토리보드)"
date: 2023-02-05
categories: 
  - "DevLog"
  - "Swift UIKit"
---

### **소개**

인터페이스 빌더 (Interface Builder)에서 GUI 방식으로 버튼(`UIButton`)에서 레이블(텍스트) 옆에 이미지를 추가하고, 이미지의 위치를 왼쪽 또는 오른쪽으로 이동시키며, 마지막으로 이미지와 텍스트 간 간격을 띄우는 방법에 대해 알아보겠습니다.

\[caption id="attachment\_5279" align="alignnone" width="477"\]![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-05-오후-10.19.53.jpg) 이미지가 부착된 `Prev`, `Next` 버튼\[/caption\]

 

#### **버튼에 이미지 아이콘 추가하기**

![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-05-오후-10.20.03.jpg)

1. 버튼을 뷰 컨트롤러에 추가합니다.
2. 버튼을 클릭한 뒤 오른쪽에 있는 설정 패널에서 `Show Attribute Inspector` 아이콘을 클릭해 Attribute Inspector를 엽니다.
3. 버튼의 `Style`을 `Default`로 설정합니다.
4. `Image` 선택 상자에서 사용하고자 하는 시스템 이미지를 추가합니다.

 

#### **버튼의 이미지를 왼쪽 또는 오른쪽으로 이동**

`Prev` 버튼은 이미지가 왼쪽에 있고, `Next` 버튼은 오른쪽에 있습니다.

![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-05-오후-10.19.01.jpg)

1. 버튼을 클릭한 뒤 Attribute Inspector에서 `View` 섹션으로 이동합니다.
2. `Semantic` 선택 상자에서 다음 두 옵션 중 하나를 선택합니다.
    - `Force Left-to-Right`: 이미지가 왼쪽에 위치합니다. 기본값(Unspecified)과 같습니다.
    - `Force Right-to-Left`: 이미지가 오른쪽에 위치합니다. 레이블은 기존 순서(왼쪽에서 오른쪽)으로 유지되고, 이미지 아이콘 위치만 이동합니다.

 

#### **버튼에서 이미지와 레이블 사이의 간격 띄우기**

간격을 설정하지 않은 것과 설정한 것의 차이를 아래 스크린샷을 보고 비교해보세요.

\[caption id="attachment\_5283" align="alignnone" width="190"\]![](./assets/img/wp-content/uploads/2023/02/-2023-02-05-오후-10.28.31-e1675603845762.png) 간격 없음\[/caption\]

\[caption id="attachment\_5282" align="alignnone" width="195"\]![](./assets/img/wp-content/uploads/2023/02/-2023-02-05-오후-10.28.36-e1675603867549.png) 간격 있음 `(Title Insets, Left: 10)`\[/caption\]

 

인터페이스 빌더 상에서 조절하는 방법은 다음과 같습니다.

1. 오른쪽 설정 패널에서 `Show the Size Inspector` 버튼을 클릭합니다.
2. `Title Insets` 부분을 찾습니다
    - 이미지가 왼쪽에 있는 경우: `Left`에 간격 값을 입력합니다.
    - 이미지가 오른쪽에 있는 경우: `Right`에 간격 값을 입력합니다.

![](./assets/img/wp-content/uploads/2023/02/스크린샷-2023-02-05-오후-10.33.55.jpg)

iOS 프로그래밍 스위프트 Swift 버튼 이미지 간격 스페이스 아이오에스 macOS 아이폰 아이패드 Xcode 엑스코드 이미지 버튼 간격
