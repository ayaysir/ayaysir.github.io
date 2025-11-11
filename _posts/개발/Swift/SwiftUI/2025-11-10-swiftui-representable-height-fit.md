---
published: false
title: "SwiftUI: UIRepresentableView의 높이 조절"
author: ayaysir
date: 2025-11-10 21:49:00 +0900
categories: 
  - "DevLog"
  - "SwiftUI"
tags: [SwiftUI]
---

- 출처: [https://elisha0103.tistory.com/31](https://elisha0103.tistory.com/31)

## 문제

UITextView를 커스텀하는 UIRepresentableView를 만들었는데 가로 폭을 침범하고 높이 조절이 되지 않는 문제

## 해결방법

### 가로 너비를 SwiftUI의 상위 뷰 너비에 맞추기

```swift
textView.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
```

**Content Compression Resistance Priority** (CCRP) 조정
- 뷰가 압축(compress)되는 것을 막으려는 우선순위를 의미합니다.
- 값이 높을수록 “줄어들지 않겠다”라는 의지를 나타냅니다.
- 값이 낮으면, 다른 뷰에 맞추기 위해 폭이 줄어들 수 있습니다.

### layoutSubviews() 가 호출될 때 동적으로 높이 조절

<!-- ### SwiftUI에서 View에 maxWidth: infinity 주기

```swift
SelectableTextView(text: text)
// 이게 있어야 HStack 안에서 너비 계산을 제대로 함
  .frame(maxWidth: .infinity)
``` -->

## 동작화면