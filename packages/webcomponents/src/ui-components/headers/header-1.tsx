import { h } from '@stencil/core';

interface Header1Props {
  text: string;
  class?: string;
}

export const Header1 = (props: Header1Props) => {
  return <h1 class={`header-1 ${props?.class}`} part="header-1">{props.text}</h1>
}
