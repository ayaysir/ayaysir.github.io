---
title: "[자막 번역] WWDC24: Embedded Swift로 경량화하기"
date: 2024-09-06
categories: 
  - "DevLog"
  - "Swift"
---

https://www.youtube.com/watch?v=LqxbsADqDI4

2024\. 6. 12.

Embedded Swift를 사용하면 제한된 환경에도 Swift의 안전성과 표현성을 그대로 누릴 수 있습니다. 규격화된 Matter 기기를 사용한 데모를 통해 Embedded Swift에서 다양한 마이크로컨트롤러를 실행하는 방법을 확인해 보세요. Embedded Swift 하위 집합이 그토록 작은 공간에 런타임 없이 Swift의 이점을 모두 담을 수 있었던 방법과 Embedded Swift 개발의 첫걸음을 돕는 수많은 리소스를 살펴볼 수 있습니다.

 

- Discuss this video on the Apple Developer Forums:
    - [https://forums.swift.org/c/developmen...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbUtQS3d4cGU2d3RzVU9xX3VaRFM2YWNsWDdXd3xBQ3Jtc0tsTVFPR1psYjF6QzEwSmswcnhHZnFTUk5JYTJfODFBUllQMDAtY1ItVjVqcGFOVDA4RlVWLTlJMnR1dGRwVmd5YWxIUXBYcTd3OHpibF92U05tNFUyRXc1ZUxhOTZTMEE5enZCWlNwV0JRb3FHQjhPQQ&q=https%3A%2F%2Fforums.swift.org%2Fc%2Fdevelopment%2Fembedded%2F107&v=LqxbsADqDI4)
    - [https://developer.apple.com/forums/to...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbEJSME9Cc1YwVV95N0g4ZmhLTjZlYWlmdFp6Z3xBQ3Jtc0ttOXhSa2lDUndSQURJOXU4aG9WR3A5QlFqNnRHMGdIdGtZV1U1M0s2OVNlRkduakl1TjllUklOUFBVcDlRd3FUV0UxX0lhdy1wODdnOU5FMEktQTcxX3hYU0tMLWhGSk1NbTlnS2E0blEwekNvVHJZYw&q=https%3A%2F%2Fdeveloper.apple.com%2Fforums%2Ftopics%2Fprogramming-languages-topic%3Fcid%3Dyt-w-0011&v=LqxbsADqDI4)
- Explore related documentation, sample code, and more: Embedded Swift User Manual: [https://github.com/apple/swift/blob/m...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbm1jX0d0c2J3TWVKYjV3YnNDRURfMGFYbHY0UXxBQ3Jtc0ttNGt4RGFvQ3R5MldEZnlpaWtZdkJuSnpvanFmcWZoWEdzbTRtaGlra2VBbjNfMGwwcUFYTFBVMHYtR1RvQUJFQjRVemNnN2p0M1ZQd2N4YktCbWI0LWdDb2FUdVJuNllNWEdzRnZfOGVDUUlHRW5kaw&q=https%3A%2F%2Fgithub.com%2Fapple%2Fswift%2Fblob%2Fmain%2Fdocs%2FEmbeddedSwift%2FUserManual.md&v=LqxbsADqDI4)
- A Vision for Embedded Swift: [https://github.com/apple/swift-evolut...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbU0zVksyNklOb2Q3dHNGbFNuYkMwNWlodXZlZ3xBQ3Jtc0tuZGxiWmZPT3JUT3JzRDcxN3pYblVFNzVDNFFuTUNlUll2ZDJJSXdfeXpreEpUYUFJbm90Y0JxQTdJbEZlTUw3aHpuMm1YRWs5YTNxai1pZmc0QzlvQzczLWl3QllBa1lSdGttS0F6cDRmZ2NUU3FYcw&q=https%3A%2F%2Fgithub.com%2Fapple%2Fswift-evolution%2Fblob%2Fmain%2Fvisions%2Fembedded-swift.md&v=LqxbsADqDI4)
- Swift Embedded Example Projects: [https://github.com/apple/swift-embedd...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbXIxX2todURJbElJd2RvN3Q3eGhoYkRoeFNvd3xBQ3Jtc0trM0JzU3dxcWJrSFFHdWxaUVdieFlsMUhBTE5jUG9naEd6YnJFNU9KeWR3LTZSVjBfM2xwenV4bkJMQTFtTFZDVFFVRkY1RFB6MEp5aW83LV9jNFBJNDd3VzNLZkNrc01aM0l1OXRna2E3NDAxZUdVSQ&q=https%3A%2F%2Fgithub.com%2Fapple%2Fswift-embedded-examples&v=LqxbsADqDI4)
- Swift Matter Examples: [https://github.com/apple/swift-matter...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbkxDOGk0dk9IbnlpVWNrVVRiMWJwc3d4OUhKd3xBQ3Jtc0tsNlAtUlZOaTMzNmd4NHlDc0dBMDdVT0o0LTY3QlB3ZzlUTkxYcENHaFMyaloyRW91d3ZLRFdFY2QyTHk4SDZ5QnBCOTU5VktTYkcyQ3pFTWswOEV3bHh6ajZyWGZXRTdQaUVIUlBlN0VVWXBpNmVzWQ&q=https%3A%2F%2Fgithub.com%2Fapple%2Fswift-matter-examples&v=LqxbsADqDI4)
- Tools used: Neovim: [https://neovim.io](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbWxJbHktSDRYT1htcUlvMkZqS204eGZfWUNIUXxBQ3Jtc0tuVmpDaWdZU0FrQjVPX0gtVnUtbGpWX0Fob1NJWTV3dkJ0R1RYVlJ3TmJ0YjZ6bUxpcG9PaGttWmx3MjVoTTR1MWVLQkhqWVdQRUhZaE9OQTgwajlBRFhTcUJNSkpXQ2Q2bnM0cWtTV3hLSm1BQ1JsWQ&q=https%3A%2F%2Fneovim.io%2F&v=LqxbsADqDI4)
- Swift MMIO: [https://github.com/apple/swift-mmio](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqazJCTkNhN014cklOMFBISHc2YUNpeU1SaFl2QXxBQ3Jtc0ttMjRsd0VsTnBESlMxUEdSNzdTV3dPc2VuMFNTbGNhQWVaNk83SFV6Z053SmlyNk5Ga2V5RkFQVV84M1hwRkpRQ1JsQXo3Tk9nZFZ2eDY4MEJlWnVBLTN1U3pkREZ6ZGJ4UEkyVl9QNGpKMjBTMXgtcw&q=https%3A%2F%2Fgithub.com%2Fapple%2Fswift-mmio&v=LqxbsADqDI4)
- 스마트 홈 앱에 Matter 지원 추가하기: [https://developer.apple.com/videos/pl...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbDBTVWR1dnFvbDFMblE3Zmhlb194MVFoUWQ1d3xBQ3Jtc0ttLTBrV21BdU9iSkJjSWp3NG5mVmxwQjduZlVhNkc0X0xBQVlZR0IzOEVOQThSaVBGamdOQ0pIUlFDV1kyR0FIWVlsTWcxT2x6Ni1YQUZZWUxtVGEzTlhPT01udGNVTjYzck5RT2ctZlNGa1E0Z1IzQQ&q=https%3A%2F%2Fdeveloper.apple.com%2Fvideos%2Fplay%2Fwwdc2021%2F10298&v=LqxbsADqDI4)

* * *

영어 원문 감추기 

<script>document.querySelector("#btn-english-text").addEventListener("click", function (e) { const englishText = document.querySelectorAll(".english-text"); const button = document.getElementById("btn-english-text"); englishText.forEach(span => { span.style.display = span.style.display === "none" ? "inline" : "none"; }); button.textContent = button.textContent === "영어 원문 감추기" ? "영어 원문 보기" : "영어 원문 감추기"; })</script>

#### **소개**

Hello and welcome. My name is Kuba Mracek, and as you know, Swift is a powerful language that can be used to build applications both for Apple platforms and beyond. 안녕하세요. 제 이름은 Kuba Mracek입니다. 아시다시피 Swift는 Apple 플랫폼과 그 외의 플랫폼에서 애플리케이션을 구축하는 데 사용할 수 있는 강력한 언어입니다.

Today, we’re going to take it to new and exciting, but smaller, places — embedded devices. 오늘은 그것을 새로운 흥미로운, 그러나 더 작은 장소인 임베디드 장치로 가져가 보겠습니다.

 

#### **목표**

I’ll start by introducing Embedded Swift. 먼저 Embedded Swift를 소개하겠습니다.

Then I’m going to show you in a demo how it can be used to build something practical. 그 다음에는 데모를 통해 그것이 어떻게 실용적인 것을 만드는 데 사용될 수 있는지 보여드리겠습니다.

I’ll go over how Embedded Swift is different from the Swift you use to write desktop and mobile applications, and finally I’ll share resources that you can explore to learn more. Embedded Swift가 데스크탑 및 모바일 애플리케이션을 작성할 때 사용하는 Swift와 어떻게 다른지 설명하고, 마지막으로 더 배울 수 있는 리소스를 공유하겠습니다.

 

#### **왜 Embedded Swift인가?**

Let’s jump in! 시작해 봅시다!

Today, you can use Swift to build many different types of software: 오늘날 Swift를 사용하여 다양한 종류의 소프트웨어를 구축할 수 있습니다:

You can target mobile devices, desktop computers, servers. 모바일 장치, 데스크탑 컴퓨터, 서버를 대상으로 할 수 있습니다.

In this session, we’re going to talk about using Swift in a new area: on embedded devices, which we are surrounded by in our daily lives — smart lights, thermostats, alarms, smart fans, music devices, light strips, and many other common gadgets are built using programmable microcontrollers. 이번 세션에서는 Swift를 새로운 영역인 임베디드 장치에서 사용하는 방법에 대해 이야기할 것입니다. 우리는 일상 생활에서 스마트 조명, 온도 조절기, 알람, 스마트 팬, 음악 장치, 조명 스트립 등 프로그래머블 마이크로컨트롤러로 만들어진 많은 공통 장치들에 둘러싸여 있습니다.

Today, I would like to show how you — as either a hobbyist or even a more serious developer — can use Swift to program these embedded devices. 오늘은 취미로 하시는 분이든 더 진지한 개발자든 상관없이 Swift를 사용하여 이러한 임베디드 장치를 프로그래밍하는 방법을 보여드리겠습니다.

For that, we’re introducing Embedded Swift — a new compilation mode specifically suited for constrained embedded devices. 이를 위해, 우리는 제한된 임베디드 장치에 특히 적합한 새로운 컴파일 모드인 Embedded Swift를 소개하고 있습니다.

Historically, C and C++ were the commonly used languages in this area. 역사적으로, 이 분야에서는 C와 C++가 일반적으로 사용되는 언어들이었습니다.

But now, we’re enabling using Swift in these places, and that brings to embedded developers the benefits of Swift, like its ergonomics, safety features, and ease of use. 하지만 이제 우리는 이러한 장소에서 Swift를 사용할 수 있도록 하고 있으며, 이는 임베디드 개발자들에게 Swift의 장점, 즉 인체공학성, 안전성, 사용 용이성을 제공합니다.

Embedded Swift is of course suitable to program microcontrollers in embedded devices, but also kernel-level code and other low-level library code that might be, for example, sensitive to not gaining new dependencies. Embedded Swift는 물론 임베디드 장치의 마이크로컨트롤러를 프로그래밍하는 데 적합하지만, 커널 수준의 코드 및 새로운 의존성을 추가하는 데 민감할 수 있는 다른 저수준 라이브러리 코드에도 적합합니다.

Apple devices use Embedded Swift on the Secure Enclave Processor, and Swift’s memory safety is a huge benefit for the platform. Apple 장치는 Secure Enclave Processor에서 Embedded Swift를 사용하며, Swift의 메모리 안전성은 이 플랫폼에 큰 이점이 됩니다.

Embedded Swift is a subset of Swift, covering most of the language you know and love — it’s a full-featured subset that includes support for value and reference types, closures, optionals, error handling, generics, and more. Embedded Swift는 Swift의 하위 집합으로, 여러분이 알고 사랑하는 대부분의 언어를 포함합니다 — 값 타입과 참조 타입, 클로저, 옵셔널, 오류 처리, 제네릭 등을 지원하는 완전한 기능을 갖춘 하위 집합입니다.

 

#### **쇼케이스**

Now, let’s take a look at Embedded Swift in a live demo. 이제 실시간 데모에서 Embedded Swift를 살펴보겠습니다.

Before we start: Embedded Swift is currently an experimental feature, it’s not source stable, yet. 시작하기 전에: Embedded Swift는 현재 실험적인 기능으로, 아직 소스 안정성이 없습니다.

It’s under active development, and the best way to use it is with a preview toolchain from swift.org. 현재 활발히 개발 중이며, 가장 좋은 사용 방법은 swift.org의 미리 보기 도구 체인을 사용하는 것입니다.

 

##### **계획**

In this demo, I’m going to build a prototype of a very simple HomeKit accessory. 이번 데모에서는 아주 간단한 HomeKit 액세서리의 프로토타입을 구축할 것입니다.

A color LED light. 색상 LED 조명입니다.

I’ll start by having a working HomeKit setup — that means a WiFi network, and some existing Apple devices all connected to it. 작동 중인 HomeKit 설정을 갖추는 것으로 시작하겠습니다 — 즉, WiFi 네트워크와 그에 연결된 몇 가지 기존 Apple 장치들입니다.

I’m going to take a programmable embedded device, concretely an ESP32C6 development board, which has a RISC-V microcontroller. 프로그래머블 임베디드 장치인 ESP32C6 개발 보드를 사용할 것이며, 이 보드에는 RISC-V 마이크로컨트롤러가 있습니다.

And, it’ll have a color LED attached to it. 그리고 색상 LED가 부착될 것입니다.

I’ll use a Mac to connect to the device over a USB cable, and I’ll write a program in Embedded Swift that implements a HomeKit accessory, which I will then flash onto the device. Mac을 사용하여 USB 케이블로 장치에 연결하고, Embedded Swift로 HomeKit 액세서리를 구현하는 프로그램을 작성한 후, 이 프로그램을 장치에 플래시할 것입니다.

The device will then join my WiFi and the HomeKit network, and it can be controlled from the Home app on any of the Apple devices. 그 장치는 제 WiFi와 HomeKit 네트워크에 연결되며, 모든 Apple 장치의 Home 앱에서 제어할 수 있습니다.

 

##### **시작하기**

Let’s get started. 시작해 보겠습니다.

I’m using NeoVim and CMake, and right now, this is just a template project to show the very basics and to get our Embedded Swift code up and running. NeoVim과 CMake를 사용하고 있으며, 현재는 기본적인 사항을 보여주고 Embedded Swift 코드를 실행하기 위한 템플릿 프로젝트입니다.

The project is using a 3rd party SDK, which I got from my device vendor it’s an SDK written in C. 이 프로젝트는 3rd 파티 SDK를 사용하고 있으며, 이는 제 장치 공급업체로부터 받은 C로 작성된 SDK입니다.

And because I don’t want to modify that SDK, I can simply use a bridging header, to import all the SDK’s APIs into Swift. 이 SDK를 수정하고 싶지 않기 때문에, 브리징 헤더를 사용하여 SDK의 모든 API를 Swift로 가져올 수 있습니다.

I need some simple CMake logic to be able to build my Swift code on top of the vendor’s SDK and their build system, which also requires a few more boilerplate files: Like the YAML file, the CSV file and the “sdkconfig” file. 제 Swift 코드를 공급업체의 SDK와 빌드 시스템 위에 빌드할 수 있도록 하는 간단한 CMake 논리가 필요합니다. 이 과정에는 YAML 파일, CSV 파일 및 “sdkconfig” 파일과 같은 추가적인 보일러플레이트 파일이 필요합니다.

These are needed for any project built on top of this SDK, and I have set those up based on existing examples from the vendor, and just added Swift on top of that. 이 파일들은 이 SDK 위에 구축된 모든 프로젝트에 필요하며, 공급업체의 기존 예제를 바탕으로 설정하고 Swift를 추가했습니다.

Let’s go back to my Swift source code. 제 Swift 소스 코드로 돌아가 보겠습니다.

My editor has LSP integration, so it show me the definitions and documentation for functions and types I’m using. 제 편집기는 LSP 통합을 지원하므로 제가 사용하는 함수와 타입의 정의 및 문서를 보여줍니다.

It can can give me rich and semantical autocompletion. 풍부하고 의미적인 자동 완성을 제공할 수 있습니다.

And if I write code that doesn’t make sense... 그리고 코드가 이해가 안 되는 경우...

I get immediate errors and warnings telling me what’s wrong. 즉시 오류와 경고가 나타나 문제를 알려줍니다.

Let me now plug-in the device. 이제 장치를 연결해 보겠습니다.

I’m going to be programming this device over USB, but my breadboard also has a separate battery, so once its programmed we will be able to unplug the device and still use it. USB를 통해 이 장치를 프로그래밍할 것이며, 제 브레드보드에는 별도의 배터리도 있어 프로그래밍 후 장치를 분리해도 사용할 수 있습니다.

But first, let’s get the most basic Swift application working and running on the device. 하지만 우선, 가장 기본적인 Swift 애플리케이션을 장치에서 작동시키겠습니다.

The SDK I’m using provides tools for that. 제가 사용하는 SDK는 이를 위한 도구를 제공합니다.

I’m going to run this convenient Python script that the vendor is providing. 제공업체에서 제공하는 이 편리한 Python 스크립트를 실행하겠습니다.

It allows me to build, flash, and monitor the device, all with a single command. 이 스크립트는 단일 명령으로 장치를 빌드, 플래시, 모니터링할 수 있게 해줍니다.

As I run it, we can observe that the firmware is being built, then uploaded to the device, and then we receive logs back from the device. 실행하면서 펌웨어가 빌드되고 장치에 업로드된 다음 장치로부터 로그를 받는 과정을 관찰할 수 있습니다.

And with that, we now have signs of life of our first Embedded Swift application running on an embedded device. 이제 첫 번째 Embedded Swift 애플리케이션이 임베디드 장치에서 실행되고 있는 생명의 신호를 확인할 수 있습니다.

 

##### **Swift의 상호 운용성을 사용하여 LED 제어하기**

Now, let’s add code that does something more useful. 이제 좀 더 유용한 작업을 수행하는 코드를 추가해 보겠습니다.

Swift’s interoperability gives us access to all the APIs in the vendor’s SDK. Swift의 상호 운용성을 통해 공급업체의 SDK에 있는 모든 API에 접근할 수 있습니다.

If I want to control the LED on the device, 장치의 LED를 제어하고 싶다면,

I can use the existing C APIs in the SDK for that. 이를 위해 SDK의 기존 C API를 사용할 수 있습니다.

Let’s call these APIs with values that mean “blue color”, “100% saturation”, “80%” brightness. 이 API를 “파란색”, “100% 채도”, “80%” 밝기를 의미하는 값으로 호출해 보겠습니다.

And let’s save and upload this version of our code to the device. 이 버전의 코드를 저장하고 장치에 업로드하겠습니다.

I’ll run the same command as last time. 이번에는 지난번과 같은 명령을 실행하겠습니다.

In a few seconds, once the firmware is uploaded and the device reboots, we can now control the color and brightness of the LED. 몇 초 후, 펌웨어가 업로드되고 장치가 재부팅되면 LED의 색상과 밝기를 제어할 수 있습니다.

 

##### **인체공학적인 LED 구조체 사용하기**

Now, using Swift to just call C APIs for everything would defeat the whole purpose. 이제 Swift를 사용하여 모든 작업에 C API만 호출하면 전체 목적을 잃게 됩니다.

It’s very useful that we can do that, but it’s even better to build some wrappers and abstractions over those, so that we can write our application in clean, intuitive, and ergonomic Swift code. 그렇게 할 수 있는 것은 매우 유용하지만, 그 위에 래퍼와 추상화를 구축하여 애플리케이션을 깔끔하고 직관적이며 인체공학적인 Swift 코드로 작성하는 것이 더 좋습니다.

In this version, I have prepared an LED object. Let’s jump to its definition. 이 버전에서는 LED 객체를 준비했습니다. 정의를 살펴보겠습니다.

This is some helper code I wrote earlier, and it wraps the C APIs into a nice Swift layer. 이것은 제가 이전에 작성한 일부 헬퍼 코드이며, C API를 멋진 Swift 레이어로 감쌉니다.

It provides useful properties with some ergonomic types, for example the enabled property is a boolean, the brightness property is an integer. 인체공학적인 타입을 가진 유용한 속성을 제공합니다. 예를 들어, enabled 속성은 불리언이며, brightness 속성은 정수입니다.

Let’s go back to the file with the main application logic. 이제 주요 애플리케이션 로직이 있는 파일로 돌아가 보겠습니다.

Using the LED object, we can now write really straightforward and intuitive code. LED 객체를 사용하여 이제 정말 간단하고 직관적인 코드를 작성할 수 있습니다.

On start, let’s set the color to red. 시작할 때 색상을 빨간색으로 설정해 보겠습니다.

And brightness to 80%. 그리고 밝기를 80%로 설정합니다.

Code like this is extremely readable and clear. 이런 코드는 매우 읽기 쉽고 명확합니다.

Let’s add some more. 조금 더 추가해 보겠습니다.

In a loop, we’ll wait 1 second, flip the state of the LED. 루프에서 1초를 기다리고 LED의 상태를 변경합니다.

And if we’re turning it on, then we’ll ask for a new color expressed by a hue and a saturation value. 그리고 켜는 경우에는 색상과 채도 값을 사용하여 새로운 색상을 요청합니다.

The hue will be random, and saturation will be 100%. 색상은 무작위로 설정되고 채도는 100%로 설정됩니다.

All of this Embedded Swift code really feels just like writing regular Swift. 이 모든 Embedded Swift 코드는 일반 Swift를 작성하는 것처럼 느껴집니다.

Most of the language is simply available. 언어의 대부분이 그대로 사용 가능합니다.

I’ll upload the firmware one more time 펌웨어를 한 번 더 업로드하겠습니다.

Let’s see if the result works. 결과가 잘 작동하는지 확인해 보겠습니다.

Once the program boots and runs, our device should be blinking its LED with a randomly changing color. 프로그램이 부팅되고 실행되면, 장치는 무작위로 변하는 색상으로 LED가 깜박일 것입니다.

Great! This is exactly what we wanted. 좋습니다! 이것이 바로 우리가 원했던 것입니다.

Building the layer for the LED object is what really gives us the power of Swift: LED 객체를 위한 레이어를 구축하는 것이 바로 Swift의 진정한 힘을 제공합니다:

High-level APIs that let us write clean, readable code. 우리가 깔끔하고 읽기 쉬운 코드를 작성할 수 있게 해주는 고수준 API입니다.

So far, we’ve seen how Embedded Swift can nicely integrate into your workflows. 지금까지 Embedded Swift가 어떻게 작업 흐름에 잘 통합될 수 있는지 보았습니다.

You can use it with a vendor-provided SDK, and you can get your IDE or text editor to provide full autocompletion, show definitions, and documentation. 공급업체가 제공하는 SDK와 함께 사용할 수 있으며, IDE나 텍스트 편집기가 전체 자동 완성, 정의 및 문서를 제공하도록 할 수 있습니다.

Using Swift’s interoperability, you can call existing C APIs from the SDK directly in Swift code. Swift의 상호 운용성을 사용하여 SDK의 기존 C API를 Swift 코드에서 직접 호출할 수 있습니다.

But often it’s valuable to wrap C APIs into a layer that provides ergonomic and intuitive APIs for our core application logic. 하지만 종종 C API를 인체공학적이고 직관적인 API를 제공하는 레이어로 감싸는 것이 유용합니다.

 

##### **Matter 프로토콜 추가하기**

Now that we have the basics working, let’s continue building an actual HomeKit accessory. 이제 기본적인 작업이 완료되었으므로 실제 HomeKit 액세서리를 계속 구축해 보겠습니다.

For that, we’re going to use “Matter” protocol. 이를 위해 “Matter” 프로토콜을 사용할 것입니다.

Matter is an open standard for building smart home accessories. Matter는 스마트 홈 액세서리를 구축하기 위한 개방형 표준입니다.

It’s described in depth in a WWDC session from 2021, I encourage you to watch it if you’d like to know more. Matter는 2021년 WWDC 세션에서 자세히 설명되어 있으니, 더 알고 싶다면 시청해 보시길 권장합니다.

In the SDK I’m using, Matter is provided as C++ APIs, and we can use Swift’s interop again to use this functionality that will gives us all the infrastructure pieces, like device discovery and commissioning, for free. 제가 사용하는 SDK에서 Matter는 C++ API로 제공되며, Swift의 상호 운용성을 다시 사용하여 이 기능을 이용할 수 있습니다. 이 기능은 장치 검색 및 커미셔닝과 같은 모든 인프라 조각을 무료로 제공합니다.

And as soon as we have a device that implements the Matter protocol, Matter 프로토콜을 구현한 장치가 있으면,

it will automatically work in HomeKit, because it supports Matter accessories natively. 자동으로 HomeKit에서 작동하며, Matter 액세서리를 기본적으로 지원하기 때문입니다.

Let’s start again with just an empty application that doesn’t do anything. 다시 아무 것도 하지 않는 빈 애플리케이션으로 시작해 보겠습니다.

And to work with Matter, we need to know a little bit about its data model and terminology. Matter와 작업하기 위해, 그 데이터 모델과 용어에 대해 조금 알아야 합니다.

This is the rough high-level task list that we’ll have to do, to implement a Matter device. Matter 장치를 구현하기 위해 수행해야 할 대략적인 상위 작업 목록입니다.

We’ll need to create what’s called a root node, which represents the entire Matter accessory. 전체 Matter 액세서리를 나타내는 루트 노드를 생성해야 합니다.

Then we’ll need an endpoint, in our case that’s going to be the color LED light, and that’s also going to be the object that has a state, for example the color and brightness, and can receive commands, for example to turn the light on or off. 그 다음에는 엔드포인트가 필요합니다. 이 경우 색상 LED 조명이 될 것이며, 이는 상태를 가지고 (예: 색상 및 밝기) 명령을 수신할 수 있는 객체입니다 (예: 조명을 켜거나 끄는 명령).

Then we’ll connect the endpoint to the node, and the node to an “application” object. 그 다음에는 엔드포인트를 노드에 연결하고, 노드를 “애플리케이션” 객체에 연결합니다.

I already wrote a simple wrapper layer around the C++ Matter APIs that’s what I have in this “Matter” subdirectory. C++ Matter API를 감싼 간단한 래퍼 레이어를 이미 작성했으며, 이것이 이 “Matter” 하위 디렉토리에 있습니다.

It’s exactly the same approach we used to give ourselves nice APIs for working with the LED light. 이것은 LED 조명 작업을 위한 멋진 API를 제공하기 위해 사용했던 접근 방식과 정확히 동일합니다.

Using that, we can fill in the top-level logic easily. 이를 사용하여 상위 로직을 쉽게 작성할 수 있습니다.

First we create the root node. 우선 루트 노드를 생성합니다.

Then we create and configure the endpoint. 그 다음, 엔드포인트를 생성하고 구성합니다.

This is our color light, and notably it has an eventHandler — a closure that is triggered every time an event from HomeKit is sent to this endpoint. 이것이 우리의 색상 조명이며, 특히 이벤트가 이 엔드포인트로 전송될 때마다 트리거되는 eventHandler — 클로저가 있습니다.

A closure is a very natural mechanism for a callback. 클로저는 콜백을 위한 매우 자연스러운 메커니즘입니다.

We don’t have to deal with unsafe function pointers or untyped context arguments which are a common solution for callbacks in C. C에서 콜백에 대한 일반적인 해결책인 불안전한 함수 포인터나 타입이 없는 컨텍스트 인수를 처리할 필요가 없습니다.

Next, let’s register the endpoint. 다음으로 엔드포인트를 등록하겠습니다.

And finally, set up and start a Matter application. 마지막으로 Matter 애플리케이션을 설정하고 시작합니다.

For now, the logic just prints all the events, but we’ve now built a valid Matter application. 현재 로직은 모든 이벤트를 인쇄하는 것뿐이지만, 유효한 Matter 애플리케이션을 구축했습니다.

So let’s flash this application to the device. 이제 이 애플리케이션을 장치에 플래시해 보겠습니다.

It will take a while to start up. 시작하는 데 시간이 좀 걸릴 것입니다.

Now normally, you would go through a setup process for a new accessory. 보통 새로운 액세서리에 대해 설정 프로세스를 진행합니다.

I have already previously done that, and I have registered this device in my HomeKit network already, so it already knows which WiFi network to join. 저는 이미 이전에 이를 수행했으며, 이 장치를 제 HomeKit 네트워크에 등록했으므로, 장치는 이미 어떤 WiFi 네트워크에 연결해야 하는지 알고 있습니다.

As soon as it does that, it’ll shows up in the Home app on my Mac, and on my other devices as a “Matter Accessory”. 장치가 그렇게 하면, Mac의 Home 앱과 다른 장치에서 “Matter Accessory”로 표시됩니다.

It shows up as a smart light, and I can control it right here from the Home app on my Mac. 스마트 조명으로 표시되며, Mac의 Home 앱에서 직접 제어할 수 있습니다.

I can turn the light on and off, and as I do that, we receive events for those commands that show up in our device logs. 조명을 켜고 끌 수 있으며, 그렇게 할 때 장치 로그에 표시되는 명령에 대한 이벤트를 수신합니다.

 

##### **이벤트 핸들러에서 Swift enum 사용하기**

So far, we have just been logging the incoming events. 지금까지 우리는 들어오는 이벤트를 로그로 남기기만 했습니다.

Let’s make them really do something! And let’s wire them up to our LED object that we’ve used previously. 이제 실제로 동작하게 만들어 보겠습니다! 그리고 이전에 사용했던 LED 객체에 연결해 보겠습니다.

Inside the event handler, we’ll want to react to different attributes being set. 이벤트 핸들러 내에서, 설정된 다양한 속성에 반응하고 싶습니다.

And because the attribute is a Swift enum, we can use a switch statement, and the autocompletion will tell use which cases we have to handle. 그리고 속성이 Swift enum이기 때문에, switch 문을 사용할 수 있으며, 자동 완성이 처리해야 할 경우를 알려줍니다.

Let’s fill in the code for the different attributes. 다양한 속성에 대한 코드를 작성해 보겠습니다.

Based on which event we receive, we will want to set the enabled property if we need to turn the light on or off. 수신한 이벤트에 따라, 조명을 켜거나 끄려면 enabled 속성을 설정해야 합니다.

Or we’ll set the brightness property, where we also need to scale the value appropriately. 또는 brightness 속성을 설정하며, 이 경우 값을 적절히 조정해야 합니다.

And very similarly, we can handle color changes, setting a new hue, a new saturation, or a new color temperature. 마찬가지로 색상 변경을 처리할 수 있으며, 새로운 색상, 새로운 채도 또는 새로운 색온도를 설정할 수 있습니다.

This should be all we need. 이것으로 충분할 것입니다.

Let’s flash this program to the device and test it out! 이 프로그램을 장치에 플래시하고 테스트해 보겠습니다!

While the program is starting, 프로그램이 시작되는 동안,

I’d like to point out how useful and ergonomic Swift enums are. Swift enums가 얼마나 유용하고 인체공학적인지 강조하고 싶습니다.

In the simplest case, enums just represent one choice out of a set. 가장 간단한 경우, enums는 집합에서 하나의 선택만을 나타냅니다.

For example the .onOff case or the .levelControl case of the attribute. 예를 들어, 속성의 .onOff 케이스나 .levelControl 케이스가 있습니다.

But they can also have associated values. 하지만, 연관된 값을 가질 수도 있습니다.

For example the .colorControl case has a payload, and thanks to Swift’s pattern matching, I don’t need a second nested switch statement. 예를 들어, .colorControl 케이스는 페이로드를 가지며, Swift의 패턴 매칭 덕분에 두 번째 중첩 switch 문이 필요 없습니다.

I can just match the enum case together with the payload. enum 케이스와 페이로드를 함께 매칭할 수 있습니다.

I’m also using enums to represent the color property, which can either be hue plus saturation or a temperature. 색상 속성을 나타내기 위해 enums를 사용하고 있으며, 이는 색상과 채도 또는 온도가 될 수 있습니다.

These cases even have different payload types, the first one has two integers as the payload, and the other one needs just one integer. 이 케이스들은 심지어 다른 페이로드 타입을 가지며, 첫 번째는 두 개의 정수를 페이로드로 가지며, 다른 하나는 하나의 정수만 필요합니다.

This altogether makes Swift enums really powerful and expressive, and they allow us to write this simple, concise, readable logic. 이 모든 것이 Swift enums를 매우 강력하고 표현력 있게 만들며, 간단하고 간결하며 읽기 쉬운 논리를 작성할 수 있게 해줍니다.

Now that the device has started, 장치가 시작되었으니,

I can unplug the USB cable and use the battery to power it. USB 케이블을 분리하고 배터리로 전원을 공급할 수 있습니다.

And we can control this device wirelessly from the Home app. 그리고 이 장치를 Home 앱에서 무선으로 제어할 수 있습니다.

Let’s turn the light on. 조명을 켜 보겠습니다.

And off. 그리고 끄겠습니다.

Let’s see if we can change the brightness. 밝기를 변경할 수 있는지 확인해 보겠습니다.

Or choose a different color temperature. 또는 다른 색온도를 선택해 보겠습니다.

Or perhaps customize the color completely. 아니면 색상을 완전히 사용자 정의해 보겠습니다.

Let’s try a few different ones. 몇 가지 다른 색상을 시도해 보겠습니다.

Awesome, I think our prototype of a smart light works great! 멋지네요! 스마트 조명의 프로토타입이 훌륭하게 작동하는 것 같습니다!

 

##### **데모 요약**

We have successfully built a HomeKit-enabled smart light using Embedded Swift. Embedded Swift를 사용하여 HomeKit 지원 스마트 조명을 성공적으로 구축했습니다.

And if you’d like, this demo project, and setup instructions are available on GitHub. 그리고 원하신다면, 이 데모 프로젝트와 설정 지침은 GitHub에서 확인할 수 있습니다.

We’ve seen how we can get a basic prototype of a HomeKit-enabled device up and running very quickly, by leveraging Swift’s interop capabilities. Swift의 상호 운용성 기능을 활용하여 HomeKit 지원 장치의 기본 프로토타입을 매우 빠르게 구축할 수 있는 방법을 보았습니다.

There is no need to re-implement the entire Matter protocol in Swift. Matter 프로토콜 전체를 Swift에서 다시 구현할 필요는 없습니다.

We can just use the existing implementation from Swift. 기존의 Swift 구현을 사용할 수 있습니다.

Swift encourages clean and intuitive design and implementation of your code, and it improves readability and safety over C and C++, as we’ve seen, for example, when using closures as an ergonomic solution for callbacks. Swift는 코드의 깔끔하고 직관적인 설계와 구현을 장려하며, 읽기 쉬움과 안전성을 개선합니다. 예를 들어, 클로저를 인체공학적인 콜백 솔루션으로 사용할 때 C와 C++보다 더 나은 결과를 제공합니다.

 

#### **Embedded Swift가 다른 점**

In the demo, we’ve seen how Embedded Swift feels like regular Swift, and it does indeed include most of Swift’s language features, but there are some differences. 데모에서 Embedded Swift가 일반 Swift와 유사하게 느껴지며 대부분의 Swift 언어 기능을 포함하고 있지만 몇 가지 차이점이 있다는 것을 보았습니다.

Embedded environments are commonly very constrained, and they need small and simple binaries for programs to fit. 임베디드 환경은 일반적으로 매우 제한적이며, 프로그램이 적합하게 맞추기 위해 작고 단순한 바이너리가 필요합니다.

Memory, storage, and CPU performance are typically very limited. 메모리, 저장소, 그리고 CPU 성능은 일반적으로 매우 제한적입니다.

Because of that, Embedded Swift disallows certain features to meet these requirements. 이 때문에 Embedded Swift는 이러한 요구 사항을 충족하기 위해 특정 기능을 허용하지 않습니다.

As an example, let’s consider how runtime reflection works. 예를 들어, 런타임 반사가 어떻게 작동하는지 살펴보겠습니다.

To inspect the children of a type, it needs to access the metadata record for the type. 타입의 자식을 검사하려면, 해당 타입의 메타데이터 레코드에 접근해야 합니다.

This includes the fields’ names, offsets, and types, which in turn reference other metadata records, and so on and so on. 이에는 필드의 이름, 오프셋, 타입이 포함되며, 이들은 다시 다른 메타데이터 레코드를 참조하고 계속해서 이어집니다.

These records all add up and can have an unacceptable codesize cost for embedded devices. 이 레코드들은 모두 합쳐져서 임베디드 장치에 대한 코드 크기 비용이 허용할 수 없는 수준에 이를 수 있습니다.

To avoid that, runtime reflection using the Mirror APIs is disallowed in Embedded Swift, and it’s only available in full Swift. 이 문제를 피하기 위해, Mirror API를 사용하는 런타임 반사는 Embedded Swift에서 허용되지 않으며, 전체 Swift에서만 사용할 수 있습니다.

For the same reason, to avoid needing metadata at runtime, metatypes and “any” types are also disallowed. 같은 이유로, 런타임에서 메타데이터가 필요하지 않도록 하기 위해, 메타타입과 “any” 타입도 허용되지 않습니다.

But don’t be alarmed, the vast majority of the Swift language is available in Embedded Swift. 그러나 걱정하지 마세요. Swift 언어의 대부분은 Embedded Swift에서 사용할 수 있습니다.

Embedded Swift is strictly a subset compared to full Swift, and not a variant or a dialect. Embedded Swift는 전체 Swift에 비해 엄격히 하위 집합이며, 변형이나 방언이 아닙니다.

So there won’t be any differences in behavior between Embedded Swift and full Swift. 따라서 Embedded Swift와 전체 Swift 사이에는 동작상의 차이가 없습니다.

 ![](/assets/img/wp-content/uploads/2024/09/스크린샷-2024-09-06-오후-4.08.47.jpg)

 

All code that works in Embedded Swift will also work in full Swift. Embedded Swift에서 작동하는 모든 코드는 전체 Swift에서도 작동합니다.

When you try to use a feature that’s not available in Embedded Swift, the compiler will tell you. Embedded Swift에서 사용할 수 없는 기능을 사용하려고 할 때, 컴파일러가 알려줍니다.

In this example, I have tried to use an any type. 이 예제에서는 any 타입을 사용하려고 했습니다.

To avoid that, I can replace this use of any Countable with generics instead. 이를 피하기 위해, any Countable의 사용을 제네릭으로 대체할 수 있습니다.

In this code snippet, it’s as simple as swapping any Countable for some Countable, which turns this function into a generic function. 이 코드 조각에서는 any Countable을 some Countable로 바꾸는 것만으로 이 함수를 제네릭 함수로 변환할 수 있습니다.

Generics are fully supported in Embedded Swift, as the compiler can specialize generic functions. 제네릭은 Embedded Swift에서 완전히 지원되며, 컴파일러가 제네릭 함수를 특수화할 수 있습니다.

And the result of that is code that does not need expensive runtime support or type metadata. 그 결과는 비싼 런타임 지원이나 타입 메타데이터가 필요 없는 코드입니다.

 

#### **더 알아보기**

There’s so much more to explore about Embedded Swift. Embedded Swift에 대해 탐색할 것이 훨씬 더 많습니다.

As part of the Swift Evolution process, a vision document for Embedded Swift has been published and accepted. Swift Evolution 과정의 일환으로, Embedded Swift에 대한 비전 문서가 게시되고 승인되었습니다.

This document describes the high-level design, requirements, and approach of Embedded Swift, and it’s a great introduction into the compilation mode and the language subset. 이 문서에는 Embedded Swift의 고급 설계, 요구 사항 및 접근 방식이 설명되어 있으며, 컴파일 모드 및 언어 하위 집합에 대한 훌륭한 소개입니다.

If you’re trying out Embedded Swift, I recommend reading the “Embedded Swift -- User Manual”. Embedded Swift를 사용해 보고 있다면, “Embedded Swift -- User Manual”을 읽어보는 것을 추천합니다.

It describes how to get started, what you should and shouldn’t expect, and also some details that you will likely need to know when interacting with your vendor’s SDK and build system, for example, which compiler flags to use and which dependencies you will need to satisfy. 이 문서는 시작하는 방법, 기대해야 할 것과 기대하지 말아야 할 것, 그리고 벤더의 SDK와 빌드 시스템과 상호 작용할 때 알아야 할 세부 사항, 예를 들어 사용할 컴파일러 플래그와 충족해야 할 종속성 등을 설명합니다.

We have published a set of example projects written in Embedded Swift on GitHub, and they cover a range of embedded devices that have ARM or RISC-V microcontrollers. GitHub에 Embedded Swift로 작성된 예제 프로젝트 세트를 게시했으며, ARM 또는 RISC-V 마이크로컨트롤러가 있는 다양한 임베디드 장치를 포함합니다.

This includes popular embedded development boards, as well as some other devices like the Playdate gaming console. 여기에는 인기 있는 임베디드 개발 보드뿐만 아니라 Playdate 게임 콘솔과 같은 다른 장치도 포함됩니다.

The examples also show how to use various build systems and integration options. 예제는 또한 다양한 빌드 시스템 및 통합 옵션을 사용하는 방법을 보여줍니다.

They can give you a sense of what all can Embedded Swift do, but also serve as templates for your own ideas. 이들은 Embedded Swift가 무엇을 할 수 있는지에 대한 감각을 제공할 수 있으며, 자신의 아이디어를 위한 템플릿으로도 사용할 수 있습니다.

When writing code that runs on an embedded device, you often need to interact with low-level hardware registers. 임베디드 장치에서 실행되는 코드를 작성할 때는 종종 저수준 하드웨어 레지스터와 상호 작용해야 합니다.

To help you with that, we have published “Swift MMIO”, a library that provides APIs for safe, structured, and ergonomic operations on memory mapped registers. 이를 돕기 위해, 메모리 매핑 레지스터에서 안전하고 구조화된, 인체공학적인 작업을 위한 API를 제공하는 “Swift MMIO” 라이브러리를 게시했습니다.

And finally, the Swift forums now have a new “Embedded” subcategory and that’s the right place to take your experiments, questions, and discussions next. 마지막으로, Swift 포럼에 새로운 “Embedded” 하위 카테고리가 생겼으며, 여기가 실험, 질문 및 논의를 진행하기에 적합한 장소입니다.

 

#### **마무리**

We have seen how to use the new compilation mode — Embedded Swift — to program embedded devices. 새로운 컴파일 모드인 Embedded Swift를 사용하여 임베디드 장치를 프로그래밍하는 방법을 보았습니다.

It’s currently available as a preview, and works best with nightly toolchains from swift.org. 현재는 미리보기로 제공되며, swift.org의 야간 툴체인과 함께 사용할 때 가장 잘 작동합니다.

Currently, ARM and RISC-V chips of both 32-bit and 64-bit variants are supported, but Embedded Swift is not really hardware specific and it’s quite easy to bring it to new instruction sets. 현재 ARM과 RISC-V의 32비트 및 64비트 칩이 지원되지만, Embedded Swift는 하드웨어에 특정되지 않으며 새로운 명령 집합에 쉽게 적용할 수 있습니다.

Go try out Embedded Swift, build some cool electronics projects and share your experience and feedback on the Swift forums. Embedded Swift를 사용해 보고 멋진 전자 프로젝트를 구축해 보세요. 그리고 Swift 포럼에서 경험과 피드백을 공유해 주세요.

Thanks for watching, and have a great WWDC. 시청해 주셔서 감사합니다. 멋진 WWDC 되세요.

 

\[rcblock id="6686"\]
