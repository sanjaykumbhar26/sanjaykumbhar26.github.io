jQuery(function(){
    jQuery("a.video-pop").YouTubePopUp();
});

// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 100
        }, 100, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });



  $(document).ready(function(){ 
    $(window).scroll(function(){ 
        if ($(this).scrollTop() > 600) { 
            $('#back-to-top').fadeIn(); 
        } else { 
            $('#back-to-top').fadeOut(); 
        } 
    }); 
   
});


// $('.counter-count').each(function () {
//   $(this).prop('Counter',0).animate({
//       Counter: $(this).text()
//   }, {
//       duration: 2000,
//       easing: 'swing',
//       step: function (now) {
//           $(this).text(Math.ceil(now));
//       }
//   });
// });



var isAlreadyRun = false;

$(window).scroll( function(){

    $('.counter-show').each( function(i){

        var bottom_of_object = $(this).position().top + $(this).outerHeight() / 2;
        var bottom_of_window = $(window).scrollTop() + $(window).height();


            if( bottom_of_window > ( bottom_of_object + 20 )  ){
				if (!isAlreadyRun) {
					$('.counter-count').each(function () {
	            	
	                $(this).prop('Counter', 0).animate({
	                    Counter: $(this).text()
	                }, {
	                        duration: 2000,
	                        easing: 'swing',
	                        step: function (now) {
	                            $(this).text(Math.ceil(now));
	                        }
	                    });
	            	});
				}
                isAlreadyRun = true;
            }
    }); 

});




//*
$(".pt-bar-phl").on('click','div',function(){
  // remove classname 'active' from all li who already has classname 'active'
  $(".pt-bar-phl div.active").removeClass("active"); 
  // adding classname 'active' to current click li 
  $(this).addClass("active"); 
  $active_item = $(this).attr('id');
  $('.ptimeline-data').hide(); 
  $('.'+$active_item).show(); 
});
//*


//*
$(".rental-manager-progress-bar-container").on('click','div',function(){
  // remove classname 'active' from all li who already has classname 'active'
  $(".rental-manager-progress-bar-container div.active").removeClass("active"); 
  // adding classname 'active' to current click li 
  $(this).addClass("active"); 
  $active_item = $(this).attr('id');
  $('.timeline-data').hide(); 
  $('.'+$active_item).show(); 

});
//*


// (function(){
//   var words = [
//       'team',
//       'wealth',
//       'business',
//       'potential',
//       'legacy'
//       ], i = 0;
//   setInterval(function(){
//       $('#change-word').fadeOut(function(){
//           $(this).html(words[i=(i+1)%words.length]).fadeIn();
//       });
//   }, 3000);
      
// })();


$("#typed").typed({
  strings: [ 'team',
  'wealth',
  'business',
  'potential',
  'legacy'],
  typeSpeed: 100,
  startDelay: 0,
  backSpeed: 60,
  backDelay: 2000,
  loop: true,
  cursorChar: "",
  contentType: 'html'
});



$(document).ready(function (e){
  $("#frmContact").on('submit',(function(e){
    e.preventDefault();
    $("#mail-status").hide();
    $('#send-message').hide();
    $('#loader-icon').show();
    $.ajax({
      url: "contact.php",
      type: "POST",
      dataType:'json',
      data: {
      "name":$('input[name="fname"]').val(),
      "email":$('input[name="email"]').val(),
      "phone":$('input[name="phone"]').val(),
      "content":$('textarea[name="content"]').val(),
      "g-recaptcha-response":$('textarea[id="g-recaptcha-response"]').val()},				
      success: function(response){
      $("#mail-status").show();
      $('#loader-icon').hide();
      if(response.type == "error") {
        $('#send-message').show();
        $("#mail-status").attr("class","error");				
      } else if(response.type == "message"){
        $('#send-message').hide();
        $("#mail-status").attr("class","success");							
      }
      $("#mail-status").html(response.text);	
      },
      error: function(){} 
    });
  }));
	




});








$('#standout-2').on('hidden.bs.modal', function() { 
  // reset multi-tab modal to initial state 
  $('.po_def_text').show();
  $('#standout-2 .tab-content').hide();

}) ;



$('#standout-2 .nav-tabs .nav-item').click(function(){
  // reset multi-tab modal to initial state 
  $('.po_def_text').hide();
  $('#standout-2 .tab-content').show();
  

}) ;


