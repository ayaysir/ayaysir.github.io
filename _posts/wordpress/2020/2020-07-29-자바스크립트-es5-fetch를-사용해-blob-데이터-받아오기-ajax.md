---
title: "자바스크립트 ES6+: fetch를 사용해 blob 데이터 받아오기 (AJAX)"
date: 2020-07-29
categories: 
  - "DevLog"
  - "JavaScript"
---

`fetch`를 이용하면 매우 간단하게 `Blob` 형태의 데이터를 받을 수 있습니다. `await` 키워드는 `blob` 변수를 최초 사용할 때까지만 사용하면 됩니다(`await blob`).

파일을 전송하는 백엔드 서버(자바 스프링) 만드는 방법은 아래 글을 참고하세요. 그리고 구버전 자바스크립트에서도 사용 가능한 `XMLHttpRequest`를 사용해 `Blob` 데이터를 받아오는 방법도 첨부합니다.

- [JSP, Spring: URL을 입력하면 파일이 바로 다운로드되게 하기](/posts/jsp-spring-url을-입력하면-파일이-바로-다운로드되게-하기/)
- [자바스크립트: AJAX로 blob 타입의 리스폰스 가져오기(파일 다운로드)](/posts/자바스크립트-ajax로-blob-타입의-리스폰스-가져오기파일/)

 

```js
async function get() {
  const init = await fetch(`/api/file/download-url`, {method: "get"})
  const blob = await init.blob()

  // use blob ... (await 키워드 사용)

  // *** 예제: 함수가 실행되면 파일 다운로드 바로 되게 ***

  // 파일이름 가져오기
  const disposition = init.headers.get("content-disposition")

  let fileName = "file"
  if(disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    const matches = filenameRegex.exec(disposition)

    if (matches != null && matches[1]) {
      fileName = matches[1].replace(/['"]/g, '')
    } 
  }
    
  // 가상 링크 DOM 만들어서 다운로드 실행
  const url = URL.createObjectURL(await blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
}

get()
```
