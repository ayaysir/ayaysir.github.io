---
title: "Swift(스위프트): Core ML + Create ML 기초 요약 下 (이미지 분류 앱 만들기)"
date: 2022-10-09
categories: 
  - "DevLog"
  - "Swift"
---

#### **上편 - [Swift(스위프트): Core ML + Create ML 기초 요약 上 (기계학습 모델 만들기)](http://yoonbumtae.com/?p=4889) 바로가기**

Create ML로 만든 모델 파일을 이용해 이미지 분류 앱을 제작합니다. (Interface Builder 스토리보드 이용)

 

### **이미지 분류 앱 만들기**

##### **1: 모델 파일(\*.mlmodel)을 프로젝트에 추가합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-10-am-1.56.12.jpg)

 

##### **2: 메인 스토리보드에서 뷰 컨트롤러에 UI 요소를 추가합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-10-am-1.57.01.jpg)

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-10-am-1.58.57.jpg)

 

##### **3: UI 요소를 `@IBOutlet` 또는 `@IBAction`으로 뷰 컨트롤러 코드와 연결합니다.**

```swift
@IBOutlet weak var imageView: UIImageView!
@IBOutlet weak var cameraButton: UIBarButtonItem!
@IBOutlet weak var classificationLabel: UILabel!

// ... //

// MARK: - Photo Actions

@IBAction func takePicture(_ sender: UIBarButtonItem) {
    // ... //
}

@IBAction func choosePicture(_ sender: UIBarButtonItem) {
    // ... //
}
```

- `takePicture` - 카메라 버튼에 대한 `@IBAction` 메서드입니다.
- `choosePicture` - 사진 라이브러리 버튼에 대한 `@IBAction` 메서드입니다.

 

##### **4: 카메라 및 사진 라이브러리 버튼을 눌렀을 때 이미지 피커 컨트롤러(`UIImagePickerController`)가 나타나도록 합니다.**

먼저 뷰 컨트롤러에 다음 import들을 추가합니다.

```swift
import UIKit
import CoreML
import Vision // 이미지 고급 처리
import ImageIO
```

 

다음 뷰 컨트롤러에 아래 함수를 추가합니다.

```swift
func presentPhotoPicker(sourceType: UIImagePickerControllerSourceType) {
    let picker = UIImagePickerController()
    picker.delegate = self
    picker.sourceType = sourceType
    present(picker, animated: true)
}
```

- `picker.sourceType` - `camera`, `photoLibrary` 둘 중 선택할 수 있습니다.
- `picker.delegate` - 이미지 피커 컨트롤러의 위임자로 뷰 컨트롤러(self)를 지정합니다.
    - 이 코드를 추가하면 `UIImagePickerControllerDelegated`와 `UINavigationControllerDelegate`를 클래스 준수 목록에 추가하라는 에러 메시지가 뜹니다. 추가 내용은 밑에 있습니다.
- `present(...)` - 이미지 피커 컨트롤러를 화면에 띄웁니다.

 

`UIImagePickerControllerDelegated`와 `UINavigationControllerDelegate`를 준수하는 `extension`을 추가합니다. 그 안에 이미지를 찍었거나, 혹은 선택하고 나서 할 작업을 지정하는 메서드 `func imagePickerController(...didFinishPickingMediaWithInfo...)`에 해야 될 작업에 대한 코드를 작성합니다.

```swift
extension ViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    // MARK: - Handling Image Picker Selection

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String: Any]) {
        picker.dismiss(animated: true)
        
        // `imagePickerController(:didFinishPickingMediaWithInfo:)`는 원본 이미지를 제공할 것입니다.
        let image = info[UIImagePickerControllerOriginalImage] as! UIImage
        imageView.image = image
        updateClassifications(for: image)
    }
}

```

- `picker.dismiss(animated: true)`
    - 피커 컨트롤러를 화면에서 사라지게 합니다.
- `image`
    - 선택하거나 촬영한 이미지 원본 파일이 `UIImage` 형태로 저장됩니다.
- `imageView.image = image`
    - 해당 이미지를 `imageView`에 나타나게 합니다.
- `updateClassifications(for: image)`
    - 이미지 분류 리퀘스트를 수행하는 메서드입니다.
    - 잠시 후 설명합니다.

 

