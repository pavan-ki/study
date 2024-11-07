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
        <div class="question-card">
            <h3 class="question-title">${index + 1}. ${question.question}</h3>
            <div class="options-container">
                ${optionsHTML}
            </div>
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
    const results = questions.map((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.answer;
        if (isCorrect) correctCount++;
        return { question: q.question, userAnswer, isCorrect };
    });

    const incorrectCount = questions.length - correctCount;
    displayResults(results, correctCount, incorrectCount);
    saveResults(results);
}

function displayResults(results, correctCount, incorrectCount) {
    document.getElementById('summary').textContent = `Correct: ${correctCount} | Incorrect: ${incorrectCount}`;

    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `
        <h2>Results</h2>
        <p>You got ${correctCount} out of ${questions.length} correct.</p>
        <ul>
            ${results.map(r => `
                <li>${r.question} - Your answer: ${r.userAnswer} (${r.isCorrect ? 'Correct' : 'Wrong'})</li>
            `).join('')}
        </ul>
    `;
}

function saveResults(results) {
    const resultsData = JSON.stringify(results, null, 2);

    const blob = new Blob([resultsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.json';
    a.click();
    URL.revokeObjectURL(url);
}
