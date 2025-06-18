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

export declare class CadContext {
  init(): Promise<void>;
  AttachContainer(container: HTMLElement): void;
  Container: HTMLElement;
  ViewManager: CadEngine['ViewManager'];
  LoadManager: CadEngine['LoadManager'];
  SelectionManager: CadEngine['SelectionManager'];
  ModelManager: CadEngine['ModelManager'];
  SceneManager: CadEngine['SceneManager'];
  DrawManager: CadEngine['DrawManager'];
}

declare const EngineContext: CadContext;
declare const CadEngine: typeof CadEngine;

export { CadEngine, EngineContext }; 