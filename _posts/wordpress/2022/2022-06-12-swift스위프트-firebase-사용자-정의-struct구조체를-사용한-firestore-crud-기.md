---
title: "Swift(스위프트) + Firebase: 사용자 정의 struct(구조체)를 사용한 Firestore CRUD 기초"
date: 2022-06-12
categories: 
  - "DevLog"
  - "Swift"
  - "Firebase"
---

### **Swift(스위프트) + Firebase: 사용자 정의 struct(구조체)를 사용한 Firestore CRUD 기초**



#### **실시간 데이터베이스 vs Cloud Firstore 비교**

Firebase에서는 두 가지 형태의 데이터베이스를 제공합니다 이 글에서는 Cloud Firestore에 대해 알아봅니다.

- [데이터베이스 선택: Cloud Firestore 또는 실시간 데이터베이스](https://firebase.google.com/docs/database/rtdb-vs-firestore?authuser=0&hl=ko)

 

#### **Firestore에서 자료를 저장하는 일반적인 형태**

![컬렉션 - 문서 - 필드](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-4.32.03.jpg) *컬렉션 - 문서 - 필드*

 

![문서 내부에 컬랙션 생성](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-4.32.30.jpg) *문서 내부에 컬랙션 생성*

 

- 컬렉션 - 문서들을 모아 저장하는 곳입니다. 관계형 DB에서 테이블과 비슷한 개념이라고 볼 수 있습니다. (완전히 같지는 않습니다.)
- 문서 - 문서는 고유의 아이디를 가지며, 다양한 필드 정보를 담을 수 있습니다. 관계형 DB에서 레코드와 비슷한 개념입니다.
- 문서 안에 또 다른 컬렉션을 추가할 수 있습니다.

 

#### **Xcode 프로젝트에 Firebase 라이브러리 설치하기 (CocoaPods)**

- [Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법](http://yoonbumtae.com/?p=4457)

```
# add the Firebase pod for Google Analytics
pod 'Firebase/Analytics'
# or pod ‘Firebase/AnalyticsWithoutAdIdSupport’
# for Analytics without IDFA collection capability
# add pods for any other desired Firebase products
# https://firebase.google.com/docs/ios/setup#available-pods
# Add the pods for any other Firebase products you want to use in your app
# For example, to use Firebase Authentication and Cloud Firestore
pod 'Firebase/Auth'
pod 'Firebase/Firestore'
pod 'FirebaseFirestoreSwift'
```

위의 디펜던시 목록을 `Podfile` 내에 추가하고 인스톨합니다.

 

#### **프로젝트에 코드 추가: import 설정 및 클래스 작성**

```
import Foundation
import FirebaseAuth
import FirebaseFirestore
import FirebaseFirestoreSwift

class FirebasePractice {
    
    static let shared = FirebasePractice()
    
    var db: Firestore!
    var personsRef: CollectionReference!
    
    init() {
        // [START setup]
        let settings = FirestoreSettings()
        
        Firestore.firestore().settings = settings
        
        // [END setup]
        db = Firestore.firestore()
        
        personsRef = db.collection("persons")
    }
    
    // ... //
}
```

- `Firestore.firestore().collection("컬렉션이름")` 으로 컬렉션 목록을 불러옵니다.
- persons라는 이름으로 컬렉션 생성, 읽기 등을 할 예정이므로 이름을 `"persons"`로 지정합니다.

 

#### **익명 로그인 기능 추가**

익명 로그인을 사용하면 아이디, 비밀번호를 지정하지 않고도 특정 앱을 이용하는 사용자가 접근 권한을 획득할 수 있습니다. 굳이 로그인이 필요하지 않지만 외부 접근으로부터 보호가 필요한 간단한 기능 등을 만들 때 사용할 수 있습니다. (예: 쇼핑 앱의 장바구니)

파이어베이스 콘솔에서 익명 인증 절차를 추가합니다.

![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-4.40.49.jpg)

 

프로젝트에 아래와 같은 메서드를 만들어 인증 절차를 수행할 수 있도록 합니다.

```
/// 로그인 되어있는 경우 User 반환
var currentUser: User? {
    return Auth.auth().currentUser
}

/// 익명 로그인
func signInAnonymously(completionHandler: @escaping (_ user: User) -> ()) {
    Auth.auth().signInAnonymously { authResult, error in
        guard let user = authResult?.user else { return }
        completionHandler(user)
    }
}
```

 

위 메서드의 사용예는 다음과 같습니다. (뷰 컨트롤러의 `ViewDidLoad(_:)`등과 같이 실행 가능한 영역에 추가)

```
FirebasePractice.shared.signInAnonymously { user in
    
    // ... 작업 추가 ... //
}
```

 

#### **Firestore 보안 규칙 추가**

익명 로그인으로 권한을 획득한 사람만 접근 가능하도록 보안 규칙을 추가합니다. 읽기는 외부인도 모두 가능하도록 하되, 나머지 Create, Update, Delete는 익명 유저만 가능하게 하겠습니다.

 ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-4.59.13.jpg)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /persons/{document=**} {
      allow read: if true
      allow create: if request.auth.uid == request.resource.data.author_uid;
      allow update, delete: if request.auth.uid == resource.data.author_uid;
    }
  }
}
```

- `request.resource.data.author_uid`
    - `request.resource.data` - 데이터를 Firestore에 요청(request)할 때 보낸 데이터가 담기는 부분입니다.
- `resource.data`
    - Firestore에 업로드되어 있는 기존 데이터입니다.

 

#### **사용자 정의 struct 만들기**

```
struct Person: Codable {

