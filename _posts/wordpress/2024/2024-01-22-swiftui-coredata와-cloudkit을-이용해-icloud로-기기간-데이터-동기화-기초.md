---
title: "SwiftUI: CoreData와 CloudKit을 이용해 iCloud로 기기간 데이터 동기화 기초"
date: 2024-01-22
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

iCloudKit의 `CloudKit`을 이용해 CoreData에 저장된 데이터를 동기화하는 방법입니다. 별도의 인증 절차 없이 같은 iCloud계정을 가진 기기는 자동으로 연동이 됩니다.

- 동기화하려는 기기는 같은 애플 iCloud 아이디로 로그인되있어야 합니다.
- 개발자가 CloutKit을 도입하려면 유료 개발자 계정이 필요합니다.

 

## **방법**

### **Step 1: 프로젝트 생성**

(1) Xcode에서 `File -> New -> Project...` 메뉴 선택 후 `iOS App` 프로젝트 생성

(2) 옵션에서 `SwiftUI`, `CoreData`, `Host in CloudKit` 선택

 ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-8.50.09-copy.jpg)

- 만약 SwiftUI 프로젝트가 이미 만들어진 경우라면 다음 Step을 보면서 빠진 부분을 보충합니다.

 

### **Step 2: CloutKit 설정**

`Target 설정`창으로 가서 `Signing & Capabilities -> iCloud` 부분에서 `Services`에 `CloudKit`을 선택하고, `+` 버튼을 누릅니다.

iCloud가 없는 경우 상단의 `+ Capability` 버튼을 눌러 iCloud를 먼저 추가합니다.

 ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-9.01.49-copy.jpg)

 

번들 이름을 입력합니다. 앞에 `iCloud.*` 접두사가 자동으로 붙습니다.

 ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-8.38.28-copy.jpg)

 

Xcode 왼쪽 프로젝트 탐색기 영역에 `프로젝트이름.entitlements` 라는 파일이 생겼는지 확인하고, `iCloud Container Identifiers`에 위에서 입력한 컨테이너가 제대로 들어갔는지도 확인합니다.

 ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-8.42.33-copy.jpg)

 

> **참고:** Unable to process request - PLA Update available 에러가 뜨는 경우 [애플 개발자 계정 홈페이지](https://developer.apple.com/account)를 방문한 후 업데이트된 약관을 검토하고 동의합니다.
> 
>  ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-8.35.20-copy.jpg)
> 
>  ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-8.37.31-copy.jpg)

 

### **Step 3: Persistence.swift 파일을 확인하고, 만약 없다면 새로 생성합니다.**

```swift
import CoreData

struct PersistenceController {
    static let shared = PersistenceController()

    static var preview: PersistenceController = {
        let result = PersistenceController(inMemory: true)
        let viewContext = result.container.viewContext
        for _ in 0..<10 {
            let newItem = Item(context: viewContext)
            newItem.timestamp = Date()
        }
        do {
            try viewContext.save()
        } catch {
            let nsError = error as NSError
            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
        return result
    }()

    let container: NSPersistentCloudKitContainer

    init(inMemory: Bool = false) {
        container = NSPersistentCloudKitContainer(name: "TargetBrowser")
        
        if inMemory {
            container.persistentStoreDescriptions.first!.url = URL(fileURLWithPath: "/dev/null")
        }
        
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        
        container.viewContext.automaticallyMergesChangesFromParent = true
    }
}

```

- `shared`: 메인으로 사용할 컨테이너입니다.
- `preview`: SwiftUI 미리보기 등에서만 사용할 더미 데이터입니다. `preview`의 더미 데이터는 메모리상에서만 생성되며 실제 파일로는 저장되지 않습니다.
- `container`: `NSPersistentCloudKitContainer` 타입의 컨테이너인지 확인합니다. 이 타입이 아니라면 CloudKit을 통한 동기화가 되지 않습니다.
- `init`: 생성자 부분으로, `NSPersistentCloudKitContainer` 타입의 의 인스턴스를 `container` 변수에 지정합니다.

 

### **Step 4: CoreData를 입출력하는 뷰 만들기**

그 전에 먼저 `프로젝트 이름.xcdatamodeld`으로 된 Core Data Model 파일이 제대로 생성되었는지 확인합니다.

 ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-9.24.38-copy.jpg)

여기서 `Item` 엔티티(Enitities)를 선택하고, `String` 타입의 `message`라는 속성(attribute)를 추가합니다.

 ![](/assets/img/wp-content/uploads/2024/01/screenshot-2024-01-22-pm-8.45.04-copy.jpg)

 

