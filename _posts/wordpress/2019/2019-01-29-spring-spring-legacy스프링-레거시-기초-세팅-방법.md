---
published: false
title: "Spring: Spring Legacy(스프링 레거시) 기초 세팅 방법"
date: 2019-01-29
categories: 
  - "none"
tags: 
  - "spring"
---

_여기에 나오는 내용은 현 시점에서 굉장히 오래된 내용들이고 현재는 스프링의 모든 기능을 이용할 수 있으면서도 설정 과정이 훨씬 간편해진 '스프링 부트'가 있으니 이거 말고 스프링 부트를 이용하도록 하자_

* * *

스프링은 MVC 패턴에 기초해서 웹 사이트를 비롯한 각종 어플리케이션을 손쉽게(?) 만들수 있다.

설치: 이클립스에서 Help > Marketplace... > STS 검색 후 설치

 ![](/assets/img/wp-content/uploads/2019/01/spring-sts.png)

또는 스프링 ([https://spring.io/tools](https://spring.io/tools)) 사이트에서 STS standalone(STS가 포함된 이클립스)를 다운로드

* * *

Perspective 변경: Open Perspective > Spring으로 변경

* * *

프로젝트 생성: Spring Legacy Project > Spring MVC Project

* * *

프로젝트 Properties > Facet > 자바 버전 최신으로 적절히 변경

 ![](/assets/img/wp-content/uploads/2019/01/spring-facet.png)

pom.xml 파일에서

`<org.springframework-version>3.1.1.RELEASE</org.springframework-version>` 을

`<org.springframework-version>5.0.6.RELEASE</org.springframework-version>` 로 변경

* * *

pom.xml의 overview 탭 > Properties > 자바 버전도 변경

* * *

appContext.xml 생성: New > Spring Bean Configuration File
