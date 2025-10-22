---
title: "Spring: 스프링의 어노테이션(Annotations) 사용법"
date: 2019-01-29
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring"
  - "스프링"
---

스프링(Spring)에서 **어노테이션**은 `@[어노테이션이름]` 이라는 형식으로 특정 클래스, 메소드, 변수의 맨 위에 붙여 쓰며 일반적으로 해당 구역의 기능을 확장하는 역할을 합니다.

**@Component**: Bean을 생성하며(클래스의 인스턴스화), 클래스 코드 바로 위에 붙여 사용합니다. 멤버 필드 내 값은 지정되지 않습니다. 사용 시 클래스 이름의 앞 글자만 소문자만 바꾸고 사용합니다. 예를 들어 VO 클래스의 이름이 `Product`이고 `@Component`를 설정한 경우 아이디는 `product`입니다. 참고로 `@Component`와 동일한 기능을 가지면서 좀 더 명확한 의미를 부여할 수 있는 태그들로 `@Repository`, `@Service` 등이 있습니다.

**@Repository**: 저장소라는 뜻으로 DAO(Database Access Object)에 부여합니다.

**@Service**: 서비스라는 뜻으로 DAO와 컨트롤러를 연결하는 서비스에 부여합니다.

**@Value("값")**: VO 클래스의 멤버 필드 바로 위에 붙여 사용합니다.

**@Component("아이디")**: 기본 아이디 외에 새로운 아이디를 지정합니다.

**@Scope("prototype")**: 싱글턴 패턴을 사용하고 싶지 않을 때 지정하며, `@Component` 밑에 붙여 사용합니다.

**@Autowired**: 프로젝트 내부 전체를 검색해서, 해당 타입의 인스턴스가 1개만 있는 경우 그 인스턴스를 자동으로 연결합니다.

```
@Autowired
private Product vo;
 
/*프로젝트 내부를 검색해서 아래 Product(@Component)를 자동으로 연결함*/
 
/*다음과 유사: private Product vo = project.getSomewhere(? instanceof Product) */
 
 
============================================
 
@Component
public class Product {
 
    private int pid; // 1001
 
    private String productName; // Shampoo
 
(...)

```

**@Autowired @Qualifier("아이디")**: 프로젝트 내 같은 타입의 인스턴스가 2개 이상 있는 경우 어떤 인스턴스를 선택해서 사용할 지 결정합니다,

**컨텍스트 어노테이션 설정 (컨텍스트 XML):**

```
<context:component-scan base-package="[루트 패키지명]">
</context:component-scan>
```

 

#### **기타 알아두면 유용한 어노테이션**

**@Override**: 이 메소드는 상위 클래스에서 오버라이딩 된 메소드라는 것을 명시적으로 보증하는 역할을 합니다. 잘못된 오버라이딩이거나 혹은 오버라이딩이 아닌데 이 어노테이션을 붙이면 컴파일 에러가 발생합니다.

**@Deprecated:** 프로그램을 만들 때 특정 메소드(기능)에 부여하며 호환성 문제 때문에 일단 사용은 가능하도록 했지만 옛날 방식, 옛날 기술 등이라 사람들에게 점차적으로 사용하지 않도록 유도하고자 할 때 사용하는 기능입니다. 외부 라이브러리를 사용하다 보면 많이 볼 수 있습니다.

**@SuppressWarnings**: 컴파일 경고를 무시합니다.

**@FunctionalInterface**: 함수형 인터페이스를 선언합니다.(자바 8 이상, [람다식 관련 글](http://yoonbumtae.com/?p=516) 참고)
