---
title: "Spring Boot 예제: 회원가입 폼 만들기"
date: 2019-12-09
categories: 
  - "DevLog"
  - "Spring/JSP"
---

이 예제에는 [스프링 시큐리티](http://yoonbumtae.com/?tag=%EC%8A%A4%ED%94%84%EB%A7%81%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0)와 [Thymeleaf](http://yoonbumtae.com/?tag=Thymeleaf)가 사용되었습니다.

기초적인 데이터베이스 insert 예제로, 특별한 내용은 없고 다음을 연습하기 위해 만들었습니다.

- 회원 테이블에 비밀번호를 BCrypt로 해싱한 텍스트를 입력
- 원칙적으로 입력한 값에 대한 유효성 검사는 프론트엔드 측과 백엔드 측 모두에서 행해져야 하는데, 백엔드 측의 유효성 검사 과정을 추가

시간 관계상 프론트엔드 측 유효성 검사는 구현하지 않았습니다.

**`@GetMapping`**과 **`@PostMapping`**은 기존의 `@RequestMapping` 을 GET 방식 또는 POST 방식으로 지정할 수 있습니다. `@PostMapping("/url")`은 `@RequestMapping(value="/url", method=RequestMethod.POST)`과 동일한 기능을 합니다.

 

https://gist.github.com/ayaysir/6478d1a7a6ba167589cd6569acf6506c

 

\[caption id="attachment\_1925" align="alignnone" width="1752"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-1.48.23.png) 기존에 존재하는 아이디로 회원가입을 시도\[/caption\]

\[caption id="attachment\_1926" align="alignnone" width="600"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-1.48.32.png) 기존에 존재하는 아이디로 회원가입을 시도 결과\[/caption\]

 

\[caption id="attachment\_1927" align="alignnone" width="1728"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-1.48.52.png) 유효하지 않은 입력 정보로 가입 시도\[/caption\]

\[caption id="attachment\_1928" align="alignnone" width="521"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-1.49.00.png) 유효하지 않은 입력 정보로 가입 시도 결과\[/caption\]

 

\[caption id="attachment\_1929" align="alignnone" width="1766"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-1.49.49.png) 정상적인 입력 정보로 회원 가입 시도\[/caption\]

\[caption id="attachment\_1930" align="alignnone" width="393"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-1.49.57.png) 정상적인 입력 정보로 회원 가입 결과\[/caption\]

 

\[caption id="attachment\_1931" align="alignnone" width="1582"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-2.11.21.png) 입력 정보 확인\[/caption\]

 

\[caption id="attachment\_1932" align="alignnone" width="535"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-2.13.20.png) 로그인 후 게시판([Spring Boot 예제: 초간단 게시판](http://yoonbumtae.com/?p=1853))에 글 작성\[/caption\]
