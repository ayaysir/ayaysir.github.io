---
title: "Swift(스위프트): 코어 데이터(Core Data) CRUD 기초 (UIKit에서)"
date: 2021-07-30
categories: 
  - "DevLog"
  - "Swift"
---

#### **Core Data란?**

Core Data를 통해 iOS, macOS 등의 애플리케이션 내에 오프라인으로 데이터를 저장할 수 있습니다. 다음은 Core Data의 소개글입니다.

> Core Data는 macOS 및 iOS 운영 체제에서 Apple이 제공하는 객체 그래프 및 지속성(persistence) 프레임워크입니다. 관계형 엔터티 속성 모델로 구성된 데이터를 XML, 바이너리 또는 SQLite 저장소로 직렬화할 수 있습니다. 엔터티 및 해당 관계를 나타내는 상위 수준 개체를 사용하여 데이터를 조작할 수 있습니다. Core Data는 직렬화된 버전 관리를 통해 지속성을 포함한 객체 수명 주기 및 객체 그래프 관리를 제공합니다. Core Data는 SQLite와 직접 인터페이스하여 개발자를 기본 SQL로부터 격리합니다.

다른 예를 들자면 스프링 프레임워크의 Hibernate, JPA(Java Persistence API)와 비슷한 개념이라고 보면 되겠습니다.

여기서는 iOS App, 스토리보드를 기준으로 설명합니다.

 

1\. Core Data 포함된 프로젝트 생성 또는 기존 프로젝트에 Core Data 추가

아직 프로젝트를 생성하지 않았다면 App 생성시 아래 사항만 체크하면 Core Data 프로젝트를 만들 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-6.18.03.jpg)

 

이미 프로젝트가 생성된 경우, 다음 과정을 통해 Core Data 를 추가할 수 있습니다.

AppDelegate.swift의 `AppDelegate` 클래스 내에 아래 코드를 추가합니다.

```
// MARK: - Core Data stack

lazy var persistentContainer: NSPersistentContainer = {
    /*
     The persistent container for the application. This implementation
     creates and returns a container, having loaded the store for the
     application to it. This property is optional since there are legitimate
     error conditions that could cause the creation of the store to fail.
    */
    let container = NSPersistentContainer(name: "[이름]")
    container.loadPersistentStores(completionHandler: { (storeDescription, error) in
        if let error = error as NSError? {
            // Replace this implementation with code to handle the error appropriately.
            // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
             
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
    return container
}()

// MARK: - Core Data Saving support

func saveContext () {
    let context = persistentContainer.viewContext
    if context.hasChanges {
        do {
            try context.save()
        } catch {
            // Replace this implementation with code to handle the error appropriately.
            // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
            let nserror = error as NSError
            fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
        }
    }
}

```

위의 `[이름]` 이라고 되어있는 부분에는 다음에 생성할 `.xcdatamodeld` 파일의 이름을 적습니다. 보통 프로젝트 이름을 많이 사용합니다.

프로젝트에 새 파일을 추가 메뉴를 열고, Core Data의 `Data Model`을 추가합니다. 이름은 위에서 지정한 이름을 사용합니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-6.27.59.jpg)

여기서는 이름과 메일 주소를 저장하고 테이블 뷰를 통해 정보들을 표시하는 앱을 만든다고 가정합니다.

 

2\. 다음 `CoreDataExample.xcdatamodeld` 파일을 열면 에디터가 나타납니다. 하단에 있는 Add Entity 버튼을 눌러 `Entity`를 추가합니다. `Entity`는 데이터베이스의 테이블과 비슷한 개념입니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-6.31.18.jpg)

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-8.39.59.png)

 

3\. 다음 `Attribute`를 추가합니다. `Attribute`는 데이터베이스의 컬럼, 필드와 비슷한 개념입니다. 이름과 메일 주소, 그리고 ID를 생성합니다. Core Data는 한 객체가 영속성(persistence)를 지니기 때문에 각 개체가 고유한 특성을 지닙니다. 따라서 원론적으로 ID를 특별히 만들 필요는 없지만, 저처럼 초보 단계에서는 ID를 만드는게 편하다고 생각했기 때문에 ID attribute를 추가하도록 하겠습니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-6.35.04.jpg)

 

`Attirbute`는 다음과 같은 다양한 타입의 값들을 가질 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-6.36.54.jpg)

 

4\. 위의 설정을 마쳤다면, App의 기본 UI를 생성합니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-6.46.05.jpg)

Navigation Bar, Bar Button Item, Table View, Table View Cell을 이용해 UI를 생성했습니다.

 

5\. 다음 Core Data와 관련된 코드를 작성합니다.

먼저 `CoreData`와 `UIKit`을 import 해야 합니다.

```swift
import UIKit
import CoreData
```

 

쓰기 기능을 먼저 작성하겠습니다.

