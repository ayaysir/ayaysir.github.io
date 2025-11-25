---
title: "스프링 부트 Thymeleaf: fragment로 웹 페이지에 header, footer 등 조각 삽입"
date: 2020-07-12
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "thymeleaf"
---

스프링 부트 Thymeleaf: fragment로 웹 페이지에 header, footer 삽입하는 방법입니다. 공통되는 부분을 미리 만들어 놓은 다음 재사용할 수 있습니다.

[전체 소스 보기](https://github.com/ayaysir/awsboard/tree/master/src/main/resources/templates)

 

#### **프로젝트 구조**

 ![](/assets/img/wp-content/uploads/2020/07/-2020-07-12-pm-7.58.56-e1594551583295.png)

 

먼저 HTML 파일을 만든 뒤(**fragments/common.html**) 조각(fragment)로 만들고 싶은 요소의 태그에 `th:fragment="[이름]"` 을 삽입합니다.

```
<head th:fragment="html-head">
    ........
</head>
```

```html
<div th:fragment="header">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
        ....
    </nav>
</div>
```

```html
<div th:fragment="footer">
    <footer class="row mt-2">
        <div class="col-md-12">
            &copy; 2020 BGSMM
        </div>
    </footer>
</div>
```

 

참고로 **common.html**의 전체 내용은 다음과 같습니다.

```html
<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">
<head th:fragment="html-head">
    <meta charset="UTF-8">
    <title>AWS Board (스프링 부트)</title>
    <link rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
          integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
          crossorigin="anonymous">
</head>
<body>
<div th:fragment="header">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
        <a class="navbar-brand" href="#">AWS Board</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarColor02">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="alert('준비중');">Features</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" onclick="alert('준비중');">About</a>
                </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="text" placeholder="Search">
                <button class="btn btn-secondary my-2 my-sm-0" type="submit" onclick="alert('준비중');">Search</button>
            </form>
        </div>
    </nav>
</div>
<div class="row">
    <div class="col-12">
        adfkljfadk;
    </div>
</div>
<div th:fragment="footer">
    <footer class="row mt-2">
        <div class="col-md-12">
            &copy; 2020 BGSMM
        </div>
    </footer>
    <script
            src="https://code.jquery.com/jquery-3.5.1.min.js"
            integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
            crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"
            integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
            crossorigin="anonymous"></script>

    <!-- index.js 추가 -->
    <script src="/js/app/index.js"></script>
</div>
</body>
</html>
```

서버 렌더링을 적용하지 않은 그냥 HTML 스크린샷은 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-12-pm-8.10.40.png)

 

#### **조각을 페이지에 넣기(replace 이용)**

이렇게 해서 조각이 만들어졌습니다. 이것을 삽입하고자 하는 대상 HTML 파일에서 `th:replace="[파일 경로 :: 조각 이름]"` 을 통해 삽입합니다.

```
<head th:replace="fragments/common :: html-head">
    ...........
</head>
```

```html
<body>
    <div class="container">
        <div th:replace="fragments/common :: header">-- thymeleaf header will be inserted here. --</div>

        ........................

        <div th:replace="fragments/common :: footer">-- thymeleaf footer will be inserted here. --</div>
    </div>

</body>
```

 

삽입하기 전 그냥 HTML의 모습은 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-12-pm-8.12.10.png)

이것이 서버 렌더링의 과정을 거치며 `th:replace`가 있는 부분이 해당 이름의 조각으로 대체되고, 최종 결과는 아래 그림처럼 합쳐진 형태가 보여지게 됩니다.

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-12-pm-8.13.55.png)
