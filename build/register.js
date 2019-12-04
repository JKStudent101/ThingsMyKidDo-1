var kidsNum = 0;

const Remove_profile = (k_profile_id) => {
	$(k_profile_id).remove();
	kidsNum--;
}

$(document).ready(function () {
	let num = '';
	$('#Family').on('click', function () {
		$('#Register').modal('hide');
		$('#Parent1').modal('show');
	});
	$('#Vendor').on('click', function () {
		$('#Register').modal('hide');
		$('#Business1').modal('show');
	});

	//Parent Modal
	//set "Continue" button id on click to hide 1st modal and trigger 2nd modal
	$('#P-Account').on('click', function () {
		let re = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
		let emre = new RegExp('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-_]+\\.[A-Za-z]{2,}')
		var register = new window.XMLHttpRequest();
		let email = document.getElementById('p_email').value;
		let password = document.getElementById('p_password').value;
		let confirm = document.getElementById('p_confirm_pw').value;
		let data = { email };
		register.open('post', "/checkEmail", false);
		register.setRequestHeader('Content-Type', 'application/json');
		register.send(JSON.stringify(data));
		let response = JSON.parse(register.response);
		// console.log(response)
		let hasErrors = false;
		// console.log(emre.test(email))
		let errorDiv = document.getElementById('p1error');
		if (!emre.test(email)) {
			errorDiv.innerHTML = 'Invalid Email<br>'
			hasErrors = true;
		} else if (response.emailExists) {
			errorDiv.innerHTML = 'Email is already in use<br>';
			hasErrors = true;
		} else if (email.length < 1) {
			errorDiv.innerHTML = 'No email was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('p2error');
		if (password.search(re) === -1) {
			errorDiv.innerHTML = 'Password must be at least 8 characters long, must contain a uppercase letter, lowercase letter, a number and a special character(!@#\\$%\\^&\\*)<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('p3error');
		if (confirm !== password) {
			errorDiv.innerHTML = 'Passwords do not match<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		if (hasErrors) {
			event.preventDefault();
			return false
		} else {
			$('#Parent1').modal('hide');
			$('#Parent2').modal('show');
			var pEmail = $('#p_email').val();
			var pPassword = $('#p_password').val();
			var pPassword2 = $('#p_password2').val();

			$('#Parent_Email').html(pEmail);
		}
	});
	//set "Register" button id on click to load input + hide 2nd modal, and trigger 3rd modal
	$('#P-Redo-Account').on('click', function () {
		$('#Parent2').modal('hide');
		$('#Parent1').modal('show');
	});
	//set "Back" button id on click to hide 3rd modal and trigger 2nd modal
	$('#P-User').on('click', function () {
		$('#Parent2').modal('hide');
		$('#Parent3').modal('show');

		var ParentRole = $('#Guardian').find(':selected').text();
		$('#Parent_Role').html(ParentRole);
	});
	//set "Back" button id on click to hide 2nd modal and trigger 1st modal
	$('#P-Redo-User').on('click', function () {
		$('#Parent3').modal('hide');
		$('#Parent2').modal('show');
	});
	//set "Skip" button id on click to hide 2nd modal and trigger 3rd modal
	$('#P-Skip').on('click', function () {
		$('#Parent3').modal('hide');
		$('#Parent4').modal('show');

		$('#K1_Nickname').html('');
		$('#K1_Gender').html('');
	});

	//set "Register" button id on click to load input + hide 2nd modal, and trigger 3rd modal
	$('#P-Kids').on('click', function () {
		let nickname = document.getElementById("kidname1").value
		let gender = document.getElementById("gender1").value

		if (nickname.length > 0) {

		}
		$('#Parent3').modal('hide');
		$('#Parent4').modal('show');

		var k1_nName = $('#kidname1').val();
		var k1_gender = $('#gender1').val();
		var items = {};

		$('#K1_Nickname').html(k1_nName);
		$('#K1_Gender').html(k1_gender);

	});

	//set "Back" button id on click to hide 3rd modal and trigger 2nd modal
	$('#P-Redo-Kids').on('click', function () {
		$('#Parent4').modal('hide');
		$('#Parent3').modal('show');
	});
	//set "Confirm" button id on click to hide 3rd modal and trigger 4th modal
	// $('#P-Confirm').on('click', function() {
	// 	console.log(num);
	// 	if (num != 'error') {
	// 		$('#Parent4').modal('hide');
	// 		$('#Parent5').modal('show');
	// 	}
	// });

	//

	var count = 1;
	var ChildProfile;

	$('#add').click(function () {

		if (kidsNum > 3) {
			alert("Can only create 5 kid profiles during registartion. \n" +
				"You can create more after finishing registration.");
			return false;
		}

		var new_kid = 'Kid' + count;
		var j_new_kid = '#' + new_kid;

		let selectGender =
			'<select id="gender' +
			count +
			' " class="register-kid' + (count + 1) + ' register-Gender"> <option disabled selected>Select Gender</option> <option>Boy</option> <option>Girl</option> </select>';

		let selectInterests =
			'<select id="Kid-Interests' + count +
			'" class="multiple_select" multiple="multiple" style="height: 2em; width:10em"> {{#each data}} <option>{{name}}</option> {{/each}} </select>'
		/*Hard-code the dropdown checkbox. cannot dynamically use handlebars in append (not enough time)*/

		let delete_profile =
			'<input class="Remove_kid submit1" type="button" value="Remove child" onClick="Remove_profile(\'' + j_new_kid + '\');">'

		input =
			'<br>' +
			'<div class="Add_Kids' + count + '" id="' +
			new_kid +
			'" ><p>MyKid' + (kidsNum + 2) + '<input class="register-kid' +
			(count + 1) +
			' register-kid" name="nickname' +
			count +
			'" id="kidname' +
			count +
			'"placeholder="Nickname">' + ' is a ' +
			selectGender +
			' who is interested in ' +
			selectInterests + delete_profile +
			'</p></div>'


		count++;
		kidsNum++;
		$(this).data('clicked', true);

		$('.allInputs1').append(input);

		/*		' <input class="register-kid' +
					(count + 1) +
					'" name="interest' +
					count +
					'" id="interest' +
					count +
					'"placeholder="Interests">'
		*/

	});

	//Register Modal
	//set "Continue" button id on click to hide 1st modal and trigger 2nd modal
	//$("#B-Register-info").on( "click",  function Summary_Bus());


	$('#P-Confirm').on('click', function () {
		if ($('#Parent_TermCheck').is(':checked')) {
			let pEmail = $('#p_email').val();
			let pPassword = $('#p_password').val();
			let pPassword2 = $('#p_password2').val();
			let pFirstName = $('#p_fName').val();
			let pLastName = $('#p_lName').val();
			var ParentRole = $('#Guardian').find(':selected').text();
			let cName = $('#kidname1').val();
			let cGender = $('#gender1').val();
			let cInterests = []
			let selected = document.querySelectorAll('#Kid-Interests :checked');
			selected.forEach(item => cInterests.push(item.value));

			let ParentAccount = {
				p_email: pEmail,
				p_fname: pFirstName,
				p_lname: pLastName,
				p_pass: pPassword,
				p_pass2: pPassword2,
				p_role: 'parent',
				c_name: cName,
				c_gender: cGender,
				c_interests: cInterests,
				type: 'parent'
			};
			ParentDetail = JSON.stringify(ParentAccount);
			// console.log(ParentAccount);
			$.ajax({
				url: 'registerParent',
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: ParentDetail,
				success: function (result) {
					console.log(result);
				}
			});

			$('#Parent4').modal('hide');
			$('#Parent5').modal('show');

			/*
	//set "Confirm" button id on click to hide 3rd modal and trigger 4th modal
	$('#P-Confirm').on('click', function(){
	 
	if ($("#Parent_TermCheck").is(':checked')){
	/*
		$('#P-Skip').click(function(){
			$(this).data('clicked', true)
		})
		if($('#P-Skip').data('clicked')){
			ChildProfile = {
				'nickname': '',
				'gender': '',
				'interests': []
			};
		} 
	*/

		} else {
			alert('Please argee to our Terms & Conditions.');
			num = 'error';
		}
	});

	$('#B-Register-info').on('click', function () {

		var b_Fname = $('#bus_Fname').val();
		var b_Lname = $('#bus_Lname').val();
		var b_Org = $('#bus_Orgname').val();
		var b_Address = $('#bus_Address').val();
		var b_Phone = $('#bus_Phone').val();
		var b_Email = $('#bus_Email').val();
		var b_Website = $('#bus_Website').val();
		var b_PW = $('#bus_PW').val();
		var b_PWconfirm = $('#bus_PWconfirm').val();
		var error_msg = $('#error').val();
		let re = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})');
		let emre = new RegExp('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-_]+\\.[A-Za-z]{2,}')
		let webre = new RegExp('[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)')
		let phonere = new RegExp('[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\.0-9]*')
		var register = new window.XMLHttpRequest();
		let data = { email: b_Email };
		register.open('post', "/checkEmail", false);
		register.setRequestHeader('Content-Type', 'application/json');
		register.send(JSON.stringify(data));
		let response = JSON.parse(register.response);
		// console.log(response)
		let hasErrors = false;
		let errorDiv = document.getElementById('v1error');
		if (b_Fname.length < 1) {
			errorDiv.innerHTML = 'No first name was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v2error');
		if (b_Lname.length < 1) {
			errorDiv.innerHTML = 'No last name was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v3error');
		if (b_Org.length < 1) {
			errorDiv.innerHTML = 'No organization name was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v4error');
		if (b_Address.length < 1) {
			errorDiv.innerHTML = 'No address was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v5error');
		if (!phonere.test(b_Phone)) {
			errorDiv.innerHTML = 'Invalid phone number<br>'
			hasErrors = true;
		} else if (b_Phone.length < 1) {
			errorDiv.innerHTML = 'No phone number was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v6error');
		if (b_Email.length < 1) {
			errorDiv.innerHTML = 'No email was entered<br>'
			hasErrors = true;
		} else if (!emre.test(b_Email)) {
			errorDiv.innerHTML = 'Invalid email<br>'
			hasErrors = true;
		} else if (response.emailExists) {
			errorDiv.innerHTML = 'Email is already in use<br>';
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v7error');
		if (!webre.test(b_Website)) {
			errorDiv.innerHTML = 'Invalid website url<br>'
			hasErrors = true;
		} else if (b_Website.length < 1) {
			errorDiv.innerHTML = 'No website was entered<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v8error');
		if (b_PW.search(re) === -1) {
			errorDiv.innerHTML = 'Password must be at least 8 characters long, contain a uppercase letter, lowercase letter, a number and a special character(!@#\\$%\\^&\\*)<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		errorDiv = document.getElementById('v9error');
		if (b_PWconfirm !== b_PW) {
			errorDiv.innerHTML = 'Passwords do not match<br>'
			hasErrors = true;
		} else {
			errorDiv.innerHTML = '';
		}
		if (hasErrors) {
			event.preventDefault();
			return false
		} else {
			$('#Business1').modal('hide');
			$('#Business2').modal('show');
			$('#Vendor_Fname').text(b_Fname);
			$('#Vendor_Lname').html(b_Lname);
			$('#Vendor_Org').html(b_Org);
			$('#Vendor_Address').html(b_Address);
			$('#Vendor_Phone').html(b_Phone);
			$('#Vendor_Email').html(b_Email);
			$('#Vendor_Website').html(b_Website);
		}
		// if (message == 'Email already exists. Please choose another') {
		// 	Swal.fire({
		// 		text: 'This event is already in your wishilsit',
		// 		icon: 'error'
		// 	});
		// }

		// if (b_PW != b_PWconfirm) {
		// 	alert('Passwords do not match!');
		// } else {
		// }
	});

	//set "Back" button id on click to hide 2nd modal and trigger 1st modal
	//jquery: .empty() might be redundant
	$('#B-Redo-info').on('click', function () {
		$('#Business2').modal('hide');
		$('#Business1').modal('show');
	});
	//set "Confirm" button id on click to hide 2nd modal and trigger 3rd modal
	$('#B-Confirm-info').on('click', function () {
		if ($('#bus_TermCheck').is(':checked')) {

			Bus_Account = {
				'FirstName': $('#bus_Fname').val(),
				'LastName': $('#bus_Lname').val(),
				'Oraganization': $('#bus_Orgname').val(),
				'PhoneNumber': $('#bus_Phone').val(),
				'BusAddress': $('#bus_Address').val(),
				'EmailAddress': $('#bus_Email').val(),
				'Website': $("#bus_Website").val(),
				"Password1": $("#bus_PW").val(),
				"Password2": $("#bus_PWconfirm").val(),
				'type': 'vendor'
			};
			let Vendor_Account = JSON.stringify(Bus_Account);
			// console.log(Vendor_Account);
			$('#Business2').modal('hide');
			$('#Business3').modal('show');

			// console.log('sending registration')

			$.ajax({
				url: 'registerVendor',
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: Vendor_Account,
				success: async function (result) {
					// console.log('success!')
					// console.log(result)
					if ($("#notificationPreference").is(':checked')) {
						// console.log("saving subscription")
						await openVendorPushSubscription();
					}
				}
			})

		}
		else {
			alert("Please agree to our Terms & Conditions.")
		}
	});

	$("#B-Register-complete").on("click", function () {
		$("#bus_Fname").val("");
		$("#bus_Lname").val("");
		$("#bus_Orgname").val("");
		$("#bus_Address").val("");
		$("#bus_Phone").val("");
		$("#bus_Email").val("");
		$("#bus_Website").val("");
		$("#bus_PW").val("");
		$("#bus_PWconfirm").val("");
		$("#bus_TermCheck").prop('checked', false)
	});


	$(".B-clear").on("click", function () {
		$("#bus_Fname").val("");
		$("#bus_Lname").val("");
		$("#bus_Orgname").val("");
		$("#bus_Address").val("");
		$("#bus_Phone").val("");
		$("#bus_Email").val("");
		$("#bus_Website").val("");
		$("#bus_PW").val("");
		$("#bus_PWconfirm").val("");
		$("#bus_TermCheck").prop('checked', false);
	});

	/*
	$("#P_Register-complete").on("click", function(){
		$("#p_email").val("");
		$("#p_password").val("");
		$("#p_confirm_pw").val("");
		$(".guardian").val("");
		$("#Parent_TermCheck").prop('checked',false);
	});
	*/

	$(".P-clear").on("click", function () {
		$("#p_email").val("");
		$("#p_password").val("");
		$("#p_confirm_pw").val("");
		$(".guardian").val("");
		$("#Parent_TermCheck").prop('checked', false);
		$(".Add_Kids").remove();
	});


	$('#toHome').click(function () {
		$(".P-clear").click();
	});

	$(".multiple_select").mousedown(function (e) {
		if (e.target.tagName == "OPTION") {
			return; //don't close dropdown if i select option
		}
		$(this).toggleClass('multiple_select_active'); //close dropdown if click inside <select> box
	});
	$(".multiple_select").on('blur', function (e) {
		$(this).removeClass('multiple_select_active'); //close dropdown if click outside <select>
	});

	$('.multiple_select option').mousedown(function (e) { //no ctrl to select multiple
		e.preventDefault();
		$(this).prop('selected', $(this).prop('selected') ? false : true); //set selected options on click
		$(this).parent().change(); //trigger change event
	});


	$("#Kid-Interests").on('change', function () {
	/*     var selected = $("#Kid-Interests").val().toString(); //here I get all options and convert to string
		  var document_style = document.documentElement.style;
		  if(selected !== "")
			document_style.setProperty('--text', "'"+selected+"' ");
		  else
			document_style.setProperty('--text', "'Hobbies'");
	*/	});

	async function openVendorPushSubscription() {
		// console.log("pushing subscription")
		if ("serviceWorker" in navigator && "PushManager" in window) {
			let permission = await Notification.requestPermission()
			if (permission != 'denied') {
				let register = await registerServiceWorker();
				let key = await fetch("/api/vapidPublicKey", {
					method: "GET"
				}).then(response => {
					return response.clone().json();
				});
				let applicationServerKey = await urlB64ToUint8Array(key.key);
				PushSubscription = await register.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey
				});
				let SERVER_URL = '/saveSubscription'
				let response = await fetch(SERVER_URL, {
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(PushSubscription),
				})
				response.json().then(res => console.log(res.message))
			} else {
				getInstruction = confirm("Oops! \nIt looks like you blocked us from sending you notifications. \n" +
					"Would you like instructions on how to reset your permissions?")
				if (getInstruction) {
					window.open('https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=en')
				}
			}
		}
	}
})

