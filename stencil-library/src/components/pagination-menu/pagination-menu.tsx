import { Component, Host, h, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';

export interface PaginationProps {
  paging: ExtendedPagingInfo;
  params?: {};
}

@Component({
  tag: 'pagination-menu',
  styleUrl: '../table/table.scss',
  shadow: true,
})

export class PaginationMenu {
  @Prop() paging: PaginationProps['paging'] = ExtendedPagingDefaults;
  @Prop() params: PaginationProps['params'] = {};

  render() {
    return (
      <Host>
        <nav aria-label="Table pagination" class="d-flex justify-content-end gap-3">
          <ul class="pagination m-0">
            <li
              onClick={(e) => {
                e.preventDefault();
                if (this.paging.has_previous) {
                  this.paging.handleClickPrevious(this.paging.start_cursor);
                }
              }}
              part={`previous-button${this.paging.has_previous ? '' : ' button-disabled'}`}
              class={`page-item ${this.paging.has_previous ? '' : ' disabled'}`}
            >
              <a href="#" class="page-link">
                <span class="me-1" part="arrow arrow-left">&laquo;</span>
                <span part="previous-button-text">Previous</span>
              </a>
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                if (this.paging.has_next) {
                  this.paging.handleClickNext(this.paging.end_cursor);
                }
              }}
              part={`next-button${this.paging.has_next ? '' : ' button-disabled'}`}
              class={`page-item ${this.paging.has_next ? '' : ' disabled'}`}
            >
              <a href="#" class="page-link">
                <span part="next-button-text">Next</span>
                <span class="ms-1" part="arrow arrow-right">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
