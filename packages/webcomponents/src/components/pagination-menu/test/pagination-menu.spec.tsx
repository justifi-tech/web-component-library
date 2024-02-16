import { newSpecPage } from "@stencil/core/testing";
import { PaginationMenu } from "../pagination-menu";
import { ExtendedPagingDefaults, ExtendedPagingInfo } from "../../../api";

const mockExtendedPagingInfo: ExtendedPagingInfo = {
  has_previous: false,
  has_next: true,
  start_cursor: '',
  end_cursor: '',

  handleClickNext: jest.fn((after_cursor: string) => {
    // Implementation for the mock; could just be empty for basic tests
    console.log(`Mock handleClickNext called with after_cursor: ${after_cursor}`);
  }),

  handleClickPrevious: jest.fn((before_cursor: string) => {
    console.log(`Mock handleClickPrevious called with before_cursor: ${before_cursor}`);
  }),
  amount: 0
};


describe('pagination-menu', () => {
  it('initializes with default property values', async () => {
    const page = await newSpecPage({
      components: [PaginationMenu],
      html: `<pagination-menu></pagination-menu>`,
    });
    expect(page.rootInstance.paging).toEqual(ExtendedPagingDefaults);
    expect(page.rootInstance.params).toEqual({});
  });

  it('sets appropriate aria-labels for accessibility', async () => {
    const page = await newSpecPage({
      components: [PaginationMenu],
      html: `<pagination-menu></pagination-menu>`,
    });
    expect(page.root.shadowRoot.querySelector('nav').getAttribute('aria-label')).toBe('Table pagination');
  });

  it('reflects passed properties', async () => {
    const mockPagingInfo = mockExtendedPagingInfo;
    const page = await newSpecPage({
      components: [PaginationMenu],
      html: `<pagination-menu></pagination-menu>`,
    });
    page.root.paging = mockPagingInfo;
    await page.waitForChanges();
    expect(page.rootInstance.paging).toBe(mockPagingInfo);
  });

  it('disables/enables buttons based on paging info', async () => {
    const page = await newSpecPage({
      components: [PaginationMenu],
      html: `<pagination-menu></pagination-menu>`,
    });

    page.root.paging = {
      has_previous: false,
      has_next: true,
      start_cursor: '',
      end_cursor: '',
      handleClickNext: jest.fn(),
      handleClickPrevious: jest.fn(),
      amount: 0
    };

    await page.waitForChanges();

    const previousButton = page.root.shadowRoot.querySelector('.page-item:first-child');
    const nextButton = page.root.shadowRoot.querySelector('.page-item:last-child');

    // Convert classList to a string for the assertion
    const previousButtonClasses = previousButton.className;
    const nextButtonClasses = nextButton.className;

    expect(previousButtonClasses).toContain('disabled');
    expect(nextButtonClasses).not.toContain('disabled');
  });

  it('emits events on button clicks', async () => {
    const mockPagingInfo = {
      has_previous: true,
      has_next: true,
      handleClickPrevious: jest.fn(),
      handleClickNext: jest.fn(),
    };
    const page = await newSpecPage({
      components: [PaginationMenu],
      html: `<pagination-menu></pagination-menu>`,
    });

    page.root.paging = mockPagingInfo;
    await page.waitForChanges();

    const previousButton = page.root.shadowRoot.querySelector('.page-item:first-child .page-link') as HTMLButtonElement;
    const nextButton = page.root.shadowRoot.querySelector('.page-item:last-child .page-link') as HTMLButtonElement;

    previousButton.click();
    expect(mockPagingInfo.handleClickPrevious).toHaveBeenCalled();

    nextButton.click();
    expect(mockPagingInfo.handleClickNext).toHaveBeenCalled();
  });
});
