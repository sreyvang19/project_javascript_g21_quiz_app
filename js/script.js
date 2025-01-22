// Importa the project to firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrF1vElAfDDXoIkxdQxDhhP9QmdBfAAyA",
  authDomain: "quiz-app-55cd4.firebaseapp.com",
  databaseURL: "https://quiz-app-55cd4-default-rtdb.firebaseio.com",
  projectId: "quiz-app-55cd4",
  storageBucket: "quiz-app-55cd4.firebasestorage.app",
  messagingSenderId: "54655464499",
  appId: "1:54655464499:web:f922173db21b1544f21f46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

  const progressBar = document.querySelector(".progress-bar"),
    progressText = document.querySelector(".progress-text");

  // Function to update the progress bar and text
  const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
  };

  const startBtn = document.querySelector(".start"),
    numQuestions = document.querySelector("#num-questions"),
    category = document.querySelector("#category"),
    difficulty = document.querySelector("#difficulty"),
    timePerQuestion = document.querySelector("#time"),
    quiz = document.querySelector(".quiz"),
    startScreen = document.querySelector(".start-screen"),
    warningMessage = document.querySelector(".warning-message");

  // Function to validate the selection of category and difficulty
  const validateSelection = () => {
    if (category.value === "" || difficulty.value === "") {
      startBtn.disabled = true;
      warningMessage.style.display = "block";
    } else {
      startBtn.disabled = false;
      warningMessage.style.display = "none";
    }
  };

  // Event listeners for category and difficulty selection
  category.addEventListener("change", validateSelection);
  difficulty.addEventListener("change", validateSelection);

  let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

  // Function to start the quiz
  const startQuiz = () => {
    if (category.value === "" || difficulty.value === "") {
      warningMessage.style.display = "block";
      return;
    }
    const num = numQuestions.value,
      cat = category.value,
      diff = difficulty.value;
    loadingAnimation();
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        questions = data.results;
        setTimeout(() => {
          startScreen.classList.add("hide");
          quiz.classList.remove("hide");
          currentQuestion = 1;
          showQuestion(questions[0]);
        }, 1000);
      });
  };

  // Event listener for the start button
  startBtn.addEventListener("click", startQuiz);

  // Function to display a question
  const showQuestion = (question) => {
    const questionText = document.querySelector(".question"),
      answersWrapper = document.querySelector(".answer-wrapper"),
      questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = [
      ...question.incorrect_answers,
      question.correct_answer.toString(),
    ];
    answersWrapper.innerHTML = "";
    answers.sort(() => Math.random() - 0.5);
    answers.forEach((answer) => {
      answersWrapper.innerHTML += `
        <div class="answer">
          <span class="text">${answer}</span>
          <span class="checkbox">
            <i class="fas fa-check"></i>
          </span>
        </div>
      `;
    });

    questionNumber.innerHTML = ` Question <span class="current">${
      questions.indexOf(question) + 1
    }</span>
    <span class="total">/${questions.length}</span>`;
    
    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
      answer.addEventListener("click", () => {
        if (!answer.classList.contains("checked")) {
          answersDiv.forEach((answer) => {
            answer.classList.remove("selected");
          });
          answer.classList.add("selected");
          submitBtn.disabled = false;
          console.log("Submit button enabled");
        }
      });
    });

    time = timePerQuestion.value;
    startTimer(time);
  };

  // Function to start the timer
  const startTimer = (time) => {
    timer = setInterval(() => {
      if (time >= 0) {
        progress(time);
        time--;
      } else {
        checkAnswer();
      }
    }, 1000);
  };

  // Function to show loading animation
  const loadingAnimation = () => {
    startBtn.innerHTML = "Loading";
    const loadingInterval = setInterval(() => {
      if (startBtn.innerHTML.length === 10) {
        startBtn.innerHTML = "Loading";
      } else {
        startBtn.innerHTML += ".";
      }
    }, 500);
  };

  const submitBtn = document.querySelector(".submit"),
    nextBtn = document.querySelector(".next");
  // Event listener for the submit button
  submitBtn.addEventListener("click", () => {
    console.log("Submit button clicked");
    checkAnswer();
  });

  // Event listener for the next button
  nextBtn.addEventListener("click", () => {
    console.log("Next button clicked");
    nextQuestion();
    submitBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";
  });

  // Function to check the selected answer
  const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");
    if (selectedAnswer) {
      const answer = selectedAnswer.querySelector(".text").innerHTML;
      console.log("Selected answer:", answer);
      if (answer === questions[currentQuestion - 1].correct_answer) {
        score++;
        selectedAnswer.classList.add("correct");
        console.log("Correct answer");
      } else {
        selectedAnswer.classList.add("wrong");
        console.log("Wrong answer");
        document.querySelectorAll(".answer").forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct");
          }
        });
      }
    } else {
      console.log("No answer selected");
      document.querySelectorAll(".answer").forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
        }
      });
    }
    document.querySelectorAll(".answer").forEach((answer) => {
      answer.classList.add("checked");
    });

    submitBtn.disabled = true;
    nextBtn.disabled = false;
    console.log("Submit button disabled, Next button enabled");
  };

  // Function to display the next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length) {
      currentQuestion++;
      showQuestion(questions[currentQuestion - 1]);
      submitBtn.disabled = true;
      nextBtn.disabled = true;
      console.log("Next question displayed");
    } else {
      showScore();
    }
  };

  const endScreen = document.querySelector(".end-screen"),
    finalScore = document.querySelector(".final-score"),
    totalScore = document.querySelector(".total-score");
  // Function to display the final score
  const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
    console.log("Quiz finished. Final score:", score);
    
    // Save score to Firebase
    const db = getDatabase();
    set(ref(db, 'scores/' + Date.now()), {
      score: score,
      total: questions.length
    });
  };

  const restartBtn = document.querySelector(".restart");
  // Event listener for the restart button
  restartBtn.addEventListener("click", () => {
    window.location.reload();
  });

  const categorySelect = document.getElementById('category');
  const categoryInfoDiv = document.createElement('div');
  categoryInfoDiv.classList.add('category-info');
  categorySelect.parentNode.appendChild(categoryInfoDiv);

  // Event listener for category selection to show additional information
  categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    categoryInfoDiv.textContent = categoryInfo[selectedCategory] || "Select a category to see more information.";
  });

  const timeInfo = {
    "10": "10 seconds: Quick and challenging.",
    "15": "15 seconds: A bit more time to think.",
    "20": "20 seconds: Balanced time for each question.",
    "25": "25 seconds: More time to consider your answers.",
    "30": "30 seconds: Ample time for each question.",
    "60": "60 seconds: Plenty of time to think and answer."
  };

  const timeSelect = document.getElementById('time');
  const timeInfoDiv = document.createElement('div');
  timeInfoDiv.classList.add('time-info');
  timeSelect.parentNode.appendChild(timeInfoDiv);

  // Event listener for time selection to show additional information
  timeSelect.addEventListener('change', () => {
    const selectedTime = timeSelect.value;
    console.log('Selected time:', selectedTime);
    timeInfoDiv.textContent = timeInfo[selectedTime] || "Select a time to see more information.";
  });

  const welcomeWindow = document.querySelector('.welcome-window');
  const welcomeBtn = document.querySelector('.welcome-content .btn');

  // Event listener for the welcome button to show loading animation and hide the welcome window 
  welcomeBtn.addEventListener('click', () => {
    welcomeBtn.innerHTML = "Loading...";
    welcomeBtn.disabled = true;
    setTimeout(() => {
      welcomeWindow.style.display = 'none';
      startScreen.classList.remove('hide');
    }, 1000);
  });

  const startButton = document.querySelector('.btn.start');
  const difficultySelect = document.getElementById('difficulty');

  // Function to check if the start button should be enabled
  function checkStartButton() {
    if (categorySelect.value && difficultySelect.value) {
      startButton.disabled = false;
    } else {
      startButton.disabled = true;
    }
  }

  // Event listeners for category and difficulty selection to enable/disable the start button
  categorySelect.addEventListener('change', checkStartButton);
  difficultySelect.addEventListener('change', checkStartButton);

  const customQuestionText = document.getElementById('custom-question-text');
  const customAnswer1 = document.getElementById('custom-answer-1');
  const customAnswer2 = document.getElementById('custom-answer-2');
  const customAnswer3 = document.getElementById('custom-answer-3');
  const customAnswer4 = document.getElementById('custom-answer-4');
  const correctAnswer = document.getElementById('correct-answer');
  const addQuestionButton = document.querySelector('.add-question');
  const customQuestionsList = document.getElementById('custom-questions-list');
  const startCustomQuizButton = document.querySelector('.start-custom-quiz');

  let customQuestions = [];

  // Event listener for adding a custom question
  addQuestionButton.addEventListener('click', () => {
    const question = customQuestionText.value.trim();
    const answers = [
      customAnswer1.value.trim(),
      customAnswer2.value.trim(),
      customAnswer3.value.trim(),
      customAnswer4.value.trim()
    ];
    const correct = correctAnswer.value;

    if (question && answers.every(answer => answer)) {
      const customQuestion = {
        question,
        answers,
        correct
      };
      customQuestions.push(customQuestion);
      updateCustomQuestionsList();
      clearCustomQuestionForm();
      startCustomQuizButton.disabled = false;
    }
  });

  // Function to update the list of custom questions
  function updateCustomQuestionsList() {
    customQuestionsList.innerHTML = '';
    customQuestions.forEach((q, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${q.question}`;
      customQuestionsList.appendChild(li);
    });
  }

  // Function to clear the custom question form
  function clearCustomQuestionForm() {
    customQuestionText.value = '';
    customAnswer1.value = '';
    customAnswer2.value = '';
    customAnswer3.value = '';
    customAnswer4.value = '';
    correctAnswer.value = '1';
  }

  // Event listener for starting the custom quiz
  startCustomQuizButton.addEventListener('click', () => {
    // Logic to start the custom quiz using customQuestions array
    console.log('Starting custom quiz with questions:', customQuestions);
  });

  const categoryWindow = document.querySelector('.category-window'),
    selectCategoryBtn = document.querySelector('.select-category'),
    categorySelectWindow = document.querySelector('#category-select');

  const showCategoryWindow = () => {
    categoryWindow.classList.remove('hide');
  };

  const hideCategoryWindow = () => {
    categoryWindow.classList.add('hide');
  };

  // Event listener for selecting a category
  selectCategoryBtn.addEventListener('click', () => {
    const selectedCategory = categorySelectWindow.value;
    if (selectedCategory) {
      document.querySelector('#category').value = selectedCategory;
      hideCategoryWindow();
      validateSelection();
    }
  });

  // Event listener for the welcome button to show the category window
  document.querySelector('.welcome-content .btn').addEventListener('click', showCategoryWindow);
