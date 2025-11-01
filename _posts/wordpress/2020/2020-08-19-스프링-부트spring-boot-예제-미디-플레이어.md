---
title: "스프링 부트(Spring Boot) 예제: 미디 플레이어"
date: 2020-08-19
categories: 
  - "DevLog"
  - "포트폴리오"
---

MIDI란 컴퓨터 음악을 위한 규격화된 포맷으로 미디 표준을 지켜 만든 음악 파일들은 미디 플레이어 등에서 실행할 수 있으며 오늘날 음악 제작에서 필수적으로 사용되고 있습니다. [자세한 내용](https://thewiki.kr/w/MIDI)

미디 플레이어는 자신이 가진 미디 파일을 인터넷상에 업로드하고 어디서나 재생할 수 있는 웹사이트입니다. AWS를 이용해 인터넷상에서 접근 가능하도록 했습니다.

 

#### **개발 일지**

- [스프링 부트(Spring Boot) 미디 플레이어 만들기 (1): Timidity++, LAME을 이용해 미디(midi) 파일을 mp3로 변환하는 메소드 만들기](http://yoonbumtae.com/?p=2819)
- [스프링 부트(Spring Boot) 미디 플레이어 만들기 (2): 업로드 페이지, 임시 재생 플레이어 만들기](http://yoonbumtae.com/?p=2878)
- [스프링 부트(Spring Boot) 미디 플레이어 만들기 (3): 다음 곡 연속 재생 기능 - 미디 정보 업데이트 및 삭제](http://yoonbumtae.com/?p=2900)

 

#### **웹사이트 주소**

http://awsboard.yoonbumtae.com:9090/midi

사이트는 AWS 프리티어 기간이 만료되어 폐쇄했습니다. 영상 기록으로 대신 확인 가능합니다.

https://www.youtube.com/watch?v=ZqUtpc7yEYQ

 

#### **깃허브 주소**

[https://github.com/ayaysir/awsboard](https://github.com/ayaysir/awsboard)

 

 

#### **사용 기술** 

 ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-19-오후-5.47.28.png)

 

#### **주요 기능**

- 파일 업로드: 미디 파일을 업로드하면 Timidity++, LAME 인코더를 Shell Script로 작성된 스크립트를 이용해 실행하여 mp3 파일로 변환합니다. 업로드는 홈페이지 회원만 할 수 있습니다. 일반 회원은 한 번에 5개까지 업로드, 운영자는 무제한 업로드 가능합니다.
- 재생, 일시정지, 멈춤 기능: 업로드되어 변환된 음악을 재생할 수 있습니다.
- 자동 다음곡 재생 기능: 음악이 끝나면 바로 다음 곡을 재생합니다.
- 현재 재생 곡 정보 표시 기능: 현재 재생되고 있는 곡의 정보를 표시합니다.
- 파일 정보 업데이트 기능: 이미 업로드된 파일의 제목 정보를 변경할 수 있습니다. 회원은 자신이 업로드한 파일만 접근 가능하고, 운영자는 모든 파일에 접근 가능합니다.
- 파일 삭제 기능: 업로드한 파일을 삭제할 수 있습니다. 회원은 자신이 업로드한 파일만 삭제 가능하고, 운영자는 모든 파일을 삭제 가능합니다. 기존에 업로드된 미디 파일과 변환된 mp3 파일은 별도 공간으로 격리됩니다.
- 모바일 디바이스에서 재생됨: 노래는 스마트폰 등에서도 정상 재생되며 모든 기능이 동작합니다. 백그라운드 재생도 가능합나다. 그 외에 \[홈 화면 추가\] 기능을 구현해 바탕화면에 앱 아이콘 형태로 설치해 사용할 수 있습니다.

 

#### **앞으로 구현할 기능**

- 검색, 정렬 및 필터링 기능: 파일 목록에 대한 검색, 정렬 및 필터링 기능을 구현할 예정입니다.
- 개인별 플레이리스트: 회원 개인별 플레이리스트를 생성/업데이트/삭제할 수 있는 기능을 구현할 예정입니다.

 

#### **스크린샷**

\[caption id="attachment\_2934" align="alignnone" width="2784"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-19-오후-5.50.41.png) 메인 화면\[/caption\]

\[caption id="attachment\_3963" align="alignnone" width="2560"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2021-08-29-오후-7.29.59-scaled.jpg) 새로운 디자인 적용\[/caption\]

 

\[caption id="attachment\_2937" align="alignnone" width="2784"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-19-오후-5.56.38.png) 파일 업로드 화면\[/caption\]

 

\[caption id="attachment\_2936" align="alignnone" width="2784"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-19-오후-5.53.50.png) 정보 업데이트 화면\[/caption\]

 

\[caption id="attachment\_2938" align="alignnone" width="422"\] ![](/assets/img/wp-content/uploads/2020/08/IMG_11462A79DFCE-1.jpeg) 스마트폰에서의 메인 화면\[/caption\]

 

\[caption id="attachment\_3964" align="alignnone" width="2560"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2021-08-29-오후-7.30.24-scaled.jpg) 검색 기능\[/caption\]

 

 

\[caption id="attachment\_3965" align="alignnone" width="2560"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2021-08-29-오후-7.30.33-scaled.jpg) 퍼가기 기능\[/caption\]

 

 

\[caption id="attachment\_3966" align="alignnone" width="470"\] ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2021-08-29-오후-7.32.10.jpg) 퍼가기 기능으로 블로그, 게시판 등에 플레이어 붙여넣기\[/caption\]
