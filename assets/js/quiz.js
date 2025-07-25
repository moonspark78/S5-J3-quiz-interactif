// quiz.js
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
  createEndGameButton,
} from "./dom.js";

import { loadFromLocalStorage, saveToLocalStorage, startTimer } from "./utils.js";

console.log("Quiz JS loaded...");

const uiText = {
  fr: {
    //title: "Quiz Dynamique",
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
    infiniteMode: "Mode Infini",
    endGame: "Terminer la partie",
    darkModeOn: "Activer le mode sombre",
    darkModeOff: "Désactiver le mode sombre",
    audioMode: "Mode Audio", // New translation for Audio Mode button
    audioQuestionText: "Écoutez la question audio et choisissez votre réponse !", // Text for audio questions
    yesJeanPierre: "Oui Jean Pierre", // Translation for special audio question answer
    thisGameIsBad: "Ce jeu est nul", // Translation for special audio question answer
  },
  en: {
    //title: "Dynamic Quiz",
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
    infiniteMode: "Infinite Mode",
    endGame: "End Game",
    darkModeOn: "Enable dark mode",
    darkModeOff: "Disable dark mode",
    audioMode: "Audio Mode", // New translation for Audio Mode button
    audioQuestionText: "Listen to the audio question and choose your answer!", // Text for audio questions
    yesJeanPierre: "Yes Jean Pierre", // Translation for special audio question answer
    thisGameIsBad: "This game is bad", // Translation for special audio question answer
  },
};

const translations = {
  fr: [
    {
      text: "Quelle est la capitale de la France ?",
      answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
      correct: 1,
      timeLimit: 10,
      hint: "C'est la ville où se trouve la tour Eiffel.",
      audio: "./assets/audio/q1.mp3",
    },
    {
      text: "Combien font 2 + 3 ?",
      answers: ["3", "4", "5", "1"],
      correct: 2,
      timeLimit: 5,
      hint: "C'est plus que 4 et moins que 6.",
      audio: "./assets/audio/q2.mp3",
    },
    {
      text: "Quelle est la capitale de la Belgique ?",
      answers: ["Bruxelles", "Anvers", "Liège", "Namur"],
      correct: 0,
      timeLimit: 10,
      hint: "C'est aussi le siège de l'Union européenne.",
      audio: "./assets/audio/q3.mp3",
    },
    {
      text: "Quelle est la couleur du cheval blanc d'Henry IV ?",
      answers: ["Noir", "Blanc", "Rouge", "Vert", "Blanche"],
      correct: 4,
      timeLimit: 5,
      hint: "La réponse est littéralement dans la question.",
      audio: "./assets/audio/q4.mp3",
    },
    {
      text: "Quelle est la capitale de la Mongolie ?",
      answers: ["Ulanbator", "Shanghai", "Sainte-Anne", "Omsk"],
      correct: 0,
      timeLimit: 10,
      hint: "Commence par 'Ulan...'.",
      audio: "./assets/audio/q5.mp3",
    },
    {
      text: "Quel nombre n'est pas un nombre premier ?",
      answers: ["2", "11", "17", "54"],
      correct: 3,
      timeLimit: 15,
      hint: "C'est un nombre pair divisible par 3.",
      audio: "./assets/audio/q6.mp3",
    },
    {
      text: "Comment s'appelle le protagoniste Goa'Uld dans l'équipage SG-1 ?",
      answers: ["Jarod", "Spock", "Teal'c", "Uld'Gald"],
      correct: 2,
      timeLimit: 10,
      hint: "C'est un Jaffa loyal aux humains.",
      audio: "./assets/audio/q7.mp3",
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
      hint: "Il était président juste avant l’occupation allemande.",
      audio: "./assets/audio/q8.mp3",
    },
    // The special audio question (always the last one for audio mode in FR)
    {
      text: "Est-ce que c'est votre dernier mot ?", // This text will be overridden by audioQuestionText during audio playback
      answers: [], // Answers will be dynamically set based on uiText
      correct: 0,
      timeLimit: 15,
      audio: "./assets/audio/special_audio_jpf.mp3",
      isSpecialAudioQuestion: true, // Marker for this special question
    },
  ],
  en: [
    {
      text: "What is the capital of France?",
      answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
      correct: 1,
      timeLimit: 10,
      hint: "It's the city with the Eiffel Tower.",
    },
    {
      text: "How much is 2 + 3?",
      answers: ["3", "4", "5", "1"],
      correct: 2,
      timeLimit: 5,
      hint: "More than 4 and less than 6.",
    },
    {
      text: "What is the capital of Belgium?",
      answers: ["Brussels", "Antwerp", "Liege", "Namur"],
      correct: 0,
      timeLimit: 10,
      hint: "It's also the EU headquarters.",
    },
    {
      text: "What is the color of the white horse of Henry IV?",
      answers: ["Black", "White", "Red", "Green"],
      correct: 1,
      timeLimit: 5,
      hint: "The answer is in the question.",
    },
    {
      text: "What is the capital of Mongolia?",
      answers: ["Ulan Bator", "Shanghai", "Sainte-Anne", "Omsk"],
      correct: 0,
      timeLimit: 10,
      hint: "Starts with 'Ulan...'.",
    },
    {
      text: "What is not a prime number?",
      answers: ["2", "11", "17", "54"],
      correct: 3,
      timeLimit: 15,
      hint: "It's even and divisible by 3.",
    },
    {
      text: "What is the name of the protagonist Goa'Uld in the SG-1 fleet?",
      answers: ["Jarod", "Spock", "Teal'c", "Uld'Gald"],
      correct: 2,
      timeLimit: 10,
      hint: "He's a Jaffa loyal to the humans.",
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
      hint: "He served right before WWII.",
    },
  ],
};


