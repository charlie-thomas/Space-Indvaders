var screen = {
    canvas: document.getElementById("canvas"),
    start: function(){
            this.canvas.width = 500;
            this.canvas.height = 500;
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGameArea, 20);
        },
    clear:  function(){
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
}
var player;
var ctx = screen.canvas.getContext("2d");

function startGame(){
    player = new component(250, 250, playerImg);
    screen.start();
}

function component(x, y, image, h, w){
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx.drawImage(image,this.x,this.y);
    }
}

function updateGameArea() {
    screen.clear();
    player.x += 1;
    player.update();
}

startGame();