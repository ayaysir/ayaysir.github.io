---
title: "스프링 부트(Spring Boot): 웹 페이지를 정상적으로 렌더링하는지 단위 테스트"
date: 2020-07-12
categories: 
  - "DevLog"
  - "Spring/JSP"
---

- 스프링 부트 버전: 2.3.1
- Gradle 버전: 6.4.1

웹 페이지를 정상적으로 렌더링하는지 테스트하는 과정입니다. 모의 서버 환경을 만들고, 그 서버에서 웹 페이지를 요청한 후 반환되는 텍스트에 특정 내용이 포함이 되어있는지 확인합니다. 렌더링 엔진은 Thymeleaf 입니다.

 

#### **참고: 프로젝트 구조, View 파일, 컨트롤러**

 ![](/assets/img/wp-content/uploads/2020/07/-2020-07-12-pm-1.54.15-e1594529695675.png)

##### **IndexController.java**

```
package com.example.awsboard.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
```

 

##### **resources/templates/index.html**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>AWS Board</h1>
</body>
</html>
```

 

#### **단위 테스트 코드**

참고: [Spring Boot: JUnit 단위 테스트 기초 (GetMapping 테스트, 인텔리제이 기준)](http://yoonbumtae.com/?p=2532)

 ![](/assets/img/wp-content/uploads/2020/07/-2020-07-12-pm-1.58.23-e1594529998974.png)

##### **IndexControllerTest.java**

```
package com.example.awsboard.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
public class IndexControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void 메인페이지_로딩() {
        // when
        String body = restTemplate.getForObject("/", String.class);

        // then
        assertThat(body).contains("AWS Board");
    }
}
```

- `@SpringBootTest(webEnvironment = RANDOM_PORT)` - 임의의 포트 번호를 사용해 가상의 모의 서버 환경을 만들고 스프링 부트 통합 테스트를 실행합니다.
- `@Autowired private TestRestTemplate restTemplate;` - `RestTemplate`는 클라이언트 측 HTTP 액세스를 위해 제작된  스프링 부트의 중심부 클래스입니다. `TestRestTemplate`는 이 `RestTemplate`에 대한 통합 테스트를 단순화하고 테스트 중에 인증을 용이하게 합니다.
- `String body = restTemplate.getForObject("/", String.class);` - URL(`"/"`)에서 `GET`을 수행한 뒤 반환값을 스트링 타입의 `body` 에 저장합니다.
- `assertThat(body).contains("AWS Board")`; - `body`에 `"AWS Board"`라는 문구가 포함되어 있는지 테스트합니다.

 

##### **케이스 1: contains("AWS Board");**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-12-pm-2.17.28.png)

index.html에 `"AWS Board"`라는 문구가 있으므로 정상 통과합니다.

 

##### **케이스 2: contains("SWA Board");**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-12-pm-2.19.12.png)

index.html에 `"SWA Board"`라는 문구가 없으므로 테스트 실패했습니다.
