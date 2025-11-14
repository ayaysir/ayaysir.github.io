---
title: "Swift(스위프트): Vapor를 사용하여 iOS에서 웹 서버 실행 (스토리보드)"
date: 2022-08-30
categories: 
  - "DevLog"
  - "Swift UIKit"
---

##### **출처**

- [Running a Web Server on iOS with Vapor](https://www.raywenderlich.com/31498014-running-a-web-server-on-ios-with-vapor)

원문에서 SwiftUI 부분을 Storyboard로 변경하였습니다.

 

### **Vapor를 사용하여 iOS에서 웹 서버 실행**

 ![](/assets/img/wp-content/uploads/2022/08/simulator_screenshot_CE6B8D15-1746-4467-AB71-2011072FC37D-e1661872266956.png)

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-31-오전-12.24.44.png)

 

Vapor를 사용하면 iOS 앱이 클라이언트이자 서버가 되어 데이터를 제어할 수 있습니다. (심지어 다른 장치에서도 가능합니다.) 이 튜토리얼에서는 동일한 프로세스에서 클라이언트-서버 통신을 시작하는 방법을 설명합니다.

이 포스트에서는 다음 방법을 배우게 됩니다.

- Vapor 서버를 iOS 앱에 통합합니다.
- 웹 브라우저를 통해 앱의 상태와 콘텐츠를 업데이트합니다.

 

#### **시작하기**

이 프로젝트는 두 개의 Swift 패키지인 **_Vapor_**와 **_Leaf_**만 사용합니다. 핵심 Vapor 패키지에는 서버에 백엔드를 구축하는 데 필요한 모든 것이 포함되어 있으며 Leaf 패키지를 사용하면 프론트엔드에 대한 웹페이지를 만들 수 있습니다.

Xcode를 연 후 `Swift Package Manager`에서 이러한 패키지의 최신 버전을 확인하고 다운로드해야 합니다.

해당 라이브러리들의 git 주소는 다음과 같습니다.

- [https://github.com/vapor/vapor.git](https://github.com/vapor/vapor.git)
- [https://github.com/vapor/leaf.git](https://github.com/vapor/leaf.git)

`File > Add Packages...` 를 클릭하고 좌측 상단의 `Recently Used` 버튼 클릭, 우측 상단의 검색창에 git 주소 입력 후 `Add Pacakage` 버튼을 눌러 설치합니다.

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-29-오전-2.14.31.jpg)

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-29-오전-2.14.54.jpg)

 

#### **서버 생성**

`Server` 그룹 안에 새 파일을 만들고 이름을 `FileServer.swift`로 지정한 뒤, 다음 코드를 추가합니다.

```
import Vapor
import Leaf

class FileServer {
    // 1
    var app: Application
    
    // 2
    let port: Int
    
    init(port: Int) {
        self.port = port
        
        // 3
        app = Application(.development)
        
        // 4
        configure(app)
    }
}
```

위의 코드가 하는 일은 다음과 같습니다.

1. 이것은 서버의 전체 수명 주기 및 구성을 처리합니다. 서버에서 수행하는 모든 작업은 `Application`을 통해 실행됩니다.
2. 서버가 실행되는 포트입니다. 일반적으로 웹 서버는 포트 `80` 또는 `443`에서 실행됩니다. 그러나 이들은 iOS에 예약되어 있으므로 다른 서버 포트를 지정해야 합니다.
3. 개발 중에 더 많은 디버그 정보를 얻을 수 있습니다. 배포 준비가 되었다면 이것을 .`production`으로 변경하세요.
4. 다음 문단에서 이것을 설정할 것입니다..

 

#### **서버 구성**

`init`(이니셜라이저) 아래에 구성 함수를 추가하세요.

```
private func configure(_ app: Application) {
    // 1
    app.http.server.configuration.hostname = "0.0.0.0"
    app.http.server.configuration.port = port
    
    // 2
    app.views.use(.leaf)
    
    // 3
    app.leaf.cache.isEnabled = app.environment.isRelease
    
    // 4
    app.leaf.configuration.rootDirectory = Bundle.main.bundlePath
    
    // 5
    app.routes.defaultMaxBodySize = "50MB"
}
```

 

