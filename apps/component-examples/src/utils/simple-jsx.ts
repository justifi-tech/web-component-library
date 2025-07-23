// Simple JSX renderer for HTML generation
export interface SimpleElement {
  type: string;
  props: Record<string, any>;
  children: (SimpleElement | string)[];
}

export function h(
  type: string | Function,
  props: Record<string, any> | null,
  ...children: (SimpleElement | string)[]
): SimpleElement {
  return {
    type: typeof type === 'string' ? type : 'div',
    props: props || {},
    children: children.flat(),
  };
}

export function renderToString(element: SimpleElement | string): string {
  if (typeof element === 'string') {
    return element;
  }

  const { type, props, children } = element;
  const safeProps = props || {};
  const childrenArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  // Build attributes string
  const attributes = Object.entries(safeProps)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `${key}="${String(value).replace(/"/g, '&quot;')}"`;
    })
    .filter(Boolean)
    .join(' ');

  // Render children
  const childrenHtml = childrenArray
    .map((child) => renderToString(child))
    .join('');

  // Self-closing tags
  const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
  if (selfClosingTags.includes(type)) {
    return `<${type}${attributes ? ' ' + attributes : ''} />`;
  }

  return `<${type}${attributes ? ' ' + attributes : ''}>${childrenHtml}</${type}>`;
}

// Helper function to render JSX to HTML string
export function jsxToString(jsx: SimpleElement): string {
  return renderToString(jsx);
}
