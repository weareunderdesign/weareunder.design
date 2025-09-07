

/* =========================
   COPY CODE BLOCK SECTION (Start)
   ========================= */

// Elements
const copyButton = document.getElementById('copyButton');
const copyIcon = document.getElementById('copyIcon');
const codeToCopy = document.querySelector('.code-content');

// Copy functionality
copyButton.addEventListener('click', () => {
  if (!codeToCopy) {
    console.error("Code element not found. Ensure '.code-content' exists.");
    return;
  }

  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = codeToCopy.textContent;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();

  try {
    document.execCommand('copy');

    // Success feedback
    copyIcon.classList.replace('ph-copy', 'ph-check');
    copyButton.style.color = '#22c55e'; // green-500

    setTimeout(() => {
      copyIcon.classList.replace('ph-check', 'ph-copy');
      copyButton.style.color = '#9ca3af'; // gray-400
    }, 2000);

  } catch (err) {
    console.error('Failed to copy: ', err);

    // Error feedback
    copyIcon.classList.replace('ph-copy', 'ph-x');
    copyButton.style.color = '#ef4444'; // red-500

    setTimeout(() => {
      copyIcon.classList.replace('ph-x', 'ph-copy');
      copyButton.style.color = '#9ca3af';
    }, 2000);
  } finally {
    document.body.removeChild(tempTextArea);
  }
});

/* =========================
   COPY CODE BLOCK SECTION (End)
   ========================= */





// Get all the dots and the letters element
const dots = document.querySelectorAll(".dot");
const letters = document.getElementById("letters");
const weightTextP = document.querySelector(".weight-text p:last-child");

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    // Remove active from all
    dots.forEach(d => d.classList.remove("active"));
    // Add active to clicked
    dot.classList.add("active");

    // Change font weight
    const weight = dot.getAttribute("data-weight");
    letters.style.fontWeight = weight;

    // Update the weight text
    weightTextP.textContent = weight;
  });
});












// font-weight-bar
(function () {
    const preview = document.getElementById("preview");
    const labels = document.querySelectorAll(".weights span");
    const progress = document.getElementById("rulerProgress");
    const rulerTicks = document.getElementById("rulerTicks");
    const rulerContainer = document.querySelector(".ruler-container");
    const totalSteps = labels.length - 1;

    labels.forEach(label => {
        label.addEventListener("click", () => {
            const weight = label.getAttribute("data-weight");
            const step = parseInt(label.getAttribute("data-step"));

            preview.style.fontWeight = weight;
            preview.style.color = "#FF4500";

            const percent = (step / totalSteps) * 100;
            progress.style.width = percent + "%";

            labels.forEach(l => {
                const lStep = parseInt(l.getAttribute("data-step"));
                if (lStep <= step) {
                    l.classList.add("active");
                } else {
                    l.classList.remove("active");
                }
            });

            rulerTicks.classList.add("active");
            rulerContainer.style.background = "#FF4500";
        });
    });

    const initialLabel = document.querySelector(".weights span.active");
    if (initialLabel) {
        const weight = initialLabel.getAttribute("data-weight");
        const step = parseInt(initialLabel.getAttribute("data-step"));
        preview.style.fontWeight = weight;
        preview.style.color = "#FF4500";

        labels.forEach(l => {
            const lStep = parseInt(l.getAttribute("data-step"));
            if (lStep <= step) {
                l.classList.add("active");
            } else {
                l.classList.remove("active");
            }
        });

        const percent = (step / totalSteps) * 100;
        progress.style.width = percent + "%";
        rulerTicks.classList.add("active");
        rulerContainer.style.background = "#FF4500";
    }
})();







// Keyboard Cutomizable Section
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
const symbols = "1234567890!?()#%*\\“[]:;@+,.".split("");

const glyphChar = document.getElementById("glyphChar");
const unicodeLabel = document.getElementById("unicodeLabel");
const slider = document.getElementById("weightSlider");
const weightValue = document.getElementById("weightValue");

