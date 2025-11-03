---
title: "자바(Java): 람다식 (Lambda Expression) 기초 (Java 8 이상)"
date: 2019-01-06
categories: 
  - "DevLog"
  - "Java"

---

람다식은 **함수형 인터페이스**(Functional Interface)을 쉽게 사용할 수 있도록 지원합니다. 함수형 인터페이스는 메소드가 한 개만 있는 인터페이스를 의미하며, 보통의 인터페이스에 메소드를 한 개만 만들면 자동으로 함수형 인터페이스가 됩니다.

컴파일러 단계에서 함수형 인터페이스를 명시하고 싶다면 `@FunctionalInterface` 를 이용합니다. 이것을 사용할 경우 인터페이스 내에 메소드가 2개 이상인 경우 컴파일시 오류가 발생하여 강제적으로 메소드를 1개만 만들게 됩니다.

## 사용 방법

```java
@FunctionalInterface
public interface Calculator {    
    
    public int calc(int num1, int num2); 
 
}
```

람다식은 다음과 같이 사용합니다.

1. 인터페이스에 매개변수가 없는 경우: `() -> { return x; }` 또는 `() -> [단일 식];`
2. 매개변수가 있는 경우: `(변수1, 변수2, ...) -> { return x; }` 또는 `(변수1, 변수2, ...) -> [단일 식];`

`[단일 식]` (expression)이란 예제의 `n1 + n2` 같이 연산으로 인해 어떠한 결과가 반환되는 한 줄의 코드를 뜻합니다. `n1 + n2`를 통해 숫자든 아니면 그 외 무엇의 형태이든 어떠한 값이 나올 것이라 예상되므로 그 자체가 `return`과 동일하기 때문에 단일 식에서는 별도의 `return`을 명시할 필요가 없습니다.

메소드의 반환값이 `void`인 경우 중괄호 안에 `return`을 명시할 수 없습니다. void인 경우 리턴값을 받지 않으므로 `[단일 식]`은 사용할 수 없습니다.

참고로 `System.out::println` 은 `x -> System.out.println(x)`를 간단하게 축약해서 사용할 수 있도록 한 슈가 신택스(sugar syntax)입니다.

람다식을 통해 함수 인터페이스에서 기존에 장황했던 코드들을 축약해서 나타낼 수 있습니다.

## 예제
 아래 예제에서 Thread 부분의 람다식을 적용하기 이전의 문법과 람다식을 적용한 문법을 비교해 주세요.

```java
public class ViewLambda {
    
    public static void test(int n1, int n2, Calculator c) {
        
        System.out.println(c.calc(n1, n2));        
    }
    
    public static void main(String[] args) {
        
        Calculator c = (n1, n2) -> n1 + n2;
        System.out.println(c.calc(10, 20));
        
        c = (n1, n2) -> n1 - n2;
        System.out.println(c.calc(10, 20));
        
        c = (n1, n2) -> n1 * n2;
        System.out.println(c.calc(10, 20));
        
        c = (n1, n2) -> n1 / n2;
        System.out.println(c.calc(10, 20));
        
        c = (n1, n2) -> {
            
            System.out.println("xxx");
            int n3 = n1 * n1 * n1;
            int n4 = n2 * n2 * n2;
            
            return n3 - n4;
        };
        System.out.println(c.calc(10, 20));
        
        test(30, 50, (n1, n2) -> n1 + n2);
        test(50, 30, (no1, no2) -> {
            System.out.println("xxx"); 
            return no1 - no2;
        });
        
 
        List<Integer> numbers = Arrays.asList(1,2,3,4,5,6);
        numbers.forEach(x -> System.out.print(x + " "));
        numbers.forEach(System.out::print);
        
        System.out.println();

        // *** Thread ** //
        
        new Thread() {
            @Override
            public void run() {
                System.out.println("스레드: old");
            }
        }.start();
        
        new Thread(()->{
            System.out.println("스레드: new");
        }).start();
        
    }    
 
}
```

```sh
30
-10
200
0
xxx
-7000
80
xxx
20
1 2 3 4 5 6 123456
스레드: old
스레드: new

```
