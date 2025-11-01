---
title: "Swift(스위프트): CGContext에서 GState의 의미, saveGState & restoreGState 사용법 (스토리보드, Core Graphics)"
date: 2021-08-29
categories: 
  - "DevLog"
  - "Swift"
---

예를 들어 데이터가 있고, 데이터를 바탕으로 다음과 같은 그래프를 그리고 싶다고 가정합니다.

```
// Weekly sample data
var graphPoints = [4, 2, 6, 4, 5, 8, 3]
```

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-29-오후-10.44.18.jpg)

이 그래프 디자인 특징으로는 그래프 선 아래에 새로운 그라데이션이 있고, 각 그래프의 일정 범위마다 수치가 큰 크기의 점(원)으로 그려져있다는 점입니다.

 

이 디자인에 맞춰 코드를 작성하고 있고, 현재 아래 그림까지 완성된 `UIView`가 있습니다.

```
@IBDesignable
class GraphView: UIView {
    
    // Weekly sample data
    var graphPoints = [4, 2, 6, 4, 5, 8, 3]
    
    // 1
    @IBInspectable var startColor: UIColor = .red
    @IBInspectable var endColor: UIColor = .green
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    override func draw(_ rect: CGRect) {
        let width = rect.width
        let height = rect.height
        
        let path = UIBezierPath(
          roundedRect: rect,
          byRoundingCorners: .allCorners,
          cornerRadii: Constants.cornerRadiusSize
        )
        path.addClip()
        
        // 2
        guard let context = UIGraphicsGetCurrentContext() else {
            return
        }
        let colors = [startColor.cgColor, endColor.cgColor]
        
        // 3
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        
        // 4
        let colorLocations: [CGFloat] = [0.0, 1.0]
        
        // 5
        guard let gradient = CGGradient(
            colorsSpace: colorSpace,
            colors: colors as CFArray,
            locations: colorLocations
        ) else {
            return
        }
        
        // 6
        let startPoint = CGPoint.zero
        let endPoint = CGPoint(x: 0, y: bounds.height)
        context.drawLinearGradient(
            gradient,
            start: startPoint,
            end: endPoint,
            options: []
        )
        
        // Calculate the x point
            
        let margin = Constants.margin
        let graphWidth = width - margin * 2 - 4
        let columnXPoint = { (column: Int) -> CGFloat in
          // Calculate the gap between points
          let spacing = graphWidth / CGFloat(self.graphPoints.count - 1)
          return CGFloat(column) * spacing + margin + 2
        }
        
        // Calculate the y point
            
        let topBorder = Constants.topBorder
        let bottomBorder = Constants.bottomBorder
        let graphHeight = height - topBorder - bottomBorder
        guard let maxValue = graphPoints.max() else {
          return
        }
        let columnYPoint = { (graphPoint: Int) -> CGFloat in
          let yPoint = CGFloat(graphPoint) / CGFloat(maxValue) * graphHeight
          return graphHeight + topBorder - yPoint // Flip the graph
        }
        
        // Draw the line graph

        UIColor.white.setFill()
        UIColor.white.setStroke()
            
        // Set up the points line
        let graphPath = UIBezierPath()

        // Go to start of line
        graphPath.move(to: CGPoint(x: columnXPoint(0), y: columnYPoint(graphPoints[0])))
            
        // Add points for each item in the graphPoints array
        // at the correct (x, y) for the point
        for i in 1..<graphPoints.count {
          let nextPoint = CGPoint(x: columnXPoint(i), y: columnYPoint(graphPoints[i]))
          graphPath.addLine(to: nextPoint)
        }

        graphPath.stroke()
        
        // Create the clipping path for the graph gradient
            
        // 2 - Make a copy of the path
        guard let clippingPath = graphPath.copy() as? UIBezierPath else {
            return
        }
        
        clippingPath.addLine(to: CGPoint(x: columnXPoint(graphPoints.count - 1), y: height))
        clippingPath.addLine(to: CGPoint(x: columnXPoint(0), y: height))
        clippingPath.close()
        
        // 4 - Add the clipping path to the context
        clippingPath.addClip()
        
        // 5 - Check clipping path
        let highestYPoint = columnYPoint(maxValue)
        let graphStartPoint = CGPoint(x: margin, y: highestYPoint)
        let graphEndPoint = CGPoint(x: margin, y: bounds.height)
                
        context.drawLinearGradient(
          gradient,
          start: graphStartPoint,
          end: graphEndPoint,
          options: [])
		  
	// Draw the line on top of the clipped gradient
        graphPath.lineWidth = 1.5
        graphPath.stroke()
 
        
        // .. 추가 작성 필요 .. //
        
    }
}

```

여기까지 완성된 `UIView`입니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-29-오후-11.27.14.jpg)

 

이제 여기서 원으로 된 점을 넣을 차례이고, 다음 코드를 `draw` 함수의 최하단에 작성하였습니다. 그 후 결과를 보면 점이 제대로 표시되지 않는 문제가 발생합니다.

```
// Draw the circles on top of the graph stroke
for i in 0..<graphPoints.count {
  var point = CGPoint(x: columnXPoint(i), y: columnYPoint(graphPoints[i]))
  point.x -= Constants.circleDiameter / 2
  point.y -= Constants.circleDiameter / 2

  let circle = UIBezierPath(
    ovalIn: CGRect(
      origin: point,
      size: CGSize(
        width: Constants.circleDiameter,
        height: Constants.circleDiameter)
    )
  )
  circle.fill()
}
```

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-29-오후-10.52.46.jpg)

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-29-오후-10.52.54.jpg)

 

