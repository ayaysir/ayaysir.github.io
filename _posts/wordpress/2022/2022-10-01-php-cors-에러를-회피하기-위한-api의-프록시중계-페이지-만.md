---
title: "PHP: CORS 에러를 회피하기 위한 API의 프록시(중계) 페이지 만들기 (cURL 이용)"
date: 2022-10-01
categories: 
  - "DevLog"
  - "PHP"
---

##### **참고**

- [자바스크립트: JSONP (JSON Padding) 사용법](http://yoonbumtae.com/?p=2452)
- [PHP: cURL 기초 (정적 웹 페이지에서 정보 가져오기)](http://yoonbumtae.com/?p=637)
- [자바스크립트(JavaScript)에서 쿼리 파라미터(query parameter) 값을 알아내는 방법](http://yoonbumtae.com/?p=3318)

 

### **PHP: CORS 에러를 회피하기 위한 API의 프록시(중계) 페이지 만들기**

HTML + 자바스크립트를 이용해 웹 페이지를 만들 때 외부 API를 사용하는 과정에서 흔히 **_CORS 위반_**이라 불리는 에러를 많이 접할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2020/06/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA-2020-06-03-%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE-10.49.30.png)

 

위 에러가 발생하는 원인은 다음과 같습니다.

1. 웹 서버에서 내 서바가 리퀘스트할 수 있는 권한을 허용해주지 않아 CORS 에러가 발생합니다. 가장 빈번하고 직접적인 원인입니다.
2. 코딩 실수로도 발생할 수 있습니다. API 주소나 파라미터에서 오타가 났을 때 위 에러가 발생하는 경우가 있습니다.
3. 웹 페이지가 HTTPS를 사용하는 서버에 업로드되어 있을 때는, 같은 HTTPS의 요청만 허용됩니다. HTTP를 사용한 URL 요청은 허용되지 않습니다.
4. 간혹 API 서버 자체의 문제로도 위 에러가 유발될 수 있습니다. 예를 들면 API 서버가 HTTPS를 사용하는데 인증서가 만료되었거나 유효하지 않거나 등등

 

> **참고: CORS(Cross-Origin Resource Sharing, 교차 출처 리소스 공유)**
> 
> 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제입니다. CORS의 예시로 https://domain-a.com의 프론트 엔드 JavaScript 코드가 XMLHttpRequest를 사용하여 https://domain-b.com/data.json을 요청하는 경우가 있습니다. 보안 상의 이유로, 브라우저는 스크립트에서 시작한 교차 출처 HTTP 요청을 제한합니다. XMLHttpRequest와 Fetch API는 동일 출처 정책을 따릅니다.

 

CORS 문제를 해결하는 대표적인 방법은 아래 3가지가 있습니다.

1. JSONP 이용 - [자바스크립트: JSONP (JSON Padding) 사용법](http://yoonbumtae.com/?p=2452)
2. **백엔드 서버에 프록시(중계) 페이지를 만들어 경유**
3. 서버 측에 요청해서 CORS 권한 획득

 

이 글에서는 PHP를 사용한 2번에 대한 방법을 알아볼 것입니다.

API 예제로는 [국립국어원의 오픈API](https://stdict.korean.go.kr/openapi/openApiInfo.do)를 사용할 것입니다.  얼마전에 알게된 황당한 사례인데 이름이 '오픈' API인데 정상적으로 회원가입하고 인증키를 얻어와도 CORS 문제 때문에 사용할 수 없습니다. 검색한 결과 방치되고 있는지 오랫동안 해결되지 않는 문제라고 합니다. 후술할 예정이지만 아마 API 서버의 인증서 문제로 에러가 발생하는 것으로 추측되는데 이 API를 프록시 기법을 이용해 접근 가능하도록 해보겠습니다.

CORS는 웹 브라우저의 자바스크립트 단에서만 적용되고 일반적인 웹 서버에서는 적용되지 않는 경우가 많습니다. 이번에 사용할 API 예제도 웹 브라우저에서 주소를 입력하면 잘만 열리는데 자바스크립트 내에서 호출하려고 하면 CORS 에러를 일으킵니다.

\[caption id="attachment\_4869" align="alignnone" width="959"\] ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.06.50.jpg) 웹 브라우저(크롬)에서는 JSON이 표시됨\[/caption\]

 

\[caption id="attachment\_4868" align="alignnone" width="682"\] ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.11.29.jpg) 자바스크립트 내에서 호출하려 하면 CORS 에러 발생\[/caption\]

 

PHP에서 **_cURL_**이라는 기능이 있는데 리퀘스트-리스폰스를 통해 웹 페이지 소스를 받아오는 기능입니다. PHP 서버 내에서 이 기능을 이용하면 웹 브라우저에서 접속한 것과 같이 취급되기 때문에 CORS 문제가 발생하지 않습니다.

 

#### **절차**

1. 내 PHP 서버에 있는 중계 페이지로 쿼리 파라미터(Query Parameters)를 받고 그 목록을 읽어옵니다.
2. 파라미터 목록을 그대로 외부 API의 URL에 담아 리퀘스트를 보냅니다.
3. 리스폰스를 받으면 그 리스폰스의 바디(body)를 그대로 중계 페이지에 출력합니다.
4. 그 중계 페이지의 URL을 원래 API의 URL 대신 사용합니다.

 

##### **원래 API 주소**

`[API_KEY]`는 회원가입 후 받아올 수 있습니다.

> https://stdict.korean.go.kr/api/search.do?certkey\_no=4422&key=\[API\_KEY\]&type\_search=search&req\_type=json&q=\[검색어\]

 

##### **프록시 API 주소**

> http://\[내\_주소\]/proxy/?certkey\_no=4422&key=\[API\_KEY\]&type\_search=search&req\_type=json&q=\[검색어\]

 

#### **1: PHP 서버 내에 프록시(중계) 페이지 만들기**

먼저 **_\[내\_주소\]/proxy/index.php_** 경로에 PHP 파일을 생성합니다. 이 PHP 파일의 주소가 새로 사용할 API 주소입니다.

 ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.16.50.jpg)

 

다음 쿼리 파라미터를 URL로 변환하는 함수를 추가합니다.

```
// 쿼리 파라미터 텍스트 만들기 함수
function makeQueryParameters($get_parameters) {
    $query_text = "?";
    foreach($get_parameters as $key => $value) {
        $query_text .= $key . "=" . urlencode($value) . "&"; 
    }
    
    return $query_text;
}

```

URL에서 쿼리 파라미터란 아래 빨간색 박스처럼 `?` 뒤에 지정하는 파라미터를 뜻합니다. 여러 개를 연결할 때는 `&` 를 씁니다. 쿼리 스트링(query string)이라고도 합니다.

`echo`로 출력하면 다음과 같이 표시됩니다.

```
echo makeQueryParameters($_GET);
```

 ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.22.21.jpg)

 

