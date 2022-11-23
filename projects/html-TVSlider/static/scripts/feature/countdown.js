/**
 * Requirements:
 *      - JQuery <script src="static/vendor/jquery/dist/jquery.js"></script>
 *      - JQuery Countdown  <script src="static/vendor/jquery.countdown/dist/jquery.countdown.js"></script>
 *
 *   or if you using RequireJs (see static/scripts/config.js)
 *      - jquery
 *      - jquery.countdown
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jquery.countdown'], factory);
    } else {
        factory(root.$);
    }
}(this, function ($) {
    $(function () {
        var $countdown = $('.js-countdown'),
            time = $countdown.data('time');

        if (time) {
            $countdown
                .countdown(time)
                .on('update.countdown', function (event) {
                    var format = '<span>%-D</span>day%!D <span>%-H</span>hour%!H <span>%-M</span>minute%!M <span>%-S</span>second%!S';
                    $(this).html(event.strftime(format));
                });
        }
    });
}));