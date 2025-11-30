---
title: "Swift(스위프트): 스테퍼(UIStepper)의 값을 레이블(UILabel)에 표시하기 (일반 방법 및 RxSwift 사용 방법)"
date: 2022-11-01
categories: 
  - "DevLog"
  - "Swift"
---

InterfaceBuilder의 스토리보드에서 `UIStepper`는 아래 그림과 같이 마이너스(`-`) 버튼과 플러스(`+`) 버튼이 있으며 버튼을 누를때마다 값이 증감하는 컴포넌트입니다. 스테퍼의 값은 `Double` 타입의 형태로 UIStepper 인스턴스에 자체적으로 저장됩니다만 화면에는 표시되지 않기 때문에 알 방법이 없습니다. 이를 레이블(`UILabel`)에 표시하는 예제입니다.

<!-- http://www.giphy.com/gifs/hmAgG6wyg2ZCWAM29t -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGxtOTU4ejE4ZzJqc2t3eHB1a3N1d2w0eXc5NTJ3bTg2MXRqZ3oxcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hmAgG6wyg2ZCWAM29t/giphy.gif)

 

> **참고: UIStepper 최소값, 최대값, 증감값(step value) 설정하기**
> 
> 1) 스토리보드에서 UIStepper 컴포넌트를 선택한 후 우측 `Attribute Inspector`에서 설정
> 
>  ![](/assets/img/wp-content/uploads/2022/11/screenshot-2022-11-02-am-1.10.00.jpg)
> 
> 2) 프로그래밍 방식으로 설정
> 
> ```swift
> // IBOutlet 연결
> @IBOutlet weak var stepperCount: UIStepper!
> 
> // 현재값 설정
> stepperCount.value = 0
> 
> // 증감값(stepValue) 설정
> stepperCount.stepValue = 5.0
> 
> // 최소값 및 최대값 설정
> stepperCount.minimumValue = 0.0
> stepperCount.maximumValue = 10000.0
> ```

 

 

먼저 일반적인 방법으로 구현하고, 다음엔 RxSwift(RxCocoa)를 사용하여 구현하도록 하겠습니다.

## **방법**

### **방법 1 - 일반**

#### **1)** 스토리보드에 레이블과 스테퍼를 배치한 후 각각 `@IBOutlet`으로 뷰 컨트롤러 코드와 연결합니다. 이 변수들은 각 컴포넌트를 참고하게 됩니다.

 ![](/assets/img/wp-content/uploads/2022/11/screenshot-2022-11-02-am-1.00.52.jpg)

 

#### **2)** 스토리보드에 스테퍼를 `@IBAction`으로 뷰 컨트롤러 코드와 연결합니다. `stepperActCount` 메서드는 버튼이 눌렸을 때 실행됩니다.

 ![](/assets/img/wp-content/uploads/2022/11/screenshot-2022-11-02-am-1.04.38.jpg)

 

#### **3)** 초기값을 레이블에 표시하도록 설정합니다. `viewDidLoad(_:)`에 아래 코드를 추가합니다.

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    lblCount.text = "\(stepperCount.value)"   
}
```

 

#### **4)** 값이 증감될때마다(=>스테퍼 버튼을 누를때마다) 레이블에 표시되는 값이 업데이트되도록 합니다. @IBAction 함수인 `stepperActCount` 내에 다음과 같이 작성합니다.

```swift
@IBAction  func stepperActCount(_ sender: UIStepper) {
    lblCount.text = "\(sender.value)"
}
```

 

빌드 및 실행하여 결과를 확인합니다.

 

### **방법 2 - RxSwift(RxCocoa) 사용하여 구현하기**

**참고**

- [RxSwift(ReactiveX + Swift): 기본 개념 및 스토리보드 예제 (요약)](/posts/rxswiftreactivex-swift-기본-개념-및-스토리보드-예제-요약/)

 

#### **0)** CocoaPods 프로젝트로 초기화하고, RxSwift를 설치합니다.

- [Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법](/posts/xcode-프로젝트에-코코아팟cocoapods-설치-및-디펜던시-추가-방/)

```ruby
# RxSwift
pod 'RxSwift'
pod 'RxCocoa'
```

 

뷰 컨트롤러에 `RxSwift`를 `import` 합니다.

- `import RxSwift`

 

#### **1)** 스토리보드에 레이블과 스테퍼를 배치한 후 각각 `@IBOutlet`으로 뷰 컨트롤러 코드와 연결합니다. 이 변수들은 각 컴포넌트를 참고하게 됩니다.

 ![](/assets/img/wp-content/uploads/2022/11/screenshot-2022-11-02-am-1.00.52.jpg)

 

#### **2)** @IBAction은 추가하지 않으며, 대신 `viewDidLoad(_:)`에 아래 코드를 추가합니다.

```swift
_ = stepperCount.rx.value.subscribe(onNext: { [unowned self] value in
    lblCount.text = "\(value)"
})
```

- UI 컴포넌트 뒤에 `rx`를 붙이면 RxSwift의 기능을 사용할 수 있습니다.
- `value.subscribe`
    - `value`(스테퍼의 현재 값)이 변경될 때마다 구독(subscribe)하여 정보를 업데이트합니다.
    - `onNext`: 값이 업데이트 되었을 때 실행할 동작을 지정합니다.
- `[unowned self]`
    - 해당 클로저 안에 있는 변수에 자동으로 `self` 가 붙은 것으로 간주되며, `self` 사용 시 순환 참조의 문제를 방지하기 위해 `unowned` 키워드가 사용되었습니다.
    - 참고 - [\[Swift\] weak와 unowned의 차이](https://tdcian.tistory.com/290)
- `lblCount.text = "\(value)"`
    - `value` 값을 레이블에 업데이트합니다.

 

또는

```swift
_ = stepperCount.rx.value.map { String($0) }.bind(to: lblCount.rx.text)
```

로도 작성할 수 있습니다.

 

빌드 및 실행하여 결과를 확인합니다.
