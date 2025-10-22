---
title: "PHP: mysql_fetch_array() 에서  while() 대신에 foreach()를 사용하는 방법"
date: 2020-12-14
categories: 
  - "DevLog"
  - "PHP"
---

##### **Q. `foreach`와 함께 작동하도록 다음 코드를 어떻게 변환하는지 알고 싶습니다.**

```
$query_select = "SELECT * FROM shouts ORDER BY id DESC LIMIT 8;"; 

$result_select = mysql_query($query_select) or die(mysql_error());

while($row = mysql_fetch_array($result_select)) {
    $ename = stripslashes($row['name']);
    $eemail = stripcslashes($row['email']);
    $epost = stripslashes($row['post']);
    $eid = $row['id'];

    echo $eid . '<br/>';
    echo $ename . '<br/>';
    echo $eemail . '<br/>';
    echo $epost . '<br/>';
}
```

 

##### **A. 다음과 같이 코딩할 수 있습니다.**

```
$query_select = "SELECT * FROM shouts ORDER BY id DESC LIMIT 8;";
$result_select = mysql_query($query_select) or die(mysql_error());

$rows = array();
while($row = mysql_fetch_array($result_select))
    $rows[] = $row;

foreach($rows as $key=>$row){ 
    // .. 위 코드의 while 문 내의 내용과 동일 ..
}
```

`foreach를` 사용하려는 목적은 `$key`를 사용해 배열의 인덱스 번호를 가져오기 위함입니다.

 

#### **기타 의견**

- 왜요? 코드를 변경할 이유가 없습니다. `foreach`를 사용하면 시간이 더 걸리며 더 많은 메모리를 사용하게 됩니다..
- 글쎄요, 당신의 코드를 더 악화시킬 수있는 것들을 배우지 마십시오. 대신 이것을 배우십시오 - `mysql_fetch_array()`와 함께 `foreach` 루프를 사용하지 마십시오.

 

#### **대안**

- `while`문을 돌릴 때 인덱스를 사용하고 싶다면 외부에 인덱스 변수를 두고 내부에서 `index++` 처리하면서 사용하는 것이 바람직해 보입니다.

 

원문: [How to echo or print an array in PHP?](https://stackoverflow.com/questions/9816889/how-to-echo-or-print-an-array-in-php)
