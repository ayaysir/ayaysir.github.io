---
title: "Vue.js: data 코드의 축약형과 원래 형태 / 배열 특정 원소 대체하기"
date: 2020-02-05
categories: 
  - "DevLog"
  - "Vue.js"
tags: 
  - "vue-js"
---

## 원래 형태

- 객체가 있고 객체의 값으로 함수를 넣은 형태입니다.

```js
export default {
    data: function() {
        return {
            todoItems: []
        }
    },
}
```

```js
methods: {
    addTodo: function(){
        
    }
},
```

## 축약형
 
 - ES6(ECMAScript 2015)에서 도입된 ‘메서드 축약 표현(Method Shorthand)’입니다.
 - 문법적 “설탕(syntactic sugar)”으로, 아래와 같이 함수를 넣으면 함수 이름을 자동으로 키 이름에 할당합니다. 


```js
export default {
    data() {
        return {
            todoItems: []
        }
    },
}
```

```js
methods: {
    addTodo() {
        
    }
},
```

 



<!-- vue.js vue 축약 원래

 

* * *

 

```
this.values.splice(index, 1, replacementItem)
```

```
editTodo(keyOfTodoItem, index) {
    var edit = prompt(keyOfTodoItem)
    localStorage.setItem(keyOfTodoItem, edit)
    this.todoItems.splice(index, 1, {
        key: keyOfTodoItem,
        value: edit
    })
}
```

[https://stackoverflow.com/questions/42807888/vuejs-and-vue-set-update-array](https://stackoverflow.com/questions/42807888/vuejs-and-vue-set-update-array) -->
