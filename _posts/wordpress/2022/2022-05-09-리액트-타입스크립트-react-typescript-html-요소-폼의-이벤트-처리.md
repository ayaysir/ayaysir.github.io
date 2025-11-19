---
title: "리액트 + 타입스크립트 (React + TypeScript): HTML 요소, 폼의 이벤트 처리"
date: 2022-05-09
categories: 
  - "DevLog"
  - "React.js"
---

리액트가 아닌 일반 타입스크립트에 대한 이벤트 처리는 아래를 참고하세요.

- [타입스크립트(TypeScript): HTML 요소에 이벤트 추가](/posts/타입스크립트typescript-html-요소에-이벤트-추가/)

 

## **오류 발생하는 기존 코드**

아래와 같이 폼에 대한 이벤트 처리를 하는 JSX를 사용한 리액트 Hook이 있다고 가정합니다.

```tsx
import { useState } from 'react'

function App() {
  const [text, setText] = useState("")
  const [keydownCount, setKeydownCount] = useState(0)
  const [isChecked, setChecked] = useState(false)

  const handleTextField = (e) => {
    setText(e.target.value)
  }

  const handleTextArea = (e) => {
    setText(e.target.value)
  }

  const handleCheckbox = (e) => {
    setChecked(e.target.checked)
  }

  const handleKeyInputEvent = (e) => {
    setKeydownCount(count => count + 1)
  }

  const handleMouseClickEvent = (e) => {
    alert("handleMouseClickEvent")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`${text}\nchecked? ${isChecked}`)
  }

  return (
    `<div className="App">
      <h1>Form Event</h1>
      <p>입력 내용: {text}</p>
      <p>keydown 횟수: {keydownCount}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleTextField} onKeyDown={handleKeyInputEvent}/>
        <input type="checkbox" onChange={handleCheckbox} />
        <textarea rows={5} placeholder="텍스트 입력..." onChange={handleTextArea}></textarea>
        <button type="button" onClick={handleMouseClickEvent}>click</button>
        <button type="submit">submit</button>
      </form>
    </div>`
  )
}

export default App

```

<!-- http://www.giphy.com/gifs/7Y2H2DRhbm736ZhNzF -->
![](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRzMjMwbHQxbHpzYmpteHp4NTJnY2sxenE0MHQ4bHRsZnBsMGJyayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7Y2H2DRhbm736ZhNzF/giphy.gif)

 

타입스크립트 + 리액트에서 이벤트를 처리하려면 이벤트의 타입을 지정해야 합니다. 위의 코드는 일반 JSX에서는 문제가 없는 코드이지만 TSX(TypeScript + eXtensions)에서는 문법 오류가 발생합니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-8.40.32.jpg)

> 'e' 매개 변수에는 암시적으로 'any' 형식이 포함됩니다.ts(7006)

<!-- \[the\_ad id="3513"\] -->

 

## **해결 방법 1**

이를 해결하려면 `e` 변수에 타입을 지정해서 알려주면 됩니다. 리액트에서는 `React.ChangeEvent`와 `React.FormEvent` 등 이벤트 관련 타입을 지원합니다.

 

아래와 같이 이벤트 모든 유형에 `any`를 사용해도 되지만, 이렇게 사용할바엔 처음부터 자바스크립트를 사용하는 것이 낫다고 생각합니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-8.48.56.jpg)

 

### **Step 1: ChangeEvent, FormEvent를 import 합니다.**

```tsx
import React, { ChangeEvent, FormEvent, FormEvent, KeyboardEvent, MouseEvent, useState } from 'react'
```

 

### **Step 2: hook 내에 이벤트 함수를 작성합니다.**

먼저 이벤트가 무슨 타입인지 알아낸 뒤, 그 이벤트가 발생하는 HTML 요소의 타입을 알아낸 다음 파라미터 등에 지정합니다.

타입 지정 형식에는 크게 3가지 방법이 있습니다.

1. 콜백 함수의 파라미터로 이벤트 타입 + `제네릭`을 사용
2. 콜백 함수의 파라미터로 이벤트 타입만 사용하고, 블록 내에서 `e.target` 등에 `as HTMLInputElement`와 같이 지정하는 방법
3. 콜백 함수의 파라미터로 이벤트 타입만 사용하고, 블록 내에서 `e.target` 등에 `instanceof HTMLInputElement`와 같이 지정하는 방법

 

대표적인 이벤트 타입의 목록은 다음과 같습니다.

- `React.ChangeEvent` - `onChange` 이벤트 등에 사용
- `React.MouseEvent` - `onClick` 이벤트 등에 사용
- `React.KeyboardEvent` - `onKeydown`, `onKeyup` 이벤트 등에 사용
- `React.FormEvent` - `<form>` 태그의 `onSubmit` 등에 사용

 

### **방법1 - 콜백 함수의 파라미터로 이벤트 타입 + 제네릭을 사용**

```tsx
const handleTextField = (e: ChangeEvent<HTMLInputElement>) => {
  setText(e.target.value)
}
```

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-am-1.49.44.jpg)

- 위와 같이 변경 이벤트에는 `ChangeEvent`가 사용되며, 제네릭 부분에 이벤트가 발생하는 HTML 요소의 타입(`HTML element interfaces`)을 지정합니다.
    - 예를 들어 `<input>` 태그에는 `HTMLInputElement`,
    - `<textarea>`태그에는 `HTMLTextAreaElement`를 지정합니다.

 

