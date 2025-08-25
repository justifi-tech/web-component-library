import packageJson from '../../package.json';

const latestVersion = async (packageName) => {
  const response = await fetch(
    'https://registry.npmjs.org/' + packageName + '/latest'
  );
  const json = await response.json();
  return json.version;
};

export const checkPkgVersion = async () => {
  // Skip version check in test environments to avoid async logs after tests complete
  if (
    typeof process !== 'undefined' &&
    (process.env?.NODE_ENV === 'test' || process.env?.JEST_WORKER_ID)
  ) {
    return;
  }
  const version = packageJson.version;
  const packageName = packageJson.name;

  const latest = await latestVersion(packageName);
  // remove rc from version and everything that comes after -rc
  const latestNotRC = latest.replace(/-rc.*/, '');

  // checkif there's a major version difference
  const versionParts = version.split('.');
  const latestParts = latest.split('.');
  if (versionParts[0] !== latestParts[0]) {
    console.warn(
      `The package ${packageName} is out of date. The latest version is ${latestNotRC}. Please update.`
    );
  }
};
