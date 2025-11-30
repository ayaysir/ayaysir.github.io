---
title: "JSP, Spring: EL(Expression Language), JSTL(Java Standard Tag Library) 기초 사용법"
date: 2019-04-30
categories: 
  - "DevLog"
  - "Spring/JSP"
---

**EL**(Expression Language)과 **JSTL**(Java Standard Tag Library)은 자바 서블릿 또는 스프링을 이용한 MVC 패턴에서 컨트롤러가 뷰(View) 페이지로 전송한 정보를 표시하는 방법입니다.

 

## 1\. EL

별도의 임포트 과정이 필요없고, JSP에서 바로 사용 가능합니다. 기본 사용 방법은 `${ 표현식 }` 의 꼴로 사용하며, 표현식 내부의 계산 결과를 HTML에서 사용하는 텍스트 형식으로 반환합니다. 즉, 표현식은 HTML 파일에서 텍스트가 입력되는 자리라면 어디든지 사용 가능합니다. (`style`, `script` 등을 가리지 않으며 스크립트의 주석 자리에서도 작동하므로 주의).

스프링의 컨트롤러에서는 다음과 같이 사용합니다.

```java
// 컨트롤러의 일부

@RequestMapping("/study/jstl.do")
public ModelAndView jstlDemo(HttpSession session, ModelAndView mav){
		
	// 0. 일반 텍스트
	String title = "EL과 JSTL";

	// 1. 리스트(List)
	List list = new ArrayList<>();
	list.add("Apple");
	list.add("Orange");

	// 2. 맵(Map)
	Map<String, Object> map = new HashMap<>();
	map.put("one", "Monday");
	map.put("two", "Tuesday");
	map.put("three", new Object());
	// 3. 세션(Session)
	session.setAttribute("loginId", "abcde");
	
	// 4. 사용자가 만든 VO(Value Object 또는 DTO, Bean..)
	Car aCar = new Car(3000000, "Vens", "VMW1001");
	// 텍스트, 리스트와 맵을 MAV 객체에 담는다.
	mav.addObject("title", title);
	mav.addObject("list", list);
	mav.addObject("map", map);
	mav.addObject("car", aCar );
		
	mav.setViewName("el-jstl");

	return mav;
}
```

일반 서블릿(Non-Spring)에서는 `doGet()` 또는 `doPost()` 메소드에서 `mav.addObject` 대신 `request.setAttribute`를 사용합니다.

```java
protected void doGet(HttpServletRequest request, HttpServletResponse response) 
throws ServletException, IOException {
  try {
    List<String> list = new ArrayList<>();
    list.add("Apple");
    list.add("Orange"); 

    Map<String, String> map = new HashMap<>();
    map.put("one", "Monday");
    map.put("two", "Tuesday");
    map.put("three", "Wednesday"); 
            
    // 리퀘스트 설정
    request.setAttribute("RESULT", result);
    request.setAttribute("LIST", list);
    request.setAttribute("MAP", map);
    request.setAttribute("CAR", myCar);
            
    // 세션 설정: 이름이 중복된 경우 표시는 리퀘스트(작은 scope)가 우선적으로 표시됨.
    request.getSession().setAttribute("name", "김길동");

    RequestDispatcher rd = request.getRequestDispatcher("pageUrl.jsp");
    rd.forward(request, response);
  } catch (Exception e) {
    e.printStackTrace();
    response.sendRedirect("error.htm");
  }
}
```

JSP(뷰 페이지)에서는 다음과 같이 사용합니다.

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${ title }</title>
</head>
<body>
  <h2>${ title }</h2>
  
  <h3>1. 리스트 (EL)</h3>
    ${list[0]} : ${list[1]}
    
    <h3>2. 맵 (EL)</h3>
    <p>${map.one}, ${map.two}, ${map["one"]}, ${map["two"]}</p>   
    
    <h3>3. 세션 (EL): sessionScope (session 아님)</h3>
    <p>login ID: ${sessionScope.loginId}</p>   
    
    <h3>4. VO (EL)</h3>
    <p>${car.price}, ${car.brand}, ${car.name}, ${car["name"]}</p>   
    
    <h3>EL 내에서 계산, boolean 판단</h3>
    <p>${3+5}, ${3>5}, ${ car.brand == "Vens" }</p>
    
    <h3>eq(equal), ne(not equal), param(파라미터)</h3>
    <p>${ car.brand eq "Vens" }, ${ car.brand ne "Lolsroyes" }</p>
    
    <h3>empty: 비어있는지 여부</h3>
    <p>${ empty param.voidParam ? '비어있음' : param.voidParam }</p>
    
    <h3>not empty: 비어있지 않은지 여부</h3>
    <p>${ not empty param.realParam ? param.realParam : '비어있음' }</p>
    
