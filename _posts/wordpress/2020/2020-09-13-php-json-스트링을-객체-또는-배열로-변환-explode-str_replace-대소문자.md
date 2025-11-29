---
title: "PHP: JSON 스트링을 객체 또는 배열로 변환, explode, str_replace, 대소문자 변경방법"
date: 2020-09-13
categories: 
  - "DevLog"
  - "PHP"
---

## **1) JSON을 배열로 변환**

### **객체(`stdClass`)로 변환하는 방법**

```php
$array_data = json_decode($str, false);

// 또는

$array_data = json_decode($str);
```

### **배열로 변환하는 방법**

```php
$array_data = json_decode($str, true);
```

 

## **2) explode**

다른 언어의 `String.split`과 기능이 비슷합니다. 스트링의 경계기호(`delimiter`) 문자를 기준으로 배열을 생성합니다.

```php
$date = "2020-08-25";

// explode(delimiter, string)

$exploded = explode('-', $date);

echo $exploded[0]; // 2020
echo $exploded[1]; // 08
echo $exploded[2]; // 25
```

 

## **3) str\_replace**

다른 언어의 `String.replace`와 기능이 비슷합니다. 특정 문자를 치환합니다.

```php
$value = "가나다라가나다라마";

echo str_replace("마", "Z", $value); // 가나다라가나다라Z
echo str_replace("라", "-", $value); // 가나다-가나다-마
```

 

## **4)  ucfirst, lcfist, ucwords**

`ucfirst`는 스트링의 첫 문자를 대문자로 바꿉니다. 단어를 구별하지 않고 스트링의 제일 첫 문자만 변환합니다.

```php
$foo = 'hello world!';
$foo = ucfirst($foo);  // Hello world!
```

### 비슷한 기능

- `lcfirst(string $str)` - 스트링의 첫 문자를 소문자로 변경
- `strtolower(string $str)` - 스트링 전체를 소문자로 변경
- `strtoupper(string $str)` - 스트링 전체를 대문자로 변경
- `ucwords(string $str [, string $delimiters = " \t\r\n\f\v" ])` - 단어별로 첫 문자를 대문자로 변경
