const express = require('express');
const path = require('path');

function startStandaloneServer(router) {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  const app = express();
  const port = process.env.PORT || 3000;
  app.use('/scripts', express.static(path.resolve(__dirname, '../node_modules/@justifi/webcomponents/dist/')));
  app.use('/styles', express.static(path.resolve(__dirname, '../css/')));
  app.use('/', router);
  app.listen(port, () => console.log(`Example app listening on port ${port}`));
}

module.exports = { startStandaloneServer };
