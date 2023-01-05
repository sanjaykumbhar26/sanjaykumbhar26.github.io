$(document).ready(function () {
    $(".divs main").each(function (e) {
        if (e != 0)
            $(this).hide();
    });
     $("#confirmPage6").click(function () {
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


// $(document).ready(function () {
//    setTimeout(function () {
//         $(".second-page").addClass("active");
//     }, 2000);
// });


