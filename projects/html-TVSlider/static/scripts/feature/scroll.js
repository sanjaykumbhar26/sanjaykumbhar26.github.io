/**
 * Requirements:
 *      - Smooth Scroll <script src="static/vendor/smooth.scroll/index.js"></script>
 *
 *   or if you using RequireJs (see static/scripts/config.js)
 *      - smooth.scroll
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['smooth.scroll'], factory);
    } else {
        factory();
    }
}(this, function () {
}));