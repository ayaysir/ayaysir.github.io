---
title: "Swift(스위프트): 오디오 라이브러리 AudioKit 프레임워크 소개"
date: 2023-03-14
categories: 
  - "DevLog"
  - "Swift"
---


**AudioKit** 란?
> iOS, macOS 및 tvOS용 Swift 오디오 합성, 처리 및 분석 플랫폼

 
## **개요**

AudioKit은 코드 저장소, 패키지, 라이브러리, 알고리즘, 애플리케이션, 플레이그라운드, 테스트, 스크립트로 구성된 전체 오디오 개발 생태계(audio development ecosystem)로, 오디오 프로그래머, 앱 개발자, 엔지니어, 연구원, 과학자, 음악가, 게이머 및 프로그래밍을 처음 접하는 사람들의 커뮤니티에 의해 구축되고 사용되는 프레임워크입니다.

AudioKit은 개발 동기를 부여하는 몇 가지 기본 목표를 가지고 있습니다.

1. 첫째, AudioKit을 배우는 것이 누구에게나 쉽기를 바랍니다. 사람들이 시작할 수 있도록 Swift Playgrounds, 데모 애플리케이션 및 지원하는 AudioKit 전문가의 Discord 그룹에 대한 액세스를 제공합니다.
2. 다음으로, 우리는 AudioKit이 확장성이 있어 더 많은 고급 개발자들이 AudioKit 위에 구축된 자신만의 사용자 지정 앱과 라이브러리를 만들 수 있기를 바랍니다. AudioKit의 일부였던 대부분의 파트가 AudioKit이 확장 가능하도록 하고 개발자들에게 AudioKit의 확장에 대한 여러 가지 접근법의 예를 제공하기 위해 별도의 패키지로 이동되었습니다.
3. AudioKit의 중요한 목표는 소수의 자원 봉사자가 성장하고 유지 관리할 수 있도록 하는 것입니다. 이러한 이유로 AudioKit 코드 저장소가 변경될 때마다 실행되는 광범위한 테스트가 있습니다. 우리는 AudioKit을 지원하는 데 많은 시간을 할애하는 사람들에 대한 Github 후원(sponsorship)을 수락하고 권장합니다.
4. 우리는 차세대 오디오 앱 개발자들에게 영감을 주며, 오디오킷 기반 앱을 강조하고 세계에서 가장 많이 다운로드된 신디사이저 앱인 "[AuidoKit SynthOne](https://audiokitpro.com/synth/)"를 비롯한 다른 앱들을 포함하는 "_AudioKit Pro_" 브랜드를 내세웁니다.

 

## **패키지 목록 / 레이어 다이어그램**

 ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-14-pm-11.09.54-copy.jpg)

AudioKit 레이어 자체에는 import 할 수 있는 세 가지 프레임워크가 포함되어 있습니다.

- **AudioKit**
    - AudioKit의 Swift 전용(Swft-only base) 레이어
    - Swift Playgoriunds app에서 이용할 수 있음
- **AudioKitEX**
    - C++로 작성된 AudioKit 확장을 위한 API
