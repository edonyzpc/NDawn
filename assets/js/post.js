var body = document.body;
var timeout;
var st = 0;
var lastSt = 0;
var titleOffset = 0;
var contentOffset = 0;
var progress = document.querySelector('.sticky-progress');

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    gallery();
    table();
    toc();
    ads();
});

window.addEventListener('scroll', function () {
    'use strict';
    if (body.classList.contains('post-template')) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(sticky);
    }
});

window.addEventListener('load', function () {
    'use strict';
    if (body.classList.contains('post-template')) {
        var title = document.querySelector('.single-title');
        var content = document.querySelector('.single-content');

        if (!title || !content) {
            return;
        }

        titleOffset = title.getBoundingClientRect().top + window.scrollY;
        contentOffset =
            content.getBoundingClientRect().top +
            window.scrollY +
            content.offsetHeight -
            window.innerHeight / 2;
    }
});

function sticky() {
    'use strict';
    st = window.scrollY || document.documentElement.scrollTop;

    if (titleOffset > 0 && contentOffset > 0) {
        if (st > lastSt) {
            if (st > titleOffset) {
                body.classList.add('sticky-visible');
            }
        } else if (st <= titleOffset) {
            body.classList.remove('sticky-visible');
        }
    }

    if (progress && contentOffset > 0) {
        progress.style.transform =
            'translate3d(' +
            (-100 + Math.min((st * 100) / contentOffset, 100)) +
            '%,0,0)';
    }

    lastSt = st;
}

function gallery() {
    'use strict';
    pswp(
        '.kg-gallery-container',
        '.kg-gallery-image',
        '.kg-gallery-image',
        false,
        true
    );
}

function table() {
    'use strict';
    if (
        !body.classList.contains('post-template') &&
        !body.classList.contains('page-template')
    ) {
        return;
    }

    document.querySelectorAll('.single-content .table').forEach(function (table) {
        var labels = Array.from(table.querySelectorAll('thead th')).map(
            function (label) {
                return label.textContent;
            }
        );

        table.querySelectorAll('tr').forEach(function (row) {
            row.querySelectorAll('td').forEach(function (column, index) {
                column.setAttribute('data-label', labels[index] || '');
            });
        });
    });
}

