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

    createObjects();
}

function component(x, y, image, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.update = function(){
        ctx.drawImage(image,this.x,this.y);
    }
}

function createObjects(){
    objs['player'] = new component(230, 440, playerImg, 15);
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
        objs['player'].x -= 2;
    } else {
        objs['player'].x += 2;
    }
}

function updateScreen() {
    screen.clear();

    checkInput();
    // Draw all existing objects
    for(var i in objs) objs[i].update();
}

