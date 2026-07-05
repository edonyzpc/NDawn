var html = $('html');
var body = $('body');

$(function () {
    'use strict';
    subMenu();
    burger();
    theme();
});

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
