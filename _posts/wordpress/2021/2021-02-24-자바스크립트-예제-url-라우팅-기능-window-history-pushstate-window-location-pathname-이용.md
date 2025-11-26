---
title: "자바스크립트 예제: URL 라우팅 기능 (window.history.pushState, window.location.pathname 이용)"
date: 2021-02-24
categories: 
  - "DevLog"
  - "JavaScript"
---

React나 Vue 등의 SPA에서 볼 수 있는 SPA 라우팅을 흉내내는 예제입니다.

참고로 `window.location.pathname`을 이용한 URL 입력 기능을 실행하려면 SPA 라우팅을 지원하는 HTTP 서버가 필요합니다.

간단하게 설정할 수 있는 서버로 크롬 브라우저 플러그인인 [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related) 을 소개합니다.

 

해당 앱을 실행하면 설정 창이 나옵니다. 여기서 `index.html` 파일이 있는 디렉토리를 선택하고 `Show Advanced Options` 를 클릭하면 고급 설정창이 나옵니다.

 ![](/assets/img/wp-content/uploads/2021/02/-2021-02-25-am-12.01.37-e1614179040829.jpg)

고급 설정창에서 `Enable mod-rewrite (for SPA)`를 활성화합니다.

 ![](/assets/img/wp-content/uploads/2021/02/-2021-02-25-am-12.02.38-e1614179057248.jpg)

 

## **window.location 객체에서 정보 얻기**

이 객체에서 URL과 관련된 다양한 정보를 얻을 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/02/-2021-02-25-am-12.12.26-e1614179565441.png)

 

## **URL에 포함된 pathname을 읽기**

여기서 `pathname` 이란 _http://abc.com/user/1_ 이라는 URL이 있다고 하면 `/user/1` 이부분이 pathname 입니다.

`window.location.pathname`에서 값을 가져온 뒤 `split()`하면 배열로 여러 정보를 얻을 수 있습니다. 이 중 필요한 정보만 취합해서 사용합니다.

```js
// URL로 주소 입력하기 예) /user/1
let [, service, value] = window.location.pathname.split("/") // ["" ,"user", "1"]
```

 

이렇게 하면 `service`에 `user`, `value`에 `1`이 전달됩니다.

 

## **URL을 입력받기**

인물 정보를 보내준는 외부 API가 있고 URL에 `/user/1` 을 입력하면 그 사람에 대한 정보를 보여주고 싶다고 할 때, 다음과 같이 `fetch` 정보에 아이디를 넘겨주면 됩니다.

