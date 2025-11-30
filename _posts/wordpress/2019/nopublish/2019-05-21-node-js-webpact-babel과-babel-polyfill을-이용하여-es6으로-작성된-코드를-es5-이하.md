---
published: false
title: "Node.js: Webpack + Babel과 Babel/polyfill을 이용하여 ES6으로 작성된 코드를 ES5 이하에서도 호환되게 하기"
date: 2019-05-21
categories: 
  - "DevLog"
  - "JavaScript"
---

- [Node.js: 설치, 코드 실행 (Windows 기준)](http://y1oonbumtae.com/?p=772)
- [Node.js: Webpack 설치하기 (Webpack 4 버전 기준)](http://y1oonbumtae.com/?p=784)
- [Node.js: Webpack 4 추가 설정 (CSS, HTML, dev-server)](http://y1oonbumtae.com/?p=790)

 

```js
require('./static/css/main.css') // CSS 로딩 방법
console.log("WELCOME")

// 기본 Babel만으로 동작
const funcEx = () => {
  alert('arrow')
}

funcEx()

// Promise 등은 Pollyfill을 필요로 한다.
function msgAfterTimeout (msg, who, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(`${who}: ${msg}!`), timeout)
    })
}
msgAfterTimeout("First", "James", 100).then((msg) =>
    msgAfterTimeout(msg, "Cool James", 200)
).then((msg) => {
    console.log(`done after 300ms: \n${msg}`)
})
```

예를 들어 위와 같이 자바스크립트 코드를 ES6 문법으로 작성해서 Webpack으로 내보내면 크롬에서는 정상적으로 실행되지만 인터넷 익스플로러같은 브라우저에서 다음과 같은 오류가 발생합니다.

![](/assets/img/wp-content/uploads/2019/05/babel1.png)

ES6 문법의 두 가지가 있는데 위에 있는 화살표 문법은 **Babel**을 설치하는 것으로 해결할 수 있고, 아래 `Promise`는 Babel 단독으로는 할 수 없고 **Babel/polyfill**이라는 것을 이용해야 합니다.

 

##### 1\. npm에서 다음 명령어를 입력하여 Babel을 설치합니다.

```bash
npm install --save-dev @babel/core @babel/cli
npm install --save-dev @babel/preset-env
npm install --save-dev babel-loader
```

 

##### 2\. 루트 폴더에 `.babelrc` 라는 파일을 만들고 내용을 다음과 같이 작성합니다.

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

 

##### 3\. `webpack.config.js` 파일의 `module.rules` 부분을 다음과 같이 변경합니다.

```js
// webpack.config.js
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: [/*'@babel/polyfill',*/ './index.js'],
  output: {
    filename: './app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      
       {
        test: /\.js$/,
        include: path.join(__dirname),
        exclude: /(node_modules)|(dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }

      
      
    ]
  },
  /** (... 이하 생략 ...) **/
}

```

rules 배열의 첫 번째 원소는 지난번에 다루었던 css 관련 부분이고, 두 번째 원소가 새로 추가되는 부분입니다.  Webpack의  `dist` 관련 파일 생성 시 Babel을 적용하도록 하는 부분입니다.

![](/assets/img/wp-content/uploads/2019/05/babel2.png)

이렇게 하면 앞의 화살표 함수까지는 IE에서도 실행이 됩니다. 그러나 `Promise` 부분은 일부 구형 브라우저에서는 지원 자체가 되지 않기 때문에 Babel만으로는 해결할 수 없습니다. 이런 경우처럼 babel 만으로 적용할 수 없는 ES6 이상의 일부 코드들은 **babel/polyfill**로 해결합니다.

 

##### 4\. npm에서 polyfill을 전역으로 설치합니다.

```bash
npm install @babel/polyfill
```

전역으로 설치하는 이유는 ([https://poiemaweb.com/es6-babel-webpack-2](https://poiemaweb.com/es6-babel-webpack-2)) 를 참고해주세요. 그러나 개발자 옵션으로 설치한다고 해도 상관은 없을 것 같습니다. (시도해보지는 않았습니다.)

 

##### 5. `webpack.config.js` 파일의 `entry` 부분을 다음과 같이 변경합니다.

```js
module.exports = {
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: './app.bundle.js'
  },
  /** ... 이하 생략 ... **/
}
```

entry에서 작성한 js파일보다 폴리필을 먼저 로드시켜 작성한 코드들을 polyfill화(?) 합니다.

 

##### 6\. webpack dev server 가 켜져 있다면 끈 다음 재컴파일해서 IE에서 동작하는지 확인합니다.

![](/assets/img/wp-content/uploads/2019/05/babel3.png)

IE에서도 ES6 코드들이 정상적으로 동작하는 것을 볼 수 있네요. 하지만 시대가 어느때인데.. 인터넷 익스플로러는 그냥 빨리 없어졌으면 좋겠습니다.
