---
published: false
title: "OpenGL: Windows 운영체제의 CodeBlocks 에디터에서 GLUT 개발 환경 설정"
date: 2019-03-22
categories: 
  - "DevLog"
  - "OpenGL"
---

[https://wonjayk.tistory.com/27?category=535168](https://wonjayk.tistory.com/27?category=535168)

여기에는 파일을 못올려서 위 사이트에 접속해  [glutdlls37beta.zip](http://wonjayk.tistory.com/attachment/cfile5.uf@233C794F5375BB530292BE.zip) 을 다운로드한다.

나는 비주얼 스튜디오를 사용하지 않으므로 다른 경로에 설치한다.

CodeBlocks 설치는 [이 링크](http://yoonbumtae.com/?p=884) 를 참조한다.

먼저 CodeBlocks에서 사용하는 MInGW 컴파일러가 설치된 폴더를 찾는다.

코드블록 에디터의 인스톨러 버전으로 설치했다면 그림의 경로이다.

[ ![](/assets/img/wp-content/uploads/2019/03/cb1-1.png)](http://yoonbumtae.com/?attachment_id=903)

맨 위에 있는 압축 파일에서,

- 확장자가 `*.h` 인 파일은 `include/GL/` 폴더에
- 확장자가 `*.lib` 인 파일은 `lib` 폴더에
- 확장자가 `*.dll` 인 파일은 `bin` 폴더 또는 `%windir%/system32/` 에 각각 압축을 푼다.

 

코드블록 에디터를 실행한 다음 `File → New → Project...` 에서 `GLUT project`를 선택한다.

[ ![](/assets/img/wp-content/uploads/2019/03/cb2.png)](http://yoonbumtae.com/?attachment_id=897)

쭉 다음을 누르다가, 다음 창이 뜨면 경로를 좀전에 GLUT 파일들이 들어간 MinGW 컴파일러의 경로를 입력한다.

[ ![](/assets/img/wp-content/uploads/2019/03/cb3.png)](http://yoonbumtae.com/?attachment_id=898)

새 프로젝트를 만드면 `main.cpp` 라는 예제파일이 생기는데, 지금 쓰고 있는 개똥컴에서는 무슨 이유인지 모르겠는데 컴파일이 되지 않는다. `undefined reference to ...` 에러가 생기면서 컴파일이 되지 않는다면 코드의 맨 위 인클루드 선언 부분에 `#include <windows.h>` 를 삽입하면 컴파일이 된다.

이 프로젝트에서 파일 내용을 변경하거나 해서 사용하면 된다.

코드블록 에디터에서 프로젝트에 파일을 추가하는 방법이 좀 이상한데 메뉴에서 `File → New → File...` 에서 empty file 을 선택한 다음 add file to active project 옵션을 선택하면 추가된다.

[ ![](/assets/img/wp-content/uploads/2019/03/cb4.png)](http://yoonbumtae.com/?attachment_id=899)
