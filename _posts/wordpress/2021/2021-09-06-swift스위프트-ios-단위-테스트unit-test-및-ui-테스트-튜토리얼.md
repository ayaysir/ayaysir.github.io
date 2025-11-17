---
title: "Swift(스위프트): iOS 단위 테스트(Unit test) 및 UI 테스트 튜토리얼"
date: 2021-09-06
categories: 
  - "DevLog"
  - "Swift"
---

#### **원문**

- [iOS Unit Testing and UI Testing Tutorial](https://www.raywenderlich.com/21020457-ios-unit-testing-and-ui-testing-tutorial)

 

#### **버전**

- Swift 5, iOS 14, Xcode 12

 

### **iOS 단위 테스트(Unit test) 및 UI 테스트 튜토리얼**

iOS 단위 테스트는 거창하지 않지만 테스트를 통해 앱이 버그투성이 쓰레기 조각이 되는것을 방지할 수 있으므로 필요합니다. 이 튜토리얼을 읽고 있다면 코드와 UI에 대한 테스트를 작성해야 한다는 것을 이미 알고 있지만 방법을 모를 수도 있습니다.

작동하는 앱이 있지만 앱을 확장하기 위해 수행하는 변경 사항을 테스트하고 싶을 수 있습니다.. 또는 이미 테스트를 작성했지만 올바른 테스트인지 확신하지 못할 수 있습니다. 또는 새 앱의 작업을 시작했고 진행하면서 테스트하고 싶을 수 있습니다.

이 튜토리얼에서는 다음을 수행하는 방법을 보여줍니다.

- Xcode의 테스트 내비게이터를 사용하여 앱의 모델 및 비동기 메서드 테스트
- 스텁(stub) 및 목(mock)을 사용하여 라이브러리 또는 시스템 오브젝트와의 가짜 상호 작용
- UI 및 성능 테스트
- 코드 커버리지(coverage) 도구 사용

 

#### **시작하기**

[프로젝트 자료(구글 드라이브)](https://drive.google.com/file/d/1BL97B3HpompHuXZS7Tq4hdOujVXpwqWW/view?usp=sharing)를 다운로드하세요. 여기에는 [UIKit Apprentice](https://store.raywenderlich.com/products/ios-apprentice)의 샘플 앱을 기반으로 하는 프로젝트 BullsEye가 포함됩니다. 이것은 간단한 운빨 게임입니다. 게임의 로직은 이 튜토리얼에서 테스트할 BullsEyeGame 클래스에 있습니다.

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-06-pm-5.17.27.jpg)  ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-06-pm-5.19.53.jpg)

시작하기 전에 이 게임 앱에 대한 이해가 필요합니다. 첫 번째 모드(slide)만 설명하면, 랜덤으로 1부터 100 사이의 랜덤 숫자가 제공됩니다. 이 숫자가 어디쯤 위치할 지 추측해서 해당 숫자의 위치로 슬라이드 버튼을 움직입니다. 결과를 확인해서 해당 숫자와 완전히 일치하면 100점, 그 외에 최대한 가까울수록 높은 점수를 받는 시스템입니다.

기술적인 특이사항으로는 랜덤 숫자를 인터넷 API를 통해 받아온다는 점입니다.

 

다음은 이 앱의 주요 코드입니다.

##### **BullsEyeGame.swift**

```swift
import Foundation

class BullsEyeGame {
  var round = 0
  let startValue = 50
  var targetValue = 50
  var scoreRound = 0
  var scoreTotal = 0

  var urlSession: URLSessionProtocol = URLSession.shared

  init() {
    startNewGame()
  }

  func startNewGame() {
    round = 1
    scoreTotal = 0
  }

  func startNewRound(completion: @escaping () -> Void) {
    round += 1
    scoreRound = 0
    getRandomNumber { newTarget in
      self.targetValue = newTarget
      DispatchQueue.main.async {
        completion()
      }
    }
  }

  @discardableResult
  func check(guess: Int) -> Int {
    let difference = guess - targetValue
    // let difference = abs(targetValue - guess)
    scoreRound = 100 - difference
    scoreTotal += scoreRound
    return difference
  }

  func getRandomNumber(completion: @escaping (Int) -> Void) {
    guard let url = URL(string: "http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1") else {
      return
    }
    let task = urlSession.dataTask(with: url) { data, _, error in
      do {
        guard
          let data = data,
          error == nil,
          let newTarget = try JSONDecoder().decode([Int].self, from: data).first
        else {
          print("에러가 발생했습니다.", error?.localizedDescription ?? "")
          return
        }
        completion(newTarget)
      } catch {
        print("Decoding of random numbers failed.")
      }
    }
    task.resume()
  }
}

```

- 이 코드에서는 의도적으로 틀린 부분이 있으며 해당 부분에 대해선 후술됩니다.

 

#### **테스트할 대상 파악**

테스트를 작성하기 전에 기본 사항을 아는 것이 중요합니다. 테스트하려면 무엇이 필요할까요?

기존 앱을 확장하는 것이 목표라면 먼저 변경할 구성 요소에 대한 테스트를 작성해야 합니다.

일반적으로 테스트는 다음을 포함해야 합니다.

- 핵심 기능: 모델 클래스, 메서드 및 컨트롤러와의 상호 작용
- 가장 일반적인 UI 워크플로(workflow)
- 경계 조건 (Boundary conditions)
- 버그 수정

 

##### **테스트를 위한 모범 사례 이해**

