---
title: "Swift(스위프트): 컬렉션 뷰의 셀을 길게 누르면(long press touch) 애니메이션 나타나도록 하기"
date: 2022-05-04
categories: 
  - "DevLog"
  - "Swift"
---

#### **참고**

- [iOS 프로그래밍: 컬렉션 뷰 (Swift, 스토리보드) – 컬렉션 뷰 추가, 커스텀 셀 작성](http://yoonbumtae.com/?p=3418)

 

### **Swift(스위프트): 컬렉션 뷰의 셀을 길게 누르면(long press touch) 애니메이션 나타나도록 하기**

#### **개요**

기존의 프로젝트 코드를 기반으로 롱 프레스 터치(길게 터치하기) 작업을 추가하고, 롱 프레스 시에 셀이 살짝 작아졌다 놓으면 다시 원상 복귀하는 애니메이션이 추가되도록 만들어 보겠습니다.

\[caption id="attachment\_4421" align="alignnone" width="384"\] ![](/assets/img/wp-content/uploads/2022/05/Simulator-Screen-Shot-iPhone-13-Pro-2022-05-04-at-23.03.04.jpg) 기존 프로젝트의 기기 스크린샷\[/caption\]

 

![](https://media.giphy.com/media/SyGH9NSGZnaJVqE4on/giphy.gif)

변경 사항 적용된 프로젝트

 

#### **기존 프로젝트**

```
import UIKit

struct ImageInfo {
    
    let name: String
    
    var image: UIImage? {
        return UIImage(named: "\(name).jpg")
    }
    
    init (name: String) {
        self.name = name
    }
}

class ViewController: UIViewController {
    
    let viewModel = ImageViewModel() // 뷰모델 변수를 추가합니다.
    
    @IBOutlet weak var collectionView: UICollectionView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
    }
}

extension ViewController: UICollectionViewDataSource, UICollectionViewDelegate {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return viewModel.countOfImageList // 뷰모델에서 카운트 가져옴
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath) as?
                Cell else {
            return UICollectionViewCell()
        }
        
        let imageInfo = viewModel.imageInfo(at: indexPath.item) // indexPath.item을 기준으로 뷰모델에서 ImageInfo 가져옴
        cell.update(info: imageInfo) // 해당 셀을 업데이트
        return cell

    }
    
    // 셀이 선택되었을 때
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        let imageInfo = viewModel.imageInfo(at: indexPath.item)
        
        let dialog = UIAlertController(title: "\(imageInfo.name)", message: "", preferredStyle: .alert)
        let action = UIAlertAction(title: "확인", style: UIAlertAction.Style.default)

        dialog.addAction(action)

        self.present(dialog, animated: true, completion: nil)

    }
}

class Cell: UICollectionViewCell {
    
    @IBOutlet weak var imgView: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    
    func update(info: ImageInfo) {
        imgView.image = info.image
        nameLabel.text = info.name
    }
}

// view model
class ImageViewModel {
    
    let imageInfoList: [ImageInfo] = [
        ImageInfo(name: "Chrysanthemum"),
        ImageInfo(name: "Desert"),
        ImageInfo(name: "Hydrangeas"),
        ImageInfo(name: "Jellyfish"),
        ImageInfo(name: "Koala"),
        ImageInfo(name: "Lighthouse"),
        ImageInfo(name: "Penguins"),
        ImageInfo(name: "Tulips"),
    ]
    
    var countOfImageList: Int {
        return imageInfoList.count
    }
    
    func imageInfo(at index: Int) -> ImageInfo {
        return imageInfoList[index]
    }
}

```

 

\[caption id="attachment\_4422" align="alignnone" width="948"\] ![](/assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-04-오후-11.07.56.jpg) 컬렉션 뷰 @IBOutlet 연결\[/caption\]

 

 

\[caption id="attachment\_4419" align="alignnone" width="821"\] ![](/assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-04-오후-10.58.13.jpg) 셀 요소 @IBOutlet 연결\[/caption\]

 

 

\[caption id="attachment\_4420" align="alignnone" width="969"\] ![](/assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-04-오후-10.59.14.jpg) asset에 이미지 추가\[/caption\]

 

 

 

#### **추가 코드**

##### **1) viewDidLoad()에 다음 부분을 추가합니다.**

```
override func viewDidLoad() {
    super.viewDidLoad()
    setupLongGestureRecognizerOnCollection()
}
```

 

##### **2) ViewController에 UIGestureRecognizerDelegate 프로토콜을 구현하는 다음 extension 및 함수를 추가합니다.**

```
extension ViewController: UIGestureRecognizerDelegate {

    // long press 이벤트 부여
    private func setupLongGestureRecognizerOnCollection() {
        
        let longPressedGesture = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(gestureRecognizer:)))
        longPressedGesture.minimumPressDuration = 0.5
        longPressedGesture.delegate = self
        longPressedGesture.delaysTouchesBegan = true
        collectionView.addGestureRecognizer(longPressedGesture)
    }
  
    // .... //
}
```

- `longPressedGesture`
    - 롱프레스 제스처 인식기(`UILongPressGestureRecognizer`)를 생성합니다.
    - 롱 프레스 시 수행할 작업으로 셀렉터 함수 `#selector(handleLongPress(gestureRecognizer:))` 를 지정합니다.
    - `minimumPressDuration` - 해당 롱 프레스 터치를 시작하기(`began`) 위한 최소 시간을 초 단위로 지정합니다.
    - `delegate` - 딜리게이트로 뷰 컨트롤러를 지정합니다.
    - `delaysTouchesBegan` - 기존의 터치 작업이 있을 시 그 터치와 분리하여 감지할 필요가 있는 경우 true로 설정합니다. ([애플 문서](https://developer.apple.com/documentation/uikit/uigesturerecognizer/1624234-delaystouchesbegan))
- `collectionView.addGestureRecognizer(longPressedGesture)`
    - 컬렉션 뷰에 해당 롱 프레스 인식기를 추가합니다.

 

셀렉터 함수인 handleLongPress를 구현하지 않았다는 메시지가 뜨므로 해당 함수도 추가로 구현합니다.

 

##### **3) handleLongPress(gestureRecognizer:) 추가**

```
    // long press 이벤트 액션
    @objc func handleLongPress(gestureRecognizer: UILongPressGestureRecognizer) {
        
        let location = gestureRecognizer.location(in: collectionView)
        // let collectionView = gestureRecognizer.view as! UICollectionView
        
        if gestureRecognizer.state == .began {
            
            // 롱 프레스 터치가 시작될 떄

        } else if gestureRecognizer.state == .ended {

            // 롱 프레스 터치가 끝날 떄

        } else {
            return
        }
    }
}
```

- `location` - 해당 뷰에서 터치된 위치의 좌표입니다.
- `gestureRecognizer.view` - 터치 위치에 있는 대상 뷰를 동적으로 불러오고자 할 때 사용합니다. (옵션 사항)
- `gestureRecognizer.state`
    - 여러 스테이트가 있지만 이 예제에서는 `.began` 과 `.ended` 만을 사용합니다.
    - `.began` - 롱 프레스 터치가 시작될 때
    - `.ended` - 롱 프레스 터치가 끝나고 손이 떼졌을 때

 

##### **4) .began 부분을 구현합니다.**

```
if gestureRecognizer.state == .began {
    
    if let indexPath = collectionView.indexPathForItem(at: location) {
        print("Long press at item began: \(indexPath.row)")
        
        // animation
        UIView.animate(withDuration: 0.2) {
            if let cell = collectionView.cellForItem(at: indexPath) as? Cell {
                self.currentLongPressedCell = cell
                cell.transform = .init(scaleX: 0.95, y: 0.95)
            }
        }
    }
}
```

- `let indexPath = collectionView.indexPathForItem(at: location)`
    - `location` 위치를 기반으로 해당 셀의 `indexPath`를 가져옵니다.
- `UIView.animate(withDuration: 0.2)`
    - 0.2초간 애니메이션을 실행합니다.
- `let cell = collectionView.cellForItem(at: indexPath) as? Cell`
    - 위에서 가져온 `IndexPath`에 있는 `Cell` 객체를 불러옵니다.
    - 이 셀을 `self.currentLongPressedCell`에 저장합니다. 이는 롱 프레스 중 위치 이동으로 이한 오작동을 방지하기 위함이며 잠시 후 설명합니다.
    - `cell.transform = .init(scaleX: 0.95, y: 0.95)` - 터치가 시작되었을 때 해당 셀의 크기를 가로세로 95%로 축소합니다.

 

##### **5) ViewController에 currentLongPressedCell 변수를 추가합니다.**

```
var currentLongPressedCell: Cell?
```

 

##### **6) .ended 부분을 구현합니다.**

```
if let indexPath = collectionView.indexPathForItem(at: location) {
    print("Long press at item end: \(indexPath.row)")
    
    // animation
    UIView.animate(withDuration: 0.2) {
        if let cell = self.currentLongPressedCell  {
            cell.transform = .init(scaleX: 1, y: 1)
            
            if cell == collectionView.cellForItem(at: indexPath) as? Cell {
                
                let imageInfo = self.viewModel.imageInfo(at: indexPath.item)
                
                let dialog = UIAlertController(title: "\(imageInfo.name)", message: "롱 프레스 터치로 실행된 경고창입니다.", preferredStyle: .alert)
                let action = UIAlertAction(title: "확인", style: UIAlertAction.Style.default)

                dialog.addAction(action)

                self.present(dialog, animated: true, completion: nil)
            }
        }
    }
}
```

- `cell.transform = .init(scaleX: 1, y: 1)`
    - 95%로 축소된 `Cell`을 다시 가로세로 100% 크기로 원상복귀합니다.
- `if let cell = self.currentLongPressedCell { ... }`
    - `.began`에서 저장했던 `cell`과 현재 위치에 있는 셀이 같다면 동작을 실행하고, 아니라면 아무것도 하지 않습니다.
    - 이를 통해 원래 눌렀던 위치에서 손가락이 다른 셀로 이동한 경우 시작 지점과 끝 지점의 셀이 다르기 때문에 아래 움짤처럼 의도하지 않았던 작업이 실행되는 것을 방지할 수 있습니다.
    - `if` 문 안에 있는 내용은 경고창을 띄우는 내용으로 여기서는 설명을 생략합니다.

 

![](https://media.giphy.com/media/F9lsxPlp1CDZONVTJS/giphy.gif)

시작 위치가 Hydrangeas인데 중간에 손가락을 움직여서 끝나는 위치가 Jellyfish가 되었다면 Hydrangeas를 누른 것도 아니고 Jellyfish를 누른 것도 아니므로 어떠한 동작도 해서는 안됩니다.

이를 위해 `currentLongPressedCell` 변수를 만들어 시작 셀을 저장한 다음 터치가 끝날 때 비교 작업을 한 뒤 셀이 일치할 때에만 특정 동작을 수행하도록 한 것입니다.

 

#### **최종 결과물**

![](https://media.giphy.com/media/SyGH9NSGZnaJVqE4on/giphy.gif)

컬렉션 뷰 롱 터치 longㅉ touch long press 롱 프레스 recognizer 레코나이저 레코그나이저 길게 누르기 롱 프레스 애니메이션 롱 프레스 효과 길게 누르기 효과 collection view

 

#### **전체 코드**

```
import UIKit

struct ImageInfo {
    
    let name: String
    
    var image: UIImage? {
        return UIImage(named: "\(name).jpg")
    }
    
    init (name: String) {
        self.name = name
    }
}

class ViewController: UIViewController {
    
    let viewModel = ImageViewModel() // 뷰모델 변수를 추가합니다.
    
    var currentLongPressedCell: Cell?
    
    @IBOutlet weak var collectionView: UICollectionView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupLongGestureRecognizerOnCollection()
    }
}

extension ViewController: UIGestureRecognizerDelegate {
    // long press 이벤트 부여
    private func setupLongGestureRecognizerOnCollection() {
        
        let longPressedGesture = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(gestureRecognizer:)))
        longPressedGesture.minimumPressDuration = 0.5
        longPressedGesture.delegate = self
        longPressedGesture.delaysTouchesBegan = true
        collectionView.addGestureRecognizer(longPressedGesture)
    }
    
    // long press 이벤트 액션
    @objc func handleLongPress(gestureRecognizer: UILongPressGestureRecognizer) {
        
        let location = gestureRecognizer.location(in: gestureRecognizer.view)
        let collectionView = gestureRecognizer.view as! UICollectionView
        
        if gestureRecognizer.state == .began {
            
            if let indexPath = collectionView.indexPathForItem(at: location) {
                print("Long press at item began: \(indexPath.row)")
                
                // animation
                UIView.animate(withDuration: 0.2) {
                    if let cell = collectionView.cellForItem(at: indexPath) as? Cell {
                        self.currentLongPressedCell = cell
                        cell.transform = .init(scaleX: 0.95, y: 0.95)
                    }
                }
            }
        } else if gestureRecognizer.state == .ended {
            
            if let indexPath = collectionView.indexPathForItem(at: location) {
                print("Long press at item end: \(indexPath.row)")
                
                // animation
                UIView.animate(withDuration: 0.2) {
                    if let cell = self.currentLongPressedCell  {
                        cell.transform = .init(scaleX: 1, y: 1)
                        
                        if cell == collectionView.cellForItem(at: indexPath) as? Cell {
                            
                            let imageInfo = self.viewModel.imageInfo(at: indexPath.item)
                            
                            let dialog = UIAlertController(title: "\(imageInfo.name)", message: "롱 프레스 터치로 실행된 경고창입니다.", preferredStyle: .alert)
                            let action = UIAlertAction(title: "확인", style: UIAlertAction.Style.default)

                            dialog.addAction(action)

                            self.present(dialog, animated: true, completion: nil)
                        }
                    }
                }
            }
        } else {
            return
        }
    }
}

extension ViewController: UICollectionViewDataSource, UICollectionViewDelegate {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return viewModel.countOfImageList // 뷰모델에서 카운트 가져옴
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        guard let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath) as?
                Cell else {
            return UICollectionViewCell()
        }
        
        let imageInfo = viewModel.imageInfo(at: indexPath.item) // indexPath.item을 기준으로 뷰모델에서 ImageInfo 가져옴
        cell.update(info: imageInfo) // 해당 셀을 업데이트
        return cell

    }
    
    // 셀이 선택되었을 때
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        let imageInfo = viewModel.imageInfo(at: indexPath.item)
        
        let dialog = UIAlertController(title: "\(imageInfo.name)", message: "", preferredStyle: .alert)
        let action = UIAlertAction(title: "확인", style: UIAlertAction.Style.default)

        dialog.addAction(action)

        self.present(dialog, animated: true, completion: nil)

    }
}

class Cell: UICollectionViewCell {
    
    @IBOutlet weak var imgView: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    
    func update(info: ImageInfo) {
        imgView.image = info.image
        nameLabel.text = info.name
    }
}

// view model
class ImageViewModel {
    
    let imageInfoList: [ImageInfo] = [
        ImageInfo(name: "Chrysanthemum"),
        ImageInfo(name: "Desert"),
        ImageInfo(name: "Hydrangeas"),
        ImageInfo(name: "Jellyfish"),
        ImageInfo(name: "Koala"),
        ImageInfo(name: "Lighthouse"),
        ImageInfo(name: "Penguins"),
        ImageInfo(name: "Tulips"),
    ]
    
    var countOfImageList: Int {
        return imageInfoList.count
    }
    
    func imageInfo(at index: Int) -> ImageInfo {
        return imageInfoList[index]
    }
}

```
