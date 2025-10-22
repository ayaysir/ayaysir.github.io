---
title: "CSS + 자바스크립트 예제: 스켈레톤 로딩(Skeleton Loading)"
date: 2022-04-28
categories: 
  - "DevLog"
  - "JavaScript"
---

### **스켈레톤 로딩(Skeleton Loading), 스켈레톤 스크린**

최근 여러 웹 사이트나 앱 등에서 유행하는 로딩 화면(프로그레시브 인디케이터)으로 스켈레톤 스크린이라는 것이 있습니다.

![](https://media.giphy.com/media/rzcouah3gAnJfwZzJ3/giphy.gif)

단순히 로딩 스피너나 막대기를 보여주는 대신, 화면의 레이아웃을 유지하면서 진행 상황을 표시하기 때문에 사용자의 입장에서 체감 로딩시간이 줄어든다는 장점이 있습니다.

 

#### **구현 단계**

실제 서비스에서는 훨씬 더 복잡하겠지만, 대략적인 구현 단계는 다음과 같습니다.

1. 사전에 컨텐츠가 몇 개 정도인지, 어떤 내용인지 미리 예측한다.
2. CSS를 이용해 컨텐츠 내용이 표시될 구역에 스켈레톤을 삽입한다.
3. 컨텐츠 로딩 부분을 구현하고 실행한다.
4. 컨텐츠 로딩이 완료되면 스켈레톤을 제거하고 내용을 표시한다.

 

#### **예제 소개**

이 예제에서는 [Reqres](https://resreq.in) 사이트에서 JSON 정보를 가져오겠습니다. 프로필 사진과 이름, 이메일 주소를 표시하는 간단한 예제입니다. 아래 스크린샷의 레이아웃을 기반으로 스켈레톤 로딩을 적용할 것입니다.

- [ResReq.api 사이트로 빠르고 편리하게 Restful API 테스트하기](http://yoonbumtae.com/?p=3725)

![](./assets/img/wp-content/uploads/2022/04/스크린샷-2022-04-29-오전-1.39.34.jpg)

 

#### **1) 사전에 컨텐츠가 몇 개 정도인지, 어떤 내용인지 미리 예측한다.**

컨텐츠의 내용, 개수 등을 미리 예측해 사이트의 레이아웃을 디자인합니다. 예측 방법은 API 문서나 JSON 등을 미리 봐서 파악하는 것 등이 있습니다. 또는 백엔드 측에서 지원이 가능하다면, 서버에서 컨텐츠의 개수만을 기록한 소형 사이즈의 JSON을 미리 먼저 전송해서 그 정보를 이용하고, 로딩 시간이 긴 내용이 담긴 JSON을 나중에 보내는 식으로 진행할 수도 있습니다.

 

예제에서 이용하는 JSON을 보면 어떤 페이지를 불러오더라도 무조건 페이지당 6개의 아이템만 불러오고, 아이템에는 사진 주소, 이름, 이메일 주소 등이 있다는 것을 알 수 있습니다. 이를 통해 최초에 페이지가 오픈될 시점에 레이아웃 상으로는 6개의 아이템에 대한 레이아웃이 보이도록 합니다.

[![](./assets/img/wp-content/uploads/2022/04/스크린샷-2022-04-29-오전-1.44.44.jpg)](http://yoonbumtae.com/?p=3725)

아이템의 정보를 표시할 HTML을 작성합니다.

```
<div id="container">
    <div class="article" data-seq="0">
        <img class="avatar skeleton" style="background-color: lightgray;">
        <div class="info">
            <div class="name skeleton text">이름</div>
            <div class="email skeleton text">이메일</div>
        </div>
    </div>
</div>

```

 

사전에 아이템 수가 6개라는 것을 확인했으므로, 자바스크립트를 이용해 위 `article` 클래스의 `div`를 복사해서 5개 추가합니다.

```
const jsonURL = `https://reqres.in/api/users?delay=${pseudoDelay}`

// API 문서에 의하면 1페이지당 6명의 유저 정보를 로딩한다고 한다.
// DOM을 6개 만들어놓기
let articleNode = document.querySelector(".article").cloneNode(true)
let container = document.querySelector("#container")
for(let i = 1; i < 6; i++) {
    let cloneNode = articleNode.cloneNode(true)
    cloneNode.dataset.seq = i
    container.appendChild(cloneNode)
}
```

 

여기까지 진행하면 아래와 같이 6개의 아이템 구역이 생성됩니다.

![](./assets/img/wp-content/uploads/2022/04/스크린샷-2022-04-29-오전-1.54.55.jpg)

 

#### **2) CSS를 이용해 컨텐츠 내용이 표시될 구역에 스켈레톤을 삽입한다.**

1번까지의 내용은 CSS가 적용되지 않았으므로 스켈레톤처럼 보이지 않습니다. CSS를 적용해서 스켈레톤 로딩처럼 보이도록 디자인을 조정합니다.

 

```
.info {
    width: 150px;
    margin-left: 10px;
}

.name {
    font-size: 20px;
    font-weight: bold;
}

.article {
    display: flex; 
    margin-bottom: 10px;
}

.avatar {
    width: 80px; 
    height: 80px;
    border-radius: 40px;
}

.skeleton.text {
    -webkit-clip-path: inset(2px 0 2px 0 round 3px 3px 3px 3px);
    clip-path: inset(2px 0 2px 0 round 3px 3px 3px 3px);
}

.skeleton {
    color: rgba(0,0,0,0);
    background-image: linear-gradient(270deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.1));
    background-size: 400% 100%;
    animation: skeleton-loading 8s ease-in-out infinite;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
```

- `.info` ~ `.avatar` 부분은 일반적인 내용의 CSS입니다.
    - `.info` 클래스에서 `width`를 `150px`로 지정하였습니다. JSON의 내용을 보면 사람들 대부분이 영문 이름이라는 것을 알 수 있습니다. 이를 감안해서 스켈레톤의 `width`가 평균적인 영문 이름 사이즈와 대략 일치하도록 미리 지정한 것입니다.
- `.skeleton`
    - `background-image` - 스켈레톤 부분은 희미한 회색의 선형 그라디언트입니다.
    - `background-size` - 스켈레톤 배경 그라디언트의 사이즈를 조정합니다. 가로축을 너무 작게 지정하면 디자인적으로 보기 안좋은 경우가 있으므로 적절하게 조정합니다.
    - `animation:` `skeleton-loading`이라는 이름의 키프레임을  `8s` 초동안  `ease-in-out` 방식으로 무한 반복(`infinite`)한다는 뜻입니다. `ease-in-out`은 애니메이션의 진행 속도와 관련된 내용으로 디자인과 관련된 전문적 지식이 필요하기 때문에 여기서 다루지는 못하고, 문단 밑의 움짤을 보면 대략적으로 이해가 될 것이라 생각됩니다.
- `@keyframes skeleton-loading`는 애니메이션 진행 위치를 지정하는 부분입니다.
- `.skeleton.text`의 `clip-path`는 텍스트 표시 부분에서 스켈레톤이 다른 부분과 겹쳐서 영역이 구분되지 못하는 것을 방지하는 역할을 합니다.
    - `clip-path`에 대한 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/CSS/clip-path)
    - `inset`에 대한 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/CSS/basic-shape#%ED%98%95%ED%83%9C_%ED%95%A8%EC%88%98)

![](https://media.giphy.com/media/vTQcfpCeXHu12Iv7s5/giphy.gif)

 

CSS 를 적용했다면 아래와 같이 스켈레톤이 적용된 모습을 볼 수 있습니다.

![](./assets/img/wp-content/uploads/2022/04/스크린샷-2022-04-29-오전-2.32.38.jpg)

 

#### **3) 컨텐츠 로딩 부분을 구현하고 실행한다.**

자바스크립트를 이용해 JSON을 비동기식으로 불러오고, 로딩이 끝나면 HTML 클래스 리스트에서 skeleton 및 관련 클래스를 제거하면 스켈레톤 로딩 화면이 완성됩니다.

일반적인 환경에서 예제 JSON 정도의 데이터 양에서 로딩 시간이 걸릴 일이 없으므로, 고의적으로 딜레이를 5~10초간 걸어서 로딩이 이루어지도록 하겠습니다.

```
// 초기 이미지 배경 삭제 (스켈레톤과 겹쳐 보이는 것을 방지해기 위해)
document.querySelector(".avatar").style.backgroundColor = null

const pseudoDelay = prompt("딜레이 몇초?")
document.querySelector("#pseudo-delay").textContent = pseudoDelay

const jsonURL = `https://reqres.in/api/users?delay=${pseudoDelay}`

// API 문서에 의하면 1페이지당 6명의 유저 정보를 로딩한다고 한다.
// DOM을 6개 만들어놓기 (생략)

// JSON을 가져오는 함수
async function fetchData() {
    try {
        const init = await fetch(jsonURL, {
            method: "get"
        })
        const fetchedJSON = await init.json()
        render(fetchedJSON) // 데이터 로딩이 완료되면 HTML 요소에 데이터를 추가한다.
    } catch (error) {
        console.error(error)
    }
}

// HTML에 데이터를 추가하는 함수
// (밑에 있음)

// 데이터 가져오기 실행
fetchData()
```

- 데이터는 `async` ~ `await`를 이용한 `fetch` 로 가져옵니다.
    - [자바스크립트: Fetch (외부 라이브러리 없이 AJAX 사용)](http://yoonbumtae.com/?p=2388)
- `?delay=${pseudoDelay}` - Reqres 사이트의 딜레이 기능을 이용해 고의적으로 딜레이를 초 단위로 부여합니다.

 

 

#### **4) 컨텐츠 로딩이 완료되면 스켈레톤을 제거하고 내용을 표시한다.**

```
// HTML에 데이터를 추가하는 함수
function render(fetchedJSON) {

    let articleNodes = document.querySelectorAll("#container .article")
    
    fetchedJSON.data.forEach((value, index) => {
        
        let node = articleNodes[index]
        
        let nameField = node.querySelector(".name")
        nameField.textContent = `${value.first_name} ${value.last_name}`
        // 스켈레톤 관련 클래스를 제거
        nameField.classList.remove("skeleton")
        
        let emailField = node.querySelector(".email")
        emailField.textContent = value.email
        // 스켈레톤 관련 클래스를 제거
        emailField.classList.remove("skeleton")
        
        let avatarField = node.querySelector(".avatar")
        avatarField.src = value.avatar
        // 스켈레톤 관련 클래스를 제거
        avatarField.classList.remove("skeleton")
        
    })
}
```

- 데이터 로딩이 완료되고 그 데이터를 HTML에 추가하였다면 모든 로딩 작업이 끝났으므로 요소의 클래스 리스트에서 스켈레톤 관련 부분을 제거합니다.

JS JavaScript 자바스크립트 스켈레톤 디자인 스켈레톤 로딩 스크린 스켈레톤 Skeleton 유튜브 트위터 깃허브 로딩 최신 유행 로딩 프로그레시브 인디케이터 트렌드 최근 유행 로딩

최종 완성 결과는 다음과 같습니다.

http://www.giphy.com/gifs/ozJqA8ttPL6yse1yca