    // @DocumentID가 붙은 경우 Read시 해당 문서의 ID를 자동으로 할당
    @DocumentID var documentID: String?
    
    // @ServerTimestamp가 붙은 경우 Create, Update시 서버 시간을 자동으로 입력함 (FirebaseFirestoreSwift 디펜던시 필요)
    @ServerTimestamp var serverTS: Timestamp?

    var name, job: String
    var devices: [String]
    var authorUID: String = ""
    
    // 왼쪽: Swift 내에서 사용하는 변수이름 / 오른쪽: Firebase에서 사용하는 변수이름
    enum CodingKeys: String, CodingKey {
        case documentID = "document_id"
        case serverTS = "server_ts"
        case authorUID = "author_uid"
        
        case name, job, devices
    }
}
```

- 기본적으로 Firestore에 업로드할때는 `[String:Any]` 형태의 사전 타입을 사용하지만, 보다 편리하게 관리하기 위해 사용자 정의 구조체를 만들고 그 구조체만으로 Firestore와 자료를 주고받아 보습니다.
- 해당 구조체는 `Codable` 준수가 반드시 필요합니다.
- `@DocumentID var documentID: String?`
    - 이 부분은 리퀘스트시에는 `nil` 상태이지만, 서버로부터 read시에 이 부분에 문서 ID가 할당됩니다.
- `@ServerTimestamp var serverTS: Timestamp?`
    - 이 어노테이션을 추가하면 리퀘스트 할 때 해당 키에 자동으로 Firebase의 서버 시간이 할당됩니다.

 

#### **CRUD 기능 구현**

##### **Create**

```
func addPost(personRequest request: Person) {
    
    var ref: DocumentReference? = nil
    
    do {
        ref = personsRef.document()
        
        guard let ref = ref else {
            print("Reference is not exist.")
            return
        }
        
        // 사용자 uid 추가
        guard let currentUser = currentUser else {
            return
        }
        
        var request = request
        request.authorUID = currentUser.uid
        
        try ref.setData(from: request) { err in
            if let err = err {
                print("Firestore>> Error adding document: \(err)")
                return
            }
            
            print("Firestore>> Document added with ID: \(ref.documentID)")
        }
    } catch  {
        print("Firestore>> Error from addPost-setData: ", error)
    }
}
```

- `ref = personsRef.document()`
    - 새로운 문서를 생성합니다. 괄호 안에 아무것도 지정하지 않을 경우 자동으로 문서의 ID가 생성되며, 수동으로 ID를 지정하려면 안에 `String` 타입의 ID를 삽입합니다.
- `request.authorUID = currentUser.uid`
    - 권한 획득을 위해 현재 로그인중인 사용자의 uid를 할당합니다.
- `try ref.setData(from: request)`
    - `(from: )` 을 사용하면 사용자 정의 구조체를 리퀘스트 데이터로 보낼 수 있습니다.

 

##### **Update**

```
func updatePost(documentID: String, originalPersonRequest request: Person) {
    
    do {
        // serverTS에는 값이 들어있으므로 업데이트시 시간이 바뀌지 않는다.
        // serverTS를 nil로 하면 새로운 시간이 부여된다.
        var request = request
        request.serverTS = nil
        
        try personsRef.document(documentID).setData(from: request) { err in
            if let err = err {
                print("Firestore>> Error updating document: \(err)")
                return
            }
            
            print("Firestore>> Document updating with ID: \(documentID)")
        }
    } catch {
        print("Firestore>> Error from updatePost-setData: ", error)
    }
}

