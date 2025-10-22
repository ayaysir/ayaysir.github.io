---
title: "Spring: 팩토리 패턴/ applicationContext.xml / DL(Dependencies Lookup) / DI(Dependencies Injection)"
date: 2019-01-29
categories: 
  - "DevLog"
  - "Spring/JSP"
---

_여기에 나오는 내용은 현 시점에서 굉장히 오래된 내용들이고 현재는 스프링의 모든 기능을 이용할 수 있으면서도 설정 과정이 훨씬 간편해진 '스프링 부트'가 있으니 이거 말고 스프링 부트를 이용하도록 하자_

* * *

\- 팩토리 패턴: 팩토리 패턴에서 팩토리 클래스는 단순히 특정 인스턴스를 반환하는 역할만 한다. 싱글턴 패턴과 결합될 수 있다.

```
public class VTFactory {
    
    // Factory: 인스턴스를 리턴시키는 기능만 담당하는 클래스
    public static VTuber getInstance(String name) {
        if(name.equalsIgnoreCase("Weatheroid")) {
            return new Weatheroid();
        } else if (name.equalsIgnoreCase("Tokinosora")) {
            return new Tokinosora();
        } else if (name.equalsIgnoreCase("Kizunaai")) {
            return new KizunaaiAdapter();
        } else {
            return null;
        }
    }
 
}

// 각 클래스는 미리 만들어져 있다고 가정
```

* * *

\- 팩토리 패턴을 스프링에서 applicationContext.xml(src/main/resource)로 대체할 수 있다.

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
    http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    <!-- beans: 문서의 시작과 끝 -->
    <!-- 스프링이 이 문서 안에 명시된 내용을 바탕으로 서비스 시작 시 인스턴스를 일괄 생성 -->
    
    <bean id="vt" class="exp.spring.vt.Weatheroid" />
    
</beans>

```

```
public class Spring1 {
 
    public static void main(String[] args) {
 
        AbstractApplicationContext ctx = 
                new GenericXmlApplicationContext("applicationContext.xml");
 
        /* XML에 의해 이미 만들어진 인스턴스를 내가 가져다 쓰겠다. */
 
        VTController vt = new VTController((VTuber) ctx.getBean("vt"));
        vt.test();
        
        ctx.close();
    }
}
```

위의 5~X번 코드는 컨텍스트 xml을 사용하지 않는다면 다음과 같이 작성한다.

```
VTController vt = new VTController(VTFactory.getInstance(args[0]));
vt.test();
```

applicationContext.xml(컨텍스트 xml)을 적용하면 팩토리 클래스는 필요가 없는데 이러한 방식을 Dependency Lookup이라 한다.

* * *

만약 Weatheroid 클래스에 매개변수를 요구하는 생성자가 있다고 하면(위의 예에서는 기본 생성자만 있다고 가정함), applicationContext.xml은 다음과 같은 내용이 변경/추가된다.

```
<bean id="vt" class="exp.spring.vt.Weatheroid">
    <constructor-arg ref="tts"></constructor-arg>
    <!-- Dependency Injection -->
</bean>

<bean id="tts" class="exp.spring.tts.YamagishiTTS" /

```

참조형 변수인 경우 ref, 기본형 변수인 경우 value이며, 생성자 내 변수 선언 순서에 맞춰 작성해야 한다. 이것을 Dependency Injection이라 한다.

클래스 내에 setter, getter가 있는 경우 다음과 같이 작성할 수 있음

```
        <property name="remainingBatteryQuantity" value="1000" />
        <property name="tts" ref="tts"/>

---------------------- 
아마 클래스에서는 다음과 같이 작성되어 있을 것
private int remainingBatteryQuantity;

public int getRemainingBatteryQuantity(){
  return this.remainingBatteryQuantity;
}

public void setRemainingBatteryQuantity(int rbq){
  this.remainingBatteryQuantity = rbq;
}
```

* * *

DL, DI를 사용하면 싱글턴 패턴이 자동으로 적용된다. (무조건)

싱글턴패턴을 적용하지 않으려면 다음과 같이 수정한다. `<bean id="vt" class="exp.spring.vt.Weatheroid" **scope="prototype"**> ...`

prototype을 지정하지 않으면 서비스 시작 시 무조건 인스턴스가 만들어지며 prototype을 지정하면 `getBean()` 메소드를 실행해야만 인스턴스가 만들어진다.

싱글턴이라도 후자처럼 실행하고 싶다면 bean 태그에 `lazy-init="true"`를 지정한다.

인스턴스를 만들고 최초로 실행하고 싶은 메소드, 또는 인스턴스가 종료(`ctx.close()`)된 후 실행하고 싶은 메소드가 있는 경우 그 이름을 다음과 같이 적는다. (destroy-method는 반드시 싱글턴 패턴에서만 적용됨)

`<bean id="vt" class="exp.spring.vt.Weatheroid" **init-method="init" destroy-method="destroy"**> ...`

```
public void init() {
    System.out.println("**Weatheroid Type A Airi**\nBattery: " + remainingBatteryQuantity);
}

public void destroy() {
    System.out.println("**DESTORY**");
}

```
