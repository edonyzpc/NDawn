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
