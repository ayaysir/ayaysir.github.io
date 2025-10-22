---
title: "AKAI MPK mini3의 벨로시티(velocity) 문제에 대한 해결 방법"
date: 2024-01-16
categories: 
  - "StudyLog"
  - "영어"
---

##### **원문**

- [Workarounds for velocity issues on a AKAI MPK mini3](https://incenp.org/notes/2022/akai-mpk-mini3-velocity.html)

영어 원문 보기 

<script>const button = document.querySelector("#button-english"); // const originalTexts = document.querySelectorAll(".original-english") let isButtonOn = false button.addEventListener("click", function(e) { if(isButtonOn) { document.querySelectorAll(".original-english").forEach(function(e, i) { e.style.display = "none"; }) button.textContent = "영어 원문 보기" } else { document.querySelectorAll(".original-english").forEach(function(e, i) { e.style.display = "inline"; }) button.textContent = "영어 원문 가리기" } isButtonOn = !isButtonOn })</script>

### **Workarounds for velocity issues on a AKAI MPK mini3** **AKAI MPK mini3의 벨로시티(velocity) 문제에 대한 해결 방법**

I recently acquired a new MIDI controller to augment my little home studio: a _**AKAI MPK mini3**_. While I am, overall, satisfied with it, some issues are worth mentioning. 저는 최근 저의 작은 홈 스튜디오를 확장하기 위해 새로운 MIDI 컨트롤러인 _**AKAI MPK mini3**_를 구입했습니다. 전반적으로 만족스럽기는 하지만 몇 가지 언급할 만한 문제가 있습니다.

![](./assets/img/wp-content/uploads/2024/01/mpk-mini-mk3-sl-orthoK.jpg)

 

#### **Poor documentation, no technical specifications** **문서 부족, 기술 사양이 없음**

The user documentation provided with the controller itself or available for download on AKAI’s website is reduced to the bare minimum. Sure, the controller is simple enough to use, but it does have some features that are completely undocumented. 컨트롤러 자체와 함께 제공되거나 AKAI 웹사이트에서 다운로드할 수 있는 사용자 문서는 최소한으로 줄어들었습니다. 물론, 컨트롤러는 사용하기에 충분히 간단하지만 완전히 문서화되지 않은 일부 기능이 있습니다.

One such feature (which I’ll get back to later in this note) is the adjustment of velocity sensitivity, which requires pressing the `FULL LEVEL` button and holding it for approximately 5 seconds – this puts the MPK in a mode where the knobs `K1` to `K4` can be used to alter the shape of the velocity response curve, but you would never know that if you were to rely solely on AKAI’s documentation. 이러한 기능 중 하나(이 노트 후반부에 다시 설명)는 벨로시티 감도 조정으로, **FULL LEVEL 버튼을 약 5초 동안 누르고 있어야** 합니다. 이렇게 하면 **K1 ~ K4 노브를 사용**해 벨로시티 응답 곡선의 모양을 변경할 수 있지만 AKAI의 문서에만 의존한다면 이를 알 수 없습니다.

> 설정을 저장하려면 `FULL LEVEL` 버튼을 다시 5초간 누릅니다.

> 기본값: `V1: 24.0, V2: 06.0, V3: 04.0, V4: 02.0, Black Bal: 0.7x`

 

What’s the point of having features your users don’t know about? It shouldn’t take viewing a YouTube video from a random user to learn about a feature ! This leaves me wondering how many other features are “hidden” on that device, waiting for someone to discover them… 사용자가 모르는 기능이 있다는 게 무슨 의미가 있나요? 기능에 대해 알아보기 위해 [임의의 유저가 만든 YouTube 동영상](https://www.youtube.com/watch?v=4iU8q_2CTpE)을 봐야할 필요가 없어야 합니다! 이로 인해 해당 장치에 얼마나 많은 다른 기능이 "숨겨져" 있는지 궁금합니다. 누군가가 발견하기를 기다리며,,,

Not only the user documentation is poor, but technical specifications are also lacking. This is the first MIDI device I ever came across that does not come with a MIDI implementation chart. The System Exclusive messages (SysEx) that are exchanged between the device and its settings editor software (which of course is only available for Windows and macOS) are not documented, so they need to be reverse-engineered if anyone is to create a settings editor for “alternative systems” such as GNU/Linux – a task that, fortunately, has already been undertaken by several people. 사용자 설명서가 부실할 뿐만 아니라 기술 사양도 부족합니다. MIDI 구현 차트가 함께 제공되지 않는 첫 번째 MIDI 장치입니다. 또한 Windows 및 macOS에서만 사용할 수 있는 디바이스 설정 편집기 소프트웨어 간에 교환되는 시스템 독점 메시지(SysEx)도 문서화되지 않으므로 GNU/Linux와 같은 "대체 시스템"에 대한 설정 편집기를 만들려면 역설계해야 합니다. 다행스럽게도 이미 [여러](https://github.com/gljubojevic/akai-mpk-mini-editor) [사람](https://github.com/tsmetana/mpk3-settings)이 이 작업을 수행했습니다.

The absence of technical specifications is really disappointing, especially if I compare with another of my MIDI devices, a KORG microX synthesizer for which the manufacturer has always provided the full specifications – more than 50 pages describing in details all the SysEx messages emitted and understood by the synthesizer. My own Kmxtool project was made possible by the availability of those specifications. 기술 사양이 없다는 점은 정말 실망스럽습니다. 특히 다른 MIDI 장치와 비교할 때 더욱 그렇습니다.  KORG microX 신디사이저는 제조업체가 항상 전체 사양을 제공하며 신시사이저가 방출하고 이해하는 모든 SysEx 메시지를 50페이지 이상 자세히 설명합니다. 나의 [Kmxtool 프로젝트](https://incenp.org/dvlpt/kmxtool.html)는 이러한 사양의 가용성으로 인해 가능해졌습니다.

 

#### **Adjusting the velocity curve** **벨로시티 커브 조정**

One problem with the MPK mini3 that becomes apparent as soon as one starts playing with it is that most Note On events are emitted with low velocity values, often well below 64 and sometimes as low as 8 (which seems to be the lowest velocity value the MPK mini3 is capable of emitting). Even depressing the keys as fast and forcefully as possible never yields events with a velocity higher than approximately 100. There is the FULL LEVEL key to force the emission of events at the maximal velocity of 127 regardless of the pressure applied, but this only affects the drum pads, not the standard keys. 연주를 시작하자마자 명백히 드러나는 MPK mini3의 한 가지 문제점은 대부분의 Note On 이벤트가 낮은 벨로시티 값으로 방출된다는 것입니다. 종종 64보다 훨씬 낮고 때로는 8(MPK mini3가 방출할 수 있는 가장 낮은 벨로시티 값인 것 같습니다). 가능한 한 빠르고 세게 키를 눌러도 약 100보다 높은 벨로시티의 이벤트는 생성되지 않습니다. 적용된 압력에 관계없이 최대 벨로시티 127로 이벤트를 강제로 방출하는 FULL LEVEL 키가 있지만 이는 표준 키가 아닌 드럼 패드에만 적용됩니다.

This is where the hidden feature I mentioned in the previous section is useful – which makes it all the more disappointing that this feature is hidden! Hold the `FULL LEVEL` for about 5 seconds, and you can then use adjust how the MPK mini3 translates the force applied to each key into a MIDI velocity value. 이전 섹션에서 언급한 숨겨진 기능이 해결 가능한 유용한 부분인데, 이 기능이 숨겨져 있다는 사실이 더욱 실망스럽습니다! 약 5초 동안 `FULL LEVEL` 버튼을 누르고 있으면 MPK mini3가 각 키에 적용된 힘을 MIDI 벨로시티 값으로 변환하는 방법을 조정할 수 있습니다.

There are four parameters you can adjust, called v1 to v4, using the first four knobs K1 to K4. They all take a value ranging from 1.0 to 40.0, with the constraint that they must have decreasing values from v1 to v4: v1 cannot have a lower value than v2, which cannot have a lower value than v3, which cannot have a lower value than v4. You can use the keys normally while the MPK mini3 is in this “velocity adjustment mode”, so you can immediately test the effect of any change you make to the parameters. Once you are satisfied with the way the keyboard responds to your touch, save your changes and leave the velocity adjustment mode by again holding the `FULL LEVEL` key for about 5 seconds. 처음 4개의 노브 `K1` ~ `K4`를 사용하여 `v1` ~ `v4`라는 4개의 매개변수를 조정할 수 있습니다. 그들은 모두 `1.0`에서 `40.0` 사이의 값을 가지며 v1에서 v4로 감소하는 값을 가져야 한다는 제약 조건이 있습니다. (`v1`은 `v2`보다 낮은 값을 가질 수 없고, `v2`는 `v3`보다 낮은 값을 가질 수 없으며 `v3`은 `v4`보다 낮은 값을 가질 수 없습니다.) MPK mini3가 이 "벨로시티 조정 모드"에 있는 동안 키를 정상적으로 사용할 수 있으므로 매개변수에 대한 변경 사항의 효과를 즉시 테스트할 수 있습니다. 키보드가 터치에 반응하는 방식에 만족하면 다시 `FULL LEVEL` 키를 약 5초 동안 눌러 변경 사항을 저장하고 벨로시티 조정 모드를 종료합니다.

What follows is my understanding of what those parameters mean and how to adjust them to get the type of velocity response you want. 다음은 해당 매개변수의 의미와 원하는 벨로시티 응답 유형을 얻기 위해 매개변수를 조정하는 방법에 대한 저의 이해 방식입니다.

I believe the v1 to v4 parameters represent the Y coordinates of 4 control points that determine the shape of the MPK mini3 velocity response curve (Figure 1). Basically, v4 influences the velocity emitted when the lowest pressure is applied to a key, v1 influences the velocity emitted when the highest pressure is applied to a key, and v2 and v3 influence the velocity emitted for mid-range pressures. 저는 `v1`부터 `v4`까지의 매개변수가 MPK mini3 벨로시티 응답 곡선의 모양을 결정하는 4개 제어점의 Y 좌표를 나타낸다고 생각하고(그림 1). 기본적으로 `v4`는 건반에 가장 낮은 압력이 가해질 때 방출되는 벨로시티에 영향을 주고, `v1`은 건반에 가장 높은 압력이 가해질 때 방출되는 벨로시티에 영향을 미치며, `v2`와 `v3`는 중간 범위 압력에 대해 방출되는 벨로시티에 영향을 미칩니다.

 

![](./assets/img/wp-content/uploads/2024/01/akai-mpk-velocity-linear-curve.png)

_**Figure 1.** A velocity response curve. The X axis represents the pressure applied to the keys. The Y axis represents the velocity of the Note On events emitted in response to the pressure of a key. Here, the curve is actually a straight line, meaning the output velocity is directly and simply proportional to the input pressure. The red dots represent the 4 parameters that allow to reshape the curve._ _**그림 1.** 벨로시티 응답 곡선. `X`축은 키에 가해지는 압력을 나타냅니다. `Y`축은 건반을 누르는 것에 반응하여 방출되는 Note On 이벤트의 벨로시티를 나타냅니다. 여기서 곡선은 실제로 직선입니다. 즉, 출력 벨로시티가 입력 압력에 직접적으로 비례한다는 의미입니다. 빨간색 점은 곡선의 모양을 변경할 수 있는 4가지 매개변수를 나타냅니다._

To better understand the effect of these parameters, a simple test is to set them at their maximal (or minimal) values. With maximal values (v1: 40.0, v2: 39.8, v3: 39.6, and v4: 39.4; Figure 2, left panel), the curve is completely shifted towards the top of the output velocity range. Then, almost any pressure will always emit the highest velocity value of 127. Only a very faint pressure will manage to hit the leftmost part of the curve and produce lower velocity values. Conversely, with minimal values (v1: 1.6, v2: 1.4, v3: 1.2, and v4: 1.0; Figure 2, right panel), the curve is completely shifted towards the bottom of the output velocity range. Then, most key presses will produce very low velocity values – practically speaking, the device will be almost silent. Only a very high pressure will manage to hit the rightmost part of the curve and produce higher velocity values. 이러한 매개변수의 효과를 더 잘 이해하려면 매개변수를 최대(또는 최소) 값으로 설정해 보는 간단한 테스트가 필요합니다. 최대 값(`v1: 40.0, v2: 39.8, v3: 39.6, v4: 39.4`, 그림 2, 왼쪽 패널)을 사용하면 곡선이 출력 벨로시티 범위의 상단으로 완전히 이동합니다. 그러면 거의 모든 압력이 항상 가장 높은 벨로시티 값인 127을 방출합니다. 매우 약한 압력만이 곡선의 가장 왼쪽 부분에 도달할 때 더 낮은 벨로시티 값을 생성합니다. 반대로 최소값(`v1: 1.6, v2: 1.4, v3: 1.2, v4: 1.0`, 그림 2, 오른쪽 패널)을 사용하면 곡선이 출력 벨로시티 범위의 아래쪽으로 완전히 이동합니다. 그런 다음 대부분의 키를 누르면 매우 낮은 벨로시티 값이 생성됩니다. 실제로 말하면 장치는 거의 조용합니다. 매우 높은 압력만이 곡선의 가장 오른쪽 부분에 도달하여 더 높은 벨로시티 값을 생성합니다.

 

![](./assets/img/wp-content/uploads/2024/01/akai-mpk-velocity-minmax-curves.png)

_**Figure 2.** Maximal and minimal response curves. Left, the response curve produced by setting all parameters at their maximal values. Most key presses, except those applied with the faintest force, will hit the plateau at the top of the output range and will therefore constantly emit the highest velocity values. Right, the response curve produced by setting all parameters at their minimal values. Most key presses, except those applied with the greatest force, will hit the plateau at the bottom of the output range and will therefore constantly emit the lowest velocity values._ _**그림 2.** 최대 및 최소 응답 곡선. 왼쪽은 모든 매개변수를 최대값으로 설정하여 생성된 응답 곡선입니다. 가장 약한 힘을 가한 키를 제외한 대부분의 키 누름은 출력 범위의 상단에 도달하므로 지속적으로 가장 높은 벨로시티 값을 방출합니다. 오른쪽은 모든 매개변수를 최소값으로 설정하여 생성된 응답 곡선입니다. 가장 큰 힘을 가하는 키를 제외한 대부분의 키 누르기는 출력 범위의 맨 아래에 있는 플래토(plateau)에 도달하므로 지속적으로 가장 낮은 벨로시티 값을 방출합니다._

 

With that in mind, you can shape the response curve to get the kind of answer you like. For reference, the left panel on Figure 3 shows the original response curve of my MPK mini3 (v1: 24.0, v2: 6.0, v3: 4.0, v4: 2.4). The curve is greatly shifted towards the bottom, which is why most key presses tend to produce low or very low velocity values. The right panel on the same figure shows the curve I am now using (v1: 30.0, v2: 20.0, v3: 18.0, v4: 9.0); it is closer to a linear curve, but with a flattened region in the center. With such a curve, most key presses will produce mid-level velocity values, but there are still room to reach both the lower and higher ranges. 이를 염두에 두고 응답 곡선을 형성하여 원하는 결과를 얻을 수 있습니다. 참고로 그림 3의 왼쪽 패널은 MPK mini3(`v1: 24.0, v2: 6.0, v3: 4.0, v4: 2.4`)의 원래 응답 곡선(초기값)을 보여줍니다. 곡선이 아래쪽으로 크게 이동하기 때문에 대부분의 키를 누를 때 벨로시티 값이 낮거나 매우 낮은 경향이 있습니다. 같은 그림의 오른쪽 패널에는 현재 사용 중인 곡선이 표시됩니다(`v1: 30.0, v2: 20.0, v3: 18.0, v4: 9.0`). 이는 선형 곡선에 더 가깝지만 중앙에 평평한 영역이 있습니다. 이러한 곡선을 사용하면 대부분의 건반을 누르면 중간 수준의 벨로시티 값이 생성되지만 여전히 낮은 범위와 높은 범위 모두에 도달할 여지가 있습니다.

 

![](./assets/img/wp-content/uploads/2024/01/akai-mpk-velocity-orignew-curves.png)

Figure 3. Practical response curves. Left, the response curve as it was on the device out of the box. Right, the response curve that I have set for myself. 그림 3. 실제 반응 곡선입니다. 왼쪽은 디바이스의 반응 곡선 초기값입니다. 오른쪽은 제가 직접 설정한 반응 곡선입니다.

(I am not pretending that “my” curve is ideal, though I do believe it is better than the default one. The point is that you should try tweaking the parameters until the MPK mini3 behaves in a way that you like.) ("제" 곡선이 이상적이라고 주장하는 것은 아니지만 기본 곡선보다 낫다고 생각합니다. 요점은 MPK mini3가 원하는 방식으로 작동할 때까지 매개변수를 조정해야 한다는 것입니다.)

 

#### **Adjusting the sensitivity of the black keys** **검은 건반의 감도 조정**

Beyond the four control points of the velocity response curve, the velocity adjustment mode offers a fifth parameter (adjustable with the K5 knob): the Black bal, or “black to white balance”. 벨로시티 응답 곡선의 4개 제어 지점 외에도 벨로시티 조정 모드는 다섯 번째 매개변수(`K5` 노브로 조정 가능)인 `Black Bal` 또는 "화이트 대비 블랙의 밸런스"를 제공합니다.

That parameter can take a value between 0.5 and 2.0. A value of 1.0 means the black keys will respond to pressure exactly as the white keys. A value of 0.5 means the black keys will be half as sensitive as the white keys – i.e. for the same pressure, a black key will emit a velocity value 50% lower than a white key. Conversely, a value of 2.0 means the black keys will be twice as sensitive as the white keys – for the same pressure, a black key will emit a velocity value twice as high as a white key. 해당 매개변수는 `0.5`에서 `2.0` 사이의 값을 가질 수 있습니다. 값이 `1.0`이면 검은 건반이 흰 건반과 똑같이 압력에 반응한다는 의미입니다. 값이 `0.5`라는 것은 검은 건반이 흰 건반보다 절반만큼 민감하다는 것을 의미합니다. 즉, 동일한 압력에 대해 검은 건반은 흰 건반보다 50% 낮은 벨로시티 값을 방출합니다. 반대로 값이 `2.0`이면 검은 건반이 흰 건반보다 두 배 더 민감하다는 의미입니다. 동일한 압력에 대해 검은 건반은 흰 건반보다 두 배 높은 벨로시티 값을 방출합니다.

The default value, at least on my MPK3, was 0.7, so the black keys default to being slightly less sensitive than the white keys. 적어도 제 MPK3에서는 기본값이 `0.7`이었으므로 검은색 건반은 기본적으로 흰색 건반보다 약간 덜 민감합니다.
