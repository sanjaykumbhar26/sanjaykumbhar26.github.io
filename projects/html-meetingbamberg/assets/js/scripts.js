
  AOS.init({
    easing: 'ease-out-back',
    duration: 1000,
    disable: function () {
        var maxWidth = 1280;
        return window.innerWidth < maxWidth;
      }
  });

  $(document).ready(function () {
    $('.center').slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    
  ],
    });
  });

$('.center').on('init', function(event, slick){
        AOS.init({
            easing: 'ease-out-back',
            duration: 1000
        });
});


$(function () {
    $('#datepicker').datetimepicker({
        format: 'YYYY-MM-DD',
        locale: 'de',
        defaultDate: new Date('2015-09-01'),
       // disabledDates: [ moment("2015-12-25")]
    });
	});
   
  