---
title: AudioKit의 DunneSynth
author: ayaysir
date: 2025-06-22 15:58:34 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

- [코드 보기](https://github.com/ayaysir/Swift-Playgrounds/blob/main/AudioKit%20Cookbook%20Copy/AudioKit%20Cookbook%20Copy/Recipe/WIP/DunneSynth.swift)

`DunneSynthConductor`는 AudioKit의 `Synth` (정확히는 `DunneAudioKit`의 Dunne Synthesizer)를 제어하는 **오디오 신스 컨덕터 클래스**입니다.
SwiftUI 기반의 UI와 연동하여 신스의 파라미터 조정, 노트 재생, 피크 리미팅, 팝 제거 등 다양한 오디오 처리 제어를 담당합니다.

## 클래스 개요

```swift
class DunneSynthConductor: ObservableObject, HasAudioEngine
```

* `ObservableObject`이므로 SwiftUI 뷰와 상태 바인딩 가능
* `HasAudioEngine` 프로토콜을 통해 `engine` 및 노드 연결 보장
* 내부에서 `Synth` 객체를 사용하여 가상 악기를 구현

## 주요 구성 요소

### `let engine = AudioEngine()`

* AudioKit의 핵심 오디오 처리 엔진

### `var instrument = Synth()`

* DunneAudioKit의 **폴리포닉 신스**
* 매핑된 파라미터들을 실시간으로 제어 가능

### noteOn / noteOff

#### `func noteOn(pitch: Pitch, point _: CGPoint)`

```swift
instrument.play(noteNumber: ..., velocity: 100, channel: 0)
```

* 전달된 `Pitch`를 MIDI note로 변환하여 재생 시작

#### `func noteOff(pitch: Pitch)`

```swift
instrument.stop(noteNumber: ..., channel: 0)
```

* 해당 음 높이의 노트를 정지시킴

## 초기화: `init()`

### 1. `engine.output = PeakLimiter(...)`

* 출력단에 `PeakLimiter` 삽입 → 소리의 **과도한 피크 방지**
* `attackTime = 0.001`: 피크 감지 후 빠르게 제한
* `decayTime = 0.001`: 제한 해제도 즉시
* `preGain = 0`: 입력 게인을 증폭하지 않음

### 2. 팝 노이즈 제거 설정

```swift
instrument.releaseDuration = 0.01
instrument.filterReleaseDuration = 10.0
instrument.filterStrength = 40.0
```

* `releaseDuration`이 너무 짧으면 소리가 갑자기 끊기면서 **팝(Pop)** 노이즈 발생
* `filterReleaseDuration`을 길게 설정해 필터 계열 소리가 부드럽게 사라지도록 함
* `filterStrength`는 필터 적용 정도 조절

## 파라미터 목록

### 일반 음성 파라미터

| 파라미터               | 기본값    | 범위             | 설명                 |
| ------------------ | ------ | -------------- | ------------------ |
| `Master Volume`    | `1.0`  | `0.0...1.0`    | 전체 출력 볼륨           |
| `Pitch Bend`       | `0.0`  | `-24.0...24.0` | 실시간 피치 변조 (세미톤 단위) |
| `Vibrato Depth`    | `0.0`  | `0.0...12.0`   | 비브라토 강도            |
| `Filter Cutoff`    | `1.0`  | `0.0...1.0`    | 필터 컷오프 주파수 (정규화)   |
| `Filter Strength`  | `40.0` | `0.0...100.0`  | 필터 효과의 강도          |
| `Filter Resonance` | `0.0`  | `-20.0...20.0` | 공명(Resonance) 강도   |

### 앰플리튜드 ADSR (Amplitude Envelope)

| 파라미터               | 기본값    | 범위           | 설명                      |
| ------------------ | ------ | ------------ | ----------------------- |
| `Attack Duration`  | `0.0`  | `0.0...10.0` | 노트 시작 시 볼륨이 증가하는 시간     |
| `Decay Duration`   | `0.0`  | `0.0...10.0` | 최대 볼륨에서 지속 볼륨까지 줄어드는 시간 |
| `Sustain Level`    | `1.0`  | `0.0...1.0`  | 키를 누르고 있을 때 유지되는 볼륨     |
| `Release Duration` | `0.01` | `0.0...10.0` | 노트 종료 후 소리가 사라지는 시간     |

### 필터 ADSR (Filter Envelope)

| 파라미터                      | 기본값    | 범위           | 설명                    |
| ------------------------- | ------ | ------------ | --------------------- |
| `Filter Attack Duration`  | `0.0`  | `0.0...10.0` | 필터가 작동을 시작하는 데 걸리는 시간 |
| `Filter Decay Duration`   | `0.0`  | `0.0...10.0` | 필터가 최대 효과에서 사라지는 시간   |
| `Filter Sustain Level`    | `1.0`  | `0.0...1.0`  | 필터 효과의 유지 비율          |
| `Filter Release Duration` | `10.0` | `0.0...10.0` | 필터 효과가 사라지는 시간        |

## 콘솔 출력

```swift
instrument.parameters.forEach {
  print("\($0.def.name) | \($0.value) | \($0.range)")
}
```

* 모든 파라미터 이름, 현재값, 범위를 디버깅용으로 출력
* UI 연결 확인이나 슬라이더 구성 시 유용함

## 요약

`DunneSynthConductor`는:

* AudioKit의 Dunne 신스를 제어하고
* 소리의 피크와 팝 노이즈를 제어하며
* 다양한 신스 파라미터들을 외부 UI와 연결할 수 있게 준비된 컨트롤러입니다.
