---
published: false
title: "Eclipse: Grep Console (콘솔 제어 플러그인)에서 로그의 특정 부분만 간추려 보기"
date: 2019-06-10
categories: 
  - "none"
---

이클립스의 콘솔 기능은 자바 콘솔을 그냥 붙여다 놓은 수준이라 쓰기 여간 불편한게 아니다. 아래 그림처럼 어떤 프레임워크는 `DEBUG`로 설정된 로그를 그냥 여과없이 보여주는데.. 문제는 디버그 로그 **몇 백개**가 리퀘스트 하나마다 한꺼번에 뛰쳐나온다. 코드 짜다 테스트용으로 `printout`을 넣었는데 DEBUG에 묻혀 찾기가 어렵다.

![](/assets/img/wp-content/uploads/2019/06/grepr1.png)

`Log4j`에서 설정을 변경해보라고 할 수 있는데 지금 상황은 내가 함부로 바꿀 권한이 없으므로, 내 이클립스에서 로그만 필터링해보도록 한다. 내가 원하는 것은 `DEBUG`, `WARN`, `FATAL` 등 프레임워크에서 내보내는 로그를 일단 제외하고 나머지 로그(`println` 등)만 보는 것이다.

 

1\. 이클립스 Help > Marketplace...  에서 Grep Console 로 검색한 후 설치

 ![](/assets/img/wp-content/uploads/2019/06/grep1.png)

 

2\. 설치하면 콘솔 구석에 `(?)` 아이콘이 나타나는데 여기서 Grep Console 관련 설정이 가능하다.

./assets/img/wp-content/uploads/2019/06/grep2.png)

 

3\. 기본 설정은 Log Output만 존재하는데 폴더를 새로 만들고 그 안에 표현(`Expression`)도 하나 추가한다.

 ![](/assets/img/wp-content/uploads/2019/06/grep3.png)

 

4\. 표현식 추가에서 `Expression`은 정규표현식(자바 호환용)을 넣는다. `(.+)`은 한 글자 이상 있는 모든 라인이 참이라는 것이다. `Unless`에서는 제외할 정규표현식을 넣는다. 라인에서 대문자로 DEBUG 또는 기타 등등의 단어가 있으면 그 라인은 제외한다. 그리고 `Show in Grep View`란에 체크한다.

![](/assets/img/wp-content/uploads/2019/06/grep4.png)

5\. `Grep View`가 하단 윈도우에 등록되어 있지 않으므로, Quick Access에서 `grep`을 입력해 `Grep View`를 하단 윈도우에 추가한다.

 ![](/assets/img/wp-content/uploads/2019/06/grep5.png)

 

6\. `Grep View` 탭을 클릭하면 프레임워크의 메시지는 제외된 상태이며, `println` 이나 기타 메시지등만 필터링되어 나오는 것을 볼 수 있다. 콘솔 자체에서 필터링하고 싶은데 콘솔에서 스타일은 설정 가능하지만 특정 라인을 아예 배제시키는 기능은 아직 찾지 못했다.

 ![](/assets/img/wp-content/uploads/2019/06/grepr2.png)
