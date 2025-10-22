---
title: "Transporter 앱을 사용하여 App Store Connect 바이너리 파일 업로드"
date: 2022-12-06
categories: 
  - "DevLog"
  - "CI/CD"
---

### **소개**

앱 스토어에 앱의 바이너리 파일 (ipa 등)을 업로드하고자 할 때 여러 방법이 있는데 이 중 Transporter 앱을 사용하는 방법을 소개하고자 합니다. Xcode에서도 바이너리 업로드 기능을 지원합니다만, 문제는 알 수 없는 버그가 너무 많고 앱 업로드 중 자주 먹통이 된다는 점입니다.

이럴 때 다른 대안 중 `Transporter`앱을 사용하면 해당 문제가 발생하지 않을 수 있습니다.

 

### **방법**

##### **1) 앱을 arm64용으로 Archive합니다.**

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.47.18.jpg)   ![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.52.55.jpg)

아카이브가 완료되면 `Organizer` 창이 표시됩니다.

 

##### **2) Distribute App 버튼을 클릭한 다음, Export를 진행합니다.**

업로드가 아님에 유의하세요.

 

\[caption id="attachment\_5099" align="alignnone" width="791"\]![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.51.38.jpg) Organizer 창에서 Distribute App 클릭\[/caption\]

 

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.52.00.jpg)

\[caption id="attachment\_5101" align="alignnone" width="473"\]![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.52.08.jpg) `Export` 선택\[/caption\]

 

파일을 생성할 위치를 지정한 뒤 작업이 완료되면 폴더 내에 `.ipa` 파일이 생깁니다.

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.52.55.jpg)

 

##### **3) 앱 스토어에서 Transporter를 설치합니다.**

- [Transporter 앱 스토어 링크](https://apps.apple.com/us/app/transporter/id1450874784?mt=12)

완료되면 앱을 열고 개발자 계정으로 로그인합니다.

 

##### **4) ipa 파일 추가 후 업로드합니다.**

`.ipa` 파일을 Transporter 창에 드래그 앤 드롭하면 목록에 추가됩니다. `업로드` 버튼을 눌러 업로드를 시작합니다.

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-5.23.41.jpg)

 

##### **5) 업로드가 완료될 때까지 기다린 뒤, 완료 메시지가 정상적으로 뜨는지 확인합니다.**

\[caption id="attachment\_5094" align="alignnone" width="952"\]![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-5.28.26.jpg) 업로드 중\[/caption\]

 

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-5.48.18.jpg)

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-5.48.30.jpg)

 

##### **6) 업로드 파일의 처리가 완료되면 앱 스토어 커넥트에서 빌드를 추가합니다.**

업로드 파일의 처리(processing)가 끝나면 메일로 알림이 옵니다.

![](./assets/img/wp-content/uploads/2022/12/IMG_E35A55586492-1.jpeg)

 

이후 앱 스토어 커넥트(App Store Connect) 페이지에 접속해서 빌드 등록을 완료합니다.

![](./assets/img/wp-content/uploads/2022/12/스크린샷-2022-12-06-오후-6.38.23.jpg)
