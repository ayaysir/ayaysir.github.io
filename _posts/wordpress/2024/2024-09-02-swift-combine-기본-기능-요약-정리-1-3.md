---
title: "Swift: Combine 기본 기능 81가지 한 번에 요약 정리"
date: 2024-09-02
categories: 
  - "DevLog"
  - "Swift"
---

- **출처:** [https://icksw.tistory.com/category/iOS/Combine](https://icksw.tistory.com/category/iOS/Combine)
- **주의:** 아래 포스트는 김생성씨의 도움을 받아 요약하였으므로 틀린 내용이 있을 수 있습니다.

## 기초

### **1\. Combine 프레임워크를 사용하여 커스텀 Publisher 생성**

```swift
class HandsUp: Publisher {
    typealias Output = String
    // Never: The return type of functions that do not return normally, that is, a type with no values.
    typealias Failure = Never
    
    /*
     S: 제네릭 타입
     where:
      - S: Subscriber 타입을 준수
      - Never == S.Failure이어야 함
      - String == S.Input이어야 함
     
     */
    func receive<S>(subscriber: S) where S : Subscriber, Never == S.Failure, String == S.Input {
        DispatchQueue.global(qos: .utility).async {
            let pandas: [String] = ["LeBao", "AiBao", "FuBao"]
            pandas.forEach {
                // receive: Tells the subscriber that the publisher has produced an element.
                _ = subscriber.receive($0)
            }
            
            // Tells the subscriber that the publisher has completed publishing, either normally or with an error.
            subscriber.receive(completion: .finished)
        }
    }
    
}

let handsUpPublisher = HandsUp()

_ = handsUpPublisher.sink(receiveCompletion: { _ in
    print("completed")
}, receiveValue: { panda in
    print("Panda:", panda)
})

/*
 Panda: LeBao
 Panda: AiBao
 Panda: FuBao
 completed
 */
```

**설명:**

- 위 코드는 Combine 프레임워크의 기본적인 기능인 Publisher를 커스텀하게 생성하는 예제입니다.
- `HandsUp` 클래스는 `Publisher` 프로토콜을 준수하며, `Output` 타입은 `String`이고, `Failure` 타입은 `Never`입니다.
- `receive(subscriber:)` 메서드는 `Subscriber`를 받아, 비동기적으로 데이터를 발행하고 완료 상태를 전달합니다.
- 비동기적으로 "LeBao", "AiBao", "FuBao" 문자열을 전달하고, 발행이 완료되었음을 알립니다.

 

## **Combine에서 제공하는 Publisher**

### **2\. Future: 단일 이벤트와 종료 혹은 실패를 제공하는 publisher**

```swift
// 1
let future = Future<String, Error> { promise in
    promise(.success("Future: Success"))
}

_ = future.sink(receiveCompletion: { result in
    print("Future Result:", result)
}, receiveValue: { receiveValue in
    print("receiveValue:", receiveValue)
})

/*
 receiveValue: Future: Success
 Future Result: finished
 */

// 2
let futureWithError = Future<String, Error> { promise in
    promise(.failure(NSError(domain: "Future Error", code: -1)))
}

_ = futureWithError.sink(receiveCompletion: { result in
    print("FutureWithError Result:", result)
}, receiveValue: { receiveValue in
    print("receiveValue:", receiveValue)
})

/*
 FutureWithError Result: failure(Error Domain=Future Error Code=-1 "(null)")
 */

// 3
let futureWithNever = Future<String, Never> { promise in
    promise(.success("FutureWithNever: Never"))
}
_ = futureWithNever.sink {
    print($0)
}

/*
 FutureWithNever: Never
 */

```

#### **설명:**

- **Future**는 Combine의 Publisher 중 하나로, 단일 이벤트와 종료 또는 실패를 제공합니다. 이 Publisher는 단일 값을 emit하고 종료하거나, 오류가 발생하면 실패를 emit합니다.
- 첫 번째 예제에서는 `Future`가 성공적인 결과를 emit하고, `Future: Success`라는 메시지가 출력됩니다.
- 두 번째 예제에서는 오류를 발생시키는 `Future`를 보여줍니다. 오류가 발생하면 `FutureWithError Result: failure(Error Domain=Future Error Code=-1 "(null)")`가 출력됩니다.
- 세 번째 예제는 `Future<String, Never>`를 사용하여 결과를 emit하지만 실패를 발생시키지 않는 경우를 보여줍니다. 여기서는 `FutureWithNever: Never`가 출력됩니다.

 

### **3\. Just: 단일 이벤트 발생 후 종료**

```swift
let just = Just<String>("Monika")

_ = just.sink {
    print("JustResult:", $0)
} receiveValue: {
    print($0)
}

/*
 Monika
 JustResult: finished
 */

```

#### **설명:**

- **Just**는 Combine의 Publisher 중 하나로, 단일 값을 emit하고 종료합니다. `Just`는 하나의 이벤트를 방출한 후, 완료 상태로 종료됩니다.
- 위의 예제에서는 `Just`가 `"Monika"`라는 값을 emit하고, 이 값이 출력됩니다. 이후 `JustResult: finished`라는 메시지가 출력됩니다.
- 이 예제는 단일 값을 제공하고 완료 상태로 종료되는 `Just` Publisher의 동작을 보여줍니다.

 

### **4\. Deferred: 구독이 이뤄질 때 publisher가 만들어질 수 있도록 하는 publisher**

```swift
class PutYourHandsUp: Publisher {
    typealias Output = String
    typealias Failure = Never
    
    init() {
        Date().timeIntervalSince1970
    }
    
    func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
        DispatchQueue.global(qos: .utility).async {
            let pandas: [String] = ["LeBao", "AiBao", "FuBao"]
            pandas.forEach {
                _ = subscriber.receive($0)
            }
            
            subscriber.receive(completion: .finished)
        }
    }
}

let deferredPYHUPublisher = Deferred<PutYourHandsUp> {
    PutYourHandsUp()
}
print("Deferred Publisher Init: \(Date().timeIntervalSince1970)")
_ = deferredPYHUPublisher.sink(receiveValue: {
    print("Panda:", $0)
})

/*
 Deferred Publisher Init: 1692027749.778286
 (Publisher Init: 1692027749.778328)
 Panda: LeBao
 Panda: AiBao
 Panda: FuBao
 */

```

#### **설명:**

- **Deferred**는 Combine의 Publisher를 구독할 때마다 새로 생성할 수 있도록 합니다. 이렇게 하면 Publisher가 실제로 생성되고 초기화되는 시점을 구독 시점으로 지연시킬 수 있습니다.
- 위의 예제에서는 `PutYourHandsUp`라는 커스텀 Publisher를 사용하여, 구독이 이루어질 때까지 Publisher가 생성되지 않도록 합니다.
- 코드에서는 `Deferred`를 사용하여 `PutYourHandsUp`의 인스턴스를 지연 생성합니다. `Deferred Publisher Init` 출력 후에 `PutYourHandsUp` 인스턴스가 생성되고 초기화 시점이 기록됩니다.
- 구독 시에는 "LeBao", "AiBao", "FuBao"라는 문자열이 차례로 출력되며, 이는 `PutYourHandsUp` Publisher가 비동기적으로 값을 emit하고 완료 상태로 종료되기 때문입니다.

 

### **5\. Empty: 이벤트 없이 종료**

```swift
let empty = Empty<String, Never>()
_ = empty.sink(receiveCompletion: { result in
    print("Empty: receiveCompletion:", result)
}, receiveValue: { value in
    print("Empty: receiveValue:", value)
})

/*
 Empty: receiveCompletion: finished
 */

```

#### **설명:**

- **Empty**는 Combine의 Publisher 중 하나로, 아무런 값을 emit하지 않고 즉시 완료 상태로 종료됩니다. 이 Publisher는 값이 필요 없는 경우나, 단순히 종료 상태를 전달하고자 할 때 유용합니다.
- 위의 예제에서는 `Empty` Publisher를 사용하여 어떤 값도 emit하지 않고, 완료 상태만을 전달합니다. `receiveCompletion`의 출력에서 `finished`가 나타나며, `receiveValue`의 출력은 없습니다.
- 이 예제는 `Empty` Publisher가 아무런 값을 방출하지 않고, 단순히 완료 상태로 종료되는 동작을 보여줍니다.

 

### **6\. Fail: 오류와 함께 종료**

```swift
let failed = Fail<String, Error>(error: NSError(domain: "Failed", code: -1))
_ = failed.sink(receiveCompletion: { result in
    print("Fail: receiveCompletion:", result)
}, receiveValue: { value in
    print("Fail: receiveValue:", value)
})

/*
 Fail: receiveCompletion: failure(Error Domain=Failed Code=-1 "(null)")
 */

```

#### **설명:**

- **Fail**은 Combine의 Publisher 중 하나로, 즉시 오류를 발생시키고 종료됩니다. 이 Publisher는 값이 필요 없고, 실패 상태만을 전달해야 할 때 사용됩니다.
- 위의 예제에서는 `Fail` Publisher를 사용하여 오류를 방출합니다. 이 오류는 `NSError`로 정의되며, 오류 도메인은 "Failed", 코드 값은 `-1`입니다.
- 코드는 `Fail` Publisher가 오류와 함께 종료되는 동작을 보여줍니다. `receiveCompletion`에서 오류 정보가 포함된 실패 상태가 출력되며, `receiveValue`는 호출되지 않습니다.

 

### **7\. Record: 입력과 완료를 기록해 다른 subscriber에서 반복될 수 있는 publisher**

```swift
let record = Record<String, Error> { recording in
    print("===== Make Record ===== ")
    recording.receive("LeBao")
    recording.receive("AiBao")
    recording.receive("FuBao")
    recording.receive(completion: .failure(NSError(domain: "ㅠ", code: -1)))
}

for _ in 1...3 {
    _ = record.sink {
        print($0)
    } receiveValue: {
        print($0, terminator: "\t")
    }
}

/*
 ===== Make Record =====
 LeBao    AiBao    FuBao    failure(Error Domain=ㅠ Code=-1 "(null)")
 LeBao    AiBao    FuBao    failure(Error Domain=ㅠ Code=-1 "(null)")
 LeBao    AiBao    FuBao    failure(Error Domain=ㅠ Code=-1 "(null)")
 */

```

#### **설명:**

- **Record**는 Combine의 Publisher로, 이벤트와 완료 상태를 기록하여 여러 구독자에게 반복적으로 제공할 수 있습니다. 이 Publisher는 입력된 모든 값을 기록하여 이후의 구독자들이 동일한 값을 받을 수 있도록 합니다.
- 위의 예제에서는 `Record`를 사용하여 문자열 값을 방출하고, 완료 상태로 오류를 발생시킵니다. 기록된 값과 완료 상태는 여러 번의 구독 시 반복해서 제공됩니다.
- 코드는 `record` Publisher가 3번 반복하여 같은 기록된 값을 방출하는 것을 보여줍니다. 각각의 구독자에게 동일한 이벤트 시퀀스가 전달됩니다.

 

### **8\. AnyPublisher: 유형 추상화를 위한 Publisher**

```swift
let originalPublisher = [1, nil, 3].publisher
let anyPublisher = originalPublisher.eraseToAnyPublisher()
/*
 이 게시자의 실제 유형이 아닌 다운스트림 구독자에게 AnyPublisher의 인스턴스를 노출하려면 eraseToAnyPublisher()를 사용하십시오. 이러한 유형 삭제 형식은 다른 모듈과 같은 API 경계 전체에서 추상화를 유지합니다. 게시자를 AnyPublisher 유형으로 노출하면 시간이 지남에 따라 기존 클라이언트에 영향을 주지 않고 기본 구현을 변경할 수 있습니다.
 */
anyPublisher.sink { receivedValue in
    print("AnyPublisher:", receivedValue as Any)
}

```

 ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-02-pm-5.44.59.jpg)

#### **설명:**

- **AnyPublisher**는 Combine의 Publisher의 타입을 추상화하여 다양한 모듈 간의 API 경계에서 일관성을 유지할 수 있게 합니다. `eraseToAnyPublisher()` 메서드는 특정 Publisher의 실제 유형을 숨기고, 이를 `AnyPublisher`로 변환하여 추상화된 형태로 제공합니다.
- 위의 예제에서는 배열 `[1, nil, 3]`을 Publisher로 변환한 후, `eraseToAnyPublisher()`를 사용하여 `AnyPublisher`로 변환합니다. 이를 통해 Publisher의 실제 타입을 숨기고 `AnyPublisher` 타입으로 추상화된 Publisher를 제공합니다.
- 코드의 마지막 부분에서 `AnyPublisher`의 값을 구독하고 출력합니다. 이 방식은 내부 구현에 대한 정보를 숨기면서 외부에 일관된 인터페이스를 제공할 수 있습니다.



### **9\. Demand Custom Subscriber: IntSubscriber 구현**

```swift
class IntSubscriber: Subscriber {
    
    typealias Input = Int
    typealias Failure = Never
    
    //
    func receive(subscription: Subscription) {
        subscription.request(.max(1))
    }
    
    // Demand: 요구 횟수
    func receive(_ input: Int) -> Subscribers.Demand {
        print("Received Value:", input)
        // .max(n): Creates a demand for the given maximum number of elements.
        // The publisher is free to send fewer than the requested maximum number of elements.
        return .max(1)
        
        /*
         .max(1): Publisher에게 한 번 더 달라고 요청
         .none: Publisher에게 값 더이상 안줘도 된다고 알림
         .unlimited: Publisher에게 끝없이 값을 달라고 요청
         */
    }
    
    func receive(completion: Subscribers.Completion) {
        print("Received completion: \(completion)")
    }
}

let intArray: [Int] = [1, 2, 3, 4, 5]
let intSubscriber = IntSubscriber()

intArray.publisher.subscribe(intSubscriber)

// Combine을 사용할 때 주의할 점은 Publisher의 <Output, Failure> 타입과 Subscriber의 <Input, Failure> 타입이 동일해야 한다는 것!입니다. 이게 다르면 Publisher와 Subscriber는 서로 값을 주고받지 못합니다.

```

 ![](/assets/img/wp-content/uploads/2024/09/screenshot-2024-09-02-pm-5.44.50.jpg)

#### **설명:**

- **IntSubscriber**는 Combine의 `Subscriber` 프로토콜을 구현한 사용자 정의 구독자입니다. 이 구독자는 `Int` 타입의 값을 수신하고, `Never` 타입의 실패를 허용합니다.
- `receive(subscription:)` 메서드는 구독 요청을 수행하며, 최대 한 개의 요소를 요청합니다. `request(.max(1))`은 Publisher에게 한 번의 값을 더 요청하겠다는 의미입니다.
- `receive(_ input:)` 메서드는 실제로 수신된 값을 처리합니다. 이 메서드는 `Subscribers.Demand`를 반환하여 Publisher에 대해 더 많은 값을 요청할 수 있습니다. 예제에서는 `.max(1)`을 반환하여 한 개의 추가 값을 요청합니다.
- `receive(completion:)` 메서드는 완료 상태를 처리합니다. 완료 상태는 `Never` 타입을 사용하여 오류가 발생하지 않음을 나타냅니다.
- 마지막으로, `intArray.publisher.subscribe(intSubscriber)`를 통해 `IntSubscriber`를 `intArray` Publisher에 구독자로 추가합니다. 이 구독자는 배열의 각 값을 수신하고, 요청한 만큼의 값을 출력합니다.
- Combine을 사용할 때 주의할 점은 Publisher의 `<Output, Failure>` 타입과 Subscriber의 `<Input, Failure>` 타입이 동일해야 한다는 것입니다. 이 타입이 다르면 Publisher와 Subscriber는 서로 값을 주고받지 못합니다.

 

### **10\. AnyCancellable: 구독 취소 및 이벤트 처리**