</body>
</html>
```

![](/assets/img/wp-content/uploads/2019/04/jstl1.png)

 

## 2\. JSTL

JSP 상단에 임포트 선언을 해야합니다. 이름에 표준이 들어가 있는데 많이 쓰이는 것은 맞지만 엄밀히 말하면 표준도 아니고 옛날 기술이라서 스프링 부트에서는 기본 컴포넌트에 포함되지도 않았습니다. 스프링 부트에서는 maven에 jstl 라이브러리를 가져와야 하며 부트의 경우에는 처음부터 기본 내장된 **Thymeleaf**라는 렌더링 엔진을 사용하는 것을 추천합니다.

> [Thymeleaf 예제](/posts/thymeleaf-텍스트-표시하기/)

JSTL은 얼핏 보면 html 태그와 비슷하게 생겼으며, 일반 HTML 태그와 결합하여 리스트, 배열 등에 있는 자료를 반복하여 표시하는 데 특화되어 있습니다.  JSTL `Core` 라이브러리의 주요 함수만 알아도 웹 프로그래밍의 대부분의 작업을 처리할 수 있습니다.

선언은 JSP 파일 최상단에 다음과 같이 입력합니다. core 라이브러리

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
```

`prefix`는 바꿀 수도 있지만 기본 설정인 `c`를 사용하는 것을 추천합니다.

```java
// 예제를 위해 컨트롤러의 일부분 변경

// 1. 리스트(List)
List<String> list = new ArrayList<>();
String[] vege = new String[20];

for(int i = 0; i < 20; i++){
  list.add("과일" + (i + 1));
  vege[i] = "채소" + (i + 1);
}
// 리스트 길이를 JSP에서 구하려면 core가 아닌 별도 JSTL을 사용해야 하므로
// 여기서 미리 구해서 보냄
mav.addObject("listLength", list.size());
mav.addObject("vege", vege);
```

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>

(...생략...)

<body>
    <h3>JSTL - CHOOSE WHEN: IF ELSE와 동일</h3>
    <c:choose>
        <c:when test="${ 3 > 6 }">** 해당 test가 true라면 표시됨 1 **</c:when>
        <c:when test="${ 3 < 6 }">** 해당 test가 true라면 표시됨 2 **</c:when>
        <c:otherwise>** 위의 when이 전부 false인 경우 표시됨**</c:otherwise>
    </c:choose>
    
    <h3>JSTL - forEach 1: 숫자를 사용</h3>
    <c:forEach var="i" begin="1" end="10" step="1">
    ${ i }번째 반복 <c:if test="${ i eq 5 }"><br></c:if>
    </c:forEach>
    
    <h3>JSTL - forEach 2: 데이터(리스트 또는 배열)를 사용</h3>
    <c:forEach var="item" items="${ list }" varStatus="status">
    ${ item }
      <c:choose>
      	<c:when test="${ (status.index + 1) % 5 eq 0 }"><br></c:when>
      	<c:when test="${ status.index ne listLength }">, </c:when>
      </c:choose>
    </c:forEach> 
    
    <h3>JSTL - forEach 3: 데이터(맵)를 사용</h3>
    <table border=1>
   		<tr>
   			<th>키</th>
   			<th>값</th>
   		</tr>
    		
      <c:forEach var="item" items="${ map }">	
      	<tr>
      		<td>${item.key}</td>
      		<td>${item.value}</td>
      	<tr>
      </c:forEach> 
      
    </table>
    
    <h3>JSTL - forEach 복합: 여러 리스트를 한 번에 표시</h3>
    <table border=1>
   		<tr>
   			<th>과일</th>
   			<th>채소</th>
   		</tr>
   		
    	<c:forEach var="item" items="${ list }" varStatus="status">	
      	<tr>
      		<td>${item}</td>
      		<td>${vege[status.index]}</td>
      	<tr>
  </c:forEach> 
</body>
</html>
```

![](/assets/img/wp-content/uploads/2019/04/jstl2.png)
