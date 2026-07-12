(function () {
    var queue = [];
    var cursor = 0;

    queue.loaded = true;
    queue.push = function () {
        var requested = Array.from(
            document.querySelectorAll('ins.adsbygoogle[data-ad-requested="true"]')
        );
        var unsettled = requested[cursor];

        if (unsettled) {
            var index = cursor;
            var mode = new URLSearchParams(window.location.search).get('mode');
            cursor += 1;

            window.setTimeout(function () {
                if (mode === 'status-timeout') {
                    return;
                }
                unsettled.setAttribute(
                    'data-ad-status',
                    mode === 'all-unfilled' || index > 0 ? 'unfilled' : 'filled'
                );
            }, 20);
        }

        return requested.length;
    };

    window.adsbygoogle = queue;
}());