function renderGlyphs(containerId, chars) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear existing content to prevent duplicates
  chars.forEach(ch => {
    const div = document.createElement("div");
    div.className = "glyph";
    div.textContent = ch;
    div.addEventListener("click", () => updateGlyphView(ch));
    container.appendChild(div);
  });
}

function updateGlyphView(ch) {
  glyphChar.textContent = ch;
  unicodeLabel.textContent = `uni${ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
}

function updateFontWeight(weight) {
  weightValue.textContent = weight;

  const mainGlyph = document.getElementById('glyphChar');
  if (mainGlyph) {
    mainGlyph.style.fontWeight = weight;
  }
}

slider.addEventListener("input", () => {
  updateFontWeight(slider.value);
});

renderGlyphs("uppercase", uppercase);
renderGlyphs("lowercase", lowercase);
renderGlyphs("symbols", symbols);
updateGlyphView('A'); // Set initial character
updateFontWeight(slider.value); // Set initial font weight




// Customizable Hey Section
function initFontController() {
    const componentRoot = document.getElementById('fc-component-root');

    if (!componentRoot) {
        console.error("Could not find the root element with ID 'fc-component-root'.");
        return;
    }

    // Get all relevant elements by querying within the component's root
    const output = componentRoot.querySelector('#fc-output');
    const weightRange = componentRoot.querySelector('#fc-weightRange');
    const weightValue = componentRoot.querySelector('#fc-weightValue');
    const sizeRange = componentRoot.querySelector('#fc-sizeRange');
    const sizeValue = componentRoot.querySelector('#fc-sizeValue');
    const spacingRange = componentRoot.querySelector('#fc-spacingRange');
    const spacingValue = componentRoot.querySelector('#fc-spacingValue');
    const alignButtons = componentRoot.querySelectorAll('.fc-align-btn');
    const caseButtons = componentRoot.querySelectorAll('.fc-btn[data-case]');

    // Set initial state based on default values
    function setInitialState() {
        output.style.fontVariationSettings = `"wght" ${weightRange.value}`;
        output.style.fontSize = `${sizeRange.value}px`;
        output.style.letterSpacing = `${spacingRange.value}em`;
        output.style.textAlign = 'center';
    }

    // Function to update the font weight
    weightRange.addEventListener('input', () => {
        const weight = weightRange.value;
        output.style.fontVariationSettings = `"wght" ${weight}`;
        weightValue.textContent = weight;
    });

    // Function to update the font size
    sizeRange.addEventListener('input', () => {
        const size = sizeRange.value;
        output.style.fontSize = `${size}px`;
        sizeValue.textContent = `${size} PX`;
    });

    // Function to update the letter spacing
    spacingRange.addEventListener('input', () => {
        const spacing = parseFloat(spacingRange.value).toFixed(2);
        output.style.letterSpacing = `${spacing}em`;
        spacingValue.textContent = `${spacing} EM`;
    });

    // Function to handle text alignment buttons
    alignButtons.forEach(button => {
        button.addEventListener('click', () => {
            alignButtons.forEach(btn => btn.classList.remove('fc-active'));
            button.classList.add('fc-active');
            const align = button.dataset.align;
            output.style.textAlign = align;
        });
    });

    // Function to handle text case buttons
    caseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const caseType = button.dataset.case;
            output.style.textTransform = caseType;
        });
    });

    // Initialize the UI with the default values
    setInitialState();
}

// Call the function to initialize the component when the page loads
document.addEventListener('DOMContentLoaded', initFontController);



// "A" Font Weight Section
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    // Opens the first card by default to match the image
    if (cards.length > 0) {
        cards[0].classList.add('open');
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Check if the clicked card is already open
            if (!card.classList.contains('open')) {
                // Close all other cards first
                cards.forEach(otherCard => {
                    otherCard.classList.remove('open');
                });
                // Open the clicked card
                card.classList.add('open');
            }
        });
    });
});
