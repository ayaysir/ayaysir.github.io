---
title: "Swift: 우선 순위 큐 Priority Queue (설명 + 구현)"
date: 2023-12-18
categories: 
  - "DevLog"
  - "Swift"
  - "코딩테스트"
---

##### **이전 글**

- [Swift: 큐(queue) 구현하기](http://yoonbumtae.com/?p=5968)

 

### **우선순위 큐 (Priority Queue)**

#### **힙 (Heap)**

우선순위 큐 구현에서 가장 많이 사용하는 자료구조가 힙(Heap) 구조이므로 먼저 힙에 대해 아는 것이 좋습니다.

힙은 최댓값 및 최솟값을 찾아내는 연산을 빠르게 하기 위해 고안된 완전이진트리(complete binary tree)를 기본으로 한 자료구조(tree-based structure)입니다. 힙의 속성으로는 A가 B의 부모노드(parent node) 이면, A의 키(key)값과 B의 키값 사이에는 대소(크거나 작은)관계가 성립합니다.

\[caption id="attachment\_5975" align="alignnone" width="440"\]![](./assets/img/wp-content/uploads/2023/12/Max-Heap.svg_.png) 최대 힙 (Max Heap)\[/caption\]

 

힙에는 두가지 종류가 있으며, 부모노드의 키값이 자식노드의 키 값보다 항상 큰 힙을 **'최대 힙(max heap)'**, 부모노드의 키 값이 자식노드의 키 값보다 항상 작은 힙을 **'최소 힙(min heap)'**이라고 부릅니다.

![](./assets/img/wp-content/uploads/2023/12/MinHeapAndMaxHeap1.png)

우선순위 큐를 구현하는 방법은 여러 가지가 있는데 그 중 힙을 이용한 구현방법이 많이 사용됩니다.

 

#### **우선순위 큐**

우선순위 큐(Priority queue)란 일반적인 큐(또는 스택일 수도 있음)에서 우선 순위가 부여된 자료형을 뜻합니다. 일반적인 큐와 달리 각 원소들은 우선순위를 갖고 있습니다. 우선순위 큐에서, 높은 우선순위를 가진 원소는 낮은 우선순위를 가진 원소보다 먼저 처리됩니다. 일반 큐에서는 `dequeue`를 하면 가장 먼저 삽입된 원소가 반환되지만 우선순위 큐에서는 `dequeue`를 하면 우선순위가 가장 높은 원소가 반환됩니다. 만약 두 원소가 같은 우선순위를 가진다면 그들은 큐에서 그들의 순서(선입선출)에 의해 처리됩니다.

![](./assets/img/wp-content/uploads/2023/12/38733128.jpg)

우선순위 큐는 이름과 달리 선형 구조가 아닌 트리(tree)구조로 생각하는 것이 더 합리적입니다. 이러한 특성으로 우선순위가 가장 높은 값을 찾을 수 있는 완전이진트리인 힙을 이용해 구현할 수 있습니다.

![](./assets/img/wp-content/uploads/2023/12/heapq.png)

우선순위 큐는 다양한 곳에서 사용될 수 있는데, 가장 대표적인 사용 예로 다익스트라 알고리즘(Dijkstra Algorithm)에서 우선순위 큐를 사용하고 있습니다.

> [데이크스트라 알고리즘(](https://ko.wikipedia.org/wiki/%EB%8D%B0%EC%9D%B4%ED%81%AC%EC%8A%A4%ED%8A%B8%EB%9D%BC_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)영어: Dijkstra algorithm) 또는 다익스트라 알고리즘은 도로 교통망 같은 곳에서 나타날 수 있는 **_그래프에서 꼭짓점 간의 최단 경로를 찾는_** 알고리즘이다. 이 알고리즘은 컴퓨터 과학자 에츠허르 데이크스트라가 1956년에 고안했으며 삼 년 뒤에 발표했다

 

#### **구현**

- 출처: ChatGPT

최소 힙(min heap)을 이용한 우선순위 큐입니다.

```
struct PriorityQueue<T: Comparable> {
    private var elements: [T] = []

    var isEmpty: Bool {
        return elements.isEmpty
    }

    var count: Int {
        return elements.count
    }

    mutating func enqueue(_ element: T) {
        elements.append(element)
        heapifyUp()
    }

    mutating func dequeue() -> T? {
        guard !isEmpty else { return nil }

        elements.swapAt(0, count - 1)
        let dequeuedElement = elements.removeLast()
        heapifyDown()
        return dequeuedElement
    }

    private mutating func heapifyUp() {
        var currentIndex = count - 1
        var parentIndex = self.parentIndex(of: currentIndex)

        while currentIndex > 0 && elements[currentIndex] < elements[parentIndex] {
            // 부모 인덱스의 값보다 자식 인덱스의 값이 작으면 스왑 (최소 힙을 유지하기 위해)
            elements.swapAt(currentIndex, parentIndex)
            currentIndex = parentIndex
            parentIndex = self.parentIndex(of: currentIndex)
        }
    }

    private mutating func heapifyDown() {
        var currentIndex = 0

        while true {
            let leftChildIndex = leftChildIndex(of: currentIndex)
            let rightChildIndex = rightChildIndex(of: currentIndex)

            var minIndex = currentIndex

            // minIndex의 값보다 왼쪽 자식 인덱스의 값이 작다면 => minIndex를 갱신
            if leftChildIndex < count && elements[leftChildIndex] < elements[minIndex] {
                minIndex = leftChildIndex
            }

            if rightChildIndex < count && elements[rightChildIndex] < elements[minIndex] {
                minIndex = rightChildIndex
            }

            // 어떠한 조건도 만족하지 않는다면 (minIndex가 변경되지 않은 상태라면) 중지
            if minIndex == currentIndex {
                break
            }

            // 작은 값과 현재 값을 스왑
            elements.swapAt(currentIndex, minIndex)
            currentIndex = minIndex
            
            /*
             예)
                      10 (currentIndex)
                     /  \
                    15   7 (minIndex)
             
             인 경우 7(minIndex)과 10을 스왑하며 7이 새로운 currentIndex가 됩니다.
             
                     7 (currentIndex == minIndex)
                    /  \
                   15   10
                      
             */
        }
    }

    private func parentIndex(of index: Int) -> Int {
        guard index > 0 else {
            return 0
        }
        
        return (index - 1) / 2
    }

    private func leftChildIndex(of index: Int) -> Int {
        return 2 * index + 1
    }

    private func rightChildIndex(of index: Int) -> Int {
        return 2 * index + 2
    }
}
```

- 제너릭 타입을 지정할 수 있으며, `Comparable`(`>`, `<` 등으로 비교 가능)을 준수하는 타입은 전부 사용할 수 있습니다.
- `isEmpty`, `count`: 내부 컬렉션의 개수에 관한 프로퍼티입니다. (비어있는지, 몇 개인지)
- `enqueue`: 삽입 메서드이며, 삽입하면 `heapifyUp`을 실행해 힙 구조를 유지합니다.
- `dequeue`
    - 우선순위가 높은 원소를 반환합니다. 위의 코드는 최소 힙으로 `Comparable` 상 가장 작은 값이 반환됩니다.
    - 반환하기 전에 첫번째 원소와 끝 원소를 스왑하는데, 이는 `dequeue` 과정에서 시간 복잡도가 늘어나는 것을 방지하기 위함입니다. `removeLast`는 `O(1)` 인데 반해, `removeFirst`는 `O(n)`의 시간 복잡도를 가집니다.
    - `heapifyDown`을 실행해 힙 구조를 유지합니다.
- **heapifyUp**
    - `private` 메서드로 현재 인덱스(=>`enqueue` 과정에서 새로 append된 원소의 인덱스)의 값을 최소 힙 조건이 만족하는 곳까지 반복해서 위로 끌어올립니다.
- **heapifyDown**
    - `private` 메서드로 현재 인덱스(=>`dequeue` 과정에서 스왑되고 난 후 첫번째 인덱스)를 최소 힙 조건이 만족할 때까지 반복해서 밑으로 끌어내립니다.
- **parentIndex(of:)**
    - 특정 인덱스로부터 부모 인덱스를 구하는 공식입니다.
    - **`(index - 1) / 2`**
- **leftChildIndex(of:)**
    - 특정 인덱스로부터 왼쪽 자식의 인덱스를 구하는 공식입니다.
    - **`2 * index + 1`**
- **rightChildIndex(of:)**
    - 특정 인덱스로부터 오른쪽 자식의 인덱스를 구하는 공식입니다.
    - **`2 * index + 2`**

힙 구조에서 특정 노드의 부모 또는 자식 인덱스를 구하는 공식은 유용하게 쓰이므로 알아두면 좋습니다.

- [자신의 부모 인덱스 계산하기](https://ehpub.co.kr/tag/%EC%9E%90%EC%8B%A0%EC%9D%98-%EB%B6%80%EB%AA%A8-%EC%9D%B8%EB%8D%B1%EC%8A%A4-%EA%B3%84%EC%82%B0%ED%95%98%EA%B8%B0/)

 

##### **예제**

```
var pq: PriorityQueue<Int> = .init()
pq.enqueue(5)
pq.enqueue(77)
pq.enqueue(1)
pq.enqueue(4)
pq.enqueue(19)
pq.enqueue(5113)

while !pq.isEmpty {
    print(pq.dequeue()!)
}

/*
결과:
1
4
5
19
77
5113
*/
```

- 예제는 제너릭 타입으로 `Int`를 사용했지만 `Comaprable`을 준수하는 타입은 전부 사용할 수 있습니다.
- 값을 `enqueue`하면 저절로 값이 작은 원소가 힙 상단에 위치하게 됩니다.
- `dequeue`하면 우선순위가 가장 높은 (=> `Comparable` 상 값이 _**가장 작은**_) 원소가 반환됩니다.
