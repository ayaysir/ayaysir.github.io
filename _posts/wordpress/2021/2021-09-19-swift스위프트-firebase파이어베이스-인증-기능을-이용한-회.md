---
title: "Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 회원 가입 기능 구현 1 (스토리보드)"
date: 2021-09-19
categories: 
  - "DevLog"
  - "Swift UIKit"
  - "Firebase"
---

#### **이전 글**

- [Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 기초 로그인 로그아웃 구현 (스토리보드)](http://yoonbumtae.com/?p=4090)

 

이전 글에서 로그인하는 방법을 다뤘으나, 파이어베이스 콘솔에서 임의로 만든 사용자를 대상으로 로그인 과정을 진행했습니다.

회원가입 메뉴를 만들어서 누구나 회원가입을 할 수 있고, 가입한 아이디를 통해 로그인이 가능하도록 할 필요가 있습니다.

이 예제에서는 이메일 주소를 아이디로 사용하며, 회원가입 정보로 이메일, 비밀번호, 관심분야, 프로필 사진을 받을 예정입니다. 이 중 프로필 사진은 2편에서 다루고 이 글에서는 나머지 정보를 입력받도록 하겠습니다.

 

### **회원가입 폼 작성**

##### **1\. 스토리보드에 뷰 컨트롤러 추가**

아래 그림과 같이 새로운 `UIViewController`(뷰 컨트롤러)를 추가하고 회원가입 폼을 작성합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-6.16.09.jpg)

 

##### **2\. 뷰 컨트롤러 클래스와 연동**

Identity Inspector에서 뷰 컨트롤러(`SignUpViewController`)를 커스텀 클래스로 지정한 뒤, 스토리보드의 오브젝트와 뷰 컨트롤러 코드 사이를 `@IBOutlet` 및 `@IBAction`을 사용하여 연결합니다.

오브젝트 배치 및 `@IBOutlet`, `@IBAction` 연결에 대한 내용은 너무 길어 생략합니다.

- [iOS 프로그래밍: 스토리보드에서 요소를 추가한 뒤 아웃렛 변수와 액션 함수로 연결하기](http://yoonbumtae.com/?p=2160)

```
@IBOutlet weak var txtUserEmail: UITextField!
@IBOutlet weak var txtPassword: UITextField!
@IBOutlet weak var txtPasswordConfirm: UITextField!
@IBOutlet weak var lblPasswordConfirmed: UILabel!
@IBOutlet weak var pkvInteresting: UIPickerView!
@IBOutlet weak var imgProfilePicture: UIImageView!
```

```
@IBAction func btnActCancel(_ sender: UIButton) {
}

@IBAction func btnActReset(_ sender: UIButton) {
}

@IBAction func btnActSubmit(_ sender: UIButton) {
}
```

 

##### **3\. Action Segue 버튼 추가**

메인 뷰 컨트롤러에 회원가입 뷰 컨트롤러로 이동하는 버튼을 추가합니다.

회원가입 버튼을 선택하고, 마우스 오른쪽 또는 control 키를 누른채로 회원가입 뷰 컨트롤러로 드래그하면 `Action Segue` 메뉴가 생깁니다. 여기서 `show`를 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-6.18.04.jpg)

이렇게 하면 회원가입 버튼을 누르면 회원가입 뷰 컨트롤러가 나타납니다.

 

##### **4\. 초기화**

'회원가입 뷰 컨트롤러 코드에 관심 분야'에 대한 Picker View를 위한 멤버 변수를 설정합니다.

```
let interestingList = ["치킨", "피자", "탕수육"]
var selectedInteresting: String!
```

- `selectedInteresting` - 피커 뷰에서 선택된 관심 분야가 `String` 타입으로 저장됩니다.

 

`viewDidLoad()` 에 딜리게이트, 데이터소스를 연결하는 코드 및 초기화 코드를 작성합니다.

```
override func viewDidLoad() {
    super.viewDidLoad()
    
    // 피커뷰 딜리게이트, 데이터소스 연결
    pkvInteresting.delegate = self
    pkvInteresting.dataSource = self
    
    // 텍스트 필드에 대한 딜리게이트, 데이터소스 연결 - 유효성 검사에서 필요함
    txtUserEmail.delegate = self
    txtPassword.delegate = self
    txtPasswordConfirm.delegate = self
    
    ...

    // 멤버 변수 초기화
    selectedInteresting = interestingList[0]

    // 패스워드 일치 여부를 표시하는 레이블을 빈 텍스트로
    lblPasswordConfirmed.text = ""
}
```

 

##### **5\. 취소, 리셋 버튼 이벤트 작성**