`FIRST`라는 약어는 효과적인 단위 테스트를 위한 간결한 기준 세트를 설명합니다. 해당 기준은 다음과 같습니다.

- Fast(빠름): 테스트가 빠르게 실행되어야 합니다.
- Independent/Isolated(고립됨): 테스트는 서로 상태를 공유해서는 안 됩니다.
- Repeatable(반복적): 테스트를 실행할 때마다 동일한 결과를 얻어야 합니다. 외부 데이터 공급자(external data provider) 또는 동시성(concurrency) 문제로 인해 간헐적인 오류가 발생할 수 있습니다.
- Self-validating(자가 검증): 테스트는 완전히 자동화되어야 합니다. 출력은 로그 파일에 대한 프로그래머의 해석에 의존하지 않고 "`통과`" 또는 "`실패`"여야 합니다.
- Timely(적시): 이상적으로는 테스트하는 프로덕션 코드를 작성하기 전에 테스트를 작성해야 합니다. 이를 테스트 주도 개발(TDD)이라고 합니다.

FIRST 원칙을 따르면 테스트가 앱의 장애물이 되는 것이 아니라 앱을 명확하고 유용하게 유지할 수 있게 됩니다.

 

<!-- \[the\_ad id="1801"\] -->

 

#### **Xcode의 단위 테스트**

테스트 내비게이터는 테스트 작업을 위한 가장 쉬운 방법을 제공합니다. 이를 사용하여 테스트 대상을 만들고 앱에 대해 테스트를 실행합니다.

 

##### **단위 테스트 대상 만들기**

`BullsEye` 프로젝트를 열고 `command-6`을 눌러 테스트 내비게이터(test navigator)를 엽니다.

왼쪽 하단 모서리에서 `+`를 클릭한 다음 메뉴에서 `New Unit Test Target...`을 선택합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_1_Introduction_NewUnitTestTarget_annotated-1-356x500-1.png)

 ![](/assets/img/wp-content/uploads/2021/09/screenshot-2021-09-06-pm-5.36.50.jpg)

 

기본 이름인 `BullsEyeTests`를 수락하고 프로젝트 조직 식별자를 입력합니다. 테스트 내비게이터에 테스트 번들이 나타나면 펼침 삼각형을 클릭하여 확장하고 `BullsEyeTests`를 클릭하여 편집기에서 엽니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_2_Introduction_TestFile_annotated-650x260-1.png)

 

기본 템플릿은 테스트 프레임워크 `XCTest`를 `import`하고 `setUpWithError()`, `tearDownWithError()` 및 예제 테스트 메서드를 사용하여 `XCTestCase`의 하위 클래스 `BullsEyeTests` 를 정의합니다.

 

다음 세 가지 방법으로 테스트를 실행할 수 있습니다.

- `Product` ▸ `Test` 또는 `command-U`: 둘 다 모든 테스트 클래스를 실행합니다.
- 테스트 내비게이터에서 화살표 버튼을 클릭합니다.
- 코드라인 부분에 있는 다이아몬드 버튼을 클릭합니다.

 

 ![](/assets/img/wp-content/uploads/2021/09/tests_3_Introduction_RunningTest_annotated-650x169-1.png)

샘플 테스트는 아직 아무 작업도 수행하지 않으므로 매우 빠르게 실행됩니다!

모든 테스트가 성공하면 다이아몬드가 녹색으로 바뀌고 확인 표시가 나타납니다. `testPerformanceExample()` 끝에 있는 회색 다이아몬드를 클릭하여 성능 결과 창을 엽니다.

 

 ![](/assets/img/wp-content/uploads/2021/09/tests_4_Intorduction_PerformanceTest-650x247-1.png)

 

이 튜토리얼에서는 `testPerformanceExample()` 또는 `testExample()`이 필요하지 않으므로 삭제해도 무방합니다.

 

##### **`XCTAssert`를 사용하여 모델 테스트**

먼저 `XCTAssert` 함수를 사용하여 `BullsEye` 모델의 핵심 기능을 테스트할 것입니다. `BullsEyeGame`이 라운드의 점수를 올바르게 계산하고 있을까요?

`BullsEyeTest.swift`에서 `import XCTest` 아래에 다음 줄을 추가합니다.

```
@testable import BullsEye
```

- `@testable` - 낮은 접근 권한을 가지는 클래스의 접근 권한을 테스트 수행을 위해 높이는 역할을 합니다.

이를 통해 단위 테스트는 `BullsEye`의 내부 유형 및 기능에 액세스할 수 있습니다.

`BullsEyeTests` 상단에 다음 속성을 추가합니다.

```
var sut: BullsEyeGame!
```

이것은 `BullsEyeGame`에 대한 플레이스홀더인 테스트 중인 시스템(`SUT`; System Under Test) 또는 테스트 클래스의 객체를 생성합니다.

다음으로 `setUpWithError()`의 내용을 다음과 같이 바꿉니다.

```
try super.setUpWithError()
sut = BullsEyeGame()
```

이것은 클래스 수준에서 `BullsEyeGame`을 생성하므로 이 테스트 클래스의 모든 테스트는 `SUT` 개체의 속성 및 메서드에 액세스할 수 있습니다.

테스트가 끝나면 반드시 `SUT` 객체를 해제해야 합니다. `tearDownWithError()`의 내용을 다음으로 바꿉니다.

```
sut = nil
try super.tearDownWithError()

```

