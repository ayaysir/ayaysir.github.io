---
title: "Swift(스위프트): 언어 현지화(로컬라이제이션 Localization) - 다국어 지원 앱 만들기"
date: 2021-12-01
categories: 
  - "DevLog"
  - "Swift"
---

스위프트(Swift)를 사용한 iOS 프로젝트에서 로컬라이징하는 방법입니다.

1. 프로젝트 세팅
2. 스토리보드 로컬라이징
3. 코드 내 텍스트의 로컬라이징
4. 변수값을 사용하는 어순이 바뀌는 언어의 로컬라이징
5. info.plist 로컬라이징

 

### **1\. 프로젝트 세팅**

프로젝트 세팅의 `PROJECT` > `Info` 에서 `Localizations` 아래에 있는 `+` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-29-pm-11.46.27.jpg)

 

여기서는 한국어(`ko`)를 선택하도록 하겠습니다. 여러 언어를 추가할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-29-pm-11.46.39.jpg)

 

기본 언어를 선택할 때, 영어를 기반으로 작업한 다음 기타 언어를 추가하는 방법을 추천합니다. 위의 그림을 보면 `English`가 `Development Language`라고 설정되어 있는데 이것을 한국어로 바꾸려면 귀찮은 작업이 추가됩니다. 애초에 다국어화를 염두해 두고 있다면 영어를 기본 언어로 Base에서 개발을 진행하고, 현지화는 다른 언어들로 하는게 좋을 것 같습니다. ([개발 언어 변경하는 방법](https://stackoverflow.com/questions/25871815/changing-the-development-language-in-xcode) stackoverflow)

 

### **2\. 스토리보드 로컬라이징**

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-29-pm-11.46.52.jpg)

위에서 언어를 선택하면 위와 같은 창이 뜹니다. 여기서 스토리보드 목록이 나오는데 현지화가 필요한 스토리보드를 체크하고 `Finish`를 누릅니다.

 

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-29-pm-11.47.27.jpg)

Main 스토리보드에 펼치기 버튼이 새로 생기며, 하위 메뉴에 `Main(Korean)`이라는 메뉴가 생깁니다. 이것을 클릭합니다.

 

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-29-pm-11.47.43.jpg)

클릭하면 위와 같이 번역 서식을 자동으로 생성해줍니다. 초록색 부분을 참고로 하여 빨간색 라인의 오른쪽 부분을 아래와 같은 방식으로 해당 언어로 번역하면 됩니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-29-pm-11.48.34.jpg)

 

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-01-pm-11.33.29.jpg)

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-30-오전-12.08.56.jpg)

앱을 실행하고 언어를 변경하면 위와 같이 영어와 한국어가 다르게 표기되는것을 볼 수 있습니다.

 

현지화 작업은 앱 개발의 마지막 단계에서 하는 것을 추천합니다. 앱 중간에 추가되거나 변경되는 사항이 있을 경우 스토리보드는 변경 사항을 언어별로 모두 업데이트해야 합니다. ([스토리보드 로컬라이징 파일 업데이트 하는 방법](https://stackoverflow.com/questions/15094259/is-it-possible-to-update-a-localized-storyboards-strings) stackoverflow)

 

### **3\. 코드 내 텍스트의 로컬라이징**

스토리보드 외에 컨트롤러 등의 코드에서 텍스트를 다룰 일이 있습니다.

먼저 아래와 같은 `String`의 `extension`을 추가합니다.

```
extension String {
    
    var localized: String {
        return NSLocalizedString(self, tableName: "Localizable", value: self, comment: "")
    }
    
    func localizedFormat(_ arguments: CVarArg...) -> String {
        let localizedValue = self.localized
        return String(format: localizedValue, arguments: arguments)
    }
}

```

 

`NSLocalizedString` 함수는 키, 원문을 저장하여 언어별 빌드마다 번역된 결과를 제공하는 역할을 합니다.

```
func NSLocalizedString(_ key: String, tableName: String? = nil, bundle: Bundle = Bundle.main, value: String = "", comment: String) -> String
```

- `key` - 번역의 대상이 되는 키를 설정합니다.
- `tableName` - 번역 정보가 담겨져 있는 테이블을 선택합니다. `Localizable`라는 이름의 테이블을 이용할 것입니다.
- `value` - 원문 텍스트입니다. 기본 언어 또는 번역 정보가 없을경우 반환되는 텍스트입니다.
- `comment` - 이 키에 관한 주석을 입력하면 현지화 Export 기능 이용시 정보 파일의 키 위에 주석이 표시됩니다. 여기서는 번역 정보를 Export 기능을 사용하지 않고 수동으로 입력하므로 코멘트란은 비워둡니다.

 

번역 테이블 파일을 생성합니다. 프로젝트에서 새 파일을 생성합니다. `Strings FIle`을 선택합니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-30-오전-1.05.33.jpg)

파일 이름을 `Localizable.strings`로 설정합니다. (대소문자 및 철자 주의)

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-02-오전-12.44.05.png)

 

`Localizable.strings` 파일을 연 뒤 Xcode 창 오른쪽의 `File Inspector`에서 `Localize...` 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-30-오전-1.06.00.jpg)

 

