---
title: "스프링(Spring): JdbcTemplate에서 LIKE 키워드 사용 시 SQL Injection 방지 코드 작성하는 방법 (Mysql, Mariadb)"
date: 2020-08-12
categories: 
  - "DevLog"
  - "Spring/JSP"
---

먼저 아래 코드는 일단 동작하는 코드입니다. 표면적인 문제는 없지만 [SQL Injection](https://ko.wikipedia.org/wiki/SQL_%EC%82%BD%EC%9E%85)(이하 인젝션)의 문제점에 노출되어 있습니다.

```
public List<Product> findByTitleAndLocale(String keyword, String locale) {
    String sql = "select * " 
            "from product_list " +
            "where title like '%" + keyword + "%' " +
            "and locale like '%" + locale + "%'";

    return jdbcTemplate.query(sql, (rs, rowNum) -> {

        // ...생략...
    });
}
```

변수 `sql`이 `String`으로 되어있기 때문에 외부에서 `keyword`나 `locale` 변수를 조작할 수 있다면 인젝션이 될 여지가 충분히 있습니다. 기본적으로 sql에 `?`를 쓰고 `jdbctemplate.query()`에서 오브젝트 배열 형태의 파라미터를 사용하면 인젝션을 방지할 수 있습니다. ([근거 1](https://docs.spring.io/spring/docs/3.0.0.M4/reference/html/ch12s02.html), [근거 2](https://stackoverflow.com/questions/7254534/does-spring-jdbc-provide-any-protection-from-sql-injection-attacks)) 하지만 Mysql의 `LIKE`문은 `?`을 쓰면 오류가 발생할 수 있어서 약간 방법을 다르게 해야 합니다.

`?`는 기본적으로 스트링 양 끝에 따옴표 (`' '`) 를 붙이기 때문에 이러한 특성을 이용해서 `'%xxx%'`를 `?`로 치환한 뒤 아래 예제와 같이 포장하면 됩니다.

```
public List<Product> findByTitleAndLocale(String keyword, String locale) {
    String sql = "select * " +
            "from product_list " +
            "where title like ? " +
            "and locale like ?";

    String wrappedKeyword = "%" + keyword + "%";
    String wrappedLocale = "%" + locale + "%";

    return jdbcTemplate.query(sql, (rs, rowNum) -> {

        // ...생략...
    }, wrappedKeyword, wrappedLocale);
}
```

4~5 라인에서 `?`를 사용한 뒤, 7~8 라인에서 `%`와 키워드를 조합하여 새로운 스트링 변수를 생성합니다. 그리고 ?에 포장된 스트링 변수를 13 라인과 같이 파라미터로 지정합니다. 이렇게 하면  `keyword`, `locale` 부분이 `' '` 로 둘러쌓인 채 쿼리가 실행되므로 인젝션의 위험을 방지할 수 있습니다.

 

참고: [Spring JdbcTemplate 사용 시 주의 사항](https://github.com/HomoEfficio/dev-tips/blob/master/Spring%20JdbcTemplate%20%EC%82%AC%EC%9A%A9%20%EC%8B%9C%20%EC%A3%BC%EC%9D%98%20%EC%82%AC%ED%95%AD.md)
