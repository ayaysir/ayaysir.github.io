---
title: "Spring: AJAX로 백엔드 컨트롤러에 이미지 전송"
date: 2019-05-29
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring"
---

## 컨트롤러 (일부)

```java
@RequestMapping(value = "/url", method = RequestMethod.POST)
public String insert(MultipartHttpServletRequest request, HttpSession session, ModelMap model) throws Exception {

  String rootPath = session.getServletContext().getRealPath("/");
  System.out.println("imageFile " + request + " " + request.getParameter("imgFile") + " " + rootPath + " ");

  Iterator<String> itr =  request.getFileNames();
  if(itr.hasNext()){
    List<MultipartFile> mpf = request.getFiles(itr.next().toString());
    for(int i = 0; i < mpf.size(); i++)
    { 
      
      File file = new File(rootPath + "/" + mpf.get(i).getOriginalFilename());
      mpf.get(i).transferTo(file);
    }
  }
    
  (...)

  return "response..";
}	

```

- `HttpServletRequest` 대신 **`MultipartHttpServletRequest` 을 사용합니다.** 
- 값을 받을 때는 attribute가 아닌 `request.getParameter(x)` 를 사용합니다.

 

## HTML (일부)

```html
<form id="frm" method="post" enctype="multipart/form-data">
  <input class="field-title" type="text" name="title">
  <textarea class="field-description" rows="3" name="desc"></textarea>
  <input type="file" class="select" name="imgFile">
</form>
```

- `method="post"`, `enctype="multipart/form-data"` 을 각각 지정합니다.

 

## 자바스크립트(일부, JQuery 포함)

```js
$(".submit-btn").click(function() {
  var frm = document.getElementById("frm")
  var fd = new FormData(frm);
  	
   $.ajax({
      url: "/sendUrl",
      data: fd,
      processData: false,
      contentType: false, 
      type: 'POST',
      success: function(res){
      	console.log(res)
      }
    });\
})
```

- `data`에는 `FormData`를 지정하고, `processData: false`, `contentType: false`, `type: 'POST'`로 지정합니다.
