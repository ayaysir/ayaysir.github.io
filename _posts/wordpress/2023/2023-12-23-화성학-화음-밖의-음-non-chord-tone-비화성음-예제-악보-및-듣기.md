---
title: "화성학: 화음 밖의 음 (Non-chord Tone; 비화성음) [예제 악보 및 듣기 첨부]"
date: 2023-12-23
categories: 
  - "StudyLog"
  - "음악이론"
---

## **화음 밖의 음 (Non-chord Tone)**

- 화음에 포함되지 않은 음을 뜻합니다.
- `비화성음`이라고도 합니다.
- 클래식 화성학에서 주로 사용되는 개념이며, 재즈화성학에서는 텐션(tension)으로 취급하는 경우도 있습니다.

## **종류**

### **(A) 지남음**

`지`자 표시를 붙인 음과 같이 2개의 코드 톤(화성음)을 음계적으로 잇는 비화성음입니다.

<!-- \[abcjs-audio class-paper="abcjs-paper" animate="true" options="{ responsive: 'resize',}"\] \[/abcjs-audio\] -->
```abc
X: 1 
T: 
Q: 1/4=120 
M: 4/4 
L: 1/8 
R: 지남음 1 
K: C 
"CM7" e2 f g- g4 | "Am7" c2 d e- e4 | "Dm7" d2 e f- f4 | "G7" d2 c B- B4 || 
w: ~3 ~지 ~5 | ~3 ~지 ~5 | ~1 ~지 ~3 | ~5 ~지 ~3 || 
```

<br>
 

지남음은 두 개 이상이 될 수도 있습니다.

- 시작과 끝이 코드 톤인 경우, 그 사이를 선율적으로 이으면 지남음으로 취급합니다.

```abc
X: 1 
T: 
Q: 1/4=120 
M: 4/4 L: 1/8 
R: 지남음 2 
K: C 
"CM7" ef^fg- g4 | "Am7" cd^de- e4 | "Dm7" d^def- f4 | "G7" d\_dcB- B4 || 
w: ~3 ~지 ~지 ~5 | ~3 ~지 ~지 ~5 | ~1 ~지 ~지 ~3 | ~5 ~지 ~지 ~3 || 
```
 
<br>

### **(B) 앞꾸밈음**

`앞`자 표시를 붙인 음과 같이 `2도` 위나 아래로부터 코드 톤으로 진행하는 경우입니다.


```abc
X: 1 
T:
Q: 1/4=120 
M: 4/4 
L: 1/8 
R: 앞꾸밈음 1 
K: C 
"CM7" z4 dcGE | "Am7" B3A-A4 | "Dm7" z4 ^GAed | "G7" c3B-B4 || 
w: ~앞 ~1 ~5 ~3 | ~앞 ~1 | ~앞 ~5 ~앞 ~1 | ~앞 ~3 || 
```
 
<br>

아래와 같이 두 개나 세 개가 잇달아 나오는 비화성음도 멜로디를 만드는 중요한 요소가 됩니다.

- 첫번째, 두번째, 네번째 마디의 앞꾸밈음은 코드 톤 `C(1번)`의 `2도 이내`에서 진행합니다.
- 세번째 마디의 앞꾸밈음은 코드 톤 `F(3번)`와 `A(5번)`의 `2도 이내`에서 진행합니다.

```abc
X: 1 
T: 
Q: 1/4=120 
M: 4/4 L: 1/8 
R: 앞꾸밈음 2 
K: C 
"CM7" zBd\_d cAGE | "Am7" B^GBAz4 | "Dm7" zeg^f =f^GAc |"G7" da\_ag z4 || 
w: ~7 ~앞 ~앞 ~1 ~6 ~5 ~3 | ~앞 ~앞 ~앞 ~1 | ~앞 ~앞 ~앞 ~3 ~앞 ~5 ~7 | ~5 ~앞 ~앞 ~1 || 
```

<br>

### **(C) 도움음**

`도`자 표시를 한 음처럼 코드 톤에서 출발하여 `2도` 상행 또는 하행하고 다시 원래 높이의 코드 톤으로 돌아올 때 중간 코드 톤을 잇는 음들을 도움음이라고 합니다.

> 앞꾸밈음이나 도움음이나 코드톤으로 상행하는 것은 반음으로 된 것이 많습니다.

