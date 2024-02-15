export const getErrorMessage = (error: any) => {
  if (typeof error === 'string') {
    return error;
  }
  return error.message;
};