다음 PHP 헤더 부분을 지정합니다.

```
// 헤더 설정: 컨텐츠 타입 JSON, CORS 허용 권한 설정
header('Content-Type: text/json');
header('Access-Control-Allow-Origin: *');
```

1. JSON 바디를 그대로 출력할 예정이기 때문에 컨텐츠 타입이 JSON 임을 알려줍니다.
2. 다른 API 서버와 마찬가지로 프록시 PHP 서버에도 CORS 권한 설정이 필요합니다. 이 부분을 설정하지 않으면 CORS 문제가 발생하기 때문에 프록시 서버를 만드는 의미가 없습니다.

 

> **참고: CORS 권한 설정 부분**
> 
> - _예) `header('Access-Control-Allow-Origin: http://example.com');`_
> - URL 대신 `*`를 입력하면 모든 URL에 대한 접근을 허용한다는 의미입니다.
> - _`...-Origin: *` => 중간에 `origin`과 `:` 사이에 띄어쓰기 하면 에러가 발생합니다._
> - _Request Headers의 `Origin URL`을 그대로 적습니다, URL 끝에 원래 `/`이 없는데 `/`를 붙이면 에러가 발생합니다._
>     - _예) `http://example.com` 와 `http://example.com/` => 둘은 다른 URL입니다.  ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-01-오후-9.59.05.jpg)_ 

 

#### **2: 원래 API의 URL로 리퀘스트 전송**

API 서버 URL을 생성합니다.

```
$request_url = "https://stdict.korean.go.kr/api/search.do" . makeQueryParameters($_GET);
```

- **_http://\[내\_주소\]/proxy/_** 부분을 원래 API 주소인 **_https://stdict.korean.go.kr/api/search.do_**로 바꾼 것이며 나머지 부분(쿼리 파라미터)는 동일합니다.

 

다음 **_cURL_**을 이용해 위 주소로 리퀘스트를 전송합니다.

