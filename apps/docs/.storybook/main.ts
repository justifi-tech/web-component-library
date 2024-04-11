import { mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

const config = {
  framework: "@storybook/web-components-vite",
  stories: ["../stories/**/*.stories.@(mdx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
  ],
  docs: {
    autodocs: true,
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    const storybookMocksEnabled = process.env.VITE_STORYBOOK_MOCKS_ENABLED;
    const storybookChromaticBuild = process.env.VITE_STORYBOOK_CHROMATIC_BUILD;

    return mergeConfig(config, {
      plugins: [react()],
      define: {
        __VITE_STORYBOOK_MOCKS_ENABLED__: JSON.stringify(storybookMocksEnabled),
        __VITE_STORYBOOK_CHROMATIC_BUILD__: JSON.stringify(
          storybookChromaticBuild
        ),
      },
    });
  },
};

export default config;
