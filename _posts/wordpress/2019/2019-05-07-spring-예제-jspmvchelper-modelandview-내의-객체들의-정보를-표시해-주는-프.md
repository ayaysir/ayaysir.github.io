---
title: "Java, Spring: 예제 - JspMvcHelper (Reflection을 사용해 ModelAndView 내의 객체들의 정보를 표시해 주는 프로그램)"
date: 2019-05-07
categories: 
  - "DevLog"
  - "Spring/JSP"
---

이 프로그램은 자바의 Reflection 개념들을 연습하기 위해 만든 예제로 리플렉션을 이용하여 Spring 프로젝트에서 MVC 패턴을 사용할 때 컨트롤러 등에 있는 ModelAndView (+ Model) 객체의 정보를 프론트엔드 측에서 볼 수 있도록 가공해서 보여주는 프로그램입니다. 자바스크립트의 `console.log()` 등을 사용해 내용을 볼 수 있습니다.

**사용 제약** MVC 패턴을 사용하는 스프링 프로젝트가 필요합니다. 모델 객체가 필요하며 현재 버전은 ModelAndView와 Model을 지원합니다. 표시되는 자료형 중 다중 자료형의 경우 현재는 일반 배열, List, Map, Set만 지원합니다.

**사용 방법** 코드를 복사해서 클래스 파일로 만든 다음 import 하면 됩니다.

##### **특징**

- JSP 파일에서 사용할 수 있는 변수명을 정리해서 볼 수 있습니다.
- 타입, 변수명, 값을 한 번에 볼 수 있습니다.
- 어떤 DTO에서 상위 클래스(superclass)가 존재하는 경우 그 상위 클래스에서 선언된 멤버 변수도 모두 찾아서 표시한다.
- 일반 배열도 안에 있는 값들을 보여준다.
- Map 객체의 경우 key 마다 줄바꿈을 지원해서 보여줍니다.

```
private String outputString;

public JspMvcHelper(ModelAndView mav){
    outputString = help(mav.getModel(), false, false);
}

public JspMvcHelper(ModelAndView mav, boolean isThisForJSConsole){
    outputString = help(mav.getModel(), isThisForJSConsole, false);
}

public JspMvcHelper(ModelAndView mav, boolean isThisForJSConsole, boolean isWholeStringWrap)
{
    outputString = help(mav.getModel(), isThisForJSConsole, isWholeStringWrap);
}

public JspMvcHelper(Model m){
    outputString = help(m.asMap(), false, false);
}

public JspMvcHelper(Model m, boolean isThisForJSConsole){
    outputString = help(m.asMap(), isThisForJSConsole, false);
}

public JspMvcHelper(Model m, boolean isThisForJSConsole, boolean isWholeStringWrap)
{
    outputString = help(m. asMap(), isThisForJSConsole, isWholeStringWrap);
}
```

생성자 목록으로, 모든 생성자는 `toString()`을 통해 String 문자열을 반환합니다.`mav`란에는 ModelAndView 또는 Model의 인스턴스를 넣습니다. `isThisForConsole`은 자바스크립트 콘솔에서 사용하고자 할 경우 사용하는 옵션이며  `true`를 선택해야 콘솔에서 정상적으로 볼 수 있습니다. `false`를 선택할 경우 일반 텍스트로 출력하며 자바스크립트에 일반 따옴표(쌍따옴표나 홑따옴표)로 삽입시 에러를 유발합니다. `isWholeStringWrap`은 출력 결과 전체를 쌍따옴표(")로 묶을 지 여부를 선택하는 것이며 기본 값은 `false`이다.

 

##### **컨트롤러에서의 사용예**

```
mav.addObject("instruction",  new JspMvcHelper(mav, true));
```

뷰(프론트엔드) 작업자는 다음과 같이 정보를 사용하면 됩니다.

```
<script>
    console.log("${ instruction }");
    // EL을 둘러쌓은 기호는 반드시 쌍따옴표("") 이어야 한다.
    // isWholeStringWrap이 true일 경우 다음과 같이 사용
    console.log(${ instruction });
</script>

```

또는 `<pre>${ instruction }</pre>` 과 같이 사용할 수 있다. 이 때는 `isThisForConsole`이 `false`인 경우가 좋습니다.

출력결과는 다음과 같습니다.

[![](./assets/img/wp-content/uploads/2019/05/jspMvcHelper.png)](http://yoonbumtae.com/?attachment_id=1094)

제네릭 타입은 실제 제네릭 타입을 찾아 표시하는게 아니라 리스트 등에서 모든 원소의 타입이 동일할 것이라는 가정 하에 첫 번째 원소의 객체를 읽어 그 객체의 타입에 관한 정보를 읽어들이는 약간은 편법적인 방식입니다. 만약 제너릭 타입이 `Object` 또는 `Superclass`인 경우는 정확한 하위 클래스를 판별할 수 없습니다. 아래에서 `set1` 에서 제너릭 타입은 `Object`으로 지정하였지만, 첫 번째 원소가 `Integer`인 관계로 `Integer`인 것처럼 표시되었다.

```
********** 제너릭 타입 상세(β) **********
list1: [egovframework.map.web.dto.LayerInfo] 
 - String name
 - String thumbnailURL
 - String style 

map1:
 key: [java.lang.String] 
 value: [egovframework.map.web.dto.TopicArticleDaughter] 
 - String daughterName
 - int seq
 - String title
 - String link 

set1: [java.lang.Integer]
```

[소스 보기](https://gist.github.com/ayaysir/3ec240bd04ac08f3e63a3430ec458266) \[2018-10-29 업데이트\]

https://gist.github.com/ayaysir/3ec240bd04ac08f3e63a3430ec458266
