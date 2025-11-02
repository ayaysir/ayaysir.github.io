---
title: "리액트(React): React Redux 요약 정리"
date: 2020-12-08
categories: 
  - "DevLog"
  - "React.js"
---

{% youtube "https://www.youtube.com/watch?v=fkNdsUVBksw&list=PLuHgQVnccGMDuVdsGtH1_452MtRxALb_7" %}

{% youtube "https://www.youtube.com/watch?v=Cwwsv_OaWhM" %}

이 글은 위 동영상 강의들을 요약 정리한 것입니다.

 

#### **Redux와 React Redux는 같은 의미인가요?**

아닙니다. Redux는 상태 관리 라이브러리로, 상태관리 패턴인 Flux의 일부를 변형하여 간단하게 상태 관리가 가능하도록 만들었습니다. 이것은 제이쿼리, 일반 자바스크립트, 다른 SPA 프레임워크 등 다양한 환경에서 사용가능하도록 제작되었으며 리액트 전용으로 만들어진 것은 아닙니다.

Redux의 상태관리 기법을 리액트 컴포넌트에 그대로 사용하게 되면, Redux와 리액트 컴포넌트간 의존성이 높아져 컴포넌트의 재사용성이 떨어지게 됩니다. 이것을 해결하기 위해 컨테이너와 컴포넌트를 분리하여 리덕스 관련 작업은 컨테이너에서, 그 외의 컴포넌트의 본질적 기능은 기존의 `props`, `state`를 그대로 사용하는 전통적인 리액트 컴포넌트 형태로 작성되도록 하여 컴포넌트의 재사용성을 높이도록 하고 있습니다.

그런데 이러한 컨테이너를 분리하는 패턴을 컴포넌트마다 일일히 작성하는 것은 번거로우며, 나중에 컴포넌트에 `props`가 추가되거나 삭제될 때 이러한 부분의 처리를 일일히 대응해야 한다는 단점이 있습니다.

React Redux는 이러한 상황에서 컨테이너와 컴포넌트의 분리를 편리하게 해주는 리액트 커뮤니티에서 개발된 라이브러리입니다. 컨테이너 작성 부분을 간단하게 해주며, `props`의 구성 변경에 대해서도 신경쓸 필요가 없게 됩니다.

\[caption id="attachment\_3263" align="alignnone" width="2396"\] ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-08-오후-9.36.23.png) 왼쪽은 Redux만 있고 React Redux 없을 때 구현한 컨테이너 코드입니다.\[/caption\]

 

#### **Redux를 사용하는 이유는 무엇인가요?**

대규모 애플리케이션에서 상태 관리를 편하게 하기 위해서입니다. 리액트에서 컴포넌트간 `props`를 통해 데이터를 주고받는 패턴은 애플리케이션의 규모가 켜지면 커질수록 상태 관리가 매우 복잡해지게 됩니다. 예를 들어 루트 컴포넌트 밑에 만 개의 하위 컴포넌트가 있다고 할 때, 이 중 루트 컴포넌트에 영향을 줄 수 있는 하나의 값이 바뀌었는데 그 값을 루트 컴포넌트를 통해 다른 컴포넌트도 사용하고 있다면 기존 패턴에서는 이러한 변경 내용에 일일히 대응하는 코드를 작성하기가 어렵습니다.

하지만 Redux를 이용하면 중앙에서 상태 관리를 하는 저장소(`store`)가 있고, 변경 내용이 이 저장소를 통해 `dispatch`(변경 내용이 저장소에 저장, 갱신됨)되고, 그 내용을 참고하는 다른 컴포넌트들이 `subscribe`(변경 내용을 감지해 컴포넌트의 스테이트를 갱신) 하는 방식으로 `props` 패턴을 사용하지 않고도 편리하게 상태 관리를 할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-08-오후-8.13.05.png)

 

#### **Redux와 React Redux 설치 (npm)**

```
npm install redux
npm install react-redux
```

 

#### **리액트의 index.js 에서 React Redux 설정**

