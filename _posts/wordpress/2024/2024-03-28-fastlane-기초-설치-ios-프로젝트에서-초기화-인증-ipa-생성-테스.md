---
title: "Fastlane 기초: 설치, iOS 프로젝트에서 초기화, 인증, ipa 생성, 테스트플라이트 업로드"
date: 2024-03-28
categories: 
  - "DevLog"
  - "CI/CD"
---

\[rcblock id="5348"\]

 

### **소개**

Xcode의 iOS 프로젝트에서 Fastlane 설정하는 방법입니다.

다음과 같은 과정을 알아보겠습니다.

1. 컴퓨터에 Fastlane 설치
2. iOS 프로젝트에 Fastlane 초기화 및 통합
3. AppStore Connect API로 인증 연결
    1. API 키 생성
    2. Fastfile 설정
    3. 외부 파일에 환경 변수 설정
4. 빌드 번호 증가 및 ipa 생성
5. ipa 파일을 테스트플라이트(TestFlight)로 업로드

 

#### **컴퓨터에 Fastlane 설치**

터미널을 열고 다음을 입력합니다.

Xcode Command Line Tools (미설치인 경우)

```
xcode-select --install
```

 

Homebrew를 통한 설치

```
brew install fastlane
```

- 다른 방법 보기: [https://docs.fastlane.tools/getting-started/ios/setup/](https://docs.fastlane.tools/getting-started/ios/setup/)

 

#### **2\. iOS 프로젝트에 Fastlane 초기화 및 통합**

터미널을 열고 Xcode 프로젝트가 있는 폴더로 이동합니다. 그 다음 아래 명령어를 입력합니다.

```
fastlane init
```

 

\[caption id="attachment\_6944" align="alignnone" width="888"\] ![](/assets/img/wp-content/uploads/2024/03/screenshot-2025-01-24-am-2.07.22-copy.jpg) Screenshot\[/caption\]

초기에 사용 목적을 물어보고 거기에 맞게 대답하면 환경이 자동으로 설정됩니다. 2번 "테스트플라이트에 업로드" 를 선택하는 것을 추천합니다.

또는 나중에 수동으로 `Fastfile`이라는 환경 설정 파일을 수정할 수도 있습니다.

작업이 완료되면 Xcode 프로젝트 내에 `fastlane`이라는 폴더가 생깁니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-2.27.06-copy.jpg)

 

#### **3\. AppStore Connect API로 인증 연결**

Fastlane을 통해 AppStoreConnect에 업로드, 정보 수정 등의 작업을 하려면 Fastlane에 애플 계정에 대한 인증 정보가 있어야 합니다.

API를 이용하는 방식, 애플 2단계 인증 아이디를 이용하는 방식 등 여러가지가 있는데 Fastlane 측에서는 AppStore Connect API를 이용한 방식을 추천합니다.

- [https://docs.fastlane.tools/getting-started/ios/authentication/](https://docs.fastlane.tools/getting-started/ios/authentication/)

이 예제에서는 AppStore Connect API로 인증을 하도록 하겠습니다.

- 앱 스토어 커넥트의 사용자 및 액세스 -> [통합](https://appstoreconnect.apple.com/access/integrations) 탭으로 이동합니다.
- `액세스 요청` 버튼을 누릅니다.
- 정보를 입력하고 `제출` 버튼을 누릅니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-28-am-1.12.47-copy.jpg)

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-28-am-1.12.54-copy.jpg)

 

제출 후 승인되었다면 다음 화면이 뜹니다. `API 키 생성` 버튼을 누릅니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-28-am-1.13.24-copy.jpg)

API 키에는 다음과 같은 정보가 있습니다.

- Issuer ID
- API 키 ID
- 비공개 키가 들어있는 p8 파일

목록 오른쪽 끝의 다운로드 버튼을 클릭해서 p8파일을 내려받습니다. 한 번만 가능하니 다운로드 후 해당 파일을 절대 잃어버리지 않도록 관리합니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-28-am-1.13.48-copy-mosaic.jpg)   ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-28-am-1.14.04-copy.jpg)

 

`AuthKey_키아이디.p8` 이라는 파일이 생성되었습니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-28-am-1.14.24-copy-mosaic.jpg)

 

##### **Fastfile 설정**

실행할 수 있는 각종 명령들이 있는데 해당 명령들을 lane이라고 칭합니다. lane은 fastlane/Fastfile이라는 파일에서 Ruby 언어로 작성합니다.

예를 들어 배포(release)라는 명령을 만들고 실행하고 싶은 경우는 다음과 같이 작성합니다.

```
lane :release do
  # 각종 작업 - 빌드 및 앱스토어에 업로드 등
end
```

 

API 인증과 관련된 정보도 lane 내에서 작성합니다.

- 해당 정보를 입력하면 전역 변수로 설정되어 다른 작업에서도 사용할 수 있습니다.
- 환경 변수를 `.env`라는 파일에 따로 설정할 수 있습니다.

 

이번 예제에서 만들어 볼 lane은 `beta`라는 이름을 가진 명령입니다. `Fastfile`에 다음과 같이 추가합니다.

```
lane :beta do
  app_store_connect_api_key(
    key_id: ENV['API_KEY_ID'],
    issuer_id: ENV['API_ISSUER_ID'],
    key_filepath: ENV['API_KEY_FILEPATH'],
    duration: 1200, # optional (maximum 1200)
    in_house: false # optional but may be required if using match/sigh
  )

  # 작업들...
end
```

