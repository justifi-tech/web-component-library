
export const transformEmptyString = (value: string) => {
  return value === '' ? null : value;
}

export const businessNameRegex = /^(?!^\s+$)[a-zA-Z0-9\s,&.-]*$/;

export const phoneRegex = /^\d{10}$/;

export const urlRegex = /^(?:http(s)?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

export const taxIdRegex = /^\d{9}$/;

export const stringLettersOnlyRegex = /^(?!^\s+$)[a-zA-Z\s]*$/;

export const numbersOnlyRegex = /^\d+$/;

export const ssnRegex = /^(?!000|666|9\d{2})\d{3}(?!00)\d{2}(?!0000)\d{4}$/;

export const streetAddressRegex = /^(?!.*PO Box)(?!.*P\.O\. Box)(?!^\s+$)[a-zA-Z0-9\s,.'-]*$/;
