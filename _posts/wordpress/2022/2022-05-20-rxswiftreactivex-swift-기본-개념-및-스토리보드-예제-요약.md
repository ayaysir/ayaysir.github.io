---
title: "RxSwift(ReactiveX + Swift): 기본 개념 및 스토리보드 예제 (요약)"
date: 2022-05-20
categories: 
  - "DevLog"
  - "Swift"
---

## **RxSwift(ReactiveX + Swift): 기본 개념 및 스토리보드 예제**

 

### **기본 용어**

#### **명령형 프로그래밍 (Imperative Programming)**

- 컴퓨터가 실행할 명령을 순차적으로 작성하는 프로그래밍 방식입니다.
- 선언적 프로그래밍(Declarative Programming)과 대조적인 방식입니다.

 

##### **예제 코드**

```
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
var numbersLessThanFive: [Int] = []
for index in 0..<numbers.count {
    if numbers[index] > 5 {
        numbersLessThanFive.append(numbers[index])
    }
}

// 결과: [1, 2, 3, 4]
```

 

#### **함수형 프로그래밍 (Functional Programming)**

- 자료 처리를 수학적 함수의 계산으로 취급하고 상태 변화(changing state)와 가변 데이터(mutable data)를 멀리하는 프로그래밍 방식입니다.
- 프로그래밍이 문(statement)이 아닌 식이나 선언으로 수행되는 선언형 프로그래밍 패러다임을 따르고 있습니다

 

##### **예제 코드**

```
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let numberLessThanFive = numbers.filter { $0 < 5 }

// 결과: [1, 2, 3, 4]
```

 

#### **반응형 프로그래밍 (Reactive Programming)**

- 데이터 스트림 및 변경 전파와 관련된 선언적 프로그래밍 패러다임입니다.
- 정적(예: 배열) 또는 동적(예: event emitter) 데이터 스트림을 쉽게 표현할 수 있습니다.
- 연결된 실행 모델 내에 추론된 종속성이 존재한다는 것을 전달할 수 있어 변경된 데이터 흐름의 자동 전파가 용이합니다.
- 데이터 스트림 (또는 이벤트 스트림)에는 키보드 입력, 버튼 누르기, 제스처, GPS 로케이션 등이 포함될 수 있습니다.

 

##### **예제 코드**

```
let twoDimensionalArray = [
    [1,2],
    [3,4],
    [5,6],
]
let flatArray = twoDimensionalArray.flatMap { array in
    return array.map { $0 * 2 }
}

// 결과: [2, 4, 6, 8, 10, 12]
```

 

#### **이벤트 스트림 (Event Stream)**

- 시간이 지나면서 발생하는 이벤트들의 흐름입니다.
- 비동기적 배열(asynchronous array)로 생각할 수 있습니다.
- 이벤트 스트림을 시각적으로 왼쪽에서 오른쪽으로 시간의 흐름에 따라 발생한 이벤트들을 동그라미로 나타낸 그림을 Marble diagram 이라고 합니다.
- 이벤트 스트림은 속성(property)을 가지지 않으며(=이벤트의 발생 시간 및 타입이 명시되지 않음),이벤트의 발생 시기는 불규칙하게 발생될 수 있습니다.

```
let eventStream = ["1", "2", "abc", "3", "4", "cdg", "6", 기타등등...]

let result = eventStream.map {
    // Step 1: 맵 내부에서 배열 요소를 분석하여 Int로 변환 가능한 요소들을 Int의 호환 타입으로 변환합니다.
}.filter {
    // Step 2: 1단계에서 걸러내지 못한 Int가 아닌 요소들을 걸러내고 순수 Int 배열로 만듭니다.
    // Step 3: 2단계 배열의 모든 요소들을 더한 값을 반환합니다.
}.reduce(0, +)
```

 

