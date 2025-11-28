---
title: "스프링 부트(Spring Boot): 구글 로그인 연동 (스프링 부트 스타터의 oauth2-client) 이용 + 네이버 아이디로 로그인"
date: 2020-07-13
categories: 
  - "DevLog"
  - "Spring/JSP"
---

<!-- \[rcblock id="2655"\] -->

 

이 방법은 JSTL, Thymeleaf, Mustache 등 서버 사이드 템플릿 엔진을 사용하는 로그인 방법입니다. SPA에서 사용할 수 있는 소셜 로그인 연동 방법은 아래 글을 참고하세요,

- [스프링 부트(Spring Boot): SPA에서 사용할 수 있는 OAuth2 소셜 로그인 (구글, 페이스북, 깃허브)](/posts/%EC%8A%A4%ED%94%84%EB%A7%81-%EB%B6%80%ED%8A%B8spring-boot-spa%EC%97%90%EC%84%9C-%EC%82%AC%EC%9A%A9%ED%95%A0-%EC%88%98-%EC%9E%88%EB%8A%94-oauth2-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8/)

## **순서**

1. `build.gradle`에 디펜던시 추가
2. `application-oauth.properties` 작성 + `.gitignore` 등록
3. `Role` enum 클래스 작성 - 사용자 권한 관리
4. `User` 클래스 작성 - JPA Entity 클래스
5. `OAuthAttributes` 클래스 작성 - 구글 로그인 이후 가져온 사용자의 이메일, 이름, 프로필 사진 주소 를 저장하는 DTO
6. `CustomOAuth2UserService` 클래스 작성 - `OAuthAttributes`을 기반으로 가입 및 정보수정, 세션 저장 등 기능 수행
7. `SecurityConfig` 클래스 작성 - 스프링 시큐리티 설정
8. `SessionUser` 클래스 작성 - User 엔티티 클래스에서 직렬화가 필요한 경우 별도로 사용
9. `IndexController` 작성, Thymeleaf 뷰 페이지 작성

 

스프링 부트 및 기타 기능들을 이용해 구글 로그인 연동을 하는 방법입니다. 그리고 마지막에 부수 결과로 네이버 연동도 해보겠습니다.

깃허브 주소: [https://github.com/ayaysir/awsboard](https://github.com/ayaysir/awsboard) (깃허브 내용은 나중에 변경될 수 있습니다.)

 

## **프로젝트 구조**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-5.55.34.png)

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-6.42.36.png)


## **절차**

먼저 구글로부터 **클라이언트 아이디와 비밀번호**를 받아야 합니다.

- 관련 글: [구글 OAuth2 연동용 클라이언트 아이디 및 비밀번호 발급받는 방법](/posts/구글-oauth2-연동용-클라이언트-아이디-및-비밀번호-발급)

 

### **1) build.gradle에 디펜던시 추가**

```java
// security + oauth2
implementation 'org.springframework.boot:spring-boot-starter-security'
implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
```

 



 

### **2) application-oauth.properties 작성 + .gitignore 등록**

위치는 _**application.properties**_가 있는 위치와 동일한 곳에 작성합니다. **_application-oauth.properties_** 작성 후, **_application.properties_** 파일에 등록해야 합니다.

그리고 비밀번호가 있으므로 Git을 사용한다면 이것이 커밋되지 않도록 _**.gitignore**_ 파일에 추가해야 합니다.

 

#### **application-oauth.properties**

```conf
spring.security.oauth2.client.registration.google.client-id=[클라이언트 아이디]
spring.security.oauth2.client.registration.google.client-secret=[클라이언트 비밀번호]
spring.security.oauth2.client.registration.google.scope=profile,email

```

#### **application.properties**

```conf
#application-oauth.properties 로딩
spring.profiles.include=oauth
```

프로퍼티 파일명을 _**application-XXX.properties**_ 이런 식으로 지으면, 위에 처럼 `spring.profiles.include=XXX` 로 로딩할 수 있습니다.

 

 

### **3) Role enum 클래스 작성**

사용자의 권한을 `enum` 클래스로 만들어 관리합니다.

```java
package com.example.awsboard.domain.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    GUEST("ROLE_GUEST", "손님"),
    USER("ROLE_USER", "일반 사용자");

    private final String key;
    private final String title;
}
```

 



 

### **4) User 클래스 작성**

엔티티(`@Entity`) 클래스는 JPA를 통해 SQL을 사용하지 않고도 자바 코드 내에서 테이블을 생성할 수 있습니다.

```java
package com.example.awsboard.domain.user;

import com.example.awsboard.domain.BaseTimeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
public class User extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column
    private String picture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // Role: 직접 만드는 클래스

    @Builder
    public User(String name, String email, String picture, Role role) {
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.role = role;
    }

    public User update(String name, String picture) {
        this.name = name;
        this.picture = picture;

        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }

}

```

![User 엔티티 클래스를 통해 테이블을 만들었습니다.](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-6.27.12.png)   
*User 엔티티 클래스를 통해 테이블을 만들었습니다.*

 

