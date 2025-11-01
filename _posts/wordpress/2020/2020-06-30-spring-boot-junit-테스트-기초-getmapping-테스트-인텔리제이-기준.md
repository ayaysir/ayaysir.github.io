---
title: "Spring Boot: JUnit 단위 테스트 기초 (GetMapping 테스트, 인텔리제이 기준)"
date: 2020-06-30
categories: 
  - "DevLog"
  - "Spring/JSP"
---

###### 스프링 부트(Spring Boot) 버전 2.3.1, Gradle 6.4.1 기준입니다.

##### **1\. 패키지를 생성 (예: `com.example.awsboard.web`)**

##### **2\. 컨트롤러 및 `GetMapping` 예제 작성**

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-5.25.17.png)

```
package com.example.awsboard.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BasicController {

    @GetMapping("/hell")
    public String hello() {
        return "Hell";
    }
}
```

 

##### **3\. 동일한 패키지를 `src > test > java` 에 패키지 생성**

##### **4\. 패키지 내에 `BasicControllerTest` 클래스 생성**

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-5.30.39.png)

##### **5\. 테스트 코드 작성**

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-5.32.13.png)

```
package com.example.awsboard.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class BasicControllerTest {
    @Autowired private MockMvc mvc;

    @Test
    public void hell이_리턴된다() throws Exception {
        String hell = "Hell";

        mvc.perform(get("/hell"))
                .andExpect(status().isOk())
                .andExpect(content().string(hell));

    }

}
```

- `@Autowired private MockMvc mvc;` - HTTP GET, POST 등에 대한 API 테스트 시작
- `mvc.perform(get("/hell"))` - `MockMvc`를 통해 HTTP GET 요청
- `.andExpect(status().isOk())` - HTTP Status가 `200(OK)`인지 검증
- `.andExpect(content().string(hell))` - 응답 본문의 내용이 `hell` 과 일치하는지 검증

 

##### **6\. 메소드 코드 옆의 재생 버튼(`Run Test`) 클릭**

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-5.36.35.png)

 

##### **7\. 테스트 결과 확인**

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-5.37.13.png)

 

* * *

 

#### **테스트 예제: DTO를 JSON으로 리턴하는 페이지**

```
package com.example.awsboard.web;

import com.example.awsboard.web.dto.BasicControllerDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BasicController {

    ...

    @GetMapping("/hell/dto")
    public BasicControllerDTO hellDto(@RequestParam("name") String name, @RequestParam("amount") int amount) {
        return new BasicControllerDTO(name, amount);
    }
}
```

```
package com.example.awsboard.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
public class BasicControllerTest {
    @Autowired private MockMvc mvc;

    ...

    @Test
    public void basicControllerDTO가_리턴된다() throws Exception {
        String name = "Hell";
        int amount = 1000;

        mvc.perform(get("/hell/dto").param("name", name).param("amount", String.valueOf(amount)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(name))
                .andExpect(jsonPath("$.amount").value(amount));
    }

}
```

JSON으로 된 내용 검증은

- `.andExpect(jsonPath("$.name").value(name))`
- `.andExpect(jsonPath("$.amount").value(amount))`

 

출처: [스프링 부트와 AWS로 혼자 구현하는 웹 서비스](https://github.com/jojoldu/freelec-springboot2-webservice)
