const dark = `
  body {
    background: #161616;
  }

  #component-wrapper > * {
    padding: 2rem;
    display: block;
    margin: 5% auto;
    background-color: #222222;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  ::part(font-family) {
    font-family: cursive;   
  }

  ::part(color) {
    color: lightblue;
  }

  ::part(background-color) {
    background-color: transparent;
  }

  ::part(input) {
    background: transparent;
  }

  ::part(input-focused) {
    background-color: #191919;
    appearance: none;
    -webkit-appearance: none;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.4);
  }

  ::part(input-radio) {
    background-color: #191919;
    border-color: lightblue;
  }

  ::part(button) {
    padding: 8px 16px;
  }

  ::part(button-primary) {
    background-color: #FFF05A;
    border-color: #FFF054;
    color: #000;
    border-radius: 4px;
  }

  ::part(button-primary):hover {
    background-color: #FFD25A;
    border-color: #FFD25A;
    color: #000;
  }

  ::part(button-secondary) {
    background-color: #FFF05A;
    border-color: #FFF054;
    color: #000;
    border-radius: 4px;
  }

  ::part(button-secondary):hover {
    background-color: #FFD25A;
    border-color: #FFD25A;
    color: #000;
  }

  ::part(button-link) {
    color: #FFF05A;
    background-color: transparent;
    border-color: transparent;
  }

  ::part(button-disabled) {
    opacity: 0.5;
  }

  ::part(table-cell-odd) {
    background-color: #585858;
  }

  ::part(loading-spinner) {
    border: 4px solid #f3f3f3;
    border-right-color: transparent
  }

  ::part(dropdown-menu) {
    background-color: #161616;
  }

  ::part(radio-list-item) {
    border-bottom: 1px solid #ddd;
  }
  
  ::part(radio-list-item):hover {
    background-color: #333;
    cursor: pointer;
  }

  ::part(skeleton) {
    background-color: #333;
  }

`;

export default dark;