```abc
X: 1 
T: 
Q: 1/4=120 
M: 4/4 
L: 1/8 
R: 도움음 
K: C 
"CM7" zG^FG (3cdc Bc | "Am7" e^deA z4| "Dm7" zA^GA de^cd | "G7" fefB z4|| 
w: ~5 ~도 ~5 ~1 ~도 ~1 ~도 ~1 | ~5 ~도 ~5 ~1 | ~5 ~도 ~5 ~1 ~도 ~도 ~1 | ~7 ~도 ~7 ~3 || 
```
 
<br> 

### **(D) 걸림음**

`겉`자 표시를 한 음과 같이

- 앞 코드의 코드 톤이 붙임줄(tie)로 다음 코드까지 이어져
- 다음 코드의 `밑`음, `3도`음, `5도`음으로 해결하는 음

입니다.

```abc
X: 1
T:
Q: 1/4=120
%%staves [(1 2) (3 4)]
M: 4/4
L: 1/8
R: 걸림음 1
K: C
V:1 treble
e2 fe d2 g2 | c2 dc B2 e2 | A2 BA G2 e2- | "걸(9th)"e2 "1"dc d4 ||
V:2 treble
c4- c2 B2- | B2 A2- A2 G2- | G2 F2 E4 | ^F4 =F4 ||
w: _ 걸(sus4)~ 3 | 걸(9th)~ 1 걸(♭13th)~ 3 | 걸(9th)~ 1
V:3 bass
G8 | E8 | C8 | C4- "걸(sus4)"C2 "3"B,2 ||
V:4 bass
C4 G,4 | A,4 E,4 | F,4 C,4 | D,4 G,4 ||
```

> **코드진행)** C G \| Am Em \| F C \| D7 G7 \|\|

<br>

```abc
X: 1
T:
Q: 1/4=120
%%staves [(1 2) (3 4)]
M: 4/4
L: 1/8
R: 걸림음 2
K: C
V:1 treble
e4- "걸(13th)"e2 "5"d2 | c4- "걸(♭13th)"c2 "5"B2 | A4- "걸(13th)"A2 "5"G2 | F8 ||
V:2 treble
c4 B4- | B2 A2 ^G4 | G2 F2 E4- | E2 D2 ^C2 =C2 ||
w: _ _ | 걸(9th)~ 1 _ | 앞(9th)~ 1 _ | 걸(9th)~ 1 지 7th
V:3 bass
G4 F4 | E4 D4 | C4 _B,4 | A,8 ||
V:4 bass
C4 G,4 | A,4 E,4 | F,4 C,4 | D,8 ||
```

> **코드진행)** C G7 \| Am E7 \| F C7 \| Dm \|\|


보기의 걸림음 및 화음들을 분석하면

- `3도`음으로 해결하는 걸림음은 `sus4`
- `밑`음으로 해결하는 걸림음은 `9th`
- `5도`음으로 해결하는 걸림음은 `13th`

<br> 

## **비화성음의 의의**

- 선율을 만들 때 무의식적으로 사용됩니다.
- 되도록 의식하면서 사용하는 편이 좋습니다.
- 멜로디 페이크(melody fake)가 숙달될때까지 의식합니다.

<br>

## **예제**

### **예제 1**

```abc
X: 1
T:
Q: 1/4=120
M: C
L: 1/4
R: 예제1-A
K: C
"G7" G | "CM7" c G E G | "Am7" A2 z A | "Dm7" d c A F | "G7" B4 ||
```

<br>

```abc
X: 1
T:
Q: 1/4=120
M: C
L: 1/8
R: 예제1-B
K: C
"G7" zG^FG | "CM7" dcGE D^DEG | "Am7" B2 _BA z A^GA | "Dm7" e_ed_d cAGF | "G7" E_EDB- B4 ||
w: ~◯ ~도 ~◯ | ~앞 ~◯ ~◯ ~◯ ~앞 ~앞 ~◯ ~◯ | ~앞 ~앞 ~◯ ~◯ ~도 ~◯ | ~앞 ~앞 ~◯ ~지 ~◯ ~◯ ~지 ~◯ | ~앞 ~앞 ~◯ ~◯ ||
```

<br>

### **예제 2**

```abc
X: 1
T:
Q: 1/4=120
M: C
L: 1/2
R: 예제2-A
K: C
"C" E2 | "C7" E G | "F" A c | "F#dim" c A | "C/G" G2 ||
```

<br>

