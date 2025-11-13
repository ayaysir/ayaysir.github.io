---
title: "SwiftUI: ObservableObject 프로토콜과 @Published, @ObsevedObejct, @StateObject 프로퍼티 래퍼"
date: 2022-08-27
categories: 
  - "DevLog"
  - "Swift"
---

#### **ObservableObject란?**

기본적으로 `ObservableObject`는 `@Published` 프로퍼티 래퍼가 붙은 값이 변경되기 전에, 변경된 값을 방출(emit)하는 `objectWillChange` 퍼블리셔를 사용할 수 있도록 하는 프로토콜입니다.

클래스에서만 사용 가능한 프로토콜입니다.

```
class Contact: ObservableObject {
    @Published var name: String
    @Published var age: Int

    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }

    func haveBirthday() -> Int {
        age += 1
        return age
    }
}

let john = Contact(name: "John Appleseed", age: 24)
_ = john.objectWillChange
    .sink { _ in
        print("\(john.age) will change")
}

print(john.haveBirthday())
// Prints "24 will change"
// Prints "25"

```

- `john.haveBirthday()`이 실행될 때, 값이 바뀌기 전에 `sink`의 클로저가 실행되고, 다음 변경된 나이 값인 25가 반환됩니다.

 

#### **@Published 속성 래퍼(Property Wrapper)란?**

`@Published`는 SwiftUI에서 가장 유용한 속성 래퍼 중 하나이며 변경이 발생할 때 자동으로 알리는 관찰 가능한 오브젝트(observable object)를 만들 수 있습니다. SwiftUI는 이러한 변경 사항을 자동으로 모니터링하고 데이터에 의존하는 모든 View의 `body` 속성을 다시 호출합니다.

실제로 `@Published`로 표시된 속성이 있는 오브젝트가 변경될 때마다 해당 오브젝트를 사용하는 모든 View가 다시 로드되어 해당 변경 사항을 반영합니다.

예를 들어 다음과 같은 관찰 가능한 오브젝트가 있는 경우

```
class Bag: ObservableObject {
    var items = [String]()
}
```

이는 `ObservableObject` 프로토콜을 준수하므로 SwiftUI의 뷰가 변경 사항을 감시할 수 있습니다. 그러나 유일한 속성 `items`가 `@Published`로 표시되어 있지 않기 때문에 변경되었다는 통지(notification)가 전송되지 않습니다. 배열에 항목을 자유롭게 추가할 수 있으나 View는 업데이트되지 않습니다.

항목에서 아이템이 추가되거나 제거될 때마다 변경되었다는 통지가 전송되도록 하려면 다음과 같이 `@Published`로 표시합니다.

```
class Bag: ObservableObject {
    @Published var items = [String]()
}
```

다른 작업을 수행할 필요는 없습니다. `@Published` 속성 래퍼는 항목에 `willSet` 속성 관찰자(실제 값이 set되기 전에 새로운 값을 먼저 받는다)를 추가하여 모든 변경 사항이 관찰자(observer)에게 자동으로 전송되도록 합니다.

보다시피 `@Published`는 옵트인(어떤 정보를 사용하기 위해 사용자로부터 동의를 받아야 하는 방식)입니다. 기본적으로 변경 사항으로 인한 재로드가 발생하지 않기 때문에 통지를 발생시켜야 하는 프로퍼티 앞에 해당 프로퍼티 래퍼를 부착해야 합니다. 즉, 캐시, 내부 사용을 위한 속성 등을 저장하는 속성을 추가할 수 있으며 특별히 `@Published`를 부착하지 않는다면 해당 값이 변경될 때 SwiftUI가 View를 다시 로드하도록 강제하지 않습니다.

 

##### @Published 예제

`@Published` 속성이 있는 속성을 게시(publish)하면 이 유형의 퍼블리셔(publisher)가 생성됩니다. 다음과 같이 `$` 연산자를 사용하여 퍼블리셔에 액세스합니다.

