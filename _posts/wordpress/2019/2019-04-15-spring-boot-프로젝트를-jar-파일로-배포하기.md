---
title: "Spring Boot: 프로젝트를 jar 파일로 배포하기"
date: 2019-04-15
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring-boot"
---

이 글은 윈도우 기준으로 작성되었지만 다른 OS 에서도 적용할 수 있습니다.


Spring Boot 프로젝트를 생성시 처음에 설정하는 배포 옵션을 **`jar`** 파일로 배포로 설정했다고 가정합니다. 처음에 `war`로 설정했을시에는 추가 설정이 필요한 관계로 나중에 따로 포스팅하겠습니다.

그 전에 이클립스에서 설정되어 있는 `JRE`를 `JDK`로 바꿔야 합니다. 바꾸지 않으면 추후 에러의 원인이 되므로 미리 바꾸는것이 좋습니다.

## 절차

### 1\. 경로 변경

`Window > Preference` 에서 `Installed JREs`의 경로에서 `JRE`를 `JDK`로 변경합니다.

![](/assets/img/wp-content/uploads/2019/04/bootjar4-e1567438323122.png)

 

### 2\. 빌드 선택

프로젝트 `마우스 오른쪽 클릭` > `Run As` > `Maven Build...` 를 선택합니다.

![](/assets/img/wp-content/uploads/2019/04/bootjar1-e1567438380807.png)

 

### 3\. Goals 설정

`Goals` 란에 `package`라고 입력하고, 나머지는 변경하지 않습니다.

![](/assets/img/wp-content/uploads/2019/04/bootjar3-e1567438433282.png)

 

### 4\. 빌드 결과 확인

결과가 아래처럼 나왔다면 성공입니다. 메시지 중 `[WARNING]`은 정상 실행 여부와는 무관하므로 일단 무시해도 좋습니다.

![](/assets/img/wp-content/uploads/2019/04/bootjar2.png)

 

### 5\. jar 파일 생성 확인

 `jar` 파일은 아래 그림에 있는 경로에 저장됩니다. 이 jar 파일을 사용하면 됩니다.

![](/assets/img/wp-content/uploads/2019/04/bootjar5.png) 


### 6\. jar 파일 동작 테스트

 `jar` 파일이 정상적으로 실행되는지 테스트합니다.

![](/assets/img/wp-content/uploads/2019/04/bootjar7-e1567438586882.png)

배포 옵션을 jar로 설정했다면 WAS 컨테이너(기본적으로 톰캣)를 jar에 내장한채로 배포하므로 톰캣 등이 별도로 설치되어 있을 필요가 없습니다.
