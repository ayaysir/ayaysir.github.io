---
title: "Swift UIKit: .translatesAutoresizingMaskIntoConstraints 란 무엇인가?"
date: 2025-05-08
categories: 
  - "DevLog"
  - "Swift UIKit"
---

## **translatesAutoresizingMaskIntoConstraints**

UIKit에서 아직도 무슨 의미인지 잘 모르겠는 (View).translatesAutoresizingMaskIntoConstraints에 대해 알아보겠습니다.

 

### **한국어 직역**

`translatesAutoresizingMaskIntoConstraints`를 한국어로 직역하면 다음과 같습니다:

> **"Autoresizing 마스크를 제약 조건으로 변환한다"**

구체적으로 단어별로 나누어보면:

- `translates`: 변환한다, 번역한다
- `AutoresizingMask`: 자동 크기 조절 마스크 (UIKit의 레이아웃 시스템에서 뷰의 크기와 위치를 자동 조절하는 속성)
- `into Constraints`: 제약 조건으로

따라서 전체 의미는:

> **"AutoresizingMask(자동 크기 조절 설정)을 Auto Layout의 제약 조건으로 자동 변환할 것인가?"**

라는 의미가 됩니다.

이 속성이 `true`이면 시스템이 뷰의 `frame` 정보를 바탕으로 **자동 제약 조건을 생성**해주고, `false`이면 **직접 Auto Layout 제약을 설정해야 함**을 뜻합니다.

 

* * *

### **오토리사이징 마스크(Autoresizing Mask)란?**

UIKit에서의 **오토리사이징 마스크(Autoresizing Mask)**는, **부모 뷰의 크기가 바뀔 때 자식 뷰의 크기나 위치를 어떻게 자동으로 조절할지를 설정하는 값**입니다. 이는 **Auto Layout이 도입되기 전부터 사용되던 레이아웃 방식**입니다.

 

#### **🔧 역할 요약**

오토리사이징 마스크는 `UIView`의 `autoresizingMask` 속성에 설정되며, 부모 뷰의 크기가 변할 때 **자식 뷰가 어느 방향으로 늘어나거나 이동할지를 결정**합니다.

 

#### **📐 예를 들어 보면:**

```swift
let subView = UIView(frame: CGRect(x: 20, y: 20, width: 100, height: 50))
subView.autoresizingMask = [.flexibleWidth, .flexibleRightMargin]
```

- `flexibleWidth`: 부모 뷰가 넓어지면 자식 뷰의 **너비도 같이 늘어남**
- `flexibleRightMargin`: 부모 뷰의 오른쪽 여백은 유동적으로 유지됨 (오른쪽에 붙어 있지 않음)

 

#### **🎯 사용 가능한 마스크 값들**

| 마스크 이름 | 의미 |
| --- | --- |
| `.flexibleLeftMargin` | 왼쪽 여백을 유동적으로 유지 |
| `.flexibleRightMargin` | 오른쪽 여백을 유동적으로 유지 |
| `.flexibleTopMargin` | 위쪽 여백을 유동적으로 유지 |
| `.flexibleBottomMargin` | 아래쪽 여백을 유동적으로 유지 |
| `.flexibleWidth` | 너비가 부모 뷰에 맞게 조정됨 |
| `.flexibleHeight` | 높이가 부모 뷰에 맞게 조정됨 |

 

#### **🧠 왜 이것이 `translatesAutoresizingMaskIntoConstraints`와 관련될까?**

UIKit은 **오토리사이징 마스크를 내부적으로 Auto Layout 제약으로 변환**할 수 있는데, 그 여부를 `translatesAutoresizingMaskIntoConstraints` 속성으로 결정합니다.

- `true`: 오토리사이징 마스크 → 제약으로 자동 변환
- `false`: 오토리사이징 마스크는 무시되고, **직접 Auto Layout 제약을 설정해야 함**

 

* * *

### **그래서 translatesAutoresizingMaskIntoConstraints가 뭔데?**

`translatesAutoresizingMaskIntoConstraints`는 Auto Layout을 사용할 때 매우 중요한 속성입니다. 이 속성이 어떤 역할을 하는지 이해하면 **뷰의 위치와 크기를 어떻게 제어할지**에 대한 개념이 명확해집니다.

 

#### **✅ 개념 정리**

##### `translatesAutoresizingMaskIntoConstraints = true` (기본값)

