---
title: "SwiftUI: 방사형(원형) 레이아웃 (Radial Layout) 만들기"
date: 2024-04-03
categories: 
  - "DevLog"
  - "Swift"
---

### 소개

뷰의 중심점(center point)과 반경을 계산하여 사용자 정의 방사형 레이아웃을 생성합니다.

- 커스텀 레이아웃 및 예제의 대부분 코드들은 iOS 16부터 지원합니다.
- 출처: [Radial Layout](https://designcode.io/swiftui-handbook-radial-layout)

 

### **구현**

#### **커스텀 Radial Layout 만들기**

레이아웃 중앙에 서브뷰를 배치하고 인덱스 값을 사용하여 최소한의 변형(transforming)을 수행하는 사용자 정의 레이아웃 코드부터 시작하겠습니다.

- `CustomLayout`을 생성하고 Xcode의 제안 기능을 통해 함수 목록을 자동으로 채우도록 합니다.
- `Proposal.replacingUnspecifiedDimensions()`를 사용하겠습니다.
    -  proposal의 지정되지 않은 치수를 지정된 크기의 해당 치수(dimension)로 대체하는 새로운 proposal을 생성합니다.

> proposal은 `ProposedViewSize` 타입인데요. 쉽게 말하면 부모 View에서 받은 사이즈라고 보시면 될 것 같습니다. 부모 View에서 해당 Layout에 부여할 수 있는 크기를 제안하고 그것을 활용해서 layout의 크기를 구하는데 사용합니다.
> 
> [https://velog.io/@comdongsam/SwiftUI-Layout](https://velog.io/@comdongsam/SwiftUI-Layout)

 

```
struct RadialLayout: Layout {
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        proposal.replacingUnspecifiedDimensions()
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        // Place subviews
    }
}
```

 

##### **서브뷰 배치**

루프의 모든 항목을 사용자 정의 위치에 배치해 보겠습니다.

```
func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
    let radius = bounds.width / 3.0
    let angle: CGFloat = Angle.degrees(360.0 / CGFloat(subviews.count)).radians
    
    subviews.enumerated().forEach { index, subview in
        // Position
        var point = CGPoint(x: 0, y: -radius)
            .applying(.init(rotationAngle: angle * CGFloat(index)))
        
        // Center
        point.x += bounds.midX
        point.y += bounds.midY
        
        // Place subviews
        subview.place(at: point, anchor: .center, proposal: .unspecified)
    }
}

```

- `x`와 `y`의 값을 증가시키기 위해 인덱스를 사용하고 있다는 점에 유의하세요.

 

##### **반경 (Radius)**

레이아웃 크기(`bounds`)의 `1/3`을 사용해 해당 값으로 `y` 위치를 이동시킬 것입니다.

```
// Before for loop
let radius = bounds.width / 3.0
```

 

반경을 사용하여 사용하여 `x` 및 `y` 값을 변경합니다.

```
var point = CGPoint(x: 0, y: -radius)
```

- `-radius`를 사용하여 요소들이 12시 방향부터 시계 방향으로 진행하도록 합니다.

 

##### **각도 (Angle)**

이것은 원형 레이아웃이므로 `360도`를 아이템 개수로 나누어야 합니다. 그런 다음 값을 라디안(`radians`)으로 변환합니다.

```
// After radius
let angle: CGFloat = Angle.degrees(360.0 / Double(subviews.count)).radians
```

 

마지막으로 각도(`angle`)와 인덱스 값의 배수(`index`)를 사용합니다. 이렇게 하면 항목이 원 안에 적절하게 분산됩니다.

```
var point = CGPoint(x: 0, y: -radius)
  .applying(.init(rotationAngle: angle * CGFloat(index)))
```

- 아이템수로 나눈 각도를 아이템 인덱스를 곱해 회전이 되도록 합니다.
- 예를 들어 12개 아이템이 있는 경우 `360 / 12 = 30도`가 되어 0번째 아이템은 `30 * 0 = 0도`, 4번째 아이템은 `30 * 3(=> 배열 인덱스는 0부터 시작) = 90도`에 회전 배치됩니다.

 

#### **뷰에 적용**

예제로 시계를 만들어봅니다.

 

##### **데이터**

뷰를 생성한 다음 멤버 변수로 다음 데이터를 추가합니다.

```
let icons = ["calendar", "message", "figure.walk", "music.note"]
let numbers = [12,1,2,3,4,5,6,7,8,9,10,11]
```

- `icons`: 시계 안쪽에 아이콘으로 표시할 목록입니다.
- `numbers`: 시계의 시(hour) 및 분(minute)를 표시하기 위해 사용합니다.
    - 레이아웃은 0시 방향부터 시작하므로 `12`를 맨 앞으로 배치합니다.

 

##### **프레임 크기 및 ZStack**

레이아웃에 프레임 크기를 설정하고 ZStack에 포함시킵니다. 이렇게 하면 더 많은 방사형 레이아웃을 만들 수 있습니다.

```
ZStack {
    RadialLayout {
        // ForEach
    }
    .frame(width: 사이즈)
}
```

 

##### **시 (Hour)**

방사형 레이아웃을 사용하여 시계의 12개 숫자를 반복합니다.

앞서 생성한 `numbers` 데이터를 바탕으로 시계의 시간을 반복하고 디자인합니다. `ZStack` 안에 배치합니다.

```
// Hours
RadialLayout {
  ForEach(numbers, id: \.self) { number in
    Text("\(number)")
      .font(.system(.title, design: .rounded))
      .bold()
      .foregroundStyle(.black)
  }
}
.frame(width: 240)
```

- font의 design: 둥근 글꼴(.rounded)를 적용합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-04-오전-12.12.12-복사본.jpg)

 

##### **분 (Minute)**

시간과 마찬가지로 동일한 데이터를 사용하지만 이번에는 `5`를 곱하여 분을 구하겠습니다.

```
// Minutes
RadialLayout {
  ForEach(numbers, id: \.self) { item in
    Text("\(item * 5)")
      .font(.system(.caption, design: .rounded))
      .foregroundColor(.black)
  }
}
.frame(width: 360)
```

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-04-오전-12.13.59-복사본.jpg)

 

##### **아이콘**

```
RadialLayout {
  ForEach(icons, id: \.self) { item in
    Circle()
      .frame(width: 44)
      .overlay {
        Image(systemName: item)
          .foregroundStyle(.white)
      }
  }
}
.frame(width: 120)
```

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-04-오전-12.14.58-복사본.jpg)

 

위 세개의 요소가 전부 포함된 화면은 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-04-오전-12.15.34-복사본.jpg)

 

##### **대시 라인 스트로크하기 (Stroke Dash Lines)**

StrokeStyle을 사용하면 대시와 간격을 사용자 정의하여 시계 라인을 얻을 수 있습니다.

```
Circle()
  .strokeBorder(.black, style: StrokeStyle(lineWidth: 10, dash: [1, 10]))
  .frame(width: 220)
```

- `.black`: 검은색 선을 그립니다.
- `StrokeStyle`
    - `lineWidth`: 선의 굵기
    - `dash`: 대시 라인 패턴
- 참고: [대시 라인을 그리기 위한 패턴 배열 만들기](https://www.amcharts.com/docs/v4/tutorials/dotted-and-dashed-lines/#Dasharray_values) (JS + CSS로 설명되어있지만 Swift에도 적용 가능합니다.)

 

완성된 화면은 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-04-오전-12.17.19-복사본.jpg)

참고로 `RadialLayout`의 `frame` 구분 영역은 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-04-오전-12.12.25-복사본.jpg)