```
import UIKit

// 날씨 클래스: 온도를 저장한다.
class Weather: ObservableObject {
    @Published var temperature: Double
    init(temperature: Double) {
        self.temperature = temperature
    }
}

let weather = Weather(temperature: 20)

/*
 weather.temperature는 단순한 Double 타입이지만
 weather.$temperature Published<Double>.Publisher 타입으로 sink()를 사용할 수 있다.
 - sink() : closure에서 새로운 값이나 종료 이벤트에 대해 처리한다.
 - weather 인스턴스의 temperature가 변경될 때 sink의 클로저에 작성된 내용이 실행된다.
 */

let cancellable = weather.$temperature
    .sink() {
        print ("Temperature now: \($0)")
}

// 3초 뒤 weather.temperature 의 값을 25로 변경한다.
DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(3)) {
    weather.temperature = 25
}

// 출력:
// Temperature now: 20.0
// Temperature now: 25.0 (3초 후)

```

 

#### **@ObservedObject와 @StateObject**

`ObservableObject` 프로토콜은 데이터를 저장할 수 있는 일종의 클래스와 함께 사용됩니다. `@ObservedObject` 는 관찰 가능한 오브젝트의 인스턴스를 저장하기 위해 View의 내부에서 사용되며 `@Published`는 뷰가 변경될 때 업데이트되도록 해야 하는 관찰 가능한 오브젝트의 내부의 모든 속성에 추가됩니다.

`@ObservedObject`를 다른 곳에서 전달된 View에만 사용하는 것이 정말 중요합니다. 왜냐하면 `@ObservedObject`는 값이 변경될 때 뷰를 무효화(invalidate-현재의 뷰를 없애고 새로 드로잉)하기 때문입니다.

반면 이를 보완하기 위해 iOS14 에서 추가된 `@StateObject`는 단 한 번 인스턴스가 생성되며, View를 처음부터 새로 그리지 않고, `ObservableObject` 에서의 데이터가 변할 때, 그 `ObservableObject` 의 데이터가 들어간 부분만 View를 다시 그린다는 차이점이 있습니다.

관찰 가능한 오브젝트의 초기 인스턴스를 생성할 때 `@ObservedObject`를 사용해서는 안 됩니다. 이것은 `@StateObject`로 지정해야 합니다.

```
import SwiftUI

// ContetnView에서 @ObservedObejct를 사용하기 위해서는 ObservableObject 프로토콜을 준수해야 한다.
class Person: ObservableObject {
    // @Published를 제거하면 아래 ContentView의 레이블이 새로고침되지 않는다.
    @Published var name: String = "Unknown"
    
    // 이름을 받아오는 메서드
    func fetchPerson() {
        self.name = (1...10).map { _ in
            let code = Int.random(in: 64...90)
            return String(UnicodeScalar(UInt8(code)))
        }.joined(separator: "")
    }
}

struct InnerView: View {
    // @StateObject로 대체하더라도 동작은 된다.
    @ObservedObject var person: Person
    
    var body: some View {
        Button("Fetch Name") {
            person.fetchPerson()
        }
    }
}

struct ContentView: View {
    // @StateObject를 제거하면 Fetch Name 버튼을 클릭해도 앱의 레이블에서 이름이 변경되지 않는다.
    // @ObsevedObejct로 대체하더라도 동작은 된다.
    @StateObject var person = Person()
    
    var body: some View {
        VStack {
            // person.name을 표시하는 레이블
            Text(person.name)
            // 버튼을 누르면 person.fetchPerson()을 실행한다.
            InnerView(person: person)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

```

<!-- http://www.giphy.com/gifs/fxKmTvvJs2EmqSKpWV -->
![](https://)

 

#### **출처**

- [https://www.hackingwithswift.com/quick-start/swiftui/how-to-use-observedobject-to-manage-state-from-external-objects](https://www.hackingwithswift.com/quick-start/swiftui/how-to-use-observedobject-to-manage-state-from-external-objects)
- [https://www.hackingwithswift.com/quick-start/swiftui/what-is-the-published-property-wrapper](https://www.hackingwithswift.com/quick-start/swiftui/what-is-the-published-property-wrapper)
- [https://developer.apple.com/documentation/combine/observableobject](https://developer.apple.com/documentation/combine/observableobject)
- [https://developer.apple.com/documentation/combine/published](https://developer.apple.com/documentation/combine/published)
- [https://dblog.tech/40](https://dblog.tech/40)
