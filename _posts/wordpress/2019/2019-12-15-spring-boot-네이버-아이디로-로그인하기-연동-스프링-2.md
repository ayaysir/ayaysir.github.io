---
title: "Spring Boot: “네이버 아이디로 로그인하기” 연동 – 스프링 시큐리티와 연결 (3)"
date: 2019-12-15
categories: 
  - "DevLog"
  - "Spring/JSP"
---

보다 개선된 네이버 로그인 – [스프링 부트(Spring Boot): 구글 로그인 연동 (스프링 부트 스타터의 oauth2-client) 이용 + 네이버 아이디로 로그인](/posts/%EC%8A%A4%ED%94%84%EB%A7%81-%EB%B6%80%ED%8A%B8spring-boot-%EA%B5%AC%EA%B8%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%97%B0%EB%8F%99-%EC%8A%A4%ED%94%84%EB%A7%81-%EB%B6%80%ED%8A%B8-%EC%8A%A4%ED%83%80/)

 

이전글의 두 상황을 결합하여 네이버 아이디로 로그인(이하 네아로)을 스프링 시큐리티와 연결하는 예제입니다.

- [Spring Boot: – 네이버 아이디로 로그인하기 – 연동하기 (1)](/posts/spring-boot-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%95%84%EC%9D%B4%EB%94%94%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%98%EA%B8%B0-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0-1/)
- [Spring Boot: 시큐리티(Security) – 4 – 로그인 폼을 거치지 않고 컨트롤러에서 로그인](/posts/spring-boot-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0security-4-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%8F%BC%EC%9D%84-%EA%B1%B0%EC%B9%98%EC%A7%80-%EC%95%8A%EA%B3%A0-%EC%BB%A8%ED%8A%B8%EB%A1%A4/)

## 가정

외부 소셜 로그인을 구현할 때 다음 상황이 있습니다.

1. 기존에 사용자 계정이 존재하고, 네아로를 기존 로그인 체계로 연결
2. 기존 사용자 계정과 연결하지 않고 네이버 아이디를 단독으로 사용

여기서는 1번을 다룹니다.

<!-- \[the\_ad id="3020"\] -->

## 주의사항

네아로 연결 시 구현 내용 및 주의사항들이 있습니다.

1. 네아로 연동이 안되어 있다면, 네아로 연동하는 창을 띄운다. – 이 때, 로그인이 되어 있다면 기존 아이디를 네아로와 연동할 것인지 확인 여부를 물음
2. 네아로 연동 안되어 있고 로그인이 되어 있지 않다면, 로그인 창(+회원가입 링크)으로 리다이렉트 – 기존에 회원아이디로 로그인했다면 네아로 연동 과정을 계속 진행 – 회원가입이 되지 않은 상태이며 이 회원 가입링크를 통해 가입한 경우 가입 완료하자마자 네아로 연동 과정 진행
3. 네아로 연동이 되어 있다면 연동 정보를 통해 로그인 처리 – 현재 로그인한 계정과 네아로 연결된 로그인 계정이 다른 경우, 현재 계정을 로그아웃하고 그 연결된 계정으로 재로그인

오늘은 2번을 구현하도록 하겠습니다. 이전 구현 내용은 아래 링크를 참고하세요.

- [Spring Boot: “네이버 아이디로 로그인하기” 연동 – 스프링 시큐리티와 연결 (1)](/posts/spring-boot-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%95%84%EC%9D%B4%EB%94%94%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%98%EA%B8%B0-%EC%97%B0%EB%8F%99-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8B%9C/)
- [Spring Boot: “네이버 아이디로 로그인하기” 연동 – 스프링 시큐리티와 연결 (2)](/posts/spring-boot-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%95%84%EC%9D%B4%EB%94%94%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%98%EA%B8%B0-%EC%97%B0%EB%8F%99-%EC%8A%A4%ED%94%84%EB%A7%81/)

 

2번의 상황을 구현하기 위해 기존 로그인 창을 두 갈래로 나눠 작업을 진행하도록 변경합니다. 일반적인 로그인 상황이 아닌 네이버 로그인 버튼을 통해 접속했는데 '_연동된 정보가 없고 로그인이 되지 않은 상태_'라면 약간 다른 기능을 가진 로그인 창을 띄우도록 했습니다. (테스트 동영상 참고)

