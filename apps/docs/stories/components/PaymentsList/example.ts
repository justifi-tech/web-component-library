import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payments-list')}

<body>
  <!-- Optional: add the filters component -->
  <justifi-payments-list-filters></justifi-payments-list-filters>
  <justifi-payments-list></justifi-payments-list>
</body>

</html>
`;

export const codeExampleEventHandling = `
<justifi-payments-list />

<script>
  (function() {
    const paymentList = document.querySelector('justifi-payments-list');
    
    paymentList.addEventListener('row-clicked', (event) => {
      // event.detail contains all the necessary information to call an endpoint to get more details on this entity
      const entityID = event.detail.id;
  
      // Below is pseudocode just to show the flow of data
      const getMoreEntityDetails = justifiAPI(entityID);
      <entity-details-component data={getMoreEntityDetails} />
    })
  
    paymentList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;
