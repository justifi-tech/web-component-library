import localPackageJson from '../package.json';

let cachedVersion = null;

export const getWebcomponentsVersion = () => {
  if (cachedVersion) {
    return cachedVersion;
  }

  // Read from local package.json dependencies
  // The version is specified in dependencies or devDependencies
  try {
    const deps = localPackageJson?.dependencies || {};
    const devDeps = localPackageJson?.devDependencies || {};
    const versionSpec =
      deps['@justifi/webcomponents'] || devDeps['@justifi/webcomponents'];

    if (versionSpec) {
      // Remove ^, ~, or other prefix characters to get clean version
      const cleanVersion = versionSpec.replace(/^[\^~>=<]/, '').trim();
      cachedVersion = cleanVersion;
      return cleanVersion;
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
