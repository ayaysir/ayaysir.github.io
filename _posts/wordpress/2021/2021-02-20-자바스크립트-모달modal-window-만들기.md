---
title: "자바스크립트: 모달(modal window) 만들기"
date: 2021-02-20
categories: 
  - "DevLog"
  - "JavaScript"
---

모달 창이란 사용자 인터페이스 디자인 개념에서 자식 윈도에서 부모 윈도로 돌아가기 전에 사용자의 상호동작을 요구하는 창을 말합니다. 아래 그림에서 가운데 하얀색 부분이 그 예라고 할 수 있습니다.

이 모달창은 팝업과 비슷하게 정보를 전달하나 팝업과 다르게 별도의 창이나 탭을 생성하지 않고 페이지 내에서 레이어를 이용해 정보를 보여준다는 점이 차이점이라고 할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/02/-2021-02-20-pm-11.46.05-e1613832383560.png)

여기서 만들 모달 창은 디자인이나 모듈화 같은 고급 기법보다는 기본적인 이벤트 중심으로만 설명하겠습니다. 모달 창은 기본적으로 다음 이벤트를 가집니다.

- 특정 버튼을 누르면 모달창이 켜집니다.
- 모달창의 클로즈(x) 버튼을 누르면 모달창이 꺼집니다.
- 모달창 바깥 영역 (위 그림에서 밝기가 어두운 부분) 을 클릭하면 모달창이 꺼집니다.
- 모달창이 켜진 상태에서 ESC 버튼을 누르면 모달창이 꺼집니다.

 

## **HTML + CSS로 모달창 만들기**

일단 아무 기능이 없는 모달창을 만들어 보겠습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Modal</title>
    <style>
        #modal.modal-overlay {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background: rgba(255, 255, 255, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(1.5px);
            -webkit-backdrop-filter: blur(1.5px);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        #modal .modal-window {

            background: rgba( 69, 139, 197, 0.70 );
            box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
            backdrop-filter: blur( 13.5px );
            -webkit-backdrop-filter: blur( 13.5px );
            border-radius: 10px;
            border: 1px solid rgba( 255, 255, 255, 0.18 );

            width: 400px;
            height: 500px;
            position: relative;
            top: -100px;
            padding: 10px;
        }

        #modal .title {
            padding-left: 10px;
            display: inline;
            text-shadow: 1px 1px 2px gray;
            color: white;
            
        }

        #modal .title h2 {
            display: inline;
        }

        #modal .close-area {
            display: inline;
            float: right;
            padding-right: 10px;
            cursor: pointer;
            text-shadow: 1px 1px 2px gray;
            color: white;
        }
        
        #modal .content {
            margin-top: 20px;
            padding: 0px 10px;
            text-shadow: 1px 1px 2px gray;
            color: white;
        }
    </style>
</head>

<body>
    <div id="container">
        <h2>Lorem Ipsum</h2>
        <button id="btn-modal">모달 창 열기 버튼</button>
        <div id="lorem-ipsum"></div>
    </div>

    <div id="modal" class="modal-overlay">
        <div class="modal-window">
            <div class="title">
                <h2>모달</h2>
            </div>
            <div class="close-area">X</div>
            <div class="content">
                <p>가나다라마바사 아자차카타파하</p>
                <p>가나다라마바사 아자차카타파하</p>
                <p>가나다라마바사 아자차카타파하</p>
                <p>가나다라마바사 아자차카타파하</p>
                
            </div>
        </div>
    </div>

    <script>
        const loremIpsum = document.getElementById("lorem-ipsum")

        fetch("https://baconipsum.com/api/?type=all-meat&paras=200&format=html")
            .then(response => response.text())
            .then(result => loremIpsum.innerHTML = result)
    </script>
