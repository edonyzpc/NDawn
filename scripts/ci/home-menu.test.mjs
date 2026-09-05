import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const main = readFileSync('assets/js/main.js', 'utf8');
const home = readFileSync('assets/js/home.js', 'utf8');

function element(attributes = {}) {
    const classes = new Set();
    return {
        attributes,
        events: {},
        focused: false,
        classList: {
            contains: (name) => classes.has(name),
            toggle(name, enabled) {
                if (enabled) classes.add(name);
                else classes.delete(name);
            }
        },
        getAttribute(name) { return this.attributes[name]; },
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(name, callback) { this.events[name] = callback; },
        focus() { this.focused = true; }
    };
}

for (const page of ['home', 'paged', 'tag', 'author']) {
    for (const hasNext of [false, true]) {
        test(`${page}: menu click/Escape and pagination (next=${hasNext})`, () => {
            const body = element();
            body.classList.toggle(`${page}-template`, true);
            body.classList.toggle('paged-next', hasNext);
            const toggle = element({'aria-controls': 'mobile-menu', 'aria-expanded': 'false'});
            const menu = element({'aria-hidden': 'true'});
            const document = element();
            document.body = body;
            document.documentElement = element();
            document.querySelector = (selector) => selector === '.burger' ? toggle : null;
            document.getElementById = (id) => id === 'mobile-menu' ? menu : null;

            const ready = [];
            let paginationOptions;
            const wrappedBody = {hasClass: (name) => body.classList.contains(name)};
            const carousel = {
                on() { return this; },
                owlCarousel() { return this; },
                each() { return this; }
            };
            const feed = {
                on() { return this; },
                infiniteScroll(options) { paginationOptions = options; }
            };
            function jquery(selector) {
                if (typeof selector === 'function') return ready.push(selector);
                if (selector === 'body') return wrappedBody;
                if (selector === '.featured-feed') return carousel;
                if (selector === '.post-feed') return feed;
                throw new Error(`Unexpected jQuery selector: ${selector}`);
            }

            // Classic deferred scripts share a global scope on all four listing views.
            const context = vm.createContext({document, $: jquery});
            vm.runInContext(main, context, {filename: 'assets/js/main.js'});
            vm.runInContext(home, context, {filename: 'assets/js/home.js'});
            document.events.DOMContentLoaded();
            ready.forEach((callback) => callback());

            function assertMenu(open) {
                assert.equal(body.classList.contains('menu-opened'), open);
                assert.equal(toggle.getAttribute('aria-expanded'), String(open));
                assert.equal(menu.getAttribute('aria-hidden'), String(!open));
            }

            assertMenu(false);
            toggle.events.click();
            assertMenu(true);
            toggle.events.click();
            assertMenu(false);
            toggle.events.click();
            document.events.keydown({key: 'Escape'});
            assertMenu(false);
            assert.equal(toggle.focused, true);
            assert.equal(context.body, body, 'home script must not replace the native DOM body');
            assert.equal(Boolean(paginationOptions), hasNext);
            if (hasNext) {
                assert.equal(paginationOptions.path, '.pagination .older-posts');
                assert.equal(paginationOptions.button, '.infinite-scroll-button');
                assert.equal(paginationOptions.scrollThreshold, false);
            }
        });
    }
}
