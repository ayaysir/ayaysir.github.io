---
title: "MD(마크다운 Markdown) 이미지 넣기"
date: 2022-04-10
categories: 
  - "DevLog"
  - "Markdown"
---

### **MD(마크다운 Markdown) 이미지 넣기**

`alt text` - 대체 텍스트 (이미지가 나오지 않을 경우 대체할 텍스트 또는 이미지에 대한 설명, 비워도 무방)

```
![alt text](http://url/to/img.png)
```

 

이미지가 md와 같은 폴더에 있는 경우 `./파일이름`  형식 사용합니다.

```
![alt text](./image.jpg)
```

이미지 파일이 저장소에 저장되어 있는 경우 이미지의 raw 주소를 직접 사용할 수도 있습니다.

```
![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)
```

 

또는 다음 주소 사용 가능합니다.

```
![alt text](https://raw.githubusercontent.com/[username]/[reponame]/[branch]/image.jpg)
```

 

참고로 이미지 경로에 띄어쓰기 등이 있다면 이미지가 보이지 않고 코드가 깨지므로 `%20` 등의 인코딩 주소로 대체해야 합니다.

마크다운 MD md 이미지 그림 파일 이미지 md markdown Markdown image file
