import { h } from '@stencil/core';

interface Header2Props {
  text: string;
  class?: string;
}

export const Header2 = (props: Header2Props) => {
  return <h2 class={`header-2 ${props?.class}`} part="header-2">{props.text}</h2>
}
