---
title: "Git/GitHub: .gitignore 적용 안될때 / 어멘드(amend)하는 방법 / 오픈소스 라이브러리에 PR(풀 리퀘스트)하는 방법"
date: 2025-04-29
categories: 
  - "DevLog"
  - "Git"
---

### **.gitignore 적용 안될때** 

.gitignore가 제대로 적용되지 않는 경우, 주로 이미 Git에 추적되고 있는 파일이거나 .gitignore 파일이 잘못 설정된 경우입니다. 이를 해결하기 위한 단계별 점검 및 해결 방법은 아래와 같습니다.

 

#### **이미 추적되고 있는 파일인지 확인**

.gitignore는 Git이 추적하지 않는 파일에만 적용됩니다. 이미 추적 중인 파일은 .gitignore에 추가해도 무시되지 않습니다.

 

#### **해결 방법:**

- **캐시에서 파일 제거:** `git rm --cached <파일명 또는 디렉터리>` 예: `git rm --cached -r my_folder/`
- **변경 사항 커밋:** `git commit -m "Remove files from tracking"`
- .gitignore에 해당 파일/디렉터리를 추가한 후, 제대로 동작하는지 확인합니다.

 

#### **.gitignore 경로 및 패턴 확인**

.gitignore의 경로나 작성된 패턴이 정확하지 않을 수 있습니다.

##### **체크 리스트:**

- **파일 이름이 정확한지 확인**:
    - .gitignore는 파일 이름 앞에 .이 있어야 하며, 루트 디렉터리에 있어야 합니다.
- **패턴 확인**:
    - 특정 디렉터리를 무시하려면 디렉터리 경로 뒤에 /를 추가해야 합니다. `logs/ # logs 디렉터리 무시` `*.log # 확장자가 .log인 모든 파일 무시`

- - 특정 하위 디렉터리의 파일을 무시하려면 전체 경로를 지정해야 합니다. `/app/cache/ # app 디렉터리 내 cache 디렉터리 무시`

 

#### **Git이 .gitignore를 제대로 인식하는지 확인**

.gitignore 파일 자체가 Git에 의해 무시되고 있을 수 있습니다.

##### **확인 방법:**

```
git check-ignore -v <파일명>
```

이 명령어는 특정 파일이 .gitignore에 의해 무시되는지 확인하고, 관련 규칙을 출력합니다.

##### **해결 방법:**

.gitignore 파일 자체를 무시하는 항목이 .git/info/exclude나 상위 .gitignore 파일에 있는 경우 해당 항목을 제거합니다.

 

#### **.gitignore 강제 재적용**

.gitignore 수정 후에도 반영되지 않을 경우, 캐시를 완전히 삭제하고 다시 설정해야 합니다.

##### **해결 방법:**

- **Git 캐시 초기화:** `git rm -r --cached .`
- **.gitignore 파일이 적용되었는지 확인:** `git status`
- **변경 사항 커밋** `git add .` `git commit -m "Apply updated .gitignore"`

 

#### **.gitignore 파일 외부 설정 확인**

- .gitignore 외에 .git/info/exclude 파일이나 시스템 전체 설정 (~/.config/git/ignore)에서도 무시 규칙이 적용될 수 있습니다.

##### **확인 방법:**

- `cat .git/info/exclude`
- `cat ~/.config/git/ignore`

 

* * *

 

### **이미 원격 저장소에 푸시된 커밋을 어멘드(amend)하는 방법**

이미 GitHub 등 **원격 저장소에 푸시된 커밋을 --amend로 수정하고 다시 푸시하려면**, \*\*주의사항이 있는 강제 푸시(force push)\*\*를 사용해야 합니다.

 

#### **\--amend****로 마지막 커밋 수정하기**

```
git commit --amend
```

이 명령어는 마지막 커밋 메시지를 수정하거나, 파일 추가 등을 수정할 수 있게 해줍니다. 수정이 끝나면 저장하고 종료하세요.

 

#### **변경된 커밋을 강제로 푸시하기**

```
git push --force
```

혹은 리모트 이름이 origin, 브랜치 이름이 main이면:

