

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


$('#owl-carousel-product').owlCarousel({
    loop: true,
    navigation: false,
    margin: 10,
    dots: true,
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
});


/*------------------------------------------------------
/ heart icon 
/------------------------------------------------------*/

$(document).ready(function () {
    $(".like-icon").click(function () {
        var ele = $(this);
        // ele is the element you clicked on
        if ($(ele).hasClass("liked")) {
            $(ele).html("<img src='assets/images/heart.svg'>");
            $(ele).removeClass("liked");
        } else {
            $(ele).html("<lottie-player  class='lottie-heart-icon' src='assets/js/aniamtion-icon.json' background='transparent' speed='1' style='width: 90px; height: 90px;'loop autoplay></lottie-player>");
            $(ele).addClass("liked");
        }
    });
});


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


/*------------------------------------------------------
/  radion button 
/------------------------------------------------------*/
$(document).ready(function () {
    var check = $("#cd-card").prop("checked");
    if (check) {
        $("#credit-debit-card").addClass("activeTab");
    }

    $("#cd-card").on("click", function () {
        check = $(this).prop("checked");
        $("#credit-debit-card").addClass("activeTab");
    })

    $("#knet").on("click", function () {
        check = $(this).prop("checked");
        $("#credit-debit-card").removeClass("activeTab");
    })

});


/*--------------------------------------------------------
/ 6. form header
/----------------------------------------------------------*/

$('#email1, .input-fill').keyup(function () {
    if ($(this).val() == '') {
        jQuery('#button,.button-fill').addClass('btn-info');
        jQuery('#button,.button-fill').removeClass('btn-secondary');
    } else {
        jQuery('#button,.button-fill').addClass('btn-secondary');
        jQuery('#button,.button-fill').removeClass('btn-info');
    }
});

$('.button-submit').click(function () {
    jQuery('.email-block, .header-text, .createAccount').addClass('d-none');
    jQuery('.header-text-d-none').removeClass('header-text-d-none');
    $(".button-submit").text('Sign In');
});

window.onload = function () {
    const togglePassword = document.querySelector('#togglePassword');
    const togglePasswordnew = document.querySelector('#togglePasswordnew');
    const password = document.querySelector('#id_password');
    const passwordNew = document.querySelector('#id_passwordnew');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    togglePasswordnew.addEventListener('click', function () {
        // toggle the type attribute

        const typenew = passwordNew.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordNew.setAttribute('type', typenew);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}

/*------------------------------------------------------
  02. Nice Selects
//------------------------------------------------------*/
$(document).ready(function () {
    $('select:not(.ignore)').niceSelect();
});

var html = ["demo"];
$('#color_select option').each(function (i) {
    console.log('demo');
    html.push('<div' + $(this).val() + '>' + $(this).text() + '</div>');
});


/*--------------------------------------------------------
    / 19. Sticky Header
/---------------------------------------------------------*/
$(window).on('scroll', function () {
    var heights = $(window).height();
    if ($(window).scrollTop() > heights) {
        $(".isSticky").addClass('fixedHeader animated slideInDown');
    } else {
        $(".isSticky").removeClass('fixedHeader animated slideInDown');
    }
});


/*--------------------------------------------------------
    / 19. hamburger-menu
/---------------------------------------------------------*/
(function () {
    $('.hamburger-menu').on('click', function () {

        $('.bar').toggleClass('animate');
        var mobileNav = $('.mobile-nav');
        var mobileBody = $('body');
        mobileNav.toggleClass('hide show');
        mobileBody.toggleClass('stop-scroll');
    })
})();


/*--------------------------------------------------------
    / 19. account-menu
/---------------------------------------------------------*/
(function () {
    $('.account-menu').on('click', function () {
        $('.bar2').toggleClass('animate');
        var mobileBody = $('body');
        var mobileNav = $('.account-mobile-nav');
        mobileNav.toggleClass('hide show');
        mobileBody.toggleClass('stop-scroll');
    })
})();


/*------------------------------------------------------
/  sp-wrap
/------------------------------------------------------*/

$('.sp-wrap').smoothproducts();

/*------------------------------------------------------
/  openCart
/------------------------------------------------------*/

function openCart() {
    document.getElementById("Cart").style.display = "block";
    document.body.classList.add('stop-scroll');
}
function closeCart() {
    document.getElementById("Cart").style.display = "none";
    document.body.classList.remove('stop-scroll');
}


