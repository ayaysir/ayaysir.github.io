---
published: false
title: "자바 Swing: for문으로 만든 컴포넌트에 접근 + 예제: 틱택토(Tic Tac Toe)"
date: 2019-01-28
categories: 
  - "DevLog"
  - "Java"

---

이전 글: [Java Swing 예제: 다차원 배열 표시하기 (기초 설정 방법, for문으로 swing 요소 반복 등)](http://y1oonbumtae.com/?p=588)

for문으로 생성한 컴포넌트에 대한 접근 방법은 다음과 같습니다.

##### **1\. 컴포넌트들의 배열을 뽑아 인덱스 번호로 접근하는 방법**

```
JPanel nineRoom = new JPanel();
(...)
  for(int i = 0; i < 9; i++) {
    JButton tempButton = new JButton("");
    tempButton.setFont(new Font("Impact", Font.PLAIN, 22));
    nineRoom.add(tempButton);
  }
    
(...)
String btnText1 = ((JButton)nineRoom.getComponent(0)).getText();
String btnText2 = ((JButton)nineRoom.getComponent(1)).getText();
(...)
```

 

##### **2\. 마우스 클릭 이벤트를 각 버튼마다 부여해 클릭한 위치값으로 컴포넌트를 얻어내는 방법**

```
MouseListener ml = new MouseAdapter() {
  @Override
  public void mouseClicked(MouseEvent e) {
    JButton tempButton = (JButton)e.getComponent();
    tempButton.setText("바꿀 텍스트");
(...)
  }
}
```

 

##### **\* 이벤트 부여 방법**

```
for(Component c : nineRoom.getComponents()) {
  c.addMouseListener(ml);
}
```

 

* * *

##### **예제: 틱택토(Tic Tac Toe)**

틱택토라고 3칸오목짜리 게임이 있는데 프로그래밍 예제로 많이 만드는 편입니다. 이 예제는 인공지능 컴퓨터와 대결하는 것은 아니고 아직은 한 사람이 일인이역으로 클릭하는 수준입니다.

https://gist.github.com/ayaysir/1bec0f410a34f0c427113e0c63967c07

![틱택토 예제](./assets/img/wp-content/uploads/2019/01/tictactor-opetie.gif)
