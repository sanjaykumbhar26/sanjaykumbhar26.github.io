$(document).ready(function () {
    /* **** Add Remove Class **** */
    $(".navbar-toggler").on("click", function () {
        $(".navbar-sidebar").toggleClass("show-sidebar");
        $(".navbar-toggler").toggleClass("show-sidebar");
        $("body").toggleClass("show-sidebar");
    });
    /* **** End Add Remove Class **** */

    /* **** Counter ***** */
    $(".counting").each(function () {
        var $this = $(this),
            countTo = $this.attr("data-count");
        $({ countNum: $this.text() }).animate(
            {
                countNum: countTo,
            },
            {
                duration: 3000,
                easing: "linear",
                step: function () {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                    $this.text(this.countNum);
                },
            }
        );
    });
    /* **** End Counter *** */

    /* **** Slider ***** */
    $(".testimonial-slider .single-items").slick({
        arrows: true,
        loop: true,
        dots: false,
        autoplay: false,
        autoplaySpeed: 4500,
        speed: 500,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
    });
    /* ***** End Slider **** */
});
