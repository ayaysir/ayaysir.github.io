---
title: "JSP: 페이지 포함 방법 중 include 액션 태그와 디렉티브의 차이점"
date: 2019-01-20
categories: 
  - "DevLog"
  - "Spring/JSP"
---

JSP: 페이지 포함 방법 중 `include` 액션 태그와 디렉티브의 차이점 비교

#### **1\. 액션 태그**

사용법:

```
<jsp:include page="페이지 주소" flush="false>
  <jsp:param name="변수 이름" value="변수 값"></jsp:param>
</jsp:include>
```

액션 태그는 독립된 모듈을 구성할 때 사용합니다. 컴파일 시 클래스 파일이 별도로 생성되며 포함되는 페이지와 포함하는 페이지와는 별개로 취급됩니다.. 리퀘스트 값들은 전달되지 않으며 파라미터도 별도로 설정해야 합니다.

 

#### **2\. 디렉티브**

사용법:

```
<%@ include file="include-inner-directive.jsp" %>
```

디렉티브는 액션 태그와는 다르게 코드를 복붙하는 기능이라고 볼 수 있습니다. 클래스 파일이 별도로 생성되지 않으며 포함하는 페이지에 텍스트 코드만 삽입되어 컴파일됩니다. 애초에 페이지의 부분으로 취급되므로 리퀘스트 값도 그대로 사용할 수 있으며 파라미터 값을 따로 넘기지 않아도 된다. php의 include와 성격이 비슷합니다.

```
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
```

다만 디렉티브라도 페이지의 첫 부분에 위의 코드를 입력해야 한글이 깨지지 않습니다. 또한 위 선언문이 상위 JSP의 선언문과 맞지 않으면 오류가 발생합니다. 예를 들어 상위 JSP의 contentType이 `text/html; charset=UTF-8`인데 자식 JSP의 contentType이 `text/html; charset=utf-8`이라면 대소문자가 같지 않다는 이유만으로 오류가 발생합니다.

* * *

#### 예제

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Include: Action Tag</title>
<c:set var="customVariable" value="KAK" />
<style>
    div {margin-top: 10px}
</style>
</head>
<body>
    <div>
        (1) 메인 JSP 파일: ${ param.name }, ${ message }<br>
        <c:forEach begin="1" end="10" var="i">
            ${ i }
        </c:forEach>
        <c:out value="${ customVariable }" />
    </div>
    <div>
        <jsp:include page="include-inner-action.jsp">
            <jsp:param name="name" value="fake name"></jsp:param> 
        </jsp:include>
    </div>
    <div>
        <jsp:include page="include-inner-action.jsp">
            <jsp:param name="name" value="${ param.name }"></jsp:param> 
        </jsp:include>
    </div>
    <div>
        <%@ include file="include-inner-directive.jsp" %>
    </div>
    <div>
        <p>${ customInnerVariable1 }</p>
        <p>${ customInnerVariable2 }</p>
    </div>
    
</body>
</html>
```

**include-inner-action.jsp**

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

(2) 액션 태그: ${ param.name }, ${ message }<br>
<c:forEach begin="1" end="10" var="i">
    ${ i }
</c:forEach>
<c:out value="${ customVariable }" />
<c:set var="customInnerVariable1" value="EXODUS from Action Tag" />
```

**include-inner-directive.jsp**

```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
(3) 디렉티브 (지시자): ${ param.name }, ${ message }<br>
<c:forEach begin="1" end="10" var="i">
    ${ i }
</c:forEach>
<c:out value="${ customVariable }" />
<c:set var="customInnerVariable2" value="EXODUS from Directive" />
```

![](./assets/img/wp-content/uploads/2019/01/sibe.png)

액션 태그와 디렉티브를 비교하는 예제입니다. 두 부분 모두 이름, 반복문, 임의의 변수(`customVariable`)의 네ㅐ용을 표시하는 것을 목적으로 합니다. 결과를 보니 디렉티브는 모든 내용이 정상적으로 표시되는 반면 액션 태그는 뭔가 잘 실행이 안된 모양이며 심지어 파라미터를 다시 설정하지 않으면 컴파일 에러까지 발생합니다.

렌더링된 HTML 소스를 보면 액션 태그로 지정된 부분은 흉물스럽게 jstl 태그가 그대로 보이는 것을 알 수 있습니다. 원래 jstl 선언을 했다면 렌더링 후 이 태그들은 최종 결과물에서 절대 보이지 말아야 했습니다.

```
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Include: Action Tag</title>
 
<style>
    div {margin-top: 10px}
</style>
</head>
<body>
    <div>
        (1) 메인 JSP 파일: Sibe, Can you hear me?<br>
        
            1
        
            2
        
            3
        
            4
        
            5
        
            6
        
            7
        
            8
        
            9
        
            10
        
        KAK
    </div>
    <div>
        
    (2) 액션 태그: fake name, Can you hear me?<br>
    <c:forEach begin="1" end="10" var="i">
        
    </c:forEach>
    <c:out value="" />
    <c:set var="customInnerVariable1" value="EXODUS from Action Tag" />
    </div>
    <div>
        
    (2) 액션 태그: Sibe, Can you hear me?<br>
    <c:forEach begin="1" end="10" var="i">
        
    </c:forEach>
    <c:out value="" />
    <c:set var="customInnerVariable1" value="EXODUS from Action Tag" />
    </div>
    <div>
        
    (3) 디렉티브 (지시자): Sibe, Can you hear me?<br>
    
        1
    
        2
    
        3
    
        4
    
        5
    
        6
    
        7
    
        8
    
        9
    
        10
    
    KAK
    
    </div>
    <div>
        <p></p>
        <p>EXODUS from Directive</p>
    </div>
    
</body>
</html>
Colored by Color Scripter
```

액션 태그로 포함한 내용에 JSTL을 사용하고 싶다면 포함되는 파일에도 JSTL 선언을 다시 하면 됩니다. 이렇게 하면`include-inner-action.jsp` 페이지의 `forEach` 문은 정상적으로 작동합니다. 다만 그 안에서 선언된 변수 `customInnerVariable1`은 페이지 밖을 빠져나가지 못합니다.
