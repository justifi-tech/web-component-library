// Errors on [capital]/config/locales/en.yml
// Add more errors as needed
export const API_ERRORS = {
  NOT_AUTHENTICATED: 'not_authenticated',
  INVALID_PARAMETER: 'invalid_parameter',
};

export const API_NOT_AUTHENTICATED_ERROR = {
  error: {
    code: API_ERRORS.NOT_AUTHENTICATED,
    message: 'Not Authenticated',
  },
};

export const API_INVALID_PARAMETER_ERROR = {
  error: {
    code: API_ERRORS.INVALID_PARAMETER,
    message: 'Invalid Parameter',
  },
};
