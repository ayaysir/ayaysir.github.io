---
title: "자바스크립트: 정규표현식 (Regular Expression; 정규식) 정리"
date: 2019-11-29
categories: 
  - "DevLog"
  - "JavaScript"
---

정규표현식(이하 정규식)에 대한 내용을 다뤄보겠습니다. 정규식은 자바스크립트에서만 사용되는 것은 아니지만 프로그래밍 언어마다 사용방법이나 문법 등이 미묘하게 다르기 때문에 여기서는 자바스크립트를 기준으로 설명하겠습니다.

 

## **정규식 선언 방법**

```js
var regex1 = /정규식/
var regex2 = new RegExp("정규식");
```

슬래시(`/`)로 감싸거나, `RegExp("정규식")`를 사용해서 선언합니다. 보통 전자의 방법이 선호되지만, 필요에 따라 다른 변수가 정규식에 포함되어야 할 일이 있을 때는 후자 방법을 사용하기도 합니다.

 

## **플래그**

- 플래그는 정규식의 뒤에 붙어(접미) 사용되는 것입니다.
- 플래그는 2개 이상 붙여 쓸 수 있습니다. (예: `gi`)
- `g`: 전역 검색, 문자열 전체에 걸쳐 조합을 검색합니다. (`replace` 부분 참조)
- `i`: 대소문자 구분 없는 검색

```js
flag = /pattern/flags;
flag = new RegExp("pattern", "flags");

```

 

## **test**

- 특정 스트링이 정규식을 만족하는지 여부를 판단하여 만족하는 부분이 있는지에 따라 `true` 또는 `false` 로 반환합니다.

```js
var regex = /abc/
var text = "abc"

var result = regex.test(text);
// 스트링 "abc"가 정규식을 만족하므로 true를 반환합니다.
```

 

## **replace**

- 정규식을 만족하는 부분을 찾으면 해당 부분을 다른 텍스트로 대치합니다.

```js
text = 'ABCD'
regex = /[AC]/g
        
var result = text.replace(regex, 'B')
| "BBBD"
```

플래그 `g`가 없다면 A, C 중 하나를 찾으면 더 판단하지 않고 종료합니다. `text`의 첫 문자가 A인데 정규식은 이 조건을 만족하므로 A를 대치한 뒤 종료합니다. 따라서 결과는 _**"BBCD"**_가 됩니다.

 

## **exec**

스트링에서 값을 찾으면 그 위치를 기억하고 있다가 기능이 실행되면 그 부분에 대한 정보를 반환합니다. 검색이 끝나면 `null`을 반환합니다.

```js
var text = "Romeo는 Juliet의 窓辺에서 외쳤다. Window를 Open해다오 Juliet!!"
var regex = /[a-z]+/gi
       
while((result = regex.exec(text)) != null) {
  console.log(result); // regex.exec를 쓰지 않도록 주의
}
```

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-29-pm-10.06.36.png)

해당 부분의 텍스트는 배열 0번에 담겨 있으므로, 위 코드의 result를 `result[0]`으로 바꾸면 됩니다.

 

## **메타 캐릭터**

메타 캐릭터는 문자로 취급되지 않고 정규식에서 특수한 역할을 수행합니다.

### **대괄호 ( `[ ]` )**

- `[ab]` : 대괄호 안에 a, b 중 한 개의 문자라도 있다면 `true`
- `[^ab]`: 대괄호 안에 a, b 중 한 개의 문자라도 없다면 `true`
- `[a-z]`: 소문자 a에서 z까지
- `[A-Z]`: 소문자 A에서 Z까지
- `[0-9]:` 숫자 0에서 9까지
- `[ㄱ-힣]`: 한글 (자음포함)
- `[가-힣]`: 한글 (자음제외)

```js
regex = /[abc]/ 
| "xyzC" 테스트: false
| abc에 해당하는 문자가 전혀 없음
| 대소문자를 구분하므로 'C'는 해당사항 없음

regex = /[abc]/i 
| "xyzC" 테스트: true
| 플래그 i(대소문자 구분없음) 사용됨

regex = /[a-z]/ 
| "xyzC" 테스트: true
| a-z a에서 z까지의 문자를 나열한 것으로
| 위 정규식은 /[abcdefghizjklmnopqrstuvwuxyz]/ 와 동일함

regex = /[a-zA-Z]/ 
| A-Z도 마찬가지로 ABC...XYZ 와 동일
| "12s3" 테스트: true

regex = /[0-9]/
| 0-9 는 0123456789 와 동일
| "axYd" 테스트: false
```

