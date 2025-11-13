---
title: "자바스크립트: 테이블의 tbody 내용 뒤집기(reverse)"
date: 2020-08-17
categories: 
  - "DevLog"
  - "JavaScript"
---

자바스크립트로 테이블을 역순으로 정렬하는 예제입니다. 참고로 테이블을 작성할 시에는 `<table>` 태그 밑에 `<thead>`와 `<tbody>`로 제목 부분과 내용 부분을 나누는 것이 관리 측면에 좋습니다.

DOM 배열은 `forEach`등을 사용할 수 없으므로 `Array.from($domArrr)`로 `forEach` 등을 사용할 수 있는 배열로 변환합니다. 이것을 `reverse()`한 다음에 다시 테이블 `<tbody>` 밑에 `append`하면 됩니다. 그리고 `reverse()`를 `sort()`로 바꾸면 단순히 순서를 바꾸는 것 뿐만 아니라 특정 조건에 의한 정렬도 가능합니다.

```
<table class="table table-hover" id="table-info">
    <thead>
        <tr class="head-title">
            <th scope="col">ID</th>
            <th scope="col">제목</th>
            <th scope="col">업로더</th>
        </tr>
    </thead>
    <tbody id="table-info-tbody">
        .......tr 및 td.......
    </tbody>
</table>
```

 

```
document.querySelector("#table-info .head-title").addEventListener("click", e => {
    const $trArr = document.querySelectorAll("#table-info tbody tr")
    const $tbody = document.querySelector("#table-info tbody")
    $tbody.innerHTML = ""
    Array.from($trArr).reverse().forEach((el, i) => {
        $tbody.append(el)
    })
})
```

[예제 사이트에서 보기](http://awsboard.yoonbumtae.com:9090/midi) (제목바를 누르면 순서가 오름차순/내림차순으로 토글됩니다.)

 

\[caption id="attachment\_2902" align="alignnone" width="748"\] ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-17-pm-10.37.14.png) 정렬 전\[/caption\]

 

\[caption id="attachment\_2903" align="alignnone" width="753"\] ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-17-pm-10.38.48.png) 정렬 후\[/caption\]
