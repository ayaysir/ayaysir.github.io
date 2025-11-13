---
title: "Swift+AudioKit: SF2 형식의 사운드폰트 추가"
date: 2023-08-20
categories: 
  - "DevLog"
  - "Swift"
---

#### **소개**

**[AudioKit](https://github.com/AudioKit)**에서 `sf2` 확장자 형식의 MIDI 사운드폰트를 프로젝트에 추가하고 연결하는 방법입니다.

- [Swift(스위프트): 오디오 라이브러리 AudioKit 프레임워크 소개](http://yoonbumtae.com/?p=5358)

 

#### **방법**

##### **1) Capabilities > Background Modes에서 Audio 추가**

 ![](/assets/img/wp-content/uploads/2023/08/screenshot-2023-08-20-pm-4.35.40-copy.jpg)

 

##### **2) 사운드폰트 파일을 프로젝트 내에 추가**

 ![](/assets/img/wp-content/uploads/2023/08/screenshot-2023-08-20-pm-4.38.09-copy.jpg)

 

##### **3) 사운드 컨덕터(ObservableObject) 생성**

```
class InstrumentSFZConductor: ObservableObject, HasAudioEngine {
    let engine = AudioEngine()
    var instrument = MIDISampler()
    
    func noteOn(pitch: Pitch, point _: CGPoint) {
        instrument.play(noteNumber: MIDINoteNumber(pitch.midiNoteNumber), velocity: 90, channel: 1)
    }

    func noteOff(pitch: Pitch) {
        instrument.stop(noteNumber: MIDINoteNumber(pitch.midiNoteNumber), channel: 1)
    }

    init() {
        do {
            if let fileURL = Bundle.main.url(forResource: "GeneralUser GS MuseScore v1.442", withExtension: "sf2") {
                try instrument.loadMelodicSoundFont(url: fileURL, preset: 5)
            } else {
                Log("Could not find file")
            }
            instrument.volume = 1
            
            engine.output = instrument
            try engine.start()
        } catch {
            Log("AudioKit did not start!")
        }
    }
}
```

`ObservableObject`인 이유는 SwiftUI에서 사용하기 위한 목적이지만 UIKit에서도 사용 가능합니다.

 

##### **4) noteOn, noteOff 메서드로 소리 발생 및 중지**

SwiftUI 프로젝트인 경우 AudioKit의 유틸리티인 [Keyboard](https://github.com/AudioKit/Keyboard)(SPM에서 설치 필요)를 이용하여 키보드를 누르면 해당 메서드가 실행되도록 할 수 있습니다.

```
import Keyboard

struct ContentView: View {
    @StateObject var conductor = InstrumentSFZConductor()
    
    var body: some View {
        VStack {
            // ... //
            Keyboard(
                layout: .piano(pitchRange: Pitch(36)...Pitch(59)),
                noteOn: conductor.noteOn(pitch:point:),
                noteOff: conductor.noteOff(pitch:)
            )
            .frame(minWidth: 100, minHeight: 100)
        }
    }
}
```

 ![](/assets/img/wp-content/uploads/2023/08/screenshot-2023-08-20-pm-4.45.09-copy.jpg)
