---
title: "Swift: 큐(queue) 구현하기"
date: 2023-12-17
categories: 
  - "DevLog"
  - "Swift"
  - "코딩테스트"
---

## **큐(Queue)**

[큐(queue)](https://ko.wikipedia.org/wiki/%ED%81%90_\(%EC%9E%90%EB%A3%8C_%EA%B5%AC%EC%A1%B0\))는 기본적인 자료 구조의 한가지로, 먼저 집어 넣은 데이터가 먼저 나오는 `FIFO`(First In First Out)구조로 저장하는 형식을 말합니다. 나중에 집어 넣은 데이터가 먼저 나오는 스택과는 반대되는 개념입니다. 프린터의 출력 처리나 운영체제의 메시지 처리기, 프로세스 관리 등 데이터가 입력된 시간 순서대로 처리해야 할 필요가 있는 상황에 이용됩니다.

 ![](/assets/img/wp-content/uploads/2023/12/큐.jpg)

 

## **기본 배열을 큐로 사용**

Swift에서는 `Array`를 이용해 큐의 대부분의 기능을 구현할 수 있습니다.

- Enqueue는 `append(_:)`
- Dequeue는 `removeFirst(_:)`

 

```swift
var queue: [Int] = []

queue.append(1)
queue.append(2)
queue.append(3)

queue.removeFirst() // 1
queue.removeFirst() // 2
queue.removeFirst() // 3
queue // []
```

하지만 기본 배열의 문제점은 처리 속도가 느리다는 점입니다. 특히 [removeFirst의 시간 복잡도가 O(n)](https://developer.apple.com/documentation/swift/array/removefirst\(_:\))인 것도 한 몫 합니다. 배열의 원소 개수가 매우 크다면 작업을 할 때마다 느려지는 문제가 발생할 수 있습니다.

이러한 점을 방지하기 위해 큐를 구조체를 직접 만들어 사용할 수 있습니다.

 

## **커스텀 큐 구현하기**

```swift
struct Queue<T> {
    private class Node {
        var value: T
        var next: Node?

        init(_ value: T) {
            self.value = value
        }
    }

    private var head: Node?
    private var tail: Node?

    mutating func enqueue(_ element: T) {
        let newNode = Node(element)
        if head == nil {
            head = newNode
            tail = newNode
        } else {
            tail?.next = newNode
            tail = newNode
        }
    }

    mutating func dequeue() -> T? {
        let value = head?.value
        head = head?.next
        if head == nil {
            tail = nil
        }
        return value
    }

    var isEmpty: Bool {
        return head == nil
    }
}
```

- **제네릭 타입**을 이용해 모든 타입에 대응할 수 있도록 되어 있습니다.
    - [Swift(스위프트): 제네릭(Generics) - 제네릭 타입, 제네릭 함수, 연관 타입(Associated Type), where 조건절](http://yoonbumtae.com/?p=4505)
- `Node`라는 클래스 타입이 있으며, 이 타입은 값과 다음 노드가 위치할 포인터를 가지고 있습니다.
    - 클래스이기 때문에 주소값을 참조하게 됩니다.
- 시작 노드인 `head`와 끝 노드인 `tail`이 있습니다.
    - 헤드 노드와 테일 노드는 같은 노드를 가리킬 수 잇습니다.
- 기본적인 기능인 `enqueue`, `dequeue`와 큐가 비어있는지 여부를 알려주는 `isEmpty`가 있습니다.
- **enqueue(\_:)**
    - `head`가 비어있다면(`nil`) `head`, `tail`에 새로 입력한 값 노드를 대입합니다.  ![](/assets/img/wp-content/uploads/2023/12/screenshot-2023-12-18-am-2.03.48-copy.jpg)
    - `head`가 이미 존재한다면 기존 `tail`의 `next`에 새 값 노드를 지정하고, 이 새 값 노드를 새로운 `tail`로 지정합니다.  ![](/assets/img/wp-content/uploads/2023/12/screenshot-2023-12-18-am-2.08.52-copy.jpg)
- **dequeue()**
    - `head` 노드의 값을 가져온 뒤 `next` 노드르 헤드를 옮깁니다.
        - 이 때 `next` 노드가 없다면 큐가 비어있는 것이므로 `head`, `tail` 모두 `nil`로 만듭니다.
            - 또한 노드가 아무것도 없을 때 `head`가 `nil`인 점을 이용하여 `isEmpty` 프로퍼티를 구할 수 있습니다.
        - `next` 노드가 있다면 그 노드가 새로운 헤드가 됩니다.
    - `head` 노드의 값을 `return` 합니다.

 

기존 `Array` 방식과 동일하게 동작하는 것을 볼 수 있습니다.

```
var gptQueue = Queue<Int>()

gptQueue.enqueue(1)
gptQueue.enqueue(2)
gptQueue.enqueue(3)

gptQueue.dequeue() // 1
gptQueue.dequeue() // 2
gptQueue.dequeue() // 3
gptQueue.isEmpty // true

```

 

## **대용량 자료 처리시 시간 차이 분석**

![](/assets/img/wp-content/uploads/2023/12/screenshot-2023-12-18-am-2.26.20-copy.jpg)
