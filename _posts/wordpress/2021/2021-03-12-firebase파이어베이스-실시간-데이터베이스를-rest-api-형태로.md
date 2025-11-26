---
title: "Firebase(파이어베이스): 실시간 데이터베이스를 Rest API 형태로 사용하기 + DB에 서버 시간 저장하기"
date: 2021-03-12
categories: 
  - "Firebase"
---

Firebase(파이어베이스)에서 실시간 데이터베이스(Realtime Database)를 Rest API 형태로 사용하기 방법은 매우 간단합니다. 파이어베이스 접속 주소 뒤에 `.json` 확장자를 붙이면 Rest API 형태로 사용할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-8.50.06.png)

 

이 예제는 편의를 위해 별도의 규칙이나 유효성 검사가 설정되어 있지 않으며, 아래처럼 읽기 및 쓰기가 익명의 사용자들에게 전부 열려있는 형태입니다.

매우 위험한 상태로 테스트 목적 외에는 아래처럼 설정하면 안되고, 구조 및 유효성 검사 항목, 접근권한 설정등이 필요합니다.

 

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-8.00.31.png)

## **GET - 리스트 가져오기**

```
https://[프로덕트_ID].firebaseio.com/messages.json
```

 

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-8.56.39.png)

 

## **GET - 단일 데이터 가져오기**

```
https://[프로덕트_ID].firebaseio.com/messages/-MVa6Jf8slFiQclwT5wA.json
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-8.59.58.png)

 

## **POST - 객체 등록하기**

```
https://[프로덕트_ID].firebaseio.com/messages.json
```

```
{
  "name": "minsu",
  "server_timestamp": {
     ".sv": "timestamp"
  },
  "value": "안녕하세요"
}
```

DB에 서버 시간 저장하기: 위의 입력 JSON에서 `"server_timestamp"`의 값을 하이라이트 부분처럼 입력하면 파이어베이스의 현재 서버 시간이 입력됩니다.

또한 모든 작업을 진행해도 성공시 `200` 응답 코드만 반환하므로 주의해야 합니다.

 

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-9.01.36.png)

 

## **PUT - 업데이트 (객체 교체하기)**

`PUT`은 객체 전체를 교체하므로 데이터가 삭제될 위험이 있어 추천하지 않습니다. `PATCH` 이용을 권장합니다.

```
https://[프로덕트_ID].firebaseio.com/-MVa6Jf8slFiQclwT5wA.json
```

```json
{
  "value": "put 되었음."
}
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-9.03.53.png)

입력 JSON은 `value`만 업데이트하고자 의도하였으나 전체 객체가 입력 JSON으로 대치되었습니다.

 

## **PATCH - 업데이트 (일부 값만 업데이트)**

```
https://[프로덕트_ID].firebaseio.com/-MVa6Jf8slFiQclwT5wA.json
```

```json
{
  "value": "patch 되었음"
}
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-12-pm-9.08.25.png)

`value`만 변경하고자 한다면, `PUT` 대신 `PATCH`를 사용하면 됩니다.

 

## **DELETE - 객체 삭제**

```
https://[프로덕트_ID].firebaseio.com/messages/-MVaJ1kEJ1icQVOgjIQf.json
```

별도의 리퀘스트 바디는 필요하지 않고, 삭제가 정상적으로 완료된 경우 `200` 응답 코드의 `null` 을 반환합니다.
