---
title: "Three.js: 장면(scene) 추가"
date: 2019-04-16
categories: 
  - "DevLog"
  - "JavaScript"
---

출처: [https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)

이 섹션의 목적은 three.js에 대한 간략한 소개입니다. 회전 큐브를 사용하여 장면을 설정하는 것으로 시작하겠습니다.

### 시작하기 전에

three.js를 사용하려면 먼저 어딘가에 표시해야합니다. 다음 HTML을 `js/` 디렉토리에 있는 `three.js` 사본과 함께 컴퓨터의 파일에 저장하고 브라우저에서 엽니다.

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset=utf-8>
    <title>My first three.js app</title>
    <style>
      body { margin: 0; }
      canvas { width: 100%; height: 100% }
    </style>
  </head>
  <body>
    <script src="js/three.js"></script>
    <script>
      // Our Javascript will go here.
    </script>
  </body>
</html>
```

아래의 모든 코드는 빈 `<script>` 태그로 들어갑니다.

 

### 장면(scene) 만들기

실제로 three.js로 무엇이든 표시 할 수 있으려면 **장면, 카메라 및 렌더러**라는 세 가지가 필요합니다. 그래서 카메라로 장면을 렌더링 할 수 있습니다.

```
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
```

잠시 시간을 내어 여기서 무슨 일이 일어나는지 설명하겠습니다. 이제 장면, 카메라 및 렌더러를 설정했습니다.

three.js에는 몇 가지 다른 카메라가 있습니다. 지금은 `PerspectiveCamera`를 사용해 보겠습니다.

첫째 속성은 시야입니다. `FOV`는 주어진 순간에 디스플레이에 나타나는 장면의 범위입니다. 값은 도(degree) 단위입니다.

두 번째는 종횡비(`aspect ratio`)입니다. 거의 항상 높이로 나눈 너비를 사용하고 싶거나 와이드 스크린 TV에서 오래된 동영상을 재생할 때와 같은 결과를 얻습니다. 이미지가 찌그러져 보입니다.

다음 두 속성은 `near` 및 `far` 클리핑 기준입니다. 즉, 카메라에서 `far` 값보다 멀리 있거나 `near` 값보다 가까이 있는 물체들은 렌더링되지 않는다는 것입니다. 지금은 걱정할 필요가 없지만 성능을 높이려면 앱에서 다른 값을 사용하고 싶을 수 있습니다.

다음은 렌더러입니다. 여기에서 사용하는 `WebGLRenderer` 외에도 three.js는 몇 가지 다른 기능을 제공하며, 구형 브라우저를 사용하는 사용자 또는 WebGL을 지원하지 않는 사용자를 위해 대체로 사용됩니다.

렌더러 인스턴스를 만드는 것 외에도 우리는 앱을 렌더링 할 때 원하는 크기를 설정해야합니다. 앱으로 채우려는 영역의 너비와 높이 (이 경우 브라우저 창 너비와 높이)를 사용하는 것이 좋습니다. 성능이 많은 앱의 경우 `window.innerWidth / 2` 및 `window.innerHeight / 2`와 같이 `setSize`에 작은 값을 지정하여 앱을 절반 크기로 렌더링 할 수도 있습니다.

앱의 크기를 유지하면서 해상도를 낮추려면 `setSize`를 `false`로 호출하여 `updateStyle` (세 번째 인수)을 호출하면 됩니다. 예를 들어, `<canvas>`의 너비와 높이가 100%인 경우 `setSize (window.innerWidth / 2, window.innerHeight / 2, false)`는 절반의 해상도로 응용 프로그램을 렌더링합니다.

마지막으로 렌더러 요소를 HTML 문서에 추가합니다. 렌더러가 장면을 표시하기 위해 사용하는 `<canvas>` 요소입니다.

"다 좋은데, 약속한 그 큐브는 어디 있지?" 이제 추가하겠습니다.

```
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
```

큐브를 생성하려면 `BoxGeometry`가 필요합니다. 이것은 큐브의 모든 점(`point`; 정점-vertex)과 채우기 (`fill`; 면-face)를 포함하는 객체입니다. 우리는 앞으로 더 많은 것을 탐구할 것입니다.

기하학적 구조(geometry) 외에도 색을 입힐 재료가 필요합니다. Three.js에는 여러 가지 자료가 있지만, 지금은 `MeshBasicMaterial`을 고수할 것입니다. 모든 자료는 속성에 적용될 속성 개체를 사용합니다. 상황을 매우 간단하게 유지하기 위해 색상 속성 `0x00ff00` 만 제공합니다. 이는 녹색입니다. 이것은 CSS나 Photoshop (16진수 색상)에서 색상이 작동하는 것과 같은 방식으로 작동합니다.

세 번째로 필요한 것은 메쉬(`mesh`)입니다. 메쉬는 geometry를 가져 와서 그 안에 소재(`material`)를 적용하여 장면에 삽입하고 자유롭게 움직이는 객체입니다.

기본적으로 `scene.add()`를 호출하면 우리가 추가 한 것이 좌표 `(0,0,0)`에 추가됩니다. 이렇게 하면 카메라와 큐브가 서로 내부에 엉켜있게됩니다. 이를 피하기 위해 간단히 카메라를 움직입니다.

 

### 장면 렌더링하기

앞에서 작성한 HTML 파일에 위의 코드를 복사 한 경우 아무 것도 볼 수 없습니다. 우리가 실제로 아무것도 렌더링하지 않기 때문입니다. 이를 위해서는 렌더링 또는 애니메이션 루프가 필요합니다.

```
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();
```

이렇게 하면 렌더러가 화면이 새로고침 될 때마다 장면을 그려주는 루프가 생성됩니다 (일반적인 화면에서는 초당 60회를 의미). "`setInterval`로 만들면 어떨까요?"라고 말할 수 있습니다. 그렇게 할 수도 있지만, `requestAnimationFrame`에는 많은 이점이 있습니다. 아마 가장 중요한 것은 사용자가 다른 브라우저 탭으로 이동할 때 (렌더링 작업이) 일시 중지되므로 처리 능력과 배터리 수명을 낭비하지 않는 것입니다.

 

### 큐브에 애니메이션 적용

위 코드를 모두 시작하기 전에 작성한 파일에 삽입하면 녹색 상자가 나타납니다. 그것을 돌려서 조금 더 재미있게 만들어 봅시다.

`animate` 함수에서 `renderer.render` 호출 바로 위에 다음을 추가하십시오.

```
cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
```

이것은 매 프레임마다 (보통 초당 60회) 실행되며 큐브에 멋진 회전 애니메이션을 제공합니다. 기본적으로, 앱을 실행하는 동안 이동하거나 변경하려는 것은 애니메이션 루프를 거쳐야합니다. 당연히 거기에서 다른 함수를 호출할 수 있으므로 수백 줄의 애니메이션 기능을 사용하지 않아도 됩니다.

 

### 결과

이제 첫 번째 three.js 응용 프로그램을 완료했습니다.

[![](./assets/img/wp-content/uploads/2019/04/tex1.gif)](http://yoonbumtae.com/?attachment_id=1050)

전체 코드는 아래에서 볼 수 있습니다. 그것이 어떻게 작동하는지 더 잘 이해하기 위해 코드를 잘 살펴보십시오.

```
<html>
  <head>
    <title>My first three.js app</title>
    <style>
      body { margin: 0; }
      canvas { width: 100%; height: 100% }
    </style>
  </head>
  <body>
    <script src="js/three.js"></script>
    <script>
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      var geometry = new THREE.BoxGeometry( 1, 1, 1 );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      var cube = new THREE.Mesh( geometry, material );
      scene.add( cube );

      camera.position.z = 5;

      var animate = function () {
        requestAnimationFrame( animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
      };

      animate();
    </script>
  </body>
</html>
```
