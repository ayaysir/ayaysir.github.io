---
title: "macOS 홈브루(brew)에서 Updating Homebrew... 멈춤현상 해결방법 및 권한 설정 방법"
date: 2020-07-11
categories: 
  - "DevLog"
  - "etc"
---

macOS 홈브루(brew)에서

## **Updating Homebrew... 멈춤현상 해결방법**

> ([스택오버플로 링크](https://stackoverflow.com/questions/41030429/brew-upgrade-hangs-on-el-capitan))

1. `control + z` 버튼을 눌러 업그레이드 작업 중단
2. 터미널창에 `brew doctor` 입력
3. 터미널창에 `brew cleanup` 입력
4. 터미널창에 `brew doctor` 다시 입력
5. `sudo xcode-select --install` 입력

 

## **권한 오류 해결방법**

다음과 같은 에러가 나오면서 brew 프로그램 설치가 안될 때

```
Error: The following directories are not writable by your user:
/usr/local/share/man/man5
/usr/local/share/man/man7
```

터미널에서 나오는 두 문장을 그대로 복사한 후 붙여넣기 엔터 하면 됩니다.

 ![](/assets/img/wp-content/uploads/2020/07/screenshot-2020-07-11-pm-6.00.13.png)

```sh
sudo chown -R $(whoami) /usr/local/share/man/man5 /usr/local/share/man/man7
```

```sh
chmod u+w /usr/local/share/man/man5 /usr/local/share/man/man7
```
