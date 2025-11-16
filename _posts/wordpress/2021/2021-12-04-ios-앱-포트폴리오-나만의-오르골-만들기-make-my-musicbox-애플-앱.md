---
title: "iOS 앱 포트폴리오: 나만의 오르골 만들기 (Make My MusicBox) 애플 앱스토어 출시 📱"
date: 2021-12-04
categories: 
  - "DevLog"
  - "포트폴리오"
---

나만의 오르골(뮤직 박스) 악보를 만들고 재생, 공유할 수 있는 [나만의 오르골 만들기 Make My MusicBox](https://apps.apple.com/kr/app/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%98%A4%EB%A5%B4%EA%B3%A8-%EB%A7%8C%EB%93%A4%EA%B8%B0-make-my-musicbox/id1596583920) 앱이 출시되었습니다.

 

### **나만의 오르골 만들기 Make My MusicBox**

#### **프로모션 영상**

{% youtube "https://youtu.be/RzUoYL_RKKg" %}

 

#### **사용 도구**

Swift, Xcode

 

#### **앱스토어 링크**

[나만의 오르골 만들기 Make My MusicBox](https://apps.apple.com/kr/app/%EB%82%98%EB%A7%8C%EC%9D%98-%EC%98%A4%EB%A5%B4%EA%B3%A8-%EB%A7%8C%EB%93%A4%EA%B8%B0-make-my-musicbox/id1596583920) (모든 국가 출시)

 

#### **깃허브 링크**

[https://github.com/ayaysir/MusicBox](https://github.com/ayaysir/MusicBox)

 

#### **제작 시기**

버전 1.01 - 2021.9,9 ~ 2021.11.25

 

#### **특징 및 사용 기술**

- **애플 앱스토어의 검수에 통과하였습니다.**
- Core Graphics를 통한 뷰 드로잉
- 주어진 악보 데이터에 따라 MIDI 시퀀스를 생성, 저장, 재생
- UIDocument, 바이너리 인코딩을 이용한 문서 파일 생성 및 저장
- 생성된 문서 파일의 공유 기능 및 외부 앱에서 파일 열기 기능
- Firebase를 이용한 인증 (회원가입 & 로그인)
- Firebase를 이용한 문서 파일 및 메타데이터 CRUD
- 단위 테스트 도입

 

#### **앱 소개**

```
Create your own music box sheet music, listen to it, and share it with others.

iPhone/iPad에서 뮤직박스가 다시 태어났습니다. 나만의 오르골과 악보를 만드십시오.

종이의 그리드 아무 곳이나 터치합니다. 종이에 구멍이 뚫리면 메모가 추가됩니다. 소리도 있어서 실제 악보를 쓰는 듯한 느낌을 받을 수 있습니다.

특징
- 지우개 모드로 전환하여 메모를 지우십시오(구멍 채우기).
- 실행 취소 모드는 마지막으로 추가한 메모를 실행 취소합니다.
- 재생/정지 시퀀스를 통해 음악을 재생하고 들을 수 있습니다.
- Snap to Grid 모드가 켜져 있으면 그리드에 맞게 음표가 입력되고, 꺼져 있으면 그리드 위치에 관계없이 모든 수평 위치에 메모를 추가할 수 있습니다.
- Expand Paper를 사용하면 메모를 원하는 만큼 추가할 수 있습니다. 반면에 Shrink -- Paper를 사용하면 필요하지 않은 추가 악보를 잘라낼 수 있습니다.
- BPM과 Incomplete Measure는 언제든지 변경할 수 있습니다.

** 종이 파일 공유
공유 메뉴를 사용하면 파일을 다른 디렉토리에 저장하거나 메일이나 AirDrop으로 전송하여 다른 사람과 공유할 수 있습니다.

** 인터넷 아카이브
아카이브에 가입하면 악보 파일을 네트워크를 통해 다른 사람들과 공유할 수 있습니다.

** 설정: 내 취향에 맞게 앱 사용자 지정
종이의 질감과 배경의 질감을 변경할 수 있습니다.

그리고 또한
- 노트 노트의 지속 시간을 설정할 수 있습니다.
- 오르골 뿐만 아니라 다양한 악기를 설정할 수 있습니다.
- 무음 모드에서도 소리를 낼 수 있습니다.
- 앱은 자동 저장을 지원하므로 원하는 간격으로 저장하도록 설정할 수 있습니다.

이 앱은 iPhone과 iPad를 동시에 지원하며 다크 모드도 지원합니다.
```

 

#### **스크린샷**

 ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-05-am-12.57.27.jpg)  ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-05-am-12.57.34.jpg)  ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-05-am-12.57.40.jpg)  ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-05-am-12.57.54.jpg)  ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-05-am-12.58.02.jpg)  ![](/assets/img/wp-content/uploads/2021/12/screenshot-2021-12-05-am-12.58.11.jpg)

 

제가 만든 다른 앱 [Tuner XR](https://apps.apple.com/kr/app/tuner-xr/id1581803256)도 많은 관심 부탁드립니다.

- [iOS 앱 포트폴리오: Tuner XR 애플 앱스토어 출시 📱- 음악가들을 위한 튜너 앱](http://yoonbumtae.com/?p=3912)

제가 만든 다른 앱 [DiffuserStick](https://apps.apple.com/kr/app/diffuserstick/id1578285458)도 많은 관심 부탁드립니다.

- [iOS 앱: 디퓨저 스틱 (Diffuser Stick) 애플 앱스토어 출시 📱- 디퓨저 스틱 교체주기 관리 앱](http://yoonbumtae.com/?p=3842)