> `setUpWithError()`에서 `SUT`를 만들고 `tearDownWithError()`에서 해제하여 모든 테스트가 깨끗한 상태로 시작되도록 하는 것이 좋습니다.

 

#### **첫 번째 테스트 작성**

이제 첫 번째 테스트를 작성할 준비가 되었습니다!

`BullsEyeTests` 끝에 다음 코드를 추가하여 `guess`에 대한 예상 점수를 제대로 계산하는지 테스트합니다.

```swift
func testScoreIsComputedWhenGuessIsHigherThanTarget() throws {
  // given
  let guess = sut.targetValue + 5
  
  // when
  sut.check(guess: guess)
  
  // then
  XCTAssertEqual(sut.scoreRound, 95, "guess로 계산된 점수가 잘못되었습니다.")
}
```

테스트 메서드의 이름은 항상 `test`로 시작하고 그 뒤에 테스트 대상에 대한 설명을 적습니다.

테스트 형식을 `given`(주어진), `when`(언제), `then`(그 다음) 섹션으로 지정하는 것이 좋습니다.

1. `given` - 여기에서 필요한 값을 설정합니다. 이 예에서는 `guess` 값을 생성하여 `targetValue`와 차이가 얼마나 나는지 지정할 수 있습니다.
2. `when` - 이 섹션에서는 테스트 중인 코드를 실행합니다. `check(guess:)`를 호출합니다.
3. `then` - 테스트가 실패하면 인쇄되는 메시지와 함께 예상한 결과를 주장하는 섹션입니다. 이 경우 `sut.scoreRound`는 `100 - 5`이므로 `95`와 같아야 합니다.

 

코드라인 부분 또는 테스트 탐색기에서 다이아몬드 아이콘을 클릭하여 테스트를 실행합니다.이렇게 하면 앱이 빌드되고 실행되며 다이아몬드 아이콘이 녹색 체크 표시로 바뀝니다! 또한 다음과 같은 성공을 나타내는 일시적 팝업이 Xcode 위에 표시되는 것을 볼 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_5_FirstTest_Success-319x320-1.png)

> XCTestAssertions의 전체 목록을 보려면 Apple의 [Assertions Listed by Category](https://developer.apple.com/documentation/xctest#2870839)로 이동하세요.

 

##### **테스트 디버깅**

의도적으로 `BullsEyeGame`에 내장된 버그가 있으며, 지금 그것을 찾는 연습을 할 것입니다. 버그가 작동하는지 확인하기 위해 주어진 섹션의 `targetValue`에서 `5`를 빼고 나머지는 모두 그대로 두는 테스트를 생성합니다.

다음 테스트를 추가합니다.

```swift
func testScoreIsComputedWhenGuessIsLowerThanTarget() {
  // given
  let guess = sut.targetValue - 5

  // when
  sut.check(guess: guess)

  // then
  XCTAssertEqual(sut.scoreRound, 95, "guess로 계산된 점수가 잘못되었습니다.")
}

```

`guess`과 `targetValue`의 차이는 여전히 `5`이므로 점수는 여전히 `95`여야 합니다.

Breakpoint navigator(단축키 `command-8`)에서 테스트 실패 중단점(breakpoint)을 추가합니다. 이것은 테스트 메소드가 실패 어서션(Failure Assertion)을 보낼 때 테스트 실행을 중지합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_6_Debugging_Breakpoint_annotated-356x500-1.png)

테스트를 실행하면 테스트 실패와 함께 `XCTAssertEqual` 라인에서 중지되어야 합니다.

디버그 콘솔에서 `sut` 및 `guess`를 검사합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_7_Debugging_Console_annotated-650x391-1.png)

`guess`는 `targetValue - 5`이지만 `scoreRound`는 `95`가 아니라 `105`입니다!

더 자세히 조사하려면 일반 디버깅 프로세스를 사용하세요. `when` 문에 중단점을 설정하고 `check(guess:)` 내부의 `BullsEyeGame.swift`에도 중단점을 설정합니다. 여기서 차이(`difference`)가 발생합니다. 그런 다음 테스트를 다시 실행하고 `let difference` 문을 단계별로 실행하여 앱의 `difference` 값을 검사합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_8_Debugging_Console2_annotated-589x500-1.png)

문제는 `difference`가 음수이므로 점수가 `100 - (-5)`라는 것입니다. 이를 수정하려면 `difference`의 절대값을 사용해야 합니다. `check(guess:)`에서 올바른 줄의 주석을 제거하고 잘못된 줄을 삭제하십시오.

두 개의 중단점을 제거하고 테스트를 다시 실행하여 이제 성공했는지 확인합니다.

```
let difference = abs(targetValue - guess)
```

 

<!-- \[the\_ad id="1801"\] -->

 

##### **`XCTestExpectation`을 사용하여 비동기 작업(Asynchronous Operations) 테스트**

모델을 테스트하고 테스트 실패를 디버그하는 방법을 배웠으므로 이제 비동기 코드 테스트로 넘어갈 차례입니다.

`BullsEyeGame`은 `URLSession`을 사용하여 다음 게임의 대상으로 임의의 숫자를 가져옵니다. `URLSession` 메서드는 비동기 방식입니다. 즉시 반환되지만 실행이 완료되지는 않습니다. 비동기식 메서드를 테스트하려면 `XCTestExpectation`을 사용하여 비동기식 작업이 완료될 때까지 테스트를 기다려야 합니다.

비동기 테스트는 일반적으로 느리므로 더 빠른 단위 테스트와 별도로 격리해야 합니다.

