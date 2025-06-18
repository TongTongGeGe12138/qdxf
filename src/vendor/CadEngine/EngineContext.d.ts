export class EngineContext {
  constructor();
  static init(): Promise<void>;
  loadP2d(data: any): Promise<void>;
} 