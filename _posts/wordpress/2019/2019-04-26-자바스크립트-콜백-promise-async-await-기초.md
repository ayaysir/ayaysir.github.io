---
title: "자바스크립트: 콜백, Promise, async - await 기초"
date: 2019-04-26
categories: 
  - "DevLog"
  - "JavaScript"
---

자바스크립트에서 작업을 의도한 순서대로 처리한 방법에는 `콜백`, `Promise`, `async - await` 3가지가 있습니다. `async - await`가 최신 기술이며 3가지 방법들은 이전 개념을 이해해야 진행할 수 있습니다.

원래 프로그래밍 언어가 순서대로 처리하는 건데 왜 별도의 개념을 익혀야 하느냐 묻는다면, 자바스크립트에서는 비동기 처리라는 복잡한 문제가 있기 때문입니다. 비동기 처리란 특정 코드의 연산이 끝날 때까지 코드의 실행을 멈추지 않고 다음 코드를 먼저 실행하는 자바스크립트의 특성을 의미합니다. 예를 들면 다른 서버에서 정보를 받아오는 AJAX 등이 있겠네요. 예제도 AJAX를 사용하기로 했습니다. 모든 예제에 JQuery 코드 있으므로 참고해주세요.

예시로 만든 서버 측 페이지(PHP)는 너무 간단해서 비동기 문제를 거의 느낄 수 없기 때문에 `sleep` 함수를 통해 서버 딜레이를 고의적으로 부여하였습니다. 목표는 1, 2, 3, 4번 메시지를 순차적으로 표시하는 것입니다.

```
<?php

$param = $_GET["n"];

// 서버 딜레이를 가정함 (1~5초 랜덤)
sleep(rand(1, 5));

if($param == 1){
  echo "(1) 아침에 일어나서";
} else if($param == 2){
  echo "(2) 세수를 하고";
} else if($param == 3){
  echo "(3) 학교에 가서";
} else if($param == 4){
  echo "(4) 공부를 하고";
}
  
?>
```

 

### 0\. 아무것도 적용하지 않은 경우

```
String.prototype.write = function() {
  $(document.body).append(this + "<br>")
}   

"목표: 아침에 일어나서 세수를 하고 학교에 가서 공부를 하고<br>".write()

$.get("./msg.php?n=1", (res) => {
  res.write()
})

$.get("./msg.php?n=2", (res) => {
  res.write()
})

$.get("./msg.php?n=3", (res) => {
  res.write()
})

$.get("./msg.php?n=4", (res) => {
  res.write()
})
```

```
목표: 아침에 일어나서 세수를 하고 학교에 가서 공부를 하고

(3) 학교에 가서
(4) 공부를 하고
(1) 아침에 일어나서
(2) 세수를 하고
```

```
let msg;

$.get("./msg.php?n=1", (res) => {
  msg += res + "<br>"
})

$.get("./msg.php?n=2", (res) => {
  msg += res + "<br>"
})

$.get("./msg.php?n=3", (res) => {
  msg += res + "<br>"
})

$.get("./msg.php?n=4", (res) => {
  msg += res + "<br>"
}) 

console.log(msg)  // undefined
```

순서가 제대로 나오지 않는 것 외에도 다른 문제가 있는데 변수 `msg`에 값이 하나도 저장되지 않는 문제가 있습니다. 이유는 `$.get` 함수가 결과를 받기도 전에 콘솔 로그가 먼저 실행되는 것에 있습니다. 서버에서 값을 받아오는건 5초가 걸리는데 콘솔 로그가 실행되는 시간은 0.0001..초만에 실행되므로 의도한 것과 다르게 값이 `undefined`라고 뜨는 것입니다.

 

### 1\. 콜백 (Callback)

기본 버전

```
$.get("./msg.php?n=1", (res) => {
  res.write()
  $.get("./msg.php?n=2", (res) => {
    res.write()
    $.get("./msg.php?n=3", (res) => {
      res.write()
      $.get("./msg.php?n=4", (res) => {
        res.write()           
      })
    })
  })
})
```

약간 다듬은 버전

```
const task1 = (cbFunc) => {
  $.get("./msg.php?n=1", (res) => {
    res.write()
    cbFunc() // write가 긑나면 다음 콜백 함수를 실행한다.
  })
}

const task2 = (cbFunc) => {
  $.get("./msg.php?n=2", (res) => {
    res.write()
    cbFunc()
  })
}

const task3 = (cbFunc) => {
  $.get("./msg.php?n=3", (res) => {
    res.write()
    cbFunc()
  })
}

const task4 = (cbFunc) => {
  $.get("./msg.php?n=4", (res) => {
    res.write()
    cbFunc()
  })
}

task1(() => {
  task2(() => {
    task3(() => {
      task4(() => {
        alert("완료")
      })
    })
  })
})
```

```
목표: 아침에 일어나서 세수를 하고 학교에 가서 공부를 하고

(1) 아침에 일어나서
(2) 세수를 하고
(3) 학교에 가서
(4) 공부를 하고
```

이런 문제를 해결하기 위해 예전부터 사용했던 `콜백`이라는 개념이 있습니다. 함수 내부에 또다른 함수를 호출해서 비동기 문제를 해결하는 것입니다. 뒤에 나올 `Promise`나 `async - await`보다는 직관적이라 이해가 쉽지만 콜백이 필요한 작업이 많아질수록 코드가 계단 모양으로 늘어나는 단점이 있고 해서 보통 이것을 콜백 지옥이라 부른다고 하네요.

위 예시는 극단적인 경우고, 보통은 이런식으로 많이 사용합니다.

