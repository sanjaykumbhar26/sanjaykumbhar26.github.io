$('.modal-toggle').on('click', () => {
    $('.modal').toggleClass('is-visible');
});

$(window).click(function () {
    vimeoWrap = $('#vimeoWrap');
    vimeoWrap.html(vimeoWrap.html());
});

$('.modal-close').click(function () {
    vimeoWrap = $('#vimeoWrap');
    vimeoWrap.html(vimeoWrap.html());
});

$(function(){
    $("a.video-pop").YouTubePopUp();
});



AOS.init({
	easing: 'ease-out-back',
	duration: 1000,
	// disable: 'mobile'
    disable: function() {
        var maxWidth = 1380;
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

        // show or hide the back-top-top button
        // var backToBo = document.querySelector(".scroll-bottom");
        // if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 0) {
        //     backToBo.style.display = "none";
        // } else {
        //     backToBo.style.display = "block";
        // }



};
