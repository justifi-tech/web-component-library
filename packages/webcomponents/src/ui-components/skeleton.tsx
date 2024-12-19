import { FunctionalComponent, h } from '@stencil/core';
import { skeleton } from '../styles/parts';

interface SkeletonProps {
  component?: string;
  height?: string | number;
  width?: string | number;
  componentClassName?: string;
  styles?: { [key: string]: any };
}

export const Skeleton: FunctionalComponent<SkeletonProps> = ({
  component = 'div',
  height,
  width,
  componentClassName,
  styles = {},
}) => {

  const combinedStyle = {
    ...styles,
    width,
    height,
  };

  const TagType = component as any;

  return (
    <TagType
      class={`${componentClassName} skeleton`}
      style={combinedStyle}
      part={skeleton}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
