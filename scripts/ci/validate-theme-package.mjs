import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const rootPackage = JSON.parse(readFileSync('package.json', 'utf8'));
const themeName = process.env.THEME_NAME || rootPackage.name;
const finalZip = process.env.FINAL_ZIP || path.join('dist', `${themeName}.zip`);
const resolvedFinalZip = path.resolve(finalZip);

function fail(message) {
    throw new Error(`Theme package validation failed: ${message}`);
}

const zipFiles = readdirSync('dist')
    .filter((filename) => filename.endsWith('.zip'))
    .map((filename) => path.resolve('dist', filename));

if (zipFiles.length !== 1) {
    fail(`expected exactly one ZIP in dist, found ${zipFiles.length}`);
}
if (zipFiles[0] !== resolvedFinalZip) {
    fail(`the only ZIP must be FINAL_ZIP (${finalZip})`);
}

const entries = execFileSync('unzip', ['-Z1', finalZip], {encoding: 'utf8'})
    .split('\n')
    .filter(Boolean);
const sortedEntries = [...entries].sort((left, right) => left.localeCompare(right, 'en'));

if (entries.some((entry, index) => entry !== sortedEntries[index])) {
    fail('ZIP entries are not in deterministic path order');
}

const forbiddenPrefixes = [
    '.github/',
    '.tmp/',
    'assets/css/',
    'assets/js/',
    'dist/',
    'docs/',
    'node_modules/',
    'scripts/',
    'specs/'
];
const forbiddenFiles = new Set([
    '.gitignore',
    '.nvmrc',
    'Makefile',
    'README.md',
    'gulpfile.js',
    'renovate.json',
    'yarn-error.log',
    'yarn.lock'
]);

function isAllowed(entry) {
    if (entry.endsWith('/')) return true;
    if (/^[^/]+\.hbs$/.test(entry)) return true;
    if (/^(partials|members)\/.+\.hbs$/.test(entry)) return true;
    if (entry.startsWith('assets/') && !entry.startsWith('assets/css/') && !entry.startsWith('assets/js/')) return true;
    if (entry.startsWith('locales/')) return true;
    if (['package.json', 'LICENSE', 'ads.txt'].includes(entry)) return true;
    return /^favicon[^/]*\.ico$/.test(entry);
}

for (const entry of entries) {
    if (entry.startsWith('/') || entry.includes('\\') || entry.split('/').includes('..')) {
        fail(`unsafe path in ZIP: ${entry}`);
    }
    if (forbiddenFiles.has(entry) || forbiddenPrefixes.some((prefix) => entry.startsWith(prefix))) {
        fail(`development artifact in ZIP: ${entry}`);
    }
    if (!isAllowed(entry)) {
        fail(`unexpected file in ZIP: ${entry}`);
    }
}

const requiredFiles = [
    'package.json',
    'default.hbs',
    'index.hbs',
    'post.hbs',
    'page.hbs',
    'assets/built/screen.css',
    'assets/built/main.min.js',
    'assets/built/home.min.js',
    'assets/built/post.min.js'
];
for (const requiredFile of requiredFiles) {
    if (!entries.includes(requiredFile)) {
        fail(`missing required file: ${requiredFile}`);
    }
}

const packagedPackage = JSON.parse(execFileSync('unzip', ['-p', finalZip, 'package.json'], {encoding: 'utf8'}));
if (packagedPackage.name !== themeName) {
    fail(`package identity is ${packagedPackage.name}, expected ${themeName}`);
}

const expectedPackage = {...rootPackage, name: themeName};
if (JSON.stringify(packagedPackage) !== JSON.stringify(expectedPackage)) {
    fail('packaged package.json does not match the current source package.json plus candidate identity');
}

execFileSync(path.join('node_modules', '.bin', 'gscan'), ['-z', '--fatal', '--verbose', finalZip], {
    stdio: 'inherit'
});

const checksum = createHash('sha256').update(readFileSync(finalZip)).digest('hex');
console.log(`FINAL_ZIP=${finalZip}`);
console.log(`THEME_NAME=${themeName}`);
console.log(`SHA256=${checksum}`);
