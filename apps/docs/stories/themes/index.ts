import dark from "./dark";
import light from "./light";

export enum ThemeNames {
  None = 'None (bootstrap defaults)',
  Light = 'Light',
  Dark = 'Dark',
}

const themes = {
  [ThemeNames.None]: '',
  [ThemeNames.Light]: light,
  [ThemeNames.Dark]: dark
}

export default themes;
