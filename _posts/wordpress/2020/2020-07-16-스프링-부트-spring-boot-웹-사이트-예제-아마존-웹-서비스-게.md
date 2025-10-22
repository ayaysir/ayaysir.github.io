---
title: "스프링 부트 웹 사이트 예제: 아마존 웹 서비스 게시판 (Spring Boot + JPA + AWS + Travis CI)"
date: 2020-07-16
categories: 
  - "DevLog"
  - "포트폴리오"
---

\[rcblock id="2655"\]

#### **개요**

이 예제는 예전에 만들었던 [Spring Boot 예제: 초간단 게시판](http://yoonbumtae.com/?p=1853) 과 비슷한 예제인데, 이클립스 대신 인텔리제이 커뮤니티 버전을 바탕으로 이전에 사용하지 않았던 JUnit 단위 테스트, JPA, Lombok 등을 사용하였고, 아마존 웹 서비스와 Travis CI라는 자동 배포 서비스를 이용해 외부 인터넷 상에서 접속할 수 있도록 하였습니다.

과정의 대부분은 [스프링 부트와 AWS로 혼자 구현하는 웹 서비스](https://github.com/jojoldu/freelec-springboot2-webservice) (이동욱 저)를 참조하였고, 스프링, Gradle 버전은 책에서 설명한 버전보다 최신 버전을 적용하였습니다.

OAuth 2.0을 적용해 게시판은 구글 로그인과 네이버 아이디로 로그인 API를 사용하며, 로그인한 사람만 이용할 수 있습니다. 게시판 특징은 다음과 같습니다.

- 로그인이 되어있지 않다면 게시판의 글 목록만 보여주고, 내용은 볼 수 없게 한다.
- 게시글의 수정, 삭제 기능은 해당 글을 작성한 사용자만 접근할 수 있도록 한다.

 

#### **제작 시기**

2020.7.11 ~ 2020.7.16

 

#### **프로젝트 구조**

![](./assets/img/wp-content/uploads/2020/07/-2020-07-16-오후-6.26.16-e1594891697165.png)

![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.27.11.png)

 

#### **코드 저장소 (GitHub)**

[https://github.com/ayaysir/awsboard](https://github.com/ayaysir/awsboard)

 

#### **접속 주소**

http://awsboard.yoonbumtae.com:9090/

사이트는 AWS 프리티어 기간이 지나 폐쇄했습니다.

아래 유튜브 영상으로 서비스 당시 모습을 볼 수 있습니다.

https://www.youtube.com/watch?v=CYBIZrykaro

 

#### **동작 내용**

\[caption id="attachment\_3970" align="alignnone" width="2560"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2021-08-29-오후-7.26.37-scaled.jpg) 메인 화면\[/caption\]

 

\[caption id="attachment\_2694" align="alignnone" width="2528"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.39.10.png) 구글 계정으로 로그인한 경우 (초기 디자인)\[/caption\]

 

\[caption id="attachment\_2695" align="alignnone" width="2528"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.40.08.png) 글쓰기 화면\[/caption\]

 

\[caption id="attachment\_2696" align="alignnone" width="2528"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.40.49.png) 새로운 글 목록 출력\[/caption\]

 

\[caption id="attachment\_2697" align="alignnone" width="2528"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.41.28.png) 새로운 글 읽기 페이지, 내가 쓴 글인 경우 \[수정\], \[삭제\] 버튼 표시됨\[/caption\]

\[caption id="attachment\_2698" align="alignnone" width="2528"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.42.41.png) 내가 쓴 글이 아닌 경우, 글 읽기만 가능하고 수정, 삭제 버튼은 활성화되지 않음\[/caption\]

 

\[caption id="attachment\_2699" align="alignnone" width="2440"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2020-07-16-오후-6.43.43.png) 네이버로 로그인한 경우\[/caption\]

 

\[caption id="attachment\_3971" align="alignnone" width="2560"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2021-08-29-오후-7.26.49-scaled.jpg) 웹 페이지 주소를 적으면 자동으로 링크를 걸어주는 기능\[/caption\]

 

\[caption id="attachment\_3972" align="alignnone" width="2560"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2021-08-29-오후-7.26.57-scaled.jpg) 공지사항\[/caption\]

 

\[caption id="attachment\_3973" align="alignnone" width="2560"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2021-08-29-오후-7.27.19-scaled.jpg) 유튜브 주소를 적으면 자동으로 플레이어를 embed 하는 기능\[/caption\]

 

\[caption id="attachment\_3974" align="alignnone" width="2560"\]![](./assets/img/wp-content/uploads/2020/07/스크린샷-2021-08-29-오후-7.28.01-scaled.jpg) 페이지 내비게이션 기능\[/caption\]
