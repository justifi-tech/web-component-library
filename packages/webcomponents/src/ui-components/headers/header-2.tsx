import { h } from '@stencil/core';
import { heading2 } from '../../styles/parts';

interface Header2Props {
  text: string;
  class?: string;
}

export const Header2 = (props: Header2Props) => {
  return <h2 class={`header-2 ${props?.class}`} part={heading2}>{props.text}</h2>
}
