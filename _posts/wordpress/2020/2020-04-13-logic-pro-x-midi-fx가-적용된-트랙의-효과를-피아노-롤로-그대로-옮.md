---
title: "Logic Pro X: MIDI FX가 적용된 트랙의 효과를 피아노 롤로 그대로 옮기기(복사하기) - IAC 드라이버 이용"
date: 2020-04-13
categories: 
  - "StudyLog"
  - "Logic Pro"
tags: 
  - "logic-pro-x"
---

 

https://www.youtube.com/watch?v=-JOZCITL-Og

참고 동영상 (영어)

 

아래의 단순한 코드에 MIDI FX를 적용하면 아래 피아노 롤에 나와있는 내용과는 다른 음이 들립니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.12.42.png)

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.16.51.png)

이것을 들리는 그대로 피아노 롤로 옮겨서 작업을 하고 싶을 때가 있습니다. MIDI FX가 적용되고 나서 실제 재생되는 음은 아래와 같습니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.21.02.png)

방법은 다음과 같습니다.

 

##### 1\. 먼저 Finder에서 \[응용 프로그램\] > \[기타\] (런치패드에도 있습니다.) 폴더로 들어가면 \[오디오 MIDI 설정\] 이라는 프로그램이 있습니다. 이것을 실행합니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.23.34.png)

 

##### 2\. 프로그램을 실행하면 맨 위에 \[윈도우\] > \[MIDI 스튜디오 보기\] 라는 메뉴를 실행합니다. (단축키: `command + 2`)

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.25.47.png)

 

##### 3\. 미디 스튜디오 메뉴를 열면 \[IAC 드라이버\]라는 네모 상자가 있습니다. 이것을 더블 클릭합니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.29.11.png)

 

##### 4\. 여기서 \[기기가 온라인 상태임\] 체크박스에 체크합니다. 사양이 낮은 컴퓨터에서는 성능 저하가 발생할 수 있으므로 필요할 때에만 사용하는 것이 좋습니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.30.32.png)

 

##### 5\. 로직으로 돌아온 다음 원래 트랙을 \[New Track with Duplicate Settings\] 기능을 이용해 복사합니다. (단축키 `command + D`)

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.33.27.png)

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.35.51.png)

 

##### 6\. 원본 트랙을 클릭한 상태에서 왼쪽의 인스펙터(Inspector) 창을 보면 가상악기를 설정하는 부분이 있는데 (주황색 박스) 이 부분을 클릭하고 악기를 \[Utility\] > \[External Instrument(Stereo)\]  로 변경합니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.39.31.png)

 

##### 7\. External Instrument 설정창에서 \[MIDI Destination\]을 온라인 상태인 \[IAC 드라이버 버스\]로 변경합니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.45.22.png)

 

##### 8\. 복사된 트랙을 선택하고 레코딩 기능(단축키 R)을 실행합니다. MIDI FX가 적용된 상태로 레코딩이 되는 것을 볼 수 있습니다.

\[caption id="attachment\_2286" align="alignnone" width="2784"\]![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.48.47.png) MIDI FX가 적용된 음들이 실시간으로 레코딩되는 중입니다.\[/caption\]

 

##### 9\. 레코딩이 완료되면 원본 트랙은 뮤트하거나 삭제합니다. 트랙을 삭제하지 않으면 추후 문제가 될 수 있으므로 가상악기 부분을 꺼두시거나 MIDI Destination을 리셋하는 것이 좋습니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-13-오후-1.52.36.png)
