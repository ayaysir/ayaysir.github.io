---
title: "SwiftUI: Representable을 이용해서 UIViewController 띄우기"
date: 2023-03-11
categories: 
  - "DevLog"
  - "SwiftUI"
---

\[rcblock id="5440"\]

#### **소개**

_**SwiftUI**_ 환경에서 _**UIKit**_을 이용해 만든 `UIViewController`를 띄우는 방법에 대한 소개입니다.

예를 들어, `MPMediaPickerController` (`import MediaPlayer` 필요)는 `UIViewController`를 상속받은 뷰 컨트롤러인데 UIKit 환경에서는 `self.present(viewController, ...)`로 바로 띄울 수 있습니다. SwiftUI에서도 이 작업이 가능하지만 복잡한 과정이 필요합니다.

 

#### **방법**

##### **1: UIViewControllerRepresentable을 준수하는 구조체 생성**

아래와 같이 `UIViewControllerRepresentable`를 준수(conform)하는 구조체(`struct`)를 생성합니다.

`UIViewControllerRepresentable`는 `UIKit`의 뷰 컨트롤러를 나타내는 `View`입니다.

일반적으로 `[컨트롤러 이름] + View` 라는 이름으로 구조체 이름을 작성하지만 여기서는 편의를 위해 임의로 `MPMediaPickerControllerRP`라는 이름으로 작성했습니다.

```
struct MPMediaPickerControllerRP: UIViewControllerRepresentable {
    
    // ... //
}
```

 

##### **2: typealias로 나타내고자 하는 UIViewController 지정**

`MPMediaPickerControllerRP` 구조체 안에 `typealias`를 추가합니다.

```
typealias UIViewControllerType = MPMediaPickerController
```

 

##### **3: makeUIViewController와 updateUIViewController 추가**

- **makeUIViewController**
    - `UIViewController`를 생성하고 초기화를 수행하는 함수입니다.
- **updateUIViewController**
    - `UIViewController`의 업데이트가 필요할 때 호출됩니다.
    - 이 위치에서 `UIViewController`에 필요한 데이터 또는 정보를 갱신해야 합니다.

 

이 예제에서는 `makeUIViewController`만 사용합니다.

```
struct MPMediaPickerControllerRP: UIViewControllerRepresentable {
    
    // ... //
    
    let picker = MPMediaPickerController(mediaTypes: .music)

    // ... //
    
    func makeUIViewController(context: Context) -> UIViewControllerType {
        picker.allowsPickingMultipleItems = false
        return picker
    }
    
    func updateUIViewController(_ uiViewController: MPMediaPickerController, context: Context) {}
    
    // ... //
}
```

- `makeUIViewController` 함수에서 `UIViewControllerType(=>MPMediaPickerController)`를 리턴하도록 지정한 뒤, 해당 뷰 컨트롤러 인스턴스를 리턴합니다.

 

##### **4: 버튼을 누르면 MPMediaPickerControllerRP가 나타나도록 하기**

```
struct ContentView: View {
    /*
     @State로 선언한 프로퍼티는 값이 변경되면 뷰 계층 구조의 부분을 업데이트
     @State를 자식 뷰에 전달하면 부모에서 값이 변경될 때마다 자식을 업데이트
     단, 자식 뷰에서 값을 수정하려면, 부모에서 자식으로 Binidng을 전달하여 자식 뷰에서 값을 수정이 가능
     */
    @State var isOpenMusicPickerView = false
    
    var albums: [AlbumInfo] = []
    var songQuery: SongQuery = SongQuery()
    
    var body: some View {
        VStack {
            // ... //
            Button {
                isOpenMusicPickerView = true
            } label: {
                Text("Select a music from library...")
            }.sheet(isPresented: $isOpenMusicPickerView) {
                MPMediaPickerControllerRP()
            }
        }
        // ... //
    }
}

```

- **sheet(isPresented: $isOpenMusicPickerView)**
    - `sheet`란 아래와 같이 화면이 완전히 겹쳐지지 않고 일부분만 겹친 형태의 팝업을 말합니다.  ![](/assets/img/wp-content/uploads/2023/03/Sheets-in-SwiftUI.jpg)
    - `@State` 변수인 `isOpenMusicPickerView`가 `true`가 되면 뷰 컨트롤러가 팝업됩니다.

 

#### **Delegate 사용하기**

`MPMediaPickerController`에는 다음과 같은 `delegate` 함수가 있습니다.

```
func mediaPicker(_ mediaPicker: MPMediaPickerController, didPickMediaItems mediaItemCollection: MPMediaItemCollection) {
    // ... //
}
```