```swift
func saveCoreData(name: String, email: String) -> Bool {
    // App Delegate 호출
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return false }
    
    // App Delegate 내부에 있는 viewContext 호출
    let managedContext = appDelegate.persistentContainer.viewContext
    
    // managedContext 내부에 있는 entity 호출
    let entity = NSEntityDescription.entity(forEntityName: "Entity", in: managedContext)!
    
    // entity 객체 생성
    let object = NSManagedObject(entity: entity, insertInto: managedContext)
    
    // 값 설정
    object.setValue(name, forKey: "name")
    object.setValue(email, forKey: "email")
	object.setValue(UUID(), forKey: "id")
    
    do {
        // managedContext 내부의 변경사항 저장
        try managedContext.save()
        return true
    } catch let error as NSError {
        // 에러 발생시
        print("Could not save. \(error), \(error.userInfo)")
        return false
    }
    
}
```

- 위에 나온 `AppDelegate` 클래스의 내부를 보면 `persistentContainer` 라는 변수가 있고 이 변수는 `NSPersistentContainer(name: "[이름]")`를 반환합니다. 먼저 엔티티에 접근하려면 `persisteneContainer.viewContext`를 호출해야 합니다.
- 다음으로 `managedContext` 내부에 있는 `entity` 호출하여 `entity`라는 `let` 변수에 저장합니다.
- `entity` 객체를 생성하고 엔티티, 컨텍스를 지정합니다.
- 객체의 값을 설정한 다음 `try managedContext.save()`로 변경사항을 저장합니다.

 

다음으로 읽기 기능을 추가합니다.

```swift
func readCoreData() throws -> [NSManagedObject]? {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return nil }
    let managedContext = appDelegate.persistentContainer.viewContext
    
    // Entity의 fetchRequest 생성
    let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "Entity")
    
    // 정렬 또는 조건 설정
    //    let sort = NSSortDescriptor(key: "createDate", ascending: false)
    //    fetchRequest.sortDescriptors = [sort]
    //    fetchRequest.predicate = NSPredicate(format: "isFinished = %@", NSNumber(value: isFinished))
    
    do {
        // fetchRequest를 통해 managedContext로부터 결과 배열을 가져오기
        let resultCDArray = try managedContext.fetch(fetchRequest)
        return resultCDArray
    } catch let error as NSError {
        print("Could not save. \(error), \(error.userInfo)")
        throw error
    }
}

```

 

엔티티 내부의 객체를 읽어오는 요청을 하는 `fetchRequest`를 작성한 후, `managedContext`로부터 결과 배열을 가져옵니다. 이 예제에서는 사용하지 않지만 가져올 객체의 정렬 또는 조건을 설정할 수 있습니다.

 

여기까지 작성 후 하드코딩으로 정보를 저장하고 출력해 보겠습니다. `ViewController`의 `viewDidLoad()` 메소드에 다음 코드를 작성합니다.

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    print("saveResult:", saveCoreData(name: "갑순이", email: "gapsun@i.com"))
    do {
        let array: [NSManagedObject] = try readCoreData()!
        print(array)
    } catch {
        print(error)
    }
}
```

아래와 같이 정상 작동하는 모습을 볼 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-7.22.14.jpg)

 

다음은 삭제입니다. 삭제 기준으로 `id`를 설정하겠습니다.

```swift
func deleteCoreData(id: UUID) -> Bool {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return false }
    let managedContext = appDelegate.persistentContainer.viewContext
    let fetchRequest = NSFetchRequest<NSFetchRequestResult>.init(entityName: "entity")
    
    // 아이디를 삭제 기준으로 설정
    fetchRequest.predicate = NSPredicate(format: "id = %@", id.uuidString)
    
    do {
        let result = try managedContext.fetch(fetchRequest)
        let objectToDelete = result[0] as! NSManagedObject
        managedContext.delete(objectToDelete)
        try managedContext.save()
        return true
    } catch let error as NSError {
        print("Could not update. \(error), \(error.userInfo)")
        return false
    }
}
```

`NSPredicate`를 통해 특정 id인 경우 삭제할 수 있도록 하었습니다.

 

또는 객체 자체를 넘겨 삭제할 수도 있습니다.

```swift
func deleteCoreData(object: NSManagedObject) -> Bool {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return false }
    let managedContext = appDelegate.persistentContainer.viewContext
    
    // 객체를 넘기고 바로 삭제
    managedContext.delete(object)
    do {
        try managedContext.save()
        return true
    } catch let error as NSError {
        print("Could not update. \(error), \(error.userInfo)")
        return false
    }
}

