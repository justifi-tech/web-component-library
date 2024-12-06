
export const transformEmptyString = (value: string) => {
  return value === '' ? null : value;
}
export const validateRoutingNumber = (routingNumber): boolean => {
  if (!routingNumber) return false;

  const integers = Array.from(String(routingNumber), Number);

  if (integers.length === 9) {
    const checksum = ((3 * (integers[0] + integers[3] + integers[6])) +
      (7 * (integers[1] + integers[4] + integers[7])) +
      (integers[2] + integers[5] + integers[8])) % 10;
    if (checksum === 0) return true;
  }

  return false;
}

export const phoneRegex = /^\d{10}$/;

export const urlRegex = /^(?:http(s)?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

export const numbersOnlyRegex = /^\d+$/;

export const ssnRegex = /^(?!000|666|9\d{2})\d{3}(?!00)\d{2}(?!0000)\d{4}$/;

export const streetAddressRegex = /^(?!^\s+$)[a-zA-Z0-9\s,&.-]*$/;

export const poBoxRegex = /P\.?\s?O\.?\s?Box|Postal\sBox/i;