```js
if (service === "user") {
    fetchUser(value)
}

async function fetchUser(userId) {
    
    try {
        const response = await fetch(`https://reqres.in/api/users/${userId}?delay=1`)
        const json = await response.json()
        const data = json.data
        
        // ... 이하 생략 ... //
    } catch(err) {
        alert("오류가 발생했습니다.")
    }        
        
}
```

이렇게 하면 URL을 직접 입력했을 때, 그 사람에 대한 정보를 보여주게 됩니다.

 ![](/assets/img/wp-content/uploads/2021/02/-2021-02-25-am-12.17.07-e1614179885348.png)

<!-- <iframe width="480" height="402" src="https://giphy.com/embed/RkH8KdMfhHlQeWKwn5" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjh2dDE4cGU1ZWhpbGl2OHNyd2huNDVzNXk0b3JyOXdzenBzZHYyMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RkH8KdMfhHlQeWKwn5/giphy.gif)
 

## **페이지는 이동하지 않고 URL만 변경하기**

`window.history.pushState()`를 이용합니다. 이 기능은 표면적인 URL 변경 뿐만 아니라 뒤로가기 기능도 작동하므로 실제 웹 페이지를 탐색하는 듯한 느낌을 주게 됩니다.

이 예제에서 NEXT나 PREV 버튼을 누르면 웹 페이지가 이동하는 것이 아닌, 네트워크에서 정보만 다시 받아와 페이지 내의 정보를 교체하는 형식으로 진행합니다. (전체 코드 참고)

인물 정보는 교체되었지만 URL이 그대로라면 어색할 것입니다. 따라서 URL 교체 작업이 필요합니다.

`pushState()`의 사용법은 다음과 같습니다.

- 1번째 파라미터(필수)는 다음 주소로 넘길 객체를 설정합니다. `history.state` 를 사용하면 불러올 수 있습니다. 하지만 지금은 사용할 일이 없기 때문에 `null` 로 입력합니다.
- 2번째 파라미터(필수)는 브라우저 창의 제목을 바꾸는데 현재 대부분의 브라우저가 지원하지 않습니다. 빈 스트링을 입력합니다.
- 3번째 파라미터(선택사항)는 바꿀 주소를 입력합니다. 예를 들어 도메인이 `xxx.com`인 경우, 앞에 `/`를 추가하면 절대 경로가 되어서 현재 위치가 어떻든간에 `xxx.com/custom/url` 로 변경합니다. 반대의 경우 상대 경로로 추가되기 때문에 만약 현재 위치의 url이 `xxx.com/user/1.html` 인 경우 최종 주소는 `xxx.com/user/custom/url`이 됩니다. 원래 생략 가능하지만 지금 목적은 주소를 바꾸는 것이므로 여기에 주소를 입력합니다.

 

```js
function setURL(value) {
    history.pushState(null, "", value)
    fetchUser(value)
}
```

```
// 참고: 버튼 이벤트 코드
const btnNext = $(".btn-next")
const btnPrev = $(".btn-prev")
btnNext.addEventListener("click", e => {
    value = Number(value) + 1
    setURL(value)

})
btnPrev.addEventListener("click", e => {
    value = Number(value) - 1
    setURL(value)
})
```

<!-- <iframe width="480" height="402" src="https://giphy.com/embed/8hATwDMedO1tZXerOf" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTMzdHk5cHVpY2NmMGsxOXdpejV5anBkaHpoM3I0b283c21wazdheiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8hATwDMedO1tZXerOf/giphy.gif)
 

## **전체 코드**

```js
function $(selector) {
    return document.querySelector(selector)
}

const id = $(".id")
const profile = $(".profile")
const email = $(".email")
const fullname = $(".fullname")
const loading = $(".loading")
const container = $(".container")

// URL로 주소 입력하기
let [, service, value] = window.location.pathname.split("/")
if (service === "user") {
    fetchUser(value)
}

function setURL(value) {
    history.pushState(null, "", value)
    fetchUser(value)
}

async function fetchUser(userId) {
    loading.style.display = "flex"
    
    try {
        const response = await fetch(`https://reqres.in/api/users/${userId}?delay=1`)
        const json = await response.json()
        const data = json.data
        loading.style.display = "none"
        container.style.display = "block"
        
        profile.src = data.avatar
        email.textContent = data.email
        email.setAttribute("href", `mailto:${data.email}`)
        fullname.textContent = `${data.first_name} ${data.last_name}`
        id.textContent = `${data.id}. ${data.first_name} ${data.last_name}`
    } catch(err) {
        alert("오류가 발생했습니다.")
        value = 1
        setURL(value)
    }        
        
}

const btnNext = $(".btn-next")
const btnPrev = $(".btn-prev")
btnNext.addEventListener("click", e => {
    value = Number(value) + 1
    setURL(value)

})
btnPrev.addEventListener("click", e => {
    value = Number(value) - 1
    setURL(value)
})
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Show User</title>
    <style>
        .loading {
            display: none; 
            width: 100%; 
            height: 100%; 
            justify-content: center; 
            flex-direction: column; 
            align-items: center;
            position: absolute;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.1)
        }
        
        .container {
            display: none;
        }
        
        .profile {
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="loading">loading...</div>
    <div class="container">
        <h3 class="id"></h3>
        <img src="" class="profile" alt="">
        <ul>
            <li>email: <a href="mailto:" class="email"></a></li>
            <li>name: <span class="fullname"></span></li>
        </ul>
        <button class="btn-prev">PREV</button>
        <button class="btn-next">NEXT</button>
    </div>

    <script>    
        // ............... //
    </script>
</body>

</html>
```