`BullsEyeSlowTests`라는 새 단위 테스트 대상을 만듭니다. 새로운 테스트 클래스 `BullsEyeSlowTests`를 열고 기존 `import` 문 바로 아래에 `BullsEye` 앱 모듈을 가져옵니다.

```
@testable import BullsEye
```

이 클래스의 모든 테스트는 기본 `URLSession`을 사용하여 요청을 전송하므로 `sut`를 선언하고 `setUpWithError()`에서 생성하고 `tearDownWithError()`에서 해제합니다. 이렇게 하려면 `BullsEyeSlowTests`의 내용을 다음으로 바꾸세요.

```
var sut: URLSession!

override func setUpWithError() throws {
  try super.setUpWithError()
  sut = URLSession(configuration: .default)
}

override func tearDownWithError() throws {
  sut = nil
  try super.tearDownWithError()
}
```

 

다음으로 이 비동기 테스트를 추가합니다.

```
// Asynchronous test: success fast, failure slow
func testValidApiCallGetsHTTPStatusCode200() throws {
  // given
  let urlString = 
    "http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1"
  let url = URL(string: urlString)!
  // 1
  let promise = expectation(description: "Status code: 200")

  // when
  let dataTask = sut.dataTask(with: url) { _, response, error in
    // then
    if let error = error {
      XCTFail("Error: \(error.localizedDescription)")
      return
    } else if let statusCode = (response as? HTTPURLResponse)?.statusCode {
      if statusCode == 200 {
        // 2
        promise.fulfill()
      } else {
        XCTFail("Status code: \(statusCode)")
      }
    }
  }
  dataTask.resume()
  // 3
  wait(for: [promise], timeout: 5)
}
```

이 테스트는 유효한 요청을 보낼 때 `200` 상태 코드를 반환하는지 확인합니다. 대부분의 코드는 다음 추가 행을 제외하고 앱에 작성하는 것과 동일합니다.

1. `expectation(description:)` - `promise`에 저장된 `XCTestExpectation`을 반환합니다. 설명은 예상되는 상황을 설명합니다.
2. `promise.fulfill()` - 비동기 메서드 완료 핸들러의 성공 조건 클로저에서 이것을 호출하여 `expectation`이 충족되었음을 플래그로 표시합니다.
3. `wait(for:timeout:)` - 모든 `expectation`이 충족되거나 시간 초과 간격(`timeout`)이 끝날 때까지 중 먼저 발생하는 시점까지 테스트를 계속 실행합니다

테스트를 실행합니다. 인터넷에 연결된 경우 시뮬레이터에서 앱이 로드된 후 테스트가 성공하는 데 약 1초가 걸립니다.

 

##### **빠른 실패**

테스트 실패를 경험하려면 `testValidApiCallGetsHTTPStatusCode200()`의 `URL`을 잘못된 URL로 변경하기만 하면 됩니다.

```
let url = URL(string: "http://www.notexistrandomnumberapi.con/test")!

```

테스트를 실행합니다. 실패하지만 전체 `timeout`만큼 시간이 걸립니다! 이는 요청(request)이 항상 성공할 것이라고 가정했기 때문입니다. 그 부분에서 `promise.fulfill()`을 호출했습니다. 요청이 실패했기 때문에 제한 시간이 만료되었을 때만 테스트가 완료되었습니다.

가정을 변경하여 이를 개선하고 테스트가 더 빨리 실패하도록 할 수 있습니다. 요청이 성공할 때까지 기다리는 대신 비동기 메서드의 완료 핸들러가 호출될 때까지 기다리세요. 이는 앱이 서버로부터 응답(OK 또는 오류)을 수신하는 즉시 발생하며, 이는 `expectation`을 충족합니다. 그러면 테스트에서 요청이 성공했는지 여부를 확인할 수 있습니다.

이것이 어떻게 작동하는지 보려면 새 테스트를 만들어야 합니다. 그 전에 먼저 url에 대한 변경 사항을 취소하여 이전 테스트를 수정하세요.

그런 다음 클래스에 다음 테스트를 추가합니다.

```swift
func testApiCallCompletes() throws {
  // given
  let urlString = "http://www.notexistrandomnumberapi.con/test"
  let url = URL(string: urlString)!
  let promise = expectation(description: "Completion handler invoked")
  var statusCode: Int?
  var responseError: Error?

  // when
  let dataTask = sut.dataTask(with: url) { _, response, error in
    statusCode = (response as? HTTPURLResponse)?.statusCode
    responseError = error
    promise.fulfill()
  }
  dataTask.resume()
  wait(for: [promise], timeout: 5)

  // then
  XCTAssertNil(responseError)
  XCTAssertEqual(statusCode, 200)
}
```

주요 차이점은 `complete handler`를 입력하기만 하면 `expectation`이 충족되고 이 작업이 수행되는 데 약 1초밖에 걸리지 않는다는 것입니다. 요청이 실패하면 Assertion이 실패합니다.

테스트를 실행합니다. 이제 실패하는 데 약 1초가 걸립니다. 테스트 실행이 시간 초과를 초과했기 때문이 아니라 '요청이 실패했기 때문'에 실패합니다.

url을 수정한 다음 테스트를 다시 실행하여 이제 성공하는지 확인합니다.

 

##### **조건부 실패**

