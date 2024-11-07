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
            <div class="feedback" style="padding-top: 10px; font-weight: bold;"></div>
        </div>
    `;
}

function selectAnswer(questionIndex, answer, button) {
    userAnswers[questionIndex] = answer;

    const optionButtons = button.parentNode.querySelectorAll('.option-button');
    optionButtons.forEach(btn => btn.classList.remove('selected'));

    button.classList.add('selected');
}

function submitQuiz() {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const feedbackContainer = document.getElementById(`question-${index}`).querySelector('.feedback');

        if (userAnswer === undefined) {
            unansweredCount++;
            feedbackContainer.textContent = 'Unanswered';
            feedbackContainer.style.color = 'orange';
        } else if (userAnswer === q.answer) {
            correctCount++;
            feedbackContainer.textContent = 'Correct!';
            feedbackContainer.style.color = 'green';
        } else {
            incorrectCount++;
            feedbackContainer.textContent = `Incorrect! The correct answer is: ${q.answer}`;
            feedbackContainer.style.color = 'red';
        }
    });

    document.getElementById('summary').textContent = `Correct: ${correctCount} | Incorrect: ${incorrectCount} | Unanswered: ${unansweredCount}`;
}
