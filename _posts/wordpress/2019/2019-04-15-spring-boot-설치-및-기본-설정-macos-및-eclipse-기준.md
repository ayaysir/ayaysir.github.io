---
title: "Spring Boot: 설치 및 기본 설정 (macOS 및 Eclipse 기준)"
date: 2019-04-15
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring-boot"
---

## 절차

### 1\. 이클립스(STS) 준비

이클립스에서 `Help > Marketplace...` 를 선택한 다음 `STS` 을 검색해서 설치합니다. 설치 시 이름에 `boot` 가 들어가는 요소는 반드시 체크하고, `Perspective`를 `Spring`으로 변경합니다.

또는 처음부터 STS(STS가 설치된 이클립스)로 사용합니다: [https://spring.io/tools](https://spring.io/tools)

 

### 2\. Spring Starter Project 생성

이클립스에서 `File > New... > Spring Starter Project` 를 선택합니다. Group, Artifact, Package 등은 임의로 설정합니다.

![](/assets/img/wp-content/uploads/2019/04/1.png)

 

### 3\. Next 버튼 누른 뒤, 사용하고자 하는 디펜던시를 추가

![](/assets/img/wp-content/uploads/2019/04/2.png)

![](/assets/img/wp-content/uploads/2019/04/springboot-init-3.png)

search란에서 `DevTools` 를 검색하신 뒤 추가해주세요. 이 도구는 필수요소로 맨 밑에서 설명합니다.

 

### 4\. Finish 버튼 클릭

![](/assets/img/wp-content/uploads/2019/04/springboot-init-4.png)

이 부분은 마법사의 내용을 바탕으로 새로운 프로젝트 파일들을 인터넷에서 다운로드할 때 필요한 URL을 확인하는 절차로 대부분 이상이 없으니 Finish를 누르면 됩니다.

 

### 5\. 프로젝트 다운로드가 진행되는데, 프로젝트 화면이 아래가 될 때까지(다운로드가 끝날 때까지) 대기

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_3.43.13.png)

### 6\. src/main/java 패키지 밑에 데모 애플리케이션이라는게 있는데, 이 부분이 스프링 부트의 핵심

`Demo(프로젝트 이름)Application.java` 클래스를 실행합니다. 실행시 `Spring Boot App`으로 실행합니다.

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_3.45.26.png)

그러면 콘솔에 뭔가 뜨면서 실행이 될텐데, 에러가 발생할 수 있습니다.

```sh
(...) Unregistering JMX-exposed beans on shutdown (...)
```

에러의 원인은 처음에 데이터베이스에 관련된 디펜던시를 추가했었는데, 아직 데이터베이스에 관한 아무런 설정도 하지 않은 상태라 나타나는 것이라고 하네요. 그런데 아직은 DB를 쓸 일이 없으므로 임시방편으로 데모 애플리케이션에 `@EnableAutoConfiguration` 부분을 추가하는 것으로 해결합니다.

```java
@SpringBootApplication
@EnableAutoConfiguration(exclude={DataSourceAutoConfiguration.class})
public class DemoApplication {
 
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        
    }
}
```

### 7\. static resource 추가하기

`src/main/resources/static` 폴더에 추가합니다. 예제로 `index.html` 파일을 작성해서 실행해보겠습니다.

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_4.54.05.png)
![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_4.55.40.png)


### 8\. 컨트롤러 만들기

메인 패키지 밑에 `DemoController.java`를 작성합니다.

```java
package com.example.demo;
 
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
 
@Controller
public class DemoController {
    @RequestMapping("/rb-demo")
    @ResponseBody  // 리턴 스트링을 그대로 출력
    public String demoResponseBody() {
        return "ResponseBody";
    }
}
```

`@ResponseBody`는 다른 주소나 페이지로 포워딩을 하지 않고 리스폰스를 스트링 그대로 내보내는 기능입니다.

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_4.55.53.png)

### 9\. JSP 뷰 사용하기

참고로 스프링 부트에서 JSP 문법 및 JSTL은 오래된 기술이라 잘 사용하지 않고, 기본적으로 Thymeleaf 라는 렌더링 언어를 지원합니다.

#### (1) `src/main/resources` 폴더에 있는 애플리케이션 프로퍼티 파일에 다음 내용을 추가합니다.

```conf
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp
```

#### (2) pom.xml의 `<Dependencies>` 태그 밑에 다음 내용을 추가합니다.

```xml
<!-- jsp viewer -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
    </dependency>
 
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-jasper</artifactId>
    </dependency>

```

#### (3) 톰캣과의 호환성을 위해 `src/main` 폴더 밑에 `webapp/WEB-INF/views` 폴더를 생성합니다.

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_3.55.37.png)
![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_4.01.46.png)

#### (4) `views` 폴더에 `demo.jsp` 를 만들고, 컨트롤러에 다음과 같이 추가합니다.

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>demo</title>
</head>
<body>
    demo page: 
    <%
        out.println("SCRIPTLET");
    %>
</body>
</html>

```

```java
@RequestMapping("/demo")
public String demoJsp() {
    return "demo";
}
```

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_4.55.59.png)

참고로 컨트롤러를 찾지 못했을 때 메인 애플리케이션의 어노테이션으로 `@ComponentScan`을 추가하면 해결할 수 있습니다.

![](/assets/img/wp-content/uploads/2019/04/screenshot_2018-09-20_pm_3.59.49.png)

```java
@ComponentScan(basePackgages = "[패키지 경로]")
```

---

## 프로젝트 변경시 자동 재시작되게 하기

프로젝트 내용이 변경될때마다 자동으로 재시작하게 만드려면 디펜던시에 `DevTools`가 반드시 포함되어 있어야 합니다.

### 1\. `pom.xml`의 `<Dependencies>`에 아래의 내용이 없다면 추가합니다.

```xml
<!-- DevTools -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

 

### 2. 애플리케이션 프로퍼티 파일(`application.properties`)에 다음 내용 추가합니다.

```conf
spring.devtools.livereload.enabled=true
```

이렇게 하면 파일이 변경될때마다 자동으로 재시작됩니다. 또는 콘솔 창의 새로고침 버튼(Trigger devtools-based Restart of Spring Boot Application)을 눌러도 됩니다.
