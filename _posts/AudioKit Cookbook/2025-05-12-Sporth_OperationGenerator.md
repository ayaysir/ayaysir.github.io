---
title: AudioKit의 Sporth OperationGenerator 에 대해서
author: ayaysir
date: 2025-05-12 15:19:44 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

## Sporth란?

**Sporth**는 "Small Portable Real-Time Sound Language"의 줄임말로, **경량 텍스트 기반 오디오 DSP 언어**입니다. C 기반 오디오 라이브러리인 **Soundpipe**의 일부로 개발되었으며, AudioKit에서도 내장되어 있습니다.

* **목적**: 실시간 오디오 신호 처리를 빠르고 간단하게 기술할 수 있도록 설계된 **스택 기반 언어**
* **형식**: `"sine 440 0.5 mul"` 같은 **단순한 텍스트 문자열**
* **실행**: 오디오 그래프(DSP 신호 흐름)를 실시간으로 생성하고 처리함
* **용도**: 합성(synthesis), 필터링, 이펙트, 시퀀싱 등 오디오 관련 처리 전반

### Sporth의 작동 방식 (스택 기반)

스택 머신처럼 동작합니다:

```sporth
440 sine 0.5 mul
```

이 의미는:

1. 440 → 스택에 `440` 푸시
2. `sine` → 스택에서 `440`을 꺼내 사인파 생성 → 결과 푸시
3. 0.5 → `0.5` 푸시
4. `mul` → 두 값을 꺼내 곱함 → 최종 오디오 신호 생성

### 예시

### 1. 사인파 생성

```sporth
440 sine
```

→ 440Hz 사인파 생성

#### 2. 노이즈 생성 + 필터

```sporth
pinknoise 8000 tone
```

→ 핑크 노이즈를 8kHz로 로우패스 필터링

#### 3. 오토펜닝 + 볼륨 조절

```sporth
0.5 0.5 sine pan 0.2 mul
```

→ 오토패닝된 사운드를 볼륨 20%로 출력

### Sporth의 장점

| 항목          | 설명                              |
| ----------- | ------------------------------- |
| 가볍고 빠름      | DSP를 직접 제어하는 데 적합함              |
| 실시간 수정      | 오디오 중단 없이 코드를 바꿀 수 있음           |
| AudioKit 통합 | `OperationGenerator`에서 쉽게 사용 가능 |

### AudioKit과의 관계

AudioKit에서는 `OperationGenerator(sporth: "코드")` 형태로 Sporth를 사용할 수 있습니다.
복잡한 UI 없이도 DSP 알고리즘을 간단히 실험하거나 프로토타이핑할 수 있는 좋은 도구입니다.

## OperationGenerator

`OperationGenerator`는 **AudioKit**에서 제공하는 `Node`의 서브클래스로, **Sporth 코드 기반의 사운드 생성기(Generator)** 역할을 합니다. 즉, 사용자가 제공하는 Sporth DSL(도메인 특화 언어) 또는 AudioKit의 Operation API를 바탕으로 오디오 신호를 생성하는 **가변형 DSP 노드**입니다.

### 주요 특징

#### 1. **`Node` 프로토콜 채택**

* `OperationGenerator`는 AudioKit의 `Node`를 상속받으며,

  * `connections`는 빈 배열 (연결된 노드 없음)
  * `avAudioNode`는 내부적으로 `instantiate(instrument: "cstg")`를 통해 생성된 `AVAudioNode`

#### 2. **파라미터 14개 제공**

* 최대 14개의 파라미터 (`parameter1` \~ `parameter14`)를 지원
* 각 파라미터는 `@Parameter` 프로퍼티 래퍼를 사용하여 연결됨
* 실제 `AUParameter`로 연결되어 외부에서 실시간 조절 가능 (예: UI 슬라이더)

#### 3. **여러 초기화 방식 지원**

##### a. 단일 `Operation` 기반 초기화

```swift
OperationGenerator(operation: { ops in
  ops[0].sineWave()
})
```

* 입력된 `([Operation]) -> ComputedParameter` 클로저로부터 Sporth 코드를 생성
* 단일 채널인 경우 `dup`, 스테레오인 경우 `swap` 등을 Sporth 코드에 삽입하여 채널 정렬

##### b. 파라미터 없는 `Operation`도 가능

```swift
OperationGenerator(operation: {
  Operation.sineWave()
})
```

##### c. 스테레오 `Operation` 두 개 입력

```swift
OperationGenerator(channelCount: 2, operations: { ops in
  [ops[0].sineWave(), ops[1].squareWave()]
})
```

#### 4. **Sporth 문자열 직접 초기화 가능**

```swift
OperationGenerator(sporth: "pinknoise dup")
```

* Sporth 문자열을 직접 넣어 제너레이터를 구성할 수 있음
* 내부적으로 `akOperationSetSporth()`를 통해 DSP 설정

#### 5. **trigger()로 사운드 실행**

```swift
generator.trigger()
```

* `au.trigger()`를 호출하여 현재 파라미터로 한 번 실행
* 주로 "보이스", "샘플", "효과음" 등에 사용

### 활용 예시

```swift
let generator = OperationGenerator {
  Operation.sineWave(frequency: Operation.parameter(1)) * 0.3
}
generator.parameter1 = 440
generator.start()
generator.trigger()
```

### 요약

| 요소             | 설명                                   |
| -------------- | ------------------------------------ |
| `Operation` 기반 | AudioKit Operation API 또는 Sporth로 구성 |
| 파라미터           | 최대 14개 실시간 제어용                       |
| 출력             | mono 또는 stereo                       |
| 주요 용도          | 사운드 합성, 효과 생성, 실험적 DSP 노드 구성         |