```
$ch = curl_init();    // cURL 생성
$options = array(
    CURLOPT_URL            => $request_url,
    CURLOPT_RETURNTRANSFER => true,    // 반환값을 받을 것인가?
    CURLOPT_HEADER         => true,    // 헤더를 표시할 것인가?
    CURLOPT_FOLLOWLOCATION => true,    
    CURLOPT_ENCODING       => "",    
    CURLOPT_AUTOREFERER    => true,    
    CURLOPT_CONNECTTIMEOUT => 120, 
    CURLOPT_TIMEOUT        => 120,
    CURLOPT_MAXREDIRS      => 10,    
);

// ... //

curl_setopt_array( $ch, $options );    // 옵션 설정
$response = curl_exec($ch); // 실행시키고 반환값은 $response에 저장

// 리스폰스에서 헤더 자르는 방법
// https://stackoverflow.com/questions/5142869/how-to-remove-http-headers-from-curl-response
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$headerstring = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Closing
curl_close($ch);

```

원래대로라면 위 리퀘스트가 성공하면 $body에 원래 JSON이 담기게 됩니다. 하지만 예제 API는 리퀘스트가 실패하고 아래 에러가 발생합니다.

> _SSL certificate problem: unable to get local issuer certificate._

제가 사용하는 PHP 서버는 호스팅 업체로부터 빌려온 것이라 외부 네트워크로 연결되어 있기 때문에 로컬 관련한 문제는 아닙니다. 그렇다면 해당 API 서버의 인증서에 문제가 있다는 것인데 아마 이 인증서 문제 때문에 CORS 에러가 발생한 게 아닌가 추측됩니다. 아님말고 HTTPS 서버라도 구글같은 곳에 리퀘스트를 보내면 인증서 문제 없이 정상적으로 리스폰스가 도착합니다.

인터넷에 검색하면 위의 에러 해결방법에 대한 다양한 해결방법이 있는데, 다행히도 에러 해결 방법을 찾았습니다. 만약 이 문제를 해결할 수 없다면 API 서버 자체의 문제이기 때문에 더 이상 진행이 불가능합니다.

- [PHP cURL: Fixing the “SSL certificate problem: unable to get local issuer certificate” error.](https://thisinterestsme.com/php-curl-ssl-certificate-error/)

cURL 코드에서 `//...//` 부분을 다음 코드로 대치합니다.

```
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
```

이 부분을 삽입하면 인증서 오류는 더 이상 발생하지 않습니다. 인증서 오류가 발생했을 때만 사용하세요.

 

#### **3: 리스폰스의 바디(body)를 그대로 중계 페이지에 echo 출력**

HTTP Status 코드가 `200`이면 리퀘스트가 성공하였다는 의미이며, 성공했다면 헤더 정보를 제거된 `$body`를 `echo`로 출력합니다.

```
if($httpcode == 200) {
    echo $body;
}
```

웹 브라우저 주소창에 프록시 API 주소를 입력해서 정상 출력되는지 확인합니다. 원래 API의 URL과 동일한 결과가 출력되어야 합니다.

\[caption id="attachment\_4872" align="alignnone" width="843"\] ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.46.54.jpg) 프록시 페이지로 접속한 결과\[/caption\]

 

\[caption id="attachment\_4873" align="alignnone" width="951"\] ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.47.27.jpg) 원래 API 출력 결과와 비교\[/caption\]

 

#### **4: 중계 페이지의 URL을 원래 API의 URL 대신 사용**

자바스크립트에서 원래 API 주소 대신 중계 페이지의 URL을 사용합니다.

```
const q = prompt("검색어 입력?")

// const originalUrl = "https://stdict.korean.go.kr/api/search.do?key=[API_KEY]&type_search=search&req_type=json&q=오픈";
// 삭제

const proxyUrl = "http://[내_주소]/proxy/?certkey_no=4422&key=[API_KEY]&type_search=search&req_type=json&q=" + q;
// 새로운 API 주소로 사용

(async function() {
    try {
        const init = await fetch(proxyUrl, {
            method: "get"
        })
        const data = await init.json()
        console.log(data)
        
        // ... //
    } catch (exc) {
        console.warn(exc)
    }
})();
```

CORS 문제가 발생하지 않고 API 호출이 정상적으로 동작하는지 확인합니다.

http://www.giphy.com/gifs/qVBeQOcfARbpjQEfKH

\[caption id="attachment\_4874" align="alignnone" width="514"\] ![](/assets/img/wp-content/uploads/2022/10/mosaiced-스크린샷-2022-10-02-오전-12.55.53.jpg) 콘솔 표시 결과\[/caption\]

 

#### **전체 코드**

https://gist.github.com/ayaysir/993af1f56c61ae02dd8992148ed6fa53
