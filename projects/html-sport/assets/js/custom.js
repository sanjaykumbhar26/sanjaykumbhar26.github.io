
jQuery(document).ready(function ($) {

    //  TESTIMONIALS CAROUSEL HOOK
    $('#customers-testimonials').owlCarousel({
        loop: true,
        margin: 0,
        navText: ["<img  src='assets/img/left.png'>", "<img src='assets/img/right.png'>"],
        dots: false,
        autoplay: true,
        center: true,
        items: 5,
        smartSpeed: 150,
        autoplayTimeout: 8500,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            768: {
                items: 3,
                nav: true
            },
            1170: {
                items: 5,
                nav: true,


            }
        },

    });
    $(".owl-prev").hover(
        function () {
            $(this).addClass("active");
        },
        function () {
            $(this).removeClass("active");
        }
    );
    $(".owl-next").hover(
        function () {
            $(this).addClass("active");
        },
        function () {
            $(this).removeClass("active");
        }
    );

});


$("#accordion").on("hide.bs.collapse show.bs.collapse", e => {
    $(e.target)
        .prev()
        .find("i:last-child")
        .toggleClass("fa-minus fa-plus");
});


/*! Main */
jQuery(document).ready(function ($) {

    // Fixa navbar ao ultrapassa-lo
    var navbar = $('#navbar-main'),
        distance = navbar.offset().top,
        $window = $(window);

    $window.scroll(function () {
        if ($window.scrollTop() >= distance) {
            navbar.removeClass('fixed-top').addClass('fixed-top');
            $("body").css("padding-top", "92px");
        } else {
            navbar.removeClass('fixed-top');
            $("body").css("padding-top", "0px");
        }
    });
});


wow = new WOW(
    {
        animateClass: 'animated',
        offset: 100
    }
);
wow.init();


$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('#navbar-main').addClass('header-fixed');
    } else {
        $('#navbar-main').removeClass('header-fixed');
    }
});