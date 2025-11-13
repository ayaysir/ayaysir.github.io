---
title: "Swift(스위프트): 아이폰 진동(Vibration, Haptic) 구현하기 上 (기초)"
date: 2022-12-01
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

Swift에서 진동(Vibration 또는 Haptic)을 구현하는 방법입니다. 진동은 아이폰에서만 지원하고 아이패드나 아이팟 터치에서는 사용할 수 없습니다. 테스트하려면 **실제 아이폰 기기가 필요**합니다.

 

#### **기초**

아이폰에서 진동을 발생시키는 방법은 크게 3가지가 있습니다. 각 진동은 말로 설명하기는 어려우므로 실제로 체험해보세요(?)

1. **UINotificationFeedbackGenerator를 사용하는 방법**
    - 성공(`success`), 경고(`warning`), 에러(`error`)를 나타낼 때 사용합니다.
    - 진동이 여러 번 나타납니다.
    - 예) `UINotificationFeedbackGenerator().notificationOccurred(.success)`
2. **UIImpactFeedbackGenerator를 사용하는 방법**
    - 세기에 따라 다르게 단일 신호를 진동시킵니다.
    - 종류: `light`, `medium`, `heavy` + iOS 13 이상에서 `soft`, `rigid`
    - 버튼 등을 눌렀을 때 사용할 수 있습니다.
    - 예) `UIImpactFeedbackGenerator(style: .light).impactOccurred()`
3. **UISelectionFeedbackGenerator의 selectionChanged를 사용하는 방법**
    - 무언가 선택(selection)을 변경했을 때 사용합니다. Apple은 "_사용자가 선택하거나 확인할 때 이 피드백을 사용하지 마세요. 선택 항목이 변경될 때만 사용합니다_"고 안내하고 있습니다.
    - 약한 세기의 단일 진동이 발생합니다.
    - 예) `UISelectionFeedbackGenerator().selectionChanged()`
4. **AudioServicesPlaySystemSound를 사용하는 방법 - 옛날 진동 (old school)**
    - 말 그대로 옛날 핸드폰에서 사용하는 방식의 진동이 발생합니다. 위의 진동들과는 확실이 다른 종류임을 느낄 수 있습니다.
    - `import AVFoundation`이 필요합니다.
    - 예) `AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))`

 

#### **편리하게 사용하기**

아래 코드를 `Vibration.swift`라는 이름의 파일로 프로젝트에 추가합니다. ([출처](https://stackoverflow.com/questions/26455880/how-to-make-iphone-vibrate-using-swift))

```
import UIKit
import AVFoundation

enum Vibration: String, CaseIterable {
    
    static var allCases: [Vibration] {
        let defaultList = [
            error,
            success,
            warning,
            light,
            medium,
            heavy,
            selection,
            oldSchool,
        ]
        
        if #available(iOS 13.0, *) {
            return defaultList + [soft, rigid,]
        }
        
        return defaultList
    }
    
    case error
    case success
    case warning
    case light
    case medium
    case heavy
    case selection
    /// 옛 진동 방식
    case oldSchool
    
    @available(iOS 13.0, *)
    case soft
    
    @available(iOS 13.0, *)
    case rigid
    
    public func vibrate() {
        switch self {
        case .error:
            UINotificationFeedbackGenerator().notificationOccurred(.error)
        case .success:
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        case .warning:
            UINotificationFeedbackGenerator().notificationOccurred(.warning)
        case .light:
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        case .medium:
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        case .heavy:
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        case .soft:
            if #available(iOS 13.0, *) {
                UIImpactFeedbackGenerator(style: .soft).impactOccurred()
            }
        case .rigid:
            if #available(iOS 13.0, *) {
                UIImpactFeedbackGenerator(style: .rigid).impactOccurred()
            }
        case .selection:
            UISelectionFeedbackGenerator().selectionChanged()
        case .oldSchool:
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
        }
    }
}

```

- iOS 13 이상에서 사용하는 프로젝트라면 버전 관련 `available` 부분 및 `allCases` 변수를 제거합니다.

 

사용하고자 하는 곳(예를 들어 버튼을 눌렀을 때 등)에서 다음과 같이 사용합니다.

```
Vibration.warning.vibrate()
```

 

##### **예제: 피커 뷰(Picker View)를 이용해 다양한 종류의 진동 발생시키기**

iOS 프로젝트를 생성한 뒤, 메인 화면에 피커 뷰(`UIPickerView`) 및 버튼을(`UIButton`)을 추가하고 다음과 같이 `IBOutlet` 및 `IBAction`을 뷰 컨트롤러에 연결합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-01-pm-9.19.02.jpg)

> **참고)** 스위치(`UISwitch`)는 기본적으로 값이 변경될 떄마다 진동이 발생하므로 따로 진동을 추가할 필요가 없습니다. `Vibration.light`와 비슷한 세기의 진동이 발생합니다.

 

뷰 컨트롤러 코드를 작성합니다.

```
import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var pkvVibrationCategory: UIPickerView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 피커 뷰 delegate, dataSource
        pkvVibrationCategory.delegate = self
        pkvVibrationCategory.dataSource = self
    }

    @IBAction func btnActVibrate(_ sender: Any) {
        let index = pkvVibrationCategory.selectedRow(inComponent: 0)
        Vibration.allCases[index].vibrate()
    }
    
}

extension ViewController: UIPickerViewDelegate, UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        Vibration.allCases.count
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        Vibration.allCases[row].rawValue
    }
}

```

 

실제 기기에서 빌드 및 실행합니다. 종류를 선택하고 `Vibrate` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2022-12-01-pm-11.19.26.jpg)

 

#### **[다음 글: 아이폰 진동(Vibration, Haptic) 구현하기 下 (커스터마이징)](http://yoonbumtae.com/?p=5155)**
