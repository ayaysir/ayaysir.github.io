---
published: false
title: "Claude와 MCP (Figma MCP, 유튜브 요약 정리 MCP) 연동 가이드"
date: 2025-05-23
categories: 
  - "none"
---

# **소개**

Claude와 Figma의 연동 방법을 소개해드리겠습니다. MCP(Model Context Protocol)를 통해 Claude가 Figma 파일에 직접 접근하여 디자인 분석, 코드 생성 등 다양한 작업을 수행할 수 있습니다.

 

## **MCP(Model Context Protocol)란?**

MCP는 AI 모델이 외부 시스템과 안전하게 연결할 수 있도록 해주는 개방형 프로토콜입니다. 이를 통해 Claude는 다양한 도구와 서비스에 접근하여 더욱 강력하고 실용적인 기능을 제공할 수 있습니다.

MCP의 주요 특징은 다음과 같습니다:

- **보안성**: 안전한 연결을 통해 데이터 보호를 보장합니다
- **확장성**: 다양한 서비스와 도구를 쉽게 연결할 수 있습니다
- **표준화**: 일관된 방식으로 외부 시스템과 통신합니다

 

## **Claude 다운로드 및 설치**

MCP 기능을 사용하려면 데스크톱 버전의 Claude가 필요합니다.

1. **Claude 공식 웹사이트 방문**
    - [https://claude.ai](https://claude.ai)에 접속하세요
2. **데스크톱 앱 다운로드**
    - 페이지 하단의 "Download Claude" 버튼을 클릭하세요
    - 운영체제에 맞는 버전을 선택하세요 (Windows, macOS, Linux)
3. **설치 진행**
    - 다운로드한 설치 파일을 실행하세요
    - 설치 마법사의 안내에 따라 설치를 완료하세요
4. **계정 로그인**
    - Claude 앱을 실행하고 기존 계정으로 로그인하세요

 

## **Figma MCP 서버 설치 및 설정**

### **1\. Figma 개인 액세스 토큰 발급**

먼저 Figma에서 API 접근을 위한 개인 토큰을 발급받아야 합니다.

1. **Figma 웹사이트 접속**
    - [https://figma.com](https://figma.com)에 로그인하세요
2. **프로필 설정 진입**
    - 우측 상단의 프로필 아이콘을 클릭하세요
    - "Settings" 메뉴를 선택하세요  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-pm-3.40.31-copy.jpg)
3. **보안 메뉴 접근**
    - 좌측 메뉴에서 "Security" 탭을 클릭하세요  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-pm-3.40.43-copy.jpg)
4. **개인 액세스 토큰 생성**
    - "Personal access tokens" 섹션을 찾으세요
    - "Create new token" 버튼을 클릭하세요
    - 토큰 이름을 입력하고 "Create token" 버튼을 클릭하세요
    - **중요**: 생성된 토큰을 안전한 곳에 복사해 두세요 (다시 확인할 수 없습니다)  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-am-1.09.38-copy.jpg)

 

### **2\. Node.js 설치 (필요한 경우)**

MCP 서버 실행을 위해 Node.js가 필요합니다.

1. **Node.js 설치 확인**
    - 터미널(Windows의 경우 명령 프롬프트)을 열어주세요
    - `node --version` 명령어를 입력하세요
    - 버전이 표시되면 이미 설치되어 있습니다
2. **Node.js 설치 (미설치 시)**
    - [https://nodejs.org](https://nodejs.org)에서 LTS 버전을 다운로드하세요
    - 설치 파일을 실행하고 안내에 따라 설치를 완료하세요

 

### **3\. Figma MCP 서버 설정**

터미널에서 다음 명령어를 실행하여 Figma MCP 서버를 설정하고 시작할 수 있습니다:

```bash
npx figma-developer-mcp --figma-api-key=<발급받은_피그마_토큰>
```

위 명령어에서 `<발급받은_피그마_토큰>` 부분을 실제 토큰으로 교체해주세요.

 ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-pm-3.28.26-copy.jpg)

## **Claude에 Figma MCP 추가하기**

### **1\. 개발자 모드 활성화**

1. **Claude 데스크톱 앱 실행**
2. **도움말 메뉴 접근**
    - 상단 메뉴바에서 "Help" 또는 "도움말"을 클릭하세요