```

코드가 첫번째에 비해 상당히 간결해졌습니다.

 

마지막으로 업데이트 코드입니다. 업데이트도 아이디를 통해 업데이트 하는 것과, 객체 자체를 넘겨 업데이트 하는 방식 두 가지 모두 작성해 보겠습니다.

```swift
func updateCoreData(id: UUID, name: String, email: String) -> Bool {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return false }
    let managedContext = appDelegate.persistentContainer.viewContext
    let fetchRequest = NSFetchRequest<NSFetchRequestResult>.init(entityName: "Diffuser")
    fetchRequest.predicate = NSPredicate(format: "id = %@", id.uuidString)
    
    do {
        let result = try managedContext.fetch(fetchRequest)
        let object = result[0] as! NSManagedObject
        
        object.setValue(name, forKey: "name")
        object.setValue(email, forKey: "email")
        
        try managedContext.save()
        return true
    } catch let error as NSError {
        print("Could not update. \(error), \(error.userInfo)")
        return false
    }
}
```

```swift
func updateCoreData(object: NSManagedObject, name: String, email: String) -> Bool {
    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return false }
    let managedContext = appDelegate.persistentContainer.viewContext
    
    do {
        object.setValue(name, forKey: "name")
        object.setValue(email, forKey: "email")
        
        try managedContext.save()
        return true
    } catch let error as NSError {
        print("Could not update. \(error), \(error.userInfo)")
        return false
    }
}

```

 

업데이트할 객체에 접근하는 방법은 삭제 과정과 비슷합니다.

 

지금까지 작성한 코드를 사용해 입출력 프로그램을 작성하면 다음과 같습니다. 이 프로그램 작성 과정까지 들어가면 글이 너무 길어져서 `ViewConroller` 코드로 대신합니다. UI와 컨트롤러를 연결하는 방법은 아래 글들을 참고해주세요.

- [iOS 프로그래밍: 컬렉션 뷰 (Swift, 스토리보드) – 컬렉션 뷰 추가, 커스텀 셀 작성](http://yoonbumtae.com/?p=3418)
- [iOS 프로그래밍: 테이블 뷰 (Swift, 스토리보드) 1 &#8211; 테이블 뷰 추가](http://yoonbumtae.com/?p=3379)
- [iOS 프로그래밍: 테이블 뷰 (Swift, 스토리보드) 2 &#8211; 커스텀 셀(custom cell) 추가](http://yoonbumtae.com/?p=3397)

 

```swift
import UIKit
import CoreData

class ViewController: UIViewController {
    
    @IBOutlet weak var tblList: UITableView!
    
    var resultArray: [NSManagedObject]?
    
    func getDocumentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let documentsDirectory = paths[0]
        return documentsDirectory
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        do {
            resultArray = try readCoreData()
        } catch {
            print(error)
        }
    }
    
    @IBAction func btnAddAction(_ sender: Any) {
        let alert = UIAlertController(title: "add", message: "정보 입력", preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "이름"
        }
        alert.addTextField { textField in
            textField.placeholder = "이메일"
        }
        // 추가
        let ok = UIAlertAction(title: "OK", style: .default) { action in
            _ = saveCoreData(name: (alert.textFields?[0].text)!, email: (alert.textFields?[1].text)!)
            do {
                self.resultArray = try readCoreData()
            } catch {
                print(error)
            }
            self.tblList.reloadData()
        }
        alert.addAction(ok)
        alert.addAction(UIAlertAction(title: "cancel", style: .default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
}

extension ViewController: UITableViewDelegate, UITableViewDataSource {
    
    // 행 개수
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return resultArray!.count
    }
    
    // 행에 표시될 내용
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tblList.dequeueReusableCell(withIdentifier: "cell") as? ListCell else {
            return UITableViewCell()
        }
        cell.update(object: resultArray![indexPath.row])
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let alert = UIAlertController(title: "update", message: "정보 입력", preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "이름"
        }
        alert.addTextField { textField in
            textField.placeholder = "이메일"
        }
        // 업데이트
        let ok = UIAlertAction(title: "OK", style: .default) { action in
            _ = updateCoreData(object: self.resultArray![indexPath.row], name: (alert.textFields?[0].text)!, email: (alert.textFields?[1].text)!)
            self.tblList.reloadData()
        }
        alert.addAction(ok)
        alert.addAction(UIAlertAction(title: "cancel", style: .default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
    // 왼쪽 슬라이드 삭제 버튼
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            _ = deleteCoreData(object: resultArray![indexPath.row])
            do {
                self.resultArray = try readCoreData()
            } catch {
                print(error)
            }
            self.tblList.reloadData()
        }
    }
}

class ListCell: UITableViewCell {
    @IBOutlet weak var lblName: UILabel!
    @IBOutlet weak var lblEmail: UILabel!
    
    func update(object: NSManagedObject) {
        lblName.text = object.value(forKey: "name") as? String
        lblEmail.text = object.value(forKey: "email") as? String
    }
}

```

여기서는 add 할 때 결과 배열을 다시 불러오는 작업을 하고 있지만 `saveCoreData()`에서 객체 자체를 리턴하도록 하고 그 객체를 배열에 더하는게 좋아보입니다.

 ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-8.26.36.jpg)  ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-8.26.41.jpg)  ![](/assets/img/wp-content/uploads/2021/07/screenshot-2021-07-30-pm-8.26.48.jpg)
