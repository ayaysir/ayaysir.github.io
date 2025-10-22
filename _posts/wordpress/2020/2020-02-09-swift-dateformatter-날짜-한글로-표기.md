---
title: "Swift: DateFormatter 날짜 한글로 표기"
date: 2020-02-09
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

DateFormatter에서 날짜를 한글로 표기하려면 로케일 설정을 변경합니다.

```swift
        let date = NSDate() // 현재 시간 가져오기
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "ko") // 로케일 변경
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss EEEE"
        print("현재시간: " + formatter.string(from: date as Date))
```

날짜 포맷표: [https://ownstory.tistory.com/21](https://ownstory.tistory.com/21)
