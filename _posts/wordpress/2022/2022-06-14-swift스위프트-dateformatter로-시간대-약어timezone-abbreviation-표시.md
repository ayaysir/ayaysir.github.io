---
title: "Swift(스위프트): DateFormatter로 시간대 약어(Timezone abbreviation) 표시"
date: 2022-06-14
categories: 
  - "DevLog"
  - "Swift"
---

#### **Swift(스위프트): DateFormatter로 시간대 약어(Timezone abbreviation) 표시**

 

`TimeZone.current.identifier`와 `TimeZone.abbreviationDictionary`를 사용하면 시간대 약어를 표시할 수 있습니다.

```
func dateString(timestamp: Int) -> String {
    let date = Date(timeIntervalSince1970: TimeInterval(timestamp))
    let formatter = DateFormatter()
    formatter.timeZone = .autoupdatingCurrent
    formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
    let timezoneAbbr = TimeZone.abbreviationDictionary.first { $1 == formatter.timeZone.identifier }

    // timezoneAbbr?.value는 Asia/Seoul, timezoneAbbr?.key는 KST로 표시
    // .value는 timeZone.identifier와 동일
    return formatter.string(from: date) + " (\(timezoneAbbr?.value ?? "Unknown"))"
}

```

 

```
1655192817
2022-06-14 16:46:57 (KST)
2022-06-14 16:46:57 (Asia/Seoul)
```

 

##### **출처**

- [Getting timezone abbreviations in Swift](https://stackoverflow.com/questions/66115906/getting-timezone-abbreviations-in-swift)

##### **참고**

- [Swift: DateFormatter 날짜 한글로 표기](http://yoonbumtae.com/?p=2173)
