---
title: "자바스크립트 예제: 2차원 정방형 배열(square array) 여러 번 회전 (공식 이용)"
date: 2020-12-05
categories: 
  - "DevLog"
  - "코딩테스트"
  - "JavaScript"
---

알고리즘에 대한 설명은 [여기](https://shoark7.github.io/programming/algorithm/rotate-2d-array)에 나와 있습니다. 여기에서는 공식만 설명합니다.

## 정방형 배열

정방형 배열은 행과 열의 수가 같은 2차원 배열을 뜻합니다. 이러한 정방형 배열은 회전할 수 있는 경우는 4가지 밖에 없습니다.

- 오른쪽으로 90도 회전 (왼쪽으로 270도 회전)
- 오른쪽, 왼쪽으로 180도 회전
- 오른쪽으로 270도 회전 (왼쪽으로 90도 회전)
- 오른쪽, 왼쪽으로 360도 회전 -> 이것은 0도 회전으로 움직이지 않은 것과 같습니다.

 

아래는 알파벳 A 부터 Y 까지 25자로 이루어진 `(5 * 5)` 크기의 2차원 배열을 만드는 과정입니다.

### 기초 정방형 만들기 코드

```js
const N = 5

// 배열 생성
const originalArr = Array.from(Array(N), () => new Array(5).fill(null))
let startChar = 65
for(let i = 0; i < N; i++) {
    for(let j = 0; j < N; j++) {
        originalArr[i][j] = String.fromCharCode(startChar++)
    }
}

function rotateArr(originalArr) {
    const rotatedArr = Array.from(Array(N), () => new Array(5).fill(null))
    
    for(let row = 0; row < N; row++) {
        for(let col = 0; col < N; col++) {
            /* === 공식 삽입 === */
        }
    }
    
}
```

### 회전 공식

여기서 공식 삽입 부분에 아래 공식을 사용하면 됩니다. 1번 회전은 정방형 배열이므로 왼쪽 또는 오른쪽으로 90도 회전하게 됩니다. 예를 들어 오른쪽으로 1번 회전하는 작업을 원하는 경우 `90 * 1 = 90` 이므로 오른쪽으로 90도 회전하게 되는 것입니다. 그러면 아래 90도 회전시 사용하는 공식을 사용하면 아래의 코드와 같이 됩니다.

그리고 한 번 회전하는 게 아니라 여러 번을 회전할 필요도 있을 것입니다. 이런 상황에서도 일일히 90도 회전을 하면서 계산하는 방법도 있겠지만 효율성이 매우 떨어집니다. 이 때 회전 수(`count`)를 `4`로 나눈것의 나머지(`%`)를 활용하면 정확히 몇 도를 한 번 회전하면 동일한 효과를 얻을 수 있는지 알 수 있습니다. 이 숫자를 바탕으로 분기문을 만들면 이중 `for`문만 실행하는 것으로 배열 회전을 할 수 있습니다.

   
| **(오른쪽 회전)** | **(=count % 4)** |  |   **사용 공식**   |
| --- | --- | --- | --- |
| **회전 각도** | **오른쪽 회전** | **왼쪽 회전** |
| 90° | 1 | \-3 | rotatedArr\[col\]\[N - 1 - row\] = originalArr\[row\]\[col\] |
| 180° | 2 | \-2 |   rotatedArr\[N - 1 - row\]\[N - 1 - col\] = originalArr\[row\]\[col\]     |
| 270° | 3 | \-1 | rotatedArr\[N - 1 - col\]\[row\] = originalArr\[row\]\[col\] |
| 360° | 0 | 0 | \-- Do Nothing -- |


### 회전 공식이 포함된 코드

```js
const rotatedArr = Array.from(Array(N), () => new Array(5).fill(null))

for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
        /* === 공식 삽입 === */
        rotatedArr[col][N - 1 - row] = originalArr[row][col]
    }
}
```

 

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-06-am-12.11.55.png)

 

이 공식들을 이용해서 배열을 회전하는 모든 경우의 수에 대응할 수 있는 함수 코드를 추가합니다.

```js
function viewArr(arr, title) {
    let text = ""
    for (let i = 0; i < N; i++) {
        text += arr[i].join(' ') + "\n"
    }
    console.log("\n" + title + "\n\n" + text)
}

const N = 5

// 배열 생성
const originalArr = Array.from(Array(N), () => new Array(5).fill(null))
let startChar = 65
for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
        originalArr[i][j] = String.fromCharCode(startChar++)
    }
}
viewArr(originalArr, "원래 배열")

function rotateArr(originalArr, rotateCount) {

    const rotatedArr = Array.from(Array(N), () => new Array(5).fill(null))
    rotateCount = rotateCount % 4

    if (rotateCount == 1 || rotateCount == -3) {
        
        for (let row = 0; row < N; row++) {
            for (let col = 0; col < N; col++) {
                rotatedArr[col][N - 1 - row] = originalArr[row][col]
            }
        }
        
    } else if (rotateCount == 2 || rotateCount == -2) {
        
        for (let row = 0; row < N; row++) {
            for (let col = 0; col < N; col++) {
                rotatedArr[N - 1 - row][N - 1 - col] = originalArr[row][col]
            }
        }
        
    } else if (rotateCount == 3 || rotateCount == -1) {
        
        for (let row = 0; row < N; row++) {
            for (let col = 0; col < N; col++) {
                rotatedArr[N - 1 - col][row] = originalArr[row][col]
            }
        }
        
    } else {
        return originalArr
    }

    return rotatedArr
}

const rotateCount = prompt("배열 회전 횟수 입력, 양수는 오른쪽, 음수는 왼쪽")

viewArr(rotateArr(originalArr, rotateCount), 
        `${rotateCount < 0 ? '왼쪽' : '오른쪽'}으로 ${rotateCount} 번 회전`)
```

## 동작 화면

 ![오른쪽으로 37번 회전](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-06-am-12.32.27.png)  
 *오른쪽으로 37번 회전*
 
 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-06-am-12.32.49.png)   
 *왼쪽으로 -4253번 회전*
 
 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-06-am-12.33.27.png)  
 *오른쪽으로 360번 회전*

 

배열의 회전은 이미지 회전 등에서 응용될 수 있습니다. 참고로 자바스크립트는 이미지 정보도 배열로 처리합니다. ([관련 글](http://yoonbumtae.com/?p=879))
