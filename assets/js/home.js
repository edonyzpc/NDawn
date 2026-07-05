var body = $('body');

$(function () {
    'use strict';
    featured();
    pagination();
});

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
