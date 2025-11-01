---
title: "Xcode iOS 프로젝트: PrivacyInfo.xcprivacy 작성 방법 + API 목록 및 허용된 사유 번역"
date: 2024-04-17
categories: 
  - "DevLog"
  - "Xcode/iOS기타"
---

#### **소개**

> 2024년 봄부터 App Store Connect에 새로운 앱 또는 앱 업데이트를 업로드하려면 앱의 개인정보 보호 목록에 앱이 API를 사용하는 방식을 정확하게 반영하는 승인된 사유를 포함하고 있어야 합니다.
> 
> 이는 사용자의 개인 정보 보호를 강화하기 위한 조치로, 앱이 명시한 이유에 딱 맞게 API를 사용하도록 합니다. 만약 필요한 사유가 아직 목록에 없는 경우, 개발자는 Apple에 해당 사용 사례를 알려야 합니다.
> 
> [이제 허용된 사유를 명시해야 하는 API 목록을 사용할 수 있습니다.](https://developer.apple.com/kr/news/?id=z6fu1dcu)

 

#### **해야할 일**

- 앱 개발자
    - 타사 SDK 개발자에게 SDK 개인정보 보호 매니페스트를 요청해야 합니다.
    - 앱을 제출하기전 Xcode의 privacy report를 참고합니다.
- SDK 개발자
    - 서명 및 매니페스트를 채택해야 합니다.
- 모든 개발자
    - 앱 또는 SDK의 개인정보 매니페스트에서 추적 도메인 및 필수 API 사용 이유를 문서화하고 선언해야 합니다.

 

#### **PrivacyInfo.xcprivacy 파일을 통해서 관리**

앱 개발자는 PrivacyInfo.xcprivacy를 통해 API 사용 이유를 작성해야 합니다. 해당 방법에 대해 소개합니다.

 

##### **1: 프로젝트에서 새 파일을 생성합니다.**

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-17-오후-11.42.59.jpg)

 

#### **2: App Privacy 파일을 찾은 뒤 생성합니다.**

- 이름은 기본값인 `PrivacyInfo.xcprivacy` 그대로 생성합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-17-오후-11.43.17.jpg)

 

##### **3\. Privacy Accessed API Types 를 추가합니다.**

- Info.plist와 비슷한 프로퍼티 편집기가 나타납니다.
- `Array` 타입의 Privacy Accessed API Types (`NSPrivacyAccessedAPITypes`)를 추가합니다. Item 0번에 Privacy Accessed API Type (`NSPrivacyAccessedAPIType`)을 추가한 뒤, 사용하고자 하는 API를 추가합니다.
- 여기서는 가장 많이 사용되는 User Defaults를 추가합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-17-오후-11.44.14.jpg)

 

##### **4: Privacy Accessed API Reasons (이유) 추가하기**

- 아래 스크린샷을 참조해 Privacy Accessed API Reasons (`NSPrivacyAccessedAPICategoryUserDefaults`)를 추가합니다.
- 이유 목록은 별도의 문서에 나열되어 있으며, 이 포스트 아래 섹션에 번역본이 있습니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-17-오후-11.44.54.jpg)

I

 

`PrivacyInfo.xcprivacy` 의 XML 버전은 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-17-오후-11.45.13.jpg)

 

### **API 목록 및 허용된 사유 보기 (번역)**

필수 사유 API 사용 설명 - 해당 API의 사용이 정책과 일치하는지 확인하세요.

