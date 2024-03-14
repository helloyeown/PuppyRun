var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

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
    
    huddles.forEach(function(a) {
        a.x -= 5;       // 장애물 다가오는 속도
        a.draw();
    });

    puppy.draw();
}

eachFrame();