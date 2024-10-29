import { h } from '@stencil/core';

export const Header1 = ({ text }) => {
  return <h1 class="fs-1 pb-3 header-1" part="header-1">{text}</h1>
}
