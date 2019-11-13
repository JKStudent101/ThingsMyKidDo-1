$("#Family").on( "click", function() {
    $('#Register').modal('hide');
    $('#Parent1').modal('show');
});
$("#Vendor").on( "click", function() {
    $('#Register').modal('hide');
    $('#Business1').modal('show');
});

//Parent Modal
//set "Continue" button id on click to hide 1st modal and trigger 2nd modal
$("#P-Account").on( "click", function() {
    var P_Email = $('#p_email').val();
    var P_Phone = $('#p_phone').val();
    var P_PW = $('#p_password').val();
    var P_PWConfirm = $('#p_confirm_pw').val();
    
    if (P_PW != P_PWConfirm) {
        alert("Passwords do not match!")
    } else if((P_Phone.length < 10 )|| (P_Phone.length > 10)){
        alert('incorrect phone number')
    }
    else {
    
    $('#Parent_Email').html(P_Email);
    $('#Parent_Phone').html(P_Phone);

    $('#Parent1').modal('hide');
    $('#Parent2').modal('show');
    }
});
//set "Register" button id on click to load input + hide 2nd modal, and trigger 3rd modal
$("#P-Redo-Account").on( "click", function() {
    $('#Parent2').modal('hide');
    $('#Parent1').modal('show');
});
//set "Back" button id on click to hide 3rd modal and trigger 2nd modal
$("#P-User").on( "click", function() {
    var Parent_Role = $('#Guardian').val();

    $('#Parent_Role').html(Parent_Role);

    $('#Parent2').modal('hide');
    $('#Parent3').modal('show');


});
//set "Back" button id on click to hide 2nd modal and trigger 1st modal
$("#P-Redo-User").on( "click", function() {
    $('#Parent3').modal('hide');
    $('#Parent2').modal('show');
});
//set "Skip" button id on click to hide 2nd modal and trigger 3rd modal
$("#P-Skip").on( "click", function() {

    var ChildProfile = {
        'nickname': '',
        'gender': '',
        'interests': []
    };

    $('#Parent3').modal('hide');
    $('#Parent4').modal('show');
});
//set "Register" button id on click to load input + hide 2nd modal, and trigger 3rd modal
$("#P-Kids").on( "click", function() {
    $('#Parent3').modal('hide');
    $('#Parent4').modal('show');
});
//set "Back" button id on click to hide 3rd modal and trigger 2nd modal
$("#P-Redo-Kids").on( "click", function() {
    $('#Parent4').modal('hide');
    $('#Parent3').modal('show');
});


//
var count = 1;
var ChildProfile;
$("#add_more").click(function(){
        var inputs = '<input class="register-kid" type="text" id="nickname'+count+'"> nickname is a <select name="gender" id="gender"><option value="boy">boy</option><option value="girl">girl</option></select> who is interested in <span type="text" name="interest" id="interest'+ count+'">{{>interests}}</span></input>.'      
        $('#more_children').append(inputs);
        count ++;

    var childNickname  = $('#nickname\+count').val();
    var childrenGender = $('#Kid-Gender').find(":selected").text();
    var interestArray = [];
    var interests = $('#interest\+count').val().split(','); // separate user input of interest into array
    interestArray.push(interests);

    ChildProfile = {
        'nickname': childNickname,
        'gender': childrenGender,
        'interests': interests
    }

    console.log(ChildProfile)

})


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
        ParentAccount = {
            'p_email': $('#p_email').val(),
            'p_phone': $('#p_phone').val(),
            'p_pass': $('#p_password').val(),
            'p_pass2': $('#p_confirm_pw').val(),
            'p_role': $('#Guardian').val(),
            //'childProfile': ChildProfile    
            };            
        let ParentDetail = JSON.stringify(ParentAccount);
        console.log(ParentDetail);

        $('#Parent4').modal('hide');
        $('#Parent5').modal('show');
    } 
    else{
        alert("Please agree to our terms & conditions.")
    } 
});

//Register Modal
//set "Continue" button id on click to hide 1st modal and trigger 2nd modal
//Button for displaying Vendor info
$("#B-Register-info").on( "click",  function() {
    
    var b_Fname = $("#bus_Fname").val();
    var b_Lname = $("#bus_Lname").val();
    var b_Org = $("#bus_Orgname").val();
    var b_Address = $("#bus_Address").val();
    var b_Phone = $("#bus_Phone").val();
    var b_Email = $("#bus_Email").val();
    var b_Website = $("#bus_Website").val();
    var b_PW = $("#bus_PW").val();
    var b_PWconfirm = $("#bus_PWconfirm").val();            

    if (b_PW != b_PWconfirm) {
        alert("Passwords do not match!")
    } else if((b_Phone.length < 10 )|| (b_Phone.length > 10)){
        alert('incorrect phone number')
    } else{
        $('#Business1').modal('hide');
        $('#Business2').modal('show');

        $("#Vendor_Fname").text(b_Fname);
        $("#Vendor_Lname").html(b_Lname);
        $("#Vendor_Org").html(b_Org);
        $("#Vendor_Address").html(b_Address);
        $("#Vendor_Phone").html(b_Phone);
        $("#Vendor_Email").html(b_Email); 
        $("#Vendor_Website").html(b_Website);
    }

    
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