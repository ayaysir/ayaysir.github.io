---
title: "리액트(React): npm(npx)에서 새로운 앱 생성, 컴포넌트 파일 생성"
date: 2020-09-15
categories: 
  - "DevLog"
  - "React.js"
---

리액트(React) 새로운 앱 생성하는 방법입니다.

 

#### **리액트 앱 생성**

```
npx create-react-app [앱_이름]
```

터미널을 열어 생성하고자 하는 폴더의 상위 폴더에 이동한 후 위의 명령어를 터미널에 입력하면 생성이 됩니다. (Node 8.10 혹은 상위 버전 및 npm 5.6 혹은 상위 버전인 경우)

또는 다음 명령어를 입력해 생성할 수 있습니다.

```
npm install -g create-react-app
create-react-app [앱_이름]
```

 

생성된 프로젝트는 다음과 같은 구조로 되어 있습니다.

 ![](/assets/img/wp-content/uploads/2020/09/스크린샷-2020-09-15-오후-2.11.08.png)

- `index.js` 는 Vue의 `main.js` 에 해당하는 역할을 합니다.
- `App.js`는 Vue의 `App.vue` 역할을 합니다.
- 각각의 `js` 파일은 컴포넌트 단위로 묶이며, `css` 는 동일한 이름의 별도 css로 분리됩니다.
- 각각의 컴포넌트 파일은 일반적으로 JSX라는 특수한 형태의 무근본 언어로 작성됩니다.

 

#### **만들어진 프로젝트 실행하기**

```
cd [앱_이름]
```

터미널에서 cd 명령을 현재 위치를 프로젝트 폴더로 이동한 후, 아래 명령을 실행합니다.

- `npm run start` - 로컬호스트로 메인 페이지를 실행합니다.
- `npm run build` - 프로젝트를 퍼블리싱합니다.
- `npm run test` - 테스트를 수행합니다.

 

#### **컴포넌트 생성**

1) 적당한 위치에 js 파일을 하나 생성하고 `import React from 'react'` 를 파일 최상단에 삽입합니다.

 ![](/assets/img/wp-content/uploads/2020/09/스크린샷-2020-09-15-오후-2.32.27.png)

2) 함수 또는 클래스를 선택해서 렌더링할 컴포넌트를 JSX 형태로 작성합니다. 저는 함수를 선택하도록 하겠습니다.

```
import React from 'react';
import pizzaImg from './../assets/pizza.png';

function Pizza() {
    return (
        <nav>
            <h3>피자</h3>
            <img src={pizzaImg} className="App-logo" alt="logo" />
        </nav>
        );

}

export default Pizza
```

3) `export default [함수명]` 구문을 맨 마지막 라인에 삽입합니다. (위의 코드 참고)

4) 컴포넌트를 삽입할 곳에 `import` 구문을 이용해 컴포넌트 `js` 파일을 불러오고, 삽입할 위치에 태그명을 작성합니다.

```
import React from 'react';
import Pizza from './components/Pizza'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Pizza />
        <p>
           <code>src/App.js</code> 
        </p>
        <a
          className="App-link"
          href="https://yoonbumtae.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          홈페이지 바로가기
        </a>
      </header>
    </div>
  );
}

export default App;
```

 

 ![](/assets/img/wp-content/uploads/2020/09/스크린샷-2020-09-15-오후-2.36.46.png)
