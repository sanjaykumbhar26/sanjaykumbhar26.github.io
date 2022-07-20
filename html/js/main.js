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