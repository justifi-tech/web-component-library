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
    
    checkoutList.addEventListener('row-clicked', (event) => {
      // event.detail contains all the necessary information to call an endpoint to get more details on this entity
      const entityID = event.detail.id;
  
      // Below is pseudocode just to show the flow of data
      const getMoreEntityDetails = justifiAPI(entityID);
      <entity-details-component data={getMoreEntityDetails} />
    })
  
    checkoutList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;