취소 버튼과 리셋 버튼에 대한 이벤트를 작성합니다. 취소 버튼을 누르면 회원 가입 창이 사라지고, 리셋 버튼을 누르면 모든 필드가 처음 상태로 돌아갑니다.

```
@IBAction func btnActCancel(_ sender: UIButton) {
    self.dismiss(animated: true, completion: nil)
}

@IBAction func btnActReset(_ sender: UIButton) {
    txtUserEmail.text = ""
    txtPassword.text = ""
    txtPasswordConfirm.text = ""
    lblPasswordConfirmed.text = ""
    pkvInteresting.selectedRow(inComponent: 0)
    // -- 사진 초기화 --
}
```

- `self.dismiss(animated: true, completion: nil)` - action segue로 팝업된 현재 뷰 컨트롤러를 사라지게 합니다.
- `pkvInteresting.selectedRow(inComponent: 0)` - 피커뷰에서 0번(첫번째) 요소를 선택하게 합니다.

 

 

##### **6\. 딜리게이트, 데이터소스에 대한 `extension` 작성**

관심분야 Picker View에 목록을 추가하는 `extension`을 작성합니다.

```
extension SignUpViewController: UIPickerViewDelegate, UIPickerViewDataSource {
    // 컴포넌트(열) 개수
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    // 리스트(행) 개수
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return interestingList.count
    }
    
    // 피커뷰 목록 표시
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return interestingList[row]
    }
    
    // 특정 피커뷰 선택시 selectedInteresting에 할당
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        selectedInteresting = interestingList[row]
    }
}
```

 

비밀번호 일치 여부를 검사하려면 `UITextFieldDelegate`가 필요합니다. 아래 `extension`을 추가합니다.

```
extension SignUpViewController: UITextFieldDelegate {
    
    func setLabelPasswordConfirm(_ password: String, _ passwordConfirm: String)  {
        
        guard passwordConfirm != "" else {
            lblPasswordConfirmed.text = ""
            return
        }
        
        if password == passwordConfirm {
            lblPasswordConfirmed.textColor = .green
            lblPasswordConfirmed.text = "패스워드가 일치합니다."
        } else {
            lblPasswordConfirmed.textColor = .red
            lblPasswordConfirmed.text = "패스워드가 일치하지 않습니다."
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        switch textField {
        case txtUserEmail:
            txtPassword.becomeFirstResponder()
        case txtPassword:
            txtPasswordConfirm.becomeFirstResponder()
        default:
            textField.resignFirstResponder()
        }
        
        return false
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == txtPasswordConfirm {
            guard let password = txtPassword.text,
                  let passwordConfirmBefore = txtPasswordConfirm.text else {
                return true
            }
            let passwordConfirm = string.isEmpty ? passwordConfirmBefore[0..<(passwordConfirmBefore.count - 1)] : passwordConfirmBefore + string
            setLabelPasswordConfirm(password, passwordConfirm)
            
        }
        return true
    }
}

```

- `textFieldShouldReturn(_:)` - 이 메소드는 `UITextFieldDelegate`에서 구현되며, 키보드의 리턴(엔터) 키를 눌렀을 때 취해야 할 동작을 지정합니다.
    - 이메일 필드에서 엔터를 누른 경우, `becomeFirstResponder()`를 사용해 다음 필드인 패스워드 필드에 포커스가 가도록 합니다.
    - `resignFirstResponder()`는 현재 텍스트 필드에 대한 키보드를 사라지게 합니다.
