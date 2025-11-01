---
title: "QBasic: 조건문(IF문, SELECT CASE문)"
date: 2019-11-12
categories: 
  - "DevLog"
  - "BASIC"
tags: 
  - "qbasic"
  - "qbasic-기초"
---

\[rcblock id="3452"\]

#### **조건문**

조건문은 명령문 또는 명령문 그룹의 선택적 처리를 허용합니다. 조건문에는 두 가지 형태가 있습니다.

1. **if-then-else** 문
2. **if-then-elseif ... else** 문

예를 들어, 학생이 3 + 3 = 9 이라는 숙제에 관한 쪽지 하나를 선생님한테 제출하였을 경우, 선생님은 이 식이 맞는 식인지, 아니면 틀린 식인지 알 수 있을 것입니다. 만약 식이 맞다면(_true_) 학생에게 잘했다는 의미에서 상금을 주고, 식이 틀렸다면(_false_) 반성하라는 의미로 벌을 줘야 할 것입니다. 여기서 학생이 제출한 쪽지는 조건문에서 '조건식'이라 하며, 맞았을 경우를 `then`, 틀렸을 경우 `else`라고 합니다. `elseif`는 밑에서 다시 보겠습니다.

\[caption id="attachment\_1748" align="alignnone" width="541"\]![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-12.33.26.png) 조건문\[/caption\]

 

#### **IF-THEN-ELSE 문**

IF-THEN-ELSE문은 다음 두 형태가 있습니다.

```
if (expression) then statement
if (expression) then statement [else statement ]
```

첫 번째의 경우는 조건식이 맞다면 `then` 바로 밑의 명령어 묶음(statement)을 실행하며, 두 번째의 경우는 조건식이 맞지 않다면 `then` 부분은 건너뛰고 `else` 이후에 있는 명령어를 실행합니다. 또한 `IF`문은 조건문의 끝에 `END IF` 구문을 넣어 마무리해야 하는 경우가 있는데, IF문을 한 줄에 쓰면 `END IF` 가 필요없고, `IF`문의 `THEN`과 실행 부분이 분리되는 경우(여러 줄)에는 `END IF`가 필요합니다..

 

```
INPUT "Input any number: ", n%  
IF (n% MOD 2 <> 0) THEN PRINT "It is an odd number."

```

`if` 옆 괄호 안에 있는 부분이 조건식입니다. 어떠한 숫자 `n` 을 2로 나눴을 때 나머지가 0이 아니라면 이것은 홀수일 것이므로, `then` 다음에 "홀수입니다"라는 문구를 출력하게 됩니다. 만약 나머지가 0이라면, `then` 부분은 무시되며 아무 작업도 하지 않습니다.

**![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-12.55.25.png)**

 

```
IF (n% MOD 2 <> 0) THEN
    PRINT "It is an odd number."
ELSE
    PRINT "It is an even number."
END IF
```

위의 형태에서 `else` 가 추가되었습니다. 안의 조건식이 거짓인 경우 `then`은 건너뛰고 `else`로 이동하게 되어 `else` 밑의 명령문을 실행합니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-1.00.43.png)

 

#### **IF-THEN-ELSEIF ... ELSE**

이것도 위의 IF-ELSE 문과 큰 차이는 없습니다. 다만 위에서는 조건식이 맞거나 틀리거나 두 가지의 경우만 고려했던 것에 반해 `ELSEIF`는 THEN이 거짓이더라도 한 번 더 기회를 주는 것이라고 볼 수 있습니다. 만약 선생님이 문제를 2개 냈는데 두 개 다 맞은 경우가 `then`이라면 한 개라도 맞은 경우엔 `else` 가 아닌 한 문제라도 맞은 것에 대한 보상을 해주는 것(`elseif then`)을 의미합니다. 두 개 전부 틀렸을 경우 그제서야 `else` 를 부여합니다. `then` 이나 `else`는 한 번만 사용할 수 있으나, `elseif then`의 사용 개수에는 제한이 없으며 위에서부터 아래대로 순차적인 우선순위를 가집니다.

 

```
DIM ans1, ans2, con1, con2 AS INTEGER
INPUT "2 * 2 = ? ", ans1
INPUT "3 + 3 = ? ", ans2
con1 = (ans1 = 4)
con2 = (ans2 = 6)

'PRINT ans1, ans2

IF (con1 AND con2) THEN
    PRINT "Receive 50000"
ELSEIF (con1 OR con2) THEN
    PRINT "Receive 100"
ELSE
    PRINT "OK retard"
END IF

```

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-1.24.33.png)

두 문제를 제시하고 전부 맞히면 5만원, 한 문제만 맞히면 100원, 전부 틀렸다면 모욕당하면서 끝나는 예제입니다. if 문은 두 문제를 전부 다 맞았을 경우의 조건이며 최초 조건문이 거짓이라도 다음의 `elseif`에서 한 문제만 정답이라는 새로운 조건문이 등장했습니다. 만약 이 조건문마저 거짓이라면 그제서야 `else` 로 넘어가게 됩니다.

 

#### **IF 조건문 예제**

아래 예제는 특정 품목을 구매하는 동안 구매 수량이 1000개 이상인 경우 전체 수량에 대해 10% 할인이 제공되는 경우, 키보드를 통해 품목당 수량 및 가격을 입력하면 총 비용을 계산하여 표시하는 프로그램입니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-1.45.49.png)

