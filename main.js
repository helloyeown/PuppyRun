var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 강아지
var puppy = {
    x: 10,
    y: 200,
    width: 50,
    height: 50,

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height) 
    }
}

puppy.x += 1;


// 장애물
class Huddle {
    constructor() {
        this.x = 500;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height) 
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
        var huddle = new Huddle();
        huddles.push(huddle);
    }
    
    huddles.forEach((a) => {
        a.x -= 5;
        a.draw();
    });

    puppy.draw();
}

eachFrame();