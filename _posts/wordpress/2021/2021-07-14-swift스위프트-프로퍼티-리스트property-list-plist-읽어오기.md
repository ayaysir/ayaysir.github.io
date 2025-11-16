---
title: "Swift(스위프트): 프로퍼티 리스트(property list; plist) 읽어오기"
date: 2021-07-14
categories: 
  - "DevLog"
  - "Swift"
---

출처: [Swift 5: How to read variables in plist files?](https://stackoverflow.com/questions/60803515/swift-5-how-to-read-variables-in-plist-files)

 

아래와 같은 `plist(property list)` 확장자의 파일이 있고 이 파일은 프로젝트의 루트 폴더에 있습니다.

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>animals</key>
    <array>
        <dict>
            <key>name</key>
            <string>Tiger</string>
            <key>picture</key>
            <string>tiger_running</string>
        </dict>
        <dict>
            <key>name</key>
            <string>Jaguar</string>
            <key>picture</key>
            <string>jaguar_sleeping</string>
        </dict>
    </array>
</dict>
</plist>
```

 

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-14-pm-2.33.00.png)

먼저 위 프로퍼티 리스트의 타입을 참고하여 두 개의 `struct` 를 만듭니다.

```swift
struct Root: Decodable {
    let animals: [Animal]
}

struct Animal: Decodable {
    let name, picture: String
}
```

 

그리고 프로젝트 루트 폴더에 있는 plist 파일을 읽어와 `[Animal]` 타입으로 리턴하는 함수를 작성합니다.

```swift
func parsePlistExample() throws -> [Animal] {
    let url = Bundle.main.url(forResource: "testprops", withExtension: "plist")!
    do {
        let data = try Data(contentsOf: url)
        let result = try PropertyListDecoder().decode(Root.self, from: data)
        return result.animals as [Animal]
    } catch {
        throw error
    }
}
```

- `Bundle.main.url`에서 `forResource`에 파일 이름, `withExtension`에 확장자 `plist`를 입력합니다.
- `Data` 구조체는 파일에 저장된 내용을 메모리에 읽습니다. (문서)
- `PropertyListDecoder()`는 `Data` 타입을 구조체 등으로 변환합니다.
- `result`는 `Root` 타입입니다.

 

함수를 호출하여 결과를 출력하거나 변수에 저장합니다.

```
do {
    try print(parsePlistExample())
} catch {
    print(error)
}
```

```
[Project.Animal(name: "Tiger", picture: "tiger_running"), Project.Animal(name: "Jaguar", picture: "jaguar_sleeping")]
```
