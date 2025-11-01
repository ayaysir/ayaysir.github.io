---
title: "타입스크립트 + typesafe-actions: createReducer 사용 예제 (redux-actions의 handleActions 대체)"
date: 2021-01-27
categories: 
  - "DevLog"
  - "React.js"
---

1\. redux-action의 `handleActions` 대용으로 [typesafe-actions의 createReducer](https://github.com/piotrwitek/typesafe-actions#migrating-from-redux-actions-to-typesafe-actions) 를 사용합니다.

```
# NPM
npm install typesafe-actions

# YARN
yarn add typesafe-actions
```

참고로 redux-action은 리덕스에서 액션 생성 함수, 리듀서를 작성하기 편하게 하기 위한 목적으로 사용됩니다.

```
import { createAction } from "redux-actions"
import { createReducer } from "typesafe-actions"

// 액션 타입
const START_LOADING = "loading/START_LOADING"
const END_LOADING = "loading/END_LOADING"

// 액션 생성 함수
export const startLoading = createAction(
    START_LOADING,
    (actionType: any) => actionType
)

export const endLoading = createAction(
    END_LOADING,
    (actionType: any) => actionType
)

// 초기 상태
const initialState = {}

// 리듀서 함수 정의
const loading = createReducer(initialState, {
    [START_LOADING]: (state, { payload }) => ({
        ...state,
        [payload]: true
    }),
    [END_LOADING]: (state, { payload }) => ({
        ...state,
        [payload]: false
    })
},)

export default loading
```

 

2\. 루트 리듀서 근처에 타입 에러 방지를 위한 `type`을 작성합니다. (src/modules/index.ts)

```
import { combineReducers } from "redux"
import { all } from "redux-saga/effects"
import auth, { authSaga } from "./auth"
import loading from "./loading"
import codeGroup, { codeGroupSaga } from "./codegroup"

// 루트 리듀서
const rootReducer = combineReducers({
    auth,
    loading,
    codeGroup
})

// 루트 사가
export function* rootSaga() {
    yield all([
        authSaga(),
        codeGroupSaga()
    ])
}

export default rootReducer

// 루트 리듀서의 반환값을 유추
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내기
export type RootState = ReturnType<typeof rootReducer>
```

 

3\. `createReducer`로 만든 `loading`의 상태값에 접근하고자 할 경우, react-redux의 `useSelector`를 사용하여 불러옵니다. 이 때 `state`의 타입은 위에서 정의한 `RootState` 타입이며 객체 프로퍼티에 접근하기 위해 변수 타입에 `any`를 지정합니다.

```
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import CodeGroupList from "../../components/codegroup/CodeGroupList"
import { RootState } from "../../modules"
import { fetchList, FETCH_LIST } from "../../modules/codegroup"

const CodeGroupListContainer = () => {
    // 스토어 dispatch 사용 가능
    const dispatch = useDispatch()

    // 스토어 상태 조회
    const loading: any = useSelector((state: RootState) => { //...// })

    // 마운트될 때 코드그룹 목록을 가져옴
    useEffect(() => {
        dispatch(fetchList())
    }, [dispatch])

    return `<CodeGroupList codeGroups={codeGroups} isLoading={isLoading} />`
}
export default CodeGroupListContainer
```

참고로 `FETCH_LIST` 부분은 다음과 같습니다.

```
export const FETCH_LIST = "codeGroup/FETCH_LIST"
```

 

 ![](/assets/img/wp-content/uploads/2021/01/-2021-01-28-오전-12.34.05-e1611761666127.png)

 

출처: [5\. TypeScript 에서 리덕스 프로처럼 사용하기](https://react.vlpt.us/using-typescript/05-ts-redux.html)
