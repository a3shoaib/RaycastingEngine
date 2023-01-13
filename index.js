// Render canvas element to render the applications (game scene)

// Define screen width and screen height constants

// Canvas takes up whole screen space
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const canvas = document.createElement("canvas");
canvas.setAttribute("width", SCREEN_WIDTH);
canvas.setAttribute("height", SCREEN_HEIGHT);
// Append it on the page
document.body.appendChild(canvas);

const TICK = 30;
// Allows to draw on the canvas, provides the api for it
const context = canvas.getContext("2d")
// For map representation to render it
const CELL_SIZE = 60;
// Constant to hold player size
const PLAYER_SIZE = 8;

// Each row will contain horizontal cells and main array will be array of those rows
// 1 for wall, 0 for empty cells
const map = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1], 
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
];

// For player position, velocity, and direction/angle (in radians)
const player = {
    // Obtain the position in terms of the map (each cell is 64 units)
    // Located in the middle of the second cell (1,1)
    x: CELL_SIZE * 1.5,
    // (1,2)
    y: CELL_SIZE * 2, 
    angle: 0,
    speed: 0
};

function ClearScreen(){
    context.fillStyle = "red";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function MovePlayer(){}
function GetRays(){
    return [];
}
function RenderScene(rays){}
// x,y positions of the minimap on the screen, scale of map projection, rays is the array of rays
function RenderMinimap(posX = 0, posY = 0, scale = 1, rays){
    // Render cells
    const CellSize = scale * CELL_SIZE;
    // Loop through the map, y is index of the row
    map.forEach((row, y) => {
        // Loop through each cell
        row.forEach((cell, x) =>{
            if (cell) {
                context.fillStyle = "grey";
                context.fillRect(posX + x * CellSize, posY + y * CellSize, CellSize, CellSize)
            };
        });
    });

    context.fillStyle = "blue"
    context.fillRect(
        posX + player.x * scale - PLAYER_SIZE/2,
        posY + player.y * scale - PLAYER_SIZE/2,
        // Width
        PLAYER_SIZE,
        PLAYER_SIZE
    )
    // Ray represents the direction of the player (projected from player)
    const RayLength = PLAYER_SIZE * 2;
    context.strokeStyle = "blue"
    context.beginPath()
    // Move to player position
    context.moveTo(player.x * scale + posX, player.y * scale + posY)
    // Render the line
    context.lineTo(
        // Calculate length of ray on the x axis from the player angle
        (player.x + Math.cos(player.angle) * RayLength) *  scale, 
        (player.y + Math.sin(player.angle) * RayLength) *  scale, 
    )
    context.closePath()
    context.stroke()
}

// Game and rendering logic 
function Gameloop() {
    // Clear screen and redraw with new values
    ClearScreen();

    // First person 
    MovePlayer();

    // Calculate and cast the rays and render them on the scene (3D)
    const rays = GetRays();
    RenderScene(rays);
    // Then render the rays on the minimap (receives position and scale)
    RenderMinimap(0, 0, 0.75, rays);
}

// Every tick (30ms), execute gameloop function
setInterval(Gameloop, TICK);