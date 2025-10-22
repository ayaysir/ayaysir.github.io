---
title: "Swift(스위프트): 버튼에서 메뉴 표시 기초 (UIButton 또는 UIBarButtonItem에서 UIMenu를 표시하는 방법) - 스토리보드"
date: 2022-08-16
categories: 
  - "DevLog"
  - "Swift"
---

[출처 바로가기](https://nemecek.be/blog/85/how-to-show-uimenu-from-uibutton-or-uibarbuttonitem)

 

![](./assets/img/wp-content/uploads/2022/08/tjRqjl.jpeg)

iOS 14에서는 UIBarButtons 및 UIButtons에서 메뉴를 표시할 수 있습니다. (14버전 이후부터 가능)

 

#### **UIMenu의 예제**

`viewDidLoad(_:)`에 다음 코드를 작성합니다.

```
var menuItems: [UIAction] {
    return [
        UIAction(title: "Standard item", image: UIImage(systemName: "sun.max"), handler: { (_) in   
        }),
        UIAction(title: "Disabled item", image: UIImage(systemName: "moon"), attributes: .disabled, handler: { (_) in 
        }),
        UIAction(title: "Delete..", image: UIImage(systemName: "trash"), attributes: .destructive, handler: { (_) in  
        })
    ]
}

var demoMenu: UIMenu {
    return UIMenu(title: "My menu", image: nil, identifier: nil, options: [], children: menuItems)
}
```

 

#### **UIBarButtonItem에 UIMenu 추가**

현재 뷰 컨트롤러에 내비게이션 아이템이 있는 경우, 아래 코드를 추가합니다.

```
navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Menu", image: nil, primaryAction: nil, menu: demoMenu)

```

`primaryAction`을 지정하지 않았으므로 탭한 직후 메뉴가 나타납니다.

![](https://media.giphy.com/media/ZP0XparzzeWCMtKUAA/giphy.gif)

 

사용자가 만든 Bar Button Item에 메뉴를 추가하는 방법은 다음과 같습니다.

```
@IBOutlet weak var barBtnSetAlarm: UIBarButtonItem!

override func viewDidLoad() {
    super.viewDidLoad()
    // ... //

    barBtnSetAlarm.menu = demoMenu
```

 

#### **UIButton + UIMenu**

`UIMenu`를 탭한 즉시 표시하려면 `showsMenuAsPrimaryAction`을 `true`로 설정해야 합니다. 그렇지 않으면 길게 눌러야 메뉴가 나타납니다.

 

```
@IBOutlet var showMenuButton: UIButton!

func configureButtonMenu() {
    showMenuButton.menu = demoMenu
    showMenuButton.showsMenuAsPrimaryAction = true
}
```

![](https://media.giphy.com/media/kekY3B1bfdPrPwJOeZ/giphy.gif)

 

`UIMenu`는 전통적인 `UIAlertController`의 Action Sheet를 대체할 수 있는 아주 좋은 솔루션입니다. 어떤 뷰 컨트롤러에서 표시할 지 여부를 고민하지 않아도 되고, 아이패드 등의 대화면 기기에서 표시 위치를 자동으로 잡아줘서 더 이상 표시 위치에 대해 신경쓰지 않아도 됩니다.
