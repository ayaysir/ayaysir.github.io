---
title: "Swift(스위프트): 테이블 뷰(UITableView)에서 setEditing이 true일때만 삭제 등 작업 가능하게 하기"
date: 2022-05-29
categories: 
  - "DevLog"
  - "Swift UIKit"
---

**출처**

- [How do I disable the full swipe on a tableview cell in iOS11](https://stackoverflow.com/questions/46414707/how-do-i-disable-the-full-swipe-on-a-tableview-cell-in-ios11)

 

## **Swift(스위프트): 테이블 뷰(UITableView)에서 setEditing이 true일때만 삭제 등 작업 가능하게 하기**

제목이 대체 무슨 말인가 하면

아래 화면과 같이 `Edit` 버튼이 있어 에디트 모드가 따로 있는 예제 앱이 있습니다. 테이블 뷰의 에디트 모드가 모든 열(`row`)에 활성화되어 있는 상태입니다.  


![](/assets/img/wp-content/uploads/2022/05/-2022-05-30-am-3.30.50-e1653849960422.jpg)

```swift
// Override to support conditional editing of the table view.
override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
    // Return false if you do not want the specified item to be editable.
    return true
}
```

 

`barBtnEdit`는 화면 오른쪽의 `Edit` 버튼에 대한 액션입니다.

```swift
@IBAction  func barBtnActEdit(_ sender: UIBarButtonItem) {
    if tableView.isEditing {
        // Edit mode off
        tableView.setEditing(false, animated: true)
        sender.title = "Edit"
    } else {
        // Edit mode on
        tableView.setEditing(true, animated: true)
        sender.title = "Done"
    }
}
```

 

`tableView.setEditing(_:animated:)` 를 통해 Edit Mode를 `true`로 하면 아래와 같은 화면이 나옵니다.

 ![](/assets/img/wp-content/uploads/2022/05/-2022-05-30-am-3.31.16-e1653849999668.jpg)

 

에디트 모드인 이 화면에서만 삭제 등의 작업을 진행하고 싶은데, 문제는 평상시 모드(`isEditing = false`)에서도 스와이프 하면 삭제 메뉴가 나타납니다.

<!-- http://www.giphy.com/gifs/KhpWcDkCCIKjxG0Z5m -->
![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWs4aHI0ZjlxMnFoZWxweTJzMTJ2a21ubTJzNHZ6b291YXo1YmFvdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KhpWcDkCCIKjxG0Z5m/giphy.gif)

 

위의 예제는 별점 스와이프 기능도 있는데, 두 기능이 겹쳐 불편한 상태입니다. 평상시 모드에서는 스와이프 현상이 나타나지 않도록 방지하도록 하겠습니다.

 

## **trailingSwipeActionsConfigurationForRowAt**

이 부분은 스와이프를 오른쪽 구석(`trailing`)에서 시작할 경우에 표시할 커스텀 버튼 등을 만드는 곳입니다.

원래는 테이블 뷰 셀에서 스와이프시 사용자 커스텀 버튼을 만들고 표시할 때 사용하는 메서드입니다. 검색해보면 다양한 사용법을 확인할 수 있습니다만, 여기서는 단순히 스와이프 방지용으로만 사용하겠습니다.

```swift
override func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
    print(#function, indexPath)
    
    if tableView.isEditing {
        
        let delete = UIContextualAction(style: .destructive, title: "Delete") { (action, sourceView, completionHandler) in
            print("index path of delete: \(indexPath)")
            let cell = tableView.cellForRow(at: indexPath)
            let entity = cell.infoViewModel.entity
			
             // ..뷰모델, DB 등에서 삭제하는 작업.. //
			
             tableView.deleteRows(at: [indexPath], with: .fade)
        }
        
        let swipeAction = UISwipeActionsConfiguration(actions: [delete])
        swipeAction.performsFirstActionWithFullSwipe = false // This is the line which disables full swipe
        return swipeAction
    } else {
        let config = UISwipeActionsConfiguration()
        config.performsFirstActionWithFullSwipe = false
        return config
    }
}
```

- `tableView.isEditing`을 이용해 에디트 모드일 때에는 삭제 버튼이 나타나게 하고, 아닌 경우 아무 버튼도 나타나지 않게 합니다.
-  `delete`
    - `UIContextualAction`을 통해 빨간색의 삭제 버튼을 만듭니다. 커스텀 버튼으로 생김새는 똑같지만 테이블 뷰에서 기본 제공하는 삭제 버튼과는 다릅니다.
    - 트레일링 클로저는 삭제 버튼이 클릭되었을 때 동작할 내용을 작성합니다.
- `swipeAction`
    - `UISwipeActionsConfiguration`에 삭제 버튼을 추가합니다.
    - `UISwipeActionsConfiguration`의 `action`은 추후 추가가 불가능하므로 처음 생성자 단계에 추가해야 합니다.
    - `performsFirstActionWithFullSwipe` - 위의 움짤처럼 삭제 버튼이 길게 늘어지는 것을 방지합니다. (스와이프하면 짧게 버튼만 나옵니다.)
- `else`
    - 에디트 모드가 비활성화 상태일 때는 아무 버튼도 추가하지 않습니다.

 

<!-- http://www.giphy.com/gifs/a0TpAI0XWhigJH4ouu -->
![](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWFjZWV2dWp0OXdmNHdrNXN5NW5tcnRhYTFyYTFzZGpiYnY0bmhkdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a0TpAI0XWhigJH4ouu/giphy.gif)

이제 에디트 모드일 때에만 삭제 버튼이 활성화되고, 비에디트 모드인 경우 스와이프해도 아무 액션이 나타나지 않습니다.
