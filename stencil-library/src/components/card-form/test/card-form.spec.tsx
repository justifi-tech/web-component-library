import { newSpecPage } from '@stencil/core/testing';
import { CardForm } from '../card-form';

describe('justifi-card-form', () => {
  it('renders with justifi-payment-method-form as a child element', async () => {
    const page = await newSpecPage({
      components: [CardForm],
      html: `<justifi-card-form></justifi-card-form>`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-card-form>
        <justifi-payment-method-form payment-method-form-type="card" payment-method-form-validation-strategy="onSubmit"></justifi-payment-method-form>
      </justifi-card-form>
    `);
  });

  // it('passes iframe-origin down to justifi-payment-method-form', async () => {
  //   const page = await newSpecPage({
  //     components: [CardForm],
  //     html: `
  //     <justifi-card-form iframe-origin="https://www.test.com"></justifi-card-form>
  //     `,
  //   });
  //   expect(page.root).toEqualHtml(`
  //     <justifi-card-form iframe-origin="https://www.test.com">
  //       <justifi-payment-method-form iframe-origin="https://www.test.com"></justifi-payment-method-form>
  //     </justifi-card-form>
  //   `);
  // });

  it('has a tokenize method which calls tokenize on justifi-payment-method-form', async () => {
    const cardForm = new CardForm();
    expect(cardForm.tokenize).toBeDefined();

    // mock childRef
    (cardForm as any).childRef = { tokenize: () => {} };
    const childRefTokenizeSpy = jest.spyOn((cardForm as any).childRef, 'tokenize');

    cardForm.tokenize('clientId', { paymentMethod: 'metadata' }, 'accountId');
    expect(childRefTokenizeSpy).toHaveBeenCalled();
  });
});
