export enum ThemeNames {
  None = 'None (bootstrap defaults)',
  Light = 'Light',
  Dark = 'Dark',
}

const light = `
  body {
    background-color: #f8f8f8;
  }
`;

const dark = `
  body {
    background-color: #333;
  }
`;

const themes = {
  [ThemeNames.Light]: light,
  [ThemeNames.Dark]: dark
}

export default themes;
