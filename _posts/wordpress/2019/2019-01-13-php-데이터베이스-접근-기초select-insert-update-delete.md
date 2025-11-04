---
title: "PHP: 데이터베이스 접근 기초(SELECT, INSERT, UPDATE, DELETE)"
date: 2019-01-13
categories: 
  - "DevLog"
  - "PHP"
  - "Database"
tags: 
  - "php"
---

## PHP 코드 부분

### **1\. SELECT**

- php의 코드는 일반 텍스트와 구분하여 `<?php [...코드...] ?>`를 사용합니다. 또는 `<?[...코드...] ?>도` 가능합니다.
- HTML 코드 내에서 변수 등을 단순히 출력하고자 할 때는 `<?=[변수 이름 등]?>` 의 형태로 사용합니다.
- 브라우저에 출력하는 코드는 `echo [내용]` 입니다. 내용을 그대로 소스로 내보냅니다.
- 변수명은 `$`로 시작합니다.
- 스트링을 덧붙이고자 할 때는 + 대신 `.` 를 사용합니다.
- 데이터베이스를 접속하는 코드는 `$mysqli=new mysqli([주소], [사용자이름], [비밀번호], [DB이름]``);` `true` 또는 `false`를 반환합니다.
- 데이터베이스 쿼리를 읽어들이는 코드는 `$res=$mysqli-> query([sql 구문]);` 입니다.
- 문장 끝에 세미콜론( `;` )은 반드시 붙여야 합니다.

```php
<div class=container>
        <div class=row>
            <div class=col-12>
    <?php
        $host = '== 주소 ==';
        $user = '== ID ==';
        $pw = '== PWD ==';
        $dbName = '== DB NAME ==';
        $mysqli = new mysqli($host, $user, $pw, $dbName);
 
        /* if($mysqli){echo "MySQL 접속 성공";}
        else{echo "MySQL 접속 실패";} */
 
        $sql = 'SELECT * FROM messages order by seq desc';
        $res = $mysqli -> query($sql);
 
        // echo '<br>num_rows: count is '.$res->num_rows;
        // echo '<br>field_count: count is '.$res->field_count;
    ?>
 
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">작성자</th>
                            <th scope="col">메시지</th>
                            <th scope="col">작성일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($row = mysqli_fetch_array($res)) { ?>
                            <tr>
                                <th scope="row">
                                    <?=$row['seq']?>
                                   </th>
                                <td>
                                       <?=$row['writer']?>
                                </td>
                                <td>
                                    <?=$row['message']?>
                                </td>
                                <td>
                                    <?=$row['wdate']?>
                                </td>
                            </tr>
                        <?php }?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

```

 

### **2\. INSERT**

- 한글이 깨지지 않도록 하려면 맨 위에 `header('Content-Type: text/html; charset=utf-8'``);`를 추가합니다.
- 매개변수(Parameter)를 받을 때는 `$_GET[이름]` 또는 `$_POST[이름]`으로 적고, 이름에는 따옴표를 넣지 않습니다.
- 시퀀스를 사용하고자 할 때는 `AUTO INCREMENT` 설정(phpMyAdmin에서는 A\_I라고 표시됨)을 부여하며 sql 구문 상에서는 `0` 또는 `null`을 입력하면 됩니다.
- sql 구문 php 변수를 넣는 방법은 sql 구문 안에 홑따옴표(`'  '`)를 친 뒤 `$변수명` 같은 방식으로 입력합니다.
- 아래 예제에서는 리다이렉트 방식으로 자바스크립트를 이용하였습니다.

```php
<?php
 
    header('Content-Type: text/html; charset=utf-8');
 
    $writer = $_POST[writer];
    $message = $_POST[message];
 
    //    echo $writer;
    //    echo $message;
 
     (..생략..)
    $mysqli = new mysqli($host, $user, $pw, $dbName);
 
    if(!$mysqli){        
        echo "MySQL 접속 실패: ";
    } 
 
    $sql = "insert into messages values";
    $sql = $sql."(0, '$writer', '$message', default)";
 
    if($mysqli -> query($sql)) {
        echo "<script>location.href='index.php';</script>";
    } else {
        echo "<script>";
        echo "alert('INSERT 오류발생');";
        echo "location.href='index.php';";
        echo "</script>";
    }  
 
?>

```

 

### **3\. UPDATE**

```php
<?php
 
    header('Content-Type: text/html; charset=utf-8');
 
    $seq = $_POST[seq];
    $writer = $_POST[writer];
    $message = $_POST[message];
 
    include "initializeDB.php";
 
    if(!$mysqli){
        echo "MySQL 접속 실패: ";
    } 
 
    $sql = "update messages set writer='$writer', message='$message',"
            ."wdate=sysdate() where seq='$seq'";
    if($mysqli -> query($sql)) {
        echo "<script>location.href='index.php';</script>";
    } else {
        echo "<script>";
        echo "alert('UPDATE 오류발생');";
        echo "location.href='index.php';";
        echo "</script>";
    } 
 
?>

```

 

### **4\. DELETE**

```php
<?php
 
header('Content-Type: text/html; charset=utf-8');
 
$seq = $_POST['seq'];
 
    include "initializeDB.php";
 
    $sql = "delete from messages where seq='$seq'";
    if($mysqli->query($sql)) {
        echo "해당 글이 정상적으로 삭제되었습니다.";
    } else {
        echo "삭제에 실패했습니다.";
    }
?>

```

### 동작화면
 

<!-- [ ](http://www.yoonbumtae.com/phpex) -->
![](/assets/img/wp-content/uploads/2019/01/php-example-1.png)

<!-- [사이트에서 직접 보기](http://yoonbumtae.com/phpex) -->

 
### 참고: sql 에러 표시

참고로 sql 관련 에러를 표시하는 방법은 다음과 같습니다 - `echo mysqli_error($mysqli);`

* * *

## **데이터베이스 구조**

 ![](/assets/img/wp-content/uploads/2019/01/-2021-02-17-오후-12.20.39-e1613532613329.png)

```sql
--
-- 테이블 구조 `messages`
--
CREATE TABLE `messages` (
  `seq` int(11) NOT NULL,
  `writer` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `wdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `like_count` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 인덱스 `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`seq`);

--
-- 테이블의 AUTO_INCREMENT `messages`
--
ALTER TABLE `messages`
  MODIFY `seq` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;
```
