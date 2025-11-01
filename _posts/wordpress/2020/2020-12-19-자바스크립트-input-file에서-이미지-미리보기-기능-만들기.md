---
title: "자바스크립트: input file에서 이미지 미리보기 기능 만들기 (한 개, 여러 개)"
date: 2020-12-19
categories: 
  - "DevLog"
  - "JavaScript"
---

#### **1) 이미지가 1개인 경우**

미리보기 이미지가 표시될 이미지 태그를 생성하고, `input file` 태그를 생성하고, 자바스크립트의 `FileReader()`를 통해 이미지가 로딩되면 이미지 태그의 `src` 속성이 교체되도록 합니다.

```
<div class="image-container">
    <img style="width: 500px;" id="preview-image" src="https://dummyimage.com/500x500/ffffff/000000.png&text=preview+image">
    <input style="display: block;" type="file" id="input-image">
</div>
```

```
function readImage(input) {

    // 인풋 태그에 파일이 있는 경우
    if(input.files && input.files[0]) {

        // 이미지 파일인지 검사 (생략)

        // FileReader 인스턴스 생성
        const reader = new FileReader()

        // 이미지가 로드가 된 경우
        reader.onload = e => {
            const previewImage = document.getElementById("preview-image")
            previewImage.src = e.target.result
        }

        // reader가 이미지 읽도록 하기
        reader.readAsDataURL(input.files[0])
    }
}

// input file에 change 이벤트 부여
const inputImage = document.getElementById("input-image")
inputImage.addEventListener("change", e => {
    readImage(e.target)
})
```

\[caption id="attachment\_3305" align="alignnone" width="479"\] ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-19-오후-1.09.58.png) 초기 화면\[/caption\]

 

\[caption id="attachment\_3306" align="alignnone" width="534"\] ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-19-오후-1.10.31.png) 이미지 파일을 선택한 경우\[/caption\]

 

 

#### **2) 이미지가 여러 개인 경우**

먼저 `iput file` 태그에 `multiple` 속성을 추가해 여러 이미지가 추가될 수 있도록 합니다. 다음 파일 배열(`FileList`)을 반복문을 돌려서 이미지 요소를 추가합니다. 이 때, `reader.onload`의 콜백 함수 안에 HTML 요소를 생성하거나 `appendChild` 하는 코드를 추가하지 않아야 합니다. 왜냐하면 이 콜백 함수는 비동기로 실행되므로 여기 안에서 HTML 처리를 하면 `FileList` 배열에 저장된 파일 순서와 렌더링되는 파일 순서가 같다는 것을 보장할 수 없기 때문입니다. 이미지 요소를 반복문에서 설정하고, 이미지가 로딩되면 그 콜백 함수에서 `src`를 바꾸는 방식으로 작성합니다.

```
#multiple-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.image {
    display: block;
    width: 100%;
}
.image-label {
    position: relative;
    bottom: 22px;
    left: 5px;
    color: white;
    text-shadow: 2px 2px 2px black;
}
```

참고: [html - CSS 그리드, 이미지 삽입시 아래쪽 여백](https://www.python2.net/questions-17934.htm)

 

```
<input style="display: block;" type="file" id="input-multiple-image" multiple>
<div id="multiple-container">
</div>
```

```
function readMultipleImage(input) {

    const multipleContainer = document.getElementById("multiple-container")
    
    // 인풋 태그에 파일들이 있는 경우
    if(input.files) {
        // 이미지 파일 검사 (생략)

        console.log(input.files)

        // 유사배열을 배열로 변환 (forEach문으로 처리하기 위해)
        const fileArr = Array.from(input.files)

        const $colDiv1 = document.createElement("div")
        const $colDiv2 = document.createElement("div")
        $colDiv1.classList.add("column")
        $colDiv2.classList.add("column")

        fileArr.forEach((file, index) => {
            const reader = new FileReader()

            const $imgDiv = document.createElement("div")   
            const $img = document.createElement("img")
            $img.classList.add("image")

            const $label = document.createElement("label")
            $label.classList.add("image-label")
            $label.textContent = file.name

            $imgDiv.appendChild($img)
            $imgDiv.appendChild($label)

            reader.onload = e => {
                $img.src = e.target.result
                
                $imgDiv.style.width = ($img.naturalWidth) * 0.2 + "px"
                $imgDiv.style.height = ($img.naturalHeight) * 0.2 + "px"
            }
            
            console.log(file.name)
            if(index % 2 == 0) {
                $colDiv1.appendChild($imgDiv)
            } else {
                $colDiv2.appendChild($imgDiv)
            }
            
            reader.readAsDataURL(file)
        })

        multipleContainer.appendChild($colDiv1)
        multipleContainer.appendChild($colDiv2)

    }
}

const inputMultipleImage = document.getElementById("input-multiple-image")
inputMultipleImage.addEventListener("change", e => {
    readMultipleImage(e.target)
})
```

 ![](/assets/img/wp-content/uploads/2020/12/스크린샷-2020-12-19-오후-2.47.17.jpg)
