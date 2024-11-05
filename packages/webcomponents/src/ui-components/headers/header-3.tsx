import { h } from '@stencil/core';

interface Header3Props {
  text: string;
  class?: string;
}

export const Header3 = (props: Header3Props) => {
  return <h3 class={`header-3 ${props?.class}`} part="header-3">{props.text}</h3>;
}
