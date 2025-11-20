---
title: "Swift: AVAudioSession.interruptionNotification 처리 (사운드 재생 중 전화벨, 알람 등이 울렸을 때 처리)"
date: 2022-07-19
categories: 
  - "DevLog"
  - "Swift"
---

## 사용 상황

 **Swift: AVAudioSession.interruptionNotification 처리 (사운드 재생 중 전화벨, 알람 등이 울렸을 때 처리)**

사운드 재생 중 전화벨, 알람 등이 울렸을 때 해야 될 작업은 어떻게 처리할까요? 

## 방법

뷰 컨트롤러에 아래 코드를 추가합니다.

```swift
import UIKit
import AVFAudio

class MainTabBarController: UITabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // NotificationCenter 옵저버 등록
        NotificationCenter.default.addObserver(self, selector: #selector(didInterrupted), name: AVAudioSession.interruptionNotification, object: AVAudioSession.sharedInstance())
    }
    
    @objc func didInterrupted(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let typeKeyRaw = userInfo[AVAudioSessionInterruptionTypeKey],
              let typeKey = AVAudioSession.InterruptionType(rawValue: typeKeyRaw as! UInt) else {
            simpleAlert(self, message: "typeKey is nil")
            return
        }
        
        if typeKey == .began {
            // .began: 전화, 알람 등의 외부 사운드가 발생하기 시작했을 때 할 작업 처리
        } else {
            // .ended: 전화, 알람 등의 사운드가 끝났을 때 할 작업 처리
        }
    }
}

```
