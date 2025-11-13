---
title: "Swift(스위프트): 텍스트 뷰에서 선택 부분(text selection)에 사용자 정의 메뉴 추가 (스토리보드)"
date: 2022-11-16
categories: 
  - "DevLog"
  - "Swift UIKit"
---

#### **소개**

텍스트 뷰 등에서 텍스트를 선택하면 아래와 같은 메뉴가 나옵니다.

 ![](/assets/img/wp-content/uploads/2022/11/screenshot-2022-11-17-오전-1.23.15.jpg)

 

여기에 기존에 없는 메뉴를 추가하고 싶다면 어떻게 해야 할까요? 아래 스크린샷에서 `단어장에 추가` 메뉴는 iOS에 없는 메뉴로 제가 새로 추가한 것입니다.

 ![](/assets/img/wp-content/uploads/2022/11/screenshot-2022-11-17-오전-1.22.49.jpg)

 

#### **방법**

##### **Step 1**

`addCustomMenu()`  함수를 추가하고, 뷰 컨트롤러의 `viewDidLoad(_:)`에 `addCustomMenu()`를 실행하도록 추가합니다.

```
override func viewDidLoad() {
    super.viewDidLoad()

    addCustomMenu()
}

private func addCustomMenu() {
    let addToDictionary = UIMenuItem(title: "단어장에 추가", action: #selector(addToDictionary))
    UIMenuController.shared.menuItems = [addToDictionary]
}
```

- `addToDictionary`
    - `UIMenuItem`을 사용해 새로운 메뉴를 만듭니다.
    - `title`에는 제목, `action`에는 메뉴를 클릭했을 때 실행할 `selector` 함수를 지정합니다.
- `UIMenuController.shared.menuItems`
    - 텍스트를 선택했을 떄 나타나는 메뉴에서 사용자가 만든 새로운 메뉴를 추가합니다.
    - 배열로 `UIMenuItem`을 추가합니다.

 

##### **Step 2**

셀렉터 함수(`@objc`)를 작성합니다.

```
@objc func addToDictionary() {
    if let range = txvNotepad.selectedTextRange,
       let selectedText = txvNotepad.text(in: range) {
        print(selectedText)

        // selectedText: 선택 영역의 텍스트
        // 해야할 작업 작성
    }
}
```

- `range`
    - 텍스트가 선택된 범위 정보가 담겨있습니다.
- `selectedText`
    - `range` 범위에서 선택된 텍스트입니다. 맨 위의 스크린샷에서 `Detect`가 선택되었으므로 `selectedText`는 `"Detect"` 입니다.
    - 이 변수를 바탕으로 해야 할 작업을 작성합니다.

 

#### **출처**

- [How do I add a custom action to the text selection edit menu in iOS?](https://stackoverflow.com/questions/37870889/how-do-i-add-a-custom-action-to-the-text-selection-edit-menu-in-ios)

 

#### **참고**

위의 예제는 순서를 지정할 수 없습니다. (사용자가 추가한 메뉴는 iOS 기본 메뉴 이후에 추가됨)

메뉴를 완전히 새로 만들어서 원하는 메뉴를 맨 앞에 나오게 할 수 있습니다.

- [How to add custom menuItem in specified position of UIMenuController?](https://stackoverflow.com/questions/50244887/how-to-add-custom-menuitem-in-specified-position-of-uimenucontroller)
