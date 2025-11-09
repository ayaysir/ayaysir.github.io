---
title: "JQuery: 선택자 최적화 (Optimize Selectors)"
date: 2019-08-30
categories: 
  - "DevLog"
  - "JavaScript"
---

## 선택자 최적화 (Optimize Selectors)

더욱 많은 브라우저에서 `document.querySelectorAll()`을 구현하고 있고 요소 선택에 대한 부담이 jQuery에서 브라우저로 바뀌고 있기 때문에 선택자 최적화는 예전보다 중요하지 않습니다. 그러나 선택자 성능에 병목 현상이 발생하면 명심해야 할 몇 가지 팁이 있습니다.

 

### JQuery 확장 (jQuery Extensions)

가능하면 jQuery 확장이 포함된 선택자를 사용하지 마십시오. 이러한 확장은 기본 `querySelectorAll()` DOM 메소드가 제공하는 성능 향상을 이용할 수 없으므로 jQuery에서 제공하는 **Sizzle 선택자 엔진**을 사용해야 합니다.

```js
// 느림 (0 기반(zero-based) ":even" 선택자는 jQuery의 확장입니다.)
$( "#my-table tr:even" );
 
// 비록 정확하게 동일하지는 않지만 더 좋습니다.
$( "#my-table tr:nth-child(odd)" );
```

위의 예에서 `:even`를 포함하여 많은 jQuery 확장은 CSS 사양과 정확히 동등하지 않습니다. 경우에 따라 이러한 확장의 편리함이 성능 비용보다 클 수 있습니다.

 

### 과도한 상세함 회피 (Avoid Excessive Specificity)

```js
$( ".data table.attendees td.gonzalez" );
 
// 더 나음: 가능한 중간 단계의 선택자를 생략하세요.
$( ".data td.gonzalez" );
```

바람 빠진(flatter) DOM은 또한 선택자 엔진이 요소를 찾을 때 거쳐야 할 레이어 수가 적어지기 때문에 선택자 성능을 향상시키는 데 도움이 됩니다.

 

### ID 기반 선택자 (ID-Based Selectors)

ID로 선택자를 시작하는 것이 안전합니다.

```js
// 빠름:
$( "#container div.robotarm" );
 
// 훨씬 빠름:
$( "#container" ).find( "div.robotarm" );
```

첫 번째 접근 방식으로 jQuery는 `document.querySelectorAll()`을 사용하여 `DOM`을 쿼리합니다. 두 번째로 jQuery는 `document.getElementById()`를 사용하는데,이 속도는 `.find()`에 대한 후속 호출로 인해 속도 향상이 줄어들 수 있지만 (이것을 감안하더라도) 더 빠릅니다.

 

## 이전 브라우저를 위한 팁

Internet Explorer 8 이하와 같은 이전 브라우저에 대한 지원이 필요한 경우 다음 팁을 고려하십시오.

 

### 상세함 (Specificity)

선택자의 오른쪽은 구체적으로, 왼쪽은 덜 구체적으로 구성하세요.

```js
// 최적화되지 않음:
$( "div.data .gonzalez" );
 
// 최적화됨:
$( ".data td.gonzalez" );
```

가장 오른쪽 선택자에서 가능한 경우 `tag.class`를 사용하고 왼쪽에서는 `.class` 만 사용하세요.

 

### 범용 선택자를 회피 (Avoid the Universal Selector)

"어디서나 일치하는 항목을 찾을 수 있는 선택자"를 지정하거나 또는 암시하는 선택자는 매우 느릴 수 있습니다.

```js
$( ".buttons > *" ); // 매우 고비용(expensive)
$( ".buttons" ).children(); // 훨씬 낫다
 
$( ":radio" ); // 암시된 범용 선택자
$( "*:radio" ); // 똑같은 상황
$( "input:radio" ); // 훨씬 낫다
```

원문: [https://learn.jquery.com/performance/optimize-selectors/](https://learn.jquery.com/performance/optimize-selectors/)
