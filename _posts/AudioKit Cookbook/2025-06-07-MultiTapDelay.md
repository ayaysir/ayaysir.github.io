---
title: "AudioKit의 MultiTapDelay"
author: ayaysir
date: 2025-06-07 14:53:20 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
--- 

- [코드 보기](https://github.com/ayaysir/Swift-Playgrounds/blob/main/AudioKit%20Cookbook%20Copy/AudioKit%20Cookbook%20Copy/Recipe/Effects/MultiTapDelay.swift)

`MultiTapDelayConductor` 클래스는 AudioKit을 사용하여 **멀티탭 딜레이(Multi-Tap Delay)** 효과를 구현하는 Swift 클래스입니다. 여러 개의 지연된 복사본을 입력 신호에 섞어 리듬감 있는 반복 효과나 리버브와 유사한 풍부한 공간감을 만들어냅니다.

## 클래스 설명

### class MultiTapDelayConductor

ObservableObject, ProcessesPlayerInput을 준수합니다.

* **`ObservableObject`**: SwiftUI 뷰와 데이터를 바인딩하기 위해 사용됩니다. 슬라이더를 통해 딜레이 시간 및 게인 값이 바뀌면 뷰가 자동으로 업데이트됩니다.
* **`ProcessesPlayerInput`**: 오디오 재생 처리를 담당하는 AudioKit Cookbook의 프로토콜입니다.

### 주요 변수

| 변수 이름           | 설명                                        |
| --------------- | ----------------------------------------- |
| `engine`        | AudioKit의 오디오 엔진                          |
| `player`        | `AudioPlayer`: 오디오 파일을 반복 재생합니다.          |
| `buffer`        | 오디오 파일을 메모리에 로드한 버퍼. 음원 데이터 저장            |
| `defaultSource` | 초기 재생할 오디오 파일. 여기서는 `.femaleVoice`        |
| `delays`        | `VariableDelay` 배열. 각 탭의 지연 요소입니다.        |
| `faders`        | `Fader` 배열. 각 탭의 게인 조절기입니다.               |
| `times`         | 슬라이더로 조절할 각 탭의 딜레이 시간 (\[0.1, 0.2, 0.4]초) |
| `gains`         | 각 탭의 출력 음량 (\[0.5, 2.0, 0.5])             |

### init()

* `player.buffer`에 오디오 데이터를 세팅하고 반복 재생을 설정합니다.
* `engine.output`에 `multiTapDelay(player, times: times, gains: gains)`을 설정하여 엔진 출력에 멀티탭 딜레이 효과를 적용합니다.

### multiTapDelay -> Mixer

```swift
multiTapDelay(_ input: Node, times: [AUValue], gains: [AUValue]) -> Mixer
```

* 입력 노드(input)의 신호를 딜레이 + 게인 조절해서 믹서에 추가합니다.
* 딜레이와 게인은 슬라이더로 개별 조정 가능.
* Mixer에 원본 입력도 함께 포함되어 Dry/Wet 믹싱 효과가 생깁니다.

```swift
for (i, (time, gain)) in zip(times, gains).enumerated() {
  delays.append(VariableDelay(input, time: time))
  faders.append(Fader(delays[i], gain: gain))
  mix.addInput(faders[i])
}
```

즉, `VariableDelay` → `Fader` → `Mixer` 순으로 체인 구성합니다.

### updateDelays()

* 슬라이더 값이 변경될 때마다 호출되어 딜레이 및 게인 값을 실시간 반영합니다.

```swift
delays[i].time = times[i]
faders[i].gain = gains[i]
```

## 요약

| 구성 요소      | 설명                                               |
| ---------- | ------------------------------------------------ |
| 딜레이 타임  | `[0.1, 0.2, 0.4]`초로 지정된 여러 지점에서 입력 신호를 지연        |
| 게인      | 각 딜레이된 신호의 볼륨을 개별 조절                             |
| 사용 효과   | 리듬감 있는 에코, 다층적인 반향, 리버브 유사 환경                    |
| 슬라이더 연동 | `@Published` 값이 변할 때 `updateDelays()` 호출로 실시간 반영 |

## 오디오 체인 구성도

```
player
  │
  ├──▶ VariableDelay(time: 0.1) ─▶ Fader(gain: 0.5) ─┐
  ├──▶ VariableDelay(time: 0.2) ─▶ Fader(gain: 2.0) ─┤
  ├──▶ VariableDelay(time: 0.4) ─▶ Fader(gain: 0.5) ─┤
  └──────────────────────────────────────────────────▶ Mixer (최종 출력)
```

이 구조는 **동일한 소스에서 여러 딜레이 시점을 만든 다음, 볼륨 조절 후 믹싱**하는 구조로, 공간감 있고 풍부한 사운드를 만드는 데 매우 유용합니다.
