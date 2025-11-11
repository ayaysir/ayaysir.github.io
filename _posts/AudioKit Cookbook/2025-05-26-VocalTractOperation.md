---
title: AudioKit의 VocalTractOperation 사용법
author: ayaysir
date: 2025-05-26 14:05:58 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

- [코드 보기](https://github.com/ayaysir/Swift-Playgrounds/blob/main/AudioKit%20Cookbook%20Copy/AudioKit%20Cookbook%20Copy/Recipe/Operations/VocalTractOperation.swift)

이 코드는 AudioKit의 `OperationGenerator`를 사용해 **인간의 음성을 물리적으로 모델링한 음향 합성기**를 구성합니다. `vocalTract`는 성도(목구멍\~입)의 구조를 모사한 음향 모델이며, 다양한 인자에 따라 음색이 변합니다. 아래는 주요 변수와 연산자의 역할을 중점적으로 설명합니다.

---

### 전체 구조

```swift
let generator = OperationGenerator { ... }
```

* Swift 클로저 안에서 **AudioKit Operation DSL**을 사용해 신호 흐름을 정의합니다.
* 반환값은 `Operation.vocalTract(...)`: 인간 음성을 시뮬레이션하는 메인 오퍼레이션

### 각 파라미터 설명

#### 1. 성문 주파수 (Glottal Frequency)

```swift
let frequency = Operation.sineWave(frequency: 1)
  .scale(minimum: 100, maximum: 300)
```

* `sineWave(frequency: 1)` → 1Hz 속도로 천천히 진동
* `.scale(minimum: 100, maximum: 300)` → 100\~300Hz 범위로 변환
* 사람 목소리의 음 높이 범위에 해당하는 값

#### 2. 지터 (Jitter)

```swift
let jitter = Operation.jitter(
  amplitude: 300,
  minimumFrequency: 1,
  maximumFrequency: 3
).scale()
```

* **지터**: 음성의 미세한 주파수 흔들림 → 자연스러움/불안정성 부여
* `amplitude: 300` → 최대 300Hz 변화폭
* `.scale()` → -1 \~ 1 사이의 랜덤값을 가진 사인파로 정규화됨

#### 3. 혀 위치 (Tongue Position)

```swift
let position = Operation.sineWave(frequency: 0.1).scale()
```

* 아주 느리게(0.1Hz) 움직이는 사인파
* `.scale()`은 기본적으로 -1 \~ 1로 스케일링됨
* 혀의 앞뒤 위치를 조정 → 모음 종류 변화

#### 4. 혀 직경 (Tongue Diameter)

```swift
let diameter = Operation.sineWave(frequency: 0.2).scale()
```

* 혀의 높낮이 조절 → 음색 변화

#### 5. 긴장도 (Tenseness)

```swift
let tenseness = Operation.sineWave(frequency: 0.3).scale()
```

* 성대의 긴장도 → 목소리의 강약, 날카로움, 부드러움에 영향

#### 6. 비음도 (Nasality)

```swift
let nasality = Operation.sineWave(frequency: 0.35).scale()
```

* 비강(코)으로 얼마나 소리를 흘리는지를 나타냄 → 콧소리 비율 제어

### 🔚 최종 합성

```swift
return Operation.vocalTract(
  frequency: frequency + jitter,
  tonguePosition: position,
  tongueDiameter: diameter,
  tenseness: tenseness,
  nasality: nasality
)
```

* `vocalTract`는 위 파라미터들을 이용해 목소리의 **음높이, 모음형, 억양**을 종합적으로 결정
* `frequency + jitter` → 안정된 음 높이 + 지터를 통한 자연스러움 부여

### 요약

| 파라미터      | 역할           | 효과 예시                        |
| --------- | ------------ | ---------------------------- |
| frequency | 기본 음 높이 (톤)  | 남성·여성 목소리 음역 차이 조정           |
| jitter    | 주파수 흔들림      | 더 자연스럽고 인간다운 발성 구현           |
| position  | 혀 위치 (전방/후방) | \[i], \[u], \[a] 같은 모음 차이    |
| diameter  | 혀의 위아래 위치    | 열림 모음/닫힘 모음 구분 등             |
| tenseness | 성대 긴장        | 부드럽거나 긴장된 발성                 |
| nasality  | 비음도 (콧소리 성분) | 영어 \[n], \[m], \[ŋ] 같은 발음 구현 |

이 모델은 실제로도 **Pink Trombone** 알고리즘 기반이며, 사람의 음성 생성 메커니즘을 물리적으로 시뮬레이션합니다.
