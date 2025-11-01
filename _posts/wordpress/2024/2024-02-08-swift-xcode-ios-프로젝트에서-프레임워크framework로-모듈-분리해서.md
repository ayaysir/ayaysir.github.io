---
title: "Swift: Xcode iOS 프로젝트에서 프레임워크(Framework)로 모듈 분리해서 사용하는 방법"
date: 2024-02-08
categories: 
  - "DevLog"
  - "Swift"
---

### **소개**

iOS 프로젝트에서 어느 부분을 외부 프레임워크(Framework) 파일로 빼서 모듈로 사용하는 방법입니다.

모듈을 불러와 사용하는 방법은 `import` 키워드를 사용하는 것입니다.

```
import UIKit
import WebKit
import MapKit
```

 

예시로 아래와 같이 데이터가 있으면 그래프를 표시하는 앱을 만들었는데 그래프를 그려주는 부분(클래스 `GraphMaker`)은 앞으로 코드가 복잡해질 것 같아서 다른 곳에서 개발 및 관리하고 싶을 때가 있을 것입니다. 또 이러한 기능은 여러 앱에서 사용될 것 같은 경우 분리해두면 다른 앱 프로젝트에서도 재활용할 수 있습니다. 이 경우에 프레임워크로 분리하면 편리합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.41.48-복사본.jpg)

```
struct ExampleView: View {
    let data = [42, 15, 37, 93, 87, 51, 7, 14, 68, 88, 43]
    let maker = GraphMaker()
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("추세 그래프")
                .font(.title)
                .padding(.bottom, 10)
            Text(maker.draw(data))
        }
    }
}

#Preview {
    ExampleView()
}

```

```
class GraphMaker {
    /// 그래프를 그림
    func draw(_ data: [Int]) -> String {
        guard !data.isEmpty else {
            return ""
        }
        
        let maxValue = Double(data.max()! )
        let convertedData = data.map {
            Int(round(Double($0) / maxValue * 10))
        }
        
        var pivot: [Int: [Int]] = convertedData.enumerated().reduce([Int:[Int]]()) { pivot, elem in
            var pivot = pivot
            let (index, yPos) = elem
            pivot[yPos, default: []].append(index + 1)
            return pivot
        }
        
        return stride(from: 10, through: 1, by: -1).map { yPos in
            var progressX = 0
            return "🟫" + pivot[yPos, default: []].sorted().map { xIndex in
                let count = xIndex - progressX
                progressX = xIndex
                return String(repeating: "◽️", count: count - 1 ) + "⭐️"
            }.joined() + String(repeating: "◽️", count: max(data.count - progressX, 0))
        }.joined(separator: "\n") + "\n🟫\(String(repeating: "🟫", count: data.count))\n"
    }
}
```

- `GraphMaker` 클래스를 원래 프로젝트에서 제거한 뒤 외부 프레임워크로 옮길 것입니다.

 

#### **방법**

##### **Step 1: 프레임워크 프로젝트 생성**

- `New > Project... > iOS > Framework`를 클릭합니다.
- 정보를 입력한 후 프로젝트를 생성합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.44.00-복사본.jpg)

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.44.52-복사본.jpg)  ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.45.28-복사본.jpg)

- `Product Name`이 앞으로 `import`에서 사용할 프레임워크 이름이 됩니다.
    - `import GraphMaker`와 같이 사용하고 싶다면 `Product Name`을 `GraphMaker` 로 지정합니다.

 

생성하면 다음과 같은 프로젝트 창이 생깁니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.49.49-복사본.jpg)

헤더 파일이 있는데 Objective-C 관련 소스코드/디펜던시를 사용하는 경우에만 필요합니다.

 

##### **Step 2: 배포 버전 설정**

프로젝트 설정의 `Project`, `Targets`에서 배포할 iOS 버전을 선택합니다. 예를 들어 원래 프로젝트의 배포 버전이 `14.0`이라면 프레임워크의 배포 버전도 동일하거나 그 이하의 버전으로 선택합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.48.54-복사본.jpg)  ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.48.50-복사본.jpg)

 

##### **Step 3: 프레임워크 코드 작성 (또는 옮기기)**

원래 코드를 프레임워크로 옮긴 뒤 기존 프로젝트에서 제거합니다. 또는 새로운 코드를 프레임워크에 작성합니다.

