# Tuner

`Tuner.swift` 파일은 AudioKit을 활용한 튜너(Tuner) 기능을 SwiftUI로 구현한 예제입니다. 핵심 역할은 마이크 입력을 받아 해당 소리의 **주파수(Pitch)** 와 **진폭(Amplitude)** 을 측정하고, 현재 음이 어떤 음계(Note)인지 판단하여 사용자에게 알려주는 것입니다.

---

## 🧩 **`TunerConductor` 클래스 설명**

`TunerConductor`는 오디오 처리의 중심이 되는 `ObservableObject`로, AudioKit의 오디오 그래프 구성과 실시간 피치 분석을 담당합니다.

### 주요 변수와 역할

| 변수             | 설명                                             |
| -------------- | ---------------------------------------------- |
| `engine`       | AudioKit의 오디오 엔진. 전체 오디오 흐름의 시작점               |
| `mic`          | 마이크 입력 (`engine.input`)                        |
| `tappableNode` | `Fader` 노드 3개(A, B, C)로 구성된 체인. 각각 분석/시각화 목적   |
| `silence`      | 최종 출력 노드. `gain: 0`으로 설정되어 실제 오디오 출력은 없음       |
| `tracker`      | `PitchTap` 객체. 실시간 피치(Pitch)와 진폭(Amplitude) 추적 |
| `noteInfos`    | 12반음 음계의 기준 주파수와 음 이름 정보 포함                    |

### 노드 연결 구조 (플레인 텍스트 그림)

```
[Mic Input] → [Fader A] → [Fader B] → [Fader C] → [Silence (gain: 0)]
                     ↑         ↑         ↑
                RollingView  OutputView  FFTView
```

---

### 작동 방식

1. **입력**

   * `engine.input`을 통해 마이크 입력을 받고 이를 `Fader`에 연결합니다.
   * `PitchTap(mic)` 은 마이크 입력을 tap(오디오 신호 라인 중간에 연결해서 감시(listen)하는 동작) 하여 실시간 피치와 진폭을 측정합니다.

2. **노드 체인 구성**

   * Fader A → B → C 는 동일한 오디오 신호를 단계적으로 연결하여 각기 다른 시각화 뷰에 전달합니다.
   * `silence` 노드는 출력이 실제 재생되지 않도록 설정 (`gain = 0`).

3. **주파수 분석**

   * `update(_:_:):` 메서드는 `PitchTap`에서 받은 피치와 진폭을 사용해 현재 음에 해당하는 노트를 계산합니다.
   * `noteInfos` 배열과 비교하여 가장 가까운 기준 음을 찾고, 옥타브를 보정하여 결과로 표시합니다.

4. **실시간 시각화**

   * 세 종류의 오디오 분석 뷰를 통해 시각적으로 상태를 보여줍니다.

---

## 📊 `NodeRollingView`, `NodeOutputView`, `NodeFFTView` 정의 및 차이점

| 뷰                 | 정의                 | 목적                            | 차이점                    |
| ----------------- | ------------------ | ----------------------------- | ---------------------- |
| `NodeRollingView` | 실시간 파형 (오실로스코프처럼)  | 시간에 따른 **파형 형태** 확인           | 단순 오디오 신호의 시간 축 변화     |
| `NodeOutputView`  | 출력 볼륨/레벨 바 (meter) | **출력 신호의 세기 (Amplitude)** 시각화 | amplitude 기반의 단순 레벨 확인 |
| `NodeFFTView`     | 주파수 분석 (스펙트럼)      | 실시간 **주파수 분포(FFT)** 분석        | 소리에 포함된 주파수 성분 시각화     |

모두 `tappableNode`의 서로 다른 노드를 대상으로 하기 때문에, 같은 입력이더라도 각기 다른 시각 정보를 제공합니다.

---

## 📦 정리

* `TunerConductor`는 실시간 마이크 입력을 받아 음의 주파수 및 진폭을 계산하고, 이를 기준 음에 매칭시켜 화면에 표시합니다.
* 오디오 신호는 Fader A → B → C로 흐르며, 각각 별도의 뷰로 시각화됩니다.
* 사용자 입장에서는 **현재 음 높이**, **세기**, **스펙트럼**을 동시에 확인할 수 있습니다.
* 실제 소리는 출력되지 않지만, 모든 신호는 내부적으로 오디오 그래프를 통해 처리되므로 정밀한 분석이 가능합니다.

---

# update(_:_:) 상세 설명

