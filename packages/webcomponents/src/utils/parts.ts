// Typography parts
const color = () => 'color';

const fontFamily = () => 'font-family';

const text = () => `text ${color()} ${fontFamily()}`;

const paragraph = () => `paragraph ${text()}`;

const header = () => `header ${text()}`;

const header1 = () => `header1 ${header()}`;

// buttons
const button = () => `button ${color()} } `;

const buttonPrimary = () => `button-primary ${button()}`;
