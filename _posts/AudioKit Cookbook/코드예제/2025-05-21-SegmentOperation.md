---
title: AudioKit의 SegmentOperation
author: ayaysir
date: 2025-05-21 15:36:12 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

# Segment Operation

이 코드는 `AudioKit`, `SporthAudioKit`을 기반으로 음향 합성을 수행하는 Swift 클래스 `SegmentOperationConductor`입니다. 특히 \*\*라인 세그먼트(line segment)\*\*와 \*\*지수 세그먼트(exponential segment)\*\*를 활용한 **시간 변화 기반의 음향 합성**을 구현한 예제입니다.

---

## 💡 전체 개요

`SegmentOperationConductor`는 **시간에 따라 변화하는 주파수와 진폭**을 가지는 사인파를 생성하고, **딜레이와 리버브 이펙트**를 적용한 사운드를 출력합니다.

---

## 🔧 주요 구성 요소 설명

```swift
let generator = OperationGenerator { params in
```

`OperationGenerator`는 오디오 신호 그래프를 생성하는 핵심이며, Sporth DSL을 Swift 문법으로 만든 구조입니다. `params`는 외부에서 제어 가능한 파라미터를 전달받습니다.

### 🎚 params\[0] = updateRate

```swift
let updateRate = params[0]
```

* 이 값은 **`metronome` 트리거의 빈도**를 조절합니다.
* 이 트리거는 특정 시간 간격마다 아래 라인 세그먼트, 지수 세그먼트를 \*\*재시작(트리거)\*\*하게 만듭니다.

---

## 🌀 라인 세그먼트 (`lineSegment`)

```swift
let start = Operation.randomNumberPulse() * 2000 + 300
let duration = Operation.randomNumberPulse()
let frequency = Operation.lineSegment(
  trigger: Operation.metronome(frequency: updateRate),
  start: start,
  end: 0,
  duration: duration
)
```

### Operation.randomNumberPulse()
* 0.0부터 1.0 사이의 난수(random number) 를 일정 주기마다 출력합니다.
* 기본적으로 초당 10번 (10Hz) 갱신되며, 설정하지 않으면 default입니다.
* 샘플 홀드형 노이즈와 비슷하게 일정 주기마다 값이 바뀝니다.

### ✔ `Operation.lineSegment(...)`의 뜻

* **"선형 구간(line segment)"**: 선형적으로 값이 변하는 함수입니다.
  → 마치 그래프에서 직선으로 이어진 구간처럼 **시작 값에서 끝 값까지 일정 시간에 걸쳐 선형으로 변화**합니다.

### 이 코드에서는?

* 랜덤한 주파수(`start`)에서 **0Hz까지 천천히 내려감**
* 이 과정은 `duration` (지속시간)에 따라 변화
* `metronome`이 트리거되어 주기적으로 반복됨

### 결과

> **소리의 피치가 매번 다르게 시작해서 서서히 내려가고 끊어짐.**

---

## 📉 지수 세그먼트 (`exponentialSegment`)

```swift
let amplitude = Operation.exponentialSegment(
  trigger: Operation.metronome(frequency: updateRate),
  start: 0.3,
  end: 0.01,
  duration: 1.0
)
```

* **"지수 구간(exponential segment)"**: 시작값에서 끝값으로 **지수적으로 감소**합니다.
* 이 경우엔 볼륨(진폭)이 0.3에서 0.01로 **매우 빠르게 줄어듭니다.**
* `trigger`에 의해 주기적으로 재시작

---

## 🎛 오실레이터 생성

```swift
return Operation.sineWave(frequency: frequency, amplitude: amplitude)
```

* 위에서 정의한 **시간에 따라 감소하는 주파수와 진폭**을 가진 사인파를 생성합니다.

---

## 🎧 효과 추가

```swift
let delay = Delay(generator)
delay.time = 0.125
delay.feedback = 0.8
```

* 125ms의 딜레이를 넣고, **80% 피드백**으로 **에코처럼 반복되는 소리**를 생성

```swift
let reverb = Reverb(delay)
reverb.loadFactoryPreset(.largeHall)
```

* 리버브는 **큰 홀(hall)** 프리셋을 사용해서 소리를 **공간감 있고 울리게** 만듭니다.

```swift
engine.output = reverb
```

* 최종 출력은 리버브된 사운드입니다.

---

## 🔁 실행 제어

```swift
@Published var isRunning = false {
  didSet {
    isRunning ? generator.start() : generator.stop()
  }
}
```

* SwiftUI에서 `isRunning` 값을 바꾸면 generator의 재생/정지가 동기화됩니다.

---

## ✅ 요약

| 요소                   | 역할                       |
| -------------------- | ------------------------ |
| `lineSegment`        | 주파수를 점차 줄이게 하는 선형 구간 함수  |
| `exponentialSegment` | 진폭(볼륨)을 빠르게 줄이게 하는 지수 함수 |
| `metronome`          | 위 두 세그먼트를 주기적으로 트리거함     |
| `sineWave`           | 실제 음을 발생시킴               |
| `Delay`              | 잔향처럼 소리 반복               |
| `Reverb`             | 공간감 있게 소리를 울림            |

---

## 🧠 비유로 이해하면

* **`lineSegment`** = "산에서 썰매 타기": 높이에서 출발 → 밑으로 서서히 내려옴 (Pitch 낮아짐)
* **`exponentialSegment`** = "불 꺼지기": 처음은 밝다가 점점 어두워짐 (볼륨 급속히 줄어듦)

---
