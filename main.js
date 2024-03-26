var insModal = document.querySelector('.insModalContent');
var gameOverModal = document.querySelector('.gameOverModal');
var xBtn = document.querySelector('.xBtn');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var jumpTimer = 0;
var animation;
var gameOverModal = document.getElementById('gameOverModal');
var retryBtn = document.querySelector('#completeModal .retryBtn');
var jumpAudio = document.querySelector('#jumpAudio');
var overAudio = document.querySelector('#overAudio');
var playBtn = document.querySelector('.playBtn');
var bgPlay = document.querySelector('#bgPlay');
var timer = 0;  // 프레임 단위
var hurdles = [];
var hurdleSpeed = 5;
var currentScore = 0;
var nextHurdleTime = 10;
var scoreUpdateTime = 300;  // 5초 (5 * 60프레임)
var jumping = false;    // 점프 중
var hardHurdleImg ;
var hardFstYn = "N";
var resetYn = "N";

canvas.width = 1000;
canvas.height = 700;

var hurdleImg1 = new Image();
hurdleImg1.src = './public/hurdle.png';
var hurdleImg2 = new Image();
hurdleImg2.src = './public/hurdle2.png';
var puppyImg = new Image();
puppyImg.src = './public/puppy.png';
var crashImg = new Image();
crashImg.src = './public/crashImg.png';



// 강아지
var createPuppy = function() {
    return {
        x: 10,
        y: 400,
        width: 50,
        height: 50,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height); 
            ctx.drawImage(puppyImg, this.x, this.y);
        }
    }
}

var puppy = createPuppy();
puppy.x += 1;

// 장애물
var createHurdle = function(mode, hardFstYn) {
    var randomImg = Math.random() < 0.5 ? hurdleImg1 : hurdleImg2;

    if(mode == 'hard' && hardFstYn == 'Y') {
        xLocation = 550;
    } else {
        xLocation = 1000;
    }
    
    return {
        x: xLocation,
        y: 400,
        width: 50,
        height: 50,
        img : randomImg,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(randomImg, this.x, this.y);
        }
    }
}

// 충돌 효과
var crashAni = function() {
    return {    
        x: 45,
        y: 455,
        width: 30,
        height: 30,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height); 
            ctx.drawImage(crashImg, this.x, this.y);
        }
    }
}

// 땅
var ground = function() {
    return {
        draw: function() {
            ctx.beginPath();
            ctx.moveTo(0, 451); // 땅의 시작점, 강아지의 y 위치보다 조금 더 아래인 451으로 설정
            ctx.lineTo(canvas.width, 451); // canvas의 가로 길이만큼 직선을 그림
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke(); // 선을 그림
        }
    }
}

var crashAni = crashAni();
var ground = ground();

// 초기 화면 설정
function setupInitialScreen() {
    puppy.draw();
    ground.draw();
}

// 난이도 조절
var modeControl = function(mode) {
    if (mode == 'hard') {
        hurdleSpeed = 8;
    }
}

