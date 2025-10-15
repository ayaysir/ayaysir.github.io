---
title: AudioKit의 StereoDelayOperration
author: ayaysir
date: 2025-05-23 15:05:15 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

# Stereo Delay Operation

이 코드는 **AudioKit**을 활용해 **좌우 독립적인 스테레오 딜레이 이펙트**를 적용하는 Swift 오디오 처리 예제입니다. 주요 구성요소와 음향 처리 흐름에 따라 설명드리겠습니다.

---

## 🧱 구조 요약

```swift
class StereoDelayOperationConductor: ObservableObject, ProcessesPlayerInput
```

* `ObservableObject`: SwiftUI에서 상태 관리를 위해 사용됩니다.
* `ProcessesPlayerInput`: 오디오 입력을 재생하고 이펙트를 거치는 공통 프로토콜입니다.

---

## 🎧 핵심 변수 설명

```swift
struct StereoDelayOperationData {
  var leftTime: AUValue = 0.2
  var leftFeedback: AUValue = 0.5
  var rightTime: AUValue = 0.01
  var rightFeedback: AUValue = 0.9
}
```

* **leftTime**: 왼쪽 채널의 딜레이 시간 (초 단위)
* **leftFeedback**: 왼쪽 딜레이 반복 강도 (0\~1 사이)
* **rightTime**, **rightFeedback**: 오른쪽 채널도 동일

딜레이 효과는 시간 차를 두고 소리를 반복 재생하는 효과이며, **feedback 값**이 클수록 반복이 더 오래 이어집니다.

---

## 🧠 처리 흐름

### 1. **오디오 재생 버퍼 초기화**

```swift
buffer = Cookbook.sourceBuffer(source: "Female Voice")
player.buffer = buffer
player.isLooping = true
```

* `"Female Voice"` 샘플을 메모리에 불러오고 무한 반복 설정

---

### 2. **OperationEffect 생성 (채널 수: 2)**

```swift
effect = OperationEffect(player, channelCount: 2) { _, params in
```

* `channelCount: 2`로 지정되어, 좌우 채널을 독립적으로 처리할 수 있습니다.
* 클로저 내에서 `params`는 1\~4번까지 할당된 딜레이 파라미터들을 받아 사용합니다.

---

### 3. **좌우 채널 독립 딜레이 적용**

```swift
let leftDelay = Operation.leftInput.variableDelay(
  time: params.n(1),
  feedback: params.n(2)
)
let rightDelay = Operation.rightInput.variableDelay(
  time: params.n(3),
  feedback: params.n(4)
)
```

* `.leftInput`, `.rightInput`: 각 채널의 입력 소리
* `.variableDelay(...)`: 시간과 반복 강도를 설정한 딜레이 효과를 생성

이렇게 하면 **왼쪽 채널은 예: 0.2초 딜레이 + 중간 정도의 반복**, 오른쪽 채널은 **0.01초 짧은 딜레이 + 높은 반복** 같은 식으로 완전히 다르게 설정 가능합니다.

---

### 4. **딜레이 출력 결합**

```swift
return [leftDelay, rightDelay]
```

좌우 두 채널의 출력 배열을 반환해 **스테레오 출력**으로 구성됩니다.

---

### 5. **AudioEngine 출력 설정**

```swift
engine.output = effect
```

* `player → effect → engine.output`으로 연결되어 재생과 이펙트가 함께 처리됩니다.

---

### 6. **슬라이더 등 외부에서 값 변경 대응**

```swift
@Published var data = StereoDelayOperationData() {
  didSet {
    effect.parameter1 = data.leftTime
    effect.parameter2 = data.leftFeedback
    effect.parameter3 = data.rightTime
    effect.parameter4 = data.rightFeedback
  }
}
```

* SwiftUI 슬라이더 등에서 `data` 값을 바꾸면 자동으로 딜레이 파라미터가 반영됩니다.

---

## 🎵 음향적 특징

* 좌우 딜레이가 다르면 **공간감**과 **스테레오 이미지**가 크게 확장됩니다.
* 한쪽에 긴 피드백을 주고 한쪽은 짧게 주면, **잔향이 치우치거나 퍼지는 효과**를 줍니다.
* 보컬, 신스 패드 등에 잘 어울리는 풍성한 딜레이 느낌을 연출할 수 있습니다.

---

## ✅ 요약표

| 구성 요소             | 역할               |
| ----------------- | ---------------- |
| `AudioPlayer`     | 오디오 재생           |
| `OperationEffect` | 좌우 독립 딜레이 처리     |
| `data`            | 딜레이 파라미터를 묶은 구조체 |
| `params.n()`      | 딜레이 인자 접근용       |
| `engine.output`   | 전체 오디오 출력 연결     |

---