```
git push origin main --force
```

### **⚠️ 주의:** **\--force****는 신중하게!**

- `--amend`는 **커밋 해시를 변경**합니다.
- 이미 푸시된 커밋을 바꾸면, **공동 작업자가 있을 경우 그들의 히스토리를 깨뜨릴 수 있습니다.**
- 따라서 **혼자 작업하거나, 팀원과 협의 후에만 사용**하세요.

> 🔐 안전하게 강제 푸시하려면 \--force-with-lease 사용도 고려:

```
git push --force-with-lease
```

이 명령은 “내 로컬이 최신 상태가 맞다면 강제 푸시”를 허용합니다.

 

#### **✅ 요약**

| **작업** | **명령어** |
| --- | --- |
| 마지막 커밋 수정 | git commit --amend |
| 수정된 커밋 푸시 | git push --force |
| 안전한 강제 푸시 | git push --force-with-lease |

.

 

* * *

### **깃허브 오픈소스 라이브러리에 풀 리퀘스트 (Pull Request) 하는 방법**

#### **1\. 프로젝트 포크(Fork)**

PR을 보내려면 먼저 해당 오픈소스 프로젝트를 **Fork**해야 합니다.

1. GitHub에서 기여하려는 리포지토리로 이동합니다.
2. 우측 상단에 있는 **“Fork”** 버튼을 클릭합니다.
3. 내 GitHub 계정으로 포크된 리포지토리가 생성됩니다.

 

#### **2\. 로컬에 클론(Clone)**

포크한 리포지토리를 로컬 환경으로 가져옵니다.

```
git clone https://github.com/내-깃허브-이름/프로젝트이름.git
cd 프로젝트이름
```

원본(upstream) 저장소를 추가하여 최신 코드와 동기화할 수 있도록 설정합니다.

```
git remote add upstream https://github.com/원본-저장소-이름/프로젝트이름.git
git fetch upstream
```

 

#### **3\. 새 브랜치 생성**

기여할 기능이나 버그 수정을 위해 새로운 브랜치를 생성합니다.

```
git checkout -b fix/issue-123
```

브랜치 이름은 보통 fix/버그번호 또는 feature/기능이름 형식으로 정합니다.

 

#### **4\. 코드 수정 및 커밋**

이제 코드를 수정한 후 변경 사항을 커밋합니다.

```
git add .
git commit -m "fix: 버그 수정 내용 또는 기능 추가 내용"
```

커밋 메시지는 일반적으로 다음과 같은 형식을 따르는 것이 좋습니다.

- fix: ~ (버그 수정)
- feat: ~ (새로운 기능 추가)
- docs: ~ (문서 수정)
- refactor: ~ (코드 리팩토링)

 

#### **5\. 포크된 리포지토리에 푸시(Push)**

포크한 내 저장소에 변경 사항을 올립니다.

```
git push origin fix/issue-123
```

#### **6\. Pull Request(PR) 생성**

1. GitHub에서 내 포크된 리포지토리로 이동합니다.
2. “Compare & pull request” 버튼을 클릭합니다.
3. PR 제목과 설명을 작성합니다.
    - 변경 사항을 간략하게 설명하고, 왜 필요한지 추가합니다.
    - 관련 이슈가 있다면 Closes #123 형식으로 연결합니다.
4. “Create Pull Request” 버튼을 클릭합니다.

 

#### **7\. 코드 리뷰 및 피드백 반영**

- 프로젝트 관리자가 리뷰를 남길 수 있습니다.
- 수정이 필요하면 다시 코드를 변경한 후 푸시하면 PR에 자동 반영됩니다.

```
git add .
git commit --amend -m "수정된 내용 추가"
git push origin fix/issue-123 --force
```

 

#### **8\. PR 머지 및 정리**

PR이 승인되면 프로젝트 관리자가 PR을 머지합니다. 머지된 후, 로컬과 포크된 저장소를 정리합니다.

```
git checkout main
git pull upstream main
git push origin main
git branch -d fix/issue-123
```

이제 PR이 성공적으로 반영되었습니다! \[rcblock id="6686"\]
