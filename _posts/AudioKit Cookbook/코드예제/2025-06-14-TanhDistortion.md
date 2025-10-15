---
title: AudioKit의 TanhDistortion
author: ayaysir
date: 2025-06-14 14:54:09 +0900
categories: [StudyLog, AudioKit]
tags: [AudioKit, 음향이론]
---

# Tanh Distortion

이 코드는 **AudioKit**의 `TanhDistortion`을 이용한 오디오 왜곡 효과를 적용하는 Swift 클래스입니다. 이름 그대로 `tanh()` (쌍곡 탄젠트) 함수를 활용한 디스토션 알고리즘으로, **부드럽지만 강한** 왜곡을 줄 수 있습니다.

---

## 🔧 클래스 설명: `TanhDistortionConductor`

### ✅ 상속

* `BasicEffectConductor<TanhDistortion>`: 커스텀 효과를 공통적으로 다루는 기본 클래스에서 상속.
* `<TanhDistortion>` 제네릭을 통해 AudioKit의 디스토션 노드를 지정.

---

## 🎛 파라미터 설명

| 파라미터 명칭                      | 기본값   | 범위             | 설명                            |
| ---------------------------- | ----- | -------------- | ----------------------------- |
| **Pregain**                  | `2.0` | `0.0...10.0`   | 입력 신호에 곱해지는 값. 클수록 강한 디스토션 발생 |
| **Postgain**                 | `0.5` | `0.0...10.0`   | 디스토션 후의 볼륨 조절. 출력 크기를 조정      |
| **Positive Shape Parameter** | `0.0` | `-10.0...10.0` | 양수 영역의 왜곡 곡률 조정               |
| **Negative Shape Parameter** | `0.0` | `-10.0...10.0` | 음수 영역의 왜곡 곡률 조정               |

---

## 🎧 TanhDistortion이란?

* 수학 함수 `tanh(x)`를 통해 입력을 부드럽게 압축 → **클리핑 없이 부드러운 디스토션** 제공
* 사인파처럼 완만하게 왜곡되어 하드 클리핑보다 **더 음악적인 결과**를 냄
* 양/음수 각각의 비선형성 조절 가능 → 다양한 톤 설계 가능

---

`tanh(x)`는 **쌍곡 탄젠트 함수(hyperbolic tangent function)** 로, 수학적 정의는 다음과 같습니다:

---

## 📐 정의

$$
	anh(x) = rac{\sinh(x)}{