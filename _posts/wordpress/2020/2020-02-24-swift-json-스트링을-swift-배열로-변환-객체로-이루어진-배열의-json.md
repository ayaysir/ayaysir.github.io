---
title: "Swift: JSON 스트링을 Swift 배열로 변환 (객체로 이루어진 배열의 JSON)"
date: 2020-02-24
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

출처: [바로가기](https://stackoverflow.com/questions/49856167/how-to-parse-a-json-with-array-of-dictionaries-ios-swift)

변환 방법은 다음과 같습니다.

1. JSON 스트링을 Swift 데이터로 변환
2. `Codable`을 상속받는 VO(DTO) 형태의 구조체(`struct`) 생성: JSON 원문을 보고 내부 객체를 참조해 생성합니다.
3. JSON 디코더를 이용하여 사전(`dictionary`)으로 이루어진 배열로 변환
4. `for`문을 이용하여 정보 순회

 

```swift
import UIKit

var str = """

[{"icon":"clock","regDate":"2020-02-24 19:35:16.0","id":1,"title":"ㄴㄴ"},{"icon":"clock","regDate":"2020-02-24 20:28:42.0","id":3,"title":"test_1582543722.22029"},]

"""

let json = str.data(using: .utf8)

struct Todo: Codable {
    let id: Int?
    let icon: String?
    let title: String?
    let regDate: String?
}

let decoded = try! JSONDecoder().decode([Todo].self, from: json!)

for item in decoded {
    print("\(item.id ?? 0)\t\(item.icon ?? "")\t\(item.title ?? "")\t\(item.regDate ?? "")")
}
```

![](./assets/img/wp-content/uploads/2020/02/스크린샷-2020-02-24-오후-10.05.37.png)

![](./assets/img/wp-content/uploads/2020/02/스크린샷-2020-02-24-오후-10.06.29.png)