```abc
X: 1
T:
Q: 1/4=120
M: C
L: 1/8
R: 예제2-B
K: C
"C" E^DEG z4 | "C7" z ^FGd c_BG^G | "F" A^GAc z4 | "F#dim" zD (3_E^FA dcBA | "C/G" G8 ||
w: ~◯ ~도 ~◯ ~◯ | 앞 ~◯ ~앞 ~◯ ~◯ ~◯ ~지 | ~◯ ~도 ~◯ ~◯ | ~앞 ~◯ ~◯ ~◯ ~앞 ~◯ 지 ~◯ | ~◯
```

<br>

## **연습문제**

### **문제 보기**

- 각 코드 톤이 몇 도의 음정인지 숫자를 적습니다.
- 비화성음인 경우 다음과 같이 적습니다.
    - 지남음은 **`지`**
    - 앞꾸밈음은 **`앞`**
    - 도움음은 **`도`**
    - 걸림음은 **`걸`**


```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 1
K: C 
"C6" z e^de fecA | "Am7" c2 de-e4 | "Dm7" z fef gfdA | "G7" efed-d4 ||
w: ~3 ~도 ~3 ~도 ~3 ~1 ~6 | 
```

<br>
 
```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 2
K: F 
"F6" (3cdc Bd cAGF | "D7" ^FAcd \_ed3 | "Gm7" z \_BAc B^FAG | "C7" =F^DEc-c4 || 
```

<br>
 
```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 3
K: G 
"G6" agdB AGBd | "Bbdim" fe^df e\_B3 | "Am7" dc=B=d cEGA | "D7" B2 \_BA-A4 || 
```

<br>
 
```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 4
K: Bb 
"Bb6" z gfA Bed=E | "Gm7" FcB^C DG3 | "Cm7" z de=B c^FGD | "F7" E=B,C=F-F4 || 
```

<br>
 
```abc
X: 1 
T: 
Q: 1/4=120
M:  3/4
L:  1/4
R: 연습문제 5
K: Bm 
"Bm" d c B- | "F#" B ^A f- | "Bm" f e d- | "A" d c a- | "D" a g f- | "Em" f e B || 
```

<br><br>

### **해답 보기**

```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 1 해답
K: C 
"C6" z e^de fecA | "Am7" c2 de-e4 | "Dm7" z fef gfdA | "G7" efed-d4 ||
w: ~3 ~도 ~3 ~도 ~3 ~1 ~6 | ~3 ~지 ~5 | ~3 ~도 ~3 ~도 ~3 ~1 ~5 | ~앞 ~7 ~지 ~5 || 
```

<br>

```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 2 해답
K: F 
"F6" (3cdc Bd cAGF | "D7" ^FAcd \_ed3 | "Gm7" z \_BAc B^FAG | "C7" =F^DEc-c4 ||
w: ~5 ~도 ~5 ~도 ~6 ~5 ~3 ~지 ~1 | ~3 ~5 ~7 ~1 ~도 ~1 | ~3 ~도 ~도 ~3 ~앞 ~앞 ~1 | ~앞 ~앞 ~3 ~1 || 
```
- 세번째 마디의 앞 도움음 2개는 코드 톤 `3(B)` 중간에 `A`와 `C`가 `2도` 간격 이내에 있기 때문에 `도움음`으로 취급된다.



```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 3 해답
K: G 
"G6" agdB AGBd | "Bbdim" fe^df e\_B3 | "Am7" dc=B=d cEGA | "D7" B2 \_BA-A4 ||
w: ~앞 ~1 ~5 ~3 ~지 ~1 ~3 ~5 | ~앞 ~5 ~도 ~도 ~5 ~1 | ~앞 ~3 ~도 ~도 ~3 ~5 ~7 ~1 | ~앞 ~앞 ~5 ||
```

<br>

```abc
X: 1 
T: 
Q: 1/4=120
M: C 
L:  1/8
R: 연습문제 4 해답
K: Bb 
"Bb6" z gfA Bed=E | "Gm7" FcB^C DG3 | "Cm7" z de=B c^FGD | "F7" E=B,C=F-F4 ||
w: ~6 ~5 ~앞 ~1 ~앞 ~3 ~앞 | ~7 ~앞 ~3 ~앞 ~5 ~1 | ~앞 ~3 ~앞 ~1 ~앞 ~5 ~앞 | ~7 ~앞 ~5 ~1 || 
```
 
<br>

```abc
X: 1 
T: 
Q: 1/4=120
M:  3/4
L:  1/4
R: 연습문제 5 해답
K: Bm 
"Bm" d c B- | "F#" B ^A f- | "Bm" f e d- | "A" d c a- | "D" a g f- | "Em" f e B ||
w: ~3 ~지 ~1 | ~걸(sus4) ~3 ~1 | ~5 ~지 ~3 | ~걸(sus4) ~3 ~1 | ~5 ~지 ~3 | ~걸(9th) ~1 ~5 || 
```

