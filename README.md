# 🍎 Bad Apple ASCII Art Player

배드애플 뮤직비디오를 실시간으로 ASCII 아트로 변환하여 재생하는 웹 플레이어입니다.

## 🎥 시연 영상

https://github.com/[사용자명]/[저장소명]/raw/main/res/result.mov

> 실제 동작하는 모습을 확인해보세요! ASCII 아트로 변환된 배드애플이 오디오와 함께 재생됩니다.

## ✨ 특징

- 🎬 **실시간 ASCII 변환**: 비디오의 각 프레임을 실시간으로 ASCII 아트로 변환
- 🎵 **오디오 싱크**: 원본 오디오와 완벽하게 동기화된 재생
- ⚡ **부드러운 재생**: 10fps로 최적화된 프레임레이트
- 🎮 **간단한 조작**: 클릭 또는 스페이스바로 재생/일시정지
- 🌐 **순수 웹**: CSS 없이 바닐라 HTML/TypeScript로 구현
- 📱 **반응형**: 다양한 화면 크기에서 동작

## 🛠️ 기술 스택

- **TypeScript**: 타입 안전성과 코드 품질 보장
- **pnpm**: 빠르고 효율적인 패키지 관리
- **Canvas API**: 비디오 프레임 처리 및 픽셀 데이터 추출
- **HTML5 Video**: 비디오 재생 및 오디오 처리

## 🚀 실행 방법

### 1. 의존성 설치

\`\`\`bash
pnpm install
\`\`\`

### 2. TypeScript 컴파일

\`\`\`bash
pnpm build
\`\`\`

### 3. 웹 서버 실행

```bash
pnpm serve
```

또는

```bash
python3 -m http.server 8000
```

### 4. 브라우저에서 접속

브라우저에서 다음 주소로 접속:

```
http://localhost:8000
```

## 🎮 사용법

1. 웹페이지가 로드되면 비디오 준비 완료 메시지가 표시됩니다
2. 화면을 클릭하거나 스페이스바를 눌러 재생을 시작합니다
3. 같은 방법으로 일시정지/재생을 제어할 수 있습니다
4. 배드애플 뮤직비디오가 ASCII 아트로 변환되어 오디오와 함께 재생됩니다

## 📁 프로젝트 구조

```
bad-apple/
├── src/
│   └── main.ts          # 메인 TypeScript 소스
├── res/
│   ├── video.mp4        # 배드애플 비디오 파일
│   └── result.mov       # 시연 영상
├── dist/                # 컴파일된 JavaScript (자동 생성)
├── index.html           # 메인 HTML 파일
├── package.json         # 프로젝트 설정
├── tsconfig.json        # TypeScript 설정
└── .gitignore           # Git 무시 파일 목록
```

## ⚙️ 커스터마이징

### 프레임레이트 변경

\`src/main.ts\`에서 \`frameRate\` 값을 수정:
\`\`\`typescript
private frameRate: number = 10; // 원하는 fps 값으로 변경
\`\`\`

### ASCII 문자 변경

ASCII 아트의 밝기 표현을 변경하려면:

```typescript
private asciiChars: string = " .-:=+*#%@"; // 원하는 문자로 변경
```

### 해상도 조정

ASCII 아트의 해상도를 변경하려면:
\`\`\`typescript
this.canvas.width = 120; // 가로 해상도
this.canvas.height = 80; // 세로 해상도
\`\`\`

## 🎯 배드애플 밈에 대하여

배드애플(Bad Apple!!)은 동방프로젝트의 유명한 곡으로, 특히 흑백 실루엣 뮤직비디오로 인터넷에서 큰 인기를 얻었습니다. 이 프로젝트는 해당 영상을 ASCII 아트로 재현하여 프로그래밍과 예술의 조화를 보여줍니다.

## 📄 라이선스

이 프로젝트는 개인적인 학습 및 재미를 위해 제작되었습니다.  
배드애플 영상의 저작권은 원작자에게 있습니다.

---

**즐거운 ASCII 아트 감상되세요! 🍎✨**
