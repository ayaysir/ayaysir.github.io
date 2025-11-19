---
title: "자바스크립트, HTML: 이벤트 버블링, 캡처링, 위임(delegation) - 동적 요소에 이벤트 할당"
date: 2020-09-18
categories: 
  - "DevLog"
  - "JavaScript"
---

 ![](/assets/img/wp-content/uploads/2020/09/Cap-2013-08-20-12-01-21-955.jpg)

#### **이벤트 버블링**

하위 요소의 이벤트가 상위까지 전달되는 현상입니다. 예를 들어 위의 그림에서 `<a>` 태그를 클릭했는데 `<a>` 태그에 걸려있는 이벤트가 실행되는 것에 더해 상위 요소 `<li>`, `<ul>` 에 걸려있는 이벤트까지 같이 실행되는 현상을 말합니다.

자바스크립트에서 이것을 방지하려면 `event.stopPropagation()`를 사용합니다.

아래는 이벤트 버블링이 적용되는 코드입니다. `<a>` 만 클릭해도 모든 이벤트가 발동됩니다.

```js
const vacation = document.querySelector(".vacation")
const expand = document.querySelector(".expand")

expand.addEventListener("click", event => {
    console.log("expand")
})

vacation.addEventListener("click", event => {
    console.log("vacation")
})
```

 ![](/assets/img/wp-content/uploads/2020/09/screenshot-2020-09-18-pm-2.09.15.png)

 

이 코드의 버블링을 막은 결과는 다음과 같습니다.

```js
const vacation = document.querySelector(".vacation")
const expand = document.querySelector(".expand")

expand.addEventListener("click", event => {
    console.log("expand")
    event.stopPropagation()
})

vacation.addEventListener("click", event => {
    console.log("vacation")
})
```

 ![](/assets/img/wp-content/uploads/2020/09/screenshot-2020-09-18-pm-2.24.51.png)

