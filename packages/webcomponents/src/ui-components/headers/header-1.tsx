import { h } from '@stencil/core';
import { heading1 } from '../../styles/parts';

interface Header1Props {
  text: string;
  class?: string;
}

export const Header1 = (props: Header1Props) => {
  return <h1 class={`header-1 ${props?.class}`} part={heading1}>{props.text}</h1>
}
