declare module '@/vendor/CadEngine/EngineContext.js' {
  interface ViewManager {
    ZoomToFit(): void;
  }

  interface LoadManager {
    addEventListener(event: string, callback: (e: any) => void): void;
    removeEventListener(event: string, callback: (e: any) => void): void;
    LoadModel(options: { url: string; type: string }): void;
  }

  export class EngineContext {
    constructor();
    static init(): Promise<void>;
    static ViewManager: ViewManager;
    static LoadManager: LoadManager;
    loadP2d(data: any): Promise<void>;
  }
} 