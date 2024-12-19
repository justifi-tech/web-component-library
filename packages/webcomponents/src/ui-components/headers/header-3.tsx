import { h } from '@stencil/core';
import { heading3 } from '../../styles/parts';

interface Header3Props {
  text: string;
  class?: string;
}

export const Header3 = (props: Header3Props) => {
  return <h3 class={`header-3 ${props?.class}`} part={heading3}>{props.text}</h3>;
}
