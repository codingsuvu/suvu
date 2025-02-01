// script.js

// Canvas Drawing Logic
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const toolSelect = document.getElementById("toolSelect");
const colorPicker = document.getElementById("colorPicker"); // Color picker input

let painting = false;
let currentTool = "pencil"; // Default tool

// Tool-specific settings
const toolSettings = {
    pen: { lineWidth: 1, lineCap: "round" },
    pencil: { lineWidth: 2, lineCap: "round" },
    marker: { lineWidth: 10, lineCap: "square", globalAlpha: 0.5 },
    paintbrush: { lineWidth: 15, lineCap: "round", blur: 10 }, // Paintbrush tool with soft blur
    brush: { density: 20, lineWidth: 10, size: 30 }, // Brush tool with scatter effect and size
    text: { font: "20px Arial" }
};

// Set the current tool based on the selected option
function setTool() {
    currentTool = toolSelect.value; // Get the selected tool from the dropdown
    canvas.style.cursor = currentTool === "text" ? "text" : "crosshair";
}

// Get mouse/touch position
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
        y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    };
}

// Start drawing or adding text
function startPosition(e) {
    e.preventDefault();
    painting = true;
    const pos = getPosition(e);

    if (currentTool === "text") {
        const text = prompt("Enter your text:", "Hello");
        if (text) {
            ctx.font = toolSettings.text.font;
            ctx.fillStyle = colorPicker.value; // Use selected color for text
            ctx.fillText(text, pos.x, pos.y);
        }
        painting = false; // Text is added instantly, so stop painting
    } else {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }
}

// Stop drawing
function endPosition() {
    painting = false;
    ctx.beginPath();
}

// Draw based on the selected tool
function draw(e) {
    if (!painting || currentTool === "text") return; // Skip drawing for text tool
    e.preventDefault();
    const pos = getPosition(e);

    if (currentTool === "brush") {
        drawBrush(pos);
        return;
    }

    // Apply tool-specific settings
    const tool = toolSettings[currentTool];
    ctx.lineWidth = tool.lineWidth;
    ctx.lineCap = tool.lineCap;
    ctx.strokeStyle = colorPicker.value; // Use selected color for drawing
    ctx.globalAlpha = tool.globalAlpha || 1; // Default to fully opaque if not set

    // Paintbrush Effect: Add blur for a soft stroke
    if (currentTool === "paintbrush") {
        ctx.shadowBlur = tool.blur;
        ctx.shadowColor = ctx.strokeStyle;
    } else {
        ctx.shadowBlur = 0; // Remove blur for other tools
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Brush tool function (Scatter effect)
function drawBrush(pos) {
    const brush = toolSettings.brush;
    ctx.fillStyle = colorPicker.value;

    for (let i = 0; i < brush.density; i++) {
        const offsetX = Math.random() * brush.size - brush.size / 2;
        const offsetY = Math.random() * brush.size - brush.size / 2;
        ctx.fillRect(pos.x + offsetX, pos.y + offsetY, 2, 2);
    }
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Mouse events
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch events (for mobile support)
canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", endPosition);
canvas.addEventListener("touchmove", draw);

// Tool selection dropdown event
toolSelect.addEventListener("change", setTool);

// Embed Ads
function embedAd() {
    const adPlaceholder = document.getElementById("adPlaceholder");

    // Example: Embedding a placeholder ad (replace with actual ad code)
    adPlaceholder.innerHTML = `
        <img src="https://via.placeholder.com/300x250" alt="Advertisement">
        <p>Sample Ad</p>
    `;
}

// Call the function to embed the ad
embedAd();
