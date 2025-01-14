import { newSpecPage } from '@stencil/core/testing';
import { PostalForm } from '../postal-form';

const fields = {
  address_postal_code: '10000',
};

describe('justifi-postal-form', () => {
  it('fills the form', async () => {
    const page = await newSpecPage({
      components: [PostalForm],
      html: `<justifi-postal-form></justifi-postal-form>`,
    });

    const instance: any = page.rootInstance;


    await instance.fill(fields);
    const values = await instance.getValues();

    expect(values).toEqual(fields);
  });

  it('validates the form', async () => {
    const page = await newSpecPage({
      components: [PostalForm],
      html: `<justifi-postal-form></justifi-postal-form>`,
    });

    const instance: any = page.rootInstance;

    await instance.fill(fields);
    const { isValid } = await instance.validate();

    expect(isValid).toBe(true); // Assuming provided fields pass the validation
  });

  it('gets values of the form', async () => {
    const page = await newSpecPage({
      components: [PostalForm],
      html: `<justifi-postal-form></justifi-postal-form>`,
    });

    const instance: any = page.rootInstance;

    await instance.fill(fields);
    const values = await instance.getValues();

    expect(values).toEqual(fields);
  });
});
