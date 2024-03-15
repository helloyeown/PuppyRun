var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var jumpTimer = 0;

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 강아지
var createPuppy = function() {
    // 객체를 반환하는 구조
    return {
        x: 10,
        y: 200,
        width: 50,
        height: 50,
        draw: function() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height); 
        }
    };
};

var puppy = createPuppy();
puppy.x += 1;


// 장애물
var createHuddle = function() {
    return {
        x: 500,
        y: 200,
        width: 50,
        height: 50,
        draw: function() {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

var timer = 0;
var huddles = [];

// animation
function eachFrame() {
    requestAnimationFrame(eachFrame);
    timer++;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timer % 100 === 0) {        // 장애물 생성 속도
        var huddle = createHuddle();
        huddles.push(huddle);
    }
    
    huddles.forEach(function(a, i, o) {
        // x 좌표가 0 미만이면 제거 (배열에 계속 쌓이는 장애물을 제거)
        if (a.x < 0) {
            o.splice(i, 1);
        }

        a.x -= 5;       // 장애물 다가오는 속도
        a.draw();
    });

    // 점프
    if (jumping == true) {
        puppy.y-= 8;
        jumpTimer++;    // 프레임마다 +1
    }

    if (jumpTimer > 8) {     // 100frame 넘으면 jump 중단 (jump 멈추는 위치)
        jumping = false;
    }

    puppy.draw();
}

// 프레임마다 실행
eachFrame();

var jumping = false;    // 점프 중
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 32) {
        e.preventDefault();
        jumping = true;
    }
})