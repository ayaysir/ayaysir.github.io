---
title: "HTML5: input 태그의 radio 타입 (태그, JQuery, 자바스크립트)"
date: 2021-03-03
categories: 
  - "DevLog"
  - "JavaScript"
---

input 태그에서 radio 타입은 checkbox와 다르게 특정 그룹 내 여러 라디오 버튼 중 하나만 선택할 수 있는 것이 특징입니다.

 

#### **기본 형태**

```html
<input type="radio" value="1" name="score"> 1 
<input type="radio" value="2" name="score"> 2
<input type="radio" value="3" name="score"> 3 
<input type="radio" value="4" name="score"> 4 
<input type="radio" value="5" name="score"> 5
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-03-pm-3.04.14.png)

`value`에 자바스크립트나 폼 전송에 사용될 값을 입력합니다.

 

#### **라디오 버튼 그룹화**

`name` 속성을 같은 이름으로 하면 그룹화가 됩니다. 위의 예제의 `name`이 `score`로 동일하므로 1 ~ 5 중 하나의 라디오만 클릭할 수 있고, 복수 선택은 불가능합니다.

 

#### **기본값 지정하기**

`checked` 속성을 추가하면 해당 라디오에 기본으로 체크가 됩니다.

```html
<input type="radio" value="3" name="score" checked> 3
```

 

#### **Form으로 전송**

```
<form method="get" action="example">
    <input type="radio" value="1" name="score"> 1
    <input type="radio" value="2" name="score"> 2
    <input type="radio" value="3" name="score" checked> 3
    <input type="radio" value="4" name="score"> 4
    <input type="radio" value="5" name="score"> 5
    <button type="reset">reset</button>
    <button>submit</button>
</form>
```

선택된 값이 `name`이라는 이름으로 전송이 됩니다. 참고로 `form` 태그 안에서는 `button`의 타입이 지정되어 있지 않다면 `submit`이 기본 타입입니다.

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-03-pm-3.26.28.png)

 

#### **JQuery 에서 선택된 라디오 값(value) 가져오기**

```
$("input[name='score']:checked").val()
```

선택자에 반드시 `:checked` 를 붙여야 선택된 값을 가져올 수 있습니다.

 

#### **자바스크립트(ES5)에서 선택된 라디오 값 가져오기**

**방법 1**

```
// 확인 버튼의 이벤트

var checkedScore = document.querySelector("input[name='score']:checked")
alert(checkedScore.value)
```

 

**방법 2**

```
var scores = document.getElementsByName("score")
scores.forEach((node) => {
    if(node.checked) {
        alert(node.value)
        return
    }
})
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-03-pm-3.24.16.png)