아래는 특수한 범위를 지정하는 메타 캐릭터입니다.

- `\d`: `[0-9]`와 동일
    
- `\D`: `[^0-9]`와 동일
    
- `\w`: `[a-zA-Z0-9_]` 
    
- `\W`: `[^a-zA-Z0-9_]`
    

```js
regex = /\D/
| "aaa": true
| "111": false
```

 

### **마침표 (`.`)**

- 모든 문자 범위의 한 글자를 뜻합니다.
- 스페이스나 엔터 등의 `화이트스페이스`도 포함합니다.
- `undefined`나 `null`을 구별할 수 없습니다.

```js
regex = /./

regex.test("d")
regex.test("e")
regex.test("	")
regex.test(undefined)
regex.test(null)

| 모두 true

```

 

### **서컴플렉스, 햇마크 (`^`)**

- 스트링의 시작 위치에 특정 문자가 있는지 확인합니다.
- **주의**: 대괄호 안의 `^`는 해당 조건의 `not` 에 해당합니다. (대괄호 부분 참조)

```js
regex = /^a/ 
| "abcd": true 
| "bacd": false

regex = /^ab/ 
| ab로 시작하는 ~
| "abcd": true 
| "acbd": false

regex = /^[ab]/ 
| a또는 b로 시작하는 ~
| "abcd": true 
| "bacd": true
```

 

### **달러 기호 (`$`)**

- 끝 위치에 특정 문자가 있는지 확인합니다.

```js
regex = /a$/ 
| "cadsaAa": true
```

 

### **시작 끝 기호 (`^` .... `$`)**

- 스트링의 내용이 정확히 .... 와 일치하는지 확인합니다.

```js
regex = /^ab$/ 
| 정확히 ab 라면 

regex = /^adb$/ 
| 정확히 adb 라면
```

```js
var regex = /^ffssdd$/

regex1.test("ffssdd")
| true

regex1.test("ffssde")
| false
```

 

### **덧셈 기호 (`+`)**

- 특정 문자열에 대해서 그 문자열이 1회 이상 반복되는지 확인합니다.

```js
regex = /a+/ 

| "ac", "aaabc", "bbbaa": true 
| "bc": false
```

```js
regex = /^a.+b$/ 
| "aab", "acb": true 
| "ab": false
```

 

### **별표 (`*`)**

- 특정 문자열에 대해서 그 문자열이 0회 이상 반복되는지 확인합니다.
- `+`와의 차이점은 그 문자열이 없다고 하더라도 `true`를 반환하는 것에 있습니다.

```js
regex = /b*/
| "ac", "abbbc", "ㅋㅌㅍ": true
| 대부분의 상황에서 true가 나옴

regex = /김.*수/ 
| "김수", "김갑수", "김무한수": true

regex = /ab*c/ 
| "ac", "abbc", "abc": true
| "adc": false

regex = /ab*d/
| "adc": true
```

 

### **중괄호 ( `{ }` )**

- 특정 문자열 중에서 그 부분이 _x_회 ~ _y_회 반복되는지 확인합니다.

```js
regex = /a{2}/ 
regex = /a{2,}/

| "aa", "aaa": true
| "a": false

regex = /^a{2,4}$/ 
| "a": false 
| "aaaaaaa": false
| "aaaa: true
```

 

```js
regex = /^\d{4}$/
| "333", "33333": false
| "3333": true

regex = /^\D{4}$/
| "3333", "3asd": false
| "easd": true

```

 

### **소괄호 ( `( )` )**

- 그룹화의 기능을 수행합니다.
- `exec`를 수행하면 배열의 `0`번은 그룹화되지 않은 값, `1`번은 그룹화된 값을 반환합니다.

 

```js
var text = ">Romeo<는 >Juliet<의 >窓辺<에서 외쳤다. >Window<를 Open해다오 >줄리엣!<!"
var regex = />(.+?)</gi; 

var resultArray = [];

while((result = regex.exec(text)) != null) {
    resultArray.push(result[1])
    console.log(RegExp.$1) // 전역변수 RegExp는 exec의 그룹화된 값을 자동으로 저장(읽기 전용) $1~$9
}

console.log(resultArray)

```

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-29-pm-10.17.50.png)

 

### **역슬래시 (`/`)**

- 일반적으로 메타 캐릭터의 앞에 붙이면 해당 메타 캐릭터의 역할을 제거합니다.
- `\D`, `\d` 등 특수한 경우에 사용될 수도 있습니다. (대괄호 부분 참조)

```js
regex = /ABC\.DEF/
| "ABC.DEF": true
```

 

