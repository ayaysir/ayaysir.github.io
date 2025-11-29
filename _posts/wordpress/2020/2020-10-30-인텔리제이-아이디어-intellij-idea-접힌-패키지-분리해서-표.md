---
title: "인텔리제이 아이디어 (IntelliJ IDEA) 접힌 패키지 분리해서 표시하는 방법"
date: 2020-10-30
categories: 
  - "DevLog"
  - "etc"
---

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.35.43.png)

위의 예처럼 인텔리제이를 사용할 때 패키지 안에 다른 내용이 없다면 합쳐서 보여주는 기능이 있습니다.

이것을 펼쳐서 표시하려면 다음과 같이 합니다.

## **방법**

### **1) 프로젝트 바 상단 오른쪽에 있는 옵션 버튼 (Show Options Menu) 을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.36.54.png)

 

### **2) Compact Middle Packages 란 체크를 해제하거나 선택합니다.**

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.38.28.png)

체크를 선택하면 첫 예시처럼 접혀서 나오고, 체크 해제하면 아래처럼 풀어진 채로 나옵니다.

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.41.28.png)

 

#### **참고: Compact Middle Packages가 체크 선택되어 있는 상태에서 새로운 패키지나 클래스 생성**

맨 위의 예제에서 `blog` 라는 패키지 밑에 `multimedia` 라는 패키지를 생성하고 싶은 경우

 

### **1) 해당 패키지의 상위 패키지나 폴더 (여기서는 `blog`의 상위 단계에 있는 `src`)를 선택합니다.**

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.43.34.png)

 

### **2) New Package 입력란에 `blog.[패키지명]`을 입력합니다. 클래스 생성도 동일하게 적용됩니다.**

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.47.08.png)

 ![](/assets/img/wp-content/uploads/2020/10/-2020-10-30-pm-5.49.19-e1604047808538.png)

 

위 방법대로 하면 아래처럼 패키지 또는 클래스를 생성할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2020/10/screenshot-2020-10-30-pm-5.48.19.png)
