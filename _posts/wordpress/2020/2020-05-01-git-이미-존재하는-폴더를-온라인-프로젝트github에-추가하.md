---
title: "Git(깃): 이미 존재하는 폴더를 온라인 프로젝트(GitHub)에 추가하기"
date: 2020-05-01
categories: 
  - "DevLog"
  - "Git"
---

원본 글 [링크](https://mrgamza.tistory.com/491)

개인적인 목적으로 약간의 부가설명 및 스크린샷을 첨부했습니다.

* * *

 

##### **1\. github에 저장소를 만듭니다.**

[https://github.com/new](https://github.com/new)

 

##### **2\. git을 사용할수 있는 터미널을 열어줍니다.**

##### **3\. 자신이 git에 올리고 싶은 root 폴더로 이동합니다.**

#####  ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.08.56.png)

##### **4\. git디렉토리를 초기화 하여 줍니다.**

```
$ git init
```

 ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.09.42.png)

 

##### **5\. commit을 하여줍니다.**

```
$ git add .
$ git commit -m "First Commit"
```

 ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.12.51.png)

##### **6\. remote repository를 등록하여 줍니다.**

```
$ git remote add origin [ github clone URL ]
$ git push -u origin master
```

 ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.16.23.png)

 

\[caption id="attachment\_2374" align="alignnone" width="2318"\] ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.25.03.png) GitHub에 업로드 되었는지 확인\[/caption\]

 

##### **추가: GitKraken에서 불러오기**

\[caption id="attachment\_2371" align="alignnone" width="383"\] ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.20.00.png) Open Repo 기능 실행\[/caption\]

 

 

\[caption id="attachment\_2372" align="alignnone" width="517"\] ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.22.45.png) remote git 이 있는 폴더로 이동 후 \[열기\] 클릭\[/caption\] 

 

 ![](/assets/img/wp-content/uploads/2020/05/스크린샷-2020-05-01-오후-6.23.04.png)
