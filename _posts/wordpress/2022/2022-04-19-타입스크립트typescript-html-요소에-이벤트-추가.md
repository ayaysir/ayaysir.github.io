---
title: "타입스크립트(TypeScript): HTML 요소에 이벤트 추가"
date: 2022-04-19
categories: 
  - "DevLog"
  - "JavaScript"
---

### **타입스크립트(TypeScript): HTML 요소에 이벤트 추가**

이벤트 할당 방법은 자바스크립트와 본질적으로는 동일하지만, 일반 자바스크립트와 다른 점이라면 타입스크립트 코드에서는 변수가 어떤 타입인지를 명시해야 한다는 점입니다. 타입을 제대로 지정하지 않을 경우 코드상에서 빨간 밑줄로 표시되는 에러가 발생합니다.

 

#### **1: Typescript 프로젝트를 생성합니다. npm과 vite를 이용하면 타입스크립트 프로젝트를 만들 수 있습니다.**

- [첫 vite 프로젝트 만들어보기](https://vitejs-kr.github.io/guide/#scaffolding-your-first-vite-project)

 ![](/assets/img/wp-content/uploads/2022/04/screenshot-2022-04-20-am-12.20.42.jpg)

 

#### **2: HTML 파일(index.html)을 작성합니다.**

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Typescript Event handling</title>
  </head>
  <body>
    <!-- 여기에 내용 추가 -->
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

11라인에 **_main.ts_** 파일을 불러오는 부분이 추가되었습니다.

 

#### **3: HTML 파일에 요소를 추가하고 그 요소에 이벤트 부여하기**

아래에 나오는 모든 HTML 소스코드는 **_index.html_** 파일의 `<body>` 태그 내에 추가합니다. 타입스크립트 소스코드는 **_main.ts_** 파일에 추가합니다.

 

##### **예제 1) 클릭 이벤트**

<!-- http://www.giphy.com/gifs/RN87K9Hk1i0glMwNui -->
![](https://)

이 예제는 `<div>` 영역을 클릭하면 배경색이 빨간색\-파란색으로 번갈아가며 바뀝니다.

 

```
<div
  id="box"
  style="height: 200px; width: 200px; background-color: blue"
></div>
```

200\*200 크기의 파란색 배경색의 `<div>`를 추가합니다.

 

```
const box = document.getElementById("box")
box?.addEventListener("click", (ev: Event) => {
  ev.preventDefault()
  const targetDiv = (ev.target as HTMLDivElement)
  targetDiv.style.backgroundColor = targetDiv.style.backgroundColor === "blue" ? "red" : "blue"
})

```

- `box?.addEventListener`
    - 여기서 `?`는 null-safety 옵션을 지정하라는 의미입니다. `getElementById` 등을 사용할 경우 `box`라는 아이디를 가진 HTML 요소가 없을 수도 있는데 그런 경우 `box` 변수에 `null`이 할당됩니다. 여기서 물음표(선택적 속성 액세스)를 붙이면 해당 변수가 `null`인 경우 `addEventListener` 메소드를 실행하지 말고(어차피 없으니까) 다음 부분으로 넘어가라는 의미이며, `null`로 인해 발생하는 오류로부터 안전해질 수 있습니다.
- `ev: Event`
    - 콜백 함수로 이벤트 변수 `ev`에 대한 타입을 지정합니다. 자바스크립트와 달리 타입스크립트는 타입을 명시하지 않을 경우 컴파일러 에러가 발생하므로 해당 타입을 지정해야 이 문제를 방지할 수 있습니다.
- `ev.preventDefault()`
    - 브라우저의 기본 동작을 방지하는 구문입니다.
- `(ev.target as HTMLDivElement)`
    - `ev.target`이 `HTMLDivElement` 타입임이 확실한 경우 해당 타입으로 캐스팅을 합니다.
    - 타입 캐스팅을 하지 않을 경우 `null`의 가능성이 있어 사용할 수 없습니다.

 

##### **예제 2) 체크박스 변경(change) 이벤트** 

<!-- http://www.giphy.com/gifs/bX0HSb5cii4wyhMI9x -->
![](https://)

 

```
<input id="input-check" type="checkbox">
<span id="display-check"></span>
```

체크박스와 체크여부 표시를 나타내는 `<span>` 태그를 추가합니다.

 

```
const displayCheck = document.getElementById("display-check")
const inputCheck = document.getElementById("input-check")
inputCheck?.addEventListener("change", (ev: Event) => {
  ev.preventDefault()
  const targetInput = (ev.target as HTMLInputElement)
  if(displayCheck) {
    displayCheck.textContent = String(targetInput.checked)
  }
})
```

- `if(displayCheck) { ... }`
    - 앞서 언급했듯이 `getElementById` 등으로 가져온 요소는 `null`의 가능성이 존재하는데, `displayCheck?.textContent = "텍스트"` 와 같이 물음표를 사용하여 값을 할당하려고 하면 "_할당 식의 왼쪽은 선택적 속성 액세스일 수 없습니다. ts(2779)_" 라는 컴파일러 에러가 발생하고, 물음표를 붙이지 않으면 "_개체가 'null'인 것 같습니다. ts(2531)_" 라는 에러가 발생합니다.
    - 이를 방지하기 해당 변수가 `null`이 아닌 경우에만 값을 할당하라는 의미로 `if`문을 사용합니다. 조건문에 해당 변수를 넣으면 `null`이 아닌 경우 `true`가 반환되어 `if`문이 실행되며 해당 변수는 not nullable 변수로 간주되어 정상적으로 값을 할당할 수 있습니다.
    - 참고로 `if`문을 사용하지 않고 `displayCheck!.textContent` 와 같이 느낌표(_definitive assignment assertion_)를 붙여도 정상 작동됩니다. 
- `String(targetInput.checked)`
    - 타입스크립트에서는 `bool` 타입을 바로 `string`에 할당할 수 없으므로 `String("텍스트")`을 이용해 스트링으로 변환한 뒤 할당합니다.

 

##### **예제 3) 키보드 입력(keydown) 이벤트**

 

```
<p id="display-count">keydown 횟수</p>
```

`keydown` 이벤트가 몇 번 실행되었는지 표시하기 위한 요소입니다.

 

```
const displayCount = document.getElementById("display-count")
let count = 0
window.addEventListener("keydown", (ev: Event) => {
  ev.preventDefault
  if(displayCount) {
    displayCount.textContent = String(++count)
  }
})
```

- `let count = 0` - 이벤트 실행 횟수를 저장하기 위한 변수입니다.
- `++count` - 카운트 변수를 1씩 증가시킵니다. 먼저 1을 증가시킨 뒤 해당 값을 표시합니다.

 

##### **예제 4) instanceof를 사용해 요소 타입별로 구분하여 실행하기**

<!-- http://www.giphy.com/gifs/d6UgCZSScXxqDnLSRV -->
![](https://)

이 예제는 `textbox`라는 클래스를 가진 각각 다른 타입의 HTML 요소 3개(`input`, `textarea`, `div`)에 같은 이벤트 함수를 지정한 뒤, 해당 이벤트가 실행된 요소의 하위 타입을 구분해서 각 타입별로 다른 내용을 실행하는 예제입니다.

`ev.target`은 이벤트가 발생한 요소에 따라 다른 타입의 변수가 할당될 수 있습니다. 예를 들어 input 태그로부터 실행된 경우 `HTMLInputElement` 타입을 가지며, `textarea` 태그는 `HTMLTextAreaElement` 등등으로 달라집니다. `instanceof`를 사용하면 해당 변수가 찾고자 하는 타입과 일치하는지 여부를 알 수 있으며, `if`문을 사용해 해당 타입별로 실행 내용을 다르게 지정하면 됩니다.

 

```
<p id="display-current-element"></p>
<input class="textbox" type="text">
<textarea class="textbox"></textarea>
<div class="textbox" style="height: 200px; width: 200px; background-color: black">hidden text</div>
```

맨 윗줄은 어떤 요소로부터 이벤트가 실행되었는지 표시하는 부분입니다.

 

```
const displayCurrentElement = document.getElementById("display-current-element")
const handleClickEvent = (ev: Event) => {
  if(ev.target instanceof HTMLInputElement) {
    displayCurrentElement!.textContent = `from HTMLInputElement: ${ev.target.checked}`
    ev.target // Event.target: HTMLInputElement
  } else if(ev.target instanceof HTMLTextAreaElement) {
    displayCurrentElement!.textContent = `from HTMLTextAreaElement: ${ev.target.rows}`
    ev.target // Event.target: HTMLTextAreaElement
  } else {
    const target = (ev.target as HTMLElement)
    displayCurrentElement!.textContent = `from HTMLElement: ${target.textContent}`
    target // HTMLElement
  }
}

const changeElements = document.querySelectorAll(".textbox")
changeElements.forEach((value: Element) => {
  value.addEventListener("click", handleClickEvent)
})
```

- `if(ev.target instanceof HTMLInputElement) { ... }`
    - `instanceof`를 사용하면 해당 조건문이 `true`인 경우 괄호 안에 실행되는 `ev.target`변수는 자동으로 해당 타입을 가지는 것으로 간주되므로, 물음표나 느낌표 등을 붙이지 않아도 됩니다.
    - 또한 해당 타입에서만 사용할 수 있는 전용 메소드도 사용 가능하게 됩니다. `checked` 메소드는 `HTMLInputElement`에만 있는 기능이고, `rows` 메소드는 `HTMLTextAreaElement` 전용입니다.
- `changeElements.forEach(...)`
    - `change` 클래스를 가지는 모든 요소에 이벤트를 할당합니다.

 

타입스크립트 이벤트 ts event type TypeScript Event TS 타입스크립트 클릭 변경 click change 이벤트 타입
