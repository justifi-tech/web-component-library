import { Component, h, Host, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';
import {
  paginationButton,
  paginationButtonDisabled,
  paginationButtonIconNext,
  paginationButtonIconPrevious,
  paginationButtonText
} from '../../styles/parts';

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
      <Host>
        <nav aria-label="Table pagination" class="d-flex justify-content-end gap-3">
          <ul class="pagination m-0">
            <li class={`page-item ${this.paging.has_previous ? '' : ' disabled'}`}>
              <button
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickPrevious(this.paging.start_cursor);
                }}
                part={this.paging.has_previous ? paginationButton : paginationButtonDisabled}
              >
                <span class="me-1" part={paginationButtonIconPrevious}>&laquo;</span>
                <span part={paginationButtonText}>Previous</span>
              </button>
            </li>
            <li class={`page-item ${this.paging.has_next ? '' : ' disabled'}`}>
              <button
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickNext(this.paging.end_cursor);
                }}
                part={this.paging.has_next ? paginationButton : paginationButtonDisabled}
              >
                <span part={paginationButtonText}>Next</span>
                <span class="ms-1" part={paginationButtonIconNext}>&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
