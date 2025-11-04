---
title: "macOS에서 mariadb 설치하기"
date: 2019-01-13
categories: 
  - "DevLog"
  - "Database"
---

## 설치 방법

### 0\. 맥 앱 스토어에서 Xcode 설치

### 1\. brew 설치: 터미널을 열고 다음 명령어를 입력

```sh
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 2\. mariadb 설치

```sh
brew install mariadb
```

### 3\. 서버 가동

```sh
mysql.server status # 상태확인
mysql.server stop # 정지
mysql.server start # 시작

mysql -uroot
```

### 4\. root 비밀번호 변경

```sh
update user set authentication_string=password('비밀번호') where user='root';
```

---
#### 출처

- [https://cpuu.postype.com/post/24270](https://cpuu.postype.com/post/24270) 
- [https://gomdoreepooh.github.io/notes/mysql-reset-password](https://gomdoreepooh.github.io/notes/mysql-reset-password)