```
function run(cbFunc) {
  $.get("./msg.php?n=1", (res) => {
    cbFunc(res)
  })
}

run(function(res){
  alert('완료: ' + res )
})
```

`run` 함수의 파라미터로 또 다른 함수를 받도록 하였습니다. 여기서 `$.get` 안의 `(res) => {...}`도 `$.get` 함수가 쓰는 콜백 함수입니다.

### 2\. 프로미스 (Promise)

프로미스에는 여러 사용 방법이 있는데 여기서는 함수를 순차적으로 실행하는 방법만 살펴보겠습니다.

```
const task1 = () => {

  return new Promise((resolve, reject) => {
    $.get("./msg.php?n=1", (res) => {
      res.write()
      resolve()
    })
  })
}

const task2 = () => {

  return new Promise((resolve, reject) => {
    $.get("./msg.php?n=2", (res) => {
      res.write()
      resolve()
    })
  })
}

const task3 = () => {

  return new Promise((resolve, reject) => {
    $.get("./msg.php?n=3", (res) => {
      res.write()
      resolve()
    })
  })
}

const task4 = () => {

  return new Promise((resolve, reject) => {
    $.get("./msg.php?n=4", (res) => {
      res.write()
      resolve()
    })
  })
}

task1()
  .then(task2)
  .then(task3)
  .then(task4)
```

Promise의 사용 방법은 콜백에서 사용하던 `task` 함수의 내용물에 `new Promise(...)`를 덧씌우고, 그 안에 있는 함수에 파라미터로 필요한 `resolve`, `reject` 두 개를 지정하면 됩니다. `resolve`는 함수가 정상적으로 실행되었고 작업을 종료할 자리에 작성하고, `reject`는 에러가 났을때 파라미터입니다.

`resolve()`로 작업이 정상 종료되었다면 `then()`을 사용하여 다음 작업으로 넘어갑니다. 맨 아래 부분을 보면 `task1` 다음 `then,` 그리고 `task2` 다음 `then` 이런식으로 순차적으로 실행하여 결과가 순서대로 나오게 됩니다.

`resolve(result)` 이런식으로 안에 결과를 넣어 진행할 수도 있는데 다음과 같이 사용합니다.

```
const task1 = (start) => {

  return new Promise((resolve, reject) => {

    const min = 15
    $.get("./msg.php?n=1", (res) => {
      (res + " ........ " + min + "분").write()
      resolve(start + min)
    })
  })
}

const task2 = (start) => {

  return new Promise(function(resolve, reject) {

    const min = 60
    $.get("./msg.php?n=2", (res) => {
      (res + " ........ " + min + "분").write()
      resolve(start + min)
    })
  })
}

const task3 = (start) => {

  return new Promise(function(resolve, reject) {

    const min = 30
    $.get("./msg.php?n=3", (res) => {
      (res + " ........ " + min + "분").write()
      resolve(start + min)
    })
  })
}

const task4 = (start) => {

  return new Promise(function(resolve, reject) {

    const min = 5
    $.get("./msg.php?n=4", (res) => {
      (res + " ........ " + min + "분").write()
      resolve(start + min)
    })
  })
}

task1(0)
  .then(task2)
  .then(task3)
  .then(task4)
.then((res) => {
  ("<br> 총합 ........ " + res + "분").write()
})
```

```
목표: 아침에 일어나서 세수를 하고 학교에 가서 공부를 하고

(1) 아침에 일어나서 ........ 15분
(2) 세수를 하고 ........ 60분
(3) 학교에 가서 ........ 30분
(4) 공부를 하고 ........ 5분

총합 ........ 110분
```

task의 `start` 파라미터 자리에 `resolve`에 설정된 값을 계속해서 넘겨주고, 그 결과값을 계속 더해서 마지막에 총합을 보여주는 예제입니다.

 

### 3\. async - await

`Promise`를 기반으로 하므로 이 부분은 반드시 `Promise`에 대한 지식이 선행되어야 합니다.

task1 ~ task4 부분은 바로 위 예제 코드를 참조해주세요.

```
const asyncTasks = async (start) => {
  const t1 = await task1(start)
  const t2 = await task2(t1)
  const t3 = await task3(t2)
  const t4 = await task4(t3) 
  
  return t4
}

asyncTasks(0).then((res) => {
  ("<br> 총합 ........ " + res + "분").write()
})
```

결과도 동일합니다.

`Promise`와는 다르게 고유 parameter를 넣을 수 있다는 차이가 있다. (사실 Promise도 그렇게 할 수 있는데 제가 못찾은 것일수도 있습니다) 이러한 점을 이용해 이전 예제를 간단하게 하면 다음과 같습니다.

```
const task = (n, min) => {

  return new Promise((resolve, reject) => {

    $.get("./msg.php?n=" + n, (res) => {
      (res + " ........ " + min + "분").write()
      resolve(min)
    })
  })
}

const asyncTasks = async (start) => {
  const t1 = await task(1, start)
  const t2 = await task(2, 120)
  const t3 = await task(3, 10)
  const t4 = await task(4, 0) 
  
  return t1 + t2 + t3 + t4
}

asyncTasks(30).then((res) => {
  ("<br> 총합 ........ " + res + "분").write()
})
```

```
목표: 아침에 일어나서 세수를 하고 학교에 가서 공부를 하고

(1) 아침에 일어나서 ........ 30분
(2) 세수를 하고 ........ 120분
(3) 학교에 가서 ........ 10분
(4) 공부를 하고 ........ 0분

총합 ........ 160분
```
