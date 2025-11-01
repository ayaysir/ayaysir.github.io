---
title: "Spring Boot 예제: 초간단 게시판"
date: 2019-11-28
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring"
  - "spring-boot"
---

이 예제에는 스프링 시큐리티를 사용하였습니다. 시큐리티와 관련된 내용은  [스프링 시큐리티 관련 글](http://yoonbumtae.com/?tag=스프링시큐리티)을 참고하세요.

 

#### **개요**

Spring Boot의 기본 기능(Thymeleaf, 시큐리티 포함)을 이용해서 전통적 형태의 웹 게시판을 만들었습니다. 게시판은 웹 프로그래밍에 있어서 필수라고 볼 수 있는 **CRUD**(Create, Read, Update, Delete)를 연습하기에 적당한 예제입니다.

이 게시판은 로그인 환경을 가정하여 만들었습니다. 로그인 관련 부분은 시큐리티에서 다룹니다. 이로 인한 게시판의 추가 요구사항은 다음과 같습니다.

- 로그인이 되어있지 않다면 게시판의 글 목록만 보여주고, 내용은 볼 수 없게 한다.
- 게시글의 수정, 삭제 기능은 해당 글을 작성한 사용자만 접근할 수 있도록 한다.

이 예제에서는 스프링 부트의 내용을 연습하기 위해 자바스크립트는 따로 사용하지 않았습니다. 그리고 목적상 고급 기능(페이징 기능 등)은 아직 구현되지 않았습니다.

 

#### **프로젝트의 구조 (일부)**

 ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.21.49.png)

 ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.22.00.png)

- **SimpleBoardController**: 게시판 관련 컨트롤러
- **SimpleBoardDAO**: 게시판 테이블 DAO, 작업 편의상 서비스, DTO는 따로 작성하지 않았습니다. DTO 대신 `Map`을 사용합니다.

 

#### **데이터베이스 구조**

 ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.30.43.png)

 ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.31.56.png)

데이터베이스 설정하는 방법은 [Spring Boot: mariadb 연결하기 (JDBC-Maven 기준)](http://yoonbumtae.com/?p=658)를 참고하세요.

 

#### **코드 (일부)**

https://gist.github.com/ayaysir/5ee2ccb6efd8063a568e2d5944ffd21c

 

#### **동작 내용**

\[caption id="attachment\_1854" align="alignnone" width="474"\] ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.00.57.png) 메인 화면 (로그인한 경우)\[/caption\]

 

\[caption id="attachment\_1856" align="alignnone" width="454"\] ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.10.16.png) 메인 화면 (로그인하지 않은 경우)\[/caption\]

 

\[caption id="attachment\_1863" align="alignnone" width="387"\] ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.37.28.png) 게시글 보기 (내 글)\[/caption\]

 

\[caption id="attachment\_1855" align="alignnone" width="383"\] ![](/assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-9.09.12.png) 게시글 보기 (다른 사람의 글)\[/caption\]

 

![](https://media.giphy.com/media/kcC0josb7fmy2b4VhR/giphy.gif)

게시글 작성

 

![](https://media.giphy.com/media/kfF3EO88jbSs0Ulboz/giphy.gif)

게시글 수정

 

![](https://media.giphy.com/media/IbZ1cV7NF1M4A4jFcQ/giphy.gif)

게시글 삭제
