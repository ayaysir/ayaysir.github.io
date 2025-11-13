---
title: "WWDC 23 Swift Student Challenge 수상하였습니다. (Award Recipient)"
date: 2023-05-10
categories: 
  - "DevLog"
  - "diary.dev"
---

### **소개**

이번에 애플에서 주최한 [WWDC23 Swift Student Challenge](https://developer.apple.com/kr/wwdc23/swift-student-challenge/)(스위프트 스튜던트 챌린지)에 응모하였는데 운이 좋아서 수상하였습니다. 영어로 Award Recipient라고 나와있는데 비공식 용어로는 Winner로 일컫기도 합니다.

 ![](/assets/img/wp-content/uploads/2023/05/IMG_0523-e1683714538993.jpeg)

사실 작년까지는 이런 공모전이 있는지도 몰랐는데 올해 어떻게 정보를 알게되어 응모하게 되었습니다. Student Challenge에 대한 자세한 내용은 [https://developer.apple.com/kr/wwdc23/swift-student-challenge/](https://developer.apple.com/kr/wwdc23/swift-student-challenge/) 에서 볼 수 있습니다.

이름은 _**Interval Fairy**_라는 앱으로, 제작기간은 약 10일 정도였고, Swift Playgrounds App 기반으로 제작되었습니다. [AudioKit](http://yoonbumtae.com/?p=5358)이라는 외부 라이브러리가 사용되었습니다.

- 깃허브: [https://github.com/ayaysir/Interval-Fairy](https://github.com/ayaysir/Interval-Fairy)

이 앱은 음악 이론 중 음정(interval)을 다마고치 형식을 통해 쉽고 재밌게(?) 배우게 하고자 하는 목적으로 제작되었습니다.

> **우승작 앱에 대한 간단한 소개**
> 
> 음악 이론 중 음정(interval)을 다마고치 형식을 통해 쉽고 재밌게(?) 배우게 하고자 하는 목적으로 제작하였습니다. 음정에는 성질(quality)라는 요소가 있는데, 장, 단, 완전, 증, 감 등이라는 이름으로 불림. 음정을 이루는 음 두 개를 피아노 건반을 이용해 입력하면 이러한 성질을 토대로 캐릭터(요정)을 행복하게 하거나, 위생 또는 건강을 증진시키거나 포만감을 채우게 할 수 있습니다.
> 
> **앱의 타겟층은?** 이 앱은 음정을 조금이라도 쉽게 배우고 싶어하는 모든 사람들이 타깃입니다. 음정(Interval)은 음악 이론에서 가장 근본이 되는 토대로, 음정을 제대로 학습되어야 이후 과정이 진행될 수 있으나 음정의 개념이 워낙 복잡해서 학습이 어려워 음악 이론을 학습하고자 하는 사람들의 발목을 잡아왔습니다.

이하 자세한 내용은 생략하고 스크린샷 등으로 대체하겠습니다. 나중에 여유가 된다면 더 자세한 소개와 앱이 동작하는 유튜브 영상도 올리도록 하겠습니다.

{% youtube "https://www.youtube.com/watch?v=GmwB2KxOwjs" %}

다만 한 가지 굉장히 신경을 쓴 기능이 있는데 그것만 설명하자면 `View Detail` 페이지입니다. 어떠한 음정을 View Detail 버튼을 누르면 해당 음정이 어떤 과정으로 도출되는지에 대한 설명이 나오는데, 겉보기는 일반적인 보고서 형식이지만 실제로는 모든 음정의 경우에 대응하여 해당 음정에 맞는 설명이 문장 형식으로 나오도록 프로그래밍 하였습니다.

\[gallery link="none" columns="2" size="full" type="slideshow" ids="5651,5652,5653,5654"\]

 

#### **스크린샷**

\[gallery type="slideshow" columns="2" link="none" size="full" ids="5642,5643,5644,5645"\]

 

#### **튜토리얼/매뉴얼**

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-10-pm-6.44.04-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-10-pm-6.44.10-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-10-pm-6.44.14-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-10-pm-6.44.22-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-10-pm-6.44.28-copy.jpg)

 

#### **느낀점**

- 코드 퀄리티는 아주 좋을 필요는 없습니다.
    - 프로젝트 내부에 수준이 낮은 코드들이 일부 있었고
    - 하드코딩이 포함되어 있었으나 상관 없는것 같았습니다.
- 아이디어가 좀 더 중요하다고 느낌
    - 세상의 정의를 수호할 주제까지는 아니더라도 (환경 문제, 사회적 문제 등)
    - 누군가에게 도움이 될 만한 주제를 선정하는 것으로 충분하다고 생각합니다.
    - 그리고 주제가 앱으로 만들었을 때 의미가 있을 만한
- 디자인은 심미적으로 좋을 필요가 없으나, 기본적인 UI/UX 가이드 정도는 지키면 좋을 것 같음
    - 사실 캐릭터(요정)의 그림을 한 10장 이상 제가 직접 그려보려 했습니다만...
        - 작업을 진행하고 보니 그림 실력이 워낙 처참해서 원래 계획에서 한참 축소된 3장 정도만 사용되었고,
        - 그마저도 퀄리티가 도저히 납득이 안돼 1장은 AI 그림 그리기 서비스를 이용해 대체했습니다.
        - 이로 인해 상당히 의욕이 저하되어 후반부에 개발에 집중을 잘 못했습니다.
    - 나머지는 SwiftUI 또는 AudioKit에서 제공하는 기본 컴포넌트를 커스터마이징 없이 사용했습니다.
- 실수가 있어도 크리티컬하지는 않는 것 같습니다.
    - 저의 시간의 부족 등으로 일정 화면 크기의 아이패드 외에는 UI 반응성 대응이 전혀 안되어 있었고,
    - 앱 제출시에도 일부 정보를 착각해 잘못 입력했으나 그런 실수들은 영향이 없었습니다.
