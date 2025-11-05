---
published: false
title: "Java 예제: 기능 분석 - 자바스크립트의 console.log 흉내내기"
date: 2019-01-20
categories: 
  - "DevLog"
  - "Java"

---

자바에서 `System.out.println()`는 디버깅용으로 좀 불편하다.

그리고 요즘 자바보다 자바스크립트를 더 많이 쓰고 있는 관계로

자바에서도 무심코 `console.log()`를 적는 일이 많아졌다.

자바스크립트의 `console.log()`는 `System.out.println()`보다는 약간 더 기능이 많다.

가장 큰 차이로 `System.out.println()`는 여러 개의 변수를 표시하고 싶다면

`System.out.println(a + ", " + b + ", " + c )` 이런 식으로 적어야하지만 (JDK 8 기준)

자바스크립트에서는 `console.log(a, b, c)` 이런식으로 적어도 알아서 표시가 된다.

그러면 먼저 `console.log()`의 기능을 분석해보고 자바에 옮겨 적용해보기로 한다.

[http://yoonbumtae.com/?p=612](http://yoonbumtae.com/?p=612) 이 글에서 약간 분석이 되어있다.

1. 매개변수가 하나인 경우 한 개의 변수를 표시한다.
2. 매개변수가 둘 이상이며 맨 첫번째 매개변수가 printf 포맷이 아니라면 여러 개의 변수를 구분지어 나열한다.
3. 매개변수가 둘 이상이며 맨 첫번째 매개변수가 스트링 형식이면서 printf 포맷이라면 printf와 동일하게 동작한다.
4. 자바스크립트에서는 %c라고 해서 CSS 를 적용하는 기능이 있는데 그 기능은 자바에서 적용하는 것은 무리므로 제외한다.

그리고 `printf()`도 자바와 자바스크립트라는 언어의 차이 때문에 서로 같지 않으므로

여기서는 자바의 `printf()`를 빌려 쓰기로 한다.

```
import java.util.ArrayList;
import java.util.List;

/**
 * 자바스크립트의 console.log를 흉내내는 프로그램
 * 
 * @author yoonbumtae
 *
 */
public class MimicConsole {
  public void log(Object...args) {

    // 정규식은 java.util.Fomatter의 formatSpecifier를 참조
    // 앞뒤에 .*를 붙임으로써 문장이 formatSpecifier가 포함된 형식인지 판단
    String regex = ".*%(\\d+\\$)?([-#+ 0,(\\<]*)?(\\d+)?(\\.\\d+)?([tT])?([a-zA-Z%]).*";

    // 맨 첫 args가 스트링 형식이고 regex와 매치된다면
    // args[0]은 formatterString이고 args[1]부터는 새로운 newArgs로 옮김.
    // else인 경우에는 단순히 오브젝트의 toString()을 나열
    if(args[0] instanceof String && args[0].toString().matches(regex)) {
      Object[] newArgs = new Object[args.length - 1];

      for(int i = 0; i < newArgs.length; i++) {
        newArgs[i] = args[i + 1];
      }
      System.out.printf(args[0].toString(), newArgs);
    } else {
      for(Object o : args) {
        System.out.print(o + "\t");
      }
    }

    System.out.println();

  }

  public static void main(String[] args) {
    // 스프링에서는 MimicConsole을 Bean이나 Component로 등록한 뒤
    // @Autowired해서 쓸 수 있음
    MimicConsole console = new MimicConsole();

    console.log("String");
    console.log("String", 39, 16.5);

    List<String> strList = new ArrayList<>();
    strList.add("salmon");
    strList.add("Herring");
    console.log(strList, console);

    System.out.printf("%S", "sTRING");
    int d = 5399;
    console.log("%s %3f 입니다. [%d]", "person", 3.12345, d);

  }
}
```

```
String 
String 39 16.5 
[salmon, Herring] com.apple.hangeul.MimicConsole@7852e922 
STRINGperson 3.123450 입니다. [5399]
```

특이한 코드라고 한다면 `variableName instanceof Object(또는 다른 타입)` 라고 해서

해당 타입과 일치하는지 판단하는 연산자? 가 있고

`matches(String regex)`는 해당 스트링이 정규식과 완전 일치하는지(포함이 아님)를

판단하는 연산자이다. 정규식 앞뒤에 `.*`가 붙은 이유이다.

 

사실 기존에 있던 자바의 `print()`를 가져다 약간 변형한 것에 지나지 않으나

이런 식으로 작은 프로그램부터 차근차근 연습해나가는 것이

프로그래밍 실력 향상에 도움이 될 것이다.
