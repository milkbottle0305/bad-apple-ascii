declare class BadApplePlayer {
    private video;
    private canvas;
    private ctx;
    private output;
    private isPlaying;
    private frameRate;
    private frameInterval;
    private asciiChars;
    constructor();
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