function toc() {
    'use strict';
    if (!body.classList.contains('post-template')) {
        return;
    }

    var stickyToc = document.querySelector('.sticky-toc');
    var toggle = document.querySelector('.sticky-toc-button');
    var headings = document.querySelectorAll('.single-content > h2, .single-content > h3');

    if (!stickyToc || !toggle) {
        return;
    }

    headings.forEach(function (heading) {
        if (!heading.id) {
            return;
        }

        var link = document.createElement('a');
        link.className =
            heading.tagName === 'H3'
                ? 'sticky-toc-link sticky-toc-link-indented'
                : 'sticky-toc-link';
        link.href = '#' + encodeURIComponent(heading.id);
        link.setAttribute('data-target-id', heading.id);
        link.textContent = heading.textContent;
        stickyToc.appendChild(link);
    });

    if (!stickyToc.children.length) {
        toggle.remove();
        stickyToc.remove();
        return;
    }

    toggle.addEventListener('click', function () {
        var isOpen = body.classList.toggle('toc-opened');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    stickyToc.addEventListener('click', function (event) {
        var link = event.target.closest('.sticky-toc-link');
        if (!link) {
            return;
        }

        var targetId = link.getAttribute('data-target-id');
        var target = targetId ? document.getElementById(targetId) : null;
        if (!target) {
            return;
        }

        event.preventDefault();
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 82,
            behavior: 'smooth'
        });
        body.classList.remove('toc-opened');
        toggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && body.classList.contains('toc-opened')) {
            body.classList.remove('toc-opened');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
}

function ads() {
    'use strict';
    document.querySelectorAll('.post-ads').forEach(function (container) {
        setupAds(container);
    });
}

function setupAds(container) {
    'use strict';
    if (container.getAttribute('data-ads-state')) {
        return;
    }

    var slots = Array.from(container.querySelectorAll('ins.adsbygoogle'));
    if (!slots.length) {
        return;
    }

    var started = false;
    var retries = 0;
    var observer;
    var statusTimer;
    var statusObserver;
    var statusTimeout = Number(container.getAttribute('data-ad-status-timeout')) || 15000;
    var nextFrame =
        window.requestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 16);
        };

    function setState(state, reason) {
        container.setAttribute('data-ads-state', state);
        if (reason) {
            container.setAttribute('data-ads-reason', reason);
        } else {
            container.removeAttribute('data-ads-reason');
        }
    }

    function cleanupViewportTriggers() {
        if (observer) {
            observer.disconnect();
        }
        window.removeEventListener('scroll', maybeStart);
        window.removeEventListener('resize', maybeStart);
    }

    function cleanupStatusObservation() {
        window.clearTimeout(statusTimer);
        if (statusObserver) {
            statusObserver.disconnect();
            statusObserver = null;
        }
    }

    function fail(reason) {
        cleanupStatusObservation();
        started = false;
        retries += 1;
        setState(retries <= 1 ? 'retry-wait' : 'failed', reason);

        if (retries <= 1) {
            window.setTimeout(maybeStart, 1000);
            return;
        }

        cleanupViewportTriggers();
        container.classList.add('is-failed');
    }

    function updateSlotStatus() {
        var filled = 0;
        var unfilled = 0;

        slots.forEach(function (slot) {
            var status = slot.getAttribute('data-ad-status');
            var parent = slot.closest('.post-ad');

            if (status === 'filled') {
                filled += 1;
                if (parent) {
                    parent.classList.remove('is-unfilled');
                }
            } else if (status === 'unfilled') {
                unfilled += 1;
                if (parent) {
                    parent.classList.add('is-unfilled');
                }
            }
        });

        if (filled + unfilled !== slots.length) {
            if (filled > 0) {
                setState('partially-rendered');
            }
            return;
        }

        cleanupStatusObservation();
        if (filled === 0) {
            container.classList.add('is-empty');
            setState('unfilled');
        } else {
            setState('rendered');
        }
    }

    function settleStatusTimeout() {
        var rendered = 0;
        var collapsed = 0;

        cleanupStatusObservation();
        slots.forEach(function (slot) {
            var status = slot.getAttribute('data-ad-status');
            var parent = slot.closest('.post-ad');
            var hasFrame = Boolean(slot.querySelector('iframe'));

            if (status === 'filled' || (!status && hasFrame)) {
                rendered += 1;
                if (parent) {
                    parent.classList.remove('is-unfilled');
                }
            } else {
                collapsed += 1;
                if (parent) {
                    parent.classList.add('is-unfilled');
                }
            }
        });

        if (rendered === 0) {
            container.classList.add('is-empty');
            setState('unfilled', 'status-timeout');
        } else if (collapsed > 0) {
            setState('rendered-partial', 'status-timeout-fallback');
        } else {
            setState('rendered', 'status-timeout-fallback');
        }
    }

    function observeSlotStatus() {
        if (typeof window.MutationObserver === 'function') {
            statusObserver = new MutationObserver(updateSlotStatus);
            slots.forEach(function (slot) {
                statusObserver.observe(slot, {
                    attributes: true,
                    attributeFilter: ['data-ad-status']
                });
            });
        }

        statusTimer = window.setTimeout(function () {
            var state = container.getAttribute('data-ads-state');
            if (state === 'requested' || state === 'partially-rendered') {
                settleStatusTimeout();
            }
        }, statusTimeout);

        updateSlotStatus();
    }

    function requestAds() {
        window.adsbygoogle = window.adsbygoogle || [];
        var requestFailed = false;

        slots.forEach(function (slot) {
            if (slot.getAttribute('data-ad-requested') === 'true') {
                return;
            }

            try {
                slot.setAttribute('data-ad-requested', 'true');
                window.adsbygoogle.push({});
            } catch (error) {
                slot.removeAttribute('data-ad-requested');
                requestFailed = true;
            }
        });

        if (requestFailed) {
            fail('request-error');
            return;
        }

        cleanupViewportTriggers();
        setState('requested');
        observeSlotStatus();
    }

    function loadAdScript() {
        var scriptSrc = container.getAttribute('data-ad-script');
        if (!scriptSrc) {
            fail('missing-script');
            return;
        }

        var script = document.querySelector('script[src="' + scriptSrc + '"]');
        if (
            script &&
            (script._ndawnAdsLoaded === true ||
                (window.adsbygoogle && window.adsbygoogle.loaded))
        ) {
            requestAds();
            return;
        }

        var created = false;
        if (!script) {
            created = true;
            script = document.createElement('script');
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.src = scriptSrc;
        }

        var settled = false;
        var scriptTimer = window.setTimeout(function () {
            if (settled) {
                return;
            }
            settled = true;
            if (created) {
                script.remove();
            }
            fail('script-timeout');
        }, 8000);

        script.addEventListener(
            'load',
            function () {
                if (settled) {
                    return;
                }
                settled = true;
                window.clearTimeout(scriptTimer);
                script._ndawnAdsLoaded = true;
                requestAds();
            },
            {once: true}
        );
        script.addEventListener(
            'error',
            function () {
                if (settled) {
                    return;
                }
                settled = true;
                window.clearTimeout(scriptTimer);
                if (created) {
                    script.remove();
                }
                fail('script-error');
            },
            {once: true}
        );

        if (created) {
            document.head.appendChild(script);
        }
    }

    function waitForLayout(attempt) {
        nextFrame(function () {
            var hasLayout = slots.every(function (slot) {
                var rect = slot.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            });

            if (hasLayout) {
                loadAdScript();
            } else if (attempt < 12) {
                waitForLayout(attempt + 1);
            } else {
                fail('zero-sized-slot');
            }
        });
    }

    function start() {
        if (started) {
            return;
        }
        started = true;
        setState('laying-out');
        container.classList.add('is-layout-ready');

        // Make content visible, then wait at least one rendered frame before
        // checking slot geometry and requesting an ad.
        nextFrame(function () {
            waitForLayout(0);
        });
    }

    function maybeStart() {
        if (started) {
            return;
        }
        var rect = container.getBoundingClientRect();
        var distance = Math.max(window.innerHeight * 1.75, 800);
        if (rect.top <= window.innerHeight + distance && rect.bottom >= -distance) {
            start();
        }
    }

    setState('observing');
    window.addEventListener('scroll', maybeStart, {passive: true});
    window.addEventListener('resize', maybeStart);

    if (typeof window.IntersectionObserver === 'function') {
        var distance = Math.max(window.innerHeight * 1.75, 800);
        observer = new IntersectionObserver(
            function (entries) {
                if (
                    entries.some(function (entry) {
                        return entry.isIntersecting;
                    })
                ) {
                    start();
                }
            },
            {rootMargin: distance + 'px 0px'}
        );
        observer.observe(container);
    }

    // Covers already-near content and fast scroll before the observer callback.
    maybeStart();
}