## 방법

### **1\. 데이터베이스 구조**

[이전 글](/posts/spring-boot-네이버-아이디로-로그인하기-연동-스프링)

 

### **2\. 컨트롤러, DAO 등 작성**

내용이 많고 이전 글의 내용과 겹치는 부분이 많아서 중요한 부분은 하이라이트 처리합니다.

#### 로그인 컨트롤러 (일부)

```java
/**
 * 로그인 페이지
 * @param session
 * @param model
 * @return
 * @throws UnsupportedEncodingException
 */
@RequestMapping("/login")
public String loginForm(HttpSession session, Model model) throws UnsupportedEncodingException {
  String apiURL = getNaverOAuthURI(session);
  model.addAttribute("naverApiURL", apiURL);
  if(session.getAttribute("todoAssign") != null && session.getAttribute("todoAssign").equals("naver")) {
    model.addAttribute("isTodoAssignNaver", true);
    session.setAttribute("todoAssign", null); // 연동 메뉴는 최초 접속시에만 활성화하고 다시 접속시 바로 비활성화
  }
  return "login-form";
}
```

세션 속성 `todoAssign`은 띄우려는 로그인 페이지가 일반적인 상황이 아닌 네이버 로그인을 통해 접속했을 때 `true`가 됩니다. (콜백 페이지 컨트롤러 부분 참고)

 

```java
/**
 * 네이버 로그인을 했는데 연동이 안되어있고 로그인 상태가 아닌 경우 로그인을 했을 때 연동 여부를 묻는 페이지로 이동하는 메소드  
 * @param session
 * @param model
 * @param whereFrom
 * @return
 */
@GetMapping("/login/oauth/naver")
public String loginOAuth(HttpSession session, Model model, String whereFrom) {
  if(whereFrom.equals("naverOAuth-s")) {
    model.addAttribute("uniqueIdOfNaver", session.getAttribute("uniqueIdOfNaver"));
    return "assign-naver";
  } else {
    return "redirect:/";
  }
}

/**
 * 콜백 페이지 컨트롤러
 * @param session
 * @param request
 * @param model
 * @return
 * @throws IOException
 * @throws ParseException
 */
@SuppressWarnings("unchecked")
@RequestMapping("/naver/callback1")
public String naverCallback1(HttpSession session, HttpServletRequest request, Model model) throws IOException, ParseException {

  String code = request.getParameter("code");
  String state = request.getParameter("state");
  String redirectURI = URLEncoder.encode(REDIRECT_URI, "UTF-8");

  UrlBuilder ub = new UrlBuilder("https://nid.naver.com/oauth2.0/token");
  ub
    .add("grant_type", "authorization_code")
    .add("client_id", CLIENT_ID)
    .add("client_secret", CLI_SECRET)
    .add("redirect_uri", redirectURI)
    .add("code", code)
    .add("state", state);
  System.out.println(ub);

  String apiURL = ub.toString();

  String res = requestToServer(apiURL);

  if(res != null && !res.equals("")) {
    Map<String, Object> parsedJson = new JSONParser(res).parseObject();
    if(parsedJson.get("access_token") != null) {
      
      // 
      String infoStr = getProfileFromNaver(parsedJson.get("access_token").toString());
      Map<String, Object> infoMap = new JSONParser(infoStr).parseObject();
      if(infoMap.get("message").equals("success")) {
        Map<String, Object> infoResp = (Map<String, Object>) infoMap.get("response");
        String uniqueId = infoResp.get("id").toString();
        System.out.println(uniqueId);
        List<Map<String, String>> infoOAuth = sud.getOAuthInfoByProviderAndUniqueId("naver", uniqueId);
        if(infoOAuth.size() == 1) {
          System.out.println(infoOAuth);
          // 네아로 연동이 되어 있다면 연동 정보를 통해 로그인 처리
          // - 현재 로그인한 계정과 네아로 연결된 로그인 계정이 다른 경우, 현재 계정을 로그아웃하고 그 연결된 계정으로 재로그인
          loginWithoutForm(infoOAuth.get(0).get("username"));
          model.addAttribute("isConnectedToNaver", true);
        } else {
          System.out.println("네이버 연동 정보 없음");
          // 로그인이 되어 있다면 기존 아이디를 네아로와 연동할 것인지 확인 여부를 물음
          model.addAttribute("isConnectedToNaver", false);
          model.addAttribute("uniqueIdOfNaver", uniqueId);
          
          // 아로 연동 안되어 있고 로그인이 되어 있지 않다면, 로그인 창(+회원가입 링크)으로 리다이렉트
          // – 기존에 회원아이디로 로그인했다면 네아로 연동 과정을 계속 진행
          // – 회원가입이 되지 않은 상태이며 이 회원 가입링크를 통해 가입한 경우 가입 완료하자마자 네아로 연동 과정 진행
          String authName = SecurityContextHolder.getContext().getAuthentication().getName();

          if(authName.equals("anonymousUser")) {
            session.setAttribute("todoAssign", "naver");
            session.setAttribute("uniqueIdOfNaver", uniqueId);
            return "redirect:/login";
          }
        }
      }

      session.setAttribute("currentNaverUser", res);
      session.setAttribute("currentAT", parsedJson.get("access_token"));
      session.setAttribute("currentRT", parsedJson.get("refresh_token"));

      model.addAttribute("res", res);
    } else {
      model.addAttribute("res", "Login failed!");
    }
    System.out.println(parsedJson);
  } else {
    model.addAttribute("res", "Login failed!");
  }
  return "test-naver-callback";
}

/**
 * 네이버 계정을 users_oauth 테이블에 할당
 * @param session
 * @param auth
 * @param model
 * @param uniqueId
 * @return
 */
@PostMapping("/oauth/assign/naver")
public String addRowToOAuthTableForNaver(HttpSession session, Authentication auth, Model model, String uniqueId, String username) {
  username = auth != null && !auth.getName().equals("anonymousUser") ? auth.getName() : username;
  String provider = "naver";
  List<Map<String, String>> infoOAuth = sud.getOAuthInfoByProviderAndUniqueId(provider, uniqueId);
  int resultCode = 0;
  if(infoOAuth.size() == 0) {
    Map<String, String> aRow = new HashMap<>();
    aRow.put("username", username);
    aRow.put("provider", provider);
    aRow.put("unique_id", uniqueId);
    resultCode = sud.insertAnUserOAuth(aRow);
    if(resultCode <= 0) {
      session.setAttribute("currentNaverUser", null);
    }
    model.addAttribute("task", "assign-naver");
    model.addAttribute("resultCode", resultCode);
  }
  return "redirect:/";
}

```

