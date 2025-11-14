---
title: "맥(macOS) 파인더에서 해당 경로로 터미널 바로 열기 - OpenInTerminal-Lite"
date: 2023-06-04
categories: 
  - "DevLog"
  - "etc"
  - "정보글"
---

### **소개**

 ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.16.57-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.17.11-copy.jpg)

[OpenInTerminal-Lite](https://github.com/Ji4n1ng/OpenInTerminal/blob/master/Resources/README-Lite.md)는 파인더(Finder)의 특정 폴더에서 버튼 하나만 누르면 해당 경로가 위치한 터미널을 바로 실행하는 유틸리티입니다.

 

#### **설치 방법**

1. **Homebrew를 통한 설치** 터미널에 아래 명령어를 입력합니다. (Homebrew 설치 기능이 활성화되어 있어야 합니다.)
    
    ```
    brew install --cask openinterminal-lite
    ```
    
2. **수동 설치**
    1. 공식 깃허브 저장소에서 [최신 릴리즈](https://github.com/Ji4n1ng/OpenInTerminal/releases)를 찾습니다.
    2. OpenInTerminal`**-Lite**` 라고 써져 있는 릴리즈를 찾습니다. (일반 버전과 라이트 버전의 기능이 다릅니다.)
    3. `OpenInTerminal-Lite.app.zip` 파일을 다운로드합니다.
    4. 압축을 푼 뒤 `OpenInTerminal-Lite.app` 파일을 `응용 프로그램` 폴더로 이동합니다.

##### **설치 후 공통 작업**

1) `Finder`에서 응용 프로그램으로 이동한 뒤 `OpenInTerminal-Lite` 앱을 엽니다.

 ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.04.58-copy.jpg)

아래 경고창이 뜨면 `[열기]`를 클릭합니다.

 ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.05.07-copy.jpg)

기본이 될 터미널 프로그램을 선택하라는 창이 뜨면 `Terminal`을 클릭합니다.

(프로그램은 나중에 변경 가능하며 해당 방법은 하단의 **_고급 설정 방법_** 섹션 참고)

 ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.05.16-copy.jpg)

다시 `OpenInTerminal-Lite` 앱 아이콘을 클릭한 뒤 키보드의 `command`를 누른 상태에서 파인더 상단의 툴바로 드래그하면 아이콘을 위치시킬 수 있는 사각형 영역이 나타납니다.

원하는 위치에 드래그해서 아이콘을 추가합니다.

 ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.06.12-copy.jpg)

#### **사용 방법**

이후 각 폴더마다 해당 아이콘을 누르면 해당 폴더 경로로 이동한 터미널이 실행됩니다.

 ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.16.57-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/06/screenshot-2023-06-04-pm-3.17.11-copy.jpg)

 

#### **고급 설정 방법**

- [매뉴얼 바로가기 (영어)](https://github.com/Ji4n1ng/OpenInTerminal/blob/master/Resources/README-Lite.md#settings-)