아래와 같은 창이 나오면 `Base` 가 있는 경우 `Base`, 없는 경우 개발 언어인 `English` 를 선택합니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-02-오전-12.46.35.jpg)

File Inspector으로 다시 돌아가서 번역 대상 언어를 선택합니다. `English`는 번역할 필요가 없으므로 체크 해제합니다.

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-11-30-오전-1.07.49.jpg)

 

먼저 코드에서 번역이 필요한 텍스트 옆에 `.localized` 를 추가합니다. 아래는 `.localized` 를 사용하는 예제의 일부입니다.

```
let alertTitle = "Unable to Create".localized

guard selectedDocument != nil else {
    simpleAlert(self, message: "You must select a file to upload.".localized, title: alertTitle) { action in
        self.scrollView.setContentOffset(.zero, animated: true)
    }
    return false
}

guard txfPostTitle.text! != "" else {
    simpleAlert(self, message: "Please enter the title.".localized, title: alertTitle) { action in
        self.txfPostTitle.becomeFirstResponder()
    }
    return false
}
```

 

번역할 텍스트가 정해졌으면, `Localizable.strings` 파일을 열어 아래와 같은 형식으로 작성합니다.

```
"Unable to Create" = "만들 수 없음";

"You must select a file to upload." = "업로드할 파일을 선택해야 합니다.";
"Please enter the title." = "제목을 입력해주세요.";
```

왼쪽은 키(key) , 오른쪽은 번역할 텍스트를 입력합니다. `.localized` 에서 키는 원문과 같으므로 원문을 왼쪽에 추가하고, 오른쪽에 번역을 입력합니다.

각 라인 끝마다 세미콜론(`;`)을 반드시 입력해야 합니다. 세미콜론 누락시 오류가 발생하며 컴파일러에서 위치를 알려주지 않으므로 주의해야 합니다

 

이런식으로 진행하면 코드 내 텍스트도 로컬라이징을 진행할 수 있습니다.

 

### **4\. 변수값을 사용하는 어순이 바뀌는 언어의 로컬라이징**

로컬라이징된 문자열에서 **arguments의 순서가 번역에 따라 달라질 경우**, **포맷 지정자에 인덱스를 추가**하여 순서를 제어할 수 있습니다.

**해결 방법: 인덱스 지정 포맷 사용**

Swift의 String(format:) 스타일을 활용하여 `%1$@`, `%2$d`처럼 **인덱스를 지정**하면, 번역 시 순서를 변경할 수 있습니다.

**만약 번역 시 순서가 바뀌어야 한다면?**

예를 들어, 한국어 번역에서 simpleIntervalNumber를 먼저 표시해야 하는 경우:

```
"info_1_4" = "%2$d는 %1$@로부터 도출되며, 감 10도는 감 3도와 동일한 품질을 가집니다.";
```

이렇게 하면 `simpleIntervalNumber`가 먼저 오고, `formula`가 뒤따르게 됩니다.

**사용 코드**

```
"info_1_4".localizedFormat(formula, simpleIntervalNumber)
```

이 코드에서 formula와 simpleIntervalNumber를 전달하면, **포맷 지정자가 인덱스를 사용하여 올바른 순서로 치환**됩니다.

이 방식으로 번역에 따라 argument 순서를 조정할 수 있습니다.

 

### **5\. info.plist 로컬라이징**

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-02-오전-1.21.56.jpg)

위 그림은 `info.plist` 파일에서 카메라, 사진 라이브러리 사용자 권한을 묻는 메시지를 적는 곳입니다. 여기에 작성된 문구도 당연히 현지화를 해야 합니다.

 

`InfoPlist.strings` 라는 이름의 스트링즈 파일을 작성합니다. (대소문자 및 철자 주의)

 

다음 File Inspector에서 로컬라이징 대상 언어를 추가합니다 (`3.` 번 내용과 같음)

 

스트링즈 파일은 키와 값으로 이루어집니다.

`info.plist` 에서 마우스 오른쪽 버튼 클릭후 `Source Code` 로 열기를 선택합니다. (원래 표 형태로 보고 싶은 경우 `Property List` 선택)

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-02-오전-1.26.13.png)

XML 형태의 프로퍼티 리스트가 표시됩니다.

여기서 key 값을 텍스트를 역추적하여 찾습니다.

```
<key>NSCameraUsageDescription</key>
<string>Camera permission is required to take a user&apos;s profile picture.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Photo Library permission is required to upload a user&apos;s profile picture from the library.</string>
```

여기서 키는 `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription` 두가지가 있으며, 전자는 카메라 권한, 후자는 사진 라이브러리 권한입니다.

 

위의 키를 사용하여 아래와 같이 `InfoPlist.strings` 파일을 작성합니다.

```
NSCameraUsageDescription = "사용자 프로필 사진을 촬영하기 위한 카메라 권한 허용이 필요합니다.";
NSPhotoLibraryUsageDescription = "사용자 프로필 사진을 가져오기 위한 사진 라이브러리 권한 허용이 필요합니다.";
```

컴파일러 에러 방지를 위해 라인 끝마다 세미콜론(`;`)을 반드시 입력해야 합니다.
