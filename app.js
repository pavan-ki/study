let isNavOpen = false;

document.addEventListener("DOMContentLoaded", () => {
    populateMenu();
    loadQuiz("Chapter 01 - INTRODUCTION TO MOTOR INSURANCE/Easy.json", "Chapter 01 - INTRODUCTION TO MOTOR INSURANCE", "Easy");
});

// Toggle Hamburger Menu
function toggleNav() {
    const sidenav = document.getElementById("mySidenav");
    if (!isNavOpen) {
        sidenav.classList.add("open");
    } else {
        sidenav.classList.remove("open");
    }
    isNavOpen = !isNavOpen;
}

let questions = [];
let userAnswers = {};
let selectedChapter = "Chapter 01 - INTRODUCTION TO MOTOR INSURANCE/Easy.json"; // Track the currently selected chapter
let selectedMockTest = "Easy"; // Track the currently selected mock test

// Populate Menu with Chapters and Quizzes
function populateMenu() {
    const chapters = {
        "Chapter 01 - INTRODUCTION TO MOTOR INSURANCE": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 02 - MARKETING IN MOTOR INSURANCE": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 03 - TYPE OF MOTOR VEHICLES, DOCUMENTS AND POLICIES": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 04 - UNDERWRITING IN MOTOR INSURANCE": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 05 - MOTOR INSURANCE CLAIMS": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 06 - IT APPLICATIONS IN MOTOR INSURANCE": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 07 - CONSUMER DELIGHT": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 08 - THIRD PARTY LIABILITY INSURANCE": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 09 - PROCEDURES FOR FILING AND DEFENDING": ["Easy.json", "Medium.json", "Hard.json"],
        "Chapter 10 - QUANTUM FIXATION": ["Easy.json", "Medium.json", "Hard.json"]  
    };

    const sidenav = document.getElementById("mySidenav");
    Object.keys(chapters).forEach((chapter, index) => {
        // Chapter heading
        const chapterHeading = document.createElement("h3");
        chapterHeading.textContent = chapter;
        chapterHeading.onclick = () => chapterHeading.classList.toggle("expanded");

        // Quiz links container
        const quizLinksContainer = document.createElement("div");
        quizLinksContainer.className = "quiz-links";
        chapters[chapter].forEach(test => {
            const testLink = document.createElement("a");
            testLink.textContent = test.replace(".json", "");
            testLink.onclick = () => loadQuiz(`${chapter}/${test}`, chapter, test.replace(".json", ""));
            quizLinksContainer.appendChild(testLink);
        });

        sidenav.appendChild(chapterHeading);
        sidenav.appendChild(quizLinksContainer);
    });
}

// Toggle chapter expansion and collapse other chapters
function toggleChapter(chapter, chapterHeading) {
    const allChapters = document.querySelectorAll("#mySidenav h3");
    const allQuizLinks = document.querySelectorAll(".quiz-links");

    // Collapse all chapters and hide all quiz links
    allChapters.forEach(h => h.classList.remove("expanded"));
    allQuizLinks.forEach(ql => ql.style.display = "none");

    // Expand the clicked chapter and show its quizzes
    chapterHeading.classList.add("expanded");
    chapterHeading.nextElementSibling.style.display = "block";
}

// Load Quiz
async function loadQuiz(filePath, chapterName, testName) {
    try {
        const response = await fetch(filePath);
        questions = await response.json();

        // Reset UI for a new quiz
        userAnswers = {};
        document.getElementById('question-count').textContent = `Questions: ${questions.length}`;
        document.getElementById('quiz-container').innerHTML = questions.map((q, index) => createQuestionHTML(q, index)).join('');
        document.getElementById('summary').textContent = '';
        document.getElementById('result-container').textContent = '';

        // Update the chapter and mock test name in the header
        updateQuizHeader(chapterName, mockTestName);

        // Update selected state in the menu
        updateSelectedMockTest(chapterName, mockTestName);
    } catch (error) {
        console.error("Error loading quiz:", error);
        alert("Quiz file not found.");
    }
}

// Update the <h3> below the <h2> with the selected chapter and mock test names
function updateQuizHeader(chapterName, mockTestName) {
    let header = document.getElementById("quiz-header");
    if (!header) {
        header = document.createElement("h3");
        header.id = "quiz-header";
        document.querySelector("h2").insertAdjacentElement("afterend", header);
    }
    header.textContent = `${chapterName} - ${mockTestName}`;
}

// Highlight the selected mock test in the menu and expand its chapter
function updateSelectedMockTest(chapterName, mockTestName) {
    const allChapters = document.querySelectorAll("#mySidenav h3");
    const allQuizLinks = document.querySelectorAll(".quiz-link");

    // Clear existing highlights and collapse all chapters
    allQuizLinks.forEach(link => link.classList.remove("selected"));
    allChapters.forEach(h => h.classList.remove("expanded"));
    document.querySelectorAll(".quiz-links").forEach(ql => ql.style.display = "none");

    // Expand the correct chapter
    const chapterHeading = Array.from(allChapters).find(h => h.textContent === chapterName);
    if (chapterHeading) {
        chapterHeading.classList.add("expanded");
        chapterHeading.nextElementSibling.style.display = "block";
    }

    // Highlight the selected mock test link
    const mockTestLink = Array.from(allQuizLinks).find(link => link.textContent === mockTestName);
    if (mockTestLink) {
        mockTestLink.classList.add("selected");
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
