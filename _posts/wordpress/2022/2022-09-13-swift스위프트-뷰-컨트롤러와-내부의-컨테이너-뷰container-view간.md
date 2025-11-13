---
title: "Swift(스위프트): 뷰 컨트롤러와 내부의 컨테이너 뷰(Container View)간의 데이터 교환"
date: 2022-09-13
categories: 
  - "DevLog"
  - "Swift"
---

## **뷰 컨트롤러와 내부의 컨테이너 뷰(Container View)간의 데이터 교환**

뷰 컨테이너(View Container)란 어느 부모 뷰 컨트롤러 안에 자식 뷰 컨트롤러(이하 VC)를 표시할 수 있는 특수한 View를 뜻합니다.

예를 들어 아래 스크린샷은, `RootViewController`라는 부모 VC 안에 자식 VC를 포함하는 형태입니다. 부모 VC는 `RootViewController`라는 클래스와 연결되어 있고 자식 VC는 컨테이너 뷰 안에 담겨 보여지며 `ContainerViewController`라는 다른 클래스와 연결되어 있습니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-13-pm-10.53.14.jpg)

 

위와 같은 형태의 뷰 컨트롤러 간 데이터를 교환하고 싶다면 어떻게 해야 할까요? 예를 들어 **RootVC**와 **ContainerVC**안에는 각각 텍스트 필드와 레이블이 존재하고 서로 값을 주고받고 표시하고 싶은 경우입니다.

두 가지 경우가 있는데, **RootVC**에서 **ContainerVC**로 보내는 경우는 비교적 간단하고, 그 반대의 경우는 대리자 패턴(Delegate pattern)을 사용해야 합니다.

 

### **Case 1: RootVC(부모)에서 ContainerVC(자식)으로 데이터 전송**

먼저 segue의 ID(`identifier`)를 지정해야 합니다.

스토리보드에서 빨간색 원과 같이 생긴 화살표를 클릭합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-13-pm-10.54.43.jpg)

 

선택하면 Xcode의 오른쪽 상단에 `Show the Attriutes Inspector`라는 버튼이 있습니다. 클릭해서 `Identifier`를 지정합니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-13-pm-10.55.32.jpg)

 

##### **RootViewController.swift 파일**

 

**RootVC**의 텍스트 필드를 `@IBOutlet`으로 연결합니다.

```
// 1-0: @IBOutlet 연결(루트 뷰 컨트롤러)
@IBOutlet weak var txfSendValueToContainer: UITextField!
```

 

다음 **ContainerVC**를 참조할 수 있는 멤버 변수를 생성해야 합니다. 이 변수가 있어야 `RootVC` 내의 아무 곳에서 나중에 보낼 타깃(`ContainerVC`)을 가리킬 수 있습니다.

```
// 1-1: 컨테이너 뷰 컨트롤러를 참조하는 변수 생성
private var containerVC: ContainerViewController?
```

 

`override func prepare`에서 `segue`에 관련된 사항을 설정합니다.

```
// 1-2: segue.identifer별 분기 설정
override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    switch segue.identifier {
    case "ContainerSegue":
        // 1-3: segue.destination(컨테이너 뷰 컨트롤러)을 containerVC에 지정
        containerVC = segue.destination as? ContainerViewController
    default:
        break
    }
}
```

- 이 함수는 뷰 컨트롤러의 라이프사이클의 초기에 실행되며, 이 때 `containerVC` 변수를 segue의 도착지, 즉 `ContainerVC`를 가리키도록 합니다.
- 이후 `containerVC` 변수를 이용해 해당 뷰 컨트롤러(`ContainerViewController`)의 인스턴스에 접근할 수 있습니다.
- 스토리보드에서 지정했던 Identifier `ContainerSegue`를 입력합니다.

 

##### **ContainerViewController.swift 파일**

부모 VC로부터 받은 값을 표시할 레이블을 `@IBOutlet`으로 연결합니다.

```
// 1-4: IBOutlet 연결(컨테이너 뷰 컨트롤러)
@IBOutlet weak var lblReceivedValueFromRoot: UILabel!
```

 

값을 받고 표시하는 메서드를 만듭니다.

```
// 1-5: Root로부터 값을 전달받는 함수 생성
func setLabel(_ value: String) {
    // 1-6: Root로부터 받은 값을 레이블에 설정
    lblReceivedValueFromRoot.text = value
}
```

앞서 `RootViewController.swift`의 `containerVC` 변수를 통해 위 메서드에 접근할 수 있습니다. 부모 VC로부터 값을 받으면 레이블의 text를 받은 값으로 갱신합니다.

 

다음 전송 버튼에 이벤트를 설정합니다. 위의 스크린샷에서는 전송 버튼이 누락되었는데, 아래와 같이 전송 버튼을 추가해줍니다.

 ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-13-pm-11.22.12.jpg)

##### **RootViewController.swift 파일**

전송 버튼을 `@IBAction`으로 연결해 이벤트를 설정합니다.

