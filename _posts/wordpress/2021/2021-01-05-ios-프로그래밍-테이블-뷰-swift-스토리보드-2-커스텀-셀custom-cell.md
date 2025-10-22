---
title: "iOS 프로그래밍: 테이블 뷰 (Swift, 스토리보드) 2 - 커스텀 셀(custom cell) 추가"
date: 2021-01-05
categories: 
  - "DevLog"
  - "Swift UIKit"
---

[iOS 프로그래밍: 테이블 뷰 (Swift, 스토리보드) 1 - 테이블 뷰 추가](http://yoonbumtae.com/?p=3379)

 

커스텀 셀이란 Xcode에서 일반적으로 제공하는 테이블 셀이 아닌 사용자가 직접 새로운 형태의 셀을 만들어 테이블 뷰에 적용하는 것을 뜻합니다.

 

#### **1) 커스텀 셀 오브젝트 배치**

먼저, 메인 스토리보드에서 테이블 뷰의 셀 크기를 충분히 늘린 뒤, 이미지와 레이블 등을 자유자재로 배치합니다.

![](./assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-05-오후-11.41.19.png)

 

#### **2) 셀 크기 조정**

크기를 조절하려면 테이블 뷰 오브젝트와, 테이블 뷰 안의 셀을 각각 선택하고, 오른쪽 옵션창의 `Size Insepctor`에서 `Automatic` 을 체크 해제하고 `Height`를 조절하면 됩니다.

![](./assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-05-오후-11.42.44.png)

![](./assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-05-오후-11.43.02.png)

 

그리고 기존에 지정되어 있던 셀을 임의로 만든 커스텀 클래스에 배정해야 합니다. 테이블 뷰 셀을 클릭한 뒤, `Identifier Inspector`에서 기존 클래스를 삭제하고 새로운 클래스 이름을 작성합니다.

![](./assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-05-오후-11.46.00.png)

 

#### **3) 오브젝트 대응 변수 생성**

다음, `ViewController` 파일에 새로운 클래스를 방금 작성했던 `ListCell` 이라는 이름으로 생성합니다. 그리고 `@IBOutlet` 이라는 컴파일러에게 지정하는 특별 예약어를 붙인 다음, `weak` 키워드를 붙이고 (참고: [weak와 strong의 차이점](https://soooprmx.com/archives/5123)) 앞서 제작했던 커스텀 셀의 요소대로 새로운 변수를 생성합니다. 앞에서는 이미지 뷰 하나와 레이블 2개를 만들었으므로 대응해서 추가합니다.

```
class ListCell: UITableViewCell {
    @IBOutlet weak var imgView: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var bountyLabel: UILabel!
}

```

 

#### **4) 오브젝트 변수와 실제 오브젝트 연결**

다음으로 위의 `@IBOutlet` 과 스토리보드의 오브젝트 간에 연결해야 합니다. 메인 스토리보드를 띄운 뒤, 오른쪽 빨간박스 아이콘을 클릭하면 `Assistant`라는 메뉴가 있습니다. 이것을 클릭하면 스토리보드와 연결된 뷰 컨트롤러 코드가 양쪽으로 표시됩니다.

![](./assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-05-오후-11.55.04.png)

오른쪽 코드에서 동그라미 부분을 마우스 왼쪽 클릭하고 왼쪽 뷰의 각 요소로 드래그하면, 오브젝트와 `@IBOutlet` 간 연결이 됩니다.

![](./assets/img/wp-content/uploads/2021/01/-2021-01-05-오후-11.55.55-e1609858858869.jpg) ![](./assets/img/wp-content/uploads/2021/01/-2021-01-05-오후-11.56.01-e1609858874999.jpg) ![](./assets/img/wp-content/uploads/2021/01/-2021-01-05-오후-11.56.04-e1609858896676.jpg)

 

빌드를 완료한 뒤 아래와 같이 커스텀 셀이 적용되는지 확인합니다. (아래 스크린샷은 추가 작업을 한 상태기 때문에 커스텀 사진과 레이블이 적용되었습니다.)

![](./assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-05-오후-11.57.18.png)
