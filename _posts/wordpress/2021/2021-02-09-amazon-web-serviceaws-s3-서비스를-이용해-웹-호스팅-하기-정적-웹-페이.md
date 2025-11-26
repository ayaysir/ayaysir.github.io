---
title: "Amazon Web Service(AWS) S3 서비스를 이용해 웹 호스팅 하기 (정적 웹 페이지 업로드)"
date: 2021-02-09
categories: 
  - "DevLog"
  - "CI/CD"
---

AWS(Amazon Web Service) S3 서비스는 파일을 업로드/다운로드 하는 용도로 제공되는 서비스인데요, 이 서비스에서 제공하는 부가 기능을 정적(static) 웹 사이트에 대한 호스팅 서버 용도로도 사용할 수 있습니다.

## **방법**

### **1) 로그인 후 [AWS S3 Management Console](https://s3.console.aws.amazon.com/s3/) 페이지로 접속한 다음 `[버킷 만들기]` 버튼을 클릭해 새로운 버튼을 만듭니다.**

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-1.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-1.jpg)

<!--  [](/assets/img/DevLog/aws-static-deploy/) -->

 

### **2) 버킷 이름, 리전(지역)을 입력합니다.** [![](/assets/img/DevLog/aws-static-deploy/aws-s3-2.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-2.jpg) 

 

### **3) 스크롤을 밑으로 내리면 `모든 퍼블릭 액세스 차단` 란에 체크가 되어있는데, 해제합니다. 그리고 그 밑의 빨간색 세모 느낌표 란의 체크박스의 메시지를 읽고 클릭합니다.**

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-3.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-3.jpg)

 

 

### **4) `[버킷 만들기]` 버튼을 클릭합니다.** [![](/assets/img/DevLog/aws-static-deploy/aws-s3-4.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-4.jpg) 

 

### **5) 만들어진 버킷 페이지에서 `[권한]` 탭을 클릭한 다음 `퍼블릭 액세스 차단 설정`이 활성화되어있으면 해제하고, 스크롤을 내리면 `버킷 정책` 란이 있는데 `[편집]` 버튼을 클릭합니다.** 

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-5.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-5.jpg) [![](/assets/img/DevLog/aws-static-deploy/aws-s3-6.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-6.jpg) 

 

 

### **6) 버킷의 `ARN 주소`를 복사한 다음, `[정책 생성기]` 버튼을 클릭합니다.**

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-7.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-7.jpg)

 

 

 

### **7) 정책 설정기에서 다음과 같이 설정 후, `[Add Statement]` 버튼을 클릭합니다.**

 ![](/assets/img/wp-content/uploads/2021/02/screenshot-2021-02-09-pm-11.56.53.png)

 

 

### **8) 다음, `[Generate Policy]` 버튼을 클릭한 다음, 출력되는 JSON 을 복사합니다.**

 ![](/assets/img/wp-content/uploads/2021/02/screenshot-2021-02-09-pm-11.59.41.png) ![](/assets/img/wp-content/uploads/2021/02/screenshot-2021-02-10-am-12.02.09.png)

 

 

 

### **9) 버킷 정책 편집 창으로 돌아온 뒤, JSON을 붙여넣기 하고 `[변경사항 저장]` 버튼을 클릭합니다.**

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-7.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-7.jpg)

 

 

### **10) `[속성]` 탭을 클릭한 다음, 스크롤을 맨 밑으로 내리면 `[정적 웹 사이트 호스팅]` 란이 있습니다. `[편집]` 버튼을 클릭합니다.** [![](/assets/img/DevLog/aws-static-deploy/aws-s3-8.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-8.jpg) [![](/assets/img/DevLog/aws-static-deploy/aws-s3-9.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-9.jpg)

 

 

### **11) 정적 웹 사이트 호스팅을 활성화하고, 호스팅 유형으로 `[정적 웹 사이트 호스팅]`을 선택합니다. 인덱스 문서에 index.html 등 URL 을 입력하면 나올 홈 페이지 파일을 입력합니다.**

만약 웹 페이지가 자바스크립트를 이용한 라우팅 기능이 탑재된 SPA(Single Page Application) 인 경우, 오류 문서 란에도 인덱스 문서와 동일한 파일을 지정합니다. 이렇게 하면 index.html 파일에 내장된 라우팅 기능을 사용할 수 있게 됩니다.

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-10.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-10.jpg)

 

 

### **12) 웹 사이트 리소스 파일을 업로드합니다.**

[![](/assets/img/DevLog/aws-static-deploy/aws-s3-11.jpg)](https://github.com/ayaysir/js-ds-alg/blob/master/pictures/aws-s3-11.jpg)

 

### **13) 다시 속성 탭의 `정적 웹 사이트 호스팅` 란으로 이동하면, URL이 생성된 것을 볼 수 있습니다.**

이 URL에 접속하여 인덱스 문서 및 라우팅 기능이 정상 동작하는지 확인합니다.

 ![URL 확인](/assets/img/wp-content/uploads/2021/02/screenshot-2021-02-10-am-12.10.16.png)   
 *URL 확인*

 ![인덱스 문서 표시](/assets/img/wp-content/uploads/2021/02/screenshot-2021-02-10-am-12.09.40.png)  
 *인덱스 문서 표시*
 
 ![라우팅 기능 확인](/assets/img/wp-content/uploads/2021/02/screenshot-2021-02-10-am-12.09.55.png)
*라우팅 기능 확인*