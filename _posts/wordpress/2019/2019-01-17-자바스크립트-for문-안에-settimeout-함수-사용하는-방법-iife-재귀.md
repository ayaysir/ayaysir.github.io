---
title: "자바스크립트: for문 안에 setTimeout 함수 사용하는 방법 (IIFE, 재귀함수)"
date: 2019-01-17
categories: 
  - "DevLog"
  - "JavaScript"
tags: 
  - "자바스크립트"
---

만약에 `var ducks = ["첫째 오리", "둘째 오리", "셋째 오리", "넷째 오리", "다섯째 오리"]` 이런 배열이 있고 이걸 1초 간격으로 하나씩 화면에 뿌리는 페이지를 만드는 상황이라고 가정합니다.

시간을 지연시키는 함수로 `setTimeout(function(){...}, delayMillisecond)`가 있습니다. 콜백 함수와 지연할 시간을 밀리세컨드 단위로 입력해서 사용합니다. 1초 간격으로 반복하고 싶다면 이 기능을 `for`문으로 돌리면 될까요?

```
var ducks = ["첫째 오리", "둘째 오리", "셋째 오리", "넷째 오리", "다섯째 오리"]
var delaySec = 1000;

/* 1: IIFE를 적용하지 않은 일반적인 코드 */
for (i in ducks) {
    setTimeout(() => {
       console.log(ducks[i])
    }, i == 0 ? 0 : delaySec)
}
```

이 코드는 일반적인 생각대로 실행되지 않습니다. 결과는 1초 뒤에 한꺼번에 '다섯째 오리'만 다섯 마리 복제되며 나머지 오리들은 등장하지도 않습니다.

![](./assets/img/wp-content/uploads/2019/01/ducks.gif)

원인은 자바스크립트의 비동기 관련 문제입니다. 말하자면 for문은 `setTimeout`의 파라미터로 지정된 함수(콜백 함수라 부르며 지금은 특정 작업이 완료된 이후 실행되는 함수라고 이해하시면 됩니다.)이 실행될때까지 기다리지 않고 '1초 뒤에 실행시킬 것이다' 라고 예약만 걸어버린 다음 한 순간에 자신의 작업(반복문)을 완료합니다. 이 for문이 반복되는 시간은 정말 찰나의 시간이며 `setTimeout` 내부의 콜백 함수들이 실행될 시간은 for문이 끝나고도 한참 뒤의 시간이기 때문에 for문이 가리키는 `i`의 값은 `4`(배열의 5번째 주소)입니다. 그렇기 때문에 5개의 `setTimeout`이 실질적으로 실행될 시점에는 콜백 함수들은 전부 `i`는 `4` 를 참조하고 있으므로 마지막 배열만 출력되는 것이며 실행 시점도 의도한 바와 다르게 1초 뒤에 일괄적으로 실행되는 것입니다.

\[the\_ad id="1804"\]

 

이 문제를 해결하는 전통적인 방법으로 **IIFE(****Immediately-Invoked Function Expression; 즉시 실행 함수 표현)**이라는 것이 있습니다.  말 그대로 선언된 시점에 바로 실행하는는 것입니다.  표현식은 `(function () { // TODO  })();` 으로 작성됩니다. 보기 쉽게 함수 부분을 임의의 변수로 치환한다면 `(변수)();`의 꼴이라고 볼 수 있습니다. 익명의 함수를 작성했는데 작성하자마자 바로 실행한 것과 같은 효과가 생깁니다. 위의 코드에서 IIFE 를 적용하면 다음과 같습니다.

```
/* 2: IIFE를 적용한 코드 */
for (i in ducks) {
    (function(ii) {
        setTimeout(() => {
            console.log(ducks[ii])
        }, ii * delaySec)
    })(i);
}
```

`setTimeout`문을 IIFE 로 한 번 감싼 다음 파라미터로 끝에 `(i)`를 부여했습니다.  IIFE를 사용하지 않은 코드는 지연 실행된 콜백 변수들이 모두 변수 `i`를 가리키지만, IIFE를 사용한 코드는 반복이 실행될 때마다 `setTimeout`을 감싼 익명 함수가 변수처럼 취급되어 실행되고, 익명 함수 내부의 변수 `ii`가 가리키는 곳은 각각 함수 내에서 파라미터로 부여받은 지역 변수입니다. 좀 더 이해하기 쉬운 예는 다음과 같고 결과 및 동작원리는 동일합니다.

```
/* 2: IIFE를 적용한 코드 */
for (i in ducks) {
    var anonFunc = function(ii) {
        setTimeout(() => {
            console.log(ducks[ii])
        }, ii * delaySec)
    }
    anonFunc(i);
}
```

인덱스 문제는 해결되었지만 `delaySec`을 고정된 수로 입력하면 여전히 동시에 실행될 것입니다. 실행 시점은 여전히 찰나의 순간이며 모든 익명 함수들이 1초 이후에 실행되도록 설정되어있기 때문입니다. 이것을 `delaySec`에 for문의 `ii`를 곱해 그 시간만큼 순차적으로 이어진 효과를 내도록 바꿨습니다. 배열의 주소는 0부터 시작하므로 처음에는 500 \* 0 = 0 초, 그 다음에는 500 \* 1 = 500 ... 이런식으로 진행됩니다.

(2020년 6월 7일 추가: 이 문제는 ES6 이전의 `var` 변수의 함수 스코프와 연관이 있으며, ES6로 개발 가능한 환경인 경우 ES6에 추가된 `let` 키워드를 사용하면 IIFE 기법을 사용하지 않아도 됩니다. `let`은 블록 스코프(`{...}`)이기 때문입니다. 이 글 작성 당시 ES6 스펙과 새롭게 추가된 `let`, `const`에 대한 스코프에 대한 이해도가 낮아 잘 알지 못했습니다. [변수의 스코프에 관한 글 링크](https://poiemaweb.com/es6-block-scope))

\[the\_ad id="1804"\]

(또한 IIFE는 함수 스코프인 `for`문의 `i`(var 키워드 또는 전역변수로 선언된 경우) 변수를 함수 내에 고정시키기 위한 클로저 기법의 대표적인 예 중 하나입니다.)

```
for (let i in ducks) {
    setTimeout(() => {
        console.log(ducks[i])
    }, i * delaySec)
}
```

 

다른 방법으로 재귀함수를 이용한 방법이 있다고 합니다. ([https://gigglehd.com/gg/soft/252878](https://gigglehd.com/gg/soft/252878))

```
/* 3: [심화] 재귀함수를 이용한 방법 */
function recursive(i) {

    if (i < ducks.length) {

        setTimeout(function() {
            console.log(ducks[i])
            i++;
            recursive(i) // 여기에 i++를 적으면 무한 루프에 빠진다 (++i 사용)
        }, i == 0 ? 0 : delaySec)

    }

}
recursive(0)
```

이러한 자바스크립트의 비동기 문제를 해결하는 다른 방법으로 콜백, `Promise`, `async ~ await` 등이 있습니다. 관련 글 [자바스크립트: 콜백, Promise, async ~ await 기초](http://yoonbumtae.com/?p=1071) 을 참고해주세요.
