var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var jumpTimer = 0;
var animation;

canvas.width = 1000;
canvas.height = 700;

ctx.fillStyle = 'blue'; // 원하는 색상 코드로 변경 가능
ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체에 색상 채우기

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

var timer = 0;
var hurdles = [];


// animation
function eachFrame() {
    animation = requestAnimationFrame(eachFrame);
    timer++;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        puppy.y -= 10;
        jumpTimer++;    // 프레임마다 +1
    }

    // 점프하고 하강
    if (jumping == false) {
        if (puppy.y < 400) {
            puppy.y += 3;
        }
    }

    if (jumpTimer > 12) {     // 12 frame 넘으면 jump 중단 (jump 멈추는 위치)
        jumping = false;

        if (puppy.y >= 400) {
            jumpTimer = 0;
        }
    }

    puppy.draw();
}


// 프레임마다 실행 (시간의 흐름은 항상 프레임으로 계산)
eachFrame();


// 충돌 체크
var crashCheck = function(puppy, hurdle) {
    var gap = -10;

    var xCrash = (puppy.x + puppy.width >= hurdle.x - gap)
    var yCrash = (puppy.y + puppy.height >= hurdle.y - gap)

    // 충돌
    if (xCrash && yCrash) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animation);
        console.log('crash')
    }
}


var jumping = false;    // 점프 중
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 32 && !jumping && jumpTimer === 0) {
        e.preventDefault();
        jumping = true;
    }
})