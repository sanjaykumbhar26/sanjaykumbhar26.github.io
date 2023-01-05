$(document).ready(function() {
 
  // $("#owl-example").owlCarousel({
  //       navigation: false, 
  //       touchDrag: true,
  //       slideSpeed : 1300,
  //       paginationSpeed : 400,
  //       singleItem: true,
  //       pagination: false,
  //       rewindSpeed: 500
  // });
  
  
   var slider = tns({
    container: '.my-slider',
    items: 1,
    autoHeight: true,
    nav: false,
    loop: true,
    slideBy: 'page',
    swipeAngle: false, // tried everything here but same issue occurs
    navigation: false, 
    mouseDrag: true,
    controls: false,
     arrowKeys: true,
     axis: 'vertical',
     controlsContainer: "#customize-controls",
    // autoplay: true,
    lazyload: true,
     speed: 1200,
    responsive: {
      700: {
        controls: false,
      },
      900: {
        controls: true,
      
      }
    }
   });
 
});


$ = function(id) {
  return document.getElementById(id);
}

var show = function(id) {
	$(id).style.display ='flex';
}
var hide = function(id) {
	$(id).style.display ='none';
}


