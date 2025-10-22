---
title: "Spring: 데이터베이스 연동(Oracle-JDBC 기준), Spring JDBC"
date: 2019-01-29
categories: 
  - "DevLog"
  - "Spring/JSP"
  - "Database"
tags: 
  - "jdbc"
  - "spring"
  - "스프링"
---

#### **XML 선언**

이 부분은 데이터베이스의 종류, 사용하는 플랫폼에 따라 달라지므로 사용 환경에 맞는지 확인해봐야 합니다. Spring Boot의 마리아DB(mariadb)기준은 [이 글](http://yoonbumtae.com/?p=658)을 참고해주세요.

이 부분은 `properties` 태그와 `dependencies` 태그 사이에 추가합니다.

```
<repositories>
  <repository>
    <id>oracle</id>
    <url>http://maven.jahia.org/maven2</url>
  </repository>
</repositories>
```

이 부분은 `dependencies` 태그 쌍 내에 추가합니다.

```
        <dependency>
            <groupId>com.oracle</groupId>
            <artifactId>ojdbc6</artifactId>
            <version>12.1.0.2</version>
        </dependency>
 
        <dependency>
            <groupId>commons-dbcp</groupId>
            <artifactId>commons-dbcp</artifactId>
            <version>1.4</version>
        </dependency>
 
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${org.springframework-version}</version>
        </dependency>
```

아래 내용은 `context.xml`에 추가합니다.

```
    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="oracle.jdbc.driver.OracleDriver"></property>
        <property name="url" value="[DB주소: jdbc:oracle:thin:@localhost:1521:xe]"></property>
        <property name="username" value="[아이디]" />
        <property name="password" value="[비밀번호]" />
    </bean>
    
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource" />
    </bean>

```

 

#### **JDBC**

먼저 비교를 위해 일반적인 방식(JDBC) 으로 클래스 파일을 작성해 보겠습니다.

##### **DAO**

```
@Repository
public class MessagesDAOImpl implements MessagesDAO {
 
    public MessagesDAOImpl() {
 
    }
 
    @Override
    public int insert(Connection con, Message msg) throws SQLException, NamingException {
        String sql = "insert into messages values(msg_seq.nextval, ?, ?)";
 
        PreparedStatement ps = con.prepareStatement(sql);
 
        ps.setString(1, msg.getWriter());
        ps.setString(2, msg.getMessage());
 
        int result = ps.executeUpdate();            
 
        return result;        
 
    }
 
    @Override
    public List<Message> getAllData(Connection con) throws SQLException, NamingException {
        String sql = "select * from messages";
        PreparedStatement ps = con.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();
 
        List<Message> list = new ArrayList<>();
        while(rs.next()) {
            Message msg = new Message();
            msg.setSeq(rs.getInt(1));
            msg.setWriter(rs.getString(2));
            msg.setMessage(rs.getString(3));
            list.add(msg);
        }
 
        return list;
    }
 
    @Override
    public int update(Connection con, Message msg) throws SQLException, NamingException {
        String sql = "update messages set writer = ?, message = ? where seq = ?";
 
        PreparedStatement ps = con.prepareStatement(sql);
        
        ps.setString(1, msg.getWriter());
        ps.setString(2, msg.getMessage());
        ps.setInt(3, msg.getSeq());    
        
        return ps.executeUpdate();
    }
 
    @Override
    public int delete(Connection con, int seq) throws SQLException, NamingException {
        String sql = "delete from messages where seq = ?";
        
        PreparedStatement ps = con.prepareStatement(sql);
        
        ps.setInt(1, seq);
        
        return ps.executeUpdate();        
    }
 
}
```

 

##### **Service**

```
 
@Service 
public class MessagesServiceImpl implements MessagesService {
    
    @Autowired
    private MessagesDAO mdao;
    
    @Autowired
    private DataSource ds;
    
    @Override
    public int insert(Message msg) throws SQLException, NamingException {
        
        Connection con = ds.getConnection();
        try {
            int result = this.mdao.insert(con, msg);
            return result;
        } catch (SQLException e) {
            con.rollback();
            throw e;
        } finally {
            con.commit();
            con.close();
        }
 
    }
    
    @Override
    public List<Message> getAllData() throws SQLException, NamingException {
        Connection con = ds.getConnection();
        List<Message> list = this.mdao.getAllData(con);
        con.close();
        return list;
    }
    
    @Override
    public int update(Message msg) throws SQLException, NamingException {
        Connection con = ds.getConnection();
        try {
            int result = mdao.update(con, msg);
            return result;
        } catch(SQLException | NamingException e) {
            con.rollback();
            throw e;
        } finally {
            con.commit();
            con.close();
        }
        
    }
    
    @Override
    public int delete(int seq) throws SQLException, NamingException {
        Connection con = ds.getConnection();
        
        try {
            int result = this.mdao.delete(con, seq);
 
            return result;
            
        } catch (SQLException e) {
            con.rollback();
            throw e;
        } finally {
            con.commit();
            con.close();
        }
    }
}

```

 

##### **메인 클래스**

```
public static void main(String[] args) {
 
        AbstractApplicationContext x = new GenericXmlApplicationContext("appContext.xml");
 
        // 컨트롤러와 맞대응하는 것은 서비스 레이어 -> ServiceImpl
        MessagesService ms = (MessagesServiceImpl) x.getBean("messagesServiceImpl");
 
        try {
            List<Message> list = ms.getAllData();
            for(Message msg : list) {
                System.out.println(msg);
            }
        } catch (SQLException | NamingException e) {
            e.printStackTrace();
        }
 
        x.close();
    }
```

 

#### **스프링 JDBC**

**Spring JDBC**는 JDBC를 더 쉽게 쓸 수 있도록 가공한 것으로, `update` 관련 기능은 sql문을 변수로 저장하는 것만으로 실행할 수 있어 일반 JDBC보다 간편하게 이용할 수 있습니다. JDBC의 일종이기 때문에 SQL안에 `?`가 들어간다든가(PreparedStatement) `RowMapper` 클래스를 이용하는 것 등 많은 점이 기존 JDBC와 유사합니다.

 

##### **DAO**

```
@Repository
public class MessagesDAOImpl implements MessagesDAO {
    
    @Autowired
    private JdbcTemplate template;
 
    public MessagesDAOImpl() {
 
    }
 
    @Override
    public int insert(Message msg) throws SQLException, NamingException {
        
        String sql = "insert into messages values(msg_seq.nextval, ?, ?)";
        return template.update(sql, msg.getWriter(), msg.getMessage());
    }
 
    @Override
    public List<Message> getAllData() throws SQLException, NamingException {
        
        String sql = "select * from messages";
        
        return template.query(sql, (rs, rowNum) -> {
            Message msg = new Message();
            msg.setSeq(rs.getInt(1));
            msg.setWriter(rs.getString(2));
            msg.setMessage(rs.getString(3));
            return msg;
        });
        
        /* 람다식의 원래 형태:
         * new RowMapper<X>() {
         *     @Override
         *     public X mapRow(ResultSet rs, int rowNum) throws SQLException {... return X;}
         */
        
    }
 
    @Override
    public int update(Message msg) throws SQLException, NamingException {
        
        String sql = "update messages set writer = ?, message = ? where seq = ?";
        return template.update(sql, msg.getWriter(), msg.getMessage(), msg.getSeq());
    }
 
    @Override
    public int delete(int seq) throws SQLException, NamingException {
        
        String sql = "delete from messages where seq = ?";
        return template.update(sql, seq);
    }
 
}

```

 

##### **Service**

```
@Service
public class MessagesServiceImpl implements MessagesService {
    
    @Autowired
    private MessagesDAO mdao;
    
    @Override
    public int insert(Message msg) throws SQLException, NamingException {
        return mdao.insert(msg);
    }
    
    @Override
    public List<Message> getAllData() throws SQLException, NamingException {
        return mdao.getAllData();
    }
    
    @Override
    public int update(Message msg) throws SQLException, NamingException {
        return mdao.update(msg);
    }
    
    @Override
    public int delete(int seq) throws SQLException, NamingException {
        return mdao.delete(seq);
    }
}
```

 

위의 DAO에서 `getAllData` 메소드는 `List` 형식으로 자료를 가져옵니다. 보통 `select` 결과는 여러 개이므로 상관 없을수도 있지만, 단일 행의 결과가 예상될 때도 있습니다. 그럴 때엔 **`queryForObject`**를 사용합니다.

```
@Override
public Message selectBySeq(int seq) {
    
    String sql = "select * from messages where seq=?";
    return template.queryForObject(sql, new Object[] {seq}, (rs, rowNum) -> {
        
        Message msg = new Message();
        msg.setSeq(rs.getInt(1));
        msg.setWriter(rs.getString(2));
        msg.setMessage(rs.getString(3));
        
        return msg;
    });
}

```

 

#### **트랜잭션 처리**

쿼리 중 트랜잭션 처리가 필요할 수도 있습니다. 트랜잭션 처리(annotation-driven 형식)가 필요하다면 아래 부분을 `context.xml`에 추가하고 네임스페이스 선언도 `tx`를 인식할 수 있도록 수정합니다.

```
namespace 부분에 xmlns:tx="http://www.springframework.org/schema/tx" 추가

<!-- 데이터베이스 트랜잭션: commit, rollback -->
<bean id="transactionManager" 
    class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource" />
</bean>

<!-- 트랜잭션 지정 방식으로 annotation 선택 -->
<tx:annotation-driven/>
```

사용 방법은 서비스(`@Service`) 레이어의 메소드 중 트랜잭션(`commit`, `rollback`)이 필요한 곳에 `@Transactional` 어노테이션을 부착합니다. 오류를 방지하기 위해 아래와 같이 작성하면 좋습니다.

```
 @Transactional("transactionManager") // bean으로 만든 트랜잭션 매니저의 아이디와 같도록
```