이벤트 버블링을 막는 행위는 지양하는 것이 좋다고 합니다. ([이유](https://ko.javascript.info/bubbling-and-capturing))

 ![](/assets/img/wp-content/uploads/2020/09/screenshot-2020-09-18-pm-2.27.12.png)

#### **이벤트 캡처링**

이벤트 캡처링은 버블링과 반대로 상위 요소의 이벤트가 하위 요소로 전달되는 현상을 말합니다. 이벤트 캡처링은 일반적인 상황에서는 발생하지 않습니다. `addEventListener`에서 캡처링 옵션에 대한 파라미터가 있는데 기본값은(입력하지 않으면) `false`이기 때문에 캡처링이 발생하지 않습니다.

```
<ul style="background-color: blueviolet">
    <li class="vacation" style="background-color: antiquewhite">
        <a href="#" class="expand">Show comments</a>
    </li>
</ul>
```

```js
const vacation = document.querySelector(".vacation")
const expand = document.querySelector(".expand")
const $ul = document.querySelector("ul")

expand.addEventListener("click", event => {
    console.log("expand")
    event.stopPropagation()
})

vacation.addEventListener("click", event => {
    console.log("vacation")
})

$ul.addEventListener("click", event => {
    console.log("ul")
}) // capturing option: 기본값 false
```

 ![](/assets/img/wp-content/uploads/2020/09/screenshot-2020-09-18-pm-2.33.15.png)

 

이벤트 캡처링을 사용하려면 `$ul`에 할당된 이벤트의 옵션을 다음과 같이 변경합니다.

```
$ul.addEventListener("click", event => {
    console.log("ul")
}, true) // capturing option: 기본값 false
```

 

 ![](/assets/img/wp-content/uploads/2020/09/-2020-09-18-pm-2.37.10-e1600407520899.png)

보라색 부분을 클릭하면 `<li>` 태그에 할당된 이벤트까지 실행이 됩니다. `<li>` 태그에서 이벤트가 멈춘 이유는 여기의 이벤트는 캡처 옵션이 `false`이기 때문입니다.

 

#### **이벤트 위임(Event Delegation)** 

이벤트 위임은 위의 이벤트 현상을 이용한 기법으로 동적으로 생성한 요소들에 이벤트를 부여할 때 도움이 됩니다.

아래 코드는 초기에 자바스크립트를 학습할 때 자주 하던 실수 중 하나로, 아래처럼 코드를 작성하면 초기 요소에만 이벤트가 작동하며, 동적으로 추가된 요소에서는 이벤트가 작동하지 않습니다.

```
<ul id="item-box">
    <li class="item">초기 요소 1</li>
    <li class="item">초기 요소 2</li>
    <li class="item">초기 요소 3</li>
</ul>
```

```js
const btnAddItem = document.querySelector("#btn-add-item")
const itemBox = document.querySelector("#item-box")

let start = 4

btnAddItem.addEventListener("click", event => {
    for(let i = start; i <= start + 10; i++) {
        const $li = document.createElement("li")
        $li.classList.add("item")
        $li.textContent = `동적 요소 ${i}`
        itemBox.appendChild($li)
    }
    start += 10 + 1
})

// 동적으로 추가되는 요소에는 이벤트가 할당되지 않는 코드
const items = document.querySelectorAll(".item")
items.forEach(el => {
    el.addEventListener("click", event => {
        console.log(event.target.textContent)
    })
})
```

 

 ![](/assets/img/wp-content/uploads/2020/09/screenshot-2020-09-18-pm-2.59.32.png)

 

초기요소 외에는 이벤트가 부여되지 않았습니다. 위의 `addEventListener`는 이미 생성된 요소에만 리스트를 부여할 뿐 앞으로 생성될 것은 고려하지 않으며, 동적 요소가 추가되었다고 해서 `forEach`문이 다시 실행될 일도 당연히 없기 때문입니다.

물론 `$li` DOM을 생성할 때 이벤트를 추가한 뒤 `appendChild`하면 동적요소에도 이벤트가 부여될 수 있습니다. 하지만 이 방법 자체가 요소마다 이벤트를 부여하는 것이라 시스템 자원의 낭비가 있습니다.

이럴 때 이벤트 위임 기법을 사용하면 이벤트의 생성을 절약할 수 있으면서도 동적 생성된 요소에 대한 이벤트도 대비할 수 있습니다.

`event.target`은 이벤트가 발생했을 때 이벤트가 발생한 요소가 어디인지를 찾아 반환합니다. 이벤트는 버블링에 의해 제일 밑에서부터 실행됩니다. 예를 들어 맨 위의 그림에서 `<ul>` 태그에 클릭 이벤트가 할당되었는데 제일 밑에 있는 `<a>` 태그를 클릭한 경우 이벤트 버블링 현상에 의해 `<ul>` 태그의 이벤트에서 감지가 됩니다. 이 때 `event.target`은 이벤트가 처음 시작한 `<a>` 태그를 반환합니다.

 

이러한 기법을 이용해 바로 위 예제의 코드를 고치면 다음과 같습니다.

```
// 이벤트 위임을 사용하여 동적 요소에도 이벤트가 할당되도록 한 코드
itemBox.addEventListener("click", event => {
    const evTarget = event.target
    if(evTarget.classList.contains("item")) {
        console.log(evTarget.textContent)
    }
})
```

 ![](/assets/img/wp-content/uploads/2020/09/screenshot-2020-09-18-pm-3.24.21.png)

상위 요소인 `<ul>` 에 `addEventListener`로 이벤트를 추가하고 `event.target`을 이용해 이벤트가 시작한 요소를 찾아 해당 요소가 `item`이라는 클래스를 가지고 있다면 이벤트가 동작하도록 변경했습니다. 이를 통해 `forEach`로 번거롭게 이벤트를 부여하는 과정도 없앴고 동적 요소에도 이벤트가 정상적으로 동작하게 되었습니다.
