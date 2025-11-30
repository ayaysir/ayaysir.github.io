---
title: "Swift(스위프트): Codable을 사용하여 사용자 정의 오브젝트를 UserDefaults에 저장 (프로토콜 지향 접근 방식)"
date: 2022-05-07
categories: 
  - "DevLog"
  - "Swift"
---

**원문**

- [Save custom objects into UserDefaults using Codable in Swift 5.1 (Protocol Oriented Approach)](https://medium.com/@ankit.bhana19/save-custom-objects-into-userdefaults-using-codable-in-swift-5-1-protocol-oriented-approach-ae36175180d8)

 

## **소개**

iOS는 `Int`, `String`, `Float`, `Double`, `Bool`, `URL`, `Data` 또는 이러한 유형의 컬렉션과 같은 UserDefaults에 직접 저장할 수 있는 여러 유형의 객체를 지원합니다.

하지만 위의 목록에 없는 사용자 정의 오브젝트를 UserDefaults에 저장하려면 어떻게 해야 할까요?🤔

 

> 다른 타입의 오브젝트를 저장하려면 일반적으로 해당 개체를 아카이브하여 `NSData` 인스턴스를 생성해야 합니다.
> 
> [Apple Documentation](https://developer.apple.com/documentation/foundation/userdefaults)

이제 사용자 정의 오브젝트를 `UserDefaults`에 저장하려면 먼저 이를 `Data` 오브젝트로 변환해야 한다는 것을 알게 되었습니다. 다행히도 가능한 몇 가지 옵션이 있습니다. 이를 위해 `Codable`을 사용할 것입니다.

어떤 개발자도 프로젝트에 장황한 반복 코드 (boilerplate code)를 갖고 싶어하지 않으므로 프로토콜을 사용하여 수행하겠습니다. 우리는 한 번 작성하면 프로젝트의 어느 곳에서나 사용할 수 있는 메서드를 만들 것입니다.

 

## **프로토콜 정의**

`UserDefaults`에서 사용자 정의 개체를 저장하고 검색할 수 있는 메서드 요구 사항을 선언하는 프로토콜 ObjectSavable을 정의해 보겠습니다.

```swift
protocol ObjectSavable {
    func setObject<Object>(_ object: Object, forKey: String) throws where Object: Encodable
    func getObject<Object>(forKey: String, castTo type: Object.Type) throws -> Object where Object: Decodable
}
```

- `setObject` 메소드는 유형이 `Encodable` 프로토콜을 준수하는 오브젝트와 연관된 키 이름을 사용하여 `UserDefaults`에 저장할 수 있도록 합니다.
- `getObject` 메소드는 `UserDefaults`에서 연관된 오브젝트를 검색할 키와 `Decodable` 프로토콜을 준수하는 타입을 사용하여 `UserDefault`로부터 데이터를 가져올 수 있도록 합니다. 타입 자체를 전달하기 위해 _Metatype_😕을 사용했습니다.

 

> 메타타입(`Metatype`) 유형은 클래스(`class`) 타입, 구조체(`struct`)  타입, `enum` 타입 및 프로토콜(`protocol`) 타입을 포함한 모든 타입의 타입(type of any type,을 나타냅니다.
> 
> [Apple Documentation](https://docs.swift.org/swift-book/ReferenceManual/Types.html)

 

## **UserDefaults 확장 구현**

`ObjectSavable` 프로토콜이 준비되었습니다. `UserDefaults` 클래스를 준수하고 요구 사항에 대한 구현을 제공하겠습니다.

```swift
extension UserDefaults: ObjectSavable {
    func setObject<Object>(_ object: Object, forKey: String) throws where Object: Encodable {
        let encoder = JSONEncoder()
        do {
            let data = try encoder.encode(object)
            set(data, forKey: forKey)
        } catch {
            throw ObjectSavableError.unableToEncode
        }
    }
    
    func getObject<Object>(forKey: String, castTo type: Object.Type) throws -> Object where Object: Decodable {
        guard let data = data(forKey: forKey) else { throw ObjectSavableError.noValue }
        let decoder = JSONDecoder()
        do {
            let object = try decoder.decode(type, from: data)
            return object
        } catch {
            throw ObjectSavableError.unableToDecode
        }
    }
}
```

- `setObject` 사용자 지정 오브젝트를 `Data` 오브젝트로 변환하는 데 사용할 `JSONEncoder` 오브젝트를 만들었습니다. 변환된 `Data` 오브젝트가 있으면 주어진 키를 사용하여 이를 `UserDefaults`에 저장합니다.
- `getObject` 주어진 키에 대해 `UserDefaults`에서 오브젝트를 검색합니다. `guard` 문을 사용하여 검색된 데이터 오브젝트를 프로퍼티에 안전하게 바인딩합니다. 마지막으로 이 `Data` 오브젝트를 주어진 유형으로 디코딩하고 반환합니다.

 

참고로 위의 방법 단계 중 하나라도 실패하면 개발자에게 무엇이 잘못되었는지 알려주는 관련 에러가 발생합니다.

에러를 관리하기 위해 `LocalizedError` 프로토콜을 준수하는 `String` 타입의 `enum`인 `ObjectSavableError`를 만들겠습니다.

```swift
enum ObjectSavableError: String, LocalizedError {
    case unableToEncode = "Unable to encode object into data"
    case noValue = "No data object found for the given key"
    case unableToDecode = "Unable to decode object into given type"
    
    var errorDescription: String? {
        rawValue
    }
}
```

 

## **실제 사용 예제**

이제 위의 방법을 사용하여 오브젝트를 저장하고 검색하는 방법을 살펴보겠습니다.

다음과 같이 구조체 `Book` 을 선언합니다.

```swift
struct Book: Codable {
    var title: String
    var authorName: String
    var pageCount: Int
}
```

 

### **저장 (Save)**

`Book`의 오브젝트를 만들고 `setObject` 메서드에 키와 함께 전달합니다. 이 방법은 실패 시 에러가 발생할 수 있으므로 `do-catch` 문을 사용합니다.

```swift
let playingItMyWay = Book(title: "Playing It My Way", authorName: "Sachin Tendulkar & Boria Mazumder", pageCount: 486)
let userDefaults = UserDefaults.standard
do {
    try userDefaults.setObject(playingItMyWay, forKey: "MyFavouriteBook")
} catch {
    print(error.localizedDescription)
}
```

 

### **검색 (Retrieve)**

`forKey`에 키 이름을 입력하고, castTo에 저장된 오브젝트의 타입을 `[타입이름].self` 형식으로 입력합니다

```swift
let userDefaults = UserDefaults.standard
do {
    let playingItMyWay = try userDefaults.getObject(forKey: "MyFavouriteBook", castTo: Book.self)
    print(playingItMyWay)
} catch {
    print(error.localizedDescription)
}

// Output
// Book(title: "Playing It My Way", authorName: "Sachin Tendulkar & Boria Mazumder", pageCount: 486)
```


이것이 사용자 정의 유형을 `UserDefaults`에 저장하고 검색하는 방법입니다.

 

## **전체 코드**

```swift
import Foundation

protocol ObjectSavable {
    func setObject<Object>(_ object: Object, forKey: String) throws where Object: Encodable
    func getObject<Object>(forKey: String, castTo type: Object.Type) throws -> Object where Object: Decodable
}

enum ObjectSavableError: String, LocalizedError {
    case unableToEncode = "Unable to encode object into data"
    case noValue = "No data object found for the given key"
    case unableToDecode = "Unable to decode object into given type"
    
    var errorDescription: String? {
        rawValue
    }
}

extension UserDefaults: ObjectSavable {
    func setObject<Object>(_ object: Object, forKey: String) throws where Object: Encodable {
        let encoder = JSONEncoder()
        do {
            let data = try encoder.encode(object)
            set(data, forKey: forKey)
        } catch {
            throw ObjectSavableError.unableToEncode
        }
    }
    
    func getObject<Object>(forKey: String, castTo type: Object.Type) throws -> Object where Object: Decodable {
        guard let data = data(forKey: forKey) else { throw ObjectSavableError.noValue }
        let decoder = JSONDecoder()
        do {
            let object = try decoder.decode(type, from: data)
            return object
        } catch {
            throw ObjectSavableError.unableToDecode
        }
    }
}
```
