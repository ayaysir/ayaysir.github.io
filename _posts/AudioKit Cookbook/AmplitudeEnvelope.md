# Amplitude Envelope

`AmplitudeEnvelope`는 AudioKit에서 **소리의 볼륨(진폭, amplitude)을 시간에 따라 제어**하는 **ADSR 엔벨로프(Envelope Generator)** 컴포넌트입니다.

이 컴포넌트는 **노트의 시작과 끝을 부드럽게 다듬는 역할**을 하며,
특히 노트가 갑자기 시작되거나 끊길 때 생기는 "팝(pop)" 소리나 부자연스러운 연결을 방지합니다.

---

## 🎛️ AmplitudeEnvelope란?

```swift
let env = AmplitudeEnvelope(osc)
```

* 입력 노드(`osc`, 즉 오실레이터나 샘플러 등)를 감싸서,
  소리가 나는 동안 진폭을 부드럽게 변화시켜 줌
* **ADSR 구조**:

  * **A**ttack: 소리가 시작된 후 최대 볼륨까지 도달하는 데 걸리는 시간
  * **D**ecay: 최대 볼륨에서 지속 볼륨까지 내려가는 시간
  * **S**ustain: 키를 누르고 있는 동안 유지되는 볼륨
  * **R**elease: 키를 뗀 후 소리가 완전히 사라지는 시간

---

## 🔧 주요 메서드

### ✅ `openGate()`

* \*\*노트 온(Note On)\*\*을 의미
* 엔벨로프가 **Attack → Decay → Sustain** 단계로 이동
* 실제로는 소리가 커지는 과정이 시작됨

```swift
env.openGate()
```

→ `noteOn()`에서 호출됨

---

### ✅ `closeGate()`

* \*\*노트 오프(Note Off)\*\*를 의미
* 엔벨로프가 **Release** 단계로 진입 → 서서히 볼륨이 줄어듦

```swift
env.closeGate()
```

→ `noteOff()`에서 호출됨

---

## 🧪 예시

```swift
env.attackDuration = 0.2
env.releaseDuration = 0.5
```

* `openGate()` 시: 0.2초 동안 볼륨이 올라가고 유지됨
* `closeGate()` 시: 0.5초 동안 볼륨이 서서히 줄어듦

---

## 🎯 왜 중요한가?

* **부드러운 노트 연결**
  갑작스러운 진폭 변화 없이 자연스러운 사운드 생성
* **음악적 표현력 향상**
  사운드에 감정, 움직임, 생동감을 부여
* **기본적인 음색 제어 수단**
  거의 모든 신시사이저에서 기본적으로 존재함

---

## ✅ 요약

| 요소                  | 설명                                |
| ------------------- | --------------------------------- |
| `AmplitudeEnvelope` | 진폭(볼륨)을 시간에 따라 제어하는 AudioKit 노드   |
| `openGate()`        | 노트 온 (소리 시작)                      |
| `closeGate()`       | 노트 오프 (소리 감쇠 시작)                  |
| 주 용도                | 소리의 자연스러운 시작과 끝, 팝 노이즈 제거, 음악적 표현 |

---

