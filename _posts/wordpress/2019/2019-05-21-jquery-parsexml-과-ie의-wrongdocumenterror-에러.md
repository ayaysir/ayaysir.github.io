---
title: "JQuery: $.parseXML 과 IE의 WrongDocumentError 에러"
date: 2019-05-21
categories: 
  - "DevLog"
  - "JavaScript"
---

## 문제점

`$.parseXML(string)`은 스트링 형식으로 된 xml을 자바스크립트 객체로 파싱하는 역할을 합니다. 

크롬을 비롯한 현대의 브라우저에서는 이상이 없는데 인터넷 익스플로러에서만 발생하는 오류가 있습니다.

```html
<script>
  function xmlDocGenerator(tagName){
    var xml = document.implementation.createDocument("", "", null);
    var topNode = xml.createElement(tagName)			
    
    xml.appendChild(topNode)
    return xml.cloneNode(true);
    
  }

  var xmlHeader = xmlDocGenerator("elm:customTag")
  xmlHeader = xmlHeader.getElementsByTagName("elm:customTag")[0]

  var childNode = $.parseXML('<to>Tove</to>').getElementsByTagName("to")[0]
  xmlHeader.appendChild(childNode)

  console.log(xmlHeader)
</script>
```

XML을 다루는 과정을 간략화한 위 코드는 크롬에서는 아무런 문제가 없는데 익스플로러에서는 다음 오류(`wrongDocumentError`)가 발생합니다.

![](/assets/img/wp-content/uploads/2019/05/wde1.png)

## 원인

원인은 `xmlHeader`의 XML 요소들은 자바스크립트에서 자체적으로 생성된 `document`의 소유인데, `$.parseXML`로 변환한 XML 요소는 기존 브라우저의 `window` 내의 기본 `document`에서 생성된 것으로 보기 때문에 서로 소유한 `document`가 달라서 발생하는 문제라고 합니다.

<!-- , 원래는 익스플로러처럼 서로 대조하는게 맞는 방법이라고는 한다. 그런데 익스 빼고는 다 아무 에러가 없는게.. -->

## 해결방법

다음과 같은 방법으로 내부 `document`로 XML을 가져와 해결합니다.

```js
document.importNode(externalNode, deep)
```

`externalNode`는 내부로 임포트할 **'노드'**이고 `deep`은 `true`로 설정하면 자식까지 카피, `false`는 자식을 카피하지 않습니다. 적용하면 아래와 같습니다.

```html
<script>
  function xmlDocGenerator(tagName){
    var xml = document.implementation.createDocument("", "", null);
    var topNode = xml.createElement(tagName)			
    
    xml.appendChild(topNode)
    return xml.cloneNode(true);
    
  }

  var xmlHeader = xmlDocGenerator("elm:customTag")
  xmlHeader = document.importNode(xmlHeader.getElementsByTagName("elm:customTag")[0], true)

  var childNode = $.parseXML('<to>Tove</to>').getElementsByTagName("to")[0]
  xmlHeader.appendChild(childNode)
  console.log(xmlHeader)
</script>
```

![](/assets/img/wp-content/uploads/2019/05/wde2.png)