`@GetMapping("/login/oauth/naver")` 부분은 밑에 나오는 로그인 성공 핸들러로부터 리다이렉트됩니다.

 

#### 사용자 컨트롤러 (일부)

```java
package com.springboot.security.controller;

.......

import com.springboot.security.dao.SimpleUserDAO;

@Controller
public class UserController {
  
  @Autowired SimpleUserDAO sud;
  
  @GetMapping("/signup")
  public String signUp(Model model, HttpSession session, boolean isTodoAssignNaver) {
    if(isTodoAssignNaver && session.getAttribute("uniqueIdOfNaver") != null) {
      model.addAttribute("uniqueIdOfNaver", session.getAttribute("uniqueIdOfNaver"));
    }
    return "signup/signup";
  }
  
  @PostMapping("/signup")
  public String signUpProc(Model model, @RequestParam Map<String, String> params) {
  
    .......
    
    model.addAttribute("isSuccess", isAllValidate);
    model.addAttribute("resultMsg", result);
    model.addAttribute("username", userId);
    if(params.get("uniqueIdOfNaver") != null) {
      model.addAttribute("uniqueIdOfNaver", params.get("uniqueIdOfNaver"));
    }
    return "signup/signup-result";
  }
}

```

<!-- \[the\_ad id="3020"\] -->

#### 시큐리티 config (일부)

```java
package com.springboot.security;

......

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private DataSource dataSource;
  @Autowired private SecurityDAO sd;

  @Override
  protected void configure(HttpSecurity http) throws Exception {

    setAntMatchers(http, "ROLE_");

    http
    .formLogin().loginPage("/login").failureUrl("/login?error").permitAll().successHandler(new LoginSuccessForOAauthHandler())
    .and()
    .logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
    .addLogoutHandler(new TaskImplementingLogoutHandler()).permitAll().logoutSuccessUrl("/");

  }

  .......

}
```

