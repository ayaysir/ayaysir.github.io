---
title: "스프링 부트(Spring Boot): JPA 엔티티에 자동으로 생성 날짜, 변경 날짜 추가하기"
date: 2020-08-28
categories: 
  - "DevLog"
  - "Spring/JSP"
---

\[rcblock id="2655"\]

JPA 엔티티에 생성 날짜(createdDate), 변경 날짜(modifiedDate) 필드를 자동으로 추가하는 방법입니다.

 

#### **1) BaseTimeEntity 추상 클래스 작성**

```
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
public abstract class BaseTimeEntity {

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime modifiedDate;

}
```

 

#### **2) 추가하고자 하는 엔티티에 BaseTimeEntity를 상속받도록 extends 추가**

```
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

    // ...... 이하 생략 ......

}
```

 

#### **3) @Configuration 어노테이션을 갖는 JpaConfig 클래스 추가**

```
package com.example.awsboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

`@EnableJpaAuditing` 어노테이션을 Application에 직접 달면 단위 테스트시 문제가 발생하므로 별도 config 클래스를 생성해 어노테이션을 추가합니다.

 

이후 엔티티에 `createdDate`, `modifiedDate`가 자동으로 상속되며, 엔티티를 입력하거나 변경할 때마다 현재 시간이 업데이트됩니다.

 

 ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-28-오후-6.49.20.png)  ![](/assets/img/wp-content/uploads/2020/08/스크린샷-2020-08-28-오후-6.49.37.png)
