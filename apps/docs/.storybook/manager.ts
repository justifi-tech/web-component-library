import { addons } from '@storybook/manager-api';
import storybookTheme from './storybookTheme';
import './styles.css';

addons.setConfig({
  theme: storybookTheme,
  toolbar: {
    zoom: { hidden: true },
  },
});
