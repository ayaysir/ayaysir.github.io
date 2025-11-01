---
title: "SwiftUI: Tab View (탭 뷰) 사용하기 기초 (탭 바 형태, 페이지뷰 형태)"
date: 2023-06-04
categories: 
  - "DevLog"
  - "SwiftUI"
---

## **소개**

_**SwiftUI**_의 `TabView`를 이용해 다음 두 가지 형태의 뷰를 만들 수 있습니다.

1. **탭 바가 있는 뷰 형태**  ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-04-오후-11.23.49-복사본.jpg)
2. **페이지 인디케이터가 있는 페이지 뷰 형태** ![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjIyMjVhYjQ1YThmOTJkZjE0OWI5ZmMzMzRlZGY3NjBmYzhmODBhNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/WXuD4g170EIFry3x1y/giphy.gif)

 

#### **기본 형태**

```
TabView {
    MyCustomView()
    MyCustomView()
    MyCustomView()
    MyCustomView()
}
//.tabViewStyle(.page)
//.indexViewStyle(.page(backgroundDisplayMode: .always))
```

- `TabView` 트레일링 클로저 안에 표시할 뷰를 추가합니다.
- `tabViewStyle`은 페이지로 표시할 지, 또는 탭 바 형태로 표시할 지 결정합니다.
- `indexViewStyle`은 page로 표시하는 경우 인디케이터 뷰를 표시할지 여부를 결정합니다.

탭뷰 탭 뷰 TabView Tab View SwiftUI 스위프트 UI SwiftUI 스위프트유아이 페이지뷰 페이지 인디케이터

#### **탭 바 만들기**

`body` 안에 다음과 같이 추가합니다.

```
TabView {
    MyCustomView(text: "A").tabItem {
        Image(systemName: "snowflake")
        Text("First")
    }
    MyCustomView(text: "B").tabItem {
        Image(systemName: "fanblades")
        Text("Second")
    }
    MyCustomView(text: "C").tabItem {
        Image(systemName: "key")
        Text("Third")
    }
    MyCustomView(text: "D").tabItem {
        Image(systemName: "car")
        Text("Fourth")
    }
}
```

```
struct MyCustomView: View {
    @State var text = "empty"
    
    var body: some View {
        VStack {
            Text(text)
                .font(.system(size: 200))
        }
    }
}
```

- `MyCustomView`: 화면에 표시할 뷰입니다.
- **.tabItem**
    - 이 부분을 추가하면 탭바가 화면 하단에 추가됩니다.
    - 탭바 아이콘을 클릭하면 해당 페이지로 이동합니다.
    - 일반적으로 `Image` 한 개, `Text` 한 개를 쌍으로 이뤄 추가합니다.
        - 다른 요소를 더 추가할 경우 컴파일러 에러는 발생하지 않지만 아이콘이 제대로 표시되지 않을 수 있습니다.

 

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2JiMDZkZTE5ZDlmZjAzMzcyNjc3ZDRmYWVlYmI4ZTUzZDdkYjQwNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/ouTGFBY48y2jcE7DqN/giphy.gif)

> **참고)** 한 화면에서 탭 바의 최대 아이콘 개수는 5개까지 권장되며, 5개 초과는 사용자 경험 측면에서 덜 바람직하다고 알려져 있습니다.

 

아이패드에서는 탭 바가 다음과 같이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-04-오후-11.44.40-복사본.jpg)

#### **페이지 뷰 만들기**

`body` 안에 다음과 같이 추가합니다.

```
TabView {
    MyCustomView(text: "A")
    MyCustomView(text: "B")
    MyCustomView(text: "C")
    MyCustomView(text: "D")
}
.tabViewStyle(.page)
.indexViewStyle(.page(backgroundDisplayMode: .always))
```

- `tabViewStyle`을 `.page`로 지정하면 탭 바가 사라지고 좌우 스와이프를 이용해 페이지를 넘길 수 있습니다.
- 페이지 인디케이터를 표시하려면 `indexViewStyle`을 위 코드와 같이 지정해야 합니다.
- 탭 바에서 사용했던 `.tabItem` 부분은 옵션입니다. 이미지 한 개를 사용할 수 있으며 아래와 같이 인디케이터가 그림 아이콘 형태로 표시됩니다.  ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-04-오후-11.48.46.png)

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzllYzUxYWVjNGJlZTNhZTA0OTliZjY5OWE5MmJiZGE0MTAzOWM0NiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/ihcOVdvzjkg1TitSi7/giphy.gif)

 

> **참고)** 다른 뷰, 스택과 마찬가지로 TabView에 들어갈 수 있는 뷰의 최대 개수는 **10개**까지입니다. 초과하여 추가할 경우 컴파일러 에러(extra arguments)가 발생합니다.

 

##### **추가 링크**

- [SwiftUI custom TabBar Icons](https://stackoverflow.com/questions/59215407/swiftui-custom-tabbar-icons?rq=4)