앞의 섹션에서 뷰 컨트롤러를 띄우는 것 까지는 성공했는데, `delegate`는 어떻게 처리해야 할까요?

`Coordinator`라는 것을 이용하여 처리할 수 있습니다.

구체적인 방법은 다음과 같습니다.

 

##### **사전 작업**

노래의 메타데이터를 담은 구조체 `MediaMetadata`를 생성합니다.

```swift
import UIKit

struct MediaMetadata {
    let title: String
    let artist: String
    let albumTitle: String
    let duration: TimeInterval
    let albumArtImage: UIImage?
}
```

 

##### **1: Representable 구조체 안에 Coordinator 이너 클래스 생성**

##### **2: Coordinator 클래스 안에 사용하고자 하는 딜리게이트 함수 추가**

##### **3: 생성자에서 metadataCallback과 delegate = self 연결**

```
struct MPMediaPickerControllerRP: UIViewControllerRepresentable {
    
    // ... //

    typealias MetadataCallback = (MediaMetadata) -> Void
    var metadataCallback: MetadataCallback

    // ... //
    
    class Coordinator: NSObject, MPMediaPickerControllerDelegate {
        
        // 데이터를 전달하는 콜백(클로저) 함수
        var metadataCallback: MetadataCallback
        
        init(_ viewController: MPMediaPickerController, metadataCallback: @escaping MetadataCallback) {
            self.metadataCallback = metadataCallback
            super.init()
            viewController.delegate = self
        }
        
        // Delegate function
        func mediaPicker(_ mediaPicker: MPMediaPickerController, didPickMediaItems mediaItemCollection: MPMediaItemCollection) {
            let media = mediaItemCollection.items[0]
            let title = media.title ?? "unknown title"
            let artist = media.artist ?? "unknown artist"
            let albumTitle = media.albumTitle ?? "unknown album title"
            let duration = media.playbackDuration
            let albumArtImage = media.artwork?.image(at: .zero)
            let metadata = MediaMetadata(title: title, artist: artist, albumTitle: albumTitle, duration: duration, albumArtImage: albumArtImage)

            // 데이터 밖으로 내보내기
            metadataCallback(metadata)
            
            mediaPicker.dismiss(animated: true)
        }
    }
}
```

- 대리자 함수 중 `func mediaPicker(...didPickMediaItems...)`를 사용할 예정이므로 해당 함수를 `Coordinator` 클래스 안에 추가합니다.
- 대리자 함수 안에서 생성된 데이터를 밖에서 사용하려면 콜백(클로저) 를 사용합니다. `metadataCallback`이 그 역할을 합니다.

 

##### **4: Representable 구조체 안에 makeCoordinator() 함수 추가**

```
// Representable에서 delegate 사용
func makeCoordinator() -> Coordinator {
    Coordinator(picker, metadataCallback: metadataCallback)
}
```

- 여기서 반환된 `Coordinator` 인스턴스를 통해 외부에서도 `delegate`를 사용할 수 있게 됩니다.

 

##### **5: MPMediaPickerControllerRP()에 metadataCallback 부분 (트레일링 클로저) 추가하기**

```
Button {
    isOpenMusicPickerView = true
} label: {
    Text("Select a music from library...")
}.sheet(isPresented: $isOpenMusicPickerView) {
    MPMediaPickerControllerRP { metadata in
        // coordinator에서 밖으로 꺼낸 데이터
        print("metadata outside:", metadata)
        mediaTitle = metadata.title
        mediaSubtitle = "\(metadata.artist) - \(metadata.albumTitle)"
        albumImage = metadata.albumArtImage
    }
}
```

- 기존의 `MPMediaPickerControllerRP()` 대신 `MPMediaPickerControllerRP(metadata:)`로 대체합니다.
    - 트레일링 클로저를 이용해 위와 같은 형태로 축약할 수 있습니다.
- 하이라이트된 부분과 같이 `Coordinator` 외부로 전송된 데이터(`metadata`)를 이용해 해야 할 작업을 처리합니다.

 

