---
title: "자바스크립트 + abcjs: 악보 출력, Synth 플레이어 삽입"
date: 2019-11-15
categories: 
  - "DevLog"
  - "JavaScript"
---

[**abcjs.net**](https://www.abcjs.net/) 은 인터넷 브라우저에 악보를 출력하는 자바스크립트 라이브러리입니다.

- [https://www.abcjs.net/abcjs\_basic\_5.9.1-min.js \[다운로드\]](https://www.abcjs.net/abcjs_basic_5.9.1-min.js)
- [https://www.abcjs.net/abcjs-audio.css \[다운로드\]](https://www.abcjs.net/abcjs-audio.css)

## 사용 방법

```html
<!DOCTYPE HTML>
<html>
<head>
  <link href="abcjs-audio.css" media="all" rel="stylesheet" type="text/css" />
  <script src="abcjs_basic_5.9.1-min.js" type="text/javascript"></script>

</head>
<body>

  <div id="notation"></div>
  <div id="audio"></div>

<script type="text/javascript">

 .........

</script>

</body>
</html>
```

```js
var cooleys = 'X:1\nT: Cooley\'s\nM: 4/4\nL: 1/8\nR: reel\nK: Emin\nD2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|\n"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||\n|:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|\n"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]\n';

var visualObj = ABCJS.renderAbc('notation', cooleys)[0]; // 악보 입력
var synthControl = new ABCJS.synth.SynthController(); // 플레이어 선언
synthControl.load("#audio", null, {displayRestart: true, displayPlay: true, displayProgress: true});
synthControl.setTune(visualObj, false);
```

## 실행 결과

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-16-am-2.13.08.png)

```
X: 1
T: Cooley's
M: 4/4
L: 1/8
R: reel
K: Emin
|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|
EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|
|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|
eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|
```

## abc 살펴보기

위의 마크업 언어는 **abc**라고 하는 언어입니다. [여기](http://abcnotation.com/blog/2010/01/31/how-to-understand-abc-the-basics/)서 매뉴얼을 볼 수 있습니다. 간단하게만 살펴보겠습니다.

- `X:` 에서 `K:` 까지는 **헤더** 부분입니다 제목, 작곡가, 박자, 조성 등을 설정하는 부분입니다.
- 그 밑에는 **노트** 부분이며 여기에 악보를 기입합니다. 첫번째 마디의 `D2`에서  `D`는 **음높이**이고 뒤 숫자 `2`는 박자의 상대적 배수입니다.
- 박자는 `L:` 에 상대적으로 대응합니다. `L:` 이 `1/8`이므로 `2`를 입력하면 8분음표의 **2배**가 되어 **4분음표**가 입력됩니다.
- `/2`는 2분의 1배라는 뜻으로 8분음표를 **1/2배**인 **16분음표**가 입력됩니다.
- 마디는 `|`를 입력합니다. 
- 샤프(♯)는 노트 이름 앞에 "`^`", 내추럴(♮)은 "`=`", 플랫(♭)은 "`_`"를 입력합니다.

 

### **음높이** 
![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-16-am-2.19.27.png)

 

### **박자**

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-16-am-2.24.16.png)


## 예제: semitone 스케일 표시

아래 예제는 semitone 스케일을 악보로 표시합니다.

<!-- https://gist.github.com/ayaysir/411afca4581eb066c5d5a7a94b76903c -->

{% gist "411afca4581eb066c5d5a7a94b76903c" %}

![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-16-am-2.27.51.png)