- 원문: [Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

 

#### **개요**

귀하의 앱이나 타사 SDK가 사용하는 일부 API는 기기 신호에 접근하여 기기나 사용자를 식별하려는 잠재적인 가능성이 있습니다. 이를 핑거프린팅(fingerprinting)이라고도 합니다. 사용자가 앱 추적에 대한 권한을 부여한 여부에 상관없이, 핑거프린팅은 허용되지 않습니다. 귀하의 앱 또는 타사 SDK가 iOS, iPadOS, tvOS, visionOS 또는 watchOS에서 이러한 API를 사용하는 이유를 설명하고, 해당 API를 예상된 목적으로만 사용하는지 확인하세요.

 

> **중요**
> 
> 개인정보 보호 매니페스트 파일에 이유를 설명하지 않고 필수 이유 API를 사용하는 앱을 App Store Connect에 업로드하는 경우, Apple은 앱의 개인정보 매니페스트에 이유를 추가하라고 알리는 이메일을 사용자에게 보냅니다. 2024년 5월 1일부터 개인 정보 매니페스트 파일에 필수 이유 API 사용을 설명하지 않는 앱은 App Store Connect에서 허용되지 않습니다.

 

앱 또는 타사 SDK가 사용하는 필수 이유 API의 각 카테고리에 대해 앱에서 API 카테고리를 사용하는 이유를 보고하는 앱 또는 타사 SDK의 개인정보 보호 매니페스트 파일의 `NSPrivacyAccessedAPITypes` 배열에 사전(dictionary)을 추가하세요. 앱 코드에서 API를 사용하는 경우 앱의 개인정보 보호 매니페스트 파일에서 API를 보고해야 합니다. 타사 SDK 코드에서 API를 사용하는 경우 타사 SDK의 개인정보 보호 매니페스트 파일에서 API를 보고해야 합니다. 제3자 SDK는 제3자 SDK를 연결하는 앱의 개인정보 매니페스트 파일이나 앱이 연결하는 다른 제3자 SDK의 개인정보 매니페스트 파일을 사용하여 제3자 SDK의 필수 이유 API 사용을 보고할 수 없습니다.

필수 이유 API를 사용하는 앱의 각 실행 파일 또는 동적 라이브러리에 대해 실행 파일 또는 동적 라이브러리를 포함하는 번들은 API를 보고하는 개인정보 보호 매니페스트 파일을 포함해야 합니다. 프레임워크 및 동적 라이브러리의 예상 위치는 [번들에 콘텐츠 배치](https://developer.apple.com/documentation/bundleresources/placing_content_in_a_bundle)를 참조하세요.

 

> **중요**
> 
> 귀하의 앱 또는 제3자 SDK는 이러한 각 API 사용과 해당 API 사용에서 파생된 데이터를 정확하게 반영하는 하나 이상의 승인된 이유를 선언해야 합니다. 귀하는 선언된 이유로만 이러한 API와 그 사용에서 파생된 데이터를 사용할 수 있습니다. 이렇게 선언된 이유는 사용자에게 표시되는 앱 기능과 일치해야 하며 추적을 위해 API 또는 파생 데이터를 사용할 수 없습니다.

 

`NSPrivacyAccessedAPITypes` 배열의 각 사전에는 다음 키와 값이 포함되어야 합니다.

- **NSPrivacyAccessedAPIType**
    - 앱이 사용하는 필수 이유 API의 카테고리를 식별하는 문자열입니다. 제공하는 값은 아래 섹션에 나열된 값 중 하나여야 합니다.
- **NSPrivacyAccessedAPITypeReasons**
    - 앱이 API를 사용하는 이유를 식별하는 문자열 배열입니다. 제공하는 값은 아래 섹션에서 액세스한 API 유형과 연결된 값이어야 합니다.

필수 사유 API의 카테고리, 각 카테고리에 어떤 API가 있는지, 개인정보 보호 매니페스트에 포함할 수 있는 이유는 아래 섹션에 설명되어 있습니다.

 

> **노트**
> 
> Apple은 필수 이유 API 목록과 사용 이유를 지속적으로 검토하고 있으며 이 문서를 수시로 업데이트할 예정입니다. 앱이 앱 사용자에게 혜택을 제공하기 위해 필수 사유 API를 사용하는 경우, 여기에 [나열되지 않은 사유로 인해 새로운 승인 사유에 대한 요청을 제출](https://developer.apple.com/contact/request/privacy-manifest-reason/)하세요.

 

개인정보 매니페스트 파일 생성에 대한 자세한 내용은 [개인정보 매니페스트 생성](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files#4284009)을 참조하세요.

 

#### **파일 타임스탬프 API (File timestamp APIs)**

- `NSPrivacyAccessedAPICategoryFileTimestamp`

파일 타임스탬프에 액세스하기 위한 다음 API에는 사용 이유가 필요합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-18-오전-12.12.53.jpg)

`NSPrivacyAccessedAPITypeReasons` 배열에서 이 목록의 관련 값을 제공하세요.

 

##### **DDA9.1**

장치를 사용하는 사람에게 파일 타임스탬프를 표시하려면 이 이유를 선언하세요. 이러한 이유로 액세스된 정보 또는 파생된 정보는 장치 외부로 전송될 수 없습니다.

 

##### **C617.1**

앱 컨테이너, 앱 그룹 컨테이너 또는 앱의 CloudKit 컨테이너 내부 파일의 타임스탬프, 크기 또는 기타 메타데이터에 액세스하려면 이 이유를 선언하세요.

 

##### **3B52.1**

문서 선택기 보기 컨트롤러(document picker view controller)를 사용하는 등 사용자가 특별히 액세스 권한을 부여한 파일이나 디렉터리의 타임스탬프, 크기 또는 기타 메타데이터에 액세스하려면 이 이유를 선언하세요.

 

##### **0A2A.1**

타사 SDK가 앱에서 사용할 파일 타임스탬프 API에 대한 래퍼 함수를 제공하고 앱이 래퍼 함수를 호출할 때만 파일 타임스탬프 API에 액세스하는 경우 이 이유를 선언하세요. 이 이유는 타사 SDK에서만 선언할 수 있습니다. 필수 이유 API를 래핑하기 위해 타사 SDK가 주로 생성된 경우 이 이유가 선언되지 않을 수 있습니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 타사 SDK의 자체 목적으로 사용되거나 타사 SDK에 의해 장치 외부로 전송될 수 없습니다.

 

#### **시스템 부팅 시간 API (System boot time APIs)**

- `NSPrivacyAccessedAPICategorySystemBootTime`

시스템 부팅 시간에 액세스하기 위한 다음 API에는 사용 이유가 필요합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-18-오전-12.34.42.jpg)

`NSPrivacyAccessedAPITypeReasons` 배열에 아래 목록의 관련 값을 제공하세요.

 

##### **35F9.1**

앱 내에서 발생한 이벤트 사이에 경과된 시간을 측정하거나 타이머 활성화 계산을 수행하기 위해 시스템 부팅 시간에 액세스하기 위해 이 이유를 선언합니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 장치 외부로 전송될 수 없습니다. 앱 내에서 발생한 이벤트 사이에 경과된 시간에 대한 정보는 예외가 있으며, 이 정보는 기기 외부로 전송될 수 있습니다.

 

##### **8FFB.1**

UIKit 또는 AVFAudio 프레임워크와 관련된 이벤트와 같이 앱 내에서 발생한 이벤트에 대한 절대 타임스탬프를 계산하기 위해 시스템 부팅 시간에 액세스하려면 이 이유를 선언하세요. 앱 내에서 발생한 이벤트의 절대 타임스탬프가 기기 외부로 전송될 수 있습니다. 이러한 이유로 액세스된 시스템 부팅 시간이나 시스템 부팅 시간에서 파생된 기타 정보는 장치 외부로 전송되지 않을 수 있습니다.

 

##### **3D61.1**

장치를 사용하는 사람이 제출하기로 선택한 선택적 버그 보고서에 시스템 부팅 시간 정보를 포함하려면 이 이유를 선언하세요. 시스템 부팅 시간 정보는 보고서의 일부로 사람에게 눈에 띄게 표시되어야 합니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 사용자가 시스템 부팅 시간 정보를 포함하여 특정 버그 보고서를 제출하기로 확실히 선택한 후에만 버그 보고서를 조사하거나 응답할 목적으로만 외부 장치로 전송될 수 있습니다.

 

#### **디스크 공간 API (Disk space APIs)**

- `NSPrivacyAccessedAPICategoryDiskSpace`

사용 가능한 디스크 공간에 접근하기 위한 다음 API에는 사용 이유가 필요합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-18-오전-12.17.12.jpg)

`NSPrivacyAccessedAPITypeReasons` 배열에 아래 목록의 관련 값을 제공하세요.

 

##### **85F4.1**

디바이스를 사용하는 사람에게 디스크 공간 정보를 표시하기 위해 이 이유를 선언합니다. 디스크 공간은 정보 단위(예: 바이트) 또는 미디어 유형과 결합된 시간 단위(예: HD 비디오 분)로 표시될 수 있습니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 장치 외부로 전송될 수 없습니다. 해당 장치에 디스크 공간 정보를 표시할 목적으로만 앱이 동일한 사람이 운영하는 다른 장치에 로컬 네트워크를 통해 디스크 공간 정보를 보낼 수 있도록 허용하는 예외가 있습니다. 이 예외는 사용자가 디스크 공간 정보를 보낼 수 있는 명시적인 권한을 제공한 경우에만 적용되며 해당 정보는 인터넷을 통해 전송될 수 없습니다.

 

##### **E174.1**

파일을 쓸 수 있는 디스크 공간이 충분한지 확인하거나, 디스크 공간이 부족할 때 앱이 파일을 삭제할 수 있도록 디스크 공간이 부족한지 확인하기 위해 이 이유를 선언합니다. 앱은 사용자가 관찰할 수 있는 방식으로 디스크 공간에 따라 다르게 작동해야 합니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 장치 외부로 전송될 수 없습니다. 디스크 공간이 부족할 때 앱이 서버에서 파일을 다운로드하지 못하도록 하는 예외가 있습니다.

 

##### **7D9E.1**

장치를 사용하는 사람이 제출하기로 선택한 선택적 버그 보고서에 디스크 공간 정보를 포함하려면 이 이유를 선언하세요. 디스크 공간 정보는 보고서의 일부로 사람에게 눈에 띄게 표시되어야 합니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 사용자가 디스크 공간 정보를 포함하여 특정 버그 보고서를 제출하기로 확실히 선택한 후에만 버그 보고서를 조사하거나 응답할 목적으로만 장치 외부로 전송될 수 있습니다.

 

##### **B728.1**

앱이 건강 연구 앱이고 이 API 카테고리에 액세스하여 연구 데이터 수집에 영향을 미치는 디스크 공간 부족에 대해 연구 참여자에게 감지하고 알리는 경우 이 이유를 선언하세요. 귀하의 앱은 [App Store 심사 지침 §5.1.3](https://developer.apple.com/app-store/review/guidelines/#health-and-health-research)을 준수해야 합니다. 귀하의 앱은 사람들이 건강 연구에 참여하도록 허용하고 정보를 제공하는 것 이외의 기능을 제공해서는 안 됩니다.

 

#### **활성 키보드 API (Active keyboard APIs)**

- `NSPrivacyAccessedAPICategoryActiveKeyboards`

활성 키보드 목록에 액세스하기 위한 다음 API에는 사용 이유가 필요합니다.

 ![](/assets/img/wp-content/uploads/2024/04/스크린샷-2024-04-18-오전-12.18.53.jpg)

`NSPrivacyAccessedAPITypeReasons` 배열에 아래 목록의 관련 값을 제공하세요.

 

##### **3EC4.1**

앱이 맞춤 키보드 앱이고 이 API 카테고리에 액세스하여 기기에서 활성화된 키보드를 확인하는 경우 이 이유를 선언하세요. 사용자에게 시스템 전반에 걸친 사용자 정의 키보드를 제공하는 것이 앱의 기본 기능이어야 합니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 장치 외부로 전송될 수 없습니다.

 

##### **54BD.1**

장치를 사용하는 사람에게 올바른 사용자 정의 사용자 인터페이스를 제공하기 위해 활성 키보드 정보에 액세스하는 이유를 선언합니다. 앱에는 텍스트를 입력하거나 편집하기 위한 텍스트 필드가 있어야 하며 사용자가 관찰할 수 있는 방식으로 활성 키보드에 따라 다르게 작동해야 합니다. 이러한 이유로 액세스된 정보 또는 파생된 정보는 장치 외부로 전송될 수 없습니다.

 

 

##### **유저 디폴트 API (User defaults APIs)**

- `NSPrivacyAccessedAPICategoryUserDefaults`

User Defaults에 액세스하기 위한 다음 API에는 사용 이유가 필요합니다.

- [UserDefaults](https://developer.apple.com/documentation/foundation/userdefaults)

`NSPrivacyAccessedAPITypeReasons` 배열에 아래 목록의 관련 값을 제공하세요.

 

##### **CA92.1 (Access info from same App Group)**

사용자가 기본적으로 앱 자체에만 액세스할 수 있는 정보를 읽고 쓰도록 액세스하기 위해 이 이유를 선언합니다. 이러한 이유로 인해 다른 앱이나 시스템에서 작성된 정보를 읽거나 다른 앱에서 접근할 수 있는 정보를 쓰는 것이 허용되지 않습니다.

##### **1C8F.1 (Access managed app configuration)**

사용자가 기본적으로 앱 자체와 동일한 앱 그룹(App Group)에 속한 앱, 앱 확장 프로그램, 앱 클립(App Clips)에만 액세스할 수 있는 정보를 읽고 쓰도록 액세스하는 이유를 선언합니다. 이러한 이유로 인해 동일한 앱 그룹 외부의 앱, 앱 확장 프로그램, 앱 클립 또는 시스템에 의해 작성된 정보를 읽는 것이 허용되지 않습니다. 앱이 앱 그룹의 앱, 앱 확장 또는 앱 클립이 작성하는 정보를 읽으려고 시도하는 동안 요청한 도메인에 키가 없기 때문에 시스템이 전역 도메인의 정보를 제공하는 경우 앱은 책임을 지지 않습니다. 이러한 이유로 인해 동일한 앱 그룹 외부의 앱, 앱 확장 프로그램 또는 앱 클립에서 액세스할 수 있는 정보 쓰기도 허용되지 않습니다.

 

##### **C56D.1 (3rd-party SDK wrapper on-device)**

타사 SDK가 앱에서 사용할 사용자 기본 API에 대한 래퍼 함수를 제공하고 앱이 래퍼 함수를 호출할 때만 사용자 기본 API에 액세스하는 경우 이 이유를 선언하세요. 이 이유는 타사 SDK에서만 선언할 수 있습니다. 필수 이유 API를 래핑하기 위해 타사 SDK가 주로 생성된 경우 이 이유가 선언되지 않을 수 있습니다.

이러한 이유로 액세스된 정보 또는 파생된 정보는 타사 SDK의 자체 목적으로 사용되거나 타사 SDK에 의해 장치 외부로 전송될 수 없습니다.

 

##### **AC6B.1 (Access info from same app)**

사용자 기본값에 액세스하여 com.apple.configuration.managed 키를 읽어 MDM에서 설정된 관리 앱 구성을 검색하거나 com.apple.feedback.managed 키를 설정하여 MDM을 통해 쿼리할 피드백 정보를 저장하도록 이 이유를 선언합니다. Apple 모바일 장치 관리 프로토콜 참조 (Apple Mobile Device Management Protocol Reference) 문서에 설명된 대로입니다.
