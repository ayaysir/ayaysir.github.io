---
title: "VSCode에서 현재 날짜 입력하기 (vscode-insertdatestring 플러그인 사용)"
date: 2020-11-05
categories: 
  - "DevLog"
  - "etc"
---

[플러그인 링크](https://marketplace.visualstudio.com/items?itemName=jsynowiec.vscode-insertdatestring)

지정된 형식에 따라 현재 날짜 또는 시간을 삽입하는 Visual Studio Code용 플러그인입니다. VisualStudio Marketplace에서 사용할 수 있습니다.

 

### **설치**

`F1`을 눌러 명령 팔레트를 열고 `ext install`을 입력 한 다음 Insert Date String 확장을 찾으세요.

 

### **사용법**

다음 명령을 사용할 수 있습니다. 단축키를 사용하거나 명령어를 명령 팔레트에 입력해 사용합니다.

- `Insert DateTime` (OS X에서는 ⇧ + ⌘ + I, Windows 및 Linux에서는 Ctrl + Shift + I) - 커서 위치에 지정된 형식(`format`)에 따라 현재 날짜 또는 시간을 삽입합니다.
- `Insert Date` - 커서 위치에 지정된 형식 (`formatDate`)에 따라 현재 날짜를 삽입합니다.
- `Insert Time`  - 커서 위치에 지정된 형식 (`formatTime`)에 따라 현재 시간을 삽입합니다.
- `Insert Timestamp` - 커서 위치에 현재 타임스탬프를 밀리초 단위로 삽입합니다.
- `Insert FormattedDateTime` (OS X의 경우 ⇧ + ⌘ + ⌥ + I, Windows 및 Linux의 경우 Ctrl + Alt + Shift + I) - 사용자에게 형식을 묻는 프롬프트 창을 표시하고 커서 위치에 형식이 지정된 날짜 또는 시간을 삽입합니다.

 

![](./assets/img/wp-content/uploads/2020/11/스크린샷-2020-11-05-오후-6.11.03.png)

 

\[caption id="attachment\_3165" align="alignnone" width="310"\]![](./assets/img/wp-content/uploads/2020/11/스크린샷-2020-11-05-오후-8.18.48.png) 주석 입력 등의 용도로 사용할 수 있습니다.\[/caption\]

 

#### **이용 가능한 확장 설정**

- `Date and time format string` (_이는 `Insert DateTime`의 아웃풋에 영향을 미침_):
- `Date format string` (_이는_ _`Insert Date`의 아웃풋에 영향을 미침_):
- `Time format string` (_이는 `Insert Time`의 아웃풋에 영향을 미침)_:

```
// Date format to be used.
"insertDateString.format": "YYYY-MM-DD hh:mm:ss",
"insertDateString.formatDate": "YYYY-MM-DD",
"insertDateString.formatTime": "hh:mm:ss",
```

 

#### **구문**

- `Y` - 앞에 0이 없는 연도의 두 자리 표현입니다. 예) 99 또는 3
- `YY` - 연도를 나타내는 두 자리 숫자입니다. 예) 99 또는 03
- `YYYY` - 연도의 전체 숫자 표현, 4 자리. 예) 1999 또는 2003
- `M` - 앞에 0이 없는 월의 숫자 표현. 1 ~ 12
- `MM` - 앞에 0이 있는 월의 숫자 표현입니다. 01 ~ 12
- `MMM` - 한 달의 짧은 텍스트 표현, 세 글자. 1월 ~ 12월
- `MMMM` - 1월 또는 3월과 같은 월의 전체 텍스트 표현입니다. 1월 ~ 12월
- `D` - 앞에 0이 없는 날짜입니다. 1 ~ 31
- `DD` - 앞에 0이 있는 2 자리 숫자의 날짜. 01 ~ 31
- `DDD` - 하루의 텍스트 표현, 세 글자. Mon ~ Sun
- `DDDD` - 요일의 전체 텍스트 표현입니다. 일요일(Sunday)부터 토요일(Saturday)까지
- `H` - 앞에 0이 없는 12시간 형식의 시간입니다. 1 ~ 12
- `HH` - 앞에 0이 있는 12시간 형식의 시간입니다. 01 ~ 12
- `h` - 앞에 0이 없는 24시간 형식. 0 ~ 23
- `hh` - 앞에 0이 있는 24시간 형식입니다. 00 ~ 23
- `m` - 앞에 0이 없는 분. 0 ~ 59
- `mm` - 앞에 0이 있는 분. 00에서 59
- `s` - 앞에 0이 없는 초. 0 ~ 59
- `ss` - 앞에 0이 있는 초. 00 ~ 59
- `S` - 앞에 0이 없는 밀리초입니다. 0 ~ 999
- `SS` - 선행 0이 있는 밀리초입니다. 000에서 999
- `U` - Unix Epoch 이후 밀리초 (1970년 1월 1일 00:00:00 GMT)
- `u` - Unix Epoch 이후 초 (1970년 1월 1일 00:00:00 GMT)
- `A` - Ante meridiem(AM) 및 Post meridiem(PM). 오전 또는 오후

 

#### **시간대 지정자(designator)**

- `Z` - `± hh[:mm]` 형식의 UTC 시간 오프셋. 예) +02, +02:30
- `ZZ` - `±hh[mm]` 형식의 UTC 시간 오프셋. 예) +02, +0230
- `ZZZ` - `±hh:mm` 형식의 UTC 시간 오프셋. 예) +02:00, +02:30
- `ZZZZ` - `±hhmm` 형식의 UTC 시간 오프셋. 예) +0200, +0230

#### **ISO-8601**

- `iso` - 밀리초가없는 단순화된 확장 ISO 형식 (ISO 8601). 시간대는 접미사 "Z"로 표시되는 것처럼 항상 0(zero) UTC 오프셋입니다.
- `w` - 요일. 1 (월요일) ~ 7 (일요일)
- `W` - 연도의 주(week) 번호, 첫 번째 주는 1월 4일이 포함 된 주입니다.
- `o` - ISO 8601 연도 번호. ISO 주 번호 (W)가 이전 또는 다음 연도에 속하는 경우 해당 연도가 대신 사용된다는 점을 제외하면 YYYY와 동일한 값을 갖습니다.

 

#### **예**

- UTC date and time: `iso` (2013-07-16T20:13:31Z)
- Year and month: `YYYY-MM` (2013-07)
- Complete date: `YYYY-MM-DD` (2013-07-16)
- Complete date plus hours, minutes, seconds and difference to GMT: `YYYY-MM-DDThh:mm:ssZZZ` (2013-07-16T20:13:31+01:00)

 

#### **라이선스**

[MIT License](https://github.com/jsynowiec/vscode-insertdatestring/blob/master/LICENSE)에 의해 출시되었습니다.
