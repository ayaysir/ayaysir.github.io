---
published: false
title: "JavaScript：setInterval（繰り返し関数）を停止する方法（clearInterval使用）"
date: 2021-03-04
---

ジャバスクリプト：setInterval（繰り返し関数）停止する（clearInterval使用）

JavaScriptで `setInterval(function, millisecond)`は一定時間（ms）ごとに関数を実行する機能です。たとえば`millisecond`を`1000`に決めれば、`1`秒ごとに関数を繰り返し実行します。ちなみに`0`秒（最初の`setInterval`が実行される時点）では、実行されるようにするには、`millisecond`を`0`に指定する必要があります。もし`1000`に設定すると、`0`秒に何のアクションも取らずにいるが、`1`秒以降の実行部分を繰り返すことになります。

 

実行されているインターバル関数を停止するには`clearInterval([インターバル変数])`を使用して停止します。外部から停止させることもあり（例1）、または`interval`内部で停止させることも可能です（例2）。

 

#### **例1**

```js
var interval = setInterval(function() {
  console.log("await..")
}, 500)
    
function stop(){
  console.log("stopped")
  clearInterval(interval)
}
```

 

#### **例2**

```js
var isStop = false
var interval = setInterval(function() {
  if (!isStop) {
    console.log("await..")
  } else {
    console.log("stopped")
    clearInterval(interval) 
    // 宣言したintervalを中停止させることがあります
  }
}, 500)

function stop() {
  isStop = true
}
```

 ![](/assets/img/wp-content/uploads/2021/03/screenshot-2021-03-04-pm-9.43.06.png)
