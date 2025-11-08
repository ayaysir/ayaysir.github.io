---
title: "자바스크립트: setInterval(반복 함수) 정지하는 방법 (clearInterval 사용)"
date: 2019-06-04
categories: 
  - "DevLog"
  - "JavaScript"
---

## setInterval 이란?

자바스크립트에서 `setInterval(function, millisecond)`는 일정 시간(ms) 마다 함수를 실행하는 기능입니다. 

예를 들어 millisecond를 1000으로 정하면 1초마다 함수를 반복 실행합니다. 참고로 0초(최초 setInterval이 실행되는 시점)에서는 실행되게 하려면 millisecond를 0으로 지정해야 합니다. 만약 1000로 설정했다면, 0초에는 아무 액션도 취하지 않고 있다가 1초 이후부터 실행 부분을 반복하게 됩니다.

실행되고 있는 인터벌 함수를 중지시키려면 `clearInterval([인터벌 변수])`를 사용하여 정지합니다. 외부에서 정지 시킬수도 있고(예제1) **interval 내부에서 정지**시키는 것도 가능합니다(예제2).

## 코드

### 예제1

```js
var interval = setInterval(function() {
  console.log("await..")
}, 500)
    
function stop(){
  console.log("stopped")
  clearInterval(interval)
}
```

### 예제2

```js
var isStop = false
var interval = setInterval(function() {
  if (!isStop) {
    console.log("await..")
  } else {
    console.log("stopped")
    clearInterval(interval) 
    // 밖에서 선언한 interval을 안에서 중지시킬 수 있음
  }
}, 500)

function stop() {
  isStop = true
}
```
