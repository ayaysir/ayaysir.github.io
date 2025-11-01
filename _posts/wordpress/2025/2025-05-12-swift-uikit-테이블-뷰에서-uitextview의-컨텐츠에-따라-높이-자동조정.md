---
title: "Swift UIKit: 테이블 뷰에서 UITextView의 컨텐츠에 따라 높이 자동조정"
date: 2025-05-12
categories: 
  - "DevLog"
  - "Swift UIKit"
---

##### **참고**

- [Swift(스위프트): Static cell 모드인 테이블 뷰(UITableView)에서 특정 섹션 감추기 + 특정 행의 크기만 조절](http://yoonbumtae.com/?p=4521)

 

##### **구조 및 제약(Constraints)**

\[caption id="attachment\_7041" align="alignnone" width="202"\] ![](/assets/img/wp-content/uploads/2025/05/스크린샷-2025-05-13-오전-1.17.12-복사본.jpg) 테이블 뷰 섹션 > 셀 > 콘텐트 뷰 > 텍스트 뷰\[/caption\]

 

\[caption id="attachment\_7042" align="alignnone" width="250"\] ![](/assets/img/wp-content/uploads/2025/05/스크린샷-2025-05-13-오전-1.17.23-복사본.jpg) 제약: 컨텐트 뷰(상위 뷰)에 맞춤\[/caption\]

 

 ![](/assets/img/wp-content/uploads/2025/05/스크린샷-2025-05-13-오전-1.17.39-복사본.jpg)

 

##### **1) 텍스트 뷰(UITextView)를 선택한 뒤 Indicator > Scroll View > Scrolling Enabled 해제**

 ![](/assets/img/wp-content/uploads/2025/05/스크린샷-2025-05-12-오후-11.28.13-복사본.jpg)

또는 코드에서 직접 설정합니다.

- `textView.isScrollEnabled = false`

 

##### **2) 해당 인덱스패스 (IndexPath)의 heightForRowAt을 UITableView.automaticDimension으로 설정**

```
override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
  if indexPath == <텍스트 뷰가 있는 셀의 인덱스패스> {
    return UITableView.automaticDimension
  }
  
  return super.tableView(tableView, heightForRowAt: indexPath)
}
```

 

##### **3) 텍스트 뷰(UITextView)에 딜리게이트 설정**

```
txvComment.delegate = self
```

```
extension SomeTableViewController: UITextViewDelegate { ... }
```

 

##### **4) textView(...shouldChangeTextIn...)과 textViewDidChange(\_:) 딜리게이트 메서드 구현**

```
extension SomeTableViewController: UITextViewDelegate {
  func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
    if text == "\n" {
      tableView.scrollToRow(at: <텍스트 뷰가 있는 셀의 인덱스패스>, at: .bottom, animated: false)
    }
    
    return true
  }
  
  func textViewDidChange(_ textView: UITextView) {
    tableView.beginUpdates()
    tableView.endUpdates()
  }
}

```

- **textView(...shouldChangeTextIn...)**
    - 엔터키를 입력했을 경우에는 테이블 뷰의 스크롤을 텍스트 뷰 아래로 이동합니다.
- **textViewDidChange(\_:)**
    - 텍스트뷰의 내용이 바뀐 경우 테이블 뷰의 레이아웃만 조정해 입력중인 키보드가 사라지는 것을 방지합니다.

 

<iframe width="222" height="480" src="https://giphy.com/embed/h91WLkb4znjMue7JO3" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>
