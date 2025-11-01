---
title: "Logic Pro X: MIDI 리전(region)의 위치는 그대로 놔둔 상태에서 템포만 바꾸기"
date: 2024-07-13
categories: 
  - "StudyLog"
  - "Logic Pro"
---

#### **소개**

원래 음악의 템포(BPM)가 73인 곡이 있는데 파일 오류로 미디 데이터상의 BPM은 25인 미디 파일이 있습니다.

 ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.29.23.jpg)

그래서 템포를 원래 템포인 73으로로 정정하고 싶은데 이 상태에서 BPM을 73로 변경하면 미디의 상대 템포에 맞춰 미디 이벤트의 속도도 같이 빨라집니다.

\[caption id="attachment\_6632" align="alignnone" width="312"\] ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.30.50.jpg) 원래 길이 (BPM 25인 상태에서)\[/caption\]

\[caption id="attachment\_6633" align="alignnone" width="312"\] ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.31.02.jpg) BPM 75로 변경시 미디 이벤트 위치도 같이 바뀌므로 17초가 됨\[/caption\]

 

이 케이스에서는 음악의 속도를 바꾸고 싶은 것이 아니라 음들의 위치는 그대로인 상태에서 잘못된 미디 데이터(템포)만 고치고 싶으므로 위는 원하는 결과가 아닙니다.

미디 이벤트 시간은 그대로 놔두고(=>절대적 위치로 바꾸고) 템포만 변경하는 방법은 다음과 같습니다.

 

#### **방법**

##### **Step 1: 메인 화면에서 미디 트랙의 전체 리전(region)을 선택한 후 피아노 롤 에디터를 엽니다. (더블 클릭)**

 ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.32.39.jpg)

 

 ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.32.46.jpg)

 

##### **Step 2: `command + a`를 눌러 전체 노트를 선택합니다.**

 ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.32.53.jpg)

 

##### **Step 3: 피아노 롤 에디터의 상단 `[기능]` 메뉴에서 `[SMPTE 위치 잠금`\]을 선택합니다. 단축키는 `command + 아래화살표(↓)` 입니다.**

 ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.32.58.jpg)

이벤트들을 다시 상대적 위치로 변경하고 싶은 경우 `[SMPTE 위치 잠금 해제]`를 선택합니다. 단축키는 `command + 위화살표(↑)`입니다.

만약 위 기능이 활성화되지 않은 경우, 아래 메뉴를 통해 고급 기능을 활성화합니다.

- 보호 및 보호 해제 기능은 `Logic Pro > 설정 > 고급`에서 `컴플리트 기능 활성화`가 선택된 경우에 사용할 수 있습니다.

 

> **SMPTE 위치란?**
> 
> [SMPTE](https://ko.wikipedia.org/wiki/SMPTE)는 영화ㆍ텔레비전 기술자 협회(Society of Motion Picture and Television Engineers, SMPTE)의 약자로 1916년 미국에서 영화 산업에 종사하는 기술인들이 주축이 되어 설립한 국제 전문가 단체입니다. SMPTE는 국제적으로 저명한 표준화 기구로 600개 이상의 표준을 가지고 있습니다. SMPTE 위치란 이 단체에서 규정한 시간 및 미디어 위치 정보의 표준입니다.

 

##### **Step 4: 메인 화면 트랙의 리전 길이를 조절합니다.**

 ![](/assets/img/wp-content/uploads/2024/07/스크린샷-2024-07-14-오전-12.35.31.jpg)

BPM이 25에서 73으로 변경된 경우 그만큼 각 노트의 길이도 증가했을 것이므로 마디수는 늘어납니다. 해당 마디수에 맞게 리전 길이를 조절합니다.

 

#### **참고**

- [https://support.apple.com/ko-kr/guide/logicpro/lgcp21581f00/mac](https://support.apple.com/ko-kr/guide/logicpro/lgcp21581f00/mac)
