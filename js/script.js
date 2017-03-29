var screen = {
    canvas: document.getElementById("canvas"),
    start: function(){
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.interval = setInterval(updateScreen, 20);
        },
    clear:  function(){
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
}
var objs = {};
var ctx = screen.canvas.getContext("2d");
var keysDown = {};
var screenLeft = 5;
var screenRight = 445;
var anim = true;
var level = 1;
var speed;
var fireBool = true;

function startGame(){
    screen.clear();

    // Delete all current objects
    objs = {};

    // Initialise user input
    keysDown = {};
	window.addEventListener('keydown', function(e) {
		keysDown[e.keyCode] = true;
	});
	window.addEventListener('keyup', function(e) {
		delete keysDown[e.keyCode];
	});

    // Initialise canvas
    screen.start();

    // Set interval for enemy animations
    setInterval(function(){anim = !anim}, 400);

    createObjects();
}

function component(x, y, image, image2, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.update = function(){
        if(anim) ctx.drawImage(image2,this.x,this.y);
        else ctx.drawImage(image,this.x,this.y);
    }
}

function createObjects(){
    objs['player'] = new component(230,450, playerImg, playerImg, 15);
    objs['enemies'] = [];
    objs['bullets'] = [];

    speed = 0.5*level;
    for(var i=1; i<11; i++){
        objs['enemies'].push(new component((i*43)+6, 50, enemy1, enemy1_2, 20, 19))
        objs['enemies'].push(new component((i*43)+5, 80, enemy2, enemy2_2, 22, 16))
        objs['enemies'].push(new component((i*43)+5, 110, enemy2, enemy2_2, 22, 16))
        objs['enemies'].push(new component((i*43)+5, 140, enemy3, enemy3_2, 24, 16))
        objs['enemies'].push(new component((i*43)+5, 170, enemy3, enemy3_2, 24, 16))
    }
}

function checkInput(){
    // All ifs so multiple keys can be pressed at once
    if (37 in keysDown) {
	    move("l");
	}
    if (39 in keysDown) {
        move("r");
    }
    if (32 in keysDown) {
        if(fireBool) fire();
    }
}

function move(dir){
    if (dir == "l"){
        objs['player'].x -= 4;
        if( objs['player'].x - objs['player'].w <= screenLeft)
            objs['player'].x = screenLeft + objs['player'].w;
    } else {
        objs['player'].x += 4;
        if( objs['player'].x + objs['player'].w >= screenRight)
            objs['player'].x = screenRight - objs['player'].w;
    }
}

function fire(){
    objs['bullets'].push(new component(objs['player'].x+23, objs['player'].y+2, bullet, bullet));
    fireBool = false;
    setTimeout(function(){ fireBool = true}, 600);
}

function moveEnemies(){
    if(Math.max.apply(Math, objs["enemies"].map(function(o){return o.x;})) >= 460 || 
       Math.min.apply(Math, objs["enemies"].map(function(o){return o.x;})) <= 20){
        speed = -speed;
        for(var i in objs["enemies"]){
            objs["enemies"][i].x += speed;
            objs["enemies"][i].y += 10;
        }
    } else for(var i in objs["enemies"]) objs["enemies"][i].x += speed;
}

function moveBullets(){
    for(var i in objs['bullets']) objs['bullets'][i].y -= 5;
}

function checkEnd(){
    if(Math.max.apply(Math, objs["enemies"].map(function(o){return o.y;})) >= 440){
        clearInterval(screen.interval);
        gameOver();
    }
}

function gameOver(){
    console.log("GAME OVER");
}

function updateScreen() {
    screen.clear();

    checkInput();
    moveEnemies();
    moveBullets();
    checkEnd();

    // Draw all existing objects
    objs['player'].update();
    for(var i in objs['bullets']) objs['bullets'][i].update();
    for(var i in objs['enemies']) objs['enemies'][i].update();
}

