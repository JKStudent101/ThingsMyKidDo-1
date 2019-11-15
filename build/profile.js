document
    .getElementById('target')
    .addEventListener('change', function() {
        let nickname = this.value
        // 'use strict';
        // var vis = document.querySelector('.vis'),
        //     target = document.getElementById(this.value);
        // if (vis !== null) {
        //     vis.className = 'invis';
        // }
        // if (target !== null) {
        //     target.className = 'vis';
        // }
        console.log(window.location.origin)
        window.location.replace(window.location.origin + "/profile/" + nickname) 
    });





