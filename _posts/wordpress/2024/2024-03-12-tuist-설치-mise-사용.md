---
published: false
title: "Tuist 설치 (mise 사용)"
date: 2024-03-12
categories: 
  - "none"
---

#### **Tuist 설치**

현재 공식 홈페이지의 튜토리얼이 옛날 버전 기준이라 관련 내용을 업데이트했습니다.

(예: `rtx`가 `mise`로 변경됨 등)

 

##### **Step 1: Tuist 버전을 설치, 관리 및 활성화하는 도구인 [mise](https://github.com/jdx/mise#quickstart)(구 rtx)를 설치하세요.**

터미널을 열고 앞의 `$`를 제외한 명령어를 한줄씩 입력합니다.

```
$ curl https://mise.run | sh
$ chmod +x ~/.local/bin/mise
$ ~/.local/bin/mise --version
```

 ![](/assets/img/wp-content/uploads/2024/03/스크린샷-2024-03-13-오전-1.27.18.png)

 

##### **Step 2: 현재 작업 디렉토리를 기반으로 Tuist를 활성화하려면 `mise`를 셸 (터미널)에 연결하세요.**

아래 `echo` 명령어 중 현재 사용중인 셸을 연결합니다. 확인은 터미널 상단 창 제목에서 확인합니다.

 ![](/assets/img/wp-content/uploads/2024/03/스크린샷-2024-03-13-오전-1.29.30.png)

```
# note this assumes mise is located at ~/.local/bin/mise
# which is what https://mise.run does by default
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
echo '~/.local/bin/mise activate fish | source' >> ~/.config/fish/config.fish
```

 

##### **Step 3: 다음 명령을 실행하여 Tuist를 설치하세요.**

```
$ mise install tuist
```

 ![](/assets/img/wp-content/uploads/2024/03/스크린샷-2024-03-13-오전-1.30.59.png)

##### **\*\*중요\*\* 다음 명령어를 입력해 Tuist를 전체 위치에서 활성화합니다.**

```
$ mise use -g tuist
```

 ![](/assets/img/wp-content/uploads/2024/03/스크린샷-2024-03-13-오전-1.36.05.png)

 

##### **Step 4: 버전 확인 명령어로 Tuist가 올바르게 설치되었는지 확인할 수 있습니다.**

```
$ tuist version
```

 ![](/assets/img/wp-content/uploads/2024/03/스크린샷-2024-03-13-오전-1.33.07.png)

 

##### **Step 5: 궁금한 경우 사용 가능한 명령 목록을 볼 수도 있습니다.**

```
$ tuist
```

```
개요: Xcode 프로젝트를 생성, 빌드 및 테스트하세요.

사용법: tuist <하위명령>

옵션:
   -h, --help 도움말 정보를 표시합니다.

하위 명령:
   build          프로젝트를 빌드합니다.
   clean          로컬에 저장된 모든 아티팩트를 정리합니다.
   dump           매니페스트를 JSON으로 출력합니다.
   edit           프로젝트를 편집할 임시 프로젝트를 현재 디렉토리에 생성합니다.
   install        원격 콘텐츠(예: 종속성)를 설치합니다. 프로젝트와 상호 작용하는 데 필요합니다.
   generate       프로젝트 작업을 시작하기 위한 Xcode 작업공간을 생성합니다.
   graph          현재 디렉터리의 작업공간이나 프로젝트에서 그래프를 생성합니다.
   init           프로젝트 부트스트랩
   migration      Xcode 프로젝트를 Tuist로 마이그레이션하는 데 도움이 되는 유틸리티 세트입니다.
   plugin         플러그인 관리를 위한 명령 집합입니다.
   run            프로젝트에서 구성표 또는 대상을 실행합니다.
   scaffold       템플릿을 기반으로 새 프로젝트를 생성합니다.
   test           프로젝트를 테스트합니다.

자세한 도움말은 'tuist help <하위명령>'을 참조하세요.
```

 

#### **기본 프로젝트 생성**

Tuist가 정상적으로 동작하는지만 간단히 확인하기 위해 프로젝트를 생성합니다.

하이라이트 라인의 명령어를 터미널에 입력해 실행합니다. (`%` 제외)

```
% mkdir TwistApp
% cd TwistApp
% tuist init --platform ios

Project generated at path ...../TwistApp. Run `tuist generate` to generate the project and open it in Xcode. Use `tuist edit` to easily update the Tuist project definition.
To learn more about tuist features, such as how to add external dependencies or how to use our ProjectDescription helpers, head to our tutorials page: https://docs.tuist.io/tutorials/tuist-tutorials

% tuist generate

Loading and constructing the graph
It might take a while if the cache is empty
Using cache binaries for the following targets: 
Generating workspace TwistApp.xcworkspace
Generating project TwistApp
Project generated.
Total time taken: 0.476s
```

 ![](/assets/img/wp-content/uploads/2024/03/스크린샷-2024-03-13-오전-1.56.15-복사본.jpg)

SwiftUI 기반으로 프로젝트가 생성되었습니다.

 

##### **출처**

- [https://docs.tuist.io/tutorials/tuist/install](https://docs.tuist.io/tutorials/tuist/install)
- [https://github.com/tuist/tuist/issues/5863#issuecomment-1928060583](https://github.com/tuist/tuist/issues/5863#issuecomment-1928060583)
