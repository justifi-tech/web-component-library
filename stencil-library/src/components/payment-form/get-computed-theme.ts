import { Theme } from "../payment-method-form/theme";

const getComputedTheme = () => {
  const computedStyles = getComputedStyle(document.body);

  const computedTheme: Theme = {
    formControl: {
      backgroundColor: computedStyles.getPropertyValue('--jfi-form-control-background-color'),
      borderColor: computedStyles.getPropertyValue('--jfi-form-control-border-color'),
      borderColorFocus: computedStyles.getPropertyValue('--jfi-form-control-border-color-focus'),
      borderColorError: computedStyles.getPropertyValue('--jfi-form-control-border-color-error'),
      borderWidth: computedStyles.getPropertyValue('--jfi-form-control-border-width'),
      borderBottomWidth: computedStyles.getPropertyValue('--jfi-form-control-border-bottom-width'),
      borderLeftWidth: computedStyles.getPropertyValue('--jfi-form-control-border-left-width'),
      borderRightWidth: computedStyles.getPropertyValue('--jfi-form-control-border-right-width'),
      borderTopWidth: computedStyles.getPropertyValue('--jfi-form-control-border-top-width'),
      borderRadius: computedStyles.getPropertyValue('--jfi-form-control-border-radius'),
      borderStyle: computedStyles.getPropertyValue('--jfi-form-control-border-style'),
      boxShadow: computedStyles.getPropertyValue('--jfi-form-control-box-shadow'),
      boxShadowError: computedStyles.getPropertyValue('--jfi-form-control-box-shadow-error'),
      boxShadowErrorFocus: computedStyles.getPropertyValue('--jfi-form-control-box-shadow-error-focus'),
      boxShadowFocus: computedStyles.getPropertyValue('--jfi-form-control-box-shadow-focus'),
      color: computedStyles.getPropertyValue('--jfi-form-control-color'),
      colorFocus: computedStyles.getPropertyValue('--jfi-form-control-color-focus'),
      fontSize: computedStyles.getPropertyValue('--jfi-form-control-font-size'),
      fontWeight: computedStyles.getPropertyValue('--jfi-form-control-font-weight'),
      lineHeight: computedStyles.getPropertyValue('--jfi-form-control-line-height'),
      margin: computedStyles.getPropertyValue('--jfi-form-control-margin'),
      padding: computedStyles.getPropertyValue('--jfi-form-control-padding'),
    },
    formLabel: {
      color: computedStyles.getPropertyValue('--jfi-form-label-color'),
      fontFamily: computedStyles.getPropertyValue('--jfi-form-label-font-family'),
      fontSize: computedStyles.getPropertyValue('--jfi-form-label-font-size'),
      fontWeight: computedStyles.getPropertyValue('--jfi-form-label-font-weight'),
      margin: computedStyles.getPropertyValue('--jfi-form-label-margin'),
    },
    errorMessage: {
      color: computedStyles.getPropertyValue('--jfi-error-message-color'),
      margin: computedStyles.getPropertyValue('--jfi-error-message-margin'),
      fontSize: computedStyles.getPropertyValue('--jfi-error-message-font-size'),
    }
  };

  console.log('computedTheme', computedTheme);

  return computedTheme;
}

export default getComputedTheme;