---
title: "Spring Boot: “네이버 아이디로 로그인하기” 연동 - 스프링 시큐리티와 연결 (1)"
date: 2019-12-10
categories: 
  - "DevLog"
  - "Spring/JSP"
---

깃허브에서 전체 코드 보기 - [https://github.com/ayaysir/spring-boot-security-example-1](https://github.com/ayaysir/spring-boot-security-example-1)

보다 개선된 네이버 로그인 - [스프링 부트(Spring Boot): 구글 로그인 연동 (스프링 부트 스타터의 oauth2-client) 이용 + 네이버 아이디로 로그인](http://yoonbumtae.com/?p=2652)

이전글의 두 상황을 결합하여 네이버 아이디로 로그인(이하 네아로)을 스프링 시큐리티와 연결하는 예제입니다.

- [Spring Boot: - 네이버 아이디로 로그인하기 - 연동하기 (1)](http://yoonbumtae.com/?p=1818)
- [Spring Boot: 시큐리티(Security) - 4 - 로그인 폼을 거치지 않고 컨트롤러에서 로그인](http://yoonbumtae.com/?p=1841)

 

외부 소셜 로그인을 구현할 때 다음 상황이 있습니다.

1. 기존에 사용자 계정이 존재하고, 네아로를 기존 로그인 체계로 연결
2. 기존 사용자 계정과 연결하지 않고 네이버 아이디를 단독으로 사용

여기서는 1번을 다룹니다.

 

네아로 연결 시 구현 내용 및 주의사항들이 있습니다.

1. 네아로 연동이 안되어 있다면, 네아로 연동하는 창을 띄운다. \- 이 때, 로그인이 되어 있다면 기존 아이디를 네아로와 연동할 것인지 확인 여부를 물음
2. 네아로 연동 안되어 있고 로그인이 되어 있지 않다면, 로그인 창(+회원가입 링크)으로 리다이렉트 \- 기존에 회원아이디로 로그인했다면 네아로 연동 과정을 계속 진행 \- 회원가입이 되지 않은 상태이며 이 회원 가입링크를 통해 가입한 경우 가입 완료하자마자 네아로 연동 과정 진행
3. 네아로 연동이 되어 있다면 연동 정보를 통해 로그인 처리 - 현재 로그인한 계정과 네아로 연결된 로그인 계정이 다른 경우, 현재 계정을 로그아웃하고 그 연결된 계정으로 재로그인

내용이 굉장히 많아서 시리즈로 나눠서 연재하며 오늘은 3번만 구현하도록 하겠습니다.

 

#### **1\. 데이터베이스 구조**

##### 회원 테이블 (_simple\_users_)

 ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오전-2.11.21.png)

 ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-10.48.36.png)

 

##### 외부 로그인 연동 테이블(_users\_oauth_)

 ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-10.50.04.png)

`username`은 외래키로 회원 테이블의 키와 연결됩니다. `provider`는 제공사 이름으로, "_naver_", "_google_" 등이 입력됩니다. `unique_id`에는 회원을 구분하는 고유값이 입력됩니다.

 

 ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-10.52.32.png)

테스트를 위해 임의로 레코드 하나를 수작업으로 삽입했습니다. 나중에 연동 여부에 따라 컨트롤러에서 삽입되도록 변경할 예정입니다.

 

#### **2\. 컨트롤러, DAO 등 작성**

