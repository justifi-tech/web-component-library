import { codeExampleHead } from '../utils';

export const codeExampleFull = (`
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-payments-list')}

<body>
  <justifi-payments-list></justifi-payments-list>
</body>

</html>
`);

export const codeExampleEventHandling = (`
<justifi-payments-list />

<script>
  window.addEventListener('payment-row-clicked', (event) => {
    // event.detail contains all the necessary information to call an endpoint to get more details on this entity
    const entityID = event.detail.id;

    // Below is pseudocode just to show the flow of data
    const getMoreEntityDetails = justifiAPI(entityID);
    <entity-details-component data={getMoreEntityDetails} />
  })
</script>
`);