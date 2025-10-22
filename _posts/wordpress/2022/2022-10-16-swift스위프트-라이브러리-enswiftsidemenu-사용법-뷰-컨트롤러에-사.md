---
title: "Swift(스위프트) 라이브러리 ENSwiftSideMenu 사용법 (뷰 컨트롤러에 사이드 메뉴 추가)"
date: 2022-10-16
categories: 
  - "DevLog"
  - "Swift UIKit"
---

### **ENSwiftSideMenu**

ENSwiftSideMenu는 Interface Builder(스토리보드)에서 아래 그림과 같이 사이드 메뉴를 추가할 수 있도록 도와주는 라이브러리입니다.

![](https://github.com/evnaz/ENSwiftSideMenu/raw/master/demo.gif)

 

#### **깃허브 주소**

- [https://github.com/evnaz/ENSwiftSideMenu](https://github.com/evnaz/ENSwiftSideMenu)

 

#### **라이브러리 추가**

아래 링크를 클릭해서 파일 두 개를 내 프로젝트에 추가합니다.

- [ENSwiftSideMenu 코드 깃허브](https://github.com/ayaysir/iOS-Tuner/tree/main/ENSwiftSideMenu)

 

CocoaPods로도 추가할 수는 있지만 `pod 'ENSwiftSideMenu'`

- 추가할 파일이 두 개밖에 없는데다
- 마지막 업데이트가 3년 전이고
- 앞으로도 업데이트될 가능성은 없어 보이기 때문에

간단하게 파일의 코드를 복사 붙여넣기해서 추가하는게 더 빠르다고 생각합니다.

파일을 추가했으면 아래 절차에 따라 사이드 메뉴를 구현합니다.

 

#### **방법**

**1) Navigation Controller를 추가하고, 원래 뷰 컨트롤러를 Root View Controller로 연결합니다**

![](./assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-17-오전-2.21.05.jpg)

![](./assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-17-오전-2.23.42.jpg)

해당 내비게이션 컨트롤러가 반드시 Initial View Controller가 되게 합니다. (Attribute Inspector에서 `Is Initial View Controller` 체크박스 선택)

 

**2) 사이드 메뉴가 될 뷰 컨트롤러를 생성하고, Storyboard ID를 부여합니다.**

![](./assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-17-오전-2.27.29.jpg)

테이블 뷰로 메뉴를 만들며, 각 메뉴를 클릭하면 해당 페이지로 이동합니다. Custom Class에도 뷰 컨트롤러 클래스를 연결합니다.

사이드 메뉴는 뷰 컨트롤러이기만 하면 자유롭게 작성할 수 있습니다.

- **버튼을 사용한 메뉴** - 버튼을 클릭해 메뉴 이동
- **테이블 뷰를 사용한 메뉴** - 테이블 뷰 셀을 클릭해 메뉴 이동
- **컬렉션 뷰를 사용한 메뉴**  - 컬렉션 뷰 셀을 클릭해 메뉴 이동

등등 앱에 알맞은 형태를 사용하면 됩니다. 자세한 구현 방법은 분량상 생략합니다.

 

**3) ENSideMenuNavigationController를 상속하는 내비게이션 컨트롤러를 생성합니다.**

이 코드는 1번 섹션에서 만들었던 Navigation Controller와 연결할 코드입니다.

```
import UIKit

class MenuNavigationController: ENSideMenuNavigationController {
    
    override func viewDidLoad() {
        // 스토리보드 ID를 바탕으로 뷰 컨트롤러 인스턴스 생성
        let menuViewController = self.storyboard?.instantiateViewController(identifier: "ArticleListViewController")
        
        // 사이드 메뉴 생성
        self.sideMenu = ENSideMenu(sourceView: view, menuViewController: menuViewController!, menuPosition:.right)
        
        // 딜리게이트 설정
        self.sideMenu?.delegate = self
        
        // 사이드 메뉴 설정 (가로 폭, 바운스 활성화, 애니메이션 타입)
        self.sideMenu?.menuWidth = 300
        self.sideMenu?.bouncingEnabled = false
        self.sideMenuAnimationType = .none
        
        // 내비게이션 바 위에 사이드 메뉴를 표시
        self.view.bringSubviewToFront(navigationBar)
    }
}

extension MenuNavigationController: ENSideMenuDelegate {
    func sideMenuWillOpen() {
        // 사이드메뉴가 열릴 때
        print("sideMenuWillOpen")
    }
    
    func sideMenuWillClose() {
        // 사이드메뉴가 닫힐 때
        print("sideMenuWillClose")
    }
    
    func sideMenuDidClose() {
        // 사이드메뉴가 닫히고 나서
        print("sideMenuDidClose")
    }
    
    func sideMenuDidOpen() {
        // 사이드메뉴가 열리고 나서
        print("sideMenuDidOpen")
    }
    
    func sideMenuShouldOpenSideMenu() -> Bool {
        // 사이드메뉴 활성화
        return true
    }
}

```

- `viewDidLoad(_:)`에서 사이드 메뉴를 생성하고 설정합니다.
- 딜리게이트를 추가합니다. 사이드메뉴가 열리거나 닫힐 때 해야 할 작업을 추가할 수 있습니다.

 

