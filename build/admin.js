const approve = (event_id) => {
    let request = new window.XMLHttpRequest();
    let data = {
        id: event_id
    }
    request.open('post', '/approve-event', false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(data));
    let response = JSON.parse(request.response);
    if (response.message != 'success') {
        console.log('Error storing event');
    }
    window.location.reload(true);
}

const eventDelete = (event_id) => {
    let isConfirmed = confirm('Are you sure you want to delete?')
    if (isConfirmed) {
        let request = new window.XMLHttpRequest();
        request.open('get', `/delete/${event_id}`, false);
        request.send();
        let response = JSON.parse(request.response);
        if (response.message != 'success') {
            console.log('Error storing event');
        }
        window.location.reload(true);
    }
}

function openUser(evt, usertype) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(usertype).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();
