---
title: "자바(Java): 빌더 패턴(Builder Pattern) 일반 + 롬복(Lombok) + 단위 테스트"
date: 2020-07-11
categories: 
  - "DevLog"
  - "Java"

---

참고 [블로그](https://johngrib.github.io/wiki/builder-pattern/)

 

자바(Java)에서 객체를 생성할 때 사용하는 패턴이 여러 가지가 있습니다. 그 중 가장 대표적안 **생성자 패턴(constructor pattern)**은 지금 채워야 할 필드가 무엇인지 명확히 지정할 수 없습니다. 하지만 **빌더 패턴(builder pattern)**을 사용하면 어느 필드에 어떤 값을 채워야 할지 명확하게 지정할 수 있습니다.

 

일반적인 생성자 패턴의 예시는 다음과 같습니다.

```
package com.example.awsboard.web.dto;

public class Car {
    
    private String id, name;
    
    public Car(String id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getter
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}

```

```
String id = "1";
String name = "Charles";

Car car1 = new Car(id, name)
Car car2 = new Car(name, car) // ??
```

일반적인 생성자 패턴은 위와 같이 같은 스트링 타입 변수의 위치가 뒤바뀐 채로 생성되어도 문제점을 찾지 못하고 넘어갈 수도 있다는 점을 알 수 있습니다.

 

이것을 **빌더 패턴**으로 바꾸면 다음과 같습니다.

```
package com.example.awsboard.web.dto;

public class Car {

    // final 키워드를 써서 생성자를 통한 입력을 강요함
    private final String id, name;

    // 클래스 안에 스태틱 형태의 내부 클래스(inner class) 생성
    protected static class Builder {
        private String id;
        private String name;

        // id 입력값 받음: 리턴 타입을 Builder 타입으로 한 다음 this를 리턴
        public Builder id(String value) {
            id = value;
            return this;
        }

        // name 입력값 받음: 리턴 타입을 Builder 타입으로 한 다음 this를 리턴
        public Builder name(String value) {
            name = value;
            return this;
        }

        // 마지막에 build() 메소드를 실행하면 this가 리턴되도록 함
        public Car build() {
            return new Car(this);
        }
    }

    // 생성자를 private로 함
    // 외부에서는 접근할 수 없고 위의 Builder 클래스에서는 사용 가능
    private Car(Builder builder) {
        id = builder.id;
        name = builder.name;
    }
    
    // 빌더 소환: 외부에서 Car.builder() 형태로 접근 가능하게 스태틱 메소드로 
    public static Builder builder() {
        return new Builder();
    }

    // Getter
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
```

```
String id = "1";
String name = "Charles";

Car car1 = Car.builder()
        .id(id)
        .name(name)
        .build();
```

 

위의 빌더 패턴으로 만든 `Car`에 대한 **단위 테스트**는 다음과 같습니다.

```
package com.example.awsboard.web.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class CarTest {

    @Test
    public void 빌더_테스트_1() {
        String id = "1";
        String name = "Charles";

        Car car1 = Car.builder()
                .id(id)
                .name(name)
                .build();

        assertThat(car1.getId()).isEqualTo(id);
        assertThat(car1.getName()).isEqualTo(name);

    }
}
```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-3.00.16.png)

 

##### **롬복(Lombok)으로 빌더 패턴 적용**

참고: [Spring Boot: Gradle 버전 5 이상에서 롬복 설치 + 단위 테스트](http://yoonbumtae.com/?p=2540)

```
package com.example.awsboard.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter // Getter 생성
public class LombokCar {
    private String id;
    private String name;

    @Builder // 생성자를 만든 후 그 위에 @Build 어노테이션 적용
    public LombokCar(String id, String name) {
        this.id = id;
        this.name = name;
    }
}
```

 

**단위 테스트**는 다음과 같습니다.

 

```
package com.example.awsboard.web.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class LombokCarTest {

    @Test
    public void 빌더_테스트_2() {
        String id = "2";
        String name = "James";

        LombokCar car2 = LombokCar.builder()
                .id(id)
                .name(name)
                .build();

        assertThat(car2.getId()).isEqualTo(id);
        assertThat(car2.getName()).isEqualTo(name);

    }
}

```

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-3.05.42.png)
