---
title: "리액트(React): useState (함수형 컴포넌트에서 변수 관리)"
date: 2020-11-30
categories: 
  - "DevLog"
  - "React.js"
---

리액트에서 `function` 기반 컴포넌트(hook)는 한 번 렌더링되고 끝나는 것이 아닙니다. 리액트의 컴포넌트는 실시간으로 끊임없이 렌더링되며 여기서 일반 변수 등을 사용하면 컴퓨터의 자원 낭비와 성능 저하를 불러올 수 있습니다.

리액트의 함수 컴포넌트 체제에서 변수 등의 상태들을 관리할 수 있는 방법이 여러 가지 있는데 `useState`는 상태 관리의 아주 기초적인 형태입니다. 통상적인 변수 대신 설정하는 것이라고 생각하면 됩니다.

 ![](/assets/img/wp-content/uploads/2020/11/carbon-1.png)

- `import React, {useState} from 'react'` - `useState`를 사용하려면 먼저 임포트 해야합니다.
- `const [todos, setTodos] = useState([])` - `setState` 의 기본 형태입니다. 변수 선언시 배열의 [비구조화 할당](https://learnjs.vlpt.us/useful/06-destructuring.html) 기법을 이용해 두 개의 변수를 선언합니다. 첫 번째는 사용할 변수 이름이고, 두 번째는 변수 이름 앞에 `set***`을 붙여 setter 형태의 이름을 짓습니다.
- `useState(초기값)` - 상태 변수의 초기값을 지정합니다. 위의 예제에서는 빈 배열이 초기값으로 지정되었습니다.
- 상태 변수를 읽을 때에는 앞에서 선언한 변수 이름인 `todos`를 사용하면 됩니다. 여기서 `todos`를 불러오면 위에서 \[\]로 초기화되었기 때문에 `todos`는 배열 자료형의 변수입니다.
- 상태 변수의 값을 변경할 때에는 `setTodos(변경값)` 을 사용합니다. `setTodos([...todos, newTodo])`의 의미는 기존 `todos`의 모든 원소를 그대로 가져오고 그 뒤에 `newTodo` 를 추가한 새로운 배열을 `todos`에 할당한다는 의미입니다. 즉 기존 배열에 새로운 원소를 추가한 것과 같은 효과입니다.

 

setter 부분은 단일 값을 할당하는 대신 함수 형식으로 업데이트 할 수도 있습니다.

```
setTodos(els => [...els, newTodo])
```

`setTodos` 부분을 위와 같이 변경해도 동일하게 동작합니다.

 

 ![](/assets/img/wp-content/uploads/2020/11/screenshot-2020-11-30-pm-7.25.50.png)
