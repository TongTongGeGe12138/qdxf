// 确保CadEngine已经加载
if (typeof CadEngine === 'undefined') {
  console.error('CadEngine is not loaded');
}

// 创建全局EngineContext对象
window.EngineContext = {
  init: async function() {
    try {
      await CadEngine.init();
      this.ViewManager = CadEngine.ViewManager;
      this.LoadManager = CadEngine.LoadManager;
      return true;
    } catch (error) {
      console.error('Failed to initialize CadEngine:', error);
      throw error;
    }
  },
  ViewManager: null,
  LoadManager: null
}; 