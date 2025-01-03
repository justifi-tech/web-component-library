import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-terminals-list')}

<body>
  <!-- Optional: add the filters component -->
  <justifi-terminals-list-filters></justifi-terminals-list-filters>
  <justifi-terminals-list></justifi-terminals-list>
</body>

</html>
`;

export const codeExampleEventHandling = `
<justifi-terminals-list />

<script>
  (function() {
    const terminalList = document.querySelector('justifi-terminals-list');
    
    terminalList.addEventListener('click-event', (event) => {
      // 'click-event' is emitted when a user clicks on a table row, or clicks on the next or previous page buttons
      // event.detail.name describes the action that was clicked - it could be 'nextPage', 'previousPage', or 'tableRow'
      // event.detail.data will be included if the action was 'tableRow', and will contain the data for the row that was clicked
      
      if (event.detail.name === 'tableRow') {
        // Here is where you would handle the click event
        console.log('data from click-event', event.detail.data);
      }
    })
  
    terminalList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;
