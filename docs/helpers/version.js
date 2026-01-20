import localPackageJson from '../package.json';

export const getWebcomponentsVersion = () => {
  try {
    const deps = localPackageJson?.dependencies || {};
    const versionSpec = deps['@justifi/webcomponents'];

    if (versionSpec) {
      return versionSpec;
    }
  } catch (error) {
    console.error(error);
  }

  // Last resort: return 'latest' if we can't determine the version
  console.warn(
    'Could not determine @justifi/webcomponents version, using "latest"'
  );
  return 'latest';
};
