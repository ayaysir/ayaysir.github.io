---
title: "스프링 부트(Spring Boot): JPA + Thymeleaf로 페이지네이션(페이징, 페이지 내비게이션) 구현"
date: 2020-08-26
categories: 
  - "DevLog"
  - "Spring/JSP"
---

<!-- \[rcblock id="2655"\] -->

스프링 부트 + JPA + Thymeleaf를 이용해 게시판에 페이지네이션(페이징, 페이지 내비게이션) 기능을 추가해 보겠습니다.

## **절차**

### **0) 엔티티 클래스, 레퍼지토리 인터페이스 작성**

- [Spring Boot: Spring JPA + H2 데이터베이스 기초 + 단위 테스트](http://yoonbumtae.com/?p=2555)

 

### **1) 엔티티에 대한 서비스 클래스 작성**

```java
package com.example.awsboard.service.posts;

import com.example.awsboard.domain.posts.Posts;
import com.example.awsboard.domain.posts.PostsRepository;
import com.example.awsboard.web.dto.PostsListResponseDTO;
import com.example.awsboard.web.dto.PostsResponseDTO;
import com.example.awsboard.web.dto.PostsSaveRequestDTO;
import com.example.awsboard.web.dto.PostsUpdateRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PostsService {
    private final PostsRepository postsRepository;

    // ..... //

    // 페이지로 가져오기
    @Transactional(readOnly = true)
    public List<PostsListResponseDTO> findAllByOrderByIdDesc(Integer pageNum, Integer postsPerPage) {
        Page<Posts> page = postsRepository.findAll(
                // PageRequest의 page는 0부터 시작
                PageRequest.of(pageNum - 1, postsPerPage,
                        Sort.by(Sort.Direction.DESC, "id")
        ));
        return page.stream()
                .map(PostsListResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Long count() {
        return postsRepository.count();
    }

    // ..... //
}

```

 

- `[Repository].findAll(Pageable pageable)`을 이용해 페이지 단위로 게시물을 가져올 수 있습니다.
- `PageRequest` 클래스는 조상 중에 `Pageable`이 있기 때문에 변수 자리에 사용할 수 있습니다.
- `PageRequest.of(int page, int size, Sort sort)`를 이용하는데, 한 개의 페이지에 몇 개의 게시물을 불러올 것인지(`size`)를 정한 다음, 현재 페이지(`page`)를 알려주고, `sort`를 지정하지 않으면 기본 정렬순으로 불러오고, 지정하면 특정 순서대로 불러옵니다.
- 여기서는 `id` 기준 내림차순으로 불러오고자 하므로 `Sort.by(Sort.Direction.DESC, "id")`를 사용했습니다.
- `page`를 `stream()`한 다음 리스트로 내보낼 수 있습니다.
- 만약을 위해 게시판 전체 글 수를 반환하는 `count()` 메소드를 만들었습니다.
- JPA의 페이지 단위는 `0`부터 시작하므로 주의해야 합니다.

 

### **2) 페이지 글을 가져오고 페이지 블럭을 생성하는 컨트롤러 작성**

페이지 블럭을 생성하는 부분은 너무 복잡해서 별도로 분리했습니다. 여기서 페이지 블럭이란 링크를 클릭하면 페이지로 이동할 수 있는 내비게이션 부분을 지칭합니다.

- [자바(Java) 예제: 페이지네이션(Pagination, 페이징, 페이지 내비게이션) 도와주는 프로그램](/posts/자바java-예제-페이지네이션pagination-페이징-페이지-내비게/)

 

```java
import com.example.awsboard.service.posts.PostsService;
import com.example.awsboard.util.Paginator;
import com.example.awsboard.web.dto.PostsListResponseDTO;
import com.example.awsboard.web.dto.PostsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class IndexController {
    private final PostsService postsService;

    private static final Integer POSTS_PER_PAGE = 10;
    private static final Integer PAGES_PER_BLOCK = 5;

    @GetMapping("/")
    public String index(Model model, @LoginUser SessionUser user,
                        @RequestParam(value = "page", defaultValue = "1") Integer page) {

        // 글 목록 전송
        model.addAttribute("boardTitle", "자유게시판");
        model.addAttribute("requestFrom", "posts");

        // 페이지네이션
        try {
            Paginator paginator = new Paginator(PAGES_PER_BLOCK, POSTS_PER_PAGE, postsService.count());
            Map<String, Object> pageInfo = paginator.getFixedBlock(page);

            model.addAttribute("pageInfo", pageInfo);
        } catch(IllegalStateException e) {
            model.addAttribute("pageInfo", null);
            System.err.println(e);
        }

        model.addAttribute("posts", postsService.findAllByOrderByIdDesc(page, POSTS_PER_PAGE));

// .... 이하 생략 .... //
```

- 현재 페이지(`Integer page`)를 GET 파라미터로 가져오고, 없으면 기본값으로 `1`을 지정합니다.
- 페이지 블럭을 가져올 때 예외가 발생한 경우 모델에 `null`을 지정합니다.
- 참고로 글이 0개인 경우 페이지 블럭은 1페이지만 표시하도록 했으며, JPA 서비스에서는 글이 없어도 별도로 예외가 발생하지 않습니다.

 



### **3) 뷰 페이지(index.html) 의 페이지 블록 부분 작성**

페이지별 게시물 목록은 JPA에서 처리했기 때문에 알아서 잘 내려올 것이지만, 페이지 블럭 부분은 별도로 만들어줘야 합니다. Thymeleaf와 [부트스트랩](https://getbootstrap.com/docs/4.0/components/pagination/)이 사용되었습니다.

```html
<div class="row" th:if="${pageInfo ne null}">
    <div class="col-12">
        <ul class="pagination pagination justify-content-center">
            <li class="page-item" th:classappend="${!pageInfo.isPrevExist} ? disabled">
                <a class="page-link" href="#" th:href="${pageInfo.isPrevExist ? '/?page=' + (pageInfo?.pageList[0] - 1) : ''}">&laquo;</a>
            </li>
            <li th:each="num: ${pageInfo.pageList}" class="page-item" th:classappend="${pageInfo.currentPageNum eq num} ? active">
                <a class="page-link" href="#" th:href="${'/?page=' + num}" th:text="${num}"></a>
            </li>

            <li class="page-item" th:classappend="${!pageInfo.isNextExist} ? disabled">
                <a class="page-link" href="#" th:href="${pageInfo.isNextExist ? '/?page=' + (pageInfo?.pageList[0] + 5) : ''}">&raquo;</a>
            </li>
        </ul>
    </div>
</div>
```

 

## **결과 화면**

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-26-pm-6.47.43.png)

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-26-pm-6.49.02.png)



 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-26-pm-6.49.27.png)

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-26-pm-6.49.50.png)
