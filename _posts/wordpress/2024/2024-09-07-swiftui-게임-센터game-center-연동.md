---
title: "SwiftUI: 게임 센터(Game Center) 연동"
date: 2024-09-07
categories: 
  - "DevLog"
  - "SwiftUI"
---

### **소개**

iOS 프로젝트에서 Game Center를 연동하려면 몇 가지 단계를 거쳐야 합니다. Game Center는 애플의 게임 서비스로, 멀티플레이어 매치메이킹, 리더보드, 도전 과제 등을 제공합니다. 아래는 SwiftUI로 iOS 프로젝트에서 Game Center를 연동하는 방법에 대한 자세한 설명입니다.

 

### **1\. Game Center 설정 준비**

1. **Apple Developer 계정 준비:** [Apple Developer 계정](https://developer.apple.com/)에 가입하고 필요한 설정을 완료합니다.
2. **App ID 생성:** Apple Developer 계정에서 `App ID`를 생성하고, Game Center 기능을 활성화합니다.
3. **프로비저닝 프로파일 생성:** `Provisioning Profile`을 생성하고 App ID와 연결합니다. 이 프로파일을 Xcode에서 사용해야 합니다.

 

### **2\. Xcode에서 Game Center 설정**

1. **프로젝트 설정:** Xcode에서 프로젝트를 열고, 타겟의 `Signing & Capabilities` 탭에서 `+ Capability` 버튼을 클릭한 후 `Game Center`를 추가합니다.
2. **Game Center 설정 확인:** `Game Center` 설정이 제대로 활성화되었는지 확인합니다.

 

 ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-07-pm-8.24.23.jpg)

 

### **3\. App Store Connect에서 업적 추가**

먼저 Apple Developer 계정에서 Game Center에 업적을 추가해야 합니다.

1. **App Store Connect 로그인:**
    - [App Store Connect](https://appstoreconnect.apple.com/)에 로그인합니다.
2. **게임 추가:**
    - 왼쪽 메뉴에서 **앱** 를 클릭한 후, **상단 \[+\] 버튼 > 새 신규 앱...** 을 선택하여 새로운 앱(게임)을 추가합니다.
    - 이미 추가된 게임이 있다면 해당 게임을 선택합니다.
3. **Game Center 설정:**
    - 앱 설정 페이지의 좌측 메뉴에서 **성장 및 마케팅 > Game Center** 탭으로 이동합니다.
    - **순위표** 또는 **목표 달성** 섹션으로 이동하여 **\[+\]** 버튼을 클릭합니다.
4. **업적 세부 사항 입력:**
    - 업적 ID, 이름, 설명, 포인트(점수), 이미지 등을 입력합니다.
    - **저장(Save)** 버튼을 클릭하여 업적을 저장합니다.
    - 현지화는 1개 언어 이상 필수로 작성해야 합니다.

\[caption id="attachment\_6813" align="alignnone" width="799"\] ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-07-pm-8.37.39-copy.jpg) 순위표 또는 목표 달성 추가 및 관리\[/caption\]

 

\[caption id="attachment\_6814" align="alignnone" width="837"\] ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-07-pm-8.37.59-copy.jpg) 정보 입력\[/caption\]

 

### **4\. SwiftUI에서 Game Center 연동**

#### **1\. GameKit 프레임워크 가져오기**

먼저 `GameKit` 프레임워크를 가져와야 합니다. 이를 위해 사용할 Swift 파일 상단에 다음과 같이 추가합니다.

```
import GameKit
```

 

#### **2\. Game Center 인증 처리**

사용자가 Game Center에 로그인하도록 인증 프로세스를 구현해야 합니다. SwiftUI에서 인증 뷰를 제공하려면 아래와 같이 `GameCenterViewModel`을 만들 수 있습니다.

```
class GameCenterViewModel: ObservableObject {
  @Published var isAuthenticated = false
  
  func authenticateUser() {
    let localPlayer = GKLocalPlayer.local
    
    localPlayer.authenticateHandler = { viewController, error in
      if let viewController = viewController {
        // 로그인 뷰를 표시해야 할 경우
        UIApplication.shared.windows.first?.rootViewController?.present(viewController, animated: true, completion: nil)
      } else if localPlayer.isAuthenticated {
        // 인증이 성공한 경우
        DispatchQueue.main.async {
          self.isAuthenticated = true
        }
      } else {
        // 인증 실패 처리
        print("Game Center 인증 실패: \(error?.localizedDescription ?? "알 수 없는 오류")")
      }
    }
  }

  ...

}
```

 

#### **3\. SwiftUI View에서 인증 처리**

`GameCenterViewModel`을 사용하여 Game Center에 사용자를 인증하는 과정을 SwiftUI 뷰에 추가할 수 있습니다.

```
import SwiftUI

struct ContentView: View {
  @StateObject private var gameCenterViewModel = GameCenterViewModel()
  
  var body: some View {
    VStack {
      if gameCenterViewModel.isAuthenticated {
        Text("Game Center 인증 성공")
        
        ...
      }
    }
    .onAppear {
      gameCenterViewModel.authenticateUser()
    }
  }
}
```

 

#### **4\. 리더보드 및 도전 과제 구현**

