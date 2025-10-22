---
title: "Log4j: RegexFilter로 특정 문구가 들어간 로그 안나오게 하기"
date: 2019-05-20
categories: 
  - "DevLog"
  - "Spring/JSP"
---

예를 들어 스프링의 로그 창에서

```
2019-05-20 10:00:00,541 DEBUG [java.sql.ResultSet] {rset-000000} Result: [DO_NOT_DISPLAY_$@#%$%$#%$%...]
```

이런 형식의 로그들은 안보이게 하고 싶을 때 사용하는 방법이다.

 

Log4j.xml을 찾아서 `<Logger>` 밑에 다음을 추가한다.

`<RegexFilter regex=".*[안보이게 할 문구].*" onMatch="DENY" onMismatch="NEUTRAL" />`

```
<?xml version="1.0" encoding="UTF-8"?>
<Configuration>
    <Appenders>
        <Console name="console" target="SYSTEM_OUT">
            <PatternLayout pattern="blablabla" />           
        </Console>
    </Appenders>
    <Loggers>
        <Logger name="java.sql" level="DEBUG" additivity="false">       	
            <RegexFilter regex=".*DO_NOT_DISPLAY.*" onMatch="DENY" onMismatch="NEUTRAL" />
            <AppenderRef ref="console" />            
        </Logger>
        <Logger name="aa.class" level="DEBUG" additivity="false">
            <AppenderRef ref="console" />
        </Logger>
        <Logger name="bb.class" level="DEBUG" additivity="false">
            <AppenderRef ref="console" />
        </Logger>
        <Logger name="cc.class" level="DEBUG" additivity="false">
            <AppenderRef ref="console" />
        </Logger>
        <Root level="ERROR">
            <AppenderRef ref="console" />
        </Root>
    </Loggers>
</Configuration>

```
