---
title: "Swift: UIKIt에서 뷰의 Frame과 Bounds의 차이"
date: 2024-02-01
categories: 
  - "DevLog"
  - "Swift UIKit"
---

#### **소개**

UIKIt에서 뷰의 Frame과 Bounds의 차이점에 대해 알아봅니다.

 

#### **위치**

##### **(1) frame**

- `frame`은 바로 위에 있는 상위 뷰(superview)를 기준으로 위치가 설정됩니다.
- superview의 `최초 시작 위치`를 기준으로 `(x: 0, y: 0)` 으로 시작합니다.
- superview가 어느 위치에 있든간에 오로지 superview의 `최초 시작 위치`를 기준으로 합니다.
    - `최초 시작 위치`는 기본적으로 `뷰의 절대값 위치`지만, `bounds`에 의해 변형될 수 있습니다.

 

```
override func loadView() {
    let view = UIView() // superview(검은색)
    view.backgroundColor = .black
    view.frame.size = .init(width: 500, height: 500)
    self.view = view
    
    let subview1 = UIImageView() // subview(노란색)
    subview1.backgroundColor = .yellow
    subview1.frame = .init(x: 100, y: 100, width: 200, height: 300)
    view.addSubview(subview1)
}
```

![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-01-오후-8.10.13-복사본.jpg)

- subview의 `frame` 위치가 `x: 100, y: 100`인 경우, superview의 시작점 위치로부터 해당 거리만큼 떨어진 곳에 위치하게 됩니다.

 

만약 노란색 안에 또 하위 뷰(빨간색 네모)를 추가하였다면 해당 뷰는 노란색 뷰의 `frame` 위치를 기준으로 위치를 잡게 됩니다. 아래 그림처럼 노란색 뷰의 `frame` 위치가 움직인다면 그 하위 뷰 또한 노란색 뷰의 위치에 따라 같이 이동하게 됩니다.

![](https://media.giphy.com/media/L6pWhuuD1n5MJLu1Rx/giphy.gif)

 

##### **(2) bounds**

- `bounds`의 위치는 다른 뷰를 기준점으로 삼지 않으며  `bounds`의 위치를 지정하면 자신만의 좌표시스템을 새로 생성합니다.
- origin(위치)의 기본값은 `(x: 0, y: 0)`으로 지정되며 이는 자신(뷰)가 표시(display)되는 시작점입니다..
- `bounds`의 `origin`를 변경하면
    - 자신의 위치는 변하지 않지만 이 뷰의 모든 하위 뷰의 `frame` 위치가 영향을 받게 됩니다.
    - 자신의 bounds 위치가 `눈에 보이는 내가 시작하는 위치`라고 하위 뷰들에게 강제로 통보합니다.

 

개념이 어려운데요, 첫 번째 코드 예제에서 노란색 뷰 안에 하늘색 하위 뷰 `grandChildView`를 추가합니다.

```
let grandChildView = UIView()
grandChildView.backgroundColor = .cyan
grandChildView.frame = .init(x: 0, y: 0, width: 200, height: 150)
subview1.addSubview(grandChildView)
```

![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-01-오후-8.24.49-복사본.jpg)

처음에는 `bounds`의 위치를 따로 지정하지 않았으므로 `bounds.origin`은 `(0, 0)`인 상태에서 하위뷰의 `frame.origin`도 `(0, 0)`이므로 두 뷰의 시작점은 똑같습니다.

그러나 여기서 `bounds`의 시작점을 지정하고, 하위뷰(하늘색)의 `frame`은 그대로 놔두면

```
subview1.bounds.origin = .init(x: 30, y: 30)
grandChildView.layer.compositingFilter = "multiplyBlendMode"
```

아래와 같이 하위 뷰(하늘색)의 시작점이 이동하는 것을 볼 수 있습니다. (편의를 위해 겹치는 부분의 색을 섞었습니다.)

![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-01-오후-8.35.12-복사본.jpg)

- superview(노란색)의 `bounds.origin`을 `(30, 30)`으로 바꾸면 하위 뷰들은 화면에 표시된 노란색의 시작점을 `(0, 0)`이 아닌 `(30, 30)`이라고 인식하게 됩니다.
- 그런데 subview(하늘색)의 `frame.origin`은 `(0, 0)`으로 바뀌지 않았습니다.
- 따라서 하위뷰는 노란색에서 `30만큼 왼쪽, 30만큼 위쪽`으로 위치한 곳이 자신의 상위뷰의 시작점이라고 인식하게 되고 이에 따라 하위뷰의 시작점은 그만큼 이동하게 됩니다.

 

노란색 상위뷰 시작점을 따라가고 싶다면 상위뷰의 `bounds.origin`처럼 하위뷰의 `frame.origin`을 `(30, 30)`으로 지정하면 의도한 대로 됩니다. 아래 그림은 상위뷰의 `bounds`가 `(30, 30)`인 상태에서 하위뷰의 `frame` 위치가 `(0, 0)`, `(30, 30)`, `(60, 60)`, `(90, 90)`인 경우의 위치를 나타낸 그림입니다.

![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-01-오후-8.51.08-복사본.jpg)

- `bounds` 위치가 `(30, 30)`인 상태에서 `frame`의 위치도 `(30, 30)`이라면 위치가 겹치게 됩니다.

 

아래 상황은 빨간색 하위뷰의 `frame.origin`이 `(50, 100)` 인 상태에서 상위뷰의 `bounds.origin`를 `(0, 0)`에서 `(50, 100)`으로 변화시켰을 때 하위 뷰의 움직임을 나타낸 것입니다. (움짤에 subview라고 잘못 적혀있는데 superview bounds 입니다.)

https://giphy.com/gifs/mal5WEVeXBVfI2s3L7

 

#### **크기**

- 기본적으로 변형이 되지 않은 상태에서 `frame`과 `bounds`는 서로 크기 정보를 공유합니다.
    - 둘 중 하나의 크기를 변화시키면 서로 동기화가 됩니다.
    - `frame` 크기를 `(200, 200)`으로 변화시키면 `bounds` 크기도 `(200, 200)`이 되며, 그 반대도 성립합니다.
- 그러나 `transform`과 같이 뷰 형태를 변형시켰을 때
    - `frame`은 변형된 위치와 크기를 나타냅니다. `frame`의 크기는 변화된 부분을 모두 반영한 변형되지 않은 사각형의 위치 및 크기로 변환됩니다.
    - `bounds`는 그 도형이 변형되기 전, 원래 있어야 할 위치와 크기값 그대로이며 값이 변하지 않습니다.

```
grandChildView.transform = .init(rotationAngle: 50)
print(grandChildView.frame, grandChildView.bounds)

// (-16.17471687700599, -23.609937507301378, 232.349433754012, 197.21987501460274) (0.0, 0.0, 200.0, 150.0)
// frame, bounds 정보
```

![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-01-오후-9.04.47-복사본.jpg)

- 하위 뷰(하늘색)을 50도 회전시켰을 때: 원래 변형전 `frame(bounds).size`는 `(0, 0, 200, 150)`
    - `frame`은 변형된 위치와 크기로 재계산됩니다. 이 때, 위 그림의 빨간색 박스와 같이 회전되면서 남은 빈 영역까지 포함한 사각형 `CGRect`로 표현됩니다.(말로 설명이 어렵네요;;)  따라서 새로운 위치는 `(-16, -24, 232, 197)`로 바뀝니다.
    - `bounds`는 변형되지 않았을 때 크기와 위치값을 그대로 가집니다. 따라서 위 그림의 보라색 부분이며 `(0, 0, 200, 150)`으로 그대로입니다.
