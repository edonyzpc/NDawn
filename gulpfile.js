const {series, parallel, watch, src, dest} = require('gulp');
const pump = require('pump');

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

function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!docs', '!docs/**',
            '!assets/css', '!assets/css/**',
            '!assets/js', '!assets/js/**',
            '!Makefile',
            '!README.md',
            '!renovate.json',
            '!yarn.lock',
            '!yarn-error.log'
        ]),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}

const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', 'members/**/*.hbs'], hbs);
const cssWatcher = () => watch('assets/css/**/*.css', css);
const jsWatcher = () => watch('assets/js/**/*.js', js);
const watcher = parallel(hbsWatcher, cssWatcher, jsWatcher);
const build = series(css, js);

exports.build = build;
exports.lint = lint;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);
