import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { PaymentMethodForm } from '../payment-method-form';
import { PaymentMethodTypes } from '../../../api';
import { FrameCommunicationService } from '../../../utils/frame-comunication-service';
import { MessageEventType } from '../message-event-types';
import packageJson from '../../../../package.json';
import { config } from '../../../../config';

describe('justifi-payment-method-form', () => {
  it('renders an iframe', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodForm],
      template: () => (
        <justifi-payment-method-form
          paymentMethodFormType={PaymentMethodTypes.card}
          iframeOrigin={config.iframeOrigin}
        ></justifi-payment-method-form>
      ),
    });
    expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe id='justifi-payment-method-form-card' src='${config.iframeOrigin}/card'></iframe>
    </justifi-payment-method-form>
  `);
  });

  describe('Test Props', () => {
    it('renders a card iframe when paymentMethodFormType is card', async () => {
      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => (
          <justifi-payment-method-form
            paymentMethodFormType={PaymentMethodTypes.card}
            iframeOrigin={config.iframeOrigin}
          ></justifi-payment-method-form>
        ),
      });
      expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe id='justifi-payment-method-form-card' src='${config.iframeOrigin}/card'></iframe>
    </justifi-payment-method-form>
  `);
    });

    it('renders a bank iframe when paymentMethodFormType is bank', async () => {
      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => (
          <justifi-payment-method-form
            paymentMethodFormType={PaymentMethodTypes.bankAccount}
            iframeOrigin={config.iframeOrigin}
          ></justifi-payment-method-form>
        ),
      });
      expect(page.root).toEqualHtml(`
    <justifi-payment-method-form>
      <iframe id='justifi-payment-method-form-bankAccount' src='${config.iframeOrigin}/bankAccount'></iframe>
    </justifi-payment-method-form>
  `);
    });

    it('renders a card iframe with validationMode when paymentMethodFormType is card and paymentMethodFormValidationMode is set', async () => {
      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => (
          <justifi-payment-method-form
            paymentMethodFormType={PaymentMethodTypes.bankAccount}
            paymentMethodFormValidationMode='onChange'
            iframeOrigin={config.iframeOrigin}
          ></justifi-payment-method-form>
        ),
      });

      expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-bankAccount' src='${config.iframeOrigin}/bankAccount?validationMode=onChange'></iframe>
      </justifi-payment-method-form>
    `);
    });

    it('renders a card iframe with validationMode when paymentMethodFormType is card and paymentMethodFormValidationMode is set', async () => {
      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => (
          <justifi-payment-method-form
            paymentMethodFormType={PaymentMethodTypes.bankAccount}
            paymentMethodFormValidationMode='onBlur'
            iframeOrigin={config.iframeOrigin}
          ></justifi-payment-method-form>
        ),
      });

      expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-bankAccount' src='${config.iframeOrigin}/bankAccount?validationMode=onBlur'></iframe>
      </justifi-payment-method-form>
    `);
    });

    it('renders a card iframe with singleLine when paymentMethodFormType is card and singleLine is set', async () => {
      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => (
          <justifi-payment-method-form
            paymentMethodFormType={PaymentMethodTypes.card}
            singleLine={true}
            iframeOrigin={config.iframeOrigin}
          ></justifi-payment-method-form>
        ),
      });

      expect(page.root).toEqualHtml(`
      <justifi-payment-method-form>
        <iframe id='justifi-payment-method-form-card' src='${config.iframeOrigin}/card?singleLine=true'></iframe>
      </justifi-payment-method-form>
    `);
    });
  })

  // Frame comunication service
  describe('Frame Communication Service', () => {
    it('removes message listener on disconnected callback', async () => {
      const removeSpy = jest.spyOn(FrameCommunicationService.prototype, 'removeMessageListener');

      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => <justifi-payment-method-form iframeOrigin={config.iframeOrigin}></justifi-payment-method-form>,
      });

      // Manually set up the frameService to ensure it's available for the disconnectedCallback
      page.rootInstance.frameService = new FrameCommunicationService(page.rootInstance.iframeElement, config.iframeOrigin);
      page.rootInstance.frameService.addMessageListener(jest.fn()); // Add a dummy listener

      // Manually call disconnectedCallback to simulate the component being removed
      await page.rootInstance.disconnectedCallback();

      // Check if removeMessageListener was called upon disconnection
      expect(removeSpy).toHaveBeenCalled();

      // Cleanup the spy
      removeSpy.mockRestore();
    });
  });

  // Event emission tests
  describe('Event Emissions', () => {
    it('emits paymentMethodFormReady when iframe sends ready event', async () => {
      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => (
          <justifi-payment-method-form
            paymentMethodFormType={PaymentMethodTypes.card}
            iframeOrigin={config.iframeOrigin}
          ></justifi-payment-method-form>
        ),
      });

      page.rootInstance.sendStyleOverrides = jest.fn();

      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.win.addEventListener('paymentMethodFormReady', eventSpy);

      // Ensure paymentMethodFormType is set and is a valid key in MessageEventType
      const formType = page.rootInstance.paymentMethodFormType;
      const eventType = MessageEventType[formType] ? MessageEventType[formType].ready : null;

      if (!eventType) {
        throw new Error(`Invalid paymentMethodFormType: ${formType}`);
      }

      const simulatedEventData = { eventType, data: {} };

      page.rootInstance.dispatchMessageEvent({ data: simulatedEventData } as MessageEvent);
      await page.waitForChanges();

      expect(eventSpy).toHaveBeenCalled();
    });
  });

  describe('Methods', () => {
    it('calls postMessageWithResponseListener with correct parameters on tokenize', async () => {
      // Mock the iframe and its contentWindow.postMessage
      const mockPostMessage = jest.fn();
      global.window = Object.create(window);
      const url = "https://example.com";
      Object.defineProperty(window, 'location', {
        value: {
          href: url,
        }
      });
      const mockedIframe = {
        contentWindow: {
          postMessage: mockPostMessage,
        }
      };

      const page = await newSpecPage({
        components: [PaymentMethodForm],
        template: () => <justifi-payment-method-form iframeOrigin={url} paymentMethodFormType={PaymentMethodTypes.card}></justifi-payment-method-form>,
      });

      // Assign the mocked iframe to the component instance
      page.rootInstance.iframeElement = mockedIframe;

      // Replace the frameService with a mock that includes a mocked postMessageWithResponseListener
      page.rootInstance.frameService = {
        postMessage: jest.fn(),
        postMessageWithResponseListener: jest.fn().mockResolvedValue({
          // Mock the expected resolution value if your component expects any
        }),
        addMessageListener: jest.fn(),
        removeMessageListener: jest.fn(),
      };

      const clientId = 'test-client-id';
      const paymentMethodMetadata = { key: 'value' };
      const account = 'test-account';

      // Call the tokenize method
      await page.rootInstance.tokenize(clientId, paymentMethodMetadata, account);

      // Verify postMessageWithResponseListener was called with the expected parameters
      expect(page.rootInstance.frameService.postMessageWithResponseListener)
        .toHaveBeenCalledWith(MessageEventType.card.tokenize, expect.objectContaining({
          clientId,
          paymentMethodMetadata,
          account,
          componentVersion: packageJson.version,
        }));
    });
  });
});
