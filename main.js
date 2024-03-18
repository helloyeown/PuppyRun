var insModal = document.querySelector('.insModalContent');
var gameOverModal = document.querySelector('.gameOverModal');
var xBtn = document.querySelector('.xBtn');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var jumpTimer = 0;
var animation;

canvas.width = 1000;
canvas.height = 700;

var hurdleImg = new Image();
hurdleImg.src = './public/hurdle.png';

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
    return {
        x: 1000,
        y: 400,
        width: 50,
        height: 50,
        draw: function() {
            ctx.clearRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(hurdleImg, this.x, this.y);
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
}

// animation
function eachFrame() {
    if (isPaused) {
        return;
    }

    animation = requestAnimationFrame(eachFrame);
    timer++;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ground.draw();

    if (timer % 100 === 0) {        // 장애물 생성 속도
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
}


// 충돌 체크
var crashCheck = function(puppy, hurdle) {
    var gap = -10;

    var xCrash = (puppy.x + puppy.width >= hurdle.x - gap)
    var yCrash = (puppy.y + puppy.height >= hurdle.y - gap)

    // 충돌
    if (xCrash && yCrash) {
        console.log('crash')
        cancelAnimationFrame(animation);
        gameOverModal.style.display = 'flex';
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
    timer = 0; // 타이머 초기화
    hurdles = []; // 장애물 배열 초기화
    jumping = false; // 점프 상태 초기화
    jumpTimer = 0; // 점프 타이머 초기화
    puppy.y = 400; // 강아지 위치 초기화

    gameOverModal.style.display = 'none';

    cancelAnimationFrame(animation); // 현재 진행 중인 애니메이션을 취소
    eachFrame();
}

var exit = function() {
    location.reload();
}