```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

`<App />` 컴포넌트를 `<Provider />`로 감쌉니다. `<Provider />` 에서 `store={저장소_변수명}` 이 부분에는 저장소 js 파일을 불러와 설정합니다. 여기서는 `store.js`에 redux 저장소가 정의되어 있기 때문에 `store`라는 이름으로 임포트하고 `store={store}`를 사용해 저장소를 지정하였습니다.

 

#### **store.js 작성**

`reducer` 함수를 작성한 다음 `export default createStore(reducer)`를 사용하여 다른 컴포넌트에서 저장소를 사용할 수 있도록 합니다. `createStore`의 두 번째 파라미터(`window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()`)는 개발자용 옵션으로, [Redux DevTools 크롬 확장 프로그램](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)을 통해 이 확장이 깔려 있다면 개발자 도구에서 리덕스 상태변화를 실시간으로 추적할 수 있습니다.

```
{
    "mode": "WELCOME",
    "welcome_content": {
        "title": "Welcome.",
        "desc": "World-Wide Web(WWW)이란 다양하고도 광범위한 문서들로의 편리한 접근 방법을 제공해주는 분산 하이퍼미디어 정보 검색 시스템입니다. "
    },
    "selected_content_id": 0,
    "max_content_id": 3,
    "contents": [
        { 
            "id": 1, 
            "title": "HTML", 
            "desc": "HTML은 Hyper Text Markup Language의 약어로 HyperText(웹 페이지에서 다른 페이지로 이동할 수 있도록 하는 것) 기능을 가진 문서를 만드는 언어입니다."
        },
        { 
            "id": 2, 
            "title": "CSS", 
            "desc": "CSS는 Cascading Style Sheets의 약어로 documents가 사용자에게 어떻게 보여질까를 기술하는 언어입니다." 
        },
        { 
            "id": 3, 
            "title": "JavaScript", 
            "desc": "자바스크립트는 ‘웹페이지에 생동감을 불어넣기 위해’ 만들어진 프로그래밍 언어입니다." 
        }
    ]
}
```

```
import { createStore } from 'redux'
import initState from './init.json'

function reducer(state = initState, action) {

    // 상태 관리시 action으로 넘어오는 값을 state에 반영
    // if문은 switch문으로 대체 가능
    if (action.type === 'WELCOME') {
        return { ...state, mode: 'WELCOME', selected_content_id: 0 }
    }
    if (action.type === 'READ') {
        return {
            ...state,
            mode: 'READ',
            selected_content_id: action.id
        }
    }
    if (action.type === 'CREATE') {
        return { ...state, mode: 'CREATE' }
    }
    if (action.type === 'CREATE_PROCESS') {

        const newId = state.max_content_id + 1
        const contents = [...state.contents, {
            id: newId,
            title: action.title,
            desc: action.desc
        }]
        return {
            ...state,
            contents,
            max_content_id: newId,
            mode: 'READ',
            selected_content_id: newId
        }
    }
    if (action.type === 'UPDATE') {
        return { ...state, mode: 'UPDATE' }
    }
    if (action.type === 'UPDATE_PROCESS') {

        const contents = [...state.contents]
        for (let content of contents) {
            if (content.id === action.id) {
                // 이렇게 해도 배열에 있는 객체의 값이 바뀜
                content.title = action.title
                content.desc = action.desc
            }
        }
        return {
            ...state,
            contents,
            mode: 'READ',
            selected_content_id: action.id
        }
    }
    if (action.type === 'DELETE_PROCESS') {
        const contents = state.contents.filter(el => el.id !== state.selected_content_id)
        return {
            ...state,
            contents,
            mode: 'WELCOME',
            selected_content_id: 0
        }
    }

    return state
}

