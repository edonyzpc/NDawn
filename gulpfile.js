const {series, parallel, watch, src, dest} = require('gulp');
const pump = require('pump');
const fs = require('fs');
const path = require('path');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const gulpStylelint = require('gulp-stylelint');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper');
const zip = require('gulp-zip');

// postcss plugins
const easyimport = require('postcss-easy-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const rootPackage = require('./package.json');
const themeName = process.env.THEME_NAME || rootPackage.name;
const packageStage = path.join('.tmp', 'theme-package');
const packageDist = 'dist';
const packageFilename = `${themeName}.zip`;
const packageTimestamp = new Date('2000-01-01T00:00:00.000Z');
const packageFiles = [
    '*.hbs',
    'partials/**/*.hbs',
    'members/**/*.hbs',
    'assets/**',
    '!assets/css/**',
    '!assets/js/**',
    'locales/**',
    'package.json',
    'LICENSE',
    'ads.txt',
    'favicon*.ico'
];

function serve(done) {
    livereload.listen();
    done();
}

function handleError(done) {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', 'partials/**/*.hbs', 'members/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    pump([
        src('assets/css/screen.css', {sourcemaps: true}),
        postcss([
            easyimport,
            autoprefixer(),
            cssnano()
        ]),
        dest('assets/built/', {sourcemaps: '.', mode: 0o644}),
        livereload()
    ], handleError(done));
}

function jsBundle(filename, files) {
    return function bundle(done) {
        pump([
            src(files, {sourcemaps: true}),
            concat(filename),
            uglify(),
            dest('assets/built/', {sourcemaps: '.', mode: 0o644}),
            livereload()
        ], handleError(done));
    };
}

const jsMain = jsBundle('main.min.js', [
    'assets/js/lib/lazysizes.min.js',
    'assets/js/main.js'
]);

const jsHome = jsBundle('home.min.js', [
    'assets/js/lib/owl.carousel.min.js',
    'assets/js/lib/infinite-scroll.pkgd.min.js',
    'assets/js/home.js'
]);

const jsPost = jsBundle('post.min.js', [
    'assets/js/lib/photoswipe.min.js',
    'assets/js/lib/photoswipe-ui-default.min.js',
    'assets/js/post.js'
]);

const js = parallel(jsMain, jsHome, jsPost);

function lint(done) {
    pump([
        src(['assets/css/**/*.css', '!assets/css/vendor/*']),
        gulpStylelint({
            fix: true,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }),
        dest('assets/css/')
    ], handleError(done));
}

function cleanPackage(done) {
    fs.rmSync(packageStage, {recursive: true, force: true});
    fs.mkdirSync(packageDist, {recursive: true});
    fs.readdirSync(packageDist)
        .filter((filename) => filename.endsWith('.zip'))
        .forEach((filename) => fs.rmSync(path.join(packageDist, filename), {force: true}));
    done();
}

function stagePackage(done) {
    pump([
        src(packageFiles, {base: '.', allowEmpty: true, nodir: true}),
        dest(packageStage)
    ], handleError(done));
}

function setPackageIdentity(done) {
    const stagedPackagePath = path.join(packageStage, 'package.json');
    const stagedPackage = JSON.parse(fs.readFileSync(stagedPackagePath, 'utf8'));
    stagedPackage.name = themeName;
    fs.writeFileSync(stagedPackagePath, `${JSON.stringify(stagedPackage, null, 4)}\n`);
    done();
}

function normalizePackageTimestamps(done) {
    function normalize(directory) {
        fs.readdirSync(directory, {withFileTypes: true}).forEach((entry) => {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                normalize(entryPath);
            } else if (entry.isFile()) {
                fs.utimesSync(entryPath, packageTimestamp, packageTimestamp);
            }
        });
    }

    normalize(packageStage);
    done();
}

function listPackageFiles(directory = packageStage, prefix = '') {
    return fs
        .readdirSync(directory, {withFileTypes: true})
        .sort((left, right) => left.name.localeCompare(right.name, 'en'))
        .flatMap((entry) => {
            const relativePath = path.posix.join(prefix, entry.name);
            const entryPath = path.join(directory, entry.name);
            return entry.isDirectory()
                ? listPackageFiles(entryPath, relativePath)
                : [relativePath];
        });
}

function zipper(done) {
    const files = listPackageFiles().map((file) => path.join(packageStage, file));

    pump([
        src(files, {base: packageStage, dot: true, nodir: true}),
        zip(packageFilename),
        dest(packageDist)
    ], handleError(done));
}

function cleanPackageStage(done) {
    fs.rmSync(packageStage, {recursive: true, force: true});
    done();
}

const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', 'members/**/*.hbs'], hbs);
const cssWatcher = () => watch('assets/css/**/*.css', css);
const jsWatcher = () => watch('assets/js/**/*.js', js);
const watcher = parallel(hbsWatcher, cssWatcher, jsWatcher);
const build = series(css, js);

exports.build = build;
exports.lint = lint;
exports.zip = series(
    build,
    cleanPackage,
    stagePackage,
    setPackageIdentity,
    normalizePackageTimestamps,
    zipper,
    cleanPackageStage
);
exports.default = series(build, serve, watcher);
