---
title: "QBasic: 기초 구문, 연산자, GOTO, 수학 함수"
date: 2019-11-11
categories: 
  - "DevLog"
  - "BASIC"
tags: 
  - "qbasic"
  - "qbasic-기초"
---

## **`REM` 또는 어퍼스트로피(`'`)**

주석(comment)을 입력합니다. 에디터상 단축키는 `Ctrl + R`을 누르면 해당 라인을 주석으로 변경하며, `Ctrl + Shift + R` 은 주석 처리된 해당 라인을 원래대로 되돌립니다.

```vb
REM Test Program
'task: add
PRINT 5 + 2

-- 결과 --
7
```

 

## **화면 지우기 (`CLS`)**

화면을 지웁니다.

```vb
PRINT 5 + 2
CLS
PRINT 9 + 9

-- 결과 --
18
```

 

## **화면 출력 (`PRINT`)**

화면에 문자를 표시합니다. 스트링이나 숫자 등이 표시될 수 있으며, 콤마(`,`)로 구분하면 일정 간격으로 정렬하여 여러 변수들을 표시할 수 있습니다.

```vb
PRINT "== SCORE CARD=="
PRINT  '줄바꿈과 같은 효과

DIM TEXT AS STRING, NUM1 AS INTEGER
TEXT = "Park's math score"
NUM1 = 12
PRINT TEXT, NUM1
```

![](/assets/img/DevLog/qbasic/2-1.png)

 

## **산술 연산자 (Arithmetic Operators)**

사칙연산, 나머지 구하기 등 숫자에 대한 계산을 수행하는 연산자입니다.

### **종류**

- `+` : 더하기
- `-` : 빼기
- `*` : 곱셈
- `/` : 나눗셈 (실수)
- `\` : 나눗셈 (정수)
- `^` : 지수(Exponent)
- `MOD` : 나머지(Remainder)

```vb
' 사칙연산

PRINT 5 + 8
' 결과: 13

PRINT 15 - 10, 15 - 25
' 결과: 5  -10

PRINT 3 * 8, 42 * -2, 5 * 0
' 결과: 24  -84  0

PRINT 5 / 2, -69 / 15, 4 / 0
' 결과: 2.5  -4.6  inf

PRINT 5 \ 2, -69 \ 15, 4 \ 0
' 결과: 2  -4  0
```

```vb
-- 지수, 나머지 --

PRINT 2 ^ 8, 2 ^ -2, 2 ^ 3.6
' 결과: 256  .25  12.12573

PRINT 25 MOD 5, 36 MOD 7
' 결과: 0  1
```

 

## **연산의 우선순위**

1. 괄호: QBasic은 소괄호만 허용함
2. 곱셈과 실수 나눗셈: 곱셈, 나눗셈 사이에서는 왼쪽부터 오른쪽 순으로 연산
3. 나머지, 정수 나눗셈
4. 덧셈과 뺄셈

 

## **관계 연산자 (Relational Operators)**

두 숫자를 비교한 뒤 참(true)이면 `-1`,  거짓(false)이면 `0`을 반환합니다. 조건문에서 사용됩니다.

- `<` : ~보다 작다 (Less than) _exp1 < exp2_
- `<=` : ~보다 작거나 같다 (Less than or equal to) _exp1 <= exp2_
- `>` : ~보다 크다 (Greater than) _exp1 > exp2_
- `>=` : ~보다 크거나 같다 (Greater than or equal to)  _exp1 >= exp2_
- `=` : 같다 (Equal to) _exp1 = exp2_
- `<>` : 같지 않다 (Not equal to)  _exp1 <> exp2_

```vb
PRINT 9 > 2, 3 > 6
PRINT 9 >= 2, 2 >= 2, 3 >= 6
PRINT 9 < 2, 3 < 6
PRINT 9 <= 2, 2 <= 2, 3 <= 6
PRINT 5 = 5, 5 = 2
PRINT 5 <> 5, 5 <> 2
```

![](/assets/img/DevLog/qbasic/2-2.png)

 

## **논리 연산자**

논리 연산자는 두 개 또는 그 이상의 관계식을 결합하여 복수 관계식의 참/거짓을 판별할 수 있도록 하는 연산자입니다.

- `AND` – 두 피연산자가 true 값을 갖는 경우에만 결과를 true로 생성합니다
- `OR` – 두 피연산자가 false 값을 갖는 경우에만 결과를 false로 생성합니다
- `NOT` – 하나의 피연산자가 false이면 그 반대의 경우에도 연산자는 결과를 true로 생성합니다.

```vb
'주의: -1은 참(true)이며 0이 거짓(false) 입니다.

