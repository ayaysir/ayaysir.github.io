---
title: "jQuery: 제이쿼리 이미지 지연 로딩(lazy loading) 플러그인 (jQuery Lazy)"
date: 2020-12-31
categories: 
  - "DevLog"
  - "JavaScript"
---

[jQuery Lazy 웹사이트](http://jquery.eisbehr.de/lazy/#installation)

이미지의 레이지 로딩을 할 수 있도록 하는 제이쿼리 플러그인입니다.

레이지 로딩이란 인터넷이 느린 환경에서 브라우저가 HTML 컨텐츠를 로딩하는 과정에서 이미지를 같이 로딩에 포함시켜 먹통이 되는 것을 방지하기 위하여, 이미지 데이터를 제외한 HTML을 우선적으로 렌더링한 뒤 이미지는 HTML 로딩이 끝난 후 나중에 불러오는 것을 뜻합니다.

이 플러그인을 사용하면 스크롤을 해서 이미지 영역이 화면에 표시될 때에만 이미지를 로딩하므로 트래픽도 절약할 수 있습니다.

## **방법**

### **1\. HTML 제이쿼리 스크립트 밑에 jQuery Lazy 스크립트를 추가**

HTML의 제이쿼리 스크립트 밑에 jQuery Lazy 스크립트를 추가합니다. 최신 버전이 있다면 해당 cdn 주소를 사용합니다.

```html
<!-- cdnjs -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery.lazy/1.7.9/jquery.lazy.min.js"></script>
```


 

### **2\. 속성에 이미지 주소 입력**

이미지 태그에서 `data-src` 속성을 추가한 뒤 실제 로딩할 이미지 주소를 입력합니다. 만약 이미 태그가 있다면, 기존의 `src`를 `data-src`로 변경합니다. 그리고 src에는 로딩 이미지를 넣습니다.**

### **3\. 클래스에 식별자 추가**

다음 클래스에 고유의 레이지 로딩 식별자 (예: `lazy-img`)를 추가합니다.

```html
<img class="lazy-img" data-src="https://website.con/resources/actual-image.jpg" src="./img/loading.gif">
```

 

### **4\. 레이지 로딩 시작**
스크립트 실행 부분의 처음에 다음 코드를 추가합니다. 주의할 점은 실행함수의 L은 대문자 `L` 입니다.
```js
$(document).ready(function() {
    $(".lazy-img").Lazy()
});
```

기본 코드만으로도 대부분의 상황을 커버할 수 있습니다.

### **추가 옵션**

추가 옵션을 설정하려면 다음과 같이 사용합니다.

```js
$('.lazy').Lazy({
    // 설정 부분 입력
    scrollDirection: 'vertical',
    effect: 'fadeIn',
    visibleOnly: true,
    onError: function(element) {
        console.log('error loading ' + element.data('src'));
    }
});
```

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-31-pm-8.42.08.png)

> 참고: [자바스크립트: IntersectionObserver (1) 이미지 lazy-loading 구현](/posts/자바스크립트-intersectionobserver로-이미지-lazy-loading-구현/)