1. 다른 사용자가 서버에 연결할 수 있는 방법을 지정합니다.
2. 이 프로젝트의 웹 렌더링 엔진으로 **_Leaf_**를 사용할 것이라고 Vapor에게 알립니다.
3. 웹 캐싱을 비활성화하면 작업 중인 웹 페이지를 새로 고칠 때마다 최신 버전의 웹 페이지를 얻을 수 있습니다. 이렇게 하면 변경 사항을 즉시 확인할 수 있습니다. 프로덕션 빌드의 경우 캐싱은 웹사이트의 성능을 개선하는 데 도움이 될 수 있습니다.
4. 이 설정은 Leaf에게 `.leaf` 템플릿, 이미지, 글꼴 및 서버의 프론트엔드에 대한 기타 코드를 찾을 위치를 알려줍니다.
5. Vapor의 기본 파일 업로드 크기는 `16KB`입니다. 구축 중인 파일 서버에 비해 너무 작습니다. 여기서는 `50MB`로 설정하였고 더 큰 파일을 지원하려는 경우 늘릴 수 있습니다.

 

서버의 호스트 이름을 `"0.0.0.0"`으로 설정해야 동일한 네트워크에 있는 다른 장치가 서버에 액세스할 수 있습니다. 이 네트워크는 홈 라우터에서 제공하거나 개인 핫스팟을 통한 애드혹(ad-hoc) 구성과 같이 장치 자체에서 제공하는 네트워크일 수 있습니다.

이것은 또한 라우터가 네트워크 외부에서 장치로 요청을 보낼 수 있도록 하여 인터넷을 통한 연결을 허용합니다.

 

#### **서버 시작**

서버를 테스트하려면 먼저 시작할 방법이 필요합니다. `configure` 함수 아래에 새 함수를 추가하고 이름을 `start()`로 지정합니다.

```
func start() {
    // 1
    Task(priority: .background) {
        do {
            // 2
            try app.start()
        } catch {
            fatalError(error.localizedDescription)
        }
    }
}
```

여기서 두 가지 중요한 일이 발생합니다.

1. 먼저 백그라운드 스레드에서 서버를 실행합니다.
2. 그런 다음 `0.0.0.0` 및 지정된 포트에서 서버를 시작합니다.

 

> 참고: 일반적으로 Server-Side Swift 애플리케이션을 빌드할 때 메인 스레드에서 실행하기를 원할 것입니다. 그러나 이 프로젝트에는 iOS 구성 요소도 있으며 기본 스레드가 사용자 상호 작용을 자유롭게 처리할 수 있어야 합니다. 그렇지 않으면 iOS 앱에서 서버가 작업을 수행할 때마다 프레임이 끊기면서 성능이 크게 저하될 수 있습니다. 낮은 우선 순위로 서버를 실행하면 두 시스템 모두에서 가능한 한 가장 부드러운 경험을 할 수 있습니다.

 

`ViewController.swift`를 열고 서버를 초기화하는 `server.start()`를 `viewDidLoad(_:)`에서 호출합니다.

```
import UIKit

class ViewController: UIViewController {
    
    var server = FileServer(port: 8080)

    override func viewDidLoad() {
        super.viewDidLoad()
        
        server.start()
    }
}
```

 

콘솔을 보면 다음과 같이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-29-오전-2.41.52.jpg)

 

동일한 컴퓨터의 웹 브라우저에서 `localhost:8080`으로 이동하면 다음 오류 메시지가 표시됩니다.

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-29-오전-2.42.08.jpg)

이것은 해당 경로에서 서비스를 제공할 수 있는 것들을 아무것도 찾을 수 없다는 서버의 응답입니다. 아직 경로를 생성하지 않았기 때문에 예상되는 결과였고 위 메시지를 받았다면 성공입니다.

 

#### **경로 생성**

**사전 작업 1:** 문서 디렉토리를 가져올 수 있는 아래 URL의 `extension`을 `URL+Extensions.swift` 파일에 추가합니다.

```
import Foundation

extension URL {
  static func documentsDirectory() throws -> URL {
    try FileManager.default.url(
      for: .documentDirectory,
      in: .userDomainMask,
      appropriateFor: nil,
      create: false)
  }

  func visibleContents() throws -> [URL] {
    try FileManager.default.contentsOfDirectory(
      at: self,
      includingPropertiesForKeys: nil,
      options: .skipsHiddenFiles)
  }
}

```

 

