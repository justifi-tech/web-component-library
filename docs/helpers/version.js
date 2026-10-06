import wcPackage from '@justifi/webcomponents/package.json';

/** Exact published semver from packages/webcomponents (inlined when bundled via build:helpers). */
export const getWebcomponentsVersion = () => wcPackage.version;
