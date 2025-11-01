---
title: "Node.js: Webpack 설치하기 (Webpack 4 버전 기준)"
date: 2019-02-11
categories: 
  - "DevLog"
  - "Node.js"
tags: 
  - "node-js"
---

이전 글: [Node.js: 설치, 코드 실행 (Windows, macOS 기준)](http://yoonbumtae.com/?p=772)

 

**Webpack**은 프로젝트의 구조를 분석하고 자바스크립트 모듈을 비롯한 관련 리소스들을 찾은 다음 이를 브라우저에서 이용할 수 있는 번들로 묶고 패킹하는 모듈 번들러(Module bundler)라고 합니다.

 

**1\. npm으로 Webpack 설치**

```
 npm install webpack --save-dev
```

 ![](/assets/img/wp-content/uploads/2019/02/1-1-e1566830166750.png)

옵션에서 `--save-dev`는 로컬 폴더에만 (위 예제에서는 d:\\dev\\nodejs\\ 폴더 내에서만) 설치하는 것이며 `-g` 옵션은 모든 node.js 구동영역에 설치하는 전역 옵션인데 위 화면은 로컬에서 설치하였습니다.

 

**2\. webpack.config.js 설정**

프로젝트 폴더 (`package.json` 파일이 있는 폴더와 동일한 위치)에 `webpack.config.js` 라는 이름의 파일을 생성합니다. 별도 옵션이 지정되어있지 않으면 파일 이름은 반드시 제시된 것과 동일해야 합니다.

```
// webpack.config.js
module.exports = {
 entry: './test.js',
 output: {
  filename: './app.bundle.js'
 }
}
```

`entry`는 `webpack.config.js` 이 위치한 폴더(`./`는 동일한 위치라는 의미)에 있는 `test.js`를 포함하겠다는 것이고(엔트리는 통합을 시작할 파일을 지정하는 것입니다.) 그것을 번들링한 결과물(output)을 dist 폴더 내에 `app.bundle.js`라는 파일로 내보내겠다는 의미입니다. (왜 dist 폴더에 저장되는지는 아직 모르겠다)

 

**3\. test.js 작성: 번들링하기 전의 개발 js 파일**

```
function add(n1, n2){
  console.log(n1 + n2)
}

function currentTime(){
  return new Date().toString()
}

add(3, 10)
console.log(currentTime())
```

 

**4\. `package.json` 파일 수정**

```
{
    "name": "nodejs",
    "version": "1.0.0",
    "description": "",
    "main": "test.js",
    "scripts": {
        "dev": "webpack -d --watch"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "webpack": "^4.29.3",
        "webpack-cli": "^3.2.3"
    }
}

```

기존 파일에서  `scripts`의 `dev`만 부분만 추가합니다.  `scripts` 부분은 npm 명령어를 간편하게 실행하는 옵션이며 `-d` 는 Webpack에서 자체적으로 제공하는 단축키로 `--debug --devtool cheap-module-eval-source-map --output-pathinfo` 의 약자입니다. `--watch` 또는 `-w`는 개발 프로젝트의 파일들의 변경 여부를 검사하여 변경이 되었다면 자동으로 `app.bundle.js`를 갱신합니다.

 

**5\. npm 번들링 작업 실행: `npm run dev`**

 ![](/assets/img/wp-content/uploads/2019/02/2-1-e1566830655485.png)

원래 `webpack-cli` 라는 것도 설치했어야 하는데 안했으므로 추가 설치 여부를 물어보는 장면입니다. `yes`를 키보드로 입력해 추가로 설치합니다.

 ![](/assets/img/wp-content/uploads/2019/02/3-e1566830742967.png)

추가 설치해서 위 화면처럼 나오면 정상적으로 `app.bundle.js` 가 `dist` 폴더에 생성됩니다.

 

 

**6\. 해당 번들 파일 테스트**

 ![](/assets/img/wp-content/uploads/2019/02/4-e1566831404176.png)

watch 옵션이 실행중이므로 위에서 사용하던 터미널 창은 사용할 수 없을 것입니다. 다른 터미널 창을 띄워서 테스트하면 됩니다.

 

**7\. watch 테스트**

`test.js` 파일에서 덧셈을 뺄셈으로 바꾸고 편집기에서 저장을 해보겠습니다.

```
function minus(n1, n2){
  console.log(n1 - n2)
  console.log("뺄셈입니다.")
}

.........

minus(25, 11)
```

```
usernameui-MacBook:dist username$ node app.bundle.js
14
뺄셈입니다.
Tue Aug 27 2019 00:00:03 GMT+0900 (GMT+09:00)

```

다시 번들 파일을 실행하면 파일을 저장만 했음에도 watch 옵션이 작동하여 자동으로 컴파일이 된 것을 확인할 수 있습니다.

 

참고 블로그: [바로가기](https://medium.com/@shlee1353/%EC%9B%B9%ED%8C%A9-%EC%9E%85%EB%AC%B8-%EA%B0%80%EC%9D%B4%EB%93%9C%ED%8E%B8-html-css-%EC%82%AC%EC%9A%A9%EA%B8%B0-75d9fb6062e6)
