---
title: "자바스크립트 lodash: debounce와 throttle을 이용하여 함수의 실행 횟수 제한"
date: 2020-01-15
categories: 
  - "DevLog"
  - "JavaScript"
---

_lodash_ 홈페이지: [https://lodash.com/](https://lodash.com/)

`debounce`, `throttle`은 생소한 기능인데요 간단히 요약하면 이벤트의 반복 실행시 콜백 함수의 불필요한 실행을 줄이는 역할을 합니다. 이로 인해 클라이언트가 혜택을 볼 수도 있거나 혹은 서버 측에 불필요한 리퀘스트를 줄일 수도 있습니다.

- `debounce`: 동일 이벤트가 반복적으로 시행되는 경우 마지막 이벤트가 실행되고 나서 일정 시간(밀리세컨드)동안 해당 이벤트가 다시 실행되지 않으면 해당 이벤트의 콜백 함수를 실행합니다.
- `throttle`: 동일 이벤트가 반복적으로 시행되는 경우 이벤트의 실제 반복 주기와 상관없이 임의로 설정한 일정 시간 간격(밀리세컨드)으로 콜백 함수의 실행을 보장합니다.

여기에서는 이 예제를 lodash라는 라이브러리를 사용해 구현하도록 하겠습니다.

## 기본 사용법

기본 사용법은 다음과 같습니다.

```js
_.debounce(콜백함수, 밀리세컨드)
_.throttle(콜백함수, 밀리세컨드)
```

다른 라이브러리에서도 이 기능을 제공하며 라이브러리를 사용하지 않겠다면 해당 기능을 직접 만들수도 있습니다.

## 예제

(모든 예제 JQuery 포함)

 

### 예제 1: debounce (실시간 아이디 검사)

```html
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
        .valid {
            color: green;
        }

        .invalid {
            color: red;
        }
    </style>
</head>

<body>
    <input type="text" id="username">
    <span id="feedback"></span> <span id="test"></span><hr>

    <script src=https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js> </script> 
    <script src=./jquery-3.4.1.min.js> </script> 
    <script>
        ....................
    </script>
</body>
</html>
```

```js
const usernames = ["admin", "test", "test2", "user", "username", "user1", "user2", "user3", "lodash"]

let testCount = 1

function checkUsernameDupl(username) {
    for (let o of usernames) {
        if (o === username) {
            return true
        }
    }
    return false
}
    
const cb1 = e => {
    const isDuplicated = checkUsernameDupl($(e.target).val())
    if ($("#username").val().length >= 4) {
        if (!isDuplicated) {
            $("#feedback").text("사용 가능합니다.").removeClass("invalid").addClass("valid")
        } else {
            $("#feedback").text("이미 아이디가 존재합니다.").removeClass("valid").addClass("invalid")
        }
    }
    $("#test").text("함수 실행횟수: " + testCount++)

}
//$("#username").on("keyup", cb1)
$("#username").on("keyup", _.debounce(cb1, 200))
```

<!-- https://gph.is/g/4g1NLj5 -->
![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnk1Z253NXZudWJmeXRld3U2enZ5aThsZHlqeXNubjR6dm93eTVuNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jtuiikPQqz40umE8Yh/giphy.gif)
 

![](https://media.giphy.com/media/mDBN0Oc9Eh2jdK3HoH/giphy.gif)

 

`debounce` 적용 여부를 비교해 봤을 때 함수 실행횟수 차이가 많이 나는 것을 알 수 있습니다. 전자는 무식하게 키보드가 눌렸을 때마다 실행하지만 후자는 키보드 반복 시 기다렸다가 이후 반복이 끝난 것 같으면 그 이후에 함수를 실행을 하기 때문에 실행 횟수를 절약할 수 있습니다.

참고할 만한 사항으로 `debounce`를 사용하더라도 제이쿼리의 이벤트 파라미터(`e`)가 콜백함수까지 전달이 됩니다. 콜백 함수의 `e.target`은 `debounce`가 적용되었더라도 마찬가지로 정상 동작합니다. 그리고 `debounce` 함수는 위의 경우처럼 제이쿼리 이벤트 파라미터에 바로 사용하는 것이 오류가 나지 않습니다.

 

### 예제 2: throttle (마우스 움직임 감지)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h3>마우스 움직임 이벤트 실행</h3>
    <p>throttle 적용 안한 경우: <span id="test1"></span> 회</p>
    <p>throttle 적용한 경우 <span id="test2"></span> 회</p>
   
    <script src=https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js> </script> 
    <script src=./jquery-3.4.1.min.js> </script> 
    <script>
      ............
    </script>
</body>
</html>
```

```js
let test1Count = 1, test2Count = 1

const cbFuncNotThrottle = e => {
    $("#test1").text(test1Count++)
}

const cbFunc = e => {
    $("#test2").text(test2Count++)
}

$(window).on("mousemove", cbFuncNotThrottle)
$(window).on("mousemove", _.throttle(cbFunc, 500))
```

<!-- https://gph.is/g/Zn6vO9P -->
![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOWJva212MWh5d3FtenM4MWYzb2loamQzYjd0bGJ3OTJ6ZXFobHNuOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ejxrdvUSKJNtJmXl2G/giphy.gif)

자세히 보면 `throttle`을 적용했을 때는 마우스를 얼마나 빨리 움직이든지간에 0.5초 간격으로 콜백 함수가 실행되고 있음을 알 수 있습니다. 하지만 마우스 움직임이 중단되면 콜백 함수는 실행되지 않습니다.
