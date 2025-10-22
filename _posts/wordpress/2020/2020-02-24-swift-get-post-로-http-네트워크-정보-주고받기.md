---
title: "Swift: GET, POST 로 HTTP 네트워크 정보 주고받기"
date: 2020-02-24
categories: 
  - "DevLog"
  - "Swift"
tags: 
  - "swift"
---

출처: [바로가기](https://blog.naver.com/go4693/221401549375)

##### **Swift에서 GET, POST 로 HTTP 네트워크 정보 주고받기**

GET으로 받아오기는 `String(contentsOf: url!)`, POST로 전송은 `URLSession.shared.dataTask(with: request){...}`. 아래 코드는 Swift Playground에서 테스트 되었습니다.

```swift
import UIKit

// 메뉴 선택
let select = "delete"

do {
    
    func sendPost(paramText: String, urlString: String) {
        // paramText를 데이터 형태로 변환
        let paramData = paramText.data(using: .utf8)

        // URL 객체 정의
        let url = URL(string: urlString)

        // URL Request 객체 정의
        var request = URLRequest(url: url!)
        request.httpMethod = "POST"
        request.httpBody = paramData

        // HTTP 메시지 헤더
        request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.setValue(String(paramData!.count), forHTTPHeaderField: "Content-Length")

        // URLSession 객체를 통해 전송, 응답값 처리
        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            
            // 서버가 응답이 없거나 통신이 실패
            if let e = error {
              NSLog("An error has occured: \(e.localizedDescription)")
              return
            }

            // 응답 처리 로직
            DispatchQueue.main.async() {
                // 서버로부터 응답된 스트링 표시
                let outputStr = String(data: data!, encoding: String.Encoding.utf8)
                print("result: \(outputStr!)")
            }
          
        }
        // POST 전송
        task.resume()
    }
    
    switch select {
    case "get":
        // GET 형태로 데이터 받기
        let url = URL(string: "http://localhost:8080/todo/get")
        let response = try String(contentsOf: url!)
        print(response)
        
    // insert, update, delete: POST 형태로 데이터 보낸 뒤 결과를 받음
    case "insert":
        // paramText 생성
        let icon = "clock"
        let title = "test_\(NSDate().timeIntervalSince1970)"
        let paramText = "icon=\(icon)&title=\(title)"
        
        sendPost(paramText: paramText, urlString: "http://localhost:8080/todo/insert")
        
    case "update":
        let id = 10
        let icon = "pencil"
        let title = "update_\(NSDate().timeIntervalSince1970)"
        let paramText = "id=\(id)&icon=\(icon)&title=\(title)"
        
        sendPost(paramText: paramText, urlString: "http://localhost:8080/todo/update")
        
    case "delete":
        let id = 8
        let paramText = "id=\(id)"
        
        sendPost(paramText: paramText, urlString: "http://localhost:8080/todo/delete")

    default:
        break
    }
    
} catch let e as NSError {
    print(e.localizedDescription)
}
```
