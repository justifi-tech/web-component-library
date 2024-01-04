export interface PagingInfo {
  amount: number,
  start_cursor: string,
  end_cursor: string,
  has_previous: boolean,
  has_next: boolean,
}

export const pagingDefaults = {
  amount: 25,
  start_cursor: '',
  end_cursor: '',
  has_previous: false,
  has_next: false,
}

export interface ExtendedPagingInfo extends PagingInfo {
  handleClickNext: (after_cursor: string) => void;
  handleClickPrevious: (before_cursor: string) => void;
}

export const ExtendedPagingDefaults: ExtendedPagingInfo = {
  ...pagingDefaults,
  handleClickNext: () => { },
  handleClickPrevious: () => { }
}
