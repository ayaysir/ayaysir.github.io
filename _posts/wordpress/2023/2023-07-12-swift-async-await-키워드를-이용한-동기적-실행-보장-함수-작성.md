---
title: "Swift: async/await 키워드를 이용한 동기적 실행 보장 함수 작성"
date: 2023-07-12
categories: 
  - "DevLog"
  - "Swift"
---

## **소개**

이른바 '콜백 지옥'을 해결하기 위해 Swift 5.5 버전부터 등장한 키워드입니다. 자바스크립트 ES6에서 도입된 `async`및 `await`와 목적이 거의 같습니다.

<!-- - [자바스크립트: 콜백, Promise, async - await 기초](http://yoonbumtae.com/?p=1071) -->

> **콜백 지옥(Callback Hell)**
> 
> 콜백 지옥은 JavaScript를 이용한 비동기 프로그래밍시 발생하는 문제로서, **함수의 매개 변수로 넘겨지는 콜백 함수가 반복되어 코드의 들여쓰기 수준이 감당하기 힘들 정도로 깊어지는 현상**을 말한다.  

![](/assets/img/wp-content/uploads/2023/07/image.jpg)

 

JSON을 읽어오는데 서버 상황이 안좋아 2초가 걸리는 작업을 3연속으로 해야한다고 가정하겠습니다. 반드시 각 작업이 완전히 끝나야만 다음 작업이 진행되어야 합니다. 즉, 동기적으로 실행되어야 합니다.

 

## **기존 코드(콜백, 클로저, 컴플리션 핸들러 등)**

아래는 네트워크 `URL`로부터 JSON을 읽어온 뒤 `completion` 클로저를 이용해 핸들러 작업을 처리하는 함수입니다.

```swift
/// URL로부터 JSON을 읽어와 [String: Any]? 형태의 파라미터를 받는 클로저로 처리할 수 있는 함수
func fetchData(_ urlString: String, completion: @escaping ([String: Any]?, Error?) -> Void) {
    let url = URL(string: urlString)!
    
    let task = URLSession.shared.dataTask(with: url) { data, response, error in
        // let shorthand: Swift version 5.7부터 도입
        guard let data else {
            return
        }
        
        do {
            if let array = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] {
                completion(array, nil)
            }
        } catch {
            print(error)
            completion(nil, error)
        }
        
    }
    
    task.resume()
}
```

네트워크로부터 데이터를 가져오는 작업은 비동기로 이루어지기 때문에 이후 작업을 동기적으로 처리하기 위해서는 클로저(다른 이름으로 콜백, 컴플리션 핸들러 등등)를 이용해야 했습니다.

위 함수를 이용한 3연속 JSON 동기적 호출은 다음과 같습니다.

```swift
fetchData("https://reqres.in/api/users?delay=2") { dict, error in
    debugPrint("page 1:", dict!["support"]!)

    fetchData("https://reqres.in/api/users?delay=2") { dict, error in
        debugPrint("page 2:", dict!["support"]!)

        fetchData("https://reqres.in/api/users?delay=2") { dict, error in
            debugPrint("page 3:", dict!["support"]!)
        }
    }
}

```

이른바 '콜백 지옥'이라고 불리는 꼬리물기가 발생하게 됩니다. 그래도 결과는 동기적으로 실행되는 것을 볼 수 있습니다.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemttNW5vaW9peG1ndW9wc3RxeHQwM280d3d3OW4zOGc4OXhqOTEzcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eLh4EWZTsItlhpgQ6W/giphy.gif)

 

## **async/await를 도입한 코드**

이것을 도입하면 콜백 지옥이 해결됩니다.

```swift
/// URL로부터 JSON을 읽어와 [String: Any]를 반환하는 async 함수
func fetchDataAsync(_ urlString: String) async throws -> [String: Any] {
    let url = URL(string: urlString)!
    
    // try를 제외한 경우: Call can throw, but it is not marked with 'try' and the error is not handled
    let (data, _) = try await URLSession.shared.data(from: url)
    
    do {
        if let array = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] {
            return array
        }
    } catch {
        throw error
    }
    
    return [:]
}
```

- 함수 선언 부분에 `async` 키워드를 사용합니다.
    - 이 함수에서 사용되는 메서드는 에러 던지기도 발생되므로 `throws` 키워드와 같이 사용합니다.
- `URLSession.shared.dataTask(...)` 대신 async/await를 지원하는 `URLSession.shared.data(from:)`을 사용합니다.
    - `await` 키워드 데이터 로드가 완료될 때까지 `await` 부분에 머물러 있다가 작업이 종료되면 다음 단계로 진행하는 것을 보장합니다.

 

```
Task {
    print("====== Async/Await Start ======")
    print("page 1:", try await fetchDataAsync("https://reqres.in/api/users?delay=2")["support"]!)
    print("page 2:", try await fetchDataAsync("https://reqres.in/api/users?delay=2")["support"]!)
    print("page 3:", try await fetchDataAsync("https://reqres.in/api/users?delay=2")["support"]!)
}
```

- `Task`는 동시성(concurrency) 작업을 지원할 수 있는 클로저를 지원합니다.
    - `async` 함수는 반드시 동시성 작업이 지원되는 환경 안에서 실행되어야 합니다.
    - 그렇지 않은 경우 _**'async' call in a function that does not support concurrency**_ 에러가 발생합니다.
- `async` 함수는 반드시 `await` 키워드를 동반해서 사용되어야 합니다.
    - async/await 키워드를 사용함으로서 '콜백 지옥' 없이 깔끔한 들여쓰기로 사용할 수 있습니다.

 

콜백 지옥 없이 동기적 실행이 가능해졌습니다.

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNW44cXB2dWNkNnh2Mmlrdmg4MnRxeXV3aG95cmx3b3JrZzRnZXZ0cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Tyv0dgSHt7DeqHjPNa/giphy.gif)
