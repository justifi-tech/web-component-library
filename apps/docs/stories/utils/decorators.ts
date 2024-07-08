import { setUpMocks } from './mockAllServices';

type Props = { name: string; value: any }[];

const getPropsAndStyles = (storyContext: any) => {
  const args = storyContext.args;
  const argNames = Object.keys(args);
  const nonStyleArgs = argNames.filter(
    (arg) => arg !== 'style' && arg !== 'custom-styled'
  );
  const props: Props = nonStyleArgs.map((arg) => {
    return { name: arg, value: args[arg] };
  });
  const styleArg = args.style;
  const customStyled = args['custom-styled'];

  return { props, styleArg, customStyled };
};

const applyArgsToStoryComponent = (storyComponent: any, props: Props) => {
  const component = storyComponent();

  props.forEach((prop) => {
    component.setAttribute(prop.name, prop.value, prop);
  });

  return component;
};

const generateStyleBlock = (styleArg: any) => {
  const styleBlock = document.createElement('style');
  const styleArgKeys = Object.keys(styleArg);

  styleBlock.innerHTML = styleArgKeys
    .map((styleArgKey) => {
      const selector = styleArgKey;
      const cssProperties = styleArg[styleArgKey];
      const cssRules = Object.keys(cssProperties)
        .map((cssProperty) => {
          return `${cssProperty}: ${cssProperties[cssProperty]};`;
        })
        .join('');

      return `
      ${selector} {
        ${cssRules}
      }
    `;
    })
    .join('');

  return styleBlock;
};

export const customStoryDecorator = (
  storyComponent: any,
  storyContext: any
) => {
  const fragment = new DocumentFragment();
  const { props, styleArg, customStyled } = getPropsAndStyles(storyContext);
  setUpMocks();

  const component = applyArgsToStoryComponent(storyComponent, props);

  if (customStyled && styleArg) {
    const styleBlock = generateStyleBlock(styleArg);
    fragment.prepend(styleBlock);
  }

  fragment.appendChild(component);
  return fragment;
};

// args is an object with key value pairs
interface Args {
  [key: string]: string;
}
export const getAttributesString = (args: Args) => {
  // forEeach key in args return the attribute string only if it has a value

  return Object.keys(args)
    .map((key) => {
      if (args[key]) {
        return `${key}="${args[key]}"`;
      }
    })
    .join(' ');
};
