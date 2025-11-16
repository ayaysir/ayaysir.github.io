---
title: "SwiftUI: 문서 폴더(Document Directory) 내부의 전체 폴더 구조(tree) 표시 (재귀 사용)"
date: 2023-11-18
categories: 
  - "DevLog"
  - "Swift"
---

#### **폴더(디렉토리) 표시용 모델 생성**

```swift
import Foundation

struct Folder: Codable, Equatable, Hashable, Identifiable, FileSystem {
    static func == (lhs: Folder, rhs: Folder) -> Bool {
        lhs.id == rhs.id && lhs.fileURL == rhs.fileURL
    }
    
    var id: UUID
    var fileURL: URL
    var fileName: String
    var subfolder: [Folder]?
}
```

- `subfolder`는 반드시 옵셔널 형태의 배열 타입을 지정해야 합니다.
    - 밑에서 `List > children`기능을 이용할 때 배열 원소 개수가 0이라도 하위 목록 열기 토글이 표시되며,
    - 배열 변수 자체가 `nil`이여야만 하위 목록 열기 토글이 표시되지 않습니다.

 ![](/assets/img/wp-content/uploads/2023/11/screenshot-2023-11-19-am-2.41.37-copy.jpg)

 

트리 표시 뷰 생성

```swift
import SwiftUI

struct SelectFolderView: View {
    @StateObject private var viewModel = SelectFolderViewModel()
    
    var body: some View {
        NavigationStack {
            List(viewModel.directoryList, children: \.subfolder) { directory in
                Label(directory.fileName, systemImage: "folder.fill")
            }
            .onTapGesture {
                
            }
            .navigationTitle("이동할 폴더 선택")
        }
    }
}

#Preview {
    SelectFolderView()
}
```

- `List`의 `children` 기능을 사용하면 접이식 메뉴를 사용할 수 있어서 목록 셀을 펼치고 접을 수 있습니다.

 

#### **뷰모델 생성**

```swift
import Foundation

class SelectFolderViewModel: ObservableObject {
    @Published private(set) var directoryList: [Folder] = []
    
    init() {
        guard let documentDirectoryURL = FileManager.documentDirectoryURL else {
            return
        }
        
        var rootFolder: Folder = .init(id: .init(), fileURL: documentDirectoryURL, fileName: "Root", subfolder: [])
        directoryListRecursively(parentFolder: &rootFolder, nextURL: documentDirectoryURL)
        
        if let documents = rootFolder.subfolder?.first {
            directoryList = [documents]
        }
    }
    
    func directoryContents(at targetDirectoryURL: URL) throws -> [URL] {
        return try FileManager.default.contentsOfDirectory(
            at: targetDirectoryURL,
            includingPropertiesForKeys: nil
        ).filter {
            $0.hasDirectoryPath
        }
    }
    
    func directoryListRecursively(parentFolder: inout Folder, nextURL: URL) {
        guard let directoryContents = try? directoryContents(at: nextURL) else {
            return
        }
        
        guard parentFolder.subfolder != nil else {
            return
        }
        
        // guard let을 쓰지 않고 강제 언래핑 하는 이유: 배열에 직접 접근해서 값을 바꾸려고
        
        if directoryContents.isEmpty {
            parentFolder.subfolder!.append(.init(id: .init(), fileURL: nextURL, fileName: nextURL.lastPathComponent, subfolder: nil))
            return
        }
        
        parentFolder.subfolder!.append(.init(id: .init(), fileURL: nextURL, fileName: nextURL.lastPathComponent, subfolder: []))
        
        let lastCount = parentFolder.subfolder!.count - 1
        for directoryContent in directoryContents {
            directoryListRecursively(parentFolder: &parentFolder.subfolder![lastCount], nextURL: directoryContent.absoluteURL)
        }
    }
}

```

 

- **directoryContents(at:)**
- - 현재 위치에서 하위 폴더 목록을 가져옵니다.
    - 하나도 없다면 `Optional`의 빈 배열을 가져오고, 아니라면 옵셔널의 URL 배열을 리턴 (`nil`이 되는 경우는 없음)
- **directoryListRecursively(parentFolder:nextURL:)**
    - 하위 디렉토리(들)가 있다면
        - `nextURL`이 들어있는 `Folder` 오브젝트를 새로 생성한 뒤 부모 폴더의 `subfolder`에 삽입하고
        - 그 디렉토리들을 순회하면서 재귀적으로(recursively) 함수를 반복 호출합니다.
    - 하위 디렉토리가 없다면
        - `nextURL`이 들어있는 `Folder` 오브젝트를 부모 `Folder`의 `subfolder` 배열에 넣고 종료합니다.
- **init()**
    - 문서 디렉토리 `URL`을 가져온 후 시작 폴더(root folder)를 생성하고 `nextURL`를 문서 `URL`로 시작합니다.
    - 문서 디렉토리의 URL이 먼저 담기므로 `rootFolder.subfolder?.first`를 List에서 사용할 `@Published` 배열에 넣습니다.

 

![](https://media.giphy.com/media/Sr7GMtc23D9gbcVbQD/giphy.gif)

 

_자세한 설명은 나중에..._

<!-- \[rcblock id="5348"\] -->
