---
title: "iOS 프로그래밍: Navigation에서 전후간 정보교환 방법"
date: 2020-02-14
categories: 
  - "DevLog"
  - "Swift UIKit"
tags: 
  - "swift"
---

 ![](/assets/img/wp-content/uploads/2020/02/screenshot-2020-02-14-pm-4.22.05.png)

## 정보를 넘기는 방법

### Main(`전`)에서 Edit(`후`)로 정보를 넘기는 방법

- `segue.destination`을 이용

### Edit(`후`)에서 Main(`전`)으로 넘기는 방법
  - 위임 프로토콜을 정의
  - Main(`전`) 컨트롤러에서 위임 프로토콜을 준수(conform)함
  - `전` 컨트롤러가 `후` 컨트롤러로 정보를 넘기는 시점에 `self`를 `후` 컨트롤러의 `delegate` 변수에 담음
    - 예) `editVC.delegate = self (=MainVC)`
  - Main 컨트롤러에서 `delegate` 관련 작업을 처리하도록 한다.

 

```swift
import UIKit

// EditDelegate 프로토콜 구현
class ViewController: UIViewController, EditDelegate {
    @IBOutlet weak var txtMessage: UITextField!
    @IBOutlet weak var imgView: UIImageView!
    
    let imgOn = UIImage(named: "lamp_on.png")
    let imgOff = UIImage(named: "lamp_off.png")
    let scale: CGFloat = 2.0
    var isMainOn = true
    var isZoom = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
        imgView.image = imgOn
    }
    
    // 다음 장면으로 전환하는 시점
    // 이 함수에서 준비(prepare)한 다음 EditViewController 컨트롤러로 전환
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // 다음 연결지점(segue.destination)을 EditViewController로 캐스팅해서 editViewController에 할당
        let editViewController = segue.destination as! EditViewController
        
        // segue의 식별자에 따라 작업 처리
        if segue.identifier == "editButton" {
            editViewController.textWayValue = "segue: use button"
        } else if segue.identifier == "editBarButton" {
            editViewController.textWayValue = "segue: use bar button"
        }
        
        // ** EditViewController의 delegate 변수에 self(ViewController) 할당
        // EditViewController에서 delegate 관련 기능이 실행되면
        // 여기(ViewController) 있는 내용들이 변경됨
        editViewController.delegate = self
        
        // 다음 연결지점의 변수들을 조작 (쉬움)
        editViewController.strMessage = txtMessage.text!
        editViewController.isOn = isMainOn
        editViewController.isZoom = isZoom
        
    }
    
    // 다음 연결지점에서 이전 지점들의 변수들을 조작하는 방법 (어려움)
    // EditViewController에서 delegate를 통해 처리
    
    // EditViewController에서 넘어온 정보를 처리 1
    func didMessageEditDone(_ controller: EditViewController, message: String) {
        txtMessage.text = message
    }
      
    // EditViewController에서 넘어온 정보를 처리 2
    func didImgOnOffDone(_ controller: EditViewController, isOn: Bool) {
        if isOn {
            imgView.image = imgOn
            self.isMainOn = true
        } else {
            imgView.image = imgOff
            self.isMainOn = false
        }
    }
    
    // EditViewController에서 넘어온 정보를 처리 3
    func didImgZoomDone(_ controller: EditViewController, isZoom: Bool) {
        if isZoom {
            imgView.frame.size = CGSize(width: imgView.frame.width * scale, height: imgView.frame.height * scale)
            self.isZoom = true
        } else {
            imgView.frame.size = CGSize(width: imgView.frame.width / scale, height: imgView.frame.height / scale)
            self.isZoom = false
        }
    }
}
```


```swift
import UIKit

// 여기서 처리하고 이전 장면으로 넘기는 것에 대한 프로토콜 작성
// 프로토콜의 구현은 ViewController에서
protocol EditDelegate {
    func didMessageEditDone(_ controller: EditViewController, message: String)
    func didImgOnOffDone(_ controller: EditViewController, isOn: Bool)
    func didImgZoomDone(_ controller: EditViewController, isZoom: Bool)
}

class EditViewController: UIViewController {
    var textWayValue: String = ""
    var strMessage: String = ""
    
    // EditDelegate 프로토콜
    var delegate: EditDelegate?
    
    var isOn = false
    var isZoom = false
    
    @IBOutlet weak var lblWay: UILabel!
    @IBOutlet weak var txtMessage: UITextField!
    @IBOutlet weak var swtIsOn: UISwitch!
    @IBOutlet weak var btnZoom: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        lblWay.text = textWayValue
        txtMessage.text = strMessage
        swtIsOn.isOn = isOn
        
        if isZoom {
            btnZoom.setTitle("확대", for: .normal)
        } else {
            btnZoom.setTitle("축소", for: .normal)
        }
    }
    
    // 완료 버튼을 누른 경우
    @IBAction func btnDone(_ sender: Any) {
        
        // 이전 장면에서 넘어온 경우 delegate는 nil 이 아니며
        // ViewController 가 할당되어 있는 상태
        if delegate != nil {
            delegate?.didMessageEditDone(self, message: txtMessage.text!)
            delegate?.didImgOnOffDone(self, isOn: isOn)
            delegate?.didImgZoomDone(self, isZoom: isZoom)
        }
        
        _ = navigationController?.popViewController(animated: true)
    }
    @IBAction func swtImgOnOff(_ sender: UISwitch) {
        if sender.isOn {
            isOn = true
        } else {
            isOn = false
        }
    }
    @IBAction func btnChangeZoom(_ sender: UIButton) {
        if isZoom {
            isZoom = false
            btnZoom.setTitle("축소", for: .normal)
        } else {
            isZoom = true
            btnZoom.setTitle("확대", for: .normal)
        }
    }
}
```
