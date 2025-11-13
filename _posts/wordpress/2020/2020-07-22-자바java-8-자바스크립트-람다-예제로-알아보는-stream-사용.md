---
title: "자바(Java) 8: 자바스크립트 람다 예제로 알아보는 Stream 사용법"
date: 2020-07-22
categories: 
  - "DevLog"
  - "Java"

---

자바 8 이상부터 도입된 `Stream`이라는 타입은 람다식을 이용해 컬렉션 자료의 순회, 필터링 등을 할 수 있습니다.

자바스크립트에서는 ES5 도입 이후 자주 쓰이는 형태인데 자바의 Stream은 상대적으로 사용법이 낯설기 때문에 동일한 로직의 코드를 비교해가면서 사용법을 알아보도록 하겠습니다.

자바스크립트에서는 배열에서 바로 사용할 수 있지만 자바에서는 List, Set 등 [Iterable을 구현하는 자료형](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html)이 forEach()만을 사용할 수 있으며, 배열이나 리스트 등의 컬렉션 자료형을 바탕으로 새로운 컬렉션을 만드려면 스트림(Stream)으로 변환하는 작업이 필요합니다.

 

#### **1\. forEach: for 문과 비슷한 기능**

**자바스크립트**

```
const names = ["James", "Thomas", "Joseph", "Jacob"]
names.filter(x => console.log(x))
```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-22-pm-2.51.59.png)

 

**자바**

```
import java.util.Arrays;
import java.util.stream.Stream;

public class StreamTest {

    public static void main(String[] args) {
        // names 배열 생성
        String[] names = {"James", "Thomas", "Joseph", "Jacob"};

        // names 배열 순회
        Arrays.stream(names).forEach(x -> System.out.println(x));
    }
}

```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-22-pm-2.53.37.png)

참고로 `forEach`는 굳이 스트림이 아니더라도 `Iterable` 인터페이스를 구현하는 자료형이라면 전부 사용 가능합니다.

 

#### **2\. filter: 스트림에서 특정 조건을 만족하는 요소만 반환**

이름 배열 중에서 `"J"`를 포함하는 요소만 반환 후 새로운 스트림에 저장합니다.

**자바스크립트**

```
const names = ["James", "Thomas", "Joseph", "Jacob"]
const filtered = names.filter(x => x.indexOf("J") !== -1)
console.log(filtered)
```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-22-pm-5.55.54.png)

 

```
import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamTest {

    public static void main(String[] args) {
        // names 배열 생성
        String[] names = {"James", "Thomas", "Joseph", "Jacob"};

        // 배열을 스트림화 한 다음 "J"가 포함된 요소만 필터링
        Stream<String> filtered = Arrays.stream(names).filter(x -> x.contains("J"));

        // 필터링된 스트림을 List 형태로 변환
        System.out.println(filtered.collect(Collectors.toList()));
    }
}
```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-22-pm-5.50.33.png)

스트림을 `List`형으로 변환하려면 `collect()`를 사용하며 방법은 다음과 같습니다.

```
List<String> filtered1 = stream.collect(Collectors.toList());
List<String> filtered2 = stream.collect(Collectors.toCollection(LinkedList::new));
```

첫 번째 방법은 사용할 리스트의 구체적 형태를 특별히 지정하고 싶지 않을 때, 두 번째 방법은 리스트의 구체적 형태를 정하고 싶을 때 사용합니다.

 

#### **3\. Sorted: 스트림 내부를 정렬**

**자바스크립트**

```
const numArr1 = [3, 7, 23, 9, 11, 4]

numArr1.slice().sort().forEach(e => console.log(e)) // 3, 4, 7, 9, 11, 23
numArr1.slice().sort((a, b) => b - a).forEach(e => console.log(e)) // 23, 11, 9, 7, 4, 3
```

자바스크립트의 경우 `sort()`는 배열 자체를 변화시키기 때문에 깊은 복사(`slice()`)를 사용하였습니다.

 

**자바**

```
import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamTest {

        Integer[] numArr1 = {3, 7, 23, 9, 11, 4};
        Arrays.stream(numArr1).sorted().forEach(System.out::println); 
        // 3, 4, 7, 9, 11, 23
        Arrays.stream(numArr1).sorted(Comparator.reverseOrder()).forEach(System.out::println); 
        // 23, 11, 9, 7, 4, 3

    }
}
```

 

#### **4\. map: 컬렉션 내부를 순회하면서 내부 요소를 가공한 새로운 요소들의 스트림을 생성**

**자바스크립트**

```
const names = ["James", "Thomas", "Joseph", "Jacob"]

names.map(x => x + " Simpson").forEach(e => console.log(e))
```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-22-pm-6.06.11.png)

 

**자바**

```
import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamTest {

    public static void main(String[] args) {
        // names 배열 생성
        String[] names = {"James", "Thomas", "Joseph", "Jacob"};

        // 기존 이름 뒤에 " Simpson" 을 추가
        Arrays.stream(names).map(x -> x + " Simpson").forEach(System.out::println);

    }
}

```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-22-pm-6.08.39.png)

 

##### **4\. reduce: 누산 작업을 수행해 찾고자 하는 결과를 획득**

배열 내에서 최대값을 찾는 방법입니다.

**자바스크립트**

```
const nums = [1, 7, 49, 3, 93, 68, 10, 33, 12]
const max = nums.reduce((max, current) => Math.max(max, current))
console.log(max) // 93
```

참고: [자바스크립트: 배열 Array.reduce](http://yoonbumtae.com/?p=2496)

 

**자바**

```
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamTest {

        List<Integer> intList = Arrays.asList(1, 7, 49, 3, 93, 68, 10, 33, 12);
        Integer max = intList.stream().reduce((a, b) -> Integer.max(a, b)).get();
        System.out.println(max); // 93

    }
}
```

위의 10번 라인은 주고 받는 파라미터 형식, 개수가 같으므로 다음과 같이 [메소드 참고 표현식](http://yoonbumtae.com/?p=2776)을 사용할 수 있습니다.

```
Integer max = intList.stream().reduce(Integer::max).get();

```
