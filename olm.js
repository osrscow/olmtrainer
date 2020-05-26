const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gridHeight = 3
const gridWidth = 13 // should be bigger
const tileSize = 48

canvas.width = gridWidth * tileSize
canvas.height = gridHeight * tileSize

function drawGrid(ctx) {
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            ctx.strokeRect(x * tileSize, y*tileSize, tileSize - 1, tileSize - 1);
        }
    }
}

drawGrid(ctx);