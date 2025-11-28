---
title: "자바스크립트: 배열 Array.reduce"
date: 2020-06-14
categories: 
  - "DevLog"
  - "JavaScript"
---

## Reduce 란?

> MDN 문서 [바로가기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

자바스크립트에서 배열의 `reduce` 기능은 배열을 순회하면서 누산기(`accumulator`)에 값을 계속 쌓아놓고 최종적으로 누산기의 값을 반환하는 reducer의 기능을 수행합니다. reducer의 사전적 의미와 매칭이 잘 안되는데 어떤 물질에서 원액(누산기의 값)만 추출한다는 의미로 생각하면 될 것 같습니다.

누산기의 값은 줄어들지 않으며 리턴식은 누산기에 합산됩니다. 그리고 마지막까지 순회한 후 최종적으로 누산기의 값만을 반환한다는 특성을 기억하면 됩니다.

```js
arr.reduce((accumulator, currentValue, opt_currentIndex, opt_array) => {
    ....
}, opt_initialValue)
```

- `accumulator`(누산기): `accmulator`는 콜백의 반환값을 누적합니다. 콜백의 이전 반환값 또는, 콜백의 첫 번째 호출이면서 `initialValue`를 제공한 경우에는 `initialValue`의 값입니다.
- `currentValue`: 처리할 현재 요소.
- `currentIndex` (옵셔널): 처리할 현재 요소의 인덱스. `initialValue`를 제공한 경우 `0`, 아니면 `1`부터 시작합니다.
- `array` (옵셔널): `reduce()`를 호출한 배열.
- `initialValue` (옵셔널): `callback`의 최초 호출에서 첫 번째 인수에 제공하는 값. 초기값을 제공하지 않으면 배열의 첫 번째 요소를 사용합니다. 빈 배열에서 초기값 없이 `reduce()`를 호출하면 오류가 발생합니다.

 
## 예제

### **예제 1: 배열의 숫자 더하기**

```js
const arr = [0, 1, 4, 6, 8, 10]
const output = arr.reduce((accumulator, curretnValue) => accumulator + curretnValue) // 29
```

 

 

### **예제 2: 배열 내 객체의 숫자 더하기**

반드시 `initialValue`를 지정해야 합니다. `initialValue`는 반드시 숫자여야 할 필요는 없으며, 필요에 따라 다양한 자료형으로 선언 가능합니다.

```js
const xyArr = [{
    x: 1,
    y: 0
}, {
    x: 2,
    y: 5,
}, {
    x: 3,
    y: 11
}]

// x 값만 더하기
const sum = xyArr.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.x;
}, 0)

// xy 객체를 생성한 후 x, y 각각 더하기
const sum2 = xyArr.reduce((accumulator, currentValue) => {
    accumulator.x += currentValue.x
    accumulator.y += currentValue.y
    return accumulator
}, {x: 0, y: 0})

console.log(sum) // 6
console.log(sum2) // 16
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-14-pm-10.39.18.png)

 

### **예제 3: 배열 펼치기**

```js
const flattend = [[0, 4], ["x", "y"], ["zz"]].reduce((acc, v) => {
    return acc.concat(v)
})
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-14-pm-10.42.06.png)

 

```js
const names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice', 'Alice']
const count = names.reduce((allNames, name) => {
    if(name in allNames) {// in: v 키(key)가 allNames 객체 안에 있는지 확인
        allNames[name] += 1
    } else {
        allNames[name] = 1  // 키가 없으면 생성
    }
    
    return allNames
}, {}) // allNames 초기값을 객체로 설정
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-14-pm-10.51.42.png)

 

### **예제 4: 속성으로 객체 분류하기**

```js
const people = [{
        name: 'Alice',
        age: 21
    },
    {
        name: 'Max',
        age: 20
    },
    {
        name: 'Jane',
        age: 20
    }
]

function groupBy(people, prop) {
    return people.reduce((acc, v) => {
        const key = v[prop] 
        
        if(!acc[key])   acc[key] = []
        acc[key].push(v)
        
        return acc
    }, {})
}
console.log(groupBy(people, "age"))
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-14-pm-10.58.40.png)

 

### **예제 5: 객체에서 배열을 뽑아 연결하기 (초기값과 획장 연산자 `...` 이용)**

```js
const friends = [{
    name: 'Anna',
    books: ['Bible', 'Harry Potter'],
    age: 21
}, {
    name: 'Bob',
    books: ['War and peace', 'Romeo and Juliet'],
    age: 26
}, {
    name: 'Alice',
    books: ['The Lord of the Rings', 'The Shining'],
    age: 18
}]
```

```js
const books = friends.reduce((acc, v) => {
    return [...acc, ...v.books] // acc의 모든 원소를 나열하고, v의 books에 있는 모든 원소도 나열
}, [])
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-14-pm-11.17.19.png)

### **예제 6: 배열의 중복 제거**

사전에 배열을 미리 정렬합니다.

```js
const dArr = [1, 2, 1, 6, 2, 2, 3, 5, 4, 5, 3, 4, 4, 7, 4, 4]
const result = dArr.sort().reduce((acc, v) => {
    const len = acc.length
    // acc 배열의 길이가 0이거나, acc 배열의 마지막 원소가 현재 원소랑 같지 않다면
    if(len === 0 || acc[len - 1] !== v) {
        acc.push(v)
    }
    return acc
}, [])
console.log(result)
```

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-14-pm-11.08.12.png)

#### 참고: `Array.from` 과 `Set`을 이용한 중복제거

```js
const result = Array.from(new Set(dArr))
```