**사전 작업 2:** 아래 파일을 `Server/Views` 그룹 밑에 `files.leaf`라는 이름으로 추가합니다. 이 파일은 HTML의 프론트엔드 부분을 렌더링해서 출력하는 파일입니다.

```
<!doctype html>

<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>File Server</title>

    <!-- Bootstrap core CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

    <style>body {padding-top: 5rem;}</style>
  </head>
  <body>
    <main>
      <div class="container">
        <form method="POST" action="/" enctype="multipart/form-data">
            <input type="file" name="file">
            <input type="submit" class="btn btn-primary" value="Upload"/>
        </form>
        <table class="table">
            <tbody>
            #for(filename in filenames):
                <tr>
                    <td class="d-flex">
                        <a class="col btn btn-link d-flex justify-content-start" href="#(filename)">#(filename)</a>
                        <a class="btn btn-danger d-flex justify-content-end" href="delete/#(filename)">Delete</a>
                    </td>
                </tr>
            #endfor
            </tbody>
        </table>
      </div>
    </main>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
  </body>
</html>

```

 

이 섹션에서는 서버로 들어오는 요청을 처리하기 위해 4개의 경로를 생성합니다.

`Server` 그룹에 새 파일을 만들고 이름을 `FileWebRouteCollection.swift`로 지정합니다.

`RouteCollection`을 준수하고 `boot()` 프로토콜 메서드를 추가하여 파일을 시작합니다.

```
import Vapor

struct FileWebRouteCollection: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        // <code> //
    }
}

```

`Application`은 경로 등록을 위해 이 기능을 사용합니다.

첫 번째 경로는 `filesViewHandler`입니다. 서버의 진입점이며 `"deviceIP":8080`으로 전송된 모든 요청을 처리합니다.

사실 이것은 이 프로젝트에서 서버에 필요한 유일한 View 경로입니다. 업로드된 파일의 전체 목록을 표시하고, 사용자가 새 파일을 업로드하고 다운로드할 수도 있습니다.

```
func filesViewHandler(_ req: Request) async throws -> View {
    let documentsDirectory = try URL.documentsDirectory()
    let fileUrls = try documentsDirectory.visibleContents()
    let filenames = fileUrls.map { $0.lastPathComponent }
    let context = FileContext(filenames: filenames)
    return try await req.view.render("files", context)
}
```

위 코드를 `boot(routes:)` 함수 밑에 추가합니다. iOS 앱에서 액세스할 수 있는 `document` 디렉토리의 내용을 로드하고 파일 이름 목록을 생성하여 뷰 렌더러에 전달합니다.

 

다음 코드를 `FileWebRouteCollection.swift` 파일의 하단에 추가합니다.

```
struct FileContext: Encodable {
    var filenames: [String]
}
```

 

`Server/Views/files.leaf` 파일을 살펴보면 24 라인부터 작성된 `FileContext`의 `filenames` 속성을 볼 수 있습니다.

```
...
#for(filename in filenames):
...
```

이렇게 하면 사용자에게 모든 파일 이름이 목록으로 표시되고 여기에서 특정 파일을 클릭하여 다운로드할 수 있습니다.

 

이제 `boot` 함수 안에 액세스할 수 있도록 새 경로(routes)를 추가합니다.

```
func boot(routes: RoutesBuilder) throws {
    routes.get(use: filesViewHandler)
    // ... //
}
```

이제 서버 루트에 대한 모든 `GET` 요청이 이 경로를 통과합니다.

 

`FileServer.swift`을 엽니다. `do` 문 내에서 `try app.start()` 전에 `FileWebRouteCollection`을 등록합니다.

```
try app.register(collection: FileWebRouteCollection())
```

 

빌드 및 실행합니다. 웹 브라우저에서 `localhost:8080`을 열면 두 개의 버튼이 보일 것입니다.

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-9.50.32.jpg)

 

해당 경로가 존재하지 않기 때문에 `Upload`(업로드) 버튼이 아직 작동하지 않는다는 것을 알게 될 것입니다. 업로드 기능을 만들겠습니다.

 



 

#### **파일 업로드**

`FileWebRouteCollection.swift`를 열고 파일 맨 아래의 `FileContext` 구조체(`struct`) 밑에 `FileUploadPostData` 구조체를 만듭니다.

```
struct FileUploadPostData: Content {
  var file: File
}
```

 

