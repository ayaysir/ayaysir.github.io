---
title: "Thymeleaf: 요소 반복하기 (th:each)"
date: 2019-11-28
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "thymeleaf"
---

[Thymeleaf  관련 글 보기](http://yoonbumtae.com/?tag=thymeleaf)

**Thymeleaf**에서 특정 요소를 `for`문처럼 반복하는 방법으로 **`th:each`**가 있습니다.

```
<table>
  <thead>
    <tr>
      <th>No.</th>
      <th>username</th>
      <th>title</th>
      <th>date</th>
    </tr>
  </thead>
  <tbody>
    ....................
  </tbody>
</table>

```

```
<tbody>
  <tr th:each="article, i: ${list}">
    <td th:text="${article.seq}"></td>
    <td th:text="${article.username}"></td>
    <td sec:authorize="isAuthenticated()">
      <a th:href="${'/board/read/' + article.seq}" th:text="${article.title}"></a>
      <span class="text-blue" th:if="${i.count eq i.size}">[1등]</span>
    </td>
    <td sec:authorize="!isAuthenticated()" th:text="${article.title}"></td>
    <td th:text="${article.writeDate}"></td>
  </tr>
</tbody>
```

이렇게 코드를 작성하면 `<tr>` 요소가 리스트 사이즈만큼 반복됩니다. 2라인에서 인덱스 부분인 두번째 변수 `i` 는 옵션입니다. 인덱스를 사용하지 않는다면 `th:each="article: ${list}"` 이렇게만 적어도 됩니다.

인덱스 변수는 `.index` / `.count` / `.size` 등의 기능이 있으며, `.index`는 0부터 시작, `.count`는 1부터 시작, `.size`는 리스트의 사이즈를 가져옵니다. 리스트의 맨 마지막을 순회할 때 동작을 지정하고 싶다면 `th:if="${i.count eq i.size}"`를 사용합니다.

![](./assets/img/wp-content/uploads/2019/11/스크린샷-2019-11-28-오후-5.57.42.png)

 

참고로 컨트롤러에서 넘어오는 `list` 변수는 아래와 같은 `List<Map<String, Object>>` 타입입니다.

```
@RequestMapping("/board")
public String board(Model model) {
  List<Map<String, Object>> list = [DAO를 통해 DB 테이블을 가져옴];
  
  model.addAttribute("list", list);
  return "simple-board";
}
```
