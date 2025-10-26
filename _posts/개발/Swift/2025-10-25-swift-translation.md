---
title: "SwiftUI: 번역 기능 (Translation) 사용하기 (iOS 18 이상)"
author: ayaysir
date: 2025-10-25 01:59:00 +0900
categories: 
  - "DevLog"
  - "SwiftUI"
tags: [SwiftUI]
---

iOS `Translation` 프레임워크는 iOS 17.4부터 도입된 기능으로, 개발자가 앱 내에 텍스트 번역 기능을 쉽게 통합할 수 있도록 애플이 제공하는 API입니다. 특히 iOS 18에서는 이 기능이 더욱 발전하여, 시스템에서 제공하는 내장 UI를 활용하거나 TranslationSession을 이용해 커스텀된 번역 기능을 구현할 수 있게 되었습니다. 


## 주요 특징
 - 온디바이스 번역: 번역에 필요한 머신러닝 모델이 기기 내에서 실행되므로, 인터넷 연결 없이도 빠르고 안전하게 번역할 수 있습니다.
 - 시스템 통합: 사용자가 번역 모델을 다운로드하도록 권한을 요청하고, 다운로드 진행 상황을 표시하는 등 번역에 필요한 모든 과정을 시스템이 관리합니다.
 - 공유 모델: 한번 다운로드된 언어 모델은 시스템의 모든 앱이 공유하므로, 여러 앱에서 중복해서 다운로드할 필요가 없습니다.
 - 개인정보 보호: 번역이 기기 내에서 처리되기 때문에 개인 정보가 보호됩니다. 

## 사용 방법
Translation 프레임워크는 크게 두 가지 방식으로 사용할 수 있습니다.

### 1. 내장 UI 활용

가장 간단한 방법으로, .translationPresentation 뷰 수정자를 사용해 시스템이 제공하는 번역 오버레이를 표시할 수 있습니다. 

SwiftUI 예시: 
```swift
import SwiftUI
import Translation // 👈

struct ContentView: View {
  @State private var textToTranslate = "Translationフレームワークは大きく二つの方式で使用できます。"
  @State private var showTranslation = false

  var body: some View {
    VStack {
      Text(textToTranslate)
      Button("번역하기") {
        showTranslation.toggle()
      }
    }
    .translationPresentation(isPresented: $showTranslation, text: textToTranslate) // 👈
  }
}
```

![Swift Translation 1](/assets/img/DevLog/swift-translation-1.jpg)

뒤에 클로저(replacementAction)를 추가하면 번역 창에서 '번역으로 대치'라는 메뉴가 생기며 이 메뉴를 눌렀을 때 할 작업을 지정할 수 있습니다.

```swift
.translationPresentation(isPresented: $showTranslation, text: textToTranslate) { result in
  // replacement action 핸들러
  textToTranslate = result
}
```

![번역으로 대치](/assets/img/DevLog/번역으로대치%20Oct-25-2025%2015-20-12.gif)


### 2. translationTask를 이용한 커스텀 구현 (上) - 시작시 바로 실행

더 세밀한 제어가 필요하다면 `translationTask` 를 사용해 직접 번역을 요청하고 결과를 처리할 수 있습니다.
 - `source`, `target` 언어가 `nil`이면 소스 언어를 자동으로 감지하며, 타깃 언어를 현재 OS 에서 사용중인 언어(예: 한국어)를 제공합니다.
 - `translationTask`의 action 클로저는 뷰가 초기화되면 자동으로 실행됩니다. 
   > `action`: A closure that runs when the view first appears, and when source or target change. It provides a TranslationSession instance to perform one or multiple translations. (뷰가 처음 나타날 때, 그리고 소스나 대상이 변경될 때 실행되는 클로저입니다. 하나 이상의 번역을 수행하기 위한 TranslationSession 인스턴스를 제공합니다.) 
 - translationTask를 이용한 번역을 이용하려면 기기에 시작, 번역 언어의 데이터가 다운로드 되어있어야 합니다. 다운로드 되어있지 않은 경우 아래처럼 다운로드를 수행하는 시트가 나타납니다.
   ![로컬에 언어 데이터가 다운로드 되어있어야 함](/assets/img/DevLog/swift-translationtask-1.jpg)


SwiftUI 예시:
```swift
import SwiftUI
import Translation

struct CustomTranslationView: View {
  var sourceTexts = [
    "Translationフレームワークは大きく二つの方式で使用できます。",
    "Explore the warehouse and watch our consolidation processes in action, where everything is carefully organized to keep operations running smoothly.",
    "本機能は、プロデュース方針を決める事で、ゲーム内の様々な場面で、効率よくプロデュースを進める事ができるようになる機能です。",
    "And of course, we couldn’t resist a quick stop at the sky bar, where work meets a moment of relaxation.",
    "プロデュース方針は場数ptを使って設定する事ができ、自分のプレイスタイルに合わせたカスタマイズが可能です。"
  ]
  var sourceLanguage: Locale.Language?
  var targetLanguage: Locale.Language?
  
  @State private var translatedText = ""
  
  var body: some View {
    if #available(iOS 18.0, *) {
      Text(translatedText)
        .translationTask(
          source: sourceLanguage,
          target: targetLanguage
        ) { session in
          Task { @MainActor in
            for sourceText in sourceTexts {
              let response = try await session.translate(sourceText)
              translatedText += "\(response.targetText)\n"
            }
          }
        }
    } else {
      Text("Need iOS 18.0 or later")
    }
  }
}
```

