---
title: "SwiftUI: Spacer (스페이서) - 공백 표시 뷰"
date: 2023-03-23
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

SwiftUI에서, 스페이서(`Spacer`)는 공백을 표시하는 `View`입니다.

`VStack`, `HStack`에서 사용할 수 있습니다.

 

> **참고)** `ZStack`에서도 코드는 동작하지만 `ZStack`은 Z축의 스택이기 때문에 아래처럼 겹쳐 보입니다.
> 
> ```
> struct StacksView: View {
>     var body: some View {
>         ZStack {
>             Text("가나다")
>             Spacer()
>             Text("ABC")
>         }
>     }
> }
> ```
> 
>  ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.01.04.png)
> 
>  ![](/assets/img/wp-content/uploads/2023/03/다운로드.png)

 

#### **Spacer의 기본 사용법**

```
HStack {
    Text("가나다")
    Spacer()
    Image(systemName: "play.fill")
}
```

 ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.02.22-복사본.jpg)

- `Spacer()`는 `View`의 한 종류로 취급되므로 뷰처럼 사용하면 됩니다.
- 현재 공간에서 사용할 수 있는 최대한의 공백을 띄워줍니다.
- `Text`와 `Image`간 `Spacer`를 사용하면 텍스트, 이미지 부분을 제외한 나머지 영역 전부를 `Spacer`가 차지하게 됩니다.
- 다음과 같이 여러 `Spacer`를 사용할 수 있습니다.  ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.14.03-복사본.jpg)
    
    ```
    HStack {
        Text("가나다")
        Spacer()
        Image(systemName: "play.fill")
        Spacer()
        Text("ABC")
        Spacer()
        Image(systemName: "pause.fill")
    }
    ```
    

 

> **참고)** `Spacer` 또한 `View`이기 때문에 스택 당 최대 뷰의 개수 `10개`를 초과하면 오류가 발생합니다.
> 
>  ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.08.17-복사본.jpg)

 

#### **Spacer의 공백 너비를 조절하는 방법**

##### **1) minLength 파라미터 지정**

`minLength`를 지정하면 최소 너비(또는 높이)를 지정할 수 있습니다. 공백의 크기가 `minLength`보다 크다면 해당 크기로 표시되지만 공백의 크기가 `minLength`보다 작아지는 경우 `minLength`로 고정됩니다.

```
HStack {
    Text("가나다")
    Spacer(minLength: 300)
    Image(systemName: "play.fill")
    Spacer()
    Text("ABC")
    Spacer()
    Image(systemName: "pause.fill")
}
```

\[caption id="attachment\_5391" align="alignnone" width="430"\] ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.16.15-복사본-1.jpg) `minLength`를 지정한 경우\[/caption\]

 

\[caption id="attachment\_5389" align="alignnone" width="434"\] ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.14.03-복사본.jpg) `minLength`가 없는 경우\[/caption\]

 

##### **2) frame에서 size를 지정**

`HStack`이라면 `width`, `VStack`이라면 `height`를 지정하면 됩니다.

**HStack(가로 스택)은 width**

```
HStack {
    Text("가나다")
    Spacer()
        .frame(width: 30)
    Image(systemName: "play.fill")
    Spacer()
    Text("ABC")
    Spacer()
    Image(systemName: "pause.fill")
}
```

 ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.21.04-복사본.jpg)

 

**VStack(세로 스택)은 height**

 ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.24.06-복사본.jpg)

 

##### **참고: Spacer 없이 Stack 내의 View간 간격을 조절하는 방법**

`spacing` 파라미터를 사용하면 됩니다.

```
VStack(spacing: 50) {
    Text("가나다")
    Image(systemName: "play.fill")
    Text("ABC")
    Image(systemName: "pause.fill")
}
```

 ![](/assets/img/wp-content/uploads/2023/03/스크린샷-2023-03-23-오후-10.29.45-복사본.jpg)
