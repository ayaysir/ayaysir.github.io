---
title: "Java, Spring Boot 예제: 이미지를 클라이언트로부터 받아 파워포인트로 만들기"
date: 2019-02-18
categories: 
  - "DevLog"
  - "Java"
  - "Spring/JSP"
tags: 
  - "spring-boot"
---

#### 작업순서는 다음과 같습니다.

1. 사용자(클라이언트, 크롬 등 웹브라우저 이용하는 사람)는 이미지파일을 브라우저에서 업로드한다.
2. 서버에서 그 이미지를 받아서 파워포인트 파일에 삽입한다.
3. 만들어진 파워포인트 파일을 다시 사용자한테 반환한다. 사용자는 다운로드 받을 수 있다.

 

파워포인트는 `org.apache.poi` 라는 라이브러리를 사용해 만들 수 있으며 `depency`는 다음과 같습니다.

```
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>3.17</version>
</dependency>
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>3.17</version>
</dependency>
```

코드는 다음과 같습니다. 이미지 업로드 과정 일부는 예전 글([링크](http://yoonbumtae.com/?p=684))에서 설명하고 있으니 참고해주세요. PPT 관련 부분은 `createPptx` 메소드에 있습니다.

```
package com.example.thymeleaf;

import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URLEncoder;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.sl.usermodel.PictureData.PictureType;
import org.apache.poi.xslf.usermodel.SlideLayout;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFAutoShape;
import org.apache.poi.xslf.usermodel.XSLFPictureData;
import org.apache.poi.xslf.usermodel.XSLFPictureShape;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFSlideLayout;
import org.apache.poi.xslf.usermodel.XSLFSlideMaster;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class OfficeController {
    
  @RequestMapping("imgToPptx")
  public String imgToPptx() {
    return "imgToPptx";
  }
  
  @RequestMapping("sendImg")
  @ResponseBody
  public void imageHandler(MultipartFile[] imgFile, 
HttpServletResponse res, HttpServletRequest req) throws Exception { 
    System.out.println(imgFile.length);

    File f = 
        createPptx(imgFile[0].getOriginalFilename(), imgFile[0].getBytes(), imgFile[0].getContentType());
    String downloadName = null;
    String browser = req.getHeader("User-Agent");
    //파일 인코딩
    if(browser.contains("MSIE") || browser.contains("Trident") 
|| browser.contains("Chrome")){
      //브라우저 확인 파일명 encode  		             
      downloadName = URLEncoder.encode(f.getName(), "UTF-8").replaceAll("\\+", "%20");		             
    }else{		             
      downloadName = new String(f.getName().getBytes("UTF-8"), "ISO-8859-1");

    }        
    res.setHeader("Content-Disposition", "attachment;filename=\"" + downloadName +"\"");             
    res.setContentType("application/octer-stream");
    res.setHeader("Content-Transfer-Encoding", "binary;");

    try(FileInputStream fis = new FileInputStream(f);
        ServletOutputStream sos = res.getOutputStream();	){

      byte[] b = new byte[1024];
      int data = 0;

      while((data=(fis.read(b, 0, b.length))) != -1){		             
        sos.write(b, 0, data);		             
      }

      sos.flush();
    } catch(Exception e) {
      throw e;
    }
  }
  
  private File createPptx(String title, byte[] pictureData, String fileType) 
throws Exception {
    // 1. 슬라이드 파일 생성
    XMLSlideShow ppt = new XMLSlideShow();
    ppt.createSlide();
    
    // 2. 슬라이드 생성
    XSLFSlideMaster defaultMaster = ppt.getSlideMasters().get(0);
    
    XSLFSlideLayout layout 
      = defaultMaster.getLayout(SlideLayout.TITLE_AND_CONTENT);
    XSLFSlide slide = ppt.createSlide(layout);
    
    // 3. slide에서 제목 변경
    XSLFTextShape titleShape = slide.getPlaceholder(0);
    titleShape.setText(title);
    
    // 4-1. 이미지 정보 (가로세로 픽셀)
    InputStream in = new ByteArrayInputStream(pictureData);
    BufferedImage bi = ImageIO.read(in);
    // ColorModel model = bi.getColorModel();
    int height = bi.getHeight();
    int width = bi.getWidth();
    System.out.println(fileType);

    PictureType pictureType = null;
    switch(fileType) {
    case "image/png": 
      pictureType = PictureType.PNG;
      break;
    case "image/jpg":
    case "image/jpeg":
      pictureType = PictureType.JPEG;
      break;
    case "image/gif":
      pictureType = PictureType.GIF;
      break;
    case "image/bmp":
      pictureType = PictureType.BMP;
    }		  
    
    // 4-1. 이미지 삽입
    XSLFPictureData pd = ppt.addPicture(pictureData, pictureType);
    XSLFPictureShape picture = slide.createPicture(pd);
    System.out.println(slide.getPlaceholder(1).getAnchor());
    
    Rectangle2D anc = slide.getPlaceholder(1).getAnchor();
    anc.setRect(anc.getX(), anc.getY(), width * 356 / height , 356);
    picture.setAnchor(anc);				

    
    // 5. 기타 작업
    for (XSLFShape shape : slide.getShapes()) {
        if (shape instanceof XSLFAutoShape) {
            System.out.println(shape.getShapeId() + ": " 
+ ((XSLFAutoShape) shape).getText());
            if(shape.getShapeId() == 3) {
            	slide.removeShape(shape);
            }
        }
    }

    // 맨 첫 번째 슬라이드 삭제
    ppt.removeSlide(0);
    
    FileOutputStream out = new FileOutputStream(title + ".pptx");
    ppt.write(out);
    out.close();
    ppt.close();
    
    return new File(title + ".pptx");
    
  }
}

```

 

**스프링 부트**에서는 프론트엔드 측에서 `form`의 `enctype`을 `multipart/form-data` 로 지정하고, 받는 쪽 컨트롤러에서 `MultipartFile[]`로 지정하면 간편하게 파일을 업로드할 수 있습니다.

```
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Img Upload</title>
</head>
<body>
  <form method=post action=sendImg enctype=multipart/form-data>		
    <div>
      <input type=file name=imgFile id=imgHandler>
      <button>전송</button>
    </div>
    <div>		
      <img id=previewImg width=500px>
    </div>
    
  </form>
  <script>
    var loadFile = (ev) => {
      var output = document.getElementById('previewImg')
      output.src = URL.createObjectURL(ev.target.files[0])
    } 
    
    document.getElementById("imgHandler").onchange = loadFile
  </script>
</body>
</html>
```

 ![](/assets/img/wp-content/uploads/2019/02/iu1-e1572710217705.png)

 ![](/assets/img/wp-content/uploads/2019/02/iu22.png)
