---
title: "axios: AJAX 데이터 받기 (Promise 기반) + 예제 (JSON 가져오기)"
date: 2019-06-04
categories: 
  - "DevLog"
  - "JavaScript"
tags: 
  - "vue-js"
---

axios 홈페이지: [https://github.com/axios/axios](https://github.com/axios/axios)

#### 사용법

**axios**는 `Promise` 기반의 AJAX 라이브러리입니다. 기본 형태는 다음과 같습니다.

```
axios.get('/user', {
    params: {
      ID: 'anyvalue'
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });  

```

`axios.get` 뿐만 아니라 `post`, `delete`, `put`, `patch` 등 리퀘스트 종류에 따라 사용할 수 있습니다. `then`은 정상적으로 데이터를 받았을 경우 동작하며 `catch`는 에러 캐치, `finally`는 동작 여부와 무관하게 무조건 실행되는 부분입니다. 받은 데이터(JSON 등) 만 추출하고 싶은 경우 `response.data` 로 가져옵니다.

#### 예제 (Vue.js 포함)

퀴즈 카드를 만드는 [예제](https://jsfiddle.net/zo23fts4/)입니다. 데이터 출처는 [\[링크\]](https://support.oneskyapp.com/hc/en-us/articles/208047697-JSON-sample-files)

```
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="container">
  <div id="main-app" >
     <template v-for="(item, index) in message">
      <quiz v-for="(cont, key) in item" v-bind:quiz-inner="cont" v-bind:quiz-key="index" ></quiz>
    </template>    
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
  <script>
    (...)

  </script>
</body>

</html>

```

```jsx
    // 스트링을 대문자화
    Vue.filter('capitalize', function(value) {
      if (!value) return ''
      value = value.toString()
      return value.toUpperCase()
    })

    // 퀴즈 컴포넌트 선언
    Vue.component('quiz', {
      template: `<div class="card border-primary mb-3" style="max-width: 20rem; " >
  <div class="card-header">{{quizKey | capitalize}}</div>
  <div class="card-body">
    <h4 class="card-title">{{quizInner.question}}</h4>
    <li class="card-text" v-for="option in quizInner.options">{% raw %}{{option == quizInner.answer ? option + ' (answer)' : option}}{% endraw %}</li>
  </div>
</div>`,
      props: ['quizInner', 'quizKey']
    })

    var mainApp = new Vue({
      el: '#main-app',
      data: {
        message: 'You loaded this page on ' + new Date().toLocaleString()
      },
      created: function() {
        const self = this
        
        /** == AXIOS get으로 가져오기 == **/
        axios.get('https://support.oneskyapp.com/hc/en-us/article_attachments/202761727/example_2.json')
          .then(response => {
            // handle success
            console.log(response.data, this);
            this.message = response.data.quiz
          })
        /** ========================= **/
      }
    })
```

Vue.js에서 `filter`로 선언한 부분은 `{{variableName | filterName}}` 으로 사용합니다. `created` 안의 부분은 컴포넌트 라이프사이클에서 created 되었을 때 실행합니다.

[![](./assets/img/wp-content/uploads/2019/06/quiz.png)](http://yoonbumtae.com/?attachment_id=1165)
