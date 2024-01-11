const getPropsAndStyles = (storyContext: any) => {
  const args = storyContext.args;
  const argNames = Object.keys(args);
  const nonStyleArgs = argNames.filter((arg) => arg !== 'style');
  const props = nonStyleArgs.map((arg) => {
    return { [arg]: args[arg] };
  });
  const styleArg = args.style;

  return { props: props, styleArg: styleArg }
};


const applyArgsToStoryComponent = (storyComponent: any, props: { [x: string]: any }[]) => {
  const component = storyComponent();

  props.forEach((prop) => {
    component.setAttribute(prop?.name, prop?.value);
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

export const styledStoryDecorator = (storyComponent: any, storyContext: any) => {
  const fragment = new DocumentFragment();
  const { props, styleArg } = getPropsAndStyles(storyContext);
  const component = applyArgsToStoryComponent(storyComponent, props);

  if (styleArg) {
    const styleBlock = generateStyleBlock(styleArg);
    fragment.prepend(styleBlock)
  };

  fragment.appendChild(component);
  return fragment;
};