export default createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
```

`reducer` 함수는 두 개의 파라미터를 가지는데,

- 첫 번째는 `state`로 각종 데이터가 저장되는 객체를 지정합니다.
- 두 번째는 `action`으로 다른 컴포넌트에서 `store`를 변경하라는 명령을 내리면 `action`에서 변경 타입과 변경할 내용을 읽어 그 내용들을 `state`에 반영합니다.
- 외부 컴포넌트에서 스토의 내용을 저장하려고 할 때 `store.dispatch({...})` 이런식으로 값을 변경하라는 지시를 하게 됩니다. 여기서 `dispatch` 함수의 파라미터가 `action`으로 넘어가게 됩니다. `store.dispatch({type: 'UPDATE_PROCESS', id, title, desc})` 외부 컴포넌트에 위와 같은 코드가 있다면 이것이 실행될 때에는 `store.js`의 `reducer`함수에서 `action.type`, `action.id`, `action.title`, `action.desc` 로 넘어가 처리합니다.

 

#### **Redux에 의존하지 않는 컴포넌트를 작성 (예: /components/Update.jsx)**

여기서 리덕스에 의존하지 않는 컴포넌트를 작성하는 방법은 간단합니다. `store.js`를 `import`하지 않고, `props`와 `state`를 이용해 컴포넌트간 통신을 하는 전통적인 형태의 리액트 컴포넌트를 작성하면 됩니다.

모든 컴포넌트의 코드를 일일히 올리기엔 무리가 있고 작성된 글을 업데이트하는 기능을 가진 아래 예제만 올립니다.

```
import React, { Component } from 'react';

class Update extends Component {
    state = {
        title: this.props.title,
        desc: this.props.desc,
        id: this.props.id,
    }

    onChangeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        if(this.state.id === 0) {
            return null
        }
        return (
            <form onSubmit={e => {
                e.preventDefault()
                this.props.onSubmit(
                    Number(e.target.id.value),
                    e.target.title.value,
                    e.target.desc.value
                )
            }}>
                <input type="hidden" name="id" value={this.state.id} />
                <p><input 
                    type="text" 
                    name="title" 
                    onChange={this.onChangeHandler.bind(this)} 
                    placeholder="title" 
                    value={this.state.title} 
                /></p>
                <p><input 
                    type="text" 
                    name="desc" 
                    onChange={this.onChangeHandler.bind(this)} 
                    placeholder="description" 
                    value={this.state.desc} /></p>
                <p><button>제출</button></p>
            </form>

        );
    }
}

export default Update;
```

- `this.props.***` - 상위 컴포넌트에서 지정된 `props`를 가져옵니다. 여기서 앞의 3개는 상위 컴포넌트에서 단순히 값을 가져오는 부분이고, 마지막 1개(`this.props.onSubmit`)은 상위 컴포넌트에서 어떠한 작업을 하라는 함수가 작성되면 하위 컴포넌트에서 그 작업을 수행합니다.
- `this.onChangeHandler.bind(this)` - `bind(this)`는 `this`를 리액트를 가르키는 `this`를 사용하도록 컨텍스트를 수동으로 지정합니다.
- 상위 컴포넌트는 Redux가 없다면 일반 컴포넌트가 될 것이고 Redux가 있다면 컨테이너 컴포넌트로 지정될 것입니다. 컨테이너로 분리하는 것의 장점은 컴포넌트의 재사용성이 높아진다는 것입니다.

 

#### **컨테이너 컴포넌트 작성 (/containers/UpdateContainer.jsx)**

리덕스와 관련된 작업은 컨테이너 컴포넌트에서 전적으로 담당하도록 분리하여 작성합니다. 원래 React Redux가 없다면 아래 코드보다 더 복잡한 코드를 작성하여야 합니다만, 여기서는 생략하고 바로 React Redux를 사용한 코드를 올립니다.

```
import { connect } from "react-redux"
import Update from "../components/Update"

