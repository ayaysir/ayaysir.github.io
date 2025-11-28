---
title: "PHP: BCrypt 해싱값과 평문 비교"
date: 2020-02-10
categories: 
  - "DevLog"
  - "PHP"
tags: 
  - "php"
---

```php
password_verify($plain_text, $hashed_text)
```

$plain\_text에는 평문값을 입력하며, $hashed\_text에는 **BCrypt** 형식으로 해싱된 텍스트를 집어넣습니다. BCrypt는 특성상 해싱값에 솔트(salt)가 들어가기 때문에 일반적인 텍스트 비교는 솔트값을 모른다면 불가능하며, 위의 방법으로 대조해야 합니다. 평문과 해싱값이 일치하면 true, 아니면 false를 반환합니다.

 

## 예제

logic\_proc.php 18번 라인에 있습니다.

<!-- https://gist.github.com/ayaysir/59c7e34a71cb90b569b9f09f870c8a62 -->
{% gist "59c7e34a71cb90b569b9f09f870c8a62" %}