\[caption id="attachment\_4480" align="alignnone" width="808"\] ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-20-pm-7.29.16.jpg) 이벤트 스트림의 흐름을 그림으로 나타낸것을 마블 다이어그램(Marble Diagram)이라고 합니다. 동그라미 모양이 이벤트 발생, X 표시는 에러의 발생, 세로 막대기는 이벤트 스트림의 완료를 의미합니다.\[/caption\]

#### **상태 (State)**

- 예를 들면, 네트워크에서 데이터를 가져오거나, 소리를 재생하거나, 사용자 입력을 기다리거나 하는 등 언제든지 발생할 수 있는 애플리케이션의 동작 및 상황을 상태(state)라고 합니다.
- 어떠한 상태가 어느 시간에 발생하더라도 애플리케이션 내부에서 관리할 수 있어야 합니다.

 

#### **순수 함수 (Pure Function)**

- 동일한 입력이라면 항상 동일한 출력 반환을 보장해야 합니다.
- 부수 효과를 일으키지 않아야 합니다.
- 함수형 프로그래밍 방식에서 매우 중요한 개념입니다.

 

#### **부수 효과 (Side Effect)**

- 함수가 실행되었는데 그 실행으로 인해 함수 외부에 있는 값 등이 변경되었다면 이것을 '부수 효과가 발생했다'고 합니다.
- 예를 들면 함수의 실행이 디스크에 저장되어 있는 파일의 내용을 변경하거나, 함수의 실행이 앱의 레이블을 변경하는 현상 등이 있습니다.
- 부수 효과는 필연적이며 반드시 나쁘다고 볼 수 없지만, 함수형 프로그래밍의 관점에서는 테스트의 용이성과 코드의 견고함 등을 위해 부수효과의 발생을 멀리해야 한다고 보고 있습니다.

 

#### **불변성 (Immutability)**

- 멑티스레드 환경에서는, 변수형 데이터 타입(variable datatype)보다 상수형 데이터타입(constant datatype)이 우수하다고 알려져 있습니다.
    - 변수형 데이터 타입인 경우, 멀티스레드 환경에서 각각 스레드가 실행될 때마다 내부 내용이 계속 변하고 이러한 결과가 최종적으로 잘못되거나 오염된 정보의 반환으로 이어질 수 있습니다.
    - 이를 방지하기 위해 스레드마다 상수형 데이터타입으로 복사(copy)하고 복사한 데이터를 바탕으로 작업을 수행해 원래 데이터의 변조를 막는 것이 좋습니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-20-pm-8.11.47.jpg)

 

 

### **ReactiveX의 주요 개념 및 패턴**

 

#### **옵저버 패턴 (Observer Pattern)**

- 객체의 상태 변화를 관찰하는 관찰자(Observer)들의 목록을 객체에 등록하여 상태 변화가 있을 때마다 메서드 등을 통해 객체가 직접 목록의 각 옵저버에게 통지하도록 하는 디자인 패턴입니다.
- 발행/구독 모델로도 알려져 있습니다.
- Notification Center 등이 대표적인 옵저버 패턴의 구현체입니다.
- ReactiveX를 통한 구현은 이러한 옵저버들이 모여 변경 사항이 발생할 때마다 알려주는 패턴으로 진행됩니다.
- ReactiveX는 옵저버 자체 또는 옵저버블 시퀀스(Observalble Sequence)인 `Subject`라는 특별한 타입이 존재합니다.

 

#### **반복자 패턴 (Iterator Pattern)**

- 컬렉션의 구현 방법을 노출시키지 않으면서도 그 안에 들어있는 모든 항목에 접근할 수 있는 방법을 제공하는 패턴을 의미합니다.
- 예를 들면 박철수라는 사람이 만든 `Computer`라는 컬렉션과 백종삼이라는 사람이 만든 `Food`라는 컬렉션이 있는데 두 컬렉션 모두 반복자 패턴을 구현하였다면, 내가 컴퓨터와 음식 모두에 무지한 사람이라도(=내부의 구현 방법이 어떤지 몰라도), 역시 둘 다 잘 모르지만 반복자 패턴에는 능통한 대리인(반복자)을 통해 내부 구성요소에 접근할 수 있게 됩니다.
- ReactiveX에서는 모든 시퀀스(Sequence)의 요소들을 반복자 패턴을 통해 순회합니다.
- ReactiveX에서는 존재하는 모든 것들이 시퀀스로 이루어져 있다고 보고 있습니다.

 

