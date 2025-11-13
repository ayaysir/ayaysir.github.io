---
title: "스프링 부트(Spring Boot) 미디 플레이어 만들기 (1): Timidity++, LAME을 이용해 미디(midi) 파일을 mp3로 변환하는 메소드 만들기"
date: 2020-07-30
categories: 
  - "DevLog"
  - "Spring/JSP"
---

제가 예전에 자바스크립트의 [MIDIjs](http://www.midijs.net/)라는 라이브러리를 이용해 [미디 플레이어](http://yoonbumtae.com/music/midi/)를 만든 적이 있습니다.

- [자바스크립트: 인터넷에서 미디(MIDI) 파일을 바로 재생하는 라이브러리(http://www.midijs.net/) + 예제: 미디 플레이어](http://yoonbumtae.com/?p=1054)

 

여기서 다른 스마트폰에서는 테스트해보지 않았지만 아이폰에서는 사파리 창을 닫으면 재생이 되지 않습니다. 컴퓨터에서는 문제가 없습니다만, 아이폰에서는 제가 사용하면서 이 점이 매우 불편했습니다. 그런데 외부 라이브러리를 사용했기 때문에 이 문제를 제가 컨트롤 할 수가 없었습니다.

이번에 아마존 웹 서비스 배포 연습을 할 목적으로 새 프리티어 EC2 계정을 만들었는데 여기다가 자바(스프링 부트)+리눅스를 이용한 미디플레이어를 새로 만들어볼 생각입니다. 먼저 만들었던 것에서 디자인과 기능은 그대로 사용하고, 미디 파일을 받아오는 방식만 바꿀 예정입니다.

먼저, 첫 단계로 [Timidity++](https://wiki.archlinux.org/index.php/Timidity)와 [LAME](https://lame.sourceforge.io/) 인코더를 이용해 미디 파일을 mp3로 바꾸는 메소드만 하나 만들어 보겠습니다. 경로를 입력하면 Timidity++를 이용해 미디 파일을 wav 파일로 바꾼 뒤, 이 wav 파일을 LAME을 사용해 mp3로 바꿉니다.

 

#### **Timidity++, LAME 설치**

**Homebrew가 있는 경우**

```
brew install timidity
brew install lame
```

아마존 AMI에서 설치하는 방법은 [링크](https://blog.rajephon.dev/2018/10/19/convert-midi-to-mp3-ogg-on-aws-linux/)를 참고해주세요.

 

#### **TimidityRunner 클래스 작성**

https://gist.github.com/ayaysir/438888a48809a8cb138ff2bbb923b0a4

- 미디 파일의 경로를 입력하면 같은 디렉토리에 wav 파일과 mp3파일을 만들고, mp3파일의 자바 `File` 객체를 반환합니다.
- `ProcessBuilder`를 사용하면 터미널 명령어를 실행할 수 있습니다. 프로세스의 `.getInputStream`()은 현재 프로세스에서 터미널 화면에 표시되는 내용을 가져인풋 스트림 형태로 가져오고 이것을 `BufferedReader`를 통해 자바 실행창에 표시합니다.
- `ProcessBuilder midiBuilder = new ProcessBuilder``(midiCmd);` - 커맨드를 입력할 때에는 커맨드와 매개변수를 분리해서 스트링 배열 (또는 다중 스트링 파라미터)로 입력해야 합니다. 예) 터미널에서 `ls ~/` 로 입력하는 경우 `new ProcessBuilder(new String[]  {"ls", "~/"});` 로 입력
- Timidity++에서 미디 파일을 wav로 변환하는 명령은 `timidity [midi_path] -o [wave_path]` `-Ow` 입니다.
- wav로 변환이 되었다면 mp3 변환을 준비합니다.
- wav 파일을 mp3로 변환하는 명령은 `lame [wave_path] [mp3_path]`입니다.

 

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-08-01-pm-3.31.52.png) ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-08-01-pm-3.32.09.png)
