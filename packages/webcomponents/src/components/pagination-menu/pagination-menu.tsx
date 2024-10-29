import { Component, h, Host, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';

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
          <ul class="pagination m-0" part="pagination">
            <li class={`page-item ${this.paging.has_previous ? '' : ' disabled'}`} part="page-item">
              <a href="#"
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickPrevious(this.paging.start_cursor);
                }}
                part={`page-link${this.paging.has_previous ? '' : ' page-link-disabled'}`}>
                <span class="me-1" part="page-link-arrow">&laquo;</span>
                <span part="page-button-text">Previous</span>
              </a>
            </li>
            <li class={`page-item ${this.paging.has_next ? '' : ' disabled'}`}>
              <a href="#"
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickNext(this.paging.end_cursor);
                }}
                part={`page-link${this.paging.has_next ? '' : ' page-link-disabled'}`}>
                <span part="page-link-text">Next</span>
                <span class="ms-1" part="page-link-arrow">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
