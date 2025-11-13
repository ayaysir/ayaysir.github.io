---
title: "Xcode: 아이콘 이미지를 Xcode 애플리케이션(앱) 아이콘으로 변환 (appicon.co 이용)"
date: 2020-12-29
categories: 
  - "DevLog"
  - "Swift"
---

[App Icon Generator](https://appicon.co/)

위 사이트에서 하나의 이미지 파일을 애플 아이콘으로 자동으로 변환해줍니다.

먼저 이미지 파일은 가로 세로 각각 1024px 이상이어야 합니다. 애플 앱에서 사용하는 아이콘 중 가장 큰 사이즈가 1024px이기 때문입니다.

 

##### **1) 그래픽 소프트웨어를 이용해 아이콘 이미지를 만들어 1024px \* 1024px로 저장합니다.**

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-29-pm-8.55.26.png)

##### **2) [App Icon Generator](https://appicon.co/) 사이트에 접속한 다음 이미지를 업로드합니다.**

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-29-pm-8.56.49.png)

 

##### **3) Generate 버튼을 이용해 zip 파일을 다운로드하고 압축을 풉니다. `AppIcon.appiconset` 폴더를 복사합니다.**

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-29-pm-8.59.45.png)

 

##### **4) Xcode 앱 프로젝트에서 `Assets.xcassets` 폴더를 마우스 오른쪽으로 클릭한 뒤 `[Show in Finder]` 메뉴를 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-29-pm-9.00.44.png)

 

##### **5) 그러면 프로젝트 폴더가 나타나는데 다운로드 폴더에 있는 `AppIcon.appiconset` 폴더를 프로젝트의 폴더로 옮깁니다.**

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-29-pm-9.03.40.png)

 

##### **6) Xcode 프로젝트에서 asset 목록을 확인하면 아이콘들이 모두 등록되어 있는 것을 볼 수 있습니다.**

 ![](/assets/img/wp-content/uploads/2020/12/screenshot-2020-12-29-pm-9.06.54.jpg)
