---
title: "Vue.js, Vue-router: URL의 쿼리 파라미터 알아내기, 한 개의 템플릿에 여러 주소 부여, 브라우저 창 강제로 주소 바꾸기"
date: 2020-11-05
categories: 
  - "DevLog"
  - "Vue.js"
---

## **현재 주소(URL)의 쿼리 파라미터 알아내기**

URL의 쿼리 파라미터란 아래 빨간색 박스처럼 `?` 뒤에 지정하는 파라미터를 뜻합니다. 여러 개를 연결할 때는 `&` 를 씁니다.

 ![](/assets/img/wp-content/uploads/2020/11/screenshot-2020-11-05-pm-10.32.15.png)

여기서 `uwasaKeyword` 의 쿼리 파라미터는 무슨 값을 가지고 있는지 알고 싶다면 다음과 같이 입력합니다.

```js
// this.$route.query.[키이름]
const uwasaKeyword = this.$route.query.uwasaKeyword
```

저 값을 콘솔로 출력하면 `"미술"` 이라는 결과가 나옵니다.

 

## **한 개의 템플릿에 여러 주소 부여**

Vue-router 메인 설정 JS 파일에서 다음과 같이 `alias` 설정을 추가합니다. 배열 형태로 되어 있으며, 여러 주소를 추가할 수 있습니다.

```js
import Vue from 'vue'
import Router from 'vue-router'

// 이하 임포트 생략

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: "/",
            name: "Topic",
            component: Topic,
            alias: ["/v/search"]
        }, // 이하 생략

    ]
})
```

앞으로 `Topic` 템플릿을 불러올 때 `/` 와 `/v/search`는 똑같은 결과를 가져옵니다.

 

 ![](/assets/img/wp-content/uploads/2020/11/screenshot-2020-11-05-pm-10.38.47.png)

 ![](/assets/img/wp-content/uploads/2020/11/screenshot-2020-11-05-pm-10.39.39.png)

 

## **브라우저 창 강제로 주소(URL)만 바꾸기**

이 부분은 단순한 JS 이지만 내용이 연관되어 있기 때문에 올립니다. [window 객체의 pushState](https://developer.mozilla.org/ko/docs/Web/API/History/pushState)를 사용합니다.

```js
history.pushState(null, "", `/custom/url`)
```

1번째 파라미터(필수)는 다음 주소로 넘길 객체를 설정합니다. `history.state` 를 사용하면 불러올 수 있습니다. 하지만 지금은 사용할 일이 없기 때문에 `null` 로 입력합니다.

2번째 파라미터(필수)는 브라우저 창의 제목을 바꾸는데 현재 대부분의 브라우저가 지원하지 않습니다. 빈 스트링을 입력합니다.

3번째 파라미터(선택사항)는 바꿀 주소를 입력합니다. 예를 들어 도메인이 `xxx.com`인 경우, 앞에 `/`를 추가하면 절대 경로가 되어서 현재 위치가 어떻든간에 `xxx.com/custom/url` 로 변경합니다. 반대의 경우 상대 경로로 추가되기 때문에 만약 현재 위치의 url이 `xxx.com/user/1.html` 인 경우 최종 주소는 `xxx.com/user/custom/url`이 됩니다. 원래 생략 가능하지만 지금 목적은 주소를 바꾸는 것이므로 여기에 주소를 입력합니다.
