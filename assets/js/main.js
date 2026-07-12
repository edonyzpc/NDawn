var html = document.documentElement;
var body = document.body;

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    subMenu();
    burger();
    theme();
});

function subMenu() {
    'use strict';
    var mainNav = document.querySelector('.main-nav');
    if (!mainNav) {
        return;
    }

    var separator = mainNav.querySelector('.menu-item[href*="..."]');
    if (!separator) {
        return;
    }

    var subMenu = document.createElement('div');
    subMenu.className = 'sub-menu';
    subMenu.id = 'main-more-menu';

    var next = separator.nextElementSibling;
    while (next) {
        var current = next;
        next = next.nextElementSibling;

        if (current.classList.contains('menu-item')) {
            subMenu.appendChild(current);
        }
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'menu-item-more';

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'button-icon menu-item-button';
    toggle.setAttribute('aria-label', 'More');
    toggle.setAttribute('aria-controls', subMenu.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.innerHTML =
        '<svg class="icon"><use xlink:href="#dots-horizontal"></use></svg>';

    wrapper.appendChild(toggle);
    wrapper.appendChild(subMenu);

    separator.replaceWith(wrapper);

    function openSubMenu() {
        subMenu.style.display = 'block';
        subMenu.classList.remove('animate__zoomOut');
        subMenu.classList.add('animate__animated', 'animate__bounceIn');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closeSubMenu(animate) {
        toggle.setAttribute('aria-expanded', 'false');
        subMenu.classList.remove('animate__bounceIn');

        if (animate && subMenu.style.display !== 'none') {
            subMenu.classList.add('animate__animated', 'animate__zoomOut');
        } else {
            subMenu.classList.remove('animate__animated', 'animate__zoomOut');
            subMenu.style.display = 'none';
        }
    }

    toggle.addEventListener('click', function (event) {
        event.stopPropagation();

        if (toggle.getAttribute('aria-expanded') === 'true') {
            closeSubMenu(true);
        } else {
            openSubMenu();
        }
    });

    subMenu.addEventListener('animationend', function (event) {
        if (event.target !== subMenu) {
            return;
        }

        subMenu.classList.remove(
            'animate__animated',
            'animate__bounceIn',
            'animate__zoomOut'
        );

        if (event.animationName === 'zoomOut') {
            subMenu.style.display = 'none';
        }
    });

    document.addEventListener('click', function (event) {
        if (!wrapper.contains(event.target)) {
            closeSubMenu(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (
            event.key === 'Escape' &&
            toggle.getAttribute('aria-expanded') === 'true'
        ) {
            closeSubMenu(false);
            toggle.focus();
        }
    });

    subMenu.style.display = 'none';
}

function burger() {
    'use strict';
    var toggle = document.querySelector('.burger');
    if (!toggle) {
        return;
    }

    var menu = document.getElementById(toggle.getAttribute('aria-controls'));

    function setOpen(isOpen) {
        body.classList.toggle('menu-opened', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (menu) {
            menu.setAttribute('aria-hidden', String(!isOpen));
        }
    }

    toggle.addEventListener('click', function () {
        setOpen(!body.classList.contains('menu-opened'));
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && body.classList.contains('menu-opened')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

function theme() {
    'use strict';
    var toggle = document.querySelector('.js-theme');
    if (!toggle) {
        return;
    }

    var toggleText = toggle.querySelector('.theme-text');

    function setText(value) {
        if (toggleText) {
            toggleText.textContent = value || '';
        }
    }

    function setStoredTheme(value) {
        try {
            window.localStorage.setItem('dawn_theme', value);
        } catch (error) {
            return null;
        }
        return value;
    }

    function getStoredTheme() {
        try {
            return window.localStorage.getItem('dawn_theme');
        } catch (error) {
            return null;
        }
    }

    function system() {
        html.classList.remove('theme-dark', 'theme-light');
        setStoredTheme('system');
        setText(toggle.getAttribute('data-system'));
    }

    function dark() {
        html.classList.remove('theme-light');
        html.classList.add('theme-dark');
        setStoredTheme('dark');
        setText(toggle.getAttribute('data-dark'));
    }

    function light() {
        html.classList.remove('theme-dark');
        html.classList.add('theme-light');
        setStoredTheme('light');
        setText(toggle.getAttribute('data-light'));
    }

    var storedTheme = getStoredTheme();

    switch (storedTheme) {
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

    toggle.addEventListener('click', function (event) {
        event.preventDefault();

        if (html.classList.contains('theme-dark')) {
            light();
        } else if (html.classList.contains('theme-light')) {
            system();
        } else {
            dark();
        }
    });
}
