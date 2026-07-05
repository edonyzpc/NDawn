var body = $('body');
var timeout;
var st = 0;
var lastSt = 0;
var titleOffset = 0;
var contentOffset = 0;
var progress = $('.sticky-progress');

$(function () {
    'use strict';
    gallery();
    table();
    toc();
});

$(window).on('scroll', function () {
    'use strict';
    if (body.hasClass('post-template')) {
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(sticky);
    }
});

$(window).on('load', function () {
    'use strict';
    if (body.hasClass('post-template')) {
        titleOffset = $('.single-title').offset().top;

        var content = $('.single-content');
        var contentHeight = content.height();
        contentOffset =
            content.offset().top + contentHeight - $(window).height() / 2;
    }
});

function sticky() {
    'use strict';
    st = jQuery(window).scrollTop();

    if (titleOffset > 0 && contentOffset > 0) {
        if (st > lastSt) {
            if (st > titleOffset) {
                body.addClass('sticky-visible');
            }
        } else if (st <= titleOffset) {
            body.removeClass('sticky-visible');
        }
    }

    progress.css(
        'transform',
        'translate3d(' +
        (-100 + Math.min((st * 100) / contentOffset, 100)) +
        '%,0,0)'
    );

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
    if (body.hasClass('post-template') || body.hasClass('page-template')) {
        var tables = $('.single-content').find('.table');
        tables.each(function (_, table) {
            var labels = [];

            $(table)
                .find('thead th')
                .each(function (_, label) {
                    labels.push($(label).text());
                });

            $(table)
                .find('tr')
                .each(function (_, row) {
                    $(row)
                        .find('td')
                        .each(function (index, column) {
                            $(column).attr('data-label', labels[index]);
                        });
                });
        });
    }
}

function toc() {
    'use strict';
    if (body.hasClass('post-template')) {
        var output = '';
        var toggle = $('.sticky-toc-button');

        $('.single-content')
            .find('> h2, > h3')
            .each(function (index, value) {
                var linkClass =
                    $(this).prop('tagName') == 'H3'
                        ? 'sticky-toc-link sticky-toc-link-indented'
                        : 'sticky-toc-link';
                output +=
                    '<a class="' +
                    linkClass +
                    '" href="#' +
                    $(value).attr('id') +
                    '">' +
                    $(value).text() +
                    '</a>';
            });

        if (output == '') {
            toggle.remove();
        }

        $('.sticky-toc').html(output);

        toggle.on('click', function () {
            body.toggleClass('toc-opened');
        });

        $('.sticky-toc-link').on('click', function (e) {
            e.preventDefault();
            var link = $(this).attr('href');

            $('html, body').animate(
                {
                    scrollTop: $('[id="' + link.substring(1) + '"]').offset().top - 82,
                },
                500
            );
        });
    }
}

function pswp(container, element, trigger, caption, isGallery) {
    var parseThumbnailElements = function (el) {
        var items = [],
            gridEl,
            linkEl,
            item;

        $(el)
            .find(element)
            .each(function (i, v) {
                gridEl = $(v);
                linkEl = gridEl.find(trigger);

                item = {
                    src: isGallery
                        ? gridEl.find('img').attr('src')
                        : linkEl.attr('href'),
                    w: 0,
                    h: 0,
                };

                if (caption && gridEl.find(caption).length) {
                    item.title = gridEl.find(caption).html();
                }

                items.push(item);
            });

        return items;
    };

    var openPhotoSwipe = function (index, galleryElement) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        options = {
            closeOnScroll: false,
            history: false,
            index: index,
            shareEl: false,
            showAnimationDuration: 0,
            showHideOpacity: true,
        };

        gallery = new PhotoSwipe(
            pswpElement,
            PhotoSwipeUI_Default,
            items,
            options
        );
        gallery.listen('gettingData', function (index, item) {
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

    var onThumbnailsClick = function (e) {
        e.preventDefault();

        var index = $(e.target)
            .closest(container)
            .find(element)
            .index($(e.target).closest(element));
        var clickedGallery = $(e.target).closest(container);

        openPhotoSwipe(index, clickedGallery[0]);

        return false;
    };

    $(container).on('click', trigger, function (e) {
        onThumbnailsClick(e);
    });
}
