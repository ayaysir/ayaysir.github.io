---
title: "Spring Boot: Gradle 버전 5 이상에서 롬복 설치 + 단위 테스트"
date: 2020-06-30
categories: 
  - "DevLog"
  - "Spring/JSP"
---

- 스프링 부트 버전: 2.3.1
- Gradle 버전: 6.4.1

## 절차

### **1\. Gradle 버전 확인**

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-30-pm-6.10.03.png)

Gradle 버전이 5 이상인 경우 아래와 같이 진행하고, 4 이하라면 다른 방법으로 진행해야 합니다.

 

### **2\. build.gradle에 롬복 부분 추가**

```java
dependencies {
  ...

  // lombok
  annotationProcessor("org.projectlombok:lombok")
  compileOnly("org.projectlombok:lombok")

  ...

}
```

 

### **3\. 롬복 플러그인 설치 (인텔리제이 아이디어 기준)**

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-30-pm-7.06.48.png)

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-30-pm-7.07.13.png)

 

### **4\. DTO 예제 작성**

```java
package com.example.awsboard.web.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class BasicControllerDTO {

    private final String name;
    private final int amount;

}
```

- `@Getter` - 선언된 모든 필드의 get 메소드를 생성
- `@RequiredArgsConstructor` - 선언된 모든 `final` 필드가 포함된 생성자를 생성, `final`이 없는 필드는 생성자에 포함되지 않음

 

### **5\. 테스트 코드 작성**

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-30-pm-6.14.29.png)

```java
package com.example.awsboard.web.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class BasicControllerDTOTest {

    @Test
    public void 롬복_기능_테스트() {
        String name = "abc";
        int amount = 1000;

        BasicControllerDTO dto = new BasicControllerDTO(name, amount);

        assertThat(dto.getName()).isEqualTo(name);
        assertThat(dto.getAmount()).isEqualTo(amount);

    }
}
```

`asserThat`이 없는 경우 build.gradle에 아래 부분을 추가합니다.

```java
dependencies {
  ...

  // https://mvnrepository.com/artifact/org.assertj/assertj-core
  testCompile group: 'org.assertj', name: 'assertj-core', version: '3.6.1'

}
```

 

### **6\. 테스트**

위 스크린샷에서 `롬복_기능_테스트()` 옆에 있는 재생버튼(`Run Test`) 클릭

 ![](/assets/img/wp-content/uploads/2020/06/screenshot-2020-06-30-pm-6.16.00.png)

 

> 출처: [스프링 부트와 AWS로 혼자 구현하는 웹 서비스](https://github.com/jojoldu/freelec-springboot2-webservice)