let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;
let answeredQuestionsSummary = [];
let isInfiniteMode = false;
let isAudioMode = false; // New state variable for audio mode

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
const infiniteModeBtn = getElement("#infinite-mode-btn");
const audioModeBtn = getElement("#audio-mode-btn"); // New button for audio mode

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");
const timerDiv = getElement("#timer-div");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

const summaryTableContainer = getElement("#summary-table-container");
const languageSelect = getElement("#language-select");
function updateDarkModeButtonText() {
  const lang = languageSelect.value;
  const isDark = document.body.classList.contains("dark-mode");
  darkModeBtn.textContent = isDark ? uiText[lang].darkModeOff : uiText[lang].darkModeOn;
}

const darkModeBtn = getElement("#dark-mode-btn");

const savedDarkMode = loadFromLocalStorage("darkMode", false);
if (savedDarkMode) {
  document.body.classList.add("dark-mode");
  darkModeBtn.textContent = "Désactiver le mode sombre";
} else {
  darkModeBtn.textContent = "Activer le mode sombre";
}

darkModeBtn.addEventListener("click", () => {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  saveToLocalStorage("darkMode", isDarkMode);
  updateDarkModeButtonText();
});

// Init
startBtn.addEventListener("click", () => startQuiz(false, false)); // Normal mode
infiniteModeBtn.addEventListener("click", () => startQuiz(true, false)); // Infinite mode
audioModeBtn.addEventListener("click", () => startQuiz(false, true)); // Audio mode
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

setText(bestScoreIntro, bestScore);
setText(bestScoreEnd, bestScore);

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}


languageSelect.addEventListener("change", () => {
  applyTranslations(languageSelect.value);
  updateDarkModeButtonText();
  // Show/hide audio mode button based on selected language
  if (languageSelect.value === "fr") {
    showElement(audioModeBtn);
  } else {
    hideElement(audioModeBtn);
  }
});

