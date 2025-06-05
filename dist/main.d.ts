declare class BadApplePlayer {
    private video;
    private canvas;
    private ctx;
    private output;
    private isPlaying;
    private animationId?;
    private canvasWidth;
    private canvasHeight;
    private asciiChars;
    private charWidthToHeight;
    private targetAspectRatio;
    private screenPadding;
    constructor();
    private calculateCanvasSize;
    private setupResizeListener;
    private updateCanvasSize;
    private updateFontSize;
    private setupElements;
    private setupEventListeners;
    private togglePlay;
    private play;
    private pause;
    private startRendering;
    private renderFrame;
    init(): void;
}
declare const player: BadApplePlayer;
//# sourceMappingURL=main.d.ts.map