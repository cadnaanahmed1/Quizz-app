const resultsTableBody = document.querySelector("#resultsTable tbody");
const backBtn = document.getElementById("backBtn");

function loadResults() {
  let allResults = JSON.parse(localStorage.getItem("quizResults") || "[]");

  // Kala saar natiijooyinka iyadoo score-ka ugu sareeya uu yahay koowaad
  allResults.sort((a, b) => b.score - a.score);

  resultsTableBody.innerHTML = "";

  if (allResults.length === 0) {
    resultsTableBody.innerHTML = `<tr><td colspan="3">No results yet.</td></tr>`;
    return;
  }

  allResults.forEach((res, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${res.user}</td>
      <td>${res.score} / ${res.total}</td>
    `;
    resultsTableBody.appendChild(tr);
  });
}

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

loadResults();
