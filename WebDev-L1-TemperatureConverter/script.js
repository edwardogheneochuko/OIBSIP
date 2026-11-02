// =========================================================
// Temperature Converter — logic
// =========================================================

// ---- Grab elements ----
const form = document.getElementById("converter-form");
const input = document.getElementById("temp-input");
const errorMessage = document.getElementById("error-message");
const resetBtn = document.getElementById("reset-btn");
const results = document.querySelector(".results");
const resultCards = document.querySelectorAll(".result");
const feel = document.getElementById("feel");

const outputs = {
  C: document.getElementById("out-c"),
  F: document.getElementById("out-f"),
  K: document.getElementById("out-k"),
};

// Absolute zero in each unit: nothing can be colder than this
const ABSOLUTE_ZERO = { C: -273.15, F: -459.67, K: 0 };
const UNIT_SYMBOL = { C: "°C", F: "°F", K: "K" };

// ---- Conversion helpers ----
// Step 1: turn any input into Celsius
function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value; // already Celsius
}

// Step 2: from Celsius, work out all three units
function fromCelsius(celsius) {
  return {
    C: celsius,
    F: celsius * 9 / 5 + 32,
    K: celsius + 273.15,
  };
}

// Show up to 2 decimal places, without trailing zeros (e.g. 98.6, not 98.60)
function format(number) {
  const rounded = Math.round(number * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

// ---- Validation ----
// Accepts things like: 25, -40, 36.6, .5, +12. Rejects: abc, 12abc, 1.2.3, empty
const NUMBER_PATTERN = /^[-+]?(\d+\.?\d*|\.\d+)$/;

function showError(message) {
  errorMessage.textContent = message;
  input.classList.add("invalid");
  clearResults();
}

function clearError() {
  errorMessage.textContent = "";
  input.classList.remove("invalid");
}

function clearResults() {
  Object.values(outputs).forEach((el) => (el.textContent = "--"));
  resultCards.forEach((card) => card.classList.remove("source"));
  feel.innerHTML = "Enter a value and press <strong>Convert</strong>.";
}

// A friendly description based on the Celsius value
function describe(celsius) {
  if (celsius <= 0) return "🥶 At or below freezing point of water";
  if (celsius < 15) return "🧥 Cold";
  if (celsius < 25) return "🙂 Mild and comfortable";
  if (celsius < 35) return "☀️ Warm";
  if (celsius < 100) return "🔥 Hot";
  return "♨️ At or above boiling point of water";
}

// ---- Main convert function ----
function convert() {
  const raw = input.value.trim();
  const unit = document.querySelector('input[name="unit"]:checked').value;

  // 1. Empty input
  if (raw === "") {
    showError("Please enter a temperature value.");
    return;
  }

  // 2. Non-numeric input
  if (!NUMBER_PATTERN.test(raw)) {
    showError("That's not a valid number. Use digits only, e.g. 25 or -10.5");
    return;
  }

  const value = parseFloat(raw);

  // 3. Below absolute zero (impossible temperature)
  if (value < ABSOLUTE_ZERO[unit]) {
    showError(
      `${value}${UNIT_SYMBOL[unit]} is below absolute zero (${ABSOLUTE_ZERO[unit]}${UNIT_SYMBOL[unit]}). ` +
      "Nothing can be colder than that!"
    );
    return;
  }

  // 4. Valid: convert and display
  clearError();
  const celsius = toCelsius(value, unit);
  const converted = fromCelsius(celsius);

  for (const key in outputs) {
    outputs[key].textContent = format(converted[key]);
  }

  // Dim the card for the unit the user typed in, so the converted values stand out
  resultCards.forEach((card) => {
    card.classList.toggle("source", card.dataset.unit === unit);
  });

  feel.innerHTML = `<strong>${describe(celsius)}</strong>`;

  // Re-trigger the little "pop" animation
  results.classList.remove("updated");
  void results.offsetWidth;
  results.classList.add("updated");
}

// ---- Event listeners ----
// Clicking Convert (or pressing Enter) submits the form
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  convert();
});

// Clear the error as soon as the user starts fixing their input
input.addEventListener("input", clearError);

resetBtn.addEventListener("click", () => {
  input.value = "";
  document.getElementById("unit-c").checked = true;
  clearError();
  clearResults();
  input.focus();
});
