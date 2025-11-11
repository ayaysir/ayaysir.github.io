---
title: "CoreAudio: kMIDINotPermitted 문제 (백그라운드 오디오 관련)"
author: ayaysir
date: 2025-05-01 18:47:55 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

# kMIDINotPermitted 문제

## 원인

 iOS 앱에서 ***Background Modes***의 ***"Audio, AirPlay, and Picture in Picture"*** 옵션을 활성화하지 않으면 MIDI 권한이 제한되어, `MIDISampler`나 `MIDICallbackInstrument`와 같은 실시간 MIDI 관련 기능이 제대로 작동하지 않습니다.

## 오류 메시지 해석

```
CheckError.swift:CheckError(_:):176:kMIDINotPermitted:
Have you enabled the audio background mode in your ios app?
```

- `kMIDINotPermitted`는 **MIDI 권한 부족**을 나타냅니다.
- "Have you enabled the audio background mode...?"라는 메시지 자체가 해결 방법을 알려주고 있습니다:  
  → 즉, **"Background Modes > Audio"를 활성화해야 MIDI 기능이 허용됨**을 뜻합니다.

## 왜 이런 문제가 발생하는가?

iOS는 **에너지 절약과 보안을 이유로**, 백그라운드 또는 오디오 처리 관련 기능을 **명시적으로 허용하지 않으면 일부 오디오/MIDI 기능을 제한**합니다.

특히 다음 경우:

- AudioKit의 `MIDISampler`, `AppleSequencer`, `MIDICallbackInstrument` 등은
  **Core MIDI 또는 AVAudioEngine의 실시간 처리 권한**이 필요합니다.
- 하지만 `Info.plist` 또는 Build 설정에 **Background Modes > Audio**가 설정되지 않으면,
  iOS는 **이 앱이 오디오 기반 앱이 아니라고 판단**하고,  
  → MIDI 처리를 차단합니다.

## 해결 방법

### 1. Xcode에서 설정

- 프로젝트 설정 > `Signing & Capabilities` 탭
- `+ Capability` 버튼 클릭 → `Background Modes` 추가
- `Audio, AirPlay, and Picture in Picture` 체크 ✅

### 2. `Info.plist`에 자동으로 추가되는 키

```xml
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
</array>
```

## 정리

| 항목 | 설명 |
|------|------|
| 문제 | `MIDISampler` 사용 시 MIDI 권한 부족으로 드럼 소리가 나지 않음 |
| 원인 | Background Modes > Audio 옵션이 꺼져 있어서 iOS가 오디오/MIDI 권한 차단 |
| 해결 | Xcode > Signing & Capabilities > Background Modes > Audio 항목 체크 |
| 효과 | 실시간 MIDI 입력, AudioKit 샘플러 및 시퀀서 정상 동작 |

