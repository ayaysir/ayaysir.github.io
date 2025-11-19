---
title: "자바스크립트: JSONP (JSON Padding) 사용법"
date: 2020-06-03
categories: 
  - "DevLog"
  - "JavaScript"
tags: 
  - "자바스크립트"
---

##### **JSONP(JavaScript Object Notation Padding)이란?**

웹 브라우저에서 CORS 문제를 회피하기 위해 `<script>` 태그를 이용한 꼼수를 사용하여 JSON을 가져오기 위한 방법입니다.

##### **참고: CORS(Cross-Origin Resource Sharing, 교차 출처 리소스 공유)**

> 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제입니다. CORS의 예시로 https://domain-a.com의 프론트 엔드 JavaScript 코드가 XMLHttpRequest를 사용하여 https://domain-b.com/data.json을 요청하는 경우가 있습니다. 보안 상의 이유로, 브라우저는 스크립트에서 시작한 교차 출처 HTTP 요청을 제한합니다. XMLHttpRequest와 Fetch API는 동일 출처 정책을 따릅니다.

 

```
<?

$arr = array("google" => "http//google.com", "yahoo"=> "http://yahoo.com");
$callback_name = $_GET["callback"];

if($_GET['callback']) {
    echo $callback_name."(".json_encode($arr).");";
} else {
    echo json_encode($arr);
}

?>
```

간단한 JSON을 리턴하는 PHP 페이지를 만들었습니다.  [JSON 링크](http://yoonbumtae.com/util/misc/jsonp-example/)를 브라우저 링크에서 열면 잘 열립니다. 하지만 이것을 자바스크립트 내에서 AJAX로 가져오려고 하면 CORS 위반이 됩니다.

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-03-pm-10.49.30.png)

 

JSONP는 JSON을 `함수명({...JSON...})` 함수의 실행형으로 리스폰스를 받아 실행하는 방법입니다. `<script>`에서 가져오는 코드는 CORS가 적용되지 않는다는 점을 이용한 것입니다. 당장 스크립트부터 CORS가 적용된다고 한다면 인터넷에 있는 제이쿼리를 비롯한 수많은 CDN들은 무용지물이 될 것입니다.

다만 JSONP가 만능은 아닙니다.

- `GET` 방식만 가능
- 서버에서 JSONP를 지원하지 않으면 사용 불가

이러한 경우 서버 쪽에서 특정 URL에 대한 CORS 권한을 허용해주거나, 자체 웹 서버를 운영하고 있다면 프록시 기법으로 우회해서 가져올 수 있는 방법이 있는데 (CORS는 웹 브라우저의 자바스크립트 단에서만 적용되고 일반적인 웹 서버에서는 적용되지 않는 경우가 많습니다.) 여기서는 다루지 않겠습니다. 웹서버 운영자와 아는 사이라면 권한을 추가해달라고 하는게 제일 최선의 방법일 수 있습니다.

JSONP를 지원한다는 가정하에 계속 진행하면, 일반 JSON과 JSONP의 차이는 다음과 같습니다.

```
{"google":"http\/\/google.com","yahoo":"http:\/\/yahoo.com"}
```

```
jsonpProc({"google":"http\/\/google.com","yahoo":"http:\/\/yahoo.com"});
```

위는 일반적인 JSON인데, 아래에 뭔가 추가되었습니다. `jsonProc()` 이라는 함수에 파라미터를 객체로 입력한 것과 똑같은 형태입니다. 이것을 CORS가 적용되지 않는 `<script>`에 추가하고 그 밑에 `jsonProc` 함수를 작성하면 JSONP가 결과적으로 함수로 실행된 형태가 되는것이죠.

서버로 보내는 파라미터는 특별한 명칭이 정해지지는 않았지만 `callback`이라는 이름을 사용해 리퀘스트하면 JSONP를 지원하는 서버에서는 JSONP를 요청하는 것이라고 통용되고 있습니다.

 

먼저 순수 자바스크립트(바닐라 자바스크립트라 함)만으로 가져오는 법과 JQuery를 이용해 가져오는 법이 있습니다.

 

**자바스크립트**는 다음과 같이 불러옵니다.

```
// src의 콜백 함수 이름은 밑에서 정의할 함수 이름과 동일하게
function getJsonUsePureJS() {
    
    const script = document.createElement("script");
    script.src = "http://yoonbumtae.com/util/misc/jsonp-example/?callback=getJsonUsePureJSCallback"

    document.getElementsByTagName('head')[0].appendChild(script);
}

// 여기에 JSONP를 가져온 후 실행할 작업을 설정
function getJsonUsePureJSCallback(obj) {
    console.log("vanilla js", obj)
}
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-03-pm-11.11.34.png)

이론상으로는 `<script>`에 url을 지정한 뒤 밑에서 함수 선언만 하면 잘 실행될 것 같은데 최신 크롬 브라우저에서는 진행이 안되서 자바스크립트에서 DOM을 만든 뒤 강제 추가하는 형식으로 JSONP를 실행하였습니다.

 

**JQuery**를 이용한 방법은 다음과 같습니다. JQuery는 JSONP를 잘 지원합니다.

```js
function getJsonpUseJQuery1() {
    $.ajax({
        url: "http://yoonbumtae.com/util/misc/jsonp-example/",
        dataType: "jsonp",
        jsonpCallback: "sendMeJsonp"
    }).then(res => {
        console.log("JQuery 1", res)
    });
}
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-03-pm-11.03.38.png)

`dataType`을 `"jsonp"`, `jsonpCallback`에서 콜백으로 사용할 **함수의 이름을 지정**하면 알아서 `callback` 파라미터로 보내줍니다.

 

```js
function getJsonpUseJQuery2() {
    $.getJSON("http://yoonbumtae.com/util/misc/jsonp-example/?callback=?", res => {
        console.log("JQuery 2", res)
    })
}
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-03-pm-11.06.35.png)

더 간단한 방법입니다. 여기서 `callback=?`로 지정하면 JQuery에서 생성한 무작위 함수 이름을 리퀘스트합니다.