![Translation Task 1](/assets/img/DevLog/Translationn2%20Oct-25-2025%2020-52-14.gif)

### 3. translationTask를 이용한 커스텀 구현 (下) - configuration 을 trigger하여 실행

`translationTask`에 `configuration`을 설정한 뒤 특정 요건을 만족하면 트리거되면서 번역 작업을 시작합니다.
- `TranslationSession.Configuration` 이 `nil` 상태였다가 초기화합니다.
- 동일한 source/target 언어에서 `invalidate()`를 실행합니다.
  - 해당 방법을 사용하여 여러번 translationTask를 소환하는 방법에 대한 [깃허브 코드 예제](https://github.com/ayaysir/Swift-Playgrounds/blob/a679d5b074f9faebf552a627f53b24cc1d1a9de7/SwiftPM/study-Translation.swiftpm/CustomTranslationAdvancedView.swift)
- 또는 source/target 언어가 변경된 경우 `action` 클로저가 트리거됩니다.

```swift
import SwiftUI
import Translation

@available(iOS 18.0, *)
struct CustomTranslationTriggerStartView: View {
  var sourceTexts = [
    "Translationフレームワークは大きく二つの方式で使用できます。",
    "Explore the warehouse and watch our consolidation processes in action, where everything is carefully organized to keep operations running smoothly.",
    "本機能は、プロデュース方針を決める事で、ゲーム内の様々な場面で、効率よくプロデュースを進める事ができるようになる機能です。",
    "And of course, we couldn’t resist a quick stop at the sky bar, where work meets a moment of relaxation.",
    "プロデュース方針は場数ptを使って設定する事ができ、自分のプレイスタイルに合わせたカスタマイズが可能です。"
  ]

  @State private var translatedTexts = [String](repeating: "", count: 5)
  @State private var isTranslating = false
  @State private var selectedLanguageCode = "ko-KR"
  @State private var lastTranslatedLanguageCode = ""

  // 구성 객체: 버튼으로 할당하면 translationTask에서 세션을 받음
  @State private var configuration: TranslationSession.Configuration?

  var body: some View {
    VStack(spacing: 16) {
      HStack {
        Text("Select target language:")
        Picker("Select target language", selection: $selectedLanguageCode) {
          Text("ko-KR")
            .tag("ko-KR")
          Text("ja-JP")
            .tag("ja-JP")
          Text("en-US")
            .tag("en-US")
        }
      }
      
      List {
        ForEach(sourceTexts.indices, id: \.self) { i in
          VStack(alignment: .leading) {
            Text(sourceTexts[i])
            Text(translatedTexts[i])
              .foregroundStyle(.gray)
          }
        }
      }

      HStack {
          Button {
            let targetLanguage = Locale.Language(identifier: selectedLanguageCode)
            // 여기서 configruation 트리거
            // source, target 언어가 동일하면 트리거가 안됨 => configuration.invalidate()를 사용하여 재트리거
            // 둘 중 하나가 이전과 다르면 재 트리거됨
            configuration = TranslationSession.Configuration(
              source: nil,
              target: targetLanguage
            )
          } label: {
            HStack {
              if isTranslating {
                ProgressView().scaleEffect(0.7)
              }
              let buttonText = selectedLanguageCode == lastTranslatedLanguageCode ? "\(lastTranslatedLanguageCode) 번역 완료" : "번역 시작"
              Text(isTranslating ? "번역 중..." : buttonText)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.accentColor.opacity(0.1))
            .cornerRadius(8)
          }
          .disabled(selectedLanguageCode == lastTranslatedLanguageCode)
        }
        .padding()
        // translationTask 수식어: configuration이 설정되면 closure로 session을 받습니다.
        .translationTask(configuration) { session in
          // 세션 제공 시에 배치 번역 실행
          Task {
            await MainActor.run {
              translatedTexts = .init(repeating: "", count: 5)
              isTranslating = true
            }

            for i in sourceTexts.indices {
              let response = try? await session.translate(sourceTexts[i])
              translatedTexts[i] = response?.targetText ?? sourceTexts[i]
            }
            
            // 번역 완료되면 상태 업데이트
            await MainActor.run {
              isTranslating = false
              lastTranslatedLanguageCode = selectedLanguageCode
            }
          }
        }
    }
  }
}
```

![Translation Task 2](/assets/img/DevLog/Translation3%20Oct-25-2025%2021-00-03.gif)

## 지원 범위
- OS: iOS 17.4 이상, iPadOS 17.4 이상, macOS 14.4 이상 (대부분의 API는 iOS 18, iPadOS 18, macOS 15부터 SwiftUI 환경에서 사용 가능).
- Xcode: Xcode 16 이상. 