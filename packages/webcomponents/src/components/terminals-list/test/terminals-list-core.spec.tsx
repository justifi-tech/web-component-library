jest.mock('../../../ui-components/styled-host/styled-host.css', () => '');

import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { TerminalsListCore } from '../terminals-list-core';
import { PaginationMenu } from '../../pagination-menu/pagination-menu';
import mockSuccessResponse from '../../../../../../mockData/mockTerminalsListSuccess.json';
import { IApiResponseCollection, ITerminal } from '../../../api';
import { makeGetTerminals } from '../get-terminals';

const mockTerminalsResponse = mockSuccessResponse as IApiResponseCollection<ITerminal[]>;
const components = [TerminalsListCore, PaginationMenu];

describe('terminals-list-core', () => {
  it('renders properly with fetched data', async () => {
    const mockTerminalsService = {
      fetchTerminals: jest.fn().mockResolvedValue(mockTerminalsResponse),
    };

    const getTerminals = makeGetTerminals({
      id: '123',
      authToken: '123',
      service: mockTerminalsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.terminals[0]).toEqual(expect.objectContaining({ account_id: mockTerminalsResponse.data[0].account_id }));
    const rows = page.root.querySelectorAll('[data-test-id="table-row"]');
    expect(rows.length).toBe(mockTerminalsResponse.data.length);
    expect(mockTerminalsService.fetchTerminals).toHaveBeenCalled();
    expect(page.root).toMatchSnapshot();
  });

  it('displays an error state on failed data fetch', async () => {
    const mockService = {
      fetchTerminals: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getTerminals = makeGetTerminals({
      id: 'some-id',
      authToken: 'some-auth-token',
      service: mockService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} />,
    });

    await page.waitForChanges();

    expect(page.rootInstance.errorMessage).toBe('Fetch error');
    expect(page.root).toMatchSnapshot();
  });

  it('emits terminal-row-clicked event on row click', async () => {
    const mockTerminalsService = {
      fetchTerminals: jest.fn().mockResolvedValue(mockTerminalsResponse),
    };

    const getTerminals = makeGetTerminals({
      id: '123',
      authToken: '123',
      service: mockTerminalsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} />,
    });

    await page.waitForChanges();

    const firstRow = page.root.querySelector('[data-test-id="table-row"]') as HTMLElement;
    expect(firstRow).not.toBeNull();

    const spyEvent = jest.fn();
    page.win.addEventListener('terminal-row-clicked', spyEvent);

    firstRow.click();
    expect(spyEvent).toHaveBeenCalled();
  });

  it('updates params and refetches data on pagination interaction', async () => {
    const mockTerminalsService = {
      fetchTerminals: jest.fn().mockResolvedValue(mockTerminalsResponse),
    };

    const getTerminals = makeGetTerminals({
      id: '123',
      authToken: '123',
      service: mockTerminalsService,
      apiOrigin: 'http://localhost:3000'
    });

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} />,
    });

    await page.waitForChanges();

    // Assuming handleClickNext is accessible and modifies `params` which triggers a re-fetch
    page.rootInstance.handleClickNext('nextCursor');
    await page.waitForChanges();

    // The mock function should be called 2 times: once for the initial load and later after the pagination interaction
    expect(mockTerminalsService.fetchTerminals).toHaveBeenCalledTimes(2);
    const updatedParams = page.rootInstance.params;
    expect(updatedParams.after_cursor).toBe('nextCursor');
  });

  it('emits error event on fetch error', async () => {
    const mockService = {
      fetchTerminals: jest.fn().mockRejectedValue(new Error('Fetch error'))
    };

    const getTerminals = makeGetTerminals({
      id: 'some-id',
      authToken: 'some-auth',
      service: mockService,
      apiOrigin: 'http://localhost:3000'
    });

    const errorEvent = jest.fn();

    const page = await newSpecPage({
      components: components,
      template: () => <terminals-list-core getTerminals={getTerminals} onError-event={errorEvent} />,
    });

    await page.waitForChanges();

    expect(errorEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          errorCode: 'fetch-error',
          message: 'Fetch error',
          severity: 'error',
        }
      })
    );
  });
});
