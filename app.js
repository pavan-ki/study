document.addEventListener("DOMContentLoaded", populateMenu);

let questions = [];
let userAnswers = {};

// Dynamically populate the accordion menu with chapters and quizzes
function populateMenu() {
    const chapters = {
        "Chapter 01": ["Quiz 01.json", "Quiz 02.json"],
        "Chapter 02": ["Quiz 01.json", "Quiz 02.json"],
        "Chapter 03": ["Quiz 01.json", "Quiz 02.json"]
    };

    const sidenav = document.getElementById("mySidenav");
    sidenav.innerHTML = ""; // Clear previous content

    Object.keys(chapters).forEach((chapter, chapterIndex) => {
        // Create chapter heading
        const chapterHeading = document.createElement("h3");
        chapterHeading.textContent = chapter;
        chapterHeading.className = chapterIndex === 0 ? "expanded" : ""; // Expand first chapter by default
        chapterHeading.onclick = () => chapterHeading.classList.toggle("expanded");

        // Create quiz links container
        const quizLinksContainer = document.createElement("div");
        quizLinksContainer.className = "quiz-links";

        chapters[chapter].forEach(quiz => {
            const quizLink = document.createElement("a");
            quizLink.textContent = quiz.replace(".json", ""); // Display name without .json
            quizLink.onclick = () => loadQuiz(`${chapter}/${quiz}`);
            quizLinksContainer.appendChild(quizLink);
        });

        sidenav.appendChild(chapterHeading);
        sidenav.appendChild(quizLinksContainer);
    });
}

// Load quiz from a specific chapter and quiz file
async function loadQuiz(filePath) {
    try {
        const response = await fetch(filePath);
        questions = await response.json();

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

// Other functions remain the same...
