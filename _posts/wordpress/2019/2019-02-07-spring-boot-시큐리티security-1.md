---
title: "Spring Boot: 시큐리티(Security) - 1"
date: 2019-02-07
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring"
  - "spring-boot"
  - "스프링"
  - "스프링시큐리티"
---

<!-- \[rcblock id="3197"\] -->

 

스프링에서 로그인, 권한별 접근 기능 등을 구현하고 싶다면 **스프링 시큐리티**(Spring Security)를 사용해야 합니다.

## 절차

### 1. 프로젝트 생성: 디펜더시에서 Security 선택

처음 스타트 [프로젝트 생성](http://yoonbumtae.com/?p=1018) 시 디펜던시에서 **Security**를 선택합니다.

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-1.png)

나중에 수동으로 추가할 경우에는 아래를 `pom.xml`의 `<dependencies>` 내에 추가합니다.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-test</artifactId>
  <scope>test</scope>
</dependency>
```

### 2. 기본 로그인 화면 제거

프로젝트를 생성하고 서버를 가동하면 어떤 URL에 접속해도 기본 로그인 화면만 나오게 됩니다.
기본 로그인 화면이 뜨지 않게 하기 위해 초기 세팅을 합니다.

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-2.png)

메인 스프링 애플리케이션인 **SecurityApplication**은 따로 변경하지 않고, **SecurityConfig** 클래스를 생성합니다.

#### SecurityConfig.java

```java
package com.example.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests().antMatchers("/**").permitAll();
  }

}
```

#### TestController.java

```java
package com.example.security;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class TestController {
  
  @RequestMapping("/")
  public String home(ModelAndView mav) {
    return "home";	
  }
  
  @ResponseBody
  @RequestMapping("/test")
  public String test() {
    return "OK";
  }
  
  @ResponseBody
  @RequestMapping("/adminOnly")
  public String adminOnly() {
    return "Secret Page";
  }
}
```

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-3.png)



### 3. 메모리 기반 운영자 계정 추가

현재 연결된 데이터베이스가 없으므로 **메모리상에 운영자 계정**을 하나 만들고
로그인 페이지도 작성하여 운영자만 adminOnly 페이지에 접근 가능하도록 합니다.

#### SecurityConfig.java

```java
package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
      .antMatchers("/adminOnly").hasAuthority("ROLE_ADMIN")
      .antMatchers("/**").permitAll()
      .anyRequest().authenticated()
      .and()
      .formLogin().defaultSuccessUrl("/")
      .and()
      .logout().logoutSuccessUrl("/");
  }
  
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.inMemoryAuthentication()
      .withUser("admin").password(passwordEncoder().encode("1234")).roles("ADMIN")
      .and()
      .withUser("guest").password(passwordEncoder().encode("guest")).roles("GUEST");
  }
  
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
```

* `HttpSecurity`를 인자로 받는 `configure` 메서드는 보안 정책을 설정합니다.
* `authorizeRequests()`는 요청별 접근 권한을 지정합니다.
* `antMatchers("/adminOnly").hasAuthority("ROLE_ADMIN")`은 `"ROLE_ADMIN"` 권한을 가진 사용자만 접근 가능하게 합니다.
* `permitAll()`은 모든 사용자(비로그인 포함) 접근 허용을 의미합니다.
* `.anyRequest().authenticated()`는 인증이 필요한 요청을 지정합니다.
* `.formLogin().defaultSuccessUrl("/")`는 로그인 성공 후 이동할 페이지를 지정합니다.
* `.logout().logoutSuccessUrl("/")`는 로그아웃 성공 후 이동할 페이지를 지정합니다.



### 4. 뷰 설정

`pom.xml`에 아래 내용을 추가합니다.
뷰 렌더링 엔진으로는 **Thymeleaf**를 사용합니다.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<dependency>
  <groupId>org.thymeleaf.extras</groupId>
  <artifactId>thymeleaf-extras-springsecurity5</artifactId>
</dependency>
```

#### home.html

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"  
    xmlns:th="http://www.thymeleaf.org"
    xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">
<head>
<meta charset="UTF-8">
<title>Select Menu</title>
</head>
<body>
  <a href="test">Test Page</a>
  <a sec:authorize="hasRole('ADMIN')" href="adminOnly">adminOnly Page</a>
  <a sec:authorize="!isAuthenticated()" href="login">Login</a>
  <a sec:authorize="isAuthenticated()" href="logout">Logout</a>
  <p sec:authorize="hasRole('ADMIN')">[이 부분은 운영자(ADMIN)에게만 나타남]</p>
  <p sec:authorize="hasRole('GUEST')">[이 부분은 손님(GUEST)에게만 나타남]</p>
  <p sec:authorize="isAuthenticated()">[이 부분은 로그인한 사용자(isAuthenticated) 모두에게 나타남]</p>
