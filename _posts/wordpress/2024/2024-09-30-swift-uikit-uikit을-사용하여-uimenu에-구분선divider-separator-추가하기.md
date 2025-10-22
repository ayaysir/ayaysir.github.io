---
title: "Swift UIKit: UIKit을 사용하여 UIMenu에 구분선(divider, separator) 추가하기"
date: 2024-09-30
categories: 
  - "DevLog"
  - "Swift UIKit"
---

- **출처**: [Create Dividers in UIMenu using UIKit](https://www.swiftjectivec.com/add-a-divider-in-context-menu-using-uikit/)

### **시나리오**

`UIKit`을 사용하여 `UIMenu` 내에 구분선을 추가하는 방법

 

\[caption id="attachment\_6860" align="alignnone" width="314"\]![](./assets/img/wp-content/uploads/2024/09/스크린샷-2024-09-30-오후-11.26.22-복사본.jpg) 구분선이 있는 컨텍스트 메뉴\[/caption\]

 

버튼을 누르면 컨텍스트 메뉴가 뜨며, 메뉴가 표시될 때 구분선이 존재합니다:

```
import UIKit

class ContextDividerViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 1
        let topActions = [
            UIAction(title: "Two", image: UIImage(systemName: "2.square"), handler: { (_) in
            }),
            UIAction(title: "One", image: UIImage(systemName: "1.square"), handler: { (_) in
            })
        ]
        // 2
        let divider = UIMenu(title: "", options: .displayInline, children: topActions)

        let bottomAction = UIAction(title: "Three", image: UIImage(systemName: "3.square"), handler: { (_) in
        })
        // 3
        let items = [bottomAction, divider]
        // 4
        let menu = UIMenu(title: "Divider", children: items)
        
        // 버튼을 눌렀을 때 menu가 뜨도록 함
        let button = UIButton(configuration: .borderedProminent())
        button.setTitle("Open", for: .normal)
        button.showsMenuAsPrimaryAction = true
        button.menu = menu
        
        // 버튼을 화면 한가운데 추가
        view.addSubview(button)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        button.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
    }
}
```

**세부 사항**

1. 구분선을 사용하려면 최소한 구분선 위와 아래에 하나 이상의 항목이 필요합니다. 그렇지 않으면 나눌 것이 없겠죠.
2. 구분선은 여기에서 만들어집니다. .`displayInline` 옵션을 사용하는 **UIMenu**가 필요하며, 자식 요소를 전달하면 됩니다.
3. 구분선 역할을 하는 **UIMenu**는 다른 메뉴의 하위 메뉴로 전달됩니다.
4. 마지막으로 이 메뉴는 버튼에 할당되어 화면에 표시됩니다.

 

![](https://www.swiftjectivec.com/assets/images/snips/snipDivider.gif)

 

\[rcblock id="6686"\]
