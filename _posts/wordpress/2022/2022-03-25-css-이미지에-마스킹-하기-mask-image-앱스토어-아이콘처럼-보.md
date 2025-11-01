---
title: "CSS 이미지에 마스킹 하기 (mask image) + 앱스토어 아이콘처럼 보이게 곡률 조정 (코너 깎기)"
date: 2022-03-25
categories: 
  - "DevLog"
  - "JavaScript"
---

#### **CSS MASK-IMAGE**

아래와 같은 이미지를 마스킹(마스크 적용)하는 방법입니다.

 ![](/assets/img/wp-content/uploads/2022/03/스크린샷-2022-03-26-오전-12.29.03.jpg)

##### **참고: 이미지 마스킹(마스크)이란?**

 ![](/assets/img/wp-content/uploads/2022/03/226F263F572020BF0C.png)

 

마스킹으로 덧씌울 PNG 이미지 파일을 준비합니다. 이 마스킹 이미지를 씌우면 투명한 부분은 표시되지 않고, 검은색 부분은 표시가 됩니다.

 ![](/assets/img/wp-content/uploads/2022/03/스크린샷-2022-03-26-오전-12.29.09.jpg)

 

 

HTML 파일에서 적용하고자 하는 요소에 다음 CSS를 삽입합니다.

```
img {
    -webkit-mask-image: url("ddmask.png");
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-image: url("ddmask.png");
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
}
```

크롬, 사파리에서는 `-webkit` 접두어가 붙어야만 작동합니다. (밑의 3줄 없어도 동작)

 

결과는 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2022/03/스크린샷-2022-03-26-오전-12.29.36.jpg)

 

##### **예제: 이미지 코너에 앱스토어 아이콘의 곡률 적용하기** 

\[caption id="attachment\_4289" align="alignnone" width="856"\] ![](/assets/img/wp-content/uploads/2022/03/스크린샷-2022-03-26-오전-12.38.44.jpg) 애플 앱 스토어에서 사용하는 아이콘 모양\[/caption\]

정사각형 이미지에 위와 같은 곡률을 적용하고 싶을 때, 애플 웹 페이지에 있는 공식 마스크를 적용하면 위와 같은 아이콘 모양이 됩니다. (참고: [https://stackoverflow.com/questions/2105289/iphone-app-icons-exact-radius](https://stackoverflow.com/questions/2105289/iphone-app-icons-exact-radius))

 

아래 BASE64 코드는 앱스토어 사이트에서 공식 사용된 마스킹 이미지로, `mask-image`의 `url`에 이것을 적용하면 앱스토어에서 사용하는 아이콘 모양처럼 코너에 곡률이 적용됩니다.

> data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ijc5My40IDYwNC41IDMwMCAzMDAiPjxwYXRoIGQ9Ik0xMDkzLjQgNjk4LjR2LTEwLjdjMC0zLS4xLTYtLjEtOS4xLS4yLTYuNi0uNi0xMy4yLTEuNy0xOS43LTEuMi02LjYtMy4xLTEyLjctNi4yLTE4LjctMy01LjktNi45LTExLjMtMTEuNi0xNi00LjctNC43LTEwLjEtOC42LTE2LTExLjYtNi0zLjEtMTIuMS01LTE4LjctNi4yLTYuNS0xLjItMTMuMS0xLjYtMTkuNy0xLjctMy0uMS02LS4xLTkuMS0uMUg4NzYuNmMtMyAwLTYgLjEtOS4xLjEtNi42LjItMTMuMi42LTE5LjcgMS43LTYuNiAxLjItMTIuNyAzLjEtMTguNyA2LjItNS45IDMtMTEuMyA2LjktMTYgMTEuNi00LjcgNC43LTguNiAxMC4xLTExLjYgMTYtMy4xIDYtNSAxMi4xLTYuMiAxOC43LTEuMiA2LjUtMS42IDEzLjEtMS43IDE5LjctLjEgMy0uMSA2LS4xIDkuMXYxMzMuN2MwIDMgLjEgNiAuMSA5LjEuMiA2LjYuNiAxMy4yIDEuNyAxOS43IDEuMiA2LjYgMy4xIDEyLjcgNi4yIDE4LjcgMyA1LjkgNi45IDExLjMgMTEuNiAxNiA0LjcgNC43IDEwLjEgOC42IDE2IDExLjYgNiAzLjEgMTIuMSA1IDE4LjcgNi4yIDYuNSAxLjIgMTMuMSAxLjYgMTkuNyAxLjcgMyAuMSA2IC4xIDkuMS4xaDEzMy43YzMgMCA2LS4xIDkuMS0uMSA2LjYtLjIgMTMuMi0uNiAxOS43LTEuNyA2LjYtMS4yIDEyLjctMy4xIDE4LjctNi4yIDUuOS0zIDExLjMtNi45IDE2LTExLjZzOC42LTEwLjEgMTEuNi0xNmMzLjEtNiA1LTEyLjEgNi4yLTE4LjcgMS4yLTYuNSAxLjYtMTMuMSAxLjctMTkuNy4xLTMgLjEtNiAuMS05LjF2LTEyM3oiLz48L3N2Zz4=

 

또는 아래의 svg 파일을 다운로드하세요.

- [구글 드라이브에서 App Store 마스크 SVG 다운로드](https://drive.google.com/file/d/1qg3WoUvqYec3IfBJCNiiDQs1mfIdZw1u/view?usp=sharing)

 

\[caption id="attachment\_4288" align="alignnone" width="573"\] ![](/assets/img/wp-content/uploads/2022/03/스크린샷-2022-03-26-오전-12.37.12.jpg) 마스크가 적용된 모습\[/caption\]