```swift
let subject1 = PassthroughSubject<Int, Never>()
let anyCancellable1 = subject1
    .handleEvents(receiveCancel: {
        print("Subject 1 is cancelled.")
    })
    .sink { completion in
        print("received completion: \(completion)")
    } receiveValue: { value in
        print("received value: \(value)")
    }

subject1.send(1)
anyCancellable1.cancel()
subject1.send(2)

// sink는 Subscriber를 만들고 바로 request 하는 operator입니다.

```

```
received value: 1
Subject 1 is cancelled.
```

#### **설명:**

- **AnyCancellable**는 Combine에서 구독을 취소할 수 있는 객체를 제공합니다. 구독을 취소하면 Publisher로부터 더 이상 값을 수신하지 않습니다.
- 위의 예제에서는 `PassthroughSubject`를 생성하고, 이를 `handleEvents(receiveCancel:)`와 `sink`를 사용하여 구독합니다. `handleEvents(receiveCancel:)`는 구독이 취소될 때 특정 작업을 수행하도록 합니다. 여기서는 "Subject 1 is cancelled."를 출력합니다.
- `sink`는 Subscriber를 생성하고 즉시 구독을 시작합니다. `sink`는 값을 수신하고 완료 상태를 처리하는 클로저를 제공합니다.
- 예제에서는 `subject1.send(1)`을 통해 값을 발행한 후, `anyCancellable1.cancel()`을 호출하여 구독을 취소합니다. 이후 `subject1.send(2)`를 호출해도 취소된 구독자에게는 값이 전달되지 않습니다.
- `sink`는 Subscriber를 생성하고 구독을 시작하며, 요청된 값만큼 Publisher가 값을 제공하도록 합니다. 이 과정에서 `AnyCancellable` 객체를 사용하여 구독을 취소할 수 있습니다.

 

### **11\. Publisher와 Subscriber의 상호작용: 값과 완료 이벤트 전달**

 1. Publisher는 값이나 completion event를 Subscriber에게 전달합니다.
 2. Subscriber는 Subscription을 통해 Publisher에게 값을 요청합니다.
 3. Subscription은 Publisher와 Subscriber 사이를 연결합니다.
 4. Subscription은 cancel()을 통해 취소할 수 있으며 이때 호출될 클로저를 설정할 수 있습니다.

```swift
let anyPublisher1 = [1, nil, 3].publisher
    .flatMap { value -> AnyPublisher<Int, Never> in
        if let value {
            return Just(value).eraseToAnyPublisher()
        }
        
        return Empty().eraseToAnyPublisher()
    }.eraseToAnyPublisher()

anyPublisher1.sink {
    print("AnyPublisher completion: \($0)")
} receiveValue: {
    print("value: \($0 as Any)")
}

/*
 결과:
 value: 1
 value: 3
 AnyPublisher completion: finished
 */

```

#### **설명:**

- 이 예제는 Combine의 Publisher와 Subscriber 간의 상호작용을 설명합니다. Publisher는 값을 발행하거나 완료 이벤트를 전달하고, Subscriber는 이를 수신하고 처리합니다.
- **Publisher**는 값이나 완료 이벤트를 Subscriber에게 전달합니다. 이 예제에서는 배열 \[1, nil, 3\]을 Publisher로 변환합니다.
- **Subscriber**는 Subscription을 통해 Publisher에게 값을 요청합니다. 여기서는 `flatMap`을 사용하여 배열의 각 값을 `Just`로 변환하고, `Empty`를 사용하여 `nil` 값을 처리합니다.
- **Subscription**은 Publisher와 Subscriber 사이의 연결을 관리하며, `cancel()` 메서드를 통해 구독을 취소할 수 있습니다.
- `anyPublisher1`은 `flatMap`을 사용하여 각 값을 `Just`로 변환하고, `Empty`로 대체하여 값이 없을 때는 빈 Publisher를 반환합니다. 최종적으로 `eraseToAnyPublisher()`로 변환합니다.
- 결과적으로, `AnyPublisher`는 값을 수신하여 출력하고, 완료 상태를 출력합니다. 값이 1과 3이 출력되며, 완료 이벤트는 `finished`로 표시됩니다.

 



## **Subject들**

### **12\. CurrentValueSubject: 최신 값과 함께 구독**

```swift
let currentValueSubject = CurrentValueSubject<String, Never>("1")
currentValueSubject
    .sink { completion in
        print("1 번째 sink completion: \(completion)")
    } receiveValue: { value in
        print("1 번째 sink value: \(value)")
    }

currentValueSubject
    .sink { completion in
        print("2 번째 sink completion: \(completion)")
    } receiveValue: { value in
        print("2 번째 sink value: \(value)")
    }
    .cancel()

currentValueSubject
    .sink { completion in
        print("3 번째 sink completion: \(completion)")
    } receiveValue: { value in
        print("3 번째 sink value: \(value)")
    }

currentValueSubject.send("2")
currentValueSubject.send("3")
currentValueSubject.send(completion: .finished)

/*
 결과:
 1 번째 sink value: 1
 2 번째 sink value: 1
 3 번째 sink value: 1
 1 번째 sink value: 2
 3 번째 sink value: 2
 1 번째 sink value: 3
 3 번째 sink value: 3
 1 번째 sink completion: finished
 3 번째 sink completion: finished
 */

```

#### **설명:**

- **CurrentValueSubject**는 Combine에서 현재 값을 보유하고 있는 Publisher입니다. 구독자는 현재 값과 이후 발행되는 값 모두를 수신할 수 있습니다.
- 위의 예제에서는 `CurrentValueSubject`를 사용하여 문자열 값을 보유하고 초기 값으로 "1"을 설정합니다.
- 첫 번째 `sink`는 초기 값 "1"을 수신하고, 그 이후에 발행되는 값도 수신합니다.
- 두 번째 `sink`는 첫 번째 구독과 동일한 초기 값 "1"을 수신하지만, `cancel()`을 호출하여 구독을 취소합니다. 이후 발행되는 값과 완료 상태는 이 구독자에게 전달되지 않습니다.
- 세 번째 `sink`는 취소되지 않았으므로, 현재 값과 이후 발행되는 값 및 완료 상태를 모두 수신합니다.
- 결과적으로, 각 구독자는 초기 값 "1"과 이후 발행된 값 "2" 및 "3", 그리고 완료 상태를 출력합니다. 취소된 구독자는 값과 완료 상태를 수신하지 않습니다.

<!-- \[the\_ad id="3020"\] -->

 

### **13\. PassthroughSubject: 값을 전파하는 Publisher**

```swift
/*
 정의를 보니 "downstream의 subscriber들에게 값을 전파한다"라고 되어있네요.
 그리고 아까 알아본 CurrentValuSubject와 다르게 생성할 때 딱히 초기값이 필요하지 않다고 합니다.
 또한 최신 값을 저장하기 위한 공간도 필요 없죠.
 이름에서 느낄 수 있듯이 그냥 값을 스쳐 보내는 쿨한 녀석입니다.
 따라서 만약에 subscriber가 없거나 Demand가 0이라면 값을 보내더라도 아무 일도 발생하지 않게 됩니다.
 */

let passthroughSubject = PassthroughSubject<String, Never>()

passthroughSubject
    .sink {
        print("1 번째 Passthrough sink completion: \($0)")
    } receiveValue: {
        print("1 번째 Passthrough sink value: \($0)")
    }

passthroughSubject
    .sink {
        print("2 번째 Passthrough sink completion: \($0)")
    } receiveValue: {
        print("2 번째 Passthrough sink value: \($0)")
    }

passthroughSubject.send("ee")
passthroughSubject.send("ff")
passthroughSubject.send(completion: .finished)

/*
 결과:
 1 번째 Passthrough sink value: ee
 2 번째 Passthrough sink value: ee
 1 번째 Passthrough sink value: ff
 2 번째 Passthrough sink value: ff
 1 번째 Passthrough sink completion: finished
 2 번째 Passthrough sink completion: finished
 */

```

#### **설명:**

- **PassthroughSubject**는 값을 전파하는 Publisher로, 구독자가 값을 수신하기 전에 값을 전달할 수 있습니다. 초기값을 필요로 하지 않으며, 최신 값을 저장하지 않습니다.
- 이 예제에서 `PassthroughSubject`를 사용하여 두 개의 `sink` 구독자를 생성합니다. 이 구독자들은 각각 `PassthroughSubject`가 발행하는 값을 수신하고, 완료 상태를 출력합니다.
- 구독자는 두 개의 `sink`가 모두 같은 값을 수신합니다. `send` 메서드를 호출하여 "ee"와 "ff"를 발행하고, `completion: .finished`로 완료 상태를 발행합니다.
- 결과적으로, 모든 구독자는 각각의 값을 "ee"와 "ff"를 출력하고, 완료 상태를 출력합니다. 구독자가 없거나 `Demand`가 0인 경우, 발행된 값은 전파되지 않습니다.

 

### **14\. Assign: 객체의 프로퍼티에 값을 할당하는 Subscriber**

```swift
class SampleObject {
    var intValue: Int {
        didSet {
            print("intValue Changed: \(intValue)")
        }
    }
    
    init(intValue: Int) {
        self.intValue = intValue
    }
    
    deinit {
        print("SampleObject deinit")
    }
}

let sampleObject = SampleObject(intValue: 5)
let assign = Subscribers.Assign<SampleObject, Int>(object: sampleObject, keyPath: \.intValue)
let intArrayPublisher = [6, 19, 34, 55, 390].publisher
intArrayPublisher.subscribe(assign)
print("Final IntValue:", sampleObject.intValue)
/*
 결과:
 intValue Changed: 6
 intValue Changed: 19
 intValue Changed: 34
 intValue Changed: 55
 intValue Changed: 390
 Final IntValue: 390
 */

```

#### **설명:**

- **Assign**는 Combine에서 제공하는 Subscriber로, Publisher가 발행하는 값을 특정 객체의 프로퍼티에 직접 할당합니다. 이를 통해 Publisher의 값을 객체의 프로퍼티에 쉽게 바인딩할 수 있습니다.
- 예제에서는 `SampleObject`라는 클래스를 정의하고, `intValue` 프로퍼티의 값을 변경할 때마다 출력하도록 설정합니다. 객체가 메모리에서 해제될 때 "SampleObject deinit"을 출력합니다.
- `Subscribers.Assign`는 `SampleObject`의 `intValue` 프로퍼티를 업데이트하는 Subscriber로 사용됩니다. 배열의 Publisher에서 발행하는 값을 이 프로퍼티에 할당합니다.
- 배열 `[6, 19, 34, 55, 390]`의 Publisher는 `Assign` Subscriber를 통해 각 값을 `intValue` 프로퍼티에 할당합니다. 프로퍼티의 값이 변경될 때마다 "intValue Changed"가 출력됩니다.
- 최종적으로, 모든 발행된 값이 `intValue`에 할당되고, 마지막 값이 최종적으로 출력됩니다. 객체가 해제될 때 `deinit`이 호출됩니다.

 

### **15\. Demand: Subscriber의 요구 횟수 조절**

```swift
// Demand는 누적되는 값이다, 음수를 넣어서 감소시킬 수는 없다! 정도만 알면 사용할 때 큰 문제는 없겠어요.
class DemandTestSubscriber: Subscriber {
    typealias Input = Int
    typealias Failure = Never
    
    func receive(subscription: Subscription) {
        print("[DEMAND] subscribe 시작!")
        // 여기서 Demand를 설정해줄 수도 있어요!
        // 현재 요청횟수는 1
        subscription.request(.max(1))
    }
    
    func receive(_ input: Int) -> Subscribers.Demand {
        print("[DEMAND] receive input: \(input)")
        
        // input 값이 333일때만 요청횟수를 1 증가
        if input == 333 {
            return .max(1)
        } else {
            return .none
        }
    }
    
    func receive(completion: Subscribers.Completion<Never>) {
        print("[DEMAND] receive completion: \(completion)")
    }
}

print("===== DEMAND =====")
[2, 333, 4, 5].publisher
    .print()
    .subscribe(DemandTestSubscriber())
print("==================")

/*
 결과
 (1) input값이 333일 때만 요청횟수를 1 증가
 ===== DEMAND =====
 receive subscription: ([2, 333, 4, 5])
 [DEMAND] subscribe 시작!
 request max: (1)
 receive value: (2)
 [DEMAND] receive input: 2
 ==================
 */

```

#### **설명:**

- **Demand**는 Combine의 Subscriber가 Publisher에게 얼마나 많은 값을 요청할 것인지를 조절하는 메커니즘입니다. `Subscribers.Demand`를 사용하여 요청할 최대 값의 수를 설정하거나, 추가 값을 요청하지 않도록 설정할 수 있습니다.
- 예제에서는 `DemandTestSubscriber`가 `Subscription`을 수신하고, 초기 요청 횟수를 1로 설정합니다. 이후에는 값이 333일 때만 추가로 요청 횟수를 1 증가시키고, 그 외의 값은 요청하지 않습니다.
- 출력 결과는 값이 2일 때는 요청이 없으므로, 값 333이 수신될 때만 추가 요청이 발생합니다. 이로 인해 최종적으로 요청된 값만 수신됩니다.

 

### **16\. Demand: 무제한 요청 설정**

```swift
class DemandTestSubscriber2: Subscriber {
    typealias Input = Int
    typealias Failure = Never
    
    func receive(subscription: Subscription) {
        print("[DEMAND] subscribe 시작!")
        // 여기서 Demand를 설정해줄 수도 있어요!
        // 현재 요청횟수는 무제한
        subscription.request(.unlimited)
    }
    
    func receive(_ input: Int) -> Subscribers.Demand {
        // 요청된 무제한 값이 있으므로, receive 메소드에서는 .none을 반환하더라도 계속 값을 수신함
        return .none
    }
    
    func receive(completion: Subscribers.Completion<Never>) {
        print("[DEMAND] receive completion: \(completion)")
    }
}

print("===== DEMAND2 =====")
[2, 333, 4, 5].publisher
    .print()
    .subscribe(DemandTestSubscriber2())
print("==================")

/*
 결과:
 (2) unlimited
 ===== DEMAND2 =====
 receive subscription: ([2, 333, 4, 5])
 [DEMAND] subscribe 시작!
 request unlimited
 receive value: (2)
 receive value: (333)
 receive value: (4)
 receive value: (5)
 receive finished
 [DEMAND] receive completion: finished
 ==================
 */

```

#### **설명:**

- **Demand**는 Combine의 Subscriber가 Publisher에게 요청하는 값의 수를 조절하는 메커니즘입니다. `Subscribers.Demand`를 사용하여 요청할 최대 값의 수를 설정할 수 있으며, 무제한으로 요청할 수도 있습니다.
- 예제에서는 `DemandTestSubscriber2`가 `Subscription`을 수신하고, 무제한으로 값을 요청합니다. `subscription.request(.unlimited)`를 호출하여 무제한으로 요청을 설정합니다.
- 무제한으로 요청을 설정했으므로, 이후 `receive(_ input: Int)` 메소드에서 `.none`을 반환하더라도 Publisher에서 발행된 모든 값이 수신됩니다. 이로 인해 Publisher에서 발행된 값들이 모두 수신되며, 완료 이벤트가 전달됩니다.

 

### **17\. Completion: 커스텀 오류와 완성 상태 처리**

```swift
// custom Error를 만듭니다.
enum PinguError: Error {
    case pinguIsBaboo
    case elementIsNil
}

class PinguSubscriber: Subscriber {
    typealias Input = Int
    typealias Failure = PinguError
    
    func receive(subscription: Subscription) {
        subscription.request(.unlimited)
    }
    
    func receive(_ input: Int) -> Subscribers.Demand {
        print("receive input: \(input)")
        return .none
    }
    
    func receive(completion: Subscribers.Completion<PinguError>) {
        // .pinguIsBaboo 수신시 실행
        if completion == .failure(.pinguIsBaboo) {
            print("Pingu는 바보입니다.")
        } else {
            print("finished!")
        }
    }
}

let pinguSubject = PassthroughSubject<Int, PinguError>()
let pinguSubscriber = PinguSubscriber()

pinguSubject.subscribe(pinguSubscriber)
pinguSubject.send(100)
pinguSubject.send(completion: .failure(.pinguIsBaboo))
pinguSubject.send(200)

// AnySubscriber
let pinguAnySubscriber = AnySubscriber(pinguSubscriber)
let anySubject1 = PassthroughSubject<Int, PinguError>()
anySubject1.subscribe(pinguAnySubscriber)
anySubject1.send(130300)
anySubject1.send(completion: .failure(.pinguIsBaboo))

/*
 결과:
 receive input: 100
 Pingu는 바보입니다.
 receive input: 130300
 Pingu는 바보입니다.
 */

```