`FileWebRouteCollection` 구조체 내에 파일 업로드를 처리하는 새 함수 `uploadFilePostHandler`를 추가합니다.

```
func uploadFilePostHandler(_ req: Request) throws -> Response {
  // 1
  let fileData = try req.content.decode(FileUploadPostData.self)
    
  // 2
  let writeURL = try URL.documentsDirectory().appendingPathComponent(fileData.file.filename)
    
  // 3
  try Data(fileData.file.data.readableBytesView).write(to: writeURL)
    
  // 4
  return req.redirect(to: "/")
}
```

작동 방식은 다음과 같습니다.

1. 들어오는 리퀘스트(request)의 내용을 `FileUploadPostData` 오브젝트로 디코딩합니다.
2. 문서 디렉토리와 업로드된 파일의 이름을 기반으로 URL을 생성합니다.
3. 생성된 URL에 파일을 씁니다.
4. 성공하면 브라우저를 루트 URL로 리디렉션하여 페이지를 새로 고칩니다.

 

새로운 `POST` 경로를 `boot()` 안에 추가합니다.

```
routes.post(use: uploadFilePostHandler)
```

 

웹의 리퀘스트 내용을 `FileUploadPostData` 오브젝트로 디코딩하는 방식에 대해 설명하겠습니다.

`files.leaf`를 열고 양식 블록을 보십시오.

첫 번째 입력 필드는 `name`(이름)과 `type`(유형) 모두에 대해 "`file`"입니다. Vapor는 이 `name` 매개변수를 사용하여 요청의 파일 데이터를 `FileUploadPostData.file` 속성에 매핑합니다.

```
<form method="POST" action="/" enctype="multipart/form-data">
  <input type="file" name="file">
  <input type="submit" class="btn btn-primary" value="Upload"/>
</form>
```

 

빌드 및 실행합니다. 웹 브라우저에서 `localhost:8080`으로 이동하여 파일을 업로드합니다.

 ![](/assets/img/wp-content/uploads/2022/08/Screen-Shot-2022-03-17-at-4.23.46-pm.png)

`Delete`(삭제)는 아직 작동하지 않지만 이제 웹 브라우저를 통해 iOS 기기로 파일을 보낼 수 있으므로 파일 내용을 미리 볼 수 있는 방법을 만들어야 합니다.

 

#### **파일 미리보기**

프로젝트의 iOS 측에서 업로드된 파일 목록에 액세스할 수 있어야 합니다. 이 가이드에서는 `FileServer`를 사용합니다. 그러나 훨씬 더 큰 프로젝트에서는 해당 책임을 전용 파일 관리 오브젝트로 옮기는 것이 좋습니다.

 

`FileServer.swift`를 열고 클래스 상단 근처에 새 속성을 추가합니다.

```
var fileURLs: [URL] = []
```

이것은 앱의 문서 디렉토리에 저장된 모든 파일에 대한 단일 정보 소스입니다.

 

`FileServer.swift` 파일 내에 `loadFiles()`라는 이름의 새 함수를 만듭니다.

```
func loadFiles() {
    do {
        let documentsDirectory = try FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: false)
        let fileUrls = try FileManager.default.contentsOfDirectory(
            at: documentsDirectory,
            includingPropertiesForKeys: nil,
            options: .skipsHiddenFiles)
        self.fileURLs = fileUrls
    } catch {
        fatalError(error.localizedDescription)
    }
}
```

이 함수는 앱의 문서 디렉토리 내부를 탐색하고 그 안에 있는 모든 숨겨지지 않은 파일(visible files)의 URL을 반환합니다. 프로젝트의 iOS 부분에서 파일 목록을 새로 고쳐야 할 때마다 이 함수를 사용합니다.

이것을 호출하기에 좋은 장소는 `ViewController.swift` 내의 `viewDidLoad` 메소드입니다. 그렇게 하면 앱이 시작될 때 파일 목록이 채워집니다.

```
override func viewDidLoad() {
    super.viewDidLoad()
    
    server.start()
    server.loadFiles()
}
```

 

다음 뷰 컨트롤러 안에 테이블 뷰를 추가하고, 업로드된 파일 목록이 나타나도록 합니다.

