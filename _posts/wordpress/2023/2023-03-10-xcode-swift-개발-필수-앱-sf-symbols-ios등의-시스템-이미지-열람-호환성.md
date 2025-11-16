---
title: "Xcode Swift 개발 필수 앱: SF Symbols (iOS등의 시스템 이미지 열람, 호환성 확인)"
date: 2023-03-10
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

iOS 등 애플 앱 개발 시 사용되는 시스템 이미지, 기호 등을 편리하게 조회할 수 있는 프로그램입니다. 특히 버전간 호환 문제를 확인하기 위해서 필수로 사용해야 합니다.

 

## **SF Symbols?**

> 4,400개가 넘는 기호가 포함된 SF Symbols는 Apple 플랫폼용 시스템 글꼴인 San Francisco와 원활하게 통합되도록 설계된 아이콘 라이브러리입니다. 기호는 9가지 가중치와 3가지 척도로 제공되며 텍스트 레이블과 자동으로 정렬됩니다. 벡터 그래픽 편집 도구를 사용하여 내보내고 편집하여 디자인 특성 및 접근성 기능을 공유하는 사용자 지정 기호를 만들 수 있습니다. SF Symbols 4는 1000개 이상의 새로운 기호, 가변 색상, 자동 렌더링 및 새로운 통합 레이어 주석을 제공합니다.

 

## **설치하기**

아래 링크로 이동하여 다운로드 및 실행 후 아이콘을 더블 클릭하여 설치합니다.

- [https://developer.apple.com/sf-symbols/](https://developer.apple.com/sf-symbols/)

 <!-- ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.31.00-copy.jpg) -->

 

## **SF Symbol 앱 사용법**

 ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.19.25.jpeg)

- **카테고리**
    - 카테고리별로 찾아볼 수 있습니다.
- **아이콘 창**
    - 원하는 아이콘을 클릭하면 정보가 나옵니다.
- **이름**
    - 시스템상의 이름으로, 스토리보드 또는 Swift 코드 내에서 해당 이름으로 아이콘을 불러올 수 있습니다.
    - 예) `UIImage(systemName: "square.and.arrow.up")`
- **사용 가능한 버전**
    - 아이콘이 사용 가능한 버전을 볼 수 있습니다.
    - 버전이 타깃 OS보다 높으면 컴파일 시 경고가 발생하며, 아이콘이 보이지 않습니다.
    - 최신 버전의 아이콘을 이전 버전의 OS에서도 보이게 하는 방법은 아래를 참고하세요.
- **검색**
    - 아이콘 이름(영문)으로 찾고자 하는 그림을 검색할 수 있습니다.

 

## **최신 버전의 시스템 이미지를 이전 버전의 OS에서 사용하는 방법**

다음과 같은 상황이 있다고 가정합니다.

- 앱의 최소 배포 버전(Minimum Deployments)를 `13.0`으로 설정합니다. 이 설정의 의미는 iOS 13이 설치된 기기에서 앱을 사용 가능하도록 제작한다는 의미입니다.  
![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.31.00-copy.jpg)
- 여기에 최신 버전인 iOS 16에서 추가된 시스템 이미지 `backpack.circle`을 추가합니다.
- 버전 16 이하의 OS에서는 해당 이미지를 읽어올 수 없으므로 경고가 발생합니다.  
![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.31.44-copy.jpg)

 

이 문제를 해결하는 방법은 SF Symbol의 기호 `내보내기 기능`을 사용하는 것입니다.

### **1: 파일 메뉴의 기호 내보내기... 메뉴를 클릭한 뒤, 원하는 위치에 svg 파일 형태로 내보냅니다.**

 ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.30.08-copy.jpg)

 

### **2: 저장된 svg 파일을 `assets`로 드래그 앤 드롭하여 추가합니다.**

 ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.33.07-copy.jpg)

 

### **3: 다시 빌드한 뒤 경고가 사라지는지 확인합니다. 아까 있었던 경고가 사라진 모습을 볼 수 있습니다.**

 ![](/assets/img/wp-content/uploads/2023/03/screenshot-2023-03-11-am-1.33.45-copy.jpg)

출처: [https://yurimac.tistory.com/66](https://yurimac.tistory.com/66)
