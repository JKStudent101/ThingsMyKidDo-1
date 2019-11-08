document
    .getElementById('target')
    .addEventListener('change', function() {
        'use strict';
        var vis = document.querySelector('.vis'),
            target = document.getElementById(this.value);
        if (vis !== null) {
            vis.className = 'invis';
        }
        if (target !== null) {
            target.className = 'vis';
        }
    });