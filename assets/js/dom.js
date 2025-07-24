//dom.js
export const getElement = (selector) => document.querySelector(selector);
export const showElement = (element) => (element.style.display = "block");
export const hideElement = (element) => (element.style.display = "none");
export const setText = (element, text) => (element.textContent = text);

export const createAnswerButton = (text, onClick) => {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.addEventListener("click", onClick);
  return btn;
};

export const updateScoreDisplay = (scoreElement, score, total, lang = "fr") => {
  const labels = {
    fr: "Votre score",
    en: "Your score",
  };
  scoreElement.textContent = `${labels[lang] || labels.fr} : ${score} / ${total}`;
};

export const lockAnswers = (container) => {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
};

export const markCorrectAnswer = (container, correctIndex) => {
  const buttons = container.querySelectorAll("button");
  if (buttons[correctIndex]) {
    buttons[correctIndex].classList.add("correct");
  }
};

export const createSummaryTable = (
  summaryData,
  title,
  questionHeader,
  yourAnswerHeader,
  correctAnswerHeader
) => {
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("summary-table-wrapper");

  const h3 = document.createElement("h3");
  h3.textContent = title;
  tableContainer.appendChild(h3);

  const table = document.createElement("table");
  table.classList.add("summary-table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const headers = [questionHeader, yourAnswerHeader, correctAnswerHeader];
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  summaryData.forEach((item) => {
    const row = document.createElement("tr");

    const questionCell = document.createElement("td");
    questionCell.textContent = item.question;
    row.appendChild(questionCell);

    const yourAnswerCell = document.createElement("td");
    yourAnswerCell.textContent = item.yourAnswer;
    if (!item.isCorrect) {
      yourAnswerCell.classList.add("wrong-answer-summary");
    }
    row.appendChild(yourAnswerCell);

    const correctAnswerCell = document.createElement("td");
    correctAnswerCell.textContent = item.correctAnswer;
    correctAnswerCell.classList.add("correct-answer-summary");
    row.appendChild(correctAnswerCell);

    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  tableContainer.appendChild(table);

  return tableContainer;
};

export const createEndGameButton = (text, onClick) => {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.id = "end-game-btn";
  btn.classList.add("end-game-button");
  btn.addEventListener("click", onClick);
  return btn;
};