---
title: "Thymeleaf: 소개, 기본 세팅, 텍스트 표시"
date: 2019-01-07
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "thymeleaf"
---

#### 소개

[Thymeleaf](https://www.thymeleaf.org/)는 Spring Boot에서 밀어주고 있는 View 템플릿 엔진입니다. 기존 View 템플릿들과의 차이점이라면 HTML 태그의 속성을 이용한 페이지 제작이 가능해서 Thymeleaf 문법으로 페이지를 만들면 서버의 도움 없이도 온전한 프로토타입의 HTML 페이지를 살펴볼 수 있다는 점이 장점이라고 합니다.

예를 들어, 기존의 JSTL을 이용한 JSP 페이지에서는 WAS가 구동되지 않으면 페이지를 온전히 표시할 방법은 없으나 ,Thymeleaf로 만들면 WAS가 구동되지 않는 환경에서도 프론트엔드 프로그래머 또는 웹 디자이너가 원하는 모양의 페이지를 프로토타입 형식으로 볼 수 있어 MVC 패턴의 업무 분할이 더욱 명확해질 수 있다고 Thymeleaf 측에서는 주장하고 있습니다.

물론 데이터는 서버에서 받아와야하므로 실제 데이터를 포함한 페이지는 무리겠지만 프로토타입이므로 별로 상관없을까요? 그리고 JSP를 쓸 수 없는 일반 HTML 에디터나 드림위버같은 고급툴을 사용할 수 있어 좀 더 편하게 작업할 수 있습니다.

 

#### 기본 환경 세팅

예제를 보면 다음과 같습니다. 컨트롤러와 페이지 2개입니다.

```
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class TestController {

  @RequestMapping("/login")
  public ModelAndView welcome(ModelAndView mav) {		
      
    mav.addObject("welcomeMessage", "환영합니다.");
    mav.setViewName("login");
    return mav;
  }
  
  @RequestMapping("/loginProcess")
  public String login(String id, String password, HttpSession session){
    System.out.println(id);
    System.out.println(password);

    String user1 = "admin;1234;운영자";
    String user2 = "guest1;1234;손님1";
    
    List<String> users = new ArrayList<>();
    users.add(user1);
    users.add(user2);
    for(String s : users) {
      if(id.equals(s.split(";")[0]) && password.equals(s.split(";")[1])) {
        session.setAttribute("name", s.split(";")[2]);
        return "main";
      }
    }
    
    return "redirect:login" + "?isLoginSuccess=false";
    
  }

}
```

예제의 상황은 회원이 2명 있다고 가정하며 로그인에 성공하면 세션에 이름을 저장합니다. 또 get 방식 파라미터 로그인 성공여부를 알려줍니다. 당연히 원래는 로그인 처리를 get방식으로 하면 안됩니다.

 

#### 기본 문법

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>로그인</title>
</head>
<body>
  <p data-th-unless="${param.isLoginSuccess == null}" data-th-switch="${param.isLoginSuccess[0]}">
    <span data-th-case="'true'">true</span>
    <span data-th-case="'false'">로그인에 실패하였습니다.</span>
    <span data-th-case="*" data-th-text="${param.isLoginSuccess[0]}"></span>
  </p>
  <form action="/loginProcess" method=post>
    아이디 <input type=text name=id><br>
    비밀번호 <input type=password name=password>
    <button>로그인</button>
  </form>
</body>
</html>
```

Thymeleaf는 값을 넣거나 조작하고자 하는 HTML 태그 속성란에 `data-th-****` 라는 속성(또는 `th:***`, 더 많이 사용됨)을 입력하여 서버로부터 값을 받고 요소들을 핸들링합니다. `data` 속성은 HTML5에서 정식지원하므로 호환성을 더욱 높일 수 있습니다만, HTML 외의 부분에서는 사용할 수 없다는 단점이 있습니다. (참고로 Thymeleaf는 XML, CSS, JS 등의 렌더링도 지원합니다.)

`data-th-unless`는 if와 반대되는 개념으로 "_~~이 아니면 이 요소를 표시한다_"라는 뜻입니다. `data-th-unless="${param.isLoginSuccess == null}"` 는 `isLoginSuccess`라는 파라미터가 `null`이 아니면 (=존재한다면) `p` 태그를 보여주고, 아니라면 보여주지 않는다는 것을 뜻합니다. 만약 처음 접속하는 것이라면 `isLoginSuccess` 파라미터는 없을 것이므로 `p` 부분은 보이지 않습니다.

`data-th-switch` 는 `data-th-case`와 연동되며, 말 그대로 `switch`문입니다. `${param.isLoginSuccess[0]}`은 파라미터의 `isLoginSuccess` 파라미터의 0번 배열의 값을 읽은 뒤 `case` 문에 대입해서 조건이 일치하면 `span` 요소를 보여주고, 아니라면 `span` 요소를 보여주지 않습니다.

왜 `${param.isLoginSuccess[0]}` 뒤에 `[0]`이 붙었을까요? Thymeleaf는 파라미터의 값들을  띄어쓰기를 중심으로 `split`하여 **배열 타입**으로 불러옵니다. 그러므로 특정 값을 읽으려면 그 값을 배열처럼 다뤄야 합니다. `data-th-case`에서 `*`는 위에 나온 경우 외의 나머지 모든 경우를 뜻합니다. 이것은 일반 스위치 문의 `default` 비슷한 것입니다.

 

#### 텍스트 표시

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Main</title>
</head>
<body>
  <h2 data-th-text="${session.name}">사용자 이름</h2>
</body>
</html>
```

요소에 텍스트를 표시하고 싶다면 `data-th-text` 속성을 이용합니다. 서버를 통하지 않는 일반 웹 페이지 방식으로 보면 \[_사용자 이름_\]으로 표시되지만 서버를 통해 실행하면 \[_사용자 이름_\]이라는 텍스트는 서버 렌더링 과정에서 사라지고 `${session.name}`을 표시합니다.

![운영자손님](./assets/img/wp-content/uploads/2019/01/운영자손님.png)
