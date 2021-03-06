const confirm_add_msg =()=>{
     return confirm('Are you sure you want to add event?')
 };

 var today = new Date().toISOString().split('T')[0];
 document.getElementsByName("start_date")[0].setAttribute('min', today);
 document.getElementsByName("end_date")[0].setAttribute('min', today);

 const add_validation = ()=>{
     var event_name = document.forms["add-form"]["eventname"];
     var start_date = document.forms["add-form"]["start_date"];
     var end_date = document.forms["add-form"]["end_date"];
     var start_time = document.forms["add-form"]["start_time"];
     var end_time = document.forms["add-form"]["end_time"];
     var tags = document.forms["add-form"]["tag"];
     var address = document.forms["add-form"]["address"];
     var city = document.forms["add-form"]["city"];
     var province = document.forms["add-form"]["province"];
     var link = document.forms["add-form"]["link"];
     var description = document.forms["add-form"]["description"];


     if ((event_name.value == "") || (event_name.value == "null") || (event_name.value == "undefined"))
     {
         Swal.fire({
             text: "Please enter valid event name",
             icon: "error",
         });
         event_name.focus();
         return false;
     }

     if ((address.value == "") || (address.value == "null") || (address.value == "undefined"))
     {
         Swal.fire({
             text: "Please enter valid address",
             icon: "error",
         });
         address.focus();
         return false;
     }

     if ((city.value == "") || (city.value == "null") || (city.value == "undefined"))
     {
         Swal.fire({
             text: "Please enter valid city",
             icon: "error",
         });
         city.focus();
         return false;
     }
     if ((link.value == "") || (link.value == "null") || (link.value == "undefined"))
     {
         Swal.fire({
             text: "Please enter valid link",
             icon: "error",
         });
         link.focus();
         return false;
     }

     if ((description.value == "") || (description.value == "null") || (description.value == "undefined"))
     {
         Swal.fire({
             text: "Please enter valid description",
             icon: "error",
         });
         description.focus();
         return false;
     }

     if (start_date.value<today){
         Swal.fire({
             text: "Please enter valid event date",
             icon: "error",
         });
         start_date.focus();
         return false;
     }

     if ((end_date.value<today)||(end_date.value < start_date.value)){
         Swal.fire({
             text: "Please enter valid event date",
             icon: "error",
         });
         end_date.focus();
         return false;
     }

     if (!(city.value.match(/^[A-Za-z+ ?]+$/))){
         Swal.fire({
             text: "Please enter valid city",
             icon: "error",
         });
         city.focus();
         return false;
     }

     if (!(link.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))){
         Swal.fire({
             text: "Please enter valid event link",
             icon: "error",
         });
         link.focus();
         return false;
     }
 };

