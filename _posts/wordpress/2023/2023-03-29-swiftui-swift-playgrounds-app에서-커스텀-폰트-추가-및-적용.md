---
title: "SwiftUI: Swift Playgrounds App에서 커스텀 폰트 추가 및 적용"
date: 2023-03-29
categories: 
  - "DevLog"
  - "SwiftUI"
---

#### **개요**

**Swift Playgrounds App**에서 커스텀 폰트 적용 및 사운드 파일 추가

참고로 여기서 Swift Playgrounds App이란 다음과 같이 Xcode에서

- `File > New > Project...` ![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-29-오후-11.51.49-복사본.jpg)
- `iOS > Swift Playgrounds App` ![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-29-오후-11.51.59-복사본.jpg)

으로 생성한 프로젝트 및 앱을 뜻합니다.

 

#### **커스텀 폰트 추가**

##### **1) `Resources` 폴더안에 폰트 파일을 추가합니다.**

해당 폴더가 없다면 새로 생성합니다.

새로 생성할 때 반드시 임의로 생성하지 말고 .m4a 등의 파일을 드래그해서 저절로 생성되는 Resources 폴더를 이용해야 합니다.

![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-30-오후-5.27.00-복사본.jpg)

![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-30-오후-5.27.10-복사본.jpg)

위 방법으로 생성된 Resources 파일 밑에 커스텀 폰트 파일을 드래그해서 추가합니다.

![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-29-오후-11.55.30-복사본.jpg)

모든 외부 추가 파일은 **반드시 `Resources` 폴더 안에 추가**해야 `Bundle.main`으로 읽어들일 수 있습니다.

> 참고) 사운드, 비디오 파일 등도 추가하면 `Bundle.main`으로 읽을 수 있습니다. 저절로 `Resources` 폴더 내에 추가됩니다.
> 
> 빌드 후 앱이 설치된 시뮬레이터의 폴더로 이동하면 앱 패키지 내에 해당 파일이 추가된 것을 알 수 있습니다.
> 
> ![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-30-오전-12.11.48-복사본.jpg)

 

##### **2) FontManager 등록**

프로젝트 내에 아래 구조체를 등록합니다.

```
import SwiftUI

public struct FontManager {
    /// https://stackoverflow.com/questions/71916171/how-to-change-font-in-xcode-swift-playgrounds-swiftpm-project
    public static func registerFonts() {
        registerFont(bundle: Bundle.main, fontName: "NeoDunggeunmoPro-Regular", fontExtension: ".ttf") //change according to your ext.
    }
    
    fileprivate static func registerFont(bundle: Bundle, fontName: String, fontExtension: String) {
        print(Bundle.main)
        guard let fontURL = bundle.url(forResource: fontName, withExtension: fontExtension),
              let fontDataProvider = CGDataProvider(url: fontURL as CFURL),
              let font = CGFont(fontDataProvider) else {
            fatalError("Couldn't create font from data")
        }
        
        var error: Unmanaged<CFError>?
        
        CTFontManagerRegisterGraphicsFont(font, &error)
    }
}

```

- **registerFont**
    - `fontName`에 추가한 커스텀 폰트 파일의 이름을 입력합니다.
    - `fontExtension`에 확장자 (예: `ttf`)를 입력합니다.

 

##### **3) MyApp (앱 시작 부분 `@main`)에 생성자를 추가합니다.**

```
import SwiftUI

@main
struct MyApp: App {
    //add the init before var body
    init() {
        FontManager.registerFonts()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

생성자 안에 `FontManager.registerFonts()`를 추가합니다.

 

##### **4) ContentView 등에서 다음과 같이 사용합니다.**

```
Text("ENTER YOUR TEXTS HERE")
    .font(.custom("NeoDunggeunmoPro-Regular", size: 30))
    .foregroundColor(.white)
```

- `.font(.custom("커스텀_폰트_이름"), size: 30))`

![](./assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-30-오전-12.08.34-복사본.jpg)
