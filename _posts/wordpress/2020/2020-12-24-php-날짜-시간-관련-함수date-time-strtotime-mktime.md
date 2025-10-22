---
title: "PHP: 날짜 시간 관련 함수(date, time, strtotime, mktime)"
date: 2020-12-24
categories: 
  - "DevLog"
  - "PHP"
---

#### **시간 포맷 사용 - date() 함수**

두 번째 파라미터는 `nullable`이며, 특정 타임스탬프를 지정하면 해당 타임스탬프의 날짜를 반환하고, 아니라면 `time()` 현재 시각을 반환합니다.

```
// set the default timezone to use. Available since PHP 5.1
date_default_timezone_set('UTC');

// Prints something like: Monday
echo date("l");

// Prints something like: Monday 8th of August 2005 03:12:46 PM
echo date('l jS \of F Y h:i:s A');

// Prints: July 1, 2000 is on a Saturday
echo "July 1, 2000 is on a " . date("l", mktime(0, 0, 0, 7, 1, 2000));

/* use the constants in the format parameter */
// prints something like: Wed, 25 Sep 2013 15:28:57 -0700
echo date(DATE_RFC2822);

// prints something like: 2000-07-01T00:00:00+00:00
echo date(DATE_ATOM, mktime(0, 0, 0, 7, 1, 2000));
```

 

#### **현재 날짜의 연도 얻기**

```
echo date("Y");
```

 

#### **현재 날짜가 속한 주(week)의 범위 구하기**

예를 들어 오늘이 12월 24일인 경우, 주(week)의 범위는 12월 21일 월요일(`$monday`)부터 12월 27일 일요일(`$sunday`)까지입니다.

![](./assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-24-오후-8.24.29.png)

```
$monday = strtotime('last monday', strtotime('tomorrow'));
$sunday = strtotime('+6 days', $monday);
```

 

#### **텍스트를 날짜로 변환 - strtotime()**

영어 텍스트로 된 날짜/시간 설명을 Unix 타임스탬프로 변환합니다. 두 개의 파라미터를 가지며 하나는 필수 파라미터로 변환할 영어 텍스트를 입력하고, 나머지 하나는 `nullable`로써 기준 시간을 입력합니다.

```
echo strtotime("now"), "\n";
echo strtotime("10 September 2000"), "\n";
echo strtotime("+1 day"), "\n";
echo strtotime("+1 week"), "\n";
echo strtotime("+1 week 2 days 4 hours 2 seconds"), "\n";
echo strtotime("next Thursday"), "\n";
echo strtotime("last Monday"), "\n";
```

 

#### **특정 날짜 생성 - mktime()**

월(month)의 범위는 1 ~ 12입니다. 또한 월과 일의 위치에 주의하세요.

```
$date = mktime(0, 0, 0, 12, 12, 20); // (시, 분, 초, 월, 일, 년)
```

 

#### **특정 날짜가 어느 범위의 날짜 사이에 속해있는지 확인하기**

예를 들어 어느 범위의 날짜 두 구간이 주어져 있고, 특정 날짜가 이 범위에 속해 있는지 여부를 알아내는 방법입니다.

```
$date = mktime(0, 0, 0, 12, 12, 20); // (시, 분, 초, 월, 일, 년)
$monday = strtotime('last monday', strtotime('tomorrow'));
$sunday = strtotime('+6 days', $monday);

if($monday <= $date && $date <= $sunday) {
    echo '<p>범위 내에 있습니다.</p>';
}
```
