---
title: "dat.GUI: 세련된 디자인의 GUI 폼(Form)을 사용할 수 있는 자바스크립트 라이브러리"
date: 2019-03-28
categories: 
  - "DevLog"
  - "JavaScript"
---

 - 튜토리얼: [http://workshop.chromeexperiments.com/examples/gui/#7--Events](http://workshop.chromeexperiments.com/examples/gui/#7--Events) 
 - 소스 받기: [https://github.com/dataarts/dat.gui](https://github.com/dataarts/dat.gui) 
 - CDN: [https://cdnjs.com/libraries/dat-gui](https://cdnjs.com/libraries/dat-gui)

`dat.GUI`는 계기판, 패널 같은 것으로 숫자, 스트링, 색상 등의 값들을 조작하는 폼들을 쉽게 만들 수 있도록 지원해주는 자바스크립트에서 사용하는 라이브러리입니다. 기본적으로 오른쪽 상단 구석에 작게 생성되며 화면 전체를 사용하는 멀티미디어 자료들을 조작하는 용도로 사용합니다. 자바스크립트 3차원 라이브러리인 `Three.js`의 예제 페이지([https://threejs.org/examples/#webgl\_lightningstrike](https://threejs.org/examples/#webgl_lightningstrike))에서 이 dat.GUI들을 자주 사용하고 있습니다.

 

![](/assets/img/wp-content/uploads/2019/03/datgui.png)

 

## **1\. 기본 사용법**

아주 적은 코드로 dat.GUI는 변수를 수정하는 데 사용할 수있는 인터페이스를 만듭니다.

```html
<script type="text/javascript" src="dat.gui.js"></script>
<script type="text/javascript"> ... </script>
```

```js
var FizzyText = function() {
  this.message = 'dat.gui';
  this.speed = 0.8;
  this.displayOutline = false;
  this.explode = function() { ... };
  // Define render logic ...
};

window.onload = function() {
  var text = new FizzyText();
  var gui = new dat.GUI();
  gui.add(text, 'message');
  gui.add(text, 'speed', -5, 5);
  gui.add(text, 'displayOutline');
  gui.add(text, 'explode');
};
```

- 속성은 `public`이어야하며 `this.prop = value`로 정의됩니다.
- dat.GUI는 속성의 초기 값을 기반으로 컨트롤러 유형을 결정합니다.
- 키보드 `H` 키를 눌러 모든 GUI를 표시하거나 숨깁니다.

> 참고: `FizzyText` 부분을 객체로 바로 만들어서 사용할 수도 있습니다.

```js
var fizzyTextParams = {
  message: "dat.gui",
  speed: 0.8,
  displayOutline: false,
  explode: function() {
    //Define render logic ...
  }
}
```

 

## **2\. 입력 제한**

숫자에 대한 제한을 지정할 수 있습니다. 최소값과 최대 값이 있는 숫자는 슬라이더가 됩니다.

```js
gui.add(text, 'noiseStrength').step(5); // Increment amount
gui.add(text, 'growthSpeed', -5, 5); // Min and max
gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match
```

숫자와 문자열 모두에 대한 값 드롭 다운에서 선택하도록 선택할 수도 있습니다.

```js
// Choose from accepted values: 선택 목록에 적혀있는 텍스트 자체를 값(value)로 사용
gui.add(text, 'message', [ 'pizza', 'chrome', 'hooray' ] );

// Choose from named values: 선택 목록에 적혀있는 텍스트와 별개로 값을 설정하여 사용
gui.add(text, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 } );
```

![](/assets/img/wp-content/uploads/2019/03/dg2.png)

 

## **3\. 폴더**

원하는만큼 GUI를 그룹화하여 묶을 수 있습니다. 묶여진 GUI는 접을 수 있는 폴더 역할을 합니다.

```js
var gui = new dat.GUI();

var f1 = gui.addFolder('Flow Field');
f1.add(text, 'speed');
f1.add(text, 'noiseStrength');

var f2 = gui.addFolder('Letters');
f2.add(text, 'growthSpeed');
f2.add(text, 'maxSize');
f2.add(text, 'message');

f2.open();
```

![](/assets/img/wp-content/uploads/2019/03/dg3.png)

 

## **4\. 색상 컨트롤러**

dat.GUI에는 색상 선택기가 있으며 다양한 색상 표현을 이해합니다. 다음은 서로 다른 형식의 색상 변수에 대한 색상 컨트롤러를 만듭니다.

```js
var FizzyText = function() {
  this.color0 = "#ffae23"; // CSS string
  this.color1 = [ 0, 128, 255 ]; // RGB array
  this.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
  this.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value

  // Define render logic ...

};

window.onload = function() {
  var text = new FizzyText();
  var gui = new dat.GUI();

  gui.addColor(text, 'color0');
  gui.addColor(text, 'color1');
  gui.addColor(text, 'color2');
  gui.addColor(text, 'color3');

};
```

dat.GUI는 초기 값으로 정의 된 형식으로 색상을 수정합니다. (참고: "red", "green" 같은 색상명을 사용하면 오류가 발생합니다.)

[ ![](/assets/img/wp-content/uploads/2019/03/dg4.png)](http://yoonbumtae.com/?attachment_id=947)

 

## **5\. 값 저장**

GUI에 추가 한 모든 오브젝트에 대해 `gui.remember`를 호출하여 GUI 인터페이스에 저장 메뉴를 추가할 수 있다.

```
var fizzyText = new FizzyText();
var gui = new dat.GUI();

gui.remember(fizzyText);

// Add controllers ...
```

저장 설정을 변경하려면 톱니바퀴 모양의 아이콘을 클릭하십시오. 다음과 같이 GUI 값을 `localStorage`에 저장하거나 `JSON 객체`를 복사하여 소스 코드에 붙여 넣을 수 있습니다.

```
var fizzyText = new FizzyText();
var gui = new dat.GUI({ load: JSON });

gui.remember(fizzyText);

// Add controllers ...
```

[ ![](/assets/img/wp-content/uploads/2019/03/dg5.png)](http://yoonbumtae.com/?attachment_id=946)

 

## **6\. 프리셋**

저장 메뉴를 사용하여 모든 설정을 사전 설정으로 저장할 수도 있습니다. 현재 설정을 수정하려면 저장(Save)을 클릭하고 기존 설정에서 새 설정을 작성하려면 새로 만들기(New)를 클릭하십시오. 되돌리기(Revert)를 클릭하면 저장되지 않은 모든 변경 사항이 현재 사전 설정으로 지워집니다.

저장 메뉴의 드롭 다운을 사용하여 사전 설정간에 전환합니다. 다음과 같이 기본 사전 설정을 지정할 수 있습니다.

```
var gui = new dat.GUI({
  load: JSON,
  preset: 'Flow'
});
```

`localStorage`에 대한 주의 사항 :

`JSON 저장 오브젝트`를 소스에 자주 붙여 넣으십시오. `localStorage`를 사용하여 프리셋을 저장하면 탐색 데이터를 지우거나 브라우저를 변경하거나 작업중인 페이지의 URL을 변경하면 설정을 금방 잃어 버릴 수 있습니다.

![](/assets/img/wp-content/uploads/2019/03/dg6.png)

 

## **7\. 이벤트**

이벤트 리스너 구문을 사용하여 개별 컨트롤러에서 이벤트를 수신할 수 있습니다.

```js
var controller = gui.add(fizzyText, 'maxSize', 0, 10);

controller.onChange(function(value) {
  // Fires on every change, drag, keypress, etc. (값이 바뀌었을 때, 드래그, 키누름 등)
});

controller.onFinishChange(function(value) {
  // Fires when a controller loses focus. (포커스가 벗어났을 때)
  alert("The new value is " + value);
});
```

 

## **8\. dat.GUI의 DOM을 임의의 위치에 배치**

기본적으로 dat.GUI 패널은 고정 위치로 만들어지고 dat.GUI의 `DOM` 요소에 자동으로 추가됩니다. `autoPlace` 매개 변수를 `false`로 설정하여 이 동작을 변경할 수 있습니다.

```js
var gui = new dat.GUI({ autoPlace: false });

var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);
```

 

## **9. 자동으로 디스플레이 업데이트**

GUI 외부에서 변경 한 내용에 컨트롤러가 반응하도록 하려면 `listen` 메소드를 사용하세요.

```js
var fizzyText = new FizzyText();
var gui = new dat.GUI();

gui.add(fizzyText, 'noiseStrength', 0, 100).listen();

var update = function() {
  requestAnimationFrame(update);
  fizzyText.noiseStrength = Math.random();
};

update();
```

컨트롤러에서 LISTEN을 호출하면 dat.GUI의 내부 생성 간격에 이를 추가합니다. 이 간격은 매 프레임마다 속성 값의 변경 사항을 확인하므로 해당 속성을 읽는 것이 expensive한 경우(복잡한 자료형인 경우, 리소스를 높게 요구하는 경우) 매우 느릴 수 있습니다.

[http://workshop.chromeexperiments.com/examples/gui/#9--Updating-the-Display-Automatically](http://workshop.chromeexperiments.com/examples/gui/#9--Updating-the-Display-Automatically)

 

## **10. 수동으로 디스플레이 업데이트**

원하는 정의의 루프에서 컨트롤러를 업데이트하려면 `updateDisplay` 메서드를 사용하십시오.

```js
var fizzyText = new FizzyText();
var gui = new dat.GUI();

gui.add(fizzyText, 'noiseStrength', 0, 100);

var update = function() {

  requestAnimationFrame(update);
  fizzyText.noiseStrength = Math.cos(Date.getTime());

  // Iterate over all controllers
  for (var i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }

};

update();
```

[http://workshop.chromeexperiments.com/examples/gui/#10--Updating-the-Display-Manually](http://workshop.chromeexperiments.com/examples/gui/#10--Updating-the-Display-Manually)