#### **2021-10-17 추가: `UserRepository.java` 작성 (`findByEmail`은 나중에 사용됩니다.)**

```java
package com.example.awsboard.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

 

#### **참고: `BaseTimeEntity` 클래스 (JpaAuditing - 글 작성 시점 자동 추가)**

```java
package com.example.awsboard.domain;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseTimeEntity {

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime modifiedDate;
}
```

메인 애플리케이션에서 `@EnableJpaAuditing` 어노테이션을 추가해 활성화합니다.

```java
package com.example.awsboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class AwsboardApplication {

  public static void main(String[] args) {
    SpringApplication.run(AwsboardApplication.class, args);
  }

}
```

 

### **5) OAuthAttributes 클래스 작성**

구글 로그인 이후 가져온 사용자의 이메일, 이름, 프로필 사진 주소를 저장하는 DTO

```java
package com.example.awsboard.config.auth;

import com.example.awsboard.domain.user.Role;
import com.example.awsboard.domain.user.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
public class OAuthAttributes {

    private Map<String, Object> attributes;
    private String nameAttributeKey, name, email, picture;

    @Builder
    public OAuthAttributes(Map<String, Object> attributes,
                           String nameAttributeKey,
                           String name, String email, String picture) {
        this.attributes = attributes;
        this.nameAttributeKey = nameAttributeKey;
        this.name = name;
        this.email = email;
        this.picture = picture;
    }

    public static OAuthAttributes of(String registrationId,
                                     String userNameAttributeName,
                                     Map<String, Object> attributes) {
        return ofGoogle(userNameAttributeName, attributes);
    }

    public static OAuthAttributes ofGoogle(String userNameAttributeName,
                                           Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .picture((String) attributes.get("picture"))
                .attributes(attributes)
                .nameAttributeKey(userNameAttributeName)
                .build();
    }

    public User toEntity() {
        return User.builder()
                .name(name)
                .email(email)
                .picture(picture)
                .role(Role.GUEST)
                .build();
    }
}
```

 



 

### **6) CustomOAuth2UserService 클래스 작성**

`OAuthAttributes`을 기반으로 가입 및 정보수정, 세션 저장 등 기능 수행합니다.

```java
package com.example.awsboard.config.auth;

import com.example.awsboard.config.auth.dto.SessionUser;
import com.example.awsboard.domain.user.User;
import com.example.awsboard.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.Collections;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final HttpSession httpSession;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // 현재 로그인 진행 중인 서비스를 구분하는 코드
        String registrationId = userRequest
                .getClientRegistration()
                .getRegistrationId();

        // oauth2 로그인 진행 시 키가 되는 필드값
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        // OAuthAttributes: attribute를 담을 클래스 (개발자가 생성)
        OAuthAttributes attributes = OAuthAttributes
                .of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        User user = saveOrUpdate(attributes);

        // SessioUser: 세션에 사용자 정보를 저장하기 위한 DTO 클래스 (개발자가 생성)
        httpSession.setAttribute("user", new SessionUser(user));

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRoleKey())),
                attributes.getAttributes(),
                attributes.getNameAttributeKey()
        );
    }

    private User saveOrUpdate(OAuthAttributes attributes) {
        User user = userRepository.findByEmail(attributes.getEmail())
                .map(entity -> entity.update(attributes.getName(), attributes.getPicture()))
                .orElse(attributes.toEntity());

        return userRepository.save(user);
    }

}
```

 

 

### **7) SecurityConfig 클래스 작성 - 스프링 시큐리티 설정**

- `.oauth2Login().userInfoEndpoint().userService(customOAuth2UserService);`

 

```java
package com.example.awsboard.config.auth;

import com.example.awsboard.domain.user.Role;
import lombok.RequiredArgsConstructor;
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
                .antMatchers("/", "/css/**", "/images/**", "/js/**", "/h2/**", "/h2-console/**").permitAll()
                .antMatchers("/api/v1/**").hasRole(Role.USER.name())
                .anyRequest().authenticated()

            .and()
                .logout().logoutSuccessUrl("/")

            .and()
                .oauth2Login().userInfoEndpoint().userService(customOAuth2UserService);

    }

}

```

 

### **8) SessionUser 클래스 작성**

`User` 엔티티 클래스에서 직렬화가 필요한 경우 별도로 사용하기 위한 클래스를 작성합니다.

```java
package com.example.awsboard.config.auth.dto;

import com.example.awsboard.domain.user.User;
import lombok.Getter;

import java.io.Serializable;

/**
 * 세션에 저장하려면 직렬화를 해야 하는데
 * User 엔티티는 추후 변경사항이 있을 수 있기 때문에
 * 직렬화를 하기 위한 별도의 SessionUser 클래스 생성
 */

@Getter
public class SessionUser implements Serializable {

    private String name, email, picture;

    public SessionUser(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.picture = user.getPicture();
    }
}

```

 



 

### **9) IndexController 작성, Thymeleaf 뷰 페이지 작성**

일부 내용은 생략합니다.

```java
package com.example.awsboard.web;

