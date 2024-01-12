import webcomponentsPackageJson from '@justifi/webcomponents/package.json';
import webcomponentsDocsJson from '@justifi/webcomponents/dist/docs.json';

export const extractWebcomponentsVersion = () => {
  return webcomponentsPackageJson.version;
};

export const filterDocsByTag = (tag: string) => {
  return webcomponentsDocsJson.components.filter(comp => tag === comp.tag)[0];
};
