// src/api/Pagination.ts
var pagingDefaults = {
  amount: 25,
  start_cursor: "",
  end_cursor: "",
  has_previous: false,
  has_next: false
};
var ExtendedPagingDefaults = {
  ...pagingDefaults,
  handleClickNext: () => {
  },
  handleClickPrevious: () => {
  }
};

export { ExtendedPagingDefaults, pagingDefaults };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map