로그인에 성공했을 경우 별도의 작업을 수행하기 위해 새로운 로그인 성공 핸들러를 시큐리티 config에 지정합니다. `.successHandler(new LoginSuccessForOAauthHandler())`

 

#### 로그인 성공했을 시 실행되는 핸들러

```java
package com.springboot.security;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class LoginSuccessForOAauthHandler implements AuthenticationSuccessHandler {

  Logger logger = LoggerFactory.getLogger(LoginSuccessForOAauthHandler.class);

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication auth) throws IOException, ServletException {
    logger.info(String.format("로그인 핸들러 작동 (username: %s)", auth.getName()) );
    System.out.println("dd: " + request.getParameter("oauth-handler"));
    if(request.getParameter("oauth-handler").equals("naver")) {
      logger.info("assign naver");
      response.sendRedirect("/login/oauth/naver?whereFrom=naverOAuth-s");
    } else {
      response.sendRedirect("/");
    }

  }

}
```

`request.getParameter("oauth-handler")` 부분은 밑의 뷰 페이지의 **login-form.html** 에서 넘어옵니다.

 

### **3\. 뷰 페이지(Thymeleaf) 작성**

- 이전 글: [Spring Boot 예제: 회원가입 폼 만들기](/posts/spring-boot-%EC%98%88%EC%A0%9C-%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%ED%8F%BC-%EB%A7%8C%EB%93%A4%EA%B8%B0/)

#### login-form.html (로그인 페이지)

```html
<html xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">

<head>
    <title>Please Login</title>
</head>

<body>
    <div th:fragment="content">
    
        <div th:if="${isTodoAssignNaver}">
        	<h3>네이버 연동이 되지 않았습니다. 로그인하면 네이버와 연동하는 메뉴가 나오고, 회원가입을 누르고 완료하면 연동 메뉴가 나타납니다.</h3>
        </div>
        <form name="f" th:action="@{/login}" method="post">
            <fieldset>
                <legend>Please Login</legend>
                <div th:if="${param.error}" class="alert alert-error">
                    Invalid username and password.
                </div>
                <div th:if="${param.logout}" class="alert alert-success">
                    You have been logged out.
                </div>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" />
                <label for="password">Password</label>
                <input type="password" id="password" name="password" />
                <div class="form-actions">
                    <button type="submit" class="btn">Log in</button>
                </div>
                
                
            	<p>
            		<a th:href="@{/signup}" th:unless="${isTodoAssignNaver}">회원가입</a>
            		<a th:href="@{/signup?isTodoAssignNaver=true}" th:if="${isTodoAssignNaver}">회원가입 (isTodoAssignNaver)</a>
            	</p>
                
                <div th:unless="${isTodoAssignNaver}">
                    <h3>네이버 로그인</h3>
                    <a th:href="${naverApiURL}"><img height="50" src="http://static.nid.naver.com/oauth/small_g_in.PNG" /></a>
                </div>
                
                <input type="hidden" th:value="${isTodoAssignNaver ne null and isTodoAssignNaver ? 'naver' : 'none'}" name="oauth-handler">
            </fieldset>
        </form>
    </div>
</body>

</html>
```

`th:if` 또는 `th:unless`를 사용해 로그인 상황에 따라 나오는 부분을 다르게 했습니다.

<!-- \[the\_ad id="3020"\] -->

#### assign-naver.html (네이버 아이디와 연동 여부를 물음)

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">
<head>
<meta charset="UTF-8">
<title>naver</title>
<style>
  pre{
    overflow: scroll;
  }
</style>
<!-- <meta http-equiv="refresh" content="5;url=/naver"> -->
</head>
<body>
  <th:block sec:authorize="isAuthenticated()">
    <!-- <p th:text="${uniqueIdOfNaver}"></p> -->
    <div th:if="${uniqueIdOfNaver ne null}">
      <h5>현재 아이디를 네이버 아이디와 연동하시겠습니까?</h5>
      <a>[NO]</a> 
      <form th:action="@{/oauth/assign/naver}" method="POST">
        <input type="hidden" th:value="${uniqueIdOfNaver}" name="uniqueId">
        <button>[YES]</button>
      </form>
    </div>
  </th:block>
