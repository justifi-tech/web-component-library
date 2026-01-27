import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const getWebcomponentsVersion = () => {
  try {
    // Try to find package.json relative to this module
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const packageJsonPath = join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const peerDeps = packageJson?.peerDependencies || {};
    const versionSpec = peerDeps['@justifi/webcomponents'];

    if (versionSpec) {
      return versionSpec;
    }
  } catch (error) {
    // Fallback for environments where fs is not available (browser)
    console.warn('Could not read package.json:', error.message);
  }

  // Last resort: return 'latest' if we can't determine the version
  console.warn(
    'Could not determine @justifi/webcomponents version, using "latest"'
  );
  return 'latest';
};
