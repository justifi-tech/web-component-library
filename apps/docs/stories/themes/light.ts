const light = `
  body {
    background: #efefef;
  }

  #component-wrapper > * {
    padding: 2rem;
    display: block;
    margin: 5% auto;
    background-color: #fff;
    border-radius: 0px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  }

  ::part(font-family) {
    font-family: georgia;   
  }

  ::part(color) {
    color: white;
  }

  ::part(background-color) {
    background-color: transparent;
  }

  ::part(input) {
    border-color: #555;
    border-width: 1px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-width: 1px;
    border-radius: 0;
    border-style: solid;
    box-shadow: none;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5;
    padding: 0.375rem 0.75rem;
  }

  ::part(input-focused) {
    border-color: #333;
    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
  }

  ::part(input-invalid) {
    border-color: #8a2a35;
    box-shadow: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
  }

  ::part(input-invalid-and-focused) {
    box-shadow: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
    border-color: #8a2a35;
  }

  ::part(input-radio) {
    background-color: #fff; 
    border-color: #333;
  }

  ::part(input-radio-checked) {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 30 30" fill="white"><circle cx="10" cy="10" r="10"/></svg>');
    background-color: #000;
  }

  ::part(input-radio-focused) {
    background-color: #333;
    border-color: #333;
    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
  }

  ::part(input-radio-checked-focused) {
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 30 30" fill="white"><circle cx="10" cy="10" r="10"/></svg>');
    background-color: #000;
    border-color: #333;
    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
  }

  ::part(input-checkbox) {
    border-color: #333;
  }
  
  ::part(input-checkbox-checked) {
    background-color: #000;
    border-color: #333;
  }

  ::part(input-checkbox-checked-focused) {
    background-color: #000;
    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
  }

  ::part(input-checkbox-focused) {
    background-color: #fff;
    box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
  }

  ::part(button) {
    padding: 0.375rem 0.75rem;
    font-size: 16px;
    box-shadow: none;
    border-radius: 0px;
    line-height: 1.5;
    text-transform: none;
  }

  ::part(button-primary) {
    color: #333;
    background-color: transparent;
    border-color: #333;
  }

  ::part(button-primary):hover {
    background-color: rgba(0, 0, 0, .05);
    border-color: #333;
    color: #333;
  }

  ::part(button-secondary) {
    color: #333;
    background-color: transparent;
    border-color: #333;
  }

  ::part(button-secondary):hover {
    background-color: rgba(0, 0, 0, .05);
    border-color: #333;
    color: #333;
  }

  ::part(button-link) {
    background: none;
    border: none;
  }

  ::part(button-disabled) {
    opacity: 0.5;
  }
  
  ::part(radio-list-item) {
    border-bottom: 1px solid #ddd;
  }
  
  ::part(radio-list-item):hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }

  ::part(tooltip-inner) {
    color: #fff;
  }
`;

export default light;
