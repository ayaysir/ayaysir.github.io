---
title: "Node.js: Ace (Syntax Highlighter) 설치하기 (Webpack 4 기준)"
date: 2019-02-21
categories: 
  - "DevLog"
  - "Node.js"
---

### 참고 사이트[](https://github.com/ajaxorg/ace/blob/master/demo/webpack/demo.js#L12)

[https://github.com/ajaxorg/ace/blob/master/demo/webpack/demo.js#L12](https://github.com/ajaxorg/ace/blob/master/demo/webpack/demo.js#L12) [https://ace.c9.io/#nav=embedding](https://ace.c9.io/#nav=embedding)

 

## npm 설치하기

`npm i ace-builds --save-dev` `npm install @types/ace --save-dev` `npm i file-loader --save-dev`

 

## 메인 js 파일 작성

```
require('./dist/test.css') // CSS 로딩 방법

import ace from 'ace-builds/src-noconflict/ace'
import "ace-builds/webpack-resolver";       // npm i file-loader --save-dev

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");
```

 

## 템플릿 HTML 작성

```
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Editor</title>
</head>
<body>

<pre id="editor">function foo(items) {
    var i;
    for (i = 0; i &lt; items.length; i++) {
        alert("Ace Rocks " + items[i]);
    }
}</pre>

</body>
</html>

```

 

## dev 서버 실행 후 결과 확인

 ![](/assets/img/wp-content/uploads/2019/02/ace.png)
