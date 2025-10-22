---
title: "스프링 부트(Spring Boot): 파일 업로드 처리하기 (한 개, 여러 개)"
date: 2020-08-01
categories: 
  - "DevLog"
  - "Spring/JSP"
---

업로드한 파일을 컨트롤러에서 처리하고자 할 때에는 `MultipartFile`을 이용합니다. 파일이 하나인 경우는 `MultipartFile`을 변수 타입으로 하고 여러 개인 경우 `List<MultipartFile>`을 변수 타입으로 합니다.

 

#### **HTML**

```
<form method="post" action="/[업로드할_컨트롤러_주소]" enctype="multipart/form-data">
    <input multiple type="file" name="files">
    <button>submit</button>
</form>
```

`<form>` 태그에 `enctype="multipart/form-data"`를 추가합니다. `<input>`에서 `multiple`이 있으면 여러 파일 업로드 허용, 없으면 하나의 파일만 허용합니다.

 

#### **단일 파일 업로드**

```
import org.springframework.web.multipart.MultipartFile; 

import javax.swing.filechooser.FileSystemView; 
import java.io.File; 

// .......
// 컨트롤러 내부에 위치

@PostMapping(DEFAULT_URI + "/single")
public String uploadSingle(@RequestParam("files") MultipartFile file) throws Exception {
    String rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
    String basePath = rootPath + "/" + "single";

    String filePath = basePath + "/" + file.getOriginalFilename();

    File dest = new File(filePath);
    files.transferTo(dest); // 파일 업로드 작업 수행

    return "uploaded";

}
```

 

#### **여러 파일 업로드**

```
import org.springframework.web.multipart.MultipartFile; 

import javax.swing.filechooser.FileSystemView; 
import java.io.File; 
import java.util.List;

// .......
// 컨트롤러 내부에 위치

@PostMapping(DEFAULT_URI + "/multi")
public String uploadMulti(@RequestParam("files") List<MultipartFile> files) throws Exception {

    String rootPath = FileSystemView.getFileSystemView().getHomeDirectory().toString();
    String basePath = rootPath + "/" + "multi";

    // 파일 업로드(여러개) 처리 부분
    for(MultipartFile file : files) {

        String originalName = file.getOriginalFilename();
        String filePath = basePath + "/" + originalName;

        File dest = new File(filePath);
        file.transferTo(dest);

    }

    return "uploaded";

}
```
