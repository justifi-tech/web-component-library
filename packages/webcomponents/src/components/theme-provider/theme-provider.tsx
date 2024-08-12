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
      this.appendStylesheet(this.href, true);
    }
  }

  appendStylesheet(href: string, customStyles = false) {
    const documentHead = document.head;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    if (customStyles) {
      // Wait to parse so that the browser has a chance to cache the stylesheet
      link.onload = this.parseTheme.bind(this, href);
    }

    documentHead.appendChild(link);
  }

  parseTheme(href: string) {
    fetch(href)
      .then(response => response.text())
      .then(css => {
        console.log('Fetched stylesheet:', css);
      })
      .catch(error => {
        console.error('Error fetching stylesheet:', error);
      });
  }
}
