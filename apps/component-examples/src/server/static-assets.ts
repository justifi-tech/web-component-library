import express from 'express';

export interface StaticAssetsConfig {
  webComponentsPath: string;
  cssPath: string;
}

export class StaticAssetsService {
  private config: StaticAssetsConfig;

  constructor(config: StaticAssetsConfig) {
    this.config = config;
  }

  setupStaticAssets(app: express.Application): void {
    // Serve web components scripts
    app.use('/scripts', express.static(this.config.webComponentsPath));

    // Serve CSS styles
    app.use('/styles', express.static(this.config.cssPath));
  }

  getWebComponentsPath(): string {
    return this.config.webComponentsPath;
  }

  getCssPath(): string {
    return this.config.cssPath;
  }
}
