---
title: "Java Swing 예제: 다차원 배열 표시하기 (기초 설정 방법, for문으로 swing 요소 반복 등)"
date: 2019-01-09
categories: 
  - "DevLog"
  - "Java"

---

Swing의 기초 코드와 요소 반복 예제입니다. Swing 코드 작성 순서는 대략 다음과 같습니다.

1. javax.swing.JFrame 클래스를 상속받는 클래스를 생성
2. 라벨, 박스, 패널 등 컴포넌트 요소들을 private으로 선언
3. 프레임의 초기 설정을 생성자 또는 적당한 위치에서 선언
4. 컴포넌트 요소들을 프레임에 배치하는 메소드를 작성

```
package com.apple.hangeul;

import java.awt.Color;
import java.awt.Font;
import java.awt.GridLayout;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.swing.BorderFactory;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;

public class PrintArray extends JFrame {

  static final long serialVersionUID = 0;

  // 1. 라벨, 박스, 패널 등을 private으로 선언    
  private JPanel innerPanel;
  private List<?>[] list;
  private int maxSize; 

  // 2. 초기 설정을 생성자 또는 적당한 위치에서 선언
  public void init(List<?>... list)    {

    // 1칸당 80px
    System.out.println(list.length);
    maxSize = list[0].size();
    for(List<?> i : list) {
      if(i.size() > maxSize)	maxSize = i.size();
    }
    this.setSize(80 * maxSize, 40 + 80 * list.length);
    this.setTitle("Array");
    this.setLocationRelativeTo(null);	// 정중앙 위치에 배치
    this.setDefaultCloseOperation(EXIT_ON_CLOSE);

    innerPanel = new JPanel();
    innerPanel.setLayout(new GridLayout(list.length, 3));// (열, 행): 열의 수가 중요
    innerPanel.setBorder(new EmptyBorder(10, 10, 10, 10));
    innerPanel.setBackground(Color.WHITE);
    this.add(innerPanel);
    this.list = list;

    this.initComp();
    this.setVisible(true);  // setVisible을 이곳에서 실행              
  }

  public PrintArray(int[] intArr) {
    // To boxed list (int -> Integer)
    List<Integer> tempList =  Arrays.stream( intArr ).boxed().collect( Collectors.toList() );
    init(tempList);
  }
  public PrintArray(int[][] intArr) {
    List<?>[] tempArr = new List<?>[intArr.length];
    System.out.println(intArr.length);
    for(int i = 0; i < tempArr.length; i++) {
      tempArr[i] = Arrays.stream( intArr[i] ).boxed().collect( Collectors.toList() );
    }    
    init(tempArr);
  }
  // Character는 위와 같은 stream을 쓰는 방법이 불가능
  public PrintArray(char[] charArr) {
    List<Character> tempList = new ArrayList<>();
    for(char c : charArr) {
      tempList.add((Character) c);
    }
    init(tempList);
  }

  public PrintArray(char[][] charArr) {
    List<?>[] tempArr = new List<?>[charArr.length];
    for(int i = 0; i < tempArr.length; i++) {
      List<Character> tempList = new ArrayList<>();
      for(char c : charArr[i]) {
        tempList.add((Character) c);
      }
      tempArr[i] = tempList;
    }    
    init(tempArr);
  }

  // 3. 실제 요소들을 배치하는 메소드를 작성
  public void initComp() {

    for(int i = 0; i < list.length; i++) {
      List<?> tempList = (List<?>) list[i];
      /* 요소들을 for문으로 배치하기 */
      for(int j = 0; j < maxSize; j++) {
        JLabel lbl = new JLabel("");
        try {
          lbl.setOpaque(true);	// 이 코드가 있어야 레이블에 색 서식 적용됨
          // 0인 경우엔 공백 처리. 아니면 색칠
          if(tempList.get(j) instanceof Integer 
              && (Integer)tempList.get(j) == 0) {
            lbl.setBackground(Color.WHITE);
          } else {
            lbl.setText("" + tempList.get(j)  + "");
            lbl.setBackground(Color.ORANGE);
          }
          // 가운데 정렬
          lbl.setHorizontalAlignment(JLabel.CENTER);
          lbl.setFont(new Font("Impact", Font.PLAIN, 22));
          lbl.setBorder(BorderFactory.createLineBorder(Color.WHITE, 3));
          innerPanel.add(lbl);
        } catch(Exception e) {
          // 이 메소드는 다차원 배열의 각 행의 
          // 길이가 뒤죽박죽일 때 예외가 나는 점을 이용해
          // 예외가 났다면 빈 공간으로 간주하고 빈칸을 그리는 부분
          lbl.setOpaque(true);
          lbl.setBackground(Color.LIGHT_GRAY);
          lbl.setBorder(BorderFactory.createLineBorder(Color.WHITE, 3));
          innerPanel.add(lbl);
          continue;
        }
      }
    }
  }

  public static void main(String[] args) {

    int[][] example = {
      {12, 2, 50, 4, 11, 169, 83 ,61, 200},
        {300, 542, 396, 8833},
        {15234, 59, 1932}
      };
    new PrintArray(example);

  }

}
```

 ![](/assets/img/wp-content/uploads/2019/01/스크린샷-2019-01-09-오후-9.14.39.png)

아래는 정보처리기사 실기에서 나오는 배열 예제(모래시계 배열)입니다.

 ![](/assets/img/wp-content/uploads/2019/01/스크린샷-2019-01-09-오후-9.14.53.png)
