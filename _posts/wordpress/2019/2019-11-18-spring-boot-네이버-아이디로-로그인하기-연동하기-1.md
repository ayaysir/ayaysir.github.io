---
title: "Spring Boot: \"네이버 아이디로 로그인하기\" 연동하기 (1)"
date: 2019-11-18
categories: 
  - "DevLog"
  - "Spring/JSP"
---

깃허브에서 전체 코드 보기 - [https://github.com/ayaysir/spring-boot-security-example-1](https://github.com/ayaysir/spring-boot-security-example-1)

 

- [네이버 개발자 센터: 네이버 아이디로 로그인하기 튜토리얼](https://developers.naver.com/docs/login/web/#1-6-1--%EC%82%AC%EC%9A%A9%EC%9E%90-%ED%94%84%EB%A1%9C%ED%95%84-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C-%EC%9A%94%EC%B2%AD-url)
- [네이버 개발자 센터: 네이버 아이디로 로그인하기 API](https://developers.naver.com/docs/login/api/)

 

#### **1\. API 신청**

네이버로 로그인한 후, 개발자 센터의 [애플리케이션 신청 페이지](https://developers.naver.com/apps/#/register)에 가서 애플리케이션을 신청합니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-19-오전-3.20.53.png)

애플리케이션 이름을 입력한 뒤 사용 API를 네아로 (네이버 아이디로 로그인) 을 선택하고, 제공 정보 선택에 사용할 정보를 선택합니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-19-오전-3.21.25.png)

서비스 환경에서 PC웹 또는 모바일 웹을 선택하고 서비스 URL에 메인 페이지 주소를, Callback URL에 콜백에 사용할 URL을 등록합니다. URL은 수정 가능하므로 아직 정해지지 않았더라도 형식에 맞게 입력하면 됩니다.

 

#### **2\. 애플리케이션 정보의 클라이언트 아이디 확인**

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-19-오전-3.25.23.png)

등록되었으면 내 애플리케이션 정보 메뉴에서 클라이언트 아이디와 비밀 키를 확인합니다. 네아로 검수요청은 정식 서비스를 개시할 때 필요하고 개발단계에서는 아직 진행하지 않아도 됩니다.

 

#### **3\. 서버 사이드 코드 작성**

동작 원리는 다음과 같습니다.

- 클라이언트 키, 콜백 URL을 포함한 로그인 기능 요청을 네이버 측으로 전송
- 네이버에서 클라이언트 키와 콜백 URL이 유효함을 확인하면 네이버에서 접근 토큰, 갱신 토큰, 유효 시간 정보를 전송(response)함
- 네이버에서 받은 접근 토큰을 이용해 회원 정보를 요청하는 API를 이용하여 회원정보를 가져옴

![](./assets/img/wp-content/uploads/2019/11/615FC658-A847-4A35-8A54-64E28B2AF3D1.png)

```
package com.springboot.security;

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
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.json.JSONParser;
import org.apache.tomcat.util.json.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class NaverLoginController {

  private String CLIENT_ID = "***********"; //애플리케이션 클라이언트 아이디값";
  private String CLI_SECRET = "**********"; //애플리케이션 클라이언트 시크릿값";
  
  
  /**
   * 로그인 화면이 있는 페이지 컨트롤
   * @param session
   * @param model
   * @return
   * @throws UnsupportedEncodingException
   * @throws UnknownHostException 
   */
  @RequestMapping("/naver")
  public String testNaver(HttpSession session, Model model) throws UnsupportedEncodingException, UnknownHostException {

    String redirectURI = URLEncoder.encode("http://localhost:8080/naver/callback1", "UTF-8");

    SecureRandom random = new SecureRandom();
    String state = new BigInteger(130, random).toString();
    String apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
    apiURL += String.format("&client_id=%s&redirect_uri=%s&state=%s",
        CLIENT_ID, redirectURI, state);
    session.setAttribute("state", state);

    model.addAttribute("apiURL", apiURL);
    return "test-naver";
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
    String redirectURI = URLEncoder.encode("http://localhost:8080/naver/callback1", "UTF-8");

    String apiURL;
    apiURL = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&";
    apiURL += "client_id=" + CLIENT_ID;
    apiURL += "&client_secret=" + CLI_SECRET;
    apiURL += "&redirect_uri=" + redirectURI;
    apiURL += "&code=" + code;
    apiURL += "&state=" + state;
    System.out.println("apiURL=" + apiURL);

    String res = requestToServer(apiURL);
    if(res != null && !res.equals("")) {
      model.addAttribute("res", res);
      Map<String, Object> parsedJson = new JSONParser(res).parseObject();
      System.out.println(parsedJson);
      session.setAttribute("currentUser", res);
      session.setAttribute("currentAT", parsedJson.get("access_token"));
      session.setAttribute("currentRT", parsedJson.get("refresh_token"));
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
  @RequestMapping("/naver/refreshToken")
  public String refreshToken(HttpSession session, HttpServletRequest request, Model model, String refreshToken) throws IOException, ParseException {

    String apiURL;

    apiURL = "https://nid.naver.com/oauth2.0/token?grant_type=refresh_token&";
    apiURL += "client_id=" + CLIENT_ID;
    apiURL += "&client_secret=" + CLI_SECRET;
    apiURL += "&refresh_token=" + refreshToken;

    System.out.println("apiURL=" + apiURL);

    String res = requestToServer(apiURL);
    model.addAttribute("res", res);
    session.invalidate();
    return "test-naver-callback";
  }

  /**
   * 토큰 삭제 컨트롤러
   * @param session
   * @param request
   * @param model
   * @param accessToken
   * @return
   * @throws IOException
   */
  @RequestMapping("/naver/deleteToken")
  public String deleteToken(HttpSession session, HttpServletRequest request, Model model, String accessToken) throws IOException {

    String apiURL;

    apiURL = "https://nid.naver.com/oauth2.0/token?grant_type=delete&";
    apiURL += "client_id=" + CLIENT_ID;
    apiURL += "&client_secret=" + CLI_SECRET;
    apiURL += "&access_token=" + accessToken;
    apiURL += "&service_provider=NAVER";

    System.out.println("apiURL=" + apiURL);

    String res = requestToServer(apiURL);
    model.addAttribute("res", res);
    session.invalidate();
    return "test-naver-callback";
  }

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
  @RequestMapping("/naver/invalidate")
  public String invalidateSession(HttpSession session) {
    session.invalidate();
    return "redirect:/naver";
  }

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

토큰 갱신 요청을 하면 액세스 토큰과 리프레시 토큰이 갱신됩니다. 토큰 삭제 요청을 하면 네이버 아이디와 사이트와의 연결이 끊어집니다. (사이트 탈퇴와 같은 효과)

변하지 않는 **고유 정보**로는 회원 정보를 가져올 때 숫자로 된 `id` 값이 있습니다. 이것을 기준으로 하여 데이터베이스의 회원 정보와 연결하면 됩니다.

 

#### **4\. 뷰 페이지 작성 (Thymeleaf 사용)**

```
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org">
<head>
<meta charset="UTF-8">
<title>네이버 아이디로 로그인</title>
<style>
  pre{
    overflow: scroll;
  }
</style>
</head>
<body>
  <div th:if="${session.currentUser eq null}">
    <h3>네이버 로그인</h3>
    <a th:href="${apiURL}"><img height="50" src="http://static.nid.naver.com/oauth/small_g_in.PNG"/></a>
  </div>
  
  <div th:if="${session.currentUser ne null}">
    <h3>이 부분은 로그인한 사용자한테만 보임</h3>
    <pre th:text="${session.currentUser}"></pre>
    <a th:href="${'/naver/getProfile?accessToken=' + session.currentAT}">Get User's Profile</a>
    <a th:href="${'/naver/refreshToken?refreshToken=' + session.currentRT}">Refresh Token</a>
    <a th:href="${'/naver/deleteToken?accessToken=' + session.currentAT}">Delete Token</a>
    <a href="/naver/invalidate">로그아웃 (Invalidate Session)</a>
  </div>
  
</body>
</html>
```

```
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org">
<head>
<meta charset="UTF-8">
<title>Callback</title>
<style>
  pre{
    overflow: scroll;
  }
</style>
</head>
<body>
  <h1>콜백 페이지</h1>
  <pre th:text="${res}"></pre>
  <a href="/naver">go to main page</a>
</body>
</html>
```

 

#### **5\. 테스트**

\[caption id="attachment\_1825" align="alignnone" width="325"\]![](./assets/img/wp-content/uploads/2019/11/-2019-11-19-오전-4.09.13-e1574104916922.png) 로그인 전의 첫화면입니다.\[/caption\]

 

\[caption id="attachment\_1827" align="alignnone" width="513"\]![](./assets/img/wp-content/uploads/2019/11/-2019-11-19-오전-2.27.44-1-e1574105015629.png) 이전에 연동한 적이 없다면 연동 동의 여부를 묻는 화면이 뜹니다. 이미 연동된 경우, 로그인됩니다.\[/caption\]

 

\[caption id="attachment\_1823" align="alignnone" width="399"\]![](./assets/img/wp-content/uploads/2019/11/-2019-11-19-오전-3.01.36-e1574105130632.png) API에서 설정한 콜백 페이지입니다.\[/caption\]

 

\[caption id="attachment\_1826" align="alignnone" width="599"\]![](./assets/img/wp-content/uploads/2019/11/-2019-11-19-오전-4.09.36-e1574105191467.png) 로그인 후 첫화면입니다.\[/caption\]

 

\[caption id="attachment\_1824" align="alignnone" width="729"\]![](./assets/img/wp-content/uploads/2019/11/-2019-11-19-오전-3.02.37-e1574105247529.png) 회원정보를 가져오는 화면입니다. 여기서 `id`가 회원의 고유값입니다.\[/caption\]

 

다음에는 획득한 로그인 정보를 내 서버의 데이터베이스와 연동하는 방법에 대해 알아보겠습니다.
