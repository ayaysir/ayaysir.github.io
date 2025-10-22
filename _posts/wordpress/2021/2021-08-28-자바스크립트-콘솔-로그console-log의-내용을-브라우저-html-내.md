---
title: "자바스크립트: 콘솔 로그(console.log)의 내용을 브라우저 HTML 내에 표시하기"
date: 2021-08-28
categories: 
  - "DevLog"
  - "JavaScript"
---

자바스크립트는 아무 곳에서나 시스템의 변수, 함수, 객체들을 맘대로 덮어쓸 수 있다는 문제점이 있지만, 그 문제점을 역으로 이용하여 콘솔 로그를 브라우저 내에 표시하는 것이 가능합니다.

먼저 `body` 태그 내에 콘솔 로그를 표시할 영역을 생성합니다.

```
<pre id="console"></pre>
```

 

다음 자바스크립트에서 위의 `pre` 태그를 불러옵니다.

```
const consoleDiv = document.getElementById("console")
```

아래의 `consoleToHtml` 함수를 작성합니다.

```
const consoleToHtml = function() {
    consoleDiv.textContent += `${(new Date()).toLocaleString("ko-KR")} >>>`
    Array.from(arguments).forEach(el => {
        consoleDiv.textContent += " "
        const insertValue = typeof el === "object" ? JSON.stringify(el) : el
        consoleDiv.textContent += insertValue
    })
    consoleDiv.textContent += "\n"
}
```

- `consoleToHtml` - 익명 함수를 만든 다음 변수에 저장합니다.
- `(new Date()).toLocaleString("ko-KR")` - 현재 날짜와 시간을 한국어 포맷으로 표시합니다.
- `Array.from(arguments)` - `arguments`는 함수에서 파라미터의 값들을 배열로 가지고 있는 내장 변수입니다. 이것을 forEach문으로 처리하기 위해 유사배열에서 배열형태로 변환합니다.
- `insertValue`\- 타입이 `object(array` 포함) 계열인 경우 그대로 `textContent`에 추가하면 내부 내용이 표시가 되지 않습니다. 이를 방지하기 위해 `object` 계열의 파라미터들은 JSON 스트링화하여 텍스트로 표시합니다.
- `"\n"` - 다음 줄로 줄바꿈합니다.

 

이 함수를 기존의 `console.log`에 덮어씌웁니다.

```
window.console.log = consoleToHtml
```

- `console.log`로만 적어도 작동하지만 경각심(?)을 위해 `window`의 내부 `console` 이라는 것을 명시했습니다.

 

코드를 종합하면 다음과 같습니다.

https://gist.github.com/ayaysir/041784bd269ddb37b48a01dde5dc5e6c

 

![](./assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-28-오후-9.03.14.jpg)

첫 번째 로그에서 알 수 있듯이 콘솔 로그에는 단순히 내용을 표시하는 기능뿐만 아니라 `printf`처럼 포맷을 지정할 수 있는 기능, css를 지정할 수 있는 고급 기능도 있지만 이 예제에는 반영되지 않았습니다. 실제 필요 여부에 따라 이러한 추가 기능을 구현할지 생략할지 결정할 수 있습니다.

- [자바스크립트: 콘솔 로그(console.log) 사용법, 로그에 CSS 적용, 로그 그룹화 하기](http://yoonbumtae.com/?p=612)