</body></html>
```

이 모달창은 기본적인 틀만 유지한다면 자유롭게 디자인해도 상관없습니다. 다만, 맨 위의 그림에서 배경이 어두워진것을 볼 수 있는데 이런 식으로 모달창과만 인터랙션하도록 유도할 필요가 있습니다. 이 부분을 오버레이라 하며, 브라우저 창 전체를 덮는 형태로 설정한 다음 모달창을 그 위에 올려놓으면 됩니다.

그리고 오버레이 레이어 `display: flex` 부분을 통해 모달 창을 한가운데로 위치시킬 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/02/-2021-02-20-pm-11.54.35-e1613832900474.png)

이 모달에 이벤트를 부여하겠습니다.

 

## **특정 버튼을 누르면 모달창이 켜지게 하기**

모달의 초기 상태를 `display: none;`으로 했다가 특정 버튼을 클릭하면 `display: flex;` 으로 변하게 하면 됩니다.

```css
#modal.modal-overlay {
    ... 
    display: none;
    ...  
}
```

```js
const modal = document.getElementById("modal")
const btnModal = document.getElementById("btn-modal")
btnModal.addEventListener("click", e => {
    modal.style.display = "flex"
})
```

 

## **모달창의 클로즈(x) 버튼을 누르면 모달창이 꺼지게 하기**

`X`(클로즈) 버튼에 위 예제와 반대되는 이벤트를 부여합니다.

```js
const closeBtn = modal.querySelector(".close-area")
closeBtn.addEventListener("click", e => {
    modal.style.display = "none"
})
```

 

## **모달창 바깥 영역을 클릭하면 모달창이 꺼지게 하기**

모달 영역 외의 오버레이를 클릭하면 꺼지는 이벤트를 만들면 됩니다.

```js
modal.addEventListener("click", e => {
    const evTarget = e.target
    if(evTarget.classList.contains("modal-overlay")) {
        modal.style.display = "none"
    }
})
```

모달 창 외의 영역을 클릭하면 이벤트 타깃 요소에 `modal-overlay` 클래스가 있으므로 종료하고, 모달 창을 클릭하면 이벤트 타깃 요소에 `modal-overlay`가 없기 때문에 종료하지 않습니다.

그리고 모달 오버레이에 이벤트를 부여함으로써 모달 창 및 오버레이 외 다른 요소에 이벤트를 부여할 필요도 없습니다.

 

## **모달창이 켜진 상태에서 ESC 버튼을 누르면 모달창이 꺼지게 하기**

```js
window.addEventListener("keyup", e => {
    if(modal.style.display === "flex" && e.key === "Escape") {
        modal.style.display = "none"
    }
})
```

모달이 켜져 있는 상태에서, 그 키가 `ESC` 키라면 창을 닫습니다.

 

## **전체 자바스크립트 코드**

```js
const loremIpsum = document.getElementById("lorem-ipsum")

fetch("https://baconipsum.com/api/?type=all-meat&paras=200&format=html")
    .then(response => response.text())
    .then(result => loremIpsum.innerHTML = result)

const modal = document.getElementById("modal")

function modalOn() {
    modal.style.display = "flex"
}

function isModalOn() {
    return modal.style.display === "flex"
}

function modalOff() {
    modal.style.display = "none"
}

const btnModal = document.getElementById("btn-modal")
btnModal.addEventListener("click", e => {
    modalOn()
})

const closeBtn = modal.querySelector(".close-area")
closeBtn.addEventListener("click", e => {
    modalOff()
})

modal.addEventListener("click", e => {
    const evTarget = e.target
    if(evTarget.classList.contains("modal-overlay")) {
        modalOff()
    }
})

window.addEventListener("keyup", e => {
    if(isModalOn() && e.key === "Escape") {
        modalOff()
    }
})
```

 

<!-- <iframe width="468" height="480" src="https://giphy.com/embed/eS1sAkXR09B8sBzLoS" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWZlZnV5dTNzaHRqMW42Y2dpOXk1aDR2bmM0OWRnOGViMzBwZW5yMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eS1sAkXR09B8sBzLoS/giphy.gif)