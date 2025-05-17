// Kaleidoscope - A gift for Queen Tora!

// Number of symmetrical segments
let symmetry = 8;
let angle; // Angle of each segment

let hueValue = 0; // For cycling through colors

// To display an initial message
let hasDrawn = false;
const instructionText =
  "Move your mouse to draw patterns!\nClick to clear the canvas.";
const backgroundColor = [10, 10, 25]; // Royal dark blue background

function setup() {
  // Make the canvas fill the entire window
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
  angle = TWO_PI / symmetry;

  // Display initial instructions
  displayInitialMessage();
}

function displayInitialMessage() {
  push(); // Isolate text drawing settings
  // Ensure text is drawn without being affected by current transformations from draw() if called later
  resetMatrix();
  textAlign(CENTER, CENTER);
  fill(220, 220, 250); // Light lavender text
  noStroke();
  textSize(16);
  // Use width and height which are now set to windowWidth/Height by createCanvas
  text(instructionText, width / 2, height / 2);
  pop();
}

function draw() {
  translate(width / 2, height / 2); // Center all drawing operations

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (mouseX !== pmouseX || mouseY !== pmouseY) {
      if (!hasDrawn) {
        push();
        resetMatrix();
        background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
        pop();
        hasDrawn = true;
      }

      let mx = mouseX - width / 2;
      let my = mouseY - height / 2;
      let pmx = pmouseX - width / 2;
      let pmy = pmouseY - height / 2;

      hueValue = (hueValue + 0.8) % 360;
      let saturation = map(
        dist(mx, my, 0, 0),
        0,
        min(width, height) / 3,
        60,
        100
      ); // Use min(width,height) for more consistent saturation mapping
      saturation = constrain(saturation, 60, 100);

      let speed = dist(mx, my, pmx, pmy);
      let currentStrokeWeight = map(speed, 0, 40, 2, 10);
      currentStrokeWeight = constrain(currentStrokeWeight, 1.5, 12);

      colorMode(HSB, 360, 100, 100, 1.0);
      stroke(hueValue, saturation, 95, 0.65);
      strokeWeight(currentStrokeWeight);

      for (let i = 0; i < symmetry; i++) {
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

function mousePressed() {
  push();
  resetMatrix();
  background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
  pop();

  hasDrawn = true; // Drawing will re-commence
  hueValue = random(360);

  // If you'd like the instructions to reappear on clear, you'd set hasDrawn = false;
  // and then call displayInitialMessage();
  // For now, clicking clears to a blank canvas ready for new art.
}

function windowResized() {
  // Adjust canvas size to the new window dimensions
  resizeCanvas(windowWidth, windowHeight);

  // If the initial message was shown, or if the canvas is cleared,
  // redraw the background and the message.
  if (!hasDrawn) {
    // Background needs to cover the new size, and text needs to be re-centered.
    displayInitialMessage(); // This function now handles background & text correctly
  } else {
    // If a drawing was in progress, resizing will change the canvas dimensions.
    // The existing drawing remains, and new lines will be drawn relative to the new center.
    // For a cleaner experience on resize when art is present, you could clear it:
    // (This is the same as mousePressed essentially)
    // push();
    // resetMatrix();
    // background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
    // pop();
    // hueValue = random(360); // Optional: reset color cycle
    // However, allowing the art to persist and grow into the new space can also be interesting!
    // For now, it persists. The background is NOT automatically redrawn here if hasDrawn is true,
    // so the existing pattern remains.
  }
}
