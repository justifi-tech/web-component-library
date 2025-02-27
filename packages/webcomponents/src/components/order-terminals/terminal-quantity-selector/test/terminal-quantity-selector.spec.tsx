import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TerminalQuantitySelector } from '../terminal-quantity-selector';
import { TerminalModelName } from '../../../../api';

describe('justifi-terminal-quantity-selector', () => {
  it('should render with all props provided', async () => {
    const page = await newSpecPage({
      components: [TerminalQuantitySelector],
      template: () => (
        <terminal-quantity-selector
          modelName={TerminalModelName.v400}
          imageUrl="https://device-image.com"
          helpUrl="https://learnmore.com"
          description="super duper terminal"
        />
      )
    });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('should emit an event when the quantity is changed and update state', async () => {
    const onSelectedQuantityChange = jest.fn();

    const page = await newSpecPage({
      components: [TerminalQuantitySelector],
      template: () => (
        <terminal-quantity-selector
          modelName={TerminalModelName.v400}
          imageUrl="https://device-image.com"
          helpUrl="https://learnmore.com"
          description="super duper terminal"
        />
      )
    });

    await page.waitForChanges();

    page.root.addEventListener('selectedQuantityChange', onSelectedQuantityChange);

    const addButton = page.root.querySelector('.plus');
    (addButton as HTMLElement).click();

    await page.waitForChanges();

    expect(onSelectedQuantityChange).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        modelName: 'v400',
        quantity: 1
      }
    }));

    expect(page.rootInstance.selectedQuantity).toBe(1);
  });

  it('should not decrease quantity when the quantity is 0', async () => {
    const page = await newSpecPage({
      components: [TerminalQuantitySelector],
      template: () => (
        <terminal-quantity-selector
          modelName={TerminalModelName.v400}
          imageUrl="https://device-image.com"
          helpUrl="https://learnmore.com"
          description="super duper terminal"
        />
      )
    });

    await page.waitForChanges();

    page.rootInstance.removeUnit();

    await page.waitForChanges();

    expect(page.rootInstance.selectedQuantity).toBe(0);
  });

  it('should not add unitity when limit is 0', async () => {
    const page = await newSpecPage({
      components: [TerminalQuantitySelector],
      template: () => (
        <terminal-quantity-selector
          modelName={TerminalModelName.v400}
          imageUrl="https://device-image.com"
          helpUrl="https://learnmore.com"
          description="super duper terminal"
          limit={0}
        />
      )
    });

    await page.waitForChanges();

    const plusButton = (page.root.querySelector('.plus') as HTMLElement);
    plusButton.click();

    await page.waitForChanges();

    expect(page.rootInstance.selectedQuantity).toBe(0);
  });
});
