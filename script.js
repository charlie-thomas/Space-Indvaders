var screen = {
    canvas: document.getElementById("canvas"),
    start: function(){
            console.log("hi");
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGameArea, 20);
        },
    clear:  function(){
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

}

function startGame(){
    var player = new component(10, 120);
    screen.start();
}

function component(x, y){
    this.update = function(){ 
        console.log(screen.context);
        console.log(screen.canvas.context);
        ctx = screen.cavas.context;
        ctx.fillStyle = "red";
        ctx.fillRect(x, y, 30, 30);
    }
}

function updateGameArea() {
    screen.clear();
    player.update();
}

startGame();