#### **설명:**

- **Completion** 이벤트는 Publisher가 이벤트 스트림을 완료하거나 실패를 알릴 때 발생합니다. 이 예제에서는 커스텀 오류 `PinguError`를 정의하여 Subscriber가 이를 처리하도록 설정합니다.
- `PinguSubscriber` 클래스는 `Subscriber` 프로토콜을 채택하고, `receive(completion:)` 메소드에서 커스텀 오류를 확인하여 적절한 메시지를 출력합니다. 만약 오류가 `.pinguIsBaboo`인 경우, "Pingu는 바보입니다."라는 메시지를 출력합니다.
- 두 개의 `PassthroughSubject` 인스턴스가 생성되고, 각각 `PinguSubscriber`와 `AnySubscriber`에 연결됩니다. 두 번째 `PassthroughSubject`는 `AnySubscriber`를 사용하여 이전 Subscriber와 동일한 동작을 수행합니다.
- 각 `PassthroughSubject`는 값을 전송하고, 커스텀 오류를 발생시킵니다. 결과적으로, 각 Subscriber는 오류가 발생할 때 "Pingu는 바보입니다."라는 메시지를 출력합니다.

 



 

### **18\. 클래스로 정의되어야 하는 Custom Subscription**

```swift
/*
 Subscription에는 특정 Subscriber가 Publisher를 subscribe 할 때 정의되는 ID가 있어서 Class로만 정의해야 한다고 합니다. 또한 Subscription을 cancel 하는 작업은 스레드로부터 안전해야 한다고 하며 cancel은 한 번만 할 수 있다고 해요. Subscription을 cancel 하면 Subscriber를 연결해서 할당된 모든 리소스도 해제된다고 합니다.
 */

struct YoutubeSubscriber {
    let name: String
    let age: Int
}

final class PandaSubscription<S: Subscriber>: Subscription where S.Input == YoutubeSubscriber {
    var requested: Subscribers.Demand = .none
    var youtubeSubscribers: [YoutubeSubscriber]
    var subscriber: S?
    
    init(subscriber: S, youtubeSubscribers: [YoutubeSubscriber]) {
        print("PandaSubscription 생성")
        self.subscriber = subscriber
        self.youtubeSubscribers = youtubeSubscribers
    }
    
    func request(_ demand: Subscribers.Demand) {
        print("요청받은 demand : \(demand)")
        for youtubeSubscriber in youtubeSubscribers {
            subscriber?.receive(youtubeSubscriber)
        }
    }
    
    func cancel() {
        print("PandaSubscription이 cancel됨!")
        youtubeSubscribers.removeAll()
        subscriber = nil
    }
}

extension Publishers {
    struct PandaPublisher: Publisher {
        typealias Output = YoutubeSubscriber
        typealias Failure = Never
        
        var youtubeSubscribers: [YoutubeSubscriber]
        
        func receive<S>(subscriber: S) where S : Subscriber, Failure == S.Failure, Output == S.Input {
            let subscription = PandaSubscription(subscriber: subscriber, youtubeSubscribers: youtubeSubscribers)
            subscriber.receive(subscription: subscription)
        }
        
        mutating func append(subscriber: YoutubeSubscriber) {
            youtubeSubscribers.append(subscriber)
        }
    }
    
    static func panda(youtubeSubscribers: [YoutubeSubscriber]) -> Publishers.PandaPublisher {
        return Publishers.PandaPublisher(youtubeSubscribers: youtubeSubscribers)
    }
}

print("======= PandaSubscription =======")
var pandaSubscriptions = Set<AnyCancellable>()
var youtubeSubscribers = [
    YoutubeSubscriber(name: "FuBao", age: 3),
    YoutubeSubscriber(name: "AiBao", age: 10),
    YoutubeSubscriber(name: "LeBao", age: 11),
]

let pandaPublisher = Publishers.panda(youtubeSubscribers: youtubeSubscribers)
pandaPublisher
    .sink {
        print("PandaPublisher:", $0)
    } receiveValue: {
        print("PandaPublisher: name: \($0.name), age: \($0.age)")
    }
    .store(in: &pandaSubscriptions)

pandaSubscriptions.forEach {
    $0.cancel()
}
print("=================================")

/*
 결과:
 ======= PandaSubscription =======
 PandaSubscription 생성
 요청받은 demand : unlimited
 PandaPublisher: name: FuBao, age: 3
 PandaPublisher: name: AiBao, age: 10
 PandaPublisher: name: LeBao, age: 11
 PandaSubscription이 cancel됨!
 =================================
 */

```

#### **설명:**

- `PandaSubscription` 클래스는 커스텀 `Subscription`을 정의합니다. 이 클래스는 특정 `Subscriber`와 `YoutubeSubscriber`의 배열을 사용하여 데이터를 전송하고, `request(_:)` 메소드를 통해 데이터를 요청합니다.
- `PandaPublisher`는 커스텀 `Publisher`로, `receive(subscriber:)` 메소드를 통해 `PandaSubscription`을 생성하고 `Subscriber`에 전달합니다.
- 이 예제에서는 `YoutubeSubscriber`의 배열을 사용하여 `PandaPublisher`를 생성하고, `sink(receiveValue:)` 를 통해 데이터를 수신합니다. 그 후, `cancel()` 메소드를 호출하여 `Subscription`을 취소합니다.
- 결과적으로, `PandaSubscription`이 생성되었고, 데이터가 수신된 후 `Subscription`이 취소되었음을 확인할 수 있습니다.

 

## **Operator들**

### **19\. Publisher의 map 연산자 사용**

```swift
let intPublisher = [1, 2, 3, 4, 5, 6, 7].publisher
intPublisher
    .map { element in
        return element * 2
    }
    .sink(receiveValue: { print($0, terminator: " ") })
// 결과: 2 4 6 8 10 12 14

```

#### **설명:**

- 이 코드는 `Publisher`의 `map` 연산자를 사용하여 입력된 배열의 각 요소를 두 배로 변환합니다.
- `[1, 2, 3, 4, 5, 6, 7].publisher`는 배열을 `Publisher`로 변환합니다.
- `map` 연산자는 배열의 각 요소를 2배로 증가시킵니다. 즉, `1`은 `2`, `2`는 `4`, `3`은 `6`으로 변환됩니다.
- `sink(receiveValue:)`는 최종 결과를 출력하며, 결과는 `2 4 6 8 10 12 14`입니다.

 

### **20\. KeyPath를 이용한 매핑**

```swift
struct Point {
    let x: Int
    let y: Int
    let z: Int
}

let pointPublisher = PassthroughSubject<Point, Never>()

pointPublisher
    // KeyPath를 이용한 매핑: x, y, z를 다음 sink 등에 보냄
    // 최대 3개
    .map(\.x, \.y, \.z)
    .sink { x, y, z in
        print("x: \(x), y: \(y), z: \(z)")
    }

pointPublisher.send(Point(x: 344, y: 483, z: 932))
// 결과: x: 344, y: 483, z: 932

```

#### **설명:**

- 이 코드는 `PassthroughSubject`를 사용하여 `Point` 구조체를 전달하는 `Publisher`를 생성합니다.
- `map` 연산자를 이용해 `KeyPath`를 사용하여 `x`, `y`, `z` 프로퍼티를 추출합니다.
- 각 프로퍼티는 `sink` 연산자에서 개별적으로 전달되어 출력됩니다.
- 결과적으로, `pointPublisher.send(Point(x: 344, y: 483, z: 932))` 호출 시 `x: 344, y: 483, z: 932`가 출력됩니다.

 

### **21\. TryMap**

```swift
func checkNil(_ element: Int?) throws -> Int {
    guard let element else {
        throw PinguError.elementIsNil
    }
    
    return element
}

let tryMapPublisher = [1, 2, nil, 4].publisher

let tryMapSink: ((Subscribers.Completion) -> Void) = {
    switch $0 {
    case .failure(let error):
        print("TryMapPublisher sink:", error)
    case .finished:
        print("TryMapPublisher sink: THE END")
    }
}
print("===========")

tryMapPublisher
    .tryMap {
        try checkNil($0)
    }
    .sink(receiveCompletion: tryMapSink) {
        print("TryMapPublisher receiveValue:", $0)
    }
/* 결과:
TryMapPublisher receiveValue: 1
TryMapPublisher receiveValue: 2
TryMapPublisher sink: elementIsNil
*/

```

#### **설명:**

- `checkNil` 함수는 옵셔널 `Int` 값을 받아, 값이 없으면 `PinguError.elementIsNil` 오류를 던집니다.
- `tryMapPublisher`는 옵셔널 `Int` 값이 포함된 배열로부터 `Publisher`를 생성합니다.
- `tryMap` 연산자를 사용하여 각 요소를 `checkNil` 함수로 처리합니다. 만약 함수가 오류를 던지면 `completion` 클로저가 호출됩니다.
- `sink` 연산자는 값을 수신할 때와 완료 시 동작을 정의합니다. 여기서는 오류 발생 시 오류를 출력하고, 완료 시 "THE END"를 출력합니다.
- 결과적으로 `nil` 값이 오류를 발생시키고, 나머지 값들은 정상적으로 출력됩니다.

 

### **22\. MapError**

```swift
enum PandaError: Error {
    case thisIsBlackBear
}

tryMapPublisher
    .tryMap {
        try checkNil($0)
    }
    .mapError {
        print("error detected:", $0)
        return PandaError.thisIsBlackBear
    }
    .sink(receiveCompletion: tryMapSink) {
        print("TryMapPublisher2 receiveValue:", $0)
    }
	
/* 결과:
TryMapPublisher2 receiveValue: 1
TryMapPublisher2 receiveValue: 2
error detected: elementIsNil
TryMapPublisher sink: thisIsBlackBear
*/

```

#### **설명:**

- `PandaError` 열거형은 사용자 정의 오류 타입으로, 하나의 오류 케이스 `thisIsBlackBear`를 정의합니다.
- `tryMapPublisher`는 이전 코드와 동일하게 옵셔널 값을 처리합니다.
- `mapError` 연산자는 오류가 발생했을 때, 기존 오류를 새로운 오류 타입으로 변환합니다. 여기서는 `PinguError` 대신 `PandaError.thisIsBlackBear`로 변환합니다.
- 결과적으로 `nil` 값이 오류를 발생시키고, 변환된 `PandaError.thisIsBlackBear`가 출력됩니다. 정상 값들은 계속해서 출력됩니다.

 

### **23\. Scan**

```swift
pandaPublisher
    .scan(0) { accumulatedResult, currentSubscriber in
        print("accumulatedResult: \(accumulatedResult), currentSubscriber: \(currentSubscriber)")
        return accumulatedResult + currentSubscriber.age
    }
    .sink(receiveValue: { print("AgeSum:", $0) })
	
/*
 결과:
 accumulatedResult: 0, currentSubscriber: YoutubeSubscriber(name: "FuBao", age: 3)
 AgeSum: 3
 accumulatedResult: 3, currentSubscriber: YoutubeSubscriber(name: "AiBao", age: 10)
 AgeSum: 13
 accumulatedResult: 13, currentSubscriber: YoutubeSubscriber(name: "LeBao", age: 11)
 AgeSum: 24
 */

```

**설명:**

- `scan` 연산자는 스트림의 각 이벤트를 처리하며, 이전 값과 현재 값을 이용해 누적 결과를 계산합니다.
- 위 코드에서는 `pandaPublisher`의 각 구독자의 나이(`currentSubscriber.age`)를 누적하여 총합을 계산합니다.
- `sink` 연산자를 통해 계산된 나이의 총합(`AgeSum`)을 출력합니다.

 

### **24\. TryScan**

```swift
tryMapPublisher
    .tryScan(0) { accResult, currValue in
        try accResult + checkNil(currValue)
    }
    .sink(receiveCompletion: {
      print("[TryScan]", $0)
    }, receiveValue: {
      print("[TryScan]", $0)
    })

/*
 결과:
 [TryScan] 1
 [TryScan] 3
 [TryScan] failure(__lldb_expr_61.PinguError.elementIsNil)
 */

```

**설명:**

- `tryScan` 연산자는 스트림의 각 이벤트를 처리하며, 이전 값과 현재 값을 이용해 누적 결과를 계산합니다. 이 과정에서 오류가 발생할 수 있습니다.
- 위 코드에서는 `tryMapPublisher`의 각 값(`currValue`)을 `checkNil` 함수를 통해 검사하고, 누적 결과(`accResult`)와 더하여 총합을 계산합니다. 이 과정에서 오류가 발생할 수 있으므로 `try`를 사용합니다.
- `sink` 연산자를 통해 스트림의 결과를 출력하며, `receiveCompletion` 클로저를 통해 스트림의 완료 상태를, `receiveValue` 클로저를 통해 누적 결과를 출력합니다.
- 결과는 아래와 같으며, `failure`는 오류 발생을 나타냅니다:
    - \[TryScan\] 1
    - \[TryScan\] 3
    - \[TryScan\] failure(\_\_lldb\_expr\_61.PinguError.elementIsNil)

<!-- \[the\_ad id="3020"\] -->

 

### **25\. SetFailureType**

```swift
let stfPublisher = [1, 2, 3, 4].publisher
let pinguErrorPublisher = PassthroughSubject<Int, PinguError>()

stfPublisher
    .setFailureType(to: PinguError.self)
    .combineLatest(pinguErrorPublisher)
    .sink(receiveCompletion: {
      print("[SetFailureType]", $0)
    }, receiveValue: {
      print("[SetFailureType]", $0)
    })

pinguErrorPublisher.send(0)
/*
 결과:
 [SetFailureType] (4, 0)
 */

```

#### **설명:**

- `setFailureType` 연산자는 Publisher의 실패 타입을 설정하는 데 사용됩니다. 이는 여러 Publisher를 조합할 때 Output과 Failure 타입이 일치해야 하는 경우 유용합니다.
- 위 코드에서는 `stfPublisher`의 실패 타입을 `PinguError`로 설정한 후, `combineLatest` 연산자를 사용하여 `pinguErrorPublisher`와 결합합니다.
- `sink` 연산자를 통해 스트림의 결과를 출력합니다. `pinguErrorPublisher.send(0)` 호출 후, 결과로 (4, 0) 쌍이 출력됩니다.
- 결과는 아래와 같습니다:
    - \[SetFailureType\] (4, 0)

 

### **26\. Filter, TryFilter**

```swift
[1, 2, 3, 4, 5, 6, 7].publisher
    .filter { $0 % 2 == 0 }
    .sink { _ in
        print()
    } receiveValue: {
        print($0, terminator: " ")
    }
// 결과: 2 4 6

```

```swift
[2, 2, 4, 4, 5, 6].publisher
    .tryFilter { element in
        if element % 2 == 0 {
            return true
        } else {
            throw PinguError.elementIsNil
        }
    }
    .sink { completion in
        switch completion {
        case .failure(let error):
            print("TryFilter failure:", error)
        case .finished:
            print("TryFilter completed: All is even")
        }
    } receiveValue: { value in
        print("TryFilter receivedValue:", value)
    }

/*
 결과:
 TryFilter receivedValue: 2
 TryFilter receivedValue: 2
 TryFilter receivedValue: 4
 TryFilter receivedValue: 4
 TryFilter failure: elementIsNil
 */

```

**설명:**

