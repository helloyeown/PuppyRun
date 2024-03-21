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
var bgStart = document.querySelector('#bgStart');
var bgPlay = document.querySelector('#bgPlay');
var isPaused = false;
var gameStarted = false;


var showModal = function(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "flex";
    document.body.style.pointerEvents = "none";
    modal.style.pointerEvents = "auto";
    startBtn.style.pointerEvents = "auto";
}


function onPlayButtonClick() {
    insModal.style.display = 'none';
    xBtn.style.pointerEvents = 'auto';

    resetAnimationState();
}

function onSpacebarPress(event) {
    if (event.keyCode === 32) {
        if (gameStarted && !isPaused && !animation) {     // 게임 처음 시작
            insModal.style.display = 'none';
            document.body.style.pointerEvents = 'auto';
            eachFrame();
        }
        else if (isPaused) {      // 게임 재개
            isPaused = false;
            document.body.style.pointerEvents = 'auto';
            eachFrame();
        }
    }
}

function startGame() {
    bgStart.pause();
    startAudio.play();
    startBtn.style.display = 'none';
    xBtn.style.display = 'block';
    title.style.display = 'none';
    score.style.display = 'block';
    gameStarted = true;

    showModal('insModal');
}

// 이벤트 리스너 등록 함수
function addEventListeners() {
    playBtn.addEventListener('click', onPlayButtonClick);
    document.addEventListener('keydown', onSpacebarPress);
}

// 이벤트 리스너 제거 함수
function removeEventListeners() {
    playBtn.removeEventListener('click', onPlayButtonClick);
    document.removeEventListener('keydown', onSpacebarPress);
}


document.addEventListener('DOMContentLoaded', function() {
    addEventListeners();

    // START 버튼 클릭
    startBtn.addEventListener('click', startGame);

    // X 버튼 클릭 (일시정지)
    xBtn.addEventListener('click', function() {
        isPaused = true;
        exitModal.style.display = 'flex';
        document.body.style.pointerEvents = 'auto';
        xBtn.style.pointerEvents = 'none';
        bgPlay.pause();

        removeEventListeners(); // keydown 이벤트 리스너 제거
    })
    
    // 게임 재개
    noBtn.addEventListener('click', function() {
        exitModal.style.display = 'none';
        xBtn.style.pointerEvents = 'auto';
        animation = 0;
        bgPlay.play();

        if (isPaused) {
            isPaused = false;
        }

        addEventListeners();
    })
});