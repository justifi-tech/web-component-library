import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-terminal-orders-list',
  `<style>
      ::part(font-family) {
        font-family: georgia;   
      }
        
      ::part(color) {
        color: darkslategray;
      }

      ::part(background-color) {
        background-color: transparent;
      }

      ::part(background-color) {
        background-color: transparent;
      }

      ::part(button) {
        padding: 0.375rem 0.75rem;
        font-size: 16px;
        box-shadow: none;
        border-radius: 0px;
        line-height: 1.5;
        text-transform: none;
      }

      ::part(button-disabled) {
        opacity: 0.5;
      }
    </style>`
)}

<body>
  <!-- Optional: add the filters component -->
  <justifi-terminal-orders-list-filters></justifi-terminal-orders-list-filters>
  <justifi-terminal-orders-list></justifi-terminal-orders-list>
</body>

</html>
`;

export const codeExampleEventHandling = `
<justifi-terminal-orders-list />

<script>
  (function() {
    const ordersList = document.querySelector('justifi-terminal-orders-list');
    
    ordersList.addEventListener('click-event', (event) => {
      // 'click-event' is emitted when a user clicks on a table row, or clicks on the next or previous page buttons
      // event.detail.name describes the action that was clicked - it could be 'nextPage', 'previousPage', or 'tableRow'
      // event.detail.data will be included if the action was 'tableRow', and will contain the data for the row that was clicked
      
      if (event.detail.name === 'tableRow') {
        // Here is where you would handle the click event
        console.log('data from click-event', event.detail.data);
      }
    })
  
    ordersList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;
