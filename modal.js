var startBtn = document.querySelector('.startBtn');
var playBtn = document.querySelector('.playBtn');
var insModal = document.getElementById('insModal');
var exitModal = document.getElementById('exitModal')
var xBtn = document.querySelector('.xBtn')
var noBtn = document.querySelector('.noBtn');
var retryBtn = document.querySelector('#completeModal .retryBtn');
var title = document.querySelector('.title');
var score = document.querySelector('.score');
var isPaused = false;
var gameStarted = false;


var showModal = function(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "flex";
    document.body.style.pointerEvents = "none";
    modal.style.pointerEvents = "auto";
    startBtn.style.pointerEvents = "auto";
}


document.addEventListener('DOMContentLoaded', function() {
    // START 버튼 클릭
    startBtn.addEventListener('click', function() {
        startBtn.style.display = 'none';
        xBtn.style.display = 'block';
        title.style.display = 'none';
        score.style.display = 'block';

        gameStarted = true;

        showModal('insModal');
    });
    

    // play 버튼 누르면 게임 시작
    playBtn.addEventListener('click', function() {
        var insModal = document.getElementById('insModal');
        insModal.style.display = 'none';
        xBtn.style.pointerEvents = 'auto';
    });

    // 스페이스바 누르면 게임 시작 (play 버튼 클릭후에만 작동)
    document.addEventListener('keydown', function(event) {
        var insModal = document.getElementById('insModal');

        if (event.keyCode === 32 && gameStarted && !animation) {
            // gameStarted = true;
            document.body.style.pointerEvents = 'auto';
            insModal.style.display = 'none';

            eachFrame(); // 게임 시작
        }
    });


    // X 버튼 클릭
    xBtn.addEventListener('click', function() {
        isPaused = true;
        exitModal.style.display = 'flex';
        document.body.style.pointerEvents = 'auto';
        xBtn.style.pointerEvents = 'none';
    })
    
    noBtn.addEventListener('click', function() {
        console.log('click')
        exitModal.style.display = 'none';
        xBtn.style.pointerEvents = 'auto';

        if (isPaused) {
            isPaused = false;
            eachFrame(); // 게임 재개
        }
    })


    // comlete -> retry
    // retryBtn.addEventListener('click', function() {
    //     completeModal.style.display = 'none';
    // })
});