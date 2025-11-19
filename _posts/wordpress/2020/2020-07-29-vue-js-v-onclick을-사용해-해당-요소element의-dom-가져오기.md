---
title: "Vue.js: v-on:click을 사용해 해당 요소(element)의 DOM 가져오기"
date: 2020-07-29
categories: 
  - "DevLog"
  - "Vue.js"
tags: 
  - "vue-js"
---

[출처 바로가기(영문)](https://stackoverflow.com/questions/36968153/vue-js-reference-div-id-on-v-onclick)

#### **Vue.js: v-on:click을 사용해 해당 요소(element)의 DOM 가져오기**

 

이벤트 객체 `$event`를 사용하여 이벤트 핸들러를 가져올 수 있습니다.

```html
<div id="foo" v-on:click="select($event)">...</div>
```

 

`$event`는 자바스크립트에서 다음과 같이 처리할 수 있습니다. 참고로 `event` 자체는 클릭 이벤트이고, 어떤 요소를 클릭했는지 가져오는 것이 `event.currentTarget`(또는 `event.target`)입니다.

```
export default {
    methods: {
        select: function(event) {
            const targetId = event.currentTarget.id;
            console.log(targetId); // returns 'foo'
        }
    }
}
```

 

첫 번째 코드는 다음과 같이 줄여쓸 수 있습니다. `v-on:click`은 `@click`으로 줄일 수 있고, `select`의 파라미터를 생략하면 자동으로 이벤트 객체를 넘겨줍니다.

```html
<div id="foo" @click="select">...</div>
```

 

단, 위의 경우 파라미터가 1개인 경우만 사용할 수 있습니다. 파라미터가 여러 개라면 아래와 같이 사용하세요.

```html
<div id="foo" @click="select(bar, $event)">...</div>
```

```
export default {
    methods: {
        select: function(bar, event) {
            // use bar...

            const targetId = event.currentTarget.id;
            console.log(targetId); // returns 'foo'
        }
    }
}
```
