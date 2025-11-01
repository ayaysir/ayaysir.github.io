---
title: "macOS 인텔리제이(IntelliJ) 커뮤니티 버전 설치 + 스프링 부트 프로젝트 생성"
date: 2020-06-26
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "intellij"
---

원래 인텔리제이 프로그램은 유료로 구독해야 하지만 커뮤니티 버전은 인텔리제이 정품의 일부 기능을 제거하고 무료로 제공합니다.

#### **인텔리제이 (IntelliJ) 커뮤니티 버전 설치**

1. 젯브레인 툴박스 설치 - [https://www.jetbrains.com/ko-kr/toolbox-app/](https://www.jetbrains.com/ko-kr/toolbox-app/)
2. 젯브레인 툴박스 실행 후 타이틀바에 있는 아이콘 클릭 후, 인텔리제이 커뮤니티 버전을 설치합니다.
    
     ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.33.45.png)
3. 테마 선택 등 초기 설정을 진행합니다.  ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.41.05.png)

#### **스프링부트 프로젝트 만들기 (인텔리제이 커뮤니티 버전)**

1. **spring initializr** ([https://start.springboot.io/](https://start.springboot.io/)) 사이트에 접속해서 새로운 스트링 부트 프로젝트 생성 후 zip 파일을 다운로드합니다.
    
    \[caption id="attachment\_2523" align="alignnone" width="680"\] ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.47.20.png) artifact를 수정하면 다른 부분도 자동으로 수정이 됨\[/caption\]
    
     
2.   압축 파일을 푼 디렉토리를 `Open or Import`로 열기한 후, 다운로드 및 빌드가 완료될 때까지 대기합니다.  ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.49.01.png)  ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.51.39.png)  ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.57.37.png)
3. 스프링 부트 프로젝트의 메인 애플리케이션 오른쪽 클릭한 후 `Run...`  을 클릭합니다. `Run...`부분이 나타나지 않은 경우 `Build Module...` 를 먼저 클릭하면 나옵니다.
    
     ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-7.59.56.png)
4. 테스트 주소 페이지(`localhost:8080`)에 접속해서 정상 동작하는지 확인합니다.  ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-8.04.43.png)  ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-26-오후-8.04.56.png)
