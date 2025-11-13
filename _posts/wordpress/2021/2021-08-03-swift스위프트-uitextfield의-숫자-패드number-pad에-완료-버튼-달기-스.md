---
title: "Swift(스위프트): UITextField의 숫자 패드(Number Pad)에 완료 버튼 달기 (스토리보드)"
date: 2021-08-03
categories: 
  - "DevLog"
  - "Swift UIKit"
---

텍스트 필드 (UITextField)를 스토리보드에서 숫자 패드(Number Pad)만 나오게 설정할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-03-pm-4.53.49.jpg)

 

이 패드의 문제점은 아래 그림 완료(엔터) 버튼이 없다는 점입니다. 완료 버튼이 없으므로 추가 설정이 없다면 어떤 방법으로도 키보드를 사라지게 할 수 없습니다.

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-03-pm-4.56.31.jpg)

해결 방안으로

- 일정 자리수가 입력되면 숫자 패드를 사라지게 하기
- 숫자 패드 위에 \[완료\] 버튼 달기

 

이 글에서는 아래 내용을 다룹니다.

먼저 `UITextField`의 `extension`을 생성하고 다음 변수(computed property)를 추가합니다.

```
extension UITextField {
    @IBInspectable var wanryoAccesory: Bool{
        get {
            return self.wanryoAccesory
        }
        set(hasDone) {
            if hasDone {
                addDoneButtonOnKeyboard()
            }
        }
    }

    // ....... //
}
```

- `@IBInspectable` - 연산 프로퍼티에 이것을 추가하면 스토리보드의 `Attribute Inpsector`에 설정할 수 있는 UI가 생성됩니다. (아래 그림 참조) 변수 이름을 카멜 케이스로 입력해도 아래처럼 이름을 바꿔서 보여줍니다.
- `get` - `true` 또는 `false` (On, Off) 값을 받습니다.
- `wanryoAccesory`가 `true`라면 `addDoneButtonOnKeyboard` 함수를 실행합니다.

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-03-pm-5.06.01.jpg)

 

다음으로 `extension` 안에 `addDoneButtonOnKeyboard` 함수를 추가합니다.

```
// 넘버 패드에 리턴 기능 추가
// https://stackoverflow.com/questions/28338981
extension UITextField {
    // ....... //

    func addDoneButtonOnKeyboard() {
        let doneToolbar: UIToolbar = UIToolbar(frame: CGRect.init(x: 0, y: 0, width: UIScreen.main.bounds.width, height: 50))
        doneToolbar.barStyle = .default

        let flexSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
        let done: UIBarButtonItem = UIBarButtonItem(title: "완료", style: .done, target: self, action: #selector(self.doneButtonAction))

        let items = [flexSpace, done]
        doneToolbar.items = items
        doneToolbar.sizeToFit()

        self.inputAccessoryView = doneToolbar
    }

    @objc func doneButtonAction() {
        self.resignFirstResponder()
    }
}

```

- `doneToolbar` - 완료 버튼이 들어갈 툴바 부뿐을 생성합니다. 기본 스타일을 사용합니다.
- `flexSpace` - 플렉서블한 너비를 가지는 바 버튼 아이템을 생성합니다. 버튼 형태가 아닌 공백 형태로 나타납니다.
- `done` - 완료 버튼입니다. `action`은 버튼을 눌렀을 때 실행할 함수를 `#selector` 형태로 입력합니다. `doneButtonAction` 함수가 실행되도록 합니다.
- `items` - `flexSpace`, `done` 을 배열에 추가합니다. 이렇게 하면 아래 그림처럼 완료 버튼이 오른쪽 정렬된 형태로 표시됩니다.
- `doneTollbar.tems`에 `items`를 추가합니다.
- `doneToolbar.sizeToFite()` - 툴바를 기기 사이즈에 맞춰 표시합니다.
- `@objc func doneButtonAction()` - `selector` 함수이므로 `@objc` 어트리뷰트를 추가합니다. `self.resignFirstReponder`는 키보드 패드를 사라지게 하는 명령입니다.

 

다음에 Attribute Inspector에서 Wanryo Accesory를 `On`로 설정하거나, 또는 컨트롤러의 `viewDidLoad()`에 코드를 추가하여 완료 버튼이 나타나게 할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-03-pm-5.21.39.jpg)

```
textFieldOutlet.addDoneButtonOnKeyboard()
```

 

 ![](/assets/img/wp-content/uploads/2021/08/screenshot-2021-08-03-pm-6.24.55.png)
