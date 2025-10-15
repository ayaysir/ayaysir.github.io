# Stereo Operation

이 코드는 **스테레오 오디오 신호를 생성하고, 실시간으로 좌우 패닝(pan) 및 주파수 변경이 가능한** AudioKit 기반의 `StereoOperationConductor` 클래스입니다. 기존 코드에서 확장된 부분과 함께 전체적인 동작을 **음향적 의미와 수치 단위까지 포함하여 설명**드리겠습니다.

---

## 🧱 전체 구조

```swift
class StereoOperationConductor: ObservableObject, HasAudioEngine
```

* `ObservableObject` → SwiftUI에서 `@StateObject`로 상태 추적 가능.
* `HasAudioEngine` → AudioKit의 오디오 엔진을 직접 제어.

---

## 🔊 주요 구성요소

### 1. `generator: OperationGenerator`

* **스테레오 2채널** 사운드를 생성함.
* 파라미터 `params[0]`, `params[1]`을 통해 좌우 주파수를 외부에서 실시간 조정 가능.

```swift
let generator = OperationGenerator(channelCount: 2) { params in ... }
```

---

### 2. 비브라토(Vibrato)와 트레몰로(Tremolo)

#### `slowSine` (비브라토)

```swift
let slowSine = round(Operation.sineWave(frequency: 1) * 12) / 12
let vibrato = slowSine.scale(minimum: -1200, maximum: 1200)
```

* **1Hz 저주파 사인파**를 12단계로 양자화 → **1옥타브(12세미톤)** 단위의 스텝으로 변함.
* `-1200 ~ +1200 cent` = `-1옥타브 ~ +1옥타브` 범위
* `frequency + vibrato` → 사운드의 피치를 흔들리게 만듦 (**비브라토 효과**)

#### `fastSine` (트레몰로)

```swift
let fastSine = Operation.sineWave(frequency: 10)
let volume = fastSine.scale(minimum: 0, maximum: 0.5)
```

* **10Hz 고주파 사인파** → 1초에 10번 볼륨이 흔들림.
* `0.0 ~ 0.5` 범위의 **진폭(amplitude)** 변화를 통해 **트레몰로 효과** (소리의 세기가 규칙적으로 변화)

---

### 3. 좌우 사운드 생성

```swift
let leftOutput = Operation.sineWave(
  frequency: params[0] + vibrato,
  amplitude: volume
)
let rightOutput = Operation.sineWave(
  frequency: params[1] + vibrato,
  amplitude: volume
)
```

* `params[0]`: 좌측 시작 주파수 (`leftStartFreq`)
* `params[1]`: 우측 시작 주파수 (`rightStartFreq`)
* `vibrato`는 양쪽 모두에 동일하게 적용
* 결과적으로 좌/우 주파수 차이 + 진폭 변화 → 공간감 있는 스테레오 사운드 생성

---

### 4. 패닝(Panner)

```swift
private let panner: Panner
```

* `Panner(generator)`를 통해 좌/우 사운드를 하나로 섞어서 출력할 때 **위치 조절 가능**.
* `pan` 범위: `-1.0` (완전 왼쪽) \~ `0.0` (중앙) \~ `+1.0` (완전 오른쪽)

```swift
@Published var pan: AUValue = 0.0 {
  didSet { panner.pan = pan }
}
```

---

### 5. 초기 파라미터 설정

```swift
generator.parameter1 = leftStartFreq
generator.parameter2 = rightStartFreq
```

* 앱 실행 시 기본 좌/우 주파수를 지정 (440Hz, 220Hz)

---

## 🧠 수치적 의미 요약

| 요소          | 수치 범위            | 단위/역할         |
| ----------- | ---------------- | ------------- |
| `slowSine`  | ±1 옥타브 (`±1200`) | 센트 (pitch)    |
| `fastSine`  | 0.0 \~ 0.5       | 진폭 (volume)   |
| `leftFreq`  | 440 (A4)         | Hz (좌 채널 시작음) |
| `rightFreq` | 220 (A3)         | Hz (우 채널 시작음) |
| `pan`       | -1.0 \~ 1.0      | 좌/우 공간 위치     |

---

## ✅ 요약

* 좌/우 채널의 주파수를 따로 조절 가능
* 비브라토, 트레몰로가 각 채널에 동일하게 적용되어 리듬감 있고 공간감 있는 사운드를 만듦
* `Panner`로 전체 사운드의 좌우 위치 조절 가능
* **AudioKit을 활용한 인터랙티브 스테레오 사운드 디자인 구조**로, 사운드 실험, 설치음악, 실시간 제어에 유용함

---
