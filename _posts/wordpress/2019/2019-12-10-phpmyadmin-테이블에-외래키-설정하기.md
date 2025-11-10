---
title: "phpMyAdmin: 테이블에 외래키 설정하기"
date: 2019-12-10
categories: 
  - "DevLog"
  - "Database"
---

 ## 방법

![구조](/assets/img/wp-content/uploads/2019/12/screenshot-2019-12-10-pm-8.32.40.png)  
 
![외래키 제약](/assets/img/wp-content/uploads/2019/12/screenshot-2019-12-10-pm-8.35.41.png)


1. **\[구조\]** 버튼을 클릭합니다.
2. **\[릴레이션 뷰\]** 버튼을 클릭합니다.
3. **제약의 이름**을 입력합니다.
4. **외래키**로 사용할 컬럼(다른 테이블을 참조하는 컬럼)의 컬럼명을 설정합니다.
5. **참조되는 컬럼**(다른 테이블의 기본키)의 컬럼명을 찾아 설정합니다. 두 컬럼 간의 데이터 타입 및 인코딩은 일치해야 합니다.
6. **옵션** (`SET NULL`: 참조되는 컬럼이 변경되면 `null`로 업데이트/`CASCADE`: 연쇄 업데이트/`RESTRICT`: 변경 제한/`NO ACTION`: 참조되는 컬럼의 변경에 아무 영향을 받지 않음) 을 설정합니다.
7. **\[저장\]** 버튼을 클릭합니다.

## 실행 결과

 ![](/assets/img/wp-content/uploads/2019/12/screenshot-2019-12-10-pm-8.41.15.png)
