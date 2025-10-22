---
title: "Swift UIKit, SwiftUI: AVPlayerViewController에서 재생중인 비디오의 강제 풀스크린 전환 및 반복 재생"
date: 2024-06-20
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

`AVPlayerViewController`는 처음에 풀 스크린으로 바로 시작할 수 없는 옵션도 없고, 반복 재생 옵션도 없습니다. `AVPlayerViewController`에서 강제 풀스크린 전환 및 반복 재생하는 방법입니다.

포스트 하단에 SwiftUI를 위한 `UIViewControllerRepresentable`을 첨부합니다.

 

#### **시작시 강제 풀스크린 전환**

```
let controller = AVPlayerViewController()
let player = AVPlayer(url: url)
controller.player = player

let selectorToForceFullScreenMode = NSSelectorFromString("_transitionToFullScreenAnimated:interactive:completionHandler:")

player.play()

// 강제 풀스크린 전환
// asyncAfter는 전체화면에서 컨트롤 요소가 나오지 않을 떄에만 사용
DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(10)) {
    if controller.responds(to: selectorToForceFullScreenMode) {
        controller.perform(selectorToForceFullScreenMode, with: true, with: nil)
        
    }
}

// parentVC.present(...)로 AVPlayerViewController 나오게 하기
```

- 내부 메서드를 셀렉터 함수 형태로 추가합니다.
- 해당 셀렉터 함수를 강제적으로 실행시켜 컨트롤러가 나올 때 자동으로 풀스크린 모드가 되도록 합니다.
    - 만약 풀스크린 모드에서 컨트롤 요소가 나오지 않는 경우 `asyncAfter`로 약간 늦게 실행되도록 합니다.

 

<iframe width="250" height="480" src="https://giphy.com/embed/NhamDntUvmFrKNnOpi" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

#### **반복(Loop) 재생**

```
func loopVideo() {
    NotificationCenter.default.removeObserver(self, name: AVPlayerItem.didPlayToEndTimeNotification, object: nil)
    
    // Be sure to specify the object as the AVPlayer's player item if you have multiple players. https://stackoverflow.com/a/40396824
    NotificationCenter.default.addObserver(forName: AVPlayerItem.didPlayToEndTimeNotification, object: self.player.currentItem, queue: .main) { _ in
        player.seek(to: CMTime.zero)
        player.play()
    }
}

// ... //
player.play()
loopVideo()
// ... //
```

- `NotificationCenter`를 이용해 비디오의 플레이가 끝나면 자동으로 시작점으로 되돌린 후 다시 재생되도록 합니다.

 

 

#### **SwiftUI Representable 코드**

```
//
//  FullScreenVideoPlayer.swift
//  study-WidgetExample
//
//  Created by 윤범태 on 6/20/24.
//

import SwiftUI
import AVKit

struct FullScreenVideoPlayerRepresentedView: UIViewControllerRepresentable {
    let url: URL
    let player = AVPlayer()
    
    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        controller.player = player
        
        player.replaceCurrentItem(with: .init(url: url))
        
        let selectorToForceFullScreenMode = NSSelectorFromString("_transitionToFullScreenAnimated:interactive:completionHandler:")
        
        player.play()
        loopVideo()
        
        // 강제 풀스크린 전환
        // asyncAfter는 전체화면에서 컨트롤 요소가 나오지 않을 떄에만 사용
        DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(10)) {
            if controller.responds(to: selectorToForceFullScreenMode) {
                controller.perform(selectorToForceFullScreenMode, with: true, with: nil)
            }
        }
        
        return controller
    }
    
    func updateUIViewController(_ uiViewController: AVPlayerViewController, context: Context) {
    }
    
    func loopVideo() {
        NotificationCenter.default.removeObserver(self, name: AVPlayerItem.didPlayToEndTimeNotification, object: nil)
        
        // Be sure to specify the object as the AVPlayer's player item if you have multiple players. https://stackoverflow.com/a/40396824
        NotificationCenter.default.addObserver(forName: AVPlayerItem.didPlayToEndTimeNotification, object: self.player.currentItem, queue: .main) { _ in
            player.seek(to: CMTime.zero)
            player.play()
        }
    }
}

#Preview {
    FullScreenVideoPlayerRepresentedView(url: URL(string: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4")!)
}

```

##### **출처**

- 풀스크린: [https://stackoverflow.com/a/51618451](https://stackoverflow.com/a/51618451)
- 반복: [https://stackoverflow.com/questions/27808266/how-do-you-loop-avplayer-in-swift](https://stackoverflow.com/questions/27808266/how-do-you-loop-avplayer-in-swift)
