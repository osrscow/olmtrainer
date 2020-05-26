const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const headcanvas = document.getElementById('olmheadcanvas');
const headctx = headcanvas.getContext('2d');

const gridHeight = 3;
const gridWidth = 13; // should be bigger
const tileSize = 64;

canvas.width = gridWidth * tileSize;
canvas.height = gridHeight * tileSize;
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

function initSize(_canvas) {
    let scale = window.devicePixelRatio;
    _canvas.width = Math.floor(_canvas.width * scale);
    _canvas.height = Math.floor(_canvas.height * scale);
}

var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
initSize(canvas);
initSize(headcanvas)

var player = { x: 12, y: 0};
var playerDest = JSON.parse(JSON.stringify(player));

var safespots = [0, 5, 7, 12];

// Olm stuff
var attacks = ['attack', 'special', 'attack', 'empty'];
var dirs = ['left', 'middle', 'right']
var olm = { atk : 0, dir : 1, attacking : false};

function draw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            ctx.beginPath();
            ctx.rect(x*tileSize, y*tileSize,  tileSize-1, tileSize-1);
            if (safespots.includes(x))
                ctx.fillStyle = '#ADD8E6A0';
            else
                ctx.fillStyle = 'white';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            if (x == player.x && y == player.y) {
                ctx.beginPath();
                ctx.arc(x*tileSize + tileSize/2, y*tileSize + tileSize/2, tileSize/2, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'green';
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#003300';
                ctx.stroke();
            }
        }
    }

    // Draw olm head
    
    headctx.beginPath();
    headctx.rect(0, 0,  headcanvas.width, headcanvas.height);
    headctx.fillStyle = 'white';
    headctx.fill();
    headctx.lineWidth = 1;
    headctx.strokeStyle = 'black';
    headctx.stroke();

    ctx.font = '35pt bold arial';
    headctx.fillStyle = 'black';
    headctx.lineWidth = 3;
    if (olm.attacking)
        headctx.fillText(attacks[olm.atk % 4], headcanvas.width / 2, headcanvas.height / 3);
    headctx.fillText(dirs[olm.dir % 4], headcanvas.width / 2, 2 * headcanvas.height / 3);
}

draw(ctx);

function isVisible() {
    if (olm.dir == 0)
        return player.x < safespots[2];
    if (olm.dir == 1)
        return !(player.x <= safespots[0] || player.x >= safespots[3]);
    if (olm.dir == 2)
        return player.x > safespots[1];
}

function attack() {
    olm.atk++;
    if (isVisible()) {
        olm.attacking = true;
        return;
    }

    if (olm.dir == 2)
        olm.dir = 1;
    else if (olm.dir == 0)
        olm.dir = 1;
    else if (player.x <= safespots[0])
        olm.dir = 0;
    else if (player.x >= safespots[3])
        olm.dir = 2;
}

var t = 1;
function tick(){
    t++;
    //console.log('tick' + t);
    draw(ctx);
    // 2x moves for run
    if (t%4 == 0) {
        attack();
    }
    else olm.attacking = false;
    move();
    move();
}

function move() {
    let dx = playerDest.x - player.x;
    let dy = playerDest.y - player.y;
    if (dx == 0 && dy == 0)
        return;

    if (Math.abs(dx) > Math.abs(dy))
        player.x += Math.sign(dx);
    else if (Math.abs(dy) > Math.abs(dx))
        player.y += Math.sign(dy);
    else {
        player.x += Math.sign(dx);
        player.y += Math.sign(dy);
    }
}

function click(event) {
    console.log(event.offsetX, event.offsetY);
    let x = event.offsetX * scale;
    let y = event.offsetY * scale;
    playerDest.x = Math.floor(x / tileSize);
    playerDest.y = Math.floor(y / tileSize);
}

canvas.addEventListener('click', click, false);

window.setInterval(tick, 600);