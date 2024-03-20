var insModal = document.querySelector('.insModalContent');
var gameOverModal = document.querySelector('.gameOverModal');
var xBtn = document.querySelector('.xBtn');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var jumpTimer = 0;
var animation;
var gameOverModal = document.getElementById('gameOverModal');
var retryBtn = document.querySelector('#completeModal .retryBtn');

canvas.width = 1000;
canvas.height = 700;

var hurdleImg1 = new Image();
hurdleImg1.src = './public/hurdle.png';
var hurdleImg2 = new Image();
hurdleImg2.src = './public/hurdle2.png';

var puppyImg = new Image();
puppyImg.src = './public/puppy.png';



// 강아지
var createPuppy = function() {
    // 객체를 반환하는 구조
    return {
        x: 10,
        y: 400,
        width: 50,
        height: 50,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height); 
            ctx.drawImage(puppyImg, this.x, this.y);
        }
    };
};

var puppy = createPuppy();
puppy.x += 1;

// 장애물
var createHurdle = function() {
    var randomImg = Math.random() < 0.5 ? hurdleImg1 : hurdleImg2;

    return {
        x: 1000,
        y: 400,
        width: 50,
        height: 50,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(randomImg, this.x, this.y);
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
            ctx.strokeStyle = 'black'; // 선의 색상을 검정색으로 설정
            ctx.lineWidth = 2;
            ctx.stroke(); // 선을 그림
        }
    }
}


var ground = ground();

var timer = 0;
var hurdles = [];


// 초기 화면 설정
function setupInitialScreen() {
    puppy.draw(); // 강아지 그리기
    ground.draw();
    // goal.draw();
}


var start = null; // 게임 시작 시간
var speedIncreaseFactor = 0;
var hurdleSpeed = 5;
var score = 0;
var nextHurdleTime = 10;

// animation
function eachFrame(timestamp) {
    if (!start) {
        start = timestamp; // 게임 시작 시간 설정
    }

    var elapsed = timestamp - start; // 경과 시간 계산

    if (isPaused) {
        return;
    }

    animation = requestAnimationFrame(eachFrame);
    timer++;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ground.draw();

    // if (timer % (100 - speedIncreaseFactor) === 0) {        // 장애물 생성 속도
    if (timer > nextHurdleTime) {
        var hurdle = createHurdle();
        hurdles.push(hurdle);

        
        // 게임 진행 시간에 따라 장애물 생성 간격을 더 줄임
        var maxInterval = Math.max(30, 70 - Math.floor(timer / 7000));
        var intervalDecrease = Math.floor(timer / 5000); // 예를 들어, 5000프레임마다 간격 감소
        nextHurdleTime = timer + Math.floor(Math.random() * (maxInterval - intervalDecrease)) + 30;
    }

    // 게임 시간이나 점수에 따라 speedIncreaseFactor 증가
    if (timer % 500 === 0) { // 예시: 매 500프레임마다 속도 증가
        speedIncreaseFactor += 1;
        hurdleSpeed += 1; // 장애물 이동 속도 증가
    }
    
    hurdles.forEach(function(a, i, o) {
        // x 좌표가 0 미만이면 제거 (배열에 계속 쌓이는 장애물을 제거)
        if (a.x < 0) {
            o.splice(i, 1);
        }

        a.x -= hurdleSpeed;   // 장애물 다가오는 속도

        // crashCheck(puppy, a);
        a.draw();
    });

    // 점프
    if (jumping == true) {
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

    // 충돌
    if (xCrash && yCrash) {
        cancelAnimationFrame(animation);
        showModal('gameOverModal');
        xBtn.style.pointerEvents = 'none';
    }
}


var jumping = false;    // 점프 중
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 32 && !jumping && jumpTimer === 0) {
        e.preventDefault();
        jumping = true;
    }
});


var retry = function() {
    // 게임 상태 초기화
    start = null; // 게임 시작 시간 초기화 추가
    timer = 0; // 타이머 초기화
    hurdles = []; // 장애물 배열 초기화
    jumping = false; // 점프 상태 초기화
    jumpTimer = 0; // 점프 타이머 초기화
    gameStarted = true;
    elapsed = 0;
    isPaused = false;

    gameOverModal.style.display = 'none';
    document.body.style.pointerEvents = 'auto';
    xBtn.style.pointerEvents = 'auto';
    
    cancelAnimationFrame(animation); // 현재 진행 중인 애니메이션을 취소
    eachFrame();
}

var exit = function() {
    location.reload();
}


var displaySocre = function() {
    
}