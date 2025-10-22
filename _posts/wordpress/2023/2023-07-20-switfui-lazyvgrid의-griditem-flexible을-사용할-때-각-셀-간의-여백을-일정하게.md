---
title: "SwitfUI: LazyVGrid의 GridItem...flexible()을 사용할 때 각 셀 간의 여백을 일정하게 지정하는 방법"
date: 2023-07-20
categories: 
  - "DevLog"
  - "SwiftUI"
---

#### **요약**

- 세로 간의 여백은 `LazyVGrid`의 `spacing` 파라미터에서 지정합니다.
- 가로 간의 여백은 `GridItem`의 `spacing`에서 지정합니다.
- 이미지(`Imaage`)가 셀을 구성하는 경우, 반드시 `.resizable()`을 추가해야 이미지 크기가 컬럼 크기에 맞게 조정됩니다.

 

#### **코드**

```
import SwiftUI

struct AlbumListView: View {
    let MARGIN: CGFloat = 10
    @State private var columnCount = 3.0
    
    // 화면을 그리드형식으로 꽉채워줌
    var columns: [GridItem] {
        return (1...Int(columnCount)).map { _ in
            GridItem(.flexible(), spacing: MARGIN)
        }
    }

    var body: some View {
        ScrollView {
            Stepper("Column Count", value: $columnCount)
            LazyVGrid(columns: columns, spacing: MARGIN) {
                ForEach(1..<100) { element in
                    NavigationLink {
                        Text("Temp Detail Page: \(element)")
                    } label: {
                        VStack {
                            Image("sample")
                                .resizable() // 중요: 지정하지 않으면 이미지 사이즈 요지부동
                                .aspectRatio(1, contentMode: .fill)
                        }
                        // Rectangle()
                        //     .fill(.gray)
                        //     .aspectRatio(1, contentMode: .fit)
                        // Color.gray
                        //     .aspectRatio(1, contentMode: .fit)
                    }
                }
            }
        }
    }
}

struct AlbumListView_Previews: PreviewProvider {
    static var previews: some View {
        AlbumListView()
    }
}

```

 

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzZnMTRlc2pianFoNjVxYWRrcTFtYnlzbml3azlleWxuajUzeWJzMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FckVqD9rW3aoqwtFsZ/giphy.gif)