\[caption id="attachment\_4681" align="alignnone" width="600"\] ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-10.21.08.jpg) 뷰 컨트롤러 안에 Table View(`UITableView`)를 추가합니다.\[/caption\]

 

\[caption id="attachment\_4682" align="alignnone" width="652"\] ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-10.22.09.jpg) 테이블 뷰를 ViewController.swift 파일과 `@IBOutlet`으로 연결합니다.\[/caption\]

 

\[caption id="attachment\_4683" align="alignnone" width="361"\] ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-10.23.28.jpg) `viewDidLoad` 안에 `delegate`, `dataSource`를 `self`와 연결합니다.\[/caption\]

 

\[caption id="attachment\_4684" align="alignnone" width="466"\] ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-10.26.26.jpg) 테이블 뷰에 Prototype Cell을 1개 추가하고, Style을 Basic으로, identifier를 `FileNameCell`로 지정합니다.\[/caption\]

 

위의 사전 작업을 마친 후 아래 `extension`을 추가합니다.

```
extension ViewController: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        server.fileURLs.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "FileNameCell") else {
            fatalError("CELL IS NOT EXIST")
        }

        if let label = cell.contentView.subviews[0] as? UILabel {
            label.text = "\(server.fileURLs[indexPath.row].lastPathComponent)"
        }
        
        return cell
    }
}
```

빌드 및 실행합니다.

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-10.40.17.png)

업로드한 파일에 따라 위의 스크린샷과 유사한 내용이 표시됩니다. 파일이 표시되지 않으면 브라우저를 통해 파일을 업로드해 보세요.

업로드된 파일을 표시하려면 다시 빌드하고 실행해야 합니다.

 

셀을 클릭했을 때 파일 내용이 미리 표시되도록 하는 기능을 구현하려면, `QLPreviewControlle`이 필요합니다. 이것은 Apple의 `QuickLook` 프레임워크의 일부이며 이미지, 비디오, 음악 및 텍스트를 포함한 몇 가지 다른 파일 유형을 열 수 있는 뷰 컨트롤입니다. 이를 통해 iOS 앱에서 업로드된 파일을 미리 볼 수 있습니다.

 

뷰 컨트롤러 파일에 `import QuickLook`을 추가합니다.

```
import QuickLook
```

 

뷰 컨트롤러의 멤버 변수로 아래를 추가합니다.

```
var previewURL: URL!
```

 

아래 `extension`을 추가합니다.

```
extension ViewController: QLPreviewControllerDelegate, QLPreviewControllerDataSource {
    
    func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
        1
    }
    
    func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
        previewURL as QLPreviewItem
    }
    
    func previewController(_ controller: QLPreviewController, editingModeFor previewItem: QLPreviewItem) -> QLPreviewItemEditingMode {
        .disabled
    }
}

```

 

셀을 클릭했을 때 할 작업을 작성합니다. tableView delegate, dataSource가 있는 `extension` 안에 아래 함수를 추가합니다.

```
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    previewURL = server.fileURLs[indexPath.row]
    
    let previewVC = QLPreviewController()
    previewVC.delegate = self
    previewVC.dataSource = self
    
    self.present(previewVC, animated: true)
}
```

 

