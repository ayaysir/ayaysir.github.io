---
title: "iOS 프로그래밍: PickerView 위임(delegate) 및 데이터소스(DataSource)"
date: 2020-02-11
categories: 
  - "DevLog"
  - "Swift UIKit"
tags: 
  - "swift"
---

## 위임 및 데이터소스 설정하기

### 스토리보드 상에서 Delegate, DataSource 설정

 ![](/assets/img/wp-content/uploads/2020/02/screenshot-2020-02-15-am-12.17.34.png)

 
### 또는 코드상에서 Delegate, DataSource 설정

```swift
@IBOutlet weak var pkvKeyList: UIPickerView!

override func viewDidLoad() {
    pkvKeyList.delegate = self
    pkvKeyList.dataSource = self
}
```

## 딜리게이트 구현 

```swift
// PickerView Delegate

// 열 개수를 설정
func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return 1
}

// 행의 개수 전달
func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    return arrray.count
}

// 각 행의 제목 설정
func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    return array[row]
}

// 선택되었을 때 무엇을 할 것인지?
func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
    lblISomething.text = array[row]
}
```

 

 

 ![](/assets/img/wp-content/uploads/2020/02/screenshot-2020-02-12-am-12.45.35.png)

 

`ViewController` 클래스에서 `UIPickerViewDelegate`, `UIPickerViewDataSource`를 상속받고, 위 코드의 위치는 액션 함수 밑에 위치시킵니다.

### 피커뷰에서 각 행을 문자 대신 그림으로 만드는 방법

위의 예에서 '각 행의 제목 설정 부분'을 다음으로 대체합니다.

```swift
    // 이미지 피커 뷰 설정
    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        let imageView = UIImageView(image:imageArray[row])
        imageView.frame = CGRect(x: 0, y: 0, width: 100, height: 150)
        
        return imageView
    }
    
    // 피커 뷰 높이 전달
    func pickerView(_ pickerView: UIPickerView, rowHeightForComponent component: Int) -> CGFloat {
        return 80
    }
```

 ![](/assets/img/wp-content/uploads/2020/02/-2020-02-12-am-12.53.09-e1581436420431.png)
