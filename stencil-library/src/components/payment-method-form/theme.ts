export interface Theme {
  layout?: {
    padding?: string;
    formControlSpacingHorizontal?: string;
    formControlSpacingVertical?: string;
  };
  formLabel?: {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    margin?: string;
  };
  formControl?: {
    backgroundColor?: string;
    backgroundColorHover?: string;
    borderColor?: string;
    borderColorHover?: string;
    borderColorFocus?: string;
    borderColorError?: string;
    borderWidth?: string;
    borderBottomWidth?: string;
    borderLeftWidth?: string;
    borderRightWidth?: string;
    borderTopWidth?: string;
    borderRadius?: string;
    borderStyle?: string;
    boxShadow?: string;
    boxShadowError?: string;
    boxShadowErrorFocus?: string;
    boxShadowFocus?: string;
    color?: string;
    colorFocus?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    margin?: string;
    padding?: string;
  };
  errorMessage?: {
    color?: string;
    margin?: string;
    fontSize?: string;
  };
}
