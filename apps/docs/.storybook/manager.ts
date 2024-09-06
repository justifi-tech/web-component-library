import { addons } from '@storybook/manager-api';
import storybookTheme from './storybookTheme';
import './manager.css';

addons.setConfig({
  theme: storybookTheme,
  toolbar: {
    zoom: { hidden: true },
  },
});
