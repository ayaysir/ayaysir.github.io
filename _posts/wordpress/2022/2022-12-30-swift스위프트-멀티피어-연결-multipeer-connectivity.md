---
title: "Swift(스위프트): 멀티피어 통신 (Multipeer Connectivity) [기초]"
date: 2022-12-30
categories: 
  - "DevLog"
  - "Swift"
---

##### **출처**

- [Multipeer Connectivity](https://nshipster.com/multipeer-connectivity/)
- [Getting Started with Multipeer Connectivity](https://www.kodeco.com/12689804-getting-started-with-multipeer-connectivity)

 

### **소개**

멀티피어 통신 (Multipeer Connectivity)는 모바일 기기간에 Wi-Fi 네트워크, P2P Wi-Fi 및 Bluetooth 등의 개인 영역 네트워크를 통해 통신할 수 있도록 하는 프레임워크입니다. 연결된 피어는 중간 웹 서비스를 거치지 않고 메시지, 스트림 또는 파일 리소스를 다른 장치로 안전하게 전송할 수 있습니다.

 

### **사전 작업**

스토리보드(Interface Builder) 기준으로 설명합니다. iOS App 프로젝트를 생성합니다.

 

뷰 컨트롤러 파일에서 `MultipeerConnectivity`를 `import` 합니다.

```
import MultipeerConnectivity
```

 

뷰 컨트롤러(`ViewController.swift`)에 아래 멤버 변수를 추가합니다.

```swift
private var session: MCSession!
private var advertiser: MCNearbyServiceAdvertiser!
// private var browser: MCNearbyServiceBrowser!
private var browserVC: MCBrowserViewController!
```

- MCSession - 피어 연결에 대한 세션입니다.
- MCNearbyServiceBrowser - 브라우저입니다. (이 포스트에서는 다루지 않습니다.)
- MCNearbyServiceAdvertiser - 선전 서비스입니다.
- MCBrowserViewController - 뷰 컨투롤러 형태로 시각화된 브라우저입니다. 피어 연결에 대한 표준 UI를 제공합니다.

 

info.plist에 아래 항목들을 추가합니다. 아래 두 항목은 필수로 입력해야 멀티피어 통신이 가능합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2023-01-10-am-2.21.31.jpg)

- **Privacy - Local Network Usage Description**
    - `NSLocalNetworkUsageDescription`
    - 로컬 기기에 연결할 때 표시할 메시지입니다.
- **Bonjour services**
    - `NSBonjourServices`
    - `_[서비스유형이름]._tcp` 의 형태로 입력합니다.
    - 서비스 유형은 밑에서 설명하며, 서비스 유형이 여러 개인 경우 아이템을 추가 후 전부 입력합니다.
    - 예제에서 사용하는 서비스 유형 이름은 `Chat-service` 입니다.

 

### **선전(Advertising) 및 발견(Discovering)**

멀티피어 통신의 첫 번째 단계는 동료(기기)가 서로를 알게 하는 것입니다. 이는 선전(Advertising) 및 발견(Discovering) 서비스를 통해 이루어집니다.

선전은 다른 피어에게 서비스를 알리는 반면 발견은 다른 피어가 광고하는 서비스를 클라이언트가 인식하는 반대 방향의 프로세스입니다. 많은 경우에 클라이언트는 동일한 서비스를 발견 및 선전하므로 특히 클라이언트-서버 패러다임에 뿌리를 둔 모든 사용자에게 초기 혼란이 발생할 수 있습니다.

각 서비스는 **최대 15자 길이**의 ASCII 문자, 숫자 및 하이픈(`-`)로 구성된 짧은 텍스트 문자열인 유형(type)으로 식별됩니다. 규칙에 따라 서비스 이름은 앱 이름으로 시작하고 그 뒤에 대시와 해당 서비스에 대한 고유한 설명자가 와야 합니다(간단한 _com.apple.\*-esque_ 형식의 역방향 DNS 표기법으로 생각하세요).

이번 예제는 `Chat-service`라는 이름으로 타입을 지정하겠습니다. `ChatServiceType`를 뷰 컨트롤러의 멤버 변수로 추가합니다.

```swift
private let ChatServiceType = "Chat-service"
```

 

피어는 표시 이름(display name)으로 초기화되는 `MCPeerID` 인스턴스로 고유하게 식별됩니다. 이것은 사용자가 지정한 별명 또는 단순히 현재 장치 이름일 수 있습니다.

장치의 이름을 표시 이름으로 지정합니다. `localPeerId`를 뷰 컨트롤러의 멤버 변수로 추가합니다.

```swift
private let localPeerID = MCPeerID(displayName: UIDevice.current.name)
```

 

> NSNetService 또는 Bonjour C API를 사용하여 피어를 수동으로 선전하거나 발견할 수도 있지만 이는 다소 심화된 특정 문제입니다. 수동 피어 관리에 대한 추가 정보는 `MCSession` 설명서에서 찾을 수 있습니다.

 

#### **선전 (Advertising)**

서비스는 로컬 피어, 서비스 유형 및 서비스를 검색하는 피어와 통신할 선택적 정보로 초기화되는 `MCNearbyServiceAdvertiser`에 의해 선전(advertise)됩니다.

> 발견 정보(Discovery information)는 [RFC 6763](https://www.rfc-editor.org/rfc/rfc6763)에 따라 인코딩된 Bonjour TXT 레코드로 전송됩니다.

 

아래 코드를 `viewDidLoad(:_)`에 추가합니다.

```swift
self.advertiser = MCNearbyServiceAdvertiser(
    peer: localPeerID,
    discoveryInfo: nil,
    serviceType: ChatServiceType)

advertiser.delegate = self
advertiser.startAdvertisingPeer()
```

- **MCNearbyServiceAdvertiser**
    - `peer`: 현재 기기(나의 기기)의 Peer ID를 지정합니다.
    - `discoveryInfo`: `MCNearbyServiceBrowser`에서 이용할 수 있는 정보들을 담은 사전(`dictionary`)입니다.
    - `serviceType`: 서비스 유형을 지정합니다.
- **advertiser.delegate**
    - 딜리게이트(위임자)를 현재 뷰 컨트롤러로 지정합니다.
- **advertiser.startAdvertisingPeer()**
    - 이 메서드가 실행되는 시점부터 선전 활동을 시작합니다.
    - 선전 활동을 중지하려면 `.stopAdvertisingPeer()`를 사용합니다.

 

다음 `MCNearbyServiceAdvertiserDelegate`를 준수하는 뷰 컨트롤러의 `extension`을 추가합니다.

```swift
extension ViewController: MCNearbyServiceAdvertiserDelegate {
    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        // ... 잠시 후 작성 ... //
    }
}
```

- **...didReceiveInvitationFromPeer...**
    - 초청(invitation)을 받았을 경우 해야 할 작업을 작성합니다.
    - 수락 여부는 `invitationHandler`의 `Bool` 타입의 첫 번째 파라미터를 사용합니다. (잠시 후 설명)

 

아래 코드는 `AlertController` 경고창을 사용하여 수락 여부를 결정합니다. 위 `// ... 잠시 후 작성 ... //` 부분을 아래 코드로 대체합니다.

```
let title = "Accept \(peerID.displayName)'s Request"
let message = "Would you like to accept from: \(peerID.displayName)"

let alertController = UIAlertController(
    title: title,
    message: message,
    preferredStyle: .alert)

alertController.addAction(UIAlertAction(
    title: "No",
    style: .cancel
) { _ in
    invitationHandler(false, nil)
})

alertController.addAction(UIAlertAction(
    title: "Yes",
    style: .default
) { _ in
    invitationHandler(true, self.session)
})

present(alertController, animated: true)
```

- **invitationHandler**
    - 첫 번째 파라미터: 수락 여부를 `true`/`false`로 결정합니다.
    - 두 번째 파라미터: 세션(`MCSession`)을 전송하는 부분입니다. 세션은 밑에서 설명합니다.
        - 수락하였다면 `session` 인스턴스를 보내고, 거부하였다면 `nil`로 지정합니다.

 

#### **세션 생성**

위의 예와 같이 선전하는 자(advertiser)가 세션을 생성하고 연결 초대를 수락하면 피어에게 전달됩니다. `MCSession` 개체는 로컬 피어 식별자 `peer`와 `securityIdentity` 및 `encryptionPreference` 매개 변수를 사용하여 초기화됩니다.

`viewDidLoad()`에 아래 부분을 추가합니다.

```swift
self.session = MCSession(
    peer: localPeerID,
    securityIdentity: nil,
    encryptionPreference: .none)

session.delegate = self
```

- `peer`는 현재 기기(나의 기기)의 Peer ID입니다.
- **\[심화\]** `securityIdentity`는 피어가 X.509 인증서로 피어를 안전하게 식별할 수 있도록 하는 선택 사항의 파라미터입니다.
    - 지정된 경우 첫 번째 개체는 클라이언트를 식별하는 `SecIdentityRef`여야 하며, 로컬 피어의 ID를 확인하는 데 사용할 수 있는 하나 이상의 `SecCertificateRef` 개체가 뒤따라야 합니다.
- `encryptionPreference` 매개변수는 피어 간의 통신을 암호화할지 여부를 지정합니다. `MCEncryptionPreference` enum은 세 가지 가능한 값을 제공합니다.
    - `MCEncryptionOptional`: 세션은 암호화 사용을 선호하지만 암호화되지 않은 연결을 허용합니다.
    - `MCEncryptionRequired`: 세션에 암호화가 필요합니다.
    - `MCEncryptionNone`: 세션을 암호화하지 않습니다.

> 암호화를 활성화하면 전송 속도가 크게 줄어들 수 있으므로 응용 프로그램이 사용자에게 민감한 정보를 특별히 처리하지 않는 한 `MCEncryptionNone`을 사용하는 것이 좋습니다.

 

다음 `MCNearbyServiceAdvertiserDelegate`를 준수하는 뷰 컨트롤러의 `extension`을 추가합니다.

```swift
extension ViewController: MCSessionDelegate {
    func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        switch state {
        case MCSessionState.connected:
            print("Connected: \(peerID.displayName)")
        case MCSessionState.connecting:
            print("Connecting: \(peerID.displayName)")
        case MCSessionState.notConnected:
            print("Not Connected: \(peerID.displayName)")
        @unknown default:
            break
        }
    }
    
    func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        print(#function, peerID, data)
    }
    
    func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {
        print(#function, peerID)
    }
    
    func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {
        print(#function, peerID)
    }
    
    func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {
        print(#function, peerID)
    }
}
```

 

 

#### **발견 (Discovery)**

클라이언트는 `MCNearbyServiceAdvertiser`와 마찬가지로 로컬 피어 식별자 및 서비스 유형으로 초기화되는 `MCNearbyServiceBrowser`를 사용하여 선전된 서비스를 검색할 수 있습니다.

```
let browser = MCNearbyServiceBrowser(peer: localPeerID, serviceType: ChatServiceType)
browser.delegate = self
```

> **\[참고\]** 이번 포스트에서는 브라우징 기능을 편리하게 이용할 수 있는 `MCBrowserViewController`에 대해서만 다루며 `MCNearbyServiceBrowser`에 대해선 다루지 않습니다. 간략한 사용 예제는 아래 코드를 참조하세요.
> 
> ```
> class ViewController: UIViewController {
>     // ... //
> 
>     private var browser: MCNearbyServiceBrowser!
> 
>     // ... //
> 
>     override func viewDidLoad() {
>         super.viewDidLoad()
> 
>         // ... //
> 
>         browser = MCNearbyServiceBrowser(peer: localPeerID, serviceType: MultiPeerServiceType)
>         browser.delegate = self
>         browser.startBrowsingForPeers()
> 
>         // ... //
>     }
>     
>     func invitePeer(_ peerID: MCPeerID) {
>         browser.invitePeer(peerID, to: session, withContext: nil, timeout: TimeInterval(120))
>         print("Invited: \(peerID.displayName)")
>     }
> 
>     // ... //
> }
> 
> // ... //
> 
> extension ViewController: MCNearbyServiceBrowserDelegate {
>     func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String : String]?) {
>         print(#function, peerID)
>         if peerID.displayName == "ABC's iPhone" {
>             invitePeer(peerID)
>         }
>     }
>     
>     func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
>         print(#function, peerID)
>     }
> }
> 
> // ... //
> ```

 

특정 서비스를 광고하는 많은 피어가 있을 수 있으므로 사용자(및 개발자)의 편의를 위해 `MCBrowserViewController`는 광고 피어를 표시하고 연결하는 기본 제공 표준 방법을 제공합니다.

```
let browserViewController = MCBrowserViewController(
    serviceType: ChatServiceType,
    session: session)

browserViewController.delegate = self
present(browserViewController, animated: true)
```

 

브라우저가 피어에 대한 연결을 마치고 난 뒤 UI 작업을 처리해야 하는데, 해당 부분은 다음과 같이 `MCBrowserViewControllerDelegate`를 준수하는 `extension`으로 추가합니다.

```swift
extension ViewController: MCBrowserViewControllerDelegate {
    func browserViewControllerDidFinish(_ browserViewController: MCBrowserViewController) {
        browserViewController.dismiss(animated: true)
    }
    
    func browserViewControllerWasCancelled(_ browserViewController: MCBrowserViewController) {
        browserViewController.dismiss(animated: true)
    }
}
```

 

##### **실제 UI에 적용**

스토리보드에 버튼(`UIButton`)과 스위치(`UISwitch`)를 추가하고, `@IBAction`으로 연결한 뒤 아래 코드를 작성합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2023-01-10-am-1.36.56.jpg)

```swift
@IBAction  func btnActShowBrowserVC(_ sender: Any) {
    browserVC = MCBrowserViewController(serviceType: ChatServiceType, session: session)
    browserVC.delegate = self
    present(browserVC, animated: true)
}

@IBAction func btnActStartAdvertising(_ sender: UISwitch) {
    if sender.isOn {
        advertiser.startAdvertisingPeer()
    } else {
        advertiser.stopAdvertisingPeer()
    }
}
```

- 버튼을 누르면 피어를 찾는 뷰 컨트롤러인 `MCBroswerVC`를 띄웁니다.
- 스위치를 토글하면 선전을 on/off 할 수 있습니다.

 

시뮬레이터와 실제 기기에서 각각 빌드 및 실행합니다. 아이패드(시뮬레이터)에서 선전 모드를 켠 뒤 아이폰(실제 기기)에서 피어를 발견하고 연결합니다.

<!-- https://giphy.com/gifs/2DElddPef27Dd8zVWS -->
![](https://)

\[caption id="attachment\_5200" align="alignnone" width="264"\] ![](/assets/img/wp-content/uploads/2022/12/screenshot-2023-01-10-am-1.34.02.jpg) YES를 누르면 연결됩니다.\[/caption\]

 

#### **정보 송수신**

피어가 서로 연결되면 피어들 사이에 정보를 보낼 수 있습니다. Multipeer Connectivity 프레임워크는 세 가지 데이터 전송 형식을 구분합니다.

- **메시지(Message)** - 짧은 텍스트 또는 작은 직렬화된 개체와 같이 경계가 잘 정의된 정보입니다.
- **스트림(Stream)** - 오디오, 비디오 또는 실시간 센서 이벤트와 같은 데이터를 지속적으로 전송하는 데 사용되는 열린정보 채널입니다.
- **리소스(Resource)** - 이미지, 동영상 또는 문서와 같은 파일입니다.

 

##### **메시지**

메시지는 `session.send(...)`로 전송합니다.

```
let message = "Hello, World!"
let data = message.data(using: .utf8)
do {
    if let data {
        try session.send(
            data,
            toPeers: peers,
            with: .reliable)
    }
} catch {
    print("[Error] \(error)")
}
```

 

메시지는 `MCSessionDelegate` 메소드의 `session( ...didReceiveData...fromPeer...)`를 통해 수신됩니다. 이전 코드 예제에서 보낸 메시지를 디코딩하는 방법은 다음과 같습니다.

```swift
// MARK: - MCSessionDelegate
func session(
    _ session: MCSession,
    didReceive data: Data,
    fromPeer peerID: MCPeerID
) {
    let message = String(
        data: data,
        encoding: .utf8)
    print("\(message ?? "")")
}
```

 

**\[심화\]** 또 다른 접근 방식은 `NSKeyedArchiver` 인코딩 객체를 보내는 것입니다.

```
let object: NSSecureCoding = []
var data: Data? = nil

if let object {
    data = NSKeyedArchiver.archivedData(withRootObject: object)
}

do {
    if let data {
        try session.send(
            data,
            toPeers: peers,
            with: .reliable)
    }
} catch {
    print("[Error] \(error)")
}
```

 

##### **메시지를 실제 UI에 적용**

아주 간단한 채팅 앱 예제를 만들어 보겠습니다.

뷰 컨트롤러의 멤버 변수로 아래를 추가합니다.

```swift
private var peers: [MCPeerID] = []
private var chatList: [String] = [] {
    didSet {
        DispatchQueue.main.async { [unowned self] in
            txvChatList.text = chatList.joined(separator: "\n")
        }
    }
}
```

- `peers` - 채팅 메시지를 보낼 피어 목록입니다.
- `chatList` - 수신된 메시지를 텍스트 형태로 저장하는 배열입니다.
    - 해당 배열이 업데이트되면 `joined`를 이용해 라인 브레이킹된 텍스트로 출력합니다.

 

스토리보드에 텍스트 뷰, 텍스트 필드 및 버튼을 추가하고, `@IBAction`으로 연결한 뒤 아래 코드를 작성합니다.

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2023-01-10-am-2.09.33.jpg)

 ![](/assets/img/wp-content/uploads/2022/12/screenshot-2023-01-10-am-2.10.21.jpg)

```swift
@IBOutlet weak var txfMessage: UITextField!
@IBOutlet weak var txvChatList: UITextView!

private var peers: [MCPeerID] = []
private var chatList: [String] = [] {
    didSet {
        DispatchQueue.main.async { [unowned self] in
            
            txvChatList.text = chatList.joined(separator: "\n")
        }
    }
}

// ... //

@IBAction func btnActSendMessage(_ sender: UIButton) {
    do {
        if let data = (txfMessage.text ?? "" ).data(using: .utf8) {
            try session.send(
                data,
                toPeers: peers,
                with: .reliable)
            txfMessage.text = ""
        }
    } catch {
        print("[Error] \(error)")
    }
}
```

`MCSessionDelegate` 메소드의 `session( ...didReceiveData...fromPeer...)` 부분을 다음과 같이 작성합니다.

```swift
func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
    switch state {
    case MCSessionState.connected:
        print("Connected: \(peerID.displayName)")
        // peer 추가
        peers.append(peerID)
    case MCSessionState.connecting:
        print("Connecting: \(peerID.displayName)")
    case MCSessionState.notConnected:
        print("Not Connected: \(peerID.displayName)")
    @unknown default:
        break
    }
}
```

- 연결이 성공하면 연결 상대 피어를 피어 목록에 추가합니다. 이 목록은 `session.send(...)`에서 사용됩니다.

 

```swift
func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
    let message = String( data: data, encoding: .utf8) ?? ""
    chatList.append("\(peerID.displayName): \(message)")
}
```

- `session.send`를 통해 받은 메시지를 채팅창(`txvChatList`)에 출력합니다.

 

 

<!-- http://www.giphy.com/gifs/AB0Uws0KJyyY6zNqoi -->
![](https://)

 

##### **스트림**

**\[심화\]** 스트림은 `-startStreamWithName:toPeer:`로 생성됩니다.

```
let outputStream = session.startStream(
    withName: name,
    toPeer: peer)

stream.delegate = self
stream.schedule(
    in: .main,
    forMode: .default)
stream.open()
```

 

스트림은 `-session:didReceiveStream:withName:fromPeer:`를 사용하여 `MCSessionDelegate`에 의해 수신됩니다.

```swift
// MARK: - MCSessionDelegate
func session(
    _ session: MCSession,
    didReceive stream: InputStream,
    withName streamName: String,
    fromPeer peerID: MCPeerID
) {
    stream.delegate = self
    stream.schedule(
        in: .main,
        forMode: .default)
    stream.open()
}
```

입력 및 출력 스트림을 모두 사용하려면 먼저 예약하고 열어야 합니다. 완료되면 다른 바인딩된 쌍과 마찬가지로 스트림을 읽고 쓸 수 있습니다.

 

##### **리소스**

리소스는 `session.sendResource(...)`를 통해 전송됩니다.

```
let fileURL = URL(fileURLWithPath: "path/to/resource")
let progress = session.sendResource(
    at: fileURL,
    withName: fileURL.lastPathComponent,
    toPeer: peer,
    withCompletionHandler: { error in
        if let error {
            print("[Error] \(error)")
        }
    })
```

반환된 `NSProgress` 인스턴스(변수 progress)는 전송 상태(진행률)를 조회하거나 전송을 취소하는 데 사용할 수 있는 NSProgress 개체입니다.

 

리소스 수신은

- `session(...didStartReceivingResourceWithName...)`,
- `session(...didFinishReceivingResourceWithName...)`

의 두 메서드에서 발생합니다.

```swift
// MARK: - MCSessionDelegate
func session(
    _ session: MCSession,
    didStartReceivingResourceWithName resourceName: String,
    fromPeer peerID: MCPeerID,
    with progress: Progress
) {
    // 진행률(progress)에 따른 작업
}
```

```swift
func session(
    _ session: MCSession,
    didFinishReceivingResourceWithName resourceName: String,
    fromPeer peerID: MCPeerID,
    at localURL: URL?,
    withError error: Error?
) {
    let destinationURL = URL(fileURLWithPath: "/path/to/destination")
    let error: Error? = nil
    do {
        try FileManager.default.moveItem(
            at: localURL,
            to: destinationURL)
    } catch {
        print("[Error] \(error)")
    }
}
```

- **session(...didStartReceivingResourceWithName...)**
    - `NSProgress` 매개변수를 사용하면 수신 피어가 파일 전송 진행 상황을 모니터링할 수 있습니다.
- **session(...didFinishReceivingResourceWithName...)**
    - `FileManager.default.moveItem(...)`을 통해 임시 파일인 `localURL`을 영구 위치(a permanent location)로 이동시킬 수 있습니다.

 

##### **리소스를 실제 UI에 적용**

_**메시지를 실제 UI에 적용** 섹션으로부터 이어집니다._

채팅 히스토리를 저장 후 피어가 연결되면 그 피어에게 채팅 내용이 저장된 히스토리 파일을 전송하도록 할 수 있습니다. 먼저 host를 특정해야 합니다. 초대하는 사람이 방장(host)이며, 방장만이 이전 채팅 목록을 보낼 수 있도록 해야 합니다.

뷰 컨트롤러의 멤버 변수로 `isHosting`을 추가합니다.

```
/// 내가 방장(host)인지 여부 판별
private var isHosting = false
```

 

누군가를 초대하는 작업을 마친 경우 내가 방장이 되므로 **_'MCBrowser를 선택하는 작업을 마치는 메서드'_**에서 이를 알려줍니다.

```swift
extension ViewController: MCBrowserViewControllerDelegate {
    func browserViewControllerDidFinish(_ browserViewController: MCBrowserViewController) {
        browserViewController.dismiss(animated: true)
        isHosting = true
    }
    
    // ... //
}
```

 

방장으로부터 초대를 받은 경우 나는 방장이 아니므로 _**'초대를 받은 후 작업을 처리하는 메소드'**_에서 이를 알려줍니다.

```swift
extension ViewController: MCNearbyServiceAdvertiserDelegate {
    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        // ... //
        
        present(alertController, animated: true)
        isHosting = false
    }
}
```

 

다음 채팅 목록을 리소스 형태로 전송하는 메서드를 추가합니다. 뷰 컨트롤러 안에 `sendHIstory` 함수를 작성합니다.

```swift
func sendHistory(to peer: MCPeerID) {
    // 1. Create the URL in your temporary directory.
    let tempFile = URL(fileURLWithPath: NSTemporaryDirectory())
        .appendingPathComponent("messages.data")
    guard let historyData = try? JSONEncoder().encode(chatList) else { return }
    
    // 2. Write the chat history to a file at this URL.
    try? historyData.write(to: tempFile)
    
    // 3. Use MCSession to send a resource instead of Data.
    session?.sendResource(
        at: tempFile,
        withName: "Chat_History",
        toPeer: peer
    ) { error in
        if let error = error {
            print(error.localizedDescription)
        }
    }
}
```

1. 채팅 목록(`chatList`)을 데이터로 저장할 임시 파일 위치를 지정합니다.
2. `chatList` 전부 JSON 형태로 내보낸 뒤 임시 파일 저장소 `NSTemporaryDirectory()`에 저장합니다.
3. `Chat_History`라는 이름으로 피어에게 리소스를 전송합니다.

 

`MCSessionDelegate` 부분의 `func session(...didChange...)` 부분에 아래 코드를 추가합니다. 피어와 연결에 성공하였을 때 내가 방장인 경우, 채팅 히스토리를 피어에게 보냅니다.

```swift
func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
    switch state {
    case MCSessionState.connected:
        // peer 추가
        peers.append(peerID)
        
        // 채팅 히스토리 보냄
        if isHosting{ 
            sendHistory(to: peerID)
        }
    case MCSessionState.connecting:
        print("Connecting: \(peerID.displayName)")
    case MCSessionState.notConnected:
        print("Not Connected: \(peerID.displayName)")
    @unknown default:
        break
    }
}
```

 

리소스를 전송받으면 해당 리소스 파일을 다시 채팅 목록(`chatList` 배열)으로 변환해야 합니다. `MCSessionDelegate`의 확장 부분에 있는 `session(...didFinishReceivingResourceWithName...at localURL...)` 메서드에 아래 내용을 추가합니다.

```swift
func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {
    guard let localURL = localURL,
          let data = try? Data(contentsOf: localURL),
          let chatList = try? JSONDecoder().decode([String].self, from: data) else {
        return
    }
    
    DispatchQueue.main.async {
        self.chatList.insert(contentsOf: chatList, at: 0)
    }
}
```

1. `localURL`로부터 `data`를 가져온 뒤, 해당 데이터를 `chatList`로 디코딩합니다.
2. 디코딩된 `chatList`를 `self.chatList` 배열의 맨 첫 부분에 삽입합니다. `chatList` 변수에는 `didSet`이 있기 때문에 배열의 내용이 변경되면 채팅창 내용도 자동으로 업데이트됩니다.

 

빌드 및 실행합니다. 채팅방에 새로운 유저(오른쪽 아이폰 화면)가 입장하면 이전의 대화 내용이 그대로 전달되는 것을 볼 수 있습니다.

<!-- https://giphy.com/gifs/rfsG66neTdo4XGMsXB -->
![](https://)

 

이와 같은 원리로 리소스 전송을 이용해 피어간 사진도 전송할 수 있습니다. 사진 전송에 관한 내용은 추후 별도의 포스트로 다루도록 하겠습니다.

 

##### **전체 코드**

https://gist.github.com/ayaysir/e6c29a756cad1673cc90ce5ff3c67468