- `filter` 연산자는 Publisher의 출력 값을 필터링하여 조건에 맞는 값만 통과시킵니다. 위 코드에서는 짝수만 출력되도록 설정되어 있으며, 결과로 2, 4, 6이 출력됩니다.
- `tryFilter` 연산자는 필터링 과정에서 오류를 처리할 수 있는 연산자입니다. 위 코드에서는 홀수를 만나면 `PinguError.elementIsNil` 오류를 발생시키고, 짝수는 통과시킵니다.
- 결과는 아래와 같으며, 필터링 과정에서 오류가 발생하여 스트림이 실패하게 됩니다:
    - TryFilter receivedValue: 2
    - TryFilter receivedValue: 2
    - TryFilter receivedValue: 4
    - TryFilter receivedValue: 4
    - TryFilter failure: elementIsNil

 

### **27\. CompactMap, TryCompactMap**

```swift
["100", "235456", "a.b", "4443", "eefef", "45678.5"].publisher
    .compactMap { Int($0) }
    .sink(receiveCompletion: { _ in print() }, receiveValue: { print($0, terminator: " ") })
// 결과: 100 235456 4443

```

```swift
["100", "235456", "a.b", "4443", "babo", "45678.5"].publisher
    .tryCompactMap {
        if $0 == "babo" {
            throw PinguError.pinguIsBaboo
        }
        
        return Int($0)
    }
    .sink(receiveCompletion: { completion in
        switch completion {
        case .finished:
            print("OK")
        case .failure(let error):
            print("TryCompactMap:", error)
        }
    }, receiveValue: { print($0, terminator: " ") })
// 결과: 100 235456 4443 TryCompactMap: pinguIsBaboo

```

**설명:**

- `compactMap` 연산자는 Publisher의 값을 변환하고, 변환할 수 없는 값은 걸러냅니다. 위 코드에서는 문자열을 정수로 변환하고, 변환할 수 없는 값은 제외됩니다. 결과로 100, 235456, 4443이 출력됩니다.
- `tryCompactMap` 연산자는 변환 과정에서 오류를 처리할 수 있습니다. 위 코드에서는 "babo"라는 값이 있을 경우 `PinguError.pinguIsBaboo` 오류를 발생시키고, 나머지 값들은 정수로 변환합니다.
- 결과는 아래와 같으며, 오류가 발생할 경우 오류 메시지가 출력됩니다:
    - 100
    - 235456
    - 4443
    - TryCompactMap: pinguIsBaboo

 

### **28\. RemoveDuplicates, TryRemoveDuplicates**

```swift
struct Name {
    let lastName: String
    let firstName: String

    func printName() {
        print(lastName + firstName)
    }
}

[
    Name(lastName: "Pin", firstName: "gu"),
    Name(lastName: "Pin", firstName: "ga"),
    Name(lastName: "Ro", firstName: "By"),
    Name(lastName: "Ro", firstName: "From"),
    Name(lastName: "Ro", firstName: "Yume"),
    Name(lastName: "O", firstName: "dung")
]
    .publisher
    .removeDuplicates { prev, curr in
        // true이면 중복이라고 판단
        prev.lastName == curr.lastName
    }
    .sink { $0.printName() }

/*
 결과:
 Pingu
 RoBy
 Odung
 */

```

```swift
[1, 2, 2, 3, 3]
    .publisher
    .tryRemoveDuplicates { prev, curr in
        if prev == curr {
            throw PinguError.pinguIsBaboo
        }
        
        return false
    }
    .sink { completion in
        switch completion {
        case .failure(let error):
            print("[TryRemoveDuplicates]", error)
        case .finished:
            print("중복값 없음")
        }
    } receiveValue: { value in
        print(value, terminator: " ")
    }
// 결과: 1 2 [TryRemoveDuplicates] pinguIsBaboo

```

**설명:**

- `removeDuplicates` 연산자는 스트림에서 중복된 값을 제거합니다. 위 코드에서는 이전 값과 현재 값을 비교하여 `lastName`이 동일한 경우 중복으로 간주하고 제거합니다.
- 결과적으로 중복된 `lastName`을 가진 이름은 첫 번째 항목만 남게 되어, "Pingu", "RoBy", "Odung"이 출력됩니다.
- `tryRemoveDuplicates` 연산자는 중복 값을 발견할 때 오류를 발생시킬 수 있는 연산자입니다. 위 코드에서는 중복된 값이 있을 경우 `PinguError.pinguIsBaboo` 오류를 발생시키고, 중복되지 않은 값은 통과합니다.

 

### **29\. ReplaceEmpty**

```swift
Empty<[String], Never>()
    .replaceEmpty(with: ["EE", "EE"])
    .sink { print("[ReplaceEmpty]", $0) }

[Int]().publisher
    .replaceEmpty(with: 5)
    .sink { print("[ReplaceEmpty]", $0) }

/*
 결과:
 [ReplaceEmpty] ["EE", "EE"]
 [ReplaceEmpty] 5
 */

```

**설명:**

- `replaceEmpty` 연산자는 Publisher가 빈 값을 방출할 때, 대신 제공된 값을 방출하도록 합니다.
- 첫 번째 예제에서는 빈 `Empty` Publisher가 `replaceEmpty` 연산자를 통해 \["EE", "EE"\]로 대체되어 출력됩니다.
- 두 번째 예제에서는 빈 배열을 가진 Publisher가 `replaceEmpty` 연산자를 통해 5로 대체되어 출력됩니다.
- 결과는 아래와 같습니다:
    - \[ReplaceEmpty\] \["EE", "EE"\]
    - \[ReplaceEmpty\] 5

 

### **30\. ReplaceError**

```swift
["1", "2", "a.b", "3"].publisher
    .tryCompactMap {
        if Int($0) != nil {
            return $0
        }
        
        throw PandaError.thisIsBlackBear
    }
    .replaceError(with: "FuBao")
    .sink { completion in
        switch completion {
        case .failure(let error):
            print(error.localizedDescription)
        case .finished:
            print("[ReplaceError] 로 인해 에러가 없어졌다.")
        }
    } receiveValue: { value in
        print("[ReplaceError]", value)
    }

/*
 결과:
 [ReplaceError] 1
 [ReplaceError] 2
 [ReplaceError] FuBao
 [ReplaceError] 로 인해 에러가 없어졌다.
 
 참고:
 replaceError는 하나의 Element를 보내고 스트림을 종료해서 에러를 처리하려는 경우에 유용하다고 하네요. catch라는 Operator를 사용해서 에러를 처리해주는 게 좋다고 합니다.
 */

```

**설명:**

- `replaceError` 연산자는 스트림에서 오류가 발생했을 때 지정된 값을 대신 방출합니다. 위 코드에서는 `tryCompactMap` 연산자에서 발생하는 오류를 `"FuBao"`로 대체하여 출력합니다.
- 첫 번째 예제에서는 오류가 발생하기 전에 `Int($0)`가 성공적으로 변환된 값들("1", "2", "3")이 출력되며, 오류는 "FuBao"로 대체됩니다.
- `replaceError`는 스트림을 종료시키며, 스트림의 에러를 처리할 때 유용합니다. `catch` 연산자를 사용하는 것이 보다 일반적인 에러 처리 방법입니다.
- 결과는 아래와 같습니다:
    - \[ReplaceError\] 1
    - \[ReplaceError\] 2
    - \[ReplaceError\] FuBao
    - \[ReplaceError\] 로 인해 에러가 없어졌다.

 

### **31\. Catch**

```swift
["1", "2", "a.b", "3"].publisher
    .tryCompactMap {
        if Int($0) != nil {
            return $0
        }
        
        throw PandaError.thisIsBlackBear
    }
    .catch { _ in
        Just("Monika")
    }
    .sink { completion in
        switch completion {
        case .failure(let error):
            print(error.localizedDescription)
        case .finished:
            print("[Catch] 로 인해 에러가 없어졌다.")
        }
    } receiveValue: { value in
        print("[Catch]", value)
    }
/*
 결과:
 [Catch] 1
 [Catch] 2
 [Catch] Monika
 [Catch] 로 인해 에러가 없어졌다.
 */

```

**설명:**

- `catch` 연산자는 Publisher에서 오류가 발생했을 때, 해당 오류를 처리하고 대체 Publisher를 방출합니다. 위 코드에서는 `tryCompactMap` 연산자에서 발생하는 오류를 `Just("Monika")`로 대체합니다.
- 코드에서는 문자열을 정수로 변환하고, 변환할 수 없는 경우 `PandaError.thisIsBlackBear` 오류를 발생시킵니다. 이후 `catch` 연산자가 호출되어 오류를 처리하고, 대신 `"Monika"`를 방출합니다.
- 결과는 아래와 같으며, 오류 발생 후 대체 값이 방출되고 스트림이 정상적으로 종료됩니다:
    - \[Catch\] 1
    - \[Catch\] 2
    - \[Catch\] Monika
    - \[Catch\] 로 인해 에러가 없어졌다.

 



### Reducing Elements로 분류된 Publisher

- Collect
- CollectByCount
- CollectByTime
- IgnoreOutput
- Reduce
- TryReduce

 

#### **이를 활용한 Operator**

- collect()
- collect(\_:)
- collect(\_:options:)
- TimeGroupingStrategy
- ignoreOutput()
- reduce(\_:\_:)
- tryReduce(\_:\_:)

 

### **32\. Collect**

```swift
[1, 2, 3, 4, 5].publisher
    .collect()
    .sink { print("[Collect]", $0) }

```

**설명:**

- `collect` 연산자는 Upstream에서 받은 모든 값을 모아 하나의 배열로 만들어 Downstream으로 전달합니다. 위 코드에서는 숫자 `1, 2, 3, 4, 5`가 배열로 수집되어 한 번에 방출됩니다.
- 결과는 다음과 같습니다:
    - \[Collect\] \[1, 2, 3, 4, 5\]

 

### **33\. CollectByCount**

```swift
[1, 2, 3, 4, 5, 6, 7].publisher
    .collect(3)
    .sink { print("[CollectByCount]", $0) }
/*
 결과:
 [CollectByCount] [1, 2, 3]
 [CollectByCount] [4, 5, 6]
 [CollectByCount] [7]
 */

```

**설명:**

- `collect(_ count: Int)` 연산자는 Upstream에서 받은 값을 지정된 개수만큼 모아서 하나의 배열로 만들어 Downstream으로 전달합니다. 위 코드에서는 3개의 값씩 수집하여 방출합니다.
- 결과는 아래와 같습니다:
    - \[CollectByCount\] \[1, 2, 3\]
    - \[CollectByCount\] \[4, 5, 6\]
    - \[CollectByCount\] \[7\]

 

### **34\. CollectByTime**

```swift
var cbtSubscription = Set()
let timerPublisher = Timer.publish(every: 1, on: .main, in: .default)
timerPublisher
    .autoconnect()
    .collect(.byTime(DispatchQueue.main, .seconds(4)))
    .sink { print("[CollectByTime]", $0) }
    .store(in: &cbtSubscription)
/*
 결과 출력: 출판을 1초마다 하고 콜렉트를 4초로 설정하면 1초 단위로 4개씩 모이고 방출
 [CollectByTime] [2023-08-18 05:58:05 +0000, 2023-08-18 05:58:06 +0000, 2023-08-18 05:58:07 +0000, 2023-08-18 05:58:08 +0000]
 [CollectByTime] [2023-08-18 05:58:09 +0000, 2023-08-18 05:58:10 +0000, 2023-08-18 05:58:11 +0000, 2023-08-18 05:58:12 +0000]
 [CollectByTime] [2023-08-18 05:58:13 +0000, 2023-08-18 05:58:14 +0000, 2023-08-18 05:58:15 +0000, 2023-08-18 05:58:16 +0000]
 [CollectByTime] [2023-08-18 05:58:17 +0000, 2023-08-18 05:58:18 +0000, 2023-08-18 05:58:19 +0000, 2023-08-18 05:58:20 +0000]
 ...
 */

```

**설명:**

- `collect(.byTime(_:_:))` 연산자는 지정된 시간 간격 동안 Publisher가 방출하는 모든 요소를 수집하여, 지정된 간격이 끝나면 그 그룹을 방출합니다. 위 코드에서는 `Timer`가 1초마다 값을 방출하며, 4초마다 값을 그룹화하여 방출합니다.
- 결과는 다음과 같으며, 4초마다 Timer가 방출한 값들이 배열로 수집되어 방출됩니다:
    - \[CollectByTime\] \[2023-08-18 05:58:**05** +0000, 2023-08-18 05:58:**06** +0000, 2023-08-18 05:58:**07** +0000, 2023-08-18 05:58:**08** +0000\]
    - \[CollectByTime\] \[2023-08-18 05:58:09 +0000, 2023-08-18 05:58:10 +0000, 2023-08-18 05:58:11 +0000, 2023-08-18 05:58:12 +0000\]
    - ...

 

### **35\. IgnoreOutput**

```swift
[1, 2, 3, 4, 5].publisher
    .ignoreOutput()
    .sink(receiveCompletion: { print("[IgnoreOutput]", $0) },
          receiveValue: { print($0) })

[1, 2, 3, 4, 5].publisher
    .reduce(0, { $0 + $1 })
    .sink { print("[Reduce1]", $0) }
/*
 결과:
 [Reduce1] 15
 */

```

**설명:**

- `ignoreOutput` 연산자는 Upstream에서 방출된 모든 값을 무시하고, 오직 완료 이벤트만 Downstream으로 전달합니다. 따라서, `sink`의 `receiveValue` 클로저는 호출되지 않으며, `receiveCompletion`만 실행됩니다.
- `reduce` 연산자는 초기값을 시작으로 Upstream에서 방출되는 모든 값을 누적하여 최종 값을 한번에 방출합니다. 위의 코드에서는 모든 값을 더한 `15`가 결과로 방출됩니다.

**\[참고\]**

- **Scan과 Reduce 비교:**
    
    - - `scan`은 누적 결과를 매번 방출하는 반면, `reduce`는 모든 누적이 완료된 후에 최종 결과를 한번에 방출합니다.
        - 예시 코드:
    
    ```swift
    pandaPublisher
        .scan(0) { accumulatedResult, currentSubscriber in
            print("accumulatedResult: \(accumulatedResult), currentSubscriber: \(currentSubscriber)")
            return accumulatedResult + currentSubscriber.age
        }
        .sink(receiveValue: { print("AgeSum:", $0) })
    /*
     결과:
     accumulatedResult: 0, currentSubscriber: YoutubeSubscriber(name: "FuBao", age: 3)
     AgeSum: 3
     accumulatedResult: 3, currentSubscriber: YoutubeSubscriber(name: "AiBao", age: 10)
     AgeSum: 13
     accumulatedResult: 13, currentSubscriber: YoutubeSubscriber(name: "LeBao", age: 11)
     AgeSum: 24
     */
    
    ```
    

 

### **36\. TryReduce**

```swift
[1, 2, 3, -10, 4].publisher
    .tryReduce(0) { reduceValue, newValue in
        if reduceValue + newValue < 0 {
            throw PinguError.pinguIsBaboo
        }
        return reduceValue + newValue
    }
    .sink(receiveCompletion: { print("[TryReduce Comp]", $0) },
          receiveValue: { print("[TryReduce Val]", $0) })
/*
 결과:
 [TryReduce Comp] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
 */

```

**설명:**

- `tryReduce` 연산자는 `reduce`와 유사하게 작동하지만, 클로저 내부에서 오류를 발생시킬 수 있습니다. 특정 조건을 만족하지 못할 경우 오류를 발생시키고 스트림을 종료시킵니다.
- 위의 예제에서는, 누적 값이 음수가 되면 `PinguError.pinguIsBaboo` 오류를 발생시킵니다. 오류가 발생한 경우, `receiveCompletion` 클로저에서 `failure`와 함께 오류 정보가 출력됩니다.

<!-- \[the\_ad id="3020"\] -->


### **분류: 요소에 수학적 연산 적용하기**