export default connect(state => {
    const targetContent = {}
    for(let content of state.contents) {
        if(content.id === state.selected_content_id) {
            targetContent.title = content.title
            targetContent.desc = content.desc
            targetContent.id = content.id
            break
        }
    }
    return {
        title: targetContent.title,
        desc: targetContent.desc,
        id: targetContent.id
    }
}, dispatch => {
    return{
        onSubmit: (id, title, desc) => {
            dispatch({type: 'UPDATE_PROCESS', id, title, desc})
        }
    }
})(Update)
```

- `'react-redux'`로부터 `connect`를 `import` 한 뒤 `connect(mapStateToProps, mapDispatchToProps)(Component)`를  `export default` 로 내보냅니다.
- `mapStateToProps` - 함수 형태의 변수로, `Redux의 State`를 `React의 Props`로 매핑하여 내보내는 것입니다. 하위 컴포넌트가 단순히 값을 받기만 하는 경우 사용합니다. 여기에서 `return`을 객체로 내보내면 객체값을 하위 컴포넌트에서 `this.props.***` 로 사용할 수 있습니다.
- `mapDispatchToProps` - 함수 형태의 변수로, `Redux의 Dispatch`를 `React의 Props`로 내보냅니다. 하위 컴포넌트에서 중앙 컴포넌트의 값을 변경할 필요가 있을 때 필요한 함수들을 주로 정의합니다. return을 객체로 내보내면 하위 컴포넌트에서 `this.props.***` 로 사용할 수 있습니다.
- 여기서 `dispatch`란 하위 컴포넌트에서 중앙 저장소에 저장된 값을 변경할 때 사용하는 명령어를 뜻합니다.
- `dispatch(객체)`는 `connect` 함수 내부에 정의되어 있기 때문에 별도의 `store`를 임포트할 필요가 없습니다. 객체에는 일반적으로 `type`이 정의되어야 하며 이 타입을 바탕으로 `store.js`에서 취할 액션을 찾은 다음(`action.type`) 나머지 변수들을 `action.***`을 처리하는 방식으로 진행합니다.
- 이 코드에서는 `dispatch`의 타입은 `'UPDATE_PROCESS'`로 정의되어 있습니다. `store.js`의 코드를 보시면 `reducer` 함수에서 `action.type`을 읽어 `action.type`이 `UPDATE_PROCESS` 일때 처리하는 부분이 다음과 같이 있습니다. (위의 `store.js` 코드 설명 참고)  ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-08-오후-8.55.21.png)
- (참고) React Redux가 없을 때 `store.dispatch` 사용법은 일반적으로 다음과 같습니다.  ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-08-오후-8.45.06.png)
- (참고) React Redux가 없을 떄 `mapStateToProps` 의 기능을 대신하는 `store.subscribe` 의 사용법은 다음과 같습니다.  ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-08-오후-9.27.23.png)

 

#### **App 에서 컨테이너를 로딩하여 사용**

```
import './App.css';
import NavContainer from './containers/NavContainer';
import HeaderContainer from './containers/HeaderContainer';
import ControlContainer from './containers/ControlContainer';
import ReadContainer from './containers/ReadContainer';
import { connect } from 'react-redux';
import { Component } from 'react';
import CreateContainer from './containers/CreateContainer';
import UpdateContainer from './containers/UpdateContainer';

class App extends Component {

  render() {
    return (
      <div className="App">

        <HeaderContainer />

        <NavContainer />

        <ControlContainer />

        {(this.props.mode === 'READ' || this.props.mode === 'WELCOME') && <ReadContainer />}
        {this.props.mode === 'CREATE' && <CreateContainer />}
        {this.props.mode === 'UPDATE' && <UpdateContainer />}
      </div>
    )
  }

}

// export default App;

export default connect(
  state => ({
    mode: state.mode
  })
)(App);
```

- `App` 에 하위 컴포넌트를 추가할 때 핵심 컴포넌트가 아닌 '컨테이너 컴포넌트'를 추가합니다.
- `App` 컴포넌트에도 컨테이너를 추가할 수 있습니다. 위의 경우 컴포넌트의 파일을 별도로 분리하지 않고 하나의 파일 내에서 컨테이너와 컴포넌트가 같이 구현된 경우입니다.
- `connect()()` 를 사용해 Redux 저장소에서 `state`의 `mode`를 읽어온 다음, `App` 컴포넌트와 연결하고, `App` 컴포넌트에서 `this.props`를 통해 컨테이너에서 받은 값을 사용할 수 있습니다.

 

{% youtube "https://www.youtube.com/watch?v=1U7_D5_scaE" %}