3. **개발자 모드 활성화**
    - "Enable Developer Mode" 또는 "개발자 모드 활성화"를 선택하세요

 ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-am-1.24.19-copy.jpg)

### **2\. MCP 서버 설정 파일 편집**

 ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-am-1.25.29-copy.jpg)

1. **설정 메뉴 진입**
    - 상단 메뉴바에서 "Claude" → "Settings" 또는 "설정"을 클릭하세요
2. **개발자 메뉴 접근**
    - 좌측 메뉴에서 "Developer" 또는 "개발자" 탭을 선택하세요
3. **설정 파일 편집**
    - "Edit Config" 또는 "설정 편집" 버튼을 클릭하세요
    - `claude_desktop_config.json` 파일이 열립니다
4. **Figma MCP 설정 추가** 다음 JSON 코드를 파일에 입력하세요:

```json
{
  "mcpServers": {
    "figma-developer-mcp": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "발급받은_피그마_개인_토큰"
      }
    }
  }
}
```

**주의사항**: `"발급받은_피그마_개인_토큰"` 부분을 실제 토큰으로 교체해주세요.

5. **설정 저장**
    - 파일을 저장하고 편집기를 닫으세요

 

### **3\. Claude 재시작 및 확인**

1. **Claude 앱 재시작**
    - Claude 앱을 완전히 종료한 후 다시 실행하세요
2. **MCP 연결 확인**
    - 새로운 대화를 시작하세요
    - 화면 하단에 MCP 서버가 연결되었다는 표시가 나타나면 성공입니다  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-am-1.28.07-copy.jpg)
3. **기능 테스트**
    - Claude에게 "Figma MCP로 무엇을 할 수 있나요?"라고 물어보세요
    - Figma 파일 URL을 제공하고 간단한 분석을 요청해보세요  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-pm-3.19.49-copy.jpg)

 

## **추가 MCP 서버: YouTube Transcript**

Figma MCP 외에도 다양한 MCP 서버를 추가할 수 있습니다. 예시로 YouTube 자막을 추출하는 MCP를 추가해보겠습니다.

### **YouTube Transcript MCP 소개**

YouTube Transcript MCP는 YouTube 동영상의 자막을 자동으로 추출하여 내용을 요약하고 분석할 수 있게 해주는 도구입니다. 이를 통해 긴 동영상의 핵심 내용을 빠르게 파악할 수 있습니다.

### 설정 방법

기존의 `claude_desktop_config.json` 파일을 다음과 같이 수정하세요:

```json
{
  "mcpServers": {
    "figma-developer-mcp": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "발급받은_피그마_액세스_토큰"
      }
    },
    "youtube-transcript": {
      "command": "npx",
      "args": ["-y", "@kimtaeyoon83/mcp-server-youtube-transcript"]
    }
  }
}
```

### **변경사항 설명**

기존 설정과 비교하여 다음과 같은 부분이 추가되었습니다:

1. **JSON 구조**: `mcpServers` 객체 내에 두 번째 서버가 추가되었습니다
2. **콤마 추가**: 첫 번째 서버 설정 후에 콤마(`,`)를 추가했습니다
3. **새 서버 설정**: `"youtube-transcript"` 키로 새로운 MCP 서버를 정의했습니다
4. **패키지 지정**: npm 패키지 `@kimtaeyoon83/mcp-server-youtube-transcript`를 사용합니다

 

### **설정 완료 및 테스트**

1. **설정 파일 저장**
    - 수정된 JSON 파일을 저장하세요
2. **Claude 재시작**
    - Claude 앱을 완전히 종료한 후 다시 실행하세요
3. **연결 확인**
    - 새로운 대화에서 두 개의 MCP 서버가 모두 연결되었는지 확인하세요  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-am-1.38.11-copy.jpg)
4. **기능 테스트**
    - YouTube 동영상 URL을 제공하고 자막 추출 및 요약을 요청해보세요
    - 예: "이 YouTube 동영상의 내용을 요약해주세요: \[YouTube URL\]"  ![](/assets/img/wp-content/uploads/2025/05/screenshot-2025-05-23-pm-3.58.11-copy.jpg)

 

<!--[rcblock id="6686"]-->