`update(_ pitch: AUValue, _ amp: AUValue)` 함수는 오디오 입력(마이크 등)에서 실시간으로 받은 **주파수(pitch)** 와 **진폭(amplitude)** 을 기반으로 음이름과 옥타브 정보를 추출하는 로직입니다. 아래에 **라인별로 상세 분석**을 제공합니다.

---

## 🔧 전체 함수 시그니처

```swift
func update(_ pitch: AUValue, _ amp: AUValue)
```

* 실시간으로 **PitchTap** 콜백에서 전달된 `pitch` (Hz 단위)와 `amp` (진폭)를 받아 처리합니다.
* `AUValue`는 `Float`의 typealias입니다.

---

## 1. 진폭이 너무 작으면 무시

```swift
guard amp > 0.1 else {
  return
}
```

* **배경 잡음을 필터링**하기 위한 조건입니다.
* 진폭(amp)이 0.1보다 작으면 거의 무음 또는 노이즈로 간주하여 무시합니다.
* → **불필요한 pitch 추적을 피합니다.**

---

## 2. 데이터 저장

```swift
data.pitch = pitch
data.amplitude = amp
```

* 외부 UI에서 관찰 가능한 `@Published var data`에 값을 저장합니다.
* SwiftUI 뷰에서 이 값을 기반으로 화면을 업데이트합니다.

---

## 3. 주파수를 1옥타브 범위로 정규화

```swift
var frequency = pitch
while frequency > Float(noteInfos[noteInfos.count - 1].frequency) {
  frequency /= 2.0
}
while frequency < Float(noteInfos[0].frequency) {
  frequency *= 2.0
}
```

* 입력된 pitch(예: 440Hz)가 1옥타브(12음계) 기준 주파수 범위를 벗어날 수 있으므로,
* 가장 가까운 1옥타브 범위(약 16.35\~30.87Hz)로 **정규화**합니다.
* 이 과정을 통해 다음 단계에서 **12개의 기준 음표(noteInfos)** 와 비교할 수 있습니다.

---

## 4. 가장 가까운 음을 찾기 위한 초기값 설정

```swift
var minDistance: Float = 10000.0
var index = 0
```

* `minDistance`: 가장 가까운 음표와의 주파수 차이를 저장할 변수
* `index`: 가장 가까운 음의 `noteInfos` 인덱스를 저장합니다.

---

## 5. 12개의 기준 음 중 가장 가까운 음 찾기

```swift
for possibleIndex in noteInfos.indices {
  let distance = fabsf(Float(noteInfos[possibleIndex].frequency) - frequency)
  if distance < minDistance {
    index = possibleIndex
    minDistance = distance
  }
}
```

* `fabsf`: float 값의 절댓값을 구함.
* 각 note와 `frequency` 간 차이를 계산하고, 가장 작은 차이를 가진 index를 저장합니다.
* 즉, **어떤 음(C, C♯ 등)** 에 가장 가까운지 찾는 로직입니다.

---

## 6. 옥타브 계산

```swift
let octave = Int(log2f(pitch / frequency))
```

* 원래의 pitch와 위에서 정규화된 frequency의 **비율을 log2f**로 변환해 옥타브를 계산합니다.
* 예: `pitch = 440`, `frequency = 27.5` → 440 / 27.5 = 16 → log2(16) = 4 → 옥타브 4차이

---

## 7. 결과 음표 이름 저장

```swift
data.noteNameWithSharps = "\(noteInfos[index].noteNamesWithSharps)\(octave)"
data.noteNameWithFlats = "\(noteInfos[index].noteNamesWithFlats)\(octave)"
```

* 가장 가까운 음표를 **샤프 또는 플랫** 이름으로 출력합니다. 예: `C♯4`, `D♭4`
* 이 값은 화면의 텍스트 뷰에서 다음과 같이 보입니다: `C♯4 / D♭4`

---

## ✅ 요약

| 역할      | 기능                   |
| ------- | -------------------- |
| 진폭 필터링  | 잡음을 제외               |
| 주파수 정규화 | 12음계 범위로 매핑          |
| 음표 추적   | 가장 가까운 음표 탐색         |
| 옥타브 추정  | 주파수 차이 기반 계산         |
| 출력 저장   | UI에 표시할 note name 할당 |

이 함수는 결국 실시간 입력으로부터 **"현재 들리는 음은 어떤 음인지, 몇 옥타브인지"** 를 계산해주는 핵심 로직입니다.

