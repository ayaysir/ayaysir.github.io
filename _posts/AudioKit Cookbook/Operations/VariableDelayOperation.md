# Variable Delay Operaion

이 코드는 `AudioKit`을 기반으로 한 **가변 딜레이 효과(variable delay effect)** 를 구현하는 구조입니다. 입력된 오디오에 **지속적으로 변하는 시간 및 피드백**을 적용하여, 공간감 있고 유기적인 사운드를 만들어냅니다. 아래에서 전체 구조, 변수 역할, 각 수치가 의미하는 바를 상세히 설명드리겠습니다.

---

## 🧱 전체 구조 요약

```swift
class VariableDelayOperationConductor: ObservableObject, ProcessesPlayerInput
```

* `ObservableObject`: SwiftUI에서 상태를 관찰하여 UI를 갱신 가능
* `ProcessesPlayerInput`: 사운드 소스를 불러오고 재생하는 역할
* 핵심 요소: **`AudioPlayer`, `OperationEffect`, `DryWetMixer`**

---

## 🔁 오디오 체인 구조

```text
AudioPlayer ("Piano" 샘플)
       ↓
OperationEffect (VariableDelay)
       ↓
DryWetMixer (dry / wet 믹스)
       ↓
AudioEngine.output
```

---

## 🎛 주요 변수 설명

### `VariableDelayOperationData`

이 구조체는 슬라이더 UI 등에서 조정 가능한 파라미터들을 저장합니다.

| 변수명                 | 설명                                | 단위    | 기본값    |
| ------------------- | --------------------------------- | ----- | ------ |
| `maxTime`           | **최대 지연 시간**, 시간 파형이 이 값 이하에서 변동  | 초 (s) | `0.2`  |
| `frequency`         | **딜레이 시간 변조에 사용되는 사인파의 주파수**      | Hz    | `0.3`  |
| `feedbackFrequency` | **피드백 양을 변조하는 사인파 주파수**           | Hz    | `0.21` |
| `rampDuration`      | 파라미터 값 변경 시 점진적으로 적용될 시간          | 초 (s) | `0.1`  |
| `balance`           | dry/wet 믹스 비율 (0 = 원음만, 1 = 이펙트만) | 0\~1  | `0.5`  |

---

## 🎚 `OperationEffect` 내 실제 처리

```swift
let time = Operation.sineWave(frequency: params.n(2))
  .scale(minimum: 0.001, maximum: params.n(1))
```

* `params.n(1)` = `maxTime`
* `params.n(2)` = `frequency`

→ 이 구문은 **사인파 형태로 주기적으로 변하는 딜레이 시간(time)** 을 만듭니다.

* 예) `maxTime = 0.2`, `frequency = 0.3Hz` → 3.3초에 한 번 주기가 도는 지연시간 파형

```swift
let feedback = Operation.sineWave(frequency: params.n(3))
  .scale(minimum: 0.5, maximum: 0.9)
```

* `params.n(3)` = `feedbackFrequency`

→ 피드백 역시 사인파로 진동하며 변화 (잔향 길이가 계속 변함)

```swift
return player.variableDelay(
  time: time,
  feedback: feedback,
  maximumDelayTime: 1.0
)
```

* **실제 적용**되는 딜레이 함수.
* `maximumDelayTime`은 시스템이 버퍼를 얼마나 잡을지 결정하는 상한값 (안전상 1.0초 설정)

---

## 🔁 `DryWetMixer`

```swift
dryWetMixer = DryWetMixer(player, delay)
```

* 원본 소리 (`dry`)와 이펙트가 적용된 소리 (`wet`)를 섞는 믹서
* `balance` 값을 통해 비중 조절 가능 (`0.5`면 반반)

---

## 🔄 실시간 파라미터 반영

```swift
delay.$parameter1.ramp(to: data.maxTime, duration: data.rampDuration)
```

* `.ramp(to:, duration:)`는 지정한 값으로 **부드럽게 천천히 변화**
* 클릭이나 슬라이더 조작 시 **뚝뚝 끊기지 않고 자연스럽게** 변화

---

## 📈 결과적으로 만들어지는 사운드 특징

* 딜레이 시간과 피드백 양이 **계속 진동**하므로, 소리가 흔들리듯 반사되고 잔향도 길이가 계속 변함
* **유기적인 공간감**, 리드미컬한 배경음에 적합
* 재즈, 앰비언트, 전자음악에서 흔히 사용되는 형태

---

## ✅ 요약

| 요소             | 설명                                     |
| -------------- | -------------------------------------- |
| `time`         | 사인파로 진동하는 딜레이 시간 (0.001초 \~ `maxTime`) |
| `feedback`     | 사인파로 진동하는 피드백 비율 (0.5 \~ 0.9)          |
| `frequency`    | 위 사인파들의 진동 속도 설정                       |
| `rampDuration` | 파라미터 변경 시 딱딱 끊기지 않고 부드럽게 적용            |
| `balance`      | dry/wet 음을 섞는 비율                       |
| 전체 효과          | 공간이 계속 변화하는 듯한 모듈레이션 딜레이 효과            |

---


