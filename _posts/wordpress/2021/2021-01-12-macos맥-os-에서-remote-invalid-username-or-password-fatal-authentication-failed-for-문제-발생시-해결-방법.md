---
title: "macOS(맥 OS) 에서 remote: Invalid username or password. fatal: Authentication failed for 문제 발생시 해결 방법"
date: 2021-01-12
categories: 
  - "DevLog"
  - "CI/CD"
---

깃허브에 문제가 생겨서 인증 에러(Authentication failed)가 발생한 경우 아래와 같은 방법으로 해결할 수 있습니다. (macOS 기준, 윈도우는 [링크](https://ryanwoo.tistory.com/38) 참조)

 

##### **1\. Spotlight 검색창 또는 Launchpad > 기타 폴더에서 '키체인 접근'이라는 응용프로그램을 실행합니다.**

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-12-오후-6.23.23.png)

 ![](/assets/img/wp-content/uploads/2021/01/-2021-01-12-오후-6.22.26-e1610443511448.jpg)

 

##### **2\. 검색창에 git을 검색한 뒤 '인터넷 암호' 종류의 github.com 항목을 삭제합니다.**

 ![](/assets/img/wp-content/uploads/2021/01/-2021-01-12-오후-6.13.41-e1610443781538.png)

 

##### **3\. 다시 push를 시도하면 아이디, 비밀번호 입력창이 나오는데 정확하게 입력합니다.**

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-12-오후-6.32.15.png)

 

이렇게 하면 github 계정 정보가 갱신되면서 인증 오류를 해결할 수 있습니다.