- `textField(...shouldChangeCharactersIn...)` - 이 메소드는 키보드에서 사용자가 키 하나를 눌렀을 때 취해야 할 동작을 지정합니다.
    - `if textField == txtPasswordConfirm {...}` - 현재 입력된 텍스트 필드가 `txtPasswordConfirm`일때만 동작합니다.
    - `passwordConfirmBefore` - 현재 입력된 글자가 추가되기 직전의 텍스트 필드의 값입니다. 예를 들어 텍스트 필드의 값을 `abcd`까지 입력된 상태에서 `e`를 입력하였어도 아직 텍스트필드는 `e`가 반영되지 않은 상태이므로 `abccd`가 이 변수의 값입니다.
    - `passwordConfirm`
        - 백스페이스를 눌렀다면(`string.isEmpty`) `passwordConfirmBefore`를 0번 글자부터 마지막 직전 글자까지 자릅니다. 스트링을 배열처럼 자르는 문법은 원래 존재하지 않으며, `String`에 대한 `extension`으로 구현해야 합니다([출처](https://stackoverflow.com/questions/39677330/how-does-string-substring-work-in-swift) 에서 Soufiane ROCHDI의 답변).
        - 그 외의 경우라면 `passwordConfirmBefore`에 현재 입력된 글자 `string`을 더합니다. `abcd` 에 `e`가 더해지므로 `abcde`가 됩니다.
    - `return true` - 글자가 입력되게 하려면 `true`를 지정합니다. 입력을 막을 이유가 없으므로 무조건 `true`를 반환합니다.
- `setLabelPasswordConfirm(_:_:)` - 비밀번호와 확인 필드의 일치여부를 레이블에 표시합니다.

 

회원가입에 필요한 기초적인 내용들을 구현하였습니다. 다음으로 회원가입에서 입력된 정보를 Firebase로 보내는 코드를 작성해야 합니다.

 

### **Firebase에 회원가입 정보 전송**

이 예제에서 이메일, 비밀번호, 관심분야, 프로필 사진을 Firebase에 보낼 예정입니다. 여기서 주의해야 할 부분은 Firebase의 인증(Authentification) 메뉴는 회원가입에 필요한 정보로 이메일과 비밀번호만을 받는다는 것입니다. 나머지 관심분야, 프로필 사진에 대한 내용은 개발자가 인증 메뉴가 아닌 별도의 데이터베이스 등에서 따로 다뤄야 합니다. 따라서 나머지 정보는 Firebase의 실시간 데이터베이스(Realtime Database)에 저장하도록 하겠습니다.

각각의 회원 정보에는 `uid`라고 불리는 고유 아이디가 있습니다. 이 아이디를 실시간 데이터베이스에서 참조 키처럼 사용하여 추가 정보를 저장하고 불러올 수 있습니다.

`simpleAlert` 함수는 경고 창을 띄우는 과정을 간소화한 커스터마이징 함수입니다. ([바로가기](https://github.com/ayaysir/iOS-DiffuserStick/blob/main/DiffuserStick/util/AlertUtil.swift))

먼저 Firebase 웹 콘솔에서 실시간 데이터베이스에 대한 규칙을 지정해야 합니다. `rules` 하위 노드로 아래 코드와 같이 입력합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-7.52.11.jpg)

 

 

##### **1\. 액션함수 작성**

회원가입 정보를 Firebase로 전송하는 `@IBAction` 함수를 작성합니다.

```
@IBAction func btnActSubmit(_ sender: UIButton) {
    guard let userEmail = txtUserEmail.text,
          let userPassword = txtPassword.text,
          let userPasswordConfirm = txtPasswordConfirm.text else {
        return
    }
    
    guard userPassword != ""
            && userPasswordConfirm != ""
            && userPassword == userPasswordConfirm else {
        simpleAlert(self, message: "패스워드가 일치하지 않습니다.")
        return
    }
    
    .......
}
```

 

##### **2\. Firebase 불러오기**

회원가입 뷰 컨트롤러에 `Firebase`를 `import` 합니다.

```
import Firebase
```

 

##### **3\. 실시간 데이터베이스의 레퍼런스 변수 추가**

회원가입 정보 중 관심 분야는 실시간 데이터베이스로 보낼 예정이므로 실시간 데이터베이스에 대한 레퍼런스가 필요합니다. 아래 멤버 변수를 추가합니다.

```
var ref: DatabaseReference!
```

 

##### **4\. createUser 메소드로 정보 전송**

이메일과 비밀번호는 인증 메뉴로 보내며, `Auth.auth().createUser(...)` 를 사용하여 전송하게 됩니다. 또한 추가 정보는 `ref.child...setValue([:])`를 통해 실시간 데이터베이스로 전송합니다.

아래 코드를 액션 함수 내부에 작성합니다.

```
Auth.auth().createUser(withEmail: userEmail, password: userPassword) { [self] authResult, error in
    // 이메일, 비밀번호 전송
    guard let user = authResult?.user, error == nil else {
        simpleAlert(self, message: error!.localizedDescription)
        return
    }
    
    // 추가 정보 입력
    ref.child("users").child(user.uid).setValue(["interesting": selectedInteresting])
    
    simpleAlert(self, message: "\(user.email!) 님의 회원가입이 완료되었습니다.", title: "완료") { action in
        self.dismiss(animated: true, completion: nil)
    }
}
```

- `guard let user = authResult?.user, error == nil` - 이 조건이 만족되면 서버로 전송이 완료된 것입니다. 전송이 완료되면 새로운 사용자가 추가되며, 자동으로 현재 기기에 로그인하게 됩니다.
- `ref.child("xxx")` - 해당 이름을 가진 자식 노드로 이동합니다.
- `.setValue(["interesting": selectedInteresting])` - 현재 노드(사용자의 `uid`)에 키-값 쌍을 하나 추가합니다. 관심 분야에 대한 정보를 저장하면 실시간 데이터베이스에 아래와 같이 저장됩니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-7.59.14.jpg)

 

 

<iframe width="286" height="480" src="https://giphy.com/embed/X2Afs7dDfigs1cR424" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-7.07.15.jpg)

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-7.06.44.jpg)

 

