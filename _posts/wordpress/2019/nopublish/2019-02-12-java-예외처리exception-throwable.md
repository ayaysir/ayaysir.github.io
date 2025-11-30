---
published: false
title: "Java: 예외처리(Exception / Throwable)"
date: 2019-02-12
categories: 
  - "DevLog"
  - "Java"

---

\[참고\] [http://www.nextree.co.kr/p3239/](http://www.nextree.co.kr/p3239/) [https://sjh836.tistory.com/122](https://sjh836.tistory.com/122)

 

**1\. Error / Exception 의 차이**: 에러(Error)는 개발자가 통제할 수 없는 시스템 영역의 에러, 예외(Exception)은 개발자가 통제할 수 있는 코드 영역의 문제(초급 수준에서는 그냥 에러라고 봐도 무방함)

 

**2\. Throwable**: `Throwable`은 `Exception`의 상위 클래스로 에러와 예외를 모두 캐치할 수 있음

```java
public class Exception extends Throwable {
    static final long serialVersionUID = -3387516993124229948L;
(...)

public class Throwable implements Serializable {
    /** use serialVersionUID from JDK 1.0.2 for interoperability */
    private static final long serialVersionUID = -3042686055658047285L;
(...)
```

다음과 같이 스택오버플로우 에러(error)를 무조건 발생시키는 코드를 예를 들면

```java
package blog.exception;

public class ThrowableTest1 {

  public static void main(String[] args) {
    ThrowableTest1 tt = new ThrowableTest1();
    tt.recursive(1);
  }
  
  public void recursive(int n) {
    recursive(n++);
  }

}
```

 ![](/assets/img/wp-content/uploads/2019/02/ex1.png)

스택오버플로우는 에러(error)이므로 다음과 같은 예외처리(handling Exception)는 아무런 변화를 주지 못함

```
try {
  tt.recursive(1);
} catch(Exception e) {
  System.err.println("catched: " + e);
}
```

그러나 Throwable을 사용하면 에러도 캐치할 수 있다.

```
try {
  tt.recursive(1);
} catch(Throwable e) {
  System.err.println("catched: " + e);
}
```

 ![](/assets/img/wp-content/uploads/2019/02/ex2.png)

 

**3\. Exception** (전통적인 `try ~ catch`문)

```java
package blog.exception;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class ExceptionTest1 {

  public static void main(String[] args) {
    // 일반적인 try-catch문		
    
      try {
        BufferedWriter bw = new BufferedWriter(new FileWriter(new File("ss.txt")));
        Integer i = Integer.parseInt(new Scanner(System.in).nextLine());
        bw.write(i + "를 입력하셨네요.");
        bw.flush();
      } catch (IOException e) {
        e.printStackTrace();	// catched Exception
      } catch (NumberFormatException e) {
        e.printStackTrace();	// uncatched Exception
      } catch (Exception e) {
        e.printStackTrace();
      } finally {
        System.out.println("[[무조건 실행됨]]");
      }	

  }

}
```

- `try-catch`: catch는 여러 개 쓸 수 있다. 예외 발생점과 `catch` 사이는 실행되지 않음
- `try-catch-finally`: `finally`는 예외 발생여부에 관계없이 반드시 실행되는 부분.
- `try-finally`: 예외가 발생하지 않으면 `finally`가 실행되며 예외가 발생하면 종료

try를 단독으로 쓰는것은 불가능하며, 그 외의 경우라면 다양한 조합으로 예외를 캐치해낼 수 있다. 참고로 `FileWriter`는 `IOException`에 대한 예외 처리를 강제하므로 `catched` 예외라 한다. 예외처리를 하지 않으면 컴파일 자체가 안되므로 `IOException`이 발생할 수 있다는 것을 미리 알 수 있다..

그러나 `NumberFormatException`은 예외처리가 강제되지 않으며 직접 예외를 발생시켜 봐야지만 어떤 에러가 발생하는지 알 수 있는데 이것을 `uncatched` 예외라 한다. `Integer ~ Scanner` 부분에서 Number어쩌구 예외가 발생하는 것을 직접 프로그램을 실행시키면서 예외를 유발시킨 결과 겨우  알 수 있었다.

 ![](/assets/img/wp-content/uploads/2019/02/ex3.png)

4를 입력하면 정상동작하나

 ![](/assets/img/wp-content/uploads/2019/02/ex4.png)

로마자 숫자 Ⅳ를 입력하면 예외가 발생한다.

finally 내 구문은 항상 실행되는 부분으로 try문이 정상적으로 실행되거나 혹은 예외가 캐치되서 정상실행되지 못한 상황에서도 무조건 실행되는 부분이다.

 

**4\. 예외 던지기** (throw, throws)

```java
package blog.exception;

import java.io.FileWriter;

public class ThrowsEx {
  
  public static void main(String[] args) {
    in();
  }
  
  static void in() {
    in2();
  }
  
  static void in2() {
    in3();
  }
  
  static void in3() {
    in4();
  }
  
  static void in4() {
    new FileWriter("ss.txt");
  }

}
```

위 코드를 보면(위 코드는 복잡한 프로그램을 가정한 것이다), in4에서 예외처리가 강제되는 부분이 나온다(FileWriter). 예외처리를 in4 에서 할 수도 있으나, main에서 예외처리를 하기를 원한다면 다음과 같이 예외를 전가할 수 있다. 이것을 전가 또는 말 그대로 던지기(`throws`)라 한다. 다음 코드는 폭탄돌리기 하듯이 예외를 떠넘기다가 main 메소드에서 예외처리를 하는 부분이다.

```java
package blog.exception;

import java.io.FileWriter;
import java.io.IOException;

public class ThrowsEx {
  
  public static void main(String[] args) {
    try {
      in();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  
  static void in() throws IOException {
    in2();
  }
  
  static void in2() throws IOException {
    in3();
  }
  
  static void in3() throws IOException {
    in4();
  }
  
  static void in4() throws IOException {
    new FileWriter("ss.txt");
  }

}

```

 

보통 예외처리보다 그냥 던지기가 선호되는데 그 이유중 하나는 `try~catch`문을 작성할 필요가 없기 때문일것이다.

일반적으로 예외의 처리는 상대적으로 프로그램 사용자와 가까운 부분(main 메소드나 UI 실행부분)에서 처리하며 사용자와 거리가 먼 코어 또는 외부 라이브러리 부분은 예외를 다른 부분에 전가(던지기)하는 것이 바람직하다. 예외 던지기를 무조건 안좋게 보는 사람도 있으나, 상황에 따라 알아서 하는게 바람직하다. 단 마지막 부분에서는 `try~catch`로 처리를 확실히 해주는것이 좋다.

throws 말고 `throw`도 있는데, 둘은 엄연히 다른 명령어이며 사용법은 다음과 같다.

```java
package blog.exception;

import java.util.Scanner;

public class ThrowsEx {
  
  public static void main(String[] args) {
    try {
      in();
    } catch (Exception e) {
      System.err.println("main에서 캐치됨: " + e);
    }
  }
  
  static void in() throws Exception {
    in2();
  }
  
  static void in2() throws Exception {
    try{
      in3();
    } catch (Exception e) {
      System.out.println("in2에서 할일: %#$%$#@%");
      System.err.println("in2에서 캐치됨: " + e);

        throw e;
    }
  }
  
  static void in3() throws Exception {
    in4();
  }
  
  static void in4() throws Exception {
    int i = Integer.parseInt(new Scanner(System.in).nextLine());
  }

}

====================================================================
3g
in2에서 캐치됨: java.lang.NumberFormatException: For input string: "3g"
main에서 캐치됨: java.lang.NumberFormatException: For input string: "3g"
in2에서 할일: %#$%$#@%

```

뭐라 설명해야될지 모르겠다.. 다음은 데이터베이스 접근 예제의 일부인데 `throw`가 사용되고 있다.

```java
public int insertMember(String id, String password, int gender, String address)
    throws SQLException, ClassNotFoundException
{        
    
    con = this.getConnection();
    
    int result;
    try {
        result = memberDAO.insertMember(con, id, password, gender, address);
        con.commit();
        return result;
    } catch (SQLException e) {
        throw e;
    } finally {
        con.close();
    }
 
}
```

예외를 전달하되 catch 부분에서 뭘 하고 싶다거나 `finally`를 반드시 해야할 때 throw를 사용해 예외를 명시적으로 던진다. close가 필요한 상황에서 쓰인다고 보면 될 것 같다.

throw를 이용해 예외를 직접 만들어 볼 수도 있으며, 이것까지 다루면 범위가 너무 나가서 예제만 올림

```java
package blog.exception;

public class MonsterException extends Exception {
  
  public MonsterException(String message) {
    super("MonsterException이 발샗하였다: " + message);
  }
  
}

==============================================

package blog.exception;

public class CustomExceptionTest {

  public static void main(String[] args) {
    try {
      onlyMonster("Monster");
      onlyMonster("@#^#^");
    } catch (MonsterException e) {
      e.printStackTrace();
    }
  }
  
  static void onlyMonster(String monster) throws MonsterException {
    if(monster.equalsIgnoreCase("monster")) {
      System.out.println("☞ 몬스터");
    } else {
      throw new MonsterException("#@%@#%");
    }
  }
}

==============================================

☞ 몬스터
blog.exception.MonsterException: MonsterException이 발샗하였다: #@%@#%
  at blog.exception.CustomExceptionTest.onlyMonster(CustomExceptionTest.java:18)
  at blog.exception.CustomExceptionTest.main(CustomExceptionTest.java:8)

```

**5\. t`ry with resources` 문** (Java 7 이상만)

위에서 close 관련 이야기가 나오기도 했고, 앞의 예제 다량이 컴파일 경고를 발생시키는데 `close` 처리를 하지 않았기 때문이다. 몇몇 I/O 관련 객체는 close가 필요한데 close를 안하면 자원 낭비 때문에 close는 꼭 해주는것이 좋다. 새로 나온 `try with resources` 구문은 try 구문이 끝나면 예외발생 여부에 관계없이 close가 필요한 객체를 **저절로 클로즈**시켜준다. 앞의 전통적인 Exception 예외를 바꾸면 다음과 같다.

```java
package blog.exception;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class ExceptionTest1 {

  public static void main(String[] args) {
    // Jre 7 이상의 try with resources문		
    
      try (BufferedWriter bw = new BufferedWriter(new FileWriter(new File("ss.txt")));
          Scanner s = new Scanner(System.in); ){
        
        Integer i = Integer.parseInt(s.nextLine());
        bw.write(i + "를 입력하셨네요.");
        bw.flush();
      } catch (IOException e) {
        e.printStackTrace();	// catched Exception
      } catch (NumberFormatException e) {
        e.printStackTrace();	// uncatched Exception
      } catch (Exception e) {
        e.printStackTrace();
      } finally {
        System.out.println("[[무조건 실행됨]]");
      }	
  }

}

```

close가 필요한 부분은 괄호 안에 넣으면 저절로 close 처리가 된다. 문장이 하나면 ㅔ미콜론이 필요없고, 둘 이상이면 세미콜론으로 구분한다..

둘이 뭔차이냐고 궁금해할 수도 있는데 나중에 close와 예외처리가 동시에 필요한 코드를 작성해보면 이 구문의 장점을 알 수있을 것이다. 그리고 I/O 문제 외에 다른 catched 예외가 없다면 try를 단독으로 쓰는 것도 가능하다.

참고로 괄호 안에 들어가는 객체들은 `Closeable` 인터페이스를 구현한 것이어야만 한다.
