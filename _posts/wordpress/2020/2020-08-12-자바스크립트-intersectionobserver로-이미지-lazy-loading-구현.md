---
title: "자바스크립트: IntersectionObserver (1) 이미지 lazy-loading 구현"
date: 2020-08-12
categories: 
  - "DevLog"
  - "JavaScript"
---

출처 [바로가기](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)

일반적인 HTML 문서에서 `<img src="...">`를 사용하면 브라우저는 일괄적으로 이미지 로딩을 시도하게 됩니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <img src=".../img/Chrysanthemum.jpg" alt="">
    <img src=".../img/Desert.jpg" alt="">
    <img src=".../img/Hydrangeas.jpg" alt="">
    <img src=".../img/Jellyfish.jpg" alt="">
    <img src=".../img/Koala.jpg" alt="">
    <img src=".../img/Lighthouse.jpg" alt="">
    <img src=".../img/Penguins.jpg" alt="">
    <img src=".../img/Tulips.jpg" alt="">
</body>
</html>
```

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-12-pm-2.00.47.png)

위의 개발자 도구를 보면, 스크롤을 전혀 하지 않았음에도 불구하고 첫 번째 사진인 `국화.jpg`와 마지막 사진인 `튤립.jpg`의 리퀘스트 요청 시간이 거의 비슷하며, 국화 외의 사진은 아직 보이지 않는데도 벌써 데이터를 전부 로딩한 모습을 볼 수 있습니다. (로딩 타이밍은 Waterfall 그래프를 보면 됩니다.)

이미지의 **Lazy-loading**은 이러한 이미지의 로딩을 원하는 타이밍으로 지연시키는 기법을 말합니다. 여러 방법이 있지만, 여기서는 `IntersectionObserver`를 이용하여 구현해 보겠습니다.

 

#### **IntersectionObserver**

IntersectionObserver API는 상위 요소 또는 최상위 문서의 뷰포트와 대상 요소의 교차 영역(intersection)에서 발생하는 변경 사항을 비동기식으로 관찰하는 방법을 제공하는 API 입니다.

사용 방법은 다음과 같습니다,

```
let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0
}

let observer = new IntersectionObserver(callback, options);
```

- `root` - 교차 영역의 기준이 되는 루트 요소입니다.. 기본값은 `null` (=브라우저의 뷰포트).
- `rootMargin` - `root` 영역을 늘리거나 줄일 수 있음. 기본값은 `0`.
- `threshold` - `root`와 타깃 요소의 교차 영역 비율(intersection ratio)을 지정합니다.. 단일값 혹은 배열입니다. threshold. 값이 될때마다 콜백 함수가 실행됩니다. 기본값은 `0`.

`root` 와 대상 요소가 교차하는 정도를 **intersection ratio** 라고 합니다. 이것은 대상 요소의 가시성 퍼센티지를 `0.0` ~ `1.0`의 숫자로 표현합니다.

 ![](/assets/img/wp-content/uploads/2020/08/intersectratio.png)

콜백 함수는 일반적으로 다음과 같이 작성합니다.

```js
const callback = (entries, observer) => {

  // IntersectionObserverEntry 객체 리스트와 observer 본인(self)를 받음
  // 동작을 원하는 것 작성
  entries.forEach(entry => {
    // entry와 observer 출력
    console.log('entry:', entry);
    console.log('observer:', observer);
  })
}
```

- `entries`: [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 객체의 리스트. 배열 형식으로 반환하기 때문에 forEach를 사용해서 처리를 하거나, 단일 타겟의 경우 배열인 점을 고려해서 코드를 작성해야 합니다.
- `observer`: 콜백함수가 호출되는 `IntersectionObserver`
- **메소드**
    - `IntersectionObserver.observe(targetElement)` - 특정 요소의 교차 영역 관찰을 시작할 때 사용합니다.
    - `IntersectionObserver.unobserve(targetElement)` - 특정 요소의 교차 영역 관찰을 중지할 때 사용합니다.
    - `IntersectionObserver.disconnect()` - 현재 관측되고 있는 모든 요소의 관찰을 중지할 때 사용합니다.
    - `IntersectionObserver.takerecords()` - `IntersectionObserverEntry` 객체의 배열을 리턴합니다.

 

#### **Lazy-loading 예제**

첫 HTML 예제를 lazy-loading을 적용하면 다음과 같습니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Chrysanthemum.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Desert.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Hydrangeas.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Jellyfish.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Koala.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Lighthouse.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Penguins.jpg" alt="">
    <img class="lazy-img" src="./loading.jpg" data-src=".../img/Tulips.jpg" alt="">

    <script>
        .......
    </script>
</body></html>
```

```
// onload는 페이지의 모든 리소스가 로드 완료되었을 때 실행된다.
window.onload = () => {

    const observerOption = {
        root: null,
        rootMargin: "0px 0px 30px 0px",
        threshold: 0.2
    }

    // IntersectionObserver 인스턴스 생성
    const io = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            // entry.isIntersecting: 특정 요소가 뷰포트와 20%(threshold 0.2) 교차되었으면
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src
                observer.unobserve(entry.target)    // entry.target에 대해 관찰 종료
            }
        })
    }, observerOption)

    // lazy-img 클래스 요소 순회
    const lazyImgs = document.querySelectorAll(".lazy-img")
    lazyImgs.forEach(el => {
        io.observe(el)  // el에 대하여 관측 시작
    })

}
```

기존 코드에서 `<img>`에 `lazy-img` 클래스를 추가한 후, `src`는 `data-src`로 교체하였습니다. 이렇게 하면 나중에 `dataset`으로 주소값을 가져올 수 있습니다. 그리고 충분한 화면 사이즈의 로딩 이미지를 `src`에 기본 배정했습니다.

`IntersectionObserver` 인스턴스를 생성한 후, `querySelectorAll`을 통해 `lazy-img` 클래스의 요소 배열을 가져오고, 그 배열을 순회하면서 배열 내 요소에 대해 관측을 시작합니다. 관측시 교차 영역이 20% 이상이 되었으면 (`entry.isIntersecting`) 그 요소의 `src`를 `dataset.src`에서 가져와 교체한 뒤 관측을 종료합니다.

 

이렇게 하면 이미지의 lazy-loading을 구현할 수 있습니다. 일부러 스크롤을 느리게 해 순차적으로 이미지가 로딩되도록 하였습니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-12-pm-1.59.45.png)

#### **고려 사항**

lazy-loading 적용 시 몇 가지 고려할 사항이 있습니다. 먼저 화면에서 상당 비중을 차지하는 기존 컨텐츠가 있어야 합니다. 만약 기본 컨텐츠가 부족하다면, 개별적으로 로딩 이미지를 부여하거나, 이미지의 대략적인 크기라도 알아서 `div` 컨테이너에 `height`값을 미리 배정하는 등 사전 준비가 되어 있어야 합니다.

왜냐하면 `<img>` 태그는 `width`나 `height`가 미리 설정되어 있지 않다면 이미지가 로딩 완료되기 전에는 단순한 가로세로 0픽셀의 요소이기 때문입니다.

처음 HTML을 불러올 시 뷰포트에 다수의 0px 크기의 요소가 있다면 intersection이 충족된 것으로 판단되어 그냥 처음부터 이미지를 로딩해버립니다. 따라서 lazy-loading을 적용한 효과가 무의미해집니다. 아래 그림을 보면 그 이유를 알 수 있습니다.

 ![](/assets/img/wp-content/uploads/2020/08/screenshot-2020-08-12-pm-2.10.09.png)
