//quiz.js
import {
  getElement,
  showElement,
  hideElement,
  setText,
  createAnswerButton,
  updateScoreDisplay,
  lockAnswers,
  markCorrectAnswer,
  createSummaryTable,
  createEndGameButton, // Importez la nouvelle fonction
} from "./dom.js";

import {
  loadFromLocalStorage,
  saveToLocalStorage,
  startTimer,
} from "./utils.js";

console.log("Quiz JS loaded...");

const uiText = {
  fr: {
    title: "Quiz Dynamique",
    introNotice: "Testez vos connaissances en quelques questions chronométrées !",
    bestScore: "Meilleur score",
    start: "Commencer le quiz",
    question: "Question",
    timeLeft: "Temps restant",
    next: "Question suivante",
    resultTitle: "Résultat final",
    yourScore: "Votre score",
    restart: "Recommencer",
    selectLanguage: "Choisir la langue",
    summaryTableTitle: "Récapitulatif des réponses",
    summaryQuestion: "Question",
    summaryYourAnswer: "Votre réponse",
    summaryCorrectAnswer: "Bonne réponse",
    infiniteMode: "Mode Infini", // Nouveau texte
    endGame: "Terminer la partie", // Nouveau texte
  },
  en: {
    title: "Dynamic Quiz",
    introNotice: "Test your knowledge with a few timed questions!",
    bestScore: "Best score",
    start: "Start the quiz",
    question: "Question",
    timeLeft: "Time left",
    next: "Next question",
    resultTitle: "Final result",
    yourScore: "Your score",
    restart: "Restart",
    selectLanguage: "Select language",
    summaryTableTitle: "Answer Summary",
    summaryQuestion: "Question",
    summaryYourAnswer: "Your Answer",
    summaryCorrectAnswer: "Correct Answer",
    infiniteMode: "Infinite Mode", // New text
    endGame: "End Game", // New text
  },
};

const translations = {
  fr: [
    {
      text: "Quelle est la capitale de la France ?",
      answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
      correct: 1,
      timeLimit: 10,
    },
    {
      text: "Combien font 2 + 3 ?",
      answers: ["3", "4", "5", "1"],
      correct: 2,
      timeLimit: 5,
    },
    {
      text: "Quelle est la capitale de la Belgique ?",
      answers: ["Bruxelles", "Anvers", "Liège", "Namur"],
      correct: 0,
      timeLimit: 10,
    },
    {
      text: "Quelle est la couleur du cheval blanc d'Henry IV ?",
      answers: ["Noir", "Blanc", "Rouge", "Vert", "Blanche"],
      correct: 4,
      timeLimit: 5,
    },
    {
      text: "Quelle est la capitale de la Mongolie ?",
      answers: ["Ulanbator", "Shanghai", "Sainte-Anne", "Omsk"],
      correct: 0,
      timeLimit: 10,
    },
    {
      text: "Quel nombre n'est pas un nombre premier ?",
      answers: ["2", "11", "17", "54"],
      correct: 3,
      timeLimit: 15,
    },
    {
      text: "Comment s'appelle le protagoniste Goa'Uld dans l'équipage SG-1 ?",
      answers: ["Jarod", "Spock", "Teal'c", "Uld'Gald"],
      correct: 2,
      timeLimit: 10,
    },
    {
      text: "Qui est le dernier président de la 3eme république Française ?",
      answers: [
        "Albert Lebrun",
        "René Coty",
        "Félix Faure",
        "François Mitterrand",
      ],
      correct: 0,
      timeLimit: 15,
    },
  ],
  en: [
    {
      text: "What is the capital of France?",
      answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
      correct: 1,
      timeLimit: 10,
    },
    {
      text: "How much is 2 + 3?",
      answers: ["3", "4", "5", "1"],
      correct: 2,
      timeLimit: 5,
    },
    {
      text: "What is the capital of Belgium?",
      answers: ["Brussels", "Antwerp", "Liege", "Namur"],
      correct: 0,
      timeLimit: 10,
    },
    {
      text: "What is the color of the white horse of Henry IV?",
      answers: ["Black", "White", "Red", "Green"],
      correct: 1,
      timeLimit: 5,
    },
    {
      text: "What is the capital of Mongolia?",
      answers: ["Ulan Bator", "Shanghai", "Sainte-Anne", "Omsk"],
      correct: 0,
      timeLimit: 10,
    },
    {
      text: "What is not a prime number?",
      answers: ["2", "11", "17", "54"],
      correct: 3,
      timeLimit: 15,
    },
    {
      text: "What is the name of the protagonist Goa'Uld in the SG-1 fleet?",
      answers: ["Jarod", "Spock", "Teal'c", "Uld'Gald"],
      correct: 2,
      timeLimit: 10,
    },
    {
      text: "Who is the last French president of the 3rd Republic?",
      answers: [
        "Albert Lebrun",
        "René Coty",
        "Félix Faure",
        "François Mitterrand",
      ],
      correct: 0,
      timeLimit: 15,
    },
  ],
};

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;
let answeredQuestionsSummary = [];
let isInfiniteMode = false; // Nouvelle variable d'état pour le mode infini

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreIntroLabel = getElement("#best-score-intro-label");
const bestScoreIntro = getElement("#best-score-intro");

const bestScoreEndLabel = getElement("#best-score-end-label");
const bestScoreEnd = getElement("#best-score-end");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");
const infiniteModeBtn = getElement("#infinite-mode-btn"); // Nouveau bouton

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");
const timerDiv = getElement("#timer-div"); // Référence au conteneur du timer

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