</body>
</html>
```

`isAuthenticated()`는 로그인 상태일 때 `true`를 반환하며,
`hasRole('')`은 특정 역할을 가진 사용자인 경우 `true`를 반환합니다.
`sec:authorize`는 `th:if`와 비슷하게 조건부 렌더링을 수행하지만 시큐리티 전용 속성입니다.
`/login`, `/logout`은 스프링 시큐리티에서 기본 제공하는 로그인, 로그아웃 URL입니다.

## 실행 화면

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-4.png)  
*첫 페이지*

<br>

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-5.png)  
*운영자(admin)으로 로그인한 경우*

<br>

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-6.png)  
*운영자가 전용 페이지에 접근했을 때*

<br>

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-7.png)  
*손님(guest)으로 로그인한 경우*

<br>

![](/assets/img/wp-content/uploads/2019/02/spring-security-1-8.png)  
*손님이 운영자 전용 페이지에 접속하려고 할 때*





<!-- ## 프로젝트 생성

### 1. 디펜더시에서 Security 선택

 처음 스타트 [프로젝트 생성](http://yoonbumtae.com/?p=1018) 시 디펜던시에서 **Security**를 선택합니다.

 ![](/assets/img/wp-content/uploads/2019/02/spring-security-1-1.png)

나중에 수동으로 추가할 경우에는 아래를 `pom.xml`의 `<dependencies>` 내에 추가합니다.

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-test</artifactId>
  <scope>test</scope>
</dependency>
```

 

2\. 프로젝트를 생성하고 서버를 가동하면 어떤 URL에 접속해도 기본 로그인 화면만 나오게 됩니다. 기본 로그인 화면이 뜨지 않게 하기 위해 초기 세팅을 합니다.

![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.02.54.png) 기본 로그인 화면

 

메인 스프링 애플리케이션인 **SecurityApplication**은 따로 변경하지 않고, **SecurityConfig** 클래스를 생성합니다.

```java
package com.example.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests().antMatchers("/**").permitAll();
  }

}

```

컨트롤러인 **TestController** 도 작성합니다.

```java
package com.example.security;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class TestController {
  
  @RequestMapping("/")
  public String home(ModelAndView mav) {
    return "home";	
  }
  
  @ResponseBody
  @RequestMapping("/test")
  public String test() {
    return "OK";
  }
  
  @ResponseBody
  @RequestMapping("/adminOnly")
  public String adminOnly() {
    return "Secret Page";
  }
}

```

 ![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.11.48.png)

 

3\. 일단은 현재 연결된 데이터베이스가 없으므로 **메모리상에** 운영자 계정을 하나 만들고 로그인 페이지도 만들어서 운영자만 adminOnly 페이지에 접근 가능하도록 하는 예제를 만들기로 합니다.

**SecurityConfig**: `withUser` 부분은 사용자를 추가하는 부분이고 `roles`는 그 이름으로 된 역할을 부여합니다. **WebSecurityConfigurerAdapter**를 상속받았으므로 `configure` 메소드를 반드시 오버라이딩 해야 합니다. 주의할 점은 암호를 인코딩하는 부분인 `passwordEncoder`를 사용하지 않으면 에러를 유발합니다. (`{noop}`을 쓰는 다른 방법도 있는데 여기서는 다루지 않습니다.)

```java
package com.example.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
    .antMatchers("/adminOnly").hasAuthority("ROLE_ADMIN")
    .antMatchers("/**").permitAll()	// 넓은 범위의 URL을 아래에 배치한다.
    .anyRequest().authenticated()
    .and()
    .formLogin().defaultSuccessUrl("/")	
     // formLogin: 다른 옵션 설정이 없는 경우 시큐리티가 제공하는 기본 로그인 form 페이지 사용
    .and()
    .logout().logoutSuccessUrl("/");	
    // 로그아웃 기본 url은 (/logout)
    // 새로 설정하려면 .logoutUrl("url") 사용	
    
  }
  
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.inMemoryAuthentication()
    .withUser("admin").password(passwordEncoder().encode("1234")).roles("ADMIN")
    .and()
    .withUser("guest").password(passwordEncoder().encode("guest")).roles("GUEST");

  }
  
  // passwordEncoder() 추가
  @Bean
  public BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

}
```

