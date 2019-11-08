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
