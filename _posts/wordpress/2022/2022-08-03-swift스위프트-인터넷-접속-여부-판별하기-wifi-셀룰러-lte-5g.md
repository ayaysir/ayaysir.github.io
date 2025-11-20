---
title: "Swift(스위프트): 인터넷 접속 여부 판별하기 (WiFi & 셀룰러 LTE, 5G 등)"
date: 2022-08-03
categories: 
  - "DevLog"
  - "Swift"
---

## **사용 상황**

iOS 앱에서 인터넷에 접속되어 있는지 (온라인, 오프라인) 여부를 확인하려면 어떻게 해야할까요?

해당 방법은 아래와 같습니다.

 

**Swift(스위프트): 인터넷 접속 여부 판별하기 (와이파이 WiFi & 셀룰러 LTE, 5G 등)**

## **방법 1: 인터넷 접속 여부만 판별**

WiFi, 셀룰러 모두 사용 가능하나 인터넷 연결 여부만 판별하며 어디서 접속했는지(와이파인지 셀룰러인지) 구분하지 않습니다. [출처](https://stackoverflow.com/questions/30743408)

```swift
//
//  Reachability.swift
//
//  Created by https://stackoverflow.com/questions/30743408
//

import SystemConfiguration

public class Reachability {
    
    class func isConnectedToNetwork() -> Bool {
        
        var zeroAddress = sockaddr_in(sin_len: 0, sin_family: 0, sin_port: 0, sin_addr: in_addr(s_addr: 0), sin_zero: (0, 0, 0, 0, 0, 0, 0, 0))
        zeroAddress.sin_len = UInt8(MemoryLayout.size(ofValue: zeroAddress))
        zeroAddress.sin_family = sa_family_t(AF_INET)
        
        let defaultRouteReachability = withUnsafePointer(to: &zeroAddress) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {zeroSockAddress in
                SCNetworkReachabilityCreateWithAddress(nil, zeroSockAddress)
            }
        }
        
        var flags: SCNetworkReachabilityFlags = SCNetworkReachabilityFlags(rawValue: 0)
        if SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) == false {
            return false
        }
        
        /* Only Working for WIFI
         let isReachable = flags == .reachable
         let needsConnection = flags == .connectionRequired
         
         return isReachable && !needsConnection
         */
        
        // Working for Cellular and WIFI
        let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
        let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
        let result = (isReachable && !needsConnection)
        
        return result
        
    }
}
```

`viewDidLoad`등 실행 가능한 영역에서 아래와 같이 사용합니다.

```swift
if Reachability.isConnectedToNetwork() {
    // 인터넷 접속된 경우
} else { // 오프라인인 경우 }
```

 

## **방법 2: 셀룰러, 와이파이 구분하기**

[출처](https://stackoverflow.com/questions/37919315/how-can-i-check-mobile-data-or-wifi-is-on-or-off-ios-swift)

```swift
import SystemConfiguration

protocol Utilities {}
extension NSObject: Utilities {
    enum ReachabilityStatus {
        case notReachable
        case reachableViaWWAN
        case reachableViaWiFi
    }
    
    var currentReachabilityStatus: ReachabilityStatus {
        
        var zeroAddress = sockaddr_in()
        zeroAddress.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
        zeroAddress.sin_family = sa_family_t(AF_INET)
        guard let defaultRouteReachability = withUnsafePointer(to: &zeroAddress, {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                SCNetworkReachabilityCreateWithAddress(nil, $0)
            }
        }) else {
            return .notReachable
        }
        
        var flags: SCNetworkReachabilityFlags = []
        if !SCNetworkReachabilityGetFlags(defaultRouteReachability, &flags) {
            return .notReachable
        }
        
        if flags.contains(.reachable) == false {
            // The target host is not reachable.
            return .notReachable
        }
        else if flags.contains(.isWWAN) == true {
            // WWAN connections are OK if the calling application is using the CFNetwork APIs.
            return .reachableViaWWAN
        }
        else if flags.contains(.connectionRequired) == false {
            // If the target host is reachable and no connection is required then we'll assume that you're on Wi-Fi...
            return .reachableViaWiFi
        }
        else if (flags.contains(.connectionOnDemand) == true || flags.contains(.connectionOnTraffic) == true) && flags.contains(.interventionRequired) == false {
            // The connection is on-demand (or on-traffic) if the calling application is using the CFSocketStream or higher APIs and no [user] intervention is needed
            return .reachableViaWiFi
        }
        else {
            return .notReachable
        }
    }
}

```

 

`viewDidLoad`등 실행 가능한 영역에서 아래와 같이 사용합니다.

```swift
switch currentReachabilityStatus {
case .notReachable:
    // 인터넷 연결 안됨
case .reachableViaWWAN:
    // 셀룰러로 연결됨
case .reachableViaWiFi:
    // 와이파이로 연결됨
}
```