#### **옵저버블 (Observable)**

- 옵저버블 시퀀스(Observable Sequence)의 핵심 개념이며 말 그대로 '관측 가능한' 모든 요소입니다. 이벤트를 발생시킵니다.
- 방출(emit)이라는 작업을 수행하는데, 이 작업은 값 또는 값 모음이 시퀀스에 추가되면 해당 값을 포함하는 다음 이벤트를 보내거나 관찰자(Observer)를 수집합니다.
- 방출되는 내용 중에는 작업 완료 이벤트(complete event) 또는 에러 이벤트(error event)가 포함됩니다.
- 관측을 중단하려면 구독을 취소(cancel the subscription -> `dispose()`라 칭함)하면 됩니다.

 

#### **Subject**

`Subject`라는 이름의 옵저버 자체 또는 옵저버블 시퀀스(Observalble Sequence)인 Subject라는 특별한 타입이 존재합니다.

`Subject`에는 4개의 종류가 있습니다.

- `PublishSubject`
    - 오직 새로운 다음 이벤트(next events)만을 방출합니다.
    - 특정 시점에 새로 가입한 구독자는 구독 이전에 발생했던 이벤트들에 대해 전혀 알 수 없습니다.
    - 이전에 발생했던 이벤트가 재발생하는 것을 `replay`라고 하며, PublishSubject는 이 replay를 절대 허용하지 않습니다.
- `BehaviorSubject`
    - `replay`를 허용하는 이벤트입니다.
    - 새로 구독하면 최근에 발행된 이벤트 또는 초기 이벤트가 구독자에게 전달됩니다. 그 이후에 발생하는 이벤트들도 당연히 관측 가능합니다.
    - 어느 `Subject` 타입이 종료된다면, 이것은 다시 종료 이벤트를 재방출할 가능성이 있습니다.
- `ReplaySubject`
    - 생성 이후에는 변경할 수 없는 사이즈의 버퍼를 만들어, 구독 시점과 관계없이 버퍼 사이즈만큼의 이벤트를 방출합니다.
    - 버퍼에는 사이즈만큼의 최신 이벤트가 들어갈 수 있으며. 사이즈가 초과된 경우 오래된 이벤트부터 제거됩니다.
    - 새로운 구독자들이 생기면 그 시점에서 이전 구독자들도 버퍼를 다시 받을 수 있습니다.
- `BehaviorRelay`
    - BehaviorSubject의 래퍼(wrapper)입니다.
    - 기본적으로 BehaviorSubject을 따르는데, 특이한 점이라면 BehaviorRelay는 완료 이벤트나 에러 이벤트가 발생하지 않습니다.
    - Deallocated되면 라이프사이클이 자동으로 완료됩니다.

 

#### **Railway-oriented Programming** 

요약하자면, 기찻길을 이어붙이듯이 함수들을 연결해 "happy path"를 구현하자는 패러다임이며, 이러한 기찻길을 구성할 수 있는 함수는 당연히 부수효과가 없고 입력값과 출력값이 항상 동일한 순수 함수여야 한다는 것입니다.

또한 순수 함수는 `Error`를 타입으로 보고 예외 처리 대상(throwable)으로 보지 않기 때문에 Railway-oriented Programming  에러를 표면에 노출시켜 정상값과 에러값에 따른 분기를 제공하는 투트랙 전략을 사용합니다.