어떤 상황에서는 테스트를 실행하는 것이 별로 의미가 없습니다. 예를 들어 `testValidApiCallGetsHTTPStatusCode200()`이 네트워크 연결 없이 실행되면 어떻게 될까요? 물론 200 상태 코드를 받지 못하기 때문에 통과해서는 안 됩니다. 그러나 아무 것도 테스트하지 않았기 때문에 실패해서는 안됩니다.

다행히 Apple은 전제 조건이 실패할 때 테스트를 건너뛰기 위해 `XCTSkip`을 도입했습니다. `sut` 선언 아래에 다음 라인을 추가합니다.

```
let networkMonitor = NetworkMonitor.shared
```

`NetworkMonitor`는 `NWPathMonitor`를 래핑하여 네트워크 연결을 확인하는 편리한 방법을 제공합니다.

`testValidApiCallGetsHTTPStatusCode200()`에서 테스트 시작 부분에 `XCTskipUnless`를 추가합니다.

```
try XCTSkipUnless(
  networkMonitor.isReachable, 
  "Network connectivity needed for this test.")
```

`XCTskipUnless(_:_:)`는 연결할 수 있는 네트워크가 없을 때 테스트를 건너뜁니다. 네트워크 연결을 비활성화하고 테스트를 실행하여 이를 확인하세요. 테스트 옆의 여백에 테스트가 통과하거나 실패하지 않았음을 나타내는 새 아이콘이 표시됩니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_9_Skipping-650x84-1.png)

네트워크 연결을 다시 활성화하고 테스트를 다시 실행하여 정상적인 조건에서 여전히 성공하는지 확인하세요. `testApiCallCompletes()`의 시작 부분에 동일한 코드를 추가합니다.

 

<!-- \[the\_ad id="1801"\] -->

 

#### **가짜 객체(Faking object)와 상호 작용**

비동기 테스트는 코드가 비동기 API에 대한 올바른 입력을 생성한다는 확신을 줍니다. 또한 `URLSession`에서 입력을 수신할 때 코드가 올바르게 작동하는지 또는 `UserDefaults` 데이터베이스 또는 iCloud 컨테이너를 올바르게 업데이트하는지 테스트할 수도 있습니다.

대부분의 앱은 시스템 또는 라이브러리 객체(당신이 제어하지 않는 객체)와 상호 작용합니다. 이러한 객체와 상호 작용하는 테스트는 느리고 반복할 수 없으며 두 가지 FIRST 원칙을 위반할 수 있습니다. 대신 스텁(stub)에서 입력을 받거나 모의 객체(mock objects)를 업데이트하여 상호 작용을 가짜로 만들 수 있습니다.

코드에 시스템 또는 라이브러리 개체에 대한 종속성이 있는 경우 가짜를 사용합니다. 그 역할을 할 가짜 객체를 만들고 이 가짜를 코드에 주입하면 됩니다.

 

##### **스텁에서 가짜 입력**

이제 앱의 `getRandomNumber(completion:)`가 세션에서 다운로드한 데이터를 올바르게 구문 분석하는지 확인합니다. 스텁 데이터로 `BullsEyeGame` 세션을 가짜로 만들 것입니다.

테스트 탐색기(`command-6`)로 이동하여 `+`를 클릭하고 `New Unit Test Class…`를 선택합니다. 이름을 `BullsEyeFakeTests`로 지정하고 `BullsEyeTests` 디렉토리에 저장하고 대상을 `BullsEyeTests`로 설정하세요.

 ![](/assets/img/wp-content/uploads/2021/09/tests_10_Stub_NewTestClass_annotated-424x500-1.png)

`import` 문 바로 아래에 있는 `BullsEye` 앱 모듈을 가져옵니다.

```
@testable import BullsEye
```

 

이제 `BullsEyeFakeTests`의 내용을 다음으로 바꿉니다.

```
var sut: BullsEyeGame!

override func setUpWithError() throws {
  try super.setUpWithError()
  sut = BullsEyeGame()
}

override func tearDownWithError() throws {
  sut = nil
  try super.tearDownWithError()
}
```

 

이것은 `BullsEyeGame`인 `SUT`를 선언하고 `setUpWithError()`에서 생성하고 `tearDownWithError()`에서 해제합니다.

`BullsEye` 프로젝트에는 지원 파일인 `URLSessionStub.swift`가 포함되어 있습니다. 이것은 URL로 데이터 작업을 생성하는 메소드와 함께 `URLSessionProtocol`이라는 간단한 프로토콜을 정의합니다. 또한 이 프로토콜을 준수하는 `URLSessionStub`을 정의합니다. 이니셜라이저를 사용하면 데이터 작업이 반환해야 하는 데이터, 응답 및 오류를 정의할 수 있습니다.

 

가짜를 설정하려면 `BullsEyeFakeTests.swift`로 이동하여 새 테스트를 추가하세요.

```swift
func testStartNewRoundUsesRandomValueFromApiRequest() {
  // given
  // 1
  let stubbedData = "[1]".data(using: .utf8)
  let urlString = 
    "http://www.randomnumberapi.com/api/v1.0/random?min=0&max=100&count=1"
  let url = URL(string: urlString)!
  let stubbedResponse = HTTPURLResponse(
    url: url, 
    statusCode: 200, 
    httpVersion: nil, 
    headerFields: nil)
  let urlSessionStub = URLSessionStub(
    data: stubbedData,
    response: stubbedResponse, 
    error: nil)
  sut.urlSession = urlSessionStub
  let promise = expectation(description: "Value Received")

  // when
  sut.startNewRound {
    // then
    // 2
    XCTAssertEqual(self.sut.targetValue, 1)
    promise.fulfill()
  }
  wait(for: [promise], timeout: 5)
}
```

