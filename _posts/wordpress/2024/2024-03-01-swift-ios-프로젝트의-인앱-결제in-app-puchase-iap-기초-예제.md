---
published: false
title: "Swift: iOS 프로젝트의 인앱 결제(In App Purchase; IAP) 기초 예제"
date: 2024-03-01
categories: 
  - "DevLog"
  - "Swift"
---

## **사전 작업**

- 애플 개발자 계정(유료)가 필요하며, 수익 창출이 허가가 되어야 합니다.
- 수익 창출 후 [App Store Connect](https://appstoreconnect.apple.com/)에서 인앱결제 제품을 등록해야 합니다.
- 개인 개발자가 수익 창출이 되려면 은행 계좌 등록, 개인사업자등록 등의 절차를 진행해야 하며 해당 방법 및 제품 등록 방법은 타 블로그 포스트로 대체합니다.
    - [\[Xcode/iOS\] Swift 앱스토어(AppStore) 인앱결제(In-App Purchase)를 위한 유료 앱 설정](https://s-o-h-a.tistory.com/36)

 

## **사용 방법**

- `IAPHelper.swift` 파일은 인앱 결제에 필요한 각종 클래스 및 메서드 등이 들어있습니다. 복사해서 그대로 프로젝트에 추가합니다.
    - `InAppProducts` 구조체의 `productIDs`에 등록된 제품 ID들을 추가합니다.
- `ExampleViewController.swift`는 `IAPHelper.swift`를 뷰 컨트롤러 등에서 어떻게 사용해야 되는지에 대한 예시 파일로 프레임워크 및 컨트롤러의 상황에 맞게 변경합니다.

 

<!-- https://gist.github.com/ayaysir/a9229b2ccf982726d3654a2503cfcdcd -->
{% gist "a9229b2ccf982726d3654a2503cfcdcd" %}