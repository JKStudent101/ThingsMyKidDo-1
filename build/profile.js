document.getElementById('selectdiv').click



document
    .getElementById('target')
    .addEventListener('change', function() {
        let nickname = this.value
        console.log(window.location.origin)
        window.location.replace(window.location.origin + "/profile/" + nickname) 
    });