- `Count`
- `Comparison`
- `TryComparison`

#### **연산자**

- `count()`
- `max()`
- `max(by:)`
- `tryMax(by:)`
- `min()`
- `min(by:)`
- `tryMin(by:)`

### **37\. Count**

```swift
[Int](repeating: 0, count: 123).publisher
    .count()
    .sink { print("[Count]", $0) }
/*
 결과:
 [Count] 123
 */

```

**설명:**

- `count` 연산자는 Upstream에서 방출된 총 항목 수를 계산하고, 그 결과를 Downstream으로 한 번 방출합니다.
- 위의 예제에서는 `[Int](repeating: 0, count: 123)` 배열을 퍼블리셔로 변환한 후, `count` 연산자를 사용하여 123개의 항목을 계산하고 `sink`에서 결과 `123`을 출력합니다.

 

### **38\. Max**

```swift
[5, 4, 107, 2, 1].publisher
    .max()
    .sink { print("[Max]", $0) }

protocol Ikimono {}

struct Person: Ikimono {
    let name: String
    let age: Int
}
struct Panda: Ikimono {
    let name: String
    let age: Int
}

[
    Person(name: "FuBao", age: 3),
    Person(name: "AiBao", age: 10),
    Person(name: "LeBao", age: 11),
].publisher
    .max { $0.age < $1.age }
    .sink { print("[Max]", $0) }

([
    Panda(name: "FuBao", age: 3),
    Person(name: "AiBao", age: 10),
    Person(name: "LeBao", age: 11),
] as [Ikimono]).publisher
    .tryMax { first, second in
        if first is Panda {
            return true
        } else {
            throw PandaError.thisIsBlackBear
        }
    }
    .sink(receiveCompletion: { print("[TryMax]", $0) },
              receiveValue: { print("[TryMax]", $0) })
/*
 결과:
 [Max] 107
 [Max] Person(name: "LeBao", age: 11)
 [TryMax] failure(__lldb_expr_69.PandaError.thisIsBlackBear)
 */

```

**설명:**

- `max` 연산자는 Upstream에서 방출된 값 중 가장 큰 값을 Downstream으로 방출합니다. 기본적으로 값들이 Comparable을 준수해야 합니다.
- 첫 번째 예제에서는 정수 배열의 최대값 `107`을 출력합니다.
- 두 번째 예제에서는 `Person` 객체 배열에서 `age` 속성이 가장 큰 `Person(name: "LeBao", age: 11)` 객체를 출력합니다.
- 세 번째 예제에서는 `Ikimono` 프로토콜을 준수하는 객체 배열에서 `tryMax`를 사용하여 `Panda` 객체를 기준으로 최대값을 찾으려고 합니다. 그러나 `Person` 객체가 포함되어 있어 `PandaError.thisIsBlackBear` 오류가 발생합니다.

 

### **39\. Min**

```swift
[5, 4, 107, 2, 1].publisher
    .min()
    .sink { print("[Min]", $0) }

[
    Person(name: "FuBao", age: 3),
    Person(name: "AiBao", age: 10),
    Person(name: "LeBao", age: 11),
].publisher
    // 오름차순이라 가정할 때 true가 나와야 min을 찾을 수 있다.
    .min { $0.age < $1.age }
    .sink { print("[Min]", $0) }

([
    Panda(name: "FuBao", age: 3),
    Person(name: "AiBao", age: 10),
    Person(name: "LeBao", age: 11),
] as [Ikimono]).publisher
    .tryMax { first, second in
        if first is Panda {
            return true
        } else {
            throw PandaError.thisIsBlackBear
        }
    }
    .sink(receiveCompletion: { print("[TryMin]", $0) },
              receiveValue: { print("[TryMin]", $0) })
/*
 결과:
 [Min] 1
 [Min] Person(name: "FuBao", age: 3)
 [TryMin] failure(__lldb_expr_69.PandaError.thisIsBlackBear)
 */

```

**설명:**

- `min` 연산자는 Upstream에서 방출된 값 중 가장 작은 값을 Downstream으로 방출합니다. 기본적으로 값들이 Comparable을 준수해야 합니다.
- 첫 번째 예제에서는 정수 배열의 최소값 `1`을 출력합니다.
- 두 번째 예제에서는 `Person` 객체 배열에서 `age` 속성이 가장 작은 `Person(name: "FuBao", age: 3)` 객체를 출력합니다.
- 세 번째 예제에서 `tryMax`를 사용하여 최대값을 찾는 예제가 잘못 포함되어 있습니다. `tryMin`으로 변경되어야 하며, 주석과 설명에 맞게 수정이 필요합니다. 현재는 `PandaError.thisIsBlackBear` 오류가 발생합니다.

 

### **분류: 요소에 일치 기준(Matching Criteria) 적용하기**

- `Contains`
- `ContainsWhere`
- `TryContainsWhere`
- `AllSatisfy`
- `TryAllSatisfy`

 

#### **연산자**

- `contains(_:)`
- `contains(where:)`
- `tryContains(where:)`
- `allSatisfy(_:)`
- `tryAllSatisfy(_:)`

 

### **40\. Contains**

```swift
[192, 199, 196, 100, 104].publisher
    .contains(196)
    .sink { print("[Contains]", $0) } // [Contains] true

[192, 199, 196, 100, 104].publisher
    .contains(-348)
    .sink { print("[Contains]", $0) } // [Contains] false

```

- `contains` 연산자는 Upstream에서 특정 값이 존재하는지 여부를 확인합니다.
- 첫 번째 예제는 배열에 `196`이 포함되어 있는지 확인하며, 두 번째 예제는 `-348`이 포함되어 있는지 확인합니다.

 

### **41\. Contains Where**

```swift
["murmur", "twins", "another"].publisher
    .contains(where: { $0.count == 5 })
    .sink { print("[Contains]", $0) } // [Contains] true (-> twins를 읽음)

```

- `contains(where:)` 연산자는 Upstream에서 주어진 조건을 만족하는 값이 존재하는지 확인합니다.
- 예제에서는 문자열의 길이가 5인 값이 배열에 포함되어 있는지 확인합니다.

 

### **42\. TryContains**

```swift
// TryContainsWhere: 값 탐색 중 true가 나오면 이후 과정은 무시, 값 탐생 중 true가 나오지 않은 상태에서 에러 발생시 throw
[2, 4, 8, 12, -105, 3, 6, 8].publisher
    .tryContains {
        if $0 >= 0 && $0 % 2 == 0 {
            return true
        } else {
            throw PinguError.pinguIsBaboo
        }
    }
    .sink {
        print("[TryContains Comp 1]", $0)
    } receiveValue: {
        print("[TryContains Val 1]", $0)
    }
	
/*
결과:
[TryContains Val 1] true
[TryContains Comp 1] finished
*/

[2, 4, 8, 12, -105, 3, 6, 8].publisher
    .tryContains {
        if $0 >= 0 && $0 % 2 == 1 {
            return true
        } else {
            throw PinguError.pinguIsBaboo
        }
    }
    .sink {
        print("[TryContains Comp 2]", $0)
    } receiveValue: {
        print("[TryContains Val 2]", $0)
    }
	
/*
결과:
[TryContains Comp 2] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
*/

```

- `tryContains` 연산자는 Upstream에서 주어진 조건을 만족하는 값이 있는지 확인하며, 값 탐색 중 조건에 맞지 않는 경우 에러를 발생시킬 수 있습니다.
- 첫 번째 예제는 0 이상의 짝수인 값을 탐색하며, 두 번째 예제는 0 이상의 홀수인 값을 탐색합니다.

 

### **43\. AllSatisfy**

```swift
[2, 4, 6, 8, 10].publisher
    .allSatisfy { $0 % 2 == 0 }
    .sink { print("[AllSatisfy]", $0) } // [AllSatisfy] true

[2, 4, 6, 8, 9, 10].publisher
    .allSatisfy { $0 % 2 == 0 }
    .sink { print("[AllSatisfy]", $0) } // [AllSatisfy] false

[2, 4, 6, 8, 9, -9, 10].publisher
    .tryAllSatisfy {
        if $0 % 2 == 0 {
            return true
        } else if $0 >= 0 {
            return false
        } else {
            throw PinguError.pinguIsBaboo
        }
    }
    .sink {
        print("[TryAllSatisfy 1 Comp]", $0)
    } receiveValue: {
        print("[TryAllSatisfy 1 Val]", $0)
    }

/*
결과: 
[TryAllSatisfy 1 Val] false
[TryAllSatisfy 1 Comp] finished
*/

[2, 4, 6, 8, 222, -9, 10].publisher
    .tryAllSatisfy {
        if $0 % 2 == 0 {
            return true
        } else if $0 >= 0 {
            return false
        } else {
            throw PinguError.pinguIsBaboo
        }
    }
    .sink {
        print("[TryAllSatisfy 2 Comp]", $0)
    } receiveValue: {
        print("[TryAllSatisfy 2 Val]", $0)
    }

/*
결과:
[TryAllSatisfy 2 Comp] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
*/

```

- `allSatisfy` 연산자는 Upstream의 모든 값이 주어진 조건을 만족하는지 확인합니다.
- 첫 번째 예제는 모든 값이 짝수인지 확인하고, 두 번째 예제는 값 중 하나라도 홀수인지 확인합니다.
- `tryAllSatisfy` 연산자는 조건을 만족하지 않는 경우 에러를 발생시키며, 조건 검사 중 에러가 발생할 경우 처리할 수 있습니다.
- 세 번째 예제는 0 이상의 짝수만 있는지를 확인하며, 네 번째 예제는 0 이상의 홀수라도 있는지를 확인합니다.

 

### **분류: 요소에 시퀀스 연산 적용하기**

- `DropUntilOutput`
- `Drop`
- `DropWhile`
- `TryDropWhile`
- `Concatenate`
- `PrefixWhile`
- `TryPrefixWhile`
- `PrefixUntilOutput`

 

#### **연산자**

- `drop(untilOutputFrom:)`
- `dropFirst(_:)`
- `drop(while:)`
- `append(_:)`
- `prepend(_:)`
- `prefix(_:)`
- `prefix(while:)`
- `tryPrefix(while:)`
- `prefix(untilOutputFrom:)`

 

### **44\. Drop Until Output**

```swift
// Upstream
let synthPublisher = PassthroughSubject<Int, Never>()
// Downstream
let bassPublisher = PassthroughSubject<String, Never>()

synthPublisher
    .drop(untilOutputFrom: bassPublisher)
    .sink { "DropUntilOutput".printWithResult($0) }

bassPublisher
    .sink { "DropUntilOutput".printWithResult($0) }

for i in 1...8 {
    if i == 5 {
        bassPublisher.send("VERY BIG BASS DROP!!!")
        continue
    }
    
    synthPublisher.send(i)
}

/*
 [DropUntilOutput] VERY BIG BASS DROP!!!
 [DropUntilOutput] 6
 [DropUntilOutput] 7
 [DropUntilOutput] 8
*/

```

- `drop(untilOutputFrom:)` 연산자는 지정된 Publisher로부터 값이 방출될 때까지 Upstream의 값을 무시합니다.
- 예제에서는 `synthPublisher`의 값이 `bassPublisher`에서 첫 값을 받기 전까지 무시됩니다.

 

### **45\. Drop First**

```swift
["A", "B", "C", "D", "E"].publisher
    .dropFirst(3)
    .sink { "DropFirst".printWithResult($0) }

/*
 [DropFirst] D
 [DropFirst] E
*/

```

- `dropFirst(_:)` 연산자는 지정한 개수만큼의 값을 제외하고 나머지 값을 방출합니다.
- 예제에서는 배열의 처음 3개의 값을 제외한 후 나머지 값들을 방출합니다.

 

### **46\. Drop While**

```swift
["3", "4", "Crunchy", "Nuts", "5"].publisher
    .drop { Int($0) != nil }
    .sink { "DropWhile".printWithResult($0) }

/*
 [DropWhile] Crunchy
 [DropWhile] Nuts
 [DropWhile] 5
*/

```

- `drop(while:)` 연산자는 지정된 조건이 **true**인 동안 Upstream의 값을 무시합니다.
- 예제에서는 값이 정수일 때까지 무시하며, 이후의 값을 방출합니다.

 

### **47\. Try Drop While**

```swift
["3", "4", "G", "Crunchy", "Nuts", "5"].publisher
    .tryDrop {
        if $0 == "G" {
            throw PinguError.pinguIsBaboo
        } else {
            return Int($0) != nil
        }
    }
    .sink { "TryDropWhile Comp".printWithResult($0) } receiveValue: { "TryDropWhile Val".printWithResult($0) }

/*
 [TryDropWhile Comp] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
 [TryDropWhile Val] false
*/

```

- `tryDrop(_:)` 연산자는 지정된 조건이 **true**인 동안 값을 무시하며, 조건 검토 중 에러가 발생할 수 있습니다.
- 예제에서는 값이 "G"일 때 에러를 발생시키며, 그 외에는 정수인지 여부에 따라 값을 무시합니다.

 

### **48\. Append**

```swift
[1, 2, 3, 4].publisher
    .append(5, 6)
    .append([7, 8, 9])
    .sink { _ in
        print()
    } receiveValue: {
        print($0, terminator: " ")
    }

/*
 1 2 3 4 5 6 7 8 9
*/

```

- `append(_:)` 연산자는 Upstream의 값 뒤에 지정된 값을 추가합니다.
- 예제에서는 배열의 끝에 `5, 6`과 `[7, 8, 9]`를 추가합니다.

<!-- \[the\_ad id="3020"\] -->

### **49\. Prepend**

```swift
[1, 2, 3, 4].publisher
    .prepend(5, 6)
    .prepend([7, 8, 9])
    .sink { _ in
        print()
    } receiveValue: {
        print($0, terminator: " ")
    }

/*
 7 8 9 5 6 1 2 3 4
*/

```

- `prepend(_:)` 연산자는 Upstream의 값 앞에 지정된 값을 추가합니다.
- 예제에서는 배열의 앞에 `[7, 8, 9]`와 `5, 6`을 추가합니다.

 

### **50\. Prefix**

```swift
[1, 2, 3, 4, 3, 2, 1].publisher
    .prefix(3)
    .sink { "Prefix".printWithResult($0) }

/*
 [Prefix] 1
 [Prefix] 2
 [Prefix] 3
*/

```

- `prefix(_:)` 연산자는 지정한 개수만큼의 값만 방출합니다.
- 예제에서는 배열의 처음 3개의 값만 방출합니다.

 

### **51\. Prefix While**

```swift
"FLYANDFLY".split(separator: "").publisher
    .prefix { $0 != "A" }
    .sink { "Prefix".printWithResult($0) }

/*
 [Prefix] F
 [Prefix] L
 [Prefix] Y
*/

```

- `prefix(while:)` 연산자는 지정된 조건이 **false**가 될 때까지 값을 방출합니다.
- 예제에서는 "A"가 나타날 때까지 문자를 방출합니다.

 

### **52\. Try Prefix While**

```swift
"FLY_ANDFLY".split(separator: "").publisher
    .tryPrefix {
        if $0.rangeOfCharacter(from: .alphanumerics) != nil {
            throw PinguError.pinguIsBaboo
        }
        
        return $0 != "A"
    }
    .sink { "TryPrefix Comp".printWithResult($0) } receiveValue: { "TryPrefix Val".printWithResult($0)  }

/*
 [TryPrefix Comp] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
 [TryPrefix Val] false
*/

```

- `tryPrefix(_:)` 연산자는 조건이 **false**가 될 때까지 값을 방출하며, 조건 검사 중 에러가 발생할 수 있습니다.
- 예제에서는 "A"가 나타나기 전까지 문자를 방출하고, 중간에 에러가 발생할 수 있습니다.

 

### **53\. Prefix Until Output From**