- 환경 변수는 `ENV['이름']` 으로 사용할 수 있습니다.

 

그럼 환경 변수는 어떻게 설정하느냐? fastlane 폴더 안에 `.env` 파일을 생성합니다.

- 참고: 터미널에서 `touch .env`를 명령하면 빈 파일을 생성할 수 있습니다.
- .env 파일은 기본적으로 숨김 처리되므로 숨김 해제 후 열 수 있습니다.

 

env 파일을 열고 다음과 같이 작성합니다.

```
APP_IDENTIFIER="com.app.identifier"
API_KEY_ID="앱스토어_커넥트_키_아이디"
API_ISSUER_ID="앱스토어_커넥트_이슈어_아이디"
API_KEY_FILEPATH="p8_키패스_파일경로"
```

- `변수이름="변수내용"` 형식으로 작성합니다.

 

#### **Lane 생성: 빌드 번호를 올리고, IPA 파일을 생성한 뒤 그 파일을 TestFilght에 업로드하는 작업 'beta'**

`Fastfile`을 열고 이전에 작성했던 beta lane에 다음 코드를 추가합니다.

```
lane :beta do
  app_store_connect_api_key(
    key_id: ENV['API_KEY_ID'],
    issuer_id: ENV['API_ISSUER_ID'],
    key_filepath: ENV['API_KEY_FILEPATH'],
    duration: 1200, # optional (maximum 1200)
    in_house: false # optional but may be required if using match/sigh
  )

  get_certificates           # invokes cert
  get_provisioning_profile   # invokes sigh
  increment_build_number(xcodeproj: "./MiracleCircle5.xcodeproj")
  build_app(configuration: "Debug")
  upload_to_testflight(
    skip_waiting_for_build_processing: true
  )
end
```

- **get\_certificates, get\_provisioning\_profile:** 개발자 계정에서 인증서 및 프로파일을 내려받습니다.
- **increment\_build\_number:** 프로젝트의 빌드 넘버를 1 올립니다.
- **build\_app:** `"Debug"`설정으로 앱을 빌드합니다. 앱을 빌드하면 프로젝트 폴더에 `*.ipa` 파일이 생깁니다.
- **upload\_to\_testflight:** 빌드된 `ipa` 파일을 테스트플라이트에 업로드합니다.

 

Fastfile을 저장한 뒤 프로젝트 폴더 경로로 터미널을 열고 다음 명령을 입력합니다.

```
fastlane beta
```

- `beta`라는 이름의 `lane`을 실행합니다.

 

위의 명령을 실행하면 사전 대응 여부에 따라 바로 성공할 수도 있고 실패할 수도 있습니다. 일단 성공한 경우 아래와 같이 메시지가 뜹니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-1.51.12-copy.jpg)

앱스토어커넥트의 TestFlight 메뉴에 들어가 ipa 파일이 업로드 되었는지도 확인합니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-1.55.40-copy.jpg)

그러나 한 번에 바로 성공하면 운이 좋은 경우이며, 실패 메시지가 뜨는 경우가 더 많을 것이라 확신합니다. 실패에 대한 대응책은 다음 섹션에서 설명합니다.

 

#### **실행 중 발생 가능한 문제점 및 해결 방법**

##### **프로파일을 찾을 수 없는 에러**

```
error: exportArchive: No profiles for 'com.bgsmm.MiracleCircle5' were found
```

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-1.35.20-mosaiced.jpg)

- 아래 명령이 lane 안에 잘 들어갔는지 확인합니다.
    - `get_certificates` # invokes cert
    - `get_provisioning_profile` # invokes sigh
- 그럼에도 위 에러가 발생하는 경우 해당 앱 번들 아이디에 대한 프로파일을 수동으로 생성해야 합니다.
    -  [애플 개발자 계정 페이지](https://developer.apple.com/account/resources/profiles/list)에서 `+` 버튼을 눌러 새로운 프로파일을 수동으로 생성합니다.

 

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-1.35.36-copy.jpg)

 

##### **앱 스토어 커넥트에 해당 앱 페이지를 개설하지 않은 경우**

```
[01:43:18]: Couldn't find app 'com.example.App' on the account of '' on App Store Connect
```

앱 스토어에 업로드하고자 하는 프로젝트에 관한 페이지 자체를 개설하지 않은 경우 업로드할 타깃 자체가 없기 때문에 에러가 발생합니다.

앱스토어커넥트 페이지에 접속해서 `앱` 탭 -> `+` 버튼을 눌러 앱을 추가합니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-2.51.07-copy.jpg)

 

 

##### **프로젝트에서 앱 아이콘이 설정되어 있지 않음**

```
[Application Loader Error Output]: ERROR: [ContentDelivery.Uploader] Asset validation failed (90713) Missing Info plist value. A value for the Info.plist key 'CFBundleIconName' is missing in the bundle 'com.example.AppProject'.
```

앱스토어 정책상 문제로 테스트플라이트에서는 앱 아이콘이 설정되어 있지 않으면 빌드 파일을 업로드할 수 없습니다.

Xcode 프로젝트를 열고 앱 아이콘 이미지 파일을 `Assets`에 추가합니다.

- 내부 테스트용이기 때문에 아무 이미지를 업로드해도 상관없습니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-29-am-1.49.17-copy.jpg)
