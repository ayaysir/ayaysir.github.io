---
title: "자바스크립트: IntersectionObserver (2) 무한 스크롤(Infinite Scroll) 구현 (라이브러리 없이)"
date: 2020-08-12
categories: 
  - "DevLog"
  - "JavaScript"
---

`IntersectionObserver`에 대한 내용은 이전 글에서 설명되어 있습니다.

- [자바스크립트: IntersectionObserver (1) 이미지 lazy-loading 구현](/posts/자바스크립트-intersectionobserver로-이미지-lazy-loading-구현/)

## 설명

`IntersectionObserver`을 이용한 무한 스크롤은 [MDN 문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#)에서도 공식적으로 권장하고 있는 사항입니다.

> Implementing "infinite scrolling" web sites, where more and more content is loaded and rendered as you scroll, so that the user doesn't have to flip through pages.

 

예전에 무한 스크롤을 구현한다고 하면 뷰포트의 높이와 `document`, `window`의 높이, 스크롤의 현재 위치의 차이 등을 계산하여 무한 스크롤 여부를 정하는 스크롤 이벤트를 이용한 방법이 많이 사용되었습니다. 이 방법은 개인적으로 매우 이해하기 어렵고 비직관적이라고 생각합니다.

이러한 기존의 스크롤 이벤트를 이용한 무한 스크롤 대비 `IntersectionObserver`를 사용한 무한 스크롤의 장점은 다음과 같습니다.

1. 비교적 이해가 쉽습니다. - '_리스트의 마지막 요소가 화면에 보이면 다음 데이터를 준비한다_' 라는 비교적 간단한 로직으로 구현 가능합니다.
2. [throttle, debounce 관련 문제](http://yoonbumtae.com/?p=2102)를 따로 처리하지 않아도 됩니다. - 스크롤 이벤트는 뷰포트, 스크롤의 위치 좌표를 계산하는 과정에서 trottle이나 debounce와 관련된 문제가 있으며, 이에 대한 별도의 처리 과정이 필요하나 `IntersectionObserver`는 계산 과정이 매우 단축되기 때문에 이러한 처리 과정이 필요 없습니다.
3. reflow가 많이 줄어듭니다. - 스크롤 이벤트는 좌표 계산 과정에서 DOM의 재 렌더링(reflow)가 유발되지만 `IntersectionObserver`는 이러한 문제로부터 자유롭습니다.

 

`IntersectionObserver`를 이용한 무한 스크롤은 대략 다음과 같이 진행됩니다.

1. 첫 데이터 리스트는 일반적으로 표시
2. 데이터 리스트의 마지막 요소를 관측(`observe`) - 마지막 요소는 <li> 요소의 배열을 순회해서 `el.nextSibling` 이 `null` 이면 마지막 요소로 판단합니다.
3. 2번의 마지막 요소가 화면에 10 ~ 100% 들어왔으면 (`threshold 0.1 ~ 1`) 다음 데이터를 로딩
4. 기존 `observe` 되고 있던 요소의 관측을 종료하고 (`unobserve`)  마지막 요소를 다시 찾아 관측
5. 더 이상 가져올 데이터가 없다면 모든 관측대상을 `disconnect` 하고 종료하기.

 
## 코드

<!-- https://gist.github.com/ayaysir/3f36a4fe9066b8c8917382766501e106 -->
{% gist "3f36a4fe9066b8c8917382766501e106" %}
 

<!-- https://codepen.io/ayaysir/pen/zYqvbea -->
<p class="codepen" data-height="300" data-default-tab="js,result" data-slug-hash="zYqvbea" data-pen-title="IntersectionObserver infinite scroll 1" data-user="ayaysir" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
      <span>See the Pen <a href="https://codepen.io/ayaysir/pen/zYqvbea">
  IntersectionObserver infinite scroll 1</a> by ayaysir (<a href="https://codepen.io/ayaysir">@ayaysir</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
      </p>
      <script async src="https://public.codepenassets.com/embed/index.js"></script>