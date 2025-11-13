---
title: "Swift(스위프트): mp3, wav 등 소리 파일 재생하기 (스토리보드)"
date: 2022-09-08
categories: 
  - "DevLog"
  - "Swift UIKit"
---

### **Swift(스위프트): mp3 등 소리 파일 재생하기 (스토리보드)**

앱에서 MP3, WAV 등 음악 파일 또는 소리 효과음 파일을 재생하려면 어떻게 해야 할까요?

방법은 아래와 같습니다.

 

**1) 뷰 컨트롤러에 `import AVFoundation`를 추가합니다.**

```
import AVFoundation
```

 

**2) 소리 파일을 드래그 앤 드롭으로 프로젝트 내에 추가합니다.**

 ![](/assets/img/wp-content/uploads/2022/09/mosiac-스크린샷-2022-09-08-pm-6.04.04.jpg)

\[caption id="attachment\_4739" align="alignnone" width="746"\] ![](/assets/img/wp-content/uploads/2022/09/screenshot-2022-09-08-pm-6.03.40.jpg) Finish 버튼 클릭\[/caption\]

 

**3) 뷰 컨트롤러에 `AVAudioPlayer` 타입의 멤버 변수를 추가합니다.**

```
class ViewController: UIViewController {
    
    private var player: AVAudioPlayer?
```

 

**4) 재생 및 정지 함수를 추가합니다.**

```
func playSound() {
    let soundName = "파일이름"

    // forResource: 파일 이름(확장자 제외) , withExtension: 확장자(mp3, wav 등) 입력
    guard let url = Bundle.main.url(forResource: soundName, withExtension: "mp3") else {
        return
    }
    
    do {
        player = try AVAudioPlayer(contentsOf: url, fileTypeHint: AVFileType.mp3.rawValue)
        player?.numberOfLoops = -1
        player?.play()
    } catch let error {
        print(error.localizedDescription)
    }
}

func stopSound() {
    player?.stop()
}
```

- `url`
    - 저장된 소리 파일의 URL을 불러옵니다.
    - `forResource`는 확장자를 제외한 파일 이름입니다. 예를 들어 파일 이름이 `fanfare.mp3`라면 `"fanfare"`가 파일 이름입니다.
    - `withExtension`은 `mp3`, `wav` 등 확장자를 입력하니다.
- `AVAudioPlayer(contentsOf: url, fileTypeHint: AVFileType.mp3.rawValue)`
    - `mp3` 타입의 새로운 플레이어를 생성합니다. 확장자가 다르다면 `mp3` 대신 다른 `AVFileType`을 사용합니다.
    - `numberOfLoops`는 반복 횟수입니다. `-1`를 입력하면 무한 반복하며, 이 부분을 제외하거나 `0`을 입력하면 1번만 재생됩니다. `1`을 입력하면 두 번 재생됩니다. ([Apple 개발자 문서](https://developer.apple.com/documentation/avfaudio/avaudioplayer/1386071-numberofloops))
    - `.play()` 부분에서 소리가 재생됩니다.
- `player?.stop()`
    - 재생중인 플레이어를 정지합니다.

 

**5) 원하는 부분에 위 함수를 실행합니다. 예를 들면 버튼을 클릭했을 경우 소리가 나오게 하고 싶은 경우 버튼 이벤트 안에 `playSound()`를 추가합니다.**

- [iOS 프로그래밍: 스토리보드에서 요소를 추가한 뒤 아웃렛 변수와 액션 함수로 연결하기](http://yoonbumtae.com/?p=2160)

 

 

##### **참고: 무음모드에서 소리 나오게 하기**

```
// 무음모드에서 소리가 나게 하기
do {
    try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
    try AVAudioSession.sharedInstance().setActive(true)
} catch {
    // print error...
}
```

 

\[rcblock id="4560"\]
