import { h } from '@stencil/core';

import { newSpecPage } from '@stencil/core/testing';
import { SelectInput } from '../select-input';

describe('select-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SelectInput],
      template: () => (
        <select-input
          options={[
            {
              label: 'Option 1',
              value: 'option1',
            },
            {
              label: 'Option 2',
              value: 'option2',
            },
          ]}
        ></select-input>
      ),
    });
    expect(page.root).toEqualHtml(`
      <select-input>
        <mock:shadow-root>
          <label></label>
          <select>
            <option value="option1">
              Option 1
            </option>
            <option value="option2">
              Option 2
            </option>
          </select>
        </mock:shadow-root>
      </select-input>
    `);
  });
});
