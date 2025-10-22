---
title: "ResReq.api 사이트로 빠르고 편리하게 Restful API 테스트하기"
date: 2021-03-12
categories: 
  - "DevLog"
  - "JavaScript"
---

[reqres.in](https://reqres.in/) 이라는 사이트를 이용하면, 별도의 서버를 만들거나 샘플 데이터를 생성하지 않고도 빠르고 편리하게 Restful API 환경을 마련할 수 있습니다.

![](./assets/img/wp-content/uploads/2021/03/-2021-03-12-오후-4.15.46-e1615533376710.png)

 

 

아래는 공식 홈페이지에 소개되어 있는 서비스의 특징 및 장점입니다.

- 미리 데이터가 마련되어 있어 별도로 샘플 데이터를 만들 필요가 없습니다.
- 실제로 동작하는 Restful API이며 응답 코드 (`GET`, `POST`, `PUT` 및 `DELETE`)가 지원됩니다.
- 일정 요청(1개월당 1억건의 요청)까지 무료로 사용할 수 있습니다. 사실상 무료나 마찬가지입니다.
- 사용자로부터 받은 데이터를 일절 저장하지 않고 폐기합니다.

 

Reqres 에서는 다양한 시나리오를 제공하는데, 목록은 다음과 같습니다.

- GET
    - LIST USERS
    - SINGLE USER
        - SINGLE USER NOT FOUND
    - LIST <RESOURCE>
    - SINGLE <RESOURCE>
        - SINGLE <RESOURCE> NOT FOUND
    - DELAYED RESPONSE
- POST
    - CREATE
    - REGISTER - SUCCESSFUL
    - REGISTER - UNSUCCESSFUL
    - LOGIN - SUCCESSFUL
    - LOGIN - UNSUCCESSFUL
- PUT
    - UPDATE
- PATCH
    - UPDATE
- DELETE
    - DELETE

 

 

##### **\[GET\] LIST USERS**

- `https://reqres.in/api/users?page=2`

사용자(USER) 목록을 받아옵니다. `page` 라는 파라미터를 가지며 생략된 경우 `1`페이지를 가져옵니다.

 

##### **\[GET\] SINGLE USER**

- `https://reqres.in/api/users/2`

`users/` 뒤에 숫자로 된 아이디를 입력하면 특정 `USER` 데이터를 가져옵니다. 아이디는 생략할 수 없습니다. 존재하지 않는 아이디를 입력한 경우 `404`(Not found) 에러를 반환합니다.

 

##### **\[GET\] LIST <RESOURCE>**

- `https://reqres.in/api/unknown?page=2`

리소스(RESOURCE) 이름으로 임의의 이름을 입력하면 고정된 데이터를 반환합니다. 어떠한 리소스 이름을 입력하더라도 반환되는 데이터는 아래에 있는 그림과 같습니다. `page` 라는 파라미터를 가지며 생략된 경우 `1`페이지를 가져옵니다.

![](./assets/img/wp-content/uploads/2021/03/-2021-03-12-오후-4.25.53-e1615533970724.png)

 

##### **\[GET\] SINGLE <RESOURCE>**

- `https://reqres.in/api/unknown/2`

숫자로 된 아이디를 입력하면 특정 아이디의 RESOURCE 데이터를 가져옵니다. 아이디는 생략할 수 없습니다. 존재하지 않는 아이디를 입력한 경우 `404`(Not found) 에러를 반환합니다.

 

##### **\[GET\] DELEYED RESPONSE**

- `https://reqres.in/api/users?delay=3`

ReqRes에서 제공하는 모든 GET API의 주소 뒤에 `?delay=숫자` 을 붙이면 x 초 지연된 응답을 보냅니다.

 

##### **\[POST\] CREATE**

- `https://reqres.in/api/users`

`USERS` 에서 한 명을 등록합니다. 다만, 실제로 데이터베이스에 등록되지는 않고 `201`(Created) 응답과 JSON을 반환합니다.

```
{
    "name": "morpheus",
    "job": "leader"
}
```

![](./assets/img/wp-content/uploads/2021/03/-2021-03-12-오후-4.36.01-e1615534578492.png)

 

##### **\[POST\] REGISTER - SUCCESSFUL/UNSUCCESSFUL**

- `https://reqres.in/api/register`

로그인할 사용자를 등록합니다. 다만, 실제로 데이터베이스에 등록되지는 않으며. `email`은 반드시 `"eve.holt@reqres.in"` 로 입력한 경우에만 응답코드 `200`를 반환하며, 그 외의 값들은 전부 `400`(Bad Request)를 반환합니다. 또한 `password`나 `email` 필드 중 하나를 생략한 경우에도 `400`을 반환합니다.

입력 JSON 은 다음과 같습니다.

```
{
    "email": "eve.holt@reqres.in",
    "password": "pistol"
}
```

 

정상적으로 등록된 경우, `200`코드와 함께 다음과 같은 응답을 반환합니다.

```
{
  "id": 4,
  "token": "QpwL5tke4Pnpja7X4"
}
```

 

##### **\[POST\] LOGIN - SUCCESSFUL/UNSUCCESSFUL**

- `https://reqres.in/api/login`

`REGISTER`와 마찬가지로 이메일, 패스워드를 전송하면 로그인 성공 시 `200`, 그 외 `400`을 반환합니다. 응답 JSON으로 `token`을 제공합니다.

 

##### **\[PUT/PATCH\] UPDATE**

- `https://reqres.in/api/users/2`

숫자 부분에 아이디를 입력하면 업데이트 과정이 이루어집니다. 역시 실제로 DB에 저장되는게 아니고 흉내만 내는 것입니다.

참고로 Restful API에서 `PUT`은 리소스의 전부를 업데이트한다는 의미이며, `PATCH`는 리소스의 일부를 업데이트 한다는 것을 의미합니다.

![](./assets/img/wp-content/uploads/2021/03/스크린샷-2021-03-12-오후-4.47.21.png)

##### **\[DELETE\] DELETE**

- `https://reqres.in/api/users/2`

특정 아이디를 가진 USER를 삭제합니다. 삭제시 `204`(No Content; 리퀘스트를 성공적으로 완료하였고, 반환값은 없음) 응답코드를 반환합니다.

![](./assets/img/wp-content/uploads/2021/03/스크린샷-2021-03-12-오후-4.51.53.png)
