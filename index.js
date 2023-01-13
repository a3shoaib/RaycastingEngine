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

// Field of view
const FOV = ToRadians(60);

// Object to hold color scheme
const COLORS = {
    rays: "#ffa600"
}

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

function MovePlayer(){
    // Calculate movement
    player.x += Math.cos(player.angle) * player.speed
    player.y += Math.sin(player.angle) * player.speed
}

function OutOfMapBounds(x, y) {
    // If x is more than the amount of cells in the row
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length
}

// Calculate distance
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function GetVCollision (angle) {
    // Check if facing right
    const right = Math.abs(Math.floor((angle-Math.PI/2) / Math.PI) % 2)
    // Calculate first X intersection
    const FirstX = right ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE : Math.floor(player.x / CELL_SIZE) * CELL_SIZE
    const FirstY = player.y + (FirstX - player.x) * Math.tan(angle)

    // Horizontal step
    const xA = right ? CELL_SIZE : -CELL_SIZE
    // Vertical step
    const yA = xA * Math.tan(angle)

    // Check if there is a wall on any of the intersection points
    let wall;
    let NextX = FirstX;
    let NextY = FirstY;

    // While there is no wall
    while(!wall){
        // Calculate map coordinates
        const CellX = right ? Math.floor(NextX / CELL_SIZE) : Math.floor(NextX / CELL_SIZE) - 1
        const CellY = Math.floor(NextY / CELL_SIZE)

        if (OutOfMapBounds(CellX, CellY)) {
            break 
        }
        // Otherwise get next wall point
        wall = map[CellY][CellX]
        if(!wall) {
            // Append step
            NextX += xA
            NextY += yA
        }
    }
    // Finish because broke out or there was a wall
    // Return new object that is new ray 
    return { angle, distance: distance(player.x, player.y, NextX, NextY), vertical: true }
}

function GetHCollision(angle) {
    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    const FirstY = up ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE

    const FirstX = player.x + (FirstY - player.y) / Math.tan(angle);

    const yA = up ? -CELL_SIZE : CELL_SIZE;
    const xA = yA / Math.tan(angle);

    let wall;
    let NextX = FirstX;
    let NextY = FirstY;

    while(!wall){
        const CellX = Math.floor(NextX / CELL_SIZE);
        const CellY = up ? Math.floor(NextY / CELL_SIZE) -1 : Math.floor(NextY / CELL_SIZE);

        if (OutOfMapBounds(CellX, CellY)) {
            break;
        }

        wall = map[CellY][CellX];
        if(!wall) {
            NextX += xA
            NextY += yA
        }
    }
    return {
        angle, 
        distance: distance(player.x, player.y, NextX, NextY),
        vertical: false,
    };
}

function CastRay(angle) {
    // Calculate nearest intersection by checking each row and column if there is a wall 
    const vCollission = GetVCollision(angle)
    const hCollission = GetHCollision(angle)

    // Return the one with smallest value for distance
    return hCollission.distance >= vCollission.distance ? vCollission : hCollission;
}



// Cast rays 
function GetRays(){
    // Calculating distance to the nearest obstacle from the player
    // Begin casting rays from initial angle (player angle - 1/2 field of view)
    const InitialAngle = player.angle - FOV / 2;
    // Shoot rays from the player angle, #column number of times
    const NumbeOfRays = SCREEN_WIDTH;
    // Increment for each of the projected rays
    const AngleStep = FOV / NumbeOfRays;
    // Map thru the number of array  and populate it with values (object containing angle and distance to nearest obstacle)
    return Array.from({ length: NumbeOfRays }, (_, i) => {
        const angle = InitialAngle + i * AngleStep;
        const ray = CastRay(angle)
        return ray
    })
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

    // Render rays
    context.strokeStyle = COLORS.rays;
    rays.forEach(ray => {
        // Begin a new path for each ray
        context.beginPath()
        // Move to initial position of the player since all rays will be projected from the player
        context.moveTo(player.x * scale + posX, player.y * scale + posY)
        // Draw line to final destination point
        context.lineTo(
            // Calculate x portion of line (each ray has direction and distance between the player and nearest obstacle )
            (player.x + Math.cos(ray.angle) * ray.distance) *  scale, 
            (player.y + Math.sin(ray.angle) * ray.distance) *  scale,
        )
        context.closePath()
        context.stroke()
    })

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

function ToRadians (deg) {
    return (deg * Math.PI) / 180
}

// Implement player movements
// Add event listeners for up and down arrow keys
document.addEventListener("keydown", (e) => {
    if(e.key == "ArrowUp") {
        player.speed = 2;
    }
    if(e.key == "ArrowDown") {
        player.speed = -2;
    }
})

document.addEventListener("keyup", (e) => {
    if(e.key == 'ArrowUp' || e.key == "ArrowDown") {
        player.speed = 0;
    }
})

// Calculate direction of the player by tracking mouse movement 
document.addEventListener("mousemove", (e) => {
    player.angle += ToRadians(e.movementX)
}) 