```

- `documentID`를 찾아 해당하는 내용의 기존 데이터를 새로운 구조체 인스턴스의 데이터로 '교체'합니다.
    - 따라서 새로운 인스턴스를 생성하면 완전히 새로운 내용으로 교체됩니다.
    - 이를 방지하기 위해 기존의 데이터를 가져온 뒤 (해당 함수는 밑에서 설명) 그 데이터를 구조체 인스턴스로 변환하고, 그 인스턴스의 일부 내용만 변경한 뒤 재업로드하는 방식으로 업데이트가 이루어집니다.
- `var request = request`
    - 함수의 파라미터는 기본적으로 let 이므로 var로 바꿔 변경이 가능하도록 조치합니다.
- `request.serverTS = nil`
    - 기존 타임스탬프를 삭제하고 업데이트 시점의 타임스탬프로 새롭게 갱신합니다.
    - 예제에서는 구분되어 있지 않지만 만약 생성, 수정 타임스탬프가 있다면 생성 타임스탬프는 그대로 놔두고, 수정 타임스탬프만 `nil`로 변경하면 생성시점은 그대로, 수정시점은 새롭게 갱신됩니다.

 

##### **Delete**

```
func deletePost(documentID: String) {
    
    personsRef.document(documentID).delete() { err in
        if let err = err {
            print("Firestore>> Error deleting document: \(err)")
            return
        }
        
        print("Firestore>> Document deleted with ID: \(documentID)")
    }
}
```

- `documentID`에 해당하는 문서를 삭제합니다.

 

##### **Read (문서 하나)**

```
func read(documentID: String, completionHandler: ((_ person: Person) -> ())?) {
    personsRef.document(documentID).getDocument { document, err in
        guard let document = document else {
            print("Firestore>> document is nil")
            return
        }
        
        if let person = try? document.data(as: Person.self) {
            print("Firestore>>", #function, person.documentID!, person)
            completionHandler?(person)
        }
    }
}
```

- 문서 레퍼런스 `personsRef.document(documentID)`에서 `.getDocument(...)`를 실행하면 한 개의 문서 정보를 가져올 수 있습니다.
- `if if let person = try? document.data(as: Person.self) {...}`
    - Firestore에서 가져온 데이터를 `Person` 타입으로 가공한 뒤 해당 인스턴스를 `person`에 저장합니다.
    - 더 필요한 작업이 있다면 `completionHandler` 클로저를 실행합니다.

이 글에서는 이 메서드 외에는 `completionHandler`와 같은 클로저 핸들러가 없지만, 다른 메서드에서도 이와 같은 핸들러를 추가해 사용할 수 있습니다.

 

##### **Read (컬렉션 내의 문서 전체)**

```
func readAll() {
    // 서버 업로드 시간 기준으로 내림차순
    let query: Query = personsRef.order(by: Person.CodingKeys.serverTS.rawValue, descending: true)

    query.getDocuments { snapshot, error in
        if let error = error {
            print("Firestore>> read failed", error)
            return
        }

        guard let snapshot = snapshot else {
            print("Firestore>> QuerySnapshot is nil")
            return
        }

        snapshot.documents.compactMap { documentSnapshot in
            try? documentSnapshot.data(as: Person.self)
        }.forEach {
            // local 저장된 상태에 원격 서버로 업로드되지 않은 경우 timestamp가 nil이 되는 경우가 있음
            print("Firestore>>", #function, $0.documentID!, $0.name, $0.serverTS ?? "-")
        }
    }
}
```

- 컬렉션 레퍼런스 `personRef`에서 `getDcouments(....)`를 실행하면 컬렉션 내의 문서 전체를 내려받을 수 있습니다.
- `let query: Query = personsRef.order(...)`
    - `"server_ts"` (=>`Person.CodingKeys.serverTS.rawValue`) 라는 이름의 키를 내림차순으로 정렬하는 쿼리를 만듭니다.
- `documentSnapshot.data(as: Person.self)`
    - Firestore에서 가져온 데이터를 `Person` 타입으로 가공한 뒤 해당 인스턴스를 `person`에 저장합니다.

 

#### **실행하기**

위에서 만든 클래스를 바탕으로 실제 실행 가능한 영역에서 데이터베이스 CRUD를 수행합니다.

```
override func viewDidLoad() {
    super.viewDidLoad()
    FirebasePractice.shared.signInAnonymously { user in
        
        // 새로운 Person 생성
        let person = Person(name: "Person \(Int.random(in: 1...1000))", job: "engineer", devices: ["driver", "drill"])

        // Create
        FirebasePractice.shared.addPost(personRequest: person)
        
        // Read & Update & Delete 대상 문서의 ID
        let targetDocID = "UIS6MGyb79CY4vscxjag"

        // Read(한 개) & Update
        FirebasePractice.shared.read(documentID: targetDocID) { person in
            var person = person
            // 새로운 서버시간 부여
            person.serverTS = nil
            person.name = "New Person"
            FirebasePractice.shared.updatePost(documentID: targetDocID, originalPersonRequest: person)
        }
        
        // Read(컬렉션 내 전체 문서)
        FirebasePractice.shared.readAll()

        // Delete
        FirebasePractice.shared.deletePost(documentID: targetDocID)
    }
}
```

 

#### **실행 화면**

##### **Create**

 ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-5.14.23.jpg)

 

##### **Read(한 개) & Update**

\[caption id="attachment\_4545" align="alignnone" width="745"\] ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-7.07.27.jpg) 업데이트 전\[/caption\]

 

\[caption id="attachment\_4546" align="alignnone" width="764"\] ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-7.08.16.jpg) 업데이트 후\[/caption\]

 

##### **Read(컬렉션 내 전체 문서)**

 ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-7.35.29.jpg)

참고: [Firestore timestamp getting null](https://stackoverflow.com/questions/47771044/firestore-timestamp-getting-null)

 

##### **Delete**

 ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-7.19.38.jpg)

 ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-7.20.54.jpg)

 ![](/assets/img/wp-content/uploads/2022/06/screenshot-2022-06-12-pm-7.21.18.jpg)

 

 

#### **전체 코드**

https://gist.github.com/ayaysir/3d311ba88484c1d188d011e1346ec696
