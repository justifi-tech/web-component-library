import "@justifi/webcomponents/dist/webcomponents/webcomponents.css";

export const parameters = {
  controls: {
    hideNoControlsWarning: true,
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: "alphabetical",
      order: ["Introduction", "Changelog", "Frameworks", "*"],
    },
  },
};
