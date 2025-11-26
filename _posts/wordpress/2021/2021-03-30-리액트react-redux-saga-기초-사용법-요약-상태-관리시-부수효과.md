---
title: "리액트(React): Redux-saga 기초 사용법 요약 (상태 관리시 부수효과 관리하는 미들웨어)"
date: 2021-03-30
categories: 
  - "DevLog"
  - "React.js"
---

- [리액트(React): React Redux 요약 정리](/posts/리액트react-react-redux-요약-정리/)

**[redux-saga 깃허브](https://github.com/redux-saga/redux-saga)**

## **역할**

> redux-saga는 애플리케이션에서 일어나는 사이드 이펙트(side effects) (데이터를 불러오는 비동기 처리나 브라우저 캐쉬에 접근하는 행위들)을 쉽게 관리하며 효과적인 실행, 손쉬운 테스트 그리고 에러 핸들링을 쉽게 해준다.

 

## **특징**

- saga 패턴을 차용 ([참고 블로그](https://uzihoon.com/post/181be130-63a7-11ea-a51b-d348fee141c4))
- 미들웨어로서 역할을 수행 (React는 Redux 액션을 수행하면 Redux-Saga에서 디스패치하여 Redux의 액션을 인터셉트합니다. Proxy와 유사한 개념입니다. 중간에 가로챈 액션의 역할을 수행 후 다시 액션을 발행하여 데이터를 저장하거나 다른 이벤트를 수행시킵니다.)
- 코드 작성 시 제너레이터 함수 사용 - [자바스크립트 ES6+: 제너레이터 함수 (generator function)](http://yoonbumtae.com/?p=3372)

 

이 글의 진행 순서는 실제 작업 순서와는 연관이 없습니다.

전체 코드는 [https://github.com/ayaysir/saga-board-1/](https://github.com/ayaysir/saga-board-1/) 에서 볼 수 있습니다.

## **방법**

리덕스 사가 기초 요약 리덕스 액션 리액트 리덕스

### **npm 라이브러리 설치**

```bash
npm install redux react-redux redux-actions redux-devtools-extension redux-saga
```

- `"react-redux"`: Redux 를 React 환경에 맞게 편하게 사용하게 해주는 역할입니다.
- `"redux"`: 상태 관리 도구입니다.
- `"redux-actions"`: `createAction`, `handleAction` 등의 함수를 제공하며 액션 생성 자동화, 분기 코드 간소화 등의 작업을 도와주는 역할입니다.
- `"redux-devtools-extension"`: 브라우저 콘솔에서 redux에 의한 상태 변화를 추적하기 위한 개발자 도구를 연결하는 역할입니다.
- `"redux-saga"`: 상태 관리 중 부수 효과를 처리하기 위한 미들웨어

 

### **src/index.js**

최상단 인덱스 파일입니다.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";

// 리덕스와 미들웨어 적용을 위해 필요한 모듈을 불러온다.
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer, { rootSaga } from "./modules";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

const sagaMiddleware = createSagaMiddleware()

// 루트 리듀서를 전달받아 스토어를 생성한다. composeWithDevTools 함수는 Redux DevTools의 기능을
// 사용할 수 있게 한다. applyMiddleware 함수를 통해 redux-saga 미들웨어를 적용한다.
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

// 주의 //
sagaMiddleware.run(rootSaga) // 리덕스 사가 미들웨어 실행

ReactDOM.render(
  `<React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')`
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

1. Redux에서 사용할 저장소(`store`)를 생성합니다.
2. redux-saga 미들웨어를 적용합니다.
3. 리덕스 사가 미들웨어를 실행합니다.
4. `App` 부분을 `<Provider store={store}></Provider>` 로 감싸 `store`를 사용할 수 있게 합니다.

 

### **src/lib/api.js**

axios를 사용해 외부 API 호출 함수를 작성합니다.

```jsx
import axios from "axios"

// 상품 상세 조회 API 호출 함수
export const fetchItemApi = (itemId) => axios.get(`/items/${itemId}`)

// 상품 목록 조회 API 호출 함수
export const fetchItemListApi = () => axios.get("/items")

// 상품 삭제 API
export const removeItemApi = (itemId) => axios.delete(`/items/${itemId}`)
```

 

### **src/module/index.js**

```jsx
import { combineReducers } from "redux"
import { all } from "redux-saga/effects"
import item, { itemSaga } from "./item"
import loading from "./loading"

// 루트 리듀서와 다른 리듀서를 결합
// item 리듀서와 loading 리듀서를 추가
const rootReducer = combineReducers({
    item,
    loading
})

// 루트 사가
// all 함수는 여러 사가를 합친다.
export function* rootSaga() {
    yield all([itemSaga()])
}

export default rootReducer
```

1. `combineReducer`를 통해 리듀서들을 결합시킵니다. (리듀서는 redux-actions의 `handleAction`을 이용해 생성)
2. `root` 사가를 생성하고 개별 생성된 모든 사가 함수들을 합칩니다. 사가 함수의 정의는 아래에서 설명합니다.

 

### **src/module/loading.js**

로딩 상태를 관리하는 부분입니다.

```jsx
import { createAction, handleActions } from "redux-actions"

// action type (액션 상수 타입 정의)
const START_LOADING = "loading/START_LOADING"
const END_LOADING = "loading/END_LOADING"

// create action function
// 로딩 시작/끝 액션 함수를 만들고 외부에서 사용할 수 있도록 공개한다.
export const startLoading = createAction(START_LOADING, actionType => actionType)
export const endLoading = createAction(END_LOADING, actionType => actionType)

// init states - 모듈의 초기 상태 설정
const initialState = {}

// redux의 액션의 type에 따른 작업 - if문 또는 switch 문을 아래로 대체
// 해당 액션별 로딩 시작/끝 상태를 설정한다.
const loading = handleActions(
    {
        [START_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: true
        }),
        [END_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: false
        })
    },
    initialState
)

export default loading
```

- 먼저 액션 상수를 정의합니다.
- `createAction` 함수를 이용하여 액션 함수를 생성합니다. `startLoading` 변수는 함수 타입으로 한 개의 파라미터를 갖습니다. 나중에 이 `startLoading` 변수가 스토어에 저장 시 파라미터를 키값으로 하여 `true`, `false` 를 스토어에 저장하게 됩니다.
- `handleAction`을 이용하여 액션에 타입에 따른 작업 분기를 설정합니다. `switch` 문 대신 객체 형태로 작성합니다. `action.payload`는 `createAction` 으로 만들어진 변수가 나중에 사가에서 실행될 때 파라미터의 값과 대응되는 부분입니다.

 

### **src/module/item.js**

메인 컨텐츠에 대한 부분입니다.

```jsx
import { createAction, handleActions } from "redux-actions"
import { takeLatest, call, put } from "redux-saga/effects"
import { fetchItemApi, fetchItemListApi } from "../lib/api"

import { startLoading, endLoading } from "./loading"

// 액션 타입 (상세)
const FETCH_SUCCESS = "item/FETCH_SUCCESS"
const FETCH_FAILURE = "item/FETCH_FAILURE"

// 상세 조회 액션 타입
export const FETCH_ITEM = "item/FETCH_ITEM"

// 액션 타입 (목록)
const FETCH_LIST_SUCCESS = "item/FETCH_LIST_SUCCESS"
const FETCH_LIST_FAILURE = "item/FETCH_LIST_FAILURE"

// 목록 조회 액션 타입
export const FETCH_ITEM_LIST = "item/FETCH_ITEM_LIST"

// 액션 생성 함수 (상세)
export const fetchSuccess = createAction(FETCH_SUCCESS, data => data)
export const fetchFailure = createAction(FETCH_FAILURE, e => e)

// 상세 조회 액션 생성 함수
export const fetchItem = createAction(FETCH_ITEM, itemId => itemId)

// 액션 생성 함수 (목록)
export const fetchListSuccess = createAction(FETCH_LIST_SUCCESS, data => data)
export const fetchListFailure = createAction(FETCH_LIST_FAILURE, e => e)

// 목록 조회 액션 생성 함수
export const fetchItemList = createAction(FETCH_ITEM_LIST)

// 상품 상세정보를 조회하는 태스크
function* fetchItemSaga(action) {
    yield put(startLoading(FETCH_ITEM))
    try {
        const response = yield call(fetchItemApi, action.payload)
        yield put(fetchSuccess(response.data))
    } catch(e) {
        yield put(fetchFailure(e))
    }
    yield put(endLoading(FETCH_ITEM))
}

// 상품 목록을 조회하는 태스크
function* fetchItemListSaga() {
    yield put(startLoading(FETCH_ITEM_LIST))
    try {
        const response = yield call(fetchItemListApi)
        yield put(fetchListSuccess(response.data))
    } catch(e) {
        yield put(fetchListFailure(e))
    }
    yield put(endLoading(FETCH_ITEM_LIST))
}

// 상품 saga 함수 작성
export function* itemSaga() {
    // 상세조회 태스크
    yield takeLatest(FETCH_ITEM, fetchItemSaga)
    // 목록 조회 태스크 수행
    yield takeLatest(FETCH_ITEM_LIST, fetchItemListSaga)
}

// 모듈의 초기 상태
const initialState = {
    item: null, // 하나의 상품 정보
    items: [],  // 상품 목록
    error: null // 응답에러 정보
}

// 리듀서 함수 정의
// 리듀서는 상태변화를 일으키는 함수이다.
const item = handleActions(
    { // 상세 조회 상태 변경
        [FETCH_SUCCESS]: (state, action) => ({
            ...state,
            item: action.payload
        }),
        [FETCH_FAILURE]: (state, action) => ({
            ...state,
            error: action.payload
        }),
        // 목록 조회 상태 변경
        [FETCH_LIST_SUCCESS]: (state, action) => ({
            ...state,
            items: action.payload
        }),
        [FETCH_LIST_FAILURE]: (state, action) => ({
            ...state,
            error: action.payload
        })
    },
    initialState
)

export default item
```

- 제너레이터 함수 형식으로 사가 함수를 작성합니다.
- 사가란 특정 액션에 대한 리스너입니다.
- 리덕스 사가에서 이펙트를 다룰 수 있는 명령어가 몇 개 있습니다.
    - `put` - 이 함수를 통하여 새로운 액션을 디스패치(변경 내용이 저장소에 저장, 갱신됨) 할 수 있습니다.
        - `put(loading(FETCH_ITEM))`을 함으로써 `loading` 액션 함수가 실행되며, 저장소에 저장이 됩니다. ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-31-am-12.12.27.png)
    - `takeEvery` - 특정 액션 타입에 대하여 디스패치되는 모든 액션들을 모니터링하고 처리하는 역할입니다,
    - `takeLatest` - 특정 액션 타입에 대하여 디스패치된 가장 마지막 액션만을 처리하는 함수입니다.
        - 특정 액션을 처리하고 있는 동안 동일한 타입의 새로운 액션이 디스패치되면 기존에 하던 작업을 무시하고 새로운 작업을 시작합니다.
    - `call` - 인자로 함수나 saga task를 받을 수 있습니다. 보통 `Promise` 등의 실행 (ajax 등) 에 쓰이며 `Promise`가 `resolve` 될 때까지 다음 작업이 `pending` 됩니다.

 

### **src/components/ItemList.jsx (일부)**

아이템을 표시하는 외부 영향이 없는 재사용 가능한 컴포넌트입니다.

```jsx
import { Link } from "react-router-dom"

export default function ItemList({ items, isLoading }) {
    return (
        `<div align="center">
            <h2 className="title">상품 목록</h2>
            {isLoading && "로딩중..."}
            {!isLoading && items && (
                <생략>
                </생략>
            )}
        </div>`
    )
}
```

 

### **src/container/ItemListContainer.jsx**

ItemList 컴포넌트를 감싸 상태 정보를 관리하는 고차 컨테이너(HOC) 함수입니다.

```jsx
import ItemList from "../components/ItemList"
import { useDispatch, useSelector } from "react-redux"
import React, { useEffect } from "react"
import { fetchItemList, FETCH_ITEM_LIST } from "../modules/item"

const ItemListContainer = () => {

    // useDispatch: 컴포넌트 내부에서 스토어의 내장 함수 dispatch를 사용할 수 있게 해주는 hook 이다.
    // useSelector: connect 함수를 대신하여 스토어 상태를 조회

    const dispatch = useDispatch()
    const { items, isLoading } = useSelector(({ item, loading }) => ({
        items: item.items,
        isLoading: loading[FETCH_ITEM_LIST]
    }))

    // 브라우저 상에 컴포넌트가 나타날 때 상품 목록을 조회하는 함수를 실행
    useEffect(() => {
        dispatch(fetchItemList())
    }, [dispatch])

    return `<ItemList items={items} isLoading={isLoading} />`
}

export default ItemListContainer
```

- `dispatch(fetchItemList())` 가 실행되면 `"item/FETCH_ITEM_LIST"` 액션이 전송되며, item.js의 `itemSaga()`의 `yield takeLatest(FETCH_ITEM_LIST, fetchItemListSaga)` 부분에 의해 목록 조회 태스크가 실행됩니다.
- api 로딩에 성공해 `"item/FETCH_LIST_SUCCESS"`  타입의 액션이 전송된다면 item.js의 `handleAction`으로 생성된 분기 함수에서 액션을 찾아 상태 저장소의 `item` 키에 받아온 데이터를 추가합니다.
- `return` 으로 `ItemList` 컴포넌트를 넘기고 `props`로 `items`, `isLoading`을 추가한 뒤 `ItemList` 컨테이너에서 첫 번째에 위치한 객체 형태의 파라미터를 읽어올 수 있습니다.

 

타입스크립트에서 작업하는 경우 handleAction 대신 다른 함수를 사용해야 합니다.

- [타입스크립트 + typesafe-actions: createReducer 사용 예제 (redux-actions의 handleActions 대체)](http://yoonbumtae.com/?p=3548)
