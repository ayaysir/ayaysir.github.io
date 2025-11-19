---
title: "Xcode 프로젝트에 이미지 자르기(crop) 기능 추가: iOS Swift 라이브러리 Mantis 사용 (스토리보드)"
date: 2022-05-10
categories: 
  - "DevLog"
  - "Swift UIKit"
---

### **Xcode 프로젝트에 이미지 자르기(crop) 기능 추가: iOS Swift 라이브러리 Mantis 사용**

카메라 또는 사진을 선택하면 화면에 보여주는 프로젝트가 있는데, 여기서 선택 후 화면에 표시하기 전 크롭(crop) 기능을 이용해 이미지를 자르는 기능을 추가하고자 합니다.

- [Swift(스위프트): 카메라 및 사진 라이브러리 권한 물어보기 + UIImagePickerController를 이용한 사진 추가 (스토리보드)](/posts/swift%EC%8A%A4%EC%9C%84%ED%94%84%ED%8A%B8-%EC%B9%B4%EB%A9%94%EB%9D%BC-%EB%B0%8F-%EC%82%AC%EC%A7%84-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EA%B6%8C%ED%95%9C-%EB%AC%BC%EC%96%B4%EB%B3%B4/)

 

직접 구현하려면 매우 어려운 기능이지만 다행히 [Mantis](https://github.com/guoyingtao/Mantis)라는 외부 라이브러리가 있어 크롭 기능을 손쉽게 추가할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/05/simulator_screenshot_EA4D4834-5F52-474A-BD22-CC588AC2B261.jpg)

 

아래 코드 목록에서 `PhotoViewController.swift`를 사용합니다.

<!-- https://gist.github.com/ayaysir/c1ba58ea822ebd80ca6eb39262e52efb -->
{% gist "c1ba58ea822ebd80ca6eb39262e52efb" %}
 
## **절차**

### **1) Mantis 라이브러리를 CocoaPods, Swift Packages 등을 이용해 설치합니다.**

- [Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법](/posts/xcode-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-%EC%BD%94%EC%BD%94%EC%95%84%ED%8C%9Fcocoapods-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EB%94%94%ED%8E%9C%EB%8D%98%EC%8B%9C-%EC%B6%94%EA%B0%80-%EB%B0%A9/)


```ruby
pod 'Mantis'
```

 

### **2) 설치가 완료되었다면 프로젝트를 열고 뷰 컨트롤러에 `Mantis`를 `import` 합니다.**

```swift
import UIKit
import Mantis
```

 

### **3) `CropViewControllerDelegate`를 구현하는 아래 `extension`을 추가합니다.**

```swift
extension PhotoViewController: CropViewControllerDelegate {
    func cropViewControllerDidCrop(_ cropViewController: CropViewController, cropped: UIImage, transformation: Transformation, cropInfo: CropInfo) {

        // 이미지 크롭 후 할 작업 추가

        cropViewController.dismiss(animated: true, completion: nil)
    }
    
    func cropViewControllerDidCancel(_ cropViewController: CropViewController, original: UIImage) {
        cropViewController.dismiss(animated: true, completion: nil)
    }
        
    private func openCropVC(image: UIImage) {
        let cropViewController = Mantis.cropViewController(image: image)
        cropViewController.delegate = self
        cropViewController.modalPresentationStyle = .fullScreen
        self.present(cropViewController, animated: true)
    }
}

```

- `cropViewControllerDidCrop(...)`
    - 필수적으로 구현해야 하는 프로토콜 스텁(Protocol stub)이며, 이미지 크롭 작업 완료 후 실행할 내용을 작성합니다.
    - 크롭뷰 컨트롤러(`cropViewController`)를 사라지게 하는 `dismiss`를 추가합니다.
    - 이 함수가 실행되는 영역은 `cropViewController`이므로 `cropViewController` 대신 `self`를 넣어도 됩니다.
- `cropViewControllerDidCancel(...)`
    - 필수 프로토콜 스텁이며 이미지 크롭 작업이 취소(`cancel`)되었을 때 해야할 작업을 지정합니다.
    - 취소 후 따로 할 일이 없으므로 컨트롤러(`cropViewController`)를 사라지게 합니다.
- `openCropVC(image: UIImage)`
    - 카메라 촬영 후 또는 이미지 선택 후 그 이미지를 바탕으로 이미지 크롭 컨트롤러를 실행하는 코드입니다.
    - iOS 13 이후 버전은 `cropViewController.modalPresentationStyle = .fullScreen` 를 지정해야 합니다.

 

### **4) 기존 이미지 피커 컨트롤러 부분에서 크롭 뷰 컨트롤러를 띄우도록 변경합니다.**

```swift
// 3) 이미지 피커 관련 프로토콜을 클래스 상속 목록에 추가
extension PhotoViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    // 4) 카메라 또는 사진 라이브러리에서 사진을 찍거나 선택했을 경우 실행할 내용 작성
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        if let image = info[.originalImage] as? UIImage {
//            imgView.image = image // <- 삭제하고 cropViewControllerDidCrop에서 실행
            
            dismiss(animated: true) {
                self.openCropVC(image: image)
            }
            
        }
        dismiss(animated: true, completion: nil)
    }
}
```

- 기존에 하던 작업을 삭제하고 cropViewControllerDidCrop 함수로 옮깁니다.
- dismiss 후 클로저 함수로 self.openCropVC(image: image) 를 실행해야 합니다. 별도로 분리할 경우 크롭뷰 컨트롤러가 뜨지 않습니다.

 

### **5) `4번`에서 삭제한 부분을 `cropViewControllerDidCrop`로 옮깁니다.**

```swift
func cropViewControllerDidCrop(_ cropViewController: CropViewController, cropped: UIImage, transformation: Transformation, cropInfo: CropInfo) {
    // 기존 작업 부분
    imgView.image = cropped
    
    cropViewController.dismiss(animated: true, completion: nil)
}
```

 

좀 더 자세한 사용법은 [Mantis](https://github.com/guoyingtao/Mantis) 페이지에서 볼 수 있습니다. 비율 강제 고정, 커스텀 비율 추가, 다양한 모양으로 자르기, 로컬라이징 등이 가능합니다.

예를 들어 원래는 크롭 뷰 컨트롤러에서 다양한 이미지 비율을 지원하지만, 이를 무시하고 강제적으로 이미지 자르기 비율을 `1:1`로 고정하려면 `openCropVC` 함수에 아래와 같은 코드를 추가하면 됩니다. 사용자 프로필 사진 등 비율이 강제되는 사진 자르기 기능에 적합합니다.

```swift
cropViewController.config.presetFixedRatioType = .alwaysUsingOnePresetFixedRatio(ratio: 1.0)
```

 

## **실행 화면**

<!-- http://www.giphy.com/gifs/PIW6cAxBkqAL2UN35P -->
![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWM0d3BnZXBpZGRwdHNtMmI1cnhvaGxvdGE1bHE0aTQxOWNrOHlwdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PIW6cAxBkqAL2UN35P/giphy.gif)
