

AOS.init({
    easing: 'ease-out-back',
    duration: 1000,
    // disable: 'mobile'
    disable: function () {
        var maxWidth = 1280;
        return window.innerWidth < maxWidth;
    }
});



window.onscroll = function () {
    // show or hide the back-top-top button
    var backToTo = document.querySelector(".scroll-top");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 0) {
        backToTo.style.display = "block";
    } else {
        backToTo.style.display = "none";
    }
};


$(".owl-carousel").owlCarousel({
    items: 1,
    nav: false,
    dots: true,
    autoplay: true,
    mouseDrag: true,
    touchDrag: true,
});


