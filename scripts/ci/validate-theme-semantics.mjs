import {existsSync, readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';

function read(file) {
    return readFileSync(file, 'utf8');
}

function requireText(content, expected, file) {
    if (!content.includes(expected)) {
        throw new Error(`${file} is missing required semantic markup: ${expected}`);
    }
}

function requireCount(content, pattern, expected, file) {
    const count = (content.match(pattern) || []).length;
    if (count !== expected) {
        throw new Error(`${file} expected ${expected} matches for ${pattern}, found ${count}`);
    }
}

const loop = read('partials/loop.hbs');
const featured = read('partials/featured.hbs');
const pagination = read('partials/pagination.hbs');
const header = read('partials/header.hbs');
const ads = read('partials/ads.hbs');
const layout = read('default.hbs');
const cover = read('partials/cover.hbs');
const feedCss = read('assets/css/blog/feed.css');
const basicsCss = read('assets/css/general/basics.css');
const headerInjectCss = read('assets/css/misc/header-inject.css');
const themePackage = JSON.parse(read('package.json'));
const postTemplates = [
    'post.hbs',
    'custom-full-feature-image.hbs',
    'custom-narrow-feature-image.hbs',
    'custom-no-feature-image.hbs'
];

for (const [file, content] of [
    ['partials/loop.hbs', loop],
    ['partials/featured.hbs', featured]
]) {
    requireText(content, 'class="post-title-link" href="{{url}}">{{title}}</a>', file);
    requireText(content, 'class="u-permalink" href="{{url}}" aria-hidden="true" tabindex="-1"', file);
    requireCount(content, /class="u-permalink"/g, 1, file);

    if (content.includes('class="u-permalink" href="{{url}}" aria-label=')) {
        throw new Error(`${file} exposes a duplicate focus/accessibility name for the overlay link`);
    }
}

requireText(pagination, 'class="older-posts" href="{{page_url next}}" aria-label="Older posts"', 'partials/pagination.hbs');
requireText(pagination, 'class="infinite-scroll-status" role="status" aria-live="polite"', 'partials/pagination.hbs');
requireText(pagination, '<button type="button" class="button button-secondary infinite-scroll-button">', 'partials/pagination.hbs');
requireCount(cover, /<h1\b/g, 1, 'partials/cover.hbs');
requireText(cover, '<h1 class="cover-title">{{@site.title}}</h1>', 'partials/cover.hbs');
requireText(loop, '{{#is "home"}}', 'partials/loop.hbs');
requireText(loop, '{{#match @index "<" 5}}', 'partials/loop.hbs');
requireCount(loop, /<p class="feed-excerpt">{{excerpt}}<\/p>/g, 1, 'partials/loop.hbs');
requireText(feedCss, '-webkit-line-clamp: 2;', 'assets/css/blog/feed.css');
requireText(featured, 'fetchpriority="high"', 'partials/featured.hbs');
requireText(featured, 'id="featured-title"', 'partials/featured.hbs');
requireText(featured, 'class="featured-feed owl" id="featured-posts"', 'partials/featured.hbs');

const featuredBranches = featured.match(/{{#if @first}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/);
if (!featuredBranches) {
    throw new Error('partials/featured.hbs must keep explicit first/non-first image branches');
}

for (const expected of ['loading="eager"', 'fetchpriority="high"', 'srcset=']) {
    requireText(featuredBranches[1], expected, 'partials/featured.hbs first image branch');
}

for (const expected of ['class="lazyload u-object-fit"', 'data-srcset=', 'loading="lazy"']) {
    requireText(featuredBranches[2], expected, 'partials/featured.hbs non-first image branch');
}

requireText(header, '<button type="button" class="button-icon burger', 'partials/header.hbs');
requireText(header, 'aria-controls="mobile-menu" aria-expanded="false"', 'partials/header.hbs');
requireText(header, '<nav class="sticky-toc" id="sticky-toc" aria-label="Table of contents"></nav>', 'partials/header.hbs');

if (/<button[^>]*sticky-toc-button[\s\S]*?<a\b/.test(header)) {
    throw new Error('TOC links must not be nested inside the TOC button');
}

requireCount(ads, /<ins class="adsbygoogle"/g, 2, 'partials/ads.hbs');
requireText(ads, 'data-ad-script="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?', 'partials/ads.hbs');

for (const file of postTemplates) {
    requireCount(read(file), /{{> ads}}/g, 1, file);
}

const customTemplateContracts = new Map([
    ['custom-full-feature-image.hbs', '{{> content width="full"}}'],
    ['custom-narrow-feature-image.hbs', '{{> content width="narrow"}}'],
    ['custom-no-feature-image.hbs', '{{> content no_image=true}}']
]);

for (const [file, contentContract] of customTemplateContracts) {
    const content = read(file);
    requireText(content, contentContract, file);
    requireCount(content, /{{> content /g, 1, file);
    requireCount(content, /{{> related}}/g, 1, file);
    requireCount(content, /{{> comments}}/g, 1, file);
}

const contentPartial = read('partials/content.hbs');
requireText(contentPartial, '{{#unless no_image}}', 'partials/content.hbs');
requireText(contentPartial, 'class="single-media kg-width-{{width}}"', 'partials/content.hbs');
requireText(contentPartial, 'alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"', 'partials/content.hbs');

const rootTemplates = readdirSync('.', {withFileTypes: true})
    .filter((entry) => entry.isFile() && entry.name.endsWith('.hbs'))
    .map((entry) => entry.name);
const nestedTemplates = ['partials', 'members']
    .filter((directory) => existsSync(directory))
    .flatMap((directory) =>
        readdirSync(directory, {recursive: true, withFileTypes: true})
            .filter((entry) => entry.isFile() && entry.name.endsWith('.hbs'))
            .map((entry) => path.join(entry.parentPath || entry.path, entry.name))
    );
const forbiddenSeoPatterns = [
    /rel=["']canonical["']/i,
    /<meta[^>]+name=["']description["']/i,
    /<meta[^>]+property=["']og:/i,
    /<meta[^>]+name=["']twitter:/i,
    /application\/ld\+json/i
];

for (const file of [...rootTemplates, ...nestedTemplates]) {
    const content = read(file);
    if (forbiddenSeoPatterns.some((pattern) => pattern.test(content))) {
        throw new Error(`${file} duplicates SEO metadata owned by Ghost ghost_head`);
    }
}

requireCount(layout, /{{ghost_head}}/g, 1, 'default.hbs');
requireCount(layout, /{{ghost_foot}}/g, 1, 'default.hbs');

requireCount(layout, /code\.jquery\.com\/jquery-/g, 1, 'default.hbs');
requireText(layout, '{{#is "home, paged, tag, author"}}', 'default.hbs');
requireText(layout, 'jquery-3.7.1.min.js', 'default.hbs');
requireText(layout, 'integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="', 'default.hbs');
requireText(layout, '<script defer src="{{asset "built/home.min.js"}}"></script>', 'default.hbs');

const homeScope = layout.match(/{{#is "home, paged, tag, author"}}([\s\S]*?){{\/is}}/);
if (!homeScope || !homeScope[1].includes('jquery-3.7.1.min.js') || !homeScope[1].includes('built/home.min.js')) {
    throw new Error('jQuery and home.min.js must remain scoped to home, paged, tag and author views');
}

for (const setting of ['title_font', 'body_font']) {
    const options = themePackage.config?.custom?.[setting]?.options;
    if (JSON.stringify(options) !== JSON.stringify(['Modern sans-serif', 'Elegant serif'])) {
        throw new Error(`package.json ${setting} must expose only Modern sans-serif and Elegant serif`);
    }
}

requireText(layout, '{{#match @custom.title_font "=" "Elegant serif"}}', 'default.hbs');
requireText(layout, '{{#match @custom.body_font "=" "Elegant serif"}}', 'default.hbs');
requireText(layout, 'family=Alike&amp;family=Barlow:', 'default.hbs');
requireText(layout, 'family=Barlow:', 'default.hbs');
requireText(basicsCss, '--font-base: var(--gh-font-body, "Barlow"', 'assets/css/general/basics.css');
requireText(basicsCss, '--font-serif: "Alike"', 'assets/css/general/basics.css');

for (const [file, content] of [
    ['package.json', JSON.stringify(themePackage)],
    ['default.hbs', layout],
    ['assets/css/general/basics.css', basicsCss],
    ['assets/css/misc/header-inject.css', headerInjectCss]
]) {
    if (/LXGW/i.test(content)) {
        throw new Error(`${file} must not retain LXGW options or fallbacks`);
    }
}

if (/body\s*,\s*h1\s*,\s*h2\s*,\s*h3\s*,\s*h4\s*,\s*h5\s*,\s*h6\s*\{[\s\S]*?font-family:[^}]*!important/i.test(headerInjectCss)) {
    throw new Error('header-inject.css must not override body and headings with one forced font');
}

console.log('Theme semantic checks passed');
