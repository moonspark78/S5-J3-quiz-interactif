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
  ],
};

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;

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

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

// Init
startBtn.addEventListener("click", startQuiz);
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

function startQuiz() {
  const selectedLang = languageSelect.value;

  applyTranslations(selectedLang);
  questions = translations[selectedLang] || translations["fr"];

  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;
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

  timeLeftSpan.textContent = q.timeLimit;
  timerId = startTimer(
    q.timeLimit,
    (timeLeft) => setText(timeLeftSpan, timeLeft),
    () => {
      lockAnswers(answersDiv);
      nextBtn.classList.remove("hidden");
    }
  );
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  if (index === q.correct) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");
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
  hideElement(questionScreen);
  showElement(resultScreen);

  const selectedLang = languageSelect.value;

  updateScoreDisplay(scoreText, score, questions.length, selectedLang);

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }

  setText(bestScoreEnd, bestScore);
  setText(bestScoreIntro, bestScore);

  const bestScoreLabel = uiText[selectedLang]?.bestScore || "Meilleur score";
  bestScoreEndLabel.textContent = bestScoreLabel + " : ";
  bestScoreIntroLabel.textContent = bestScoreLabel + " : ";
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  setText(bestScoreIntro, bestScore);

  const selectedLang = languageSelect.value;
  const bestScoreLabel = uiText[selectedLang]?.bestScore || "Meilleur score";
  bestScoreIntroLabel.textContent = bestScoreLabel + " : ";
}