Step 1에서 CoreData와 Host in CloudKit을 선택했다면 `ContentView,swift`에 예제 CRUD 페이지가 자동으로 생성됩니다. 하이라이트된 부분은 편의를 위해 임의로 추가한 라인이며 나머지는 자동 생성된 코드입니다.

```swift
import SwiftUI
import CoreData

struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Item.timestamp, ascending: true)],
        animation: .default)
    private var items: FetchedResults<Item>

    var body: some View {
        NavigationView {
            List {
                ForEach(items) { item in
                    NavigationLink {
                        Text("Item at \(item.timestamp!, formatter: itemFormatter)")
                    } label: {
                        Text(item.timestamp!, formatter: itemFormatter)
                        + Text(" \(item.message ?? "")")
                    }
                }
                .onDelete(perform: deleteItems)
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    EditButton()
                }
                ToolbarItem {
                    Button(action: addItem) {
                        Label("Add Item", systemImage: "plus")
                    }
                }
            }
            Text("Select an item")
        }
    }

    private func addItem() {
        withAnimation {
            let newItem = Item(context: viewContext)
            newItem.timestamp = Date()
            newItem.message = "\(UUID().uuidString.split(separator: "-")[0])"
			
            do {
                try viewContext.save()
            } catch {
                let nsError = error as NSError
                fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        }
    }

    private func deleteItems(offsets: IndexSet) {
        withAnimation {
            offsets.map { items[$0] }.forEach(viewContext.delete)

            do {
                try viewContext.save()
            } catch {
                let nsError = error as NSError
                fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        }
    }
}

private let itemFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateStyle = .short
    formatter.timeStyle = .medium
    return formatter
}()

#Preview {
    ContentView().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
}

```

- **@Environment(\\.managedObjectContext) private var viewContext**
    - `managedObjectContext`라는 키 이름을 가지는 환경을 가져와 해당 내용을 `viewContext` 변수에 추가합니다.
    - `viewContext`에 변경된 내용을 업데이트하면 CoreData 내 저장소가 업데이트됩니다.
    - `managedObjectContext` 키는 `@main` 진입점에서 설정합니다.
- **@FetchRequest**
    - `Item`의 `timestamp`를 기준으로 오름차순 정렬하는 리퀘스트의 결과를 `items` 변수에 저장합니다.
- **ForEach(items)**
    - `items`를 리스트 형태로 불러옵니다. `Identifiable`을 준수하므로 별도의 `id`는 지정하지 않아도 됩니다.
- **addItem()**
    - 날짜(`timestamp`)와 임의의 `message`를 담은 `Item`을 `viewContext`에 추가합니다.
- **deleteItems(offsets:)**
    - 삭제 명령입니다.
- **#Preview**
    - 미리보기(Canvas)는 `preview` 컨테이너를 사용하므로 실제로 저장되지 않습니다.

 

### **Step 5: @main 진입 부분에 CoreData 컨트롤러와 환경(environment) 추가하기**

```swift
import SwiftUI

@main
struct TargetBrowserApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
```

- `@main`은 앱을 빌드했을 때 제일 먼저 시작되는 부분입니다.
    - 여기에서 [WindowGroup](https://developer.apple.com/documentation/swiftui/windowgroup)을 추가하고, `ContentView`가 처음에 실행되도록 합니다.
- **persistenceController**
    - `Persistence.swift`에서 지정한 컨테이너 컨트롤러입니다.
- **ContentView().environment(...)**
    - CoreData 환경을 주입해서 `persistenceController.container`의 `viewContext`를 해당 뷰에서 사용할 수 있도록 합니다.

 

### **Step 6: 실제 기기에서 테스트**

시뮬레이터는 별도의 iCloud 로그인 과정이 필요하고, 간혹 로그아웃이 되지 않는 버그가 있기 때문에 실제 기기에서 하는 것을 권장합니다.

여러 대의 기기(아이폰, 아이패드)에서 빌드한 뒤 실행하고, 실시간으로 동기화가 되는지 확인합니다.

<!-- https://giphy.com/gifs/5g9Z5jOBwEme6muZBb -->
![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHplcnQ3MmdjcnB3dzlwdHE2Mm5ud2NrMGFja21nZzh4Yjk5eXE4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5g9Z5jOBwEme6muZBb/giphy.gif)
