---
title: "Spring, JSTL: div 태그로 이루어진 이중 반복문 사용하기 (특정 개수별 구분)"
date: 2019-06-26
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring"
---

예를 들어 15개마다 줄바꿈이 되는 이런 모양의 웹 페이지를 만들고 싶은데, 사용 태그가 `div`라면

 ![](/assets/img/wp-content/uploads/2019/06/per15.png)

HTML 페이지는 이런 형태가 될 것입니다.

```
<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>

<style>
  .list {
    display: inline-block
  }

  .list>div {
    margin: 10px;
    background-color: antiquewhite
  }

</style>

<body>
  <div class="list">
    <!-- max 15 -->
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
  </div>
  <div class="list">
    <!-- max 15 -->
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
  </div>
  <div class="list">
    <!-- max 15 -->
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
    <div> ...... </div>
  </div>
</body>

</html>
```

이것을 스프링에서 단순 리스트를 이러한 형태로 표시하고 싶고 JSTL로 구현한다고 할 때, 이중 반복문을 사용해야 합니다. 다만 이 경우는 `div` 태그로 바깥에서 열고 닫고 하는 형태이기 때문에 일반적인 이중 반복문보다는 더 추가해야할 내용이 있습니다.

이것을 JSTL로 구현한다고 가정하면 다음과 같습니다.

```
<c:forEach var="item" items="${ list }" varStatus="status">
  <c:if test="${ status.index % 15 eq 0 }">
    <div class="list">
      <c:forEach var="j" begin="${ status.index }" end="${ status.index + (15 - 1) }" step="1">
        <c:if test="${ list[j] ne null }">
          <div> ${ list[j] } </div>
        </c:if>
      </c:forEach>
    </div>
  </c:if>
</c:forEach>
```

위에서 바깥 `div`인 `div.list` 의 위치에 신경써야 합니다. 내부 `for`문의 바깥에 위치시킵니다. `ul` `li` 등의 태그에도 적용 가능합니다.