<!-- https://giphy.com/gifs/EIAJUrg6zH5Hj5i2Rw -->
![](https://)

 

##### **전체 코드 (ContentView.swift)**

```swift
import SwiftUI
import MediaPlayer

struct ContentView: View {
    /*
     @State로 선언한 프로퍼티는 값이 변경되면 뷰 계층 구조의 부분을 업데이트
     @State를 자식 뷰에 전달하면 부모에서 값이 변경될 때마다 자식을 업데이트
     단, 자식 뷰에서 값을 수정하려면, 부모에서 자식으로 Binidng을 전달하여 자식 뷰에서 값을 수정이 가능
     */
    @State var statusText = "Ready to play..."
    @State var isOpenMusicPickerView = false
    @State var mediaTitle = "Select a music..."
    @State var mediaSubtitle = ""
    @State var albumImage: UIImage? = UIImage(named: "Adiemus II")
    
    var albums: [AlbumInfo] = []
    var songQuery: SongQuery = SongQuery()
    
    var body: some View {
        VStack {
            Spacer()
            // 이미지 사이즈 조정
            Image(uiImage: albumImage ?? UIImage())
                .resizable()
                .frame(width: 380, height: 380)
            Spacer()
            
            // 각종 버튼 (HStack)
            HStack {
                Spacer()
                Button {
                    statusText = "Backward"
                } label: {
                    Image(systemName: "backward.end.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.black)
                }
                Spacer()
                Button {
                    statusText = "Play"
                } label: {
                    Image(systemName: "play.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.black)
                }
                Spacer()
                Button {
                    statusText = "Afterward"
                } label: {
                    Image(systemName: "forward.end.fill")
                        .font(.system(size: 50))
                        .foregroundColor(.black)
                }
                Spacer()
            }
            // Spacer 높이 변경
            Spacer().frame(height: 25)
            
            Group {
                Text(mediaTitle)
                    .font(.system(size: 25, weight: .bold))
                Text(mediaSubtitle)
                    .font(.system(size: 18))
                Spacer()
                Text(statusText)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Button {
                isOpenMusicPickerView = true
            } label: {
                Text("Select a music from library...")
            }.sheet(isPresented: $isOpenMusicPickerView) {
                MPMediaPickerControllerRP { metadata in
                    // coordinator에서 밖으로 꺼낸 데이터
                    print("metadata outside:", metadata)
                    mediaTitle = metadata.title
                    mediaSubtitle = "\(metadata.artist) - \(metadata.albumTitle)"
                    albumImage = metadata.albumArtImage
                }
            }
        }
        .padding()
        .onAppear {
            MPMediaLibrary.requestAuthorization { status in
                switch status {
                case .notDetermined:
                    print("status: notDetermined")
                case .denied:
                    print("status: denied")
                case .restricted:
                    print("status: restricted")
                case .authorized:
                    print("status: authorized")
                    
                @unknown default:
                    print("status: unknown default")
                }
            }
        }
    }
}

struct MPMediaPickerControllerRP: UIViewControllerRepresentable {
    
    typealias UIViewControllerType = MPMediaPickerController
    typealias MetadataCallback = (MediaMetadata) -> Void
    
    let picker = MPMediaPickerController(mediaTypes: .music)
    var metadataCallback: MetadataCallback
    
    func makeUIViewController(context: Context) -> UIViewControllerType {
        picker.allowsPickingMultipleItems = false
        return picker
    }
    
    func updateUIViewController(_ uiViewController: MPMediaPickerController, context: Context) {}
    
    // Representable에서 delegate 사용
    func makeCoordinator() -> Coordinator {
        Coordinator(picker, metadataCallback: metadataCallback)
    }
    
    class Coordinator: NSObject, MPMediaPickerControllerDelegate {
        
        // 데이터를 전달하는 콜백(클로저) 함수
        var metadataCallback: MetadataCallback
        
        init(_ viewController: MPMediaPickerController, metadataCallback: @escaping MetadataCallback) {
            self.metadataCallback = metadataCallback
            super.init()
            viewController.delegate = self
        }
        
        // Delegate function
        func mediaPicker(_ mediaPicker: MPMediaPickerController, didPickMediaItems mediaItemCollection: MPMediaItemCollection) {
            let media = mediaItemCollection.items[0]
            let title = media.title ?? "unknown title"
            let artist = media.artist ?? "unknown artist"
            let albumTitle = media.albumTitle ?? "unknown album title"
            let duration = media.playbackDuration
            let albumArtImage = media.artwork?.image(at: .zero)
            let metadata = MediaMetadata(title: title, artist: artist, albumTitle: albumTitle, duration: duration, albumArtImage: albumArtImage)
            
            // 방법 1: system music player로 재생
            let musicPlayer = MPMusicPlayerController.systemMusicPlayer
            musicPlayer.setQueue(with: mediaItemCollection)
            musicPlayer.play()
            
            // 데이터 밖으로 내보내기
            metadataCallback(metadata)
            
            mediaPicker.dismiss(animated: true)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

```

 

##### **출처**

- [Implement delegates within SwiftUI Views](https://stackoverflow.com/questions/57281389/implement-delegates-within-swiftui-views)
- [\[iOS\] SwiftUI와 UIKit 함께 사용하기](https://mildwhale.tistory.com/37)
