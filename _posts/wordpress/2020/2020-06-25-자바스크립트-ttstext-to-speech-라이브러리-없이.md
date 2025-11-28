---
title: "자바스크립트: TTS(Text-to-Speech) 라이브러리 없이"
date: 2020-06-25
categories: 
  - "DevLog"
  - "JavaScript"
tags: 
  - "자바스크립트"
---

자바스크립트에서 TTS 기능을 사용하는 방법입니다. TTS(Text-to-Speech)는 텍스트를 음성 합성을 통해 컴퓨터가 읽어주는 것으로 트위치 영상등에 있는 음성 도네이션이 TTS 를 사용합니다.

음성합성으로 읽을 내용, 언어, 음성의 속도 높낮이 등을 `new SpeechSynthesisUtterance(``)` 로 설정하고 재생은 `speechSynthesis.speak()`를 사용합니다. `speechSynthesis`는 `window` 객체 내에 있기 때문에 그냥 사용하면 됩니다. 재생중인 음성합성을 중지할때는 `speechSynthesis.cancel()`을 사용합니다.

<!-- https://gist.github.com/ayaysir/eea1ec360901b26a8251b1d5388a052b -->
{% gist "eea1ec360901b26a8251b1d5388a052b" %}



https://codepen.io/ayaysir/pen/pogwaQQ?editors=1010
