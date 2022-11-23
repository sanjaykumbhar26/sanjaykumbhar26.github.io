$(document).ready(function() {
  $.validator.addMethod('zipcode', function(value, element) {
	  return this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
	}, 'Please provide a valid zipcode.');

  $.validator.addMethod('phonenumber', function(value) {
		return /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(value);
	}, 'Please enter a valid phone number.');

	$('#create-account-form-primary').validate({
    rules: {
      'first-name': {
    		required: true,
    	},
      'last-name': {
    		required: true,
    	},
      'business-name': {
    		required: true,
    	},
      'email-address': {
        required: true,
        email: true,
      },
    },
		messages: {
    	'first-name': 'Please enter your first name',
    	'last-name': 'Please enter your last name',
    	'business-name': 'Please enter your business name',
      'email-address': {
        required: 'Please enter your email address',
        email: 'Your email address must be in the format of name@domain.com.'
      },
    },
		submitHandler: function() {
      $('#create-account-section-primary').addClass('d-none');
      $('#restaurant-section').addClass('d-none');

      $('#ca-progress-bar').removeClass('ca-progress-primary').addClass('ca-progress-secondary');
      $('.ca-progress-form').html('2/2');

      $('#create-account-section-secondary').removeClass('d-none');
      $('#commissions-section').removeClass('d-none');
		},
    errorClass: 'form-error',
    errorElement: 'small',
    highlight: function(element) {
      $(element).closest('.form-group').addClass('form-error');
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('form-error');
    },
	});

  $('#create-account-form-secondary').validate({
    rules: {
      'business-address': {
    		required: true,
    	},
      'city': {
    		required: true,
    	},
      'state-province-region': {
    		required: true,
    	},
      'zip-code': {
				required: true,
				zipcode: true,
			},
      'country': {
        required: true,
      },
      'phone-number': {
        required: true,
        phonenumber: true,
      },
    },
		messages: {
    	'business-address': 'Please enter your business address',
    	'city': 'Please enter your city',
    	'state-province-region': 'Please enter your state, province, region',
      'zip-code': {
				required: 'Please enter your zip code',
				zipcode: 'Please enter a valid zip code',
			},
      'country': 'Please enter your country',
      'phone-number': {
				required: 'Please enter your phone number',
				zipcode: 'Please enter a valid phone number',
			},
    },
		submitHandler: function(form) {
      $('#menudrive-account').addClass('d-none');
      $('#congratulations-box, #create-account-process').removeClass('d-none');

      setTimeout(function(){
        createAccountProcess();
        $('#create-account-process').addClass('d-none');
        $('#create-account-success').removeClass('d-none');
      }, 2000);

      return false;
		},
    errorClass: 'form-error',
    errorElement: 'small',
    highlight: function(element) {
      $(element).closest('.form-group').addClass('form-error');
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('form-error');
    },
	});

  $('#create-account-back').on('click', function() {
    $('#create-account-section-primary').removeClass('d-none');
    $('#restaurant-section').removeClass('d-none');

    $('#ca-progress-bar').removeClass('ca-progress-secondary').addClass('ca-progress-primary');
    $('.ca-progress-form').html('1/2');

    $('#create-account-section-secondary').addClass('d-none');
    $('#commissions-section').addClass('d-none');
	});

  $('#all-set').on('click', function() {
    history('merchant-login.html');
	});

  function createAccountProcess() {
    const primaryForm = $('#create-account-form-primary').serializeArray();
    const secondaryForm = $('#create-account-form-secondary').serializeArray();

    const account = formsToJson(primaryForm, secondaryForm);
    addAccount(account);

    $('#create-account-form-primary').trigger('reset');
    $('#create-account-form-secondary').trigger('reset');
  }
});
