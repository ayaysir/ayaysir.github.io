---
title: "Spring JPA: 테이블(엔티티) 검색 기능 만들기 + 단위 테스트"
date: 2020-08-14
categories: 
  - "DevLog"
  - "Spring/JSP"
---

<!-- \[rcblock id="2655"\] -->

Spring JPA는 Repository의 메소드 이름으로 쿼리를 지정할 수 있습니다.

[API 문서 (영문) 바로가기](https://docs.spring.io/spring-data/jpa/docs/1.10.1.RELEASE/reference/html/#jpa.query-methods.query-creation)

 

## **`Entity` 클래스의 구조는 다음과 같습니다.**

```java
package com.example.awsboard.domain.posts;

import com.example.awsboard.domain.BaseTimeEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@ToString
@Entity // 테이블과 링크될 클래스
public class Posts extends BaseTimeEntity {

    @Id // PK 필드
    @GeneratedValue(strategy = GenerationType.IDENTITY) // PK 생성규칙
    private Long id;

    // @Column: 선언하지 않더라도 클래스의 필드는 모두 컬럼이 됨
    // 추가 변경 옵션이 필요한 경우 지정
    @Column(length = 450, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String author;

    private Long authorId;

    @Builder // 빌더 패턴 클래스 생성, 생성자에 포함된 필드만 포함
    public Posts(String title, String content, String author, Long authorId) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.authorId = authorId;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
```

 

## **다음은 레퍼지토리 인터페이스 코드입니다.**

```java
package com.example.awsboard.domain.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {

    // findByXXX: XXX 컬럼을 키워드로 검색
    // Containing: 특정 키워드 포함 여부
    List<Posts> findByContentContainingIgnoreCaseOrTitleContainingIgnoreCase(String title, String content);

}
```

- `findBy`로 시작하면 `select` 쿼리를 시작한다는 뜻입니다.
- `Content`, `Title`는 이 컬럼에서 파라미터로 받은 값을 찾겠다는 의미입니다. (엔티티 클래스의 컬럼 참고)
- `Containing`이 없다면 해당 키워드와 일치하는 결과만 찾고, 이 키워드가 있는 경우는 포함하는 결과를 찾습니다. 즉, SQL문의 `like %xx%` 와 비슷합니다.
- `IgnoreCase` 키워드는 대소문자 구별을 하지 않는다는 의미입니다. 이것이 없다면 대소문자가 구별됩니다.

 

파라미터를 하나만 사용할 수 있는 방법(하나의 스트링 변수만 사용해 제목, 내용 모두 검색하는 방법)은 아직 알지 못했습니다. 찾게 된다면 게시글을 다시 업데이트 하겠습니다.

이 메소드를 SQL 문으로 바꾸면 대략 다음과 같습니다. 이해를 돕기 위한 쿼리문으로 실제 사용 방법은 다를 수 있습니다.

```sql
SELECT * from posts 
where upper(title) like '%' || upper([?2]) || '%' 
or upper(content) like '%' || upper([?2]) || '%'
```

 

메소드를 이용한 쿼리의 장점으로 메소드의 이름이 일관성이 있으며 별도의 SQL을 작성하지 않아도 된다는 점이 있습니다. 단점으로는 쿼리가 바뀔 때마다 메소드의 이름 자체를 변경해야 하고, 그러면 관련된 모든 서비스, 테스트 코드 등을 바꿔야 하므로 관리가 어려워집니다. 또 비교적 간단한 쿼리라도 메소드 이름으로 지으면 장황해지므로 위의 예제처럼 민폐가 될 수 있습니다.


## **참고**

### **서비스 메소드**

```java
@Transactional(readOnly = true)
public List<PostsListResponseDTO> searchTitleAndContent(String keyword) {
    return postsRepository
            .findByContentContainingIgnoreCaseOrTitleContainingIgnoreCase(keyword, keyword)
            .stream()
            .map(PostsListResponseDTO::new)
            .collect(Collectors.toList());
}
```

 

### **Repository 단위 테스트**

```java
package com.example.awsboard.domain.posts;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class PostsRepositoryTest {

    // ...............

    @Test
    public void Search_동작여부() {

        // Given
        String title = "Dog water";
        String content = "Cat water";

        postsRepository.save(Posts.builder()
                .title(title)
                .content(content)
                .author("kim")
                .build());
        postsRepository.save(Posts.builder()
                .title(content)
                .content(title)
                .author("park")
                .build());
        postsRepository.save(Posts.builder()
                .title("fire")
                .content("fire")
                .author("lee")
                .build());

        // when
        String toFindKeyword ="Cat";

        List<Posts> postsList = postsRepository
                .findByContentContainingIgnoreCaseOrTitleContainingIgnoreCase(toFindKeyword, toFindKeyword);

        // then
        Posts posts0 = (Posts) postsList.get(0);
        Posts posts1 = (Posts) postsList.get(1);

        System.out.println(postsList);

        assertThat(posts0.getContent()).contains(toFindKeyword);
        assertThat(posts1.getTitle()).contains(toFindKeyword);

    }

}

```

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-14-pm-1.39.22.png)
