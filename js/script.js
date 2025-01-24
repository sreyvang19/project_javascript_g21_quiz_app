// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwNHYYkZrJ5w03m_9qGmZCcbu63IdY4FE",
  authDomain: "quiz-app-2c563.firebaseapp.com",
  databaseURL: "https://quiz-app-2c563-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quiz-app-2c563",
  storageBucket: "quiz-app-2c563.appspot.com",
  messagingSenderId: "422744983984",
  appId: "1:422744983984:web:3b98e45f37a18b3f73ae75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Variables to store quiz state
let selectedCategory = "";
let currentQuestion = 0;
let score = 0;
let questions = [];

// DOM elements
const welcomePage = document.getElementById("welcome-page");
const quizPage = document.getElementById("quiz-page");
const questionEl = document.getElementById("question");
const optionsEl = document.querySelectorAll(".option");
const scoreContainer = document.getElementById("score-container");
const scoreEl = document.getElementById("score");

const welcomeModal = document.getElementById("welcome-modal");
const startQuizBtn = document.getElementById("start-quiz-btn");

// Timer elements
let timer;
const timerEl = document.createElement('div');
timerEl.id = 'timer';
document.querySelector('.quiz-header').insertBefore(timerEl, questionEl);

const questionCountEl = document.createElement('div');
questionCountEl.id = 'question-count';
document.querySelector('.quiz-header').insertBefore(questionCountEl, questionEl);

// On window load, display welcome modal and check for stored score
window.onload = () => {
  welcomeModal.style.display = "block";
  welcomePage.style.display = "none";
  const storedScore = localStorage.getItem('quizScore');
  if (storedScore !== null) {
    scoreEl.textContent = storedScore;
    scoreContainer.style.display = "block";
  }
};

// Start quiz button click event
startQuizBtn.onclick = () => {
  welcomeModal.style.display = "none";
  welcomePage.style.display = "block";
};

// Category selection and question loading
document.querySelectorAll(".play-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedCategory = btn.dataset.category;
    fetch('questions.json')
      .then(response => response.json())
      .then(data => {
        questions = data[selectedCategory];
        welcomePage.style.display = "none";
        quizPage.style.display = "block";
        loadQuestion();
      })
      .catch(error => console.error('Error loading questions:', error));
  });
});

// Start timer for each question
function startTimer(duration, callback) {
  let timeRemaining = duration;
  timerEl.style.width = '100%';
  timerEl.classList.remove('low-time');
  timer = setInterval(() => {
    timeRemaining--;
    timerEl.style.width = `${(timeRemaining / duration) * 100}%`;
    if (timeRemaining <= 5) {
      timerEl.classList.add('low-time'); // Add class when time is low
    }
    if (timeRemaining <= 0) {
      clearInterval(timer);
      callback();
    }
  }, 1000);
}

