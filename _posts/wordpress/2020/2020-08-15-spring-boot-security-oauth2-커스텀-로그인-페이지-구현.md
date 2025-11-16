---
title: "Spring Boot Security OAuth2: 커스텀 로그인 페이지 구현"
date: 2020-08-15
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "스프링시큐리티"
---

\[rcblock id="2655"\]

스프링 부트 시큐리티 Spring Boot Security OAuth2: 커스텀 로그인 페이지 구현

**출처 및 참고글**

- [Baeldung - 스프링 부트 OAuth 커스텀 로그인 페이지 만들기](https://www.baeldung.com/spring-security-5-oauth2-login#1-custom-login-page) (영문)
- [스프링 부트(Spring Boot): 구글 로그인 연동 (스프링 부트 스타터의 oauth2-client) 이용 + 네이버](http://yoonbumtae.com/?p=2652)
- [Spring Boot: 시큐리티(Security) – 2 – 커스텀 로그인 페이지 만들기](http://yoonbumtae.com/?p=1184)

 

OAuth 2.0으로 외부 로그인을 구현한 상태에서 아무 설정도 하지 않은 기본 로그인 페이지(`"/login"`)는 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-am-11.42.48.png)

 

이 페이지를 커스터마이징 해보겠습니다.

 

##### **1) SecurityConfig 설정 변경**

```
package com.example.awsboard.config.auth;

import com.example.awsboard.domain.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .headers().frameOptions().disable()

            .and()
                .authorizeRequests()
                .antMatchers("/login").permitAll()
                // .............
                .anyRequest().authenticated()

            .and()
                .oauth2Login().loginPage("/login")

            .and()
                .logout().logoutSuccessUrl("/")

            .and()
                .oauth2Login().userInfoEndpoint().userService(customOAuth2UserService);

    }

}

```

- `.antMatchers("/login").permitAll()` - 커스텀 로그인 페이지를 만든 경우 권한을 수동으로 모두 접근 가능하도록 변경해야 합니다,
- `.oauth2Login().loginPage("/login")` - OAuth2 로그인 설정에서 로그인 페이지 URL을 수동으로 변경합니다. 여기서는 기존 URL과 동일한 URL을 사용합니다.

 

##### **2) LoginController 및 GetMapping 구현**

여기서는 모든 인증 서비스 정보(이름과 URL)를 스프링 시큐리티에서 가져와 모델에 담아 전송합니다, 하지만 이런 방법으로 구현하지 않더라도 서비스별 인증 URL을 미리 알고 있다면 자유롭게 만드는 것이 가능합니다. 예를 들어 기본적인 네이버 인증 URL과 구글 인증 URL은 다음과 같습니다.

- http://서버주소/oauth2/authorization/naver
- http://서버주소/oauth2/authorization/google

컨트롤러는 단순히 위 링크와 뷰 페이지만 리턴하도록 하고 이 주소를 바탕으로 HTML에 이미지 링크만 걸어 사용할 수도  있습니다.

```
package com.example.awsboard.web;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ResolvableType;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class LoginController {
 
    private static final String authorizationRequestBaseUri = "oauth2/authorization";
    Map<String, String> oauth2AuthenticationUrls = new HashMap<>();

    private final ClientRegistrationRepository clientRegistrationRepository;
    // Lombok 아닌 경우 (@RequiredArgsConstructor 없는 경우)
    // @Autowired private ClientRegistrationRepository clientRegistrationRepository;

    @SuppressWarnings("unchecked")
    @GetMapping("/login")
    public String getLoginPage(Model model) throws Exception {

        Iterable<ClientRegistration> clientRegistrations = null;
        ResolvableType type = ResolvableType.forInstance(clientRegistrationRepository)
                .as(Iterable.class);
        if (type != ResolvableType.NONE &&
                ClientRegistration.class.isAssignableFrom(type.resolveGenerics()[0])) {
            clientRegistrations = (Iterable<ClientRegistration>) clientRegistrationRepository;
        }

        assert clientRegistrations != null;
        clientRegistrations.forEach(registration ->
                oauth2AuthenticationUrls.put(registration.getClientName(),
                        authorizationRequestBaseUri + "/" + registration.getRegistrationId()));
        model.addAttribute("urls", oauth2AuthenticationUrls);
 
        return "auth/oauth-login";
    }
}
```

`ClientRegistrationRepository`를 가져오는 코드의 경우, 저는 롬복을 사용하고 있기 때문에 `private final`로 불러왔지만, 일반적인 경우라면 `@Autowired private` 를 사용합니다.

나머지 코드는 저도 자세히 모르기 때문에 복붙하였고, 마지막으로 View 주소를 리턴합니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-12.37.18.png)

 

##### **3) 뷰 페이지 구현 (oauth-login.html)**

```
<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>로그인 (Please sign in)</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
    <link href="https://getbootstrap.com/docs/4.0/examples/signin/signin.css" rel="stylesheet" crossorigin="anonymous"/>
</head>
<body>
<div class="container">
    <h2 class="form-signin-heading">로그인이 필요한 페이지입니다.</h2>
    <p>(Login with OAuth 2.0)</p>
    <p>외부 로그인 계정을 선택해주세요.</p>
    <table class="table table-striped" th:each="url : ${urls}">
        <tr>
            <td><a href="#" th:href="${url.value}" th:text="${url.key}">Naver</a></td>
        </tr>
    </table>
</div>
</body>
</html>
```

Thymeleaf를 사용하였습니다. `Map` 타입의 `urls` 변수에 담긴 키-값을 반복합니다. `url.key`는 서비스 이름, `url.value`는 링크 주소입니다.

 

바꾼 후 로그인 페이지에 접속하면 다음과 같이 바뀝니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-15-pm-12.43.02.png)
