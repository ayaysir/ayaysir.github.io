---
title: "PHP, Mysql: SELECT JOIN 문 실행시 중복된 이름의 열(컬럼) 결과를 가져오는 방법"
date: 2020-12-17
categories: 
  - "DevLog"
  - "PHP"
  - "Database"
---

#### **Q.**

내 데이터베이스에 두 개의 테이블이 있습니다.

컬럼이 있는 NEWS 테이블:

- `id` - 뉴스 ID
- `user` - 작성자의 사용자 ID

컬럼이 있는 USERS 테이블 :

- `id` -사용자 ID

이것에 대한 SQL을 실행하려고 합니다.

```sql
SELECT * FROM news JOIN users ON news.user = user.id
```

PHP에서 결과를 얻을 때 컬럼 이름을 `$row['컬럼이름']`으로 가져오는 경우, 동일한 컬럼 이름을 가진 뉴스 ID(`id`)와 사용자 ID(`id`)를 얻으려면 어떻게해야 합니까? (참고: PHP에서 JOIN된 SQL을 배열 형태로 가져올 때 중복되는 컬럼명이 있으면 나중에 조인된 쪽의 컬럼만 가져오며 나머지 중복된 이름의 컬럼명은 가져오지 않음)

 

#### **A.**

**(1) 첫 번째 방법: 별칭(alias)을 기입한 컬럼명을 일일히 지정**

```sql
SELECT news.id AS newsId, user.id AS userId, [나머지_컬럼들] 
FROM news JOIN users ON news.user = user.id
```

 

**(2) 두 번째 방법: `*` 을 통해 컬럼 전부를 가져온 뒤, 필요한 컬럼만 뒤에 별칭을 기입해 지정 (추천)**

```sql
SELECT *, user.id AS user_id 
FROM news JOIN users ON news.user = user.id
```

 

출처: [https://stackoverflow.com/questions/431391/how-to-resolve-ambiguous-column-names-when-retrieving-results](https://stackoverflow.com/questions/431391/how-to-resolve-ambiguous-column-names-when-retrieving-results)
