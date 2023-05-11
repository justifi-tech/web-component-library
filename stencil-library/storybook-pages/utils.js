const extractVersionFromPackage = () => {
  const packageJson = require('../package.json');
  return packageJson.version;
}

export {
  extractVersionFromPackage
}
