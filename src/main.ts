class BadApplePlayer {
  private video!: HTMLVideoElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private output!: HTMLPreElement;
  private isPlaying = false;
  private animationId?: number;
  private canvasWidth = 120;
  private canvasHeight = 80;
  private asciiChars: string = " .-:=+*#%@";
  private charWidthToHeight = 0.55;
  private targetAspectRatio = 4 / 3;
  private screenPadding = 0.9;

  constructor() {
    this.calculateCanvasSize();
    this.setupElements();
    this.setupEventListeners();
    this.setupResizeListener();
  }

  private calculateCanvasSize(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 4:3 비율을 위한 캔버스 비율 계산
    const targetCanvasRatio = this.targetAspectRatio / this.charWidthToHeight;

    const maxCharsWidth = Math.floor(screenWidth / 6);
    const maxCharsHeight = Math.floor(screenHeight / 10);

    let canvasWidth, canvasHeight;

    if (maxCharsWidth / maxCharsHeight > targetCanvasRatio) {
      canvasHeight = Math.min(maxCharsHeight, 100);
      canvasWidth = Math.floor(canvasHeight * targetCanvasRatio);
    } else {
      canvasWidth = Math.min(maxCharsWidth, 140);
      canvasHeight = Math.floor(canvasWidth / targetCanvasRatio);
    }

    this.canvasWidth = Math.max(80, Math.min(canvasWidth, 140));
    this.canvasHeight = Math.max(36, Math.min(canvasHeight, 100));
  }

  private setupResizeListener(): void {
    let resizeTimeout: number;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        this.calculateCanvasSize();
        this.updateCanvasSize();
        this.updateFontSize();
      }, 100);
    });
  }

  private updateCanvasSize(): void {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  private updateFontSize(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const fontSizeByWidth =
      (screenWidth * this.screenPadding) /
      (this.canvasWidth * this.charWidthToHeight);
    const fontSizeByHeight =
      (screenHeight * this.screenPadding) / this.canvasHeight;
    const fontSize = Math.max(4, Math.min(fontSizeByWidth, fontSizeByHeight));
    const lineHeight = fontSize;

    this.output.style.fontSize = `${fontSize}px`;
    this.output.style.lineHeight = `${lineHeight}px`;
    this.output.style.width = "100vw";
    this.output.style.height = "100vh";
    this.output.style.display = "flex";
    this.output.style.alignItems = "center";
    this.output.style.justifyContent = "center";
  }

  private setupElements(): void {
    this.video = document.createElement("video");
    this.video.src = "res/video.mp4";
    this.video.style.display = "none";
    this.video.crossOrigin = "anonymous";
    this.video.muted = false;
    this.video.volume = 0.8;
    document.body.appendChild(this.video);

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.display = "none";
    this.ctx = this.canvas.getContext("2d")!;
    document.body.appendChild(this.canvas);

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

    this.updateFontSize();
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
      }
    });
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
      this.video.play().catch(() => {
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
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = undefined;
      }
    }
  }

  private startRendering(): void {
    const render = () => {
      if (!this.isPlaying || this.video.paused) return;
      this.renderFrame();
      this.animationId = requestAnimationFrame(render);
    };
    this.animationId = requestAnimationFrame(render);
  }

  private renderFrame(): void {
    this.ctx.drawImage(this.video, 0, 0, this.canvasWidth, this.canvasHeight);
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
    const pixels = imageData.data;
    let asciiArt = "";

    for (let y = 0; y < this.canvasHeight; y++) {
      for (let x = 0; x < this.canvasWidth; x++) {
        const pixelIndex = (y * this.canvasWidth + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const gray = (r + g + b) / 3;
        const charIndex = Math.floor(
          (gray / 255) * (this.asciiChars.length - 1)
        );
        asciiArt += this.asciiChars[charIndex];
      }
      asciiArt += "\n";
    }
    this.output.textContent = asciiArt;
  }

  public init(): void {
    this.output.textContent =
      "배드애플 ASCII 아트 플레이어 🎵\n\n로딩 중...\n\n클릭하거나 스페이스바를 눌러 재생/일시정지\n(오디오 포함)";
    window.addEventListener("load", () => {
      this.video.addEventListener("canplay", () => {
        this.output.textContent =
          "배드애플 ASCII 아트 플레이어 🎵\n\n준비 완료!\n\n클릭하거나 스페이스바를 눌러 재생 시작\n(오디오와 함께 재생됩니다)";
      });
    });
  }
}

const player = new BadApplePlayer();
player.init();
