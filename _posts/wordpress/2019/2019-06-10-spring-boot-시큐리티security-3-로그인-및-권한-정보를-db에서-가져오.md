---
title: "Spring Boot: 시큐리티(Security) - 3 - 로그인 및 권한 정보를 DB에서 가져오기"
date: 2019-06-10
categories: 
  - "DevLog"
  - "Spring/JSP"
  - "Database"
tags: 
  - "스프링시큐리티"
---

<!-- \[rcblock id="3197"\] -->


깃허브에서 전체 코드 보기

- [https://github.com/ayaysir/spring-boot-security-example-1](https://github.com/ayaysir/spring-boot-security-example-1)

이전 글에서는 기초를 익히기 위해 사용자 및 권한 정보를 `inMemoryAuthentication`이라 해서 메모리에 하드코딩 했었는데요, 이것을 데이터베이스에 옮겨서 가져오도록 하겠습니다.

데이터베이스는 **mariadb** 기준입니다.

- [macOS에서 mariadb 설치하기](/posts/macos에서-mariadb-설치하기)
- [Spring Boot: mariadb 연결하기 (JDBC-Maven 기준)](/posts/spring-boot-mariadb-%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0-jdbc-maven-%EA%B8%B0%EC%A4%80/)

## 절차

### 테이블 작성

먼저 데이터베이스에 임의의 테이블을 만들고 사용자 정보를 입력합니다. 지금은 회원가입 절차가 없으므로 DB에 `insert`문으로 직접 입력하겠습니다.

 ![](/assets/img/wp-content/uploads/2019/06/spring-security-3-1.png)

참고로 현재 시큐리티 암호 인코딩은 `Bcrypt`로 기본 설정되어 있습니다. 이것에 맞춰 암호를 미리 인코딩합니다. `(원문: 1234, round: 12)`

> 변환 사이트: [https://www.browserling.com/tools/bcrypt](https://www.browserling.com/tools/bcrypt)



### Config 클래스 변경

**SecurityConfig** 클래스를 다음과 같이 변경합니다.

```java
package com.example.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  
  @Autowired
  private DataSource dataSource;
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // (생략)
    
  }
  
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {

    auth.jdbcAuthentication()
    .dataSource(dataSource)
    .rolePrefix("ROLE_")
    .usersByUsernameQuery("select username, replace(password, '$2y', '$2a'), true from users where username = ?")
    .authoritiesByUsernameQuery("select username, role from simple_users where username = ?");
    
  }
  
  // (생략)
}
```

- `@Autowired private DataSource dataSource;` 를 지정하여 현재 동작하는 데이터소스를 가져옵니다. 
- `auth` 파라미터가 있는 곳에서 권한 방식을 `jdbcAuthentication()`으로 지정합니다. 
- `rolePrefix`에서 권한 접두어를 지정합니다. 
- 접두어가 `ROLE_` 이었으므로 이것으로 지정하며, `_`는 넣지 않으면 오류가 발생합니다.

#### UsersByUsernameQuery(sql)

`UsersByUsernameQuery(sql)`에서는 사용자 목록을 가져오는 쿼리를 지정하는데, 테이블명이나 컬럼명 등은 자유이나 출력 결과의 컬럼은 **3개**여야 하며 `[사용자이름], [비밀번호], [Enabled]`를 순서대로 지정합니다. 

`PreparedStatement` 변수가 하나 있는데 (`물음표(?)`) 거기에는 `사용자이름(ID)`가 지정되어야 합니다. 따라서 이에 맞춰 SQL문을 작성하면 다음과 같습니다.

```sql
select username, replace(password, '$2y', '$2a'), true from users where username = ?
```

`Enabled` 컬럼은 `true`로 일괄 처리하면 되고, `replace(password, '$2y', '$2a')`는 스프링 시큐리티 사양의 한계로 인한 것인데요, Bcrypt 암호문의 접두어는 `$2a`, `$2y` 등 여러개가 있습니다. 그런데 현재 시큐리티 버전에서는 `$2a`만을 정상적으로 인식하는 문제가 있습니다. 일부 변환 사이트에서는 접두어를 `$2y`로 붙이는 경우가 있어서 이러한 경우에도 시큐리티에서도 인식할 수 있도록 `replace`로 치환하는 과정을 추가한 것입니다.

#### authoritiesByUsernameQuery(sql)

`authoritiesByUsernameQuery(sql)`에서는 권한을 불러오는 쿼리를 작성하는데, 출력 결과의 컬럼은 **2개**여야 하며 `[사용자이름], [권한명]`를 순서대로 지정합니다. 마찬가지로 `PreparedStatement` 변수 하나가 있는데 `사용자이름`을 입력합니다. 

시큐리티에서 사용자, 권한 관련 데이터베이스는 일반적으로 DAO 등을 통하지 않고 Config 클래스에서 직접 처리합니다. 결과는 이전 글과 동일합니다.

 


## 실행 결과

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-7.png)  
*손님(guest)으로 로그인한 경우*

 

 

<!-- \[rcblock id="3197"\] -->
