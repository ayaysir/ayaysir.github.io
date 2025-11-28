---
published: false
title: "Java: 주소에 의한 참조(Call-by-reference)"
date: 2019-01-21
categories: 
  - "DevLog"
  - "Java"

tags: 
  - "java"
---

**_주소에 의한 참조_**는 무슨 말일까요? 메모리에 어떤 값을 저장했다면 그 값이 담긴 방(room)과 그 방을 가리키는 주소가 있습니다. **Call-by-reference**는 주소를 **참조**(reference)해서 값들을 조작합니다. 메소드 간 통신(값이나 주소를 주고받는 행위)을 한다고 할 때 주소만 넘겨서 서로 주소를 공유하고 값들을 공유해서 조작하는 방법을 뜻합니다. C 언어에서 다루는 **포인터**(Pointer)에서 연장된 개념이라고 볼 수 있겠네요.

이에 대비되는 개념으로 **Call-by-value**가 있습니다.  그 방에 들어가 바로 **값**(value)을 꺼내오고 값 자체를 넘겨버립니다. 이 과정에서 메모리 주소는 절대 알려주지 않습니다. 그러므로 메소드 간 통신시 전달하거나 받은 값은 각각 메소드가 알아서 조작하고 그 값이 바뀐 결과가 공유되거나 하지 않습니다.

포켓몬 고를 비유로 들면(실제로 해본적은 없어요) 이웃이 피카츄가 동네 체육관에 나타났다고 해서 나도 좀 알려달라고 부탁하는 상황이라면 Call-by-refence 방식은 그 체육관의 주소를 알려주는 것이고, Call-by-value 방식은 체육관을 통째로 복제한 다음 눈 앞에 던져주는 거랑 똑같다고 보면 되겠습니다.

다음 예제를 보면 그냥 `Shop`과 `BeginnerShop`이 있는데, `shop`은 `reference` 호출을 하며, `BeginnerShop`은 `value` 호출을 합니다. 결과를 보면 차이를 알 수 있을 것입니다.

```java
import java.util.Scanner;
 
public class CallByReference {
    
    static Scanner s = new Scanner(System.in);
 
    public static void main(String[] args) {
    	
        // 주인공의 정보는 메인 프로그램에 만드는것이 적합함
        
    /*  int lv = 1;
        int gold = 1000;
        int att = 100;
        int def = 50;*/
        
        // 이 정보들을 메소드간에 어떻게 공유할것인가?
        // gold의 주소를 넘기면 된다.
        
        // 0:레벨, 1:골드, 2:공격, 3:방어 
        int[] playerInfo = {1, 1000, 100, 50};
        
        System.out.println("바람의 나라 게임에 접속한 것을 환영합니다.");
        System.out.println("마을");
        System.out.println("어디?");
        System.out.print("1. 남쪽(상점-베테랑) / 2. 동쪽(상점-초보) ... >> ");
        
        int menu = s.nextInt();
        
        switch(menu) {
        case 1:
            shop(playerInfo);
            break;
        case 2:
        	beginnerShop(playerInfo[0], playerInfo[1], playerInfo[2], playerInfo[3]);
        }
        
        System.out.println("\n상점 이용 후 남은 돈: " + playerInfo[1]);
    
    }
    
    // Call-by-value로 값을 넘겨줬다면 상점에 다시 접속하면 모든 정보가 초기 정보로 리셋되어 있을것
    // Call-by-reference로 주소를 넘겨줬으므로 아이템 구입에 따라 다시 접속해도 리셋되지 않음
    public static void shop(int[] playerInfo)
    {
        
        while(true)
        {
            System.out.println("\n상점, 무엇?");
            System.out.println("1. 포션(100G)");
            System.out.println("2. 검(500G)");
            System.out.println("....");
            System.out.print("입력: ");
            int menu = s.nextInt();
            
            if(menu == 1)
            {
                playerInfo[1] -= 100;
                System.out.println("\n포션 구입");
                System.out.println("남은 돈: " + playerInfo[1]);
            }
            else if(menu == 2)
            {
                playerInfo[1] -= 500;
                System.out.println("\n검 구입");
                System.out.println("남은 돈: " + playerInfo[1]);
            }
            else
                break;
        }
        System.out.println("\n상점을 빠져나왔다. ");
        
    } 
    
    public static void beginnerShop(int level, int gold, int att, int def)
    {
        
        while(true)
        {
            System.out.println("\n상점입니다, 무엇을 구매하시겠습니까?");
            System.out.println("1. 포션(100G)");
            System.out.println("2. 검(500G)");
            System.out.println("....");
            System.out.print("입력: ");
            int menu = s.nextInt();
            
            if(menu == 1)
            {
                gold -= 100;
                System.out.println("\n포션 구입");
                System.out.println("남은 돈: " + gold);
            }
            else if(menu == 2)
            {
                gold -= 500;
                System.out.println("\n검 구입");
                System.out.println("남은 돈: " + gold);
            }
            else
                break;
        }
        System.out.println("\n이용해주셔서 감사합니다. ");
        
    } 
 
}
```

 

**일반 상점(call-by-reference)**

```
(......)
상점, 무엇?
1. 포션(100G)
2. 검(500G)
....
입력: 2

검 구입
남은 돈: 400

상점, 무엇?
1. 포션(100G)
2. 검(500G)
....
입력: 3

상점을 빠져나왔다.

상점 이용 후 남은 돈: 400
```

**초보 상점(call-by-value)**

```
상점입니다, 무엇을 구매하시겠습니까?
1. 포션(100G)
2. 검(500G)
....
입력: 2

검 구입
남은 돈: 400

상점입니다, 무엇을 구매하시겠습니까?
1. 포션(100G)
2. 검(500G)
....
입력: 0

이용해주셔서 감사합니다.

상점 이용 후 남은 돈: 1000
```
