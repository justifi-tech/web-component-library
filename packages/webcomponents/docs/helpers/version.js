let cachedVersion = null;

export const getWebcomponentsVersion = () => {
  if (cachedVersion) {
    return cachedVersion;
  }
  try {
    // Try to import from the package (works in both Storybook and consumer apps)
    const packageJson = require('@justifi/webcomponents/package.json');
    const version = packageJson.version;
    cachedVersion = version;
    return version;
  } catch (error) {
    // Fallback: try to read from local package.json (for build-time)
    try {
      const fs = require('fs');
      const path = require('path');
      const packageJsonPath = path.resolve(__dirname, '../../package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const version = packageJson.version;
      cachedVersion = version;
      return version;
    } catch (fallbackError) {
      // Last resort: return 'latest' if we can't determine the version
      console.warn(
        'Could not determine @justifi/webcomponents version, using "latest"'
      );
      return 'latest';
    }
  }
};

