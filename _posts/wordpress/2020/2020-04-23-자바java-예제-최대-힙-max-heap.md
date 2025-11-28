---
title: "자바(Java) 예제: 최대 힙 (Max Heap)"
date: 2020-04-23
categories: 
  - "DevLog"
  - "Java"
  - "코딩테스트"
tags: 
  - "java"
  - "자바"
---

자료구조 학습용 예제입니다.

## **힙과 배열**

- 힙(Heap): 데이터에서 최대값과 최소값을 빠르게 찾기 위해 고안된 완전 이진 트리(Complete Binary Tree)
- 완전 이진 트리: 노드를 삽입할 때 최하단 왼쪽 노드부터 차례대로 삽입하는 트리
- 일반적으로 힙 구현시 배열 자료구조를 활용함

## **힙의 인덱스 구하기**

- 배열은 인덱스가 0번부터 시작하지만, 힙 구현의 편의를 위해, root 노드 인덱스 번호를 1로 지정하면, 구현이 좀 더 수월

 ![](/assets/img/wp-content/uploads/2020/04/heap_array.png)

### 부모 노드 인덱스 번호

> (`//` : 몫만 구함)
```
부모 노드 인덱스 번호 (parent node's index) 
= 자식 노드 인덱스 번호 (child node's index) // 2 
```

### 왼쪽 자식 노드 인덱스 번호
```
왼쪽 자식 노드 인덱스 번호 (left child node's index) 
= 부모 노드 인덱스 번호 (parent node's index) * 2
```

### 오른쪽 자식 노드 인덱스 번호

```
오른쪽 자식 노드 인덱스 번호 (right child node's index) 
= 부모 노드 인덱스 번호 (parent node's index) \* 2 + 1
```



## 예제

 

<!-- https://gist.github.com/ayaysir/f5d8a90eb056432cdc67e44284ef3d9c -->
{% gist "f5d8a90eb056432cdc67e44284ef3d9c" %}

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-23-pm-8.26.45.png)  
 
 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-23-pm-8.50.22.png)
