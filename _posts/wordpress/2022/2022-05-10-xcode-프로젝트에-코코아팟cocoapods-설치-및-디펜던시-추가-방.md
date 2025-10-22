---
title: "Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가 방법"
date: 2022-05-10
categories: 
  - "DevLog"
  - "Swift"
---

#### **Xcode 프로젝트에 코코아팟(CocoaPods) 설치 및 디펜던시 추가**

Xcode를 이용해서 iOS 프로젝트 등을 개발할 때 서드파티 라이브러리를 사용할 일이 많은데, 대다수 라이브러리들이 `CocoaPods`(코코아팟)라는 디펜던시 관리자를 이용해 프로젝트 내에 설치해야 합니다.

 

##### **1\. CocoaPods가 설치되지 않았다면 터미널 실행 후 아래 커맨드를 이용해 설치합니다.**

**인텔(Intel) CPU가 설치된 맥**

```
sudo gem install cocoapods
```

 

**애플 실리콘 (M 시리즈) CPU가 설치된 맥 ([Homebrew](https://brew.sh/index_ko)를 통한 설치가 가능한 환경이어야 함)**

```
brew install cocoapods
```

 

##### **2\. 터미널을 실행한 뒤, Xcode 프로젝트의 루트 폴더로 이동한 다음, CocoaPods 초기화를 진행합니다.**

```
pod init
```

 

참고로 터미널을 통해 루트 폴더로 이동하는 방법은 다음과 같습니다.

\[caption id="attachment\_4458" align="alignnone" width="422"\]![](./assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-10-오후-11.02.16.jpg) 프로젝트 마우스 오른쪽 클릭 후 `[Show in Finder]`\[/caption\] 

 

\[caption id="attachment\_4462" align="alignnone" width="315"\]![](./assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-10-오후-11.24.52.jpg) 프로젝트 폴더 오른쪽 클릭 후 `[정보 가져오기]`\[/caption\] 

 

\[caption id="attachment\_4464" align="alignnone" width="257"\]![](./assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-10-오후-11.26.11.jpg) `[위치]` 에서 마우스 오른쪽 버튼 클릭 후 `[경로 이름으로 복사]`\[/caption\] 

 

\[caption id="attachment\_4463" align="alignnone" width="597"\]![](./assets/img/wp-content/uploads/2022/05/-2022-05-10-오후-11.26.45-e1652193524782.jpg) 터미널 열고 `cd "[붙여넣은 경로]"` 입력\[/caption\] 

 

##### **3\. 초기화가 완료되면, 프로젝트 루트 폴더에 `Podfile`이라는 파일이 생성됩니다. 텍스트 편집기로 해당 파일을 연 뒤, 아래 하이라이트 부분을 추가합니다.**

```
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'ExampleProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for ExampleProject
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
  pod 'Firebase/Database'

  target 'ExampleProjectTests' do
    inherit! :search_paths
    # Pods for testing
  end

  target 'ExampleProjectUITests' do
    # Pods for testing
  end

end
```

- `target 'ExampleProject' do` 밑에 `pod '디펜던시명'` 으로 추가합니다.
- 라인 앞에 `#`를 붙이면 코멘트 처리됩니다.
- 예제는 Firebase 관련 디펜던시들을 추가했습니다.

 

##### **4\. 터미널로 돌아간 뒤, 프로젝트 루트 위치에서 아래 명령을 실행합니다.**

```
pod install
```

 

##### **5\. 설치가 완료되면 프로젝트 루트 폴더에 `[프로젝트명].xcworkspace` 라는 파일이 생성됩니다. 이후 프로젝트의 모든 작업은 이 워크스페이스 파일을 열어 진행해야 합니다.**

![](./assets/img/wp-content/uploads/2022/05/스크린샷-2022-05-10-오후-11.33.46.jpg)