```swift
// Upstream Publisher
let flowWaterPublisher = PassthroughSubject<Int, Never>()
// Blocking Publisher
let twistBlockingPublisher = PassthroughSubject<String, Never>()

flowWaterPublisher
    .prefix(untilOutputFrom: twistBlockingPublisher)
    .sink {
        print()
        "PrefixUntilOutputFrom Comp".printWithResult($0)
    } receiveValue: { print($0, terminator: " ")  }

for i in 1...15 {
    if i == 7 {
        twistBlockingPublisher.send("응안돼 돌아가")
        continue
    }
    
    flowWaterPublisher.send(i)
}

/*
 1 2 3 4 5 6
 [PrefixUntilOutputFrom Comp] finished
*/

```

- `prefix(untilOutputFrom:)` 연산자는 지정된 Publisher에서 값이 방출될 때까지 Upstream의 값을 방출합니다.
- 예제에서는 `twistBlockingPublisher`에서 값이 방출될 때까지 `flowWaterPublisher`의 값을 방출합니다.

 

### **분류: 특정 요소 선택하기**

- `First`
- `FirstWhere`
- `TryFirstWhere`
- `Last`
- `LastWhere`
- `TryLastWhere`
- `Output`

#### **연산자**

- `first()`
- `first(where:)`
- `tryFirst(where:)`
- `last()`
- `last(where:)`
- `tryLast(where:)`
- `output(at:)`
- `output(in:)`

 

### **54\. First**

```swift
"FIRST".split(separator: "").publisher
    .first()
    .sink { "First".printWithResult($0) } // F

```

- `first()` 연산자는 Upstream에서 방출된 첫 번째 값을 반환합니다.
- 예제에서는 문자열에서 첫 번째 문자인 "F"를 반환합니다.

 

### **55\. First Where**

```swift
[1, 3, 5, 2, 4, 5, 7, 8].publisher
    .first { $0 % 2 == 0 }
    .sink { "First".printWithResult($0) } // 2

```

- `first(where:)` 연산자는 주어진 조건을 만족하는 첫 번째 값을 반환합니다.
- 예제에서는 배열에서 첫 번째 짝수인 2를 반환합니다.

 

### **56\. Try First Where**

```swift
"FIRST".split(separator: "").publisher
    .tryFirst {
        if $0 == "S" {
            throw PinguError.pinguIsBaboo
        }
        
        return $0 == "T"
    }
    .sink { "TryFirstWhere Comp".printWithResult($0) } receiveValue: { "TryFirstWhere Val".printWithResult($0) }
// 결과: [TryFirstWhere Comp] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
```

- `tryFirst(where:)` 연산자는 주어진 조건을 만족하는 첫 번째 값을 반환하며, 조건 검사 중 에러가 발생할 수 있습니다.
- 예제에서는 "S"일 때 에러를 발생시키고, 그 외에는 "T"를 찾습니다.

 

### **57\. Last**

```swift
let lastArrayPublisher = "LAST".split(separator: "").publisher
lastArrayPublisher
    .last()
    .sink { "Last".printWithResult($0) } // T

[1, 3, 5, 2, 4, 5, 7, 8].publisher
    .last { $0 % 2 == 1}
    .sink { "Last".printWithResult($0) } // 7

lastArrayPublisher
    .tryLast {
        if $0 == "T" // L을 입력하더라도 마찬가지로 에러 발생. 첫 요소부터 횡단??
        {
            throw PinguError.pinguIsBaboo
        }
        
        return $0 == "S"
    }
    .sink { "TryLastWhere Comp".printWithResult($0) } receiveValue: { "TryLastWhere Val".printWithResult($0) }
// 결과: [TryLastWhere Comp] failure(__lldb_expr_69.PinguError.pinguIsBaboo)
```

- `last()` 연산자는 Upstream에서 방출된 마지막 값을 반환합니다.
- 예제에서는 문자열의 마지막 문자인 "T"와 배열의 마지막 홀수인 7을 반환합니다.
- `tryLast(where:)` 연산자는 주어진 조건을 만족하는 마지막 값을 반환하며, 조건 검사 중 에러가 발생할 수 있습니다.
- 예제에서는 "T"일 때 에러를 발생시키고, 그 외에는 "S"를 찾습니다.

 

### **58\. Output**

```swift
[0, 2, 163, 4, 8].publisher
    .output(at: 2) // 인덱스
    .sink { "Last at".printWithResult($0) } // 163

[0, 2, 163, 4, 8, 66, 71727485, 49, 3, 5, 3468].publisher
    .print()
    .output(in: 2...6) // Zero-based
    .sink {
        "Last in".printWithResult($0)
    } receiveValue: {
        print($0)
    }
/*
 receive subscription: ([0, 2, 163, 4, 8, 66, 71727485, 49, 3, 5, 3468])
 request unlimited
 receive value: (0)
 request max: (1) (synchronous)
 receive value: (2)
 request max: (1) (synchronous)
 receive value: (163)
 163
 receive value: (4)
 4
 receive value: (8)
 8
 receive value: (66)
 66
 receive value: (71727485)
 71727485
 receive cancel
 [Last in] finished
*/

```

- `output(at:)` 연산자는 지정된 인덱스에서 값을 방출합니다.
- `output(in:)` 연산자는 지정된 범위의 인덱스에서 값을 방출합니다.
- 예제에서는 인덱스 2에서의 값과 범위 2부터 6까지의 값을 방출합니다.



### **분류: 여러 퍼블리셔로부터 요소 결합하기**

- `CombineLatest`: 여러 퍼블리셔로부터 마지막 요소를 모으고 재퍼블리싱
- `Merge`: 여러 퍼블리셔를 재조립된 스트림으로 취급하여 재퍼블리싱
- `Zip`: 여러 퍼블리셔로부터 가장 오래된 비방출 요소를 모아 재퍼블리싱

 

#### **연산자**

- `combineLatest(_ other:, _ transform:)`
- `combineLatest(_ other:)`
- `combineLatest(_ publisher1:, _ publisher2:, _ transform:)`
- `combineLatest(_ publisher1:, _ publisher2:)`
- `combineLatest(_ publisher1:, _ publisher2:, _ publisher3:, _ transform:)`
- `combineLatest(_ publisher1:, _ publisher2:, _ publisher3:)`
- `merge(with:)`
- `Publishers.MergeMany`
- `zip(_ other:)`
- `zip(_ other:, _ transform:)`

 

### **59\. combineLatest(\_ other:, \_ transform:)**

```swift
var firstCombinePublisher = PassthroughSubject<String, Never>()
var secondCombinePublisher = PassthroughSubject<String, Never>()

firstCombinePublisher
    .combineLatest(secondCombinePublisher) { firstPubValue, secondPubValue in
        return firstPubValue + ":" + secondPubValue
    }
    .sink { "Combine2 Comp".printWithResult($0) } receiveValue: { "Combine2 Val".printWithResult($0) }

firstCombinePublisher.send("E")
secondCombinePublisher.send("F")

secondCombinePublisher.send("G")
firstCombinePublisher.send("H")

// 두 개의 퍼블리셔를 모두 마감시켜야 finished 처리됨
firstCombinePublisher.send(completion: .finished)
secondCombinePublisher.send(completion: .finished)
/*
     E            H    |
 -------------------------------
           F    G      |
 
 [Combine2] E:F
 [Combine2] E:G
 [Combine2] H:G
 [Combine2 Comp] finished
 */

```

- `combineLatest(_: _ transform:)` 연산자는 두 개의 퍼블리셔를 결합하고, 두 퍼블리셔에서 가장 최근에 방출된 값을 사용하여 변환 클로저를 실행합니다. 이 연산자는 퍼블리셔 중 하나가 새로운 값을 방출할 때마다 변환 클로저를 호출하여 새로운 값을 방출합니다.
- 예를 들어, `firstCombinePublisher`와 `secondCombinePublisher`의 값이 결합되어 방출되며, 각각의 새로운 값이 방출될 때마다 최신 값이 반영됩니다.
- 결과적으로, 이 연산자는 두 퍼블리셔가 모두 마감될 때까지 계속 동작하며, 그 결과로 결합된 값이 방출됩니다.

 

### **60\. combineLatest(\_ other:) -> 튜플 형태로만 내보낼 수 있음**

```swift
firstCombinePublisher = PassthroughSubject<String, Never>()
secondCombinePublisher = PassthroughSubject<String, Never>()

firstCombinePublisher
    .combineLatest(secondCombinePublisher)
    .sink { "CombineO Comp".printWithResult($0) } receiveValue: { "CombineO Val".printWithResult($0) }

firstCombinePublisher.send("E")
secondCombinePublisher.send("F")

secondCombinePublisher.send("G")
firstCombinePublisher.send("H")

firstCombinePublisher.send(completion: .finished)
secondCombinePublisher.send(completion: .finished)
/*
     E            H    |
 -------------------------------
           F    G      |
 
 [CombineO Val] ("E", "F")
 [CombineO Val] ("E", "G")
 [CombineO Val] ("H", "G")
 [CombineO Comp] finished
 */

```

- `combineLatest(_:)` 연산자는 두 개의 퍼블리셔에서 방출된 최신 값을 튜플 형태로 결합하여 방출합니다. 이 경우, 변환 클로저가 없이 튜플 형태로만 결합된 값이 방출됩니다.
- 위 예제에서는 `firstCombinePublisher`와 `secondCombinePublisher`의 최신 값을 결합하여 방출하며, 각 퍼블리셔에서 새로운 값이 방출될 때마다 튜플로 결합된 결과가 방출됩니다.
- 퍼블리셔가 모두 마감되면, `finished` 이벤트가 방출됩니다.

<!-- \[the\_ad id="3020"\] -->

 

### **61\. combineLatest(\_ publisher1:, \_ publisher2:, \_ transform:)**

```swift
var thirdCombinePublisher = PassthroughSubject<String, Never>()
/*
 B   O   U   N      C        Y
 ---------------------------------------------
       O       H        M   Y   G   O
 ---------------------------------------------
   F       A      S   H   I       O
 */

firstCombinePublisher
    .combineLatest(secondCombinePublisher, thirdCombinePublisher) { first, second, third in
        return first + ":" + second + ":" + third
    }
    .sink { "Combine3 Comp".printWithResult($0) } receiveValue: { "Combine3 Val".printWithResult($0) }

let firstCombineString = "BOUNCY"
let secondCombineString = "OHMYGO"
let thirdCombineString = "FASHIO"
let combine3Order = [1, 3, 1, 2, 1, 3, 1, 2, 3, 1, 3, 2, 3, 2, 1, 2, 3, 2]

var firstQueue = firstCombineString.split(separator: "")
var secondQueue = secondCombineString.split(separator: "")
var thirdQueue = thirdCombineString.split(separator: "")

combine3Order.forEach { combineIndex in
    switch combineIndex {
    case 1:
        firstCombinePublisher.send(String(firstQueue.removeFirst()))
    case 2:
        secondCombinePublisher.send(String(secondQueue.removeFirst()))
    case 3:
        thirdCombinePublisher.send(String(thirdQueue.removeFirst()))
    default:
        break
    }
}

firstCombinePublisher.send(completion: .finished)
secondCombinePublisher.send(completion: .finished)
thirdCombinePublisher.send(completion: .finished)

// emit Tuple
firstCombinePublisher = PassthroughSubject<String, Never>()
secondCombinePublisher = PassthroughSubject<String, Never>()
thirdCombinePublisher = PassthroughSubject<String, Never>()

firstCombinePublisher
    .combineLatest(secondCombinePublisher, thirdCombinePublisher)
    .sink { "Combine3o Comp".printWithResult($0) } receiveValue: { "Combine3o Val".printWithResult($0) }

firstQueue = firstCombineString.split(separator: "")
secondQueue = secondCombineString.split(separator: "")
thirdQueue = thirdCombineString.split(separator: "")

combine3Order.forEach { combineIndex in
    switch combineIndex {
    case 1:
        firstCombinePublisher.send(String(firstQueue.removeFirst()))
    case 2:
        secondCombinePublisher.send(String(secondQueue.removeFirst()))
    case 3:
        thirdCombinePublisher.send(String(thirdQueue.removeFirst()))
    default:
        break
    }
}

firstCombinePublisher.send(completion: .finished)
secondCombinePublisher.send(completion: .finished)
thirdCombinePublisher.send(completion: .finished)

/*
 B   O   U   N      C        Y
 ---------------------------------------------
       O       H        M   Y   G   O
 ---------------------------------------------
   F       A      S   H   I       O
 
 [Combine3 Val] O:O:F
 [Combine3 Val] U:O:F
 [Combine3 Val] U:O:A
 [Combine3 Val] N:O:A
 [Combine3 Val] N:H:A
 [Combine3 Val] N:H:S
 [Combine3 Val] C:H:S
 [Combine3 Val] C:H:H
 [Combine3 Val] C:M:H
 [Combine3 Val] C:M:I
 [Combine3 Val] C:Y:I
 [Combine3 Val] Y:Y:I
 [Combine3 Val] Y:G:I
 [Combine3 Val] Y:G:O
 [Combine3 Val] Y:O:O
 [Combine3 Comp] finished
 
 [Combine3o Val] ("O", "O", "F")
 [Combine3o Val] ("U", "O", "F")
 [Combine3o Val] ("U", "O", "A")
 [Combine3o Val] ("N", "O", "A")
 [Combine3o Val] ("N", "H", "A")
 [Combine3o Val] ("N", "H", "S")
 [Combine3o Val] ("C", "H", "S")
 [Combine3o Val] ("C", "H", "H")
 [Combine3o Val] ("C", "M", "H")
 [Combine3o Val] ("C", "M", "I")
 [Combine3o Val] ("C", "Y", "I")
 [Combine3o Val] ("Y", "Y", "I")
 [Combine3o Val] ("Y", "G", "I")
 [Combine3o Val] ("Y", "G", "O")
 [Combine3o Val] ("Y", "O", "O")
 [Combine3o Comp] finished
 */

```

- `combineLatest(_: _ transform:)` 연산자는 세 개 이상의 퍼블리셔에서 방출된 값을 결합하고, 변환 클로저를 통해 새로운 값을 생성합니다. 이 연산자는 각 퍼블리셔의 최신 값을 결합하여 클로저에서 정의한 방식으로 변환합니다.
- 예제에서는 `firstCombinePublisher`, `secondCombinePublisher`, `thirdCombinePublisher`의 값이 결합되어 새로운 문자열을 생성합니다. 클로저에서는 각 퍼블리셔의 최신 값을 ':'로 구분된 문자열로 변환합니다.
- 퍼블리셔가 모두 마감되면, `finished` 이벤트가 방출됩니다.

 

### **62\. combineLatest(\_ publisher1:, \_ publisher2:, \_ publisher3:, \_ transform:)**

