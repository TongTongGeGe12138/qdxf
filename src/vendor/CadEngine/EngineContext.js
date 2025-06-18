/* eslint-disable prettier/prettier */
/**
 * @type {typeof import('@types/CadEngine.d.ts')}
 */
const { CadEngine } = window;
class CadContext {
  get view() {
    return this.Engine.ViewManager;
  }

  get load() {
    return this.Engine.LoadManager;
  }

  get selection() {
    return this.Engine.SelectionManager;
  }

  get model() {
    return this.Engine.ModelManager;
  }

  get scene() {
    return this.Engine.SceneManager;
  }

  get DrawManager() {
    return this.Engine.DrawManager;
  }

  get ViewManager() {
    return this.Engine.ViewManager;
  }

  get LoadManager() {
    return this.Engine.LoadManager;
  }

  get SelectionManager() {
    return this.Engine.SelectionManager;
  }

  get ModelManager() {
    return this.Engine.ModelManager;
  }

  get SceneManager() {
    return this.Engine.SceneManager;
  }

  init() {
    this.Container = document.createElement('div');
    this.Container.classList.add('ibp-2d-root');
    document.body.appendChild(this.Container);
    /**
     * @type{import('@types/CadEngine.d.ts').CadEngine}
     */
    this.Engine = new CadEngine.CadEngine(this.Container);
    this.Container.style.width = '100%';
    this.Container.style.height = '100%';
    this.Container.style.display = 'none';
  }

  AttachContainer(container) {
    if (this.Engine) {
      this.Container.style.width = '100%!important';
      this.Container.style.height = '100%!important';
      this.Container.style.display = 'block';
      container.appendChild(this.Container);
      this.view.Resize();
      this.view.ZoomToFit();
    } else {
      throw new ReferenceError('使用之前先调用init()进行初始化');
    }
  }
}
const EngineContext = new CadContext();
export { CadEngine, EngineContext };
