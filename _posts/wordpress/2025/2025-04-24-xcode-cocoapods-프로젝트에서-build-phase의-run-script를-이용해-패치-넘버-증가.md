---
title: "Xcode: CocoaPods 프로젝트에서 Build Phase의 Run Script를 이용해 패치 넘버 증가"
date: 2025-04-24
categories: 
  - "DevLog"
  - "Xcode/iOS기타"
---

##### **관련 글 Run Script**

- [Swift Package Manager(SPM)와 CocoaPods를 동시에 대응하는 라이브러리 만들기 (1)](http://yoonbumtae.com/?p=5011)

 

#### **버전 넘버 구성**

예) [Semantic Versioning](https://en.wikipedia.org/wiki/Software_versioning#Semantic_versioning) 라는 방법에 따르면 `1.0.0` 이라는 버전이 있을 때 앞에서부터 순서대로

- 메이저 버전
- 마이너 버전
- 패치 버전

라고 합니다.

> **Semantic Versioning(SemVer)**은 소프트웨어 버전을 체계적으로 관리하기 위한 규칙으로, 버전 번호를 주버전.부버전.패치버전 형식으로 구성합니다. 이 버전 규칙은 변경 사항의 위험도와 기능적 의미를 기준으로 버전을 증가시킵니다.
> 
> **주버전(Major)**은 호환되지 않는 큰 변경이 있을 때 증가하며, **부버전(Minor)**은 기존 기능을 해치지 않는 새로운 기능이 추가될 때 증가합니다. **패치버전(Patch)**은 버그 수정이나 사소한 변경 시에 증가합니다. 즉, 변경의 위험도가 높을수록 앞자리를 증가시키고, 위험도가 낮을수록 뒤의 숫자가 증가합니다.
> 
> 또한 -alpha, -beta와 같은 프리릴리즈 태그는 아직 안정되지 않은 사전 릴리스 버전을 의미하며, 주버전이 0으로 시작하는 0.y.z 형식은 개발 초기 상태로 언제든지 호환성이 깨질 수 있음을 나타냅니다. 예를 들어, 2.1.5를 사용하는 소프트웨어는 2.2.3과는 호환되지만, 3.2.4와는 호환되지 않을 수 있습니다.

 

#### **Run Script 로 podspec 파일의 패치 버전 증가**

Xcode에서 매 빌드마다 `.podspec` 파일의 \*\*패치 버전(Patch)\*\*을 자동으로 +1 해주는 **Run Script**를 작성할 수 있습니다. 프로젝트 루트에 위치한 `BGSMM_DevKit.podspec` 파일을 찾아 현재 버전을 읽고, 패치 버전을 증가시킨 뒤 다시 파일을 수정합니다.

 

##### **podspec 파일이란 무엇인가요?**

podspec 파일은 CocoaPods에서 사용하는 라이브러리의 메타 정보를 정의하는 파일입니다. Swift 또는 Objective-C로 작성된 라이브러리를 외부에서 재사용할 수 있도록 패키징할 때, 이 파일을 통해 해당 라이브러리의 이름, 버전, 소스 경로, 종속성 등을 정의합니다. Run Script

예를 들어, 다음은 BGSMM\_DevKit이라는 라이브러리의 podspec 일부입니다:

```
Pod::Spec.new do |s|
    s.name = 'BGSMM_DevKit'
    s.version = '1.1.4'
```

여기서 `s.name`은 라이브러리의 이름을, `s.version`은 현재 버전 정보를 나타냅니다. 이 값은 `pod trunk push` 같은 배포 명령 시 사용되며, CocoaPods 저장소에 올라간 후에는 한 번 등록된 버전은 수정할 수 없습니다. 따라서 정확한 버전 관리가 중요합니다.

CocoaPods 프로젝트에서 Build Phase의 Run Script를 이용해 패치 넘버 증가

##### **Step 1: 워크스페이스에서 Pods 프로젝트를 클릭한 뒤 Target > Build Phase > \[+\] 버튼을 눌러 Run Script를 추가합니다.**

\[caption id="attachment\_6991" align="alignnone" width="336"\] ![](/assets/img/wp-content/uploads/2025/04/스크린샷-2025-04-24-오후-8.11.11-복사본.jpg) Pods 클릭\[/caption\]

\[caption id="attachment\_6992" align="alignnone" width="721"\] ![](/assets/img/wp-content/uploads/2025/04/스크린샷-2025-04-24-오후-8.18.22-복사본.jpg) 상단의 `[+]` 버튼을 눌러 `Run Script` 추가\[/caption\] 

##### **Step 2: 호환성을 위해 Shell을 / b i n / b a s h로 설정**

\[caption id="attachment\_6993" align="alignnone" width="753"\] ![](/assets/img/wp-content/uploads/2025/04/스크린샷-2025-04-24-오후-8.00.59-복사본.jpg) Shell 변경\[/caption\]

나머지 옵션은 그대로 둡니다.

 

##### **Step 3: 스크립트 코드 작성**

```
echo "🚀 Run Script 실행됨! ${PROJECT_DIR}"

LIBRARY_ROOT=$(cd "${PROJECT_DIR}/../.." && pwd)
PODSPEC_FILE="${LIBRARY_ROOT}/BGSMM_DevKit.podspec"

# 현재 버전 추출 (숫자 3개만 필터링)
versionLine=$(grep 's.version' "$PODSPEC_FILE")
versionString=$(echo "$versionLine" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')

IFS='.' read -r major minor patch <<< "$versionString"

# 패치 버전이 정수인지 확인
if ! [[ "$patch" =~ ^[0-9]+$ ]]; then
  echo "❌ patch 버전이 정수가 아닙니다: $patch"
  exit 1
fi

# 패치 버전 증가
newPatch=$((patch + 1))
newVersion="${major}.${minor}.${newPatch}"

# 교체 (작은/큰따옴표 모두 대응)
sed -i '' -E "s/(s\.version[[:space:]]*=[[:space:]]*['\"])$versionString(['\"])/\1$newVersion\2/" "$PODSPEC_FILE"

# 변경되었는지 확인
if grep -q "$newVersion" "$PODSPEC_FILE"; then
  echo "✅ podspec 버전이 $versionString → $newVersion 으로 변경되었습니다."
else
  echo "❌ 버전 변경에 실패했습니다. 현재 버전: $versionString"
  exit 1  # 실패로 간주하고 빌드 중단
fi
```

##### **스크립트 작동 방식 요약**

1. `PROJECT_DIR` 기준으로 `.podspec` 경로 추적 - `PROJECT_DIR` 와 실제 위치가 일치하지 않는 경우 위치를 조정합니다.
2. 현재 버전 문자열(x.y.z) 추출
3. z(패치버전)를 +1 증가
4. 원래 버전을 새 버전으로 교체
5. 실제 교체되었는지 검증 후 성공/실패 메시지 출력

 

##### **Run Script를 이용한 자동화의 장점**

이 스크립트를 사용하면 `.podspec`을 수정하고 커밋할 때마다 **자동으로 버전이 업데이트되므로**,실수로 같은 버전으로 배포하는 일을 방지할 수 있고, **CI/CD 자동화에도 유리**합니다.

단, 한 번 릴리즈된 버전은 CocoaPods 서버에 재등록할 수 없기 때문에, **실제 배포 전에 반드시 커밋 + 태그 작업도 병행**해 주세요.

\[rcblock id="6686"\]
