/*------------------------------------------------------------------
jQuery document ready
-------------------------------------------------------------------*/
$(document).ready(function () {
	"use strict";

		/* Simple Slider */
		var simplesliders = [];
		var simpleslider = [];
		$('.slider-init').each(function(index, element){

			var paginationtype = $(this).attr("data-paginationtype");
			var spacebetweenitems = $(this).data("spacebetweenitems");
			var itemsperview = $(this).data("itemsperview");
			$(this).addClass('s'+index);
			$(this).prev().children(".page__title-right").children(".swiper-button-next").addClass('swiper-button-next'+index);
			$(this).prev().children(".page__title-right").children(".swiper-button-prev").addClass('swiper-button-prev'+index);
			$(this).children(".swiper-pagination").addClass('swiper-pagination'+index);
			simpleslider[index] = new Swiper('.s'+index, {
				direction: 'vertical',
				effect: 'slide',
				slidesPerView: itemsperview,
				spaceBetween: spacebetweenitems,
				pagination: {
				el: '.swiper-pagination'+index,
				type: paginationtype,
				},
				navigation: {
					nextEl: '.swiper-button-next'+index,
					prevEl: '.swiper-button-prev'+index
				}

				});
			simplesliders.push(simpleslider[index]);
		});

		/* Thumb Slider */
		var thumbsliders = [];
		var thumbslider = [];
		$('.slider-thumb-init').each(function(index, element){

			var paginationtype = $(this).attr("data-paginationtype");
			var spacebetweenitems = $(this).data("spacebetweenitems");
			var itemsperview = $(this).data("itemsperview");
			$(this).addClass('t'+index);
			$(this).children(".swiper-button-next").addClass('swiper-button-next'+index);
			$(this).children(".swiper-button-prev").addClass('swiper-button-prev'+index);
			$(this).children(".swiper-pagination").addClass('swiper-pagination'+index);
			thumbslider[index] = new Swiper('.t'+index, {
				direction: 'horizontal',
				effect: 'slide',
				slidesPerView: itemsperview,
				spaceBetween: spacebetweenitems,
				pagination: {
				el: '.swiper-pagination'+index,
				type: paginationtype,
				},
				navigation: {
					nextEl: '.swiper-button-next'+index,
					prevEl: '.swiper-button-prev'+index
				}

				});
			thumbsliders.push(thumbslider[index]);
		});


});
