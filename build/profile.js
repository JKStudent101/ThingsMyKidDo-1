
document
    .getElementById('target')
    .addEventListener('change', function() {
        let nickname = this.value
        window.location.replace(window.location.origin + "/profile/" + nickname) 
    });





