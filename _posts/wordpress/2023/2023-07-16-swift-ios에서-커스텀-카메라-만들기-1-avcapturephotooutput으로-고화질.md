---
title: "Swift: iOS에서 커스텀 카메라 만들기 (2) – AVCapturePhotoOutput으로 고화질 사진 찍기"
date: 2023-07-16
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

이전에도 한 차례 커스텀 카메라에 대해 다룬적이 있는데 해당 방식은 비디오의 프레임을 캡처해서 저장하는 방식이었습니다.

- [Swift: iOS에서 커스텀 카메라 만들기 (1) - 비디오 캡처 방식 활용](http://yoonbumtae.com/?p=5762)

이러한 방식에 대한 장점도 많이 있지만, 해상도가 상대적으로 낮은 단점도 있어서 다른 방식인 `AVCapturePhotoOutput`을 이용해 고화질의 사진을 얻는 방법에 대해 알아보겠습니다.

스토리보드(UIKit) 기준으로 진행됩니다.

 

### **방법**

#### **Step 0: Info.plist의 권한 설정 및 import**

아래와 같이 `Info.plist` 파일에 두 개의 권한 허용 여부를 묻는 메시지를 추가합니다.

 ![](/assets/img/wp-content/uploads/2023/07/screenshot-2023-07-16-pm-4.28.02-copy.jpg)

- **Privacy - Photo Library Usage Description (**`NSPhotoLibraryUsageDescription`**)**
    - 사진 라이브러리에 접근하기 위한 권한입니다. 거부시 사진을 저장할 수 없습니다.
- **Privacy - Camera Usage Description (**`NSCameraUsageDescription`**)**
    - 카메라 기기에 접근하기 위한 권한입니다. 거부시 카메라 기능을 사용할 수 없습니다.

 

그리고 뷰 컨트롤러의 코드에 아래를 추가로 임포트합니다.

- `import AVFoundation`
- `import Photos`

 

#### **Step 1: 뷰 컨트롤러에 카메라, 이미지 관련 멤버 변수 추가**

```
// MARK: - Vars
var previewLayer: AVCaptureVideoPreviewLayer!
var captureSession: AVCaptureSession!
var backCameraInput: AVCaptureDeviceInput!
var frontCameraInput: AVCaptureDeviceInput!

var photoSettings: AVCapturePhotoSettings {
    // NSInvalidArgumentException', reason: '*** -[AVCapturePhotoOutput capturePhotoWithSettings:delegate:]
    // Settings may not be re-used'
    
    var settings = AVCapturePhotoSettings()
    // photoOutput 의 codec의 hevc 가능시 photoSettings의 codec을 hevc로 설정하는 코드입니다.
    // hevc 불가능한 경우에는 jpeg codec을 사용하도록 합니다.
    if photoOutput.availablePhotoCodecTypes.contains(.hevc) {
        settings = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.hevc])
    } else {
        settings = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.jpeg])
    }
    
    return settings
}
var photoOutput: AVCapturePhotoOutput = AVCapturePhotoOutput()
```

- `previewLayer`: 실시간으로 카메라에 비쳐지는 모습을 보기 위한 영역의 레이어입니다.
- `captureSession`: 캡처 세션은 카메라의 입출력 신호 및 데이터를 중재하는 역할을 합니다.
- `back/frontCameraInput`: 전/후면 카메라로 들어오는 신호들을 처리하는 역할을 합니다.
- `photoSettings`: `photoOutput`에서 사용할 각종 세팅들을 지정할 수 있습니다.
    - 세팅은 재지정할 수 없기 때문에 이 단계에서 computed property로 미리 지정합니다.
- `photoOutput`: [`AVCapturePhotoOutput`](https://developer.apple.com/documentation/avfoundation/avcapturephotooutput)은 기기의 카메라의 다양한 기능을 사용할 수 있도록 제공하는 인터페이스입니다.
    - 라이브 포토를 비롯한 다양한 사진 옵션을 설정할 수 있습니다.
    - 이번 예제에서 주요하게 사용할 기능입니다.

 

#### **Step 2: viewDidAppear(:\_)에 카메라 세팅 코드 작성**

카메라에 접근하기 위해 다음 두 가지 작업이 필요합니다.

1. 먼저 권한 허용 여부가 설정되지 않았다면 권한 허용 여부를 사용자한테 묻는 다이얼로그를 표시하고
2. 다음 카메라를 세팅합니다.

해당 과정을 코드로 기록하면 다음과 같습니다.

```
override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    
    checkCameraPermissions()
    setupPhotoCamera()
}
```

권한 설정 부분 `checkCameraPermissions()`은 아래 코드를 뷰 컨트롤러 내에 추가하면 되고 분량상 자세한 내용은 다루지 않겠습니다.

```
func checkCameraPermissions() {
    let cameraAuthStatus =  AVCaptureDevice.authorizationStatus(for: AVMediaType.video)
    switch cameraAuthStatus {
    case .authorized:
        return
    case .denied:
        // TODO: - 카메라 권한 허용 유도하는 기능
        abort()
    case .notDetermined:
        AVCaptureDevice.requestAccess(for: AVMediaType.video, completionHandler:
                                        { (authorized) in
            if(!authorized){
                // TODO: - 카메라 권한 허용 유도하는 기능
                abort()
            }
        })
    case .restricted:
        // 시스템 에러
        abort()
    @unknown default:
        fatalError()
    }
}
```

 

카메라 세팅은 다음 단계로 진행됩니다.

\[the\_ad id="3513"\]

##### **1: setupPhotoCamera() 추가**

먼저 메인 스레드가 아닌 다른 스레드에서 코드가 실행될 수 있도록 합니다. 그 이유는 실행 코드 중 `AVCaptureSession.startRunning()`이 해당 작업이 실행될 때까지 시스템 흐름이 멈추는 블록 호출(block call)이기 때문에 메인 스레드에 추가할 경우 UI가 멈출 수 있는 위험이 있기 때문입니다.

```
func setupPhotoCamera() {
    // 메인 스레드에서 실행 방지 - startRunning()이 차단 호출(block call)이기 때문
    DispatchQueue.global(qos: .userInitiated).async { [unowned self] in
        ...
    }
}
```

이하 단계 모두 `setupPhotoCamera()`의 스레드 클로저 내에 순차적으로 추가합니다.

 

##### **2: 카메라 세션 초기화 및 구성사항(configuration) 시작**

```
// 세션 초기화
captureSession = AVCaptureSession()
// 구성(configuration) 시작
captureSession.beginConfiguration()

```

- 카메라 입출력을 관리할 수 있는 `AVCaptureSession`을 초기화합니다.
- 해당 세션의 구성을 시작합니다. 나중에 커밋(commit)을 함으로써 구성 사항이 반영됩니다.

 

##### **3: 세션이 사진 프리셋을 지원하는 경우 해당 프리셋을 설정**

```
if captureSession.canSetSessionPreset(.photo) {
    captureSession.sessionPreset = .photo
}
```

 

##### **4: 광역 색상 지원 설정**

```
// 사용 가능한 경우 세션이 자동으로 광역 색상을 사용해야 하는지 여부를 지정합니다. (기본값 true)
captureSession.automaticallyConfiguresCaptureDeviceForWideColor = true
```

 

##### **5: 디바이스 변수에 전/후면 카메라 디바이스를 지정**

```
// 후면 카메라 디바이스
guard let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
    return
}

// 전면 카메라 디바이스
guard let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
    return
}
```

- 디바이스 변수는 인풋 신호를 받아들일 때 파라미터로 지정할 수 있습니다.

 

##### **6: 카메라 인풋을 기기로부터 받도록 지정하고, 세션의 인풋 목록에 추가**

```
// 생성된 captureSession에 device input을 생성 및 연결하고,
// device output을 연결하는 코드입니다.
do {
    backCameraInput = try AVCaptureDeviceInput(device: backCamera)
    frontCameraInput = try AVCaptureDeviceInput(device: frontCamera)
        
    // captureSession에 cameraInput을 받도록 설정
    captureSession.addInput(backCameraInput)
} catch  {
    debugPrint("Camera Input Error:", error.localizedDescription)
}

```

- 일반적으로 후면 카메라가 처음에 사용되므로 `backCamera`를 맨 처음 인풋 목록에 지정합니다.
    - 전/후면 카메라 전환 방법은 나중에 설명합니다.

 

##### **7: photoOutput을 캡처 세션의 아웃풋 목록에 추가**

```
// 고해상도의 이미지 캡처 가능 설정
// 16.0에서 deprecated됨
if #unavailable(iOS 16.0) {
    photoOutput.isHighResolutionCaptureEnabled = true
}

// CaptureSession에 photoOutput을 추가
captureSession.addOutput(photoOutput)
```

- iOS 16 미만인 경우 `isHighResolutionCaptureEnabled` 옵션을 `true`로 지정합니다.
    - 16버전 이상에서는 deprecated되었으며, 해당 옵션을 따로 지정하지 않아도 최대 해상도로 촬영됩니다.
- `addOutput`으로 `photoOutput`을 캡처 세션에 추가합니다.

 

##### **8: 카메라 미리보기 화면 추가**

카메라를 미리보기 할 수 없다면 내가 도대체 어떤 대상을 찍고 있고 어떤 모습으로 찍히는지 전혀 알 수 없을 것입니다.

아래 코드를 `setupPhotoCamera()` 내부에 추가합니다.

```
// Preview 화면 추가
DispatchQueue.main.async { [unowned self] in
    setCameraPreview()
}
```

- 미리보기는 UI 관련 기능이므로 메인 스레드에서 실행되어야 합니다.

 

다음 뷰 컨트롤러 내에 `setCameraPreview()` 함수를 추가합니다.

```
func setCameraPreview() {
    previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
    view.layer.insertSublayer(previewLayer, above: imgViewGuideOverlay.layer)
    previewLayer.frame = imgViewGuideOverlay.frame
    previewLayer.videoGravity = .resizeAspectFill   // 프레임 크기에 맞춰 리사이즈(비율 깨지지 않음)
}
```

- `AVCaptureVideoPreviewLayer를 사용해서 미리보기를 추가할 수 있습니다. UIKit의 레이어에 해당하는 오브젝트입니다.`
- 코드에는 나와있지 않지만 `imgViewGuideOverlay.frame`은 정방형(`1 : 1` 비율) 크기이며 카메라 미리보기를 이 크기로 지정하려고 합니다.
- `videoGravity`를 `.resizeAspectFill` 로 하면 비율이 깨지지 않으면서 해당하는 크기에 맞춰 확대 또는 축소해서 보여줍니다.
    - 이 부분을 따로 지정하지 않으면 프레임 사이즈와 관계없이 `3 : 4` 포트레이트로 보일 것입니다.

 

##### **9: 구성 사항 커밋 및 캡처 세션 실행**

```
// commit configuration: 단일 atomic 업데이트에서 실행 중인 캡처 세션의 구성에 대한 하나 이상의 변경 사항을 커밋합니다.
captureSession.commitConfiguration()
// 캡처 세션 실행
captureSession.startRunning()
```

- 구성 사항을 반영한 뒤 캡처 세션을 실행합니다.

 

**반드시 실제 기기에서 실행해야 합니다.**

여기까지 진행한 뒤 빌드 및 실행하면 카메라 미리보기가 작동할 것입니다.

![](https://media.giphy.com/media/BB1NydxehhNcdofc2S/giphy.gif)

<!-- \[the\_ad id="3020"\] -->

 

##### **10: 카메라 전/후면 전환 버튼 이벤트에 해당 기능 작성**

카메라 전/후면을 변경하는 코드는 다음과 같습니다. 전후 방향을 바꾸는 해당 `UIButton`의 이벤트로 지정합니다.

```
@IBAction func btnActChangeCameraPosition(_ sender: UIButton) {
    captureSession.beginConfiguration()
    
    switch captureSession.inputs[0] {
    case backCameraInput:
        // 후면에서 전면으로 전환
        captureSession.removeInput(backCameraInput)
        captureSession.addInput(frontCameraInput)
    case frontCameraInput:
        // 전면에서 후면으로 전환
        captureSession.removeInput(frontCameraInput)
        captureSession.addInput(backCameraInput)
    default:
        break
    }
    
    // commitConfiguration : captureSession 의 설정 변경이 완료되었음을 알리는 함수.
    captureSession.commitConfiguration()
}
```

 

#### **Step 3: 카메라 셔터 버튼 이벤트 코드 작성**

`capturePhoto(with:delegate:)`를 호출하면 카메라의 셔터 버튼을 누른 것과 같이 해당 이미지가 캡처됩니다. 참고로 기본 카메라에서 기능을 빌려오는 것이기 때문에 기본 카메라에서 무음 상태에서도 셔터음이 울린다면 여기서도 동일하게 울립니다.

```
@IBAction func btnActShutter(_ sender: UIButton) {
    photoOutput.capturePhoto(with: photoSettings, delegate: self)
}
```

이후 작업은 `delegate`에서 실행하게 되며, 이를 위해 뷰 컨트롤러가 `AVCapturePhotoCaptureDelegate`를 준수(conform)해야 합니다.

해당 대리자를 준수하는 뷰 컨트롤러의 `extension`을 추가합니다.

```
extension CameraViewController: AVCapturePhotoCaptureDelegate {
    
}
```

 

#### **Step 4: 사진을 라이브러리에 저장 기능 추가**

사진을 찍은 뒤 후처리까지 완료되면 `photoOutput(...didFinishProcessingPhoto...)`에 해당 사진이 `photo` 변수로 저장되어 있습니다. 이것을 라이브러리에 저장하도록 리퀘스트하면 됩니다.

`extension` 내부에 다음 메서드를 추가합니다.

```
/// capturePhoto 이후에 capture process 가 완료된 이미지를 저장하는 메서드
func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
    guard error == nil else {
        print("Error capturing photo:", error!.localizedDescription)
        return
    }
    
    // 권한 요청
    PHPhotoLibrary.requestAuthorization { status in
        guard status == .authorized else {
            return
        }
        
        // 사진 앨범에 저장
        PHPhotoLibrary.shared().performChanges({
            let creationRequest = PHAssetCreationRequest.forAsset()
            creationRequest.addResource(with: .photo, data: photo.fileDataRepresentation()!, options: nil)
        }, completionHandler: nil)
    }
}
```

- **권한 요청:** 사진 라이브러리에 접근할 수 있는 권한이 필요합니다.
    - 여기서는 사진을 저장하는데 사용할 뿐이므로 _'모든 사진 공개'_ 또는 _'선택된 사진 공개'_ 둘 중 하나를 선택하더라도 저장이 됩니다.
- **사진 앨범에 저장**
    - `PHPhotoLibrary` - `import Photos`가 필요합니다.
    - `performChanges(requestHandler, completionHandler)`
        - `requestHandler` 부분에 사진 라이브러리에 사진 저장 리퀘스트를 요청합니다.
    - **creationRequest.addResource**
        - `data`에 `photo.fileDataRepresentation()!`을 지정하면 `Data` 타입의 사진이 지정됩니다.
        - 기본적으로 `photo.fileDataRepresentation()`은 옵셔널 값이나 `data`는 비옵셔널 값을 요구하기 때문에 강제 언래핑합니다.

 

이제 셔터 버튼을 누르면 사진이 찍히며 라이브러리에 저장됩니다.

 ![](/assets/img/wp-content/uploads/2023/07/IMG_1212.jpeg)

 ![](/assets/img/wp-content/uploads/2023/07/IMG_1213.jpeg)

 

#### **뷰 컨트롤러 전체 코드**

```swift
import UIKit
import AVFoundation
import Photos

class CameraViewController: UIViewController {
    
    // MARK: - 스토리보드로부터 @IBOutlet으로 연결된 컴포넌트 변수
    @IBOutlet weak var lblTopic: UILabel!
    @IBOutlet weak var imgViewGuideOverlay: UIImageView!
    
    // MARK: - Vars
    var previewLayer: AVCaptureVideoPreviewLayer!
    var captureSession: AVCaptureSession!
    var backCameraInput: AVCaptureDeviceInput!
    var frontCameraInput: AVCaptureDeviceInput!
    
    var photoSettings: AVCapturePhotoSettings {
        // NSInvalidArgumentException', reason: '*** -[AVCapturePhotoOutput capturePhotoWithSettings:delegate:]
        // Settings may not be re-used'
        
        var settings = AVCapturePhotoSettings()
        // photoOutput 의 codec의 hevc 가능시 photoSettings의 codec을 hevc로 설정하는 코드입니다.
        // hevc 불가능한 경우에는 jpeg codec을 사용하도록 합니다.
        if photoOutput.availablePhotoCodecTypes.contains(.hevc) {
            settings = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.hevc])
        } else {
            settings = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.jpeg])
        }
        
        return settings
    }
    var photoOutput: AVCapturePhotoOutput = AVCapturePhotoOutput()
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        checkCameraPermissions()
        setupPhotoCamera()
    }
    
    @IBAction func btnActShutter(_ sender: UIButton) {
        // lblTopic.text = #function
        photoOutput.capturePhoto(with: photoSettings, delegate: self)
    }
    
    @IBAction func btnActChangeCameraPosition(_ sender: UIButton) {
        captureSession.beginConfiguration()
        
        switch captureSession.inputs[0] {
        case backCameraInput:
            // 후면에서 전면으로 전환
            captureSession.removeInput(backCameraInput)
            captureSession.addInput(frontCameraInput)
        case frontCameraInput:
            // 전면에서 후면으로 전환
            captureSession.removeInput(frontCameraInput)
            captureSession.addInput(backCameraInput)
        default:
            break
        }
        
        // commitConfiguration : captureSession 의 설정 변경이 완료되었음을 알리는 함수.
        captureSession.commitConfiguration()
    }
    
    // MARK: - Camera Functions
    
    func setupPhotoCamera() {
        // 메인 스레드에서 실행 방지 - startRunning()이 차단 호출(block call)이기 때문
        DispatchQueue.global(qos: .userInitiated).async { [unowned self] in
            // 세션 초기화
            captureSession = AVCaptureSession()
            // 구성(configuration) 시작
            captureSession.beginConfiguration()
            
            // session specific configuration
            // 세션 프리셋을 설정하기 전에 지원 여부를 확인해야 합니다.
            if captureSession.canSetSessionPreset(.photo) {
                captureSession.sessionPreset = .photo
            }
            
            // 사용 가능한 경우 세션이 자동으로 광역 색상을 사용해야 하는지 여부를 지정합니다.
            captureSession.automaticallyConfiguresCaptureDeviceForWideColor = true

            // 후면 카메라 디바이스
            guard let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
                return
            }

            // 전면 카메라 디바이스
            guard let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
                return
            }
            
            // 생성된 captureSession에 device input을 생성 및 연결하고,
            // device output을 연결하는 코드입니다.
            do {
                backCameraInput = try AVCaptureDeviceInput(device: backCamera)
                frontCameraInput = try AVCaptureDeviceInput(device: frontCamera)
                    
                // captureSession에 cameraInput을 받도록 설정
                captureSession.addInput(backCameraInput)
            } catch  {
                debugPrint("Camera Input Error:", error.localizedDescription)
            }
            
            // 고해상도의 이미지 캡처 가능 설정
            // 16.0에서 deprecated됨
            if #unavailable(iOS 16.0) {
                photoOutput.isHighResolutionCaptureEnabled = true
            }
            
            // CaptureSession에 photoOutput을 추가
            captureSession.addOutput(photoOutput)
            
            // Preview 화면 추가
            DispatchQueue.main.async { [unowned self] in
                setCameraPreview()
            }
            
            // commit configuration: 단일 atomic 업데이트에서 실행 중인 캡처 세션의 구성에 대한 하나 이상의 변경 사항을 커밋합니다.
            captureSession.commitConfiguration()
            // 캡처 세션 실행
            captureSession.startRunning()
        }
    }
    
    func setCameraPreview() {
        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        view.layer.insertSublayer(previewLayer, above: imgViewGuideOverlay.layer)
        previewLayer.frame = imgViewGuideOverlay.frame
        previewLayer.videoGravity = .resizeAspectFill   // 프레임 크기에 맞춰 리사이즈(비율 깨지지 않음)
    }
    
    
    // MARK: - Permissions
    
    func checkCameraPermissions() {
        let cameraAuthStatus =  AVCaptureDevice.authorizationStatus(for: AVMediaType.video)
        switch cameraAuthStatus {
        case .authorized:
            return
        case .denied:
            // TODO: - 카메라 권한 허용 유도하는 기능
            abort()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: AVMediaType.video, completionHandler:
                                            { (authorized) in
                if(!authorized){
                    // TODO: - 카메라 권한 허용 유도하는 기능
                    abort()
                }
            })
        case .restricted:
            // 시스템 에러
            abort()
        @unknown default:
            fatalError()
        }
    }
}

extension CameraViewController: AVCapturePhotoCaptureDelegate {
    /// capturePhoto 이후에 capture process 가 완료된 이미지를 저장하는 메서드
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        guard error == nil else {
            print("Error capturing photo:", error!.localizedDescription)
            return
        }
        
        // 권한 요청
        PHPhotoLibrary.requestAuthorization { status in
            guard status == .authorized else {
                return
            }
            
            // 사진 앨범에 저장
            PHPhotoLibrary.shared().performChanges({
                let creationRequest = PHAssetCreationRequest.forAsset()
                creationRequest.addResource(with: .photo, data: photo.fileDataRepresentation()!, options: nil)
            }, completionHandler: nil)
        }
    }
}

```
