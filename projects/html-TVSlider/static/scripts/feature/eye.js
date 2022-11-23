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
    $('.eye-wrapper').click(function () {
        var $item = $(this);
        if ($item.hasClass('active')) {
            $item.removeClass('active');
            $('.wrapper-info').fadeOut('slow');
        } else {
            $item.addClass('active');
            $('.wrapper-info').fadeIn('slow');
        }
    });

}));