// Initial application of translations and audio mode button visibility
applyTranslations(languageSelect.value);
if (languageSelect.value === "fr") {
  showElement(audioModeBtn);
} else {
  hideElement(audioModeBtn);
}

function applyTranslations(lang) {
  const t = uiText[lang] || uiText["fr"];

  document.title = t.title;
  setText(getElement(".notice"), t.introNotice);
  getElement("label[for='language-select']").textContent = t.selectLanguage;
  setText(startBtn, t.start);
  setText(nextBtn, t.next);
  setText(restartBtn, t.restart);
  setText(infiniteModeBtn, t.infiniteMode);
  setText(audioModeBtn, t.audioMode); // Translate audio mode button
  setText(getElement("#result-screen h2"), t.resultTitle);
  setText(scoreText, "");

  const timerLabel = getElement("#timer-div label");
  if (timerLabel) timerLabel.textContent = `${t.timeLeft} :`;

  bestScoreIntroLabel.textContent = t.bestScore + " : ";
  bestScoreEndLabel.textContent = t.bestScore + " : ";

  setText(bestScoreIntro, bestScore);
  setText(bestScoreEnd, bestScore);

  const shareButton = getElement("#share-btn");
  if (shareButton) shareButton.textContent = lang === "en" ? "Share" : "Partager";
}

export function sortQuestionsByTimeLimit(questionsArray) {
  // Ensure we are sorting a copy if needed, or modify the original array if that's the intention
  return questionsArray.sort((a, b) => a.timeLimit - b.timeLimit);
}

export function randomizeQuestions(questionsArray) {
  for (let i = questionsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsArray[i], questionsArray[j]] = [questionsArray[j], questionsArray[i]];
  }
}

function startQuiz(isInfinite, isAudio) {
  isInfiniteMode = isInfinite;
  isAudioMode = isAudio;

  const selectedLang = languageSelect.value;
  const t = uiText[selectedLang];

  // Only allow audio mode for French
  if (isAudioMode && selectedLang !== "fr") {
    alert("Audio mode is only available in French."); // Or a more subtle UI feedback
    return;
  }

  applyTranslations(selectedLang);
  // Clone questions to avoid modifying the original array from translations
  questions = [...(translations[selectedLang] || translations["fr"])];

  // Handle the special audio question for FR audio mode
  if (isAudioMode && selectedLang === "fr") {
    // Find the special question by its marker (assuming it's already in the translations.fr array)
    const specialAudioQ = questions.find(q => q.isSpecialAudioQuestion);
    if (specialAudioQ) {
      // Set answers for the special question dynamically based on current language translations
      specialAudioQ.answers = [
        t.yesJeanPierre,
        t.thisGameIsBad,
      ];
      // Ensure the special question is always the last one
      questions = questions.filter(q => !q.isSpecialAudioQuestion); // Remove it from its current position
      questions.push(specialAudioQ); // Add it back at the end
    }
  } else if (!isAudioMode) {
    // If not in audio mode, filter out the special audio question if it somehow made it into the general list
    questions = questions.filter(q => !q.isSpecialAudioQuestion);
  }


  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;
  answeredQuestionsSummary = [];

  // Apply randomization and sorting based on mode
  if (!isAudioMode) { // Normal and Infinite modes (not audio mode)
    randomizeQuestions(questions);
    if (!isInfiniteMode) { // Only sort by time limit for normal mode
      sortQuestionsByTimeLimit(questions);
    }
  } else { // Audio mode: randomize and then sort by timeLimit, except for the last question (special audio)
    // Exclude the last question (special audio) from randomization and sorting if it exists
    let questionsToProcess = [...questions];
    let specialQuestion = null;

    if (isAudioMode && selectedLang === "fr" && questionsToProcess[questionsToProcess.length - 1]?.isSpecialAudioQuestion) {
        specialQuestion = questionsToProcess.pop(); // Remove last question if it's the special one
    }

    randomizeQuestions(questionsToProcess); // Randomize the rest
    sortQuestionsByTimeLimit(questionsToProcess); // Sort the rest by time limit

    if (specialQuestion) {
        questionsToProcess.push(specialQuestion); // Add the special question back at the end
    }
    questions = questionsToProcess; // Update the main questions array
  }


  totalQuestionsSpan.textContent = questions.length;

  showQuestion();
}

