---
title: "Swift(스위프트): 텍스트 필드(UITextField)에 숫자만 입력되게 하기, 자리수 제한하기 (스토리보드)"
date: 2021-08-03
categories: 
  - "DevLog"
  - "Swift UIKit"
---

텍스트 필드에서 숫자만 입력되게 하고, 특정 자리수 이상이 되면 키보드를 사라지게 하는 예제입니다.

 

1) 마우스 오른쪽 버튼을 누른채로, 또는 control 버튼을 누른채로 드래그하여 @IBOutlet 변수를 생성합니다.

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-03-pm-6.52.54.jpg)

```
@IBOutlet weak var textFieldOutlet: UITextField!
```

 

2) 뷰 컨트롤러의 `viewDidLoad()` 안에 컨트롤러와 딜리게이트를 연결합니다.

```
textA4FreqOutlet.delegate = self
```

또는 위의 과정 대신 스토리보드에서 텍스트 필드를 마우스 오른쪽 또는 control 버튼 누른채로 드래그하여 연결할 수도 있습니다.

 

3) `UITextFieldDelegate`를 상속받는 뷰 컨트롤러의 `extension`을 생성하고 다음 코드를 작성합니다.

```swift
extension ViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        // 백스페이스
        if string.isEmpty {
            return true
        }
        
        let charSetExceptNumber = CharacterSet.decimalDigits.inverted
        let strComponents = string.components(separatedBy: charSetExceptNumber)
        let numberFiltered = strComponents.joined(separator: "")
        
        let maxLength = 3
        let currentString  = textField.text! as NSString
        let newString = currentString.replacingCharacters(in: range, with: string)

        if newString.count == maxLength && string.isNumber {
            textField.text = newString
            textField.resignFirstResponder()
            return false
        }

        return string == numberFiltered
    }
}
```

##### **숫자만 입력되게 하기**

- `shouldChangeCharactersIn` - 이것을 파라미터로 받는 `textField`를 오버라이딩합니다. 이것은 `Bool` 값을 리턴하며 키보드 버튼을 눌렀을 때 또는 붙여넣기 등의 기능을 이용해 스트링을 입력했을 때 그 키보드의 문자가 텍스트 필드에 입력되어야 하는 여부를 묻는 함수입니다. `true`라면 키보드에 누른대로 입력되고, `false`라면 해당 입력은 무시됩니다.
- `charSetExceptNumber` - 캐릭터 세트입니다. `.invrerted`를 사용하여 숫자 `0123456789`를 제외한 나머지 문자 모두를 세트로 묶었습니다.
- `strComponents` - `String.components`는 `split` 함수와 비슷한 역할을 하며 캐릭터 셋에 있는 문자를 기준으로 쪼개 `[String]` 배열에 저장합니다. 여기서는 `charSetExceptNumber` 캐릭터 셋을 기준으로 쪼개므로 캐릭터셋에 있는 문자들은 사라지게 되고 숫자만 남습니다.
- `numberFiltered` - 배열 형태로 저장된 숫자들을 `join`을 이용해 합치는 과정입니다.
- `return string == numberFiltered` 
    - 입력값(`string`)이 `numberFilter`와 일치하면 `true` 를 반환하므로 입력이 됩니다. 그 반대의 경우 입력되지 않습니다.

 

 

##### **일정 자리수까지만 입력되게 하고 자리수가 초과하면 키보드를 사라지게 하기**

- `maxLength` - 최대 자리수입니다.
- `currentString` - 텍스트 필드에 입력된 내용을 가져옵니다. 이 내용은 해당 `string`이 입력되기 전의 값이므로 새로 입력된 `string`을 더해야 합니다. 밑에 사용할 `replacingCharacter`가 `NSString` 타입에 있는 기능이기 때문에 타입캐스팅을 합니다.
- `newString` - `replacingCharacters`는 `NSRange`를 파라미터로 하여 특정 위치에서 해당 스트링으로 치환하는 기능을 합니다. `range`는 현재 텍스트 필드의 커서 위치정보를 담고 있는 `NSRange` 타입의 변수이며, `string`은 텍스트 필드에 입력된 값입니다.
    - 이 과정을 거치면 텍스트가 입력되었을 때의 텍스트가 저장되게 됩니다.
- `newString.count == maxLength` 이고, `string.isNumber`이면 (`isNumber`는 숫자인지 판별하는 함수, 아래의 코드 참고)
    - 숫자가 특정 자릿수를 초과하면 키보드를 사라지게 하는 과정입니다.
    - `textField.text`에 `newString`을 대입하여 키보드가 사라지기 전에 텍스트 필드의 내용이 새롭게 채워지도록 합니다.
    - `textField.resignFirstResponder()`로 키보드를 사라지게 합니다.
    - 키보드가 사라지면 `return` 결과에 관계없이 입력값이 무시되므로 위의 과정이 필요합니다.

 

```swift
extension String  {
    var isNumber: Bool {
        return !isEmpty && rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) == nil
    }
}
```

<!-- http://www.giphy.com/gifs/FoVAHgRYHDsKeTshNQ -->
![](https://)