```
package com.springboot.security.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONParser;
import org.apache.tomcat.util.json.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.springboot.security.dao.SimpleUserDAO;
import com.springboot.security.util.UrlBuilder;

@Controller
public class LoginController {
  
  @Autowired SimpleUserDAO sud;

  private final String CLIENT_ID = "*************"; //애플리케이션 클라이언트 아이디값";
  private final String CLI_SECRET = "**************"; //애플리케이션 클라이언트 시크릿값";
  private final String REDIRECT_URI = "[네이버 개발자 센터에 등록된 콜백주소]";
  
  @RequestMapping("/login")
  public String loginForm(HttpSession session, Model model) throws UnsupportedEncodingException {
    String apiURL = getNaverOAuthURI(session);
    model.addAttribute("naverApiURL", apiURL);
    return "login-form";
  }

  /**
   * 로그인 폼을 거치지 않고 바로 로그인
   * @param username
   * @return
   */
  @RequestMapping("/loginWithoutForm/{username}")
  public String loginWithoutForm(@PathVariable(value="username") String username) {
    
    String roleStr = "ROLE_" + sud.getRolesByUsername(username).toUpperCase();

    List<GrantedAuthority> roles = new ArrayList<>(1);
    //String roleStr = username.equals("admin") ? "ROLE_ADMIN" : "ROLE_GUEST";
    roles.add(new SimpleGrantedAuthority(roleStr));

    User user = new User(username, "", roles);

    Authentication auth = new UsernamePasswordAuthenticationToken(user, null, roles);
    SecurityContextHolder.getContext().setAuthentication(auth);
    return "redirect:/";
  }

  /**
   * 현재 로그인한 사용자 정보 가져오기
   * @return
   */
  
   생략

  
  /**
   * getNaverOAuthURI (+ 세션의 "state" 속성에 값 부여)
   * @param session
   * @return
   * @throws UnsupportedEncodingException
   */
  private String getNaverOAuthURI(HttpSession session) throws UnsupportedEncodingException {
    String redirectURI = URLEncoder.encode(REDIRECT_URI, "UTF-8");

    SecureRandom random = new SecureRandom();
    String state = new BigInteger(130, random).toString();
    
    UrlBuilder ub = new UrlBuilder("https://nid.naver.com/oauth2.0/authorize");
    ub
      .add("response_type", "code")
      .add("client_id", CLIENT_ID)
      .add("redirect_uri", redirectURI)
      .add("state", state);
    String apiURL = ub.toString();
    session.setAttribute("state", state);
    
    return apiURL;
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
          }
        }
        session.setAttribute("currentUser", res);
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
   * 토큰 갱신 요청 페이지 컨트롤러
   * @param session
   * @param request
   * @param model
   * @param refreshToken
   * @return
   * @throws IOException
   * @throws ParseException
   */
    
   생략

  /**
   * 토큰 삭제 컨트롤러
   * @param session
   * @param request
   * @param model
   * @param accessToken
   * @return
   * @throws IOException
   */
  
   생략

  /**
   * 액세스 토큰으로 네이버에서 프로필 받기
   * @param accessToken
   * @return
   * @throws IOException
   */
  @ResponseBody
  @RequestMapping("/naver/getProfile")
  public String getProfileFromNaver(String accessToken) throws IOException {

    // 네이버 로그인 접근 토큰;
    String apiURL = "https://openapi.naver.com/v1/nid/me";
    String headerStr = "Bearer " + accessToken; // Bearer 다음에 공백 추가
    String res = requestToServer(apiURL, headerStr);
    return res;
  }

  /**
   * 세션 무효화(로그아웃)
   * @param session
   * @return
   */
  
   생략

  /**
   * 서버 통신 메소드
   * @param apiURL
   * @return
   * @throws IOException
   */
  private String requestToServer(String apiURL) throws IOException {
    return requestToServer(apiURL, "");
  }

  /**
   * 서버 통신 메소드
   * @param apiURL
   * @param headerStr
   * @return
   * @throws IOException
   */
  private String requestToServer(String apiURL, String headerStr) throws IOException {
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection)url.openConnection();
    con.setRequestMethod("GET");

    System.out.println("header Str: " + headerStr);
    if(headerStr != null && !headerStr.equals("") ) {
      con.setRequestProperty("Authorization", headerStr);
    }

    int responseCode = con.getResponseCode();
    BufferedReader br;

    System.out.println("responseCode="+responseCode);

    if(responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else {  // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    if(responseCode==200) {
      return res.toString();
    } else {
      return null;
    }

  }

}

```

대부분의 네아로 관련 액션은 콜백 부분에서 처리될 것입니다. 네아로 주소 가져오는 작업을 `getNaverOAuthURI` 이라는 메소드로 별도로 분리했습니다.



 

