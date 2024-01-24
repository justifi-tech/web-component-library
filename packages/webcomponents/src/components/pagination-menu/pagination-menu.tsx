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
      <Host exportparts={`page-arrow,page-button,page-button-disabled,page-button-text`}>
        <nav aria-label="Table pagination" class="d-flex justify-content-end gap-3">
          <ul class="pagination m-0">
            <li class={`page-item ${this.paging.has_previous ? '' : ' disabled'}`}>
              <a href="#"
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickPrevious(this.paging.start_cursor);
                }}
                part={`page-button${this.paging.has_previous ? '' : ' page-button-disabled'}`}>
                <span class="me-1" part="page-arrow">&laquo;</span>
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
                part={`page-button${this.paging.has_next ? '' : ' page-button-disabled'}`}>
                <span part="page-button-text">Next</span>
                <span class="ms-1" part="page-arrow">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