import com.example.awsboard.config.auth.LoginUser;
import com.example.awsboard.config.auth.dto.SessionUser;
import com.example.awsboard.service.posts.PostsService;
import com.example.awsboard.web.dto.PostsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpSession;

@RequiredArgsConstructor
@Controller
public class IndexController {

    private final PostsService postsService;
    private final HttpSession httpSession;

    @GetMapping("/")
    public String index(Model model, @LoginUser SessionUser user) {
        // .............

        // 사용자 정보: 위의 @LoginUser 어노테이션으로 대체
        // SessionUser user = (SessionUser) httpSession.getAttribute("user");

        if(user != null) {
            model.addAttribute("userName", user.getName());
            model.addAttribute("userImg", user.getPicture());
        }

        return "index";
    }

    // ..................

}
```

```html
<div class="row">
    <div class="col-md-10">
        <div th:if="${not #strings.isEmpty(userName)}">
            <img style="width:45px; height:45px" src="/image/unnamed.png" th:src="${userImg}"
                 class="rounded-circle img-thumbnail img-responsive">
            <span id="login-user" th:text="${userName}">사용자</span> 님, 안녕하세요.
            <a href="/logout" class="btn btn-sm btn-info active" role="button">Logout</a>
        </div>

        <div th:if="${#strings.isEmpty(userName)}">
            <!-- 스프링 시큐리티에서 기본 제공하는 URL - 별도 컨트롤러 작성 필요 없음 -->
            <a href="/oauth2/authorization/google" class="btn btn-sm btn-success active" role="button">Google Login</a>
        </div>
    </div>
    <div th:if="${not #strings.isEmpty(userName)}" class="col-md-2">
        <a href="/posts/save" role="button" class="btn btn-primary float-right">글 등록</a>
    </div>
</div>
```

 

## **결과**

![로그인 전 화면](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-6.20.24.png)  
*로그인 전 화면*

![Google Login 버튼을 클릭하면 위와 같은 화면이 나옵니다.](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-6.21.15.png)  
*Google Login 버튼을 클릭하면 위와 같은 화면이 나옵니다.*

![로그인이 정상적으로 되었습니다.](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-6.23.36.png)  
*로그인이 정상적으로 되었습니다.*
 

* * *

## **참고: 네이버 연동하기**

위의 작업 내용에 다음 부분을 추가하여 네이버도 연동할 수 있습니다.

[네이버 아이디로 로그인하기 클라이언트 및 아이디 획득방법](/posts/spring-boot-%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%95%84%EC%9D%B4%EB%94%94%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%98%EA%B8%B0-%EC%97%B0%EB%8F%99%ED%95%98%EA%B8%B0-1/)

 

### **1) application-oauth.properties 에 다음 내용 추가**

```conf
## 네이버 ##

# registration
spring.security.oauth2.client.registration.naver.client-id=[클라이언트 아이디]
spring.security.oauth2.client.registration.naver.client-secret=[클라이언트 비밀번호]
spring.security.oauth2.client.registration.naver.redirect-uri={baseUrl}/{action}/oauth2/code/{registrationId}
spring.security.oauth2.client.registration.naver.authorization_grant_type=authorization_code
# 스코프는 변경될 수 있음
spring.security.oauth2.client.registration.naver.scope=name,email,profile_image 
spring.security.oauth2.client.registration.naver.client-name=Naver

# provider
spring.security.oauth2.client.provider.naver.authorization_uri=https://nid.naver.com/oauth2.0/authorize
spring.security.oauth2.client.provider.naver.token_uri=https://nid.naver.com/oauth2.0/token
spring.security.oauth2.client.provider.naver.user-info-uri=https://openapi.naver.com/v1/nid/me
spring.security.oauth2.client.provider.naver.user_name_attribute=response
```

 

### **2) OAuthAttributes.java에 다음 내용 추가**

```java
package com.example.awsboard.config.auth;

.........

@Getter
public class OAuthAttributes {

    .........

    public static OAuthAttributes of(String registrationId,
                                     String userNameAttributeName,
                                     Map<String, Object> attributes) {

        // google, naver
        switch (registrationId) {
            case "naver":
                return ofNaver("id", attributes);
        }

        return ofGoogle(userNameAttributeName, attributes);

    }

    ..........

    public static OAuthAttributes ofNaver(String userNameAttributeName,
                                          Map<String, Object> attributes) {

        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        return OAuthAttributes.builder()
                .name((String) response.get("name"))
                .email((String) response.get("email"))
                .picture((String) response.get("profile_image"))
                .attributes(response)
                .nameAttributeKey(userNameAttributeName)
                .build();

    }

    ...............
}
```

 

### **3) index.html 뷰 페이지에 구글 로그인 버튼 옆에 다음 추가**

```html
<a href="/oauth2/authorization/naver" class="btn btn-sm btn-secondary active" role="button">Naver Login</a>
```

 

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-7.49.53.png)

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-13-pm-7.48.56.png)