```
CLS

DIM QTY, RATE, DIS, TOTEXP AS DOUBLE
PRINT "ENTER THE VALUES OF QTY, RATE"

INPUT QTY, RATE

IF QTY >= 1000 THEN
    DIS = 10
ELSE
    DIS = 0
END IF

TOTEXP = QTY * RATE - DIS * RATE * QTY / 100
PRINT INT(TOTEXP)

END
```

 

아래 예제는 키보드를 통해 입력된 3개의 숫자 중 가장 작은 숫자를 표시하는 프로그램입니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-1.57.02.png)

```
CLS

DIM n1, n2, n3, min AS INTEGER
PRINT "input 3 numbers: "
INPUT n1, n2, n3

min = n1

' IF ~ THEN 문을 한 줄에 적는 경우에는 END IF를 사용하지 않아도 됨
IF (n2 < min) THEN min = n2
IF (n3 < min19) THEN min = n3

PRINT min

END
```

 

`elseif`를 이용한 심리테스트입니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-2.16.15.png)

```
CLS
PRINT "THIS IS SIMPLIFIED SIMRI TEST. "
PRINT "CHOOSE NUMBER BETWEEN 1 ~ 4: "
PRINT
PRINT "You are in front of the elevator now."
PRINT "What about you waiting for the elevator?"
PRINT
PRINT "1. I'm rolling my feet."
PRINT "2. Press and hold the elevator button."
PRINT "3. Looking around or looking at signs."
PRINT "4. Just staring at the floor."
PRINT

DIM ans AS INTEGER
INPUT ans
PRINT

IF (ans = 1) THEN
    PRINT "(1) You are somewhat sensitive and nervous."
ELSEIF (ans = 2) THEN
    PRINT "(2) You are the one who loves the buttons."
ELSEIF (ans = 3) THEN
    PRINT "(3) You go well with science and engineering."
ELSEIF (ans = 4) THEN
    PRINT "(4) You are somewhat passive but quite honest."
ELSE
    PRINT "You are an idiot who doesn't read the question."
    PRINT "Run the program again and enter a value between 1 and 4."
END IF

END
```

 

#### **SELECT CASE 문**

여러 조건 중 하나를 선택해야 할 경우 if문을 사용하여 선택을 제어하는 프로그램을 설계할 수 있습니다. 그러나 조건의 수가 증가하면 프로그램의 복잡성이 크게 증가하며 코드의 가독성이 떨어집니다. 때로는 이것을 본인을 포함한 코드를 다루는 사람들을 혼란스럽게 할 수도 있습니다. QBasic에는 `SELECT CASE` 문이라고하는 다방향 의사 결정문이 내장되어 있습니다. 위 IF문 예제의 마지막 심리테스트가 대표적인 예입니다. `SELECT CASE` 문은 케이스 값 목록과 비교하여 주어진 변수 또는 표현식의 값을 테스트하고 일치하는 것이 발견되면 해당 케이스와 연관된 명령문 블록을 실행합니다.

```
SELECT CASE (testexpression)
    CASE expressionlist1 [statementblock-1]
    [CASE expressionlist2 [statementblock-2]] 
         ...
    [CASE ELSE [statementblock-n]]
END SELECT

```

- `testexpression` : 숫자 또는 문자열 표현식입니다.
- `expressionlist` : `testexpression`과 일치하는 하나 이상의 표현식입니다. IS 키워드는 표현식에서 관계 연산자 앞에 와야합니다.
- `statementblock`_`n`_ : 단일 또는 여러 행의 명령문입니다.

 

간단한 사칙연산 계산기 예제입니다.

```
DIM A, B, RESULT AS SINGLE, OP AS STRING
INPUT "Enter A B OP:", A, B, OP

SELECT CASE OP
    CASE IS = "+"
        PRINT " ADDITION "
        RESULT = A + B
        PRINT "RESULT = "; RESULT
    CASE IS = "-"
        PRINT " SUBTRACTION "
        RESULT = A - B
        PRINT "RESULT = "; RESULT
    CASE IS = "*"
        PRINT " MULTIPLICATION "
        RESULT = A * B
        PRINT "RESULT = "; RESULT
    CASE IS = "/"
        PRINT " REAL DIVISION "
        RESULT = A / B
        PRINT "RESULT = "; RESULT
    CASE ELSE
        PRINT "INVALID OPERATOR "
END SELECT

END

```

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-13-오전-2.30.43.png)

`SELECT CASE OP` 에서 `OP`는 변수 `OP`를 대상으로 분기하겠다는 뜻이며, 밑에 나오는 `IS`들은 `OP`를 가리키는 일종의 대명사 역할을 합니다.

 

위의 심리테스트 예제를 `SELECT CASE` 문으로 바꾸면 다음과 같습니다.

```
(...생략...)

SELECT CASE ans
    CASE IS = 1
        PRINT "(1) You are somewhat sensitive and nervous."
    CASE IS = 2
        PRINT "(2) You are the one who loves the buttons."
    CASE IS = 3
        PRINT "(3) You go well with science and engineering."
    CASE IS = 4
        PRINT "(4) You are somewhat passive but quite honest."
    CASE ELSE
        PRINT "You are an idiot who doesn't read the question."
        PRINT "Run the program again and enter a value between 1 and 4."
END SELECT

(...생략...)
```

\[rcblock id="3452"\]