function playAudio(audioPath, onEndedCallback) {
  const audio = new Audio(audioPath);
  audio.play();
  audio.onended = onEndedCallback;
}

function showQuestion() {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

  answersDiv.innerHTML = "";
  nextBtn.classList.add("hidden");

    // -- Ajout du bloc indice --
  const existingHint = getElement("#hint-container");
  if (existingHint) existingHint.remove();

  const hintContainer = document.createElement("div");
  hintContainer.id = "hint-container";

  const hintButton = document.createElement("button");
  hintButton.textContent = uiText[languageSelect.value].hint || "🪄 Indice 🪄";
  hintButton.classList.add("hint-btn");

  const hintText = document.createElement("p");
  hintText.classList.add("hint-text");
  hintText.style.display = "none";

  hintButton.addEventListener("click", () => {
    hintText.textContent = q.hint || uiText[languageSelect.value].noHint;
    hintText.style.display = "block";
    hintButton.disabled = true;
  });

  hintContainer.appendChild(hintButton);
  hintContainer.appendChild(hintText);
  questionText.after(hintContainer);
  // -- Fin du bloc indice --

  if (isAudioMode && q.audio) {
    hideElement(timerDiv); // Hide timer while audio plays
    // Display a message indicating audio is playing
    setText(questionText, uiText[languageSelect.value].audioQuestionText);

    playAudio(q.audio, () => {
      setText(questionText, q.text); // Restore original question text after audio
      showElement(timerDiv); // Show timer after audio finishes
      q.answers.forEach((answer, index) => {
        const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
        answersDiv.appendChild(btn);
      });
      // Start timer ONLY after audio finishes
      timeLeftSpan.textContent = q.timeLimit;
      timerId = startTimer(
        q.timeLimit,
        (timeLeft) => setText(timeLeftSpan, timeLeft),
        () => {
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
    });
  }

  if (isInfiniteMode) {
    hideElement(timerDiv);
    const existingEndGameBtn = getElement("#end-game-btn");
    if (!existingEndGameBtn) {
      const endGameBtn = createEndGameButton(
        uiText[languageSelect.value].endGame,
        endQuiz
      );
    // Standard question display logic (for normal and infinite modes, or audio questions without audio files)
    showElement(timerDiv);
    const existingEndGameBtn = getElement("#end-game-btn");
    if (existingEndGameBtn) {
      hideElement(existingEndGameBtn);
    }

    setText(questionText, q.text); // Ensure question text is set for non-audio or audio without audio file
    q.answers.forEach((answer, index) => {
      const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
      answersDiv.appendChild(btn);
    });

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
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  let isCorrect;

  if (q.isSpecialAudioQuestion) {
    // For the special audio question, "Oui Jean Pierre" is correct (index 0)
    isCorrect = index === 0;
  } else {
    isCorrect = index === q.correct;
  }

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

  // Ensure audio mode button is hidden if language is not French
  if (languageSelect.value !== "fr") {
    hideElement(audioModeBtn);
  }
}

const shareBtn = getElement("#share-btn");
if (shareBtn) {
  shareBtn.addEventListener("click", shareScore);
}

function shareScore() {
  const selectedLang = languageSelect.value;
  const baseText = {
    fr: `J'ai obtenu un score de ${score} / ${questions.length} au Quiz Dynamique ! 💡`,
    en: `I scored ${score} / ${questions.length} on the Dynamic Quiz! 💡`,
  };

  const text = encodeURIComponent(baseText[selectedLang] || baseText.fr);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;

  window.open(twitterUrl, "_blank");
}}