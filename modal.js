var startBtn = document.querySelector('.startBtn');
var playBtn = document.querySelector('.playBtn');
var modal = document.querySelector('.modalDiv');
var exitModal = document.querySelector('.exitModal')
var xBtn = document.querySelector('.xImg')
var noBtn = document.querySelector('.noBtn');
var isPaused = false;

document.addEventListener('DOMContentLoaded', function() {
    // START 버튼 클릭
    var toggleModal = function() {
        startBtn.style.display = 'none';
        xBtn.style.display = 'block';
        modal.style.display = 'block';
    }
    
    startBtn.addEventListener('click', function() {
        toggleModal();
    });


    // play 버튼 누르면 게임 시작
    playBtn.addEventListener('click', function() {
        insModal.style.display = 'none';
        eachFrame();    // 프레임마다 실행 (시간의 흐름은 항상 프레임으로 계산)
    });


    // X 버튼 클릭
    xBtn.addEventListener('click', function() {
        isPaused = true;
        exitModal.style.display = 'flex';

    })

    noBtn.addEventListener('click', function() {
        exitModal.style.display = 'none';

        if (isPaused) {
            isPaused = false;
            eachFrame(); // 게임 재개
        }
    })
});