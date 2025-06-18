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
  static SetViewMode(mode: number): void;
  static SetViewDirection(direction: number): void;
  static SetViewScale(scale: number): void;
  static SetViewCenter(x: number, y: number, z: number): void;
  static SetViewTarget(x: number, y: number, z: number): void;
  static SetViewUp(x: number, y: number, z: number): void;
  static SetViewDistance(distance: number): void;
  static SetViewFov(fov: number): void;
  static SetViewAspect(aspect: number): void;
  static SetViewNear(near: number): void;
  static SetViewFar(far: number): void;
  static SetViewOrtho(ortho: boolean): void;
  static SetViewOrthoSize(size: number): void;
  static SetViewOrthoWidth(width: number): void;
  static SetViewOrthoHeight(height: number): void;
  static SetViewOrthoLeft(left: number): void;
  static SetViewOrthoRight(right: number): void;
  static SetViewOrthoBottom(bottom: number): void;
  static SetViewOrthoTop(top: number): void;
  static SetViewOrthoNear(near: number): void;
  static SetViewOrthoFar(far: number): void;
  static SetViewOrthoZoom(zoom: number): void;
  static SetViewOrthoPan(x: number, y: number): void;
  static SetViewOrthoRotate(angle: number): void;
  static SetViewOrthoScale(scale: number): void;
  static SetViewOrthoCenter(x: number, y: number): void;
  static SetViewOrthoSize(width: number, height: number): void;
  static SetViewOrthoAspect(aspect: number): void;
  static SetViewOrthoFov(fov: number): void;
  static SetViewOrthoNear(near: number): void;
  static SetViewOrthoFar(far: number): void;
  static SetViewOrthoOrtho(ortho: boolean): void;
  static SetViewOrthoOrthoSize(size: number): void;
  static SetViewOrthoOrthoWidth(width: number): void;
  static SetViewOrthoOrthoHeight(height: number): void;
  static SetViewOrthoOrthoLeft(left: number): void;
  static SetViewOrthoOrthoRight(right: number): void;
  static SetViewOrthoOrthoBottom(bottom: number): void;
  static SetViewOrthoOrthoTop(top: number): void;
  static SetViewOrthoOrthoNear(near: number): void;
  static SetViewOrthoOrthoFar(far: number): void;
  static SetViewOrthoOrthoZoom(zoom: number): void;
  static SetViewOrthoOrthoPan(x: number, y: number): void;
  static SetViewOrthoOrthoRotate(angle: number): void;
  static SetViewOrthoOrthoScale(scale: number): void;
  static SetViewOrthoOrthoCenter(x: number, y: number): void;
  static SetViewOrthoOrthoSize(width: number, height: number): void;
  static SetViewOrthoOrthoAspect(aspect: number): void;
  static SetViewOrthoOrthoFov(fov: number): void;
  static SetViewOrthoOrthoNear(near: number): void;
  static SetViewOrthoOrthoFar(far: number): void;
  static SetViewOrthoOrthoOrtho(ortho: boolean): void;
  static SetViewOrthoOrthoOrthoSize(size: number): void;
  static SetViewOrthoOrthoOrthoWidth(width: number): void;
  static SetViewOrthoOrthoOrthoHeight(height: number): void;
  static SetViewOrthoOrthoOrthoLeft(left: number): void;
  static SetViewOrthoOrthoOrthoRight(right: number): void;
  static SetViewOrthoOrthoOrthoBottom(bottom: number): void;
  static SetViewOrthoOrthoOrthoTop(top: number): void;
  static SetViewOrthoOrthoOrthoNear(near: number): void;
  static SetViewOrthoOrthoOrthoFar(far: number): void;
  static SetViewOrthoOrthoOrthoZoom(zoom: number): void;
  static SetViewOrthoOrthoOrthoPan(x: number, y: number): void;
  static SetViewOrthoOrthoOrthoRotate(angle: number): void;
  static SetViewOrthoOrthoOrthoScale(scale: number): void;
  static SetViewOrthoOrthoOrthoCenter(x: number, y: number): void;
  static SetViewOrthoOrthoOrthoSize(width: number, height: number): void;
  static SetViewOrthoOrthoOrthoAspect(aspect: number): void;
  static SetViewOrthoOrthoOrthoFov(fov: number): void;
  static SetViewOrthoOrthoOrthoNear(near: number): void;
  static SetViewOrthoOrthoOrthoFar(far: number): void;
}

declare const EngineContext: typeof CadContext;
declare const CadEngine: typeof CadEngine;

export { CadEngine, EngineContext }; 