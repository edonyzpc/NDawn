var html = $('html');
var body = $('body');
var timeout;
var st = 0;
var lastSt = 0;
var titleOffset = 0;
var contentOffset = 0;
var progress = $('.sticky-progress');

$(function () {
    'use strict';
    subMenu();
    //whiteLogo();
    //whiteIcon();
    featured();
    pagination();
    table();
    toc();
    modal();
    burger();
    theme();
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
        } else {
            if (st <= titleOffset) {
                body.removeClass('sticky-visible');
            }
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

function subMenu() {
    'use strict';
    var mainNav = $('.main-nav');
    var separator = mainNav.find('.menu-item[href*="..."]');

    if (separator.length) {
        separator.nextAll('.menu-item').wrapAll('<div class="sub-menu" />');
        separator.replaceWith(
            '<button class="button-icon menu-item-button menu-item-more" aria-label="More"><svg class="icon"><use xlink:href="#dots-horizontal"></use></svg></button>'
        );

        var toggle = mainNav.find('.menu-item-more');
        var subMenu = $('.sub-menu');
        toggle.append(subMenu);

        toggle.on('click', function () {
            if (!subMenu.is(':visible')) {
                subMenu.show().addClass('animate__animated animate__bounceIn');
            } else {
                subMenu.addClass('animate__animated animate__zoomOut');
            }
        });

        subMenu.on('animationend', function (e) {
            subMenu.removeClass(
                'animate__animated animate__bounceIn animate__zoomOut'
            );
            if (e.originalEvent.animationName == 'zoomOut') {
                subMenu.hide();
            }
        });
    }
}

/*
function whiteLogo() {
    'use strict';
    if (typeof gh_white_logo != 'undefined') {
        var whiteImage =
            '<img class="logo-image white" src="' + gh_white_logo + '">';
        $('.logo').prepend(whiteImage);
    }
}

function whiteIcon() {
    'use strict';
    if (typeof gh_white_icon != 'undefined') {
        var whiteImage =
            '<img class="cover-icon-image white" src="' + gh_white_icon + '">';
        $('.cover-icon').prepend(whiteImage);
    }
}
*/

function featured() {
    'use strict';
    $('.featured-feed').owlCarousel({
        dots: false,
        margin: 30,
        nav: true,
        navText: [
            '<svg class="icon"><use xlink:href="#chevron-left"></use></svg>',
            '<svg class="icon"><use xlink:href="#chevron-right"></use></svg>',
        ],
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            992: {
                items: 3,
            },
        },
    });
}

function pagination() {
    'use strict';
    var wrapper = $('.post-feed');

    if (body.hasClass('paged-next')) {
        wrapper.infiniteScroll({
            append: '.feed',
            button: '.infinite-scroll-button',
            debug: false,
            hideNav: '.pagination',
            history: false,
            path: '.pagination .older-posts',
            scrollThreshold: false,
            status: '.infinite-scroll-status',
        });
    }

    wrapper.on('append.infiniteScroll', function (
        event,
        response,
        path,
        items
    ) {
        $(items[0]).addClass('feed-paged');
    });
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

function modal() {
    'use strict';
    var modalOverlay = $('.modal-overlay');
    var modal = $('.modal');
    var modalInput = $('.modal-input');

    $('.js-modal').on('click', function (e) {
        e.preventDefault();
        modalOverlay.show().outerWidth();
        body.addClass('modal-opened');
        modalInput.focus();
    });

    $('.modal-close, .modal-overlay').on('click', function () {
        body.removeClass('modal-opened');
    });

    modal.on('click', function (e) {
        e.stopPropagation();
    });

    $(document).keyup(function (e) {
        if (e.keyCode === 27 && body.hasClass('modal-opened')) {
            body.removeClass('modal-opened');
        }
    });

    modalOverlay.on('transitionend', function (e) {
        if (!body.hasClass('modal-opened')) {
            modalOverlay.hide();
        }
    });

    modal.on('transitionend', function (e) {
        e.stopPropagation();
    });
}

function burger() {
    'use strict';
    $('.burger').on('click', function () {
        body.toggleClass('menu-opened');
    });
}

function theme() {
    'use strict';
    var toggle = $('.js-theme');
    var toggleText = toggle.find('.theme-text');

    function system() {
        // check system dark mode and set the same mode for the theme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            dark();
        } else {
            light();
        }
        toggleText.text(toggle.attr('data-system'));
    }

    function dark() {
        html.removeClass('theme-light').addClass('theme-dark');
        localStorage.setItem('dawn_theme', 'dark');
        toggleText.text(toggle.attr('data-dark'));
    }

    function light() {
        html.removeClass('theme-dark').addClass('theme-light');
        localStorage.setItem('dawn_theme', 'light');
        toggleText.text(toggle.attr('data-light'));
    }

    switch (localStorage.getItem('dawn_theme')) {
        case 'dark':
            dark();
            break;
        case 'light':
            light();
            break;
        default:
            system();
            break;
    }

    toggle.on('click', function (e) {
        e.preventDefault();

        if (!html.hasClass('theme-dark') && !html.hasClass('theme-light')) {
            system();
        } else if (html.hasClass('theme-dark')) {
            light();
        } else {
            dark();
        }
    });
}