**4) Navigation Controller의 커스텀 클래스로 3번 섹션에서 만든 `MenuNavigationController`를 추가합니다.**

![](./assets/img/wp-content/uploads/2022/10/스크린샷-2022-10-17-오전-2.37.06.jpg)

 

기본적으로 왼쪽 또는 오른쪽 가장자리를 드래그하면 사이드 메뉴가 나오며, 버튼 이벤트 등을 통해 수동으로 사이드바를 호출하려면 다음 코드를 이벤트 함수에 추가합니다.

```
toggleSideMenuView()
```

위 메서드는 `UIViewController`의 `extension`에 있으므로 뷰 컨트롤러 내부 아무데서나 사용할 수 있습니다.

 

빌드 및 실행 후 화면 오른쪽을 드래그해서 사이드 메뉴가 나오는지 확인합니다.

http://www.giphy.com/gifs/VG5dyfTl3VLmqaTvmu

아직 셀(버튼)을 눌렀을 떄 동작은 구현되지 않았습니다.

 

**5) 사이드 메뉴 부분에서 버튼 (또는 셀 등)을 클릭했을 때 해야 할 동작을 설정합니다.**

두 가지 방법이 있습니다. 여기서 컨텐츠 뷰 컨트롤러란 밑에 있는 사이드 메뉴를 호출한 뷰 컨트롤러를 의미합니다. (위 움짤에서 사이드 메뉴를 제외한 컨텐츠가 있는 부분)

1. 컨텐츠 뷰 컨트롤러 부분에서 원래 뷰 컨트롤러를 버리고 다른 뷰 컨트롤러를 표시하도록 설정
2. 컨텐츠 뷰 컨트롤러 부분에서 표시되는 뷰 컨트롤러는 그대로 놔둔 상태에서 해당 뷰 컨트롤러가 실행할 동작을 지정

 

1번은 다음과 같이 구현합니다.

- `sideMenuController()?.setContentViewController(targetVC!)`

`sideMenuController()`는 사이드 메뉴 컨트롤러를 호출하는 함수로 `UIViewController`의 `extension` 내에 구현되어 있으므로 뷰 컨트롤러의 아무데서나 호출할 수 있습니다. 여기서 `setContentViewController(목표VC)`를 사용하여 컨텐츠 뷰 컨트롤러 자체를 교체합니다.

 

예제 코드는 다음과 같습니다. (버튼을 사용한 사이드 메뉴)

```
import UIKit

class MenuState {
    static let shared = MenuState()
    var currentMenu = "TunerViewController"
}

class SlideMenuViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
    }
    
    @IBAction func btnFreqTable(_ sender: UIButton) {
        openController(menu: "FreqTableViewController")
    }
    
    @IBAction func btnTuner(_ sender: UIButton) {
        openController(menu: "TunerViewController")
    }
    
    @IBAction func btnStats(_ sender: UIButton) {
        openController(menu: "StatsViewController")
    }
    
    @IBAction func btnSetting(_ sender: UIButton) {
        openController(menu: "SettingViewController")
    }
    
    @IBAction func btnHelp(_ sender: UIButton) {
        openController(menu: "HelpViewController")
    }
    
    func openController(menu: String) {
        if MenuState.shared.currentMenu == menu {
            sideMenuController()?.sideMenu?.toggleMenu()
            return
        }
        
        MenuState.shared.currentMenu = menu
        let targetVC = self.storyboard?.instantiateViewController(identifier: menu)
        self.sideMenuController()?.setContentViewController(targetVC!)
    }
    
}

```

http://www.giphy.com/gifs/IVFWF5hGNSplBUH8Py

_주파수 테이블 버튼을 클릭하면 뷰 컨트롤러가 새로운 것으로 교체됩니다. (`TunerViewController`에서 `FreqTableViewController`로 교체됨)_

 

2번은 다음과 같이 구현합니다. 예제 코드에서 `2~3 라인`만 확인하면 됩니다. (테이블 뷰를 사용한 메뉴)

```
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    let naviVC = sideMenuController() as? UINavigationController
    if let vc = naviVC?.viewControllers[0] as? ViewController,
       let urlString = list[indexPath.row].urlString.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
       let url = URL(string: urlString) {
        
        print(urlString)
        
        let request = URLRequest(url: url)
        vc.webView.load(request)
        self.toggleSideMenuView()
    }
}
```

- `sideMenuController()`를 호출한 다음 `UINavigationController`로 타입캐스팅한 뒤 변수 `naviVC`에 할당합니다..
- `naviVC`의 `viewControllers`에서 제일 첫번째(`0`번 인덱스)가 컨텐츠 뷰 컨트롤러입니다. 이것을 변수 `vc`에 할당합니다.
- 이후 작업은 `vc` 변수를 가지고 수행하면 됩니다. (위 예제는 특정 URL을 webView(웹킷 뷰)를 통해 로드하는 작업입니다.)

 

이렇게 하면 컨텐츠 뷰 컨트롤러는 교체되지 않고 특정 작업만 수행할 수 있습니다.

http://www.giphy.com/gifs/fZjHIdYsCXPHD2knLn

_셀을 클릭하면 `vc.webView.load(request)`를 수행해서 웹 페이지만 교체하며 뷰 컨트롤러는 바뀌지 않습니다._