- **CAudioKitEX**
    - `AudioKitEX`의 기능을 지원하는 [DSP(Digital Signal Processor)](https://ko.wikipedia.org/wiki/%EB%94%94%EC%A7%80%ED%84%B8_%EC%8B%A0%ED%98%B8_%EC%B2%98%EB%A6%AC_%EC%9E%A5%EC%B9%98) 및 기타 Low Level 코드

[Cookbook Demo App](https://github.com/AudioKit/Cookbook) 계층은 이 다이어그램에서 실행 가능한 앱이 있는 위치의 예입니다. 이 계층은 그 아래에 있는 패키지의 하위 집합에 따라 달라질 수 있습니다.

<!-- \[gallery link="none" columns="2" size="full" ids="5362,5361"\] -->
![Cookbook의 모습](/assets/img/DevLog/audiokit-cookbook.png)

 

패키지는 다른 패키지에 의존할 수 있으며 `SoundpipeAudioKit`에 의존하는 `SporthAudioKit`의 예(윗부분에 있는 것이 아래 부분에 의존함)가 표시되어 있습니다.

위 레이어 다이어그램의 `AAAAudioKit`...`ZZZAudioKit` 블록은 AudioKit을 확장하는 다양한 패키지의 플레이스홀더(placeholder)입니다. 아래 목록은 다양한 패키지의 몇 가지 예입니다.

- **[AudioKitUI](https://github.com/AudioKit/AudioKitUI)**
    - 파형 시각화(waverform visualization) 및 UI 구성 요소
- [**DevLoop AudioKit**](https://github.com/AudioKit/DevoloopAudioKit)
    - 기타(Guitar) 프로세서
- [**Dunne AudioKit**](https://github.com/AudioKit/DunneAudioKit)
    - 코러스(Chorus), 플랜저(Flanger). 샘플러(Sampler), 스테레오 딜레이(Stereo Delay), 신디사이저(Synth)
- [**SoundPipe AudioKit**](https://github.com/AudioKit/SoundpipeAudioKit)
    - 오실레이터(Oscillators), 이펙트(Effects), 필터(Filters) 등
- [**Sporth AudioKit**](https://github.com/AudioKit/SporthAudioKit)
    - 간단한 문법으로 복잡한 DSP 작업을 처리
- [**STK AudioKit**](https://github.com/AudioKit/STKAudioKit/)
    - Stanford Synthesis Toolkit physical models

 

### **AudioKit.io**

[공식 사이트](http://www.audiokit.io/)

 

#### **설치 방법**

설명법 링크 - [https://github.com/AudioKit/AudioKit/](https://github.com/AudioKit/AudioKit/)

1. (Xcode의 프로젝트에서) `File -> Add Packages...`를 선택합니다.
2. 왼쪽 컬렉션 사이드바의 왼쪽 하단에 있는 `+` 아이콘을 클릭합니다.  ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-14-pm-11.31.53-copy.jpg)
3. 팝업 메뉴에서 `Add Package Collection` 를 선택합니다.
4. 패키지 컬렉션 추가 대화 상자에서 [https://swiftpackageindex.com/AudioKit/collection.json](https://swiftpackageindex.com/AudioKit/collection.json) 을 URL로 입력하고 `Load` 버튼을 클릭합니다.
5. 만약 컬렉션이 서명되지 않았음을 경고한다면 "서명되지 않은 컬렉션 추가"를 클릭하십시오.
6. 이제 패키지 목록에서 필요한 AudioKit Swift 패키지를 추가하고 Xcode 내에서 바로 그 기능을 불러올 수 있습니다.

 

### **목표 (Targets)**

- **AudioKit**
    - AVFoundation Effects에 대한 래퍼(Wrapper)
    - 언어: Swift
- **AudioKitEX**
    - Nodes, Parameters, Automation, Sequencing
    - 언어: Swift
- **CAudioKitEX**
    - AudioKitEX 기능을 지원하는 DSP 및 기타 Low Level 코드
    - 언어: Objective-C++

 

## **예제**

AudioKit 예제의 기본 소스는 [AudioKit Cookbook](https://github.com/AudioKit/Cookbook)에 있습니다. 이 앱에는 AudioKit의 사용법에 대한 모든 미니 예제가 포함되어 있습니다.

 

### **포맷 변환기 (Format Converter)**

`FormatConverter`는 보다 복잡한 `AVFoundation` 및 `CoreAudio` 오디오 변환을 사용하기 쉬운 형식으로 래핑합니다.

```swift
import AudioKit

// viewDidLoad나 SwiftUI의 onAppear 등 실행 가능한 영역
.onAppear {
    var options = FormatConverter.Options()
    // any options left nil will assume the value of the input file
    options.format = .wav
    options.sampleRate = 48000
    options.bitDepth = 24

    let oldURL = Bundle.main.url(forResource: "file_example_MP3_5MG", withExtension: "mp3")!
    let documentDir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    // document 폴더 위치 표시
    print("docuDIR:", documentDir)
    
    let newURL = documentDir.appending(component: "output - \(Date()).wav")
    
    let converter = FormatConverter(inputURL: oldURL, outputURL: newURL, options: options)
    converter.start { error in
        // check to see if error isn't nil, otherwise you're good
        if let error = error {
            print("Error:", error)
        }
        print("good")
    }
}
```

![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-14-pm-11.57.24-copy.jpg)  
*앱 실행 전 (변환 전) 원래 파일 (`oldURL`)*

 

![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-14-pm-11.57.42-copy.jpg)  
*앱 실행 후 (변환 후) 파일 (`newURL`)*

 

### **미디 (MIDI)**

AudioKit MIDI는 MIDI 신호의 생성과 응답을 단순화하기 위해 사용되는 `CoreMIDI`의 구현(implementations)입니다.

다음과 같은 MIDI 리스너(`MIDIListener`)를 추가합니다.

```swift
var midi = MIDI()
midi.openInput()
midi.addListener(someClass)
```

`someClass`는 `MIDIListener` 프로토콜을 준수(conform)해야 합니다.

그런 다음 `MIDILlistener`에서 필요한 메서드 등을 구현하고 필요한 방법으로 데이터를 사용합니다.

 

### **테이블 (Tables)**

테이블은 `Float` 데이터의 배열일 뿐입니다. 파형 데이터를 저장하는 데 가장 많이 사용되며 가장 일반적인 경우에는 몇 가지 기본값이 있습니다.

- sine wave (사인파)
- triangle wave (삼각파)
- square wave (사각파)
- sawtooth wave (톱니파)
- reverse sawtooth wave (역톱니파)
- positive sine (양의 사인파)
- positive triangle (양의 삼각파)
- positive square (양의 사각파)
- positive sawtooth (양의 톱니파)
- positive reverse sawtooth (양의 역톱니파)

테이블은 오디오 또는 제어 데이터를 저장하는 것도 됩니다.

 

### **시퀀싱 (Sequencing)**

AppleSequencer는 검증된(tried-and-true) CoreAudio/MIDI 시퀀스를 기반으로 합니다.

 

<!-- \[rcblock id="5348"\] -->

 

### **Taps**

탭은 신호 체인에 노드를 삽입하지 않고도 신호 체인의 특정 지점에서 오디오 스트림에 액세스할 수 있는 방법입니다. 오디오를 "탭핑"하여 데이터를 추출하고 해당 지점에서 스트림을 플로팅하거나 분석하는 것과 같은 부수적인 목적으로 사용합니다.

 

## 주제별 링크 (Topics)  

### Articles

[About Us](http://www.audiokit.io/AudioKit/documentation/audiokit/aboutus)  
AudioKit은 다수의 프로그래머와 음악가들이 함께 만들어낸 프로젝트입니다.

[Contributing Code](http://www.audiokit.io/AudioKit/documentation/audiokit/contributing)  
업데이트, 버그 수정, 기능 추가 또는 문서 개선에 관한 안내입니다.

[Migration Guide](http://www.audiokit.io/AudioKit/documentation/audiokit/migrationguide)  
[Nodes](http://www.audiokit.io/AudioKit/documentation/audiokit/nodes)  
노드는 오디오 스트림과 함께 동작하는 상호 연결 가능한 구성 요소입니다. 노드가 동작하려면 오디오가 그 노드를 통해 *끌어와져야* 합니다. 그리고 오디오가 노드를 통과하려면, 해당 노드를 포함한 오디오 신호 체인이 결국 출력까지 이어져야 합니다.

[Samplers](http://www.audiokit.io/AudioKit/documentation/audiokit/samplers)  
“샘플러”라는 용어는 약간 오해의 소지가 있습니다. 원래는 사운드를 녹음(“샘플링”)하고 키보드로 다시 재생할 수 있는 하드웨어 장치를 의미했습니다. 실제로는 녹음 기능보다 재생 기능이 훨씬 더 널리 사용되었고, 오늘날에는 두 기능이 거의 완전히 분리되어 있습니다. 우리가 오늘날 “샘플러”라고 부르는 것은 단순히 미리 준비된 사운드(“샘플”)를 재생하는 시스템입니다.

### Classes

[`class AmplitudeTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/amplitudetap)  
어떤 노드든 진폭 분석을 수행하기 위한 탭입니다. start()는 탭을 추가하고 stop()은 제거합니다.

[`class AppleSampler`](http://www.audiokit.io/AudioKit/documentation/audiokit/applesampler)  
샘플러 오디오 생성기입니다.

[`class AppleSequencer`](http://www.audiokit.io/AudioKit/documentation/audiokit/applesequencer)  
CoreAudio/MIDI 기반의 검증된 시퀀서를 기반으로 합니다.

[`class AudioEngine`](http://www.audiokit.io/AudioKit/documentation/audiokit/audioengine)  
AudioKit의 AVAudioEngine 래퍼입니다.

[`class AudioPlayer`](http://www.audiokit.io/AudioKit/documentation/audiokit/audioplayer)  
단순화된 API를 제공하는 AVAudioPlayerNode 래퍼입니다. 플레이어는 메모리 기반(isBuffered) 또는 디스크 스트리밍 기반 두 모드를 상호 변경하며 사용할 수 있습니다. 긴 파일은 디스크에서 재생하는 것을 권장합니다. 완전히 매끄러운 루프를 원한다면 버퍼링하세요. 디스크에서도 루프는 가능하지만 완전한 무봉제(seamless)는 아닙니다.

[`class BandPassFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/bandpassfilter)  
Apple의 BandPassFilter Audio Unit의 AudioKit 버전입니다.

[`class BaseTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/basetap)  
AVAudioEngine installTap을 사용하는 AudioKit 탭의 기본 클래스입니다.

[`class Compressor`](http://www.audiokit.io/AudioKit/documentation/audiokit/compressor)  
Apple의 Compressor Audio Unit의 AudioKit 버전입니다.

[`class Decimator`](http://www.audiokit.io/AudioKit/documentation/audiokit/decimator)  
Apple의 Decimator Audio Unit의 AudioKit 버전입니다.

[`class Delay`](http://www.audiokit.io/AudioKit/documentation/audiokit/delay)  
Apple의 Delay Audio Unit의 AudioKit 버전입니다.

[`class Distortion`](http://www.audiokit.io/AudioKit/documentation/audiokit/distortion)  
Apple의 Distortion Audio Unit의 AudioKit 버전입니다.

[`class DynamicsProcessor`](http://www.audiokit.io/AudioKit/documentation/audiokit/dynamicsprocessor)  
Apple의 DynamicsProcessor Audio Unit의 AudioKit 버전입니다.

[`class Expander`](http://www.audiokit.io/AudioKit/documentation/audiokit/expander)  
Apple의 Expander Audio Unit의 AudioKit 버전입니다.

[`class FFTTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/ffttap)  
어떤 노드에서든 FFT 계산을 수행합니다.

[`class FormatConverter`](http://www.audiokit.io/AudioKit/documentation/audiokit/formatconverter)  
복잡한 AVFoundation 및 CoreAudio 변환 작업을 간단하게 감싸는 래퍼입니다.

[`class HighPassFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/highpassfilter)  
Apple의 HighPassFilter Audio Unit의 AudioKit 버전입니다.

[`class HighShelfFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/highshelffilter)  
Apple의 HighShelfFilter Audio Unit의 AudioKit 버전입니다.

[`class LowPassFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/lowpassfilter)  
Apple의 LowPassFilter Audio Unit의 AudioKit 버전입니다.

[`class LowShelfFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/lowshelffilter)  
Apple의 LowShelfFilter Audio Unit의 AudioKit 버전입니다.

[`class MIDI`](http://www.audiokit.io/AudioKit/documentation/audiokit/midi)  
MIDI 입·출력 핸들러입니다.

[`class MIDICallbackInstrument`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicallbackinstrument)  
MIDI 노트 온/오프 명령 시 함수를 트리거하는 MIDI 악기입니다. 주로 AppleSequencer가 MIDIEndpointRef에 보낼 때 사용됩니다. CallbackInstrument라는 또 다른 콜백 악기도 있습니다. 이 기능을 사용하려면 프로젝트에서 “Background Modes - Audio”를 활성화해야 합니다.

[`class MIDIClockListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiclocklistener)  
MIDI 클럭 이벤트를 세고 24 펄스(4분음표 1개)마다 옵저버에게 알립니다.

[`class MIDIFileTrackNoteMap`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletracknotemap)  
MIDI 파일의 특정 트랙 안에서 발생하는 MIDI 이벤트를 가져옵니다. 많은 계산이 필요하므로 가능하면 한 번만 초기화해야 합니다.

[`class MIDIHelper`](http://www.audiokit.io/AudioKit/documentation/audiokit/midihelper)  
MIDI 관련 유틸리티 함수 모음입니다.

[`class MIDIInstrument`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiinstrument)  
MIDI로 트리거하거나 시퀀서에서 재생할 수 있는 악기용 Instrument 버전입니다.

[`class MIDIMonoPolyListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midimonopolylistener)  
상태 변경을 알릴 수 있도록 옵저버 지원이 필요할 수 있습니다.

[`class MIDINoteDuration`](http://www.audiokit.io/AudioKit/documentation/audiokit/midinoteduration)  
MIDI 노트 길이를 저장하는 데 유용한 타입입니다.

[`class MIDIOMNIListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiomnilistener)  
상태 변경 알림을 위해 옵저버 지원이 필요할 수 있습니다.

[`class MIDIPlayer`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiplayer)  
Apple의 AVAudioSequencer 기반의 단순 MIDI 플레이어이며 기능은 제한적입니다.

[`class MIDISampler`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisampler)  
MIDI 신호를 받아 재생하는 샘플러입니다.

[`class MIDISystemRealTimeListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemrealtimelistener)  
SRT(Sytem Real Time) MIDI 메시지를 확인하는 MIDIListener입니다.

[`class MIDITempoListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditempolistener)  
MIDI 클럭 메시지를 분석해 BPM을 계산하는 AudioKit MIDI 리스너입니다.

[`class MIDITimeout`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditimeout)  
작업 블록을 실행하고, 응답이 오지 않는 경우를 감지하기 위한 타이머를 시작하는 클래스입니다. 성공 조건은 호출자가 정의하며, succeed()를 호출해 타임아웃을 방지할 수 있습니다.

[`class MatrixMixer`](http://www.audiokit.io/AudioKit/documentation/audiokit/matrixmixer)  
[`class Mixer`](http://www.audiokit.io/AudioKit/documentation/audiokit/mixer)  
Apple의 Mixer Node의 AudioKit 버전입니다. 여러 노드를 혼합합니다.

[`class MultiChannelInputNodeTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/multichannelinputnodetap)  
AVAudioInputNode 또는 AVAudioEngine inputNode의 다중 채널 오디오를 처리하기 위한 탭입니다. 하드웨어 입력 채널에 따라 여러 개의 모노 파일로 각각 기록합니다.

[`class MultiSegmentAudioPlayer`](http://www.audiokit.io/AudioKit/documentation/audiokit/multisegmentaudioplayer)  
여러 파일 구간을 스케줄하여 재생할 수 있는 오디오 플레이어입니다.

[`class MusicTrackManager`](http://www.audiokit.io/AudioKit/documentation/audiokit/musictrackmanager)  
Apple의 내부 MusicTrack에 대한 래퍼입니다.

[`class NodeParameter`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodeparameter)  
AUParameter를 더 사용하기 쉬운 인터페이스로 감싸고 AudioKit 기능을 추가한 요소입니다. Parameter property wrapper용 신규 버전입니다.

[`class NodeRecorder`](http://www.audiokit.io/AudioKit/documentation/audiokit/noderecorder)  
간단한 오디오 레코더 클래스이며 최소 버퍼 길이 128 샘플(.short)이 필요합니다.

[`class ParametricEQ`](http://www.audiokit.io/AudioKit/documentation/audiokit/parametriceq)  
Apple의 ParametricEQ Audio Unit의 AudioKit 버전입니다.

[`class PeakLimiter`](http://www.audiokit.io/AudioKit/documentation/audiokit/peaklimiter)  
Apple의 PeakLimiter Audio Unit의 AudioKit 버전입니다.

[`class PlaygroundNoiseGenerator`](http://www.audiokit.io/AudioKit/documentation/audiokit/playgroundnoisegenerator)  
Pure Swift 기반 노이즈 생성기입니다.

[`class PlaygroundOscillator`](http://www.audiokit.io/AudioKit/documentation/audiokit/playgroundoscillator)  
Pure Swift 기반 오실레이터입니다.

[`class PresetBuilder`](http://www.audiokit.io/AudioKit/documentation/audiokit/presetbuilder)  
Apple Sampler가 읽을 수 있는 프리셋을 생성합니다.

[`class RawDataTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/rawdatatap)  
어떤 노드든 원시(raw) 데이터를 가져옵니다.

[`class RawDataTap2`](http://www.audiokit.io/AudioKit/documentation/audiokit/rawdatatap2)  
[`class Reverb`](http://www.audiokit.io/AudioKit/documentation/audiokit/reverb)  
Apple의 Reverb Audio Unit의 AudioKit 버전입니다.

[`class RingModulator`](http://www.audiokit.io/AudioKit/documentation/audiokit/ringmodulator)  
Apple의 RingModulator Audio Unit의 AudioKit 버전입니다.

[`class Settings`](http://www.audiokit.io/AudioKit/documentation/audiokit/settings)  
AudioKit 전역 설정입니다.

[`class Table`](http://www.audiokit.io/AudioKit/documentation/audiokit/table)  
파형 또는 조회용으로 사용할 수 있는 값 테이블입니다.

[`class ThreadLockedAccessor`](http://www.audiokit.io/AudioKit/documentation/audiokit/threadlockedaccessor)  
값에 대한 lock 기반 원자적 접근을 보장하는 property wrapper입니다.

[`class TimePitch`](http://www.audiokit.io/AudioKit/documentation/audiokit/timepitch)  
Apple의 TimePitch Audio Unit의 AudioKit 버전입니다.

[`class VariSpeed`](http://www.audiokit.io/AudioKit/documentation/audiokit/varispeed)  
Apple의 VariSpeed Audio Unit의 AudioKit 버전입니다.

[`class WaveformDataRequest`](http://www.audiokit.io/AudioKit/documentation/audiokit/waveformdatarequest)  
오디오 파일에서 데이터를 가져오기 위한 요청입니다.

### Protocols

[`protocol DynamicWaveformNode`](http://www.audiokit.io/AudioKit/documentation/audiokit/dynamicwaveformnode)  
주로 SoundpipeAudioKit의 DynamicOscillator를 위한 프로토콜이며, 다른 곳에서도 사용될 수 있습니다.

[`protocol HasAudioEngine`](http://www.audiokit.io/AudioKit/documentation/audiokit/hasaudioengine)  
오디오 “엔진”을 보유해야 함을 명시하는 프로토콜입니다.

[`protocol HasInternalConnections`](http://www.audiokit.io/AudioKit/documentation/audiokit/hasinternalconnections)  
[`protocol MIDIBeatObserver`](http://www.audiokit.io/AudioKit/documentation/audiokit/midibeatobserver)  
클라이언트가 비트 이벤트를 관찰할 수 있도록 하는 프로토콜입니다.

[`protocol MIDIFileChunk`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifilechunk)  
MIDI 파일 청크 프로토콜입니다.

[`protocol MIDIListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midilistener)  
MIDI 리스너 프로토콜입니다.

[`protocol MIDIMessage`](http://www.audiokit.io/AudioKit/documentation/audiokit/midimessage)  
MIDI 메시지 프로토콜입니다.

[`protocol MIDISystemRealTimeObserver`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemrealtimeobserver)  
MIDI 시스템 실시간(SRT) 메시지 옵저버입니다.

[`protocol MIDITempoObserver`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditempoobserver)  
MIDI 템포 옵저버입니다.

[`protocol MIDITransformer`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditransformer)  
MIDI 이벤트 배열을 다른 배열로 변환하는 변환기입니다.

[`protocol MultiChannelInputNodeTapDelegate`](http://www.audiokit.io/AudioKit/documentation/audiokit/multichannelinputnodetapdelegate)  
다중 채널 Input Node Tap의 델리게이트입니다.

[`protocol NamedNode`](http://www.audiokit.io/AudioKit/documentation/audiokit/namednode)  
디버깅용 연결 정보를 보기 좋게 출력하도록 돕는 프로토콜입니다.

[`protocol Node`](http://www.audiokit.io/AudioKit/documentation/audiokit/node)  
오디오 그래프의 노드입니다.

[`protocol NodeParameterType`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodeparametertype)  
@Parameter가 지원하는 타입의 기본 프로토콜입니다.

[`protocol ObserverProtocol`](http://www.audiokit.io/AudioKit/documentation/audiokit/observerprotocol)  
옵저버 프로토콜입니다.

[`protocol Occupiable`](http://www.audiokit.io/AudioKit/documentation/audiokit/occupiable)  
값을 담을 수 있는 타입(strings, arrays 등)입니다.

[`protocol ProcessesPlayerInput`](http://www.audiokit.io/AudioKit/documentation/audiokit/processesplayerinput)  
오디오 “플레이어” 입력을 처리하는 타입임을 명시하는 프로토콜입니다.

[`protocol StreamableAudioSegment`](http://www.audiokit.io/AudioKit/documentation/audiokit/streamableaudiosegment)  
[`protocol Tap`](http://www.audiokit.io/AudioKit/documentation/audiokit/tap)  
### Structures

[`struct AppleMIDIEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/applemidievent)  
Apple MIDI 이벤트입니다.

[`struct Device`](http://www.audiokit.io/AudioKit/documentation/audiokit/device)  
오디오 디바이스 선택을 위한 래퍼입니다.

[`struct Duration`](http://www.audiokit.io/AudioKit/documentation/audiokit/duration)  
시퀀싱에서 시간 개념을 위한 컨테이너입니다.

[`struct EndpointInfo`](http://www.audiokit.io/AudioKit/documentation/audiokit/endpointinfo)  
MIDI Endpoint 정보입니다.

[`struct MIDICustomMetaEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicustommetaevent)  
MIDI 커스텀 메타 이벤트입니다.

[`struct MIDIEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midievent)  
MIDI 이벤트를 정의하는 값의 컨테이너입니다.

[`struct MIDIFile`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifile)  
MIDI 파일입니다.

[`struct MIDIFileChunkEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifilechunkevent)  
MIDI 파일 청크 이벤트입니다.

[`struct MIDIFileTempoTrack`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletempotrack)  
MIDI 파일 템포 트랙입니다.

[`struct MIDIFileTrack`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletrack)  
MIDI 파일 트랙입니다.

[`struct MIDIFileTrackChunk`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletrackchunk)  
MIDI 파일 트랙 청크입니다.

[`struct MIDINoteData`](http://www.audiokit.io/AudioKit/documentation/audiokit/midinotedata)  
MusicTrackManager 노트 이벤트에 필요한 데이터를 담는 구조체입니다.

[`struct MIDIProgramChangeEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiprogramchangeevent)  
MIDI 프로그램 체인지 이벤트입니다.

[`struct MIDIStatus`](http://www.audiokit.io/AudioKit/documentation/audiokit/midistatus)  
MIDI 상태 메시지입니다.

[`struct MIDISysExMessage`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisysexmessage)  
MIDI 시스템 익스클루시브 메시지입니다.

[`struct MIDIVariableLengthQuantity`](http://www.audiokit.io/AudioKit/documentation/audiokit/midivariablelengthquantity)  
MIDI 가변 길이 수량 형식입니다.

[`struct NodeParameterDef`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodeparameterdef)  
노드 파라미터의 정의/명세입니다.

[`struct Parameter`](http://www.audiokit.io/AudioKit/documentation/audiokit/parameter)  
NodeParameter를 감싸 값을 쉽게 설정할 수 있게 합니다.

[`struct TimeSignature`](http://www.audiokit.io/AudioKit/documentation/audiokit/timesignature)  
박자표입니다.

### Variables

[`let noteOffByte: MIDIByte`](http://www.audiokit.io/AudioKit/documentation/audiokit/noteoffbyte)  
Note Off 단축 바이트입니다.

[`let noteOnByte: MIDIByte`](http://www.audiokit.io/AudioKit/documentation/audiokit/noteonbyte)  
Note On 단축 바이트입니다.

### Functions

[`func CheckError(OSStatus)`](http://www.audiokit.io/AudioKit/documentation/audiokit/checkerror%28_:%29)  
[`func Log(...)`](http://www.audiokit.io/AudioKit/documentation/audiokit/log%28_:log:type:file:function:line:%29)  
os_log 시스템의 래퍼입니다. 현재는 파일명·함수·라인 번호를 표시하지만 성능에 영향을 준다면 제거될 수 있습니다(Apple 권장 기준).

[`func ceil(Duration) -> Duration`](http://www.audiokit.io/AudioKit/documentation/audiokit/ceil%28_:%29)  
비트 단위로 duration의 상한을 반환합니다.

[`func fourCC(String) -> UInt32`](http://www.audiokit.io/AudioKit/documentation/audiokit/fourcc%28_:%29)  
Audio Unit 코드 변환을 위한 도우미 함수입니다.

[`func loadAudioSignal(audioURL: URL) -> ...`](http://www.audiokit.io/AudioKit/documentation/audiokit/loadaudiosignal%28audiourl:%29)  
URL에서 오디오 파일 정보를 읽어 float 배열, 샘플레이트, 프레임 수를 반환합니다.

### 연산자

[`func + (AVAudioTime, Int) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/+%28_:_:%29-5ji1p)  
덧셈

[`func + (AVAudioTime, Double) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/+%28_:_:%29-5v492)  
덧셈

[`func - (AVAudioTime, Double) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/-%28_:_:%29-5p85m)  
뺄셈

[`func - (AVAudioTime, Int) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/-%28_:_:%29-5yu8p)  
뺄셈

### 타입 별칭

[`typealias AUValue`](http://www.audiokit.io/AudioKit/documentation/audiokit/auvalue)  
보통 AVFoundation 또는 AudioToolbox에서 설정되지만, 여기서 정의하여 사용자가 해당 프레임워크를 불러오지 않아도 됨

[`typealias BPM`](http://www.audiokit.io/AudioKit/documentation/audiokit/bpm)  
템포를 나타내는 별칭, 분당 박자 단위(BPM)로 작업할 때 명확하게 표시

[`typealias BPMType`](http://www.audiokit.io/AudioKit/documentation/audiokit/bpmtype)  
분당 박자 단위로 템포를 저장하는 타입

[`typealias CMIDICallback`](http://www.audiokit.io/AudioKit/documentation/audiokit/cmidicallback)  
C에서 호출 가능한 콜백 함수

[`typealias CVoidCallback`](http://www.audiokit.io/AudioKit/documentation/audiokit/cvoidcallback)  
C에서 호출 가능한 콜백 함수

[`typealias DeviceID`](http://www.audiokit.io/AudioKit/documentation/audiokit/deviceid)  
macOS의 AudioDeviceID

[`typealias FloatChannelData`](http://www.audiokit.io/AudioKit/documentation/audiokit/floatchanneldata)  
스테레오 오디오 데이터를 담은 2차원 배열

[`typealias MIDIByte`](http://www.audiokit.io/AudioKit/documentation/audiokit/midibyte)  
MIDI 관련 작업임을 명확히 하는 타입 별칭

[`typealias MIDICallback`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicallback)  
MIDI 콜백용 함수 타입

[`typealias MIDIChannel`](http://www.audiokit.io/AudioKit/documentation/audiokit/midichannel)  
MIDI 관련 작업임을 명확히 하는 타입 별칭

[`typealias MIDINoteNumber`](http://www.audiokit.io/AudioKit/documentation/audiokit/midinotenumber)  
MIDI 관련 작업임을 명확히 하는 타입 별칭

[`typealias MIDIVelocity`](http://www.audiokit.io/AudioKit/documentation/audiokit/midivelocity)  
MIDI 관련 작업임을 명확히 하는 타입 별칭

[`typealias MIDIWord`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiword)  
MIDI 관련 작업임을 명확히 하는 타입 별칭

[`typealias SampleIndex`](http://www.audiokit.io/AudioKit/documentation/audiokit/sampleindex)  
샘플 작업임을 명확히 하는 타입 별칭

### 열거형

[`enum AnalysisMode`](http://www.audiokit.io/AudioKit/documentation/audiokit/analysismode)  
분석 유형

[`enum AudioFileFormat`](http://www.audiokit.io/AudioKit/documentation/audiokit/audiofileformat)  
[`enum DisconnectStrategy`](http://www.audiokit.io/AudioKit/documentation/audiokit/disconnectstrategy)  
노드를 다른 노드와 연결 해제하는 방법 설명

[`enum FFTValidBinCount`](http://www.audiokit.io/AudioKit/documentation/audiokit/fftvalidbincount)  
n이 정수일 때 2^n의 유효한 결과

[`enum MIDIControl`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicontrol)  
MIDIByte 기준 MIDI 컨트롤 번호의 일반적인 이름

[`enum MIDICustomMetaEventType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicustommetaeventtype)  
MIDI 커스텀 메타 이벤트 유형

[`enum MIDIFileChunkType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifilechunktype)  
MIDI 파일 청크 유형

[`enum MIDIStatusType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midistatustype)  
가능한 MIDI 상태 메시지

[`enum MIDISystemCommand`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemcommand)  
MIDI 시스템 명령

[`enum MIDISystemCommandType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemcommandtype)  
MIDI 시스템 명령 유형

[`enum MIDITimeFormat`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditimeformat)  
MIDI 시간 형식

[`enum MusicalDuration`](http://www.audiokit.io/AudioKit/documentation/audiokit/musicalduration)  
[`enum NodeStatus`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodestatus)  
노드 상태 추적

[`enum SampleTriggerMode`](http://www.audiokit.io/AudioKit/documentation/audiokit/sampletriggermode)  
샘플 트리거 방식 유형

[`enum StereoMode`](http://www.audiokit.io/AudioKit/documentation/audiokit/stereomode)  
스테레오 신호 처리 방식

[`enum TableType`](http://www.audiokit.io/AudioKit/documentation/audiokit/tabletype)  
지원되는 기본 테이블 유형



<!-- [About Us](http://www.audiokit.io/AudioKit/documentation/audiokit/aboutus)

AudioKit was created by large team of programmers and musicians.

[Contributing Code](http://www.audiokit.io/AudioKit/documentation/audiokit/contributing)

Notes about making updates, bug fixes, features, or improving the documentation.

[Migration Guide](http://www.audiokit.io/AudioKit/documentation/audiokit/migrationguide)

[Nodes](http://www.audiokit.io/AudioKit/documentation/audiokit/nodes)

Nodes are interconnectable components that work with the audio stream. For a node to work, audio has to be pulled through it. For audio to be pulled through a node, the audio signal chain that includes the node has to eventually reach an output.

[Samplers](http://www.audiokit.io/AudioKit/documentation/audiokit/samplers)

The term “sampler” is a bit misleading. Originally, it referred to a hardware device capable of recording (“sampling”) sound and then re-playing it from a keyboard. In practice, the playback aspect proved to be far more popular then the recording aspect, and today the two functions are nearly always completely separated. What we call a “sampler” today is simply a system for replaying previously-prepared sounds (“samples”).

### Classes

[`class AmplitudeTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/amplitudetap)

Tap to do amplitude analysis on any node. start() will add the tap, and stop() will remove it.

[`class AppleSampler`](http://www.audiokit.io/AudioKit/documentation/audiokit/applesampler)

Sampler audio generation.

[`class AppleSequencer`](http://www.audiokit.io/AudioKit/documentation/audiokit/applesequencer)

Sequencer based on tried-and-true CoreAudio/MIDI Sequencing

[`class AudioEngine`](http://www.audiokit.io/AudioKit/documentation/audiokit/audioengine)

AudioKit’s wrapper for AVAudioEngine

[`class AudioPlayer`](http://www.audiokit.io/AudioKit/documentation/audiokit/audioplayer)

Wrapper for AVAudioPlayerNode with a simplified API. The player exists in two interchangeable modes either playing from memory (isBuffered) or streamed from disk. Longer files are recommended to be played from disk. If you want seamless looping then buffer it. You can still loop from disk, but the loop will not be totally seamless.

[`class BandPassFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/bandpassfilter)

AudioKit version of Apple’s BandPassFilter Audio Unit

[`class BaseTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/basetap)

Base class for AudioKit taps using AVAudioEngine installTap

[`class Compressor`](http://www.audiokit.io/AudioKit/documentation/audiokit/compressor)

AudioKit version of Apple’s Compressor Audio Unit

[`class Decimator`](http://www.audiokit.io/AudioKit/documentation/audiokit/decimator)

AudioKit version of Apple’s Decimator Audio Unit

[`class Delay`](http://www.audiokit.io/AudioKit/documentation/audiokit/delay)

AudioKit version of Apple’s Delay Audio Unit

[`class Distortion`](http://www.audiokit.io/AudioKit/documentation/audiokit/distortion)

AudioKit version of Apple’s Distortion Audio Unit

[`class DynamicsProcessor`](http://www.audiokit.io/AudioKit/documentation/audiokit/dynamicsprocessor)

AudioKit version of Apple’s DynamicsProcessor Audio Unit

[`class Expander`](http://www.audiokit.io/AudioKit/documentation/audiokit/expander)

AudioKit version of Apple’s Expander Audio Unit

[`class FFTTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/ffttap)

FFT Calculation for any node

[`class FormatConverter`](http://www.audiokit.io/AudioKit/documentation/audiokit/formatconverter)

FormatConverter wraps the more complex AVFoundation and CoreAudio audio conversions in an easy to use format.

[`class HighPassFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/highpassfilter)

AudioKit version of Apple’s HighPassFilter Audio Unit

[`class HighShelfFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/highshelffilter)

AudioKit version of Apple’s HighShelfFilter Audio Unit

[`class LowPassFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/lowpassfilter)

AudioKit version of Apple’s LowPassFilter Audio Unit

[`class LowShelfFilter`](http://www.audiokit.io/AudioKit/documentation/audiokit/lowshelffilter)

AudioKit version of Apple’s LowShelfFilter Audio Unit

[`class MIDI`](http://www.audiokit.io/AudioKit/documentation/audiokit/midi)

MIDI input and output handler

[`class MIDICallbackInstrument`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicallbackinstrument)

MIDI Instrument that triggers functions on MIDI note on/off commands This is used mostly with the AppleSequencer sending to a MIDIEndpointRef Another callback instrument, CallbackInstrument You will need to enable “Background Modes - Audio” in your project for this to work.

[`class MIDIClockListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiclocklistener)

This class is used to count midi clock events and inform observers every 24 pulses (1 quarter note)

[`class MIDIFileTrackNoteMap`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletracknotemap)

Get the MIDI events which occur inside a MIDI track in a MIDI file This class should only be initialized once if possible - (many calculations are involved)

[`class MIDIHelper`](http://www.audiokit.io/AudioKit/documentation/audiokit/midihelper)

Helper functions for MIDI

[`class MIDIInstrument`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiinstrument)

A version of Instrument specifically targeted to instruments that should be triggerable via MIDI or sequenced with the sequencer.

[`class MIDIMonoPolyListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midimonopolylistener)

This class probably needs to support observers as well so that a client may be able to be notified of state changes

[`class MIDINoteDuration`](http://www.audiokit.io/AudioKit/documentation/audiokit/midinoteduration)

MIDI Note Duration - helpful for storing length of MIDI notes

[`class MIDIOMNIListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiomnilistener)

This class probably needs to support observers as well so that a client may be able to be notified of state changes

[`class MIDIPlayer`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiplayer)

Simple MIDI Player based on Apple’s AVAudioSequencer which has limited capabilities

[`class MIDISampler`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisampler)

MIDI receiving Sampler

[`class MIDISystemRealTimeListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemrealtimelistener)

This MIDIListener looks for midi system real time (SRT) midi system messages.

[`class MIDITempoListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditempolistener)

A AudioKit midi listener that looks at midi clock messages and calculates a BPM

[`class MIDITimeout`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditimeout)

A class that performs an action block, then starts a timer that catches timeout conditions where a response is not received. Since the external caller is responsible for what constitutes success, they are expected to call succeed() which will prevent timeout from happening.

[`class MatrixMixer`](http://www.audiokit.io/AudioKit/documentation/audiokit/matrixmixer)

[`class Mixer`](http://www.audiokit.io/AudioKit/documentation/audiokit/mixer)

AudioKit version of Apple’s Mixer Node. Mixes a variadic list of Nodes.

[`class MultiChannelInputNodeTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/multichannelinputnodetap)

MultiChannelInputNodeTap is a tap intended to process multiple channels of audio from AVAudioInputNode, or the AVAudioEngine’s inputNode. In the case of the engine the input node will have a set of channels that correspond to the hardware being used. This class will read from those channels and write discrete mono files for each similar to how common DAWs record multiple channels from multiple inputs.

[`class MultiSegmentAudioPlayer`](http://www.audiokit.io/AudioKit/documentation/audiokit/multisegmentaudioplayer)

audio player that can schedule many file segments

[`class MusicTrackManager`](http://www.audiokit.io/AudioKit/documentation/audiokit/musictrackmanager)

Wrapper for internal Apple MusicTrack

[`class NodeParameter`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodeparameter)

NodeParameter wraps AUParameter in a user-friendly interface and adds some AudioKit-specific functionality. New version for use with Parameter property wrapper.

[`class NodeRecorder`](http://www.audiokit.io/AudioKit/documentation/audiokit/noderecorder)

Simple audio recorder class, requires a minimum buffer length of 128 samples (.short)

[`class ParametricEQ`](http://www.audiokit.io/AudioKit/documentation/audiokit/parametriceq)

AudioKit version of Apple’s ParametricEQ Audio Unit

[`class PeakLimiter`](http://www.audiokit.io/AudioKit/documentation/audiokit/peaklimiter)

AudioKit version of Apple’s PeakLimiter Audio Unit

[`class PlaygroundNoiseGenerator`](http://www.audiokit.io/AudioKit/documentation/audiokit/playgroundnoisegenerator)

Pure Swift Noise Generator

[`class PlaygroundOscillator`](http://www.audiokit.io/AudioKit/documentation/audiokit/playgroundoscillator)

Pure Swift oscillator

[`class PresetBuilder`](http://www.audiokit.io/AudioKit/documentation/audiokit/presetbuilder)

Builds presets for Apple sampler to read from

[`class RawDataTap`](http://www.audiokit.io/AudioKit/documentation/audiokit/rawdatatap)

Get the raw data for any node

[`class RawDataTap2`](http://www.audiokit.io/AudioKit/documentation/audiokit/rawdatatap2)

[`class Reverb`](http://www.audiokit.io/AudioKit/documentation/audiokit/reverb)

AudioKit version of Apple’s Reverb Audio Unit

[`class RingModulator`](http://www.audiokit.io/AudioKit/documentation/audiokit/ringmodulator)

AudioKit version of Apple’s RingModulator Audio Unit

[`class Settings`](http://www.audiokit.io/AudioKit/documentation/audiokit/settings)

Global settings for AudioKit

[`class Table`](http://www.audiokit.io/AudioKit/documentation/audiokit/table)

A table of values accessible as a waveform or lookup mechanism

[`class ThreadLockedAccessor`](http://www.audiokit.io/AudioKit/documentation/audiokit/threadlockedaccessor)

A property wrapper that ensures atomic access to a value, meaning thread-safe with implicit serial read/write access.

[`class TimePitch`](http://www.audiokit.io/AudioKit/documentation/audiokit/timepitch)

AudioKit version of Apple’s TimePitch Audio Unit

[`class VariSpeed`](http://www.audiokit.io/AudioKit/documentation/audiokit/varispeed)

AudioKit version of Apple’s VariSpeed Audio Unit

[`class WaveformDataRequest`](http://www.audiokit.io/AudioKit/documentation/audiokit/waveformdatarequest)

Request to get data out of an audio file

### Protocols

[`protocol DynamicWaveformNode`](http://www.audiokit.io/AudioKit/documentation/audiokit/dynamicwaveformnode)

Protocol mostly to support DynamicOscillator in SoundpipeAudioKit, but could be used elsewhere

[`protocol HasAudioEngine`](http://www.audiokit.io/AudioKit/documentation/audiokit/hasaudioengine)

Protocol prescribing that something ahs an audio “engine”

[`protocol HasInternalConnections`](http://www.audiokit.io/AudioKit/documentation/audiokit/hasinternalconnections)

[`protocol MIDIBeatObserver`](http://www.audiokit.io/AudioKit/documentation/audiokit/midibeatobserver)

Protocol so that clients may observe beat events

[`protocol MIDIFileChunk`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifilechunk)

MIDI File Chunk Protocol

[`protocol MIDIListener`](http://www.audiokit.io/AudioKit/documentation/audiokit/midilistener)

MIDI Listener protocol

[`protocol MIDIMessage`](http://www.audiokit.io/AudioKit/documentation/audiokit/midimessage)

MIDI Message Protocol

[`protocol MIDISystemRealTimeObserver`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemrealtimeobserver)

MIDI System Real Time Observer

[`protocol MIDITempoObserver`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditempoobserver)

MIDI Tempo Observer

[`protocol MIDITransformer`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditransformer)

MIDI Transformer converting an array of MIDI events into another array

[`protocol MultiChannelInputNodeTapDelegate`](http://www.audiokit.io/AudioKit/documentation/audiokit/multichannelinputnodetapdelegate)

Delegate for the Multi-Channel Input Node Tap

[`protocol NamedNode`](http://www.audiokit.io/AudioKit/documentation/audiokit/namednode)

Protocol to allow nice printouts for debugging connections

[`protocol Node`](http://www.audiokit.io/AudioKit/documentation/audiokit/node)

Node in an audio graph.

[`protocol NodeParameterType`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodeparametertype)

Base protocol for any type supported by @Parameter

[`protocol ObserverProtocol`](http://www.audiokit.io/AudioKit/documentation/audiokit/observerprotocol)

Observer protocol

[`protocol Occupiable`](http://www.audiokit.io/AudioKit/documentation/audiokit/occupiable)

Anything that can hold a value (strings, arrays, etc)

[`protocol ProcessesPlayerInput`](http://www.audiokit.io/AudioKit/documentation/audiokit/processesplayerinput)

Protocol prescribing that something has an audio “player”

[`protocol StreamableAudioSegment`](http://www.audiokit.io/AudioKit/documentation/audiokit/streamableaudiosegment)

[`protocol Tap`](http://www.audiokit.io/AudioKit/documentation/audiokit/tap)

### Structures

[`struct AppleMIDIEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/applemidievent)

Apple MIDI Event

[`struct Device`](http://www.audiokit.io/AudioKit/documentation/audiokit/device)

Wrapper for audio device selection

[`struct Duration`](http://www.audiokit.io/AudioKit/documentation/audiokit/duration)

Container for the notion of time in sequencing

[`struct EndpointInfo`](http://www.audiokit.io/AudioKit/documentation/audiokit/endpointinfo)

Information about a MIDI Endpoint

[`struct MIDICustomMetaEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicustommetaevent)

MIDI Custom Meta Event

[`struct MIDIEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midievent)

A container for the values that define a MIDI event

[`struct MIDIFile`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifile)

MIDI File

[`struct MIDIFileChunkEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifilechunkevent)

MIDI File Chunk Event

[`struct MIDIFileTempoTrack`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletempotrack)

MIDI File Tempo Track

[`struct MIDIFileTrack`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletrack)

MIDI File Track

[`struct MIDIFileTrackChunk`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifiletrackchunk)

MIDI File Track Chunk

[`struct MIDINoteData`](http://www.audiokit.io/AudioKit/documentation/audiokit/midinotedata)

Struct holding relevant data for MusicTrackManager note events

[`struct MIDIProgramChangeEvent`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiprogramchangeevent)

MIDI Program Change Event

[`struct MIDIStatus`](http://www.audiokit.io/AudioKit/documentation/audiokit/midistatus)

MIDI Status Message

[`struct MIDISysExMessage`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisysexmessage)

MIDI System Exclusive Message

[`struct MIDIVariableLengthQuantity`](http://www.audiokit.io/AudioKit/documentation/audiokit/midivariablelengthquantity)

MIDI Variable Length Quantity

[`struct NodeParameterDef`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodeparameterdef)

Definition or specification of a node parameter

[`struct Parameter`](http://www.audiokit.io/AudioKit/documentation/audiokit/parameter)

Wraps NodeParameter so we can easily assign values to it.

[`struct TimeSignature`](http://www.audiokit.io/AudioKit/documentation/audiokit/timesignature)

Time Signature

### Variables

[`let noteOffByte: MIDIByte`](http://www.audiokit.io/AudioKit/documentation/audiokit/noteoffbyte)

Note off shortcut

[`let noteOnByte: MIDIByte`](http://www.audiokit.io/AudioKit/documentation/audiokit/noteonbyte)

Note on shortcut

### Functions

[`func CheckError(OSStatus)`](http://www.audiokit.io/AudioKit/documentation/audiokit/checkerror\(_:\))

[`func Log(Any?..., log: OSLog, type: OSLogType, file: String, function: String, line: Int)`](http://www.audiokit.io/AudioKit/documentation/audiokit/log\(_:log:type:file:function:line:\))

Wrapper for os\_log logging system. It currently shows filename, function, and line number, but that might be removed if it shows any negative performance impact (Apple recommends against it).

[`func ceil(Duration) -> Duration`](http://www.audiokit.io/AudioKit/documentation/audiokit/ceil\(_:\))

Upper bound of a duration, in beats

[`func fourCC(String) -> UInt32`](http://www.audiokit.io/AudioKit/documentation/audiokit/fourcc\(_:\))

Helper function to convert codes for Audio Units

[`func loadAudioSignal(audioURL: URL) -> (signal: [Float], rate: Double, frameCount: Int)?`](http://www.audiokit.io/AudioKit/documentation/audiokit/loadaudiosignal\(audiourl:\))

Load the audio information from a url to an audio file Returns the floating point array of values, sample rate, and frame count

### Operators

[`func + (AVAudioTime, Int) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/+\(_:_:\)-5ji1p)

Addition

[`func + (AVAudioTime, Double) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/+\(_:_:\)-5v492)

Addition

[`func - (AVAudioTime, Double) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/-\(_:_:\)-5p85m)

Subtraction

[`func - (AVAudioTime, Int) -> AVAudioTime`](http://www.audiokit.io/AudioKit/documentation/audiokit/-\(_:_:\)-5yu8p)

Subtraction

### Type Aliases

[`typealias AUValue`](http://www.audiokit.io/AudioKit/documentation/audiokit/auvalue)

Normally set in AVFoundation or AudioToolbox, we create it here so users don’t have to import those frameworks

[`typealias BPM`](http://www.audiokit.io/AudioKit/documentation/audiokit/bpm)

Type alias for Tempo to make it clear when we’re working with tempo in beats per minute

[`typealias BPMType`](http://www.audiokit.io/AudioKit/documentation/audiokit/bpmtype)

Type to store tempo in BeatsPerMinute

[`typealias CMIDICallback`](http://www.audiokit.io/AudioKit/documentation/audiokit/cmidicallback)

Callback function that can be called from C

[`typealias CVoidCallback`](http://www.audiokit.io/AudioKit/documentation/audiokit/cvoidcallback)

Callback function that can be called from C

[`typealias DeviceID`](http://www.audiokit.io/AudioKit/documentation/audiokit/deviceid)

DeviceID isan AudioDeviceID on macOS

[`typealias FloatChannelData`](http://www.audiokit.io/AudioKit/documentation/audiokit/floatchanneldata)

2D array of stereo audio data

[`typealias MIDIByte`](http://www.audiokit.io/AudioKit/documentation/audiokit/midibyte)

MIDI Type Alias making it clear that you’re working with MIDI

[`typealias MIDICallback`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicallback)

Function type for MIDI callbacks

[`typealias MIDIChannel`](http://www.audiokit.io/AudioKit/documentation/audiokit/midichannel)

MIDI Type Alias making it clear that you’re working with MIDI

[`typealias MIDINoteNumber`](http://www.audiokit.io/AudioKit/documentation/audiokit/midinotenumber)

MIDI Type Alias making it clear that you’re working with MIDI

[`typealias MIDIVelocity`](http://www.audiokit.io/AudioKit/documentation/audiokit/midivelocity)

MIDI Type Alias making it clear that you’re working with MIDI

[`typealias MIDIWord`](http://www.audiokit.io/AudioKit/documentation/audiokit/midiword)

MIDI Type Alias making it clear that you’re working with MIDI

[`typealias SampleIndex`](http://www.audiokit.io/AudioKit/documentation/audiokit/sampleindex)

Sample type alias making it clear when you’re working with samples

### Enumerations

[`enum AnalysisMode`](http://www.audiokit.io/AudioKit/documentation/audiokit/analysismode)

Type of analysis

[`enum AudioFileFormat`](http://www.audiokit.io/AudioKit/documentation/audiokit/audiofileformat)

[`enum DisconnectStrategy`](http://www.audiokit.io/AudioKit/documentation/audiokit/disconnectstrategy)

Describes a way to disconnect a node from another node

[`enum FFTValidBinCount`](http://www.audiokit.io/AudioKit/documentation/audiokit/fftvalidbincount)

Valid results of 2^n where n is an integer

[`enum MIDIControl`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicontrol)

Common name of MIDI Control number from MIDIByte

[`enum MIDICustomMetaEventType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midicustommetaeventtype)

MIDI Custom Meta Event Type

[`enum MIDIFileChunkType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midifilechunktype)

MIDI FIle Chunk type

[`enum MIDIStatusType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midistatustype)

Potential MIDI Status messages

[`enum MIDISystemCommand`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemcommand)

MIDI System Command

[`enum MIDISystemCommandType`](http://www.audiokit.io/AudioKit/documentation/audiokit/midisystemcommandtype)

MIDI System Command Type

[`enum MIDITimeFormat`](http://www.audiokit.io/AudioKit/documentation/audiokit/miditimeformat)

MIDI Time Format

[`enum MusicalDuration`](http://www.audiokit.io/AudioKit/documentation/audiokit/musicalduration)

[`enum NodeStatus`](http://www.audiokit.io/AudioKit/documentation/audiokit/nodestatus)

Keep track of a node status

[`enum SampleTriggerMode`](http://www.audiokit.io/AudioKit/documentation/audiokit/sampletriggermode)

Type of triggering to use

[`enum StereoMode`](http://www.audiokit.io/AudioKit/documentation/audiokit/stereomode)

How to deal with stereo signals

[`enum TableType`](http://www.audiokit.io/AudioKit/documentation/audiokit/tabletype)

Supported default table types -->