카메라 및 사진 라이브러리 버튼의 `@IBAction` 함수 안에 다음 부분을 추가합니다.

```swift
@IBAction  func takePicture(_ sender: UIBarButtonItem) {
    // 카메라를 사용할 수 있는 경우에만 source picker에 대한 옵션을 표시합니다.
    guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
        return
    }
    
    presentPhotoPicker(sourceType: .camera)
}

@IBAction func choosePicture(_ sender: UIBarButtonItem) {
    presentPhotoPicker(sourceType: .photoLibrary)
}
```

- 버튼을 누르면 `presentPhotoPicker(...)`를 실행합니다.
- 카메라인 경우와 사진 라이브러리인 경우 `sourceType`을 다르게 합니다.
- 카메라가 실행 불가능한 경우(시뮬레이터 등)에는 `presentPhotoPicker`를 실행할 수 없으므로 `guard` 문으로 `return` 시킵니다.

 

`updateClassifications(for: image)` 부분을 코멘트 처리한 후, 앱을 빌드 및 실행합니다. 이미지를 선택하면 화면에 이미지가 나오는지 확인합니다.

<!-- http://www.giphy.com/gifs/l4v9WNRpDmEzclDMZy -->
![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExODNweDBuazBpMGUzdHUwcXA2dWpzbm55b210OWd4dGFycDlvdjVzZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4v9WNRpDmEzclDMZy/giphy.gif)

시뮬레이터에서는 카메라에서 사용 불가능하므로 disabled 처리되었고, 실제 기기에서는 카메라 기능도 동작해야 합니다.

그리고 이 프로젝트는 시뮬레이터에서 실행하는 것이 아무 의미가 없습니다. Core ML의 프로세싱은 기기의 CPU, 뉴럴 엔진 등의 성능에 영향을 받으며, 시뮬레이터에서 실행하는 경우 완전히 엉뚱한 결과가 나와 모델이 제대로 동작하는지 확인이 불가능합니다. **반드시 실제 기기에서 테스트**하세요.

 

##### **5-1: 이미지를 바탕으로 처리 리퀘스트를 요청하는 `updateClassifications(image:)`를 작성합니다.**

```
/// - Tag: PerformRequests
func updateClassifications(for image: UIImage) {
    classificationLabel.text = "Classifying..."
    
    let orientation = CGImagePropertyOrientation(image.imageOrientation) // 이미지 방향
    guard let ciImage = CIImage(image: image) else { fatalError("Unable to create \(CIImage.self) from \(image).") }
    
    DispatchQueue.global(qos: .userInitiated).async {
        let handler = VNImageRequestHandler(ciImage: ciImage, orientation: orientation)
        do {
            try handler.perform([self.classificationRequest])
        } catch {
            /*
             이 핸들러는 일반적인 이미지 처리 오류를 포착합니다. `classificationRequest`의 완료 핸들러 `processClassifications(_:error:)`는 해당 요청 처리와 관련된 오류를 포착합니다.
             */
            print("Failed to perform classification.\n\(error.localizedDescription)")
        }
    }
}
```

- `orientation`
    - 이미지 방향이 원래 이미지와 다른 경우, 완전히 다른 물체로 인식해서 정확한 결과를 내는 것이 불가능합니다.
    - 따라서 원래 이미지와 방향을 맞추는 것이 중요하며, 이 작업을 수행합니다.
    - `CGImagePropertyOrientation`에 대한 `extension`을 추가합니다. (아래 코드)
        - `image.imageOrientation(=UIImageOrientation)`을 파라미터로 입력하면 해당 이미지 방향과 일치하는 `CGImagePropertyOrientation` 인스턴스를 생성하는 생성자입니다.
- `ciImage`
    - `UIImage`를 `CIImage`로 변환합니다.
- `DispatchQueue.global(qos: .userInitiated).async {...}`
    - 해당 작업을 main 스레드가 아닌 `global` 스레드 내에서 실행하겠다는 의미입니다.
    - Global 스레드는 전체 시스템에서 공유되는 concurrent queue(작업이 동시에 진행되는 큐)입니다. QoS를 통해서 작업의 우선순위를 결정하게 됩니다
    - `QoS` (Quality of Service) - 중요도가 높은 순으로
        - userInteractive
        - userInitiated
        - default
        - utility
        - background
        - unspecified
