---
title: "자바스크립트: 배열 map, filter, apply + 예제: ABC(알파벳) 내비게이터"
date: 2019-08-08
categories: 
  - "DevLog"
  - "JavaScript"
---

이하 내용들은 ES6 이상을 지원하지 않는 브라우저에서는 작동되지 않을 수도 있습니다.

#### Array.prototype.map

배열을 순회합니다.

```
var numbers = [1, 4, 9];
var roots = numbers.map(function(num) {
    return Math.sqrt(num)
});
// roots is now [1, 2, 3]
// numbers is still [1, 4, 9]
```

#### Array.prototype.filter

특정 조건을 만족하는 배열만 솎아냅니다.

```
var words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

const result = words.filter(word => word.length > 6);

console.log(result);
// expected output: Array ["exuberant", "destruction", "present"]
```

 

#### Function.prototype.apply

파라미터를 여러 개 가지는 함수에서 파라미터를 배열(또는 유사배열)로 대신 사용할 수 있도록 하는 기능입니다. ([MDN 링크](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply))

```
var numbers = [5, 6, 2, 3, 7];

// 일반 방식
var max = Math.max(numbers[0], numbers[1], ..., numbers[4]);

// apply를 이용한 방식
var max = Math.max.apply(null, numbers);
```

 

#### 예제 (JQuery 포함)

알파벳으로 구성된 내비게이터를 생성한 뒤 `<a href=#아이디>`로 링크된 각 문자를 클릭하면 해당 아이디를 가진 요소로 이동하는 고전적인 북마크 기능을 이용해 해당 위치로 이동하는 예제입니다.

https://gist.github.com/ayaysir/68d058c0ce62f3406573eb2bcef0c3c0

 ![](/assets/img/wp-content/uploads/2019/08/스크린샷-2019-08-09-오전-1.42.04-563x1024.png)
