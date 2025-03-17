const quizContainer = document.getElementById("quiz-container");
const levelHeader = document.getElementById("level");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const checkAnswerButton = document.getElementById("check-answer");
const resultContainer = document.getElementById("result-container");
const multiplierDisplay = document.getElementById("multiplier-display");
const scoreDisplay = document.getElementById("score-display");
const streakFeedbackElement = document.getElementById("streakFeedback");
const quizImage = document.getElementById("quiz-image");

let currentLevel = 1;
let currentQuestionIndex = 0;
let correctAnswers = 0;
let questions = [];
let selectedAnswerIndex = null;
let streakCount = 0;
let multiplier = 1;
let score = 0;

// Fetch quiz data from the API
async function fetchQuizData(level) {
    try {
        const response = await fetch(
            `https://corsproxy.io/?https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=${level}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        questions = data.test.question;
        loadQuestion();
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        quizContainer.innerHTML = `<p class="error">Failed to load quiz data. Please try again later.</p>`;
    }
}

// Load the current question
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = `Q.${currentQuestionIndex + 1}) ${currentQuestion.question}`;

    // Reset the image to default
    quizImage.src = "image folder/default-image.png";
    quizImage.classList.remove("correct", "incorrect");

    answersContainer.innerHTML = "";
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.textContent = answer;
        button.className = "answer";
        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    checkAnswerButton.disabled = true;
    selectedAnswerIndex = null;
}

// Handle answer selection
function selectAnswer(index) {
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach((button, i) => {
        button.classList.toggle("selected", i === index);
    });
    selectedAnswerIndex = index;
    checkAnswerButton.disabled = false;
}

// Update streak feedback
function updateStreakFeedback() {
    if (streakCount >= 5) {
        streakFeedbackElement.textContent = `🔥 Streak ${streakCount}! 2x Multiplier Active!`;
        streakFeedbackElement.style.display = "block";
        streakFeedbackElement.classList.add("multiplier-active");
    } else {
        streakFeedbackElement.style.display = "none";
        streakFeedbackElement.classList.remove("multiplier-active");
    }
}

// Update score based on correctness
function updateScore(isCorrect) {
    if (isCorrect) {
        correctAnswers++;
        streakCount++;
        score += 1 * multiplier;

        if (streakCount >= 5) {
            multiplier = 2;
        }
    } else {
        streakCount = 0;
        multiplier = 1;
    }

    multiplierDisplay.textContent = `Multiplier: ${multiplier}x`;
    scoreDisplay.textContent = `Score: ${score}`;
    updateStreakFeedback();
}

// Check the selected answer
checkAnswerButton.addEventListener("click", () => {
    if (selectedAnswerIndex === null) return;

    const correctIndex = questions[currentQuestionIndex].test_answer;
    const buttons = document.querySelectorAll(".answer");

    buttons.forEach((button, index) => {
        if (index === correctIndex) button.classList.add("correct");
        if (index === selectedAnswerIndex && index !== correctIndex) {
            button.classList.add("incorrect");
        }
    });

    const isCorrect = selectedAnswerIndex === correctIndex;
    updateScore(isCorrect);
    buttons.forEach(button => button.disabled = true);

    // Change the image based on the answer
    if (isCorrect) {
        quizImage.src = "image folder/correct.jpg";
        quizImage.classList.add("correct");
    } else {
        quizImage.src = "image folder/incorrect.jpg";
        quizImage.classList.add("incorrect");
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            displayResult();
        }
    }, 350);
});

// Display the final result
function displayResult() {
    const percentage = (correctAnswers / questions.length) * 100;
    let insightMessage = "";

    if (percentage < 44) insightMessage = "Keep practicing! 💪";
    else if (percentage < 77) insightMessage = "Good job! 🚀";
    else insightMessage = "Perfect! 🎉";

    quizContainer.innerHTML = `
        <h1>${insightMessage}</h1>
        <p style="margin: 20px 0">You got ${correctAnswers} out of ${questions.length} correct!</p>
        <p style="color: ${streakCount >= 5 ? '#FF9800' : '#4CAF50'}; font-weight: bold">
            ${streakCount >= 5 ? '2x Multiplier Applied! ' : ''}Final Score: ${score}
        </p>
        <div style="margin-top: 30px">
            <button onclick="window.location.href='levelSection.html'" class="btn">Home</button>
            <button onclick="nextLevel()" class="btn">Next Level</button>
        </div>
    `;
}

// Move to the next level
function nextLevel() {
    currentLevel++;
    window.location.href = `quiz.html?level=${currentLevel}`;
}

// Initialize the quiz based on the level in the URL
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get('level');
if (level) {
    levelHeader.textContent = `Level ${level}`;
    currentLevel = parseInt(level);
    fetchQuizData(level);
} else {
    quizContainer.innerHTML = `<p class="error">No level specified.</p>`;
}