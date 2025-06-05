"use strict";
class BadApplePlayer {
    constructor() {
        this.isPlaying = false;
        this.frameRate = 30;
        this.canvasWidth = 120;
        this.canvasHeight = 80;
        // ASCII 문자 (밝기 순서) - 배드애플에 최적화
        this.asciiChars = " .-:=+*#%@";
        this.calculateCanvasSize();
        this.setupElements();
        this.frameInterval = 1000 / this.frameRate;
        this.setupEventListeners();
        this.setupResizeListener();
    }
    calculateCanvasSize() {
        // 화면 너비에 맞춰 ASCII 아트 크기 계산
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        // 모노스페이스 폰트의 가로세로 비율 고려 (약 0.6)
        const charAspectRatio = 0.6;
        // 화면 너비에 맞는 문자 수 계산 (여백 고려)
        const targetCharsPerLine = Math.floor(screenWidth / 8); // 8px 폰트 크기 기준
        // 16:9 비율 유지하면서 높이 계산
        const targetLines = Math.floor((targetCharsPerLine * charAspectRatio) * (9 / 16));
        this.canvasWidth = Math.min(targetCharsPerLine, 200); // 최대 200자
        this.canvasHeight = Math.min(targetLines, 150); // 최대 150줄
        // 최소 크기 보장
        if (this.canvasWidth < 80)
            this.canvasWidth = 80;
        if (this.canvasHeight < 60)
            this.canvasHeight = 60;
    }
    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.calculateCanvasSize();
            this.updateCanvasSize();
            this.updateFontSize();
        });
    }
    updateCanvasSize() {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
    }
    updateFontSize() {
        // 화면 너비에 맞는 폰트 크기 계산
        const screenWidth = window.innerWidth;
        const fontSize = Math.max(4, Math.min(12, screenWidth / this.canvasWidth));
        const lineHeight = fontSize * 0.8;
        this.output.style.fontSize = `${fontSize}px`;
        this.output.style.lineHeight = `${lineHeight}px`;
        this.output.style.width = '100vw';
        this.output.style.height = '100vh';
        this.output.style.display = 'flex';
        this.output.style.alignItems = 'center';
        this.output.style.justifyContent = 'center';
    }
    setupElements() {
        // 비디오 엘리먼트 생성 (숨김)
        this.video = document.createElement("video");
        this.video.src = "res/video.mp4";
        this.video.style.display = "none";
        this.video.crossOrigin = "anonymous";
        this.video.muted = false; // 오디오 활성화
        this.video.volume = 0.8; // 볼륨 설정
        document.body.appendChild(this.video);
        // 캔버스 생성 (숨김)
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvas.style.display = "none";
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        // ASCII 출력용 pre 엘리먼트
        this.output = document.createElement("pre");
        this.output.style.fontFamily = "monospace";
        this.output.style.color = "white";
        this.output.style.backgroundColor = "black";
        this.output.style.margin = "0";
        this.output.style.padding = "0";
        this.output.style.whiteSpace = "pre";
        this.output.style.overflow = "hidden";
        this.output.style.position = "fixed";
        this.output.style.top = "0";
        this.output.style.left = "0";
        this.output.style.zIndex = "1000";
        document.body.appendChild(this.output);
        // 초기 폰트 크기 설정
        this.updateFontSize();
    }
    setupEventListeners() {
        // 비디오 로드 완료 시
        this.video.addEventListener("loadeddata", () => {
            console.log("Video loaded");
        });
        // 스페이스바로 재생/일시정지
        document.addEventListener("keydown", (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                this.togglePlay();
            }
        });
        // 클릭으로 재생/일시정지
        document.addEventListener("click", () => {
            this.togglePlay();
        });
    }
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            // 오디오 컨텍스트가 suspended 상태일 경우 재개
            this.video.play().catch((error) => {
                console.log("재생 오류:", error);
                // 사용자 상호작용이 필요한 경우의 처리
                this.output.textContent =
                    "클릭해서 재생을 시작하세요!\n(브라우저 정책상 사용자 상호작용 필요)";
            });
            this.startRendering();
        }
    }
    pause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.video.pause();
            // 애니메이션 중단
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = undefined;
            }
        }
    }
    startRendering() {
        let lastFrameTime = 0;
        const targetFrameInterval = this.frameInterval;
        const render = (currentTime) => {
            if (!this.isPlaying || this.video.paused) {
                return;
            }
            // 첫 번째 프레임이거나 충분한 시간이 지났을 때만 렌더링
            if (currentTime - lastFrameTime >= targetFrameInterval) {
                this.renderFrame();
                lastFrameTime = currentTime;
            }
            // 다음 프레임 요청 및 ID 저장
            this.animationId = requestAnimationFrame(render);
        };
        // 첫 번째 프레임 시작
        this.animationId = requestAnimationFrame(render);
    }
    renderFrame() {
        // 비디오 프레임을 캔버스에 그리기
        this.ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight);
        // 이미지 데이터 가져오기
        const imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        const pixels = imageData.data;
        let asciiArt = "";
        // 각 픽셀을 ASCII 문자로 변환
        for (let y = 0; y < this.canvasHeight; y++) {
            for (let x = 0; x < this.canvasWidth; x++) {
                const pixelIndex = (y * this.canvasWidth + x) * 4;
                const r = pixels[pixelIndex];
                const g = pixels[pixelIndex + 1];
                const b = pixels[pixelIndex + 2];
                // 그레이스케일로 변환
                const gray = (r + g + b) / 3;
                // 밝기를 ASCII 문자 인덱스로 변환
                const charIndex = Math.floor((gray / 255) * (this.asciiChars.length - 1));
                asciiArt += this.asciiChars[charIndex];
            }
            asciiArt += "\n";
        }
        // ASCII 아트 출력
        this.output.textContent = asciiArt;
    }
    // 초기화
    init() {
        // 시작 안내 메시지 표시
        this.output.textContent =
            "배드애플 ASCII 아트 플레이어 🎵\n\n로딩 중...\n\n클릭하거나 스페이스바를 눌러 재생/일시정지\n(오디오 포함)";
        // 페이지 로드 후 비디오 로드 대기
        window.addEventListener("load", () => {
            this.video.addEventListener("canplay", () => {
                this.output.textContent =
                    "배드애플 ASCII 아트 플레이어 🎵\n\n준비 완료!\n\n클릭하거나 스페이스바를 눌러 재생 시작\n(오디오와 함께 재생됩니다)";
            });
        });
    }
}
// 인스턴스 생성 및 초기화
const player = new BadApplePlayer();
player.init();
//# sourceMappingURL=main.js.map