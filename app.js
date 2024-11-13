document.addEventListener("DOMContentLoaded", () => {
    populateMenu();
    // Load the first mock test from Chapter 01 by default
    loadQuiz("Chapter 01/Mock Test 1.json");
});

let questions = [];
let userAnswers = {};

// Dynamically populate the accordion menu with chapters and mock tests
function populateMenu() {
    const chapters = {
        "Chapter 01": ["Mock Test 1.json", "Mock Test 2.json"],
        "Chapter 02": ["Mock Test 1.json", "Mock Test 2.json"],
        "Chapter 03": ["Mock Test 1.json", "Mock Test 2.json"]
    };

    const sidenav = document.getElementById("mySidenav");
    sidenav.innerHTML = ""; // Clear previous content

    Object.keys(chapters).forEach((chapter, chapterIndex) => {
        // Create chapter heading
        const chapterHeading = document.createElement("h3");
        chapterHeading.textContent = chapter;
        chapterHeading.className = chapterIndex === 0 ? "expanded" : ""; // Expand first chapter by default
        chapterHeading.onclick = () => chapterHeading.classList.toggle("expanded");

        // Create mock test links container
        const quizLinksContainer = document.createElement("div");
        quizLinksContainer.className = "quiz-links";

        chapters[chapter].forEach(mockTest => {
            const quizLink = document.createElement("a");
            quizLink.textContent = mockTest.replace(".json", ""); // Display name without .json
            quizLink.onclick = () => loadQuiz(encodeURIComponent(`${chapter}/${mockTest}`));
            quizLinksContainer.appendChild(quizLink);
        });

        sidenav.appendChild(chapterHeading);
        sidenav.appendChild(quizLinksContainer);
    });
}

// Load quiz from a specific chapter and mock test file
async function loadQuiz(filePath) {
    try {
        const response = await fetch(filePath);
        questions = await response.json();

        // Reset UI for a new quiz
        userAnswers = {};
        document.getElementById('question-count').textContent = `Questions: ${questions.length}`;
        document.getElementById('quiz-container').innerHTML = questions.map((q, index) => createQuestionHTML(q, index)).join('');
        document.getElementById('summary').textContent = '';
        document.getElementById('result-container').textContent = '';
    } catch (error) {
        console.error("Error loading quiz:", error);
        alert("Quiz file not found.");
    }
}

// Generates HTML for each question card
function createQuestionHTML(question, index) {
    const optionsHTML = question.options.map((option, optionIndex) => `
        <button class="option-button" onclick="selectAnswer(${index}, ${optionIndex}, this)">
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

// Track user's selected answers
function selectAnswer(questionIndex, optionIndex, button) {
    userAnswers[questionIndex] = optionIndex;

    // Clear selected state on all options for this question
    const optionButtons = button.parentNode.querySelectorAll('.option-button');
    optionButtons.forEach(btn => btn.classList.remove('selected'));

    // Set selected state on the clicked button
    button.classList.add('selected');
}

// Submit quiz and evaluate results
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
        } else if (userAnswer === q.correctIndex) {
            correctCount++;
            feedbackContainer.textContent = 'Correct!';
            feedbackContainer.style.color = 'green';
        } else {
            incorrectCount++;
            feedbackContainer.textContent = `Incorrect! The correct answer is: ${q.options[q.correctIndex]}`;
            feedbackContainer.style.color = 'red';
        }
    });

    // Update summary
    document.getElementById('summary').textContent = `Correct: ${correctCount} | Incorrect: ${incorrectCount} | Unanswered: ${unansweredCount}`;
}

// Reveal correct answers for all questions
function revealAnswers() {
    questions.forEach((q, index) => {
        const feedbackContainer = document.getElementById(`question-${index}`).querySelector('.feedback');
        feedbackContainer.textContent = `Answer: ${q.options[q.correctIndex]}`;
        feedbackContainer.style.color = '#4caf50'; // Green for correct answers

        // Highlight the correct answer button
        const optionButtons = document.getElementById(`question-${index}`).querySelectorAll('.option-button');
        optionButtons[q.correctIndex].classList.add('highlight');
    });
}
