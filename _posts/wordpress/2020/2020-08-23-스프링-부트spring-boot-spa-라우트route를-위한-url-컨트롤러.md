---
title: "스프링 부트(Spring Boot): SPA 라우트(route)를 위한 URL 컨트롤러"
date: 2020-08-23
categories: 
  - "DevLog"
  - "Spring/JSP"
---

[Vue.js](https://kr.vuejs.org/v2/guide/index.html) 등 SPA 프레임워크는 자바스크립트의 History API를 이용하여 클라이언트 단에서 URL 라우팅을 하는 기능이 있습니다.

- [Vue Router: HTML5 히스토리 모드](https://router.vuejs.org/kr/guide/essentials/history-mode.html#%EC%84%9C%EB%B2%84-%EC%84%A4%EC%A0%95-%EC%98%88%EC%A0%9C)
- [History API](https://www.zerocho.com/category/HTML&DOM/post/599d2fb635814200189fe1a7)

이 기능을 사용하면, 서버에서 별도로 처리하지 않고도 `index.html`에서 URL을 지정할 수 있게 됩니다. 전통적으로 브라우저창에 URL을 입력하면 서버에서 해당 URL 매핑 정보를 찾아 페이지를 리턴하는 방식이었지만, `History API`를 이용하면 index.html 내부의 자바스크립트 코드가 알아서 URL을 브라우저 창에 표시하고 그에 대한 특별한 행동을 취하게 됩니다. 이를 통해 SPA로도 URL을 이용한 페이지의 표시나 접속이 가능하게 되었습니다.

단, 표시는 가능한데 직접 URL창에 접속하려고 하면 에러가 나는 경우가 있습니다. `History API`를 이용해 URL에 접속하려면 `index.html`에 접근 가능해야 하는데, 기본적으로 URL을 입력하면 서버 접속을 먼저 시도하며, 서버측에서 해당 URL에 대해 특별한 매핑이 되지 않았으므로 페이지가 없다는 `404` 결과를 리턴합니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-23-pm-6.35.48.png)

문제를 해결하려면 서버 URL에 대체 경로를 추가하면 됩니다. URL에 매핑되어 있는 정적(static) 페이지가 없다면, SPA 앱이 있는 `index.html` 페이지를 매핑하도록 하면 됩니다.

예제에서는 `http://server.url/` 에 `index.html`이 배정되어 있으며, `http://server.url/v/**` 로 구성된 모든 URL은 SPA 라우팅을 이용하였다고 가정합니다.

```java
import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

      registry.addResourceHandler("/v/**/*")
        .addResourceLocations("classpath:/static/")
        .resourceChain(true)
        .addResolver(new PathResourceResolver() {
            @Override
            protected Resource getResource(String resourcePath,
                Resource location) throws IOException {
                Resource requestedResource = location.createRelative(resourcePath);
                return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                : new ClassPathResource("/static/index.html");
            }
        });
    }
}
```

 

만약 매핑되지 않은 모든 URL에 `index.html`을 배정하고 싶다면, `addResourceHandler`의 `value`에서 `"/v"` 를 지우면 됩니다,

이 컨트롤러를 추가하면. `http://server.url/v/`로 시작하는 모든 요청은 서버에서 `index.html`을 반환하기 때문에 해당 페이지에 내장된 SPA 라우팅 기능을 이용할 수 있게 됩니다.

> 출처: [https://stackoverflow.com/questions/38516667/springboot-angular2-how-to-handle-html5-urls](https://stackoverflow.com/questions/38516667/springboot-angular2-how-to-handle-html5-urls)