- **오토리사이징 마스크**(Autoresizing Mask)가 **Auto Layout 제약 조건으로 자동 변환됩니다**.
- 즉, 프레임(`frame`) 기반 레이아웃을 사용하겠다는 의미입니다.
- 개발자가 직접 지정한 `.frame` 값이나 autoresizing 설정이 내부적으로 Auto Layout 제약으로 변환되어 적용됩니다.
- 결과적으로 **직접 Auto Layout 제약을 추가하면 충돌할 수 있습니다**.

##### `translatesAutoresizingMaskIntoConstraints = false`

- 오토리사이징 마스크 → 제약 변환을 **하지 않도록 끕니다**.
- 대신 **개발자가 명시적으로 NSLayoutConstraint를 설정해야만** 해당 뷰의 위치와 크기가 결정됩니다.
- 주로 Auto Layout 기반 레이아웃을 할 때 사용하는 설정입니다.

 

* * *

### **✅ 예시 코드 비교**

```swift
let button = UIButton()
button.frame = CGRect(x: 0, y: 0, width: 100, height: 44)
// translatesAutoresizingMaskIntoConstraints는 기본값 true
// frame만으로도 위치/크기 설정됨
```

반면 아래처럼 Auto Layout 제약을 사용하는 경우:

```swift
let button = UIButton()
button.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(button)
NSLayoutConstraint.activate([
  button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
  button.topAnchor.constraint(equalTo: view.topAnchor, constant: 20),
  button.widthAnchor.constraint(equalToConstant: 100),
  button.heightAnchor.constraint(equalToConstant: 44)
])
```

- 이 경우는 **frame을 무시하고 Auto Layout만으로 뷰를 배치**합니다.
- `translatesAutoresizingMaskIntoConstraints = false`가 없으면 위 제약이 적용되지 않거나 충돌이 발생할 수 있습니다.

 

* * *

### **⚠️ 충돌 예제:**

Auto Layout 제약과 `translatesAutoresizingMaskIntoConstraints`의 충돌을 보여주는 간단한 예제를 Swift로 설명드리겠습니다.

### `translatesAutoresizingMaskIntoConstraints = true` 상태에서 Auto Layout 사용

```swift
let button = UIButton(type: .system)
button.setTitle("버튼", for: .normal)
button.backgroundColor = .systemBlue

// frame 기반 배치
button.frame = CGRect(x: 50, y: 50, width: 120, height: 44)

// Auto Layout 제약도 추가함 (충돌 발생 가능)
view.addSubview(button)
NSLayoutConstraint.activate([
  button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
  button.topAnchor.constraint(equalTo: view.topAnchor, constant: 100),
  button.widthAnchor.constraint(equalToConstant: 120),
  button.heightAnchor.constraint(equalToConstant: 44)
])
```

### 🔴 문제점

- `translatesAutoresizingMaskIntoConstraints`의 기본값은 `true`입니다.
- 이 상태에서 Auto Layout 제약을 추가하면 **시스템이 frame 기반 제약과 Auto Layout 제약 둘 다 적용하려고 해서 충돌**합니다.
- 콘솔에 아래와 같은 **경고 메시지**가 출력될 수 있습니다:

```
[LayoutConstraints] Unable to simultaneously satisfy constraints.
```

또는 버튼 위치가 이상하거나 전혀 보이지 않을 수 있습니다.

 

* * *

### **✅ 해결 예제:**

##### **`translatesAutoresizingMaskIntoConstraints = false` 사용**

```swift
let button = UIButton(type: .system)
button.setTitle("버튼", for: .normal)
button.backgroundColor = .systemBlue

// Auto Layout을 직접 사용하므로 false로 설정
button.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(button)

// Auto Layout 제약 설정
NSLayoutConstraint.activate([
  button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
  button.topAnchor.constraint(equalTo: view.topAnchor, constant: 100),
  button.widthAnchor.constraint(equalToConstant: 120),
  button.heightAnchor.constraint(equalToConstant: 44)
])
```

#### **✅ 결과**

- 충돌 없이 버튼이 정확한 위치에 배치됩니다.
- Auto Layout이 의도대로 작동합니다.

이처럼 Auto Layout을 사용할 때는 반드시 `translatesAutoresizingMaskIntoConstraints = false`를 명시해주어야 **레이아웃 충돌 없이 제약이 적용**됩니다.

 

* * *

### **✅ 요약**

| 속성 값 | 의미 | 보통 사용하는 경우 |
| --- | --- | --- |
| `true` (기본값) | 오토리사이징 마스크 → 자동 제약으로 변환 | `.frame` 기반 레이아웃 사용 시 |
| `false` | 오토리사이징 마스크 → 자동 제약 변환 안 함 | Auto Layout을 명시적으로 설정할 때 |

 

\[rcblock id="6686"\]
