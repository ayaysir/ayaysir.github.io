---
title: "CSS: submit 버튼(button)처럼 보이도록 앵커 태그(a) 스타일 지정 - button 태그와 a 태그 스타일 통일"
date: 2021-01-07
categories: 
  - "DevLog"
  - "JavaScript"
---

"제출(submit)" 버튼(`button`)과 "취소(cancel)" 앵커(`a`)가 있는 폼이 있습니다. HTML은 다음과 같습니다.

```html
<input type="submit" value="Submit" />
<a href="some_url">Cancel</a>
```

이 두 태그의 스타일이 똑같이 보이게 하려면 어떻게 해야 할까요?

 

간단하게 작성할 수 있는 최선의 방법은 다음과 같습니다. 위의 태그에 각각 클래스 `likeabutton` 을 추가한 뒤, 아래의 CSS 를 추가합니다. 경우에 따라 원하는 모양으로 커스터마이징 합니다.

```
.likeabutton {
    text-decoration: none; 
    font: menu;
    display: inline-block; 
    padding: 2px 8px;
    background: ButtonFace; 
    color: ButtonText;
    border-style: solid; 
    border-width: 2px;
    border-color: ButtonHighlight ButtonShadow ButtonShadow ButtonHighlight;
}
.likeabutton:active {
    border-color: ButtonShadow ButtonHighlight ButtonHighlight ButtonShadow;
}
```

(포커스된 `button`을 `'active'`로 취급하는 IE6-IE7을 방지하기 위한 일종의 수정이 필요할 수 있습니다.)

 

스타일을 적용하기 전 결과는 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2021/01/screenshot-2021-01-07-pm-11.59.32.png)

스타일을 적용한 후의 결과는 다음과 같습니다.

 ![](/assets/img/wp-content/uploads/2021/01/screenshot-2021-01-08-am-12.00.59.png)

 

그렇지만 기본 데스크톱의 버튼과 똑같지는 않습니다. 실제로 많은 데스크톱 테마의 경우 간단한 CSS에서 버튼 모양을 재현하는 것이 불가능합니다.

이러한 경우 브라우저의 기본 렌더링을 사용하도록 요청할 수 있습니다. 가장 좋은 방법은 다음과 같습니다.

```
.likeabutton {
    appearance: button;
    -moz-appearance: button;
    -webkit-appearance: button;
    text-decoration: none; font: menu; color: ButtonText;
    display: inline-block; padding: 2px 8px;
}
```

불행히도 브라우저별 접두사에서 짐작할 수 있듯이 이것은 아직 모든 브라우저에서 지원되지 않는 CSS3의 기능 입니다. 특히 IE와 Opera는 이를 무시합니다. 그러나 다른 스타일을 백업으로 포함하면 지원하는 브라우저가 해당 `appearance` 속성을 삭제하고 명시적인 배경과 테두리를 지정할 수 있습니다.

 

이를 위해 기본적으로 위와 같은 `appearance` 스타일을 사용하고, 필요에 따라 JavaScript로 보완 작업을 수행하는 것입니다.

```
<script type="text/javascript">
    var r = document.documentElement;
    if (!('appearance' in r || 'MozAppearance' in r || 'WebkitAppearance' in r)) {
        // add styles for background and border colours
        if (/* IE6 or IE7 */)
            // add mousedown, mouseup handlers to push the button in, if you can be bothered
        else
            // add styles for 'active' button
    }
</script>
```

출처: [Styling an anchor tag to look like a submit button](https://stackoverflow.com/questions/2187008/styling-an-anchor-tag-to-look-like-a-submit-button)
