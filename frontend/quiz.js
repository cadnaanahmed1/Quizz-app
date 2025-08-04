const quizContainer = document.getElementById("quizContainer");
const nextBtn = document.getElementById("nextBtn");
const resultDiv = document.getElementById("result");
const backBtn = document.getElementById("backBtn");

let currentQuestionIndex = 0;
let score = 0;
let questions = JSON.parse(localStorage.getItem("quizQuestions") || "[]");

// --- Helper: Magaca user-ka / session ---
function getUserName() {
  // Haddii user login system la sameeyo, halkan magaca user ayaa laga soo qaadi karaa
  // Hadda ku samee static value tusaale ahaan:
  let user = localStorage.getItem("quizUserName");
  if (!user) {
    user = prompt("Please enter your name:");
    if (!user) user = "Guest_" + Math.floor(Math.random() * 1000);
    localStorage.setItem("quizUserName", user);
  }
  return user;
}

// --- Save result to localStorage ---
function saveResult(user, score, total) {
  let allResults = JSON.parse(localStorage.getItem("quizResults") || "[]");

  // Haddii user horey u leeyahay score, update garee hadii score cusub ka sarreeyo
  const existingIndex = allResults.findIndex(r => r.user === user);
  if (existingIndex > -1) {
    if (score > allResults[existingIndex].score) {
      allResults[existingIndex].score = score;
      allResults[existingIndex].total = total;
    }
  } else {
    allResults.push({ user, score, total });
  }

  localStorage.setItem("quizResults", JSON.stringify(allResults));
}

function showQuestion(index) {
  const question = questions[index];
  quizContainer.innerHTML = "";

  const qText = document.createElement("h3");
  qText.textContent = `${index + 1}. ${question.questionText}`;
  quizContainer.appendChild(qText);

  question.answers.forEach((answer, i) => {
    const label = document.createElement("label");
    label.className = "answer";
    label.textContent = answer;
    label.dataset.index = i;

    label.addEventListener("click", () => {
      // Disable all answers clicks after selection
      Array.from(quizContainer.querySelectorAll(".answer")).forEach(a => {
        a.style.pointerEvents = "none";
        a.classList.remove("correct", "wrong");
      });

      if (i === question.correctAnswer) {
        label.classList.add("correct");
        score++;
      } else {
        label.classList.add("wrong");
        // Highlight correct answer too
        const correctLabel = quizContainer.querySelector(`[data-index='${question.correctAnswer}']`);
        if(correctLabel) correctLabel.classList.add("correct");
      }

      nextBtn.disabled = false;
    });

    quizContainer.appendChild(label);
  });

  nextBtn.disabled = true;
  resultDiv.textContent = "";
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);
  } else {
    quizContainer.innerHTML = "";
    nextBtn.style.display = "none";

    const user = getUserName();
    saveResult(user, score, questions.length);

    resultDiv.textContent = `Your score: ${score} / ${questions.length}`;
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Initialize quiz
if (questions.length === 0) {
  quizContainer.innerHTML = "<p>No questions found. Please add questions first.</p>";
  nextBtn.style.display = "none";
} else {
  showQuestion(currentQuestionIndex);
}
