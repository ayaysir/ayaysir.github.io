---
title: "Node.js: 설치, 코드 실행 (Windows, macOS 기준)"
date: 2019-02-11
categories: 
  - "DevLog"
  - "Node.js"
tags: 
  - "node-js"
---

**Node.js**는 구글 크롬 브라우저에서 사용되는 V8엔진을 탑재한 런타임(실행환경)입니다. 자바스크립트를 웹 뿐만 아니라 아니라 백엔드 서버 개발, 데스크탑 소프트웨어 개발, IoT 개발 등에서도 자바스크립트가 이용될 수 있도록 자바스크립트 엔진의 적용 반경을 확장시키는 역할을 합니다.

 

1. [https://nodejs.org/ko/](https://nodejs.org/ko/) 에서 안정적이고 신뢰적인 LTS 버전을 받습니다.

 

2\. 받은 파일을 설치합니다. 계속 `[다음]` 버튼만 누르고 완료하면 됩니다.

 

3\. **Windows:** `Win + R` 단축키 등으로 실행 창을 열고 `cmd` 를 실행합니다. **macOS:** 하단 독의 `Launchpad` (또는  Finder의 응용 프로그램 폴더) → `기타` 폴더 → `터미널` 실행

 

4\. 명령어에 각각 `node -v`, `npm -v`를 입력하여 제대로 설치되었는지 확인합니다. 경로에 상관없이 전부 실행되어야 하며, 제대로 실행되지 않는 경우 설치가 잘못되었거나 환경 변수 설정을 해야할 수도 있습니다(윈도우의 경우).

\[caption id="attachment\_773" align="alignnone" width="186"\] ![](/assets/img/wp-content/uploads/2019/02/node1-e1566729465770.png) 윈도우 화면\[/caption\]

```
========= macOS 실행 =========
usernameui-MacBook:~ username$ node -v
v10.16.0
username-MacBook:~ username$ npm -v
6.9.0
```

 

5\. (4)번의 화면처럼 나타났다면 설치가 완료된 것이며, node를 실행해서 테스트 코드를 입력합니다.

 ![](/assets/img/wp-content/uploads/2019/02/node2-e1566729692961.png)

다만 콘솔에서 직접 사용할 일은 거의 없으므로 작동여부 정도만 확인합니다.

종료하는 방법은 `Ctrl+c`를 두번 누르거나(맥도 동일한 `control` 버튼) `.exit`를 입력합니다.

 

6\. 자바스크립트 파일(`*.js`)은 다음과 같이 실행합니다. (프롬프트에 `node 파일이름.js`)

```
function add(n1, n2){
  console.log(n1 + n2)
}

add(3, 10)
```

특정 폴더 위치(프로젝트의 루트 위치가 됨)에서 js 파일을 만들고 실행합니다. 윈도우는 해당 폴더에서 `Shift + 마우스 오른쪽 버튼`을 누르면 이 위치에서 명령 창 실행할 수 있는 메뉴가 나오고, 맥에서는 [다음 글](https://nolboo.kim/blog/2016/10/25/finder-terminal/)을 참조해주세요.

 ![](/assets/img/wp-content/uploads/2019/02/node3-e1566729888703.png)

```
========= macOS 실행 =========
usernameui-MacBook:nodeex username$ node test.js
13
usernameui-MacBook:nodeex username$
```

 

7\. `npm`으로 `package.json` 을 생성 (프롬프트에 `npm init -y`)

`npm`은 스프링의 `maven`과 비슷한 역할을 하는 패키지 관리자입니다. 자바스크립트 라이브러리 설명서에서 `$ npm` 으로 시작하는 코드가 나오면 이 방법으로 실행하는 것이라고 보면 됩니다.

지금은 역할을 잘 모르겠지만 `package.json`을 생성합니다. `-y`를 붙이면 기본옵션으로 생성하며 파라미터를 붙이지 않으면 질문이 수 차례 나오는데,  이름, 버전 등을 입력하는 옵션입니다. 일단은 기본값으로 생성하는 `-y` 옵션을 선택합니다.

 ![](/assets/img/wp-content/uploads/2019/02/node4-e1566732363142.png)

 ![](/assets/img/wp-content/uploads/2019/02/node5-1-e1566732814394.png)

 ![](/assets/img/wp-content/uploads/2019/02/스크린샷-2019-08-25-오후-8.32.37.png)
