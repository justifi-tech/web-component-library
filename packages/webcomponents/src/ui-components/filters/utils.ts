export const onFilterChange = (newFilters: any, params: any) => {
  let newParams: any = { ...params };
  delete newParams.before_cursor;
  delete newParams.after_cursor;

  Object.keys(newFilters).forEach((key) => {
    if (newFilters[key].length) {
      newParams[key] = newFilters[key];
    } else {
      delete newParams[key];
    }
  });
  return newParams;
};

export const hasFilters = (params: any) => {
  const paginationKeys = ['after_cursor', 'before_cursor'];
  const paramKeys = Object.keys(params);
  const filterKeys = paramKeys.filter((paramKey) => !paginationKeys.includes(paramKey));
  return filterKeys.some((key) => params[key].length > 0);
};
