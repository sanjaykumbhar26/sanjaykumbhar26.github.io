$(".selectBox").on("click", function (e) {
    $(this).toggleClass("show");
    var dropdownItem = e.target;
    var container = $(this).find(".selectBox__value");
    container.text(dropdownItem.text);
    $(dropdownItem)
        .addClass("active")
        .siblings()
        .removeClass("active");
});

$(".verticalCarousel").verticalCarousel({
    currentItem: 1,
    showItems: 3,
});

jQuery(document).ready(function ($) {

    //  TESTIMONIALS CAROUSEL HOOK
    $('#customers-testimonials').owlCarousel({
        loop: false,
        screenLeft: true,
        startPosition: 1,
        margin: 40,
        navText: ["<img  src='assets/images/arrow-left.svg'>", "<img src='assets/images/arrow-right.svg'>"],
        dots: true,
        autoplay: true,
        autoWidth: false,
        center: true,
        items: 4,
        smartSpeed: 150,
        autoplayTimeout: 9500,
        responsiveClass: true,
        dotsContainer: '#customDots',
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
                items: 4,
                nav: true,
            }
        },
        onInitialized: counter, //When the plugin has initialized.
        onTranslated: counter // When the translation of the stage has finished.

    });

    function counter(event) {
        var element = event.target;         // DOM element, in this example .owl-carousel
        var items = event.item.count;     // Number of items
        var item = event.item.index + 1;     // Position of the current item

        // it loop is true then reset counter from 1
        if (item > items) {
            item = item - items
        }
        $('#hottestSellingCount').html(item + "  " + " of " + "   " + items)
    }


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



$('.owl-carousel2').owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    items: 2,
    nav: false,
});


document.addEventListener("DOMContentLoaded", function () {

    window.addEventListener('scroll', function () {

        if (window.scrollY > 50) {
            document.getElementById('navbar_top').classList.add('fixed-top');
            // add padding top to show content behind navbar
            navbar_height = document.querySelector('.navbar').offsetHeight;
            document.body.style.paddingTop = navbar_height + 'px';
        } else {
            document.getElementById('navbar_top').classList.remove('fixed-top');
            // remove padding top from body
            document.body.style.paddingTop = '0';
        }
    });
});
// DOMContentLoaded  end


