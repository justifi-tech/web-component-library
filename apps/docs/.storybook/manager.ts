import { addons } from '@storybook/manager-api';
import theme from './theme';
import './styles.css';

addons.setConfig({
  theme: theme,
});