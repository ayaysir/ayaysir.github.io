---
title: "Swift(스위프트): Core ML + Create ML 기초 요약 上 (기계학습 모델 만들기)"
date: 2022-10-08
categories: 
  - "DevLog"
  - "Swift"
---

### **Core ML**

기계학습(Machine Learning)에 의한 이미지 분석, 텍스트 처리 등의 작업을 네트워크를 통하지 않고 기기(아이폰, 아이패드, 맥 등) 내의 AP를 이용하여 수행할 수 있도록 하는 라이브러리입니다. [Core ML](https://developer.apple.com/kr/machine-learning/core-ml/)은 Apple 하드웨어를 활용하고 메모리 공간 및 전력 소비를 최소화하여 다양한 모델 유형의 기기 내 성능에 최적화되어 있습니다.

- 온전히 기기 자체에서 모델 실행
    - 네트워크가 필요 없음
    - 개인 정보 보호 가능
- 모델을 Core ML로 변환
    - TensorFlow 또는 PyTorch와 같은 라이브러리의 모델을 Core ML로 변환
- 첨단 신경망 실행
- 기기 내에서 모델 맞춤화

 

> **참고: 기계학습**
> 
> 기계 학습(機械學習) 또는 머신 러닝(영어: machine learning)은 경험을 통해 자동으로 개선하는 컴퓨터 알고리즘의 연구이다. 인공지능의 한 분야로 간주된다. 컴퓨터가 학습할 수 있도록 하는 알고리즘과 기술을 개발하는 분야이다. 가령, 기계 학습을 통해서 수신한 이메일이 스팸인지 아닌지를 구분할 수 있도록 훈련할 수 있다.
> 
> 기계 학습의 핵심은 표현(representation)과 일반화(generalization)에 있다. 표현이란 데이터의 평가이며, 일반화란 아직 알 수 없는 데이터에 대한 처리이다. 이는 전산 학습 이론 분야이기도 하다. 다양한 기계 학습의 응용이 존재한다. 문자 인식은 이를 이용한 가장 잘 알려진 사례이다.
> 
> [기계 학습: 위키피디아](https://ko.wikipedia.org/wiki/%EA%B8%B0%EA%B3%84_%ED%95%99%EC%8A%B5)

 

### **Create ML**

[Create ML](https://developer.apple.com/kr/machine-learning/create-ml/)은 Core ML에 사용할 기계학습 모델을 비전문가도 Mac 하드웨어 상에서 쉽게 생성할 수 있게 하도록 지원하는 도구입니다. Create ML은 강력한 Core ML 모델을 생성하면서 모델 학습의 복잡성을 해소합니다.

 

#### **기능**

- 다중 모델 학습
- 학습 제어
- eGPU 학습 지원
- 온디바이스 학습
- 모델 미리보기
- 시각적 평가

 

#### **모델 유형**

- 이미지
    - 이미지 분류
    - 물체 인식
    - 손 자세 분류
    - 스타일 전환
- 비디오
    - 동작 분류
    - 손 동작 분류
    - 스타일 전환
- 모션
- 사운드
- 텍스트
    - 텍스트 분류
    - 단어 태그 지정
- 테이블 형식
    - 테이블 형식 분류
    - 테이블 형식 회귀 분석

 

### **Core ML과 Create ML을 바탕으로 이미지 분류 앱 제작**

이 글에서는 이미지 분류(Image Classification)가 가능한 기계학습 모델을 만든 뒤 그 모델을 앱에 적용해 개, 고양이, 소, 말을 구분하는 앱을 제작합니다.

\[gallery columns="4" size="full" ids="4902,4903,4904,4901"\]

#### **순서**

1. 각 동물의 사진을 수집 (최소 100장 이상)
2. 수집한 사진을 Create ML을 이용해 기계학습을 시킨 뒤 모델 파일(\*.mlmodel)을 생성
3. 해당 모델 파일을 Xcode 프로젝트에 추가한 후 해당 모델을 이용한 앱 제작
4. 실제 기기에서 앱 실행

 

#### **Create ML 사용법**

먼저 Create ML을 사용해 기계학습 모델을 만듭니다.

##### **Create ML 프로젝트 생성**

**1: Xcode를 열고 상단 `Xcode > Open Developer Tool > Create ML`을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.22.02.jpg)

 

**2: 파일 선택 창이 열리는데 하단의 `New Document` 버튼을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.22.52.jpg)

 

**3: 다양한 예제가 있는데, 여기서는 이미지 분석(`Image Classification`) 프로젝트를 생성합니다. 해당 아이콘을 클릭하고 하단의 Next 버튼을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.23.24.jpg)

 

**4: 프로젝트 이름, 저자, 설명 등을 작성합니다. 하단의 `Next` 버튼을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.24.26.jpg)

 

**5: 파일 창이 뜨는데 `Create` 버튼을 누르면 프로젝트가 생성됩니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.24.48.jpg)

#### **학습 진행하기**

학습을 진행하기 위해서는 먼저 Training Data(학습 데이터)와 Testing Data(테스팅 데이터)가 필요합니다. (Validation Data는 옵션 사항이며 학습 데이터에서 자동으로 추출하여 진행할 수 있음)

- _**Class**_
    - 이미지 구분 학습 모델에서, 구분 기준(카테고리)입니다. 예를 들어 개와 고양이를 구분하는 모델을 생성하고자 한다면 개, 고양이가 각각 클래스가 됩니다.
- _**Training Data**_
    - 기계 학습의 바탕이 되는 데이터이며 Create ML은 전적으로 학습 데이터에 의존해서 기계 학습 모델을 생성합니다.
    - 따라서 카테고리 이름에 맞는 데이터를 입력하는게 최우선이며, 카테고리명과 다른 사진 등이 들어갈 경우 제대로된 모델이 생성되지 않습니다.
