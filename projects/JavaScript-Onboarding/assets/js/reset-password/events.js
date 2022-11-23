$(document).ready(function () {
	$('#reset-password-form').validate({
		rules: {
			'email': {
				required: true,
				email: true,
			},
		},
		messages: {
			'email': {
				required: 'Please enter your email address',
				email: 'Your email address must be in the format of name@domain.com.'
			},
		},
		submitHandler: function () {
			try {
				withResetPassword();
			} catch (e) {
				console.log(e);
			}
		},
		errorClass: 'form-error',
		errorElement: 'small',
		highlight: function (element) {
			$(element).closest('.form-group').addClass('form-error');
		},
		unhighlight: function (element) {
			$(element).closest('.form-group').removeClass('form-error');
		},
	});

	$('#reset-password-back').on('click', function() {
    history('merchant-login.html');
	});

	function withResetPassword() {
		const email = $('#email').val();

		if (exploreAccount(email)) {
			$('#reset-password-section').addClass('d-none');
			$('#reset-password-success').removeClass('d-none');
		} else {
			alert("Menudrive didn't found that email address.");
		}
	}
});
