---
title: "Swift UIKit: PDFKit에서 PDF 파일의 Annotation 지우개 구현"
date: 2023-12-22
categories: 
  - "DevLog"
  - "SwiftUI"
---

#### **소개**

인터넷에서 `PDFKit`과 `Annotation`을 다루는 예제를 찾았는데 이 저장소가 지우개 기능이 제대로 구현이 안되어 있기 때문에 참고용으로 포스트를 작성합니다.

- [https://github.com/poluektov/pdfkit-ink-annotations](https://github.com/poluektov/pdfkit-ink-annotations)

 

##### **Step 1: 메인 화면에 지우개 버튼 추가**

- `Main.storyboard` 파일을 연 뒤 `Bar Button Item`과 `Flexible Space`를 추가한 뒤 화면 하단의 툴바에 삽입합니다.
- `Bar Button Item`의 텍스트를 `Eraser`로 변경하고 `Assistant` 에디터를 열어 `DocumentDrawingViewController`의 `changeDrawingTool(sender:)`에 연결합니다.
- tag는 기본값인 `0`번으로 되어있는데 지우개의 태그값이 `0`이므로 그대로 놔둡니다.

 ![](/assets/img/wp-content/uploads/2023/12/screenshot-2023-12-22-pm-11.29.58-copy.jpg)

 ![](/assets/img/wp-content/uploads/2023/12/screenshot-2023-12-22-pm-11.33.20-copy.jpg)

 ![](/assets/img/wp-content/uploads/2023/12/screenshot-2023-12-22-pm-11.33.27-copy.jpg)

 

##### **Step 2: \[옵션\] PDFDrawer.swift 파일에서 removeAnnotationAtPoint(point:page:) 변경**

```
private func removeAnnotationAtPoint(point: CGPoint, page: PDFPage) {
    if let selectedAnnotation = page.annotationWithHitTest(at: point) {
        // selectedAnnotation.page?.removeAnnotation(selectedAnnotation) // 원래 코드
        page.removeAnnotation(selectedAnnotation)
    }
}
```

- 변경 이유
    - 이미 파라미터로 타깃 `page`를 받고 있고
    - `selectedAnnotation` 자체가 해당 `page`에서 존재하는 것을 찾은 것인데
    - 굳이 `selectedAnnotation.page?`로 다시 역추적할 필요가 없어서
    - `page.removeAnnotation(selectedAnnotation)`로 변경하였습니다.
- 해당 부분은 동작에 차이가 없으므로 그냥 놔둬도 됩니다.

 

##### **Step 3: PDFPage+Selection.swift 파일의 annotationWithHitTest(at:) 변경**

```swift
import UIKit
import PDFKit

extension PDFPage {
    func annotationWithHitTest(at: CGPoint) -> PDFAnnotation? {
        for annotation in annotations {
            if annotation.bounds.contains(at) {
                return annotation
            }
        }
        
        return nil
    }
}

```

위에서 하이라이트 된 `7번 라인`이 원본에서 변경된 부분입니다.

 

원래 저장소에서는 다음과 같이 되어있습니다 **(에러 코드)**

```
if annotation.contains(point: at) {...}

// =========== 임의로 구현된 contains 메서드 ❌ (오류 발생) =========== //

import UIKit
import PDFKit
import Foundation

extension PDFAnnotation {
    
    func contains(point: CGPoint) -> Bool {
        var hitPath: CGPath?
        
        if let path = paths?.first {
            hitPath = path.cgPath.copy(strokingWithWidth: 10.0, lineCap: .round, lineJoin: .round, miterLimit: 0)
        }
        
        return hitPath?.contains(point) ?? false
    }
}
```

하지만 이 코드는 파라미터로 받은 `point`와 `hitPath`의 좌표가 가르키는 부분이 완전히 달라서 동작하지 않습니다. 이 부분은 이제 필요가 없으므로 이 메서드가 있는 `PDFAnnotationWithPath.swift` 파일은 지워도 무방합니다.

 

<!-- https://giphy.com/gifs/sEjBvwFkB3y7zAufQ7 -->
![](https://)