<!-- http://www.giphy.com/gifs/sDYwNFulSvl1RsmmUm -->
![](https://)

\[the\_ad id="3020"\]

 

#### **파일 새로 고침**

현재 상태에서는 새 파일을 업로드할 때마다 앱을 다시 시작해야 파일을 볼 수 있습니다. 앱을 다시 시작하지 않고도 파일 목록을 업데이트할 수 있습니다. 이 섹션에서는 `NotificationCenter`를 사용하여 URL 목록을 업데이트합니다.

그 전에 아래 `extension`을 추가합니다.

```
import Foundation

extension Notification.Name {
    static let serverFilesChanged = Notification.Name("serverFilesChanged")
}

```

 

뷰 컨트롤러의 `viewDidLoad` 안에 다음 옵저버를 추가하세요. 파일이 업로드되면 목록을 다시 불러오고 테이블 뷰를 새로고침합니다.

```
NotificationCenter.default.addObserver(forName: .serverFilesChanged, object: nil, queue: .main) { _ in
    self.server.loadFiles()
    self.tbvFileList.reloadData()
}
```

 

이 알림을 트리거하려면 `FileWebRouteCollection.swift`를 열고 `FileWebRouteCollection` 구조체 맨 하단에 다음과 같이 `notifyFileChange()`라는 새 함수를 추가하세요.

```
func notifyFileChange() {
    DispatchQueue.main.async {
        NotificationCenter.default.post(name: .serverFilesChanged, object: nil)
    }
}
```

 

문서 디렉토리 내의 파일이 변경될 때마다 반드시 호출하도록 해야 합니다. 이를 수행하는 좋은 위치는 `uploadFilePostHandler` 함수 내의 `return` 문 바로 직전입니다.

```
func uploadFilePostHandler(_ req: Request) throws -> Response {
    let fileData = try req.content.decode(FileUploadPostData.self)
    let writeURL = try URL.documentsDirectory().appendingPathComponent(fileData.file.filename)
    try Data(fileData.file.data.readableBytesView).write(to: writeURL)
    
    // 파일 변경 알림 notification 전송
    notifyFileChange()

    return req.redirect(to: "/")
}
```

이렇게 하면 파일 업로드가 성공적으로 완료되면 알림이 트리거되며, 파일 서버는 파일을 다시 로드하도록 지시하고 게시된 속성을 통해 결과를 UI로 다시 전달합니다.

 

#### **파일 다운로드**

파일 호스팅 서버는 사람들이 해당 파일을 다운로드할 수 있는 기능이 없으면 아무 것도 아닙니다. 이미 대부분의 작업을 완료했기 때문에 다운로드를 활성화하는 것은 매우 쉽습니다. 이러한 요청을 처리하기 위한 새로운 경로만 있으면 됩니다.

`FileWebRouteCollection.swift`를 열고 동명의 구조체 안에 `downloadFileHandler`라는 새 핸들러를 만듭니다.

```
func downloadFileHandler(_ req: Request) throws -> Response {
    guard let filename = req.parameters.get("filename") else {
        throw Abort(.badRequest)
    }
    let fileUrl = try URL.documentsDirectory().appendingPathComponent(filename)
    return req.fileio.streamFile(at: fileUrl.path)
}
```

이것은 파일 이름이 미비된 모든 요청을 거부하고 저장소에서 해당 파일을 가져온 다음 리스폰스(response)로 반환합니다.

마지막으로 파일 상단의 `boot(routes:)` 함수 내 경로(route) 빌더에 추가하여 컬렉션에 새 다운로드 경로를 등록합니다.

```
routes.get(":filename", use: downloadFileHandler)
```

콜론(`:`) 구문은 이 특정 URL 경로 구성요소를 매개변수로 표시하고 리퀘스트를 통해 해당 값을 노출합니다. 명시적인 다른 경로 구성 요소와 달리 이 구성 요소는 모든 문자열 값이 될 수 있습니다. 예를 들어 `ExampleFile.txt`라는 파일을 다운로드하려면 브라우저에서 `myServer:8080/ExampleFile.txt`를 엽니다. Vapor는 `ExampleFile.txt` 부분을 가져와 `req.parameters.get("filename")`을 통해 액세스할 수 있도록 합니다.

다시 빌드하고 실행합니다. 이번에는 웹 브라우저에서 서버로 이동하여 파일을 클릭합니다. (또는 URL을 직접 입력합니다.)

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-30-pm-11.42.23.png)

 

마지막으로 처리해야 할 사항이 남아 있습니다. 바로 파일 삭제입니다.

 

#### **웹에서 파일 삭제**

기기에서 허용 가능한 수준의 저장 공간을 유지하려면 서버의 파일을 정리하는 방법이 필요합니다. 웹 페이지의 삭제 버튼은 `files.leaf` 파일 안에 이미 준비가 되어있고 기능만 구현하면 됩니다.

`FileWebRouteCollection.swift`를 열고 동명의 구조체 안에 삭제 요청을 처리할 새 핸들러를 추가하세요.

```
func deleteFileHandler(_ req: Request) throws -> Response {
    guard let filename = req.parameters.get("filename") else {
        throw Abort(.badRequest)
    }
    let fileURL = try URL.documentsDirectory().appendingPathComponent(filename)
    try FileManager.default.removeItem(at: fileURL)
    notifyFileChange()
    return req.redirect(to: "/")
}
```

 

