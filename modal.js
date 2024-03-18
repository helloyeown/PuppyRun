var startBtn = document.querySelector('.startBtn');
var playBtn = document.querySelector('.playBtn');
var modal = document.querySelector('.modalDiv');
var xBtn = document.querySelector('.xImg')

document.addEventListener('DOMContentLoaded', function() {
    startBtn.addEventListener('click', function() {
        startBtn.style.display = 'none';
        xBtn.style.display = 'block';
        modal.style.display = 'block';
    })
})