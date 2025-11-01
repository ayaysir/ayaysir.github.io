---
title: "자바스크립트 ES6+: 제너레이터 함수 (generator function)"
date: 2021-01-03
categories: 
  - "DevLog"
  - "JavaScript"
---

#### **제너레이터 함수**

제너레이터 함수(generator function)는 여러 값을 시간차를 두고 반환할 수 있는 함수의 한 형태입니다. 일반 함수와 달리 `function*` 키워드를 사용하여 선언합니다.

예를 들어 1부터 3까지 시간차를 두고 반환하는 제너레이터 함수는 다음과 같습니다.

```
function* generator1() {
  yield 1
  yield 2
  yield 3
}
```

`yield` 키워드는 사용자가 명시적으로 다음 값을 호출할 때 반환할 값 앞에 붙이는 키워드입니다. 그러면 다음값을 호출하는 방법은 무엇일까요? `generator()` 함수를 실행한 형태에서 뒤에 `.next()`를 붙이면 `yield` 값이 순차적으로 반환이 됩니다.

```
const gen1 = generator1()
console.log(gen1.next(), gen1.next(), gen1.next())
```

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-03-오후-11.53.58.png)

위에 보이는 객체는 `IteratorResult` 타입의 객체이며, `value`는 `yield` 값이고, `done`은 제너레이터 순회가 종료되었는지를 나타내는 변수입니다. 지금은 명시적으로 제너레이터 순회 종료를 하지 않았으므로 `done`이 모두 `false`가 됩니다.

제너레이터 객체의 `yield` 값들은 반복적으로 호출된다는 점에서 iterable한 특성을 지니며, 따라서 `for...of` 문을 사용할 수 있습니다.

```
for(let num of generator1()) {
  console.log(num)
}

```

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-04-오전-12.00.42.png)

 

#### **제너레이터 종료**

제너레이터 순회 종료를 하는 방법으로 `.return()`을 사용하는 방법이 있습니다.

```
const gen1 = generator1()
console.log(gen1.next(), gen1.return(-Infinity), gen1.next())
```

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-04-오전-12.02.17.png)

두 번째에 `.next()` 대신 `.return()`을 사용하면 제너레이터가 강제 종료되며, `done` 도 `true`로 바뀝니다. 이후에는 다시 `.next()`를 호출해도 `3`이 나오지 않습니다. `.return()`의 괄호 안에 값을 넣으면 해당 값이 `value`에 강제 배정되며, 아무것도 넣지 않으면 `value`는 `undefined`가 할당됩니다.

또는 제너레이터 함수의 내부에 `yield` 대신 `return` 키워드를 사용하면 그 부분이 종료 시점이 됩니다. 만약 `return 3`이 마지막줄에 있다면, 마지막 `.next()` 호출 시 `done`이 `true`인 `IteratorResult`가 반환됩니다. 참고로 `for...of`문 사용시 `return` 값은 반환되지 않습니다. 즉, `1`과 `2`만 나오며 종료됩니다.

 

#### **무한한 제너레이터**

다음은 숫자 아이디를 생성하는 제너레이터 함수입니다.

```
function* idMaker(){
    let index = 0;
    while(true)
        yield index++;
}
```

```
const idm = idMaker()
console.log(idm.next(), idm.next()) // 1, 2
```

주의할 점은 여기서도 `for...of` 문을 사용할 수 있는데, 이 제너레이터 함수에는 종료 조건이 없으므로 무한한 `next()` 가 가능하며, 따라서 `for...of`문을 실행하면 끝없이 아이디가 생성되어 무한 루프에빠지는 문제가 발생합니다.

 

#### **예외 발생**

`..throw()`를 발생하면 제너레이터 함수 순회 중 강제로 예외를 발생시킬 수 있습니다.

```
function* generator2(startNum = 15) {
  try {
    while (true) {
      yield startNum++
    }
  } catch (err) {
    return err
  }
}
```

```
const gen2 = generator2(20)
console.log(gen2.next(), gen2.next())
console.log(gen2.throw("err"), gen2.next())
```

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-04-오전-12.17.51.png)

`throw` 블록에서 `return` 대신 `yield`를 사용할 수도 있으며, 이 경우 `.next()`가 계속 진행됩니다.

 

`yield*` 키워드를 사용하면, iterable한 배열 등도 `yield` 목록에 포함시킬 수 있습니다.

```
function* generator3() {
  yield "A"
  yield "B"
  yield* ["C", "D", "E"]
  yield "F"
}
```

```
for(let chr of generator3()) {
  console.log(chr)
}
```

 ![](/assets/img/wp-content/uploads/2021/01/스크린샷-2021-01-04-오전-12.20.23.png)

중간의 `["C", "D", "E"]` 배열을 `yield*` 키워드로 배정하면 각 원소 순서대로 `"C"`, `"D"`, `"E"`가 `.next()`를 통해 호출될 수 있음을 알 수 있습니다.

 

출처: [JavaScript Generator 이해하기](https://wonism.github.io/javascript-generator/)
