---
title: "Node.js: Webpack 4 추가 설정 (CSS, HTML, dev-server) 빌드 및 배포"
date: 2019-02-12
categories: 
  - "DevLog"
  - "Node.js"
tags: 
  - "node-js"
---

[Node.js: 설치, 코드 실행 (Windows 기준)](http://yoonbumtae.com/?p=772) [Node.js: Webpack 설치하기 (Webpack 4 버전 기준)](http://yoonbumtae.com/?p=784)

##### **1\. 아래 명령어들을 터미널에 입력합니다.**

```
npm install --save-dev html-webpack-plugin
npm install --save-dev css-loader
npm install --save-dev style-loader
npm install --save-dev webpack-dev-server
```

 ![](/assets/img/wp-content/uploads/2019/02/addi-e1566915663549.png)

 

##### **2\. `webpack.config.js` 파일을 다음과 같이 작성합니다.**

```
// webpack.config.js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './test.js',
    output: {
        filename: './app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "./dist/"),
        port: 9000
    },
    plugins: [
          new HtmlWebpackPlugin({
            title: '현재시간',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            template: './static/index.html'
              
        })
    ]
}

```

`HtmlWebpackPlugin`이라는 변수에 `webpack-plugin`을 할당합니다. require(모듈명)은 해당 모듈을 불러오라는 의미로 ES6에서 import 가 등장하기 전에 CommonJS등의 모듈러에서 사용했던 코드인데, 현재도 널리 사용되고 있습니다. `module` 에는 `css loader`, `devServer`에는 서버 세팅, `plugins`에는 `HtmlWebpackPlugin`설정을 하면 됩니다. `minify`의 `collapseWhitespace`는 배포된 자바스큽리트 파일의 공백을 없애 용량을 줄이는 기능입니다. `template` 가 없으면 `static/index.html`을 기본으로 생성합니다.

`devServer`는 실시간 미리보기를 지원합니다. 프로젝트 내의 js, html, css 파일이 수정되면 배포파일도 자동으로 새로고침됩니다.

 

##### **3\. `package.json`에서 `scripts` 부분의 `dev` 명령을 아래와 같이 수정합니다.**

```
webpack-dev-server --hot --inline
```

```
{
    "name": "nodejs",
    "version": "1.0.0",
    "description": "",
    "main": "test.js",
    "scripts": {
        "dev": "webpack-dev-server --hot --inline"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
        "css-loader": "^2.1.0",
        "html-webpack-plugin": "^3.2.0",
        "style-loader": "^0.23.1",
        "webpack": "^4.29.3",
        "webpack-cli": "^3.2.3",
        "webpack-dev-server": "^3.1.14"
    }
}

```

`webpack-dev-server`는 실시간으로 프로젝트를 빌드하고 브라우저에서 실시간으로 볼 수 있도록 도와주는 역할을 합니다. `--hot`은 Hot Module Replacement (HMR) 옵션을 활성화하며 프로젝트 내용이 변경될 때 풀 리로드(full reload)를 하지 않고 변경된 부분만 빌드합니다. `--inline`은 실시간 재로딩를 처리하기 위해 해당 스크립트가 번들에 삽입되고 빌드 메시지가 브라우저 콘솔에 나타나도록 하는 옵션입니다.

 

##### **4\. test.js, html, css 파일을 작성합니다.**

```
require('./static/test.css') // CSS 로딩 방법

function currentTime(){
  return new Date().toString()
}

setInterval(()=>{
    document.getElementById('current-time-area').innerHTML = currentTime()
}, 1000)

```

```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
</head>
<body>
    <p id=current-time-area></p>
</body>
</html>
```

html 파일에서 css와 js 선언 부분을 나중에 동작할 것입니다. 웹팩 프로그램이 webpack.config.js에서 설정한 내용들을 바탕으로 해당 파일들을 찾아 포함시켜주기 때문입니다.

 

```
html{
    background-color: black;
}

#current-time-area{
    color: lavender;
    font-size: 20px;
}
```

 

##### **5\. `npm run dev` 로 결과를 확인합니다. 기본 포트는 `9000`입니다.**

 ![](/assets/img/wp-content/uploads/2019/02/time1.gif)

css가 자바스크립트 파일에 들어가서 적용되었습니다. 다음은 이 프로젝트를 빌드 및 배포해보겠습니다.

 

##### **6\. `package.json`에 아래 부분을 추가한 후 터미널에서 `npm run build`를 실행합니다.**

```
 "build": "webpack --mode production"
```

아래와 같은 화면이 나왔다면 정상적으로 빌드된 것입니다. `dist` 폴더에서 `app.bundle.js`와 `index.html` 파일이 있는지 확인합니다.

 ![](/assets/img/wp-content/uploads/2019/02/스크린샷-2019-08-28-오전-12.14.12.png)

 ![](/assets/img/wp-content/uploads/2019/02/스크린샷-2019-08-28-오전-12.16.21.png)

이제 배포를 해보겠습니다. `dist` 폴더 내의 파일들을 웹서버의 영향이 없는 곳으로 복붙합니다. 다음 `index.html` 파일을 클릭하여 독립된 환경에서도 정상 동작이 되는지 확인합니다. 또 소스 보기를 실행하여 `html` 파일 및 스크립트 파일이 어떻게 minified 되었는지도 확인합니다.

```
<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>hh</title></head><body><p id="current-time-area"></p><script type="text/javascript" src="./app.bundle.js?4e6bb8aa27715b45f757"></script></body></html>
```

 ![](/assets/img/wp-content/uploads/2019/02/스크린샷-2019-08-28-오전-12.19.48.png)
