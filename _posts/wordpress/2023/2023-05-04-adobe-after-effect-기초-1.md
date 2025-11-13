---
title: "Adobe After Effect 기초 (1) - 프로젝트 생성/저장, 컴포지션 만들기, 레이어 다루기, 마스크, 마스크, 미리 보기"
date: 2023-05-04
categories: 
  - "StudyLog"
  - "그래픽"
---

#### **새 프로젝트 만들기**

- 첫 화면 오른쪽의 `[새 프로젝트]` 버튼 클릭
- 또는 `파일 메뉴 > 새로 만들기 > 새 프로젝트`
- 단축키: (맥 `command + option + N`)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.12.36-copy.jpg)

 

#### **프로젝트 저장**

- `파일 > 다른 이름으로 저장`
- (맥 `command + shift + S`)
- 프로젝트 관리시 관련 영상 및 소스들을 한 폴더 안에 저장해야 함

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.29.20-copy.jpg)

 

 

#### **소스 가져오기**

- `파일 > 가져오기 > 파일`
- (맥 `command + I`)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.27.19-copy.jpg)

예제로 mp4 영상을 임포트합니다. 비디오 영상을 임포트하면 왼쪽 프로젝트 패널에 추가됩니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.32.38-copy.jpg)

 

#### **컴포지션 만들기**

- `컴포지션 > 새 컴포지션`
- (맥 `command + N`)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.27.59-copy.jpg)

 

#### **컴포지션 설정에 정보 입력**

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.34.29-copy.jpg)

- 컴포지션 이름에 이름 지정
- 6초 영상을 만드려면 지속 시간에 `0;00;06;01`
    - `01`은 원하는 영상 길이에 무조건 붙여야 합니다.
    - (왜?) 잘리지 않고 안전하게 출력되므로
- 사전 설정
    - 왼쪽에는 영상의 해상도, 오른쪽은 프레임을 말합니다.

 

> 참고) 30프레임과 29.97 프레임의 차이
> 
> 원래는 30프레임을 쓰고 있었다가 29.97이 나중에 채택되었다고 합니다. 두 가지 설이 있는데, 디지털 환경에서 1초를 30이라는 수로 나눠떨어지는게 불가능해서 (1프레임당 0.0333.....초가 됨) 싱크를 맞추기 위해 29.97(1프레임당 0.03336670003초)가 되었다는 설과 흑백TV에서 컬러TV로 넘어가는 과도기에 30프레임 중 29.97에 영상정보(휘도)를 할당하고 나머지 0.03 프레임에 색상 정보를 할당하기 위해 변화했다는 설이 있습니다.

 

#### **현재 시간 표시기**

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.37.10-copy.jpg)

파란색 막대기를 움직여 현재 표시되는 시간에 맞는 장면을 보여줍니다.

 

#### **새 레이어 추가**

만얅 레이어 추가 메뉴가 비활성화 된 경우, 위의 현재 시간 표시기를 클릭합니다.

 

##### **단색 설정 (맥 `command + Y`)**

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.38.11-copy.jpg)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.38.32-copy.jpg)

- 색상 버튼을 눌러 색상 변경

 

단색 레이어 2개를 추가하면 왼쪽 하단레이어 창이 아래와 같이 됩니다. ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.48.24.png)

 

##### **텍스트 레이어 추가 (맥 `cmd + option + shift + T`)**

- 텍스트 입력 후 command + enter로 마무리합니다.
- 크기 조절 중 shift를 누른 채 마우스를 드래그하면 비율이 유지됩니다.

 

단색 레이어 2개 추가 후 텍스트를 추가한 장면

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.51.59-copy.jpg)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.52.04-copy.jpg)

 

#### **임포트한 영상을 레이어 목록에 추가**

1) 프로젝트 패널의 영상을 레이어 창 제일 위쪽으로 드래그합니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.54.47-copy.jpg)

 

2) 변형 기능 사용

타임라인 패널에서 소스 오른쪽의 옵션(빨간색 박스 부분) 버튼 클릭

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.55.23-copy.jpg)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-12.55.38-copy.jpg)

- 비율 (단축키 S)
- 불투명도 (단축키 T)

어도비 애프터 이펙트 Adobe After Effect 기초 이론 튜토리얼 강의 요약 정리

#### **레이어 순서**

레이어가 위로 올수록 Z값이 높습니다. (아래 부분을 덮어버립니다.)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.02.27-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.02.35-copy.jpg)

 

#### **레이어 자르기**

##### **단순 자르기**

레이어 선택 후, 단축키(맥 `option + [` , 윈도우 `alt + [` ) 를 누릅니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.05.59-copy.jpg)  ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.06.04-copy.jpg)

- 마우스로도 조절 가능

 

##### **2) 레이어를 복제해서 자르기**

레이어를 선택 후 현재 표시기를 이동한 후, 단축키 (맥 `command + shift + D`)를 누릅니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.11.33-copy.jpg)

 

#### **효과 적용하기**

오른쪽 패널에서 효과 및 사전 설정 메뉴 클릭 후 원하는 효과를 레이어(트랙)으로 드래그합니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.12.46-copy.jpg)

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.13.01-copy.jpg)

 

#### **마스크 추가**

1) 영상 레이어를 선택합니다.

2) 도구 메뉴에서 도형 버튼을 길게 누른 뒤,

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.21.35-copy.jpg)

3) 둥근 사각형 클릭하고 영상 위에 그리면 마스크 형태로 잘립니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.23.09-copy.jpg)

4) 마스크 테두리 색상(에디터에서만 보이며, 실제 출력 결과와는 무관)을 아래 빨간색 박스 영역을 눌러 바꿀 수 있습니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.16.02-copy.jpg)

 

#### **영상 미리 보기**

오른쪽 패널에서 미리 보기 메뉴를 클릭 후 재생 버튼 클릭

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.18.04-copy.jpg)

또는 단축키 설정 가능 (기본은 스페이스바)

 

#### **미리보기 영상 해상도 낮추기**

최종 결과와는 무관하며, 작업 PC의 성능이 낮을 경우 해상도를 낮춰 재생할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2023/05/screenshot-2023-05-05-오전-1.18.16-copy.jpg)

 

#### **(계속 이어집니다.) [Adobe After Effect 기초 (2) - 로토브러시, 키프레임, 모양 레이어, 영상 파일 출력](http://yoonbumtae.com/?p=5547)**
