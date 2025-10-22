---
title: "Swift(스위프트): 개발 언어(Development Language)를 영어에서 한국어로 변경"
date: 2022-09-13
categories: 
  - "DevLog"
  - "Swift"
---

### **개발 언어(Development Language)를 영어에서 한국어로 변경**

Xcode 프로젝트에서 개발 언어(Development Language)는 기본 현지화를 위한 언어로 사용됩니다. 영어가 기본 설정으로 되어 있습니다. 만약 앱의 스토리보드를 다른 언어로 유지하려면 (예를 들어 한국어로 개발하고 앱 스토어에 한국어 버전으로 출시하고자 하는 경우 등) 이 설정을 변경해야 합니다. 불행히도 Xcode에서 이 설정을 직접 변경할 수 있는 방법은 없습니다.

(개발 언어는 프로젝트 설정 > Info의 Localizations 란에서 볼 수 있습니다.)

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-13-오후-4.08.31.jpg)

 

그러나 텍스트 편집기 등을 사용하여 `.pbxproj` 파일을 직접 편집하여 설정을 변경할 수 있습니다.

 

##### **0: 프로젝트가 열려있다면 종료합니다.**

 

##### **1: Finder를 열어 변경할 프로젝트의 `.xcodeproj` 확장자 파일이 있는 폴더로 이동한 후 프로젝트 파일에서 마우스 오른쪽 클릭 > `패키지 내용 보기`를 클릭합니다.**

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-13-오후-4.00.44.jpg)

 

##### **2: 동일한 창에서 패키지 내용 안의 파일들이 보이는데, `project.pbxproj` 파일을 더블클릭하거나 이 파일을 텍스트 편집기에서 엽니다. Xcode가 깔려있다면 Xcode 에디터가 열립니다.**

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-13-오후-4.01.46.jpg)

 

##### **3: 검색창에서(`command + f`로 열기) `developmentRegion`을 검색한 후, 해당 위치의 `en`을 `ko`로 변경합니다.**

```
developmentRegion = ko;
```

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-13-오후-4.03.02.jpg)

##### **4: 검색창에서 `knownRegion`을 검색한 후, 해당 위치의 `en`을 `ko`로 변경합니다.**

```
knownRegions = (
    ko,
    Base,
);
```

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-13-오후-4.05.03.jpg)

##### **5: 개발 언어의 변경된 내용을 확인합니다.**

![](./assets/img/wp-content/uploads/2022/09/스크린샷-2022-09-13-오후-4.06.25.jpg)
