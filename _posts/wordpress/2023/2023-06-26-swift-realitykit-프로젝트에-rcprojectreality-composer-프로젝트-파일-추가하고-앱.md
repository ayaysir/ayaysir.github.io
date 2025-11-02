---
title: "Swift: RealityKit 프로젝트에 .rcproject(Reality Composer 프로젝트 파일) 추가하고 앱에 통합하기"
date: 2023-06-26
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

Reality Composer 앱으로 만든 프로젝트를 Swift iOS 프로젝트에 추가하고 앱에 연동(통합)시키는 방법입니다.

 

#### **방법**

##### **1) 프로젝트 생성**

- `Augmented Reality App`
- `Content Technology`를 `RealityKit`으로 설정

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.38.34-복사본.jpg)

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.38.50-복사본.jpg)

이 상태에서 프로젝트를 실행하면 `Experience.rcproject`라는 프로젝트 파일이 이미 존재하며 앱을 실제 기기에서 실행하면 박스가 하나 표시될 것이지만, 이 포스트에서는 해당 기본 파일을 사용하지 않고 다른 파일을 불러올 것입니다.

 

##### **2) .rcproject 파일 추가**

아이폰의 [Reality Composer 앱](https://apps.apple.com/us/app/reality-composer/id1462358802)에서 작업한 프로젝트 파일을 에어드랍 등을 이용해서 Xcode가 있는 PC로 옮깁니다. 확장자는 `.rcproject`입니다.

 ![](/assets/img/wp-content/uploads/2023/06/IMG_B802B6D77D26-1-복사본.jpeg)

 

파일을 프로젝트 내부로 드래그 앤 드롭합니다.

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.26.01-복사본.jpg)

 

이 때 원본 파일은 보존한 상태로 두고 싶다면 `Copy items if needed`를 클릭합니다.

- `체크한 경우` 파일이 프로젝트 내부 폴더로 복사됩니다.
- `체크하지 않으면` 파일이 복사되지 않고 원본 폴더에 그대로 위치하며 변동 사항이 그대로 적용됩니다. 프로젝트에서 삭제할 때 휴지통에 버리기 옵션을 선택한 경우 원본 파일이 휴지통으로 이동합니다.

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.26.50-복사본.jpg)

 

##### **3) 추가한 .rcproject 파일을 enum으로 자동 변환**

예를 들어 `Drum.rcproject` 파일을 추가했다면 해당 파일을 바탕으로 자동으로 `enum` 클래스가 생성되며 Swift 코드 내부에서 실행할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.56.24.png)

다만 그대로 진행하면 오류가 발생하기 때문에 다음 두 가지 사항을 진행합니다.

1. `command + B` 버튼을 눌러 다시 빌드
2. (1)번으로도 해결되지 않은 경우 Xcode 프로젝트를 **껐다 다시 켬**

 

먼저 뷰 컨트롤러 코드에서 `let boxAnchor = try! Experience.loadBox()` 을 지우거나 코멘트 처리합니다. 기본 Experience 파일을 로드하지 않습니다.

```
override func viewDidLoad() {
    super.viewDidLoad()
    
    // Load the "Box" scene from the "Experience" Reality File
    // let boxAnchor = try! Experience.loadBox()
     
    // ... //
}
```

 

다시 빌드가 완료된 경우 다음처럼 자동 추천에 `load장면()` 함수가 뜹니다.

 ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.30.47-복사본.jpg)

Drum 파일의 `"장면"` 장면(scene)을 의미하는 코드를 추가합니다.

```
// "장면" 장면을 "Drum" Reality 파일에서 불러옴
let boxAnchor = try! Drum.load장면()
```

 

앱을 실제 기기에서 실행하면 다음과 같이 나옵니다.

{% youtube "https://youtu.be/zOrYaC8WRW4" %}

 

> **참고) 함수 이름이 `load장면()`인 이유**
> 
> 장면(scene) 이름이 한글 그대로 `"장면"`이기 때문에 그렇게 표시되는 것입니다.
> 
>  ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.33.41-복사본.jpg)

 

> **참고) loading(assetPath: "audio:com.apple.rc.audio.sound-effects.tube-hit-fx-01/....caf") 에러가 발생하는 경우**
> 
> 1\. Xcode에서 프로젝트 파일을 누른 후 `Open in Reality Composer`를 클릭합니다.
> 
>  ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.28.05-복사본.jpg)
> 
> 2\. 빨간 배지가 뜬 `정보` 버튼을 누른 뒤 컴퓨터에 없는 자료들을 모두 다운로드 한 뒤 다시 실행합니다.
> 
>  ![](/assets/img/wp-content/uploads/2023/06/스크린샷-2023-06-26-오후-9.01.13-복사본.jpg)
