// The lockfile is created on macOS, so a Linux install (Choreo's React
// build uses node:22-alpine) does not include the native bindings Docusaurus
// Faster needs. Install the matching libc build before `docusaurus build`.
const {execSync} = require('node:child_process');
const fs = require('node:fs');

if (process.platform !== 'linux') {
  process.exit(0);
}

function libcFamily() {
  try {
    if (fs.readdirSync('/lib').some((name) => name.startsWith('ld-musl-'))) {
      return 'musl';
    }
  } catch {
    // /lib is absent; the glibc package names are the fallback.
  }
  return 'gnu';
}

const arch = process.arch;
const libc = libcFamily();
const specs = [
  ['@rspack/binding', `@rspack/binding-linux-${arch}-${libc}`],
  ['@swc/core', `@swc/core-linux-${arch}-${libc}`],
  ['@swc/html', `@swc/html-linux-${arch}-${libc}`],
  ['lightningcss', `lightningcss-linux-${arch}-${libc}`],
];

const missing = specs.flatMap(([parent, name]) => {
  try {
    require.resolve(name);
    return [];
  } catch {
    const version = require(`${parent}/package.json`).optionalDependencies[name];
    if (!version) {
      throw new Error(`No optional dependency ${name} on ${parent}`);
    }
    return [`${name}@${version}`];
  }
});

if (missing.length === 0) {
  process.exit(0);
}

execSync(`npm install --no-save --no-package-lock ${missing.join(' ')}`, {
  stdio: 'inherit',
});