이것은 다운로드 핸들러와 유사합니다. 둘 다 누락된 파일 이름 매개변수에 대한 요청을 거부하고 해당 파일 이름을 기반으로 URL을 구성합니다. 그러나 파일을 반환하는 대신 제거됩니다. 마지막으로 알림이 트리거되어 앱의 iOS 부분에 UI 업데이트가 필요함을 알리고 리디렉션을 통해 웹 페이지를 새로 고칩니다.

다음 코드를 `boot(routes:)` 함수에 추가하여 삭제 경로를 등록합니다.

```
routes.get("delete", ":filename", use: deleteFileHandler)
```

이 새 경로는 추가 경로 구성 요소가 있다는 점을 제외하고 다운로드 경로와 유사합니다. 이전과 동일한 예를 사용하면 myServer:8080/ExampleFile.txt에서 이름이 ExampleFile.txt인 파일을 다운로드할 수 있지만 myServer:8080/delete/ExampleFile.txt로 이동하여 동일한 파일을 삭제할 수 있습니다. 웹 페이지에서 삭제 버튼을 클릭했을 때와 동일한 요청입니다.

 

#### **앱에서 파일 삭제**

파일 삭제는 앱에서 수행할 수 있어야 합니다. `FileServer.swift`를 열고 동명의 클래스 하단에 새로운 삭제 함수를 추가하세요:

```
func deleteFile(at offset: Int) {
    // 1
    let urlsToDelete = fileURLs[offset]
    
    // 2
    fileURLs.remove(at: offset)
    
    // 3
    try? FileManager.default.removeItem(at: urlsToDelete)
}
```

이 코드가 하는 일은 다음과 같습니다.

1. 제공된 인덱스를 사용하여 삭제할 URL을 지정합니다.
2. 앱의 UI를 제공하는 배열에서 해당 URL을 제거합니다.
3. 장치에서 해당 URL의 파일을 삭제합니다.

 

뷰 컨틀로러의 테이블 뷰 관련 `extension`에 다음을 추가합니다.

```
func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
    if editingStyle == .delete {
        server.deleteFile(at: indexPath.row)
        tableView.deleteRows(at: [indexPath], with: .fade)
        tableView.reloadData()
    }
}
```

 

<!-- http://www.giphy.com/gifs/uIYXg99raC80l9uBv2 -->
![](https://)

 

#### **서버 제목 표시하기**

 ![](/assets/img/wp-content/uploads/2022/08/screenshot-2022-08-31-오전-12.05.23.png)

```
lblTitle.text = ProcessInfo().hostName + ":\(server.port)"
```

- 관련글: [swift-get-devices-wifi-ip-address](https://stackoverflow.com/questions/30748480/swift-get-devices-wifi-ip-address)

 

#### **인터넷을 통한 액세스**

보안에 관한 한마디: 예방 조치를 취하고 앱을 무인 실행 상태로 두지 않아야 합니다.

어디서나 앱에 액세스할 수 있도록 하려면 방화벽을 비활성화하거나 네트워크 라우터의 일부 포트 설정을 변경해야 할 수 있습니다. 또는 장치에서 Wi-Fi를 비활성화하고 셀룰러 서비스를 사용하여 연결할 수 있습니다.

다음 웹 검색에 "what's my ip"를 입력하여 찾을 수 있는 네트워크의 공개 IP 주소가 필요합니다. 해당 IP 주소와 포트 번호만 있으면 연결이 가능합니다.

 

#### **다음 뭘 해야 되나요?**

이 튜토리얼은 프론트엔드와 백엔드 시스템을 동일한 프로젝트에 결합할 때 가능한 것의 시작에 불과합니다. 이것을 타사 서비스를 거치지 않고 멀티플레이어 게임이나 스트리밍 비디오 콘텐츠에 사용할 수 있는 방법을 고려하세요.

영감을 얻기 위한 몇 가지 다른 아이디어:

- 웹 로그인/비밀번호 화면을 만들어 서버에 액세스할 수 있는 사람을 제한합니다.
- 파일을 업로드한 사용자만 볼 수 있도록 권한 시스템을 만듭니다.
- iOS 측 사용자가 서버에 파일을 추가할 수 있는 기능을 추가합니다.

 

#### **전체 코드**

- [https://github.com/ayaysir/iOS-FileServerExample-Storyboard](https://github.com/ayaysir/iOS-FileServerExample-Storyboard)

 

\[rcblock id="4560"\]