- `handler`
    - `ciImage`와 `orientation`(방향 정보)를 바탕으로 이미지 처리 리퀘스트 핸들러를 생성합니다.
- `handler.perform([self.classificationRequest])`
    - `perform`에는 `VNRequest`의 배열을 파라미터로 받으며 해당 리퀘스트들을 수행한다는 의미입니다.
    - `classificationRequest`는 `VNRequest`의 세부 타입인 `VNCoreMLRequest` 타입이며 밑에서 설명합니다.

 

**CGImagePropertyOrientation에 대한 extension**

```swift
import UIKit
import ImageIO

extension CGImagePropertyOrientation {
    /**
     Converts a `UIImageOrientation` to a corresponding
     `CGImagePropertyOrientation`. The cases for each
     orientation are represented by different raw values.
     
     - Tag: ConvertOrientation
     */
    init(_ orientation: UIImageOrientation) {
        switch orientation {
        case .up: self = .up
        case .upMirrored: self = .upMirrored
        case .down: self = .down
        case .downMirrored: self = .downMirrored
        case .left: self = .left
        case .leftMirrored: self = .leftMirrored
        case .right: self = .right
        case .rightMirrored: self = .rightMirrored
        }
    }
}

```

 

##### **5-2: 이미지 분류 리퀘스트 인스턴스인 classificationRequest 생성**

뷰 컨트롤러의 멤버 변수로 다음을 추가합니다.

```
/// - Tag: MLModelSetup
lazy var classificationRequest: VNCoreMLRequest = {
    do {
        // 모델 파일에 접근할 수 있도록 인스턴스 생성
        let model = try VNCoreMLModel(for: LivestocksClassifier(configuration: MLModelConfiguration()).model)
        
        // Core ML 리퀘스트 인스턴스
        // CompletionHandler: 모델 초기화가 완료되면 처리할 내용
        let request = VNCoreMLRequest(model: model, completionHandler: { [weak self] request, error in
            self?.processClassifications(for: request, error: error)
        })
        
        // 이미지 분류를 요청할 때, 이미지가 크거나 비율이 다를 경우 이미지를 어디서 취할 것인가?
        // .centerCrop이 가장 많이 사용됨
        request.imageCropAndScaleOption = .centerCrop
        return request
    } catch {
        fatalError("Failed to load Vision ML model: \(error)")
    }
}()
```

앞서 1단계에서 모델 파일을 프로젝트에 추가했는데, 모델 파일을 추가하면 자동으로 해당 파일 이름과 똑같은 이름의 클래스가 자동으로 생성됩니다. 파일 이름을 바꾸면 클래스 이름도 자동으로 바뀝니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-10-am-2.48.31.jpg)

자동 생성된 `LivestocksClassifier` 클래스를 사용할 것입니다.

- `lazy` 변수
    - `lazy` 변수는 처음에는 초기화되지 않다가 사용이 요청되는 순간 초기화가 실행되는 변수입니다.
    - `classificationRequest` 변수는 `lazy` 변수이므로 처음에는 초기화되지 않다가 5-1 문단의 코드에서 `try handler.perform([self.classificationRequest])`이 실행되는 순간 초기화가 됩니다.
- `let model = try VNCoreMLModel(...)`
    - 모델 파일에 접근할 수 있는 인스턴스를 생성합니다.
    - 자동으로 생성된 `LivestocksClassifier` 클래스를 바탕으로 CoreML Model을 생성합니다.
    - `processClassifications(...)`는 잠시 후 설명합니다.
- `let request = VNCoreMLRequest(...)`
    - 이미지의 분류 처리를 요청하는 `VNCoreMLRequest` 타입의 변수를 생성합니다.
    - `completionHandler`는 모델 초기화가 완료되면 그 이후에 해야 할 작업입니다.
- `request.imageCropAndScaleOption`
    - 이미지는 학습에 사용했던 이미지보다 크기가 다양하거나 비율이 다를 수가 있는데 그러한 경우를 대비해서 분류를 하고자 하는 이미지의 어느 부분을 어떻게 취할 것인가에 대한 전략을 설정하는 부분입니다.
    - `scaleToFit`, `scaleToFill`, `centerCrop` 3가지가 있습니다.
    - 일반적으로 `.centerCrop`이 가장 많이 사용된다고 합니다.
