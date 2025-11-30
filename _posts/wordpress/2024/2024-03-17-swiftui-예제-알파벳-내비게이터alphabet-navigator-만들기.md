---
title: "SwiftUI 예제: 알파벳 내비게이터(Alphabet Navigator) 만들기"
date: 2024-03-17
categories: 
  - "DevLog"
  - "SwiftUI"
---

## **알파벳 내비게이터 만들기**

아래와 같이 알파벳으로 섹션이 나뉘어져 있으며 해당 알파벳을 클릭하면 섹션으로 이동하는 기능을 알파벳 내비게이터라고 칭하겠습니다. (정식 명칭은 다를 수 있습니다.)

<!-- http://www.giphy.com/gifs/PywKnLLMIQPLM3RW1F -->
![](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHM2dnZ1bnZiZ3h6dDZvbnIxMjZjbmQwenBkZXVjcDBtMHd4dHIzbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PywKnLLMIQPLM3RW1F/giphy.gif)

 

## **출처**

- [SwiftUI List with Section Index on right hand side?](https://stackoverflow.com/questions/58809357/swiftui-list-with-section-index-on-right-hand-side)

 

## **기본 형태**

- `Contacts`배열에 있는 사람 목록을 보여주는 뷰입니다.
    - 예제를 복잡하지 않게 하기 위해 단순 `[String]` 배열로 만들었습니다.
- 아래 기본 형태를 바탕으로 진행합니다.

```swift
import SwiftUI

struct ContentView: View {
  @State private var searchText = ""
  var contacts = [String]()

  var body: some View {
    ScrollViewReader { scrollProxy in
        List {
          ForEach(contacts, id: \.self) { contact in
            HStack {
              Image(systemName: "person.circle.fill")
                .font(.largeTitle)
                .padding(.trailing, 5)
              Text(contact)
            }
          }
        }
        .navigationTitle("Contacts")
        .listStyle(PlainListStyle())
      }
  }
  
  init() {
    contacts = [
      "Chris", "Ryan", "Allyson", "Ryan", "Jonathan", "Ryan", "Brendan", "Ryaan",
      "Jaxon", "Riner", "Leif", "Adams", "Frank", "Conors", "Allyssa", "Bishop",
      "Justin", "Bishop", "Johnny", "Appleseed", "George", "Washingotn", "Abraham", "Lincoln",
      "Steve", "Jobs",  "Steve", "Woz", "Bill", "Gates", "Donald", "Trump", "Darth", "Vader",
      "Clark", "Kent", "Bruce", "Wayne", "John", "Doe",  "Jane", "Doe", "Rei", "Kim",
      "James", "Elephant", "Julius", "Fucik", "Kane", "Hammersmith",
    ]
    contacts.sort()
  }
}
```

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-17-pm-7.21.25-copy.jpg)

 

## **사람 이름을 알파벳 섹션으로 분류하기**

### **Step 1: 전역 변수로 알파벳 배열을 추가합니다.**

```swift
let alphabet: [String] = (65...90).map { String(UnicodeScalar($0)!) }
```

- `65`는 대문자 `A`의 아스키 코드이며, `90`은 대문자 `Z`의 아스키 코드입니다.
- `A`부터 `Z`까지의 아스키 코드 범위에서 아스키 코드를 실제 문자로 변환해서 배열로 저장합니다.

 

### **Step 2: 알파벳 첫문자로 Contacts 배열 필터링하기**

```swift
func contactsFilter(by letter: String) -> [String] {
  contacts.filter { $0.prefix(1) == letter }
}
```

- `contact`의 첫문자(`prefix(1)`)가 `letter`(알파벳 문자)와 일치할 경우만 필터링합니다.

 

### **Step 3: 알파벳 섹션 만들기**

`List {...}` 안에 다음을 추가합니다.

```swift
ForEach(alphabet, id: \.self) { letter in
  Section(header: Text(letter).id(letter)) {
    
  }
}
```

- `ForEach`를 통해 알파벳 문자마다 섹션을 만들고, 헤더 텍스트와 `id`를 해당 알파벳으로 지정합니다.
- `id`는 나중에 알파벳 내비게이터에서 버튼을 눌렀을 때 스크롤 위치를 지정하기 위한 역할입니다.

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-17-pm-7.33.27-copy.jpg)

 

### **Step 4: 섹션별로 필터링된 사람 목록 보여주기**

위 `Section {...}` 안에 사람 목록을 보여주는 `ForEach`문을 넣되, 대상 자료를 필터링된 `Contacts`인 `contactsFilter(by:)`로 바꿔줍니다.

```swift
ForEach(alphabet, id: \.self) { letter in
  Section(header: Text(letter).id(letter)) {
    ForEach(contactsFilter(by: letter), id: \.self) { contact in
      HStack {
        Image(systemName: "person.circle.fill")
          .font(.largeTitle)
          .padding(.trailing, 5)
        Text(contact)
      }
    }
  }
```

- `letter`에 따라 필터링된 목록을 보여줍니다.

 

 ![](/assets/img/wp-content/uploads/2024/03/screenshot-2024-03-17-pm-7.36.17-copy.jpg)

 

## **알파벳 내비게이터 추가: 탭 방식**

알파벳을 누르면 해당 섹션으로 이동하는 기초적인 내비게이터를 추가하겠습니다. `ScrollView {...}`의 오버레이를 추가합니다.

```swift
.overlay(alignment: .top) {
  VStack {
    ForEach(alphabet, id: \.self) { letter in
      HStack {
        Spacer()
        Button {
          withAnimation {
            scrollProxy.scrollTo(letter, anchor: .top)
          }
        } label: {
          Text(letter)
            .font(.system(size: 15))
            .padding(.trailing, 7)
        }
      }
    }
  }
}
```

