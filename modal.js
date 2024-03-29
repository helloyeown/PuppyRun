var startBtn = document.querySelector('.startBtn');
var selectStartBtn = document.getElementById('selectStartBtn');
var playBtn = document.querySelector('.playBtn');
var insModal = document.getElementById('insModal');
var exitModal = document.getElementById('exitModal')
var xBtn = document.querySelector('.xBtn')
var noBtn = document.querySelector('.noBtn');
var retryBtn = document.querySelector('#completeModal .retryBtn');
var title = document.querySelector('.title');
var score = document.querySelector('.score');
var startAudio = document.querySelector('#startAudio');
var bgPlay = document.querySelector('#bgPlay');
var isPaused = false;
var gameStarted = false;
var difficulty = document.getElementById('difficulty');
var mode = 'normal';
var spacebarPressedOnce = false;


function startGame() {
    startAudio.play();
    selectStartBtn.style.display = 'none';
    xBtn.style.display = 'block';
    title.style.display = 'none';
    score.style.display = 'block';
    difficulty.style.display = 'block';
    gameStarted = true;

    showModal('insModal');
}

var selectMode = function(select) {
    mode = select;
    difficulty.textContent = mode;
}

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
    
    resetAnimationState(mode);
}
    
function onSpacebarPress(event) {
    if (event.keyCode === 32) {
        if (gameStarted && !isPaused && !animation) {     // 게임 처음 시작
            if(insModal.style.display == 'flex') {
                insModal.style.display = 'none'
                xBtn.style.pointerEvents = 'auto';
                jumping = false;
            } else {
                document.body.style.pointerEvents = 'auto';
                jumping = false;
            
                bgPlay.play();

                eachFrame();
            }
                
            if (resetYn == 'N') {
                resetAnimationState(mode);
            }
        } else if (isPaused) {      // 게임 재개
            isPaused = false;
            document.body.style.pointerEvents = 'auto';

            bgPlay.play();

            eachFrame();
        }
    }
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
    selectStartBtn.addEventListener('click', startGame);

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

        if (isPaused) {
            isPaused = false;
        }

        addEventListeners();
    })
});