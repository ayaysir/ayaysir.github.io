---
title: "SwiftUI: 목록 행(row) 및 헤더(header) 높이 변경"
date: 2025-09-08
categories: 
  - "DevLog"
  - "Swift"
---

#### **소개**

이 예제는 SwiftUI List에서 행(row)과 헤더(header) 높이를 변경하는 방법을 보여줍니다.

최종 결과는 다음과 같습니다:

<iframe width="271" height="480" src="https://giphy.com/embed/0O9Qt64wazqLCFKkFF" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

#### **설명**

`defaultMinListRowHeight` 라는 `EnvironmentValue`를 사용해서 기본 최소 행 높이를 설정할 수 있습니다. 마찬가지로 `defaultMinListHeaderHeight`를 사용하면 섹션 헤더의 높이를 지정할 수 있습니다.

아래 코드는 그룹화된 리스트에서 슬라이더로 두 값을 조절하는 예시입니다:

```
// ...SwiftUI View에서 작성...

@State private var rowHeight: CGFloat = 40
@State private var headerHeight: CGFloat = 60

var body: some View {
  VStack {
    HStack {
      Text("Row height")
      Slider(value: $rowHeight, in: 40.0...80.0)
    }
    HStack {
      Text("Header height")
      Slider(value: $headerHeight, in: 60.0...80.0)
    }
    List(1..<5) { section in
      Section("Section \(section)") {
        ForEach(1..<3) { row in
          Text("Row \(row) of section \(section)")
        }
      }
    }
  }
  .padding()
  .environment(\.defaultMinListRowHeight, rowHeight) // 행 높이 지정
  .environment(\.defaultMinListHeaderHeight, headerHeight) // 헤더 높이 지정
}
```

 

#### **추가: iOS 16 이하 버전에서 리스트 섹션 간 간격 조절**

![](./assets/img/wp-content/uploads/2025/09/스크린샷-2025-09-09-오전-1.07.11.png)

```
import SwiftUI

struct ContentView: View {
  init() {
    // 섹션간 높이 조절
    var layoutConfig = UICollectionLayoutListConfiguration(appearance: .plain) // 주의: 우선하여 적용됨
    layoutConfig.headerMode = .supplementary
    layoutConfig.headerTopPadding = 10
    let listLayout = UICollectionViewCompositionalLayout.list(using: layoutConfig)
    UICollectionView.appearance().collectionViewLayout = listLayout
  }

  ...
}
```

 

#### **출처**

- [SwiftUI List Change Row and Header Height](https://swiftuirecipes.com/blog/swiftui-list-change-row-and-header-height)
- [SwiftUI List: set section header height?](https://stackoverflow.com/questions/68488891/swiftui-list-set-section-header-height)
