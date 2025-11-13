---
title: "Swift UI: iOS 앱 프로젝트 Swift UI로 시작하기 (Xcode)"
date: 2020-01-21
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

 Swift Swift UI

 

#### 새 프로젝트 만들기

- File > New > Project > iOS > Single App View

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-21-pm-9.42.06.png)

User Interface에서 SwiftUI를 선택합니다.

 

Swift UI에서 주요 내용은 ContentView.swift 에서 진행됩니다. 근거는 SceneDelegate.swift 에 있습니다.

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-21-pm-9.43.59.png)

 

ContentView.swift에서 아래 부분에 주요 내용이 들어갑니다.

```swift
struct ContentView: View {
    var body: some View {
        
         Text("Hell, World!")
        
    }
}
```

 

**Control + 마우스 왼쪽**을 누르면 각종 메뉴를 볼 수 있습니다. (VStack, HStack 등)

 

#### 텍스트

```swift
Text("Turtle rock")
                .font(.largeTitle)
                .fontWeight(.light)
                .foregroundColor(Color.red)
```

Inspector에서 조정 가능합니다.

 

#### VStack

세로로 쌓는 기능입니다.

 

#### 새로운 Swift UI 파일 생성

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-21-pm-9.49.39.png)

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-21-pm-9.50.06.png)

 

#### 이미지 추가

Assets.xcassets에 드래그해서 추가합니다.

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-21-pm-9.51.56.png)

 

#### CircleImage.swift

```swift
import SwiftUI

struct CircleImage: View {
    var body: some View {
        Image("pexels")
            .frame(width: 300, height: 300)
            .clipShape(Circle())
            .overlay(Circle().stroke(Color.gray, lineWidth: 2))
            .shadow(radius: 10)
        
        
    }
}

struct CircleImage_Previews: PreviewProvider {
    static var previews: some View {
        CircleImage()
    }
}
```

 

#### MapView.swift

```swift
import SwiftUI
import MapKit

struct MapView: UIViewRepresentable {
    func makeUIView(context: UIViewRepresentableContext) -> MKMapView {
        
        MKMapView()
    }
    
    func updateUIView(_ uiView: MKMapView, context: UIViewRepresentableContext) {
        // Put the code to update the uikit view
        let coordinate = CLLocationCoordinate2D(latitude: 34.011286, longitude: -116.166868)
        let span = MKCoordinateSpan(latitudeDelta: 2.0, longitudeDelta: 2.0)
        let region = MKCoordinateRegion(center: coordinate, span: span)
        uiView.setRegion(region, animated:true)
    }
}

struct MapView_Previews: PreviewProvider {
    static var previews: some View {
        MapView()
    }
}
```

 

#### 최종 ContentView.swift

앞에 만든 서클뷰, 맵뷰를 포함시킴

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        
        VStack {
            
            // Map
            MapView()
                .frame(height: 300)
                .edgesIgnoringSafeArea(.top)
            
            // Image
            CircleImage()
                .offset(y: -130)
                .padding(.bottom, -130)
            
            // Text
            VStack(alignment: .leading) {
                Text("Turtle rock")
                .font(.largeTitle)
                .fontWeight(.light)
                .foregroundColor(Color.red)
                HStack {
                    Text("Hell, World!").font(.subheadline)
                    Spacer()
                    Text("California").font(.subheadline)
                }
            }.padding()
            Spacer()
        }
        
        
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

 ![](/assets/img/wp-content/uploads/2020/01/screenshot-2020-01-21-pm-10.00.43.png)

{% youtube "https://www.youtube.com/watch?v=IIDiqgdn2yo" %}
