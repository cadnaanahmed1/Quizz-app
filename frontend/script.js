const createBtn = document.getElementById("createBtn");
const clearBtn = document.getElementById("clearBtn");
const viewResultsBtn = document.getElementById("viewResultsBtn");
const pinModal = document.getElementById("pinModal");
const closeModal = document.getElementById("closeModal");
const submitPinBtn = document.getElementById("submitPinBtn");
const pinInput = document.getElementById("pinInput");
const pinError = document.getElementById("pinError");

let currentAction = null; // "create" or "clear"

createBtn.addEventListener("click", () => {
  currentAction = "create";
  openModal();
});

clearBtn.addEventListener("click", () => {
  currentAction = "clear";
  openModal();
});

viewResultsBtn.addEventListener("click", () => {
  // No PIN required for viewing results
  window.location.href = "results.html";
});

closeModal.addEventListener("click", closeModalFunc);

function openModal() {
  pinInput.value = "";
  pinError.textContent = "";
  pinModal.style.display = "block";
  pinInput.focus();
}

function closeModalFunc() {
  pinModal.style.display = "none";
}

function validatePin(pin) {
  // Allowed PINs
  const allowedPins = ["45", "89", "99"];
  return allowedPins.includes(pin);
}

submitPinBtn.addEventListener("click", () => {
  const pin = pinInput.value.trim();
  if (validatePin(pin)) {
    pinError.textContent = "";
    closeModalFunc();
    if (currentAction === "create") {
      window.location.href = "create.html";
    } else if (currentAction === "clear") {
      if (confirm("Are you sure you want to clear all questions?")) {
        localStorage.removeItem("quizQuestions");
        alert("All questions cleared!");
        // Optionally refresh or update UI here
      }
    }
  } else {
    pinError.textContent = "Invalid PIN. Please try again.";
  }
});

window.onclick = function(event) {
  if (event.target == pinModal) {
    closeModalFunc();
  }
};
