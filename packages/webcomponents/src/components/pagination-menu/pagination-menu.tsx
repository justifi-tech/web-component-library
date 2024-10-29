import { Component, h, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';
import { StyledHost } from '../../ui-components';

export interface PaginationProps {
  paging: ExtendedPagingInfo;
  params?: {};
}

@Component({
  tag: 'pagination-menu'
})

export class PaginationMenu {
  @Prop() paging: PaginationProps['paging'] = ExtendedPagingDefaults;
  @Prop() params: PaginationProps['params'] = {};

  render() {
    return (
      <StyledHost exportparts="pagination-buttons-container">
        <nav
          aria-label="Table pagination"
          class="d-flex justify-content-end gap-3"
          part="pagination-bar"
        >
          <button
            class="page-link"
            onClick={(e) => {
              e.preventDefault();
              this.paging.handleClickPrevious(this.paging.start_cursor);
            }}
            part={`button-link ${this.paging.has_next ? '' : ' button-disabled'}`}
          >
            <span class="me-1" part="page-arrow">&laquo;</span>
            <span part="page-button-text">Previous</span>
          </button>
          <button
            class="page-link"
            onClick={(e) => {
              e.preventDefault();
              this.paging.handleClickNext(this.paging.end_cursor);
            }}
            part={`button-link ${this.paging.has_next ? '' : ' button-disabled'}`}
          >
            <span part="page-button-text">Next</span>
            <span class="ms-1" part="page-arrow">&raquo;</span>
          </button>
        </nav>
      </StyledHost >
    );
  }
}
