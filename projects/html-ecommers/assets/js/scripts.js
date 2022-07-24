

/*------------------------------------------------------
/  01. owlcarousel Section
/------------------------------------------------------*/
$('#owl-carousel-slider').owlCarousel({
    loop: true,
    navigation: true,
    navText: ["<img src='assets/images/arrow-left.svg'>", "<img src='assets/images/arrow-right.svg'>"],
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 1,
            nav: false,
        },
        1025: {
            items: 1
        }
    }
})

/*------------------------------------------------------
/  02. owlcarousel Section
/------------------------------------------------------*/


$('#favorites-slider').owlCarousel({
    loop: true,
    navigation: true,
    navText: ["<img src='assets/images/arrow-left.svg'>", "<img src='assets/images/arrow-right.svg'>"],
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
        },
        600: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
})


/*------------------------------------------------------
/  03 owlcarousel Section
/------------------------------------------------------*/

$('#browseProductsSection-slider').owlCarousel({
    loop: true,
    navigation: true,
    navText: ["<img src='assets/images/back.svg'>", "<img src='assets/images/forward.svg'>"],
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 2,
            nav: false,
        },
        600: {
            items: 3
        },
        1000: {
            items: 4
        }
    }
})


/*--------------------------------------------------------
   / 04. Mobile Menu
   /---------------------------------------------------------*/
var $menuToggler = $('.menuToggler');
$('.mainMenu ul li.menu-item-has-children > a').on('click', function (e) {
    e.preventDefault();
    $(this).siblings('ul').slideToggle();
    $(this).siblings('.megaMenu').slideToggle();
    $(this).parents('li').toggleClass('active')
});
$menuToggler.on('click', function (e) {
    e.preventDefault();
    $('.mainMenu').slideToggle();
    $(this).toggleClass('active');
});

/*--------------------------------------------------------
/ 5. Preloader
/----------------------------------------------------------*/
$(window).load(function () {
    if ($(".preloader").length > 0) {
        $(".preloader").delay(500).fadeOut("slow");
    }
});