$(document).ready(function () {
	restaurantInfoDialog();

	$('#restaurant-info-form').validate({
		rules: {
			'online-orders': {
				required: true,
			},
			'restaurant-type': {
				required: true,
			},
			'total-locations': {
				required: true,
			},
			'pos-use': {
				required: true,
			},
		},
		messages: {
			'online-orders': 'Please select',
			'restaurant-type': 'Please select',
			'total-locations': 'Please select',
			'pos-use': 'Please select',
		},
		errorPlacement: function (error, element) {
			if ($(element).is('select')) {
				element.next().after(error);
			} else {
				error.insertAfter(element);
			}
		},
		submitHandler: function () {
      const formFields = $('#restaurant-info-form').serializeArray();
  		const restaurantInfo = formToJson(formFields);

      saveRestaurantInfo(restaurantInfo);
      dismissRestaurantInfoDialog('saved');

      $('#restaurant-info-form').trigger('reset');
      $('#restaurant-info-dialog').modal('hide');
		},
	});

	$('.restaurant-info-dialog-close').on('click', function () {
		dismissRestaurantInfoDialog('dismissed');
	});

	$('#online-orders, #restaurant-type, #total-locations, #pos-use').on('change', function () {
		$(this).valid();
	});

  $('.steps').on('click', function () {
		const step = $(this).attr('id');
		const exception = $(this).data('exception');
		const section = `#${step}-section`;
		const stepIcon = `#${step} .step-icon`;

		$('.steps').removeClass('active');

		$('.step-icon').each(function(index) {
		  $(this).text(index + 1);
		});

		if (exception) {
			$(`#${exception}`).addClass('active');
			$(`#${exception} .step-icon`).text('✔');
		} else {
			$(this).addClass('active');
			$(stepIcon).text('✔');
		}


		$('.sections').addClass('d-none');
    $(section).removeClass('d-none');
	});

  $('#account-setup').on('click', function () {
		const status = $(this).data('status');
    if (status === 'close') {
      $('#account-tour').addClass('d-none');
      $(this).data('status', 'expand');
      $(this).attr('src', 'assets/images/icon/icn-expand.svg');

    } else {
      $('#account-tour').removeClass('d-none');
      $(this).data('status', 'close');
      $(this).attr('src', 'assets/images/icon/close-black.svg');
    }
		$('#ordering-service').toggleClass('down');
	});

	function restaurantInfoDialog() {
    const status = hasRestaurantInfo();
		if (!status) {
			$('#restaurant-info-dialog').modal('show');
		}
	}
});
