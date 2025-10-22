---
title: "SwiftUI: 뷰 작성 Convention #1"
date: 2025-05-21
categories: 
  - "DevLog"
  - "SwiftUI"
---

# 📘 SwiftUI 뷰 작성 규칙 및 구조 가이드

## 📐 1. **파일 구조 분할 원칙**

확장(`extension`)을 사용하여 코드를 구역별로 분할합니다. 규모에 따라 확장2, 3은 분리하지 않을 수도 있습니다.

```swift
struct ExampleView: View { var body: some View {...} } 

extension ExampleView { // MARK: - View elements } 

extension ExampleView { // MARK: - Init/View related methods } 

extension ExampleView { // MARK: - Utility methods } 

#Preview { ExampleView() }
```

| 영역 | 설명 |
| --- | --- |
| **main** | `@State`, `@FocusState`, `@Environment` 등 속성 선언 + `body` |
| **확장 1** | 뷰 구성 요소 (뷰 단위 서브컴포넌트) |
| **확장 2** | 초기화 및 뷰 설정 관련 함수 (`setup`, `onAppear`, etc) |
| **확장 3** | 유틸리티 함수 |

* * *

## 🧱 2. **뷰 컴포넌트 구성 규칙**

### ✅ `body`는 상위 구성 요소만 나열:

```swift
var body: some View {
  VStack {
    PreviewSection
    NameSettingSection
    ColorSettingSection
    FontSettingSection
  }
}
```

- 하위 뷰는 private computed property 또는 함수로 분리.
- 명확한 의도 전달 및 뷰 로직 단순화를 위함.
- 단 `Divider(), Spacer()`와 같이 한 줄로 처리할 수 있는 뷰는 별도로 분리하지 않을 수도 있음

* * *

## 🧠 3. **네이밍 컨벤션**

| 대상 | 형식 | 예시 |
| --- | --- | --- |
| 뷰 영역 변수/함수 | `PascalCase` | `PreviewSection`, `ColorSection, SomeSection(...)` |
| 뷰 관련 함수 | `lowerCamelCase` | `setup()`, `updateThemeName()` |
| 포커스 관련 | `isXxxFocused` | `isNameFocused` |
| show/hide 토글 | `showXXXX` | `.opacity(showXXXX ? 1 : 0)` |
|  |  |  |

* * *

## 🔧 4. **onChange / onReceive 등 modifier 정리 원칙**

- 서식 관련 modifier는 해당 뷰의 밑에 정의합니다.
- 상태 관련 modifier(onChange 등)은 가능한 `body` 안의 최상위 뷰 밑에 정의합니다.
    -  예외) TextField.onSubmit(...) 등 특정 뷰에서 작동하는 modifier는 해당 뷰에 배치
- 서식 관련 modifier를 위에 배치하고, onChange등 상태 관리 modifer는 아래에 배치합니다.
- 상태 관련 modifer의 경우 반드시 extension 2, 3 등으로 분리합니다.
    - 단일 함수로 실행할 수 있는 경우 가능한 클로저를 사용하는 대신 `(() -> Void)` 타입의 함수를 확장 2, 3 등에 정의한 뒤 `perform:` 등으로 파라미터 값으로 배치합니다.

```swift
    .onAppear(perform: setup)
    .onChange(of: theme.id, setup)
    .onChange(of: isNameFocused, updateThemeNameIfUnfocused)
    .onReceive(debounce.backgroundColor.publisher, perform: updateBackgroundColor)
    .onReceive(debounce.textColor.publisher, perform: updateTextColor)
    .onReceive(debounce.themeName.publisher, perform: updateThemeName)
```

* * *

## 🧹 5. **코드 정렬 및 스타일 가이드**

- `@State`, `@Environment`, `@FocusState`는 뭉쳐서 선언
- View 내부는 **기능 단위로 줄 간격 확보**

* * *

## 📌 6. 기타 컨벤션

- 상태 변수는 `private` 접근제어자 기본
- 컴포넌트 뷰는 View 하위 `extension 2` 안에 정리
- 유틸리티 함수는 마지막 `extension`에 정리
- `MARK:` 주석으로 주요 구역 구분
- 그 외에는 널리 알려진 컨벤션에 따릅니다.

\[rcblock id="6686"\]