const summaryTableContainer = getElement("#summary-table-container");

// Init
startBtn.addEventListener("click", () => startQuiz(false)); // Mode normal
infiniteModeBtn.addEventListener("click", () => startQuiz(true)); // Mode infini
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

setText(bestScoreIntro, bestScore);
setText(bestScoreEnd, bestScore);

const languageSelect = getElement("#language-select");
languageSelect.addEventListener("change", () => {
  applyTranslations(languageSelect.value);
});

applyTranslations(languageSelect.value);

function applyTranslations(lang) {
  const t = uiText[lang] || uiText["fr"];

  document.title = t.title;
  setText(getElement("h1"), t.title);
  setText(getElement(".notice"), t.introNotice);
  getElement("label[for='language-select']").textContent = t.selectLanguage;
  setText(startBtn, t.start);
  setText(nextBtn, t.next);
  setText(restartBtn, t.restart);
  setText(infiniteModeBtn, t.infiniteMode); // Traduction du bouton mode infini
  setText(getElement("#result-screen h2"), t.resultTitle);
  setText(scoreText, "");

  const timerLabel = getElement("#timer-div label");
  if (timerLabel) timerLabel.textContent = `${t.timeLeft} :`;

  bestScoreIntroLabel.textContent = t.bestScore + " : ";
  bestScoreEndLabel.textContent = t.bestScore + " : ";

  // Met à jour les scores affichés
  setText(bestScoreIntro, bestScore);
  setText(bestScoreEnd, bestScore);
}

export function sortQuestionsByTimeLimit(questions) {
  return questions.sort((a, b) => a.timeLimit - b.timeLimit);
}

export function randomizeQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function startQuiz(isInfinite) {
  isInfiniteMode = isInfinite; // Définit le mode de jeu
  const selectedLang = languageSelect.value;

  applyTranslations(selectedLang);
  questions = translations[selectedLang] || translations["fr"];

  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;
  answeredQuestionsSummary = [];

  randomizeQuestions();

  if(!isInfiniteMode){
    sortQuestionsByTimeLimit(questions);
  }
  
  totalQuestionsSpan.textContent = questions.length;

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  setText(questionText, q.text);
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  nextBtn.classList.add("hidden");

  if (isInfiniteMode) {
    hideElement(timerDiv);
    const existingEndGameBtn = getElement("#end-game-btn");
    if (!existingEndGameBtn) {
      const endGameBtn = createEndGameButton(
        uiText[languageSelect.value].endGame,
        endQuiz
      );
      answersDiv.after(endGameBtn);
    } else {
      showElement(existingEndGameBtn);
    }
  } else {
    showElement(timerDiv);
    const existingEndGameBtn = getElement("#end-game-btn");
    if (existingEndGameBtn) {
      hideElement(existingEndGameBtn);
    }

    timeLeftSpan.textContent = q.timeLimit;
    timerId = startTimer(
      q.timeLimit,
      (timeLeft) => setText(timeLeftSpan, timeLeft),
      () => {
        const q = questions[currentQuestionIndex];
        answeredQuestionsSummary.push({
          question: q.text,
          yourAnswer: uiText[languageSelect.value].timeLeft + " : 0s",
          correctAnswer: q.answers[q.correct],
          isCorrect: false,
        });
        lockAnswers(answersDiv);
        markCorrectAnswer(answersDiv, q.correct);
        nextBtn.classList.remove("hidden");
      }
    );
  }
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  const isCorrect = index === q.correct;
  if (isCorrect) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  answeredQuestionsSummary.push({
    question: q.text,
    yourAnswer: q.answers[index],
    correctAnswer: q.answers[q.correct],
    isCorrect: isCorrect,
  });

  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");

  if (isInfiniteMode) {
    const existingEndGameBtn = getElement("#end-game-btn");
    if (existingEndGameBtn) {
      hideElement(existingEndGameBtn);
    }
  }
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(timerId);

  hideElement(questionScreen);
  showElement(resultScreen);

  const selectedLang = languageSelect.value;
  const t = uiText[selectedLang] || uiText["fr"];

  updateScoreDisplay(scoreText, score, questions.length, selectedLang);

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }

  setText(bestScoreEnd, bestScore);
  setText(bestScoreIntro, bestScore);

  const bestScoreLabel = t.bestScore;
  bestScoreEndLabel.textContent = bestScoreLabel + " : ";
  bestScoreIntroLabel.textContent = bestScoreLabel + " : ";

  const existingEndGameBtn = getElement("#end-game-btn");
  if (existingEndGameBtn) {
    existingEndGameBtn.remove();
  }

  const summaryTable = createSummaryTable(
    answeredQuestionsSummary,
    t.summaryTableTitle,
    t.summaryQuestion,
    t.summaryYourAnswer,
    t.summaryCorrectAnswer
  );
  summaryTableContainer.innerHTML = "";
  summaryTableContainer.appendChild(summaryTable);
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  setText(bestScoreIntro, bestScore);

  const selectedLang = languageSelect.value;
  const bestScoreLabel = uiText[selectedLang]?.bestScore || "Meilleur score";
  bestScoreIntroLabel.textContent = bestScoreLabel + " : ";
  summaryTableContainer.innerHTML = "";

  const existingEndGameBtn = getElement("#end-game-btn");
  if (existingEndGameBtn) {
    existingEndGameBtn.remove();
  }
}