#### **전체 코드**

```
import UIKit
import Firebase

class SignUpViewController: UIViewController {

    @IBOutlet weak var txtUserEmail: UITextField!
    @IBOutlet weak var txtPassword: UITextField!
    @IBOutlet weak var txtPasswordConfirm: UITextField!
    @IBOutlet weak var lblPasswordConfirmed: UILabel!
    @IBOutlet weak var pkvInteresting: UIPickerView!
    @IBOutlet weak var imgProfilePicture: UIImageView!
    
    var ref: DatabaseReference!
    
    let interestingList = ["치킨", "피자", "탕수육"]
    var selectedInteresting: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 피커뷰 딜리게이트, 데이터소스 연결
        pkvInteresting.delegate = self
        pkvInteresting.dataSource = self
        
        txtUserEmail.delegate = self
        txtPassword.delegate = self
        txtPasswordConfirm.delegate = self
        
        // firebase reference 초기화
        ref = Database.database().reference()
        
        selectedInteresting = interestingList[0]
        lblPasswordConfirmed.text = ""

    }
    
    @IBAction func btnActCancel(_ sender: UIButton) {
        self.dismiss(animated: true, completion: nil)
    }
    
    @IBAction func btnActReset(_ sender: UIButton) {
        txtUserEmail.text = ""
        txtPassword.text = ""
        txtPasswordConfirm.text = ""
        lblPasswordConfirmed.text = ""
        pkvInteresting.selectedRow(inComponent: 0)
        // -- 사진 초기화 --
    }
    
    @IBAction func btnActSubmit(_ sender: UIButton) {
        guard let userEmail = txtUserEmail.text,
              let userPassword = txtPassword.text,
              let userPasswordConfirm = txtPasswordConfirm.text else {
            return
        }
        
        guard userPassword != ""
                && userPasswordConfirm != ""
                && userPassword == userPasswordConfirm else {
            simpleAlert(self, message: "패스워드가 일치하지 않습니다.")
            return
        }
        
        Auth.auth().createUser(withEmail: userEmail, password: userPassword) { [self] authResult, error in
            // 이메일, 비밀번호 전송
            guard let user = authResult?.user, error == nil else {
                simpleAlert(self, message: error!.localizedDescription)
                return
            }
            
            // 추가 정보 입력
            ref.child("users").child(user.uid).setValue(["interesting": selectedInteresting])
            
            simpleAlert(self, message: "\(user.email!) 님의 회원가입이 완료되었습니다.", title: "완료") { action in
                self.dismiss(animated: true, completion: nil)
            }
        }
    }
    
}

extension SignUpViewController: UIPickerViewDelegate, UIPickerViewDataSource {
    // 컴포넌트(열) 개수
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    // 리스트(행) 개수
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return interestingList.count
    }
    
    // 피커뷰 목록 표시
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return interestingList[row]
    }
    
    // 특정 피커뷰 선택시 selectedInteresting에 할당
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        selectedInteresting = interestingList[row]
    }
}

extension SignUpViewController: UITextFieldDelegate {
    
    func setLabelPasswordConfirm(_ password: String, _ passwordConfirm: String)  {
        
        guard passwordConfirm != "" else {
            lblPasswordConfirmed.text = ""
            return
        }
        
        if password == passwordConfirm {
            lblPasswordConfirmed.textColor = .green
            lblPasswordConfirmed.text = "패스워드가 일치합니다."
        } else {
            lblPasswordConfirmed.textColor = .red
            lblPasswordConfirmed.text = "패스워드가 일치하지 않습니다."
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        switch textField {
        case txtUserEmail:
            txtPassword.becomeFirstResponder()
        case txtPassword:
            txtPasswordConfirm.becomeFirstResponder()
        default:
            textField.resignFirstResponder()
        }
        
        return false
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == txtPasswordConfirm {
            guard let password = txtPassword.text,
                  let passwordConfirmBefore = txtPasswordConfirm.text else {
                return true
            }
            let passwordConfirm = string.isEmpty ? passwordConfirmBefore[0..<(passwordConfirmBefore.count - 1)] : passwordConfirmBefore + string
            setLabelPasswordConfirm(password, passwordConfirm)
            
        }
        return true
    }
}

```

 

2편에서는 프로필 사진을 첨부해 업로드하는 과정을 다룰 예정입니다.
