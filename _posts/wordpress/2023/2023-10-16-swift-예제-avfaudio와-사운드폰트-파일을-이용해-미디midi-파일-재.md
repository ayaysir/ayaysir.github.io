---
title: "Swift 예제: AVFAudio와 사운드폰트 파일을 이용해 미디(MIDI) 파일 재생"
date: 2023-10-16
categories: 
  - "DevLog"
  - "Swift"
---

#### **소개**

애플 기본 제공 라이브러리인 `AVFAudio`를 이용해 미디(확장자 `*.mid`) 파일을 재생합니다. 사운드폰트(`*.sf2`)를 이용해 플레이하므로 적절한 사운드폰트가 필요합니다. 오류가 발생하는 사운드폰트가 많으므로 다양하게 테스트하는 것을 권장합니다.

- [무료 사운드폰트 자료실](https://archive.org/download/free-soundfonts-sf2-2019-04)

 

#### **절차**

##### **1: 프로젝트에 사운드폰트 및 예제 미디파일 추가**

 ![](/assets/img/wp-content/uploads/2023/10/screenshot-2023-10-16-pm-6.05.59-copy.jpg)

 

##### **2: 뷰모델(conductor) 및 뷰 만들기 (SwiftUI 기준)**

- 이번 예제는 `SwiftUI`를 사용하지만 `MIDIFilePlayConductor`만 활용해서 `UIKit`에서도 사용할 수 있습니다.
- 미디 파일은 `url`을 사용할 수 있으므로 `Document` 폴더 등에서 불러올 수 있습니다.
- `MIDIFilePlayConductor`는 뷰모델 역할을 하고, 사운드 로드, 재생 및 정지 역할 등을 수행합니다.

https://gist.github.com/ayaysir/715b2a9bde0a498a17390d648cd8d6f0

> 참고) 기본 라이브러리를 사용한 미디 재생은 시뮬레이터에서는 사운드폰트가 적용되지 않고  비프음만 나오므로 **실제 기기에서 테스트**해야 됩니다.

 

 ![](/assets/img/wp-content/uploads/2023/10/screenshot-2023-10-16-pm-6.11.45-copy.jpg)

 

재생 파일 변경 방법

```
func changeAndPlayMIDIFile(_ fileNameWithoutExt: String) {
    DispatchQueue.global().async { [weak self] in
        guard let self, let soundfontURL else {
            return
        }
        
        if let midiFile = Bundle.main.url(forResource: fileNameWithoutExt, withExtension: "mid") {
            midiPlayer = try? .init(contentsOf: midiFile, soundBankURL: soundfontURL)
            self.fileNameWithoutExt = fileNameWithoutExt
            
            midiPlayer?.play {
                // 재생 완료되면 할 작업 핸들러
            }
        }
    }
}
```
