document.addEventListener("DOMContentLoaded", loadQuiz);

let questions = [];
let userAnswers = {};

async function loadQuiz() {
    const response = await fetch('questions.json');
    questions = await response.json();

    document.getElementById('question-count').textContent = `Questions: ${questions.length}`;

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = questions.map((q, index) => createQuestionHTML(q, index)).join('');
}

function createQuestionHTML(question, index) {
    const optionsHTML = question.options.map(option => `
        <button class="option-button" onclick="selectAnswer(${index}, '${option}', this)">
            ${option}
        </button>
    `).join('');

    return `
        <div class="question-card" id="question-${index}">
            <h3 class="question-title">${index + 1}. ${question.question}</h3>
            <div class="options-container">
                ${optionsHTML}
            </div>
            <div class="feedback"></div> <!-- Feedback will go here -->
        </div>
    `;
}

function selectAnswer(questionIndex, answer, button) {
    // Save user answer
    userAnswers[questionIndex] = answer;

    // Clear selected state on all options for this question
    const optionButtons = button.parentNode.querySelectorAll('.option-button');
    optionButtons.forEach(btn => btn.classList.remove('selected'));

    // Set selected state on the clicked button
    button.classList.add('selected');
}

function submitQuiz() {
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const feedbackContainer = document.getElementById(`question-${index}`).querySelector('.feedback');

        if (userAnswer === undefined) {
            // User did not answer this question
            incorrectCount++;
            feedbackContainer.textContent = `Unanswered! Correct answer: ${q.answer}`;
            feedbackContainer.className = 'feedback incorrect';
        } else if (userAnswer === q.answer) {
            // Correct answer
            correctCount++;
            feedbackContainer.textContent = 'Correct!';
            feedbackContainer.className = 'feedback correct';
        } else {
            // Incorrect answer
            incorrectCount++;
            feedbackContainer.textContent = `Incorrect! Correct answer: ${q.answer}`;
            feedbackContainer.className = 'feedback incorrect';
        }
    });

    // Update summary
    document.getElementById('summary').textContent = `Correct: ${correctCount} | Incorrect: ${incorrectCount}`;
}
