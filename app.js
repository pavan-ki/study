document.addEventListener("DOMContentLoaded", loadQuiz);

let questions = [];
let userAnswers = {};

async function loadQuiz() {
    // Fetch questions from JSON file
    const response = await fetch('questions.json');
    questions = await response.json();

    // Display questions
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = questions.map((q, index) => createQuestionHTML(q, index)).join('');
}

function createQuestionHTML(question, index) {
    // Generate HTML for each question and options with radio buttons
    const optionsHTML = question.options.map((option, i) => `
        <label>
            <input type="radio" name="question${index}" value="${i}" onclick="recordAnswer(${index}, ${i})">
            ${option}
        </label><br>
    `).join('');

    return `
        <div class="question">
            <h3>${question.question}</h3>
            ${optionsHTML}
            <div id="feedback${index}" class="feedback"></div>
        </div>
    `;
}

function recordAnswer(questionIndex, selectedIndex) {
    // Save user answer by option index
    userAnswers[questionIndex] = selectedIndex;
}

function submitQuiz() {
    // Evaluate answers and display results below each question
    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const feedbackContainer = document.getElementById(`feedback${index}`);

        if (userAnswer === q.correctIndex) {
            // Correct answer
            feedbackContainer.innerHTML = `<p style="color: green;">Correct!</p>`;
        } else {
            // Wrong answer, show correct answer
            feedbackContainer.innerHTML = `
                <p style="color: red;">Incorrect. The correct answer is: <strong>${q.options[q.correctIndex]}</strong></p>
            `;
        }
    });
    
    // Optionally, disable further selections after submission
    disableOptions();
}

function disableOptions() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => input.disabled = true);
}
