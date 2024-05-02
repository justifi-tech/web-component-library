import { API_PATHS, mockAllServices } from "./mockAllServices";

type Props = { name: string; value: any }[];

const getPropsAndStyles = (storyContext: any) => {
  const args = storyContext.args;
  const argNames = Object.keys(args);
  const nonStyleArgs = argNames.filter((arg) => arg !== 'style');
  const props: Props = nonStyleArgs.map((arg) => {
    return { name: arg, value: args[arg] };
  });
  const styleArg = args.style;

  return { props: props, styleArg: styleArg }
};

const applyArgsToStoryComponent = (storyComponent: any, props: Props) => {
  const component = storyComponent();

  props.forEach((prop) => {
    component.setAttribute(prop.name, prop.value, prop);
  });

  return component;
}

const generateStyleBlock = (styleArg: any) => {
  const styleBlock = document.createElement('style');
  const styleArgKeys = Object.keys(styleArg);

  styleBlock.innerHTML = styleArgKeys.map((styleArgKey) => {
    const selector = styleArgKey;
    const cssProperties = styleArg[styleArgKey];
    const cssRules = Object.keys(cssProperties).map((cssProperty) => {
      return `${cssProperty}: ${cssProperties[cssProperty]};`;
    }).join('');

    return (`
      ${selector} {
        ${cssRules}
      }
    `);
  }).join('');

  return styleBlock;
}

export const customStoryDecorator = (storyComponent: any, storyContext: any) => {
  const fragment = new DocumentFragment();
  const { props, styleArg } = getPropsAndStyles(storyContext);

  const isMocksEnabled = __VITE_STORYBOOK_MOCKS_ENABLED__ === 'true';
  const isChromaticBuild = __VITE_STORYBOOK_CHROMATIC_BUILD__ === 'true';

  if (isMocksEnabled) {
    // Use mock data for GrossPaymentChart only in Chromatic builds for consistent screenshots.
    // For regular Storybook, use proxyApi to view dynamic data, especially to see dates from the past 30 days.
    mockAllServices({
      bypass: isChromaticBuild ? [] : [API_PATHS.GROSS_VOLUME],
    });
  }

  const component = applyArgsToStoryComponent(storyComponent, props);

  if (styleArg) {
    const styleBlock = generateStyleBlock(styleArg);
    fragment.prepend(styleBlock)
  };

  fragment.appendChild(component);
  return fragment;
};
