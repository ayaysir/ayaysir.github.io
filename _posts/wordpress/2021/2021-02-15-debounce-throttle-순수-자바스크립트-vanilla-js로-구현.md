---
title: "자바스크립트: Debounce, Throttle 순수 자바스크립트 (Vanilla JS)로 구현"
date: 2021-02-15
categories: 
  - "DevLog"
  - "JavaScript"
---

참고 글: [자바스크립트 lodash: debounce와 throttle을 이용하여 함수의 실행 횟수 제한](http://yoonbumtae.com/?p=2102)

 

- `debounce`: 동일 이벤트가 반복적으로 시행되는 경우 마지막 이벤트가 실행되고 나서 일정 시간(밀리세컨드)동안 해당 이벤트가 다시 실행되지 않으면 해당 이벤트의 콜백 함수를 실행합니다.
- `throttle`: 동일 이벤트가 반복적으로 시행되는 경우 이벤트의 실제 반복 주기와 상관없이 임의로 설정한 일정 시간 간격(밀리세컨드)으로 콜백 함수의 실행을 보장합니다.

 

이러한 기능을 라이브러리를 사용하지 않고 기본 자바스크립트(ES6+) 에서 사용하는 방법입니다.

 

#### **Debounce**

```js
function debounce(callback, limit = 100) {
    let timeout
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            callback.apply(this, args)
        }, limit)
    }
}
```

- `callback`: 실행 대상이 되는 콜백 함수입니다.
- `limit`: 얼마 후에 함수를 실행할 지 결정하며 millisecond 단위입니다.
- `limit` 이내에 함수가 반복 호출될 경우 `timeout`이 `clearTimeout`되므로 실행되지 않습니다.
- 함수의 반복 호출이 멈춰진 경우 `clearTimeout`이 실행되지 않기 때문에 `limit` 밀리초 후에 `callback.apply`가 실행되게 됩니다.
- `apply` 메소드는 `this`의 범위를 지정할 수 있습니다. 여기서 `this`의 범위로 콜백 함수가 실행될 때 그 컨텍스트의 `this`가 배정됩니다.

 

#### **Throttle**

```js
function throttle(callback, limit = 100) {
    let waiting = false
    return function() {
        if(!waiting) {
            callback.apply(this, arguments)
            waiting = true
            setTimeout(() => {
                waiting = false
            }, limit)
        }
    }
}
```

- `callback`: 실행 대상이 되는 콜백 함수입니다.
- `limit`: 얼마 간격으로 함수를 실행할 지 결정하며 millisecond 단위입니다.
- `waiting` 상태가 `true` 인 경우는 `if`문이 실행되지 않습니다.
- 최초 함수가 호출되었을 때 `waiting`은 `false`이며 `if`문이 실행됩니다. 이 때 콜백 함수를 실행한 뒤 다시 `waiting`은 `true`가 됩니다.
- `waiting`이 `true`가 되었을 때 `limit` 밀리초 후에는 `waiting`이 강제로 `false`가 되고, 다시 콜백 함수가 실행이 됩니다.
- `apply` 메소드는 `this`의 범위를 지정할 수 있습니다. 여기서 `this`의 범위로 콜백 함수가 실행될 때 그 컨텍스트의 `this`가 배정됩니다.

 

#### **사용 방법**

```
inputDebounce.addEventListener("keyup", debounce(function() {
    dispDebounce.textContent = ++debounceCount
}, 100))

window.addEventListener("mousemove", throttle(() => {
    dispThrottle.textContent = ++mouseThrottleCount
}, 500))
```

 

 

<iframe height="265" style="width: 100%;" scrolling="no" title="Debounce and Throttle" src="https://codepen.io/ayaysir/embed/zYoZNNX?height=265&amp;theme-id=light&amp;default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="allowfullscreen">See the Pen <a href="https://codepen.io/ayaysir/pen/zYoZNNX">Debounce and Throttle</a> by ayaysir (<a href="https://codepen.io/ayaysir">@ayaysir</a>) on <a href="https://codepen.io">CodePen</a>.</iframe>
