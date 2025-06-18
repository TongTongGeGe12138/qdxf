declare class CadEngine {
  constructor(container: HTMLElement);
  ViewManager: {
    ZoomToFit(): void;
    Resize(): void;
  };
  LoadManager: {
    LoadModel(options: { url: string; type: string }): void;
    addEventListener(event: string, callback: (e: any) => void): void;
    removeEventListener(event: string, callback: (e: any) => void): void;
  };
  SelectionManager: any;
  ModelManager: any;
  SceneManager: any;
  DrawManager: any;
}

declare class CadContext {
  Container: HTMLElement;
  ViewManager: {
    ZoomToFit(): void;
  };
  LoadManager: {
    LoadModel(params: { url: string; type: string }): void;
    addEventListener(event: string, callback: (e: any) => void): void;
    removeEventListener(event: string, callback: (e: any) => void): void;
  };
  AttachContainer(container: HTMLElement): void;
  init(): void;
}

declare const EngineContext: CadContext;
declare const CadEngine: typeof CadEngine;

export { CadEngine, EngineContext }; 