- `return request`
    - lazy var 변수는 클로저를 실행한 형태 `lazy var 변수이름: Type = {... return Type에맞는변수}()` 로 선언합니다.
    - `classificationRequest` 변수에 담길 `request`를 `return`합니다.

 

##### **5-3: 요청 처리에 따른 결과를 UI에 반영하는 `processClassifications(...)` 함수를 작성합니다.**

```
/// 분류 결과를 바탕으로 UI를 업데이트합니다.
/// - Tag: ProcessClassifications
func processClassifications(for request: VNRequest, error: Error?) {
    DispatchQueue.main.async {
        guard let results = request.results else {
            self.classificationLabel.text = "Unable to classify image.\n\(error!.localizedDescription)"
            return
        }

        // `result`는 이 프로젝트의 Core ML 모델에서 지정한 대로 항상 'VNClassificationObservation'이 됩니다.
        let classifications = results as! [VNClassificationObservation]
    
        if classifications.isEmpty {
            self.classificationLabel.text = "Nothing recognized."
        } else {
            let topClassifications = classifications.prefix(2)
            let descriptions = topClassifications.map { classification in

                // 표시할 분류 형식을 지정합니다. 예) "(0.37) Dog".
               return String(format: "  (%.2f) %@", classification.confidence, classification.identifier)
            }
            self.classificationLabel.text = "Classification:\n" + descriptions.joined(separator: "\n")
        }
    }
}
```

- `DispatchQueue.main.async {...}`
    - 메인 스레드에서 비동기로 실행할 작업입니다.
    - 참고: UI 관련 작업은 전부 메인 스레드에서 실행해야 합니다.
- `guard let results = request.results else {...}`
    - 결과가 나오면 `results` 변수에 저장하고, `nil`이면(결과가 나오지 않으면) 이미지를 분류할 수 없다는 메시지를 출력하고 리턴합니다.
- `classifications`
    - `results`는 `[VNObservation]`으로, Core ML 모델은 항상 `[VNObservation]`의 하위 타입인 `[VNClassificationObservation]`을 반환하므로 다운캐스팅합니다.
- `classifications.isEmpty`
    - 아무것도 인식되지 않았을 경우, 해당 메시지를 표시합니다.
- `!classifications.isEmpty` -> 결과가 있을 경우
    - `topClassifications` - prefix를 이용해 분류(카테고리) 결과 배열 중 상위 2개만 취득합니다. (분류 후 해당 분류의 확률이 높은 순으로 자동으로 정렬되어 있음)
    - `descriptions` - 포맷을 활용해 레이블에 상위 2개 분류(카테고리)와 해당 분류가 맞을 확률을 표시합니다.
        - `" (%.2f) %@"` - `%.2f`는 소숫점 숫자(float), `%@`는 텍스트를 표시하는 포맷입니다.

 

4번 문단에서 `updateClassifications(for: image)`를 코멘트 해제한 후, 앱을 실제 기기에서 빌드 및 실행해 결과가 제대로 표시되는지 확인합니다.

