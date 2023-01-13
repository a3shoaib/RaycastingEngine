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
