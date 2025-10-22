---
published: false
title: "Spring: List, Set, Map의 Dependency Injection 방법"
date: 2019-01-29
categories: 
  - "DevLog"
  - "Spring/JSP"
tags: 
  - "spring"
  - "스프링"
---

_여기에 나오는 내용은 현 시점에서 굉장히 오래된 내용들이고 현재는 스프링의 모든 기능을 이용할 수 있으면서도 설정 과정이 훨씬 간편해진 '스프링 부트'가 있으니 이거 말고 스프링 부트를 이용하도록 하자_

* * *

```
<beans ...>
 
    <bean id="listBean" class="exp.spring.practice2.ListBean">
        <constructor-arg>
            <list>
                <value>Apple</value>
                <value>Apple</value>
                <value>Banana</value>
                <value>Cranberry</value>
            </list>
        </constructor-arg>
    </bean>
 
    <bean id="setBean" class="exp.spring.practice2.SetBean">
        <property name="set">
            <set>
                <value>Apple</value>
                <value>Apple</value>
                <value>Banana</value>
                <value>Cranberry</value>
            </set>
        </property>
    </bean>
 
    <bean id="mapBean" class="exp.spring.practice2.MapBean">
        <property name="fruitsMap">
            <map>
                <!-- 엔트리: 키-값 한 쌍 -->
                <entry>
                    <key>
                        <value>A</value>
                    </key>
                    <value>Apple</value>
                </entry>
                <entry key="B" value="Banana" />
                <entry key="C" value="Cranberry" />
            </map>
        </property>
    </bean>
 
</beans>

```

 

세번째 bean 태그를 보면 exp.spring.practice2.MapBean 클래스를 찾아서 아이디를 mapBean이라고 하고 이하는 값을 집어넣는 것이다. 뭔가 제목이 어려워 보이는데 요지는 데이터를 프로그램 코드 안에 넣지 않고(하드코딩 하지 않고) 외부에서 입력(XML 파일)한다는 것이다. property의 name에는 VO(Value Object)클래스의 getter/setter가 있는 멤버 필드 이름을 넣는다.

 

* * *

```
================ Value Objects(일부) ================ 
 
public class MapBean {
    
    private Map<String, String> fruitsMap;
 
    public MapBean() {
        super();
    }
 
    public MapBean(Map<String, String> fruitsMap) {
        super();
        this.fruitsMap = fruitsMap;
    }
 
    public Map<String, String> getFruitsMap() {
        return fruitsMap;
    }
 
    public void setFruitsMap(Map<String, String> fruitsMap) {
        this.fruitsMap = fruitsMap;
    }
 
}
 
================ main ================ 
 
public static void main(String[] args) {
 
        AbstractApplicationContext ctx = new GenericXmlApplicationContext("applicationContext.xml");
 
(...)
 
        MapBean instance3 = (MapBean) ctx.getBean("mapBean");
        Map<String, String> map = (Map<String, String>) instance3.getFruitsMap();
 
        System.out.println(map);
        for(String s : map.keySet()) {
            System.out.println(s + ": " + map.get(s));
        }
        
        System.out.println();
 
        ctx.close();
    }
```

```
A: Apple
B: Banana
C: Cranberry
```

DI의 이점: 프로젝트 내에서 동적인 값들을 분리시켜 변경될 때마다 재컴파일이 없도록 함, AOP(Aspect Oriented Programming)적용에 유리
