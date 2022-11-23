$(document).ready(function () {
	$('#merchant-login-form').validate({
		rules: {
			'email': {
				required: true,
				email: true,
			},
			'password': {
				required: true,
			},
		},
		messages: {
			'email': {
				required: 'Please enter your email address',
				email: 'Your email address must be in the format of name@domain.com.'
			},
			'password': 'Please enter your password',
		},
		submitHandler: function () {
			try {
				withLogin();
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

	function withLogin() {
		const formFields = $('#merchant-login-form').serializeArray();
		const user = formToJson(formFields);

		if (user) {
			const {
				email,
				password
			} = user;
			if (email === 'test@gmail.com' && password === 'test') {
				history('home-onboarding.html');
			} else {
				alert('Access denied.');
			}
		} else {
			alert('Something went wrong!');
		}
	}
});
