---
title: "스프링 부트에서 H2를 테스트하려고 하는데 Database not found, either pre-create it ... 에러가 발생할 때"
date: 2020-07-11
categories: 
  - "DevLog"
  - "Spring/JSP"
---

macOS 기준입니다.

스프링 부트에서 H2 콘솔을 사용하려고 하는데 아래 에러가 발생하는 경우

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.09.07.png)

```
Database ... not found, either pre-create it or allow remote database creation (not recommended in secure environments)
```

원인은 보안 측면상 웹 콘솔 환경에서 데이터베이스를 생성할 수 없도록 막아놨기 때문에 발생한다고 합니다.

해결 방법은 홈브루(brew)를 통해 별도의 H2를 설치한 후, 그 별도의 H2 콘솔에서 데이터베이스를 생성하는 것입니다.

서버의 포트를 주의하세요. `8080`은 스프링 부트의 서버 포트이며, `8082`는 홈브루를 통해 설치한 H2의 서버 포트입니다.

## 방법

### **1) 홈브루를 통해 H2 설치**

터미널에 아래 명령어를 입력하세요.

```sh
brew install h2
```

 

### **2) H2 실행**

터미널에 아래 명령어를 입력하세요.

```sh
H2
```

 

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.22.14.png)

 

### **3) localhost:8082에 접속한 후 `[연결]` 버튼을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.07.42.png)

 

### **4) 콘솔에 정상 접속되었으면, `Disconnect`(아래 그림의 빨간 네모 부분) 버튼을 클릭해 데이터베이스를 종료합니다.**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.08.34.png)

 

### **5) 터미널에서 `control + z` 버튼을 눌러 H2에서 빠져나온 후, `ps` 명령과 `kill` 명령을 이용해 실행중인 H2 프로세스를 종료합니다. (혹은 터미널 창을 닫습니다.)**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.29.27.png)

 

### **6) 8080 포트(스프링 부트)로 돌아간 후 오류가 나지 않고 데이터베이스 접속이 정상적으로 되는지 확인합니다.**

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.32.16.png)
