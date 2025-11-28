---
title: "자바(Java): 양쪽 연결 리스트(Doubly Linked List; 더블 링크드 리스트) [자바 공식 제공 & 알고리즘 학습용 예제]"
date: 2020-04-19
categories: 
  - "DevLog"
  - "Java"
  - "코딩테스트"
tags: 
  - "java"
  - "자바"
---

## **연결 리스트 (자바 공식 제공)**

`ArrayList()`와 사용법은 거의 같습니다. 다만 내부 동작 방식이 다릅니다.

```java
package blog.dblinkedlist;

import java.util.LinkedList;
import java.util.List;

public class LinkedListTest {
  
  public static void main(String[] args) {
    List<Object> list = new LinkedList<>();
    for(int i = 1; i <= 12; i++) {
      list.add(i);
    }
    
    // 인덱스 바로 뒤에 삽입(0부터 시작)
    list.add(0, "★0★");
    list.add(3, "★3.5★");
    
    // 인덱스로 삭제
    list.remove(8);
    
    // 오브젝트로 삭제(값이 10인 Object를 찾아 삭제)
    list.remove((Object)10);
    
    // get()의 인덱스도 0부터 시작
    System.out.println("index 3: " + list.get(3));
    System.out.println("size: " + list.size());
    System.out.println("list:" + list);
  }
  
}
```

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-19-pm-5.04.35.png)

 

## **양쪽 연결 리스트 (알고리즘 학습용 예제)**

<!-- https://gist.github.com/ayaysir/c0f3e067fea9ec47d255f5fa1f116dc7 -->
{% gist "c0f3e067fea9ec47d255f5fa1f116dc7" %}

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-19-pm-5.09.40.png)

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-19-pm-5.10.30.png)
