import { Component, h, Host, Prop } from '@stencil/core';
import { ExtendedPagingDefaults, ExtendedPagingInfo } from '../../api/Pagination';
import {
  buttonDisabled,
  buttonLink,
  paginationItemIconNext,
  paginationItemIconPrevious,
  paginationItemText
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
                part={this.paging.has_previous ? buttonLink : buttonDisabled}
              >
                <span class="me-1" part={paginationItemIconPrevious}>&laquo;</span>
                <span part={paginationItemText}>Previous</span>
              </button>
            </li>
            <li class={`page-item ${this.paging.has_next ? '' : ' disabled'}`}>
              <button
                class="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  this.paging.handleClickNext(this.paging.end_cursor);
                }}
                part={this.paging.has_next ? buttonLink : buttonDisabled}
              >
                <span part={paginationItemText}>Next</span>
                <span class="ms-1" part={paginationItemIconNext}>&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
