---
title: "Xcode 에서 Info.plist 파일이 없을 때"
author: ayaysir
date: 2025-10-25 13:12:00 +0900
categories: 
  - "DevLog"
  - "Xcode/iOS기타"
tags: [Swift]
---

# Xcode 에서 Info.plist 파일이 없을 때

Xcode 13부터 새로운 프로젝트에는 **Info.plist** 파일이 기본적으로 생성되지 않습니다. 대신 프로젝트 네비게이터에서 Target > Info 탭을 통해 설정할 수 있습니다. 
Info.plist 파일이 사라진 것이 아니라 빌드 파일로 통합되었기 때문이며, 필요한 경우 새 Info.plist 파일을 생성하거나 기존 프로젝트에서 파일의 위치를 찾아서 확인할 수 있습니다. 

## Info.plist를 수정하는 방법
1. 프로젝트 네비게이터에서 타겟 선택: 왼쪽 프로젝트 네비게이터에서 프로젝트 최상위 항목을 선택합니다.
2. `Info` 탭 클릭: 우측의 설정 창에서 `Info` 탭을 클릭합니다.
3. 설정 추가: `Custom iOS Target Properties` 섹션에서 `+` 버튼을 눌러 원하는 키-값 쌍을 추가할 수 있습니다.

![프로젝트 내비게이터에서 선택](/assets/img/DevLog/swift-projectnavi-1.jpg)

## Info.plist 파일을 새롭게 생성하는 방법
1. 새 파일 추가: Xcode 메뉴에서 `File > New > File...`을 선택합니다.
2. Property List 선택: iOS 또는 macOS 탭에서 `Property List`를 선택하고 `Next`를 누릅니다.
3. 파일 이름 지정: 파일 이름을 `Info.plist`로 지정하고 `Create`를 누릅니다.
4. 프로젝트 설정 업데이트: 생성된 Info.plist 파일을 프로젝트의 `Build Settings > Info.plist` 경로에 올바르게 설정합니다.

## 참고
- Info.plist는 프로젝트를 생성할 때 빌드 파일로 흡수되어 디렉토리 상에 직접적으로 보이지 않을 수 있습니다.
- Info.plist는 애플리케이션의 기본적인 설정 정보를 담고 있으며, URL Scheme, 권한, 버전 등 다양한 정보를 담고 있습니다.
- Info.plist 파일의 전체 경로를 확인하기 위해` Project > Targets > Info > Custom iOS Target Properties` 에서 Info.plist의 full path를 복사하여 사용하거나, Info.plist 파일을 `Open as > Source Code`로 열어 내용을 확인할 수 있습니다. 
