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
        fire();
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

function updateScreen() {
    screen.clear();

    checkInput();

    // Draw all existing objects
    objs['player'].update();
    for(var i in objs['enemies']) objs['enemies'][i].update();
}

