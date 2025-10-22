---
title: "iOS 프로그래밍: 색상 선택기(Color Picker; 컬러 피커)를 앱에 추가하기"
date: 2020-04-16
categories: 
  - "DevLog"
  - "Swift UIKit"
tags: 
  - "swift"
---

원문 [바로가기](https://stackoverflow.com/questions/21981640/add-a-color-picker-to-an-ios-app)

* * *

안타깝게도 iOS용 색상 선택기는 내장되어 있지 않습니다. 주로 타사 라이브러리 또는 프로젝트를 사용합니다만, 가능한 경우 다른 라이브러리를 피하는 것이 좋습니다.

 

#### **나만의 색상 선택기(Color Picker; 컬러 피커) 만들기**

컬러 파커를 만들 수 있는 많은 방법이 있지만, 여기에 개요를 보여주는 단순한 예제가 있습니다. 스토리 보드를 다음과 같이 설정했습니다.

![](./assets/img/wp-content/uploads/2020/04/oMnTC.png)

선택한 색상을 표시하는 `UIView` (위 그림에서는 회색 네모박스), 색상 선택을 표시하는 `UIImageView` 및 색상을 선택하는 `UISlider`가 있습니다. `UIImageView`에서 다음 이미지를 사용했습니다.

![](./assets/img/wp-content/uploads/2020/04/y9lT4.png)

스크린샷과 Gimp(오픈소스 그래픽 편집 프로그램)의 색상 선택 도구를 사용하여 [12 스포크의 색상 체인(12-spoke color wheel)](https://www.smashingmagazine.com/2010/02/color-theory-for-designer-part-3-creating-your-own-color-palettes/)의 형태로 만들었습니다. Gimp는 또한 나중에 사용할 색상의 16진수 코드를 얻는 데 유용합니다.

슬라이더의 최소값과 최대 값을 `0.5`와 `13.5`로 설정하십시오. 슬라이더 값을 나중에 정수로 변환하면 이미지의 각 색상마다 하나의 숫자를 반환합니다. 0이 아닌 `0.5`에서 시작하면 슬라이더 색상 변경 위치가 이미지와 더 잘 일치합니다.

![](./assets/img/wp-content/uploads/2020/04/CN5G7.png)

UI 요소를 뷰 컨트롤러(View Controller)에 연결하고 다음 코드를 사용하여 슬라이더 위치를 색상으로 변환하십시오.

```swift
class ViewController: UIViewController {

    // RRGGBB hex colors in the same order as the image
    let colorArray = [ 0x000000, 0xfe0000, 0xff7900, 0xffb900, 0xffde00, 0xfcff00, 0xd2ff00, 0x05c000, 0x00c0a7, 0x0600ff, 0x6700bf, 0x9500c0, 0xbf0199, 0xffffff ]

    @IBOutlet weak var selectedColorView: UIView!
    @IBOutlet weak var slider: UISlider!
    @IBAction func sliderChanged(sender: AnyObject) {
        selectedColorView.backgroundColor = uiColorFromHex(colorArray[Int(slider.value)])
    }

    func uiColorFromHex(rgbValue: Int) -> UIColor {

        let red =   CGFloat((rgbValue & 0xFF0000) >> 16) / 0xFF
        let green = CGFloat((rgbValue & 0x00FF00) >> 8) / 0xFF
        let blue =  CGFloat(rgbValue & 0x0000FF) / 0xFF
        let alpha = CGFloat(1.0)

        return UIColor(red: red, green: green, blue: blue, alpha: alpha)
    }
}
```

 

이제 실행하면 슬라이더를 앞뒤로 움직여 색상을 선택할 수 있습니다.

![](./assets/img/wp-content/uploads/2020/04/vT7BG-e1587019261751.png)

 

#### **변화 (Variations)**

이미지 위에 슬라이더를 놓고 트랙 색조(track tints)를 투명하게 설정하십시오. 이것으로 서브클래스를 만들지 않고도 커스텀 UI의 느낌을 얻을 수 있습니다.

![](./assets/img/wp-content/uploads/2020/04/스크린샷-2020-04-16-오후-3.43.40.png)

 

다음은 아래 이미지에 따라 색상이 변화하는 다른 예제입니다.

![](./assets/img/wp-content/uploads/2020/04/ye3TY.png)

```swift
let colorArray = [ 0x000000, 0x262626, 0x4d4d4d, 0x666666, 0x808080, 0x990000, 0xcc0000, 0xfe0000, 0xff5757, 0xffabab, 0xffabab, 0xffa757, 0xff7900, 0xcc6100, 0x994900, 0x996f00, 0xcc9400, 0xffb900, 0xffd157, 0xffe8ab, 0xfff4ab, 0xffe957, 0xffde00, 0xccb200, 0x998500, 0x979900, 0xcacc00, 0xfcff00, 0xfdff57, 0xfeffab, 0xf0ffab, 0xe1ff57, 0xd2ff00, 0xa8cc00, 0x7e9900, 0x038001, 0x04a101, 0x05c001, 0x44bf41, 0x81bf80, 0x81c0b8, 0x41c0af, 0x00c0a7, 0x00a18c, 0x00806f, 0x040099, 0x0500cc, 0x0600ff, 0x5b57ff, 0xadabff, 0xd8abff, 0xb157ff, 0x6700bf, 0x5700a1, 0x450080, 0x630080, 0x7d00a1, 0x9500c0, 0xa341bf, 0xb180bf, 0xbf80b2, 0xbf41a6, 0xbf0199, 0xa10181, 0x800166, 0x999999, 0xb3b3b3, 0xcccccc, 0xe6e6e6, 0xffffff]
```

 

- 16진수 변환을하지 않으려면 `UIColor` 배열을 사용하십시오.
- 이미지 대신 여러 `UIView`를 사용한 다음 배열에서 직접 색상을 설정할 수 있습니다.

 

* * *

위 내용은 스택오버플로 사이트의 내용을 구글 번역기로 번역한 후 불필요한 내용은 제외하고 나머지는 비문만 수정하였습니다.