<link rel="stylesheet" id="style1-css" href="https://cdn.jsdelivr.net/npm/abcjs@6.5.2/abcjs-audio.min.css" type="text/css" media="all">
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/abcjs@6.5.2/dist/abcjs-basic-min.min.js" id="abcjs-plugin-js"></script>

<script>
function CursorControl(selector) {
  var self = this;

  self.onStart = function() {
    var svg = document.querySelector("#" + selector + " svg");
    var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    cursor.setAttribute("class", "abcjs-cursor");
    cursor.setAttributeNS(null, 'x1', 0);
    cursor.setAttributeNS(null, 'y1', 0);
    cursor.setAttributeNS(null, 'x2', 0);
    cursor.setAttributeNS(null, 'y2', 0);
    svg.appendChild(cursor);

  };
  self.beatSubdivisions = 2;
  self.onEvent = function(ev) {
    if (ev.measureStart && ev.left === null)
      return; // this was the second part of a tie across a measure line. Just ignore it.

    var lastSelection = document.querySelectorAll("#" + selector + " svg .highlight");
    for (var k = 0; k < lastSelection.length; k++)
      lastSelection[k].classList.remove("highlight");

    for (var i = 0; i < ev.elements.length; i++ ) {
      var note = ev.elements[i];
      for (var j = 0; j < note.length; j++) {
        note[j].classList.add("highlight");
      }
    }

    var cursor = document.querySelector("#" + selector + " svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", ev.left - 2);
      cursor.setAttribute("x2", ev.left - 2);
      cursor.setAttribute("y1", ev.top);
      cursor.setAttribute("y2", ev.top + ev.height);
    }
  };
  self.onFinished = function() {
    var els = document.querySelectorAll("#" + selector + " svg .highlight");
    for (var i = 0; i < els.length; i++ ) {
      els[i].classList.remove("highlight");
    }
    var cursor = document.querySelector("#" + selector + " svg .abcjs-cursor");
    if (cursor) {
      cursor.setAttribute("x1", 0);
      cursor.setAttribute("x2", 0);
      cursor.setAttribute("y1", 0);
      cursor.setAttribute("y2", 0);
    }
  };
}

/*
- code class 'pre > code.language-abc' 를 순회해서 code.textContent만 저장
- code 태그 위의 pre는 삭제하고 그 부분을 
   <div id="abcjs-notation-0"></div>
   <div id="abcjs-midi-0"><div>
  로 대체(인덱스에 따라 0부터 증가)
- 아래 코드를 실행
*/
document.addEventListener("DOMContentLoaded", function () {
    // 1) pre > code.language-abc 모두 순회
  document.querySelectorAll('pre > code.language-abc').forEach((codeEl, idx) => {
    // ABC 코드 추출
    const abc = codeEl.textContent;

    // pre 요소 가져오기
    const pre = codeEl.parentElement;

    // notation/midi id 구성
    const notationId = `abcjs-notation-${idx}`;
    const midiId = `abcjs-audio-${idx}`;

    // pre 를 대체할 HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="${notationId}"></div>
      <div id="${midiId}"></div>
    `;

    // pre 삭제 & 새 요소 삽입
    pre.replaceWith(wrapper);

    // ---------------------------
    //  ABCJS 렌더링
    // ---------------------------

    // 악보(Notation)
    var visualId = notationId;
    var cursorControl = new CursorControl(visualId, null);
    var visualIds = [visualId];
    var params = { responsive: 'resize' };
    var abcString = abc;

    var visualObjs = ABCJS.renderAbc(visualIds, abcString, params);

    // 오디오 플레이어
    var synthControl = new ABCJS.synth.SynthController();
    var el = document.getElementById(midiId);
    synthControl.load(el, cursorControl, {
      displayRestart: true,
      displayPlay: true,
      displayProgress: true
    });
    synthControl.disable(true);

    var midiBuffer = new ABCJS.synth.CreateSynth();

    midiBuffer.init({
      visualObj: visualObjs[0],
      options: { responsive: 'resize' }
    }).then(() => {
      if (synthControl) {
        synthControl.setTune(visualObjs[0], false).catch(error => {
          console.warn("Audio problem:", error);
        });
      }
    }).catch(error => {
      console.warn("Audio problem:", error);
    });
  });
});
</script>