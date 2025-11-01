---
title: "Swift(스위프트): Page Controller View (페이지 넘기기) 기초 (스토리보드)"
date: 2021-08-26
categories: 
  - "DevLog"
  - "Swift UIKit"
---

출처 [블로그](https://escape-anaemia.tistory.com/entry/UIPageViewController) - 찾아본 결과 여기에 나온 설명이 제일 이해하기 편했습니다.

iOS로 된 전자책이나 앨범 등을 만들 때 이미지를 좌우로 스와이프해서 넘기는 형태로 만들 필요가 있습니다. 이럴 때 사용하는 뷰 컨트롤러가 페이지 뷰 컨트롤러 (`UIPageViewController`) 입니다.

 

#### **스토리보드**

먼저 스토리보드에서 페이지 뷰 컨트롤러를 생성합니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.26.34.jpg)

 

페이지 뷰 컨트롤러는 다른 뷰 컨트롤러를 배열에 담은 다음, 그 배열을 데이터소스가 탐색하면서 페이지가 이동하는 형식으로 되어있습니다. 따라서 페이지 뷰 컨트롤러에서 나타낼 뷰 컨트롤러(`UIViewController`)들을 생성해야 합니다.

뷰 컨트롤러의 생성 방법에는 스토리보드에서 생성하는 방법과 뷰 컨트롤러 코드 내에서 동적으로 생성하는 방법이 있는데, 여기서는 이해하기 쉽게 뷰 컨트롤러에서 생성한 다음 각 컨트롤러에 스토리보드 아이디를 부여한 다음 페이지 뷰 컨트롤러에서 아이디를 통해 로딩하는 방식을 사용하겠습니다.

 

스토리보드에서 뷰 컨트롤러를 페이지 개수만큼 생성합니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.29.50.jpg)

 

각각 뷰 컨트롤러를 선택 후, `Identity Inspector`에서 스토리보드 아이디(`Storyboard ID`)를 설정합니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.31.40.jpg)

 

UIPageViewController를 상속받는 페이지뷰 컨트롤러 소스코드를 생성합니다.

```
class PageViewController: UIPageViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
    }

}
```

 

이 소스코드를 아까 생성한 스토리뷰의 페이지 뷰 컨트롤러에 연결합니다. 마찬가지로 `Identity Inspector`를 사용합니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.36.26.jpg)

 

그 다음에는 가장 첫 화면에 이 페이지 뷰 컨트롤러를 표시할 부분을 만들어야 합니다. 뷰 안에 다른 뷰 컨트롤러를 포함하여 표시하려면 `Container View`를 사용하면 됩니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.38.10.jpg)

 

해당 컨테이너 뷰로부터 페이지 뷰 컨트롤러로 드래그한 다음, 연결 방식으로 `embed`를 선택합니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.39.48.jpg)

 

여기까지 마치면 메인 뷰 컨트롤러 안에 페이지 뷰 컨트롤러가 `embed`로 포함됩니다. 최종적으로 다음과 같은 형태로 스토리보드가 구성됩니다.

 ![](/assets/img/wp-content/uploads/2021/08/스크린샷-2021-08-26-오후-11.40.49.jpg)

 

#### **코드 구현**

`PageViewController` 안에 배열과 유틸리티 함수를 작성합니다.

```
lazy var vcArray: [UIViewController] = {
    return [self.vcInstance(name: "FirstPageVC"),
            self.vcInstance(name: "SecondPageVC"),
            self.vcInstance(name: "ThirdPageVC")]
}()

private func vcInstance(name: String) -> UIViewController{
    return UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: name)
}
```

- `vcInstance` 함수는 스토리보드 아이디에 맞는 뷰 컨트롤러 인스턴스를 반환하는 함수입니다.
- `vcArray`는 위에서 생성한 페이지를 구성하는 하위 뷰 컨트롤러들의 인스턴스를 담는 배열이며, `lazy var` 를 사용해 실제 인스턴스가 사용되는 시점에 인스턴스가 생성돼 메모리에 적재하도록 되어있습니다.

 

