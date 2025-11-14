---
title: "Swift: PDFView에서 터치한 곳의 문서상 좌표 알아내기"
date: 2024-03-14
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

PDFView에서 탭했을 때 확대 여부에 상관없이 실제 PDF 문서상의 좌표를 알아내고 싶을 때 사용하는 방법입니다,

- 스크린상에 터치했을 때 나오는 좌표를 실제 PDF 페이지에 알맞게 변환하여 사용합니다.
- 확대/축소 및 스크롤 위치 여부에 상관없이 일정한 좌표값을 받을 수 있습니다.

 

## 방법

### **Step 1: UITapGestureRecognizer를 PDFView에 추가**

```swift
class DrawingPDFView: PDFView {
    init() {
        super.init(frame: .zero)
        
        let pdfTapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(tapView))
        self.addGestureRecognizer(pdfTapGestureRecognizer)
    }
}
```

- 위 예제는 PDFView를 상속받은 커스텀 PDFView를 만드는 과정이므로 생성자에서 `self`를 통해 추가했습니다.
- 다른 곳에서 PDFView를 참조하는 변수가 있는 경우 `pdfView.addGestureRecognizer(pdfTapGestureRecognizer)`로 추가합니다.

 

### **Step 2: UITapGestureRecognizer를 통해 탭한 곳의 좌표값 받아오기**

```swift
@objc func tapView(_ gesture: UITapGestureRecognizer) {
    let tapLocation = gesture.location(in: self.documentView)
    print("before convert:", tapLocation)
}
```

- `tapLocation`은 스크린상에 터치했을 때 나오는 좌표입니다.
- PDF 문서 스크롤/줌 상관없이 화면 영역의 좌표를 반환합니다.

 

### **Step 3: tapLocation을 실제 PDF 문서에 맞는 좌표로 변환 후 사용**

```swift
@objc func tapView(_ gesture: UITapGestureRecognizer) {
    // ... //
   
    guard let page = self.page(for: tapLocation, nearest: true) else {
        return
    }
    
    let convertedLocation = self.convert(tapLocation, to: page)
    
    print("after convert:", convertedLocation)
}
```

- `page`: 현재 터치한 곳에서 가장 가까운 페이지(=> 즉 현재 페이지)를 반환합니다.
- **convert(tapLocation, to: page)**
    - 현재 페이지를 기준으로 `tapLocation`의 좌표를 반환합니다.

 
 

## **결과**

<!-- https://giphy.com/gifs/7ZHlSvH6I46oDP8ILg -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2l3bWpldDk5eWl0ZXVzNjAycml4OW9uaGlzYWhoYWhjamF5dTduNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7ZHlSvH6I46oDP8ILg/giphy.gif)

확대/축소 및 이동하면서 여러 곳을 찍어도 After 좌표는 일정한 위치를 가리키는 것을 확인할 수 있습니다.

```
before convert: (214.3333282470703, 320.0)
after convert: (748.5426306844103, 1547.0344105366714)

before convert: (106.33332824707031, 592.6666564941406)
after convert: (772.6891673498006, 1561.4444523675306)

before convert: (259.3333282470703, 161.3333282470703)
after convert: (753.995074447563, 1560.2760656184487)

before convert: (240.0, 380.0)
after convert: (756.0027633148983, 1610.9335426799644)

before convert: (182.0, 343.3333282470703)
after convert: (765.3372679396834, 1370.8407335765337)

before convert: (346.0, 316.6666564941406)
after convert: (772.7663913146058, 1554.5758590878288)
```