- `overlay(alignment: .top) {...}` - 오버레이를 추가하며, 오버레이 뷰가 top을 기준으로 정렬됩니다.
    - alignment를 추가하지 않으면 스크롤 뷰의 한가운데에 위치하게 됩니다.
- `HStack`에 `Spacer()`를 줘서 내비게이터가 화면 오른쪽으로 붙어있도록 합니다.
- `Button`의 첫 번째 트레일링 클로저(`action`)에 `scrollTo(아이디)` 명령을 추가해 버튼을 누르면 해당 섹션 타이틀로 이동하도록 합니다.
    - `anchor`가 `.top`이어야 헤더가 눈에 보이는 제일 위에 위치하게 됩니다.
    - `withAnimation`으로 감싸면 스크롤 애니메이션이 되면서 자연스럽게 이동하고, 사용하지 않으면 애니메이션 없이 바로 이동합니다.

<!-- http://www.giphy.com/gifs/wzVgF4cP4A0mChZtwb -->
![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzY2MmdzNWpkajRvZXY3cXFwNXprZ3ZrZDV4djB2MDBjOXFzbXFkMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wzVgF4cP4A0mChZtwb/giphy.gif)

_탭(클릭)하면 해당 알파벳 헤더로 이동합니다._

 

## **알파벳 내비게이터 추가: 탭 + 드래그 방식**

위에 예제도 바로 사용가능하긴 하지만, 기존에 알던 알파벳 내비게이터는 드래그로도 선택할 수 있고, 진동도 울렸던 것으로 기억합니다.

 

### **Step 1: 뷰 분리**

```swift
.overlay(alignment: .top) {
  AlphabetNavigator(scrollViewProxy: scrollProxy)
}
```

- 위 버튼 예제에서 `overlay` 안의 컨텐츠를 위와 같이 바꾸고 별도의 `struct`로 분리합니다.
- `View`를 준수하는 `AlphabetNavigator` 구조체입니다.
- `ScrollViewProxy`는 `ScrollViewReader`의 프록시를 넘겨줍니다.

 

### **Step 2: AlphabetNavigator 뷰 구현**

```swift
struct AlphabetNavigator: View {
  let scrollViewProxy: ScrollViewProxy
  
  @GestureState private var dragLocation: CGPoint = .zero
  @State private var currentLetter = ""
  
  func dragObserver(title: String) -> some View {
    GeometryReader { geometry in
      dragObserver(geometry: geometry, title: title)
    }
  }

  func dragObserver(geometry: GeometryProxy, title: String) -> some View {
    if geometry.frame(in: .global).contains(dragLocation) {
      DispatchQueue.main.async {
        currentLetter = title
        
        withAnimation {
          scrollViewProxy.scrollTo(title, anchor: .top)
        }
      }
    }
    
    return Rectangle().fill(.clear)
  }
  
  var body: some View {
    VStack {
      ForEach(alphabet, id: \.self) { letter in
        HStack {
          Spacer()
          Text(letter)
            .font(.system(size: 18, weight: .semibold))
            .foregroundStyle(.cyan)
            .padding(.trailing, 7)
            .opacity(letter == currentLetter ? 0.3 : 1)
          .background(dragObserver(title: letter))
        }
      }
    }
    .gesture(
      DragGesture(minimumDistance: 0, coordinateSpace: .global)
        .updating($dragLocation) { value, state, _ in
          state = value.location
        }
    )
    .onChange(of: currentLetter) { _ in
      if currentLetter != "" {
        Vibration.light.vibrate()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(2)) {
          withAnimation {
            currentLetter = ""
          }
        }
      }
    }
  }
}

```

- `scrollViewProxy`: 스크롤 뷰 이동기능을 위한 프록시입니다.
- `dragLocation`: `@GestureState`를 사용해 현재 드래그중인 영역을 저장합니다.
- `currentLetter`: 현재 선택한 ID를 저장합니다. 선택된 알파벳을 서식 처리하고 진동을 울리기 위해 필요합니다.
- `dragObserver`: `GeometryReader`를 사용해 현재 드래그 위치가 리더가 제공하는 해당 영역에 있다면 스크롤 이동 명령을 실행합니다.
- `Text(letter) ...` : 액션을 외부 함수에서 실행하므로 버튼을 제거하고 텍스트만 남겨둡니다.
- `.opacity(letter == currentLetter ? 0.3 : 1)` : 현재 선택중이라면 불투명도를 낮춥니다(=> 더 투명해집니다.)
- `.background(dragObserver(title: letter))` : 배경으로 현재 위치에 있는 알파벳을 `dragObserver`로 넘깁니다.
    - `GeometryReader`를 배경에 배치한 것과 동일합니다.
- `onChange`: 현재 선택된 알파벳에 따라 진동을 울리고, 2초 뒤에 선택을 해제해서 계속 투명하게 보이지 않도록 합니다.
    - 참고: [Swift(스위프트): 아이폰 진동(Vibration, Haptic) 구현하기 上 (기초)](/posts/swift스위프트-아이폰-진동vibration-haptic-구현하기-上-기초/)

 

<!-- http://www.giphy.com/gifs/PywKnLLMIQPLM3RW1F -->
![](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3plOWFlN3N4YzJxOW01YWtjY3U0aTE0OWxueWVmeGF4ZG9pcGI3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/PywKnLLMIQPLM3RW1F/giphy.gif)

_탭뿐만 아니라 드래그로도 이동할 수 있습니다. 실제 기기라면 진동도 울립니다._

 

## **전체 코드**

<!-- https://gist.github.com/ayaysir/940e4af3d89302c48b1a591e1cf51227 -->
{% gist "940e4af3d89302c48b1a591e1cf51227" %}