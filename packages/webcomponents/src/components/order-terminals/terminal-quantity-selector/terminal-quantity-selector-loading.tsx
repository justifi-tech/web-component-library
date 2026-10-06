import { h } from '@stencil/core';
import { Skeleton } from '../../../ui-components';

export const TerminalSelectorLoading = () => {
  return (
    <div class="terminal-selector-skeleton mt-4 rounded shadow-sm">
      <div class="d-flex align-items-center gap-3">
        <Skeleton width="125px" height="125px" styles={{ borderRadius: '8px' }} />

        <div class="flex-grow-1">
          <div class="d-flex row flex-row">
            <div class="col-6 flex-column">
              <Skeleton />
              <Skeleton width="60%" />
            </div>

            <div class="d-flex justify-content-end align-items-center gap-2 col-6">
              <Skeleton width="32px" height="32px" styles={{ borderRadius: '50%' }} />
              <Skeleton width="80px" height="32px" />
              <Skeleton width="32px" height="32px" styles={{ borderRadius: '50%' }} />
            </div>
          </div>
          <div class="mt-4">
            <div class="d-flex flex-column gap-2">
              <Skeleton />
              <Skeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
