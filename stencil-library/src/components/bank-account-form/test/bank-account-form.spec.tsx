import { newSpecPage } from '@stencil/core/testing';
import { BankAccountForm } from '../bank-account-form';

describe('justifi-bank-account-form', () => {
  it('renders with justifi-payment-method-form as a child element', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm],
      html: `<justifi-bank-account-form></justifi-bank-account-form>`,
    });
    expect(page.root).toEqualHtml(`
      <justifi-bank-account-form>
        <justifi-payment-method-form iframe-origin="https://js.justifi.ai/bank-account"></justifi-payment-method-form>
      </justifi-bank-account-form>
    `);
  });

  it('passes iframe-origin down to justifi-payment-method-form', async () => {
    const page = await newSpecPage({
      components: [BankAccountForm],
      html: `
      <justifi-bank-account-form iframe-origin="https://www.test.com"></justifi-bank-account-form>
      `,
    });
    expect(page.root).toEqualHtml(`
      <justifi-bank-account-form iframe-origin="https://www.test.com">
        <justifi-payment-method-form iframe-origin="https://www.test.com"></justifi-payment-method-form>
      </justifi-bank-account-form>
    `);
  });

  it('has a tokenize method witch calls tokenize on justifi-payment-method-form', async () => {
    const bankAccountForm = new BankAccountForm();
    expect(bankAccountForm.tokenize).toBeDefined();

    // mock childRef
    (bankAccountForm as any).childRef = { tokenize: () => { } };
    const childRefTokenizeSpy = jest.spyOn((bankAccountForm as any).childRef, 'tokenize');

    bankAccountForm.tokenize();
    expect(childRefTokenizeSpy).toHaveBeenCalled();
  });
});