```
// 1-7: 전송 버튼 이벤트 설정
@IBAction func btnActSubmitToContainer(_ sender: Any) {
    containerVC?.setLabel(txfSendValueToContainer.text ?? "")
}
```

`prepare` 단계에서 도착지와 연결된 `containerVC` 변수를 사용해 자식 VC의 값을 변경하는 메서드를 실행하면, 자식 VC의 메서드가 실행되어 값이 변경됩니다.

 

빌드 및 실행하고 결과를 확인합니다.

<!-- http://www.giphy.com/gifs/hIVBwBGUyRP6v0DYLS -->
![](https://)

 

### **Case 2: ContainerVC(자식)에서 RootVC(부모)로 데이터 전송**

자식에서 부모로 값을 보내려면 대리자 패턴(Delegate Pattern)을 사용해야 합니다. 대리자 패턴이 무엇이고 왜 사용하는지에 대해 설명하려면 굉장히 길고 복잡하므로 이 글에서는 자세한 설명은 생략합니다.

사실 대리자 패턴은 iOS 프로그래밍 전반에서 굉장히 빈번하게 사용되고 있습니다. 예를 들면 테이블 뷰에서 필수적으로 사용되는 `tableView.delegate = self`같은 코드도 대리자 패턴의 일부입니다.

 

> **참고: 대리자 패턴**
> 
>  
> 
> **delegation, delegation pattern** **위임, 위임 패턴, 대리자, 대리자 패턴**
> 
> - 어떤 객체의 조작 일부를 다른 객체에게 넘김
> - 위탁자(delegator) → 수탁자(delegate)
> - 어떤 일의 책임을 다른 클래스 또는 메소드에게 넘김
> - 한 객체가 기능 일부를 다른 객체로 넘겨주어, 첫번째 객체 대신 수행하도록 하는 일
> - 위임을 활용하면 한 객체의 변경이 다른 객체에 미치는 영향이 작아진다.
> - 다른 클래스의 기능을 사용하되 그 기능을 변경하지 않으려면 상속 대신 위임
> 
> 출처: [https://zetawiki.com/wiki/위임\_패턴](https://zetawiki.com/wiki/%EC%9C%84%EC%9E%84_%ED%8C%A8%ED%84%B4)

 

##### **RootViewController.swift 파일**

자식 VC로부터 받은 값을 표시하는 레이블을 `@IBOutlet`으로 연결합니다.

```
// 2-0: @IBOutlet 연결(루트 뷰 컨트롤러)
@IBOutlet weak var lblReceivedValueFromContainer: UILabel!
```

 

##### **ContainerViewController.swift 파일**

대리자 프로토콜을 작성합니다.

```
// 2-1: 대리자 프로토콜 작성
protocol ContainerVCDelegate: AnyObject {
    func didReceivedValueFromContainer(_ controller: ContainerViewController, value: String)
}

```

- 이 프로토콜을 준수(conform)하는 클래스는 반드시 `didReceivedValueFromContainer`라는 메서드를 구현해야 합니다.
- `didReceivedValueFromContainer`는 자식 VC로부터 값을 전달받은 뒤 부모 컨테이너에서 그 값을 다루는 내용이 구현되어야 합니다. 해당 내용의 구체적인 구현은 여기서 하지 않고 위 프로토콜을 준수하는 클래스에서 합니다.
    - `RootViewController`가 위 프로토콜을 구현할 예정이며, 위 메서드에서 받은 값을 레이블에 표시하는 작업을 수행할 것입니다.
- `AnyObject`를 상속받은 이 프로토콜은 클래스 전용임을 나타내며, `weak var`를 사용할 수 있습니다.

 

> **참고: AnyObject 프로토콜**
> 
>  
> 
> _**AnyObject프로토콜**을 프로토콜의 상속목록에 추가하여 프로토콜 채택을 클래스 타입(구조체 또는 열거형이 아닌)을 제한할 수 있습니다._
> 
> _와 한번에 이해가 가네요. 더 간단하게 말하면 **AnyObject를 상속한 프로토콜은 클래스만 채택할 수 있다!!!**_
> 
> 출처: [https://zeddios.tistory.com/347](https://zeddios.tistory.com/347) \[ZeddiOS:티스토리\]

 

딜리게이트 변수를 설정합니다. 이 변수는 `ContainerVCDelegate`를 준수하는 클래스라면 어떤 클래스든 설정할 수 있습니다. (구체적인 클래스 타입을 물어보지 않음)

멤버 변수로 추가합니다. `ContainerVCDelegate`는 클래스 프로토콜이므로 엄밀히 말하면 구조체는 사용할 수 없습니다.

```
// 2-2: 딜리게이트 변수 설정
// ContainerVCDelegate를 준수한다면 어느 클래스나 구조체도 여기에 할당될 수 있음
weak var delegate: ContainerVCDelegate?
```

`delegate`는 나중에 **RootVC**에서 연결된 변수의 대리자(delegate)로 자기 자신(`self`)를 설정하고, 그 인스턴스에서 `delegate`는 **RootVC**를 참조하는 변수가 됩니다.

 

> 참고: [\[iOS / Swift\] 메모리 참조 방법 (strong, weak, unowned)](https://velog.io/@wook4506/iOS-Swift-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%B0%B8%EC%A1%B0-%EB%B0%A9%EB%B2%95-strong-weak-unowned)

 

텍스트필드를 `@IBOutlet`으로 연결합니다.

```
// 2-3: 텍스트필드 @IBOutlet 연결
@IBOutlet weak var txfSendValueToRoot: UITextField!
```

 

전송 버튼을 `@IBAction`으로 연결해 해야 할 작업을 작성합니다. **ContainerVC**에서 값을 **RootVC**로 보내고, 보낸 후 해야 할 작업을 작성합니다.

```
// 2-4: 컨테이너 뷰로 값 전송 기능 구현
@IBAction func btnActSubmitToRoot(_ sender: Any) {
    // 2-5: 딜리게이트를 통해
    delegate?.didReceivedValueFromContainer(self, value: txfSendValueToRoot.text ?? "")
}
```

- `delegate?.didReceivedValueFromContainer...`
    - `ContainerVC` 클래스 안에서는 값을 보낸 후 해야 할 작업을 작성하지 않고, 대리자 패턴을 이용해서 그 내용을 프로토콜을 따르는 클래스가 작성하도록 위임하고 있습니다.
    - 단지 `didReceivedValueFromContainer`를 실행하라는 명령을 할 뿐입니다.
    - 여기서 실행하라는 명령이 나왔으면, 대리자(delegate)인 RootVC 안에 있는 `didReceivedValueFromContainer` 함수가 실행됩니다.

 

이제 **RootVC**로 돌아가서 대리자로서 해야 할 작업을 구현할 차례입니다.

 

##### **RootViewController.swift 파일**

먼저 `containerVC`의 대리자로 자기 자신(`self`)을 지정합니다. `prepare` 함수 안에 하이라이트된 부분 위치에 추가합니다.

```
// 1-2: segue.identifer별 분기 설정
override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    switch segue.identifier {
    case "ContainerSegue":
        // 1-3: segue.destination(컨테이너 뷰 컨트롤러)을 containerVC에 지정
        containerVC = segue.destination as? ContainerViewController
        
        // 2-6: containerVC의 delegate 변수를 RootVC 자신(self)으로 지정
        containerVC?.delegate = self
        
    default:
        break
    }
}
```

- `containerVC`(-> segue의 도착지이자 컨테이너 VC의 인스턴스)의 `delegate`를 지정함으로써 이제 `delegate`는 **RootVC의 인스턴스**를 가리키게 되었습니다.

 

위의 코드를 작성하면

_Cannot assign value of type 'RootViewController' to type 'ContainerVCDelegate?'_ _Add missing conformance to 'ContainerVCDelegate' to class 'RootViewController'_

라는 메시지가 뜨면서 에러가 발생합니다. `ContainerVCDelegate`를 준수하지 않아서 발생한 것이며 해당 프로토콜을 추가하고 필수 메서드를 구현하면 에러가 해결됩니다.

 

아래 `extension`을 추가합니다.

```
// 2-7: ContainerVCDelegate를 준수(conform)하는 확장 구현
extension RootViewController: ContainerVCDelegate {
    func didReceivedValueFromContainer(_ controller: ContainerViewController, value: String) {
        lblReceivedValueFromContainer.text = value
    }
}
```

- 해당 `extension`에서 `ContainerVCDelegate`를 준수하도록 지정하였고,
- 필수 구현 메서드인 `didReceivedValueFromContainer`를 추가하였습니다.
- 받은 값을 `lblReceivedValueFromContainer`에 표시하라는 내용입니다.

 

앞의 대리자 패턴을 통해 **ContainerVC**는 `didReceivedValueFromContainer`이 어떤 일을 해야하는지에 대한 구현을 자신이 지정하지 않고 다른 대리자들이 하도록 위임하였습니다. 만약 다른 곳에서도 이 프로토콜을 준수한다고 하면, 그 곳에서는 위와 다른 일을 하도록(값을 네트워크로 전송하거나 파일로 저장 등등) 할 수 있습니다.

 

빌드 및 실행하고 결과를 확인합니다.

![](https://media.giphy.com/media/0rIvrN1p76mrK8Bpgc/giphy.gif)

 

이 글에서는 Container View에 있는 VC라는 특수한 상황 하에 작성되었지만, 여기 있는 내용은 일반적인 뷰 컨트롤러간의 통신에서도 적용될 수 있습니다. 아래 글을 참고하세요.

- [iOS 프로그래밍: Navigation에서 전후간 정보교환 방법](http://yoonbumtae.com/?p=2203)

 

#### **전체 코드**

https://gist.github.com/ayaysir/0b4e2ab7ec5f77103dbf279989fffa23
