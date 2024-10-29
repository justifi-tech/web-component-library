import { h } from '@stencil/core';

export const Header2 = ({ text }) => {
  return <h2 class="fs-5 fw-bold pb-3 header-2 border-bottom" part="header-2">{text}</h2>
}