function pswp(container, element, trigger, caption, isGallery) {
    if (!window.PhotoSwipe || !window.PhotoSwipeUI_Default) {
        return;
    }

    var parseThumbnailElements = function (galleryElement) {
        return Array.from(galleryElement.querySelectorAll(element)).map(
            function (gridEl) {
                var linkEl = gridEl.querySelector(trigger);
                var img = gridEl.querySelector('img');
                var item = {
                    src: isGallery && img ? img.currentSrc || img.src : linkEl ? linkEl.href : '',
                    w: 0,
                    h: 0
                };

                if (caption) {
                    var captionEl = gridEl.querySelector(caption);
                    if (captionEl) {
                        item.title = captionEl.innerHTML;
                    }
                }

                return item;
            }
        );
    };

    var openPhotoSwipe = function (index, galleryElement) {
        var pswpElement = document.querySelector('.pswp');
        if (!pswpElement) {
            return;
        }

        var items = parseThumbnailElements(galleryElement);
        var options = {
            closeOnScroll: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true
        };

        var gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
        );
        gallery.listen('gettingData', function (_, item) {
            if (item.w < 1 || item.h < 1) {
                var img = new Image();
                img.onload = function () {
                    item.w = this.width;
                    item.h = this.height;
                    gallery.updateSize(true);
                };
                img.src = item.src;
            }
        });
        gallery.init();
    };

    document.querySelectorAll(container).forEach(function (galleryElement) {
        galleryElement.addEventListener('click', function (event) {
            var target = event.target.closest(trigger);
            if (!target || !galleryElement.contains(target)) {
                return;
            }

            var itemElement = event.target.closest(element);
            if (!itemElement) {
                return;
            }

            event.preventDefault();

            var items = Array.from(galleryElement.querySelectorAll(element));
            openPhotoSwipe(items.indexOf(itemElement), galleryElement);
        });
    });
}
