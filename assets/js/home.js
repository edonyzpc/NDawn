$(function () {
    'use strict';
    featured();
    pagination();
});

function featured() {
    'use strict';
    var carousel = $('.featured-feed');

    function labelControls() {
        var controls = $(this).find('.owl-nav button');

        controls.removeAttr('role');
        controls.eq(0).attr({
            'aria-label': 'Previous featured posts',
            'aria-controls': 'featured-posts',
        });
        controls.eq(1).attr({
            'aria-label': 'Next featured posts',
            'aria-controls': 'featured-posts',
        });
    }

    carousel.on('initialized.owl.carousel refreshed.owl.carousel', labelControls);

    carousel.owlCarousel({
        dots: false,
        margin: 30,
        nav: true,
        navElement: 'button type="button"',
        navText: [
            '<svg class="icon" aria-hidden="true"><use xlink:href="#chevron-left"></use></svg>',
            '<svg class="icon" aria-hidden="true"><use xlink:href="#chevron-right"></use></svg>',
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
    carousel.each(labelControls);
}

function pagination() {
    'use strict';
    var body = $('body');
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
