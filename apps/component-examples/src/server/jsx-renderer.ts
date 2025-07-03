import { renderToString } from '../utils/simple-jsx';

export interface TemplateData {
  title: string;
  webComponentToken: string;
  [key: string]: any;
}

export class JSXRendererService {
  renderTemplate(template: any, data: TemplateData): string {
    try {
      const renderedElement = template(data);
      return renderToString(renderedElement);
    } catch (error) {
      console.error('Error rendering JSX template:', error);
      throw new Error(
        `Failed to render template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  renderHtmlTemplate(
    template: (data: TemplateData) => string,
    data: TemplateData
  ): string {
    try {
      return template(data);
    } catch (error) {
      console.error('Error rendering HTML template:', error);
      throw new Error(
        `Failed to render HTML template: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
