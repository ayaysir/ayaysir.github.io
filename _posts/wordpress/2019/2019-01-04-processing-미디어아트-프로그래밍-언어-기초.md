---
title: "Processing: 미디어아트 프로그래밍 언어 기초"
date: 2019-01-04
categories: 
  - "DevLog"
  - "Processing"
---

프로세싱(Processing)은 멀티미디어 아트, IoT 장비 등을 다루기 위한 특수 프로그래밍 언어입니다. JVM 가상 머신을 기반으로 하였기 때문에 자바와 많은 부분이 유사합니다. 자바 초급 수준의 프로그래밍을 학습하였다는 전제 하에 기초적인 부분만 살펴보도록 하겠습니다.

직접 프로세싱 IDE 프로그램을 설치 후 실행하는 방법 또는 온라인에서 실행해불 수 있는 [사이트](https://www.openprocessing.org/sketch/create)에서 작성 후 실행하는 방법 등이 있습니다.

가장 중요한 부분은 `void setup()`과 `void draw()` 메소드의 차이점입니다. `setup`은 프로그램이 실행되었을 때 처음에 **최초 한 번만 실행**합니다. 그리고 `draw`는 프로그램이 시작하고 (정확히 말하면 `setup` 메소드가 실행된 후) 종료될 때 까지 초당 60번(**60fps**) 해당 메소드를 재귀적으로 **반복하여 실행**합니다. 3번 예제에서 자세히 살펴보도록 하겠습니다. fps는 기본이 60fps이며 별도로 바꿀 수 있습니다.

#### **1\. 사각형, 원, 색칠하기**

```
void setup() {
 
  // 자동 정렬: Ctrl + T
  println("콘솔창에 표시");
  size(300, 300);  // 창 크기 (가로, 세로)
  color c = color(105, 104, 155); 
  background(c);
}
 
void draw() {
  noStroke();  // 도형 주위에 획을 긋지 않는다.
  rect(50, 50, 100, 100);  // 사각형을 그린다 (x:가로위치, y:세로위치, w:너비, h:높이)
 
  ellipse(25, 25, 80, 80);  // w, h 기반의 원(ellipse)을 그린다. (x, y, w, h)
 
  color c = color(65); // Grayscale 색상 입력
  fill(c);  // color 타입의 변수 'c' 를 채우기(fill) 색상으로 사용한다.
  ellipse(75, 75, 80, 80);
 
  // colorMode가 지정되지 않은 경우
  // 스케일 0-255의 RGB 기본값이 사용됩니다.
  c = color(50, 55, 100); // RGB 색상 입력
  fill(c);
  rect(100, 210, 45, 80);  // 사각형을 그린다.(x, y, w, h) 
 
  colorMode(HSB, 1);  // 색상 모드로 0~1 단위의 HSB(Hue, Saturation, Brightness)를 사용 
  c = color(0.5, 1, 192, 1);
  //alpha 도 colorMode에서 설정한 max 값에 영향을 받음
  fill(c);
  rect(155, 210, 45, 80);  // Draw right rect
  
  // 이미지로 저장. line-000001.png, line-000002.png, etc.
  saveFrame("line-######.png");
```

자바와는 달리 클래스, main 메소드 부분은 필수적으로 작성할 필요가 없습니다. 콘솔 출력은 `print`나 `println`으로 간단하게 입력할 수 있습니다. 예제에 있는 `noStroke`, `size`, `fill` 등의 메소드는 프로세싱 언어에서 자체 제공하는 메소드로 임포트나 인스턴스 생성 등의 과정 또한 필요없습니다. `saveFrame(파일명)`은 프레임을 이미지로 저장하는 기능인데, 60fps인 경우 이미지를 60개 이상 저장하므로 주의하시기 바랍니다. 

`color(int:gray)`는 그레이스케일 기반 색상정보를 입력합니다. 안의 숫자는 0 ~ 255 사이의 정보를 입력합니다. RGB의 각 색상 비율이 1:1:1인 경우 나오는 색상은 그레이스케일이므로 만약 `color(65)`를 입력했다면 [rgb(65, 65, 65)](https://rgb.to/rgb/65,65,65)와 같은 것입니다. color 메소드는 오버라이딩되어 있어서 여러 방식으로 사용할 수 있는데, `color(int:r, int:g:, int:b)` 처럼 파라미터가 3개인 경우는 RGB값을 입력받습니다.

`colorMode(HSB, 1)`은 색상 정보를 RGB 대신 HSB(Hue: 색조, Saturation: 채도, Brightness: 휘도) 를 사용하고, 최대값을 1로 합니다. 만약 1 대신 100이라면 0 ~ 100 내에서 설정합니다. 위의 예제 중 `color(0.5, 1, 192, 1)` 부분의 192는 최대값 1을 한참 벗어나는데 이렇게 작성해도 오류는 나지 않고 192는 최대값인 1로 취급되어 실행됩니다.

![](./assets/img/wp-content/uploads/2019/01/line-000002.png)

#### **2\. draw() 메소드**

```
// 전역 변수 선언float yPos = 0.0;int pressCount = 0;
 
void setup() { 
  size(200, 200);
  frameRate(30);
}
 
void draw() { 
  background(204);
  yPos = yPos - 1.0;
  if (yPos < 0) {
    yPos = height;
  }
  line(0, yPos, width, yPos);  // (점1의x, 점1의y , 점2의x, 점2의y)
  
  // 10번 클릭하면 종료
  if(pressCount >= 10){
    exit();
  }
  
  saveFrame("line-######.png");
}
 
 
// 마우스 왼쪽 버튼을 눌렀을 경우 실행 
void mousePressed() {
  line(mouseX, 10, mouseX, 150);
  pressCount++;
}
```

`setup` 메소드에서 `frameRate(30)`은 fps를 30으로 바꾸는 부분입니다. `line` 메소드는 점 1에서 점 2까지 직선으로 이어주는 역할을 합니다. `width`, `height`는 기본으로 제공되는 전역 변수로 전체 캔버스의 너비, 높이를 반환합니다. 직선의 가로 위치는 0에서 `width`까지 고정되어 있으며, `draw`가 실행될 때 전역 변수인 `yPos`는 0이하일 경우 `height` 값으로 치환되고, 이후 1씩 감소하므로 결과적으로 직선의 `yPos`값은 1초에 30씩 줄어들게 됩니다. 한편 `mouseX`도 프로세싱에서 기본적으로 제공하는 변수이며, 클릭한 곳의 x좌표값을 반환합니다.

https://giphy.com/gifs/programming-java-bgsmm-MZ3m26FDPu11nWqRKj

#### **3. 음악 재생 (외부 라이브러리 minim 이용)**

음악을 재생하고 미디어 플레이어 같은 곳에서 볼 수 있는 비주얼 그래프도 만들어 보겠습니다. 이 예제는 **minim**이라는 외부 라이브러리를 필요로 합니다. 라이브러리 추가 방법은 **Processing IDE에서 스케치 > 내부 라이브러리 > 라이브러리 추가하기**를 클릭한 후 검색창에 **minim**을 검색하면 라이브러리 목록이 나옵니다. 그러면 `Install` 버튼을 클릭하면 됩니다.

```
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;
import ddf.minim.signals.*;
import ddf.minim.spi.*;
import ddf.minim.ugens.*;
 
 
/**
 * 이 스케치는 오디오 플레이어를 사용하여 Minim과 파일을 재생하는 방법을 보여줍니다.
 * 또한 오디오의 파형을 그리는 방법을 보여주는 좋은 예입니다. 
 * 오디오 플레이어에 대한 전체 문서는
 * http://code.compartmental.net/minim/audioplayer_class_audioplayer.html에서 찾으실 수 있습니다.
 * Minim 및 추가 기능에 대한 자세한 내용은 
 * http://code.compartmental.net/minim/을 방문하세요.
 */
 
import ddf.minim.*;
 
Minim minim;
AudioPlayer player;
 
void setup()
{
  size(512, 200, P3D); // P3D는 캔버스의 렌더링 모드 중 하나입니다.
 
  // 우리는 이것을 Minim에게 전달해서 그것이 데이터 디렉토리로부터 파일을 로드할 수 있도록 합니다.
  minim = new Minim(this);
 
  // loadFile은 loadImage와 동일한 모든 위치를 찾습니다.
  // 이것은 데이터 폴더와 하위 폴더를 스케치합니다. 절대 경로 또는 URL을 전달할 수도 있습니다.
  player = minim.loadFile("Kalimba.mp3");
 
} 
 
void draw()
{
  background(0);
  stroke(255);
 
  // 파형 그리기
  for (int i = 0; i < player.bufferSize() - 1; i++)
  {
    float x1 = map( i, 0, player.bufferSize(), 0, width );
    float x2 = map( i+1, 0, player.bufferSize(), 0, width );
	
    line( x1, 50 + player.left.get(i) * 50, x2, 50 + player.left.get(i+1) * 50 );
    line( x1, 150 + player.right.get(i) * 50, x2, 150 + player.right.get(i+1) * 50 );
  }
 
  // 곡 재생의 현재 위치를 표시할 라인을 그립니다.
  float posx = map(player.position(), 0, player.length(), 0, width);
  stroke(0, 200, 0);
  line(posx, 0, posx, height);
 
  if ( player.isPlaying() )
  {
    text("Press any key to pause playback.", 10, 20 );
  } else
  {
    text("Press any key to start playback.", 10, 20 );
  }
}
 
void keyPressed()
{
  if ( player.isPlaying() )
  {
    player.pause();
  }
  // 플레이어가 파일 끝에 있으면
  // 되감기 전에 되감아야 합니다
  else if ( player.position() == player.length() )
  {
    player.rewind();
    player.play();
  } else
  {
    player.play();
  }
}

```

`map(value, start1, stop1, start2, stop2)`은 기본 제공되는 메소드로 **한 범위를 다른 범위로 다시 매핑**합니다. 아래  코드를 확인해주세요.

```
float a = map(0.7, 0, 1, 0, 100);
float b = map(110, 0, 100, -20, -10);
println(a); // 70.0 
println(b); // -9.0
```

0 ~ 1 의 사이에 있는 0.7이 만약 0 ~ 100 사이에 있는 경우에는 어떻게 될까요? 70이 됩니다. 이것을 이용해 오디오 플레이어 예제에서 x1 에서 숫자 `i`는 0 ~ `player.bufferSize()` 범위 내에 있는 값인데 이 `i`를 창의 왼쪽 가장자리(0)에서 오른쪽 가장자리(너비)의 범위로 변환합니다. 

여기서 획득한 `x1`, `x2`의 정보를 바탕으로 라인을 그려 그래프를 완성합니다. 라인의 y값은 `left`, `right` 채널별로 각각 받아오며 왼쪽 채널은 50 + α, 오른쪽 채널은 150 + α의 위치에서 그리기를 시작합니다. `player.left.get()` 및 `player.right.get()`에서 반환되는 값은 -**1과 1 사이**입니다. 참고로 파일이 모노(mono)인 경우 왼쪽 채널의 `get()`과 오른쪽 채널의 `get()`은 동일한 값을 반환합니다. `get`으로 받은 값을 50배로 스케일 업 하고, 이것을 1/60초의 찰나의 순간에 파일 버퍼 사이즈만큼 반복하여 화면의 끝까지 그래프를 그립니다. 이것을 60fps로 나열하면 음악이 재생되는 동안 실시간으로 음악 파형을 그래프로 그리는 효과가 나타나게 되는 것이죠.

https://gph.is/g/apVv5Go