이 테스트는 두 가지 작업을 수행합니다.

1. 가짜 데이터와 응답을 설정하고 가짜 세션 객체를 만듭니다. 마지막으로 `sut`의 속성으로서 가짜 세션을 앱에 주입합니다.
2. 스텁이 비동기 메서드인 것처럼 가장하기 때문에 여전히 이것을 비동기 테스트로 작성해야 합니다. `startNewRound(completion:)` 호출이 `targetValue`와 스텁된 가짜 번호를 비교하여 가짜 데이터를 구문 분석하는지 확인합니다.

테스트를 실행합니다. 실제 네트워크 연결이 없기 때문에 꽤 빨리 성공해야 합니다!

 

##### **모의 객체(mock object)로 가짜 업데이트**

이전 테스트에서는 스텁을 사용하여 가짜 개체의 입력을 제공했습니다. 다음으로 모의 객체를 사용하여 코드가 `UserDefaults`를 올바르게 업데이트하는지 테스트합니다.

이 앱에는 두 가지 게임 스타일이 있습니다. 사용자는 다음 중 하나를 수행할 수 있습니다.

1. 슬라이더를 이동하여 목표 값에 맞춥니다(게임의 `Slide` 탭).
2. 슬라이더 위치에서 목표 값을 추측합니다(게임의 `Type` 탭).

오른쪽 하단 모서리에 있는 분할된 컨트롤은 게임 스타일을 전환하고 이를 `UserDefaults`에 저장합니다.

다음 테스트에서는 앱이 `gameStyle` 속성을 올바르게 저장하는지 확인합니다.

대상 `BullsEyeTests`에 새 테스트 클래스를 추가하고 이름을 `BullsEyeMockTests`로 지정합니다. `import` 문 아래에 다음을 추가합니다.

```
@testable import BullsEye

class MockUserDefaults: UserDefaults {
  var gameStyleChanged = 0
  override func set(_ value: Int, forKey defaultName: String) {
    if defaultName == "gameStyle" {
      gameStyleChanged += 1
    }
  }
}
```

`MockUserDefaults`는 `set(_:forKey:)`를 재정의하여 `gameStyleChanged`를 증가시킵니다. 다른 유사한 테스트는 종종 `Bool` 변수를 설정하지만 `Int` 값을 증가시키면 더 많은 유연성을 제공합니다. 예를 들어 테스트에서 앱이 메서드를 한 번만 호출하는지 확인할 수 있습니다.

다음으로 `BullsEyeMockTests`에서 `SUT`와 모의 객체를 선언합니다.

```
var sut: ViewController!
var mockUserDefaults: MockUserDefaults!

```

 

`setUpWithError()` 및 `tearDownWithError()`를 다음으로 교체합니다.

```swift
override func setUpWithError() throws {
  try super.setUpWithError()
  sut = UIStoryboard(name: "Main", bundle: nil)
    .instantiateInitialViewController() as? ViewController
  mockUserDefaults = MockUserDefaults(suiteName: "testing")
  sut.defaults = mockUserDefaults
}

override func tearDownWithError() throws {
  sut = nil
  mockUserDefaults = nil
  try super.tearDownWithError()
}

```

이것은 `SUT`와 모의 객체를 생성하고 모의 객체를 `SUT`의 속성으로 주입합니다.

이제 템플릿의 두 가지 기본 테스트 방법을 다음으로 바꿉니다.

```swift
func testGameStyleCanBeChanged() {
  // given
  let segmentedControl = UISegmentedControl()

  // when
  XCTAssertEqual(
    mockUserDefaults.gameStyleChanged, 
    0, 
    "gameStyleChanged should be 0 before sendActions")
  segmentedControl.addTarget(
    sut,
    action: #selector(ViewController.chooseGameStyle(_:)),
    for: .valueChanged)
  segmentedControl.sendActions(for: .valueChanged)

  // then
  XCTAssertEqual(
    mockUserDefaults.gameStyleChanged, 
    1, 
    "gameStyle user default wasn't changed")
}
```

 

`when` 어서션은 테스트 메서드가 분할된 컨트롤을 변경하기 전에 `gameStyleChanged` 플래그가 `0`인 경우입니다. 따라서 `then` 어서션도 참이면 `set(_:forKey:)` 가 정확히 한 번 호출되었음을 의미합니다.

테스트를 실행합니다. 성공해야 합니다.

 

<!-- \[the\_ad id="1801"\] -->

 

#### **Xcode에서 UI 테스트**

UI 테스트를 통해 사용자 인터페이스와의 상호 작용을 테스트할 수 있습니다. UI 테스트는 쿼리로 앱의 UI 개체를 찾고 이벤트를 합성한 다음 해당 개체에 이벤트를 보내는 방식으로 작동합니다. API를 사용하면 UI 개체의 속성 및 상태를 검사하여 예상 상태와 비교할 수 있습니다.

테스트 내비게이터(`command-6`)에서 `New UI Test Target`을 추가하세요. 테스트할 대상이 `BullsEye`인지 확인한 다음 기본 이름인 `BullsEyeUITests`를 수락합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_11_UITests_NewUITestTarget_annotated-345x500-1.png)

 

`BullsEyeUITests.swift`를 열고 `BullsEyeUITests` 클래스의 맨 위에 이 속성을 추가하세요.

```
var app: XCUIApplication!

```

 

