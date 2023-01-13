// Render canvas element to render the applications (game scene)

// Define screen width and screen height constants

// Canvas takes up whole screen space
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const canvas = document.createElement("canvas")
canvas.setAttribute("width", SCREEN_WIDTH)
canvas.setAttribute("height", SCREEN_HEIGHT)
// Append it on the page
document.body.appendChild(canvas)

const TICK = 30;
// Allows to draw on the canvas, provides the api for it
const context = canvas.getContext("2d")

function ClearScreen(){
    context.fillStyle = "red"
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
}
function MovePlayer(){}
function GetRays(){}
function RenderScene(rays){}
function RenderMinimap(x, y, scale, rays){}

// Game and rendering logic 
function Gameloop() {
    // Clear screen and redraw with new values
    ClearScreen()

    // First person 
    MovePlayer()

    // Calculate and cast the rays and render them on the scene (3D)
    const rays = GetRays()
    RenderScene(rays)
    // Then render the rays on the minimap (receives position and scale)
    RenderMinimap(0, 0, 0.75, rays)
}

// Every tick (30ms), execute gameloop function
setInterval(Gameloop, TICK)