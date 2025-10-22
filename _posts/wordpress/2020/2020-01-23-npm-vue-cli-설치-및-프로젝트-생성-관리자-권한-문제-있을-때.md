---
published: false
title: "npm: Vue-cli 설치 및 프로젝트 생성 (관리자 권한 문제 있을 때)"
date: 2020-01-23
categories: 
  - "none"
---

#### **맥 터미널 관리자 권한으로 실행**

명령어 앞에 sudo 키워드

 

#### **폴더에서 터미널 열기**

[https://elsainmac.tistory.com/519](https://elsainmac.tistory.com/519)

 

#### **npm 설치된 글로벌 요소 삭제**

[https://stackoverflow.com/questions/54268008/vue-command-not-found-on-mac](https://stackoverflow.com/questions/54268008/vue-command-not-found-on-mac)

- `sudo npm install -g npm@latest`
- `sudo npm install -g npx@latest`

 

#### **npm-cli 설치**

- `npm install -g @vue/cli@latest`
- `npm install -g @vue/cli-init@latest`

 

#### **vue project 생성**

- `vue init webpack-simple vue-todo`

 

#### **파일 권한 수정**

- `sudo chmod -R 777 [타겟 디렉토리 경로]`

(현재 파일 위치 보기: `pwd`)

 

vue-cli
