$(document).ready(function() {
	let num = '';
	$('#Family').on('click', function() {
		$('#Register').modal('hide');
		$('#Parent1').modal('show');
	});
	$('#Vendor').on('click', function() {
		$('#Register').modal('hide');
		$('#Business1').modal('show');
	});

	//Parent Modal
	//set "Continue" button id on click to hide 1st modal and trigger 2nd modal
	$('#P-Account').on('click', function() {
		$('#Parent1').modal('hide');
		$('#Parent2').modal('show');
	});
	//set "Register" button id on click to load input + hide 2nd modal, and trigger 3rd modal
	$('#P-Redo-Account').on('click', function() {
		$('#Parent2').modal('hide');
		$('#Parent1').modal('show');
	});
	//set "Back" button id on click to hide 3rd modal and trigger 2nd modal
	$('#P-User').on('click', function() {
		$('#Parent2').modal('hide');
		$('#Parent3').modal('show');
	});
	//set "Back" button id on click to hide 2nd modal and trigger 1st modal
	$('#P-Redo-User').on('click', function() {
		$('#Parent3').modal('hide');
		$('#Parent2').modal('show');
	});
	//set "Skip" button id on click to hide 2nd modal and trigger 3rd modal
	$('#P-Skip').on('click', function() {
		$('#Parent3').modal('hide');
		$('#Parent4').modal('show');
	});
	//set "Register" button id on click to load input + hide 2nd modal, and trigger 3rd modal
	$('#P-Kids').on('click', function() {
		$('#Parent3').modal('hide');
		$('#Parent4').modal('show');
	});
	//set "Back" button id on click to hide 3rd modal and trigger 2nd modal
	$('#P-Redo-Kids').on('click', function() {
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
	var count = 0;
	var ChildProfile;
	let TotalChilds = {};
	let tags = [];

	$.ajax({
		url: '/event/gettags',
		type: 'GET',
		async: false,
		dataType: 'json',
		success: (data) => {
			for (var i = 0; i < data.length; i++) {
				tags.push(data[i].name);
			}
		}
	});

	// console.log(tags);

	function getinput() {
		let selectGender =
			'<select id="gender' +
			(1 + count) +
			' " class="register-gender"> <option>Boy</option> <option>Girl</option> </select>';
		let input = '';
		for (let i = 0; i < tags.length; i++) {
			input =
				'<div class="allInputs' +
				(1 + count) +
				'" > <input class="register-kid' +
				(1 + count) +
				'" name="nickname' +
				(1 + count) +
				'" id="kidname' +
				(1 + count) +
				'">' +
				selectGender +
				'<select value="' +
				tags[i] +
				'" id="' +
				'"></select>';

			// <select name="" id=""></select>
			// ' <input class="register-kid' +
			// (1 + count) +
			// '" name="interest' +
			// (1 + count) +
			// '" id="interest' +
			// (1 + count) +
			// '"> '
		}

		//<button type="button" class="submit1" id="more1">Add more Kids</button>

		$('#morekids').append(input);
	}
	$('#more1').click(function() {
		count++;
	});
	let total_kids = [];

	//Register Modal
	//set "Continue" button id on click to hide 1st modal and trigger 2nd modal
	//$("#B-Register-info").on( "click",  function Summary_Bus());

	// Register Child Profile
	$(document).on('click', '#more1', function(event) {
		var list = $('.allInputs' + count + '')
			// var list = $('[class^=allInputs]')
			.find('input, select')
			.not('#add :input')
			.map(function() {
				return $(this).val();
			})
			.get();
		getinput();

		TotalChilds['Child' + count] = list;
		console.log(TotalChilds);
		// send to server here
	});
	count = count + 1;

	$('#P-Confirm').on('click', function() {
		if ($('#Parent_TermCheck').is(':checked')) {
			let pEmail = $('#p_email').val();
			let pPhone = $('#p_phone').val();
			let pPassword = $('#p_password').val();
			let pPassword2 = $('#p_password2').val();
			var ParentRole = $('#Guardian').find(':selected').text();
			console.log(TotalChilds);

			if ($('#P-Skip').data('clicked')) {
				TotalChilds = {};
			}

			let ParentAccount = {
				p_email: pEmail,
				p_phone: pPhone,
				p_pass: pPassword,
				p_pass2: pPassword2,
				p_role: ParentRole,
				childProfile: TotalChilds,
				type: 'parent'
			};
			ParentDetail = JSON.stringify(ParentAccount);
			console.log(ParentDetail);
			$.ajax({
				url: 'registerParent',
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				data: ParentDetail,
				success: function(result) {
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

	$('#B-Register-info').on('click', function() {
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
		$('#alertbox').click(function() {
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
	$('#B-Redo-info').on('click', function() {
		$('#Vendor_Fname').empty();
		$('#Vendor_Lname').empty();
		$('#Vendor_Org').empty();
		$('#Vendor_Address').empty();
		$('#Vendor_Phone').empty();
		$('#Vendor_Email').empty();
		$('#Vendor_Website').empty();

		$('#Business2').modal('hide');
		$('#Business1').modal('show');
	});
	//set "Confirm" button id on click to hide 2nd modal and trigger 3rd modal
});
//set "Back" button id on click to hide 2nd modal and trigger 1st modal
//jquery: .empty() might be redundant
$("#B-Redo-info").on( "click", function() {
    $('#Business2').modal('hide');
    $('#Business1').modal('show');
});
//set "Confirm" button id on click to hide 2nd modal and trigger 3rd modal
$("#B-Confirm-info").on( "click", function() {

    if ($("#bus_TermCheck").is(':checked')){

        Bus_Account = {
            
            "FirstName": $("#bus_Fname").val(),
            "LastName": $("#bus_Lname").val(),
            "Oraganization": $("#bus_Orgname").val(),
            "PhoneNumber": $("#bus_Phone").val(),
            "BusAddress" : $("#bus_Address").val(),
            "EmailAddress": $("#bus_Email").val(),
            "Website": $("#bus_Website").val(),
            "Password1": $("#bus_PW").val(),
            "Password2": $("#bus_PWconfirm").val(),
            'type': 'vendor'
        }; 
        let Vendor_Account = JSON.stringify(Bus_Account);
       // console.log(Vendor_Account);
        $('#Business2').modal('hide');
        $('#Business3').modal('show');

        
        $.ajax({
            url: 'registerVendor',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType:'json',
            data: Vendor_Account,
            success: function(result) {
                console.log(result)
            }
        })
    }
    else{
        alert("Please argee to our Terms & Conditions.")
    }   
});

$("#B-Register-complete").on("click", function(){
    $("#bus_Fname").val("");
    $("#bus_Lname").val("");
    $("#bus_Orgname").val("");
    $("#bus_Address").val("");
    $("#bus_Phone").val("");
    $("#bus_Email").val("");
    $("#bus_Website").val("");
    $("#bus_PW").val("");
    $("#bus_PWconfirm").val("");
    $("#bus_TermCheck").prop('checked',false)
});


$(".B-clear").on("click", function(){
    $("#bus_Fname").val("");
    $("#bus_Lname").val("");
    $("#bus_Orgname").val("");
    $("#bus_Address").val("");
    $("#bus_Phone").val("");
    $("#bus_Email").val("");
    $("#bus_Website").val("");
    $("#bus_PW").val("");
    $("#bus_PWconfirm").val("");
    $("#bus_TermCheck").prop('checked',false);
});

/*
$("#P_Register-complete").on("click", function(){
    $("#p_email").val("");
    $("#p_phone").val("");
    $("#p_password").val("");
    $("#p_confirm_pw").val("");
    $(".guardian").val("");
    $("#Parent_TermCheck").prop('checked',false);
});
*/

$(".P-clear").on("click", function(){
    $("#p_email").val("");
    $("#p_phone").val("");
    $("#p_password").val("");
    $("#p_confirm_pw").val("");
    $(".guardian").val("");
    $("#Parent_TermCheck").prop('checked',false);
});


$('#toHome').click(function(){
    $(".P-clear").click();
});