// Kaleidoscope - A gift for Queen Tora!

// Number of symmetrical segments
const symmetry = 8; // default value remains constant
let segments = symmetry; // actual value controlled by slider
let angle; // Angle of each segment

let hueValue = 0; // For cycling through colors

let symmetrySlider;
let strokeSlider;
let downloadButton;
let statusLabel;
let canvasElement;

let isFrozen = false; // Tracks whether new drawing should be paused
let hasDrawn = false;
const instructionText =
  "Move your mouse to draw patterns!\nLeft click the canvas to freeze or resume the current design.\nRight click (or two-finger tap) on the canvas to reset.\nUse the sliders to change symmetry and stroke weight.";
const backgroundColor = [10, 10, 25]; // Royal dark blue background

function resetBackground() {
  background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
}

function setup() {
  canvasElement = createCanvas(windowWidth, windowHeight).parent(
    "kaleidoscope-canvas"
  );
  angleMode(RADIANS);
  resetBackground();
  angle = TWO_PI / segments;

  // Prevent the default context menu so right-click can reset the canvas
  canvasElement.elt.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  const controls = select("#controls");
  controls.addClass("controls-panel");

  const title = createDiv("Royal Kaleidoscope").parent(controls);
  title.addClass("panel-title");

  const symmetryRow = createDiv().parent(controls);
  symmetryRow.addClass("control-row");
  createSpan("Symmetry").parent(symmetryRow).addClass("control-label");
  symmetrySlider = createSlider(2, 12, segments, 1).parent(symmetryRow);

  const strokeRow = createDiv().parent(controls);
  strokeRow.addClass("control-row");
  createSpan("Stroke Weight").parent(strokeRow).addClass("control-label");
  strokeSlider = createSlider(1, 12, 10, 0.5).parent(strokeRow);

  downloadButton = createButton("Download PNG").parent(controls);
  downloadButton.addClass("action-button");
  downloadButton.attribute("disabled", "true");
  downloadButton.mousePressed(() => {
    if (isFrozen && hasDrawn) {
      saveCanvas("kaleidoscope-pattern", "png");
    }
  });

  statusLabel = createDiv("").parent(controls);
  statusLabel.addClass("status-label");

  cursor("crosshair");

  // Display initial instructions
  displayInitialMessage();
  updateStatus();
}

function displayInitialMessage() {
  push(); // Isolate text drawing settings
  resetMatrix();
  resetBackground();
  textAlign(CENTER, CENTER);
  colorMode(RGB, 255);
  fill(220, 220, 250); // Light lavender text
  noStroke();
  textSize(16);
  text(instructionText, width / 2, height / 2);
  pop();
}

function draw() {
  segments = symmetrySlider.value();
  angle = TWO_PI / segments;
  const maxStroke = strokeSlider.value();

  if (isFrozen) {
    return;
  }

  translate(width / 2, height / 2); // Center all drawing operations

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (mouseX !== pmouseX || mouseY !== pmouseY) {
      if (!hasDrawn) {
        push();
        resetMatrix();
        resetBackground();
        pop();
        hasDrawn = true;
        updateStatus();
      }

      const mx = mouseX - width / 2;
      const my = mouseY - height / 2;
      const pmx = pmouseX - width / 2;
      const pmy = pmouseY - height / 2;

      hueValue = (hueValue + 0.8) % 360;
      let saturation = map(
        dist(mx, my, 0, 0),
        0,
        min(width, height) / 3,
        60,
        100
      ); // Use min(width,height) for more consistent saturation mapping
      saturation = constrain(saturation, 60, 100);

      const speed = dist(mx, my, pmx, pmy);
      let currentStrokeWeight = map(speed, 0, 40, 2, maxStroke);
      currentStrokeWeight = constrain(currentStrokeWeight, 1.5, maxStroke);

      colorMode(HSB, 360, 100, 100, 1.0);
      stroke(hueValue, saturation, 95, 0.65);
      strokeWeight(currentStrokeWeight);

      for (let i = 0; i < segments; i++) {
        push();
        rotate(i * angle);
        line(mx, my, pmx, pmy);
        push();
        scale(1, -1);
        line(mx, my, pmx, pmy);
        pop();
        pop();
      }
    }
  }
}

function toggleFreeze() {
  if (!hasDrawn) {
    return;
  }
  isFrozen = !isFrozen;
  updateStatus();
}

function handleReset() {
  isFrozen = false;
  hasDrawn = false;
  hueValue = random(360);
  displayInitialMessage();
  updateStatus();
}

function updateStatus() {
  if (!statusLabel || !downloadButton) {
    return;
  }

  if (isFrozen) {
    statusLabel.html(
      "Pattern frozen. Left click to resume, right click to reset, or download the PNG."
    );
    downloadButton.removeAttribute("disabled");
    cursor("not-allowed");
  } else {
    if (hasDrawn) {
      statusLabel.html(
        "Drawing live. Left click to freeze/resume, right click to reset."
      );
    } else {
      statusLabel.html(
        "Move your mouse to begin. Left click to freeze/resume, right click to reset."
      );
    }
    downloadButton.attribute("disabled", "true");
    cursor("crosshair");
  }
}

function mousePressed(event) {
  if (!event || event.target === canvasElement.elt) {
    if (mouseButton === LEFT) {
      toggleFreeze();
    } else if (mouseButton === RIGHT) {
      handleReset();
    }
    return false;
  }
}

function windowResized() {
  // Adjust canvas size to the new window dimensions
  resizeCanvas(windowWidth, windowHeight);

  // If the initial message was shown, or if the canvas is cleared,
  // redraw the background and the message.
  if (!hasDrawn) {
    displayInitialMessage();
  }
  // When art is present (frozen or not), allow it to persist through resizes.
}


