'use strict';

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

exports.ExtendedPagingDefaults = ExtendedPagingDefaults;
exports.pagingDefaults = pagingDefaults;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map