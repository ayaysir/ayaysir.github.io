---
title: "HTML5: Select ~ Option (태그, JQuery, 자바스크립트)"
date: 2019-04-09
categories: 
  - "DevLog"
  - "JavaScript"
---

#### **기본 형태**

```
<body>
  <select>
    <option>사과</option>
    <option>귤</option>
    <option>포도</option>
  </select>
</body>
```

[![](./assets/img/wp-content/uploads/2019/04/select1.png)](http://yoonbumtae.com/?attachment_id=1003)

 

#### **select 속성**

- `autofocus` - **HTML5**, 페이지 로드시 자동으로 포커스 적용
- `disabled` - 표시만 되고 조작 및 내용 변경 불가
- `form` - 상위 폼 아이디 지정
- `multiple` - 다중 선택 가능
- `name` - form 전송에 사용할 이름 지정
- `required` - **HTML5.** 입력하지 않았을 경우 브라우저가 경고 메시지 표시
- `size` - 한 번에 볼 수 있는 행의 개수. 기본 값은 0.

 

#### **form 속성 예제**

```
<body>
 <form method=get action="./go.htx" id=frm1>
  <button>submit</button>   
 </form>
 
  <select multiple form=frm1 name="fruits">
    <option label="apple bee"></option>
    <option value="gjul">귤</option>
    <option value="grapes">포도</option>
  </select>
</body>
```

```
/go.htx?fruits=gjul&amp;fruits=grapes
```

위 예 제의 경우`select` 태그는  폼 범위 밖에 위치하고 있으나 `form` 속성을 폼 아이디 `frm1`로 지정하여 해당 폼 안에 포함시킬 수 있습니다. \[submit\] 버튼을 누르면 위의 결과가 get 형식으로 전송됩니다. `name`으로 파라미터 이름을 지정하며 `value` 내의 값이 전송됩니다.

 

#### **option 속성**

- `disabled`
- `label`: 옵션의 레이블 지정, 이곳에 텍스트가 있다면 inner text 대신 label에 지정한 값이 표시됨
- `selected`: 현재 선택되어 있는지 여부, select 속성이 multiple 허용이라면 다중 배치 가능
- `value`: 레이블과 별도로 지정된 값

 

#### **JQuery에서 다루기**

당연한 이야기이겠지만 셀렉트 옵션은 JQuery에서 다루는 것이 훨씬 편리합니다.

```
  
  // 1. 현재 선택된 option의 값 가져오기 (multiple 아닌 경우)
  var selected = $("#selectFruits option:selected").val()
  
  // 2. 현재 선택된 option의 값 가져오기 (multiple인 경우)
  $("#selectFruits option:selected").each(function(num, el){
      obj[num] = $(el).val()
  })
  
  // 3. 특정 값을 찾아 그 요소를 selected 시키기
  $("#selectFruits option[value='" + prompt("value 입력") + "']").attr("selected", true)
  

```

 

#### **Javascript (ES5) 에서 다루기**

```
// 1. 현재 선택된 option의 값 가져오기 (multiple 아닌 경우)
var list = document.getElementById("selectFruits")
var value = list.options[list.selectedIndex].value

// 2. 현재 선택된 option의 값 가져오기 (multiple인 경우)
var options = list.children
for(var i in options){
  if(options[i].selected){
    obj[i] = options[i].value
  }
}

// 3. 특정 값을 찾아 그 요소를 selected 시키기
var toFindValue = "grapes"
for(var i in options){
  if(options[i].value == toFindValue){
    options[i].selected = true
  }
}

```
