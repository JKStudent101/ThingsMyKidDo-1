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
