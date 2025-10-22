---
title: "SwiftUI 예제: 아이폰 손전등(Flashlight) 만들기 (카메라 플래시 + 화면 밝기 강제 조정 및 복구)"
date: 2023-08-08
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

아이폰 손전등에는 다음 3가지 기능이 필요합니다.

1. 아이폰 후면 카메라에 달려있는 플래시(Swift에서는 `torch`라고 함)의 밝기 조절 ![](./assets/img/wp-content/uploads/2023/08/how-to-turn-on-camera-flash-on-iphone.jpg)
2. (옵션) 디스플레이 전면의 화면 밝기 조정
3. (옵션) `scenePhase`를 통한 백그라운드 시 화면 밝기 원래대로 돌려놓기

 

모든 기능은 실제 아이폰 기기에서만 실행할 수 있습니다.

> **참고)** 손전등 앱(정확히 말하면 손전등 기능만 있는 앱)은 최신 [앱 스토어 심사 지침](https://developer.apple.com/kr/app-store/review/guidelines#spam)에서 스팸 앱으로 분류됩니다.
> 
> ![](./assets/img/wp-content/uploads/2023/08/스크린샷-2023-08-09-오전-12.13.55-복사본.jpg)

 

#### **방법**

##### **1\. 플래시 켜기 및 밝기 조절**

```
import AVFoundation

private func setTorch(_ torchBrightness: Float) {
    guard let device = AVCaptureDevice.default(for: .video), device.hasTorch else {
        return
    }
    
    do {
        try device.lockForConfiguration()
        try device.setTorchModeOn(level: torchBrightness)
        // 참고: 플래시 끄기
        // device.torchMode = .off
        device.unlockForConfiguration()
    } catch {
        print(#function, error.localizedDescription)
    }
}
```

 

##### **2\. (옵션) 디스플레이 전면의 화면 밝기 조정**

```
private func setBrightness(_ displayBrightness: CGFloat) {
    UIScreen.main.brightness = displayBrightness
}
```

 

##### **3\. (옵션) scenePhase를 통한 백그라운드 시 화면 밝기 원래대로 돌려놓기**

앱을 켜면 화면 밝기가 최대가 되어도 앱을 끄거나 백그라운드 모드로 나가면 앱을 실행하기 이전의 화면 밝기로 되돌아가야 합니다.

앱의 상태는 `scenePhase`로 감지할 수 있습니다.

```
@Environment(\.scenePhase) var scenePhase

// ... //

.onChange(of: scenePhase) { scenePhase in
    switch scenePhase {
    case .background:
        print("App is in background")
    case .inactive:
        print("App is inactive")
    case .active:
        // print("App is active")
    @unknown default:
        break
    }
}
```

앱이 활성화된 단계(`active`)에서 화면 밝기 값을 미리 저장해놓고, 앱이 백그라운드 모드가 되면(`background`) 미리 저장했던 밝기값으로 되돌려 놓습니다. (전체 코드의 `outsideDisplayBrightness` 상태 변수 참고)

 

#### **전체 코드**

`Swift Playground App` 프로젝트를 생성한 뒤 `ContentView`를 아래와 같이 채웁니다.

```
import SwiftUI
import AVFoundation

struct ContentView: View {
    private let DEBUG_MODE: Bool = false
    
    @Environment(\.scenePhase) var scenePhase
    @State var outsideDisplayBrightness: CGFloat = 0.5
    @State var displayBrightness: CGFloat = 1.0 {
        didSet {
            guard displayBrightness <= 1 && displayBrightness >= 0 else {
                return
            }
    
            setBrightness(displayBrightness)
        }
    }
    
    @State var torchBrightness: Float = 1.0 {
        didSet {
            guard torchBrightness <= 1.0  else {
                torchBrightness = 1.0
                return
            }
            
            guard torchBrightness >= 0.0 else {
                torchBrightness = 0.01 // 0.0은 에러발생
                return
            }
            
            setTorch(torchBrightness)
        }
    }
    
    private func setBrightness(_ displayBrightness: CGFloat) {
        UIScreen.main.brightness = displayBrightness
    }
    
    private func setTorch(_ torchBrightness: Float) {
        guard let device = AVCaptureDevice.default(for: .video), device.hasTorch else {
            return
        }
        
        do {
            try device.lockForConfiguration()
            try device.setTorchModeOn(level: torchBrightness)
            // 참고: 플래시 끄기
            // device.torchMode = .off
            device.unlockForConfiguration()
        } catch {
            print(#function, error.localizedDescription)
        }
    }
    
    var body: some View {
        HStack(spacing: 0) {
            VStack(spacing: 0) {
                Rectangle()
                    .fill(DEBUG_MODE ? .cyan : .white)
                    .onTapGesture {
                        displayBrightness += 0.1
                    }
                Rectangle()
                    .onTapGesture {
                        displayBrightness -= 0.1
                    }
            }
            VStack(spacing: 0) {
                Rectangle()
                    .onTapGesture {
                        torchBrightness += 0.1
                    }
                Rectangle()
                    .fill(DEBUG_MODE ? .cyan : .white)
                    .onTapGesture {
                        torchBrightness -= 0.1
                    }
            }
        }
        .foregroundColor(.white)
        .ignoresSafeArea()
        .onChange(of: scenePhase) { scenePhase in
            switch scenePhase {
            case .background:
                break
            case .inactive:
                setBrightness(outsideDisplayBrightness)
                // 플래시(torch)는 저절로 꺼지기 때문에 굳이 코드로 넣지 않음
            case .active:
                outsideDisplayBrightness = UIScreen.main.brightness
                setTorch(torchBrightness)
                setBrightness(displayBrightness)
            @unknown default:
                break
            }
        }
    }
}

```

 

아이폰 화면에서 왼쪽 상하 부분을 누르면 화면 밝기가 조절되고, 오른쪽 상하 부분을 누르면 플래시 밝기가 조절됩니다.