`HTML element interfaces`의 목록은 [MDN web docs - The HTML DOM API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API#html_dom_api_interfaces) 링크를 참조하면 됩니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-8.58.49.jpg)

 

제네릭을 적용한 방식의 코드는 다음과 같습니다.

```tsx
import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, useState } from 'react'

function App() {

  const [text, setText] = useState("")
  const [isChecked, setChecked] = useState(false)

  const handleTextField = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
  }

  const handleKeyInputEvent = (e: KeyboardEvent<HTMLDivElement>) => {
    console.log(text)
  }

  const handleMouseClickEvent = (e: MouseEvent<HTMLButtonElement>) => {
    alert("handleMouseClickEvent")
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`${text}\nchecked? ${isChecked}`)
  }

  return (
    `<div className="App">
      <h1>Form Event</h1>
      <p>{text}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleTextField} onKeyDown={handleKeyInputEvent}/>
        <input type="checkbox" onChange={handleCheckbox} />
        <textarea rows={5} placeholder="텍스트 입력..." onChange={handleTextArea}></textarea>
        <button type="button" onClick={handleMouseClickEvent}>click</button>
        <button type="submit">submit</button>
      </form>
    </div>`
  )
}

export default App
```

리액트 이벤트 React ReactJS 이벤트 폼 이벤트 변경 이벤트 클릭 이벤트 event click Event Form Event onChange onClick ChangeEvent FormEvent TSX JSX

<!-- \[the\_ad id="3020"\] -->

## **방법 2 - 콜백 함수의 파라미터로 이벤트 타입만 사용하고, 블록 내에서 e.target 등에 as HTMLInputElement와 같이 지정하는 방법**

제네릭을 사용하지 않으면 `e.target`이 무슨 요소인지 알 수 없으므로 `value`가 없다는 문법 오류가 발생합니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.16.08.jpg)

 

이를 방지하려면 `e.target`의 타입을 `as`로 지정해주면 됩니다. 제네릭의 타입이 `as`로 옮겨간 것 뿐입니다.

```tsx
const handleTextArea = (e: ChangeEvent) => {
  const target = (e.target as HTMLInputElement)
  setText(target.value)
}
```

 

## **방법3 - 콜백 함수의 파라미터로 이벤트 타입만 사용하고, 블록 내에서 e.target 등에 instanceof HTMLInputElement와 같이 지정하는 방법**

위의 Hook 예제를 보면 인풋 필드 `<input>`과 텍스트 구역 `<textarea>`의 `onChange`가 똑같이 `setText(e.target.value)` 를 실행하고 있습니다. 그러나 이를 실행할 콜백 함수는 `handleTextField`와 `handleTextArea`로 나뉘어져 있습니다.

자바스크립트에서는 타입을 지정할 필요가 없으므로 하나의 함수를 공유해서 쓰면 되지만 타입스크립트에서는 타입을 구분해야 하기 때문에 공유할 수 없습니다. 예를 들어 `handleInputText`를 텍스트 구역에 적용하려고 하면 아래와 같은 오류가 발생합니다. 둘의 파라미터 타입은 `ChangeEvent`로 동일합니다만, 제네릭은 `HTMLInputElement`로 지정되어 있으나 실제 `<textarea>`는 `HTMLTextAreaElement` 이기 때문에 타입이 맞지 않아 오류가 발생하는 것입니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.21.20.jpg)

 

이를 `instanceof` 문법을 사용하면 같은 함수를 쓸 수 있게 됩니다. `[변수명] instanceof [타입명]`와 같이 사용하면 타입의 일치 여부에 따라 `true`/`false`를 반환합니다. 이를 통해 해당 변수가 찾고자 하는 타입과 일치하는지 여부를 알 수 있으며, `if`문을 사용해 해당 타입별로 실행 내용을 다르게 지정하면 됩니다.

```tsx
const handleText = (e: ChangeEvent) => {

  let value: string | null = null

  if(e.target instanceof HTMLInputElement) {
    console.log("from HTMLInputElement")
    value = e.target.value
  } else if(e.target instanceof HTMLTextAreaElement) {
    console.log("from HTMLTextAreaElement")
    value = e.target.value
  }

  value && setText(value)
}
```

- `let value: string | null = null`
    - `string` 또는 `null` 타입을 가지는 변수로, 기본값은 `null`입니다.
- `if` ~ `e.target instanceof HTMLInputElement)` (또는 `HTMLTextAreaElement`)
    - 이벤트 출처가 `<input>`인지 `<textarea>`인지 구분하여 실행합니다.
    - `instanceof`가 `true`인 경우 해당 실행 블록에서는 `e.target`의 타입이 자동으로 확정되므로 `as` 등으로 타입을 재지정하지 않아도 됩니다. (아래 스크린샷 참조)
- `value && setText(value)` 가 `null`이 아니면 `setText`를 실행합니다.
    - 마찬가지로 `value`가 `null` 이 아니면 타입이 자동 확정됩니다. (아래 스크린샷 참조)

 

![`instanceof` 효과로 인한 타입 자동 지정 1](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.35.47.jpg)  
*`instanceof` 효과로 인한 타입 자동 지정 1*

 

![`instanceof` 효과로 인한 타입 자동 지정 2](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.36.18.jpg)  
*`instanceof` 효과로 인한 타입 자동 지정 2*

 

![`value`는 `null`의 가능성이 있음](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.37.02.jpg)  
*`value`는 `null`의 가능성이 있음*

 

![`&&` 연산자로 인한 타입 자동 지정 및 `null` 가능성 제거](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.37.18.jpg)  
*`&&` 연산자로 인한 타입 자동 지정 및 `null` 가능성 제거*

 

이제 `<input>`태그와 `<textarea>` 태그의 `onChange` 이벤트에 동일한 함수를 지정해도 이전과 마찬가지로 정상 동작합니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-09-pm-9.41.08.jpg)
