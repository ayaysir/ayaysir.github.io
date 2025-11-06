---
published: false
title: "MinGW: Windows 에서 C언어 개발환경 구축"
date: 2019-03-21
categories: 
  - "none"
---

C를 전문적으로 할 건 아닌데 몇 가지 봐야되는게 있어서 C 컴파일러 + 텍스트 에디터(?)를 설치할 것이다.

원래 글은 아래에 길게 써놨는데 인스톨러 버전을 사용하면 그냥 깔기만 하면 된다. 컴파일러 포함된 버전으로 설치하면 별도로 컴파일러를 찾아다닐 필요도 없다.

[\[다운로드 페이지 가기\]](https://www.fosshub.com/Code-Blocks.html?dwl=codeblocks-17.12mingw_fortran-setup.exe)

밑에 글은 인스톨러를 사용하지 않을 경우에만 참고

* * *

1. [https://osdn.net/projects/mingw/downloads/68260/mingw-get-setup.exe/](https://osdn.net/projects/mingw/downloads/68260/mingw-get-setup.exe/)에서 설치파일 다운로드
2. MinGW 설치: 파일을 받고 기본설정으로 인스톨하면 MinGW Install Manager라는게 바탕화면에 생기면서 실행될 것이다. ![](/assets/img/wp-content/uploads/2019/03/gw1.png) Basic Setup을 선택하고 마우스를 오른쪽 클릭한 다음 모든 목록을 Mark for Installation으로 선택한다. 그런 다음 위 메뉴의 Installation → Apply Change를 선택하면 각종 파일이 다운로드 되면서 설치가 완료된다. 안해도 되는건지는 모르겠는데 일단 나는 했음
3. IDE 설치: 윈도우에선 Code Blocks 라는 에디터를 쓴다고 해서 이걸 설치한다. 개인의 취향에 따라 다른 IDE를 사용해도 된다. 다운로드는 [https://www.fosshub.com/Code-Blocks.html](https://www.fosshub.com/Code-Blocks.html)에서
4. 캡처를 못했는데 처음 컴파일러 선택 화면에서 GNU GCC Compiler를 선택한다.
5. File → New → File... 를 선택한다. ![](/assets/img/wp-content/uploads/2019/03/gw2.png)
6.  Filename with full path에서 생성할 파일 경로를 설정하고 Finish 한다. ![](/assets/img/wp-content/uploads/2019/03/gw4.png)
7.  도구 바에 톱니바퀴와 재생 모양이 있는 부분에서 Build 하고 실행한다. ![](/assets/img/wp-content/uploads/2019/03/gw5.png)
