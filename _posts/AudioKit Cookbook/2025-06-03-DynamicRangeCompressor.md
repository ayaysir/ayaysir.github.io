---
title: AudioKit의 DynamicRangeCompressor 사용 방법
author: ayaysir
date: 2025-06-03 14:11:05 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

# DynamicRangeCompressor

- [코드 보기](https://github.com/ayaysir/Swift-Playgrounds/blob/main/AudioKit%20Cookbook%20Copy/AudioKit%20Cookbook%20Copy/Recipe/Effects/DynamicRangeCompressor.swift)

`DynamicRangeCompressor`는 오디오의 **다이내믹 레인지(Dynamic Range)**, 즉 가장 조용한 소리와 가장 큰 소리 사이의 **차이를 줄이는 데** 사용되는 **오디오 이펙트**입니다. 이 컴프레서는 작은 소리는 상대적으로 키우고, 큰 소리는 줄여서 전체 소리를 더 **일관되고 듣기 쉽게** 만듭니다.

## 역할: DynamicRangeCompressor란?

* 소리가 너무 크면 자동으로 줄여주고, 너무 작으면 상대적으로 키워줌
* 방송, 팟캐스트, 보컬 믹싱, 마스터링 등 다양한 분야에서 사용
* AudioKit의 `DynamicRangeCompressor`는 실시간으로 이 처리를 수행

## 주요 파라미터 설명

| 파라미터 이름           | 기본값   | 범위                  | 의미                               |
| ----------------- | ----- | ------------------- | -------------------------------- |
| `ratio`           | `1.0` | `0.01 ... 100.0`    | 압축 비율 (압축 강도)                    |
| `threshold`       | `0.0` | `-100.0 ... 0.0` dB | 압축이 시작되는 기준 레벨                   |
| `attackDuration`  | `0.1` | `0.0 ... 1.0` sec   | 소리가 커졌을 때 **얼마나 빠르게** 압축을 시작할지   |
| `releaseDuration` | `0.1` | `0.0 ... 1.0` sec   | 소리가 다시 작아졌을 때 **얼마나 천천히** 압축을 풀지 |

## 파라미터 상세 설명

### 1. Ratio (비율)

* **압축 비율**: 입력이 threshold를 넘었을 때 얼마나 줄일지
* 예: `ratio = 4.0` → threshold보다 4dB 큰 입력이 들어오면 출력은 1dB만 증가 (`4:1`)
  * 참고: 1(1:1)은 압축 없음, 100.0(∞:1)은 리미터처럼 작동

* **값이 클수록 압축이 강해짐**

| Ratio   | 효과             |
| ------- | -------------- |
| 1.0     | 압축 없음          |
| 2.0     | 부드러운 압축        |
| 10.0 이상 | 리미터에 가까운 강한 압축 |

### 2. Threshold (임계값)

* 몇 dB 이상부터 압축을 적용할지 설정
* 예: `threshold = -20.0` → 입력 레벨이 -20dB보다 크면 압축 시작
* 일반적으로 보컬: -12dB \~ -24dB 권장

### 3. Attack Duration (공격 시간)

* **압축 시작까지의 시간 지연**
* 짧으면 소리의 순간적인 피크도 줄이고, 길면 어택(강조되는 처음 부분)을 살림

| 값           | 설명            |
| ----------- | ------------- |
| 0.01\~0.05초 | 매우 빠름 (피크 억제) |
| 0.1초 이상     | 느림 (자연스러움)    |

### 4. Release Duration (해제 시간)

* **입력이 threshold 아래로 떨어졌을 때**, 압축을 완전히 해제하기까지의 시간
* 짧으면 빠르게 원래대로, 길면 부드러운 복원

## 사용 예시

* 보컬 다이내믹 정리:

  * `threshold = -20`, `ratio = 3`, `attack = 0.05`, `release = 0.3`
* 마스터링 전체 트랙:

  * `threshold = -10`, `ratio = 1.5`, `attack = 0.1`, `release = 0.5`

## 요약

| 파라미터              | 설명               |
| ----------------- | ---------------- |
| `ratio`           | 출력 레벨을 얼마나 압축할지  |
| `threshold`       | 압축을 시작할 기준 입력 레벨 |
| `attackDuration`  | 압축 시작까지의 시간      |
| `releaseDuration` | 압축 해제까지 걸리는 시간   |

`DynamicRangeCompressor`는 음원의 불균형을 다듬고, 더 프로페셔널한 사운드를 만들어주는 핵심 도구입니다. AudioKit에서는 이 파라미터들을 실시간으로 조절하여 효과를 직관적으로 확인할 수 있습니다.