이 문제가 발생하는 이유는 무엇일까요?

정답은 중간에 클리핑된 `path`가 존재하기 떄문입니다.

- `clippingPath.addClip()`

이 명령은 `clippingPath`의 범위로 클립을 자른 뒤, 컨텍스트를 해당 영역으로 한정시키는 역할을 합니다. 다음 초록색으로 표시된 클리핑 영역 밖으로는 컨텍스트가 그릴 수 있는 범위가 아니며, 따라서 클리핑 영역을 벗어난 바깥에는 점이 그려지지 않는 것입니다.

 ![](/assets/img/wp-content/uploads/2021/08/-2021-08-29-오후-10.58.15-e1630247368787.jpg)

 

그렇다면 점을 `clippingPath`보다 미리 그리면 되지 않을까요?

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-29-오후-11.00.56.jpg)

점을 `clippingPath`보다 먼저 그리면 반대로 클리핑 영역에서 점이 표시되지 않습니다. 이 문제를 해결하려면 그래픽 상태의 통칭인 `GState`(graphics state) 라는 개념이 필요합니다.

 

점이 이상하게 나타나는 이유는 상태(`GState`)와 관련이 있습니다. 그래픽 컨텍스트는 상태를 저장할 수 있습니다. 상태에 저장되는 정보는 채우기 색상, 변환 매트릭스, 색상 공간 또는 클리핑 영역 등이 있는데, 여기에서 클리핑 영역도 상태 정보라는것을 주목해야 합니다.

현재 상태에 클리핑 영역이 있기 때문에 컨텍스트는 클리핑 영역 내에서만 동작하는 것입니다.

 

그렇다면 클리핑 영역에 관계없이 점을 온전한 형태로 표시하려면 어떻게 해야 할까요? 컨텍스트에서 제공하는 두 개의 메소드를 이용하면 됩니다.

현재 그래픽 상태의 복사본을 상태 스택에 푸시하는 `context.saveGState()`를 사용하여 상태를 저장할 수 있습니다. 그래프의 클리핑 단계 전에 `context.saveGState()`를 삽입합니다.

```
// 1 - Save the state of the context
context.saveGState()
    
// 2 - Make a copy of the path
guard let clippingPath = graphPath.copy() as? UIBezierPath else {
    return
}

clippingPath.addLine(to: CGPoint(x: columnXPoint(graphPoints.count - 1), y: height))
clippingPath.addLine(to: CGPoint(x: columnXPoint(0), y: height))
clippingPath.close()

// ... //

// 4 - Add the clipping path to the context
clippingPath.addClip()

```

상태가 스택에 `push`되어 저장되었습니다. 상태 스택에 저장된 최신 정보는 클리핑되기 전의 상태를 담고 있습니다.

다음, 점을 그리기 전에 `context.restoreGState()` 을 삽입합니다.

```
context.restoreGState()

// Draw the line on top of the clipped gradient
graphPath.lineWidth = 1.5
graphPath.stroke()

// Draw the circles on top of the graph stroke
for i in 0..<graphPoints.count {
  var point = CGPoint(x: columnXPoint(i), y: columnYPoint(graphPoints[i]))
  point.x -= Constants.circleDiameter / 2
  point.y -= Constants.circleDiameter / 2

  let circle = UIBezierPath(
    ovalIn: CGRect(
      origin: point,
      size: CGSize(
        width: Constants.circleDiameter,
        height: Constants.circleDiameter)
    )
  )
  circle.fill()
}
```

앞서 저장된 상태에서는 컨텍스트가 클리핑 전의 상태였는데 이것을 스택에서 `pop`해서 컨텍스트의 상태 정보를 되돌려놓습니다.

그렇다면 현재 상태는 클리핑되기 전이므로 컨텍스트가 그릴 수 있는 범위는 `clippingPath` 가 아니라 `rect` 전체가 됩니다.

따라서 점이 잘리지 않고 다음과 같이 온전하게 그려지는 것을 알 수 있습니다.

 

위의 사례 예외도 이 상태 스택을 응용하면 복잡한 그리기가 쉽게 될 것입니다. 다만, 상태가 `context` 내의 모든 정보를 담고 있는 것은 아닙니다. [애플 공식문서](https://developer.apple.com/documentation/coregraphics/cgcontext/1456156-savegstate)에 따르면, 클리핑되는 상태 정보는 다음 목록으로 한정됩니다.

- CTM (current transformation matrix)
- clip region
- image interpolation quality
- line width
- line join
- miter limit
- line cap
- line dash
- flatness
- should anti-alias
- rendering intent
- fill color space
- stroke color space
- fill color
- stroke color
- alpha value
- font
- font size
- character spacing
- text drawing mode
- shadow parameters
- the pattern phase
- the font smoothing parameter
- blend mode

여기에 따르면 패스(`path`) 자체는 그래픽 상태에 포함되지 않는 것을 알 수 있습니다. 앞서 예제에서 컨텍스트가 그릴 수 있는 영역은 그래픽 상태이지만 패스 자체는 `context`에 `addPath`를 했다고 해도 패스 저장되지 않았다는 것을 알 수 있습니다. 따라서 `path`는 변수로 관리해야 합니다.

출처 - [https://www.raywenderlich.com/10946920-core-graphics-tutorial-gradients-and-contexts](https://www.raywenderlich.com/10946920-core-graphics-tutorial-gradients-and-contexts)
