import { Component, h, Host, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';
import { buttonDisabled, buttonLink, } from '../../styles/parts';

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
              <a href="#"
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickPrevious(this.paging.start_cursor);
                }}
                part={this.paging.has_previous ? buttonLink : buttonDisabled}
              >
                <span class="me-1" >&laquo;</span>
                <span>Previous</span>
              </a>
            </li>
            <li class={`page-item ${this.paging.has_next ? '' : ' disabled'}`}>
              <a href="#"
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickNext(this.paging.end_cursor);
                }}
                part={this.paging.has_next ? buttonLink : buttonDisabled}
              >
                <span>Next</span>
                <span class="ms-1">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
