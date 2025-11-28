---
title: "스프링 부트(Spring Boot): SPA에서 사용할 수 있는 OAuth2 소셜 로그인 (구글, 페이스북, 깃허브)"
date: 2020-08-31
categories: 
  - "DevLog"
  - "Spring/JSP"
---

원문 [바로가기1](https://www.callicoder.com/spring-boot-security-oauth2-social-login-part-1/) [바로가기2](https://www.callicoder.com/spring-boot-security-oauth2-social-login-part-2/)

원문에서는 프론트엔드 부분을 리액트로 설명하고 있는데, 저는 리액트를 사용하지 않아서 다음 글에서 Vue.js 로 대체해서 올리고, 이 글은 백엔드만 다루겠습니다.

일반 서버 사이드 렌더링에서 구글 로그인 연동하는 방법은 아래를 참조하세요.

- [스프링 부트(Spring Boot): 구글 로그인 연동 (스프링 부트 스타터의 oauth2-client) 이용 + 네이버](http://yoonbumtae.com/?p=2652)

* * *

 

안녕하세요, Spring Boot 소셜 로그인 튜토리얼 시리즈에 오신 것을 환영합니다. 이 튜토리얼에서는 Spring Security에서 제공하는 새로운 OAuth2 기능을 사용하여 Spring Boot 애플리케이션에 소셜 및 이메일 및 비밀번호 기반 로그인을 연동하는는 방법을 배우겠습니다.

MySQL 데이터베이스를 사용하여 사용자 정보를 저장하겠습니다.

 ![](/assets/img/wp-content/uploads/2020/08/spring-boot-oauth2-social-login-facebook-google-github.jpg)

> 코드만 원한다면, [Github](https://github.com/callicoder/spring-boot-react-oauth2-social-login-demo)를 방문하세요.

 

#### **프로젝트 생성**

Spring Initializr를 사용하여 프로젝트를 생성해 보겠습니다. [http://start.spring.io](http://start.spring.io)로 이동하여 다음과 같이 세부 정보를 입력하세요.

- **아티팩트(Artifact) -** `spring-social`
- **디펜던시(dependencies) -** `Spring Web`, `Spring Security`, `SpringData JPA`, `MySQL Driver`

나머지 필드는 기본값으로 두고 `Generate`를 클릭하여 프로젝트를 생성하고 다운로드 할 수 있습니다.

 

#### **전체 프로젝트의 디렉토리 구조**

다음은 참고용으로 전체 프로젝트의 디렉토리 구조입니다. 모든 클래스와 인터페이스를 하나씩 만들고 세부 사항을 알아봅니다.

 ![](/assets/img/wp-content/uploads/2020/08/spring-boot-oauth2-social-login-project-directory-structure.jpg)

 

#### **추가 디펜던시**

Spring Initializr 웹 도구에 없는 애플리케이션에 몇 가지 추가 디펜던시 추가해야합니다. 프로젝트의 루트 디렉터리에있는 `pom.xml` 파일을 열고 다음 디펜던시를 추가합니다. (`<dependencies>` 태그쌍 내에)

```
<!-- OAuth2 Client -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-client</artifactId>
</dependency>

<!-- JWT library -->
<dependency>
  <groupId>io.jsonwebtoken</groupId>
  <artifactId>jjwt</artifactId>
  <version>0.5.1</version>
</dependency>

```

 

#### **소셜 로그인을 위한 OAuth2 앱 만들기**

OAuth2 로그인을 지원하는 서비스를 통해 소셜 로그인을 사용하려면 OAuth2 제공 업체의 콘솔에서 앱을 만들고, 클라이언트 아이디(ClientId) 및 클라이언트 시크릿(ClientSecret) (AppId 및 AppSecret이라고도 함) 을 가져와야합니다.

OAuth2 공급자(provider)는 ClientId 및 ClientSecret을 사용하여 앱을 식별합니다. 공급자는 또한 아래 목록의 설정을 요구합니다.

- 승인된 리디렉션 URI - 사용자가 앱에 대한 권한을 부여/거부 한 후 리디렉션 될 수있는 유효한 리디렉션 URI 목록입니다. 리디렉션을 처리 할 앱의 엔드포인트(endpoint)를 지정해야 합니다.
- 범위(scope) - 범위는 사용자에게 데이터 액세스 권한을 요청하는 데 사용됩니다.

 

클라이언트 아이디, 시크릿 생성

- Facebook 앱 - [Facebook 앱 대시보드](https://developers.facebook.com/apps)에서 페이스 북 앱을 만들 수 있습니다.
- Github 앱 - Github 앱은 [https://github.com/settings/apps](https://github.com/settings/apps) 에서 만들 수 있습니다 .
- Google 프로젝트 -: [Google 개발자 콘솔](https://console.developers.google.com/)로 이동하여 Google 프로젝트와 OAuth2에 대한 자격 증명을 만듭니다.

 

> 이 문서의 목적 상 OAuth2 앱 생성은 필수가 아닙니다. 이미 Facebook, Google 및 Github 용 데모 앱을 깃허브에 만들었습니다. 데모 앱을 사용하여 소셜 로그인을 수행합니다.

 

#### **Spring Boot 애플리케이션 구성**

스프링 부트의 `src/main/resource/application.properties` 파일 기본적인 구성을 가져오빈다. 또한 `.yaml` 구성을 지원합니다. 이 프로젝트에서는 계층적 데이터를 보다 명확하게 나타내기 때문에 yaml 구성을 사용합니다.

```
spring:
    datasource:
        url: jdbc:mysql://localhost:3306/spring_social?useSSL=false&serverTimezone=UTC&useLegacyDatetimeCode=false
        username: root
        password: callicoder

    jpa:
        show-sql: true
        hibernate:
            ddl-auto: update
            naming-strategy: org.hibernate.cfg.ImprovedNamingStrategy
        properties:
            hibernate:
                dialect: org.hibernate.dialect.MySQL5InnoDBDialect
    security:
      oauth2:
        client:
          registration:
            google:
              clientId: 5014057553-8gm9um6vnli3cle5rgigcdjpdrid14m9.apps.googleusercontent.com
              clientSecret: tWZKVLxaD_ARWsriiiUFYoIk
              redirectUri: "{baseUrl}/oauth2/callback/{registrationId}"
              scope:
                - email
                - profile
            facebook:
              clientId: 121189305185277
              clientSecret: 42ffe5aa7379e8326387e0fe16f34132
              redirectUri: "{baseUrl}/oauth2/callback/{registrationId}" # Facebook은 이제 https 리디렉션 URI 사용을 요구하므로 앱이 프로덕션에서 https를 지원하는지 확인하세요.
              scope:
                - email
                - public_profile
            github:
              clientId: d3e47fc2ddd966fa4352
              clientSecret: 3bc0f6b8332f93076354c2a5bada2f5a05aea60d
              redirectUri: "{baseUrl}/oauth2/callback/{registrationId}"
              scope:
                - user:email
                - read:user
          provider:
            facebook:
              authorizationUri: https://www.facebook.com/v3.0/dialog/oauth
              tokenUri: https://graph.facebook.com/v3.0/oauth/access_token
              userInfoUri: https://graph.facebook.com/v3.0/me?fields=id,first_name,middle_name,last_name,name,email,verified,is_verified,picture.width(250).height(250)
app:
  auth:
    tokenSecret: 926D96C90030DD58429D2751AC1BDBBC
    tokenExpirationMsec: 864000000
  oauth2:
    # OAuth2 공급자로 성공적으로 인증 한 후 사용자에 대한 인증 토큰을 생성하고 토큰을
    # 프론트 엔드 클라이언트가 /oauth2/authorize 요청에서 지정한 redirectUri입니다.
    # 쿠키는 모바일 클라이언트에서 잘 작동하지 않기 때문에 사용하지 않습니다.
    authorizedRedirectUris:
      - http://localhost:3000/oauth2/redirect
      - myandroidapp://oauth2/redirect
      - myiosapp://oauth2/redirect
```

 

데이터 소스 구성은 MySQL 데이터베이스에 연결하는 데 사용됩니다. `spring_social`이라는 데이터베이스를 만들고 MySQL 설치에 따라 `spring.datasource.username` 및 `spring.datasource.password`에 대한 올바른 값을 지정하세요.

`security.oauth2` 구성은 모든 oauth2 공급자와 해당 세부 정보를 정의합니다. `app.auth` 구성은 사용자가 성공적으로 로그인 한 후 JWT 인증 토큰을 생성하는 데 사용됩니다.

등록된 모든 oauth2 공급자에서 `redirectUri` 속성을 사용합니다. 이러한 OAuth2 공급자 웹 사이트에서 앱을 만들 때 승인된 리디렉션 URI를 추가해야합니다. 예를 들어 Google 앱의 경우 authorizedRedirectURI에`http://localhost:8080/oauth2/callback/googl`e 을 추가해야 합니다.

 

#### **AppProperties 바인딩**

Spring Boot의 `@ConfigurationProperties` 기능을 사용하여 앱 접두사가 붙은 모든 구성을 POJO(Plain Old Java Object) 클래스에 바인딩해 보겠습니다.

```java
package com.example.springsocial.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private final Auth auth = new Auth();
    private final OAuth2 oauth2 = new OAuth2();

    public static class Auth {
        private String tokenSecret;
        private long tokenExpirationMsec;

        public String getTokenSecret() {
            return tokenSecret;
        }

        public void setTokenSecret(String tokenSecret) {
            this.tokenSecret = tokenSecret;
        }

        public long getTokenExpirationMsec() {
            return tokenExpirationMsec;
        }

        public void setTokenExpirationMsec(long tokenExpirationMsec) {
            this.tokenExpirationMsec = tokenExpirationMsec;
        }
    }

    public static final class OAuth2 {
        private List<String> authorizedRedirectUris = new ArrayList<>();

        public List<String> getAuthorizedRedirectUris() {
            return authorizedRedirectUris;
        }

        public OAuth2 authorizedRedirectUris(List<String> authorizedRedirectUris) {
            this.authorizedRedirectUris = authorizedRedirectUris;
            return this;
        }
    }

    public Auth getAuth() {
        return auth;
    }

    public OAuth2 getOauth2() {
        return oauth2;
    }
}
```

 

#### **AppProperties 활성화**

`@EnableConfigurationProperties` 어노테이션을 추가하여 구성 속성을 활성화(enable)해야 합니다. 메인 애플리케이션 클래스 `SpringSocialApplication.java`를 열고 다음과 같은 어노테이션을 추가하세요.

```java
package com.example.springsocial;

import com.example.springsocial.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class SpringSocialApplication {

  public static void main(String[] args) {
    SpringApplication.run(SpringSocialApplication.class, args);
  }
}
```

 

#### **CORS 활성화**

프론트엔드 클라이언트가 다른 출처의 API에 액세스 할 수 있도록 CORS를 활성화하겠습니다. 다음 구성에서 모든 origin을 활성화했습니다. 하지만 프로덕션 애플리케이션에서는 더 엄격하게 만들어야합니다.

```java
package com.example.springsocial.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final long MAX_AGE_SECS = 3600;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
        .allowedOrigins("*")
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(MAX_AGE_SECS);
    }
}
```

 

#### **데이터베이스 Entity 만들기**

이제 애플리케이션의 Entity 클래스를 만들어 보겠습니다. 다음은 `User` 클래스의 정의입니다.

```java
package com.example.springsocial.model;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Email
    @Column(nullable = false)
    private String email;

    private String imageUrl;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @JsonIgnore
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

    // Getters and Setters (생략)
}
```

 

`User` 클래스에는 인증 공급자에 대한 정보가 포함되어 있습니다. 다음은 `AuthProvider` enum의 정의입니다.

```java
package com.example.springsocial.model;

public enum  AuthProvider {
    local,
    facebook,
    google,
    github
}
```

 

<!-- \[the\_ad id="1801"\] -->

 

#### **DB에서 데이터에 액세스하기 위한 리포지토리(Repository) 만들기**

데이터베이스에서 데이터에 액세스하기 위한 리포지토리 계층을 만들어 보겠습니다. 다음 `UserRepository` 인터페이스는 사용자 엔티티에 대한 데이터베이스 기능을 제공합니다. [Spring-Data-JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/) 덕분에 여기에 많은 코드를 작성할 필요가 없습니다.

```java
package com.example.springsocial.repository;

import com.example.springsocial.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

}
```

 

* * *

 

#### **SecurityConfig**

\]SecurityConfig 클래스는 스프링 부트에서 보안 구현의 핵심입니다. 여기에는 OAuth2 소셜 로그인과 이메일 및 비밀번호 기반 로그인에 대한 구성이 포함되어 있습니다.

먼저 모든 구성을 살펴본 다음, 각 구성에 대한 세부 정보를 하나씩 살펴 보겠습니다.

```java
package com.example.springsocial.config;

import com.example.springsocial.security.*;
import com.example.springsocial.security.oauth2.CustomOAuth2UserService;
import com.example.springsocial.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import com.example.springsocial.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.example.springsocial.security.oauth2.OAuth2AuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        securedEnabled = true,
        jsr250Enabled = true,
        prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

    @Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    
    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter();
    }

    /*
      By default, Spring OAuth2 uses HttpSessionOAuth2AuthorizationRequestRepository to save
      the authorization request. But, since our service is stateless, we can't save it in
      the session. We'll save the request in a Base64 encoded cookie instead.
    */
    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }
    
    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                    .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                .csrf()
                    .disable()
                .formLogin()
                    .disable()
                .httpBasic()
                    .disable()
                .exceptionHandling()
                    .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                    .and()
                .authorizeRequests()
                    .antMatchers("/",
                        "/error",
                        "/favicon.ico",
                        "/**/*.png",
                        "/**/*.gif",
                        "/**/*.svg",
                        "/**/*.jpg",
                        "/**/*.html",
                        "/**/*.css",
                        "/**/*.js")
                        .permitAll()
                    .antMatchers("/auth/**", "/oauth2/**")
                        .permitAll()
                    .anyRequest()
                        .authenticated()
                    .and()
                .oauth2Login()
                    .authorizationEndpoint()
                        .baseUri("/oauth2/authorize")
                        .authorizationRequestRepository(cookieAuthorizationRequestRepository())
                        .and()
                    .redirectionEndpoint()
                        .baseUri("/oauth2/callback/*")
                        .and()
                    .userInfoEndpoint()
                        .userService(customOAuth2UserService)
                        .and()
                    .successHandler(oAuth2AuthenticationSuccessHandler)
                    .failureHandler(oAuth2AuthenticationFailureHandler);

        // Add our custom Token based authentication filter
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
```

위의 클래스는 기본적으로 서로 다른 구성 요소를 연결하여 응용 프로그램 전체의 보안 정책을 결정합니다.

 



 

#### **OAuth2 로그인 흐름**

- OAuth2 로그인 흐름은 사용자 측의 브라우저에서 엔드포인트 `http://localhost:8080/oauth2/authorize/{provider}?redirect_uri=<redirect_uri_after_login>` 로 접속하는 것으로 프론트엔드 클라이언트에서 시작됩니다.
- `provider` 경로 매개 변수는 `google`, `facebook` 또는 `github` 중 하나입니다. `redirect_uri`는 OAuth2  인증이 성공하면 사용자 측에서 리디렉션되는 URI입니다. 이것은 OAuth2 redirectUri와 다릅니다.
- 인증 요청을 받으면 Spring Security의 OAuth2 클라이언트는 사용자를 제공된 `provider`의 `AuthorizationUrl`로 리디렉션 시킵니다.
- 권한 요청과 관련된 모든 상태는 SecurityConfig에 지정된 `authorizationRequestRepository`를 사용하여 저장됩니다.
- 이제 사용자는 공급자 페이지에서 앱에 대한 권한을 허용/거부합니다. 사용자가 앱에 대한 권한을 허용하면 공급자는 사용자를 인증 코드와 함께 콜백 URL `http://localhost:8080/oauth2/callback/{provider}`로 리디렉션합니다. 사용자가 권한을 거부하면 동일한 callbackUrl로 리디렉션되지만 `error`가 발생합니다.
- OAuth2 콜백으로 인해 오류가 발생하면 스프링 시큐리티는 위의 `SecurityConfig`에 지정된 `oAuth2AuthenticationFailureHandler`를 호출합니다.
- OAuth2 콜백이 성공하고 인증 코드가 포함 된 경우 Spring Security는 `access_token`에 대한 `authorization_code`를 교환하고 `SecurityConfig`에 지정된 `customOAuth2UserService`를 호출합니다.
- `customOAuth2UserService`는 인증된 사용자의 세부 정보를 검색하고 데이터베이스에 새 항목을 작성하거나 동일한 이메일의 정보를 찾아 기존 항목을 업데이트합니다.
- 마지막으로 `oAuth2AuthenticationSuccessHandler`가 호출됩니다. 사용자에 대한 JWT 인증 토큰을 만들고 쿼리 문자열의 JWT 토큰과 함께 사용자를 `redirect_uri`로 보냅니다.

 

#### **OAuth2 인증을위한 사용자 정의 클래스**

##### **1\. HttpCookieOAuth2AuthorizationRequestRepository**

OAuth2 프로토콜은 CSRF 공격을 방지하기 위해 `state` 매개 변수 사용을 권장합니다. 인증 중에 애플리케이션은 인증 요청에서 이 매개 변수를 전송하고, OAuth2 공급자는 OAuth2 콜백에서 변경되지 않은 이 매개 변수를 리턴합니다.

응용 프로그램은 OAuth2 공급자에서 반환 된 `state` 매개 변수의 값을 초기에 보낸 값과 비교합니다. 일치하지 않으면 인증 요청을 거부합니다.

이 흐름을 얻으려면 애플리케이션이 나중에 OAuth2 공급자에서 반환된 상태와 비교할 수 있도록 `state` 매개 변수를 어딘가에 저장해야합니다.

단기(short-lived) 쿠키에 상태와 `redirect_uri`를 저장할 것입니다. 다음 클래스는 인증 요청을 쿠키에 저장하고 검색하는 기능을 제공합니다.

```java
package com.example.springsocial.security.oauth2;

import com.example.springsocial.util.CookieUtils;
import com.nimbusds.oauth2.sdk.util.StringUtils;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class HttpCookieOAuth2AuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    public static final String OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME = "oauth2_auth_request";
    public static final String REDIRECT_URI_PARAM_COOKIE_NAME = "redirect_uri";
    private static final int cookieExpireSeconds = 180;

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return CookieUtils.getCookie(request, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME)
                .map(cookie -> CookieUtils.deserialize(cookie, OAuth2AuthorizationRequest.class))
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            CookieUtils.deleteCookie(request, response, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
            CookieUtils.deleteCookie(request, response, REDIRECT_URI_PARAM_COOKIE_NAME);
            return;
        }

        CookieUtils.addCookie(response, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME, CookieUtils.serialize(authorizationRequest), cookieExpireSeconds);
        String redirectUriAfterLogin = request.getParameter(REDIRECT_URI_PARAM_COOKIE_NAME);
        if (StringUtils.isNotBlank(redirectUriAfterLogin)) {
            CookieUtils.addCookie(response, REDIRECT_URI_PARAM_COOKIE_NAME, redirectUriAfterLogin, cookieExpireSeconds);
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request) {
        return this.loadAuthorizationRequest(request);
    }

    public void removeAuthorizationRequestCookies(HttpServletRequest request, HttpServletResponse response) {
        CookieUtils.deleteCookie(request, response, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME);
        CookieUtils.deleteCookie(request, response, REDIRECT_URI_PARAM_COOKIE_NAME);
    }
}
```

 

<!-- \[the\_ad id="1801"\] -->

 

##### **2\. CustomOAuth2UserService**

`CustomOAuth2UserService`는 Spring Security의 `DefaultOAuth2UserService`를 상속받고 `loadUser()` 메소드를 구현합니다. 이 메서드는 OAuth2 공급자로부터 액세스 토큰을 얻은 후에 호출됩니다.

이 방법에서는 먼저 OAuth2 제공 업체에서 사용자의 세부 정보를 가져옵니다. 동일한 이메일을 사용하는 사용자가 이미 데이터베이스에 있으면 세부 정보를 업데이트하고, 그렇지 않으면 새 사용자를 등록합니다.

```java
package com.example.springsocial.security.oauth2;

import com.example.springsocial.exception.OAuth2AuthenticationProcessingException;
import com.example.springsocial.model.AuthProvider;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.UserRepository;
import com.example.springsocial.security.UserPrincipal;
import com.example.springsocial.security.oauth2.user.OAuth2UserInfo;
import com.example.springsocial.security.oauth2.user.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        if(StringUtils.isEmpty(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if(userOptional.isPresent()) {
            user = userOptional.get();
            if(!user.getProvider().equals(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getProvider() + " account. Please use your " + user.getProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        user.setProvider(AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId()));
        user.setProviderId(oAuth2UserInfo.getId());
        user.setName(oAuth2UserInfo.getName());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setImageUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(user);
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setName(oAuth2UserInfo.getName());
        existingUser.setImageUrl(oAuth2UserInfo.getImageUrl());
        return userRepository.save(existingUser);
    }

}
```

 

##### **3\. OAuth2UserInfo mapping**

모든 OAuth2 공급자는 인증된 사용자의 세부 정보를 가져올 때 다른 JSON 응답을 반환합니다. 스프링 시큐리니튼 키-값 쌍의 일반 `Map` 형식으로 응답을 구문 분석합니다.

다음 클래스는 키-값 쌍의 일반 `Map`에서 사용자의 필수 세부 사항을 가져오는 데 사용됩니다.

 

**OAuth2UserInfo**

```java
package com.example.springsocial.security.oauth2.user;

import java.util.Map;

public abstract class OAuth2UserInfo {
    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public abstract String getId();

    public abstract String getName();

    public abstract String getEmail();

    public abstract String getImageUrl();
}
```

 

**FacebookOAuth2UserInfo**

```java
package com.example.springsocial.security.oauth2.user;

import java.util.Map;

public class FacebookOAuth2UserInfo extends OAuth2UserInfo {
    public FacebookOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        if(attributes.containsKey("picture")) {
            Map<String, Object> pictureObj = (Map<String, Object>) attributes.get("picture");
            if(pictureObj.containsKey("data")) {
                Map<String, Object>  dataObj = (Map<String, Object>) pictureObj.get("data");
                if(dataObj.containsKey("url")) {
                    return (String) dataObj.get("url");
                }
            }
        }
        return null;
    }
}
```

 

**GoogleOAuth2UserInfo**

```java
package com.example.springsocial.security.oauth2.user;

import java.util.Map;

public class GoogleOAuth2UserInfo extends OAuth2UserInfo {

    public GoogleOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("sub");
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("picture");
    }
}

```

 

**GithubOAuth2UserInfo**

```java
package com.example.springsocial.security.oauth2.user;

import java.util.Map;

public class GithubOAuth2UserInfo extends OAuth2UserInfo {

    public GithubOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return ((Integer) attributes.get("id")).toString();
    }

    @Override
    public String getName() {
        return (String) attributes.get("name");
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("avatar_url");
    }
}
```

 

**OAuth2UserInfoFactory**

```java
package com.example.springsocial.security.oauth2.user;

import com.example.springsocial.exception.OAuth2AuthenticationProcessingException;
import com.example.springsocial.model.AuthProvider;

import java.util.Map;

public class OAuth2UserInfoFactory {

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId, Map<String, Object> attributes) {
        if(registrationId.equalsIgnoreCase(AuthProvider.google.toString())) {
            return new GoogleOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase(AuthProvider.facebook.toString())) {
            return new FacebookOAuth2UserInfo(attributes);
        } else if (registrationId.equalsIgnoreCase(AuthProvider.github.toString())) {
            return new GithubOAuth2UserInfo(attributes);
        } else {
            throw new OAuth2AuthenticationProcessingException("Sorry! Login with " + registrationId + " is not supported yet.");
        }
    }
}
```

 



 

##### **4\. OAuth2AuthenticationSuccessHandler**

인증이 성공하면 스프링 시큐리티는 `SecurityConfig`에 구성된 `OAuth2AuthenticationSuccessHandler`의 `onAuthenticationSuccess()` 메소드를 호출합니다.

이 메서드에서는 몇 가지 유효성 검사를 수행하고, JWT 인증 토큰을 만들고, 쿼리 문자열에 추가 된 JWT 토큰을 사용하여 클라이언트가 지정한 `redirect_uri`로 사용자를 리디렉션합니다.

```java
package com.example.springsocial.security.oauth2;

import com.example.springsocial.config.AppProperties;
import com.example.springsocial.exception.BadRequestException;
import com.example.springsocial.security.TokenProvider;
import com.example.springsocial.util.CookieUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.util.Optional;

import static com.example.springsocial.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private TokenProvider tokenProvider;

    private AppProperties appProperties;

    private HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Autowired
    OAuth2AuthenticationSuccessHandler(TokenProvider tokenProvider, AppProperties appProperties,
                                       HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository) {
        this.tokenProvider = tokenProvider;
        this.appProperties = appProperties;
        this.httpCookieOAuth2AuthorizationRequestRepository = httpCookieOAuth2AuthorizationRequestRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        Optional<String> redirectUri = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue);

        if(redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            throw new BadRequestException("Sorry! We've got an Unauthorized Redirect URI and can't proceed with the authentication");
        }

        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());

        String token = tokenProvider.createToken(authentication);

        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", token)
                .build().toUriString();
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        URI clientRedirectUri = URI.create(uri);

        return appProperties.getOauth2().getAuthorizedRedirectUris()
                .stream()
                .anyMatch(authorizedRedirectUri -> {
                    // Only validate host and port. Let the clients use different paths if they want to
                    URI authorizedURI = URI.create(authorizedRedirectUri);
                    if(authorizedURI.getHost().equalsIgnoreCase(clientRedirectUri.getHost())
                            && authorizedURI.getPort() == clientRedirectUri.getPort()) {
                        return true;
                    }
                    return false;
                });
    }
}
```

 

##### **5\. OAuth2AuthenticationFailureHandler**

OAuth2 인증 중 오류가 발생하면 Spring Security는 `SecurityConfig`에서 구성한 `OAuth2AuthenticationFailureHandler`의 `onAuthenticationFailure()` 메서드를 호출합니다.

쿼리 문자열에 추가된 오류 메시지와 함께 사용자를 프론트엔드 클라이언트로 보냅니다.

```java
package com.example.springsocial.security.oauth2;

import com.example.springsocial.util.CookieUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.example.springsocial.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String targetUrl = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .map(Cookie::getValue)
                .orElse(("/"));

        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();

        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
```

 

<!-- \[the\_ad id="1801"\] -->

 

#### **이메일 기반 인증을 위한 컨트롤러 및 서비스**

이제 이메일 및 비밀번호 기반의 로그인을 처리하기위한 컨트롤러와 서비스를 살펴 보겠습니다.

 

##### **1\. AuthController**

```java
package com.example.springsocial.controller;

import com.example.springsocial.exception.BadRequestException;
import com.example.springsocial.model.AuthProvider;
import com.example.springsocial.model.User;
import com.example.springsocial.payload.ApiResponse;
import com.example.springsocial.payload.AuthResponse;
import com.example.springsocial.payload.LoginRequest;
import com.example.springsocial.payload.SignUpRequest;
import com.example.springsocial.repository.UserRepository;
import com.example.springsocial.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.createToken(authentication);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        // Creating user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword());
        user.setProvider(AuthProvider.local);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/user/me")
                .buildAndExpand(result.getId()).toUri();

        return ResponseEntity.created(location)
                .body(new ApiResponse(true, "User registered successfully@"));
    }

}

```

 

##### **2\. CustomUserDetailsService**

```java
package com.example.springsocial.security;

import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email : " + email)
        );

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new ResourceNotFoundException("User", "id", id)
        );

        return UserPrincipal.create(user);
    }
}

```

 

#### **JWT Token provider, Authentication Filter, Authentication error handler, and UserPrincipal**

##### **TokenProvider**

이 클래스에는 Json 웹 토큰을 생성하고 인증(verify)하는 코드가 포함되어 있습니다.

```java
package com.example.springsocial.security;

import com.example.springsocial.config.AppProperties;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(TokenProvider.class);

    private AppProperties appProperties;

    public TokenProvider(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String createToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + appProperties.getAuth().getTokenExpirationMsec());

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, appProperties.getAuth().getTokenSecret())
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(appProperties.getAuth().getTokenSecret())
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}
```

 

##### **TokenAuthenticationFilter**

이 클래스는 리퀘스트에서 JWT 인증 토큰을 읽어 인증(verify)하고, 토큰이 유효한 경우 Spring Security의 `SecurityContext`를 설정하는 데 사용됩니다.

```java
package com.example.springsocial.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    private static final Logger logger = LoggerFactory.getLogger(TokenAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                Long userId = tokenProvider.getUserIdFromToken(jwt);

                UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
}
```

 

<!-- \[the\_ad id="1801"\] -->

 

##### **RestAuthenticationEntryPoint**

이 클래스는 사용자가 인증없이 보안된 리소스에 액세스하려고 할 때 호출됩니다. 이 경우 `401 Unauthorized` 응답만 반환합니다.

```java
package com.example.springsocial.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(RestAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest httpServletRequest,
                         HttpServletResponse httpServletResponse,
                         AuthenticationException e) throws IOException, ServletException {
        logger.error("Responding with unauthorized error. Message - {}", e.getMessage());
        httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                e.getLocalizedMessage());
    }
}
```

 

##### **UserPrincipal**

`UserPrincipal` 클래스는 인증된 스프링 시큐리티의 principal(본인의 정보)를 나타냅니다. 인증된 사용자의 세부 사항을 포함합니다.

```java
package com.example.springsocial.security;

import com.example.springsocial.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class UserPrincipal implements OAuth2User, UserDetails {
    private Long id;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private Map<String, Object> attributes;

    public UserPrincipal(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = Collections.
                singletonList(new SimpleGrantedAuthority("ROLE_USER"));

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }

    public static UserPrincipal create(User user, Map<String, Object> attributes) {
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        userPrincipal.setAttributes(attributes);
        return userPrincipal;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getName() {
        return String.valueOf(id);
    }
}
```

 

##### **CurrentUser 메타 어노테이션**

현재 인증된 사용자의 principald을 컨트롤러에 삽입하는 데 사용할 수있는 [메타 어노테이션](https://lng1982.tistory.com/89)입니다.

```java
package com.example.springsocial.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.lang.annotation.*;

@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentUser {

}
```

 

#### **UserController - User APIs**

`UserController` 클래스에는 현재 인증된 사용자의 세부 정보를 가져 오는 보호된(protected) API가 포함되어 있습니다.

```java
package com.example.springsocial.controller;

import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.model.User;
import com.example.springsocial.repository.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
}
```

 

<!-- \[the\_ad id="1801"\] -->

 

#### **유틸리티 클래스**

이 프로젝트는 일부 유틸리티 클래스를 사용하여 다양한 작업을 수행합니다.

##### **CookieUtils**

```java
package com.example.springsocial.util;

import org.springframework.util.SerializationUtils;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Base64;
import java.util.Optional;

public class CookieUtils {

    public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null && cookies.length > 0) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return Optional.of(cookie);
                }
            }
        }

        return Optional.empty();
    }

    public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    public static void deleteCookie(HttpServletRequest request, HttpServletResponse response, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            for (Cookie cookie: cookies) {
                if (cookie.getName().equals(name)) {
                    cookie.setValue("");
                    cookie.setPath("/");
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                }
            }
        }
    }

    public static String serialize(Object object) {
        return Base64.getUrlEncoder()
                .encodeToString(SerializationUtils.serialize(object));
    }

    public static <T> T deserialize(Cookie cookie, Class<T> cls) {
        return cls.cast(SerializationUtils.deserialize(
                        Base64.getUrlDecoder().decode(cookie.getValue())));
    }
}
```

 

#### **리퀘스트/리스폰스 Payload(전송되는 데이터)**

다음 리퀘스트/리스폰스 [페이로드](https://ko.wikipedia.org/wiki/%ED%8E%98%EC%9D%B4%EB%A1%9C%EB%93%9C_\(%EC%BB%B4%ED%93%A8%ED%8C%85\))는 컨트롤러 API에서 사용됩니다.

 

##### **1\. LoginRequest**

```java
package com.example.springsocial.payload;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    // Getters and Setters (Omitted for brevity)    
}
```

 

##### **2. SignUpRequest**

```java
package com.example.springsocial.payload;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class SignUpRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    // Getters and Setters (Omitted for brevity)    
}

```

 

##### **3\. AuthResponse**

```java
package com.example.springsocial.payload;

public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    public AuthResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    // Getters and Setters (Omitted for brevity)
}
```

 

##### **4.ApiResponse**

```java
package com.example.springsocial.payload;

public class ApiResponse {
    private boolean success;
    private String message;

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters (Omitted for brevity)
}
```

 

#### **예외 클래스**

다음 예외 클래스는 다양한 오류 사례에 대해 애플리케이션 전체에서 사용됩니다.

 

##### **1\. BadRequestExceotion**

```java
package com.example.springsocial.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

 

##### **2. ResourceNotFoundException**

```java
package com.example.springsocial.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    private String resourceName;
    private String fieldName;
    private Object fieldValue;

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Object getFieldValue() {
        return fieldValue;
    }
}
```

 

##### **3. OAuth2AuthenticationProcessingException**

```java
package com.example.springsocial.exception;

import org.springframework.security.core.AuthenticationException;

public class OAuth2AuthenticationProcessingException extends AuthenticationException {
    public OAuth2AuthenticationProcessingException(String msg, Throwable t) {
        super(msg, t);
    }

    public OAuth2AuthenticationProcessingException(String msg) {
        super(msg);
    }
}
```

 

이 글에서 많은 것을 다뤘습니다. 코드가 너무 많아서 부담이 되지 않았으면 합니다. [공식 문서](https://docs.spring.io/spring-security/site/docs/current/reference/htmlsingle/#oauth2login)에서 Spring Security의 OAuth2 로그인에 대해 자세히 알아볼 수 있습니다.
