import { Component, Prop } from '@stencil/core';
import { version } from '../../../package.json'

@Component({
  tag: 'justifi-theme-provider',
  shadow: true,
})
export class ThemeProvider {
  @Prop() href: string; // URL to the theme css file

  componentWillLoad() {
    // The order in which these stylesheets get appended is important for css overriding purposes.
    // Make sure that the theme stylesheet which is passed via the href prop is appended last.

    // This should pull the local stylesheet in development
    this.appendStylesheet(`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${version}/dist/webcomponents/webcomponents.css`);

    if (this.href) {
      this.appendStylesheet(this.href);
    }
  }

  appendStylesheet(href: string) {
    const documentHead = document.head;
    const baseStylesheet = document.createElement('link');
    baseStylesheet.rel = 'stylesheet';
    baseStylesheet.href = href;
    documentHead.appendChild(baseStylesheet);
  }
}
