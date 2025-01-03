import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-checkouts-list')}

<body>
  <!-- Optional: add the filters component -->
  <justifi-checkouts-list-filters></justifi-checkouts-list-filters>
  <justifi-checkouts-list></justifi-checkouts-list>
</body>

</html>
`;

export const codeExampleEventHandling = `
<justifi-checkouts-list />

<script>
  (function() {
    const checkoutList = document.querySelector('justifi-checkouts-list');
    
    checkoutList.addEventListener('click-event', (event) => {
      // 'click-event' is emitted when a user clicks on a table row, or clicks on the next or previous page buttons
      // event.detail.name describes the action that was clicked - it could be 'nextPage', 'previousPage', or 'tableRow'
      // event.detail.data will be included if the action was 'tableRow', and will contain the data for the row that was clicked
      
      if (event.detail.name === 'tableRow') {
        // Here is where you would handle the click event
        console.log('data from click-event', event.detail.data);
      }
    })
  
    checkoutList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;
