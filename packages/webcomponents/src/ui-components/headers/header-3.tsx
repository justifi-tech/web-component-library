import { h } from '@stencil/core';

export const Header3 = ({ text }) => {
  return <h3 class="fs-6 fw-bold lh-lg mb-4 header-3" part="header-3">{text}</h3>;
}
