import { Theme } from "./theme";

const getComputedTheme = (formLabelElement, formControlElement, formControlInvalidElement) => {
  // default state styles
  const labelStyles = getComputedStyle(formLabelElement);
  const formControlStyles = getComputedStyle(formControlElement);
  const formControlInvalidStyles = getComputedStyle(formControlInvalidElement);

  // focus state styles
  formControlElement.focus();
  formControlInvalidElement.focus();
  const formControlFocusStyles = getComputedStyle(formControlElement);
  const formControlInvalidFocusStyles = getComputedStyle(formControlElement);

  const computedTheme: Theme = {
    formControl: {
      backgroundColor: formControlStyles.getPropertyValue('background-color'),
      borderColor: formControlStyles.getPropertyValue('border-color'),
      borderColorFocus: formControlFocusStyles.getPropertyValue('border-color'),
      borderColorError: formControlInvalidStyles.getPropertyValue('border-color'),
      borderWidth: formControlStyles.getPropertyValue('border-width'),
      borderBottomWidth: formControlStyles.getPropertyValue('border-bottom-width'),
      borderLeftWidth: formControlStyles.getPropertyValue('border-left-width'),
      borderRightWidth: formControlStyles.getPropertyValue('border-right-width'),
      borderTopWidth: formControlStyles.getPropertyValue('border-top-width'),
      borderRadius: formControlStyles.getPropertyValue('border-radius'),
      borderStyle: formControlStyles.getPropertyValue('border-style'),
      boxShadow: formControlStyles.getPropertyValue('box-shadow'),
      boxShadowError: formControlInvalidStyles.getPropertyValue('box-shadow'),
      boxShadowErrorFocus: formControlInvalidFocusStyles.getPropertyValue('box-shadow'),
      boxShadowFocus: formControlFocusStyles.getPropertyValue('box-shadow'),
      color: formControlStyles.getPropertyValue('color'),
      colorFocus: formControlFocusStyles.getPropertyValue('color'),
      fontSize: formControlStyles.getPropertyValue('font-size'),
      fontWeight: formControlStyles.getPropertyValue('font-weight'),
      lineHeight: formControlStyles.getPropertyValue('line-height'),
      margin: formControlStyles.getPropertyValue('margin'),
      padding: formControlStyles.getPropertyValue('padding'),
    },
    formLabel: {
      color: labelStyles.getPropertyValue('color'),
      fontFamily: labelStyles.getPropertyValue('font-family'),
      fontSize: labelStyles.getPropertyValue('font-size'),
      fontWeight: labelStyles.getPropertyValue('font-weight'),
      margin: labelStyles.getPropertyValue('margin')
    }
  };

  return computedTheme;
}

export default getComputedTheme;