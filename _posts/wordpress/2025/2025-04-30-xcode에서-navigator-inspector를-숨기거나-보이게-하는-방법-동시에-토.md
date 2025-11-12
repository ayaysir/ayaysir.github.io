---
title: "Xcode에서 Navigator & Inspector를 숨기거나 보이게 하는 방법, 동시에 토글하는 방법"
date: 2025-04-30
categories: 
  - "DevLog"
  - "Xcode/iOS기타"
---

## **소개**

Xcode를 사용하다 보면 좁은 모니터 환경에서 **Navigator (왼쪽 패널)**와 **Inspector (오른쪽 패널)**를 상황에 따라 동시에 숨기거나 나타내고 싶을 때가 많습니다. 하지만 기본 단축키만으로는 이 둘을 **동시에 제어할 수 있는 방법은 제공되지 않습니다.**

![내비게이터(Navigator)와 인스펙터(Inspector)](/assets/img/wp-content/uploads/2025/04/screenshot-2025-04-30-pm-7.35.52-copy.jpg) 
*내비게이터(Navigator)와 인스펙터(Inspector)*

 
이 글에서는 각각의 단축키와, 이를 해결하기 위한 **Karabiner-Elements**를 활용한 자동화 방법까지 소개합니다.


## **개별 단축키**

### **1\. Show Navigator, Show Inspector: 개별 토글 방법**

Xcode에서 두 패널은 각기 다른 단축키로 토글할 수 있습니다.

#### **(1) Show Navigator**

- 메뉴 경로; `View` → `Navigators` → `Show Navigator`
- 단축키: `⌘ + 0` (Command + 0)

 

#### **(2) Show Inspector**

- 메뉴 경로: `View` → `Inspectors` → `Show Inspector`
- 단축키: `⌥ + ⌘ + 0` (`Option + Command + 0`)

 

각각의 패널은 이 단축키를 눌러 토글할 수 있습니다. 하지만 이 **두 개를 동시에 켜거나 끄는 단축키는 없습니다.**


### **2\. 둘 다 동시에 토글하는 방법은 Xcode 기본으로는 불가능**

Xcode 자체에서는 **Navigator와 Inspector를 동시에 제어하는 단축키를 만들 수 없습니다.** 두 단축키를 **같은 키에 할당하면 서로 충돌**하여 제대로 동작하지 않기 때문입니다.


## **동시에 토글하는 방법**

### **Karabiner-Elements로 해결하기**

이를 해결하기 위해 **Karabiner-Elements**라는 macOS용 키 매핑 툴을 사용할 수 있습니다.

#### **Karabiner-Elements 설치**

- 공식 다운로드: [https://karabiner-elements.pqrs.org/](https://karabiner-elements.pqrs.org/)\]
- 설치 후 실행하면 `Function Keys`, `Simple Modifications`, `Complex Modifications` 등 여러 설정을 할 수 있습니다.

#### **F6 키를 단축키로 사용**

Karabiner-Elements 설치 후 Function Keys 탭으로 이동합니다.

![Function Keys 탭](/assets/img/wp-content/uploads/2025/04/screenshot-2025-04-30-pm-7.44.36-copy.jpg) 
*Function Keys 탭*

제 컴퓨터에서는 어째서인지 F6만 맥북의 기본 기능 없이 자유롭게 쓸 수 있었고, 나머지 Function 키들은 밝기, 재생 등으로 할당되어 있었습니다. 그래서 F6 키를 눌렀을 때 Navigator와 Inspector가 동시에 토글되도록 설정했습니다. 각자의 상황에 맞춰 다른 단축키를 써도 됩니다.

#### **Karabiner JSON 설정 (F6 키 + Xcode 전용)**

아래 JSON 코드를 저장하면 F6 키를 누를 때만 Xcode 내에서 두 패널이 동시에 토글됩니다.

##### **1\. 저장 위치**

파일 경로: `~/.config/karabiner/assets/complex_modifications/xcode_toggle_panels.json`

- 파일이 없다면 `~/.config/karabiner/assets/complex_modifications/` 경로에 json 파일을 저장합니다.

##### **2\. JSON 코드**

```json
{
  "title": "Xcode toggle Navigator + Inspector",
  "rules": [
    {
      "description": "F6 to toggle Xcode Navigator and Inspector (Xcode only)",
      "manipulators": [
        {
          "type": "basic",
          "from": {
            "key_code": "f6"
          },
          "to": [
            {
              "key_code": "0",
              "modifiers": ["command"]
            },
            {
              "key_code": "0",
              "modifiers": ["command", "option"]
            }
          ],
          "conditions": [
            {
              "type": "frontmost_application_if",
              "bundle_identifiers": [
                "^com\\.apple\\.dt\\.Xcode$"
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

##### **3\. Karabiner-Elements 에서 적용**

1. 위 파일을 저장한 후, Karabiner-Elements를 실행
2. `Complex Modifications` 탭을 클릭 > `Add predefined rule` 버튼 클
3. 하단의 **Xcode toggle Navigator + Inspector** 추가 후 목록에 나타나는지 확인

![Complex Modifications 탭을 클릭 > Add predefined rule 버튼 클릭](/assets/img/wp-content/uploads/2025/04/screenshot-2025-04-30-pm-7.51.10-copy.jpg)  
*Complex Modifications 탭을 클릭 > Add predefined rule 버튼 클릭*

 

![하단의 Xcode toggle Navigator + Inspector 추가 후 목록에 나타나는지 확인](/assets/img/wp-content/uploads/2025/04/screenshot-2025-04-30-pm-7.52.05-copy.jpg) 
*하단의 Xcode toggle Navigator + Inspector 추가 후 목록에 나타나는지 확인*
 
## 실행 화면

`F6`을 누르면 동시에 켜고 끌 수 있습니다.

<!-- <iframe width="480" height="226" src="https://giphy.com/embed/WidCN5aVO3w6AdUF7f" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWlqZ3ZlMTdncXZycW1hMXd0MDc0bm05NmxvdWJvOWplM2I5eXcwNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WidCN5aVO3w6AdUF7f/giphy.gif)
 

만약 한 쪽만 열린 상태에서 F6을 누르면 둘 중 하나만 켠 상태로 와리가리를 시전할 수 있습니다.

<!-- <iframe width="480" height="226" src="https://giphy.com/embed/hjxwn0qfYWRNiof52D" frameborder="0" class="giphy-embed" allowfullscreen="allowfullscreen"></iframe> -->
![](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW1pNHJqNDc1M3ZqeTRudG43Y2t6dmJoZmtkZHdsOGhqejJxeTNnMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hjxwn0qfYWRNiof52D/giphy.gif)


<!--[rcblock id="6686"]-->
