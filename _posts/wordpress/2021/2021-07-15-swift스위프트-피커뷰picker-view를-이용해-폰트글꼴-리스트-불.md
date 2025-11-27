---
title: "Swift(스위프트): 피커뷰(Picker View)를 이용해 폰트(글꼴) 리스트 불러오기 (iOS, 스토리보드)"
date: 2021-07-15
categories: 
  - "DevLog"
  - "Swift UIKit"
---

## **방법**

### **1) 스토리보드에 폰트를 선택할 피커뷰(picker view)와 미리보기 할 레이블을 배치합니다.**

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-15-am-11.08.10.jpg)

 

### **2) 다음 IB(InterfaceBuilder) Outlet 연결을 통해 컨트롤러에 UI 컴포넌트를 연결합니다.**

```swift
class SettingViewController: UIViewController {
    @IBOutlet weak var lblFontExample: UILabel!
    @IBOutlet weak var pkvAvailableFontList: UIPickerView!
    
    //....//
}
```

 

### **3) 폰트 목록을 저장할 배열을 생성합니다.**

```swift
// 폰트 리스트의 이름들 저장 배열
var availableFontList = [String]()
```

 

### **4) `viewDidLoad` 함수에 폰트 목록을 가져오는 함수를 작성합니다.** 

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    // 시스템의 모든 폰트 불러오기
    for family in UIFont.familyNames {
        print("\(family)")
        availableFontList.append(family)
        
        for name in UIFont.fontNames(forFamilyName: family) {
            print("\t\(name)")
        }
    }
    // Do any additional setup after loading the view.
}
```

여기서 font family와 이에 대한 font name이 있는데, 전자가 익히 알던 폰트 이름이며, 후자는 그 폰트에 대한 볼드, 이탤릭 체 등을 말합니다.

```
Apple Color Emoji
  AppleColorEmoji
Apple SD Gothic Neo
  AppleSDGothicNeo-Regular
  AppleSDGothicNeo-Thin
  AppleSDGothicNeo-UltraLight
  AppleSDGothicNeo-Light
  AppleSDGothicNeo-Medium
  AppleSDGothicNeo-SemiBold
  AppleSDGothicNeo-Bold
Apple Symbols
  AppleSymbols
Arial
  ArialMT
  Arial-ItalicMT
  Arial-BoldMT
  Arial-BoldItalicMT
Arial Hebrew
  ArialHebrew
  ArialHebrew-Light
  ArialHebrew-Bold
Arial Rounded MT Bold
  ArialRoundedMTBold
```

예제에서는 font family만 사용합니다. `availableFontList.append(family)` 를 이용해 배열에 폰트 패밀리를 추가합니다.

 

### **4) 피커뷰는 딜리게이트(delegate) 패턴을 사용하므로 스토리보드에서 컨트롤러가 delegate 할 수 있도록 설정합니다.**

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-15-am-11.17.23.jpg)

 

### **5) 피커뷰에 폰트 목록이 나올 수 있도록 설정합니다. 뷰 컨트롤러가 `UIPickerViewDelegate`, `UIPickerViewDataSource`를 구현해야 합니다.**

별도의 `extension`으로 분리해 작성하면 편리합니다.

```swift
extension SettingViewController: UIPickerViewDelegate, UIPickerViewDataSource {
    
    // 컴포넌트 (열) 의 개수
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    // 행의 개수
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return availableFontList.count
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        // 특정 폰트를 선택했을 때, label 의 폰트가 바뀌도록
        lblFontExample.font = UIFont(name: availableFontList[row], size: lblFontExample.font.pointSize)
    }
    
    // 피커뷰 행에 폰트 목록 표시
    func pickerView(_ pickerView: UIPickerView, viewForRow row: Int, forComponent component: Int, reusing view: UIView?) -> UIView {
        let pickerLabel = UILabel()
        pickerLabel.font = UIFont(name: availableFontList[row], size: CGFloat(20))
        pickerLabel.text = availableFontList[row]
        pickerLabel.textAlignment = .center
        return pickerLabel
    }
    
}
```

## **동작화면**
 

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-15-am-11.20.29.jpg)
