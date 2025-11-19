---
title: "자바스크립트 예제: 텍스트에서 유튜브(YouTube) URL을 감지하고 해당 URL을 자동으로 플레이어로 전환"
date: 2021-06-04
categories: 
  - "DevLog"
  - "JavaScript"
---

이 예제는 아래와 같이 게시판 등에서 글을 작성할 때 유튜브 주소를 추가하면, 해당 주소에서 유튜브 동영상 ID를 추출한 후 `iframe` 플레이어 형태로 변환합니다.

 ![](/assets/img/wp-content/uploads/2021/06/screenshot-2021-06-04-pm-9.10.35.png)

 ![](/assets/img/wp-content/uploads/2021/06/screenshot-2021-06-04-pm-9.11.11.jpg)

 

##### **1\. 텍스트에서 유튜브 URL을 가져오는 정규표현식을 작성합니다.**

```
// 유튜브 URL 찾는 패턴
const youtubeUrl = /(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/g
```

이렇게 하면 아래와 같이 유튜브 주소를 찾을 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/06/screenshot-2021-06-04-pm-10.01.56.jpg)

 

##### **2\. 해당 텍스트를 DOM 으로부터 불러온 뒤, innerHTML을 replace 합니다.**

```html
<div id="content">
유튜브 영상에서 주소를 복사한 후 글 아무데나 삽입하면 됩니다.

https://www.yㅇutube.com/watch?v=WZiD8_XHENA

https://yㅇutu.be/J0dHN1yC0NI
</div>
```

```js
const content = document.querySelector("#content")

// str.replace(regexp|substr, newSubstr|function)
const wrappedContent = content.innerHTML.replace(youtubeUrlExp, youtubeParser)
```

정규식에서 매칭된 결과를 영상 재생이 가능한 태그로 대체할 것입니다. 참고로 `replace`에서 대체할 텍스트 대신 함수를 사용하는 것이 가능합니다. 함수는 매치된 텍스트 및 그룹화된 텍스트(정규식인 경우)를 파라미터로 받아 사용이 가능합니다.

[참고 문서: 두 번째 파라미터가 function으로 지정되었을 때](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%EB%A7%A4%EA%B0%9C%EB%B3%80%EC%88%98%EA%B0%80_function%EC%9C%BC%EB%A1%9C_%EC%A7%80%EC%A0%95%EB%90%98%EC%97%88%EC%9D%84_%EB%95%8C)

 

##### **3\. 텍스트를 대체하는 함수를 만듭니다. (youtubeParser)**

```js
function youtubeParser(url, ...groups) {
  const container = `
    <div class="video-container">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/#ID#" title="YouTube video player"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>`
  
  return groups && groups[6].length == 11
    ? container.replace("#ID#", groups[6])
    : url;
}

```

 

위의 정규식에 따르면, 정규식 매치 결과의 그룹 목록 중 7번(`$7`)이 유튜브 동영상의 ID를 담고 있습니다. `container` 변수는 실제로 유튜브에서 공식적으로 제공하는 `iframe` 플레이어 태그 부분이며, 아이디 위치 부분(#ID#)을 실제 아이디로 대체하여 해당 동영상을 재생하도록 합니다. `groups` 배열에서는 6번째 원소에 아이디가 담겨 있으므로 `groups[6]` 을 사용합니다.

`...groups` 는 [Rest 파라미터](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/rest_parameters)라 하여 여러 파라미터를 한꺼번에 묶어 배열 형태로 사용할 수 있도록 합니다. Rest 파라미터를 사용하지 않는다면 파라미터는 `(url, p1, p2, p3, p4, p5, p6, p7, ...)` 로 작성한 다음 `p7`을 사용합니다.

 

 ![](/assets/img/wp-content/uploads/2021/06/screenshot-2021-06-04-pm-10.14.12.jpg)

 

##### **4\. 유튜브 태그가 적용된 코드를 innerHTML에 적용합니다.**

```
content.innerHTML = wrappedContent
```

 

<iframe height="465" style="width: 100%;" scrolling="no" title="Get Youtube Video ID from URL" src="https://codepen.io/ayaysir/embed/MWpVzoQ?height=265&amp;theme-id=light&amp;default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="allowfullscreen">See the Pen <a href="https://codepen.io/ayaysir/pen/MWpVzoQ">Get Youtube Video ID from URL</a> by ayaysir (<a href="https://codepen.io/ayaysir">@ayaysir</a>) on <a href="https://codepen.io">CodePen</a>.</iframe>
