---
title: "SwiftUI: 내비게이션 (Navigation) 및 데이터 전달 기초"
date: 2023-04-03
categories: 
  - "DevLog"
  - "SwiftUI"
---

## **소개**

SwiftUI상에서 내비게이션 (앞, 뒤로 이동하는 뷰들의 집합)을 구현하는 방법입니다. 참고로 iOS 16.0을 기준으로 방법이 매우 다릅니다.

아래와 같은 앱을 만들 것입니다. 3단계 내비게이션이 마련되어 있으며

- 첫 번째 버튼을 누르면 두 번째 화면으로 이동하며 임의의 색상과 그 색상에 대한 텍스트가 표시됩니다.
- 두 번째 화면에서는 `Go to Jacob Link`가 있으며 이 링크를 클릭하면 다음 세 번째 화면으로 이동합니다. 또는 `< Bac`k 버튼을 누르면 뒤로 이동합니다.
- 세 번째 화면에서는 `Jacob [색상]` 이라는 이름이 표시됩니다.

<!-- http://www.giphy.com/gifs/UjmLm56fvyQJiaPRjs -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnNoMGdycnNkOHgwMzV4OGtnejZyM2F3YzY1YXYzNHlpam5tbXdpbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UjmLm56fvyQJiaPRjs/giphy.gif)

 

또한

- 첫 번째 화면에서 `[파발]` 기능이 있어서 3번째 화면으로 파발 메시지를 전달할 수 있습니다.
- 세 번째 화면에서 `[왜곡]` 버튼을 누르면 파발 메시지가 왜곡되어 첫 번째 화면으로 재전달됩니다.

