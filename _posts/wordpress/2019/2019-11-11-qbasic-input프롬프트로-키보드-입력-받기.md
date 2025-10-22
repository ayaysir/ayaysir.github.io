---
title: "QBasic: INPUT(프롬프트로 키보드 입력 받기)"
date: 2019-11-11
categories: 
  - "DevLog"
  - "BASIC"
tags: 
  - "qbasic"
  - "qbasic-기초"
---

\[rcblock id="3452"\]

 

**INPUT** 구문은 다음과 같이 사용합니다.

`INPUT "화면에 나타낼 안내문구 텍스트", 변수명`

안내문구는 생략 가능하며, 변수는 여러 개를 콤마(`,`)로 지정하는 것이 가능합니다. 변수를 여러 개 지정하면, 키보드로 입력할 때 콤마(`,`)으로 구분하여 갯수만큼 입력값을 입력하고 엔터를 치면 됩니다.

 

예를 들어 키보드로 학생의 이름과 성적을 입력받고 이것을 화면에 출력하는 프로그램을 만든다고 한다면, 다음과 같습니다.

```
CLS
INPUT "your name? ", name$
INPUT "your math score? ", math%
INPUT "your English score? ", eng%
PRINT
PRINT name$, (math% + eng%) \ 2
END

```

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-12-오전-2.25.45.png)

 

아래 예제는 원금과 기간, 이자율을 입력하면 단리로 계산했을 경우 만기에 받을 금액이 얼마인지 알려주는 프로그램입니다.

```
CLS
DIM P, R, T, SI AS SINGLE
PRINT "ENTER THE VALUES OF P, R, T"
INPUT P, R, T
SI = P + (P * R / 100) * T
PRINT SI
END

```

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-12-오전-2.39.08.png)

 

택배 박스의 가로, 세로, 높이 값을 입력받으면 박스의 부피를 알려주는 프로그램입니다. 단, `GOTO` 문을 이용해서 `0,0,0`으로 입력(또는 아무 값도 입력하지 않음)하기 전에는 무한으로 프로그램이 반복되도록 합니다.

 

![](./assets/img/wp-content/uploads/2019/11/box.png)

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-12-오전-2.58.43.png)

```
CLS
DIM w, l, h, vol AS DOUBLE
START:
PRINT "input WIDTH, LENGTH, HEIGHT >> "
INPUT w, l, h
vol = w * l * h
IF w = 0 AND l = 0 AND h = 0 THEN END
PRINT "The volume of the box is ", vol
PRINT
GOTO START

```

 

\[rcblock id="3452"\]
