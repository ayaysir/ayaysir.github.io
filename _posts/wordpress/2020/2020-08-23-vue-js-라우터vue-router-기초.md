---
title: "Vue.js: 라우터(Vue Router) 기초"
date: 2020-08-23
categories: 
  - "DevLog"
  - "Vue.js"
tags: 
  - "vue-js"
---

이 방법은 npm의 Vue CLI를 통해 개발하는 경우 및 처음에 Vue.js 프로젝트를 생성할 때 Vue Router가 포함되지 않은 경우를 기준으로 작성되었습니다.

 

#### **1) npm에서 Vue Router 설치**

```
npm install vue-router --save
```

 

#### **2) router 관련 설정 js 파일 생성**

이름 및 경로는 자유롭게 지정할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-23-pm-11.59.56.png)

 

#### **3) 라우터 설정 js 파일 작성**

```
import Vue from 'vue'
import Router from 'vue-router'

// 연결할 컴포넌트 import
import Topic from "./../components/Topic.vue"
import HelloWorld from "@/components/HelloWorld.vue"
import IdolList from "@/components/IdolList.vue"
import WriteUwasa from "@/components/WriteUwasa.vue"

// 필수
Vue.use(Router)

export default new Router({
    mode: 'history', // history 모드는 자연스러운 url 가능, 지정하지 않으면 해시(#)기호로 url 사용
    routes: [
        {
            path: "/", // 경로
            name: "Topic", // 해당 경로의 이름 
            component: Topic // 이동할 컴포넌트
        },
        {
            path: "/foo",
            name: "Foo",
            component: HelloWorld
        },
        {
            path: "/bar",
            name: "Bar",
            component: HelloWorld
        },
        {
            path: "/v/simple-list",
            name: "Idol Simple List",
            component: IdolList
        },
        {
            path: "/v/write-uwasa",
            name: "Write Uwasa",
            component: WriteUwasa
        },

    ]
})
```

- 1~2 라인에서 `Vue`와 `Router`를 `import` 합니다.
- 경로에 연결할 컴포넌트를 `import` 합니다.
- `Vue.use(Router)` - 이 구문은 필수로 작성해야 합니다.
- `mode: 'history'`를 지정하면 History API를 이용한 자연스러운 URL을 사용할 수 있습니다. `'hash'` 또는 지정하지 않으면 해시(`#`) 기호가 들어간 URL을 사용합니다.
- `routes` 배열에 매핑 정보가 들어갑니다. 각 원소는 `RouteConfig`이라는 객체 자료형으로 되어 있습니다.
- `RouteConfig` 객체의 `path`는 대상 경로, `name`은 라우터에 이름을 부여 ([참고](https://router.vuejs.org/kr/guide/essentials/named-routes.html)), `component`는 router-view 영역에 보여줄 컴포넌트를 지정합니다.

 

#### **4) main.js에 route 관련 설정 추가**

루트 디렉토리에 있는 `main.js`에 `router`를 추가합니다.

```
import Vue from 'vue'
import App from './App.vue'

import router from "./router/router";

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

```

- 4라인: 라우터 설정 js 파일을 `import`합니다. 경로는 2번 과정에서 라우터 설정 js를 저장했던 경로를 지정합니다.
- 9라인: `router`를 추가합니다.

 

#### **5) App.js 에 <router-view />를 추가**

```
<template>
    <div id="app">
        <Header :msg="welcomeMessage"></Header>
        <router-view />
    </div>
</template>

<script>
    // ... 생략 ... //
</script>

<style>
    /* ... 생략 ... */
</style>
```

4라인에 추가된 `<router-view />` 부분에서 라우터 설정 js 파일에서 지정된 컴포넌트들이 표시될 예정입니다. 예를 들어 `/v/simple-list`로 접속한 경우, `IdolList` 컴포넌트가 `<router-view />` 부분에서 대체되어 표시됩니다.

 

#### **6) 내비게이션(<nav>) 부분에 라우터 기반 링크 추가**

```
<template>
    <nav class="nav">
        <div class="nav-header">
            <img src="./../assets/logo.png"> <h2>{{msg}}</h2>
        </div>
        
        <ul>
            <li><router-link to="/">소문 목록</router-link></li>
            <li><router-link to="/v/simple-list">아이돌 리스트</router-link></li>
            <li><router-link to="/v/write-uwasa">소문 등록</router-link></li>
        </ul>
    </nav>
</template>

<script>
</scirpt>

<style scoped>
</style>
```

`<router-link to="[라우트_주소]">` 를 사용하여 라우트 링크를 만듭니다. 이것은 렌더링 시에 `<a>` 태그로 대체됩니다. `to` 속성에 주소를 적으면 되고, `:to` 속성을 사용한 경우 라우트 이름을 사용하는 등의 작업을 수행할 수 있습니다. ([참고](https://router.vuejs.org/kr/guide/essentials/named-routes.html))

서버에서 URL 매핑이 SPA 페이지에 적절하게 이루어진 경우, URL을 브라우저 창에 직접 입력하여 접속하는 것도 가능합니다. ([스프링 부트(Spring Boot): SPA 라우트(route)를 위한 URL 컨트롤러](http://yoonbumtae.com/?p=2940))

 

\[caption id="attachment\_2949" align="alignnone" width="583"\] ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-24-am-12.26.09.png) 기본 URL에 접속했을 때, `"/"` 에 해당하는 컴포넌트(`Topic`)를 띄움\[/caption\]

 

\[caption id="attachment\_2948" align="alignnone" width="586"\] ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-24-am-12.24.16.png) 다른 URL을 입력하거나 내비게이션 바의 메뉴를 클릭했을 때, 해당 URL의 컴포넌트가 표시됨\[/caption\]
