---
title: "Swift: @retroactive 란?"
date: 2025-06-15
categories: 
  - "DevLog"
  - "Swift"
---

## Retroactive 란?

> 영어 시전에서 retroactive의 뜻: (=retrospective) 소급 적용되는, 회상하는

해당 경고는 Swift에서 **retroactive conformance**(기존 타입에 프로토콜을 채택시키는 것)를 사용할 때 나타나는 것으로, 나중에 AudioKit 라이브러리 자체에서 NodeParameter에 Hashable을 추가하게 되면 **중복 충돌**이 발생할 수 있음을 경고합니다.

### 에러 메시지의 예

> Extension declares a conformance of imported type 'AVAudioUnitReverbPreset' to imported protocol 'CaseIterable'; this will not behave correctly if the owners of 'AVFAudio' introduce this conformance in the future.<br><i>확장 기능은 가져온 프로토콜 'CaseIterable'에 대한 가져온 유형 'AVAudioUnitReverbPreset'의 적합성을 선언합니다. 이는 'AVFAudio' 소유자가 향후 이 적합성(내가 새로 준수conform하려고 한 프로토콜)을 도입하는 경우 올바르게 작동하지 않습니다.</i><br><br>Add '@retroactive' to silence this warning<br><i>`@retroactive`를 추가하여 경고 무시</i>

## 문제 발생의 예시 코드

```swift
import AudioKit

extension NodeParameter: Hashable {
  public func hash(into hasher: inout Hasher) {
    // 구현
  }

  public static func == (lhs: NodeParameter, rhs: NodeParameter) -> Bool {
    // 구현
  }
}
```

이미 존재하는 NodeParameter에서 해당 타입의 개발자는 Hashable을 구현하지 않은 상태입니다. 여기서 이 프레임워크를 사용하는 임의의 개발자가 Hashable을 준수하도록 하는 확장을 추가할 경우 위와 같은 경고가 발생합니다.


## 해결 방법

경고를 무시하겠다는 의도를 명시하려면 @retroactive를 추가합니다:

```swift
@retroactive extension NodeParameter: Hashable {
  public func hash(into hasher: inout Hasher) {
    // 구현
  }

  public static func == (lhs: NodeParameter, rhs: NodeParameter) -> Bool {
    // 구현
  }
}
```

 

## 경고를 무시해도 괜찮은가?

- **괜찮은 경우**: 해당 라이브러리를 **직접 컨트롤하고 있고**, 라이브러리 업데이트 시 이 부분을 **체크할 수 있다면** 사용해도 됩니다.
- **권장되지 않는 경우**: 라이브러리를 자주 업데이트하거나 오픈소스 라이브러리를 사용할 때는 **이 방식이 깨질 수 있으므로 위험**할 수 있습니다.

 

### 대안: 별도의 타입으로 래핑

필요하다면 NodeParameter을 래핑한 별도의 타입을 만들어 안전하게 Hashable을 채택하는 것도 대안입니다.

```swift
struct NodeParameterWrapper: Hashable {
  let parameter: NodeParameter

  func hash(into hasher: inout Hasher) {
    // 원하는 기준으로 hash 처리
  }

  static func == (lhs: NodeParameterWrapper, rhs: NodeParameterWrapper) -> Bool {
    // 원하는 기준으로 비교
  }
}
```

이 방법은 미래 충돌을 피할 수 있는 **더 안전한 선택지**입니다.

## 중복으로 프로토콜 준수 시 어떤 문제가 발생?

`@retroactive`를 사용해 외부에서 정의된 타입(`NodeParameter`)에 외부 프로토콜(`Hashable`)을 채택시킨 경우, 해당 라이브러리(예: AudioKit)에서 나중에 **자체적으로 NodeParameter에 Hashable을 채택하게 되면** 다음과 같은 일이 발생할 수 있습니다:

### 중복된 프로토콜 채택으로 인한 컴파일 오류 발생

Swift는 동일한 타입이 **여러 모듈에서 동일한 프로토콜을 채택**하면 **충돌이 발생했다는 컴파일 오류**를 발생시킵니다. 이 상황은 특히 @retroactive를 사용하여 **내가 직접 Hashable 채택을 선언한 경우** 문제가 됩니다.

#### 예시 시나리오

- 현재: NodeParameter는 AudioKit에서는 Hashable을 채택하지 않음 → 내가 임의로 @retroactive를 사용해 채택함 → 문제 없음
- 미래: AudioKit이 업데이트되며 NodeParameter: Hashable 선언이 생김
- 결과: **내 선언과 AudioKit의 선언이 충돌** → 컴파일 에러 발생 ('NodeParameter' already conforms to protocol 'Hashable')

 

#### 해결 방법

#### 1. 라이브러리에서 공식적으로 채택한 후에는 내 선언을 제거해야 합니다.
 - @retroactive로 채택한 코드를 삭제하면 충돌이 사라집니다.
 - 이후엔 라이브러리의 공식 채택을 그대로 사용하면 됩니다.
#### 2. 가능하면 @retroactive 대신 타입 래핑을 고려하세요.
 - 예: struct MyNodeParameter: Hashable { let base: NodeParameter }
 - 안전한 방법이지만 코드가 다소 복잡해집니다.

 

## 요약

`@retroactive`는 편리하지만 **라이브러리 업데이트에 매우 민감한 선택**입니다. 라이브러리에서 해당 채택을 직접 제공하게 되면 **당신의 선언과 충돌하게 되며, 코드를 수정해야만 컴파일이 가능합니다.** 가능한 경우 타입 래핑 같은 대체 방식을 고려하는 것이 좋습니다. 

<!--[rcblock id="6686"]-->