![](https://media.giphy.com/media/vv26Rw8SveF9mQBsZk/giphy.gif)

 

#### **전체 코드**

**CGImagePropertyOrientation의 extension**

```swift
import UIKit
import ImageIO

extension CGImagePropertyOrientation {
    /**
     Converts a `UIImageOrientation` to a corresponding
     `CGImagePropertyOrientation`. The cases for each
     orientation are represented by different raw values.
     
     - Tag: ConvertOrientation
     */
    init(_ orientation: UIImageOrientation) {
        switch orientation {
        case .up: self = .up
        case .upMirrored: self = .upMirrored
        case .down: self = .down
        case .downMirrored: self = .downMirrored
        case .left: self = .left
        case .leftMirrored: self = .leftMirrored
        case .right: self = .right
        case .rightMirrored: self = .rightMirrored
        }
    }
}
```

 

**뷰 컨트롤러**

```swift
import UIKit
import CoreML
import Vision // 이미지 고급 처리
import ImageIO

// 시뮬레이터는 결과가 엉터리로 나옴
// 반드시 실제 기기에서 테스트

class ImageClassificationViewController: UIViewController {
    // MARK: - IBOutlets
    
    @IBOutlet weak var imageView: UIImageView!
    @IBOutlet weak var cameraButton: UIBarButtonItem!
    @IBOutlet weak var classificationLabel: UILabel!
    
    /// - Tag: MLModelSetup
    lazy var classificationRequest: VNCoreMLRequest = {
        do {
            // 모델 파일에 접근할 수 있도록 인스턴스 생성
            let model = try VNCoreMLModel(for: LivestocksClassifier(configuration: MLModelConfiguration()).model)
            
            // Core ML 리퀘스트 인스턴스
            // CompletionHandler: 모델 초기화가 완료되면 처리할 내용
            let request = VNCoreMLRequest(model: model, completionHandler: { [weak self] request, error in
                self?.processClassifications(for: request, error: error)
            })
            
            // 이미지 분류를 요청할 때, 이미지가 크거나 비율이 다를 경우 이미지를 어디서 취할 것인가?
            // .centerCrop이 가장 많이 사용됨
            request.imageCropAndScaleOption = .centerCrop
            return request
        } catch {
            fatalError("Failed to load Vision ML model: \(error)")
        }
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 카메라를 이용할 수 없으면 카메라 버튼 비활성화
        if !UIImagePickerController.isSourceTypeAvailable(.camera) {
            cameraButton.isEnabled = false
        }
    }
    
    // MARK: - Photo Actions
    
    @IBAction func takePicture() {
        // Show options for the source picker only if the camera is available.
        // 카메라를 사용할 수 있는 경우에만 source picker에 대한 옵션을 표시합니다.
        guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
            return
        }
        
        presentPhotoPicker(sourceType: .camera)
    }
    
    @IBAction func choosePicture(_ sender: UIBarButtonItem) {
        self.presentPhotoPicker(sourceType: .photoLibrary)
    }
    
    func presentPhotoPicker(sourceType: UIImagePickerControllerSourceType) {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.sourceType = sourceType
        present(picker, animated: true)
    }
}

extension ImageClassificationViewController {
    
    // MARK: - Image Classification
    
    /// - Tag: PerformRequests
    func updateClassifications(for image: UIImage) {
        classificationLabel.text = "Classifying..."
        
        let orientation = CGImagePropertyOrientation(image.imageOrientation) // 이미지 방향
        guard let ciImage = CIImage(image: image) else { fatalError("Unable to create \(CIImage.self) from \(image).") }
        
        DispatchQueue.global(qos: .userInitiated).async {
            let handler = VNImageRequestHandler(ciImage: ciImage, orientation: orientation)
            do {
                try handler.perform([self.classificationRequest])
            } catch {
                /*
                 이 핸들러는 일반적인 이미지 처리 오류를 포착합니다. `classificationRequest`의 완료 핸들러 `processClassifications(_:error:)`는 해당 요청 처리와 관련된 오류를 포착합니다.
                 */
                print("Failed to perform classification.\n\(error.localizedDescription)")
            }
        }
    }
    
    /// 분류 결과를 바탕으로 UI를 업데이트합니다.
    /// - Tag: ProcessClassifications
    func processClassifications(for request: VNRequest, error: Error?) {
        DispatchQueue.main.async {
            guard let results = request.results else {
                self.classificationLabel.text = "Unable to classify image.\n\(error!.localizedDescription)"
                return
            }

            // `result`는 이 프로젝트의 Core ML 모델에서 지정한 대로 항상 'VNClassificationObservation'이 됩니다.
            let classifications = results as! [VNClassificationObservation]
        
            if classifications.isEmpty {
                self.classificationLabel.text = "Nothing recognized."
            } else {
                let topClassifications = classifications.prefix(2)
                let descriptions = topClassifications.map { classification in
                    // Formats the classification for display; e.g. "(0.37) cliff, drop, drop-off".
                    // 표시할 분류 형식을 지정합니다. 예) "(0.37) Dog".
                   return String(format: "  (%.2f) %@", classification.confidence, classification.identifier)
                }
                self.classificationLabel.text = "Classification:\n" + descriptions.joined(separator: "\n")
            }
        }
    }
}

extension ImageClassificationViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    // MARK: - Handling Image Picker Selection

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String: Any]) {
        picker.dismiss(animated: true)
        
        // `imagePickerController(:didFinishPickingMediaWithInfo:)`는 원본 이미지를 제공할 것입니다.
        let image = info[UIImagePickerControllerOriginalImage] as! UIImage
        imageView.image = image
        updateClassifications(for: image)
    }
}

```