예를 들면 아래 다이어그램과 같이 사용자의 정보를 업데이트하는 케이스가 있다고 가정합니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-20-pm-9.24.55.jpg)

 

사용자의 정보 업데이트에는 데이터의 유효성 검증 등 (예를 들면 패스워드가 `nil`이면 안된다거나 유저 이름에 공백이 들어가면 안된다던가)의 작업이 이고 이를 API를 통해 서버에 보내고 받는 과정에서 다양한 부수 작용들이 발생할 수 있습니다.

그리고 이러한 복잡한 작업이 아무 에러 없이 성공하면 매우 좋겠지만 현실은 수많은 에러들이 각 과정들 사이에 발생할 수 있다는 점입니다.

 ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-20-pm-9.27.47.jpg)

 

이러한 에러를 예외 처리의 방식으로 프로그램 내에 구현한다면 코드는 매우 지저분해질 것입니다. 예를 들어 API 호출에 실패한 경우, 응답  분석에 실패한 경우 다음 단계로 이어지지 않고 즉시 에러를 반환시키며 이러한 에러에 전부 대응하면 코드도 지저분해질 뿐더러 관리도 힘들어집니다.

 ![](/assets/img/wp-content/uploads/2022/05/무제-2.001.jpeg)

 

Railway-oriented Programming은 이러한 문제점에 대한 대안으로 제시된 것으로, 함수를 순수함수로 구현한 뒤 하나의 입력에 하나의 결과만 반환하거나(이상적 케이스), 에러를 예외처리 대상이 아닌 단순 타입으로 취급해 성공적 결과와 실패 결과 두 개만을 내보내는 투 트랙 전략을 사용하자는 것입니다.

 ![](/assets/img/wp-content/uploads/2022/05/무제-2.002.jpeg)

 

이렇게 하면 일일히 예외 처리를 하지 않아도 성공 결과와 실패 결과를 한꺼번에 처리할 수 있고, 출력 결과는 반드시 두 개만 존재하기 떄문에 이러한 출력 결과들을 또 다른 순수함수로 연결하면, 기찻길이 연결된 것처럼 거대한 규모의 케이스도 깔끔하게 조작할 수 있다는 것이 Railway-oriented Programming이 추구하는 이점입니다.

 ![](/assets/img/wp-content/uploads/2022/05/Recipe_Railway_Parallel.png)

 ![](/assets/img/wp-content/uploads/2022/05/1_p0FFfWMHtFK9sUvFT0Mz8g.png)

 

### **예제: Swift+스토리보드의 로그인 화면**

RxSwift의 기본 개념을 이용한 사용자 이름 필드와 패스워드 필드의 글자 수가 모두 4자인 이상인 경우에만 로그인 버튼이 활성화되는 예제입니다. 텍스트 필드에 값이 입력될때마다 실시간으로 구독자에게 해당 조건이 만족하는지 전송되며 구독자는 필드에 값이 입력되는 대로 정보를 받아 조건이 만족하는대로 로그인 버튼의 활성화할 수 있습니다.



\[caption id="attachment\_4484" align="alignnone" width="856"\] ![](/assets/img/wp-content/uploads/2022/05/screenshot-2022-05-20-pm-11.12.41.jpg) `@IBOutlet` 연결\[/caption\]

##### **LoginViewModel.swift**

```
import Foundation
import RxSwift
import RxRelay

struct LoginViewModel {
    var username = BehaviorRelay<String>(value: "")
    var password = BehaviorRelay<String>(value: "")
    
    // 사용자 이름과 비밀번호가 유효한지 체크하는 computed property
    var isValid: Observable<Bool> {
        // combineLatest: BehaviorRelay에서 이벤트가 발생할 때마다
        // 각 시퀀스의 가장 최근의 값들을 결합해서 다룰 수 있게 한다.
        return Observable.combineLatest(username.asObservable(), password.asObservable()) { usernameStr, passwordStr in
            usernameStr.count >= 4 && passwordStr.count >= 4
        }
    }
}

```

