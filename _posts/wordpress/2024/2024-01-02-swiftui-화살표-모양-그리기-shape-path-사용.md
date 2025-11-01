---
title: "SwiftUI: 화살표 모양 그리기 (Shape, Path 사용)"
date: 2024-01-02
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **SwiftUI에서 화살표 모양을 그리는 방법**

- 원문: [How to Create Arrow Shape in SwiftUI](https://codingwithrashid.com/how-to-create-arrow-shape-in-swiftui/)

 

#### **소개**

앱을 개발할 때, 사용자에게 알려줄 여러 기호가 필요하다는 것을 깨닫게 됩니다. 화살표는 움직임이나 방향을 나타내는 널리 알려진 기호입니다.

SwiftUI의 유연성(flexibility)은 화살표의 생성과 방향 지정을 쉽게 할 수 있게 합니다. 🤔 SwiftUI에서 화살표를 추가하고 회전하는 방법을 알아봅니다.

 

#### **커스텀 화살표 Shape 만들기**

SwiftUI에 화살표는 기본적으로 포함되어 있지 않지만, 곧바로 만들 수 있습니다. `Shape` 프로토콜을 준수(`conform`)하는 새 `struct`(구조체)를 만들고 `path(in:)` 메서드를 구현하세요.

다음은 윗방향 화살표를 그리는 예제입니다.

```
import SwiftUI

struct ArrowShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()

        // 화살표 머리, 꼬리의 비율 정하기
        let arrowWidth = rect.width * 0.4
        let arrowHeight = rect.height * 0.6

        // 화살표 꼬리 그리기 (1~4)
        path.move(to: CGPoint(x: rect.midX - arrowWidth / 2, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.midX + arrowWidth / 2, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.midX + arrowWidth / 2, y: rect.maxY - arrowHeight))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - arrowHeight))

        // 화살표 머리 그리기 (5~7)
        path.addLine(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY - arrowHeight))
        path.addLine(to: CGPoint(x: rect.midX - arrowWidth / 2, y: rect.maxY - arrowHeight))

        // 패스 닫기
        path.closeSubpath()

        return path
    }
}
```

`ArrowShape` 구조체는 `Path`를 사용해 윗방향 화살표를 그리고 있습니다. `path(in:)`로 넘어온 `rect`를 바탕으로 크기를 계산합니다. 이 `rect`는 `Shape`의 프레임을 나타냅니다.

 

 ![](/assets/img/wp-content/uploads/2024/01/스크린샷-2024-01-02-오후-9.17.14-복사본.jpg)

 

#### **화살표 Shape를 View에 통합**

위의 화살표는 SwiftUI의 `View`에서 사용할 수 있습니다.

```
struct ContentView: View {
    var body: some View {
        ArrowShape()
            .fill(.blue)
            .frame(width: 100, height: 200)
            .aspectRatio(1, contentMode: .fit)
    }
}
```

`ContentView` 구조체는 `ArrowShape`의 인스턴스를 만들고, `.blue` 컬러로 색을 채운 뒤, 프레임의 크기를 지정합니다. `aspectRatio` 변경자(modifier)는 화살표 모양이 비율적으로 스케일되도록 합니다.

 

 ![](/assets/img/wp-content/uploads/2024/01/swiftui-arrow-shape.webp)

 

#### **화살표 회전**

SwiftUI에서 `rotationEffect`을 이용해 손쉽게 도형을 회전할 수 있습니다. 다음 예제는 화살표를 오른쪽으로 회전합니다.

```
struct ContentView: View {
    var body: some View {
        ArrowShape()
            .fill(blue)
            .frame(width: 100, height: 200)
            .rotationEffect(.degrees(90)) // 90도 오른쪽으로 회전
            .aspectRatio(1, contentMode: .fit)
    }
}
```

`.rotationEffect` 변경자는 파라미터로 각도(degrees 또는 radian)를 받고 해당 각도만큼 회전시킵니다. `.degrees(90)` 를 사용하면 오른쪽으로 90도 회전합니다.

 ![](/assets/img/wp-content/uploads/2024/01/스크린샷-2024-01-02-오후-9.38.58.png)

 

#### **실시간으로(dynamically) 화살표 회전** 

`@State` 변수로 각도를 추가한 뒤, `Slider`를 사용해 회전시킬 수 있습니다.

```
import SwiftUI

struct ContentView: View {
    @State private var rotationDegrees: Double = 0

    var body: some View {
        VStack {
            ArrowShape()
                .fill(blue)
                .frame(width: 100, height: 200)
                .rotationEffect(.degrees(rotationDegrees))
                .aspectRatio(1, contentMode: .fit)

            Slider(value: $rotationDegrees, in: 0...360, step: 1)
                .padding()
        }
    }
}
```

https://giphy.com/gifs/BMydFHCDSTURkilnoz

 

 

SwiftUI 화살표를 만드는 것은 path를 그리는 것만 배우는 것이 아닙니다. 이를 통해 뷰들을 변형하고 다루는 방법도 연습할 수 있습니다. 이러한 방법을 마스터하면, 기능과 스타일이 조화된 직관적이고 인터랙티브한 시각적 요소를 만들 수 있습니다.
