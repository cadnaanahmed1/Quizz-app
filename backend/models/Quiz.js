const quizContainer = document.getElementById("quizContainer");
const nextBtn = document.getElementById("nextBtn");
const resultDiv = document.getElementById("result");

let quizzes = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch quizzes from backend
async function fetchQuizzes() {
  try {
    const res = await fetch("http://localhost:5000/api/quizzes");
    quizzes = await res.json();
    showQuestion();
  } catch (error) {
    quizContainer.innerHTML = "<p>Error loading quizzes. Try again later.</p>";
  }
}

// Show current question
function showQuestion() {
  nextBtn.disabled = true;
  const quiz = quizzes[currentQuestionIndex];
  if (!quiz) {
    showResult();
    return;
  }
  
  let html = `<h2>${quiz.question}</h2>`;
  quiz.options.forEach((option, i) => {
    html += `
      <label class="answer" onclick="selectAnswer(${i})">
        <input type="radio" name="option" value="${i}" /> ${option}
      </label>
    `;
  });
  quizContainer.innerHTML = html;
}

function selectAnswer(selectedIndex) {
  nextBtn.disabled = false;

  const quiz = quizzes[currentQuestionIndex];
  const labels = document.querySelectorAll(".answer");

  labels.forEach((label, i) => {
    label.classList.remove("correct", "wrong");
    if (i === selectedIndex) {
      if (i === quiz.correctAnswer) {
        label.classList.add("correct");
        score++;
      } else {
        label.classList.add("wrong");
      }
    }
  });
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizzes.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizContainer.innerHTML = "";
  nextBtn.style.display = "none";
  resultDiv.textContent = `Your score: ${score} / ${quizzes.length}`;

  // Send result to backend
  const username = prompt("Please enter your name for the leaderboard:");
  if (username) {
    sendResult(username, score);
  }
}

async function sendResult(username, score) {
  try {
    await fetch("http://localhost:5000/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, score }),
    });
    alert("Result saved successfully!");
  } catch (error) {
    alert("Error saving result.");
  }
}

// Start quiz
fetchQuizzes();