`tearDownWithError()`를 제거하고 `setUpWithError()`의 내용을 다음으로 바꿉니다.

```
try super.setUpWithError()
continueAfterFailure = false
app = XCUIApplication()
app.launch()
```

 

두 개의 기존 테스트를 제거하고 `testGameStyleSwitch()`라는 새 테스트를 추가하세요.

```swift
func testGameStyleSwitch() {    
}
```

 

`testGameStyleSwitch()`에서 새 줄을 열고 편집기 창 하단에 있는 빨간색 기록 버튼을 클릭합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_12_UITests_Record_annotated-650x235-1.png)

그러면 상호 작용을 테스트 명령으로 기록하는 모드로 시뮬레이터에서 앱이 열립니다. 앱이 로드되면 게임 스타일 스위치(세그먼티드 컨트롤)의 Slide와 상단 레이블을 탭합니다. Xcode 기록 버튼을 다시 클릭하여 기록을 중지합니다.

 

이제 `testGameStyleSwitch()`에 다음 세 줄이 있습니다.

```
let app = XCUIApplication()
app.buttons["Slide"].tap()
app.staticTexts["Get as close as you can to: "].tap()

```

 

레코더는 앱에서 테스트한 것과 동일한 작업을 테스트하는 코드를 만들었습니다. 게임 스타일 세그먼티드 컨트롤과 상단 레이블에 탭 신호를 전송합니다. 이를 기반으로 사용하여 고유한 UI 테스트를 만들 수 있습니다. 다른 문장이 보이면 그냥 삭제하세요.

첫 번째 줄은 `setUpWithError()`에서 만든 속성을 복제하므로 해당 줄을 삭제합니다. 아직 아무 것도 탭할 필요가 없으므로 2행과 3행 끝에 있는 `.tap()`도 삭제합니다. 이제 `["Slide"]` 옆에 있는 작은 메뉴를 열고 `segmentedControls.buttons["Slide"]`를 선택합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_13_UITests_ChangeRecording-650x145-1.png)

 

레코더가 테스트에서 액세스할 수 있는 코드를 찾는 데 도움이 되도록 다른 객체를 탭합니다. 이제 해당 줄을 다음 코드로 교체하여 지정된 섹션을 만듭니다.

```
// given
let slideButton = app.segmentedControls.buttons["Slide"]
let typeButton = app.segmentedControls.buttons["Type"]
let slideLabel = app.staticTexts["Get as close as you can to: "]
let typeLabel = app.staticTexts["Guess where the slider is: "]

```

 

이제 세그먼티드 컨트롤의 두 버튼에 대한 이름과 두 개의 가능한 상단 레이블이 있으므로 아래에 다음 코드를 추가합니다.

```
// then
if slideButton.isSelected {
  XCTAssertTrue(slideLabel.exists)
  XCTAssertFalse(typeLabel.exists)

  typeButton.tap()
  XCTAssertTrue(typeLabel.exists)
  XCTAssertFalse(slideLabel.exists)
} else if typeButton.isSelected {
  XCTAssertTrue(typeLabel.exists)
  XCTAssertFalse(slideLabel.exists)

  slideButton.tap()
  XCTAssertTrue(slideLabel.exists)
  XCTAssertFalse(typeLabel.exists)
}

```

이렇게 하면 세그먼티드 컨트롤의 각 버튼을 탭()할 때 올바른 레이블이 존재하는지 확인합니다. 테스트를 실행하세요. 모든 어서션이 성공해야 합니다.

 

#### **성능 테스트**

- [Apple 문서](https://developer.apple.com/library/prerelease/content/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/04-writing_tests.html#//apple_ref/doc/uid/TP40014132-CH4-SW8)

성능 테스트는 평가하려는 코드 블록을 가져와서 10번 실행하여 실행에 대한 평균 실행 시간과 표준 편차를 수집합니다. 이러한 개별 측정값의 평균은 테스트 실행에 대한 값을 형성한 다음 기준선(baseline)과 비교하여 성공 또는 실패를 평가할 수 있습니다.

성능 테스트를 작성하는 것은 간단합니다. 측정하려는 코드를 `measure()`의 트레일링 클로저에 넣으면 됩니다. 또한 측정할 여러 메트릭을 지정할 수 있습니다.

`BullsEyeTests`에 다음 테스트를 추가하십시오.

```swift
func testScoreIsComputedPerformance() {
  measure(
    metrics: [
      XCTClockMetric(), 
      XCTCPUMetric(),
      XCTStorageMetric(), 
      XCTMemoryMetric()
    ]
  ) {
    sut.check(guess: 100)
  }
}
```

이 테스트는 여러 측정항목을 측정합니다.

- `XCTClockMetric`은 경과 시간을 측정합니다.
- `XCTCPUMetric`은 CPU 시간, 주기 및 명령어 수를 포함한 CPU 활동을 추적합니다.
- `XCTStorageMetric`은 테스트된 코드가 스토리지에 쓰는 데이터의 양을 알려줍니다.
- `XCTMemoryMetric`은 사용된 실제 메모리의 양을 추적합니다.

 

테스트를 실행한 다음 `measure()`의 트레일링 클로저의 시작 부분 옆에 나타나는 아이콘을 클릭하여 통계를 확인합니다. 메트릭 옆에 있는 선택한 메트릭을 변경할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_14_2_PerformanceTests_Result_annotated-650x246-1.png)

 