- _**Testing Data**_
    - Training Data를 바탕으로 평가를 진행하고, 그 평가 결과를 바탕으로 신뢰도 수치(Precision과 Recall)를 제공합니다.
    - 신뢰도 수치는 각각 100%가 최대값이며 높으면 높을수록 해당 모델의 예측 성능이 좋아집니다.

 

**1: Training Data를 추가합니다. 학습 데이터 박스에 있는 `Select...` 버튼을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.26.51.jpg)

파일 창이 뜨는데, 상위 폴더를 기준으로 각각 클래스(카테고리)를 폴더로 구분하여 정리한 후 해당 상위 폴더를 선택합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.27.06.jpg)

 

보다 자세한 폴더 구조는 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-08-pm-11.11.37.jpg)

사진 수는 많을 수록 좋지만, 반드시 많은 사진 학습 수가 모델의 구분 성능을 좌우하지는 않습니다. (사진 수가 많은데 오히려 Precison & Recall 수치가 떨어지는 경우도 있음) 이 글에서는 각 클래스당 200개씩 사진을 준비했습니다.

 

**2: 테스팅 데이터 추가**

테스팅 데이터도 학습 데이터와 마찬가지로 추가합니다. 단, 학습 데이터에 사용된 사진을 재사용하면 학습이 제대로 되지 않을 수 있으므로 학습 데이터와 중복되지 않는 별개의 사진들을 준비해 추가합니다. 테스팅 데이터 박스에서 `Select...` 버튼을 눌러 폴더를 추가합니다.

 

**3: Train 시작**

Training Data와 Testing Data가 준비되었다면 상단의 `Train` 버튼을 눌러 학습을 시작합니다.

- `Iterations`
    - 학습에서 동일한 과정을 반복해 모델의 구분 성능을 높입니다.
    - 너무 과도한 반복 학습은 오히려 정확도를 떨어트릴 수도 있습니다.
- `Augmentations`
    - 다양한 상황을 가정해(노이즈가 있거나, 블러, 크롭된 사진 등) 이미지 후처리를 한 후 학습을 진행해 구분 성능을 높입니다.
    - 학습 시간이 굉장히 늘어나는 단점이 있으며, 이미지가 매우 많을 경우는 이미 이미지 수 자체가 그러한 상황이 반영되어 있을 확률이 높기 떄문에 그대로 진행하는 것이 나을 수 있습니다.

 

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.27.55.jpg)

 

**4: 모델 성능 측정**

학습이 완료되면 Evaluation 탭 란에 결과가 표시됩니다. Precision과 Recall 두 수치를 이용해 모델의 성능을 평가합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.29.37.jpg)

 

> **참고: Precision과 Recall**
> 
> 모델을 평가하는 요소는 결국, 모델이 내놓은 답과 실제 정답의 관계로써 정의를 내릴 수 있습니다. 정답이 True와 False로 나누어져있고, 분류 모델 또한 True False의 답을 내놓습니다. 그렇게 하면, 아래와 같이 2x2 matrix로 case를 나누어볼 수 있겠네요.
> 
>  ![](/assets/img/wp-content/uploads/2022/10/다운로드.png)
> 
> - True Positive(`TP`) : 실제 True인 정답을 True라고 예측 (**정답**)
> - False Positive(`FP`) : 실제 False인 정답을 True라고 예측 (오답)
> - False Negative(`FN`) : 실제 True인 정답을 False라고 예측 (오답)
> - True Negative(`TN`) : 실제 False인 정답을 False라고 예측 (**정답**)
> 
> 위 다이어그램을 바탕으로 Precision과 Recall을 구분하면 다음과 같습니다.
> 
> - **Precision** (정밀도)
>     - 정밀도란 모델이 True라고 분류한 것 중에서 실제 True인 것의 비율입니다.
>     - `TP / (TP + FP)`
> - **Recall** (재현율)
>     - 재현율이란 실제 True인 것 중에서 모델이 True라고 예측한 것의 비율입니다
>     - `TP / (TP + FN)`
> 
> Precision과 함께 Recall을 함께 고려하면 실제 TRUE 값(즉, 분류의 대상이 되는 정의역, 실제 data)의 입장에서 우리의 TRUE라고 예측한 비율을 함께 고려하게 되어 제대로 평가할 수 있습니다. Precision과 Recall은 상호보완적으로 사용할 수 있으며, 두 지표가 모두 높을 수록 좋은 모델입니다.
> 
> [분류성능평가지표 - Precision(정밀도), Recall(재현율) and Accuracy(정확도)](https://sumniya.tistory.com/26)

 

**5: 미리 모델 테스트 (Preview)**

Preview 탭을 클릭한 뒤, 여러 동물들의 사진을 드래그 앤 드롭으로 왼쪽의 파일 선택 창에 추가합니다. 다음 사진을 클릭해 보면 모델이 어떻게 분류하는지 미리 볼 수 있습니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-08-pm-11.40.10.jpg)

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-08-pm-11.40.33.jpg)

Create ML로 만든 이미지 분류기의 단점은 사진의 두 종이 복수로 있을 경우는 잘 구분하지 못한다는 점에 있습니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-07-pm-11.42.17.jpg)

**6: 완성된 모델을 파일로 추출하기**

Precision과 Recall을 고려하여 선택된 모델을 파일로 추출합니다. `Output` 탭을 클릭한 뒤 `Get` 버튼을 누르고 .mlmodel 파일로 저장합니다.

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-08-am-12.43.52.jpg)

 ![](/assets/img/wp-content/uploads/2022/10/screenshot-2022-10-08-pm-11.47.01.png)

 

#### **이제 이 모델 파일을 바탕으로 앱을 제작합니다. (下편에 계속)**
