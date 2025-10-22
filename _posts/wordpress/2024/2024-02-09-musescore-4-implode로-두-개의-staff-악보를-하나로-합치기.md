---
title: "MuseScore 4: Implode로 두 개의 Staff 악보를 하나로 합치기"
date: 2024-02-09
categories: 
  - "StudyLog"
  - "MuseScore 4"
---

### **소개**

두 Staff를 합쳐서 다른 Staff에 붙여넣는 작업을 하려고 합니다. (하단 악보 참조)

- 두 개의 Staff로 분리된 `F. Horn 1 & 2`, `F. Horn. 3 & 4`의 악보를 `Trombone 1` 악보에 합쳐서 같은 보이스(Voice)로 이루어진 Trombone 1 악보처럼 만들려고 합니다.
    - Voice가 다르면 악보 모양 자체가 달라지고, 두 성부의 리듬이 같은 경우에는 같은 보이스로 관리하는 것이 편리한 경우가 있습니다.
- `Implode` 기능과 특별한 선택 두 기능을 사용해서 호른 두 파트를 아래 Trombone 1 처럼 합칠 수 있습니다.
    - implode 뜻: 자체적으로 파열되다, 폭파하여 안쪽으로 붕괴하다; (문화 따위가) 한 점에 집중하다, 통합되다

\[caption id="attachment\_6271" align="alignnone" width="565"\]![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-09-오후-10.20.35-복사본.jpg) 두 파트를 하나의 보이스로 합쳐서\[/caption\]

\[caption id="attachment\_6272" align="alignnone" width="563"\]![](./assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-09-오후-10.48.05-복사본.jpg) 악보를 생성\[/caption\]

 

#### **전제조건**

- 두 파트에서 선택한 범위의 리듬이 동일해야 합니다.

 

#### **참조**

- [MuseScore 공식 매뉴얼: Implode and explode](https://musescore.org/en/handbook/4/implode-and-explode)

 

#### **방법**

- Implode 시키면 두 보이스로 악보가 합쳐집니다.
- 보이스 2의 악보를 보이스 1로 변경합니다.
- 보이스 2의 잔존 요소(쉼표 등)들을 제거합니다.

 

##### **(1) implode 시키기**

두 파트에 걸친 범위를 선택 후 `implode`를 실행하면 별도의 보이스로 악보가 합쳐지게 됩니다.

1. `F Horn 1 & 2`에서 복사할 영역을 선택한 후 `Trombone 1`에 붙여넣기합니다.
2. Implode는 연속된 Staff에서 실행할 수 있습니다. `F Horn 3 & 4` 의 악보를 임시로 사용하기 위해 1번과 동일한 영역을 선택한 뒤 바로 밑 Staff인 `Trombone 3`에 복사 붙여넣기합니다.
3. 합칠 두 파트를 선택한 뒤 상단 메뉴 `Tools > Implode`를 클릭합니다.
4. 상단 부분(Trombone 1)은 파란색(`Voice 1`)로, 하단 부분(Trombone 3)은 초록색(`Voice 2`)로 합쳐졌습니다. Trombone 3에 임시로 붙여넣은 악보는 삭제합니다.

\[gallery type="slideshow" link="none" size="full" ids="6280,6279,6283,6281"\]

 

##### **(2) Voice 2 (초록색)을 Voice 1로 변환**

하나의 보이스로 합치는 것을 원하기 때문에 보이스 2를 보이스 1로 변환합니다.

1. 최초에는 두 보이스 모두 선택된 상태입니다. 여기서 보이스 2만 선택합니다. 범위가 선택된 상태에서 Trombone 1의 합쳐진 부분의 `초록색`(Voice 2 선택색상)의 `아무 노트를 선택`한 후 `마우스 오른쪽 버튼 > Select > More...`를 클릭합니다.
2. `Same voice` 체크박스를 클릭한 뒤 `OK` 버튼을 누릅니다.
3. 보이스 1은 선택 해제되고 보이스 2(초록색)만 선택된 상태가 됩니다.
4. 이 상태에서 상단 툴바의 `Voice 1 버튼`을 누릅니다. 이 버튼을 누르면 보이스 2가 1로 변경됩니다.
5. 파란색으로 변경되면 보이스 1로 변환된 것입니다.

\[gallery type="slideshow" link="none" size="full" ids="6285,6286,6289,6288,6287"\]

 

##### **(3) Voice 2의 모든 쉼표 삭제**

(2)번 작업을 마치면 보이스 2의 쉼표가 남아있게 됩니다. 보이스 2에 아무것도 없어야 하므로 지워야 합니다.

1. 범위를 선택하고 초록색(Voice 2 선택색상)의 `아무 쉼표(rest)`를 `선택`한 후 `마우스 오른쪽 버튼 > Select > More...`를 클릭합니다. `Same voice` 체크박스를 클릭한 뒤 `OK` 버튼을 누릅니다.
2. 보이스 2(초록색)의 쉼표만 선택된 상태가 됩니다. 키보드의 `백스페이스`(또는 `Del`) 키를 눌러 선택된 쉼표를 삭제합니다.
3. 보이스 2의 모든 요소가 제거되었습니다.

\[gallery type="slideshow" size="full" ids="6290,6291,6292"\]
