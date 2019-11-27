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
		$('#Parent1').modal('hide');
		$('#Parent2').modal('show');
		var pEmail = $('#p_email').val();
		var pPassword = $('#p_password').val();
		var pPassword2 = $('#p_password2').val();

		$('#Parent_Email').html(pEmail);

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

		if (kidsNum > 4) {
			alert("Can only create 5 kid profiles during registartion. \n" +
				"You can create more after finishing registration.");
			return false;
		}

		var new_kid = 'Kid' + count;
		var j_new_kid = '#' + new_kid;

		let selectGender =
			'<select id="gender' +
			count +
			' " class="register-kid' + (count + 1) + '"> <option>Boy</option> <option>Girl</option> </select>';

		let selectInterests =
			'<select id="Kid-Interests' + count +
			'" class="multiple_select" multiple="multiple">'

		let kidTags = document.getElementsByClassName('kid-tag');
		for (let i = 0; i < kidTags.length; i++) {
			selectInterests += `<option>${kidTags[i].value}</option>`
		}
		selectInterests += '</select>'
		/*Hard-code the dropdown checkbox. cannot dynamically use handlebars in append (not enough time)*/

		let delete_profile =
			'<input class="Remove_kid" type="button" value="Remove child' + count + '" onClick="Remove_profile(\'' + j_new_kid + '\');">'

	// 	input = `<div class="Add_Kids1">
	// 	<p>Kid ${kidsNum + 1}
	// 		<input class="register-kid1" placeholder="Nickname" id="kidname${count}"
	// 			name="nickname1">
	// 		is a
	// 		<span class="form-group">
	// 			<select id="gender${count}" class="register-kid1">
	// 				<option>Boy</option>
	// 				<option>Girl</option>
	// 			</select>
	// 		</span>
	// 		who is interested in
	// 		<span>
	// 				${selectInterests}
	// 		</span>
	// 		${delete_profile}
	// 	</p>
	// </div>`
			input ='<div class="Add_Kids' + count + '" id="' +
			new_kid +
			'" ><p>Kid' + (kidsNum + 1) + ' <input class="register-kid' +
			(count + 1) +
			'" name="nickname' +
			count +
			'" id="kidname' +
			count +
			'"placeholder="Nickname">' + ' is a ' +
			selectGender +
			' who is interested in ' +
			'<span>' + selectInterests + '</span><br>' + delete_profile +
			'</p>' +
			'</div>'


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
			var ParentRole = $('#Guardian').find(':selected').text();
			var all_child = {};

			var value = $('[class^=Add_Kids')
				.find('input, select').not('input[type=button]').map(function (i, item) {

					var currentElement = $(this);
					var value = currentElement.val(); // if it is an input/select/textarea field
					var cls = this.className;
					var kidprops = this.id;
					all_child[cls] = all_child[cls] || [];

					all_child[cls].push(value);
				})
				.get();

			if ($('#P-Skip').data('clicked')) {
				all_child = {};
			}



			let ParentAccount = {
				p_email: pEmail,
				p_pass: pPassword,
				p_pass2: pPassword2,
				p_role: 'parent',
				childProfile: all_child,
				type: 'parent'
			};
			ParentDetail = JSON.stringify(ParentAccount);
			console.log(ParentAccount);
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
		$('#alertbox').click(function () {
			$('#error').html('You Clicked on Click here Button');
			$('#myModal').modal('show');
		});

		// if (message == 'Email already exists. Please choose another') {
		// 	Swal.fire({
		// 		text: 'This event is already in your wishilsit',
		// 		icon: 'error'
		// 	});
		// }

		// if (b_PW != b_PWconfirm) {
		// 	alert('Passwords do not match!');
		// } else {
		$('#Business1').modal('hide');
		$('#Business2').modal('show');
		$('#Vendor_Fname').text(b_Fname);
		$('#Vendor_Lname').html(b_Lname);
		$('#Vendor_Org').html(b_Org);
		$('#Vendor_Address').html(b_Address);
		$('#Vendor_Phone').html(b_Phone);
		$('#Vendor_Email').html(b_Email);
		$('#Vendor_Website').html(b_Website);
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
				let applicationServerKey = urlB64ToUint8Array('BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes');
				PushSubscription = await register.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey
				});
				let SERVER_URL = 'http://localhost:10000/saveSubscription'
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

