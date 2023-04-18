import { Theme } from "./theme";

const getComputedTheme = (labelElement, inputElement) => {
  if (!inputElement || !labelElement) return;

  // default state styles
  const labelStyles = getComputedStyle(labelElement);
  const inputStyles = getComputedStyle(inputElement);

  // focus state styles
  inputElement.focus();
  const inputFocusStyles = getComputedStyle(inputElement);
  inputElement.blur();

  // hover state styles
  const inputHoverStyles = getComputedStyle(inputElement);

  const computedTheme: Theme = {
    formControl: {
      backgroundColor: inputStyles.getPropertyValue('background-color'),
      backgroundColorHover: inputHoverStyles.getPropertyValue('background-color'),
      borderColor: inputStyles.getPropertyValue('border-color'),
      borderColorFocus: inputFocusStyles.getPropertyValue('border-color'),
      color: inputStyles.getPropertyValue('color'),
    },
    formLabel: {
      ...labelStyles
    }
  };
  return computedTheme;
}

export default getComputedTheme;