```swift
firstCombinePublisher = PassthroughSubject<String, Never>()
secondCombinePublisher = PassthroughSubject<String, Never>()
thirdCombinePublisher = PassthroughSubject<String, Never>()
var fourthCombinePublisher = PassthroughSubject<String, Never>()

/*
 B    O   U    N         C         Y
 ---------------------------------------------
        O          H         M   Y      G   O
 ---------------------------------------------
   F         A        S    H   I          O
 ---------------------------------------------
     f           l                   y
 */

let fourthString = "fly"
let combine4Order = [1, 3, 4, 1, 2, 1, 3, 1, 4, 2, 3, 1, 3, 2, 3, 2, 1, 4, 2, 3, 2]

firstQueue = firstCombineString.split(separator: "")
secondQueue = secondCombineString.split(separator: "")
thirdQueue = thirdCombineString.split(separator: "")
var fourthQueue = fourthString.split(separator: "")

firstCombinePublisher
    .combineLatest(secondCombinePublisher, thirdCombinePublisher, fourthCombinePublisher)
    .sink { "Combine4 Comp".printWithResult($0) } receiveValue: { "Combine4 Val".printWithResult($0) }
    

combine4Order.forEach { combineIndex in
    switch combineIndex {
    case 1:
        firstCombinePublisher.send(String(firstQueue.removeFirst()))
    case 2:
        secondCombinePublisher.send(String(secondQueue.removeFirst()))
    case 3:
        thirdCombinePublisher.send(String(thirdQueue.removeFirst()))
    case 4:
        fourthCombinePublisher.send(String(fourthQueue.removeFirst()))
    default:
        break
    }
}

[
    firstCombinePublisher,
    secondCombinePublisher,
    thirdCombinePublisher,
    fourthCombinePublisher,
].forEach {
    $0.send(completion: .finished)
}

/*
 B    O   U    N         C         Y
 ---------------------------------------------
        O          H         M   Y      G   O
 ---------------------------------------------
   F         A        S    H   I          O
 ---------------------------------------------
     f           l                   y
 
 [Combine4 Val] ("O", "O", "F", "f")
 [Combine4 Val] ("U", "O", "F", "f")
 [Combine4 Val] ("U", "O", "A", "f")
 [Combine4 Val] ("N", "O", "A", "f")
 [Combine4 Val] ("N", "O", "A", "l")
 [Combine4 Val] ("N", "H", "A", "l")
 [Combine4 Val] ("N", "H", "S", "l")
 [Combine4 Val] ("C", "H", "S", "l")
 [Combine4 Val] ("C", "H", "H", "l")
 [Combine4 Val] ("C", "M", "H", "l")
 [Combine4 Val] ("C", "M", "I", "l")
 [Combine4 Val] ("C", "Y", "I", "l")
 [Combine4 Val] ("Y", "Y", "I", "l")
 [Combine4 Val] ("Y", "Y", "I", "y")
 [Combine4 Val] ("Y", "G", "I", "y")
 [Combine4 Val] ("Y", "G", "O", "y")
 [Combine4 Val] ("Y", "O", "O", "y")
 [Combine4 Comp] finished
 */

```

- `combineLatest(_: _ publisher2:, _ publisher3:, _ publisher4:, _ transform:)` 연산자는 네 개의 퍼블리셔에서 방출된 값을 결합하고, 변환 클로저를 통해 새로운 값을 생성합니다. 이 연산자는 네 개의 퍼블리셔에서 최신 값을 결합하여 클로저에서 정의한 방식으로 변환합니다.
- 예제에서는 `firstCombinePublisher`, `secondCombinePublisher`, `thirdCombinePublisher`, `fourthCombinePublisher`의 값이 결합되어 새로운 문자열을 생성합니다. 클로저에서는 각 퍼블리셔의 최신 값을 `':'`로 구분된 문자열로 변환합니다.
- 퍼블리셔가 모두 마감되면, `finished` 이벤트가 방출됩니다.

 

### **63\. merge(with other:)**

```swift
var firstMergePublisher = PassthroughSubject<Int, Never>()
var secondMergePublisher = PassthroughSubject<Int, Never>()

firstMergePublisher
    .merge(with: secondMergePublisher)
    .sink { "MergeO Comp".printWithResult($0) } receiveValue: { "MergeO Val".printWithResult($0) }

firstMergePublisher.send(1)
secondMergePublisher.send(38729857)
firstMergePublisher.send(2)
secondMergePublisher.send(19433338)
/*
 [MergeO Val] 1
 [MergeO Val] 38729857
 [MergeO Val] 2
 [MergeO Val] 19433338
 */

```

- `merge(with:)` 연산자는 두 개 이상의 퍼블리셔의 값을 결합하여 방출합니다. 모든 퍼블리셔에서 방출된 값들이 병렬로 처리되어, 각 퍼블리셔에서 방출된 값이 순서에 상관없이 방출됩니다.
- 예제에서는 `firstMergePublisher`와 `secondMergePublisher`에서 방출된 값들이 병합되어 순서에 상관없이 출력됩니다.

 

### **64\. MergeMany**

```swift
var mergePublishers: [PassthroughSubject<Int, Never>] = (0..<20).map { index in
    PassthroughSubject<Int, Never>()
}

Publishers.MergeMany(mergePublishers)
    .sink { print($0, terminator: " ") }

for (index, publisher) in mergePublishers.enumerated() {
    publisher.send(index)
}
print()
/*
 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19
 */

```

- `Publishers.MergeMany` 연산자는 배열에 포함된 여러 퍼블리셔를 병합하여 방출합니다. 이 연산자는 각 퍼블리셔에서 방출된 값들을 병렬로 처리합니다.
- 예제에서는 20개의 퍼블리셔를 생성하고, 각 퍼블리셔에서 방출된 값들이 순서에 상관없이 출력됩니다.

 

### **65\. zip(\_ other:)**

```swift
var firstZipPub = PassthroughSubject<Int, Never>()
var secondZipPub = PassthroughSubject<Int, Never>()

firstZipPub
    .zip(secondZipPub)
    .sink { "Zip2 Comp".printWithResult($0) } receiveValue: { "Zip2 Val".printWithResult($0) }

firstZipPub.send(1)
secondZipPub.send(11)

firstZipPub.send(2)
secondZipPub.send(12)

for i in 3...9 {
    firstZipPub.send(i)
}

// 페어가 완성되어야만 finished 될 수 있음
firstZipPub.send(completion: .finished)

// 아래 부분이 실행되지 않은 경우 (3, 13) ~ (9, 19)는 방출되지 않는다
for i in 3...9 {
    secondZipPub.send(i + 10)
}
/*
 [Zip2 Val] (1, 11)
 [Zip2 Val] (2, 12)
 [Zip2 Val] (3, 13)
 [Zip2 Val] (4, 14)
 [Zip2 Val] (5, 15)
 [Zip2 Val] (6, 16)
 [Zip2 Val] (7, 17)
 [Zip2 Val] (8, 18)
 [Zip2 Val] (9, 19)
 [Zip2 Comp] finished
 */

```

- `zip(_ other:)` 연산자는 두 개의 퍼블리셔에서 방출된 값들을 짝지어 처리합니다. 두 퍼블리셔에서 각각 하나의 값이 방출되면, 이 두 값이 짝을 이루어 방출됩니다.
- 예제에서는 `firstZipPub`과 `secondZipPub`의 값들이 짝지어 방출됩니다. 두 퍼블리셔 중 하나라도 먼저 완료되면, 남은 값들은 방출되지 않습니다.

 

### **66\. zip(\_ other:, \_ transform:)**

```swift
firstZipPub = PassthroughSubject<Int, Never>()
secondZipPub = PassthroughSubject<Int, Never>()
var thirdZipPub = PassthroughSubject<Int, Never>()

firstZipPub
    .zip(secondZipPub, thirdZipPub)
    .sink { "Zip3 Comp".printWithResult($0) } receiveValue: { "Zip3 Val".printWithResult($0) }

for i in 1...3 {
    firstZipPub.send(i)
}

for i in 1...3 {
    thirdZipPub.send(i * 100)
}

thirdZipPub.send(completion: .finished)

for i in 1...3 {
    secondZipPub.send(i * 10)
}

/*
 [Zip3 Val] (1, 10, 100)
 [Zip3 Val] (2, 20, 200)
 [Zip3 Val] (3, 30, 300)
 [Zip3 Comp] finished
 */

```

- `zip(_ other:, _ transform:)` 연산자는 여러 개의 퍼블리셔에서 방출된 값들을 결합하여 처리합니다. 변환 클로저를 사용하여 결합된 값을 새로운 형태로 변환합니다.
- 예제에서는 `firstZipPub`, `secondZipPub`, `thirdZipPub`에서 방출된 값들이 각각 짝지어 결합된 후, 변환 클로저를 통해 새로운 형태로 방출됩니다.



### **분류: 새 퍼블리셔에 구독하여 요소 재퍼블리싱하기**

- `FlatMap`
- `SwitchToLatest`

#### **연산자**

- `flatMap(maxPublishers:_:)`
- `switchToLatest()`

 

### **67\. flatMap**

`flatMap` 연산자는 퍼블리셔가 방출하는 퍼블리셔들을 플랫하게 병합합니다. 즉, 퍼블리셔가 방출하는 퍼블리셔에서 방출된 값을 모두 병합하여 처리합니다.

```swift
typealias PassThruSubjString = PassthroughSubject<String, Never>

let fmPub1 = PassThruSubjString()
let fmPub2 = PassThruSubjString()
let fmPubs = PassthroughSubject<PassThruSubjString, Never>()

fmPubs
    // 최대 퍼블리셔 처리 개수
    .flatMap(maxPublishers: .max(2)) { publisher in
        publisher
    }
    .sink { "FlatMap Comp".printWithResult($0) } receiveValue: { "FlatMap Val".printWithResult($0) }

fmPubs.send(fmPub2)
fmPubs.send(fmPub1)

fmPub1.send("Hell")
fmPub1.send("World")

fmPub2.send("Kwangya")
fmPub2.send("ZZZZ")

/*
 max 1:
 [FlatMap Val] Kwangya
 [FlatMap Val] ZZZZ
 
 max 2:
 [FlatMap Val] Hell
 [FlatMap Val] World
 [FlatMap Val] Kwangya
 [FlatMap Val] ZZZZ
 */

```

- `flatMap`은 내부 퍼블리셔가 방출하는 모든 값을 병합하여 방출합니다. `maxPublishers` 매개변수를 통해 최대 퍼블리셔 개수를 제한할 수 있습니다.
- 예제에서는 `fmPubs` 퍼블리셔가 `fmPub1`과 `fmPub2` 퍼블리셔를 방출하고, 이 퍼블리셔들에서 방출된 값들이 `flatMap` 연산자를 통해 병합되어 방출됩니다.

 

### **68\. flatMap 예제: 아스키코드 정수 배열 변환**

```swift
let decodeOnlyAlphabet: ([Int]) -> AnyPublisher<String, Never> = { codes in
    Just(
        codes
            .compactMap { code in
                guard (65...90).contains(code) || (97...122).contains(code) else { return nil }
                return String(UnicodeScalar(code) ?? " ")
            }
            .joined()
    )
    .eraseToAnyPublisher()
}

let intArrayFMPublisher = PassthroughSubject<[Int], Never>()
intArrayFMPublisher
    .flatMap(decodeOnlyAlphabet)
    .sink { "FlatMap Comp".printWithResult($0) } receiveValue: { "FlatMap Val".printWithResult($0) }

intArrayFMPublisher.send([1, 80, 105, 110, 103, 117])
intArrayFMPublisher.send([1, 80, 105, 110, 103, 97])
intArrayFMPublisher.send(completion: .finished)
/*
 [FlatMap Val] Pingu
 [FlatMap Val] Pinga
 [FlatMap Comp] finished
 */

```

- 예제에서는 정수 배열을 받아 아스키 코드 값에 따라 문자열로 변환하는 `decodeOnlyAlphabet` 함수가 사용됩니다. `flatMap`을 사용하여 배열을 문자열로 변환한 후 방출합니다.
- 정수 배열이 방출되면, 해당 배열이 문자열로 변환된 후 방출됩니다.

 

### **69\. switchToLatest**

`switchToLatest` 연산자는 퍼블리셔가 방출하는 퍼블리셔들 중에서 최신의 퍼블리셔에서 방출된 값만을 처리합니다.

```swift
typealias PssthrusbjInt = PassthroughSubject<Int, Never>
let slPub1 = PssthrusbjInt()
let slPub2 = PssthrusbjInt()
let slPub3 = PssthrusbjInt()
let slPubs = PassthroughSubject<PssthrusbjInt, Never>()

slPubs
    .switchToLatest()
    .sink { "SwitchToLatest Comp".printWithResult($0) } receiveValue: { "SwitchToLatest Val".printWithResult($0) }

slPubs.send(slPub1)
slPub1.send(99)
slPub1.send(18)

slPubs.send(slPub2)
slPub1.send(73939)
slPub2.send(-999)

slPubs.send(slPub3)
slPub1.send(245243939)
slPub2.send(182435)
slPub3.send(111111)

slPub3.send(completion: .finished)
slPubs.send(completion: .finished)
/*
 [SwitchToLatest Val] 99
 [SwitchToLatest Val] 18
 [SwitchToLatest Val] -999
 [SwitchToLatest Val] 111111
 [SwitchToLatest Comp] finished
 */

```

- `switchToLatest`는 새로운 퍼블리셔가 방출될 때마다 이전 퍼블리셔를 무시하고 새로운 퍼블리셔의 값을 처리합니다. 이전 퍼블리셔에서 방출된 값들은 무시됩니다.
- 예제에서는 `slPubs` 퍼블리셔가 `slPub1`, `slPub2`, `slPub3`을 순차적으로 방출합니다. 각 퍼블리셔에서 방출된 값 중 최신의 퍼블리셔에서 방출된 값만이 처리됩니다.

 

### **70\. switchToLatest 예제: 이전 요청 무시**

```swift
var utSubsc = Set()
func userTapMockUp() {
    let url = URL(string: "https://source.unsplash.com/random")!
    
    func getImage() -> AnyPublisher<UIImage?, Never> {
        URLSession.shared
            .dataTaskPublisher(for: url)
            .map { data, _ in UIImage(data: data) }
            .replaceError(with: nil)
            .eraseToAnyPublisher()
    }
    
    let userTap = PassthroughSubject<Void, Never>()
    userTap
        .map { _ in getImage() }
        .switchToLatest()
        .sink { "UserTap Comp".printWithResult($0 as Any) } receiveValue: { "UserTap Val".printWithResult($0 as Any) }
        // Stores this type-erasing cancellable instance in the specified set.
        .store(in: &utSubsc)
    
    userTap.send()
    
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
        userTap.send()
    }
    
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.1) {
        userTap.send()
    }
}
userTapMockUp()
/*
 [UserTap Val] Optional()
 [UserTap Val] Optional()
 */

```

- 이 예제에서는 사용자가 화면을 탭할 때마다 새로운 이미지를 비동기로 로드합니다. `switchToLatest`를 사용하여 최신의 이미지 요청만을 처리하며, 이전의 요청은 무시합니다.
- 사용자가 탭할 때마다 새로운 이미지가 로드되고, 그 결과로 최신의 이미지가 화면에 표시됩니다.

 



### **분류: 오류 처리하기**

- `AssertNoFailure`
- `Catch`
- `TryCatch`
- `Retry`

 

#### **연산자**

- `assertNoFailure(_:file:line:)`
- `catch(_:)`
- `tryCatch(_:)`
- `retry(_:)`

 

### **71\. assertNoFailure(\_:file:line:)**

`assertNoFailure` 연산자는 퍼블리셔가 방출하는 값에서 오류가 발생하지 않음을 보장합니다. 만약 오류가 발생하면 `fatalError`를 호출하여 앱이 종료됩니다.

```swift
let intPub1 = PassthroughSubject<Int, PinguError>()

intPub1
    .assertNoFailure()
    .sink { "assertNoFailure Comp".printWithResult($0) } receiveValue: { "assertNoFailure Val".printWithResult($0) }

intPub1.send(1)
intPub1.send(2)
// intPub1.send(completion: .failure(.pinguIsBaboo)) // FatalError 발생

```

- 이 예제에서는 `assertNoFailure`를 사용하여 퍼블리셔가 오류를 방출하지 않도록 보장합니다. 만약 오류가 발생하면 앱이 종료됩니다.
- 주석 처리된 `completion: .failure(.pinguIsBaboo)`는 주석을 해제하면 `fatalError`가 호출되어 앱이 종료됩니다.

 

### **72\. catch**

`catch` 연산자는 오류가 발생했을 때 대체 값을 방출하도록 합니다. 예를 들어, 오류가 발생하면 `Just` 퍼블리셔를 사용하여 기본 값을 방출할 수 있습니다.

```swift
[4, 6, 0, 1, 3, 7].publisher
    .tryMap {
        guard $0 != 0 else { throw PinguError.pinguIsBaboo }
        return $0 * 2
    }
    .catch { _ in Just(-999) }
    .sink { "catch Comp".printWithResult($0) } receiveValue: { "catch Val".printWithResult($0) }

/*
 [catch Val] 8
 [catch Val] 12
 [catch Val] -999
 [catch Comp] finished
 */

```

