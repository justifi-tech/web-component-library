import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payouts-list')}

<body>
  <!-- Optional: add the filters component -->
  <justifi-payouts-list-filters></justifi-payouts-list-filters>
  <justifi-payouts-list></justifi-payouts-list>
</body>

</html>
`;

export const codeExampleEventHandling = `
<justifi-payouts-list />

<script>
  (function() {
    const payoutsList = document.querySelector('justifi-payouts-list');
    
    payoutsList.addEventListener('row-clicked', (event) => {
      // event.detail contains all the necessary information to call an endpoint to get more details on this entity
      const entityID = event.detail.id;
  
      // Below is pseudocode just to show the flow of data
      const getMoreEntityDetails = justifiAPI(entityID);
      <entity-details-component data={getMoreEntityDetails} />
    })
  
    payoutsList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;
