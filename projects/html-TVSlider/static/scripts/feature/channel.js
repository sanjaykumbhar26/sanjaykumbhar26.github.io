/**
 * Requirements:
 *      - JQuery <script src="static/vendor/jquery/dist/jquery.js"></script>
 *
 *   or if you using RequireJs (see static/scripts/config.js)
 *      - jquery
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.$);
    }
}(this, function ($) {
    $(function () {
        var i = 0,
            numberOfImages = 8,
            audio = document.getElementsByTagName('audio')[0];

        // Handle click on next button
        $('.channel-switcher')
            .click(function () {
                audio.play();
                // Increase by one, and restart when we reach the last image
                i = ((i + 1) < numberOfImages) ? i + 1 : 0;
                var position = calculateBackgroundPosition(i);
                $('.channel-switcher').css('backgroundPosition', position);
            })
            .click(function () {
                $('.js-slider').data('AnythingSlider').goForward(); // go forward one slide
            });

        function calculateBackgroundPosition(index) {
            if ($(window).width() >= 1023) {
            return '0 ' + (index * 136 * -1) + 'px';
          } else {
            return '0 ' + (index * 72 * -1) + 'px';
          }
        }
    });
}));