- `catch` 연산자는 `tryMap`에서 발생한 오류를 처리하여 기본 값인 `-999`를 방출합니다.
- 오류가 발생한 후, 대체 값이 방출되고 스트림이 정상적으로 종료됩니다.

<!-- \[the\_ad id="3020"\] -->

 

### **73\. tryCatch**

`tryCatch` 연산자는 오류가 발생했을 때 대체 퍼블리셔를 방출합니다. 또한, 오류를 변환하여 다른 퍼블리셔를 방출할 수도 있습니다.

```swift
let intPub2 = [4, 6, 0, 1, 3, 7].publisher
let anotherIntPub2 = [99, 999, 9999].publisher

// tryCatch에 에러 변환을 지정하지 않았을 경우
intPub2
    .tryMap {
        guard $0 != 0 else { throw PinguError.pinguIsBaboo }
        return $0 * 2
    }
    .tryCatch { error -> AnyPublisher<Int, Never> in
        if error is PinguError { throw PandaError.thisIsBlackBear }
        return anotherIntPub2.eraseToAnyPublisher()
    }
    .sink { "tryCatch Comp".printWithResult($0) } receiveValue: { "tryCatch Val".printWithResult($0) }
    
/*
 * tryCatch에 에러 변환을 지정하지 않았을 경우
 [tryCatch Val] 8
 [tryCatch Val] 12
 [tryCatch Val] 99
 [tryCatch Val] 999
 [tryCatch Val] 9999
 [tryCatch Comp] finished
 
 * tryCatch에 에러 변환을 지정한 경우
 [tryCatch Val] 8
 [tryCatch Val] 12
 [tryCatch Comp] failure(__lldb_expr_85.PandaError.thisIsBlackBear)
 */

```

- 예제에서는 `tryMap`에서 발생한 `PinguError`를 `tryCatch`로 처리하여, 오류가 발생할 경우 `PandaError`를 방출하거나 `anotherIntPub2` 퍼블리셔로 대체합니다.
- 에러 변환이 없을 때는 대체 퍼블리셔가 방출되며, 에러 변환이 있을 경우 에러가 다시 방출될 수 있습니다.

 

### **74\. Retry**

`retry` 연산자는 오류가 발생했을 때 일정 횟수만큼 재시도합니다. 재시도가 끝나면 오류를 방출합니다.

```swift
var retryCount: Int = 0
func retryTest() throws {
    if retryCount < 2 {
        retryCount += 1
        print("\(retryCount) 번째 재시도")
        throw PandaError.thisIsBlackBear
    }
}

[1, 2, 3, 4].publisher
    .tryMap { value in
        try retryTest()
        return value
    }
    .retry(3)
    .sink { "retry Comp".printWithResult($0) } receiveValue: { "retry Val".printWithResult($0) }

/*
 retryCount < 2
 1 번째 재시도
 2 번째 재시도
 [retry Val] 1
 [retry Val] 2
 [retry Val] 3
 [retry Val] 4
 [retry Comp] finished
 
 retryCount < 4
 1 번째 재시도
 2 번째 재시도
 3 번째 재시도
 4 번째 재시도
 [retry Comp] failure(__lldb_expr_91.PandaError.thisIsBlackBear)
 */

```

- 예제에서는 `retryTest` 함수가 재시도를 구현하며, `retry` 연산자를 통해 최대 3번의 재시도를 시도합니다.
- 재시도 횟수가 지정된 횟수 내에서 오류가 발생하면, 그 이후에 성공하거나 오류가 발생하여 스트림이 종료됩니다.

 



### **분류: 타이밍 제어하기**

- `MeasureInterval`
- `Debounce`
- `Delay`
- `Throttle`
- `Timeout`

 

#### **연산자**

- `measureInterval(using:options:)`
- `debounce(for:scheduler:options:)`
- `delay(for:tolerance:scheduler:options:)`
- `throttle(for:scheduler:latest:)`
- `timeout(_:scheduler:options:customError:)`

 

### **75\. measureInterval(using:options:)**

`measureInterval(using:options:)` 연산자는 퍼블리셔의 값을 방출한 시간 간격을 측정합니다. 주어진 스케줄러를 사용하여 시간 간격을 계산합니다.

```swift
var miSubsc = Set<AnyCancellable>()
let miPub = PassthroughSubject<Int, Never>()

miPub
    .measureInterval(using: DispatchQueue.main)
    .sink {
        "MeasureInterval".printWithResult($0)
    } receiveValue: { nanosecond in
        print("Measure Time:", Double(nanosecond.magnitude) / 1000000000.0)
    }
    .store(in: &miSubsc)
	
miPub.send(1)
sl...eep(1) // 해당 함수는 그대로 적으면 워드프레스 오류가 발샘하므로 ...를 제거
miPub.send(3584)
sl..eep(3)
miPub.send(56245)

/*
 Measure Time: 0.000358334
 Measure Time: 1.002780583
 Measure Time: 3.001439042
 */

```

- `measureInterval`는 퍼블리셔가 방출한 값의 간격을 측정합니다. 위의 예제에서 \`miPub\` 퍼블리셔가 방출한 값의 간격이 초 단위로 측정됩니다.

 

### **76\. Debounce**

`debounce(for:scheduler:options:)` 연산자는 값의 수신이 멈춘 후 일정 시간이 지나면 가장 최근의 값을 Downstream으로 전달합니다.

```swift
var dbcSubsc = Set<AnyCancellable>()
let operationQueue: OperationQueue = {
    let operaionQueue = OperationQueue()
    operaionQueue.maxConcurrentOperationCount = 1
    return operaionQueue
}()

let textField = PassthroughSubject<String, Never>()
let bounces: [(String, TimeInterval)] = [ // 입력값, 입력 후 기다리는 시간
    ("www", 0.5),
    (".", 0.5),
    ("p", 1),
    ("ing", 0.5),
    ("u", 0.5),
    (".", 1.2),
    ("co", 0.5),
    ("m", 5),
]

var requestString = ""
textField
    .debounce(for: .seconds(1.0), scheduler: DispatchQueue.main)
    .sink { print("이번에 받은 값: \($0) , Network Request with: \(requestString)") }
    .store(in: &dbcSubsc)

for bounce in bounces {
    operationQueue.addOperation {
        requestString += bounce.0
        textField.send(bounce.0)
        
        usleep(UInt32(bounce.1 * 1000000))
    }
}
/*
 이번에 받은 값: p , Network Request with: www.p
 이번에 받은 값: . , Network Request with: www.pingu.
 이번에 받은 값: m , Network Request with: www.pingu.com
 */

```

- `debounce`는 값이 일정 시간 동안 멈춘 후 가장 최근 값을 전달합니다. 위의 예제에서는 \`textField\`에서 입력된 값이 일정 시간 후에 처리됩니다.

 

### **77\. Delay**

`delay(for:tolerance:scheduler:options:)` 연산자는 주어진 시간 동안 값을 지연시킵니다.

```swift
var delaySubsc = Set<AnyCancellable>()
let dateFormatter: DateFormatter = {
    let dateFormatter = DateFormatter()
    dateFormatter.dateStyle = .none
    dateFormatter.timeStyle = .long
    return dateFormatter
}()

Timer.publish(every: 1, on: .main, in: .default)
    .autoconnect()
    .handleEvents(receiveOutput:  { date in
        print("[Delay HE] Downstream으로 보낸값(현재시간): \(dateFormatter.string(from: date))")
    })
    .delay(for: .seconds(3), scheduler: RunLoop.main, options: .none)
    .sink {
        "Delay Comp".printWithResult($0)
    } receiveValue: {
        let now = Date()
        print("[Delay Val] 받은 값: \(dateFormatter.string(from: $0)) | 보낸시간: \(String(format: "%2.f", now.timeIntervalSince($0)))초 전")
    }
    .cancel()
    // .store(in: &delaySubsc)

/*
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:47 PM GMT+9 (A)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:48 PM GMT+9 (B)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:49 PM GMT+9 (C)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:50 PM GMT+9 (D)
 [Delay Val] 받은 값: 1:40:47 PM GMT+9 | 보낸시간:  3초 전    (A)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:51 PM GMT+9
 [Delay Val] 받은 값: 1:40:48 PM GMT+9 | 보낸시간:  3초 전    (B)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:52 PM GMT+9
 [Delay Val] 받은 값: 1:40:49 PM GMT+9 | 보낸시간:  3초 전    (C)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:53 PM GMT+9
 [Delay Val] 받은 값: 1:40:50 PM GMT+9 | 보낸시간:  3초 전    (D)
 [Delay HE] Downstream으로 보낸값(현재시간): 1:40:54 PM GMT+9
 
 즉 Upstream Publisher에서 내려보낸 값이 3초 뒤에야 Downstream에 전달되는 것이죠.
 Downstream에서 받은 값은 현재 시간보다 3초 전의 값인 것을 볼 수 있어요.
 */

```

- `delay`는 값이 일정 시간 동안 지연되어 Downstream으로 전달됩니다. 위의 예제에서는 3초의 지연이 적용되었습니다.

 

### **78\. Throttle**

`throttle(for:scheduler:latest:)` 연산자는 지정된 시간 간격마다 Upstream 퍼블리셔가 보낸 가장 최근 값 혹은 가장 첫 번째 값을 Downstream으로 전달합니다.

```swift
var thrSubsc = Set<AnyCancellable>()
let thrOpQue: OperationQueue = {
    let operationQueue = OperationQueue()
    operationQueue.maxConcurrentOperationCount = 1
    return operationQueue
}()

let textField2 = PassthroughSubject<String, Never>()
let throttles: [(String, TimeInterval)] = bounces
var requestString2 = ""

textField2
    .throttle(for: .seconds(2), scheduler: DispatchQueue.main, latest: true)
    .sink {
        "Throttle Comp".printWithResult($0)
    } receiveValue: {
        print("[Throttle] 이번시간동안 받은 값중 최신값: \($0), 현재시간: \(Date().description), Network Request with: \(requestString)")
    }
    .cancel()
    // .store(in: &thrSubsc)

textField2
    .sink(receiveCompletion: { print($0) },
          receiveValue: { string in
        print("[Throttle] 현재시간: \(Date().description), 이번에 내려보낸 값: \(string)")
    })
    .cancel()
    // .store(in: &thrSubsc)

for throttle in throttles {
    thrOpQue.addOperation {
        requestString2 += throttle.0
        textField2.send(throttle.0)
        
        usleep(UInt32(throttle.1 * 1_000_000))
    }
}

/*
 Network Request를 2초마다 보냄
 
 [Throttle] 현재시간: 2023-08-19 04:57:23 +0000, 이번에 내려보낸 값: www
 [Throttle] 이번시간동안 받은 값중 최신값: www, 현재시간: 2023-08-19 04:57:24 +0000, Network Request with: www
 [Throttle] 현재시간: 2023-08-19 04:57:24 +0000, 이번에 내려보낸 값: .
 [Throttle] 현재시간: 2023-08-19 04:57:25 +0000, 이번에 내려보낸 값: p
 [Throttle] 현재시간: 2023-08-19 04:57:26 +0000, 이번에 내려보낸 값: ing
 [Throttle] 이번시간동안 받은 값중 최신값: ing, 현재시간: 2023-08-19 04:57:26 +0000, Network Request with: www.ping
 [Throttle] 현재시간: 2023-08-19 04:57:26 +0000, 이번에 내려보낸 값: u
 [Throttle] 현재시간: 2023-08-19 04:57:27 +0000, 이번에 내려보낸 값: .
 [Throttle] 이번시간동안 받은 값중 최신값: ., 현재시간: 2023-08-19 04:57:28 +0000, Network Request with: www.pingu.co
 [Throttle] 현재시간: 2023-08-19 04:57:28 +0000, 이번에 내려보낸 값: co
 [Throttle] 현재시간: 2023-08-19 04:57:28 +0000, 이번에 내려보낸 값: m
 [Throttle] 이번시간동안 받은 값중 최신값: m, 현재시간: 2023-08-19 04:57:30 +0000, Network Request with: www.pingu.com
 */

```

- `throttle`는 지정된 시간 간격마다 최신 값 또는 첫 번째 값을 Downstream으로 전달합니다. 위의 예제에서는 2초마다 최신 값이 전달됩니다.

 

### **79\. Timeout**

`timeout(_:scheduler:options:customError:)` 연산자는 주어진 시간 내에 값을 받지 못할 경우 에러를 발생시킵니다.

```swift
struct TimeoutError: Error {}
let ttIntPublisher = PassthroughSubject<Int, TimeoutError>()
ttIntPublisher
    .timeout(.seconds(2), scheduler: DispatchQueue.main) {
        return TimeoutError()
    }
    .sink { "Timeout Comp".printWithResult($0) } receiveValue: { "Timeout Val".printWithResult($0) }
    .store(in: &thrSubsc)

ttIntPublisher.send(1)
ttIntPublisher.send(2)
// timeout 최대 시간이 2초 설정인데 2.5초뒤에 send되도록 함
DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
    ttIntPublisher.send(3)
}

/*
 [Timeout Val] 1
 [Timeout Val] 2
 [Timeout Comp] failure(__lldb_expr_120.TimeoutError())
 
 customError 클로저에서 에러를 반환하지 않으면 그냥 finished 됩니다!
 */

```

- `timeout`은 지정된 시간 내에 값을 받지 못하면 에러를 발생시키거나 커스텀 에러를 발생시킬 수 있습니다. 위의 예제에서는 2초를 초과할 경우 에러가 발생합니다.

 



### **분류: 인코딩 및 디코딩**

- `Encode`
- `Decode`

 

#### **연산자**

- `encode(encoder:)`
- `decode(type:decoder:)`

 

### **80\. Encode**

`encode(encoder:)` 연산자는 퍼블리셔에서 발행된 값을 지정된 인코더를 사용하여 인코딩합니다.

```swift
struct GiantPanda: Codable {
    let name: String
    let age: Int
    let address: String
}

let gPandaPub = PassthroughSubject<GiantPanda, Never>()
gPandaPub
    .encode(encoder: JSONEncoder())
    .sink {
        "Encode Comp".printWithResult($0)
    } receiveValue: { data in
        print("[Encode Val] 인코딩된 값: \(data)")
        guard let string = String(data: data, encoding: .utf8) else {
            return
        }
        print("[Encode Val] 인코딩 값의 문자열 표현: \(string)")
    }

gPandaPub.send(.init(name: "FuBao", age: 3, address: "용인시"))
/*
 [Encode Val] 인코딩된 값: 46 bytes
 [Encode Val] 인코딩 값의 문자열 표현: {"name":"FuBao","age":3,"address":"용인시"}
 */

```

- `encode`는 퍼블리셔가 방출한 값을 인코더를 사용하여 인코딩합니다. 위의 예제에서는 \`GiantPanda\` 객체가 JSON으로 인코딩됩니다.

 

### **81\. Decode**

`decode(type:decoder:)` 연산자는 데이터 타입을 지정하여 데이터를 디코딩합니다.

```swift
let gPandaDataPub = PassthroughSubject<Data, Never>()
gPandaDataPub
    .decode(type: GiantPanda.self, decoder: JSONDecoder())
    .sink{
        "Decode Comp".printWithResult($0)
    } receiveValue: { decoded in
        "Decode Val".printWithResult(decoded)
    }

let jsonString = """
    {"name":"LeBao","age":11,"address":"용인시"}
"""
let lebaoData = Data(jsonString.utf8)
gPandaDataPub.send(lebaoData)
/*
 [Decode Val] GiantPanda(name: "LeBao", age: 11, address: "용인시")
 */

```

- `decode`는 퍼블리셔가 방출한 데이터를 지정된 디코더를 사용하여 디코딩합니다. 위의 예제에서는 JSON 데이터를 \`GiantPanda\` 객체로 디코딩합니다.

 

<!--[rcblock id="6686"]-->
