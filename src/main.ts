class BadApplePlayer {
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private output!: HTMLPreElement;
  private isPlaying: boolean = false;
  private frameRate: number = 10; // 1초에 10프레임
  private frameInterval: number;

  // ASCII 문자 (밝기 순서) - 배드애플에 최적화
  private asciiChars: string = " .-:=+*#%@";

  constructor() {
    this.setupElements();
    this.frameInterval = 1000 / this.frameRate;
    this.setupEventListeners();
  }

  private setupElements(): void {
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
    this.canvas.width = 120; // ASCII 아트 가로 크기 증가
    this.canvas.height = 80; // ASCII 아트 세로 크기 증가
    this.canvas.style.display = "none";
    this.ctx = this.canvas.getContext("2d")!;
    document.body.appendChild(this.canvas);

    // ASCII 출력용 pre 엘리먼트
    this.output = document.createElement("pre");
    this.output.style.fontFamily = "monospace";
    this.output.style.fontSize = "6px";
    this.output.style.lineHeight = "5px";
    this.output.style.color = "white";
    this.output.style.backgroundColor = "black";
    this.output.style.padding = "10px";
    this.output.style.margin = "0";
    this.output.style.whiteSpace = "pre";
    this.output.style.overflow = "hidden";
    document.body.appendChild(this.output);
  }

  private setupEventListeners(): void {
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

  private togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  private play(): void {
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

  private pause(): void {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.video.pause();
    }
  }

  private startRendering(): void {
    const render = () => {
      if (this.isPlaying && !this.video.paused) {
        this.renderFrame();
        setTimeout(render, this.frameInterval);
      }
    };
    render();
  }

  private renderFrame(): void {
    // 비디오 프레임을 캔버스에 그리기
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // 이미지 데이터 가져오기
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const pixels = imageData.data;

    let asciiArt = "";

    // 각 픽셀을 ASCII 문자로 변환
    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const pixelIndex = (y * this.canvas.width + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];

        // 그레이스케일로 변환
        const gray = (r + g + b) / 3;

        // 밝기를 ASCII 문자 인덱스로 변환
        const charIndex = Math.floor(
          (gray / 255) * (this.asciiChars.length - 1)
        );
        asciiArt += this.asciiChars[charIndex];
      }
      asciiArt += "\n";
    }

    // ASCII 아트 출력
    this.output.textContent = asciiArt;
  }

  // 초기화
  public init(): void {
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
