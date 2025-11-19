---
published: false
title: "Spring Boot: 국제화(Internationalization)"
date: 2019-01-31
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "thymeleaf"
---

여기서 국제화는 홈페이지의 내용을 다국어로 지원하는 것을 뜻합니다.

예를 들어, [https://www.navercorp.com/](https://www.navercorp.com/) 사이트를 보면 동일한 레이아웃과 동일한 내용을 한국어 또는 영어로 지원합니다. 이 곳 뿐만 아니라 많은 사이트에서 이런식의 다국어를 지원합니다.

만약 이것을 똑같은 HTML을 복사해서 내용만 바꾸겠다는 식으로 접근하면 홈페이지 제작이 굉장히 힘들겠죠? 처음부터 국제화를 의도하고 제작하는 것이 좋겠습니다.

* * *

##### 0\. `src/main/resources` 폴더에 `messages.properties` 작성

```
title=국제화 
welcome=안녕하세요. 홈페이지에 오신 것을 환영합니다. 
lang.change=언어 변경 
lang.en=영어 
lang.ja=일본어 
lang.ko=한국어
```

```
title=Internationalization
welcome=Hello! Welcome to our website!
lang.change=Change the language
lang.en=English
lang.ja=Japanese
lang.ko=Korean
```

```
title=国際化
welcome=こんにちは。私のホームにようこそ。
lang.change=言語を変更する
lang.en=英語
lang.ja=日本語
lang.ko=韓国語
```

메시지 파일은 다른 프로퍼티 파일처럼 왼쪽에 key, 오른쪽에 value를 입력합니다. 유니코드로 작성하되 이클립스 내장 텍스트에디터와 윈도 메모장은 에러가 발생하므로 사용하지 않도록 합니다. 특히 메모장은 유니코드 BOM 오류가 있어서 첫줄을 반드시 공백으로 해야 정상 동작합니다.

메시지 파일명은 정해져 있는데 기본 언어는 `messages.properties` , 다른 언어는 `messages_en.properties` `messages_ja.properties` 처럼 언어코드를 붙여 파일명을 짓습니다.

* * *

##### 1\. 부트 메인 애플리케이션에 `LocaleResolver`, `LocaleChangeInterceptor`, `addInterceptors` 메소드 추가

```
package com.example.thymeleaf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

@SpringBootApplication
public class ThymeleafApplication implements WebMvcConfigurer{

  public static void main(String[] args) {
    SpringApplication.run(ThymeleafApplication.class, args);
  }
  
  @Bean	// 1 LocaleResolver
  public LocaleResolver localeResolver() {
      SessionLocaleResolver slr = new SessionLocaleResolver();
      // slr.setDefaultLocale(Locale.JAPAN);
      // setDefaultLocal을 지정하지 않을 경우 서버 정보?의 국가가 자동으로 설정됨 (Locale.KOREA)
      return slr;	    
  }
  
  @Bean	// 2 LocaleChangeInterceptor
  public LocaleChangeInterceptor localeChangeInterceptor() {
      LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
      lci.setParamName("lang");
      return lci;
  }
  
  @Override // 3 addInterceptors: WebMvcConfigurer에 있는 것을 구현한 것
  public void addInterceptors(InterceptorRegistry registry) {
      registry.addInterceptor(localeChangeInterceptor());
  }

}

```

`lci.setParamName("lang");` 에서 파라미터 네임을 설정합니다. 파라미터 네임은 변경 가능합니다. 나중에 주소창에서 `?lang=ja` 이런 식으로 접근합니다.

* * *

##### 2\. 컨트롤러 추가

```
package com.example.thymeleaf;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class InternationalController {
  
    @RequestMapping("/international")
    public String getInternationalPage() {
        return "international";
    }
    
    @ResponseBody
    @RequestMapping("/sessionClear")
    public String sessionClear(HttpSession ss) {
    	ss.invalidate();
        return "OK";
    }
    
}

```

컨트롤러에서는 따로 파라미터에 관해 설정하지 않아도 됩니다.

* * *

##### 3\. HTML (뷰) 생성 (**Thymeleaf** 사용)

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title data-th-text="#{title}"></title>
<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous">
</script>
</head>
<body>
  <h1 data-th-text="#{welcome}"></h1>
  <span data-th-text="#{lang.change}"></span>:
  <select id="locales" >
      <option value="ko" data-th-text="#{lang.ko}" 
      	data-th-selected=" ${param.lang eq null or param.lang.toString()=='ko' }" />
      <option value="en" data-th-text="#{lang.en}" 
      	data-th-selected=" ${param.lang?.toString()=='en' }" />
      <option value="ja" data-th-text="#{lang.ja}" 
      	data-th-selected=" ${param.lang?.toString()=='ja' }" />
  </select>
  <button type=button id=btnClear >TEST</button>
  <script>
    $('#locales').change(() => {
      var selectedOption = $('#locales').val();
          if (selectedOption != ''){
              window.location.replace('international?lang=' + selectedOption);
          }
    })
  
    $('#btnClear').click( ()=> {
        $.get("sessionClear", res => {
        alert(res)
      })
    })
  </script>
</body>
</html>
```

Thymeleaf에서는 표시하고자 하는 내용을 메시지 프로퍼티에서 키 이름을 찾아 `#{키이름}` 으로 작성합니다. 만약 JSP를 사용한다면 다음 방식으로 작성합니다.

```
 <h1><spring:message code="greeting" text="default"/></h1>
```

 ![](/assets/img/wp-content/uploads/2019/01/international-e1565670523298.png)
