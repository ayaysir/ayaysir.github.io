---
title: "트리 순회: 전위, 중위, 후위 (preorder, inorder, postorder)"
date: 2020-05-08
categories: 
  - "DevLog"
  - "코딩테스트"
tags: 
  - "자바스크립트"
---

트리 자료구조의 순회 방법으로 전위 순회(preorder), 중위 순회(inorder), 후위 순회(postorder)가 있습니다.

출처 [링크](https://www.acmicpc.net/problem/1991)

 ![](/assets/img/wp-content/uploads/2020/05/trtr.png)

예를 들어 위와 같은 이진 트리가 입력되면,

- **전**위 순회한 결과 : `ABDCEFG` // (**루**트) (**왼**쪽 자식) (**오**른쪽 자식) **☞ 전루왼오 (∠)**
- **중**위 순회한 결과 : `DBAECFG` // (**왼**쪽 자식) (**루**트) (**오**른쪽 자식) **☞ 중왼루오 (∧)**
- **후**위 순회한 결과 : `DBEGFCA` // (**왼**쪽 자식) (**오**른쪽 자식) (**루**트) **☞ 후왼오루 (⦣)**

가 됩니다.

 

#### **예제 (자바스크립트)**

입력은 첫 줄에는 노드 개수, 둘째줄 부터는 공백을 기준으로 제일 왼쪽이 부모 노드, 그 오른쪽부터 왼쪽 자식 노드, 오른쪽 자식 노드 입니다.

참고로 트리를 구현하고자 할 때 객체를 사용해 키(key)로 부모 노드, 값(value)을 자식 노드들의 배열(또는 기타 자료형)로 하면 구현이 편리하다고 합니다.

[재귀함수](http://yoonbumtae.com/?p=2350)를 사용하며, 출력 부분의 위치만 바꾸면 전위, 중위, 후위 출력을 결정할 수 있다는 신기한 점(?) 이 있습니다.

```
        const input1 = `7
A B C
B D .
C E F
E . .
F . G
D . .
G . .`
```

```
function traverseTree(inputStr) {
    const spl = inputStr.split(/\n/)
    const nodeCount = spl[0]
    const treeArr = spl.slice(1)
    const treeObj = {}
    treeArr.forEach(el => {
        const elSpl = el.split(/ /)
        treeObj[elSpl[0]] = elSpl.slice(1) 
    })
    console.log(treeArr, treeObj)
    
    
    const order = (node, order) => {
        const outArr = []
        
        // outArr.push())의 위치에 따라 전위, 중위, 후위 출력이 결정됨
        const orderRecursive = (node, order) => {
             
            const nodeLeft = treeObj[node][0]
            const nodeRight = treeObj[node][1]
            
            order == "pre" && outArr.push(node)
            if(nodeLeft != ".") {
                orderRecursive(nodeLeft, order)
            }
            order == "in" && outArr.push(node)
            if(nodeRight != ".") {
                orderRecursive(nodeRight, order)
            }
            order == "post" && outArr.push(node)
        }
        orderRecursive(node, order)
        return outArr.join("")
        
    }
    return order("A", "pre") + "\n" + order("A", "in") + "\n" + order("A", "post")
}
```

```
console.log(traverseTree(input1))
```

 ![](/assets/img/wp-content/uploads/2020/05/screenshot-2020-05-08-pm-8.12.09.png)