PRINT -1 AND -1
' -1 (참)

PRINT -1 AND 0
' 0 (거짓)

PRINT -1 OR -1
' -1 (참)

PRINT -1 OR 0
' -1 (참)

PRINT NOT -1
' 0 (거짓)

PRINT NOT 0
' -1 (참)
```

 

## **다양한 변수 할당 방법: LET, 콜론(:)**

`LET`은 변수에 값을 할당(assign)하고자 할 때 사용하는 키워드입니다. **생략 가능**합니다.

```vb
DIM str1 AS STRING, str2 AS STRING
LET str1 = "STRING ONE"
str2 = "STRING TWO"
PRINT str1, str2

-- 결과 --
STRING ONE    STRING TWO
```

콜론(`:`)을 사용하면 단일 라인에 여러 변수를 선언할 수 있습니다.

```vb
kor = 51: math = 66: eng = 32: std1$ = "kim"

PRINT std1$, (kor + math + eng) / 3
' 결과: 49.66667
```

 

## **GOTO, END**

프로그램 진행 중 `GOTO`를 이용하면 특정 라인 또는 이름이 지정된 라인으로 이동하여 그 부분부터 해당 코드를 다시 반복합니다. 최신 프로그래밍 언어에서는 기능이 퇴화되거나 아예 존재하지 않는 구문입니다.

아래 프로그램은 `START`라는 이름의 라인을 선언하고 `GOTO`문을 만나면 `START` 라인으로 되돌아가서 해당 부분부터 다시 실행하는 코드인데, GOTO 내에 종료 포인트가 없어서 같은 결과가 무한 반복됩니다.

```vb
REM A PROGRAM TO DEMONSTRATE USE OF GOTO
DIM I AS INTEGER
START:
LET I = 10
PRINT " I = "; I
GOTO START
END
```

![](/assets/img/DevLog/qbasic/2-3.png)

프로그램을 종료하려면 `END` 키워드를 사용합니다. 통상적으로 코드의 맨 마지막에 삽입하거나, `GOTO` 문에 조건부 종료 조건을 설정할 때 사용합니다. 아래 예제는 `GOTO`가 반복될 때마다 `I`를 1씩 증가시키고 `I`가 10이 되면 `END`를 실행해 프로그램을 종료합니다.

```vb
I = 1
START:
PRINT " I = "; I
IF I = 10 THEN END
I = I + 1
GOTO START
```

![](/assets/img/DevLog/qbasic/2-4.png)

 

## **수학 함수**

QBasic이 기본으로 제공하는 함수들로, 수리 계산을 도와줍니다.

- `ABS` – 숫자의 절대 값을 반환합니다.
- `INT` – 숫자 표현식보다 작거나 같은 가장 큰 정수를 반환합니다. (=소수점 1자리에서 내림하여 표시)ㅑㅜㅅ
- `COS`, `SIN`, `TAN` – 지정된 각도의 코사인, 사인 및 탄젠트를 반환합니다.
- `SQR` – 숫자 표현식의 제곱근을 반환합니다.
- `SGN` – 숫자 표현식의 부호를 나타내는 값을 리턴합니다. 표현식이 양수이면 1, 0이면 0, 음수이면 -1
- `EXP` – _e_를 지정된 거듭 제곱으로 반환합니다. 여기서 _e_는 자연 로그 상수입니다.
- `VAL` – 숫자의 문자열 표현을 숫자로 변환합니다.
- `SWAP` – 두 변수의 값을 교환합니다. 두 변수는 동일한 자료형이어야 합니다.

```vb
PRINT ABS(96 - 199)
' 출력: 103

PRINT INT(96.7)
' 출력: 96

PRINT SQR(64)
' 출력: 8

' == VAL ==
a = VAL("373")
b = 25
PRINT a + b
' 출력: 398

' == SWAP ==
c = 59
d = -4
SWAP c, d

PRINT c, d
' 출력: -4    59
```

 
