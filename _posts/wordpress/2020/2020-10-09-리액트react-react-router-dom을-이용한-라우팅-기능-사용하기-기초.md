---
title: "리액트(React): react-router-dom을 이용한 라우팅 기능 사용하기 기초"
date: 2020-10-09
categories: 
  - "DevLog"
  - "React.js"
---

##### **1) 터미널에서 프로젝트 폴더로 이동한 뒤 npm에서 react-router-dom을 설치합니다.**

```
npm i react-router-dom --save
```

 

##### **2) App.jsx 에서 `<BrowserRouter>` 태그쌍을 작성한 뒤 안에 라우팅 관련 정보를 작성합니다.**

![](./assets/img/wp-content/uploads/2020/10/carbon.png)

- `<Route>` 태그는 주소를 입력받으면 특정 컴포넌트로 이동합니다. `exact`는 정확히 이 `path`만 받아들인다는 의미이며 다른 주소는 적용되지 않습니다. 만약 `exact`를 사용하지 않는다면 `/anyurl` 등 모든 하위 URL이 매핑될 것입니다.
- `<Switch>`는 라우터 중복 매핑을 방지하는 역할을 합니다. 이 태그 안에 있는 `<Route>`들은 여러 라우트가 매핑되어을 때 첫 번째 위치한 라우트만 동작하게 됩니다. 여기서 `/movie/1`을 입력하였다면 `<Switch>`가 없는 경우 두 개의 Route에 전부 매핑이 되지만 `<Switch>` 태그를 감싸면 첫 번째 Route만 매핑이 되고 이후 라우팅은 무시됩니다.
- :`path`에서 `:name` 처럼 입력하면 동적 변수를 사용할 수 있습니다..
- `Home`, `Movie`, `MovieDetail`은 리액트 컴포넌트입니다. ![](./assets/img/wp-content/uploads/2020/10/carbon-2.png)

 

##### **3) Menu 컴포넌트를 만든 뒤 라우팅 링크를 생성합니다.**

![](./assets/img/wp-content/uploads/2020/10/carbon-1.png)

`<Link>` 태그는 react-router-dom 사용시 `<a>` 태그를 대체하는 역할을 하며, 링크를 이동하더라도 화면의 새로고침이 되지 않게 합니다.

 

참고로 위 라우트 매핑에서 `/movie/:name` 동적 변수를 사용하는 법은 다음과 같습니다.

![](./assets/img/wp-content/uploads/2020/10/carbon-3.png)

functional hook에서 arguments로 `{match}`를 추가하고, 함수 내에서 `match.params.[동적변수이름]`을 사용하면 동적 변수를 사용할 수 있습니다. 여기서는 `:name` 이 동적변수이기 때문에 `match.params.name` 이라고 되어 있습니다.
