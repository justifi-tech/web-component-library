import { FunctionalComponent, h } from '@stencil/core';

interface SkeletonProps {
  component?: string;
  height?: string | number;
  width?: string | number;
  variant?: 'circular' | 'rectangular' | 'rounded' | 'text';
  componentClassName?: string;
  styles?: { [key: string]: any };
}

// This component relies on "src/styles/animations.css" 
// where it is defined the pulsation animation.
// Because of shadow-dom, it's not possible to add it to the root.css.
// Don't forget to include this file in the `styleUrls` 
// property of the web component that will render the Skeleton
export const Skeleton: FunctionalComponent<SkeletonProps> = ({
  component = 'div',
  height,
  width,
  variant = 'text',
  componentClassName,
  styles = {},
}) => {
  const getVariantStyle = () => {
    if (variant === 'text') {
      return {
        marginTop: 0,
        marginBottom: 0,
        height: 'auto',
        transformOrigin: '0 55%',
        transform: 'scale(1, 0.60)',
        borderRadius: '4px/6.67px',
        '::before': {
          content: '"\\00a0"',
        },
      };
    } else if (variant === 'circular') {
      return {
        borderRadius: '50%',
      };
    } else if (variant === 'rounded') {
      return {
        borderRadius: '4px',
      };
    }
    return {};
  };

  const combinedStyle = {
    ...styles,
    ...getVariantStyle(),
    width,
    height,
  };

  const TagType = component as any;

  return (
    <TagType class={componentClassName} style={combinedStyle} part="skeleton" />
  );
};

export default Skeleton;
