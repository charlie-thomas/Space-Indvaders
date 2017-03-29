var screen = {
    canvas: document.getElementById("canvas"),
    start: function(){
            this.canvas.width = 500;
            this.canvas.height = 500;
        },
    clear:  function(){
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
}
var ctx = screen.canvas.getContext("2d");

var objs = {};
var keysDown = {};
var screenLeft = 5;
var screenRight = 445;
var anim = true;
var level = 1;
var fireBool = true;
var speed, score, gameInterval;

function startGame(){
    screen.clear();

    gameInterval = setInterval(updateScreen, 20);

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

    // Set interval for enemy animations
    setInterval(function(){anim = !anim}, 400);

    score = 0;
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

function createEnemies(){
    speed = 0.5*level;
    for(var i=1; i<11; i++){
        objs['enemies'].push(new component((i*43)+6, 50, enemy1, enemy1_2, 20, 19))
        objs['enemies'].push(new component((i*43)+5, 80, enemy2, enemy2_2, 22, 16))
        objs['enemies'].push(new component((i*43)+5, 110, enemy2, enemy2_2, 22, 16))
        objs['enemies'].push(new component((i*43)+5, 140, enemy3, enemy3_2, 24, 16))
        objs['enemies'].push(new component((i*43)+5, 170, enemy3, enemy3_2, 24, 16))
    }
}
function createObjects(){
    objs['player'] = new component(230,450, playerImg, playerImg, 15);
    objs['enemies'] = [];
    objs['bullets'] = [];
    objs['particles'] = [];
    createEnemies();
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
    for(var i in objs['bullets']){
        objs['bullets'][i].y -= 5;
         if(objs['bullets'][i].y < -10) objs['bullets'].splice(i, 1);
    }
}

function checkHits(){
    for(var i in objs['bullets']){
        var bul = objs['bullets'][i];
        for(var j in objs['enemies']){
            var enemy = objs['enemies'][j];
            if(bul.x < (enemy.x + enemy.w) && bul.x + 2 > enemy.x && 
               bul.y < (enemy.y + enemy.h) && bul.y + 10 > enemy.y){
                explosion(enemy.x + enemy.w/2, enemy.y + enemy.h/2, "white");
                objs['bullets'].splice(i, 1);
                objs['enemies'].splice(j, 1);
                score += 10*level;
            }
        }
    }
}

function explosion(x, y, colour){
    for(var i=0; i<60; i++){
        var particle = {
			x: x,
			y: y,
			volx: ((Math.random()*10)+3) * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
			voly: ((Math.random()*10)+3) * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
			colour: colour
		}
		
		objs['particles'].push(particle);
    }
}

function moveParticles(){
    console.log(objs['particles']);
    for(var i in objs['particles']){
        var p = objs['particles'][i];
        ctx.beginPath();
        ctx.rect(p.x, p.y, 4, 4);
        ctx.fillStyle = p.colour;
        ctx.fill();
        p.x += p.volx;
        p.y += p.voly;

        if(p.x < -20 || p.x > 520 || p.y < -20 || p.y > 520) objs['particles'].splice(i, 1);
    }
}

function updateShip(){
    var prob = Math.floor.apply(Math.random()*5000);
}

function checkEnd(){
    if(Math.max.apply(Math, objs["enemies"].map(function(o){return o.y;})) >= 440){
        gameOver();
    } else if ( objs['enemies'].length == 0){
        level += 1;
        createEnemies();
    }
}

function gameOver(){
    clearInterval(gameInterval);
    screen.clear();
    var flash = true;
    var textAnim = setInterval(function(){
        screen.clear();

        ctx.font="40px Lucida Console";
		ctx.fillStyle= "white";
		ctx.textAlign="center"
		ctx.fillText("Game Over!",250,170);
		
		ctx.font="30px Lucida Console";
		ctx.fillStyle= "white";
		ctx.textAlign="center"
		ctx.fillText("SCORE: "+score,250,250);

        if(flash){
            ctx.font="25px Lucida Console";
            ctx.fillStyle= "rgb(11,204,0)";
            ctx.textAlign="center"
            ctx.fillText("Press Enter to Reset",250,290);
            flash = false;
        } else flash = true;
    }, 500);

    document.addEventListener("keydown",keyDownHandler, false);	
    function keyDownHandler(e) {
        if(e.keyCode == 13 ){
            document.removeEventListener("keydown",keyDownHandler, false);
            homeScreen();
            clearInterval(textAnim);
        }
    }
}

function drawObjects(){
    objs['player'].update();
    for(var i in objs['bullets']) objs['bullets'][i].update();
    for(var i in objs['enemies']) objs['enemies'][i].update();
}

function scoreText(){
    ctx.font="20px Lucida Console";
    ctx.fillStyle= "white";
    ctx.textAlign="left";
    ctx.fillText("SCORE: "+score,10,30);
}

function homeScreen(){
    screen.start();
    screen.clear();

    var flash = true;

    var textAnim = setInterval(function(){
        screen.clear();

        ctx.font="40px Lucida Console";
        ctx.fillStyle= "white";
        ctx.textAlign="center"
        ctx.fillText("Space Invaders",250,170);

        ctx.font="10px Lucida Console";
        ctx.fillStyle= "white";
        ctx.textAlign="center"
        ctx.fillText("Arrow Keys: Move",175,400);
        ctx.fillText("Space: Shoot",325,400);

        if(flash) {
            ctx.font="25px Lucida Console";
            ctx.fillStyle= "rgb(11,204,0)";
            ctx.textAlign="center"
            ctx.fillText("Press Enter to Play",250,275);
            flash = false;
        } else flash = true;
    },500);

    document.addEventListener("keydown",keyDownHandler, false);	
    function keyDownHandler(e) {
        if(e.keyCode == 13 ){
            document.removeEventListener("keydown",keyDownHandler, false);
            startGame();
            clearInterval(textAnim);
        }
    }
}

function updateScreen() {
    screen.clear();

    scoreText();
    checkInput();
    moveEnemies();
    moveBullets();
    checkHits();   
    moveParticles();
    createBus();
    checkEnd();

    drawObjects();
}