<!-- http://www.giphy.com/gifs/TJikax42WUZzg13lsu -->
![](https://)

 

## **iOS 16.0 이상에서 내비게이션: NavigationStack**

`NavigationStack`을 사용한 뒤 안에 `Button` 또는 `List`를 넣어 사용합니다. 일반적으로 `List`를 사용합니다.

 

먼저 `NavigationStack`을 `body`의 최외곽에 추가합니다.

```swift
var body: some View {
    // ... //
    if #available(iOS 16.0, *) {
        NavigationStack {
            List {
                // ...NavigationLink들 추가... //
            }
            // List 아래 위치
            .navigationTitle("조선시대 성문") // 내비게이션 창 제목
            
        }
    } else {
        // Fallback on earlier versions
    }
}
```

 

다음 `List` 안에 `NavigationLink(_:value:)`를 추가합니다.

```swift
NavigationStack {
    List {
        // NavigationLink은 밖에 있으면 버튼, List 안에 있으면 목록 형태로 자동 변형
        NavigationLink("동대문", value: Color.mint)
        NavigationLink("서대문", value: Color.pink)
        NavigationLink("남대문", value: Color.cyan)
        NavigationLink("북대문", value: Color.teal)
        TextField("파발로 보낼 말을 입력", text: $message)
    }
    // ... //
}
```

- `List`는 테이블 뷰와 비슷한 모양과 용도의 목록을 만들 수 있습니다.
- `NavigationLink`는 내비게이션 내에서 다른 뷰로 이동할 수 있는 링크를 제공합니다. 기본적으로 버튼 형태로 있으며, `List` 안에 있으면 누를 수 있는 목록 형태로 자동으로 변이합니다.
- `NavigationLink`의 첫 번째 파라미터는 버튼(링크) 이름, 두 번째 `value:` 파라미터는 다음으로 이동하는 View에 전달할 값을 입력합니다. 다양한 타입의 값을 입력하는 것이 가능합니다.
    - 위의 예제에서는 `Color` 타입의 값을 전달합니다.

\[caption id="attachment\_5426" align="alignnone" width="193"\] ![](/assets/img/wp-content/uploads/2023/04/screenshot-2023-04-03-pm-7.25.10-copy.jpg) `List`와 `NavigationLink`\[/caption\]

 

위의 `NavigationLink`를 클릭하면 수행할 작업을 추가합니다. `navigationDestination`이라는 메서드를 `List` 바로 다음(밑)에 추가합니다.

```
@State var message: String = ""
// ... //

List {
    // ... //
}
// List 아래 위치
.navigationTitle("조선시대 성문")
.navigationDestination(for: Color.self) { color in
    ColorDetail(color: color, message: $message)
}

```

- **for**
    - 값을 받아들일 타입을 입력합니다.
    - `Color` 값을 받을 예정이므로 `Color.self`를 입력합니다.
- `destination` (트레일링 클로저)
    - `ColorDetail` 뷰(후술)로 이동합니다.
    - `color` 파라미터와 `message` 파라미터가 있으며 `color`에는 `NavigationLink`에서 지정한 `value`값, `message`는 파발 메시지에 대한 바인딩(Binding) 값을 입력합니다.
    - **참고)** [SwiftUI: @State와 @Binding의 의미 / 뷰 간의 데이터 전송 (앞→뒤, 뒤→앞)](http://yoonbumtae.com/?p=5371)

`[동대문]` 버튼을 누르면 `Color.mint` 값이 전달되며 다음 뷰로 넘어갑니다.

 ![](/assets/img/wp-content/uploads/2023/04/screenshot-2023-04-03-pm-7.33.58-copy.jpg)

 

#### **ColorDetail.swift (두 번째 화면)**

```swift
struct ColorDetail: View {
    var color: Color
    @Binding var message: String
    
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        Text("\(color.description)")
            .foregroundColor(color)

        Divider()

        if #available(iOS 16.0, *) {
            // NavigationStack or NavigationView 없어도 됨
            NavigationLink("Go to Jacob Link", value: color.description).navigationDestination(for: String.self) { lastName in
                JacobDetail(lastName: lastName.capitalized, message: $message)
            }
        } else {
            // Fallback on earlier versions
        }

        Divider()

        Button {
            dismiss()
        } label: {
            Label("Back", systemImage: "chevron.left")
        }
    }
}
```

- `color`: 앞에서 전달한  `Color` 값
- `message`: 다음 뷰로 전달할 파발 메시지 (`@Binding`으로 연결)
- `dismiss`
    - `sheetView`, `fullScreenCover`에서는 창을 닫는 역할
    - 내비게이션에서는 현재 뷰를 종료하고 이전 뷰로 돌아가는 역할(뒤로가기)을 합니다.
- **NavigationLink**
    - `JacobDetail` 뷰(후술, 3번째 화면)으로 이동합니다.

 ![](/assets/img/wp-content/uploads/2023/04/screenshot-2023-04-03-pm-7.43.16.png)

#### **JacobDetail.swift**

```swift
struct JacobDetail: View {
    var lastName: String
    @Binding var message: String
    
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        Text("Jacob \(lastName)")
        Text("파발: \(message)")
        Button("왜곡") {
            let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            message = String((0..<8).map {_ in letters.randomElement()!})
        }
    }
}
```

- **message = ...**
    - `@Binding`으로 연결되어 있으므로 여기서 `message`의 값을 변경하면 맨 첫번째 뷰의 `message`도 변경이 됩니다.

 

<!-- http://www.giphy.com/gifs/TJikax42WUZzg13lsu -->
![](https://)

 

### **iOS 16.0 미만에서 내비게이션: NavigationView**

`NavigationStack`은 iOS 16.0 이상에서만 사용할 수 있으므로 단독으로 사용할 수 없습니다. 그 미만의 버전에서는 `NavigationView`를 사용해야 합니다.

또한 윗 섹션에서 사용된 `NavigationLink(_:value:)` 마찬가지로 iOS 16.0 이상에서만 사용할 수 있으므로 대신 `NavigationLink(_:destination:)`을 사용합니다.

```
if #available(iOS 16.0, *) {
    // ... //
} else {
    // Fallback on earlier versions
    NavigationView {
        List {
            NavigationLink("동대문") {
                ColorDetail(color: Color.mint, message: $message)
            }
            NavigationLink("서대문") {
                ColorDetail(color: Color.pink, message: $message)
            }
            NavigationLink("남대문") {
                ColorDetail(color: Color.cyan, message: $message)
            }
            NavigationLink("북대문") {
                ColorDetail(color: Color.teal, message: $message)
            }
            TextField("파발로 보낼 말을 입력", text: $message)
        }
        .navigationTitle("조선시대 성문")
        .navigationViewStyle(.stack) // 추가
    }
}
```

 

`ColorDetail.swift`도 이전 버전이 호환되도록 `else` 문을 추가합니다.

```
if #available(iOS 16.0, *) {
    // NavigationStack or NavigationView 없어도 됨
    NavigationLink("Go to Jacob Link", value: color.description).navigationDestination(for: String.self) { lastName in
        JacobDetail(lastName: lastName.capitalized, message: $message)
    }
} else {
    // Fallback on earlier versions
    NavigationLink("Go to Jacob Link") {
        JacobDetail(lastName: color.description.capitalized, message: $message)
    }}
```

<!-- https://giphy.com/gifs/iIDyddQQzHTqLqMv18 -->
![](https://)

 

### **전체 코드**

```swift
import SwiftUI

// 1st nav
struct ColorDetail: View {
    var color: Color
    @Binding var message: String
    
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        Text("\(color.description)")
            .foregroundColor(color)
        Divider()
        if #available(iOS 16.0, *) {
            // NavigationStack or NavigationView 없어도 됨
            NavigationLink("Go to Jacob Link", value: color.description).navigationDestination(for: String.self) { lastName in
                JacobDetail(lastName: lastName.capitalized, message: $message)
            }
        } else {
            // Fallback on earlier versions
            
            // JacobDetail에서 Binding시 뒤로가기 오류를 방지하기 위해 추가 (NavigationView)
            NavigationView {
                NavigationLink("Go to Jacob Link") {
                    JacobDetail(lastName: color.description.capitalized, message: $message)
                }
            }
        }
        Divider()
        Button {
            dismiss()
        } label: {
            Label("Back", systemImage: "chevron.left")
        }
    }
}

// 2nd nav
struct JacobDetail: View {
    var lastName: String
    @Binding var message: String
    
    var body: some View {
        Text("Jacob \(lastName)")
        Text("파발: \(message)")
        Button("왜곡") {
            let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            message = String((0..<8).map {_ in letters.randomElement()!})
        }
    }
}

struct NavStackView: View {
    @State var message: String = ""
    
    var body: some View {
        Image("동대문")
            .resizable()
            .aspectRatio(contentMode: .fill)
            .frame(maxWidth: .infinity, maxHeight: 150)
        if #available(iOS 16.0, *) {
            NavigationStack {
                List {
                    // NavigationLink은 밖에 있으면 버튼, List 안에 있으면 목록 형태로 자동 변형
                    NavigationLink("동대문", value: Color.mint)
                    NavigationLink("서대문", value: Color.pink)
                    NavigationLink("남대문", value: Color.cyan)
                    NavigationLink("북대문", value: Color.teal)
                    TextField("파발로 보낼 말을 입력", text: $message)
                }
                // List 아래 위치
                .navigationTitle("조선시대 성문")
                .navigationDestination(for: Color.self) { color in
                    ColorDetail(color: color, message: $message)
                }
            }
            // .transition(.identity)
        } else {
            // Fallback on earlier versions
            NavigationView {
                List {
                    NavigationLink("동대문") {
                        ColorDetail(color: Color.mint, message: $message)
                    }
                    NavigationLink("서대문") {
                        ColorDetail(color: Color.pink, message: $message)
                    }
                    NavigationLink("남대문") {
                        ColorDetail(color: Color.cyan, message: $message)
                    }
                    NavigationLink("북대문") {
                        ColorDetail(color: Color.teal, message: $message)
                    }
                    TextField("파발로 보낼 말을 입력", text: $message)
                }
                .navigationTitle("조선시대 성문")
                .navigationViewStyle(.stack)
            }
        }
    }
}

struct NavStackView_Previews: PreviewProvider {
    static var previews: some View {
        NavStackView()
    }
}

```
