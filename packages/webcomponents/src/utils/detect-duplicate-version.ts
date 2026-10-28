import packageJson from '../../package.json';

const JUSTIFI_VERSION_KEY = '__JUSTIFI_WC_VERSION__';

/**
 * Records this bundle's version on globalThis and logs an error when a second,
 * different version of @justifi/webcomponents is already on the page. The first
 * version loaded wins — it has registered the custom elements, so any later
 * bundle is inert.
 */
export const detectDuplicateVersion = () => {
  if (typeof globalThis === 'undefined') return;

  const globalScope = globalThis as unknown as Record<string, string | undefined>;
  const currentVersion = packageJson.version;
  const existingVersion = globalScope[JUSTIFI_VERSION_KEY];

  if (existingVersion && existingVersion !== currentVersion) {
    console.error(
      `@justifi/webcomponents: Multiple versions detected. ` +
      `Version ${existingVersion} was loaded first and registered all components. ` +
      `Version ${currentVersion} is also present but its components will NOT be used. ` +
      `To fix this, add to your package.json:\n` +
      `"pnpm": { "overrides": { "@justifi/webcomponents": "${currentVersion}" } }`
    );
    return;
  }

  globalScope[JUSTIFI_VERSION_KEY] = currentVersion;
};
