---
title: "자바스크립트: 다국어 지원 (국제화 Internationalization) 1"
date: 2020-06-10
categories: 
  - "DevLog"
  - "JavaScript"
---

국제화(Internationalization)는 홈페이지의 내용을 다국어로 지원하는 것을 뜻합니다.

백엔드 측에서 하는 방법이 있고 프론트엔드 측에서 하는 방법이 있는데 백엔드에 대한 국제화 작업은 스프링 부트, Thymeleaf 기준으로 한 다음 글을 참조해주세요. [Spring Boot: 국제화(Internationalization)](http://yoonbumtae.com/?p=754)

제이쿼리에서도 국제화 지원을 위한 기능이 있고 이러한 라이브러리([i18n](https://www.i18next.com/))도 있는데 처음에는 라이브러리 없이 진행해보도록 하겠습니다.

먼저 자바스크립트에서 브라우저의 언어를 알아내는 방법은 다음과 같습니다.

```
function getLanguage() {
  return navigator.language || navigator.userLanguage;
}
```

출처 [바로가기](https://webisfree.com/2018-05-25/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%84%A4%EC%A0%95-%EC%96%B8%EC%96%B4-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%96%B8%EC%96%B4-%ED%99%95%EC%9D%B8%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-navigator)

최신 브라우저라면 `ko-KR`, `en-US` 등으로 값이 리턴될 것입니다. 이러한 [언어 코드 테이블](http://www.lingoes.net/en/translator/langcode.htm)은 이 사이트에 가면 표로 나와 있습니다.

 

#### **예제: 라이브러리 없는 간단한 다국어 적용 페이지**

https://gist.github.com/ayaysir/55cc8892609b37e3a57e9fb166b7b2db

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-10-pm-11.47.03.png)

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-10-pm-11.47.26.png)
