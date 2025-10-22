---
title: "Java: LocalDate, LocalTime, ChronoUnit을 이용해 시간 나타내고 구하기 (Java 8) + 예제(바이오리듬)"
date: 2019-01-20
categories: 
  - "DevLog"
  - "Java"

tags: 
  - "java"
---

**JDK 8**에서 등장한 새로운 `LocalDate`, `LocalTime`, `ChronoUnit`을 이용해 시간을 나타내고 계산을 해보겠습니다. 이전에는 `Date`, `Calendar` 이런 애들이 쓰였는데요, 자바 초기에 등장한 것이라 문제가 많았다고 합니다. 여러 문제를 다 열거할 수 없지만 가장 큰 문제는 `Calendar`는 특이하게 월을 0 ~ 11로 기록해야 한다는 점이었습니다. 혹시 이런 점을 모르고 일반적인 상식으로 코드를 작성했다가 대형 사고로까지 이어질 수 있겠네요. 새로 등장한 기능들은 그런 여러 문제들을 해결한 것입니다.

기초 코드는 다음과 같습니다.

```
package com.apple.biorhythm;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

public class CalculateDates {
  
  private static void p(Object o) {
    System.out.println(o);
  }
  
  public static void main(String[] args) {
    
  
  }
}
```

 

`LocalDate`는 연, 월, 일을 다룰 때 쓰입니다. 오늘 날짜를 구하려면 `now()`를 사용합니다.

```
LocalDate today = LocalDate.now();   // 오늘 날짜
p(today);   // 2019-01-20
```

 

두 개의 특정 날짜 사이의 차이를 연, 월, 일로 구하려면 다음과 같이 사용합니다. 아래 코드에서 월(month) 자리에 사용된 3은 말 그대로 3월을 뜻합니다. 특정 날짜를 수동으로 입력하려면 `LocalDate.of(연, 월, 일)`을 사용합니다.

```
LocalDate targetDate1 = LocalDate.of(1980, 3, 12);
p(today.until(targetDate1));  // P-38Y-10M-8D
```

 

두 개의 특정 날짜 사이의 차이를 일수(days)로 구하려면 `ChronoUnit.DAYS.between(a, b)`를 사용합니다. `between` 파라미터의 순서는 반드시 **이른 시간이 앞에, 늦은 시간이 뒤에** 위치해야 합니다.

```
long day1 = ChronoUnit.DAYS.between(today, targetDate1);
p(day1); // -14193
long day2 = ChronoUnit.DAYS.between(today, LocalDate.of(2020, 3, 12));
p(day2); // 417
```

 

만약 특정 날짜의 100일 전/후는 언제인지 알고 싶다면, `ChronoUnit.DAYS.between(date, longAmount)`를 사용합니다.

```
p(ChronoUnit.DAYS.addTo(today, 100)); // 2019-04-30
p(ChronoUnit.DAYS.addTo(today, -100)); // 2018-10-12
p(ChronoUnit.DAYS.addTo(LocalDate.of(1976, 1, 4), 10000)); // 2023-05-22
```

 

`ChronoUnit`을 응용해 보겠습니다. 첫 번째는 특정 날짜에서 몇 세기(`CENTURIES.addTo`) 전후를 구합니다. 두 번째는 특정 날짜에서 몇 달 전후(`MONTHS.addTo`)를 구합니다. 세 번째는 두 날짜 사이는 몇 년(`YEARS.between`)인지 구합니다.

```
p(ChronoUnit.CENTURIES.addTo(today, -1)); // 1919-01-20
p(ChronoUnit.MONTHS.addTo(today, 10));	// 2019-11-20
p(ChronoUnit.YEARS.between(today, targetDate1)); // -38
```

 

다른 날짜 포맷에 대해서도 알아보겠습니다. `LocalTime`은 시, 분 초를 표시하며 초 단위는 millisecond까지 소수점으로 표시하는 포맷입니다. **`LocalDateTime`**은 `LocalDate`와 `LocalTime`이 합쳐진 포맷입니다.

```
LocalTime currentTime = LocalTime.now();
p(currentTime);	// 19:05:31.397

LocalDateTime currentDateTime = LocalDateTime.now();
p(currentDateTime);	// 2019-01-20T19:06:15.909
```

 

`LocalDateTime`과 `LocalDate`를 서로 계산하려고 하면 예외가 발생합니다. 두 포맷의 타입을 일치시켜야 합니다. 여기서는 `LocalDateTime`을 `LocalDate`로 바꾸는 방법에 대해 알아보겠습니다.

```
p(ChronoUnit.DAYS.between(currentDateTime.toLocalDate(), targetDate1));	// -14193
p(ChronoUnit.HOURS.between(LocalTime.of(12, 11), currentTime)); // 7
```

 

* * *

