---
title: "Swift(스위프트): Static cell 모드인 테이블 뷰(UITableView)에서 특정 섹션 감추기 + 특정 행의 크기만 조절"
date: 2022-06-09
categories: 
  - "DevLog"
  - "Swift UIKit"
---

#### **Swift(스위프트): Static cell 모드인 테이블 뷰(UITableView)에서 특정 섹션 감추기**

Static Cell 모드란 아래와 같이 content mode가 `Static Cells`로 지정된 경우로 데이터 모델에 따라 셀의 개수등이 변동하는 일반적인 테이블 뷰와 달리 셀의 개수, 위치 등이 고정되어 있는 경우를 말합니다. 이 경우 코드 작성 대신 스토리보드에서 셀 개수, 섹션 개수를 설정하게 됩니다.

![](./assets/img/wp-content/uploads/2022/06/스크린샷-2022-06-10-오전-2.15.52.jpg)

 

예제에서 6개의 섹션이 있는데, 마지막은 배너 광고를 표시하는 섹션으로 광고 표시 여부를 설정 여부에 따라 보이거나 숨기게 하고 싶을 때 사용할 수 있는 방법은 다음과 같습니다.

![](./assets/img/wp-content/uploads/2022/06/-2022-06-10-오전-2.24.05-e1654797567600.jpg)

 

##### **1: 먼저 해당 셀의 IndexPath와 표시 여부에 대한 Bool 변수를 생성합니다.**

```
private let bannerAdPath = IndexPath(row: 0, section: 5)
private let showBanner = false
```

- `row`, `section` 모두 0부터 시작합니다.
- `showBanner` - 해당 섹션 표시 여부를 지정합니다.

![](./assets/img/wp-content/uploads/2022/06/-2022-06-10-오전-2.24.05-e1654797567600.jpg)

파란색 박스 아이콘이 `section`, 회색 아이콘이 해당 섹션의 `row` 입니다.

 

##### **2: super 클래스의 메서드를 override 합니다.**

대상 메서드는

- ...`heightForHeaderInSection`...
- ...`heightForFooterInSection`...
- ...`numberOfRowsInSection`...

이며, 숨기고자 하는 섹션에 헤더(header) 또는 푸터(footer) 텍스트가 있는 경우

- ...`titleForHeaderInSection`...
- ...`titleForFooterInSection`...

도 오버라이딩 대상에 포함합니다.

참고로 static cell은 일반 뷰 컨트롤러에서는 사용할 수 없고, `UITableViewController`를 상속받은 뷰 컨트롤러에서만 사용 가능합니다. `UITableViewController`를 상속받은 경우 `delegate`, `datasource` 는 자동으로 지정되어 있기 때문에 별도의 딜리게이트, 프로토콜 지정 작업은 필요하지 않습니다.

 

```
override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
    if !showBanner && section == bannerAdPath.section {
        return 0.1
    } else {
        return super.tableView(tableView, heightForHeaderInSection: section)
    }
}

override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
    if !showBanner && section == bannerAdPath.section {
        return 0.1
    } else {
        return super.tableView(tableView, heightForHeaderInSection: section)
    }
}

override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    if !showBanner && section == bannerAdPath.section {
        return 0
    } else {
        return super.tableView(tableView, numberOfRowsInSection: section)
    }
}

override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
    if !showBanner && section == bannerAdPath.section {
        return ""
    } else {
        return super.tableView(tableView, titleForHeaderInSection: section)
    }
}
```

- `if !showBanner && section == bannerAdPath.section { .... }`
    - 섹션 표시 여부가 `false`이고, 숨기고자 하는 섹션과 일치하는 경우에 실행됩니다.
    - `heightForHeaderInSection`, `heightForFooterInSection`의 높이를 `0.1`으로 만듭니다.
        - `0.0`으로 설정하면 빈 공간이 늘어나는 문제가 있어서 `0.1`로 설정하는것이 보다 자연스럽습니다. (밑의 그림 참조)
    - `numberOfRowsInSection`의 경우 `row` 개수를 `0`으로 설정합니다.
    - 헤더, 푸터에 텍스트가 있는 경우 높이를 `0.*`으로 지정하더라도 텍스트가 표시되게 됩니다. 이를 방지하기 위해 해당 텍스트도 빈 텍스트를 할당해 지워줍니다.
- `else { ... }` 
    - Static 테이블 뷰를 다루는 데 있어 **중요한 부분**입니다.
    - `super.tableView(tableView, heightForHeaderInSection: section)`와 같이 해당 메서드와 동일한 이름을 가진 함수를 호출하고, 첫 번째 파라미터는 `tableView`, 두 번째 파라미터는 해당 메서드와 동일한 짝의 변수를 맞춰 지정합니다.
        - 이렇게 해야 스토리보드에서 디자인한 테이블 뷰의 형태가 깨지지 않고 그대로 나오게 됩니다.
    - 예를 들어 `override func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat` 함수 내부의 `else`문에는 `super.tableView(tableView, heightForHeaderInSection: section)` 메서드를 호출합니다.
    - 다른 함수도 위와 같은 원리를 이용해 `else` 부분을 작성합니다.

 

\[caption id="attachment\_4525" align="alignnone" width="406"\]![](./assets/img/wp-content/uploads/2022/06/스크린샷-2022-06-10-오전-2.43.17.jpg) 섹션 숨김 1\[/caption\]

 

\[caption id="attachment\_4526" align="alignnone" width="399"\]![](./assets/img/wp-content/uploads/2022/06/스크린샷-2022-06-10-오전-2.52.47.jpg) 섹션 숨김 2\[/caption\]

 

\[caption id="attachment\_4527" align="alignnone" width="393"\]![](./assets/img/wp-content/uploads/2022/06/스크린샷-2022-06-10-오전-2.53.16.jpg) 배너 광고 표시됨: 빨간 글씨는 잘못 삽입된것으로 `showBanner = true` 입니다.\[/caption\]

 

#### **추가 예제: 특정 섹션(section)의 행(row)만 세로 크기 조절하기**

앞 단락과 같은 원리를 이용합니다.

```
override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    if indexPath == IndexPath(row: 0, section: 0) {
        return 500
    } else {
        return super.tableView(tableView, heightForRowAt: indexPath)
    }
}
```

 

![](./assets/img/wp-content/uploads/2022/06/스크린샷-2022-06-10-오전-2.55.24.jpg)

 

##### **출처**

- [Hide sections of a Static TableView](https://stackoverflow.com/questions/17761878/hide-sections-of-a-static-tableview)
