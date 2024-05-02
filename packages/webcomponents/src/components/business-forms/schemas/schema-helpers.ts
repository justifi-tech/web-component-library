import { string } from "yup";

// Schema helper functions

export const transformEmptyString = (value: string) => {
  return value === '' ? null : value;
}

// Regular Expressions

export const businessNameRegex = /^(?!^\s+$)[a-zA-Z0-9\s,&.-]*$/;

export const phoneRegex = /^\d{10}$/;

export const urlRegex = /^(?:http(s)?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

export const taxIdRegex = /^\d{9}$/;

export const onlyLettersRegex = /^(?!^\s+$)[a-zA-Z\s]*$/;

// Common/Reusable yup validations

export const emailValidation = string()
  .email('Enter valid email')
  .transform(transformEmptyString);

export const phoneValidation = string()
  .matches(phoneRegex, 'Enter valid phone number')
  .transform(transformEmptyString);