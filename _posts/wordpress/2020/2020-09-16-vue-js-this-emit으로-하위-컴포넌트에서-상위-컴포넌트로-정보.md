---
title: "Vue.js: this.$emit으로 하위 컴포넌트에서 상위 컴포넌트로 정보 전달"
date: 2020-09-16
categories: 
  - "DevLog"
  - "Vue.js"
tags: 
  - "vue-js"
---

먼저 상위(부모) 컴포넌트의 이름은 `Topic`, 하위(자식) 컴포넌트의 이름은 `TopicSearch`라고 가정합니다.

 

##### **먼저, 상위 클래스에서 컴포넌트를 삽입할 때 `v-on:xxx`(약어 `@xxx`)를 사용해 커스텀 이벤트를 만듭니다.**

**Topic.vue (일부)**

```
<template>
  <div class="topic">
        <TopicSearch v-on:search="doSearch" v-on:allOrder="doAllOrder"/>
  </div>
</template>
```

여기서 `search`. `allOrder` 는 나중에 `this.$emit`에서 사용할 이벤트 이름이며. `doSearch`, `doAllOrder`는 상위 컴포넌트에 있는 메소드 이름입니다. 왼쪽이 자식 컴포넌트에서 사용할 `$emit`의 이벤트 이름, 오른쪽은 부모 컴포넌트에서 실행할 메소드라고 생각하면 됩니다.

 

**Topic.vue (일부)**

```
methods: {
   
    doSearch(category, keyword) {
      // 해야될 작업
    },
    doAllOrder(order) {
      // 해야될 작업
    }

  }
```

 

##### **다음 하위 컴포넌트에서 `this.$emit`을 사용합니다. 이 구문이 실행되면 상위 컴포넌트로 올라가 `v-on`으로 작성한 커스텀 이벤트가 실행됩니다.**

**TopicSearch.vue (일부)**

```
methods: {
    search() {
        this.$emit("search", this.searchCategory, this.searchKeyword)
    },
    allOrder() {
        this.$emit("allOrder", this.allOrderStatus)
    }
}
```

`this.$emit`의 첫 번째 파라미터는 '상위 컴포넌트의 이벤트 이름'을 스트링 형태로 적습니다. 두 번째 파라미터부터는 상위 컴포넌트에서 실행하는 함수에 전달할 파라미터들입니다. 예를 들어 하위 컴포넌트의 `search` 메소드에 있는 `this.$emit`은 상위 컴포넌트로 올라가면서 다음 각각 파라미터에 배정됩니다..

- 하위 컴포넌트의 `this.searchCategory`는 상위 컴포넌트의 메소드 `doSearch`의 `category`에 배정됩니다.
- 하위 컴포넌트의 `this.searchKeyword`는 상위 컴포넌트의 메소드 `doSearch`의 `keyword`에 배정됩니다.