예제로 **바이오리듬** 프로그램을 만들어보겠습니다. 바이오리듬은 제가 어렸을 때 유행했던 운세의 일종인데요 자세한 설명은 [여기](https://thewiki.kr/w/바이오리듬)에서 볼 수 있습니다. 여기에 따르면 지금은 과학적 근거는 전혀 없고 유행도 지난것 같지만 프로그래밍 연습에는 좋은 예제입니다. 다음에는 [벤치마킹 사이트](http://www.60gabja.com/bio/013_modujobio.php3)를 참고해 웹 페이지로 바이오리듬을 구현해보려 합니다. 벤치마킹 사이트의 확장자 `php3`에서 알 수 있듯이 굉장히 옛날 사이트입니다.

```
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class BioRhythm {

  public static void main(String[] args) {
    /*
     * 바이오리듬 공식: -100 to 100
     * 신체(23일) : sin(2πt/23)
     * 감성(28일) : sin(2πt/28)
     * 지성(33일) : sin(2πt/33)
     * 
     * 위험일 0 ~ -15
     * 고조기 1 ~ 100
     * 저조기 -16 ~ -100
     */
    
    LocalDate birthday;
    LocalDate today = LocalDate.now();
    
    try(Scanner s = new Scanner(System.in)){
      System.out.println("바이오리듬: 오늘 날짜는 " + today + " 입니다.");
      System.out.print("생년월일을 입력하세요.(예: 19700123) >> ");
      
      String input = s.nextLine();
      
      int year = Integer.parseInt(input.substring(0, 4));
      // System.out.println(year);
      int month = Integer.parseInt(input.substring(4, 6));
      int dayOfMonth = Integer.parseInt(input.substring(6, 8));
      birthday = LocalDate.of(year, month, dayOfMonth);
      
      long betweenDays = ChronoUnit.DAYS.between(birthday, today);
      System.out.println();
      System.out.println("생년월일로부터 오늘까지의 경과일수: " + betweenDays);
      
      double body = Math.sin( (2 * Math.PI * betweenDays) / 23 );
      double emotion = Math.sin( (2 * Math.PI * betweenDays) / 28 );
      double intelligence = Math.sin( (2 * Math.PI * betweenDays) / 33 );
      
      System.out.println();
      System.out.println("======== 결 과 ========");
      System.out.println("신체리듬: " + getPercentage(body) + " (" + getCurrentState(body) + ")");
      System.out.println("감성리듬: " + getPercentage(emotion) + " (" + getCurrentState(emotion) + ")");
      System.out.println("지성리듬: " + getPercentage(intelligence) + " (" + getCurrentState(intelligence) + ")");
      
      System.out.println();
      System.out.println("======== 해 석 ========");
      System.out.println(getTotalInterpretation(body, emotion, intelligence));
    }
    
  }
  
  private static int getPercentage(double num) {
    return (int)(num * 100);
  }
  
  private static String getCurrentState(double num) {
    int perc = getPercentage(num);
    if(perc <= 0 && perc >= -15) {
      return "위험";
    } else if(perc <= -16) {
      return "저조기";
    } else {
      return "고조기";
    }
  }
  
  // total 27 (=3*3*3)
  private static String getTotalInterpretation(double body, double emotion, double intelligence) {
    String bodyStat = getCurrentState(body);
    String emotStat = getCurrentState(emotion);
    String intelStat = getCurrentState(intelligence);
    
    if(bodyStat.equals("위험") && emotStat.equals("위험") && intelStat.equals("위험")) {
      return "오늘은 굉장히 위험한 날입니다. \n외출을 삼가시고 중요한 사업적 판단을 자제해 주십시오.";
    } else if(bodyStat.equals("고조기") && emotStat.equals("고조기") && intelStat.equals("저조기")) {
      return "신체리듬과 감성리듬이 고조기이므로 야외활동에서 좋은 성과가 있을 것입니다. \n"
          + "단 지성 리듬이 저조기이므로 지나치게 감성적인 판단이 나올 수 있으므로 \n이성이 필요한 판단은 삼가해주십시오.";
    } else if(bodyStat.equals("고조기") && emotStat.equals("저조기") && intelStat.equals("저조기")) {
      return "신체리듬이 고조기이므로 신체활동 컨디션이 좋고 성과가 나올 수 있습니다만, \n감성리듬과 지성리듬은 저조기이므로"
          + " 결과에 지나치게 낙담할 수 있고 \n그에 따른 비이성적인 판단이 나올 수 있으므로 조심하십시오.";
    } else if(bodyStat.equals("고조기") && emotStat.equals("저조기") && intelStat.equals("고조기")) {
      return "신체리듬과 지성리듬이 고조기이므로 과업에서 좋은 성과가 나올 수 있습니다.\n"
          + "다만 감성리듬이 저조기이므로 성과에 비해 그릇된 감성판단을 할 수 있으나 \n이에 연연하지 마십시오.";
    }
    
    return "ㅈㅅ 나중에..";
  }
  
  

}

```

```
바이오리듬: 오늘 날짜는 2019-01-20 입니다.
생년월일을 입력하세요.(예: 19700123) >> 19800123

생년월일로부터 오늘까지의 경과일수: 14242

======== 결 과 ========
신체리듬: 97 (고조기)
감성리듬: -78 (저조기)
지성리듬: -45 (저조기)

======== 해 석 ========
신체리듬이 고조기이므로 신체활동 컨디션이 좋고 성과가 나올 수 있습니다만, 
감성리듬과 지성리듬은 저조기이므로 결과에 지나치게 낙담할 수 있고 
그에 따른 비이성적인 판단이 나올 수 있으므로 조심하십시오.
```
