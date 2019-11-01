var Username = ""
var phone = ""
var email = ""
var password = ""
var nickname = ""
var gender = ""




function Summary_Bus(){
    var b_Fname = document.getElementById("bus_Fname").value;
    var b_Lname = document.getElementById("bus_Lname").value;
    var b_Org = document.getElementById("bus_Orgname").value;
    var b_Phone = parsefloat(document.getElementById("bus_Phone").value);
    var b_Email = document.getElementById("bus_Email").value;
    var b_PW = document.getElementById("bus_PW").value;
    var b_PWconfirm = document.getElementById("bus_PWconfirm").value;

    document.getElementById("Vendor_Fname").innerHTML = b_Fname;
    document.getElementById("Vendor_Lname").innerHTML = b_Lname;
    document.getElementById("Vendor_Org").innerHTML = b_Org;
    document.getElementById("Vendor_Phone").innerHTML = b_Phone;
    document.getElementById("Vendor_Email").innerHTML = b_Email;
}

