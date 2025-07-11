import { renderToString } from '../utils/simple-jsx';
import { createExampleServer } from '../server/express-server';
import { BaseTemplate } from '../templates/base-template';
import {
  BusinessDetailsComponent,
  BusinessDetailsData,
} from '../components/BusinessDetailsComponent';

require('dotenv').config({ path: '../../.env' });

function createBusinessDetailsScript() {
  return `
    const justifiBusinessDetails = document.querySelector('justifi-business-details');
    justifiBusinessDetails.addEventListener('error-event', (event) => {
      console.log(event);
    });
  `;
}

async function handleBusinessDetailsExample(req: any, res: any): Promise<void> {
  try {
    const server = req.app.locals['server'];
    const authService = server.getAuthService();
    const businessId = process.env['BUSINESS_ID'];
    if (!businessId) throw new Error('BUSINESS_ID env var is required');
    const token = await authService.getAuthToken();
    const webComponentToken = await authService.getWebComponentToken(token, [
      `read:business:${businessId}`,
    ]);
    const componentData: BusinessDetailsData = {
      webComponentToken,
      businessId,
    };
    const bodyContent = renderToString(BusinessDetailsComponent(componentData));
    const script = createBusinessDetailsScript();
    const html = BaseTemplate({
      title: 'JustiFi Business Details Component',
      webComponentToken,
      bodyContent,
      scripts: [script],
    });
    res.send(html);
  } catch (error) {
    console.error('Error in business details example:', error);
    res.status(500).send('Internal Server Error');
  }
}

const server = createExampleServer();
server.getApp().locals['server'] = server;
server.addRoute({
  path: '/',
  handler: handleBusinessDetailsExample,
});
server.start();
