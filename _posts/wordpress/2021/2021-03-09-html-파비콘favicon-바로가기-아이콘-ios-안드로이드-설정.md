---
title: "HTML: 파비콘(favicon), 바로가기 아이콘 (iOS, 안드로이드) 설정"
date: 2021-03-09
categories: 
  - "DevLog"
  - "JavaScript"
---

## **설정하기**

이미지 또는 아이콘 파일을 준비한 다음, `header` 태그에 다음 부분을 설정합니다. `href` 부분에 파일 경로를 입력합니다.

```html
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
  <link rel="shortcut icon" href="<%= BASE_URL %>logo.png">
  <link rel="apple-touch-icon" href="<%= BASE_URL %>logo.png">

  <title><%= htmlWebpackPlugin.options.title %></title>
</head>
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-09-pm-11.21.31.png)

- `rel="icon"` 부분은 파비콘(favicon)을 설정합니다. 파비콘은 크롬 기준으로 탭 아이콘을 말합니다.
    - 사이즈는 일반적으로 `32 * 32` 픽셀을 기준으로 합니다.
    - 웹 서버의 루트 디렉토리에 `favicon.ico` 파일이 있는 경우 크롬 브라우저 등에서는 별도로 설정을 하지 않더라도 자동 표시됩니다.
- 나머지 부분은 안드로이드와 iOS의 즐겨찾기 아이콘 및 홈 바로가기 기능을 위한 아이콘입니다.
    - 고해상도 아이콘을 위해선 최소 `144 * 144` 픽셀 이상의 이미지 파일을 필요로 합니다.
    - PNG 파일 사용을 권장합니다. (JPG 사용시 일부 기기에서 오류가 발생할 수 있음)

 

## **파비콘 크기별로 다르게 설정하기**

```
<link rel="icon" href="favicon-16.png" sizes="16x16"> 
<link rel="icon" href="favicon-32.png" sizes="32x32"> 
<link rel="icon" href="favicon-48.png" sizes="48x48"> 
<link rel="icon" href="favicon-64.png" sizes="64x64"> 
<link rel="icon" href="favicon-128.png" sizes="128x128">
```

 

## **참고**

- [Why use <link rel=“apple-touch-icon image\_src” …>?](https://stackoverflow.com/questions/20440512/why-use-link-rel-apple-touch-icon-image-src)
- [파비콘(Favicon)의 모든 것](https://webdir.tistory.com/337)
