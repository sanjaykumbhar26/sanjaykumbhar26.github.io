$(document).ready(function () {
    $(".divs main").each(function (e) {
        if (e != 0)
            $(this).hide();
    });
    $("#confirmPage7").click(function () {
        if ($(".divs main:visible").next().length != 0)
            $(".divs main:visible").fadeOut(function () {
                $(this).next().fadeIn();
            });
        else {
            $(".divs div:visible").fadeOut(function () {
                $(".divs main:first").fadeIn();
            });
        }
        return false;
    });
    $("#confirmPage8").click(function () {
        if ($(".divs main:visible").prev().length != 1)
            $(".divs main:visible").fadeOut(function () {
                $(this).prev().fadeIn();
            });
        else {
            $(".divs main:visible").fadeOut(function () {
                $(".divs main:last").fadeIn();
            });
        }
        return false;
    });
});




$('#mobile-number').keyup(function () {

    if ($(this).val() == '') {
        const widthMobile = document.getElementById('widthMobile');
        widthMobile.style.width = "33%";
    } else {
        const widthMobile = document.getElementById('widthMobile');
        widthMobile.style.width = "66%";
    }
});

$('#mobile-password').keyup(function () {

    if ($(this).val() == '') {
        const widthPassword = document.getElementById('widthPassword');
        widthPassword.style.width = "66%";
    } else {
        const widthPassword = document.getElementById('widthPassword');
        widthPassword.style.width = "100%";
    }
});


$(document).ready(function () {

    setTimeout(function () {
        $(".firstOne").addClass("dropin");
    }, 750);

    setTimeout(function () {
        $(".firstTwo").addClass("dropin2");
    }, 1500);

    setTimeout(function () {
        $(".firstThree").addClass("dropin3");
    }, 2250);

    setTimeout(function () {
        $(".firstFour").addClass("dropin4");
    }, 3000);

    setTimeout(function () {
        $(".second-page").addClass("active");
        $(".first-page").addClass("inactive");
    }, 3700);

});


(function () {
    $('.hamburger-menu').on('click', function () {
        $('.bar').toggleClass('animate');
        var mobileNav = $('.mobile-nav');
        mobileNav.toggleClass('hide show');
    })
})();


