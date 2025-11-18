---
title: "Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 회원 가입 기능 구현 2 - 프로필 사진 올리기 (스토리보드)"
date: 2021-09-20
categories: 
  - "DevLog"
  - "Swift UIKit"
  - "Firebase"
---

- [Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 기초 로그인 로그아웃 구현 (스토리보드)](http://yoonbumtae.com/?p=4090)
- [Swift(스위프트): Firebase(파이어베이스) 인증 기능을 이용한 회원 가입 기능 구현 1 (스토리보드)](http://yoonbumtae.com/?p=4099)

 

지난번 글에서 프로필 사진을 제외한 모든 정보로 회원가입 하는 것을 다뤄봤으므로, 이번에는 사진을 업로드하는 과정을 진행하겠습니다.

사진 파일 업로드는 Firebase의 `Storage` 서비스를 이용합니다.

프로필 사진을 업로드할 때 원본 사진도 필요하지만 작은 공간에 필요한 섬네일(Thumbnail) 이미지도 필요합니다. 네트워크 상에서 파일을 주고받는 만큼 트래픽을 줄이는 것이 중요하기 때문입니다. 파이어베이스에 이미지를 업로드하면 자동으로 섬네일을 만들어주는 기능이 존재하기는 하지만 파이어베이스 무료 버전에서는 존재하지 않고 유료 요금제를 사용해야 합니다.

따라서 이 예제에서는 디바이스에서 섬네일 이미지 파일을 만들어서 원본 + 섬네일 두 파일을 업로드하는 방식을 사용하도록 하겠습니다.

파이어베이스 인증 메뉴의 회원은 `uid`라는 고유값을 통해 구분하게 됩니다. 이 `uid`를 이용해 사진을 저장하고, 나중에 회원정보 불러오기 메뉴를 만들 때에도 `uid`를 통해 사진을 불러올 수 있습니다.

 

### **섬네일 생성 함수 추가**

아래 함수는 `UIImage`를 받아 가로 또는 세로의 최대 사이즈가 `maxSize`인 섬네일을 생성합니다.

```swift
import UIKit

func makeImageThumbnail(image: UIImage, maxSize: Int = 100) -> UIImage? {
    guard let imageData = image.jpegData(compressionQuality: 0.95) else {
        return nil
    }

    let options = [
        kCGImageSourceCreateThumbnailWithTransform: true,
        kCGImageSourceCreateThumbnailFromImageAlways: true,
        kCGImageSourceThumbnailMaxPixelSize: maxSize] as CFDictionary // Specify your desired size at kCGImageSourceThumbnailMaxPixelSize. I've specified 100 as per your question
    
    var thumbnail: UIImage?
    imageData.withUnsafeBytes { pointer in
       guard let bytes = pointer.baseAddress?.assumingMemoryBound(to: UInt8.self) else {
          return
       }
       if let cfData = CFDataCreate(kCFAllocatorDefault, bytes, imageData.count){
          let source = CGImageSourceCreateWithData(cfData, nil)!
          let imageReference = CGImageSourceCreateThumbnailAtIndex(source, 0, options)!
          thumbnail = UIImage(cgImage: imageReference) // You get your thumbail here
       }
    }
    return thumbnail
}

```

참고글

- [\[번역\]언세이프 스위프트: 포인터를 사용해보고, C와함께 상호작용하기](https://blog.canapio.com/110)
- [Swift가 제공하는 여러 포인터 타입들과 동작 방식](https://academy.realm.io/kr/posts/nate-cook-tryswift-tokyo-unsafe-swift-and-pointer-types/)

 

### **스토리보드에서 사진 업로드 부분 만들기**

먼저 뷰 컨트롤러에서 `Photos`를 불러옵니다.

```
import Photos
```

.

##### **1\. 스토리보드 UI 만들기**

아래 사진과 같이 이미지 뷰(`UIImageView`), 버튼(`UIButton`) 두 개를 회원가입 폼에 추가합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-9.06.27.jpg)

 

이미지 뷰는 `@IBOutlet`, 버튼은 `@IBAction`으로 연결합니다.

```
@IBOutlet weak var imgProfilePicture: UIImageView!
```

```swift
@IBAction  func btnActTakePhoto(_ sender: UIButton) {
    // 카메라
}

@IBAction func btnActFromLoadPhoto(_ sender: UIButton) {
    // 사진 보관함
}
```

 

#### **2   멤버 변수 추가**

사진 보관함에서 사진을 불러올 때, 또는 카메라에서 사진을 찍을 때 사용하는 뷰 컨트롤러인 이미지 피커 뷰 컨트롤러(`UIImageViewController`)와 섬네일 이미지를 저장할 변수인 `imgProfilePicture` 멤버 변수를 추가합니다.

```
let imagePickerController = UIImagePickerController()
var userProfileThumbnail: UIImage!

```

 

##### **3\. 이미지 관련 딜리게이트 코드 추가**

`viewDidLoad(_:)`에 아래 부분을 추가합니다.

```
// 사진: 이미지 피커에 딜리게이트 생성
imagePickerController.delegate = self

// 최초 섬네일 생성
userProfileThumbnail = makeImageThumbnail(image: #imageLiteral(resourceName: "sample"), maxSize: 200)
```

- `imagePickerController.delegate` = 딜리게이트로 `self`(`SignUpViewController`)를 지정합니다.
- `userProfileThumbnail` - 오류를 방지하기 위해 기본 섬네일을 이미지 리터럴 형태로 지정합니다.

 

아래 `extension`을 추가합니다.

```swift
extension SignUpViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        if let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
            imgProfilePicture.image = image
            userProfileThumbnail = makeImageThumbnail(image: image, maxSize: 200)
        }
        dismiss(animated: true, completion: nil)
    }
    
    private func openSetting(action: UIAlertAction) -> Void {
        guard let settingsUrl = URL(string: UIApplication.openSettingsURLString) else {
            return
        }

        if UIApplication.shared.canOpenURL(settingsUrl) {
            UIApplication.shared.open(settingsUrl, completionHandler: { (success) in
                print("Settings opened: \(success)") // Prints true
            })
        }
    }
    
    func doTaskByPhotoAuthorization() {
        switch PHPhotoLibrary.authorizationStatus() {
        case .notDetermined:
            print("photo auth >>> not determined")
            simpleDestructiveYesAndNo(self, message: "사진 권한 설정을 변경하시겠습니까?", title: "권한 정보 없음", yesHandler: openSetting)
        case .restricted:
            print("photo auth >>> restricted")
            simpleAlert(self, message: "시스템에 의해 거부되었습니다.")
        case .denied:
            print("photo auth >>> denied")
            simpleDestructiveYesAndNo(self, message: "사진 기능 권한이 거부되어 사용할 수 없습니다. 사진 권한 설정을 변경하시겠습니까?", title: "권한 거부됨", yesHandler: openSetting(action:))
        case .authorized:
            print("photo auth >>> authorized")
            self.present(self.imagePickerController, animated: true, completion: nil)
        case .limited:
            print("photo auth >>> limited")
            self.present(self.imagePickerController, animated: true, completion: nil)
        @unknown default:
            print("photo auth >>> unknown")
            simpleAlert(self, message: "unknown")
        }
    }
    
    func doTaskByCameraAuthorization() {
        switch AVCaptureDevice.authorizationStatus(for: AVMediaType.video) {
        case .notDetermined:
            print("camera auth >>> not determined")
            simpleDestructiveYesAndNo(self, message: "카메라 권한 설정을 변경하시겠습니까?", title: "권한 정보 없음", yesHandler: openSetting)
        case .restricted:
            print("camera auth >>> restricted")
            simpleAlert(self, message: "시스템에 의해 거부되었습니다.")
        case .denied:
            print("camera auth >>> denied")
            simpleDestructiveYesAndNo(self, message: "카메라 기능 권한이 거부되어 사용할 수 없습니다. 카메라 권한 설정을 변경하시겠습니까?", title: "권한 거부됨", yesHandler: openSetting(action:))
        case .authorized:
            print("camera auth >>> authorized")
            self.present(self.imagePickerController, animated: true, completion: nil)
        @unknown default:
            print("camera auth >>> unknown")
            simpleAlert(self, message: "unknown")
        }
    }
}

```

- `imagePickerController(...didFinishPickingMediaWithInfo...)` - 이미지 피커 컨트롤러에서 이미지가 선택되었을 때 해야 할 동작들을 지정합니다.
    - `info[UIImagePickerController.InfoKey.originalImage]` - 선택된 이미지입니다.
    - `imgProfilePicture.image = image` - 미리보기 이미지를 표시합니다.
    - `userProfileThumbnail = makeImageThumbnail(image: image, maxSize: 200)` - 최대 크기가 200인 섬네일을 생성합니다.
- `openSetting` - 카메라 또는 사진 보관함의 권한이 거부되었을 때, 앱 사용자에게 권한 허용을 유도하기 위해 사용합니다. 이 함수가 실행되면 디바이스의 앱 설정 메뉴로 이동합니다.
- `doTaskByPhotoAuthorization(), doTaskByCameraAuthorization()` - 사진 보관함과 카메라의 현재 권한 레벨에 따라 해야할 동작들을 swtch 문을 이용해 지정합니다.
    - [Swift (스위프트): 사진 라이브러리, 카메라 사용 (스토리보드)](http://yoonbumtae.com/?p=3831)

`simpleAlert` 함수는 경고 창을 띄우는 과정을 간소화한 커스터마이징 함수입니다. ([바로가기](https://github.com/ayaysir/iOS-DiffuserStick/blob/main/DiffuserStick/util/AlertUtil.swift))

 

##### **4\. 카메라, 라이브러리 버튼에 이벤트 할당**

```swift
@IBAction  func btnActTakePhoto(_ sender: UIButton) {
    if UIImagePickerController.isSourceTypeAvailable(.camera) {
        self.imagePickerController.sourceType = .camera
        doTaskByCameraAuthorization()
    } else {
        simpleAlert(self, message: "카메라 사용이 불가능합니다.")
    }
}

@IBAction func btnActFromLoadPhoto(_ sender: UIButton) {
    self.imagePickerController.sourceType = .photoLibrary
    doTaskByPhotoAuthorization()
}
```

- `UIImagePickerController.isSourceTypeAvailable(.camera)` - iOS 시뮬레이터에서는 카메라 사용이 불가능합니다. 카메라 사용이 불가능한 경우(false) 경고 메시지를 띄웁니다.
- `self.imagePickerController.sourceType = .camera`는 이미지 피커 컨트롤러가 카메라 모드로, `.photoLibrary` 는 사진 보관함 모드로 동작합니다.

 

### **Firebase에서 Storage 생성**

파이어베이스 웹 콘솔 왼쪽에 `Storage`라는 메뉴가 있습니다. Storage가 생성되지 않았다면 먼저 시작하기 버튼을 눌러 새로 생성해야 합니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-9.58.22.jpg)

 

폴더 만들기 버튼을 눌러 `images/users` 하위 폴더를 생성합니다. 이 폴더에 프로필 사진이 `uid` 로 구분되어 저장될 것입니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-9.42.51.jpg)  ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-19-pm-9.43.14.jpg)

 

Storage는 기본적으로 인증된 경우에만 쓰기, 읽기를 허락하고 있으므로 별도의 규칙(Rules)은 편의상 생략합니다.

 

 

### **사진 업로드 기능 구현**

[코드 출처](https://stackoverflow.com/questions/49934195/how-to-upload-multiple-image-on-firebase-using-swift)

앞서 파이어베이스에 사진을 업로드할 때 원본+섬네일 두 개를 올리기로 했습니다. Swift에 있는 파이어베이스의 파일 업로드 기능은 파일 한 개만 동작하기 때문에 두 개 이상을 올리려면 복잡한 과정을 거쳐야 합니다.

 

##### **1\. 뷰 컨트롤러의 멤버 변수 추가**

```
/// Here is the completion block
typealias FileCompletionBlock = () -> Void
var block: FileCompletionBlock?
```

- `() -> Void` 클로저 변수를 `typealias`를 사용해 `FileCompletionBlock`라는 이름을 붙여줬습니다.
- `block` - 파일 업로드가 완료되면 해야 할 작업들을 지정하는 클로저 변수입니다.

 

##### **2\. 커스텀 타입 ImageWithName 생성**

```swift
import UIKit

struct ImageWithName {
    var name: String
    var image: UIImage
    var fileExt: String
    var compressionQuality: CGFloat = 1.0
}
```

이 타입은 이름과 이미지(`UIImage`), 확장자, 압축 퀄리티를 저장할 수 있으며, 필요한 이유는 잠시 후에 설명합니다.

 

##### **3\. 클래스 FirebaseFileManager 추가 - 핵심 업로드 로직**

```swift
import UIKit
import Firebase

class FirebaseFileManager: NSObject {
    
    /// Singleton instance
    static let shared: FirebaseFileManager = FirebaseFileManager()
    
    /// Path
    var kFirFileStorageRef = Storage.storage().reference().child("Files")
    
    /// Current uploading task
    var currentUploadTask: StorageUploadTask?
    
    func setChild(_ pathString: String) {
        kFirFileStorageRef = Storage.storage().reference().child(pathString)
    }
    
    func upload(data: Data,
                withName fileName: String,
                block: @escaping (_ url: URL?) -> Void) {
        
        // Create a reference to the file you want to upload
        let fileRef = kFirFileStorageRef.child(fileName)
        
        /// Start uploading
        upload(data: data, withName: fileName, atPath: fileRef) { (url) in
            block(url)
        }
    }
    
    func upload(data: Data,
                withName fileName: String,
                atPath path: StorageReference,
                block: @escaping (_ url: URL?) -> Void) {
        
        let metadata = StorageMetadata()
        let fileExt = fileName[fileName.count - 3 ..< fileName.count]
        metadata.contentType = fileExt == "jpg" ? "image/jpeg"
            : fileExt == "png" ? "image/png" : "application/octet-stream"
        
        // Upload the file to the path
        self.currentUploadTask = path.putData(data, metadata: metadata) { (metadata, error) in
            guard metadata != nil else {
                // Uh-oh, an error occurred!
                block(nil)
                return
            }
            // Metadata contains file metadata such as size, content-type.
            // let size = metadata.size
            
            // You can also access to download URL after upload.
            path.downloadURL { (url, error) in
                guard url != nil else {
                    // Uh-oh, an error occurred!
                    block(nil)
                    return
                }
                block(url)
            }
        }
    }
    
    func cancel() {
        self.currentUploadTask?.cancel()
    }
}

```

- `shared` - 이 클래스는 싱글턴 인스턴스로 전역에서 사용합니다.
- `kFirFileStorageRef` - 업로드할 파일이 있는 경로입니다.
    - `setChild(_:)` - 업로드할 경로를 직접 설정합니다.
- `metadata.contentType` - 파일 확장자에 따라 메타데이트의 컨텐트 타입을 설정합니다.
- `path.putData` - 데이터를 업로드합니다.
- `block` - 업로드가 완료되면 실행되는 클로저입니다.

 

저도 이해하지 못했기 때문에 위의 코드를 설명하는 것은 불가능하고 업로드의 원리만 요약하면 다음과 같습니다.

1. 스토리지 생성
2. 루트 경로에 대한 레퍼런스 생성
3. (업로드하고자 하는) 이미지 경로에 대한 레퍼런스 생성
4. 레퍼런스의 `putData` 기능을 이용해 업로드

파이어베이스 공식 매뉴얼([출처](https://firebase.google.com/docs/storage/ios/upload-files?authuser=0#upload_files))에 있는 핵심 기본 코드는 아래와 같습니다. 파이어베이스 스토리지에 루트 폴더의 `image` 폴더 안에 `rivers.jpg`라는 이름으로 메모리상의 `data`를 업로드합니다.

```
// Create a root reference
let storageRef = storage.reference()

// Data in memory
let data = Data()

// Create a reference to the file you want to upload
let riversRef = storageRef.child("images/rivers.jpg")

// Upload the file to the path "images/rivers.jpg"
let uploadTask = riversRef.putData(data, metadata: nil) { (metadata, error) in
  guard let metadata = metadata else {
    // Uh-oh, an error occurred!
    return
  }
  // Metadata contains file metadata such as size, content-type.
  let size = metadata.size
  // You can also access to download URL after upload.
  riversRef.downloadURL { (url, error) in
    guard let downloadURL = url else {
      // Uh-oh, an error occurred!
      return
    }
  }
}
```

 

 

##### **4\. 뷰 컨트롤러에 Firebase 이미지 업로드 함수 추가**

```swift
private func uploadImage(forIndex index:Int, images: [ImageWithName]) {
    
    if index < images.count {
        /// Perform uploading
        
        let imageInfo = images[index]
        let name = imageInfo.name
        let image = imageInfo.image
        let fileExt = imageInfo.fileExt
        let quality = imageInfo.compressionQuality
        
        guard let data = fileExt == "jpg"
                ? image.jpegData(compressionQuality: quality)
                : image.pngData() else {
            return
        }
        
        let fileName = "\(name).\(fileExt)"
        
        FirebaseFileManager.shared.setChild("images/users")
        FirebaseFileManager.shared.upload(data: data, withName: fileName, block: { (url) in
            /// After successfully uploading call this method again by increment the **index = index + 1**
            print(url ?? "Couldn't not upload. You can either check the error or just skip this.")
            self.uploadImage(forIndex: index + 1, images: images)
        })
        return;
    }
    
    if block != nil {
        block!()
    }
}
```

- `name`, `image`, `fileExt`, `quality` - `ImageWithName` 타입의 객체로부터 정보를 가져오며 파일 이름, 이미지 압축 형식 등을 지정할 떄 사용합니다.

이 함수는 `FirebaseFileMananger`를 이용해 파일을 업로드하는데, 재귀 형식으로 실행해서(`index + 1`) 여러 파일을 업로드한 뒤 마지막 파일까지 업로드가 완료되었을 때에만 `block`을 실행해서 중복 실행됨을 방지함과 동시에 파일이 끝까지 완료된 뒤 클로저가 실행되도록 하여 파일 업로드의 비동기성을 해소했습니다.

 

##### **5\. 뷰 컨트롤러에 시작 함수 startUploading 추가**

```swift
func startUploading(images: [ImageWithName], completion: @escaping FileCompletionBlock) {
    if images.count == 0 {
        completion()
        return;
    }
    
    block = completion
    uploadImage(forIndex: 0, images: images)
}
```

- `block` - 업로드 완료 후 실행될 클로저입니다.
- `uploadImage(forIndex: 0, images: images)` - 이미지 업로드를 재귀적으로 실시합니다.

 

##### **6\. 회원가입 제출 버튼에 업로드 관련 부분 추가**

```swift
@IBAction  func btnActSubmit(_ sender: UIButton) {
    // ...... //
    
    Auth.auth().createUser(withEmail: userEmail, password: userPassword) { [self] authResult, error in
        // ...... //
        
        // 이미지 업로드
        let images = [
            ImageWithName(name: "\(user.uid)/thumb_\(user.uid)", image: userProfileThumbnail, fileExt: "jpg"),
            ImageWithName(name: "\(user.uid)/original_\(user.uid)", image: imgProfilePicture.image!, fileExt: "png")
        ]
        startUploading(images: images) {
            simpleAlert(self, message: "\(user.email!) 님의 회원가입이 완료되었습니다.", title: "완료") { action in
                self.dismiss(animated: true, completion: nil)
            }
        }
    }
}
```

- `images`\- 이미지와 정보가 담긴 `ImageWithName` 객체의 배열입니다. 첫 번째는 섬네일, 두 번째는 원본 파일입니다.
- `startUploading(images: images) { ... }` - `completion` 부분이 트레일링 클로저로 작성되었습니다. 회원가입이 완료되었다는 경고창을 표시한 뒤, 회원가입 창을 닫습니다.
- `user.uid` - 회원의 고유값으로 저장 및 불러오기 할 때 이 값을 이용합니다.

 

\[caption id="attachment\_4116" align="alignnone" width="428"\] ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-10.39.49.jpg) 라이브러리 버튼을 눌렀을 때\[/caption\]

 

\[caption id="attachment\_4117" align="alignnone" width="401"\] ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-10.40.10.jpg) 사진 미리보기\[/caption\]

 

\[caption id="attachment\_4118" align="alignnone" width="416"\] ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-10.43.17.jpg) 회원가입 완료\[/caption\]

 

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-10.44.50.jpg)  ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-20-pm-10.45.45.jpg)

 

#### **전체 코드 (이전 내용 포함)**

```swift
import UIKit
import Firebase
import Photos

class SignUpViewController: UIViewController {

    @IBOutlet weak var txtUserEmail: UITextField!
    @IBOutlet weak var txtPassword: UITextField!
    @IBOutlet weak var txtPasswordConfirm: UITextField!
    @IBOutlet weak var lblPasswordConfirmed: UILabel!
    @IBOutlet weak var pkvInteresting: UIPickerView!
    @IBOutlet weak var imgProfilePicture: UIImageView!
    
    var ref: DatabaseReference!
    
    let interestingList = ["치킨", "피자", "탕수육"]
    var selectedInteresting: String!
    
    let imagePickerController = UIImagePickerController()
    var userProfileThumbnail: UIImage!
    
    /// Here is the completion block
    typealias FileCompletionBlock = () -> Void
    var block: FileCompletionBlock?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 피커뷰 딜리게이트, 데이터소스 연결
        pkvInteresting.delegate = self
        pkvInteresting.dataSource = self
        
        txtUserEmail.delegate = self
        txtPassword.delegate = self
        txtPasswordConfirm.delegate = self
        
        // firebase reference 초기화
        ref = Database.database().reference()
        
        selectedInteresting = interestingList[0]
        lblPasswordConfirmed.text = ""
        
        // 사진, 카메라 권한 (최초 요청)
        PHPhotoLibrary.requestAuthorization { status in
        }
        AVCaptureDevice.requestAccess(for: .video) { granted in
        }
        
        // 사진: 이미지 피커에 딜리게이트 생성
        imagePickerController.delegate = self
        
        // 최초 섬네일 생성
        userProfileThumbnail = makeImageThumbnail(image: #imageLiteral(resourceName: "sample"), maxSize: 200)
        

    }
    
    @IBAction func btnActCancel(_ sender: UIButton) {
        self.dismiss(animated: true, completion: nil)
    }
    
    @IBAction func btnActReset(_ sender: UIButton) {
        txtUserEmail.text = ""
        txtPassword.text = ""
        txtPasswordConfirm.text = ""
        lblPasswordConfirmed.text = ""
        pkvInteresting.selectedRow(inComponent: 0)
        // -- 사진 초기화 --
    }
    
    @IBAction func btnActSubmit(_ sender: UIButton) {
        guard let userEmail = txtUserEmail.text,
              let userPassword = txtPassword.text,
              let userPasswordConfirm = txtPasswordConfirm.text else {
            return
        }
        
        guard userPassword != ""
                && userPasswordConfirm != ""
                && userPassword == userPasswordConfirm else {
            simpleAlert(self, message: "패스워드가 일치하지 않습니다.")
            return
        }
        
        Auth.auth().createUser(withEmail: userEmail, password: userPassword) { [self] authResult, error in
            // 이메일, 비밀번호 전송
            guard let user = authResult?.user, error == nil else {
                simpleAlert(self, message: error!.localizedDescription)
                return
            }
            
            // 추가 정보 입력
            ref.child("users").child(user.uid).setValue(["interesting": selectedInteresting])
            
            // 이미지 업로드
            let images = [
                ImageWithName(name: "\(user.uid)/thumb_\(user.uid)", image: userProfileThumbnail, fileExt: "jpg"),
                ImageWithName(name: "\(user.uid)/original_\(user.uid)", image: imgProfilePicture.image!, fileExt: "png")
            ]
            startUploading(images: images) {
                simpleAlert(self, message: "\(user.email!) 님의 회원가입이 완료되었습니다.", title: "완료") { action in
                    self.dismiss(animated: true, completion: nil)
                }
            }
        }
    }
    
    @IBAction func btnActTakePhoto(_ sender: UIButton) {
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            self.imagePickerController.sourceType = .camera
            doTaskByCameraAuthorization()
        } else {
            simpleAlert(self, message: "카메라 사용이 불가능합니다.")
        }
    }
    
    @IBAction func btnActFromLoadPhoto(_ sender: UIButton) {
        self.imagePickerController.sourceType = .photoLibrary
        doTaskByPhotoAuthorization()
    }
    
    
}

extension SignUpViewController {
    
    func startUploading(images: [ImageWithName], completion: @escaping FileCompletionBlock) {
        if images.count == 0 {
            completion()
            return;
        }
        
        block = completion
        uploadImage(forIndex: 0, images: images)
    }
    
    private func uploadImage(forIndex index:Int, images: [ImageWithName]) {
        
        if index < images.count {
            /// Perform uploading
            
            let imageInfo = images[index]
            let name = imageInfo.name
            let image = imageInfo.image
            let fileExt = imageInfo.fileExt
            let quality = imageInfo.compressionQuality
            
            guard let data = fileExt == "jpg"
                    ? image.jpegData(compressionQuality: quality)
                    : image.pngData() else {
                return
            }
            
            let fileName = "\(name).\(fileExt)"
            
            FirebaseFileManager.shared.setChild("images/users")
            FirebaseFileManager.shared.upload(data: data, withName: fileName, block: { (url) in
                /// After successfully uploading call this method again by increment the **index = index + 1**
                print(url ?? "Couldn't not upload. You can either check the error or just skip this.")
                self.uploadImage(forIndex: index + 1, images: images)
            })
            return;
        }
        
        if block != nil {
            block!()
        }
    }
}

extension SignUpViewController: UIPickerViewDelegate, UIPickerViewDataSource {
    // 컴포넌트(열) 개수
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    // 리스트(행) 개수
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return interestingList.count
    }
    
    // 피커뷰 목록 표시
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return interestingList[row]
    }
    
    // 특정 피커뷰 선택시 selectedInteresting에 할당
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        selectedInteresting = interestingList[row]
    }
}

extension SignUpViewController: UITextFieldDelegate {
    
    func setLabelPasswordConfirm(_ password: String, _ passwordConfirm: String)  {
        
        guard passwordConfirm != "" else {
            lblPasswordConfirmed.text = ""
            return
        }
        
        if password == passwordConfirm {
            lblPasswordConfirmed.textColor = .green
            lblPasswordConfirmed.text = "패스워드가 일치합니다."
        } else {
            lblPasswordConfirmed.textColor = .red
            lblPasswordConfirmed.text = "패스워드가 일치하지 않습니다."
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        
        switch textField {
        case txtUserEmail:
            txtPassword.becomeFirstResponder()
        case txtPassword:
            txtPasswordConfirm.becomeFirstResponder()
        default:
            textField.resignFirstResponder()
        }
        
        return false
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        if textField == txtPasswordConfirm {
            guard let password = txtPassword.text,
                  let passwordConfirmBefore = txtPasswordConfirm.text else {
                return true
            }
            let passwordConfirm = string.isEmpty ? passwordConfirmBefore[0..<(passwordConfirmBefore.count - 1)] : passwordConfirmBefore + string
            setLabelPasswordConfirm(password, passwordConfirm)
            
        }
        return true
    }
}

extension SignUpViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        if let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage {
            imgProfilePicture.image = image
            userProfileThumbnail = makeImageThumbnail(image: image, maxSize: 200)
        }
        dismiss(animated: true, completion: nil)
    }
    
    private func openSetting(action: UIAlertAction) -> Void {
        guard let settingsUrl = URL(string: UIApplication.openSettingsURLString) else {
            return
        }

        if UIApplication.shared.canOpenURL(settingsUrl) {
            UIApplication.shared.open(settingsUrl, completionHandler: { (success) in
                print("Settings opened: \(success)") // Prints true
            })
        }
    }
    
    func doTaskByPhotoAuthorization() {
        switch PHPhotoLibrary.authorizationStatus() {
        case .notDetermined:
            print("photo auth >>> not determined")
            simpleDestructiveYesAndNo(self, message: "사진 권한 설정을 변경하시겠습니까?", title: "권한 정보 없음", yesHandler: openSetting)
        case .restricted:
            print("photo auth >>> restricted")
            simpleAlert(self, message: "시스템에 의해 거부되었습니다.")
        case .denied:
            print("photo auth >>> denied")
            simpleDestructiveYesAndNo(self, message: "사진 기능 권한이 거부되어 사용할 수 없습니다. 사진 권한 설정을 변경하시겠습니까?", title: "권한 거부됨", yesHandler: openSetting(action:))
        case .authorized:
            print("photo auth >>> authorized")
            self.present(self.imagePickerController, animated: true, completion: nil)
        case .limited:
            print("photo auth >>> limited")
            self.present(self.imagePickerController, animated: true, completion: nil)
        @unknown default:
            print("photo auth >>> unknown")
            simpleAlert(self, message: "unknown")
        }
    }
    
    func doTaskByCameraAuthorization() {
        switch AVCaptureDevice.authorizationStatus(for: AVMediaType.video) {
        case .notDetermined:
            print("camera auth >>> not determined")
            simpleDestructiveYesAndNo(self, message: "카메라 권한 설정을 변경하시겠습니까?", title: "권한 정보 없음", yesHandler: openSetting)
        case .restricted:
            print("camera auth >>> restricted")
            simpleAlert(self, message: "시스템에 의해 거부되었습니다.")
        case .denied:
            print("camera auth >>> denied")
            simpleDestructiveYesAndNo(self, message: "카메라 기능 권한이 거부되어 사용할 수 없습니다. 카메라 권한 설정을 변경하시겠습니까?", title: "권한 거부됨", yesHandler: openSetting(action:))
        case .authorized:
            print("camera auth >>> authorized")
            self.present(self.imagePickerController, animated: true, completion: nil)
        @unknown default:
            print("camera auth >>> unknown")
            simpleAlert(self, message: "unknown")
        }
    }
}

```
