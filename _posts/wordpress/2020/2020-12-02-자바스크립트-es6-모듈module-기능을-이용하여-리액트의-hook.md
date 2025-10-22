---
title: "자바스크립트 ES6+: 모듈(module) 기능을 이용하여 리액트의 hook 흉내내기 (reactify)"
date: 2020-12-02
categories: 
  - "DevLog"
  - "JavaScript"
---

예전에 어느 프론트엔드 과제 테스트에서 아래와 같은 요구사항을 제시한 적이 있습니다.

![](./assets/img/wp-content/uploads/2020/12/문제.jpg)

 

요약하면 '_순수 자바스크립트로 리액트와 유사한 구조의 웹 페이지를 만들어봐라_' 이런 뜻인데요, 준비가 되어 있지 않은 상태에서 이런 요구사항을 접하면 많이 난감할 것이라고 생각됩니다.

문제에서 컴포넌트를 제작할 때 `function`, `class` 둘 중 하나를 택하라 했는데 여기서는 `function`을 선택해서 간단한 숫자 카운터 예제를 만들어 보도록 하겠습니다. (참고로 실제 문제 풀이에서는 `class`기반으로 작성하는게 훨씬 편합니다.)

최신 브라우저에서는 스크립트 로딩 시 `type="module"` 옵션을 추가하면 별도의 웹팩 등이 없어도 모듈화를 진행할 수 있습니다.

여기에 있는 방법은 최선의 방법이 아니며, 더 좋은 방법을 알아내면 나중에 추가 보충하도록 하겠습니다.

 

#### **작동 화면**

<iframe width="480" height="277" src="https://giphy.com/embed/xp6iFyJLEeMV4p8mlr" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

#### **1) 메인 html을 작성합니다. (index.html)**

```
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>숫자 카운터</title>
</head>

<body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
</body>

</html>

```

 

- `<div id="app"></div>` - 이 부분은 js를 통해 각종 컴포넌트를 추가할 때 타겟이 되는 부모 요소입니다.
- `<script type="module" src="./main.js"></script>` - 모듈 `import`, `export` 가 가능하도록 하여 스크립트 파일을 로딩합니다.

 

#### **2) main.js 작성**

```
import {render} from './util.js'

import App from './App.js'

render(document.querySelector("#app"), App())
```

`render` 함수는 컴포넌트 요소를 렌더링하는 함수로 밑에서 설명합니다. 아이디가 `app`인 요소를 가져와서 `App.js` 의 함수를 하위 자식으로 추가해 렌더링합니다.

 

#### **3) util.js 작성**

```
const stateArr = []

function render(parentElement, element) {
    parentElement.appendChild(element)
}

const makeStateSetter = (wrapObj) => {
    
    return (anotherValue) => {
        wrapObj.value = anotherValue
    }
}

function useState(initialValue) {
    const wrapObj = {
        value: initialValue,
    }
    stateArr.push(wrapObj)
    
    return [wrapObj, makeStateSetter(wrapObj)]
}

export {render, useState}
```

- `render()` - 상위 요소에 하위 요소를 추가하는 요소입니다. 추가 기능만 있으므로 `render`라는 이름을 쓰기엔 부족하지만 일단은 이 이름을 사용하겠습니다. 원래 이 기능은 state 값이 변경될 때마다 자동으로 재 렌더링을 해야 합니다.
- `stateArr` 배열 - 공통으로 사용하는 변수인 `state`들의 객체를 배열 형태로 저장합니다.
- `makeStateSetter` 익명함수 - `state` 관리시 사용할 `setter` 함수를 만듭니다.
- `useState` - 리액트의 `useState`와 유사한 기능을 수행하는 함수입니다.

 

#### **4) App.js 작성**

App 컴포넌트는 최상위 컴포넌트입니다.

```
import {render} from './util.js'

import HeadTitle from './HeadTitle.js'
import Content from './Content.js'
import Counter from './Counter.js'

export default function App() {
    
    const $div = document.createElement('div')
    
    render($div, HeadTitle())
    render($div, Content())
    render($div, Counter())
    
    return $div
}

```

- `import` 문은 컴포넌트나 유틸리티 모듈을 로딩합니다.
- `export default function App()` - 이 함수를 기본적(`default`)으로 내보내겠다는 뜻입니다. 이 부분이 어떻게 `import`되는지는 `main.js`를 참고하세요.
- `$div` 요소를 만들고, `render` 과정을 거친 뒤 리턴합니다

 

#### **5) HeadTitle.js , Content.js 작성**

```
export default function HeadTitle() { 
    const $h2 = document.createElement('h2')
    
    $h2.textContent = "카운터 예제"
    
    return $h2
}

```

```
export default function Content() { 
    const $div = document.createElement('div')
    
    $div.textContent = "사용법: [증가] 버튼을 누르면 숫자가 증가합니다."
    
    return $div
}

```

 

이 두 파일은 단순히 HTML 요소를 만들어 코딩한 뒤 리턴하는 역할을 합니다.

 

#### **6) Counter.js 작성**

여기에는 숫자를 표시하는 부분과, 숫자를 증가시키는 버튼으로 나뉘어져 있습니다.

```
import {useState} from './util.js'

export default function Counter() { 
    const $div = document.createElement('div')
    
    // 초기값 설정
    const [count, setCount] = useState(0)
    
    const $p = document.createElement('p')
    $p.textContent = count.value
    
    const $button = document.createElement("button")
    $button.textContent = "증가"
    
    $button.addEventListener('click', () => {
        setCount(count.value + 1)   // 카운터 값 증가
        console.log(count)
        $p.textContent = count.value    // (!) 값이 바뀔 때 DOM에 직접 접근
    })
    
    $div.appendChild($p)
    $div.appendChild($button)
     
    return $div
}

```

- `const [count, setCount] = useState(0)`
    - `count`는 값이 저장되어 있는 객체 주소 변수, `setCount`는 이 객체의 값을 변경시키는 함수입니다. 비구조화 할당 기법을 이용해 변수 2개를 생성했습니다.
    - 참조 문제로 인해 `count`는 객체 자체이며 값은 `count.value`로 접근합니다.
- `setCount(count.value + 1)` - 카운터 값을 현재보다 1 증가시킵니다.
- `$p.textContent = count.value` - 상태값이 바뀌었을 때 `$p`의 값을 직접 변경하도록 되어있습니다. 문제를 이렇게 풀면 DOM 접근 최소화를 하라는 피드백을 받을 것 같네요. 위에서도 언급했듯이 `state`의 값이 바뀌는것을 감지해서 렌더링을 실행해야 하는데 이 부분은 더 공부하도록 하겠습니다.
