---
title: "Spring Boot: Spring JPA + H2 데이터베이스 기초 + 단위 테스트"
date: 2020-06-30
categories: 
  - "DevLog"
  - "Spring/JSP"
---

[롬복(Lombok)이 설치되어 있는것](http://yoonbumtae.com/?p=2540)을 전제로 합니다.

- 스프링 부트 버전: 2.3.1
- Gradle 버전: 6.4.1

스프링 부트 Spring Boot: Spring JPA + H2 데이터베이스 기초 + 단위 테스트

 

##### **1\. build.gradle에 디펜던시 추가**

```
dependencies {
  ...

  // Spring JPA
  implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
  runtimeOnly 'com.h2database:h2'

  // https://mvnrepository.com/artifact/javax.persistence/javax.persistence-api
  // 프로젝트에 javax.persistence 가 없는 경우 설치
  compile group: 'javax.persistence', name: 'javax.persistence-api', version: '2.2'
  
}
```

위의 디펜던시만 추가합니다.

 

##### **2\. application.properties 파일에 설정 추가**

```
# H2 설정
spring.h2.console.enabled=true
spring.h2.console.path=/h2

# sql 보기
spring.jpa.show_sql = true

# h2 문법을 mysql로 변경
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5InnoDBDialect
spring.jpa.properties.hibernate.dialect.storage_engine=innodb
spring.datasource.hikari.jdbc-url=jdbc:h2:mem://localhost/~/testdb;MODE=MYSQL
```

 

##### **3\. 도메인 패키지를 생성하고 안에 데이터베이스 테이블과 연결되는 특수한 Getter 생성**

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-9.43.04.png)

엔티티 클래스와 Repository 인터페이스로 구분되며, 엔티티 클래스의 이름은 테이블의 이름으로 합니다. 여기서는 `posts`라는 테이블이 있는것으로 가정해 `Post`라고 지었습니다.

다른 예로 `SalesManager.java` 는 `sales_manager` 테이블과 연결됩니다.

 

**Posts 클래스**

```
package com.example.awsboard.domain.posts;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity // 테이블과 링크될 클래스
public class Posts {

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

    @Builder // 빌더 패턴 클래스 생성, 생성자에 포함된 필드만 포함
    public Posts(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
    }
}
```

 

**PostsRepository 인터페이스**

```
package com.example.awsboard.domain.posts;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostsRepository extends JpaRepository<Posts, Long> {

}
```

동일한 패키지 내에 생성합니다. 인터페이스 이름을 엔티티 클래스의 이름을 따와 `***Repository` 로 생성하고 `JpaRepository<T, id>`를 상속받습니다.

`T`는 엔티티 클래스 자료형이 들어가며, `id` 부분에는 아이디로 사용할 자료형을 입력합니다.

`Posts`가 엔티티 클래스이며 `Long` 타입을 아이디로 사용하므로 `extends JpaRepository<Posts, Long>` 가 됩니다.

 

##### **4\. 단위 테스트 코드 작성**

```
package com.example.awsboard.domain.posts;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class PostsRepositoryTest {

    @Autowired
    PostsRepository postsRepository;

    @AfterEach
    public void cleanup() { // 데이터 섞임 방지
        postsRepository.deleteAll();
    }

    @Test
    public void 게시글저장_불러오기() {
        // given
        String title = "Test title";
        String content = "Test content";

        postsRepository.save(Posts.builder()
                .title(title)
                .content(content)
                .author("kim")
                .build());

        // when
        List<Posts> postsList = postsRepository.findAll();

        // then
        Posts posts = postsList.get(0);
        assertThat(posts.getTitle()).isEqualTo(title);
        assertThat(posts.getContent()).isEqualTo(content);
    }
}
```

 ![](/assets/img/wp-content/uploads/2020/06/스크린샷-2020-06-30-오후-9.48.28.png)

JpaRepository를 상속받은 PostRepository에서 사용 가능한 메소드

- `.save(ENTITY_VO)` - 테이블 `Posts`에 `insert` / `update` 쿼리를 실행 (`id` 값이 있다면 `update`, 없으면 `insert`)
- `.findAll()` - 테이블 `Posts`에 있는 모든 데이터를 조회하는 메소드
- `.deleteAll()` - `delete`문 실행

 

출처: [스프링 부트와 AWS로 혼자 구현하는 웹 서비스](https://github.com/jojoldu/freelec-springboot2-webservice)