Game Center의 리더보드나 도전 과제를 사용하려면, 인증된 후 사용자의 점수를 보고하거나 도전 과제를 달성하는 등의 추가 코드를 작성해야 합니다.

다음 함수들을 뷰모델 등 적당한 곳에 추가합니다.

##### **리더보드에 점수 보고 예제:**

```
/// 리더보드에 점수 제출
func reportScore(leaderboardID: String, score: Int) {
  GKLeaderboard.submitScore(
    score,
    context: 0,
    player: GKLocalPlayer.local,
    leaderboardIDs: [leaderboardID]) { error in
      if let error {
        print(error)
      }
      
      print("리더보드에 점수가 성공적으로 업데이트 되었습니다.")
    }
}
```

 

##### **도전 과제 구현 예제:**

```
@Published var achievements = [GKAchievement]()

/// Game Center에서 업적 로드
func loadAchievements() {
  GKAchievement.loadAchievements { [weak self] achievements, error in
    if let error {
      print("업적을 로드하는 동안 오류 발생: \(error.localizedDescription)")
      return
    }
    
    DispatchQueue.main.async {
      self?.achievements = achievements ?? []
    }
  }
}

/// 업적 달성 보고
func reportAchievement(identifier: String, percentComplete: Double) {
  let achievement = GKAchievement(identifier: identifier)
  achievement.percentComplete = percentComplete
  achievement.showsCompletionBanner = true
  
  GKAchievement.report([achievement]) { error in
    if let error {
      print("업적 보고 실패: \(error.localizedDescription)")
      return
    }
    
    print("업적이 성공적으로 보고되었습니다.")
  }
}
```

 

위 함수들을 `GameCenterViewModel`에 추가한 뒤, 뷰에서 표시하는 방법은 다음과 같습니다.

```
// 뷰의 body에서

Button(action: {
  // 예시로 업적 달성 100%, 스코어 932점 보고
  gameCenterViewModel.reportAchievement(identifier: "achivement_perfect_10", percentComplete: 100.0)
  gameCenterViewModel.reportScore(leaderboardID: "leaderboard_totalscore", score: 932)
}) {
  Text("업적 달성 100%, 스코어 932점 보고")
    .padding()
    .background(Color.blue)
    .foregroundColor(.white)
    .cornerRadius(8)
}
```

 

 ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-07-pm-8.46.24.jpeg)  ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-07-pm-8.46.01.jpeg)

 

#### **5\. Game Center 대시보드 띄우기 버튼 만들기**

- GameCenter 뷰에 대한 `UIViewControllerRepresentable` 작성
- 대시보드 띄우는 버튼 만들기

 

```
import SwiftUI
import GameKit

// Game Center 대시보드를 표시하기 위한 UIViewControllerRepresentable 구조체
struct GameCenterDashboardRepresentedView: UIViewControllerRepresentable {
  typealias UIViewControllerType = UIViewController
  
  @Environment(\.presentationMode) var presentationMode
  
  func makeUIViewController(context: Context) -> UIViewController {
    let viewController = UIViewController()
    showGameCenterDashboard(on: viewController, context: context)
    return viewController
  }
  
  func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
  
  // Game Center 대시보드 표시 함수
  private func showGameCenterDashboard(on viewController: UIViewController, context: Context) {
    guard GKLocalPlayer.local.isAuthenticated else {
      print("Game Center에 인증되지 않았습니다.")
      return
    }
    
    let gameCenterViewController = GKGameCenterViewController()
    gameCenterViewController.gameCenterDelegate = context.coordinator // 델리게이트 설정
    viewController.present(gameCenterViewController, animated: true, completion: nil)
  }
  
  // Coordinator 클래스 사용
  func makeCoordinator() -> Coordinator {
    return Coordinator(self)
  }
  
  class Coordinator: NSObject, GKGameCenterControllerDelegate {
    var parent: GameCenterDashboardRepresentedView
    
    init(_ parent: GameCenterDashboardRepresentedView) {
      self.parent = parent
    }
    
    func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
      gameCenterViewController.dismiss(animated: true) {
        self.parent.presentationMode.wrappedValue.dismiss() // 대시보드를 닫고 SwiftUI Sheet도 닫음
      }
    }
  }
}

```

```
struct ContentView: View {
  @StateObject private var gameCenterViewModel = GameCenterViewModel()
  @State private var showDashboard = false
  
  var body: some View {
    VStack {
      if gameCenterViewModel.isAuthenticated {
        ...
        Button(action: {
          showDashboard.toggle()
        }) {
          Text("Game Center 대시보드 열기")
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
        
        ...
      }
    }
    .fullScreenCover(isPresented: $showDashboard) {
      GameCenterDashboardRepresentedView()
    }
  }
```

<iframe width="480" height="461" src="https://giphy.com/embed/U4P9bXHGli5SkPcP3Q" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

### **요약**

1. Apple Developer 계정 및 Xcode 프로젝트 설정
2. `GameKit` 프레임워크 가져오기
3. 사용자 인증 처리
4. 리더보드 및 도전 과제 구현
5. 대시보드 띄우기

이렇게 하면 SwiftUI 기반의 iOS 프로젝트에서 Game Center를 연동할 수 있습니다.

 

<!--[rcblock id="6686"]-->
