---
title: "Vue.js: data 코드의 축약형과 원래 형태 / 배열 특정 원소 대체하기"
date: 2020-02-05
categories: 
  - "DevLog"
  - "Vue.js"
tags: 
  - "vue-js"
---

#### 축약형

```
export default {
    data() {
        return {
            todoItems: []
        }
    },
    

}
```

```
methods: {
    addTodo() {
        
    }
},
```

 

#### 원래 형태

```
export default {
    data: function(){
        return {
            todoItems: []
        }
    },
    

}
```

```
methods: {
    addTodo: function(){
        
    }
},
```

vue.js vue 축약 원래

 

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

[https://stackoverflow.com/questions/42807888/vuejs-and-vue-set-update-array](https://stackoverflow.com/questions/42807888/vuejs-and-vue-set-update-array)