// animation
function eachFrame() {
    if (isPaused) {
        return;
    }

    modeControl(mode);

    animation = requestAnimationFrame(eachFrame);
    timer++;

    // 5초마다 스코어 +10점 업데이트
    if (timer % scoreUpdateTime === 0) {
        currentScore += 10; 
        displayScore(currentScore);
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ground.draw();
    
    // 장애물 생성, 속도 조절 로직
    if (timer > nextHurdleTime) {

        //if (mode == 'hard') {
        //    console.log('hard mode')
        //    var hardAni = resetAnimationState(mode);
        //    hurdles = hardAni.hardHurdles;
        //    console.log(hardAni.hardHurdles)
        //} else if (mode == 'normal') {
            var hurdle = createHurdle(mode);
            hurdles.push(hurdle);
        //    console.log('normalllllllllllllllll')
        //}


        // 게임 진행 시간에 따라 장애물 생성 간격을 더 줄임
        var maxInterval = Math.max(30, 70 - Math.floor(timer / 1000));  // 생성 간격 최대값
        var intervalDecrease = Math.floor(timer / 300); // 300 프레임마다 간격 감소

        // if (mode == 'hard') {
        //     // 하드 모드의 경우 간격 감소량을 더 크게 설정
        //     intervalDecrease += 300; // 이 값을 조정하여 생성 간격을 더 줄일 수 있습니다.
        //     maxInterval = Math.max(1, maxInterval - 1000); // 최대 간격도 더 줄임
        // }

        // 30초가 지난 후 추가 감소
        if (timer > 1800) {
            var additionalDecrease = Math.floor(timer / 400);
            maxInterval = Math.max(20, maxInterval - additionalDecrease);
        }

        if (timer > 2500) {
            var extremeDecrease = Math.floor(timer / 300);
            maxInterval = Math.max(1, maxInterval - (extremeDecrease * 2));
        }

        nextHurdleTime = timer + Math.floor(Math.random() * (maxInterval - intervalDecrease + 1)) + 30 + Math.floor(Math.random()*20);
    }

    if (timer % 500 === 0 && timer <= 3000) { 
        hurdleSpeed += 1;
    }
    
    hurdles.forEach(function(a, i, o) {
        // x 좌표가 0 미만이면 제거 (배열에 계속 쌓이는 장애물을 제거)
        if (a.x < 0) {
            o.splice(i, 1);
        }

        a.x -= hurdleSpeed;   // 장애물 다가오는 속도

        crashCheck(puppy, a);
        if (hardFstYn == 'Y') {
             a.img = hardHurdleImg;
             hardFstYn = 'N';
        }
        a.draw();
    });


    // 점프
    if (jumping == true) {
        jumpAudio.currentTime = 0;
        jumpAudio.play();
        puppy.y -= 21;
        jumpTimer++;    // 프레임마다 +1
    }

    // 점프하고 하강
    if (jumping == false) {
        if (puppy.y < 400) {
            puppy.y += 7;
        }
    }

    if (jumpTimer > 6) {     // 6 frame 넘으면 jump 중단 (jump 멈추는 위치)
        jumping = false;

        if (puppy.y >= 400) {
            jumpTimer = 0;
        }
    }

    puppy.draw();
}


// 충돌 체크
var crashCheck = function(puppy, hurdle) {
    var gap = -10;

    var xCrash = (puppy.x + puppy.width >= hurdle.x - gap)
    var yCrash = (puppy.y + puppy.height >= hurdle.y - gap)

    if (xCrash && yCrash) {
        crashAni.draw();
        cancelAnimationFrame(animation);
        bgPlay.pause();
        overAudio.play();
        showModal('gameOverModal');
        xBtn.style.pointerEvents = 'none';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.keyCode === 32 && !jumping && jumpTimer === 0) {
        e.preventDefault();
        jumping = true;
    }
});

// game over 후 다시 시작
var retry = function() {
    removeEventListeners();

    // 게임 상태 초기화
    timer = 0;
    hurdles = [];
    jumping = false;
    jumpTimer = 0;
    isPaused = false;
    currentScore = 0;
    hurdleSpeed = 5;
    nextHurdleTime = 10;
    gameStarted = true;
    animation = 0;
    puppy.y = 400;
    bgPlay.currentTime = 0;
    
    gameOverModal.style.display = 'none';
    document.body.style.pointerEvents = 'auto';
    xBtn.style.pointerEvents = 'none';
    displayScore(currentScore);

    cancelAnimationFrame(animation); // 현재 진행 중인 애니메이션을 취소

    showModal('insModal');
    
    addEventListeners();
}

var exit = function() {
    location.reload();
}

var displayScore = function(currentScore) {
    var scoreElement = document.querySelector('.score');
    scoreElement.textContent = 'SCORE: ' + currentScore.toString();
}

var resetAnimationState = function(mode) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    puppy.draw();
    ground.draw();

    if (mode == 'hard') {
        hardFstYn = "Y"
        var hardHurdle = createHurdle(mode, hardFstYn);
        hardHurdle.draw();
        hurdles.push(hardHurdle);
        hardHurdleImg = hardHurdle.img
    }

    resetYn = "Y";
    //return {
    //    hardHurdles: hurdles
    //} 
}