var startBtn = document.querySelector('.startBtn');
var playBtn = document.querySelector('.playBtn');
var insModal = document.getElementById('insModal');
var exitModal = document.getElementById('exitModal')
var xBtn = document.querySelector('.xBtn')
var noBtn = document.querySelector('.noBtn');
var retryBtn = document.querySelector('#completeModal .retryBtn');
var title = document.querySelector('.title');
var score = document.querySelector('.score');
var startAudio = document.querySelector('#startAudio');
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
        startAudio.play();

        startBtn.style.display = 'none';
        xBtn.style.display = 'block';
        title.style.display = 'none';
        score.style.display = 'block';

        gameStarted = true;

        showModal('insModal');
    });
    

    // play 버튼 클릭
    playBtn.addEventListener('click', function() {
        var insModal = document.getElementById('insModal');
        insModal.style.display = 'none';
        xBtn.style.pointerEvents = 'auto';
    });

    // play 버튼 스페이스바
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 32 && gameStarted && !animation) {
            document.body.style.pointerEvents = 'auto';
            insModal.style.display = 'none';

            eachFrame();
        }
    });


    // X 버튼 클릭 (일시정지)
    xBtn.addEventListener('click', function() {
        isPaused = true;
        exitModal.style.display = 'flex';
        document.body.style.pointerEvents = 'auto';
        xBtn.style.pointerEvents = 'none';
    })
    
    // 게임 재개
    noBtn.addEventListener('click', function() {
        exitModal.style.display = 'none';
        xBtn.style.pointerEvents = 'auto';

        if (isPaused) {
            isPaused = false;
            eachFrame();
        }
    })
});