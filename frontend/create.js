const questionForm = document.getElementById("questionForm");
const questionsContainer = document.getElementById("questionsContainer");
const backBtn = document.getElementById("backBtn");

// Load questions from localStorage or start empty
let questions = JSON.parse(localStorage.getItem("quizQuestions") || "[]");

// Display questions list
function displayQuestions() {
  questionsContainer.innerHTML = "";
  if (questions.length === 0) {
    questionsContainer.innerHTML = "<p>No questions added yet.</p>";
    return;
  }
  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question-item";

    div.innerHTML = `
      <div class="question-text">${index + 1}. ${q.questionText}</div>
      <ul class="answers-list">
        ${q.answers
          .map((ans, i) =>
            `<li${i === q.correctAnswer ? ' style="font-weight:bold; color:green;"' : ""}>${ans}</li>`
          )
          .join("")}
      </ul>
    `;
    questionsContainer.appendChild(div);
  });
}

// On form submit: validate and add question
questionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const questionText = document.getElementById("questionText").value.trim();
  const answerInputs = document.querySelectorAll(".answer-input");
  const correctAnswerInput = document.querySelector('input[name="correctAnswer"]:checked');

  if (!questionText) {
    alert("Please enter a question.");
    return;
  }

  const answers = [];
  for (let input of answerInputs) {
    if (!input.value.trim()) {
      alert("Please fill all answer fields.");
      return;
    }
    answers.push(input.value.trim());
  }

  if (!correctAnswerInput) {
    alert("Please select the correct answer.");
    return;
  }

  const correctAnswer = parseInt(correctAnswerInput.value, 10);

  // Create question object
  const newQuestion = {
    questionText,
    answers,
    correctAnswer,
  };

  // Add to questions array
  questions.push(newQuestion);

  // Save to localStorage
  localStorage.setItem("quizQuestions", JSON.stringify(questions));

  // Reset form
  questionForm.reset();

  // Display updated list
  displayQuestions();
});

// Back to home button
backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Initialize display on page load
displayQuestions();
