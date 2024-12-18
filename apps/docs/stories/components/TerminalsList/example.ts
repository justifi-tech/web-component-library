import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead('justifi-terminals-list')}

<body>
  <justifi-terminals-list></justifi-terminals-list>
</body>

</html>
`;

export const codeExampleEventHandling = `
<justifi-terminals-list />

<script>
  (function() {
    const terminalList = document.querySelector('justifi-terminals-list');
    
    terminalList.addEventListener('terminal-row-clicked', (event) => {
      // event.detail contains all the necessary information to call an endpoint to get more details on this entity
      const entityID = event.detail.id;
  
      // Below is pseudocode just to show the flow of data
      const getMoreEntityDetails = justifiAPI(entityID);
      <entity-details-component data={getMoreEntityDetails} />
    })
  
    terminalList.addEventListener('error-event', (event) => {
      // here is where you would handle the error
      console.error('error-event', event.detail);
    });
  })();
</script>
`;
