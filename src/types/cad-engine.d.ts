declare module '@/vendor/CadEngine/EngineContext.js' {
  class CadContext {
    static Container: HTMLElement;
    static ViewManager: {
      ZoomToFit(): void;
    };
    static LoadManager: {
      LoadModel(params: { url: string; type: string }): void;
      addEventListener(event: string, callback: (e: any) => void): void;
      removeEventListener(event: string, callback: (e: any) => void): void;
    };
    static AttachContainer(container: HTMLElement): void;
    static init(): void;
    static LoadModel(url: string): void;
    static Dispose(): void;
    static Initialize(): void;
  }
  
  export const EngineContext: typeof CadContext;
} 