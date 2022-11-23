/**
 * Requirements:
 *      - JQuery <script src="static/vendor/jquery/dist/jquery.js"></script>
 *      - AnythingSlider  <script src="static/vendor/anythingslider/js/jquery.anythingslider.js"></script>
 *      - AnythingSliderFX  <script src="static/vendor/anythingslider/js/jquery.anythingslider.fx.js"></script>
 *
 *   or if you using RequireJs (see static/scripts/config.js)
 *      - jquery
 *      - anythingslider
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'anythingslider', 'anythingslider-video'], factory);
    } else {
        factory(root.$);
    }
}(this, function ($) {
    $(function () {
        if ($(window).width() >= 300) {
            var $slider = $('.js-slider');
            $slider
                .anythingSlider({
                    mode: 'vertical',
                    expand: true,
                    resizeContents: true,
                    buildArrows: false,
                    buildNavigation: false,
                    buildStartStop: false,
                    autoPlay: false,
                    animationTime: 100,
                    hashTags: false,

                    // Auto play standard video
                    onInitialized: function (e, slider) {
                        playVideo(slider);
                    },
                    onSlideInit: function (e, slider) {
                        var vid = slider.$lastPage.find('video');
                        if (vid.length && typeof(vid[0].pause) !== 'undefined') {
                            vid[0].pause();
                        }
                    },
                    onSlideComplete: function (slider) {
                        playVideo(slider);
                    },
                    isVideoPlaying: function (slider) {
                        var vid = slider.$currentPage.find('video');
                        return (vid.length && typeof(vid[0].pause) !== 'undefined' && !vid[0].paused && !vid[0].ended);
                    }
                }).anythingSliderVideo({
                    resumeOnVideoEnd: true,
                    resumeOnVisible: true,
                    youtubeAutoLoad: true,
                    youtubeParams: {
                        autohide: 1,
                        controls: 0,
                        disablekb: 1,
                        modestbranding: 1,
                        showsearch: 0,
                        showinfo: 0,
                        iv_load_policy: 3,
                        loop: 1,
                        playlist: getYoutubeId($slider)
                    }
                });
        }

        function playVideo(slider) {
            var vid = slider.$currentPage.find('video');
            if (vid.length) {
                vid[0].currentTime = 0;
                vid[0].play();
            }
        }

        function getYoutubeId($slider) {
            var result = [];
            $slider.find('iframe[src*=youtu]:eq(0)').each(function(){
                var id = youtubeParser($(this).attr('src'));
                if (id) {
                    result.push(id);
                }
            });
            return result.join(',');
        }

        function youtubeParser(url) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[7].length == 11) {
                return match[7];
            }
            return null;
        }
    });
}));