- `username`, `password` - `String`을 generic으로 가지는 BehaviorRelay 타입으로 지정합니다.
- `isValid` - 사용자 이름과 비밀번호가 유효한지 체크하는 computed property입니다.
- `Observable.combineLatest` - BehaviorRelay에서 이벤트가 발생할 때마다 각 시퀀스의 가장 최근의 값들을 결합해서 다룰 수 있게 합니다. 파라미터로 `username`, `password`의 `asObservable()`을 사용했습니다.
    - `asObservable` - 해당 `BehaviorRelay`를 `Observable` 타입으로 접근 및 사용하도록 지정합니다.

\[caption id="attachment\_4477" align="alignnone" width="580"\] ![](/assets/img/wp-content/uploads/2022/05/99361F4A5B47841627.png) 참고: `combineLatest`\[/caption\]

 

##### **ViewController.swift**

```swift
import UIKit
import RxSwift
import RxCocoa

class ViewController: UIViewController {
    
    @IBOutlet weak var txfUsername: UITextField!
    @IBOutlet weak var txfPassword: UITextField!
    @IBOutlet weak var btnLogin: UIButton!
    @IBOutlet weak var lblStatus: UILabel!
    
    var loginViewModel = LoginViewModel()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        configureLoginButton(isEnabled: false)
        
        // UITextField의 값을 뷰모델의 property에 바인딩
        _ = txfUsername.rx.text.map { $0 ?? "" }.bind(to: loginViewModel.username)
        _ = txfPassword.rx.text.map { $0 ?? "" }.bind(to: loginViewModel.password)
        
        // 뷰모델의 isBind를 btnLogin에 바인딩
        _ = loginViewModel.isValid.bind(to: btnLogin.rx.isEnabled)
        
        // 뷰모델의 isValid를 subscribe(구독)한다.
        // 텍스트필드에 값이 입력되면 onNext가 실행되고
        // 뷰모델의 Observable.combineLatest가 유효성 검사를 한 뒤
        // Observable<Bool> 타입의 값을 반환한다.
        // 그 값이 클로저 함수 안의 isValid와 연동된다.
        _ = loginViewModel.isValid.subscribe(onNext: { [unowned self] isValid in
            
            // 상태 레이블 서식 변경
            configureStatuslabel(isEnabled: isValid)
            // 텍스트 필드에 값을 입력할 때마다 isValid가 실시간으로 변경된다.
            print("isValid:", isValid)
            // 버튼 서식 변경
            configureLoginButton(isEnabled: isValid)
        })
    }
    
    func configureLoginButton(isEnabled: Bool) {
        btnLogin.isEnabled = isEnabled
        btnLogin.backgroundColor = isEnabled ? .orange : .lightGray
    }
    
    func configureStatuslabel(isEnabled: Bool) {
        lblStatus.text = isEnabled ? "Enabled" : "Disabled"
        lblStatus.textColor = isEnabled ? UIColor(red: 55/255, green: 168/255, blue: 82/255, alpha: 1) : .red
    }
}
```

- `UITextField`의 값을 뷰모델의 BehaviorRelay property인 `username`, `password` 에 바인딩합니다.
- 뷰모델의 `isValid`를 subscribe(구독)합니다.
    - 텍스트필드에 값이 입력되면 `onNext`가 실행되고
    - 뷰모델의 `Observable.combineLatest`가 유효성 검사를 한 뒤
    - `Observable<Bool>` 타입의 값을 반환합니다. 이 값은 클로저 함수 안의 `isValid`와 연동됩니다.
    - 텍스트필드에 값이 입력될때마다 구독 정보가 갱신되고, 이를 바탕으로 상태 레이블과 버튼의 서식 변경이 입력시마다 이루어집니다.

 

<!-- http://www.giphy.com/gifs/83zY8HsjQnCRdeYNPD -->
![](https://)
