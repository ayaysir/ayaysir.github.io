---
title: "JWT(JSON Web Token) 란?"
date: 2021-01-26
categories: 
  - "DevLog"
  - "Web"
---

## **JWT 란?**

JWT(JSON Web Token)는 공개 표준인 [RFC7519](https://tools.ietf.org/html/rfc7519)로, JSON 객체 형태로 당사자 간 정보를 안전하게 전송하기 위한 소혀의 자체 포함 형식으로 정의됩니다.

JWT는 두 당사자간에 전송할 클레임을 나타내는 URL에 안전(url-safe)한 압축 수단입니다. JWT의 클레임(claim; 페이로드의 한 조각)은 JWS(JSON Web Signature) 구조의 페이로드(payload; 정보) 또는 JWE(JSON Web Encryption) 구조의 JSON 개체로 인코딩되어, 클레임을 디지털 서명하거나 무결성을 보호할 수 있습니다. 메시지 인증 코드 (MAC; Message Authentication Code) 및(또는) 암호화를 사용합니다.

JWT의 장점으로는 수많은 프로그래밍 언어에서 지원되며, 자체가 모든 정보를 포함하는 자가수용적(self-contained) 특성을 지니며, HTML의 헤더 또는 URL의 파라미터로 쉽게 전송될 있습니다.

 

## **JWT의 구조**

JWT의 구조는 헤더, 페이로드 및 서명  세 가지를 포함하는 구조를 준수해야 합니다.

```js
[Base64Encoded(HEADER)].
[Base64Encoded(PAYLOAD)].
[Encoded(SIGNATURE)]
```

 

## **Encoded JWT 예제**

다음은 클라이언트 요청을 기반으로 반환되는 인코딩된 전체 `access_token` 입니다.

 ![](/assets/img/wp-content/uploads/2021/01/encoded-jwt3.png)

 

### **헤더 (HEADER)**

헤더는 일반적으로 토큰 유형(JWT; `typ`)과 사용중인 서명 알고리즘(`alg`) (예: HMAC SHA256 또는 RSA)의 두 부분으로 구성됩니다.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

이 부분을 Base64로 인코딩합니다.

 

### **정보 (PAYLOAD)**

토큰에 담을 정보를 페이로드(`payload`)라고 합니다. 페이로드는 클레임을 포함합니다. 클레임은 페이로드의 1조각을 의미하며, 이는 name / value 의 한 쌍으로 이루어져 있습니다. 클레임에는 등록된(`reserved`), 공개(`public`) 및 비공개(`private`)의 세 가지 유형이 있습니다 .

 

- 등록된(`reserved`) 클레임 - 유용하고 상호 운용 가능한 클레임을 제공하기 위해 필수는 아니지만 권장되는 미리 정의된 클레임 집합입니다. 그중 일부는 `iss` (발행자; issuer), `exp` (만료 시간; expiration), `sub` (주제; subject), `aud` (대상자; audience)  등 입니다.
- 공개(`public`) 클레임 - 공개 클레임들은 충돌이 방지된 (collision-resistant) 이름을 가지고 있어야 합니다. 충돌을 방지하기 위해서는, 클레임 이름을 URI 형식으로 짓습니다.
- 비공개(`private`) 클레임 - 등록된 클레임도아니고, 공개된 클레임들도 아닙니다. 클라이언트-서버 협의하에 사용되는 클레임 이름들입니다. 공개 클레임과는 달리 이름이 중복되어 충돌이 될 수 있으니 사용할때에 유의해야 합니다.

 

등록된 클레임의 예제는 다음과 같습니다.

```json
{
    "iss": "website.com",
    "exp": "1485270000000",
    "userId": "11028373727102",
    "sub": "bgsmm"
}
```

 

### **서명 (SIGNATURE)** 

서명 부분을 만들려면 인코딩된 헤더, 인코딩된 페이로드, 비밀(`secret`), 헤더에 지정된 알고리즘을 가져와 야합니다.

예를 들어 HMAC SHA256 알고리즘을 사용하려는 경우 서명은 다음과 같은 방식으로 생성됩니다.

```js
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

서명은 메시지가 변경되지 않았음을 확인하는 데 사용되며, 개인 키로 서명된 토큰의 경우 JWT의 발신자가 누구인지 확인할 수도 있습니다.

 

## 출처

- [JWT Introduction](https://jwt.io/introduction/)
- [\[JWT\] JSON Web Token 소개 및 구조](https://velopert.com/2389)
