---
title: "Spring Boot 예제: 데이터베이스 입출력(CRUD)이 가능한 RestController 제작"
date: 2020-02-25
categories: 
  - "DevLog"
  - "Spring/JSP"
  - "Database"
---

[전체 소스 보기](https://github.com/ayaysir/simple-todo-server)

#### **프로젝트 구조**

 ![](/assets/img/wp-content/uploads/2020/02/스크린샷-2020-02-25-오후-7.14.53.png)

#### **1\. Spring Boot 프로젝트 생성**

- [Spring Boot: 설치 및 기본 설정 (macOS 및 Eclipse 기준)](http://yoonbumtae.com/?p=1018)

 

#### **2\. application.properties에 데이터베이스 연결 (mariadb)**

- [Spring Boot: mariadb 연결하기 (JDBC-Maven 기준)](http://yoonbumtae.com/?p=658)

 

#### **3\. VO(Value Object; DTO) 작성 (Todo.java)**

```
package com.springboot.simpletodo.vo;

public class Todo {
  
  private int id;
  private String icon, title, detail, regDate, modDate;
  
  public Todo() {
    super();
  }

  public Todo(int id, String icon, String title, String detail, String regDate, String modDate) {
    super();
    this.id = id;
    this.icon = icon;
    this.title = title;
    this.detail = detail;
    this.regDate = regDate;
    this.modDate = modDate;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getIcon() {
    return icon;
  }

  public void setIcon(String icon) {
    this.icon = icon;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDetail() {
    return detail;
  }

  public void setDetail(String detail) {
    this.detail = detail;
  }

  public String getRegDate() {
    return regDate;
  }

  public void setRegDate(String regDate) {
    this.regDate = regDate;
  }

  public String getModDate() {
    return modDate;
  }

  public void setModDate(String modDate) {
    this.modDate = modDate;
  }

  @Override
  public String toString() {
    return "Todo [id=" + id + ", icon=" + icon + ", title=" + title + ", detail=" + detail + ", regDate=" + regDate
        + ", modDate=" + modDate + "]";
  }

}
```

 

#### **4\. DAO 작성 (SimpleTodoDAO.java)**

```
package com.springboot.simpletodo.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.springboot.simpletodo.vo.Todo;

@Repository
public class SimpleTodoDAO {
  @Autowired JdbcTemplate jt;
  
  public List<Todo> selectAll() {
    
    return jt.query("select * from simple_todo", (rs, rowNum) -> {
      Todo aTodo = new Todo();
      aTodo.setId(rs.getInt("id"));
      aTodo.setIcon(rs.getString("icon"));
      aTodo.setTitle(rs.getString("title"));
      aTodo.setDetail(rs.getString("detail"));
      aTodo.setRegDate(rs.getString("reg_date"));
      aTodo.setModDate(rs.getString("mod_date"));
      
      return aTodo;
    });
  }
  
  public int insertTodo(Todo aTodo) {
    
    return jt.update("insert into simple_todo(id, icon, title, detail, reg_date, mod_date) "
        + "values (0, ?, ?, ?, sysdate(), sysdate())", aTodo.getIcon(), aTodo.getTitle(), aTodo.getDetail());
    
  }
  
  public int updateTodo(Todo aTodo) {
    
    return jt.update("update simple_todo set icon = ?, title = ?, detail = ?, mod_date = sysdate() where id = ?",
        aTodo.getIcon(), aTodo.getTitle(), aTodo.getDetail(), aTodo.getId());
  }
  
  public int deleteTodo(Todo aTodo) {
    return jt.update("delete from simple_todo where id = ?", aTodo.getId());
  }

}
```

 

#### **5\. 서비스 인터페이스 작성 (SimpleTodoService.java)**

```
package com.springboot.simpletodo.service;

import java.util.List;

import com.springboot.simpletodo.vo.Todo;

public interface SimpleTodoService {
  
  public List<Todo> selectTodo();
  public int insertTodo(Todo aTodo);
  public int updateTodo(Todo aTodo);
  public int deleteTodo(Todo aTodo);
  

}
```

 

#### **6\. 서비스 인터페이스 구현 (SimpleTodoServiceImpl.java)**

```
package com.springboot.simpletodo.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.simpletodo.dao.SimpleTodoDAO;
import com.springboot.simpletodo.service.SimpleTodoService;
import com.springboot.simpletodo.vo.Todo;

@Service
public class SimpleTodoServiceImpl implements SimpleTodoService{
  
  @Autowired SimpleTodoDAO std;
  
  @Override
  public List<Todo> selectTodo() {
    return std.selectAll();
  }
  
  @Override
  public int insertTodo(Todo aTodo) {
    return std.insertTodo(aTodo);
  }
  
  @Override
  public int updateTodo(Todo aTodo) {
    return std.updateTodo(aTodo);
  }
  
  @Override
  public int deleteTodo(Todo aTodo) {
    return std.deleteTodo(aTodo);
  }

}
```

 

#### **7\. RestController 작성 (SimpleTodoController.java)**

```
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.simpletodo.service.SimpleTodoService;
import com.springboot.simpletodo.vo.Todo;

@RestController
public class SimpleTodoController {
  
  @Autowired SimpleTodoService stc;
  
  @GetMapping("/get-test")
  public String getTest() {
    return "get test";
  }
  
  @GetMapping("/todo/get")
  public List<Todo> getList() {
    return stc.selectTodo();
  }
  
  @PostMapping("/todo/insert")
  public int insertTodo(Todo aTodo) {
    return stc.insertTodo(aTodo);
  }
  
  @PostMapping("/todo/update")
  public int updateTodo(Todo aTodo) {
    return stc.updateTodo(aTodo);
  }
  
  @PostMapping("/todo/delete")
  public int deleteTodo(Todo aTodo) {
    return stc.deleteTodo(aTodo);
  }
  
}

```

 

#### **8\. RestController의 정상 동작 여부를 점검하는 테스트 페이지 작성**

```
package com.springboot.simpletodo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {
  
  @RequestMapping("/")
  public String mainPage() {
    return "main-web";
  }
}
```

[main-web.html 보기](https://github.com/ayaysir/simple-todo-server/blob/master/src/main/resources/templates/main-web.html)

 

 ![](/assets/img/wp-content/uploads/2020/02/스크린샷-2020-02-25-오후-7.26.50.png)