`Set Baseline`을 클릭하여 기준 시간을 설정합니다. 성능 테스트를 다시 실행하고 결과를 보세요. 기준보다 더 좋을 수도 있고 나쁠 수도 있습니다. `Edit` 버튼을 사용하면 기준선을 이 새 결과로 재설정할 수 있습니다.

기준선은 장치 구성별로 저장되므로 여러 장치에서 동일한 테스트를 실행할 수 있습니다. 각각은 특정 구성의 프로세서 속도, 메모리 등에 따라 다른 기준을 유지할 수 있습니다.

테스트 중인 메서드의 성능에 영향을 줄 수 있는 앱을 변경할 때마다 성능 테스트를 다시 실행하여 기준과 어떻게 비교되는지 확인합니다.

 

<!-- \[the\_ad id="1801"\] -->

 

#### **코드 커버리지(Code Coverage) 활성화**

코드 커버리지 도구는 테스트가 실제로 실행 중인 앱 코드를 알려 주기 때문에 앱의 어떤 부분이 아직 테스트되지 않았는지 알 수 있습니다.

코드 커버리지를 활성화하려면 `Scheme`의 Test action을 편집하고 `Options` 탭에서 다음을 위해 적용 범위 수집 확인란을 선택합니다.

(`Product` 메뉴 > `Scheme` > `Edit Scheme...` (단축키 `command + shift + <` )

 ![](/assets/img/wp-content/uploads/2021/09/tests_15_Coverage_GatherCoverage_annotated-650x351-1.png)

 

`command-U`로 모든 테스트를 실행한 다음 `command-9`로 보고서 탐색기를 엽니다. 해당 목록의 맨 위 항목 아래에 있는 `Coverage`를 선택합니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_16_Coverage_Log_annotated-650x159-1.png)

 

`BullsEyeGame.swift`의 메서드 및 클로저 목록을 보려면 펼침 삼각형을 클릭하세요.

 ![](/assets/img/wp-content/uploads/2021/09/tests_17_Coverage_Details-650x220-1.png)

 

`getRandomNumber(completion:)`로 스크롤하여 커버리지가 `95.0%`인지 확인합니다.

이 함수의 화살표 버튼을 클릭하여 함수에 대한 소스 파일을 엽니다. 오른쪽 사이드바에 있는 커버리지 어노테이션(coverage annotations) 위로 마우스를 가져가면 코드 섹션이 녹색 또는 빨간색으로 강조 표시됩니다.

 ![](/assets/img/wp-content/uploads/2021/09/tests_18_Coverage_Code-650x384-1.png)

커버리지 어노테이션은 테스트가 각 코드 섹션에 몇 번이나 적중했는지 보여줍니다. 호출되지 않은 섹션은 빨간색으로 강조 표시됩니다.

 

##### **100% 커버리지 달성?**

100% 코드 커버리지를 위해 얼마나 노력해야 할까요?  "100% unit test coverage"를 구글에 검색하면  "100% unit test coverage"의 정의에 대한 토론과 함께 이에 대한 다양한 주장을 찾을 수 있습니다. 반대 쪽은 마지막 10~15%는 노력할 가치가 없다고 말합니다. 찬성 쪽은 테스트하기가 너무 어렵기 _때문에_ 마지막 10%-15%가 가장 중요하다고 말합니다. [테스트할 수 없는 코드가 더 깊은 디자인 문제의 신호](https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters)라는 설득력 있는 주장을 찾으려면 "hard to unit test bad design"을 구글링하세요.

 

#### **이제 뭘 해야 하나요?**

이제 프로젝트에 대한 테스트를 작성하는 데 사용할 수 있는 몇 가지 훌륭한 도구를 습득하였습니다. 이 iOS 단위 테스팅 및 UI 테스팅 튜토리얼이 모든 것을 테스트할 수 있는 자신감을 드렸길 바랍니다!

다음은 추가 연구를 위한 몇 가지 리소스입니다.

- WWDC has several videos on the topic of testing. Two good ones from WWDC17 are: [Engineering for Testability](https://developer.apple.com/videos/play/wwdc2017/414/) and [Testing Tips & Tricks](https://developer.apple.com/videos/play/wwdc2018/417/).
- The next step is _automation_: _Continuous Integration_ and _Continuous Delivery_. Start with our tutorials [Continuous Integration With GitHub, Fastlane & Jenkins](https://www.raywenderlich.com/1774995-continuous-integration-with-github-fastlane-jenkins) and [Xcode Server for iOS: Getting Started](https://www.raywenderlich.com/12258400-xcode-server-for-ios-getting-started).Then, have a look at Apple’s [Automating the Test Process](https://developer.apple.com/library/content/documentation/DeveloperTools/Conceptual/testing_with_xcode/chapters/08-automation.html#//apple_ref/doc/uid/TP40014132-CH7-SW1) with Xcode Server and `xcodebuild`, and [Wikipedia’s continuous delivery article](https://en.wikipedia.org/wiki/Continuous_delivery), which draws on expertise from [ThoughtWorks](https://www.thoughtworks.com/continuous-delivery).
- If you already have an app but haven’t written tests for it yet, you might want to refer to [_Working Effectively with Legacy Code_ by Michael Feathers](https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052/ref=sr_1_1?s=books&ie=UTF8&qid=1481511568&sr=1-1), because code without tests _is_ legacy code!
- Jon Reid’s Quality Coding sample app archives are great for learning more about [Test-Driven Development](http://qualitycoding.org/tdd-sample-archives/).
