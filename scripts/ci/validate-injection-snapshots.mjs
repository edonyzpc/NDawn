import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const snapshots = [
    'specs/001-seo-performance-optimization/evidence/ghost-injection/site-header.html',
    'specs/001-seo-performance-optimization/evidence/ghost-injection/site-footer.html'
];

function read(file) {
    return readFileSync(file, 'utf8');
}

function requireText(content, expected, file) {
    if (!content.includes(expected)) {
        throw new Error(`${file} is missing required injection evidence: ${expected}`);
    }
}

for (const file of snapshots) {
    const content = read(file);
    const scripts = Array.from(content.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g));

    if (!scripts.length) {
        throw new Error(`${file} contains no complete inline script`);
    }

    scripts.forEach((match, index) => {
        if (match[1].trim()) {
            new vm.Script(match[1], {filename: `${file}#inline-${index + 1}`});
        }
    });
}

const header = read(snapshots[0]);
requireText(header, "gtag('config', 'G-GMXX0SWB0S')", snapshots[0]);
requireText(header, 'fonts.googleapis.com/css2?family=Barlow', snapshots[0]);
requireText(header, 'fonts.googleapis.com/css2?family=Alike', snapshots[0]);

const footer = read(snapshots[1]);
requireText(footer, "document.querySelector('pre code[class*=", snapshots[1]);
requireText(footer, 'prism-autoloader.min.js', snapshots[1]);
requireText(footer, 'prism-copy-to-clipboard.min.js', snapshots[1]);
requireText(footer, 'prism-inline-color.min.js', snapshots[1]);
requireText(footer, 'Prism.highlightAll();', snapshots[1]);
requireText(footer, '.catch(function () {});', snapshots[1]);

console.log('Injection snapshot checks passed');
