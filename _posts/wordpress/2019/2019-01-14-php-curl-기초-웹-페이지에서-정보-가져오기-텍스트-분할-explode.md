---
title: "PHP: cURL 기초 (정적 웹 페이지에서 정보 가져오기)"
date: 2019-01-14
categories: 
  - "DevLog"
  - "PHP"
tags: 
  - "php"
---

웹사이트에서 POST를 통한 로그인을 한 뒤 정보를 가져오는 예제입니다. 만약 로그인이 필요한 웹 페이지라면, 로그인 정보를 POST로 보내고 쿠키로 저장하는 과정이 추가로 필요합니다.

## 코드

```php
<?php
 
$html_brand = "[리퀘스트를 보낼 주소]";
    
$ch = curl_init();    // cURL 생성
$options = array(
    CURLOPT_URL            => $html_brand,
    CURLOPT_POSTFIELDS     => "param1=value1&param2=value2&...", // Post로 보낼 값들을 Get 방식처럼 적는다.
    CURLOPT_COOKIEJAR => "cookies.txt",
    CURLOPT_COOKIEFILE => "cookies.txt",
    CURLOPT_COOKIE     => "cookiename=cookievalue",    // 쿠키가 필요한 사이트는 COOKIEJAR부터 여기까지 세 줄을 삽입한다.
    CURLOPT_RETURNTRANSFER => true,    // 반환값을 받을 것인가?
    CURLOPT_HEADER         => true,    // 헤더를 표시할 것인가?
    CURLOPT_FOLLOWLOCATION => true,    
    CURLOPT_ENCODING       => "",    
    CURLOPT_AUTOREFERER    => true,    
    CURLOPT_CONNECTTIMEOUT => 120, 
    CURLOPT_TIMEOUT        => 120,
    CURLOPT_MAXREDIRS      => 10,    
);
curl_setopt_array( $ch, $options );    // 옵션 설정
$response = curl_exec($ch); // 실행시키고 반환값은 $response에 저장
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
 
if ( $httpCode != 200 ){
    echo "Return code is {$httpCode} \n"
        .curl_error($ch);
} else {    // 200을 받으면 정상 동작한 것
    $pieces = explode('&lt;div class=&quot;tbl1&quot;&gt;', htmlspecialchars($response));
    // explode(쪼개야 하는 값, 쪼갤 대상 스트링) -> split과 동일
    // htmlspecialchars -> 괄호, 따옴표 등을 &lt; 이스케이프 문자로 대체
    $output_str = preg_replace( "/\r|\n|\t/", "", 
        htmlspecialchars_decode($pieces[1], ENT_NOQUOTES));
    // preg_replace -> 정규식을 통한 대체
    // htmlspecialchars_decode -> htmlspecialchars로 변형된 텍스트를 다시 원상복구, 
    // ENT_NOQUOTES는 따옴표는 변환하지 않는 옵션
 
    echo $output_str;
}
 
curl_close($ch);
 
?>
```

## 동작화면

 ![](/assets/img/wp-content/uploads/2019/01/curl-example-1.png)