```
package com.springboot.security.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SimpleUserDAO {
  @Autowired JdbcTemplate jt;

  (.......)
  

  public String getRolesByUsername(String username) {
    return jt.queryForObject("select role from simple_users where username=?", new Object[] {username}, (rs, rowNum) -> {
      return rs.getString(1);
    });
  }
  
  public List<Map<String, String>> getOAuthInfoByProviderAndUniqueId(String provider, String uniqueId) {
    return jt.query("select * from users_oauth where provider=? and unique_id=?", 
        new Object[] { provider, uniqueId }, (rs, rowNum) -> {
          
      Map<String, String> aRow = new HashMap<>();
      aRow.put("seq", rs.getString("seq"));
      aRow.put("username", rs.getString("username"));
      aRow.put("provider", rs.getString("provider"));
      aRow.put("uniqueId", rs.getString("unique_id"));
      aRow.put("regDate", rs.getString("reg_date"));
      aRow.put("lastDate", rs.getString("last_date"));
      return aRow;
      
    });
  }

}
```

일반적인 DAO 입니다.`getRolesByUsername`는 사용자의 ROLE을 불러옵니다. `getOAuthInfoByProviderAndUniqueId` 메소드는 프로바이더와 고유 아이디를 이용해서 해당 네이버 계정이 기존 회원 테이블과 연결되었는지 확인합니다.

 

https://gist.github.com/ayaysir/efad25b1b3cd43c80b3964d24fae2bef

 

#### **3\. 뷰 페이지(Thymeleaf) 작성**

##### login-form.html

```
<html xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">

<head>
    <title>Please Login</title>
</head>

<body>
    <div th:fragment="content">
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
                <div>
                    <h3>네이버 로그인</h3>
                    <a th:href="${naverApiURL}"><img height="50" src="http://static.nid.naver.com/oauth/small_g_in.PNG" /></a>
                </div>
            </fieldset>
        </form>
    </div>
</body>

</html>
```

 

##### test-naver-callback.html

```
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity4">
<head>
<meta charset="UTF-8">
<title>Callback</title>
<style>
  pre{
    overflow: scroll;
  }
</style>
<!-- <meta http-equiv="refresh" content="5;url=/naver"> -->
</head>
<body>
  <h1>콜백 페이지</h1>
  <pre th:text="${res}"></pre>
  <p>5초 후에 메인 페이지로 돌아갑니다. 원래는 이 화면이 사용자에게 보이지 않고 바로 리다이렉트 되어야 합니다.</p>
  <a href="/naver">go to naver test page</a>
  <a href="/">go to main page</a>
  
  <th:block sec:authorize="isAuthenticated()">
    <div th:unless="${isConnectedToNaver}">
      <h5>현재 아이디를 네이버 아이디와 연동하시겠습니까?</h5>
      <a>[YES]</a> <a>[NO]</a>
    </div>
    <div th:if="${isConnectedToNaver}">
      <h5>현재 아이디 연동이 되어 있습니다.</h5>
    </div>
  </th:block>
</body>
</html>
```

 

#### **4\. 테스트**

\[caption id="attachment\_1953" align="alignnone" width="385"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-11.11.26.png) 현재 로그인되지 않은 상태이며 로그인 버튼이 있습니다.\[/caption\]

 



 

\[caption id="attachment\_1949" align="alignnone" width="603"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-11.06.56.png) 로그인 버튼을 누르면 밑에 네이버 로그인 버튼이 새로 추가된 것을 볼 수 있습니다.\[/caption\]

 

\[caption id="attachment\_1950" align="alignnone" width="654"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-11.07.12.png) 네이버 아이디로 로그인이 성공하면 콜백 페이지가 나타납니다.\[/caption\]

 

\[caption id="attachment\_1951" align="alignnone" width="629"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-11.07.29.png) 메인 페이지로 가면 이전과 다르게 로그인이 된 것을 볼 수 있습니다.\[/caption\]

 

\[caption id="attachment\_1952" align="alignnone" width="578"\] ![](/assets/img/wp-content/uploads/2019/12/스크린샷-2019-12-10-오후-11.08.10.png) 회원 전용 글쓰기가 정상적으로 동작합니다.\[/caption\]
