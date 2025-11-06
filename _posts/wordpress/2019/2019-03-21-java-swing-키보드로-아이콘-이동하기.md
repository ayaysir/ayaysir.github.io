---
title: "Java Swing: 키보드로 아이콘 이동하기"
date: 2019-03-21
categories: 
  - "DevLog"
  - "Java"

---

Java 로 그림 움직이기

난 그냥 그림 하나만 움직이고 싶었을 뿐인데.. 왜이렇게 어려워..


{% youtube "https://youtu.be/XfArE4XsuAw" %}

## Gist 에서 보기

[https://gist.github.com/ayaysir/8e98e66f8f6190165fbd7167e5c1c1ad](https://gist.github.com/ayaysir/8e98e66f8f6190165fbd7167e5c1c1ad)

## 코드

```java
package blog.gui;

import java.awt.Cursor;
import java.awt.EventQueue;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Keyboard1 extends JFrame{

  static final long serialVersionUID = 4982848;

  private ImageIcon human = new ImageIcon("human.jpg");	
  
  private final int STEP_NUM = 20;

  private JLabel background = new JLabel(new ImageIcon("background.jpg"));
  private JButton buttonHuman = new JButton();

  public Keyboard1() {

    super("키보드 이동");

    this.setSize(1280, 720);
    this.setLocationRelativeTo(null);
    this.setDefaultCloseOperation(EXIT_ON_CLOSE);

    this.setLayout(null);
    this.setResizable(false);

    background.setSize(1280, 720);    

    Toolkit tk = Toolkit.getDefaultToolkit();
    super.setIconImage(tk.getImage("human.jpg"));

    this.start();

    this.setVisible(true);

  }

  public void start() {        

    this.buttonHuman.setBounds(520, 360, 100, 100);        

    // 이미지 추출 후 사이즈 변환
    Image img = human.getImage()
        .getScaledInstance(100, 100, Image.SCALE_SMOOTH);
    // 변환된 이미지를 다시 아이콘으로 치환
    human = new ImageIcon(img);

    buttonHuman.setIcon(human);
    buttonHuman.setContentAreaFilled(false);	// 버튼 색상 제거
    buttonHuman.setBorderPainted(false);	// 경계선 제거
    buttonHuman.setCursor(new Cursor(Cursor.HAND_CURSOR));

    this.add(buttonHuman);
    this.add(background);

    this.buttonHuman.addKeyListener(new KeyListener() {

      @Override	// 키보드 방향키 이벤트 부여
      public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();

        if (key == KeyEvent.VK_LEFT) {
          move(buttonHuman, -STEP_NUM, 0);
        }

        if (key == KeyEvent.VK_RIGHT) {
          move(buttonHuman, STEP_NUM, 0);
        }

        if (key == KeyEvent.VK_UP) {
          move(buttonHuman, 0, -STEP_NUM);
        }

        if (key == KeyEvent.VK_DOWN) {
          move(buttonHuman, 0, STEP_NUM);
        }
        
      }

      @Override
      public void keyReleased(KeyEvent e) {            

      }            

      @Override
      public void keyTyped(KeyEvent e) {

      }
    });

  }

  private void move(JButton buttonHuman, int x, int y) {
    int currentX = buttonHuman.getX();
    int currentY = buttonHuman.getY();
    JPanel parentPanel = null;

    if(buttonHuman.getParent() instanceof JPanel) {
      parentPanel = (JPanel) buttonHuman.getParent();
    }

    // 부모 패널의 가로세로, 버튼의 가로세로 길이 
    int parentWidth = parentPanel.getWidth();
    int parentHeight = parentPanel.getHeight();   
    int buttonWidth = buttonHuman.getWidth();
    int buttonHeight = buttonHuman.getHeight();
    
    System.out.println(parentWidth + ", " + parentHeight 
        + " : " + currentX + ", " + currentY
        + " : " + (currentX + buttonWidth) + ", " + (currentY + buttonHeight));

    // 현재 X의 좌표가 마이너스인데 x 입력값도 마이너스이거나,
    // 현재 (X 좌표 + 버튼 가로 길이)의 값이 부모 패널의 길이보다 크면 더 이상 움직이지 않는다.
    if(currentX <= 0 + -x / 4  && x < 0 || currentY <= 0 + -y / 4 && y < 0 
        || (currentX + buttonWidth + x / 4) >= parentWidth && x > 0
        || (currentY + buttonHeight + y / 4) >= parentHeight && y > 0) {
      return;
      
    } else {
      // Jdk 8 이상
      new Thread(() -> {		

        int ix = x > 0 ? 1 : -1;
        int iy = y > 0 ? 1 : -1;
        while(true) {
          
          int xChunk = 0;	// 움직일 값 (1 또는 -1)
          int yChunk = 0;
          boolean condition = false;
          
          if(x != 0 && y == 0) {
            xChunk = (ix > 0 ? ix++ : ix--);
            condition = (ix == x);
          } else if(x == 0 && y != 0) {
            yChunk = (iy > 0 ? iy++ : iy--);
            condition = (iy == y);
          } 
          
          buttonHuman.setLocation(currentX + xChunk, currentY + yChunk);
          
          // 컨디션을 만족하면 종료한다.
          if(condition) {
            break;
          }
          
          // 최소 1ms 이상을 슬립해 이동 모션을 부드럽게 한다. 
          try {
            Thread.sleep(2, 500);
          } catch (InterruptedException e) {
            e.printStackTrace();
          }
        }

      } ).start();

    }
  }

  public static void main(String[] args) {
    
    EventQueue.invokeLater(new Runnable () {
      public void run()
      {
        new Keyboard1();
      }
    });
  }
}

```