</body>
</html>
```

 

#### signup.html (회원가입 뷰 페이지)

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">

<head>
    <meta charset="UTF-8">
    <title>회원가입</title>
    <link rel="stylesheet" type="text/css" th:href="@{/webjars/bootstrap/4.4.1/css/bootstrap.css}">
    <link rel="stylesheet" type="text/css" href="/board.css">
</head>

<body>
    <div class="container">
        <div class="py-5 text-center">
            <img class="d-block mx-auto mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
            <h2>회원가입</h2>
            <p class="lead">회원가입하세요. 가입하면 게시판을 열람할 수 있습니다.</p>
        </div>

        <div class="col-md-12 order-md-1">
            <h4 class="mb-3">회원정보</h4>
            <form class="needs-validation" novalidate th:action="@{/signup}" method="POST">

                <div class="mb-3">
                    <label for="username">아이디 (username)</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">@</span>
                        </div>
                        <input type="text" class="form-control" id="username" placeholder="Username" required name="user-id">
                        <div class="invalid-feedback" style="width: 100%;">Your username is required.</div>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label for="password">비밀번호</label> 
                    <input type="password" class="form-control" id="password" placeholder="" value="" required name="user-password">
                    <div class="invalid-feedback">유효한 비밀번호가 필요합니다.</div>
                </div>

                <div class="mb-3">
                    <label for="firstName">이름</label> 
                    <input type="text" class="form-control" id="real-name" placeholder="" value="" required name="user-real-name">
                    <div class="invalid-feedback">유효한 이름을 입력해야합니다.</div>
                </div>

                <div class="mb-3">
                    <label for="email">이메일</label>
                    <input type="email" class="form-control" id="email" placeholder="you@example.com" name="user-email">
                    <div class="invalid-feedback">올바른 이메일을 입력하세요.</div>
                </div>

                <div class="mb-3">
                    <label for="address">좋아하는 음식</label> <input type="text" class="form-control" id="food" placeholder="예) 치킨" required name="user-food">
                    <div class="invalid-feedback">좋아하는 음식을 입력하세요.</div>
                </div>

                <hr class="mb-4">
                <button class="btn btn-primary btn-lg btn-block" type="submit">가입하기</button>
                <hr class="mb-4">

        <input type=hidden th:value="${uniqueIdOfNaver}" name="uniqueIdOfNaver">
                
            </form>
            
            <footer th:replace="/fragments/semantic :: footer"></footer>
        </div>

    </div>

</body>

</html>
```

 

#### signup-result.html (회원가입 결과 페이지)

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">

<head>
    <meta charset="UTF-8">
    <title>회원가입</title>
    <link rel="stylesheet" type="text/css" th:href="@{/webjars/bootstrap/4.4.1/css/bootstrap.css}">
    <link rel="stylesheet" type="text/css" href="/board.css">
</head>

<body>
    <div class="container">
       <div class="py-5 text-center">
        <img class="d-block mx-auto mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
        <h2>회원가입 결과 여부</h2>
       	<pre th:text="${resultMsg}"></pre>
       	<p>
       		<a href="" th:unless="${isSuccess}">회원가입 다시하기</a>
       		<a href="/" th:if="${isSuccess}">홈페이지로 돌아가기</a>
       	</p>
      </div>
    <!-- <p th:text="${uniqueIdOfNaver}"></p> -->
    <div th:if="${isSuccess and uniqueIdOfNaver ne null}">
      <h5>현재 아이디를 네이버 아이디와 연동하시겠습니까?</h5>
      <a>[NO]</a> 
      <form th:action="@{/oauth/assign/naver}" method="POST">
        <input type="hidden" th:value="${uniqueIdOfNaver}" name="uniqueId">
        <input type="hidden" th:value="${username}" name="username">
        <button>[YES]</button>
      </form>
    </div>
    </div>

</body>

</html>
```

 

### **4\. 테스트**

{% youtube "https://www.youtube.com/watch?v=mazs3a40S44" %}