`UIPageViewControllerDataSource`, `UIPageViewControllerDelegate`을 구현하는 페이지 뷰 컨트롤러의 extension을 생성합니다.

```
extension PageViewController: UIPageViewControllerDataSource, UIPageViewControllerDelegate {
    
    func pageViewController(_ pageViewController: UIPageViewController, viewControllerBefore viewController: UIViewController) -> UIViewController? {

    }
    
    func pageViewController(_ pageViewController: UIPageViewController, viewControllerAfter viewController: UIViewController) -> UIViewController? {

    }
    
}
```

딜리게이트, 데이터소스 프로토콜을 구현하면 IDE가 필수로 구현해야 할 protocol stub을 추천하므로 그대로 사용하면 됩니다.

위의 함수는 이전 페이지로 넘기는 과정, 아래 함수는 다음 페이지로 넘기는 과정입니다.

 

`viewDidLoad` 안에 딜리게이트, 데이터소스를 연결하고 첫 번째 컨트롤러(페이지)를 기본으로 나타나도록 설정합니다.

```
// 딜리게이트, 데이터소스 연결
self.dataSource = self
self.delegate = self

// 첫 번째 페이지를 기본 페이지로 설정
if let firstVC = vcArray.first {
    setViewControllers([firstVC], direction: .forward, animated: true, completion: nil)
}
```

 

위의 프로토콜 stub의 구체적인 내용을 구현합니다. 먼저 이전 페이지로 넘기는 액션입니다.

```
func pageViewController(_ pageViewController: UIPageViewController, viewControllerBefore viewController: UIViewController) -> UIViewController? {
    // 배열에서 현재 페이지의 컨트롤러를 찾아서 해당 인덱스를 현재 인덱스로 기록
    guard let vcIndex = vcArray.firstIndex(of: viewController) else { return nil }
    
    // 이전 페이지 인덱스
    let prevIndex = vcIndex - 1
    
    // 인덱스가 0 이상이라면 그냥 놔둠
    guard prevIndex >= 0 else {
        return nil
        
        // 무한반복 시 - 1페이지에서 마지막 페이지로 가야함
        // return vcArray.last
    }
    
    // 인덱스는 vcArray.count 이상이 될 수 없음
    guard vcArray.count > prevIndex else { return nil }
    
    return vcArray[prevIndex]
}
```

- `vcIndex` - 현재 페이지의 인덱스입니다. 참고로 인덱스는 배열의 인덱스를 사용하므로 0부터 시작합니다.
- `prevIndex` - 이전 페이지의 인덱스입니다.
- `prevIndex` 가 0 이상이라면 계속 진행하고, 아니라면 첫페이지라는 의미이므로 `nil`을 리턴합니다. `nil`을 리턴하면 더 이상 페이지 넘김이 진행되지 않습니다. 만약 무한반복되는 형태를 원한다면 마지막 페이지를 리턴하도록 합니다.
- 최종적으로 `prevIndex`번째의 뷰 컨트롤러를 반환합니다.

 

다음 페이지로 넘기는 액션입니다.

```
func pageViewController(_ pageViewController: UIPageViewController, viewControllerAfter viewController: UIViewController) -> UIViewController? {
    guard let vcIndex = vcArray.firstIndex(of: viewController) else { return nil }
    
    // 다음 페이지 인덱스
    let nextIndex = vcIndex + 1
    
    guard nextIndex < vcArray.count else {
        return nil
        
        // 무한반복 시 - 마지막 페이지에서 1 페이지로 가야함
        // return vcArray.first
    }
    
    guard vcArray.count > nextIndex else { return nil }
    
    return vcArray[nextIndex]
}
```

- `nextIndex` - 다음 페이지의 인덱스입니다.
- `nextindex`가 `(배열 카운트 - 1)` 과 같다면 마지막 페이지이므로 `nil` 또는 첫번째 페이지를 리턴합니다.

 

 

<iframe width="480" height="387" src="https://giphy.com/embed/UwSJ2BRb75dTALuJ5Z" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>
