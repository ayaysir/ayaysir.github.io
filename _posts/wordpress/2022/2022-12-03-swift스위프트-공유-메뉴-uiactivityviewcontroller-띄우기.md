---
title: "Swift(스위프트): 공유 메뉴 (UIActivityViewController) 띄우기"
date: 2022-12-03
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

 ![](/assets/img/wp-content/uploads/2022/12/IMG_9539.jpg)

공유 메뉴는 아래와 같은 형태로 수많은 앱에서 `[공유]`, `[공유하기]` 등의 이름으로 존재하는 기능입니다. 특정 메시지나 URL, 이미지, 파일 등을 에어드롭(AirDrop)이나 메시지, 메일, 다른 앱으로 보낼 수 있습니다.

예를 들어 메시지 아이콘을 클릭하면 아래와 같이 영상 URL이 메시지에 첨부됩니다.

 ![](/assets/img/wp-content/uploads/2022/12/IMG_51CBA484A86F-1.jpeg)

이러한 공유 메뉴를 _**Acitivity View**_라고 합니다. Swift에서는 `UIActivityViewController`로 공유 메뉴를 띄울 수 있습니다.

 

### **코드**

##### **1단계: 프로젝트에 아래 함수를 추가합니다.**

```swift
import UIKit

func showActivityVC(_ controller: UIViewController,
                     activityItems: [Any],
                     sourceRect: CGRect,
                     completion: (() -> ())? = nil) {
    let activityVC = UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
    activityVC.excludedActivityTypes = [.postToTwitter, .postToWeibo, .postToVimeo, .postToFlickr, .postToFacebook, .postToTencentWeibo]
    
    // 아이패드 - activity view를 popover 할 기준 view 지정
    activityVC.popoverPresentationController?.sourceView = controller.view
    // 아이패드 - activity view를 어디에서 표시할 것인지 해당 구역(CGRect) 지정
    activityVC.popoverPresentationController?.sourceRect = sourceRect
    
    controller.present(activityVC, animated: true, completion: completion)
}

```

- `activityItems`에는 여러 아이템을 첨부할 수 있습니다. 타입이 `[Any]`이므로 말 그대로 아무 타입의 아이템을 넣는 것이 가능합니다. Apple은 다음과 같이 설명합니다.
    
    > 액티비티(Activity)를 수행할 데이터 오브젝트의 배열입니다. 배열의 유형은 가변적이며 애플리케이션이 관리하는 데이터에 따라 다릅니다. 예를 들어 데이터는 현재 선택된 콘텐츠를 나타내는 하나 이상의 텍스트 또는 이미지 오브젝트로 구성될 수 있습니다. (...) 이 배열은 `nil`이 아니어야 하며 적어도 하나의 오브젝트를 포함해야 합니다.
    
- `excludedActivityTypes`에는 액티비티 뷰에서 기본적으로 제공하는 서비스 중 제외할 서비스를 지정합니다. 예를 들어 `.postTwitter`는 iOS에서 기본적으로 제공하는 트위터 전송 기능을 제외시킵니다.
    - 참고로 `.postTwitter`를 추가한 경우 앱 스토어서 Twitter 앱을 설치하더라도 트위터로 보내는 기능이 제외됩니다.
- `10-13 라인`은 아이패드에서 충돌이 발생하는 것을 방지하기 위한 것입니다. 만약 아이폰에서만 동작하는 앱인 경우, 이 부분과 함수의 `sourceRect` 파라미터는 제외해도 됩니다.
    - 아이패드(iPadOS)는 공유 메뉴를 아래 그림과 같이 popover presentation 방식으로 출력합니다.
    - `sourceView`는 어떤 뷰 위에 액티비티 뷰를 표시할지 지정하는 부분입니다.
    - `sourceRect`는 어느 위치를 기준으로 액티비티 뷰를 표시할지 지정하는 부분입니다. 예를 들어 빨간색 박스 부분을 sourceRect로 지정하면, 해당 박스를 기준으로 말풍선 화살표가 생기며 그 화살표를 기준으로 나머지 액티비티 뷰를 표시합니다.  ![](/assets/img/wp-content/uploads/2022/12/IMG_37E8B4912C4B-1.jpeg) 다른 예로 `sourceRect`를 특정 셀의 `frame`으로 지정한 경우에는 아래와 같이 표시됩니다.  ![](/assets/img/wp-content/uploads/2022/12/IMG_FF73D7B22456-1.jpeg)

 

##### **2단계: 사용할 뷰 컨트롤러에서 (버튼을 클릭했을때 등의 이벤트 안에) 다음과 같이 사용합니다.**

아래 코드는 텍스트와 이미지를 첨부해서 공유 메뉴를 표시합니다.

```swift
@IBOutlet weak var imgPhoto: UIImageView!

// (...) //

var shareList = [Any]()
shareList.append(imgPhoto.image!)
shareList.append("이미지와 텍스트 - 나의 App에서 보냄")

let cell = tableView.cellForRow(at: IndexPath(row: 0, section: 0))
showActivityVC(self, activityItems: shareList, sourceRect: cell!.frame)
```

 ![](/assets/img/wp-content/uploads/2022/12/IMG_BF9B2B2E0412-1.jpeg)

아이폰의 경우 위와 같이 표시되며, 아이패드에서는 1단계 상세설명의 스크린샷과 같이 위치에 맞게 표시됩니다.