### **물음표 (`?`)**

- 물음표 앞의 문자가 없거나 하나만 있는지 확인합니다.
- 게으른 수량자를 지시할 때 사용합니다. (게으른 수량자 부분 참조)

```js
regex = /Hell ?World/
| "Hell World", "HellWorld": true
```

 

## **탐욕적 수량자 & 게으른 수량자**

기본적으로 수량자의 속성은 **탐욕적**입니다.

```js
text = "<p>ABCD</p><p>EFGH</p>"

regexGreedy = />.+</
regexLazy = />.+?</
```

예를 들어 위의 `text`를 테스트하는 경우를 보겠습니다. 태그 안의 이너 텍스트(inner text)만 추출하고 싶은 것입니다. `regexGreedy`의 경우 정규식 만족 대상은 _ABCD, ABCD</p>, ABCD</p><p>EFGH_ 등 많은 부분이 만족하게 되어 목적에 부합하지 않습니다.

- <p\>**ABCD**</p><p>EFGH</p>
- <p\>**ABCD</p>**<p>EFGH</p>
- <p\>**ABCD</p><p>EFGH**</p>
- <p>ABCD</p><p\>**EFGH**</p>

위의 경우를 탐욕적이라고 하며, 반대로 **게으른** 탐색 방법은 어떤 부분이 특정 조건을 만족했으면 그 부분을 더 늘리지 않고 다음 부분으로 넘어갑니다. 위의 경우 게으른 수량자에서 _\>ABCD<_ 가 만족했다면 그 만족한 부분은 더 검색하지 않고 넘어간 뒤 다음 부분으로 넘어가는 것입니다. 따라서 게으른 수량자는 다음과 같이 됩니다.

- <p\>**ABCD**</p><p>EFGH</p>
- <p\>**ABCD</p>**<p>EFGH</p>
- <p\>**ABCD</p><p>EFGH**</p>
- <p>ABCD</p><p\>**EFGH**</p>

게으른 수량자는 적용하고자 하는 부분 뒤에 물음표(`?`)를 붙이면 위의 경우처럼 대상을 한정지을 수 있습니다.

 

## **예제**

### **전화번호**

```js
var fd = document.getElementById('fd')

var regexPhone = /^01[01679]-[0-9]{3,4}-[0-9]{4}$/

document.getElementById('btn1').onclick = function() {
    document.getElementById('result').innerHTML = regexPhone.test(fd.value)
}

fd.onkeydown = function() {
    if(event.keyCode == 13)
        document.getElementById('result').innerHTML = regexPhone.test(fd.value)
} 

```

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-29-pm-10.23.10.png)

 

### **코드 앞의 숫자 제거**

```js
var dirtyText = 
`       1. public static void main(String[] args) {
        2. System.out.println("Hello World");
        3. Scanner s = new Scanner(System.in);
        4. int num = s.nextInt();
        5. System.out.println(num)
        16. }`

var regex = /[0-9]{1,}\./g
var result = dirtyText.replace(regex, '')

console.log(result)
```

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-29-pm-10.27.17.png)

 

### **특정 문장에서 영문 입력 못하게 막기 (로마자가 들어가 있으면 `false`를 반환)**

```js
var addrf = document.getElementById("addr-field")
var resultArea = document.getElementById("result-area")

var regexAddr = /^.*?[A-Za-z].*?$/

addrf.onkeyup = function() {
    if (!regexAddr.test(addrf.value)) {
        resultArea.innerHTML = ""
    } else if (addrf.value == '') {
        resultArea.innerHTML = ""
    } else if (regexAddr.test(addrf.value)) {
        resultArea.innerHTML = "영문자는 입력하실 수 없습니다."
        resultArea.style.color = "red"
    }
}

```

 ![](/assets/img/wp-content/uploads/2019/11/screenshot-2019-11-29-pm-10.35.18.png)

 

## **기타 유용한 정규표현식**

```
상황에 따라 시작끝기호(^ $) 또는 플래그 등은 추가 혹은 제거합니다.

주민번호 앞자리
/([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/

URL
/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
 
IP 주소
/\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/

이메일
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

HTML 주석 찾기
/<!-{2,}.*?-{2,}>/

HTML 태그 찾기
/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/
```

 

## **유용한 사이트**

- [MDN 정규표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/%EC%A0%95%EA%B7%9C%EC%8B%9D)
- [MDN RegExp](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [RegExr](https://regexr.com/): 실시간으로 정규식을 테스트할 수 있습니다.
- [debuggex](https://www.debuggex.com/): 정규식을 그림으로 볼 수 있습니다.
