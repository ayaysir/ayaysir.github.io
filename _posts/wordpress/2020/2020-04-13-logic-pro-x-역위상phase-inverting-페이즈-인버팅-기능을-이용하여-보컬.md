---
title: "Logic Pro X: 역위상(Phase Inverting; 페이즈 인버팅) 기능을 이용하여 보컬+코러스만 추출"
date: 2020-04-13
categories: 
  - "StudyLog"
  - "Logic Pro"
tags: 
  - "logic-pro-x"
---

## 소개

역위상(Phase Invertring)은 노이즈 캔슬링에 이용되는 기술인데 이것을 이용해서 특정 음원에서 보컬과 코러스만 추출한 음원을 생성할 수 있습니다.

## 조건

- 음원 제작사에서 공식적으로 제공하는 Instrumental(MR) 트랙이 존재해야 합니다.
- Instrumental(MR) 트랙은 역위상 방지를 위한 특수 가공 처리가 되어있지 않아야 합니다.

## 방법

### 1\. 음원 준비

보컬과 코러스가 포함된 원래 음원과 MR음원(보컬 및 코러스가 제거된 음원)을 준비합니다.

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-8.38.57.png)

 

### 2\. 파일 임포트

두 파일을 로직 안으로 임포트(Import) 합니다.

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-8.44.55.png)

 

### 3\. 시작점 맞추기

확대 기능을 이용하여 두 파일의 시작점을 최대한 똑같게 맞춥니다. 시작점이 약간이라도 차이가 나면 이 기능이 전혀 동작하지 않기 때문에 반드시 맞출 수 있는 데까지 맞춰야 합니다.

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-8.41.54.png)

음원의 위치를 이동할 때 `control` 버튼을 누르고 있으면 스냅이 무효화되며 정밀한 이동이 가능합니다.

두 음원의 볼륨에 의한 차이도 영향을 끼치기 때문에 만약 볼륨도 다르다면 서로 맞춰야 합니다. 이런 경우는 드문 편입니다.

 

### 4\. Invert 적용 

두 음원 중 하나에 Invert 기능을 적용합니다. 여기서는 Instrumental 트랙에 적용하겠습니다. 주의할 점은 트랙 에디터가 아니라 파일(File) 에디터에 기능이 존재한다는 점입니다.

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-8.49.09.png)

 

Invert 기능을 적용하면 파형의 그림이 살짝 변하는데 이것은 역위상이 적용된 것입니다.

 

### 5\. (3)번 기능(시작점 맞추기)을 다시 수행합니다.

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-9.00.07.png)

Waveform Zoom 기능은 파형을 확대해서 보여주는 기능인데, MP3같은 압축 음원은 파형이 왜곡되어 보이는 경우가 있어 사용하지 않는 편이 낫습니다. 스크린샷을 찍을 당시 착각했던 부분입니다.

 

단순히 악곡을 분석하는 용도라면 이 정도로 충분하고, 이것을 리믹스 등에 활용하려면 음원을 부분씩 자르고, EQ 를 조절하여 노이즈 등을 없애야 하는데, 저는 이 기능을 악곡 분석을 위해 사용하고 있고, EQ 부분은 저도 공부중이기 때문에 여기서는 언급하지 않겠습니다.

 

### 6. Bounce In Place로 새로운 트랙 추출

Bounce In Place(단축키: `control + B`) 기능을 이용하면 역위상이 적용된 두 트랙을 하나의 새로운 트랙으로 추출할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-9.12.32.png)  ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-9.12.47.png)

 ![](/assets/img/wp-content/uploads/2020/04/screenshot-2020-04-13-pm-9.17.05.png)
