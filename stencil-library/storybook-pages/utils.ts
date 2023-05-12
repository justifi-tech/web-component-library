import DocsJson from '../docs.json';

const extractVersionFromPackage = () => {
  const packageJson = require('../package.json');
  return packageJson.version;
}

const filterDocsByTag = (tag: string) => {
  return DocsJson.components.filter(comp => tag === comp.tag)[0];
}

export {
  extractVersionFromPackage,
  filterDocsByTag
}
