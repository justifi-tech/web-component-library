import express from 'express';
import path from 'path';
import { AuthService, AuthConfig } from './auth-service';
import { StaticAssetsService, StaticAssetsConfig } from './static-assets';
import { JSXRendererService, TemplateData } from './jsx-renderer';

export interface ServerConfig {
  port?: number;
  auth: AuthConfig;
  staticAssets: StaticAssetsConfig;
}

export interface RouteHandler {
  path: string;
  handler: (req: express.Request, res: express.Response) => Promise<void>;
}

export class ExpressServer {
  private app: express.Application;
  private config: ServerConfig;
  private authService: AuthService;
  private staticAssetsService: StaticAssetsService;
  private jsxRenderer: JSXRendererService;

  constructor(config: ServerConfig) {
    this.config = config;
    this.app = express();
    this.authService = new AuthService(config.auth);
    this.staticAssetsService = new StaticAssetsService(config.staticAssets);
    this.jsxRenderer = new JSXRendererService();

    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    // Parse JSON bodies
    this.app.use(express.json());

    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Setup static assets
    this.staticAssetsService.setupStaticAssets(this.app);
  }

  addRoute(route: RouteHandler): void {
    this.app.get(route.path, route.handler);
  }

  addRoutes(routes: RouteHandler[]): void {
    routes.forEach((route) => this.addRoute(route));
  }

  renderTemplate(template: any, data: TemplateData): string {
    return this.jsxRenderer.renderTemplate(template, data);
  }

  renderHtmlTemplate(
    template: (data: TemplateData) => string,
    data: TemplateData
  ): string {
    return this.jsxRenderer.renderHtmlTemplate(template, data);
  }

  getAuthService(): AuthService {
    return this.authService;
  }

  getStaticAssetsService(): StaticAssetsService {
    return this.staticAssetsService;
  }

  getJSXRenderer(): JSXRendererService {
    return this.jsxRenderer;
  }

  start(): void {
    const port = this.config.port || 3000;
    this.app.listen(port, () => {
      console.log(`Example server listening on port ${port}`);
    });
  }

  getApp(): express.Application {
    return this.app;
  }
}

// Helper function to create a server with default configuration
export function createExampleServer(
  config: Partial<ServerConfig> = {}
): ExpressServer {
  const defaultConfig: ServerConfig = {
    port: process.env['PORT'] ? parseInt(process.env['PORT']) : 3000,
    auth: {
      apiOrigin: process.env['API_ORIGIN'] || '',
      clientId: process.env['CLIENT_ID'] || '',
      clientSecret: process.env['CLIENT_SECRET'] || '',
      subAccountId: process.env['SUB_ACCOUNT_ID'] || '',
    },
    staticAssets: {
      webComponentsPath: path.join(
        __dirname,
        '../../node_modules/@justifi/webcomponents/dist/'
      ),
      cssPath: path.join(__dirname, '../../css/'),
    },
    ...config,
  };

  return new ExpressServer(defaultConfig);
}
