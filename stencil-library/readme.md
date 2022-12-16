# Basic Usage Example
### Script tag
## Plain HTML
```html
  <!-- Are both needed? -->
  <script type="module" src="/build/webcomponents.esm.js"></script>
  <!-- or? -->
  <script nomodule src="/build/webcomponents.js"></script>

  <justifi-card-form></justifi-card-form>
```
## Installing via npm / yarn
<!-- Investigate if below should / could have a copy to clipboard -->
```sh
  npm install '@justifi/react-components' --save
```
### React
```jsx
  import { JustifiCardForm } from '@justifi/react-components';

  <JustifiCardForm>

  </JustifiCardForm>
```

For detailed Usage see: Link to Usage

For a complete API see: Link to API


---
# Contributing

See the Wiki (link here) for information about running this repository locally and contributing.