**주의점**

- 모든 소스코드는 반드시 `[프로젝트명]` 폴더 내에 위치해야 합니다.  ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-7.52.54-복사본.jpg)
- 외부에서 사용할 클래스, 구조체, 메서드 등은 접근 제한자를 반드시 `public` 또는 `open`(클래스에만 해당)으로 설정합니다.

> **접근 제한자**
> 
> **private**: 해당 선언이 포함된 범위 내에서만 접근 가능합니다. 파일 내의 다른 타입에서도 접근이 가능하며, 기본적으로 최소한의 범위를 제공합니다. **fileprivate**: 해당 파일 내에서만 접근 가능하며, 같은 파일 내의 다른 타입에서도 접근할 수 있습니다. **internal**: 기본적인 접근 제어 수준으로, 해당 모듈 내에서만 접근 가능합니다. **public**: 해당 모듈 외부에서도 접근이 가능합니다. 다른 모듈에서도 해당 클래스나 멤버에 접근할 수 있습니다. **open**: `public`과 유사하지만, 상속된 클래스나 오버라이딩이 가능한 멤버에 대해 다른 모듈에서도 접근이 가능하게 합니다.

 

앞서 작성한 `GraphMaker` 클래스를 프레임워크 프로젝트로 옮기겠습니다. 기존 접근 제한자였던 `internal`(생략한 경우의 기본값)을 전부 `public`으로 변경합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.00.17-복사본.jpg)

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.25.59-복사본.jpg)

- **\[주의\]** 클래스를 외부에 공개하는 경우 클래스 선언부뿐만 아니라 **생성자**  및 내부 메서드도 전부 `public` 키워드를 사용해야 합니다.
    - 기본 생성자를 사용하더라도 `internal`로 지정되어 있기 때문에 외부에서 사용시 오류가 발생합니다. 반드시 `public`으로 지정해줘야 합니다.

`control + B` (또는 Xcode 상단의 재생모양 버튼)을 클릭해 빌드가 성공적으로 되는지 확인합니다. 빌드가 완료되면 프레임워크가 준비된 것입니다.

 

##### **Step 4: 기존 프로젝트에서 새로 만든 프레임워크 불러오기**

**(1) 반드시 프레임워크 프로젝트 창을 닫습니다.**

**(2)** 

다음 프로젝트 설정창의 `Targets`에서 `General > Frameworks, Libraries and Emb....` 를 찾습니다.

`[+]` 버튼을 클릭한 뒤 하단의 `Add Other... > Add Files...` 를 선택합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.13.19-복사본.jpg)

파일 선택창에서 프레임워크의 `.xcodeprj` 파일을 선택해 프레임워크 프로젝트를 불러옵니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.07.48-복사본.jpg)

 

**(3)**

왼쪽 프로젝트 내비게이터 창에 `Framework`라는 그룹과 함께 프레임워크 프로젝트가 추가되었는지 확인합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.16.22-복사본.jpg)

 

**(4)**

전에 진행했던 프로젝트 설정창의 `Targets`에서 `General > Frameworks, Libraries and Emb....` 으로 이동합니다. 아래처럼 목록이 비어있다면  `[+]` 버튼을 다시 클릭합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.18.47-복사본.jpg)

아래와 같이 `[프레임워크 이름].framework`가 목록에 있는지 확인한 뒤 추가합니다. 만약 없다면 (2) ~ (3) 번에서 안된 것일수 있으므로 다시 반복합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.18.58-복사본.jpg)

프레임워크가 추가되었는지 확인합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.19.40-복사본.jpg)

##### **Step 5: 외부 프레임워크를 import를 통해 사용**

다시 원래 프로젝트로 돌아오면 `GraphMaker`가 제거된 상태이므로 컴파일 오류가 발생합니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.21.31-복사본.jpg)

 

`import` 키워드를 사용해서 프레임워크를 불러옵니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.21.48-복사본.jpg)

```
import GraphMaker
```

 

다시 빌드하면 오류없이 동작하는 것을 확인할 수 있습니다.

 ![](/assets/img/wp-content/uploads/2024/02/스크린샷-2024-02-08-오후-8.33.53-복사본.jpg)
