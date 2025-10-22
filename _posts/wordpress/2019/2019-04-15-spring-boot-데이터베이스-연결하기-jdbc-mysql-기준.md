---
title: "Spring Boot: 데이터베이스 연결하기 (Jdbc, MySQL 기준)"
date: 2019-04-15
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring-boot"
---

Spring Boot에 JDBC를 사용하여 데이터베이스를 연결하는 방법은 다음과 같다.

1\. pom.xml 에 디펜던시 추가

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
 
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

2\. application.properties 파일에 데이터베이스 설정 추가

```
spring.datasource.url=jdbc:mysql://localhost/데이터베이스?serverTimezone=UTC
 
# 주소 뒤에 ?serverTimezone=UTC를 붙이는 이유는 글자가 깨지는 문제를 방지하기 위함이다.
# The server time zone value '´ëÇÑ¹Î±¹ Ç¥ÁØ½Ã' is unrecognized or represents more than one time zone. 
# You must configure either the server or JDBC driver (via the serverTimezone configuration property) 
# to use a more specifc time zone value if you want to utilize time zone support.
 
spring.datasource.username=아이디
spring.datasource.password=비밀번호
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

3\. VO(DTO) 작성

```
public class TempVO {
 
    private int idsortable1;
    private String title, text, writedate;
    private int order;
 
    (...)
}
```

4\. 코드 작성

```
package com.example.ui;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
@RestController
@CrossOrigin(origins = "*")
public class TempController {
 
    private final JdbcTemplate jdbcTemplate;
 
    @Autowired
    public TempController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
 
    @RequestMapping("/sortable1.json")
    public List<TempVO> sortable1Json() {
        
        List<TempVO> list = jdbcTemplate.query("select * from sortable1",
                (rs, rowNum) -> {
                    TempVO vo = new TempVO();
                    vo.setIdsortable1(rs.getInt(1));
                    vo.setTitle(rs.getString(2));
                    vo.setText(rs.getString(3));
                    vo.setWritedate(rs.getString(4));
                    vo.setOrder(rs.getInt(5));
                    return vo;
                });
        
        System.out.println(list);
        
        
        return list;
    }
    
    @RequestMapping("/sortableArrange")
    public String sortableArrange(String[] json) {
        
        String sql = "update sortable1 set sortable1.order = ? where idsortable1 = ?";
        for(int i = 1; i <= json.length; i++) {
            int id = Integer.parseInt(json[i-1].split("\"")[1].replace("li", ""));
            int result = jdbcTemplate.update(sql, new Object[]{i, id});
            System.out.println(result);            
        }
        
        System.out.println(json);        
        
        return "ok";
    }
}
```

예제이기 때문에 컨트롤러 한 곳에 몰아서 작성했지만 정석대로 한다면 데이터베이스 접근 부분은 DAO, 서비스와 컨트롤러가 서로 분리되어야 한다.
