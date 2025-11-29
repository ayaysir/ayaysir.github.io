---
title: "자바스크립트(JavaScript)에서 쿼리 파라미터(query parameter) 값을 알아내는 방법"
date: 2020-12-24
categories: 
  - "DevLog"
  - "JavaScript"
---

URL의 쿼리 파라미터란 아래 빨간색 박스처럼 `?` 뒤에 지정하는 파라미터를 뜻합니다. 여러 개를 연결할 때는 `&` 를 씁니다. 쿼리 스트링(query string)이라고도 합니다.

 ![](/assets/img/wp-content/uploads/2020/11/screenshot-2020-11-05-pm-10.32.15.png)

 

## **ES6 이상인 경우**

```js
const urlParams = new URLSearchParams(window.location.search);
const uwasaKeyword = urlParams.get('uwasaKeyword');
```

`URLSearchParams`는 최신 스펙으로 인터넷 익스플로러에서는 지원하지 않습니다. ([브라우저별 호환성 확인](https://caniuse.com/urlsearchparams))

 

## **ES5 이하인 경우**

호환성을 고려할 때는 이 방법을 사용해야 합니다. 다음과 같은 함수를 생성합니다.

```js
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
```

 

사용하고자 하는 곳에 다음과 같이 사용하면 됩니다.

```js
// query string: ?foo=lorem&bar=&baz

var foo = getParameterByName('foo'); // "lorem"
var bar = getParameterByName('bar'); // "" (빈 값 표현)
var baz = getParameterByName('baz'); // "" (없는 값 표현)
var qux = getParameterByName('qux'); // null (아예 없는 파라미터)
```

 

> 출처: [How can I get query string values in JavaScript?](https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
