---
title: "Spring Boot: Webjars (Bootstrap, JQuery 등의 프론트엔드 라이브러리를 메이븐을 통해 관리)"
date: 2019-12-09
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "thymeleaf"
---

Webjars는 스프링 부트에서 _Bootstrap_, _JQuery_ 등의 프론트엔드 라이브러리를 스프링 프레임워크가 자체적으로 관리하도록 하는 방법 중 하나입니다. 예제로 부트스트랩과 JQuery를 추가하겠습니다.

## 방법

### 1\. [webjars.org](https://webjars.org)를 접속한 다음 Popular WebJars 에서 Build Tool: Maven을 선택합니다.

![webjars.org](/assets/img/wp-content/uploads/2019/12/screenshot-2019-12-09-pm-11.02.35.png)

 

### 2\. 사용하고자 하는 라이브러리의 `<dependency/>` 안의 내용을 복사한 다음 `pom.xml`의 `<dependencies/>` 태그 내에 추가합니다.

```xml
  <dependencies>
...
    <!-- webjars.org -->

    <dependency>
      <groupId>org.webjars</groupId>
      <artifactId>bootstrap</artifactId>
      <version>4.4.1</version>
    </dependency>
...
  </dependencies>
```

 

### 3\. 웹서버가 실행중이라면 종료 후 프로젝트를 새로고침합니다. 프로젝트를 새로고침 하지 않는 경우 적용이 안됩니다.

 

### 4\. 뷰 페이지에 라이브러리를 추가합니다.

 ![Files for jquery](/assets/img/wp-content/uploads/2019/12/screenshot-2019-12-09-pm-11.06.28.png)
 
 사용할 경로는 위 1번 홈페이지에서 `Files`를 클릭하면 경로가 나옵니다. `META-INF/resources` 부분은 제외하고 나머지 부분(`/webjars/...`)을 경로로 사용합니다.

```html
<link rel="stylesheet" th:href="@{/webjars/bootstrap/4.4.1/css/bootstrap.css}">
<script th:src="@{/webjars/jquery/3.4.1/jquery.min.js}"></script>
```

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
  xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">
<head>
<meta charset="UTF-8">
<title>Select Menu</title>
<link rel="stylesheet" th:href="@{/webjars/bootstrap/4.4.1/css/bootstrap.css}">
</head>
<body class="container">

(.... 생략 ....)

  <script th:src="@{/webjars/jquery/3.4.1/jquery.min.js}"></script>
  <script>
    var testMsg = $(".navbar-brand").text()
    $(".to-replace").text("JQUERY TEST: " + testMsg)
  </script>
</body>
</html>
```

위에서 `th:href`나 `th:src`를 사용하지 않고 아래처럼 사용하는것도 가능합니다만, Thymeleaf를 사용하고 있다면 위의 방법을 따를 것을 권장합니다. 아래 내용은 JSP나 JSTL 페이지에서도 적용 가능합니다.

```html
<link rel="stylesheet" href="/webjars/bootstrap/4.4.1/css/bootstrap.css">
<script src="/webjars/jquery/3.4.1/jquery.min.js"></script>
```

## 실행 결과
 

 ![결과](/assets/img/wp-content/uploads/2019/12/screenshot-2019-12-09-pm-11.19.02.png)
