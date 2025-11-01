---
title: "iOS 프로그래밍: 스크롤 뷰(Scroll View) 사용방법 (스토리보드)"
date: 2021-07-27
categories: 
  - "DevLog"
  - "Swift UIKit"
---

1) 뷰 컨트롤러에 `Scroll View` 를 추가합니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-7.50.41.jpg)

 

2) 스크롤 뷰를 원하는 위치에 놓은 뒤 `Add New Constraint`로 상하좌우 제약(`constraint`)를 지정합니다. (빨간색 선 부분)

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-7.51.45.jpg)

 

3) 제약을 지정하면 아래와 같이 빨간색 선이 나타납니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-7.51.56.jpg)

 

4) 스크롤 뷰 안에 뷰(`View`)를 추가합니다. 뷰가 스크롤 뷰 안에 위치해야 합니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-7.52.19.jpg)

 

5) `View`의 상하좌우 여백을 `Content Layout Guide`에 제약을 지정합니다. `Content Layout Guide`는 컨텐츠 내용 영역을 의미합니다. 즉 어떠한 내용이 담겨있으며 분량이 얼마인지를 나타냅니다. `View`는 스크롤될 내용들이 담긴 뷰이므로 이것의 크기를 `Content Layout Guide`에 알려주는 것입니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-7.53.57.jpg)

 

6) 다음은 `View`와 `Frame Layout Guide`에 제약을 지정합니다. `Frame Layout Guide`는 고정되어야 하는 프레임을 의미합니다. 세로 스크롤인 경우 가로 길이는 고정되어 있고 세로 길이만 변합니다. 따라서 뷰의 가로 길이가 변하지 않아야 한다는 것입니다. `Equal Width`를 지정함으로써 가로는 고정시키고 세로는 스크롤되도록 합니다. 반대로 가로 스크롤인 경우 가로 길이가 변하고 세로 길이는 고정되어야 하므로 `Equal Heights` 를 지정합니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-7.55.20.jpg)

 

`Content Layout Guide`와 `Frame Layout Guide`의 관계를 그림으로 나타내면 아래 화면과 같습니다. 빨간색 박스의 `Frame Layout Guide`는 화면에 보여지는 영역, 그 외 흰색 부분 `Content Layout`은 콘텐츠가 담겨있는 영역입니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-8.54.31.jpg)

 

7) 다음 `View`의 크기를 지정합니다. 세로 스크롤인 경우는 세로 길이가 유동적이므로 `Height` 제약을 지정하며 원하는 크기를 입력합니다. 반대로 가로 스크롤인 경우는 가로 길이가 유동적이므로 `Width` 제약을 지정합니다.

 ![](/assets/img/wp-content/uploads/2021/07/스크린샷-2021-07-27-오후-8.01.54.jpg)

 

8) 다음 `View` 안에 컨텐츠를 추가합니다. 뷰의 길이가 기기의 길이보다 길기 때문에 내용이 전부 보이지 않습니다. 뷰 컨트롤러의 `Size Inspector`에서 사이즈를 조정할 수도 있지만, 트랙패드가 있다면 스크롤 뷰에서 두 손가락으로 쓸어올리거나 내리면 뷰의 길이에 상관없이 전부 편집할 수 있습니다.

<iframe width="278" height="480" src="https://giphy.com/embed/X3cRi21Puvop9BLhZE" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

 

[](https://giphy.com/gifs/X3cRi21Puvop9BLhZE)

<iframe width="316" height="480" src="https://giphy.com/embed/x83IUWQVXbE8djEYeG" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe>

 

참고: [https://baechukim.tistory.com/m/4?category=902784](https://baechukim.tistory.com/m/4?category=902784)

[](https://giphy.com/gifs/x83IUWQVXbE8djEYeG)