- `HttpSecurity http`를 받는 첫 번째 `configure` 메소드는 일반적인 사항을 설정합니다. `http`는 내장된 대다수의 메소드들이 `http` 객체 자신을 반환하기 때문에 제이쿼리의 그것처럼 체이닝 하여 사용할 수 있습니다.
- `authorizeRequests`는 특정 리퀘스트에 권한을 설정합니다.
- `antMatchers`는 특정 URL을 지정합니다. `hasAuthority`는 왼쪽의 `antMatchers`에 권한을 설정하는데, 여기서는 `"ROLE_ADMIN"`이라는 권한을 가진 자들만 접속 가능하게 한다는 뜻입니다.
- `antMatcher`의 파라미터가 `"/**"`인 경우 위의 `"/adminOnly"` URL을 제외한 나머지 모든 URL을 지정한다는 뜻이고, `permitAll`은 접근한 모든 사람(손님 포함)에게 접근을 허용하겠다는 뜻입니다.
- `.anyRequest().authenticated()`는 권한별 접속을 활성화시킨다는 의미입니다. `and()`는 말 그대로 **AND** 조건절입니다.
- `defaultSuccessUrl("/")`은 로그인 성공시 이동할 URL을 지정하는 곳이며 "/"를 입력한 경우 기본 페이지로 이동합니다. `logoutSuccessUrl`은 로그아웃 성공 시 이동할 페이지를 지정합니다.

 

**TestController**는 변경할 부분이 없습니다. `pom.xml`에 다음 부분을 추가 **(주의: 버전 4가 아니라 5)** 합니다. 이 예제는 뷰 렌더링 엔진으로 기본 제공되는 **Thymeleaf**를 사용한다고 가정합니다.

```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

<!-- 시큐리티 유틸리티, 4가 아니라 5를 써야된다. - - >
<dependency>
  <groupId>org.thymeleaf.extras</groupId>
  <artifactId>thymeleaf-extras-springsecurity5</artifactId>
</dependency>
```

 

뷰 페이지(Thymeleaf)를 작성합니다. 다른 설정을 하지 않았다면 **src/main/resources/template/** 폴더 밑에 **home.html**이라는 이름으로 작성합니다.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"  
    xmlns:th="http://www.thymeleaf.org"
    xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">
<head>
<meta charset="UTF-8">
<title>Select Menu</title>
</head>
<body>
  <a href="test">Test Page</a>
  <a sec:authorize="hasRole('ADMIN')" href="adminOnly">adminOnly Page</a>
  <a sec:authorize="!isAuthenticated()" href="login">Login</a>
  <a sec:authorize="isAuthenticated()" href="logout">Logout</a>
  <p sec:authorize="hasRole('ADMIN')">[이 부분은 운영자(ADMIN)에게만 나타남]</p>
  <p sec:authorize="hasRole('GUEST')">[이 부분은 손님(GUEST)에게만 나타남]</p>
  <p sec:authorize="isAuthenticated()">[이 부분은 로그인한 사용자(isAuthenticated) 모두에게 나타남]<p>
</body>
</html>
```

`isAuthenticated()`는 멤버가 로그인 했을 때 `true`를 반환하고 `!`를 붙이면 그 반대의 상황(false)에서 `true`를 반환합니다(`!false`이므로). `hasRole('')`은 로그인한 멤버가 특정 역할을 가지고 있을 때 `true`를 반환합니다.`sec:authorize`는 `th:if` 비슷한 역할인데 시큐리티 전용이라고 생각하면 되겠습니다. `/login`, `/logout`은 스프링 시큐리티에서 기본으로 제공하는 로그인, 로그아웃 URL입니다.

 

\[caption id="attachment\_1517" align="alignnone" width="264"\] ![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.37.40.png) 첫 페이지\[/caption\]

 

\[caption id="attachment\_1518" align="alignnone" width="418"\] ![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.38.01.png) 운영자(admin)으로 로그인 한 경우\[/caption\]

 

\[caption id="attachment\_1519" align="alignnone" width="315"\] ![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.38.18.png) 운영자가 전용 페이지에 접근했을 때\[/caption\]

 

\[caption id="attachment\_1520" align="alignnone" width="396"\] ![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.38.35.png) 손님(guest)으로 로그인한 경우\[/caption\]

 

\[caption id="attachment\_1521" align="alignnone" width="393"\] ![](/assets/img/wp-content/uploads/2019/02/screenshot-2019-09-22-pm-5.38.56.png) 손님이 운영자 전용 페이지에 접속하려고 할 때\[/caption\]

 

\[rcblock id="3197"\] -->
