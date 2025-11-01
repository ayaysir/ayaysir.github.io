---
title: "Glassmorphism CSS Generator로 글래스모피즘 스타일의 CSS 만들기"
date: 2021-01-10
categories: 
  - "DevLog"
  - "JavaScript"
---

[https://glassmorphism.com/](https://glassmorphism.com/)

요즘 새롭게 부상할 디자인 트렌드로 글래스모피즘이 부상할 것이라는 이야기가 나오고 있습니다. 글래스모피즘 디자인은 표면이 반투명 유리 재질의 표면을 통해 배경이 흐릿하게 나오는 디자인 철학을 뜻합니다.

이미 macOS의 빅 서 (Big Sur)에서 전반적으로 새롭게 글래스모피즘 디자인이 적용된 것을 볼 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-10-오후-11.57.48.jpg)

이러한 디자인의 CSS를 직접 만들 수 있지만, 이런 스타일을 만들어주는 외부 사이트들이 굉장히 많습니다. 이런 사이트를 활용하는 것이 많이 도움이 됩니다.

 

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-11-오전-12.03.26.jpg)

- `Blur value` - 블러 강도를 조절합니다. 높을수록 흐려지고, 낮을수록 선명해집니다.
- `Transparency` - 반투명 강도를 조정합니다. 높을수록 반투명 강도도 높아집니다.
- `Color` - 기본 색상은 흰색이며, 다른 색상을 지정할 수 있습니다.
- `Show Outline` - 체크박스 선택시 희미한 경계선이 나타나며, 해제시엔 아무것도 표시되지 않습니다.
- `CSS` - 해당 CSS를 원하는 곳에 가져다 사용하면 됩니다.

 

[backdrop-filter](https://developer.mozilla.org/ko/docs/Web/CSS/backdrop-filter)는 요소 뒤에서 나타날 수 있는 효과를 적용하는 CSS 속성으로, 요소 뒤에서 효과가 적용되므로 반투명 효과가 같이 적용되어야 해당 효과가 나타날 수 있습니다. 이 속성이 유리 재질처럼 보이게 하는 핵심 원리입니다.
