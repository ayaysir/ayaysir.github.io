---
title: "Spring Boot: mariadb 연결하기 (JDBC-Maven 기준)"
date: 2019-01-19
categories: 
  - "DevLog"
  - "Database"
  - "Spring/JSP"
tags: 
  - "mariadb"
  - "spring-boot"
---

Spring Boot에 JDBC를 통해 mariadb(mysql) 연결하는 방법입니다.

## 방법

### 1\. `pom.xml`의 `<dependencies>`에 다음을 추가합니다.

```xml
<!-- mariaDb -->
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-jdbc</artifactId>
      </dependency>
           
      <dependency>
          <groupId>org.mariadb.jdbc</groupId>
          <artifactId>mariadb-java-client</artifactId>
      </dependency>
```

혹시 디펜던시 목록에 다른  `mysql`, `Jdbc` 과 관련된 게 있다면 충돌이 발생하므로 삭제하는 것이 좋습니다.

 

### 2\. `applications.properties` (또는 기타 프로퍼티 파일)에 다음을 추가합니다.

```conf
spring.datasource.driverClassName=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://127.0.0.1:3306/test (본인 컴퓨터 주소 입력)
spring.datasource.username=아이디 입력
spring.datasource.password=비밀번호 입력
```

 

### 3\. DAO 테스트 코드를 작성하고 테스트합니다.

```java
package com.springboot.iroiro.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SimpleMessageDAO {
  @Autowired JdbcTemplate jt;
  
  public List<Map<String, ?>> selectAll() {
    
    return jt.query("select * from simple_message", (rs, rowNum) -> {
      Map<String, Object> mss = new HashMap<>();
      mss.put("seq", rs.getInt(1));
      mss.put("user", rs.getString(2));
      mss.put("message", rs.getString(3));
      return mss;
    });
  }
}

```

```java
package com.springboot.iroiro;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.iroiro.dao.SimpleMessageDAO;

@RestController
public class TestController {
  @Autowired SimpleMessageDAO smd;
  
  @RequestMapping("/select")
  public List<Map<String, ?>> getMessages() {
    return smd.selectAll();
  }
}
```

 ![](/assets/img/wp-content/uploads/2019/01/mariadb-1.png)
