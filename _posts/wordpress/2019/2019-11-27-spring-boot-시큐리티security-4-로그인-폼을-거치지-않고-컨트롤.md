---
title: "Spring Boot: 시큐리티(Security) – 4 – 로그인 폼을 거치지 않고 컨트롤러에서 로그인"
date: 2019-11-27
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "스프링시큐리티"
---

<!-- \[rcblock id="3197"\] -->

깃허브에서 전체 코드 보기
- [https://github.com/ayaysir/spring-boot-security-example-1](https://github.com/ayaysir/spring-boot-security-example-1)

 

로그인 폼을 거치지 않고 컨트롤러에서 로그인 처리를 하는 방법입니다. 외부 소셜 로그인 기능과 스프링 시큐리티를 연동하고자 할 때 사용할 수 있습니다.

## 절차

### 아래 메소드를 컨트롤러 내에 삽입합니다.

```java
/**
 * 로그인 폼을 거치지 않고 바로 로그인
 * @param username
 * @return
 */
@RequestMapping("/loginWithoutForm/{username}")
public String loginWithoutForm(@PathVariable(value="username") String username) {
  
  List<GrantedAuthority> roles = new ArrayList<>(1);
  String roleStr = username.equals("admin") ? "ROLE_ADMIN" : "ROLE_GUEST";
  roles.add(new SimpleGrantedAuthority(roleStr));
  
  User user = new User(username, "", roles);
  
  Authentication auth = new UsernamePasswordAuthenticationToken(user, null, roles);
  SecurityContextHolder.getContext().setAuthentication(auth);
  return "redirect:/";
}
```

13라인은 유저네임에 의한 유저를 생성합니다. 역할(roles)만 정확하면 아무 이름이나 입력해도 즉석에서 사용자 계정이 생성되므로 실제 서비스시에는 외부인이 접근할 수 있도록 해서는 안됩니다.

15라인은 파라미터를 `(username, password)`로 해도 들어갈 수 있습니다. 예를 들어 `("admin", "1234")` 이렇게 입력하면 폼에서 로그인한것과 동일한 과정을 통해 사용자 인증을 진행합니다. 단, 비밀번호는 암호화되어 운영자도 알 수 없어야 하므로 이 방법은 운영자 자신의 계정 말고는 쓸 곳이 마땅치 않습니다.

16라인은 현재 인증된 계정(로그인 상태의 계정)을 새로 생성한 `auth`로 교체하는 과정입니다.

 

### 아래 테이블(`simple_users`)은 회원 목록입니다.

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-27-pm-11.57.06.png)

 

### 첫 페이지에서 좋아하는 음식 목록을 가져오도록 변경합니다.

#### 컨트롤러 내 메소드 (첫 페이지 담당)

```java
@RequestMapping("/")
public String home(Model model) {

  Object currentAuth = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
  UserDetails principal = null;
  try {
    if(!(currentAuth instanceof String)) {
      principal = (UserDetails) currentAuth;
      List<Map<String, ?>> userInfo = sud.getUserInfo(principal.getUsername());
      String food = (String) userInfo.get(0).get("food");
      model.addAttribute("food", food);
    }
  } catch(Exception e) {
    
  }
  
  return "home";	
}
```

#### DAO

```java
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SimpleUserDAO {
  @Autowired JdbcTemplate jt;
  
    public List<Map<String, ?>> getUserInfo(String username) {
        
        return jt.query("select * from simple_users where username=?", new Object[] {username} , (rs, rowNum) -> {
          Map<String, Object> anUser = new HashMap<>();
          anUser.put("username", rs.getString(2));
          anUser.put("password", rs.getString(3));
          anUser.put("role", rs.getString(4));
          anUser.put("food", rs.getString(5));
          return anUser;
        });
      }
}

```

### HTML 뷰 (Thymeleaf)

```html
<body>
  <a href="test">Test Page</a>

(... 생략 ...)

  <p sec:authorize="isAuthenticated()">내가 좋아하는 음식은 <span th:text="${food}" class="food"></span> 입니다.</p>
  <p th:text="${#authentication.getPrincipal()}"></p>
  
</body>
```

## 동작 화면

결과 화면입니다. url (`/loginWithoutForm/아이디`)를 입력하면 로그인이 됩니다.

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-28-am-12.00.10.png)

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-28-am-12.07.08.png)

 

<!-- \[rcblock id="3197"\] -->
