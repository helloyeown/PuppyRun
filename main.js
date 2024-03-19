var insModal = document.querySelector('.insModalContent');
var gameOverModal = document.querySelector('.gameOverModal');
var xBtn = document.querySelector('.xBtn');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var jumpTimer = 0;
var animation;
var gameOverModal = document.getElementById('gameOverModal');
var completeModal = document.getElementById('completeModal');
var retryBtn = document.querySelector('#completeModal .retryBtn');

canvas.width = 1000;
canvas.height = 700;

var hurdleImg1 = new Image();
hurdleImg1.src = './public/hurdle.png';
var hurdleImg2 = new Image();
hurdleImg2.src = './public/hurdle2.png';

var puppyImg = new Image();
puppyImg.src = './public/puppy.png';

var goalImg = new Image();
goalImg.src = "./public/goal.png"



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


// goal
var createGoal = function() {
    return {
        x: canvas.width - 50, // 예시로 캔버스의 오른쪽 끝에 배치
        y: 400, // ground.y는 지면의 y 좌표입니다. 골이 지면 위에 서있도록 조정해주세요.
        width: 50,
        height: 50,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(goalImg, this.x, this.y);
        }
    }
}

var goal = createGoal();


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
    goal.draw();
}


var start = null; // 게임 시작 시간
var goalPlaced = false; // 골이 배치되었는지 여부

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

    // 골이 배치되기 전에만 허들 생성
    // if (!goalPlaced && elapsed < 29000 && timer % 100 === 0) {        // 장애물 생성 속도
        if (!goalPlaced && elapsed < 8000 && timer % 100 === 0) {        // 장애물 생성 속도
        var hurdle = createHurdle();
        hurdles.push(hurdle);
    }
    
    hurdles.forEach(function(a, i, o) {
        // x 좌표가 0 미만이면 제거 (배열에 계속 쌓이는 장애물을 제거)
        if (a.x < 0) {
            o.splice(i, 1);
        }

        a.x -= 5;   // 장애물 다가오는 속도

        crashCheck(puppy, a);
        a.draw();
    });

    // 점프
    if (jumping == true) {
        puppy.y -= 20;
        jumpTimer++;    // 프레임마다 +1
    }

    // 점프하고 하강
    if (jumping == false) {
        if (puppy.y < 400) {
            puppy.y += 5;
        }
    }

    if (jumpTimer > 6) {     // 6 frame 넘으면 jump 중단 (jump 멈추는 위치)
        jumping = false;

        if (puppy.y >= 400) {
            jumpTimer = 0;
        }
    }

    puppy.draw();
    
    // 골 배치 로직
    // if (!goalPlaced && elapsed >= 30000) {
    if (!goalPlaced && elapsed >= 10000) {
        goal.x = canvas.width; // 가정: 캔버스의 가장 오른쪽 끝에서 골이 등장
        goal.y = 400; // 골의 y 좌표 설정
        goalPlaced = true; // 골 배치 완료
    }

    if (goalPlaced) {
        goal.x -= 5;
        goal.draw();
    }

    // 게임 완료 확인
    checkCompletion();
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
    goalPlaced = false; // 게임 완료 상태 초기화
    gameStarted = true;
    elapsed = 0;
    isPaused = false;

    gameOverModal.style.display = 'none';
    completeModal.style.display = 'none';
    document.body.style.pointerEvents = 'auto';
    xBtn.style.pointerEvents = 'auto';
    
    cancelAnimationFrame(animation); // 현재 진행 중인 애니메이션을 취소
    eachFrame();

    console.log(start, timer, hurdles, jumping, goalPlaced, gameStarted, elapsed, isPaused);
}

var exit = function() {
    location.reload();
}


// 30초
var checkCompletion = function() {
    if ((puppy.x + puppy.width) >= goal.x - 8) {
        cancelAnimationFrame(animation);
        
        xBtn.style.pointerEvents = 'none';
        completeModal.style.display = 'flex';
    }
}